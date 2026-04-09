import {
  type SampleRestaurant,
  type SafetyLevel,
  type VerificationBadge
} from "@/lib/sample-data";

export const feedFilters = [
  "Safe To Start",
  "Use Extra Caution",
  "Kitchen Certified",
  "Mixed Menus",
  "All Meals"
] as const;

export const assistantResultViews = [
  "Top Rated",
  "Speed",
  "Safety Level"
] as const;

export const DEFAULT_ASSISTANT_QUERY =
  "Show me gluten-free pasta options near me with Celiac-safe certification.";

export const assistantSuggestions = [
  {
    label: "Celiac-safe pasta",
    query: DEFAULT_ASSISTANT_QUERY
  },
  {
    label: "Certified barbecue",
    query: "Show me gluten-free barbecue near me with kitchen certified meals."
  },
  {
    label: "Fast taco picks",
    query: "Show me gluten-free tacos near me with user vetted picks."
  }
] as const;

export type FeedFilter = (typeof feedFilters)[number];
export type AssistantResultView = (typeof assistantResultViews)[number];

export type MealFeedEntry = {
  id: string;
  restaurantSlug: string;
  restaurantName: string;
  address: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  distanceMiles: number;
  glutenSafetyCategory: string;
  glutenSafetyRating: number;
  cautionSummary: string;
  detailSummary: string;
  safeItemCount: number;
  menuItemCount: number;
  menuItem: SampleRestaurant["menuItems"][number];
};

export type AssistantQueryIntent = {
  dietaryTag: string | null;
  keyword: QueryKeyword | null;
  constraint: QueryConstraint | null;
  nearMe: boolean;
};

export type AssistantQueryResult = {
  entries: MealFeedEntry[];
  intent: AssistantQueryIntent;
  matchMode: "exact" | "fallback" | "broad";
  summary: string;
};

export type AssistantResultSection = {
  title: string;
  description: string;
  entries: MealFeedEntry[];
};

const keywordCatalog = [
  {
    label: "Pasta",
    tokens: ["pasta", "noodles", "italian"]
  },
  {
    label: "Barbecue",
    tokens: ["barbecue", "bbq", "brisket", "pulled pork", "smoked", "baker"]
  },
  {
    label: "Pizza",
    tokens: ["pizza", "slice", "pepperoni", "flatbread"]
  },
  {
    label: "Tacos",
    tokens: ["taco", "burrito", "nachos", "mexican", "tortilla"]
  },
  {
    label: "Salads",
    tokens: ["salad", "greens"]
  },
  {
    label: "Small Plates",
    tokens: ["appetizer", "small plates", "dates", "shareable"]
  }
] as const;

type QueryConstraint =
  | "Kitchen Certified"
  | "User Vetted"
  | "Laboratory Tested"
  | "Celiac-Safer";

type QueryKeyword = (typeof keywordCatalog)[number]["label"];

const safetyLevelDescriptions: Record<SafetyLevel, string> = {
  "Celiac-Safer":
    "The strongest current starting points when a user wants extra confidence.",
  "Gluten-Friendly":
    "Promising menu items that still deserve practical caution around prep details.",
  "Contains Gluten":
    "Items that the current structured data does not support as gluten-free."
};

export function buildMealFeedEntries(
  restaurants: SampleRestaurant[]
): MealFeedEntry[] {
  return restaurants
    .flatMap((restaurant) => {
      const safeItemCount = restaurant.menuItems.filter(
        (item) => item.status === "Verified Safe"
      ).length;

      return restaurant.menuItems.map((menuItem, index) => ({
        id: `${restaurant.slug}-${index}`,
        restaurantSlug: restaurant.slug,
        restaurantName: restaurant.name,
        address: restaurant.address,
        neighborhood: restaurant.neighborhood,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        distanceMiles: restaurant.distanceMiles,
        glutenSafetyCategory: restaurant.glutenSafetyCategory,
        glutenSafetyRating: restaurant.glutenSafetyRating,
        cautionSummary: restaurant.cautionSummary,
        detailSummary: restaurant.detailSummary,
        safeItemCount,
        menuItemCount: restaurant.menuItems.length,
        menuItem
      }));
    })
    .sort((entryA, entryB) => {
      const scoreA = entryA.menuItem.status === "Verified Safe" ? 0 : 1;
      const scoreB = entryB.menuItem.status === "Verified Safe" ? 0 : 1;

      if (scoreA !== scoreB) {
        return scoreA - scoreB;
      }

      if (entryA.glutenSafetyRating !== entryB.glutenSafetyRating) {
        return entryB.glutenSafetyRating - entryA.glutenSafetyRating;
      }

      if (entryA.distanceMiles !== entryB.distanceMiles) {
        return entryA.distanceMiles - entryB.distanceMiles;
      }

      return entryA.menuItem.name.localeCompare(entryB.menuItem.name);
    });
}

export function matchesFeedFilter(
  entry: MealFeedEntry,
  activeFilter: FeedFilter
) {
  switch (activeFilter) {
    case "Safe To Start":
      return entry.menuItem.status === "Verified Safe";
    case "Use Extra Caution":
      return entry.menuItem.status !== "Verified Safe";
    case "Kitchen Certified":
      return entry.menuItem.verificationBadges.includes("Kitchen Certified");
    case "Mixed Menus":
      return entry.safeItemCount > 0 && entry.safeItemCount < entry.menuItemCount;
    default:
      return true;
  }
}

export function runAssistantQuery(
  query: string,
  entries: MealFeedEntry[]
): AssistantQueryResult {
  const intent = parseAssistantIntent(query);
  const { keyword, constraint } = intent;
  const dietaryMatches = intent.dietaryTag
    ? entries.filter((entry) => entry.menuItem.safetyLevel !== "Contains Gluten")
    : entries;
  const keywordMatches = keyword
    ? dietaryMatches.filter((entry) => matchesKeyword(entry, keyword))
    : dietaryMatches;
  const constrainedMatches = constraint
    ? keywordMatches.filter((entry) => matchesConstraint(entry, constraint))
    : keywordMatches;

  let resolvedEntries = constrainedMatches;
  let matchMode: AssistantQueryResult["matchMode"] = "exact";

  if (resolvedEntries.length === 0 && keyword) {
    const constraintFallback = constraint
      ? dietaryMatches.filter((entry) =>
          matchesConstraint(entry, constraint)
        )
      : dietaryMatches;

    resolvedEntries = constraintFallback.length > 0 ? constraintFallback : dietaryMatches;
    matchMode = "fallback";
  }

  if (resolvedEntries.length === 0 && constraint) {
    resolvedEntries = dietaryMatches.filter(
      (entry) => entry.menuItem.status === "Verified Safe"
    );
    matchMode = "fallback";
  }

  if (resolvedEntries.length === 0) {
    resolvedEntries = entries;
    matchMode = "broad";
  }

  const sortedEntries = sortAssistantEntries(resolvedEntries, intent.nearMe);

  return {
    entries: sortedEntries,
    intent,
    matchMode,
    summary: buildAssistantSummary({
      resultCount: sortedEntries.length,
      intent,
      matchMode
    })
  };
}

export function getAssistantSections(
  entries: MealFeedEntry[],
  view: AssistantResultView
): AssistantResultSection[] {
  if (view === "Top Rated") {
    return [
      {
        title: "Top Rated",
        description:
          "Sorted by gluten-free safety rating first, then by how cleanly the meal fits the current request.",
        entries: [...entries]
          .sort((entryA, entryB) => {
            if (entryA.glutenSafetyRating !== entryB.glutenSafetyRating) {
              return entryB.glutenSafetyRating - entryA.glutenSafetyRating;
            }

            if (entryA.menuItem.status !== entryB.menuItem.status) {
              return entryA.menuItem.status === "Verified Safe" ? -1 : 1;
            }

            return entryA.distanceMiles - entryB.distanceMiles;
          })
          .slice(0, 6)
      }
    ];
  }

  if (view === "Speed") {
    return [
      {
        title: "Fastest Prep",
        description:
          "A quick decision lane that favors meals likely to come out sooner.",
        entries: [...entries]
          .sort((entryA, entryB) => {
            if (entryA.menuItem.prepTimeMinutes !== entryB.menuItem.prepTimeMinutes) {
              return entryA.menuItem.prepTimeMinutes - entryB.menuItem.prepTimeMinutes;
            }

            return entryA.distanceMiles - entryB.distanceMiles;
          })
          .slice(0, 6)
      }
    ];
  }

  return (["Celiac-Safer", "Gluten-Friendly", "Contains Gluten"] as const)
    .map((level) => ({
      title: level,
      description: safetyLevelDescriptions[level],
      entries: entries.filter((entry) => entry.menuItem.safetyLevel === level)
    }))
    .filter((section) => section.entries.length > 0);
}

export function getDirectionsLinks(entry: MealFeedEntry) {
  const destination = `${entry.latitude},${entry.longitude}`;
  const label = encodeURIComponent(entry.restaurantName);

  return {
    google:
      `https://www.google.com/maps/dir/?api=1&destination=${destination}` +
      `&travelmode=driving`,
    apple: `https://maps.apple.com/?daddr=${destination}&q=${label}`
  };
}

function parseAssistantIntent(query: string): AssistantQueryIntent {
  const normalizedQuery = query.toLowerCase();

  return {
    dietaryTag:
      normalizedQuery.includes("gluten-free") ||
      normalizedQuery.includes("gluten free") ||
      normalizedQuery.includes("celiac") ||
      normalizedQuery.includes("gf")
        ? "Gluten-Free"
        : null,
    keyword:
      keywordCatalog.find(({ tokens }) =>
        tokens.some((token) => normalizedQuery.includes(token))
      )?.label ?? null,
    constraint: detectConstraint(normalizedQuery),
    nearMe:
      normalizedQuery.includes("near me") ||
      normalizedQuery.includes("nearby") ||
      normalizedQuery.includes("close to me")
  };
}

function detectConstraint(query: string): QueryConstraint | null {
  if (query.includes("celiac-safe") || query.includes("celiac safe")) {
    return "Celiac-Safer";
  }

  if (query.includes("laboratory tested") || query.includes("lab tested")) {
    return "Laboratory Tested";
  }

  if (query.includes("user vetted") || query.includes("top rated")) {
    return "User Vetted";
  }

  if (
    query.includes("kitchen certified") ||
    query.includes("verified") ||
    query.includes("certified")
  ) {
    return "Kitchen Certified";
  }

  return null;
}

function matchesKeyword(entry: MealFeedEntry, keyword: QueryKeyword) {
  const keywordTokens =
    keywordCatalog.find((candidate) => candidate.label === keyword)?.tokens ?? [];
  const searchableText = [
    entry.menuItem.name,
    entry.restaurantName,
    ...entry.menuItem.searchTags
  ]
    .join(" ")
    .toLowerCase();

  return keywordTokens.some((token) => searchableText.includes(token));
}

function matchesConstraint(entry: MealFeedEntry, constraint: QueryConstraint) {
  if (constraint === "Celiac-Safer") {
    return (
      entry.menuItem.safetyLevel === "Celiac-Safer" &&
      entry.menuItem.verificationBadges.includes("Kitchen Certified")
    );
  }

  return entry.menuItem.verificationBadges.includes(
    constraint as VerificationBadge
  );
}

function sortAssistantEntries(entries: MealFeedEntry[], nearMe: boolean) {
  return [...entries].sort((entryA, entryB) => {
    if (entryA.menuItem.status !== entryB.menuItem.status) {
      return entryA.menuItem.status === "Verified Safe" ? -1 : 1;
    }

    if (nearMe && entryA.distanceMiles !== entryB.distanceMiles) {
      return entryA.distanceMiles - entryB.distanceMiles;
    }

    if (entryA.glutenSafetyRating !== entryB.glutenSafetyRating) {
      return entryB.glutenSafetyRating - entryA.glutenSafetyRating;
    }

    if (entryA.distanceMiles !== entryB.distanceMiles) {
      return entryA.distanceMiles - entryB.distanceMiles;
    }

    return entryA.menuItem.prepTimeMinutes - entryB.menuItem.prepTimeMinutes;
  });
}

function buildAssistantSummary({
  resultCount,
  intent,
  matchMode
}: {
  resultCount: number;
  intent: AssistantQueryIntent;
  matchMode: AssistantQueryResult["matchMode"];
}) {
  const phraseParts = [
    intent.dietaryTag,
    intent.keyword,
    intent.constraint,
    intent.nearMe ? "nearby" : null
  ].filter(Boolean);

  const phrase =
    phraseParts.length > 0 ? phraseParts.join(" + ") : "the current request";

  if (matchMode === "exact") {
    return `I found ${resultCount} meal card${
      resultCount === 1 ? "" : "s"
    } that fit ${phrase}.`;
  }

  if (matchMode === "fallback") {
    return `I could not find an exact match for ${phrase}, so I am showing the closest approved meals with the strongest current safety signals instead.`;
  }

  return "I did not find enough structured matches for the full request yet, so I am showing the strongest approved meals in the current dataset.";
}
