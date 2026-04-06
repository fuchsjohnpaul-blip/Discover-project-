export type SampleMenuItem = {
  name: string;
  status: "Verified Safe" | "Not Verified (Contains Gluten)";
  verificationMethod: string;
  confidenceNote: string;
  rationale: string;
};

export type SampleRestaurant = {
  slug: string;
  name: string;
  address: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  glutenSafetyCategory: string;
  menuItems: SampleMenuItem[];
  cautionSummary: string;
  detailSummary: string;
};

export const sampleRestaurants: SampleRestaurant[] = [
  {
    slug: "jim-n-nicks-bbq",
    name: "Jim 'N Nick's Bar-B-Q",
    address: "305 21st Ave, Tuscaloosa, AL 35401",
    neighborhood: "Downtown Tuscaloosa",
    latitude: 33.2126591,
    longitude: -87.5646023,
    glutenSafetyCategory: "Verified Menu Items",
    menuItems: [
      {
        name: "Beef Brisket (No Bun)",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote:
          "Verified from restaurant labeling for the no-bun preparation.",
        rationale:
          "Treated as safe because the restaurant identifies the item as gluten-free when served without the bun."
      },
      {
        name: "Pulled Pork Plate",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote: "Menu labeling suggests a gluten-free plated option.",
        rationale:
          "Included as a safe sample item because this style of plated barbecue often avoids bread by default when ordered without toast."
      },
      {
        name: "Macaroni and Cheese",
        status: "Not Verified (Contains Gluten)",
        verificationMethod: "No GF labeling",
        confidenceNote: "No gluten-free claim is present for this side item.",
        rationale:
          "Flagged as not verified because ingredient details and preparation standards were not provided."
      }
    ],
    cautionSummary:
      "Ask the staff to confirm no bun and prevent bread cross-contact on shared prep surfaces.",
    detailSummary:
      "A downtown barbecue option where protein-forward choices are the most promising gluten-free picks."
  },
  {
    slug: "the-sanctuary-on-25th",
    name: "The Sanctuary on 25th",
    address: "1710 25th Ave, Tuscaloosa, AL 35401",
    neighborhood: "Midtown Tuscaloosa",
    latitude: 33.1962121,
    longitude: -87.563875,
    glutenSafetyCategory: "Verified Menu Items",
    menuItems: [
      {
        name: "Bacon Wrapped Dates",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote: "Verified from restaurant gluten-free labeling.",
        rationale:
          "Treated as safe because the restaurant labels this item as gluten-free."
      },
      {
        name: "House Salad",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote: "Gluten-free labeling appears to cover this lighter option.",
        rationale:
          "Included as a safe sample item because salads are often explicitly labeled when the dressing and toppings meet the standard."
      },
      {
        name: "Seasonal Flatbread",
        status: "Not Verified (Contains Gluten)",
        verificationMethod: "No GF labeling",
        confidenceNote: "No gluten-free claim is present for this flatbread.",
        rationale:
          "Flagged as not verified because flatbread commonly contains wheat unless a gluten-free crust is stated."
      }
    ],
    cautionSummary:
      "Review sauces, garnish, and seasonal changes if the kitchen updates ingredients.",
    detailSummary:
      "A more polished, small-plates style spot where labeled appetizers and lighter dishes stand out."
  },
  {
    slug: "full-moon-bbq",
    name: "Full Moon Bar-B-Que",
    address: "1434 McFarland Blvd E, Tuscaloosa, AL 35404",
    neighborhood: "McFarland Corridor",
    latitude: 33.1980298,
    longitude: -87.5262153,
    glutenSafetyCategory: "Verified Menu Items",
    menuItems: [
      {
        name: "Loaded Bar-B-Q Baker",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote: "Verified from restaurant gluten-free labeling.",
        rationale:
          "Treated as safe because the restaurant labels this item as gluten-free."
      },
      {
        name: "Smoked Turkey Plate",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote: "A plated protein option is a strong candidate when labeled clearly.",
        rationale:
          "Included as a safe sample item because plate-style barbecue items often work better than sandwich-based orders."
      },
      {
        name: "Texas Toast",
        status: "Not Verified (Contains Gluten)",
        verificationMethod: "No GF labeling",
        confidenceNote: "Bread item with no gluten-free claim.",
        rationale:
          "Flagged as not verified because standard toast contains wheat."
      }
    ],
    cautionSummary:
      "Double-check toppings and side swaps if ingredients rotate or sauces change.",
    detailSummary:
      "A barbecue stop where potato and plate-based orders may offer better gluten-free potential than bread-heavy items."
  },
  {
    slug: "standard-pizza-co",
    name: "The Standard",
    address: "1217 University Blvd, Tuscaloosa, AL 35401",
    neighborhood: "University Boulevard",
    latitude: 33.2107645,
    longitude: -87.5540706,
    glutenSafetyCategory: "Contains Gluten",
    menuItems: [
      {
        name: "Regular Pepperoni Pizza",
        status: "Not Verified (Contains Gluten)",
        verificationMethod: "No GF labeling",
        confidenceNote: "No gluten-free claim is present for the regular crust.",
        rationale:
          "Marked not safe because a regular pizza crust typically contains wheat gluten and no gluten-free claim was provided."
      },
      {
        name: "Cheese Pizza Slice",
        status: "Not Verified (Contains Gluten)",
        verificationMethod: "No GF labeling",
        confidenceNote: "Standard slice service does not indicate a gluten-free crust.",
        rationale:
          "Flagged as not verified because standard slice offerings usually rely on the same wheat crust."
      },
      {
        name: "Garden Salad",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote: "Safer when the dressing and toppings remain labeled gluten-free.",
        rationale:
          "Included as a safe sample item because a simple salad is a more plausible gluten-free choice than standard pizza."
      }
    ],
    cautionSummary:
      "Pizza environments often have flour in the air, so even safer options may need extra caution.",
    detailSummary:
      "A pizza-focused restaurant where standard crust items should be treated carefully and non-pizza items may be the better path."
  },
  {
    slug: "taco-casa",
    name: "Taco Casa",
    address: "603 15th St E, Tuscaloosa, AL 35401",
    neighborhood: "15th Street East",
    latitude: 33.1970196,
    longitude: -87.5284996,
    glutenSafetyCategory: "Contains Gluten",
    menuItems: [
      {
        name: "Flour Tortilla Burrito",
        status: "Not Verified (Contains Gluten)",
        verificationMethod: "No GF labeling",
        confidenceNote: "No gluten-free claim is present for the flour tortilla.",
        rationale:
          "Marked not safe because a flour tortilla typically contains wheat gluten and no gluten-free claim was provided."
      },
      {
        name: "Crunchy Taco",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote: "Potentially safer when the shell is corn-based and labeled clearly.",
        rationale:
          "Included as a safe sample item because crunchy taco shells can be a better gluten-free option than flour tortillas when labeled."
      },
      {
        name: "Nachos",
        status: "Verified Safe",
        verificationMethod: "Restaurant labeled",
        confidenceNote: "Safer when chips and toppings remain within labeled gluten-free prep.",
        rationale:
          "Included as a safe sample item because tortilla-chip-based items may better fit a gluten-free pattern than burritos."
      }
    ],
    cautionSummary:
      "Shared prep around flour tortillas can still matter, even when a corn-based option looks safer.",
    detailSummary:
      "A fast-casual taco stop where corn-based items may offer a better gluten-free path than flour tortilla orders."
  }
];
