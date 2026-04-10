import {
  type DietaryAttributes,
  type SampleMenuItem,
  type SampleRestaurant,
  type SafetyLevel,
  type VerificationBadge
} from "@/lib/sample-data";

export const DEFAULT_LIVE_SEARCH_QUERY = "Show me gluten-free meals near me";

export const DEFAULT_SEARCH_CENTER = {
  latitude: 33.2098,
  longitude: -87.5692
};

export type SearchLocation = {
  latitude: number;
  longitude: number;
};

export type LiveSearchIntent = {
  rawQuery: string;
  dietaryTag: string | null;
  dietaryFilters: DietaryFilter[];
  keywords: string[];
  certification: "verified" | "user_vetted" | "lab_tested" | null;
  nearMe: boolean;
};

export type LiveSearchResult = {
  id: string;
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceMiles: number;
  rating: number | null;
  userRatingsTotal: number | null;
  priceLevel: number | null;
  businessStatus: string | null;
  types: string[];
  matchedRestaurant: SampleRestaurant | null;
  matchedMenuItems: SampleMenuItem[];
  badges: VerificationBadge[];
  safetyLevel: SafetyLevel | "Live Place";
  matchLabel: string;
  supportingText: string;
};

export type CuratedSearchResponse = {
  matchMode: "exact" | "fallback" | "broad" | "none";
  results: LiveSearchResult[];
};

const keywordGroups = [
  ["pasta", "noodle", "italian"],
  ["pizza", "slice", "flatbread"],
  ["barbecue", "bbq", "brisket", "smoked", "baker"],
  ["taco", "nachos", "burrito", "mexican", "tortilla"],
  ["salad", "greens"],
  ["breakfast", "brunch", "coffee"],
  ["burger", "sandwich"],
  ["dessert", "bakery", "sweet"]
];

type DietaryFilter = keyof DietaryAttributes;

export function parseLiveSearchIntent(query: string): LiveSearchIntent {
  const normalizedQuery = query.toLowerCase();
  const keywords = keywordGroups
    .flatMap((group) =>
      group.filter((keyword) => normalizedQuery.includes(keyword))
    )
    .filter((keyword, index, values) => values.indexOf(keyword) === index);
  const dietaryFilters = getDietaryFilters(normalizedQuery);

  return {
    rawQuery: query.trim() || DEFAULT_LIVE_SEARCH_QUERY,
    dietaryTag:
      dietaryFilters.length > 0
        ? dietaryFilters.map((filter) => humanizeDietaryFilter(filter)).join(", ")
        : null,
    dietaryFilters,
    keywords,
    certification: normalizedQuery.includes("user vetted")
      ? "user_vetted"
      : normalizedQuery.includes("laboratory tested") ||
          normalizedQuery.includes("lab tested")
        ? "lab_tested"
        : normalizedQuery.includes("verified") ||
            normalizedQuery.includes("certified") ||
            normalizedQuery.includes("celiac-safe") ||
            normalizedQuery.includes("celiac safe")
          ? "verified"
          : null,
    nearMe:
      normalizedQuery.includes("near me") ||
      normalizedQuery.includes("nearby") ||
      normalizedQuery.includes("around me")
  };
}

export function buildCuratedSearchResults({
  intent,
  origin,
  curatedRestaurants
}: {
  intent: LiveSearchIntent;
  origin: SearchLocation;
  curatedRestaurants: SampleRestaurant[];
}): CuratedSearchResponse {
  const exactResults = curatedRestaurants
    .map((restaurant) =>
      buildCuratedResult({ restaurant, intent, origin, mode: "exact" })
    )
    .filter((result): result is LiveSearchResult => result !== null);

  if (exactResults.length > 0) {
    return {
      matchMode: "exact",
      results: exactResults
    };
  }

  const fallbackResults = curatedRestaurants
    .map((restaurant) =>
      buildCuratedResult({ restaurant, intent, origin, mode: "fallback" })
    )
    .filter((result): result is LiveSearchResult => result !== null);

  if (fallbackResults.length > 0) {
    return {
      matchMode: "fallback",
      results: fallbackResults
    };
  }

  const broadResults = curatedRestaurants
    .map((restaurant) =>
      buildCuratedResult({ restaurant, intent, origin, mode: "broad" })
    )
    .filter((result): result is LiveSearchResult => result !== null);

  if (broadResults.length > 0) {
    return {
      matchMode: "broad",
      results: broadResults
    };
  }

  return {
    matchMode: "none",
    results: []
  };
}

export function sortLiveSearchResults(results: LiveSearchResult[]) {
  return [...results].sort((resultA, resultB) => {
    const celiacScoreA = resultA.safetyLevel === "Celiac-Safer" ? 0 : 1;
    const celiacScoreB = resultB.safetyLevel === "Celiac-Safer" ? 0 : 1;

    if (celiacScoreA !== celiacScoreB) {
      return celiacScoreA - celiacScoreB;
    }

    const badgeScoreA = resultA.badges.length > 0 ? 0 : 1;
    const badgeScoreB = resultB.badges.length > 0 ? 0 : 1;

    if (badgeScoreA !== badgeScoreB) {
      return badgeScoreA - badgeScoreB;
    }

    if ((resultA.rating ?? 0) !== (resultB.rating ?? 0)) {
      return (resultB.rating ?? 0) - (resultA.rating ?? 0);
    }

    return resultA.distanceMiles - resultB.distanceMiles;
  });
}

export function getDirectionsLinks(result: {
  latitude: number;
  longitude: number;
  name: string;
}) {
  const destination = `${result.latitude},${result.longitude}`;
  const label = encodeURIComponent(result.name);

  return {
    google:
      `https://www.google.com/maps/dir/?api=1&destination=${destination}` +
      `&travelmode=driving`,
    apple: `https://maps.apple.com/?daddr=${destination}&q=${label}`
  };
}

export function buildInfoWindowContent(result: LiveSearchResult) {
  const matchedMeal = result.matchedMenuItems[0]?.name;
  const supportingLine = matchedMeal
    ? `Approved meal match: ${matchedMeal}`
    : result.supportingText;

  return `<div style="padding: 4px 6px; max-width: 240px;">
    <div style="font-weight: 600; margin-bottom: 4px;">${escapeHtml(result.name)}</div>
    <div style="font-size: 12px; color: #75645a; margin-bottom: 4px;">${escapeHtml(result.address)}</div>
    <div style="font-size: 12px; color: #8f1830;">${escapeHtml(supportingLine)}</div>
  </div>`;
}

function buildCuratedResult({
  restaurant,
  intent,
  origin,
  mode
}: {
  restaurant: SampleRestaurant;
  intent: LiveSearchIntent;
  origin: SearchLocation;
  mode: "exact" | "fallback" | "broad";
}): LiveSearchResult | null {
  const matchedMenuItems = findMatchedMenuItems(restaurant, intent, mode);

  if (matchedMenuItems.length === 0) {
    return null;
  }

  const badges = Array.from(
    new Set(matchedMenuItems.flatMap((item) => item.verificationBadges))
  );
  const safetyLevel = matchedMenuItems[0]?.safetyLevel ?? "Gluten-Friendly";
  const matchLabel = getMatchLabel(intent, matchedMenuItems);
  const dietarySummary = intent.dietaryFilters.length
    ? `${matchLabel.toLowerCase()} `
    : "";

  return {
    id: `curated-${restaurant.slug}`,
    placeId: `curated-${restaurant.slug}`,
    name: restaurant.name,
    address: restaurant.address,
    latitude: restaurant.latitude,
    longitude: restaurant.longitude,
    distanceMiles: getDistanceMiles(origin, {
      latitude: restaurant.latitude,
      longitude: restaurant.longitude
    }),
    rating: restaurant.glutenSafetyRating,
    userRatingsTotal: matchedMenuItems.length,
    priceLevel: null,
    businessStatus: "APPROVED",
    types: ["restaurant"],
    matchedRestaurant: restaurant,
    matchedMenuItems,
    badges,
    safetyLevel,
    matchLabel,
    supportingText:
      mode === "exact"
        ? `${matchedMenuItems.length} approved ${dietarySummary}meal match${
            matchedMenuItems.length === 1 ? "" : "es"
          } from the reviewed Tuscaloosa dataset.`
        : mode === "fallback"
          ? `No exact keyword match was available, so this result shows the closest approved ${dietarySummary}meals from our reviewed Tuscaloosa dataset.`
          : `Showing trusted approved ${dietarySummary}meals from the reviewed Tuscaloosa dataset.`
  };
}

function findMatchedMenuItems(
  restaurant: SampleRestaurant,
  intent: LiveSearchIntent,
  mode: "exact" | "fallback" | "broad"
) {
  const matchingDietaryItems = restaurant.menuItems.filter((item) =>
    matchesDietaryFilters(item, intent.dietaryFilters)
  );

  if (matchingDietaryItems.length === 0) {
    return [];
  }

  const keywordMatches =
    intent.keywords.length > 0
      ? matchingDietaryItems.filter((item) => {
          const searchText = [item.name, restaurant.name, ...item.searchTags]
            .join(" ")
            .toLowerCase();

          return intent.keywords.some((keyword) => searchText.includes(keyword));
        })
      : matchingDietaryItems;

  const certifiedMatches = applyCertificationFilter(keywordMatches, intent);

  if (mode === "exact") {
    if (intent.keywords.length > 0 && keywordMatches.length === 0) {
      return [];
    }

    if (intent.certification && certifiedMatches.length === 0) {
      return [];
    }

    return certifiedMatches;
  }

  if (mode === "fallback") {
    const certificationOnlyMatches = applyCertificationFilter(
      matchingDietaryItems,
      intent
    );

    if (certificationOnlyMatches.length > 0) {
      return certificationOnlyMatches;
    }

    if (keywordMatches.length > 0) {
      return keywordMatches;
    }

    return [];
  }

  return matchingDietaryItems;
}

function applyCertificationFilter(
  items: SampleMenuItem[],
  intent: LiveSearchIntent
) {
  if (intent.certification === "verified") {
    return items.filter((item) => item.verificationBadges.length > 0);
  }

  if (intent.certification === "user_vetted") {
    return items.filter((item) =>
      item.verificationBadges.includes("User Vetted")
    );
  }

  if (intent.certification === "lab_tested") {
    return items.filter((item) =>
      item.verificationBadges.includes("Laboratory Tested")
    );
  }

  return items;
}

function getDistanceMiles(origin: SearchLocation, target: SearchLocation) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const latitudeDelta = toRadians(target.latitude - origin.latitude);
  const longitudeDelta = toRadians(target.longitude - origin.longitude);
  const startLatitude = toRadians(origin.latitude);
  const endLatitude = toRadians(target.latitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(startLatitude) *
      Math.cos(endLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return Number(
    (earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1)
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

function matchesDietaryFilters(
  item: SampleMenuItem,
  dietaryFilters: DietaryFilter[]
) {
  if (dietaryFilters.length === 0) {
    return item.status === "Verified Safe";
  }

  return dietaryFilters.every((filter) => {
    if (filter === "glutenFree") {
      return (
        item.dietaryAttributes?.glutenFree === "yes" ||
        item.status === "Verified Safe"
      );
    }

    return item.dietaryAttributes?.[filter] === "yes";
  });
}

function getMatchLabel(
  intent: LiveSearchIntent,
  matchedMenuItems: SampleMenuItem[]
) {
  if (intent.dietaryFilters.length === 0) {
    return matchedMenuItems[0]?.safetyLevel ?? "Approved Match";
  }

  return intent.dietaryFilters
    .map((filter) => humanizeDietaryFilter(filter))
    .join(" + ");
}
