import {
  type SampleMenuItem,
  type SampleRestaurant,
  type SafetyLevel,
  type VerificationBadge
} from "@/lib/sample-data";

export const DEFAULT_LIVE_SEARCH_QUERY = "Gluten-free meal near me";

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
  keywords: string[];
  type: string;
  certification: "verified" | "user_vetted" | "lab_tested" | null;
  nearMe: boolean;
  openNowOnly: boolean;
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
  isOpenNow: boolean | null;
  businessStatus: string | null;
  types: string[];
  matchedRestaurant: SampleRestaurant | null;
  matchedMenuItems: SampleMenuItem[];
  badges: VerificationBadge[];
  safetyLevel: SafetyLevel | "Live Place";
  supportingText: string;
};

export type LiveSearchSource = "google_places" | "curated_fallback";

type RawPlaceResult = {
  id?: string;
  displayName?: string | { text?: string };
  formattedAddress?: string;
  shortFormattedAddress?: string;
  location?:
    | {
        lat: () => number;
        lng: () => number;
      }
    | {
        lat: number;
        lng: number;
      };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: number | string;
  business_status?: string;
  businessStatus?: string;
  types?: string[];
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

export function parseLiveSearchIntent(
  query: string,
  options?: {
    openNowOnly?: boolean;
  }
): LiveSearchIntent {
  const normalizedQuery = query.toLowerCase();
  const keywords = keywordGroups
    .flatMap((group) =>
      group.filter((keyword) => normalizedQuery.includes(keyword))
    )
    .filter((keyword, index, values) => values.indexOf(keyword) === index);

  return {
    rawQuery: query.trim() || DEFAULT_LIVE_SEARCH_QUERY,
    dietaryTag:
      normalizedQuery.includes("gluten-free") ||
      normalizedQuery.includes("gluten free") ||
      normalizedQuery.includes("gf") ||
      normalizedQuery.includes("celiac")
        ? "gluten free"
        : null,
    keywords,
    type: "restaurant",
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
      normalizedQuery.includes("around me"),
    openNowOnly: options?.openNowOnly ?? true
  };
}

export function buildSearchByTextRequests(
  googleMaps: any,
  intent: LiveSearchIntent,
  location: SearchLocation,
  radiusMeters = 6000
) {
  const circleBias = {
    center: {
      lat: location.latitude,
      lng: location.longitude
    },
    radius: radiusMeters
  };

  const baseRequest = {
    fields: [
      "displayName",
      "formattedAddress",
      "location",
      "businessStatus",
      "rating",
      "userRatingCount",
      "priceLevel",
      "types"
    ],
    includedType: intent.type,
    isOpenNow: intent.openNowOnly,
    language: "en-US",
    locationBias: circleBias,
    maxResultCount: 12,
    minRating: 1,
    region: "us",
    useStrictTypeFiltering: false
  };

  const queryCandidates = Array.from(
    new Set(
      [
        buildPrimarySearchQuery(intent),
        buildFallbackSearchQuery(intent),
        buildBroadSearchQuery(intent)
      ].filter((query): query is string => Boolean(query))
    )
  );

  return queryCandidates.map((textQuery, index) => ({
    ...baseRequest,
    locationBias:
      index === 0
        ? circleBias
        : {
            lat: location.latitude,
            lng: location.longitude
          },
    rankPreference:
      googleMaps.places?.SearchByTextRankPreference?.DISTANCE ??
      undefined,
    textQuery
  }));
}

export function normalizePlacesResults({
  places,
  intent,
  origin,
  curatedRestaurants
}: {
  places: RawPlaceResult[];
  intent: LiveSearchIntent;
  origin: SearchLocation;
  curatedRestaurants: SampleRestaurant[];
}): LiveSearchResult[] {
  const normalized = places
    .map((place) => normalizePlaceResult(place, intent, origin, curatedRestaurants))
    .filter((place): place is LiveSearchResult => place !== null);

  if (
    intent.certification === "verified" &&
    normalized.some((place) => place.badges.length > 0)
  ) {
    return normalized.filter((place) => place.badges.length > 0);
  }

  return normalized;
}

export function buildCuratedFallbackResults({
  intent,
  origin,
  curatedRestaurants
}: {
  intent: LiveSearchIntent;
  origin: SearchLocation;
  curatedRestaurants: SampleRestaurant[];
}): LiveSearchResult[] {
  const exactMatches = curatedRestaurants
    .map((restaurant) =>
      buildCuratedFallbackResult({
        restaurant,
        intent,
        origin,
        allowFallbackMeals: false
      })
    )
    .filter((place): place is LiveSearchResult => place !== null);

  if (exactMatches.length > 0) {
    return exactMatches;
  }

  return curatedRestaurants
    .map((restaurant) =>
      buildCuratedFallbackResult({
        restaurant,
        intent,
        origin,
        allowFallbackMeals: true
      })
    )
    .filter((place): place is LiveSearchResult => place !== null);
}

export function sortLiveSearchResults(results: LiveSearchResult[]) {
  return [...results].sort((resultA, resultB) => {
    const verifiedScoreA = resultA.badges.length > 0 ? 0 : 1;
    const verifiedScoreB = resultB.badges.length > 0 ? 0 : 1;

    if (verifiedScoreA !== verifiedScoreB) {
      return verifiedScoreA - verifiedScoreB;
    }

    if (resultA.isOpenNow !== resultB.isOpenNow) {
      return resultA.isOpenNow ? -1 : 1;
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
    ? `Verified meal match: ${matchedMeal}`
    : result.supportingText;

  return `<div style="padding: 4px 6px; max-width: 240px;">
    <div style="font-weight: 600; margin-bottom: 4px;">${escapeHtml(result.name)}</div>
    <div style="font-size: 12px; color: #5b675f; margin-bottom: 4px;">${escapeHtml(result.address)}</div>
    <div style="font-size: 12px; color: #2f5e49;">${escapeHtml(supportingLine)}</div>
  </div>`;
}

function normalizePlaceResult(
  place: RawPlaceResult,
  intent: LiveSearchIntent,
  origin: SearchLocation,
  curatedRestaurants: SampleRestaurant[]
): LiveSearchResult | null {
  const name = getPlaceName(place);
  const placeId = place.id;
  const coordinates = getPlaceCoordinates(place);

  if (!placeId || !name || !coordinates) {
    return null;
  }

  if (
    place.businessStatus === "CLOSED_PERMANENTLY" ||
    place.business_status === "CLOSED_PERMANENTLY"
  ) {
    return null;
  }

  const { latitude, longitude } = coordinates;

  const matchedRestaurant = findCuratedRestaurantMatch(place, curatedRestaurants);
  const matchedMenuItems = matchedRestaurant
    ? findMatchedMenuItems(matchedRestaurant, intent)
    : [];
  const badges = Array.from(
    new Set(matchedMenuItems.flatMap((item) => item.verificationBadges))
  );
  const safetyLevel =
    matchedMenuItems[0]?.safetyLevel ??
    (matchedRestaurant ? "Gluten-Friendly" : "Live Place");

  return {
    id: placeId,
    placeId,
    name,
    address:
      place.formattedAddress ??
      place.shortFormattedAddress ??
      "Address unavailable",
    latitude,
    longitude,
    distanceMiles: getDistanceMiles(origin, { latitude, longitude }),
    rating: place.rating ?? null,
    userRatingsTotal: place.userRatingCount ?? null,
    priceLevel: normalizePriceLevel(place.priceLevel),
    isOpenNow: intent.openNowOnly ? true : null,
    businessStatus: place.businessStatus ?? place.business_status ?? null,
    types: place.types ?? [],
    matchedRestaurant,
    matchedMenuItems,
    badges,
    safetyLevel,
    supportingText:
      matchedMenuItems.length > 0
        ? `${matchedMenuItems.length} curated meal match${
            matchedMenuItems.length === 1 ? "" : "es"
          } available.`
        : intent.certification
          ? "Live place match found, but curated certification data is not available yet."
          : "Live place match found through Google Places."
  };
}

function findCuratedRestaurantMatch(
  place: RawPlaceResult,
  curatedRestaurants: SampleRestaurant[]
) {
  const normalizedPlaceName = normalizeText(getPlaceName(place));
  const normalizedAddress = normalizeText(
    place.formattedAddress ?? place.shortFormattedAddress ?? ""
  );

  return (
    curatedRestaurants.find((restaurant) => {
      const normalizedRestaurantName = normalizeText(restaurant.name);
      const normalizedRestaurantAddress = normalizeText(restaurant.address);

      const nameMatches =
        normalizedPlaceName.includes(normalizedRestaurantName) ||
        normalizedRestaurantName.includes(normalizedPlaceName);
      const addressMatches =
        normalizedAddress.length > 0 &&
        (normalizedAddress.includes(normalizedRestaurantAddress) ||
          normalizedRestaurantAddress.includes(normalizedAddress));

      return nameMatches || (nameMatches && addressMatches);
    }) ?? null
  );
}

function findMatchedMenuItems(
  restaurant: SampleRestaurant,
  intent: LiveSearchIntent
) {
  const safeItems = restaurant.menuItems.filter(
    (item) => item.status === "Verified Safe"
  );

  const keywordFilteredItems =
    intent.keywords.length > 0
      ? safeItems.filter((item) => {
          const searchText = [item.name, ...item.searchTags].join(" ").toLowerCase();

          return intent.keywords.some((keyword) => searchText.includes(keyword));
        })
      : safeItems;

  const certificationFilteredItems =
    intent.certification === "verified"
      ? keywordFilteredItems.filter((item) => item.verificationBadges.length > 0)
      : intent.certification === "user_vetted"
        ? keywordFilteredItems.filter((item) =>
            item.verificationBadges.includes("User Vetted")
          )
        : intent.certification === "lab_tested"
          ? keywordFilteredItems.filter((item) =>
              item.verificationBadges.includes("Laboratory Tested")
            )
          : keywordFilteredItems;

  return certificationFilteredItems.length > 0
    ? certificationFilteredItems
    : keywordFilteredItems.length > 0
      ? keywordFilteredItems
      : safeItems;
}

function buildCuratedFallbackResult({
  restaurant,
  intent,
  origin,
  allowFallbackMeals
}: {
  restaurant: SampleRestaurant;
  intent: LiveSearchIntent;
  origin: SearchLocation;
  allowFallbackMeals: boolean;
}): LiveSearchResult | null {
  const exactKeywordMatches = findExactKeywordMatches(restaurant, intent);
  const matchedMenuItems = exactKeywordMatches.length > 0
    ? exactKeywordMatches
    : allowFallbackMeals
      ? findMatchedMenuItems(restaurant, intent)
      : [];

  if (matchedMenuItems.length === 0) {
    return null;
  }

  const badges = Array.from(
    new Set(matchedMenuItems.flatMap((item) => item.verificationBadges))
  );
  const safetyLevel = matchedMenuItems[0]?.safetyLevel ?? "Gluten-Friendly";

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
    isOpenNow: null,
    businessStatus: "OPERATIONAL",
    types: ["restaurant"],
    matchedRestaurant: restaurant,
    matchedMenuItems,
    badges,
    safetyLevel,
    supportingText:
      exactKeywordMatches.length > 0
        ? `${matchedMenuItems.length} approved meal match${
            matchedMenuItems.length === 1 ? "" : "es"
          } from the reviewed Tuscaloosa dataset.`
        : "Live Google Places search is unavailable right now, so this card is coming from the approved Tuscaloosa fallback dataset."
  };
}

function findExactKeywordMatches(
  restaurant: SampleRestaurant,
  intent: LiveSearchIntent
) {
  const safeItems = restaurant.menuItems.filter(
    (item) => item.status === "Verified Safe"
  );

  const keywordFilteredItems =
    intent.keywords.length > 0
      ? safeItems.filter((item) => {
          const searchText = [item.name, ...item.searchTags].join(" ").toLowerCase();

          return intent.keywords.some((keyword) => searchText.includes(keyword));
        })
      : safeItems;

  if (keywordFilteredItems.length === 0) {
    return [];
  }

  if (intent.certification === "verified") {
    return keywordFilteredItems.filter((item) => item.verificationBadges.length > 0);
  }

  if (intent.certification === "user_vetted") {
    return keywordFilteredItems.filter((item) =>
      item.verificationBadges.includes("User Vetted")
    );
  }

  if (intent.certification === "lab_tested") {
    return keywordFilteredItems.filter((item) =>
      item.verificationBadges.includes("Laboratory Tested")
    );
  }

  return keywordFilteredItems;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/bar-b-q/g, "barbecue")
    .replace(/[^a-z0-9]/g, "");
}

function buildPrimarySearchQuery(intent: LiveSearchIntent) {
  const focusedQuery = [intent.dietaryTag, intent.keywords.join(" "), "restaurant"]
    .filter(Boolean)
    .join(" ")
    .trim();

  return focusedQuery || intent.rawQuery.trim() || "restaurant";
}

function buildFallbackSearchQuery(intent: LiveSearchIntent) {
  const fallbackQuery = [intent.dietaryTag, "restaurant"]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fallbackQuery || null;
}

function buildBroadSearchQuery(intent: LiveSearchIntent) {
  const broadQuery = [
    intent.keywords.slice(0, 2).join(" "),
    intent.type
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return broadQuery === "restaurant" ? null : broadQuery;
}

function getPlaceName(place: RawPlaceResult) {
  if (typeof place.displayName === "string") {
    return place.displayName;
  }

  if (place.displayName?.text) {
    return place.displayName.text;
  }

  return "";
}

function getPlaceCoordinates(place: RawPlaceResult) {
  if (
    typeof place.location?.lat === "function" &&
    typeof place.location?.lng === "function"
  ) {
    return {
      latitude: place.location.lat(),
      longitude: place.location.lng()
    };
  }

  if (
    typeof place.location?.lat === "number" &&
    typeof place.location?.lng === "number"
  ) {
    return {
      latitude: place.location.lat,
      longitude: place.location.lng
    };
  }

  return null;
}

function normalizePriceLevel(priceLevel: RawPlaceResult["priceLevel"]) {
  if (typeof priceLevel === "number") {
    return priceLevel;
  }

  switch (priceLevel) {
    case "PRICE_LEVEL_FREE":
      return 0;
    case "PRICE_LEVEL_INEXPENSIVE":
      return 1;
    case "PRICE_LEVEL_MODERATE":
      return 2;
    case "PRICE_LEVEL_EXPENSIVE":
      return 3;
    case "PRICE_LEVEL_VERY_EXPENSIVE":
      return 4;
    default:
      return null;
  }
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
