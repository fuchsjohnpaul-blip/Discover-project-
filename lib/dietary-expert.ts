import { type MealFeedEntry } from "@/lib/meal-query";
import { type DietaryAttributes, type VerificationBadge } from "@/lib/sample-data";

export const dietaryExpertSuggestions = [
  "Show me nut-free dishes near me",
  "Find vegetarian appetizers near me",
  "Show me pescatarian meals near me",
  "Find the safest gluten-free lunch near me",
  "Show me halal seafood options",
  "Find soy-free salads with the strongest safety signals"
] as const;

type DietaryFilter = keyof DietaryAttributes;
type VerificationConstraint = VerificationBadge | "Any Verified";
type MatchMode = "exact" | "fallback" | "broad" | "none";

type ExpertIntent = {
  dietaryFilters: DietaryFilter[];
  verificationConstraint: VerificationConstraint | null;
  keywordTokens: string[];
  nearMe: boolean;
  strictMode: boolean;
};

export type DietaryExpertResponse = {
  summary: string;
  trustBoundary: string;
  caution: string;
  matchMode: MatchMode;
  results: MealFeedEntry[];
  intent: ExpertIntent;
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "around",
  "best",
  "better",
  "current",
  "deep",
  "dishes",
  "dish",
  "expert",
  "find",
  "for",
  "friendly",
  "give",
  "me",
  "meal",
  "meals",
  "near",
  "nearby",
  "now",
  "of",
  "offer",
  "options",
  "or",
  "our",
  "please",
  "safer",
  "safe",
  "safest",
  "search",
  "show",
  "the",
  "this",
  "to",
  "up",
  "with"
]);

const KEYWORD_EXPANSIONS: Array<{ trigger: string; expansions: string[] }> = [
  {
    trigger: "breakfast",
    expansions: ["breakfast", "brunch", "pancakes", "biscuit"]
  },
  {
    trigger: "brunch",
    expansions: ["breakfast", "brunch", "pancakes", "biscuit"]
  },
  {
    trigger: "seafood",
    expansions: ["seafood", "shrimp", "fish", "salmon", "catfish", "tilapia", "tuna"]
  },
  {
    trigger: "barbecue",
    expansions: ["barbecue", "bbq", "brisket", "smoked", "ribs", "pork"]
  },
  {
    trigger: "bbq",
    expansions: ["barbecue", "bbq", "brisket", "smoked", "ribs", "pork"]
  },
  {
    trigger: "burger",
    expansions: ["burger", "cheeseburger", "sandwich"]
  },
  {
    trigger: "salad",
    expansions: ["salad", "greens"]
  },
  {
    trigger: "pasta",
    expansions: ["pasta", "lasagna", "tortellini", "scampi", "spaghetti"]
  },
  {
    trigger: "dessert",
    expansions: ["dessert", "sweet", "baklava", "pudding", "tiramisu"]
  },
  {
    trigger: "taco",
    expansions: ["taco", "nachos", "burrito", "mexican"]
  }
];

export function runDietaryExpertQuery(
  query: string,
  entries: MealFeedEntry[]
): DietaryExpertResponse {
  const intent = parseExpertIntent(query);
  const safetyScopedEntries = entries.filter((entry) =>
    isSafetyScopedMatch(entry, intent)
  );
  const verificationMatches = intent.verificationConstraint
    ? filterByVerificationConstraint(
        safetyScopedEntries,
        intent.verificationConstraint
      )
    : safetyScopedEntries;
  const keywordMatches = intent.keywordTokens.length
    ? filterByKeywords(verificationMatches, intent.keywordTokens)
    : verificationMatches;

  let results = keywordMatches;
  let matchMode: MatchMode = "exact";

  if (results.length === 0 && intent.keywordTokens.length > 0) {
    results = verificationMatches;
    matchMode = "fallback";
  }

  if (results.length === 0 && intent.verificationConstraint) {
    results = safetyScopedEntries;
    matchMode = "fallback";
  }

  if (results.length === 0) {
    results = entries.filter((entry) => entry.menuItem.status === "Verified Safe");
    matchMode = results.length > 0 ? "broad" : "none";
  }

  const sortedResults = sortExpertResults(results, intent).slice(0, 4);

  return {
    summary: buildSummary(sortedResults.length, intent, matchMode),
    trustBoundary:
      "I only search the approved meal records currently stored in this app. I do not infer hidden ingredients or dedicated-kitchen practices beyond the structured data.",
    caution: buildCaution(intent),
    matchMode,
    results: sortedResults,
    intent
  };
}

function parseExpertIntent(query: string): ExpertIntent {
  const normalizedQuery = query.toLowerCase();
  const dietaryFilters = getDietaryFilters(normalizedQuery);
  const verificationConstraint = getVerificationConstraint(normalizedQuery);
  const strictMode =
    normalizedQuery.includes("safe") ||
    normalizedQuery.includes("safest") ||
    normalizedQuery.includes("celiac") ||
    normalizedQuery.includes("strict") ||
    normalizedQuery.includes("safety");

  return {
    dietaryFilters,
    verificationConstraint,
    keywordTokens: getKeywordTokens(normalizedQuery),
    nearMe:
      normalizedQuery.includes("near me") ||
      normalizedQuery.includes("nearby") ||
      normalizedQuery.includes("around me"),
    strictMode
  };
}

function getDietaryFilters(normalizedQuery: string): DietaryFilter[] {
  const filters: DietaryFilter[] = [];

  if (
    normalizedQuery.includes("gluten-free") ||
    normalizedQuery.includes("gluten free") ||
    normalizedQuery.includes("gf") ||
    normalizedQuery.includes("celiac")
  ) {
    filters.push("glutenFree");
  }

  if (
    normalizedQuery.includes("soy-free") ||
    normalizedQuery.includes("soy free")
  ) {
    filters.push("soyFree");
  }

  if (
    normalizedQuery.includes("nut-free") ||
    normalizedQuery.includes("nut free")
  ) {
    filters.push("nutFree");
  }

  if (
    normalizedQuery.includes("vegetarian") ||
    normalizedQuery.includes("veggie")
  ) {
    filters.push("vegetarian");
  }

  if (normalizedQuery.includes("pescatarian")) {
    filters.push("pescatarian");
  }

  if (normalizedQuery.includes("kosher")) {
    filters.push("kosher");
  }

  if (normalizedQuery.includes("halal")) {
    filters.push("halal");
  }

  return filters;
}

function getVerificationConstraint(
  normalizedQuery: string
): VerificationConstraint | null {
  if (normalizedQuery.includes("kitchen certified")) {
    return "Kitchen Certified";
  }

  if (normalizedQuery.includes("user vetted")) {
    return "User Vetted";
  }

  if (
    normalizedQuery.includes("laboratory tested") ||
    normalizedQuery.includes("lab tested")
  ) {
    return "Laboratory Tested";
  }

  if (
    normalizedQuery.includes("verified") ||
    normalizedQuery.includes("certified")
  ) {
    return "Any Verified";
  }

  return null;
}

function getKeywordTokens(normalizedQuery: string) {
  const baseTokens = normalizedQuery
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));

  const expandedTokens = new Set<string>(baseTokens);

  KEYWORD_EXPANSIONS.forEach(({ trigger, expansions }) => {
    if (baseTokens.includes(trigger)) {
      expansions.forEach((expansion) => expandedTokens.add(expansion));
    }
  });

  return Array.from(expandedTokens);
}

function isSafetyScopedMatch(entry: MealFeedEntry, intent: ExpertIntent) {
  if (intent.dietaryFilters.length === 0) {
    return entry.menuItem.status === "Verified Safe";
  }

  return intent.dietaryFilters.every((filter) => {
    if (filter === "glutenFree") {
      return (
        entry.menuItem.dietaryAttributes?.glutenFree === "yes" ||
        entry.menuItem.status === "Verified Safe"
      );
    }

    return entry.menuItem.dietaryAttributes?.[filter] === "yes";
  });
}

function filterByVerificationConstraint(
  entries: MealFeedEntry[],
  verificationConstraint: VerificationConstraint
) {
  if (verificationConstraint === "Any Verified") {
    return entries.filter(
      (entry) => entry.menuItem.verificationBadges.length > 0
    );
  }

  return entries.filter((entry) =>
    entry.menuItem.verificationBadges.includes(verificationConstraint)
  );
}

function filterByKeywords(entries: MealFeedEntry[], keywordTokens: string[]) {
  return entries.filter((entry) => {
    const searchText = [
      entry.restaurantName,
      entry.address,
      entry.menuItem.name,
      ...entry.menuItem.searchTags
    ]
      .join(" ")
      .toLowerCase();

    return keywordTokens.every((keywordToken) => searchText.includes(keywordToken));
  });
}

function sortExpertResults(entries: MealFeedEntry[], intent: ExpertIntent) {
  return [...entries].sort((entryA, entryB) => {
    const safetyBiasA =
      intent.strictMode && entryA.menuItem.safetyLevel === "Celiac-Safer" ? 0 : 1;
    const safetyBiasB =
      intent.strictMode && entryB.menuItem.safetyLevel === "Celiac-Safer" ? 0 : 1;

    if (safetyBiasA !== safetyBiasB) {
      return safetyBiasA - safetyBiasB;
    }

    const certifiedBiasA = entryA.menuItem.verificationBadges.includes(
      "Kitchen Certified"
    )
      ? 0
      : 1;
    const certifiedBiasB = entryB.menuItem.verificationBadges.includes(
      "Kitchen Certified"
    )
      ? 0
      : 1;

    if (certifiedBiasA !== certifiedBiasB) {
      return certifiedBiasA - certifiedBiasB;
    }

    if (entryA.glutenSafetyRating !== entryB.glutenSafetyRating) {
      return entryB.glutenSafetyRating - entryA.glutenSafetyRating;
    }

    if (intent.nearMe && entryA.distanceMiles !== entryB.distanceMiles) {
      return entryA.distanceMiles - entryB.distanceMiles;
    }

    return entryA.menuItem.name.localeCompare(entryB.menuItem.name);
  });
}

function buildSummary(
  resultCount: number,
  intent: ExpertIntent,
  matchMode: MatchMode
) {
  if (matchMode === "none" || resultCount === 0) {
    return "I do not see any approved meals that match that request in the current dataset yet.";
  }

  const dietaryPhrase =
    intent.dietaryFilters.length > 0
      ? `${intent.dietaryFilters
          .map((filter) => humanizeDietaryFilter(filter).toLowerCase())
          .join(", ")} `
      : "";

  if (matchMode === "exact") {
    return `I found ${resultCount} ${dietaryPhrase}meal${
      resultCount === 1 ? "" : "s"
    } and prioritized the strongest current safety signals first.`;
  }

  if (matchMode === "fallback") {
    return `I did not find a perfect exact match, so I widened the search and kept the strongest ${dietaryPhrase}safety-aligned meals first.`;
  }

  return "I widened the search to the strongest approved safer meals currently in the app.";
}

function buildCaution(intent: ExpertIntent) {
  if (intent.dietaryFilters.includes("nutFree")) {
    return "Nut-free here means the stored meal record is tagged as nut-free. It does not prove a dedicated nut-free kitchen or rule out cross-contact.";
  }

  if (intent.dietaryFilters.includes("soyFree")) {
    return "Soy-free here reflects the current structured dish record, but sauces and marinades can change, so strict needs should still be confirmed with the restaurant.";
  }

  if (intent.dietaryFilters.includes("glutenFree")) {
    return "Even for gluten-free matches, shared prep surfaces and fryer cross-contact can still matter, so strict users should confirm kitchen handling.";
  }

  if (intent.dietaryFilters.includes("vegetarian")) {
    return "Vegetarian here is inferred from the stored dish names and tags unless the current meal record states it more directly, so ingredient details should still be confirmed for strict needs.";
  }

  if (intent.dietaryFilters.includes("pescatarian")) {
    return "Pescatarian here is inferred from the current dish names and tags, so it works as a strong browse filter but should still be confirmed if your standards are strict.";
  }

  if (
    intent.dietaryFilters.includes("kosher") ||
    intent.dietaryFilters.includes("halal")
  ) {
    return "Kosher and halal tags here reflect the current dish data only. If observance rules are strict, confirm the restaurant’s preparation standards directly.";
  }

  return "I am ranking these results with a safety-first bias, but the app still only knows the dietary facts stored in the current meal records.";
}

function humanizeDietaryFilter(filter: DietaryFilter) {
  switch (filter) {
    case "glutenFree":
      return "Gluten-Free";
    case "soyFree":
      return "Soy-Free";
    case "nutFree":
      return "Nut-Free";
    case "vegetarian":
      return "Vegetarian";
    case "pescatarian":
      return "Pescatarian";
    case "kosher":
      return "Kosher";
    case "halal":
      return "Halal";
  }
}
