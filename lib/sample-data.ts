import {
  importedRestaurantBatches,
  type DietaryFlagValue,
  type ImportedConfidenceLevel,
  type ImportedRestaurantBatch,
  type ImportedSourceType
} from "@/lib/imported-restaurant-batches";

export type VerificationBadge =
  | "Kitchen Certified"
  | "User Vetted"
  | "Laboratory Tested";

export type SafetyLevel =
  | "Celiac-Safer"
  | "Gluten-Friendly"
  | "Contains Gluten";

export type MenuCourseType = "Meal" | "Appetizer";

export type DietaryAttributes = {
  glutenFree: DietaryFlagValue;
  soyFree: DietaryFlagValue;
  nutFree: DietaryFlagValue;
  kosher: DietaryFlagValue;
  halal: DietaryFlagValue;
};

export type SampleMenuItem = {
  name: string;
  status:
    | "Verified Safe"
    | "Not Verified (Contains Gluten)"
    | "Needs Review";
  verificationMethod: string;
  confidenceNote: string;
  rationale: string;
  priceLabel: string;
  prepTimeMinutes: number;
  searchTags: string[];
  verificationBadges: VerificationBadge[];
  safetyLevel: SafetyLevel;
  dietaryAttributes?: DietaryAttributes;
  confidenceLevel?: ImportedConfidenceLevel;
  sourceType?: ImportedSourceType;
  lastVerified?: string;
};

export type SampleRestaurant = {
  slug: string;
  name: string;
  address: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  distanceMiles: number;
  glutenSafetyCategory: string;
  glutenSafetyRating: number;
  menuItems: SampleMenuItem[];
  cautionSummary: string;
  detailSummary: string;
  dataSource?: "supabase" | "sample";
};

const TUSCALOOSA_CENTER = {
  latitude: 33.2098,
  longitude: -87.5692
};

const baseSampleRestaurants: SampleRestaurant[] = [
  {
    slug: "jim-n-nicks-bbq",
    name: "Jim 'N Nick's Bar-B-Q",
    address: "305 21st Ave, Tuscaloosa, AL 35401",
    neighborhood: "Downtown Tuscaloosa",
    latitude: 33.2126591,
    longitude: -87.5646023,
    distanceMiles: 0.8,
    glutenSafetyCategory: "Verified Menu Items",
    glutenSafetyRating: 4.8,
    menuItems: [
      {
        name: "Beef Brisket (No Bun)",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote:
          "Verified from restaurant labeling for the no-bun preparation.",
        rationale:
          "Treated as safe because the restaurant identifies the item as gluten-free when served without the bun.",
        priceLabel: "$18",
        prepTimeMinutes: 16,
        searchTags: [
          "barbecue",
          "bbq",
          "brisket",
          "smoked meats",
          "protein"
        ],
        verificationBadges: ["Kitchen Certified", "User Vetted"],
        safetyLevel: "Gluten-Friendly"
      },
      {
        name: "Pulled Pork Plate",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote: "Menu labeling suggests a gluten-free plated option.",
        rationale:
          "Included as a safe sample item because this style of plated barbecue often avoids bread by default when ordered without toast.",
        priceLabel: "$16",
        prepTimeMinutes: 14,
        searchTags: ["barbecue", "bbq", "pulled pork", "plate", "protein"],
        verificationBadges: ["Kitchen Certified"],
        safetyLevel: "Gluten-Friendly"
      },
      {
        name: "Macaroni and Cheese",
        status: "Not Verified (Contains Gluten)",
        verificationMethod: "No GF labeling",
        confidenceNote: "No gluten-free claim is present for this side item.",
        rationale:
          "Flagged as not verified because ingredient details and preparation standards were not provided.",
        priceLabel: "$5",
        prepTimeMinutes: 8,
        searchTags: ["comfort food", "side", "mac and cheese", "pasta"],
        verificationBadges: [],
        safetyLevel: "Contains Gluten"
      }
    ],
    cautionSummary:
      "Ask the staff to confirm no bun and prevent bread cross-contact on shared prep surfaces.",
    detailSummary:
      "A downtown barbecue option where protein-forward choices are the most promising gluten-free picks.",
    dataSource: "sample"
  },
  {
    slug: "the-sanctuary-on-25th",
    name: "The Sanctuary on 25th",
    address: "1710 25th Ave, Tuscaloosa, AL 35401",
    neighborhood: "Midtown Tuscaloosa",
    latitude: 33.1962121,
    longitude: -87.563875,
    distanceMiles: 1.1,
    glutenSafetyCategory: "Verified Menu Items",
    glutenSafetyRating: 4.7,
    menuItems: [
      {
        name: "Bacon Wrapped Dates",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote: "Verified from restaurant gluten-free labeling.",
        rationale:
          "Treated as safe because the restaurant labels this item as gluten-free.",
        priceLabel: "$14",
        prepTimeMinutes: 12,
        searchTags: ["appetizer", "small plates", "dates", "shared plates"],
        verificationBadges: ["Kitchen Certified", "User Vetted"],
        safetyLevel: "Celiac-Safer"
      },
      {
        name: "House Salad",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote:
          "Gluten-free labeling appears to cover this lighter option.",
        rationale:
          "Included as a safe sample item because salads are often explicitly labeled when the dressing and toppings meet the standard.",
        priceLabel: "$11",
        prepTimeMinutes: 7,
        searchTags: ["salad", "lighter fare", "greens", "gluten-free"],
        verificationBadges: ["Kitchen Certified"],
        safetyLevel: "Celiac-Safer"
      },
      {
        name: "Seasonal Flatbread",
        status: "Not Verified (Contains Gluten)",
        verificationMethod: "No GF labeling",
        confidenceNote: "No gluten-free claim is present for this flatbread.",
        rationale:
          "Flagged as not verified because flatbread commonly contains wheat unless a gluten-free crust is stated.",
        priceLabel: "$15",
        prepTimeMinutes: 15,
        searchTags: ["flatbread", "italian", "starter", "shareable"],
        verificationBadges: [],
        safetyLevel: "Contains Gluten"
      }
    ],
    cautionSummary:
      "Review sauces, garnish, and seasonal changes if the kitchen updates ingredients.",
    detailSummary:
      "A more polished, small-plates style spot where labeled appetizers and lighter dishes stand out.",
    dataSource: "sample"
  },
  {
    slug: "full-moon-bbq",
    name: "Full Moon Bar-B-Que",
    address: "1434 McFarland Blvd E, Tuscaloosa, AL 35404",
    neighborhood: "McFarland Corridor",
    latitude: 33.1980298,
    longitude: -87.5262153,
    distanceMiles: 2.6,
    glutenSafetyCategory: "Verified Menu Items",
    glutenSafetyRating: 4.6,
    menuItems: [
      {
        name: "Loaded Bar-B-Q Baker",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote: "Verified from restaurant gluten-free labeling.",
        rationale:
          "Treated as safe because the restaurant labels this item as gluten-free.",
        priceLabel: "$15",
        prepTimeMinutes: 13,
        searchTags: [
          "barbecue",
          "bbq",
          "loaded potato",
          "baked potato",
          "baker"
        ],
        verificationBadges: ["Kitchen Certified", "User Vetted"],
        safetyLevel: "Celiac-Safer"
      },
      {
        name: "Smoked Turkey Plate",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote:
          "A plated protein option is a strong candidate when labeled clearly.",
        rationale:
          "Included as a safe sample item because plate-style barbecue items often work better than sandwich-based orders.",
        priceLabel: "$17",
        prepTimeMinutes: 14,
        searchTags: ["barbecue", "bbq", "turkey", "plate", "protein"],
        verificationBadges: ["Kitchen Certified"],
        safetyLevel: "Gluten-Friendly"
      },
      {
        name: "Texas Toast",
        status: "Not Verified (Contains Gluten)",
        verificationMethod: "No GF labeling",
        confidenceNote: "Bread item with no gluten-free claim.",
        rationale:
          "Flagged as not verified because standard toast contains wheat.",
        priceLabel: "$3",
        prepTimeMinutes: 6,
        searchTags: ["bread", "toast", "side"],
        verificationBadges: [],
        safetyLevel: "Contains Gluten"
      }
    ],
    cautionSummary:
      "Double-check toppings and side swaps if ingredients rotate or sauces change.",
    detailSummary:
      "A barbecue stop where potato and plate-based orders may offer better gluten-free potential than bread-heavy items.",
    dataSource: "sample"
  },
  {
    slug: "standard-pizza-co",
    name: "The Standard",
    address: "1217 University Blvd, Tuscaloosa, AL 35401",
    neighborhood: "University Boulevard",
    latitude: 33.2107645,
    longitude: -87.5540706,
    distanceMiles: 1,
    glutenSafetyCategory: "Contains Gluten",
    glutenSafetyRating: 3.1,
    menuItems: [
      {
        name: "Regular Pepperoni Pizza",
        status: "Not Verified (Contains Gluten)",
        verificationMethod: "No GF labeling",
        confidenceNote:
          "No gluten-free claim is present for the regular crust.",
        rationale:
          "Marked not safe because a regular pizza crust typically contains wheat gluten and no gluten-free claim was provided.",
        priceLabel: "$19",
        prepTimeMinutes: 18,
        searchTags: ["pizza", "italian", "pepperoni", "regular crust"],
        verificationBadges: [],
        safetyLevel: "Contains Gluten"
      },
      {
        name: "Cheese Pizza Slice",
        status: "Not Verified (Contains Gluten)",
        verificationMethod: "No GF labeling",
        confidenceNote:
          "Standard slice service does not indicate a gluten-free crust.",
        rationale:
          "Flagged as not verified because standard slice offerings usually rely on the same wheat crust.",
        priceLabel: "$5",
        prepTimeMinutes: 6,
        searchTags: ["pizza", "slice", "italian", "cheese pizza"],
        verificationBadges: [],
        safetyLevel: "Contains Gluten"
      },
      {
        name: "Garden Salad",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote:
          "Safer when the dressing and toppings remain labeled gluten-free.",
        rationale:
          "Included as a safe sample item because a simple salad is a more plausible gluten-free choice than standard pizza.",
        priceLabel: "$10",
        prepTimeMinutes: 8,
        searchTags: ["salad", "greens", "lighter fare", "starter"],
        verificationBadges: ["Kitchen Certified"],
        safetyLevel: "Gluten-Friendly"
      }
    ],
    cautionSummary:
      "Pizza environments often have flour in the air, so even safer options may need extra caution.",
    detailSummary:
      "A pizza-focused restaurant where standard crust items should be treated carefully and non-pizza items may be the better path.",
    dataSource: "sample"
  },
  {
    slug: "taco-casa",
    name: "Taco Casa",
    address: "603 15th St E, Tuscaloosa, AL 35401",
    neighborhood: "15th Street East",
    latitude: 33.1970196,
    longitude: -87.5284996,
    distanceMiles: 2.4,
    glutenSafetyCategory: "Contains Gluten",
    glutenSafetyRating: 3.8,
    menuItems: [
      {
        name: "Flour Tortilla Burrito",
        status: "Not Verified (Contains Gluten)",
        verificationMethod: "No GF labeling",
        confidenceNote:
          "No gluten-free claim is present for the flour tortilla.",
        rationale:
          "Marked not safe because a flour tortilla typically contains wheat gluten and no gluten-free claim was provided.",
        priceLabel: "$7",
        prepTimeMinutes: 5,
        searchTags: ["taco", "mexican", "burrito", "flour tortilla"],
        verificationBadges: [],
        safetyLevel: "Contains Gluten"
      },
      {
        name: "Crunchy Taco",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote:
          "Potentially safer when the shell is corn-based and labeled clearly.",
        rationale:
          "Included as a safe sample item because crunchy taco shells can be a better gluten-free option than flour tortillas when labeled.",
        priceLabel: "$3",
        prepTimeMinutes: 4,
        searchTags: ["taco", "mexican", "corn shell", "fast casual"],
        verificationBadges: ["Kitchen Certified", "User Vetted"],
        safetyLevel: "Gluten-Friendly"
      },
      {
        name: "Nachos",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote:
          "Safer when chips and toppings remain within labeled gluten-free prep.",
        rationale:
          "Included as a safe sample item because tortilla-chip-based items may better fit a gluten-free pattern than burritos.",
        priceLabel: "$8",
        prepTimeMinutes: 7,
        searchTags: ["nachos", "chips", "mexican", "fast casual"],
        verificationBadges: ["Kitchen Certified"],
        safetyLevel: "Gluten-Friendly"
      }
    ],
    cautionSummary:
      "Shared prep around flour tortillas can still matter, even when a corn-based option looks safer.",
    detailSummary:
      "A fast-casual taco stop where corn-based items may offer a better gluten-free path than flour tortilla orders.",
    dataSource: "sample"
  }
];

export const sampleRestaurants: SampleRestaurant[] = mergeImportedRestaurantBatches(
  baseSampleRestaurants,
  importedRestaurantBatches
);

function mergeImportedRestaurantBatches(
  baseRestaurants: SampleRestaurant[],
  importedBatches: ImportedRestaurantBatch[]
) {
  const mergedRestaurants = [...baseRestaurants];
  const baseIndexByAddressKey = new Map<string, number>();

  mergedRestaurants.forEach((restaurant, index) => {
    baseIndexByAddressKey.set(getFullAddressKey(restaurant.address), index);
  });

  importedBatches.forEach((batch) => {
    const importedRestaurant = buildRestaurantFromImportedBatch(batch);
    const existingRestaurantIndex = baseIndexByAddressKey.get(
      getAddressKey(batch.address, batch.city, batch.state)
    );

    if (existingRestaurantIndex === undefined) {
      mergedRestaurants.push(importedRestaurant);
      return;
    }

    const existingRestaurant = mergedRestaurants[existingRestaurantIndex];
    const mergedMenuItems = mergeMenuItems(
      existingRestaurant.menuItems,
      importedRestaurant.menuItems
    );

    mergedRestaurants[existingRestaurantIndex] = {
      ...existingRestaurant,
      glutenSafetyCategory: deriveRestaurantCategory(mergedMenuItems),
      glutenSafetyRating: deriveRestaurantSafetyRating(mergedMenuItems),
      menuItems: mergedMenuItems,
      cautionSummary: buildCautionSummary(mergedMenuItems),
      detailSummary: buildDetailSummary(existingRestaurant.name, mergedMenuItems),
      dataSource: "sample"
    };
  });

  return mergedRestaurants;
}

function buildRestaurantFromImportedBatch(
  batch: ImportedRestaurantBatch
): SampleRestaurant {
  const coordinates = getApproximateCoordinates(batch);
  const menuItems = batch.meals.map((meal) => buildImportedMenuItem(batch, meal));

  return {
    slug: slugify(batch.restaurantName),
    name: batch.restaurantName,
    address: `${batch.address}, ${batch.city}, ${batch.state} ${batch.zip}`,
    neighborhood: deriveNeighborhood(batch.address),
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    distanceMiles: estimateDistanceMiles(coordinates.latitude, coordinates.longitude),
    glutenSafetyCategory: deriveRestaurantCategory(menuItems),
    glutenSafetyRating: deriveRestaurantSafetyRating(menuItems),
    menuItems,
    cautionSummary: buildCautionSummary(menuItems),
    detailSummary: buildDetailSummary(batch.restaurantName, menuItems),
    dataSource: "sample"
  };
}

function buildImportedMenuItem(
  batch: ImportedRestaurantBatch,
  meal: ImportedRestaurantBatch["meals"][number]
): SampleMenuItem {
  const [
    dishName,
    priceLabel,
    dietaryFlags,
    confidenceLevel,
    sourceType,
    notes,
    lastVerified
  ] = meal;
  const dietaryAttributes: DietaryAttributes = {
    glutenFree: dietaryFlags[0],
    soyFree: dietaryFlags[1],
    nutFree: dietaryFlags[2],
    kosher: dietaryFlags[3],
    halal: dietaryFlags[4]
  };
  const status = getImportedStatus(dietaryAttributes.glutenFree);
  const confidenceNote = notes ?? buildConfidenceNote({
    dishName,
    confidenceLevel,
    sourceType,
    lastVerified,
    glutenFree: dietaryAttributes.glutenFree
  });

  return {
    name: dishName,
    status,
    verificationMethod: humanizeImportedSourceType(sourceType),
    confidenceNote,
    rationale: buildImportedRationale({
      dishName,
      restaurantName: batch.restaurantName,
      dietaryAttributes,
      notes
    }),
    priceLabel: priceLabel ?? "Price TBD",
    prepTimeMinutes: inferPrepTimeMinutes(dishName),
    searchTags: inferSearchTags(dishName, batch.restaurantName, dietaryAttributes),
    verificationBadges: inferImportedVerificationBadges({
      sourceType,
      status
    }),
    safetyLevel: inferImportedSafetyLevel({
      glutenFree: dietaryAttributes.glutenFree,
      confidenceLevel,
      sourceType
    }),
    dietaryAttributes,
    confidenceLevel,
    sourceType,
    lastVerified
  };
}

function getImportedStatus(glutenFree: DietaryFlagValue): SampleMenuItem["status"] {
  if (glutenFree === "yes") {
    return "Verified Safe";
  }

  if (glutenFree === "no") {
    return "Not Verified (Contains Gluten)";
  }

  return "Needs Review";
}

function humanizeImportedSourceType(sourceType: ImportedSourceType) {
  switch (sourceType) {
    case "restaurant_label":
      return "Restaurant labeled";
    case "staff_confirmation":
      return "Staff confirmed";
    case "menu_review":
      return "Menu reviewed";
    case "manual_research":
      return "Manual research";
    default:
      return "User submitted list";
  }
}

function buildConfidenceNote({
  dishName,
  confidenceLevel,
  sourceType,
  lastVerified,
  glutenFree
}: {
  dishName: string;
  confidenceLevel: ImportedConfidenceLevel;
  sourceType: ImportedSourceType;
  lastVerified: string;
  glutenFree: DietaryFlagValue;
}) {
  const statusLabel =
    glutenFree === "yes"
      ? "marked gluten-free"
      : glutenFree === "no"
        ? "marked not gluten-free"
        : "still awaiting a clearer gluten call";

  return `${dishName} is ${statusLabel} in the imported ${humanizeImportedSourceType(
    sourceType
  ).toLowerCase()} dataset with ${confidenceLevel} confidence as of ${lastVerified}.`;
}

function buildImportedRationale({
  dishName,
  restaurantName,
  dietaryAttributes,
  notes
}: {
  dishName: string;
  restaurantName: string;
  dietaryAttributes: DietaryAttributes;
  notes: string | null;
}) {
  if (notes) {
    return notes;
  }

  const extraSignals = formatPositiveDietarySignals(dietaryAttributes).filter(
    (signal) => signal !== "Gluten-Free"
  );

  if (dietaryAttributes.glutenFree === "yes") {
    return extraSignals.length > 0
      ? `${dishName} at ${restaurantName} is marked gluten-free and also reads as ${extraSignals.join(
          ", "
        ).toLowerCase()} in the imported list.`
      : `${dishName} at ${restaurantName} is marked gluten-free in the imported list.`;
  }

  if (dietaryAttributes.glutenFree === "no") {
    return `${dishName} at ${restaurantName} is marked as not gluten-free in the imported list.`;
  }

  return `${dishName} at ${restaurantName} needs more review before the gluten status should be trusted.`;
}

function inferImportedVerificationBadges({
  sourceType,
  status
}: {
  sourceType: ImportedSourceType;
  status: SampleMenuItem["status"];
}) {
  if (status !== "Verified Safe") {
    return [];
  }

  if (sourceType === "restaurant_label" || sourceType === "staff_confirmation") {
    return ["Kitchen Certified"] satisfies VerificationBadge[];
  }

  if (sourceType === "user_list" || sourceType === "menu_review") {
    return ["User Vetted"] satisfies VerificationBadge[];
  }

  return [];
}

function inferImportedSafetyLevel({
  glutenFree,
  confidenceLevel,
  sourceType
}: {
  glutenFree: DietaryFlagValue;
  confidenceLevel: ImportedConfidenceLevel;
  sourceType: ImportedSourceType;
}) {
  if (glutenFree === "no") {
    return "Contains Gluten" satisfies SafetyLevel;
  }

  if (
    glutenFree === "yes" &&
    confidenceLevel === "high" &&
    (sourceType === "restaurant_label" || sourceType === "staff_confirmation")
  ) {
    return "Celiac-Safer" satisfies SafetyLevel;
  }

  return "Gluten-Friendly" satisfies SafetyLevel;
}

function inferPrepTimeMinutes(dishName: string) {
  const normalizedDishName = dishName.toLowerCase();

  if (
    normalizedDishName.includes("salad") ||
    normalizedDishName.includes("dip") ||
    normalizedDishName.includes("pudding") ||
    normalizedDishName.includes("baklava")
  ) {
    return 8;
  }

  if (
    normalizedDishName.includes("taco") ||
    normalizedDishName.includes("wrap") ||
    normalizedDishName.includes("sandwich") ||
    normalizedDishName.includes("burger") ||
    normalizedDishName.includes("bowl")
  ) {
    return 12;
  }

  if (
    normalizedDishName.includes("pizza") ||
    normalizedDishName.includes("pasta") ||
    normalizedDishName.includes("lasagna") ||
    normalizedDishName.includes("stromboli")
  ) {
    return 18;
  }

  if (
    normalizedDishName.includes("salmon") ||
    normalizedDishName.includes("shrimp") ||
    normalizedDishName.includes("fish") ||
    normalizedDishName.includes("ribeye") ||
    normalizedDishName.includes("steak") ||
    normalizedDishName.includes("duck") ||
    normalizedDishName.includes("chicken") ||
    normalizedDishName.includes("catfish")
  ) {
    return 16;
  }

  return 14;
}

function inferSearchTags(
  dishName: string,
  restaurantName: string,
  dietaryAttributes: DietaryAttributes
) {
  const keywords = `${dishName} ${restaurantName}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);
  const tagSet = new Set<string>(keywords);

  if (dishName.toLowerCase().includes("bbq") || dishName.toLowerCase().includes("barbecue")) {
    tagSet.add("barbecue");
    tagSet.add("bbq");
  }

  if (dishName.toLowerCase().includes("pizza")) {
    tagSet.add("pizza");
  }

  if (dishName.toLowerCase().includes("salad")) {
    tagSet.add("salad");
  }

  if (dishName.toLowerCase().includes("taco")) {
    tagSet.add("taco");
    tagSet.add("mexican");
  }

  if (dietaryAttributes.glutenFree === "yes") {
    tagSet.add("gluten-free");
  }

  if (dietaryAttributes.kosher === "yes") {
    tagSet.add("kosher");
  }

  if (dietaryAttributes.halal === "yes") {
    tagSet.add("halal");
  }

  return Array.from(tagSet);
}

function deriveRestaurantCategory(menuItems: SampleMenuItem[]) {
  const safeItemCount = menuItems.filter(
    (item) => item.status === "Verified Safe"
  ).length;

  if (safeItemCount === 0) {
    return "Contains Gluten";
  }

  return "Verified Menu Items";
}

function deriveRestaurantSafetyRating(menuItems: SampleMenuItem[]) {
  const verifiedSafeCount = menuItems.filter(
    (item) => item.status === "Verified Safe"
  ).length;
  const saferCount = menuItems.filter(
    (item) => item.safetyLevel === "Celiac-Safer"
  ).length;

  const ratio = menuItems.length === 0 ? 0 : verifiedSafeCount / menuItems.length;
  const bonus = saferCount > 0 ? 0.2 : 0;

  return Number((3 + ratio * 1.8 + bonus).toFixed(1));
}

function buildCautionSummary(menuItems: SampleMenuItem[]) {
  const containsGlutenCount = menuItems.filter(
    (item) => item.status === "Not Verified (Contains Gluten)"
  ).length;

  if (containsGlutenCount > 0) {
    return "This menu is mixed, so check the specific dish before treating the restaurant as a safe default.";
  }

  return "This imported menu leans safer, but shared prep and ingredient changes should still be confirmed when needed.";
}

function buildDetailSummary(
  restaurantName: string,
  menuItems: SampleMenuItem[]
) {
  const safeItemCount = menuItems.filter(
    (item) => item.status === "Verified Safe"
  ).length;

  return `${restaurantName} currently has ${menuItems.length} imported menu item${
    menuItems.length === 1 ? "" : "s"
  }, with ${safeItemCount} marked gluten-free in the shared dataset.`;
}

function mergeMenuItems(
  existingMenuItems: SampleMenuItem[],
  importedMenuItems: SampleMenuItem[]
) {
  const menuItemsByName = new Map<string, SampleMenuItem>();

  existingMenuItems.forEach((menuItem) => {
    menuItemsByName.set(normalizeText(menuItem.name), menuItem);
  });

  importedMenuItems.forEach((menuItem) => {
    menuItemsByName.set(normalizeText(menuItem.name), menuItem);
  });

  return Array.from(menuItemsByName.values()).sort((menuItemA, menuItemB) => {
    const statusScoreA = menuItemA.status === "Verified Safe" ? 0 : 1;
    const statusScoreB = menuItemB.status === "Verified Safe" ? 0 : 1;

    if (statusScoreA !== statusScoreB) {
      return statusScoreA - statusScoreB;
    }

    return menuItemA.name.localeCompare(menuItemB.name);
  });
}

function deriveNeighborhood(addressLine: string) {
  if (addressLine.includes("University")) {
    return "University Boulevard";
  }

  if (addressLine.includes("McFarland")) {
    return "McFarland Corridor";
  }

  if (addressLine.includes("Greensboro")) {
    return "Greensboro Avenue";
  }

  if (addressLine.includes("Jack Warner")) {
    return "Riverfront";
  }

  if (addressLine.includes("Skyland")) {
    return "Skyland Boulevard";
  }

  if (addressLine.includes("25th")) {
    return "Midtown Tuscaloosa";
  }

  if (addressLine.includes("7th")) {
    return "West End";
  }

  return "Tuscaloosa";
}

function getApproximateCoordinates(batch: ImportedRestaurantBatch) {
  const corridorCenter = getCorridorCenter(batch.address);
  const hash = hashString(`${batch.restaurantName}|${batch.address}|${batch.zip}`);
  const latitudeOffset = (((hash % 1000) / 1000) - 0.5) * 0.018;
  const longitudeOffset = ((((Math.floor(hash / 1000) % 1000) / 1000) - 0.5) * 0.024);

  return {
    latitude: Number((corridorCenter.latitude + latitudeOffset).toFixed(6)),
    longitude: Number((corridorCenter.longitude + longitudeOffset).toFixed(6))
  };
}

function getCorridorCenter(addressLine: string) {
  if (addressLine.includes("University")) {
    return { latitude: 33.2098, longitude: -87.5538 };
  }

  if (addressLine.includes("McFarland")) {
    return { latitude: 33.2064, longitude: -87.5312 };
  }

  if (addressLine.includes("Greensboro")) {
    return { latitude: 33.2005, longitude: -87.5614 };
  }

  if (addressLine.includes("Jack Warner")) {
    return { latitude: 33.2148, longitude: -87.5611 };
  }

  if (addressLine.includes("Skyland")) {
    return { latitude: 33.1874, longitude: -87.5254 };
  }

  if (addressLine.includes("25th")) {
    return { latitude: 33.1962, longitude: -87.5639 };
  }

  if (addressLine.includes("7th")) {
    return { latitude: 33.2063, longitude: -87.5587 };
  }

  return TUSCALOOSA_CENTER;
}

function hashString(value: string) {
  let hash = 0;

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash;
}

function estimateDistanceMiles(latitude: number, longitude: number) {
  return Number(
    getDistanceMiles(TUSCALOOSA_CENTER, {
      latitude,
      longitude
    }).toFixed(1)
  );
}

function getDistanceMiles(
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
) {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const latitudeA = toRadians(origin.latitude);
  const latitudeB = toRadians(destination.latitude);
  const haversineDistance =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitudeA) *
      Math.cos(latitudeB) *
      Math.sin(longitudeDelta / 2) ** 2;

  return (
    2 *
    earthRadiusMiles *
    Math.asin(Math.min(1, Math.sqrt(haversineDistance)))
  );
}

function getFullAddressKey(fullAddress: string) {
  const [addressLine = "", city = "", stateAndZip = ""] = fullAddress.split(",");
  const state = stateAndZip.trim().split(/\s+/)[0] ?? "";

  return getAddressKey(addressLine.trim(), city.trim(), state);
}

function getAddressKey(addressLine: string, city: string, state: string) {
  return [
    normalizeText(addressLine),
    normalizeText(city),
    normalizeText(state)
  ].join("|");
}

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatPositiveDietarySignals(
  dietaryAttributes: DietaryAttributes
) {
  const signals: string[] = [];

  if (dietaryAttributes.glutenFree === "yes") {
    signals.push("Gluten-Free");
  }

  if (dietaryAttributes.soyFree === "yes") {
    signals.push("Soy-Free");
  }

  if (dietaryAttributes.nutFree === "yes") {
    signals.push("Nut-Free");
  }

  if (dietaryAttributes.kosher === "yes") {
    signals.push("Kosher");
  }

  if (dietaryAttributes.halal === "yes") {
    signals.push("Halal");
  }

  return signals;
}

export function inferMenuCourseType(
  menuItem: Pick<SampleMenuItem, "name" | "searchTags">
): MenuCourseType {
  const searchText = [menuItem.name, ...menuItem.searchTags]
    .join(" ")
    .toLowerCase();
  const appetizerKeywords = [
    "appetizer",
    "small plate",
    "small plates",
    "starter",
    "shareable",
    "shared plate",
    "shared plates",
    "dip",
    "hummus",
    "baba ghanoush",
    "dates",
    "mushroom",
    "mushrooms",
    "spring roll",
    "spring rolls",
    "fries",
    "mozzarella sticks",
    "sticks",
    "corn dip",
    "bites",
    "lollipops"
  ];

  return appetizerKeywords.some((keyword) => searchText.includes(keyword))
    ? "Appetizer"
    : "Meal";
}
