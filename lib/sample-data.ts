export type VerificationBadge =
  | "Kitchen Certified"
  | "User Vetted"
  | "Laboratory Tested";

export type SafetyLevel =
  | "Celiac-Safer"
  | "Gluten-Friendly"
  | "Contains Gluten";

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

export const sampleRestaurants: SampleRestaurant[] = [
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
