import { createClient } from "@supabase/supabase-js";

import {
  sampleRestaurants,
  type SampleMenuItem,
  type SampleRestaurant
} from "@/lib/sample-data";

const TUSCALOOSA_CENTER = {
  latitude: 33.2098,
  longitude: -87.5692
};

type HomepageRestaurantResult = {
  restaurants: SampleRestaurant[];
  source: "supabase" | "sample";
};

type RestaurantRow = {
  id: string;
  slug: string;
  name: string;
  address_line1: string;
  city: string;
  state: string;
  postal_code: string | null;
  latitude: number;
  longitude: number;
  gluten_safety_category: string;
};

type MenuItemRow = {
  id: string;
  restaurant_id: string;
  name: string;
  gluten_status: string;
  verification_method: string;
  confidence_level: string;
  caution_notes: string | null;
};

type VerificationRecordRow = {
  menu_item_id: string | null;
  reviewer_note: string | null;
};

export async function getHomepageRestaurants(): Promise<HomepageRestaurantResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      restaurants: sampleRestaurants,
      source: "sample"
    };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const [{ data: restaurantRows, error: restaurantsError }, { data: menuItemRows, error: menuItemsError }, { data: verificationRows, error: verificationError }] =
      await Promise.all([
        supabase
          .from("published_restaurants")
          .select(
            "id, slug, name, address_line1, city, state, postal_code, latitude, longitude, gluten_safety_category"
          )
          .order("name"),
        supabase
          .from("published_menu_items")
          .select(
            "id, restaurant_id, name, gluten_status, verification_method, confidence_level, caution_notes"
          )
          .order("name"),
        supabase
          .from("verification_records")
          .select("menu_item_id, reviewer_note")
          .order("reviewed_at", { ascending: false })
      ]);

    if (restaurantsError || menuItemsError || verificationError) {
      return {
        restaurants: sampleRestaurants,
        source: "sample"
      };
    }

    const normalizedRestaurants = normalizeRestaurants({
      restaurantRows: (restaurantRows as RestaurantRow[] | null) ?? [],
      menuItemRows: (menuItemRows as MenuItemRow[] | null) ?? [],
      verificationRows: (verificationRows as VerificationRecordRow[] | null) ?? []
    });

    if (normalizedRestaurants.length === 0) {
      return {
        restaurants: sampleRestaurants,
        source: "sample"
      };
    }

    return {
      restaurants: normalizedRestaurants,
      source: "supabase"
    };
  } catch {
    return {
      restaurants: sampleRestaurants,
      source: "sample"
    };
  }
}

function normalizeRestaurants({
  restaurantRows,
  menuItemRows,
  verificationRows
}: {
  restaurantRows: RestaurantRow[];
  menuItemRows: MenuItemRow[];
  verificationRows: VerificationRecordRow[];
}): SampleRestaurant[] {
  const verificationByMenuItemId = new Map<string, string>();

  verificationRows.forEach((row) => {
    if (row.menu_item_id && row.reviewer_note && !verificationByMenuItemId.has(row.menu_item_id)) {
      verificationByMenuItemId.set(row.menu_item_id, row.reviewer_note);
    }
  });

  return restaurantRows.flatMap((restaurant) => {
    const menuItems = menuItemRows
      .filter((item) => item.restaurant_id === restaurant.id)
      .map((item) =>
        normalizeMenuItem({
          item,
          restaurantName: restaurant.name,
          reviewerNote: verificationByMenuItemId.get(item.id)
        })
      );

    if (menuItems.length === 0) {
      return [];
    }

    const safeCount = menuItems.filter(
      (item) => item.status === "Verified Safe"
    ).length;

    return [
      {
        slug: restaurant.slug,
        name: restaurant.name,
        address: formatAddress(restaurant),
        neighborhood: deriveNeighborhood(restaurant.address_line1),
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        distanceMiles: estimateDistanceMiles(
          restaurant.latitude,
          restaurant.longitude
        ),
        glutenSafetyCategory: humanizeSafetyCategory(
          restaurant.gluten_safety_category
        ),
        glutenSafetyRating: inferRestaurantSafetyRating({
          glutenSafetyCategory: restaurant.gluten_safety_category,
          menuItems
        }),
        menuItems,
        cautionSummary:
          menuItems.find((item) => item.status !== "Verified Safe")?.rationale ??
          "Review preparation details with staff when menu wording changes.",
        detailSummary:
          safeCount > 0
            ? `${restaurant.name} currently has ${safeCount} menu item${
                safeCount === 1 ? "" : "s"
              } that look strongest for a gluten-free-friendly first pass.`
            : `${restaurant.name} currently reads as a more caution-heavy stop based on the published menu items.`,
        dataSource: "supabase" as const
      }
    ];
  });
}

function normalizeMenuItem({
  item,
  restaurantName,
  reviewerNote
}: {
  item: MenuItemRow;
  restaurantName: string;
  reviewerNote?: string;
}): SampleMenuItem {
  const status = humanizeMenuStatus(item.gluten_status);
  const verificationMethod = humanizeVerificationMethod(item.verification_method);

  return {
    name: item.name,
    status,
    verificationMethod,
    confidenceNote: humanizeConfidence(item.confidence_level),
    rationale:
      reviewerNote ??
      item.caution_notes ??
      "Published from Supabase without an additional review note yet.",
    priceLabel: inferPriceLabel(item.name),
    prepTimeMinutes: inferPrepTimeMinutes(item.name),
    searchTags: inferSearchTags(item.name, restaurantName),
    verificationBadges: inferVerificationBadges({
      status,
      verificationMethod
    }),
    safetyLevel: inferSafetyLevel({
      status,
      confidenceLevel: item.confidence_level,
      verificationMethod
    })
  };
}

function formatAddress(restaurant: RestaurantRow) {
  const postalPart = restaurant.postal_code ? ` ${restaurant.postal_code}` : "";

  return `${restaurant.address_line1}, ${restaurant.city}, ${restaurant.state}${postalPart}`;
}

function deriveNeighborhood(addressLine1: string) {
  if (addressLine1.includes("University")) {
    return "University Boulevard";
  }

  if (addressLine1.includes("McFarland")) {
    return "McFarland Corridor";
  }

  if (addressLine1.includes("15th")) {
    return "15th Street East";
  }

  if (addressLine1.includes("25th")) {
    return "Midtown Tuscaloosa";
  }

  return "Tuscaloosa";
}

function humanizeSafetyCategory(category: string) {
  switch (category) {
    case "100_percent_gluten_free":
      return "100% Gluten-Free";
    case "dedicated_gluten_free_menu":
      return "Dedicated GF Menu";
    case "gluten_free_options_available":
      return "Gluten-Free Options";
    case "verified_menu_items_only":
      return "Verified Menu Items";
    default:
      return "Dietary Notes Available";
  }
}

function humanizeMenuStatus(status: string): SampleMenuItem["status"] {
  switch (status) {
    case "verified_safe":
      return "Verified Safe";
    case "not_safe":
      return "Not Verified (Contains Gluten)";
    default:
      return "Needs Review";
  }
}

function humanizeVerificationMethod(method: string) {
  switch (method) {
    case "restaurant_labeled":
      return "Restaurant labeled";
    case "internally_reviewed":
      return "Internally reviewed";
    case "mixed_evidence":
      return "Mixed evidence";
    default:
      return "Source pending";
  }
}

function humanizeConfidence(level: string) {
  switch (level) {
    case "high":
      return "Higher confidence from the currently published evidence.";
    case "medium":
      return "Moderate confidence based on the current published evidence.";
    default:
      return "Lower confidence. This item may need a closer manual review.";
  }
}

function estimateDistanceMiles(latitude: number, longitude: number) {
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const latitudeDelta = toRadians(latitude - TUSCALOOSA_CENTER.latitude);
  const longitudeDelta = toRadians(longitude - TUSCALOOSA_CENTER.longitude);
  const startLatitude = toRadians(TUSCALOOSA_CENTER.latitude);
  const endLatitude = toRadians(latitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(startLatitude) *
      Math.cos(endLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return Number(
    Math.max(0.4, earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1)
  );
}

function inferRestaurantSafetyRating({
  glutenSafetyCategory,
  menuItems
}: {
  glutenSafetyCategory: string;
  menuItems: SampleMenuItem[];
}) {
  const safeRatio =
    menuItems.filter((item) => item.status === "Verified Safe").length /
    menuItems.length;
  const baseRating = 3.1 + safeRatio * 1.5;

  const categoryBonus =
    glutenSafetyCategory === "100_percent_gluten_free"
      ? 0.3
      : glutenSafetyCategory === "verified_menu_items_only"
        ? 0.15
        : 0;

  return Number(Math.min(4.9, baseRating + categoryBonus).toFixed(1));
}

function inferPriceLabel(name: string) {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("plate") || normalizedName.includes("brisket")) {
    return "$17";
  }

  if (
    normalizedName.includes("baker") ||
    normalizedName.includes("pizza") ||
    normalizedName.includes("flatbread")
  ) {
    return "$15";
  }

  if (normalizedName.includes("salad") || normalizedName.includes("nachos")) {
    return "$10";
  }

  if (normalizedName.includes("taco") || normalizedName.includes("toast")) {
    return "$4";
  }

  return "$12";
}

function inferPrepTimeMinutes(name: string) {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("slice") || normalizedName.includes("taco")) {
    return 5;
  }

  if (normalizedName.includes("salad") || normalizedName.includes("toast")) {
    return 7;
  }

  if (
    normalizedName.includes("brisket") ||
    normalizedName.includes("pizza") ||
    normalizedName.includes("flatbread")
  ) {
    return 16;
  }

  return 12;
}

function inferSearchTags(name: string, restaurantName: string) {
  const normalizedText = `${name} ${restaurantName}`.toLowerCase();
  const tags = new Set<string>(
    normalizedText
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2)
  );

  if (
    normalizedText.includes("bbq") ||
    normalizedText.includes("bar-b-q") ||
    normalizedText.includes("barbecue")
  ) {
    tags.add("barbecue");
    tags.add("bbq");
  }

  if (normalizedText.includes("pizza") || normalizedText.includes("flatbread")) {
    tags.add("italian");
  }

  if (
    normalizedText.includes("taco") ||
    normalizedText.includes("burrito") ||
    normalizedText.includes("nachos")
  ) {
    tags.add("mexican");
  }

  if (normalizedText.includes("salad")) {
    tags.add("greens");
  }

  if (normalizedText.includes("macaroni")) {
    tags.add("pasta");
  }

  return Array.from(tags);
}

function inferVerificationBadges({
  status,
  verificationMethod
}: {
  status: SampleMenuItem["status"];
  verificationMethod: string;
}): SampleMenuItem["verificationBadges"] {
  if (status !== "Verified Safe") {
    return [];
  }

  if (verificationMethod === "Restaurant labeled") {
    return ["Kitchen Certified"];
  }

  if (verificationMethod === "Internally reviewed") {
    return ["Kitchen Certified", "User Vetted"];
  }

  return [];
}

function inferSafetyLevel({
  status,
  confidenceLevel,
  verificationMethod
}: {
  status: SampleMenuItem["status"];
  confidenceLevel: string;
  verificationMethod: string;
}): SampleMenuItem["safetyLevel"] {
  if (status !== "Verified Safe") {
    return "Contains Gluten";
  }

  if (
    confidenceLevel === "high" &&
    (verificationMethod === "Restaurant labeled" ||
      verificationMethod === "Internally reviewed")
  ) {
    return "Celiac-Safer";
  }

  return "Gluten-Friendly";
}
