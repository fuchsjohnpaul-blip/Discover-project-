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

type RawPlaceResult = {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  vicinity?: string;
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  business_status?: string;
  opening_hours?: {
    open_now?: boolean;
  };
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

export function buildTextSearchRequest(
  googleMaps: any,
  intent: LiveSearchIntent,
  location: SearchLocation,
  radiusMeters = 6000
) {
  const queryParts = [
    intent.dietaryTag,
    intent.keywords.join(" "),
    "restaurant"
  ].filter(Boolean);

  return {
    query: queryParts.join(" ").trim() || "restaurant",
    location: new googleMaps.LatLng(location.latitude, location.longitude),
    radius: radiusMeters,
    type: intent.type,
    openNow: intent.openNowOnly
  };
}

export function buildNearbySearchRequest(
  googleMaps: any,
  intent: LiveSearchIntent,
  location: SearchLocation
) {
  const keyword = [intent.dietaryTag, intent.keywords.join(" ")]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    location: new googleMaps.LatLng(location.latitude, location.longitude),
    rankBy: googleMaps.places.RankBy.DISTANCE,
    keyword: keyword || undefined,
    type: intent.type,
    openNow: intent.openNowOnly
  };
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
  const latitude = place.geometry?.location?.lat?.();
  const longitude = place.geometry?.location?.lng?.();

  if (
    !place.place_id ||
    !place.name ||
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    return null;
  }

  if (place.business_status === "CLOSED_PERMANENTLY") {
    return null;
  }

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
    id: place.place_id,
    placeId: place.place_id,
    name: place.name,
    address: place.formatted_address ?? place.vicinity ?? "Address unavailable",
    latitude,
    longitude,
    distanceMiles: getDistanceMiles(origin, { latitude, longitude }),
    rating: place.rating ?? null,
    userRatingsTotal: place.user_ratings_total ?? null,
    priceLevel: place.price_level ?? null,
    isOpenNow: place.opening_hours?.open_now ?? null,
    businessStatus: place.business_status ?? null,
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
  const normalizedPlaceName = normalizeText(place.name ?? "");
  const normalizedAddress = normalizeText(
    place.formatted_address ?? place.vicinity ?? ""
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

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/bar-b-q/g, "barbecue")
    .replace(/[^a-z0-9]/g, "");
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
