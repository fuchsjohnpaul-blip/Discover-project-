import { createClient } from "@supabase/supabase-js";

import {
  sampleRestaurants,
  type SampleMenuItem,
  type SampleRestaurant
} from "@/lib/sample-data";

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

  return restaurantRows
    .map((restaurant) => {
      const menuItems = menuItemRows
        .filter((item) => item.restaurant_id === restaurant.id)
        .map((item) =>
          normalizeMenuItem({
            item,
            reviewerNote: verificationByMenuItemId.get(item.id)
          })
        );

      if (menuItems.length === 0) {
        return null;
      }

      const safeCount = menuItems.filter(
        (item) => item.status === "Verified Safe"
      ).length;

      return {
        slug: restaurant.slug,
        name: restaurant.name,
        address: formatAddress(restaurant),
        neighborhood: deriveNeighborhood(restaurant.address_line1),
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        glutenSafetyCategory: humanizeSafetyCategory(
          restaurant.gluten_safety_category
        ),
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
      };
    })
    .filter((restaurant): restaurant is SampleRestaurant => restaurant !== null);
}

function normalizeMenuItem({
  item,
  reviewerNote
}: {
  item: MenuItemRow;
  reviewerNote?: string;
}): SampleMenuItem {
  return {
    name: item.name,
    status: humanizeMenuStatus(item.gluten_status),
    verificationMethod: humanizeVerificationMethod(item.verification_method),
    confidenceNote: humanizeConfidence(item.confidence_level),
    rationale:
      reviewerNote ??
      item.caution_notes ??
      "Published from Supabase without an additional review note yet."
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
