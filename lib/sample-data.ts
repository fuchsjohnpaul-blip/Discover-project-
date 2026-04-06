export type SampleRestaurant = {
  slug: string;
  name: string;
  address: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  glutenSafetyCategory: string;
  itemName: string;
  itemStatus: "Verified Safe" | "Not Verified (Contains Gluten)";
  verificationMethod: string;
  confidenceNote: string;
  cautionSummary: string;
  rationale: string;
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
    itemName: "Beef Brisket (No Bun)",
    itemStatus: "Verified Safe",
    verificationMethod: "Restaurant labeled",
    confidenceNote: "Verified from restaurant labeling for the no-bun preparation.",
    cautionSummary: "Ask the staff to confirm no bun and prevent bread cross-contact.",
    rationale:
      "Treated as safe because the restaurant identifies the item as gluten-free when served without the bun."
  },
  {
    slug: "the-sanctuary-on-25th",
    name: "The Sanctuary on 25th",
    address: "1710 25th Ave, Tuscaloosa, AL 35401",
    neighborhood: "Midtown Tuscaloosa",
    latitude: 33.1962121,
    longitude: -87.563875,
    glutenSafetyCategory: "Verified Menu Items",
    itemName: "Bacon Wrapped Dates",
    itemStatus: "Verified Safe",
    verificationMethod: "Restaurant labeled",
    confidenceNote: "Verified from restaurant gluten-free labeling.",
    cautionSummary: "Review ingredients for sauces or garnish if menu prep changes.",
    rationale:
      "Treated as safe because the restaurant labels this item as gluten-free."
  },
  {
    slug: "full-moon-bbq",
    name: "Full Moon Bar-B-Que",
    address: "1434 McFarland Blvd E, Tuscaloosa, AL 35404",
    neighborhood: "McFarland Corridor",
    latitude: 33.1980298,
    longitude: -87.5262153,
    glutenSafetyCategory: "Verified Menu Items",
    itemName: "Loaded Bar-B-Q Baker",
    itemStatus: "Verified Safe",
    verificationMethod: "Restaurant labeled",
    confidenceNote: "Verified from restaurant gluten-free labeling.",
    cautionSummary: "Double-check toppings if menu ingredients rotate.",
    rationale:
      "Treated as safe because the restaurant labels this item as gluten-free."
  },
  {
    slug: "standard-pizza-co",
    name: "The Standard",
    address: "1217 University Blvd, Tuscaloosa, AL 35401",
    neighborhood: "University Boulevard",
    latitude: 33.2107645,
    longitude: -87.5540706,
    glutenSafetyCategory: "Contains Gluten",
    itemName: "Regular Pepperoni Pizza",
    itemStatus: "Not Verified (Contains Gluten)",
    verificationMethod: "No GF labeling",
    confidenceNote: "No gluten-free claim is present for the regular crust.",
    cautionSummary: "Standard crust contains wheat, so this item should be avoided.",
    rationale:
      "Marked not safe because a regular pizza crust typically contains wheat gluten and no gluten-free claim was provided."
  },
  {
    slug: "taco-casa",
    name: "Taco Casa",
    address: "603 15th St E, Tuscaloosa, AL 35401",
    neighborhood: "15th Street East",
    latitude: 33.1970196,
    longitude: -87.5284996,
    glutenSafetyCategory: "Contains Gluten",
    itemName: "Flour Tortilla Burrito",
    itemStatus: "Not Verified (Contains Gluten)",
    verificationMethod: "No GF labeling",
    confidenceNote: "No gluten-free claim is present for the flour tortilla.",
    cautionSummary: "Flour tortillas contain wheat, so this item should be avoided.",
    rationale:
      "Marked not safe because a flour tortilla typically contains wheat gluten and no gluten-free claim was provided."
  }
];
