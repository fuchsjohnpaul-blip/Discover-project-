export type DietaryFlagValue = "yes" | "no" | "unknown";

export type ImportedConfidenceLevel = "high" | "medium" | "low";

export type ImportedSourceType =
  | "restaurant_label"
  | "menu_review"
  | "staff_confirmation"
  | "manual_research"
  | "user_list";

export type ImportedMealTuple = [
  dishName: string,
  priceLabel: string | null,
  dietaryFlags: [
    glutenFree: DietaryFlagValue,
    soyFree: DietaryFlagValue,
    nutFree: DietaryFlagValue,
    kosher: DietaryFlagValue,
    halal: DietaryFlagValue
  ],
  confidenceLevel: ImportedConfidenceLevel,
  sourceType: ImportedSourceType,
  notes: string | null,
  lastVerified: string
];

export type ImportedRestaurantBatch = {
  restaurantName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  website: string | null;
  phone: string | null;
  meals: ImportedMealTuple[];
};

export const importedRestaurantBatches: ImportedRestaurantBatch[] = [
  {
    restaurantName: "Southern Ale House",
    address: "1530 McFarland N Blvd",
    city: "Tuscaloosa",
    state: "AL",
    zip: "35406",
    website: null,
    phone: null,
    meals: [
      ["Creekstone Farms Ribeye", null, ["yes", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Balsamic Glaze Salmon", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Southern Fried Seafood", null, ["no", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Creole BBQ Shrimp", null, ["no", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Bacon Wrapped Meatloaf", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Ale House Burger", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Pepper Jelly Burger", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["The Meme Biscuit", null, ["no", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Yard Bird", null, ["no", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Spinach Salad", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Black 'N Bleu Salad", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Southern Caesar", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"]
    ]
  },
  {
    restaurantName: "Urban Bar and Kitchen",
    address: "2321 University Blvd",
    city: "Tuscaloosa",
    state: "AL",
    zip: "35401",
    website: null,
    phone: null,
    meals: [
      ["Buffalo Cauliflower Taco", null, ["no", "no", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Black Bean Burger", null, ["no", "no", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Strawberry Salad", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["House Salad", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Smothered Chicken", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Veggie Plate", null, ["yes", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Salmon", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Shrimp and Grits", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Tilapia", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Chopped Steak", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"]
    ]
  },
  {
    restaurantName: "River",
    address: "1650 Jack Warner Pkwy",
    city: "Tuscaloosa",
    state: "AL",
    zip: "35401",
    website: null,
    phone: null,
    meals: [
      ["BBQ Steak Flatbread", null, ["no", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Lamb Lollipops", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Chicken and Rice", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Duck Pasta", null, ["no", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Salmon", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Alabama Catfish", null, ["yes", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Prime Steaks", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Caprese Flatbread", null, ["no", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Fresh Fish", null, ["yes", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Shrimp and Grits", null, ["yes", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Tuna", null, ["yes", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"]
    ]
  },
  {
    restaurantName: "Unique Mediterranean Pizza",
    address: "1006 7th Ave",
    city: "Tuscaloosa",
    state: "AL",
    zip: "35401",
    website: null,
    phone: null,
    meals: [
      ["Hummus and Pita", null, ["no", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Baba Ghanoush", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Greek Salad", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Gyro Salad", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Cheese Pizza", null, ["no", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Rice", null, ["yes", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Gyro Wraps", null, ["no", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Meat Lovers Pizza", null, ["no", "no", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Pepperoni Pizza", null, ["no", "no", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Rice Pudding", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Baklava", null, ["no", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"]
    ]
  },
  {
    restaurantName: "FIVE",
    address: "1650 Jack Warner Pkwy",
    city: "Tuscaloosa",
    state: "AL",
    zip: "35401",
    website: null,
    phone: null,
    meals: [
      ["Chicken Bowl", null, ["yes", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Pancakes", null, ["no", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Shrimp and Grits", null, ["yes", "yes", "no", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["River Breakfast", null, ["no", "yes", "no", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Steak Fajita Bowl", null, ["no", "yes", "no", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Cast Iron Bowl", null, ["yes", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Steak Frites", null, ["no", "yes", "no", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Farm Salad", null, ["yes", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Farro Bowl", null, ["no", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Biscuit and Gravy", null, ["no", "yes", "no", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Breakfast Board", null, ["yes", "yes", "no", "yes", "no"], "high", "user_list", null, "2026-04-09"]
    ]
  },
  {
    restaurantName: "Logan's Roadhouse",
    address: "1511 Skyland E Blvd",
    city: "Tuscaloosa",
    state: "AL",
    zip: "35405",
    website: null,
    phone: null,
    meals: [
      ["Salmon", null, ["yes", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Steak Skewers", null, ["yes", "yes", "yes", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Meatloaf", null, ["yes", "yes", "yes", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Surf and Turf", null, ["no", "yes", "yes", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Country Fried Steak", null, ["yes", "yes", "no", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Grilled Shrimp", null, ["yes", "yes", "no", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Crab Cakes", null, ["yes", "yes", "no", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Cheese Burger", null, ["no", "yes", "no", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Grilled Chicken", null, ["yes", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Chicken Salad", null, ["yes", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Wedge Salad", null, ["yes", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"]
    ]
  },
  {
    restaurantName: "The Sanctuary",
    address: "1710 25th Ave",
    city: "Tuscaloosa",
    state: "AL",
    zip: "35401",
    website: null,
    phone: null,
    meals: [
      ["Stuffed Mushrooms", null, ["yes", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Bacon Wrapped Dates", null, ["yes", "yes", "no", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Lobster Mac and Cheese", null, ["yes", "yes", "yes", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Pork Tacos", null, ["yes", "yes", "no", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Cheese Burger", null, ["yes", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Steak Tacos", null, ["yes", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Rojo Chicken Tacos", null, ["yes", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Fall Salad", null, ["yes", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Wedge Salad", null, ["yes", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Street Corn Dip", null, ["yes", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Cheese Burger Sliders", null, ["yes", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"]
    ]
  },
  {
    restaurantName: "The Rabbit Hole",
    address: "1407 University Blvd",
    city: "Tuscaloosa",
    state: "AL",
    zip: "35401",
    website: null,
    phone: null,
    meals: [
      ["Rabbit Hole Tacos", null, ["no", "no", "no", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Fish & Chips", null, ["no", "yes", "no", "no", "unknown"], "high", "user_list", null, "2026-04-09"],
      ["Roasted Delicata Squash Bowl", null, ["yes", "yes", "no", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Chicken Milanese", null, ["no", "yes", "no", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Pan Seared Duck Breast", null, ["no", "yes", "no", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Hanger Steak", null, ["no", "yes", "yes", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Braised Short Rib", null, ["no", "no", "no", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Stuffed Rabbit Roulade", null, ["no", "yes", "yes", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Baked Mac & Cheese", null, ["yes", "no", "no", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["The Silver Fox", null, ["yes", "yes", "no", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["The Secret Agent", null, ["yes", "yes", "no", "no", "no"], "high", "user_list", null, "2026-04-09"]
    ]
  },
  {
    restaurantName: "The Lookout",
    address: "111 Greensboro Ave",
    city: "Tuscaloosa",
    state: "AL",
    zip: "35401",
    website: null,
    phone: null,
    meals: [
      ["Cheese Fries", null, ["no", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Mozzarella Sticks", null, ["no", "no", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Cheese Burger", null, ["no", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Fish Plate", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Steak Plate", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Fish Tacos", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Steak Tacos", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Chicken Sandwich", null, ["no", "no", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["BBQ Sandwich", null, ["no", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["House Salad", null, ["yes", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Chicken Salad", null, ["yes", "no", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"]
    ]
  },
  {
    restaurantName: "Avenue Pub",
    address: "2230 University Blvd",
    city: "Tuscaloosa",
    state: "AL",
    zip: "35401",
    website: null,
    phone: null,
    meals: [
      ["Thai Nachos", null, ["yes", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Bacon Burger", null, ["no", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Pimento Cheese BLT", null, ["no", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Pork Ribeye", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Shrimp and Grits", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Salmon Hash", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Muchacho Shrimp", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Steak Sandwich", null, ["yes", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Fried Fish", null, ["yes", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Grilled Pork", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"]
    ]
  },
  {
    restaurantName: "De Palma's",
    address: "2300 University Blvd",
    city: "Tuscaloosa",
    state: "AL",
    zip: "35401",
    website: null,
    phone: null,
    meals: [
      ["Pizzarotti", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Spinach Salad", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Gorgonzola Salad", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Lasagna", null, ["no", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Pasta DePalma", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Caesar Salad", null, ["no", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Shrimp Scampi", null, ["yes", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["The Gorgonzola Filet", null, ["yes", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Veal Marsala", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Veal Scaloppine", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Filetto Sicilliano", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"]
    ]
  },
  {
    restaurantName: "Crimson Tap House",
    address: "2107 University Blvd",
    city: "Tuscaloosa",
    state: "AL",
    zip: "35401",
    website: null,
    phone: null,
    meals: [
      ["Rohni Bites", null, ["yes", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Wings", null, ["yes", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["The Tua Pizza", null, ["no", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Shrimp and Grits", null, ["yes", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Fish and Chips", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Burgers", null, ["no", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["French Dip", null, ["no", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["PoBoy", null, ["no", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Philly Cheese Steak", null, ["no", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Tilapia", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Shrimp", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"]
    ]
  },
  {
    restaurantName: "Jr. Crickets",
    address: "1130 University Blvd suite B-6",
    city: "Tuscaloosa",
    state: "AL",
    zip: "35401",
    website: null,
    phone: null,
    meals: [
      ["Buffalo Chicken Wrap", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Veggie Wrap", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Chicken Breast Sandwich", null, ["no", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Cricket Burger", null, ["no", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Chicken Philly", null, ["no", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Grilled Hot Dog", null, ["no", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["BBQ Pork Ribs", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Seafood Basket", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Shrimp Platter", null, ["yes", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Funnel Cakes", null, ["no", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Turkey Burger", null, ["no", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"]
    ]
  },
  {
    restaurantName: "Milano's",
    address: "1301 McFarland Blvd NE",
    city: "Tuscaloosa",
    state: "AL",
    zip: "35406",
    website: null,
    phone: null,
    meals: [
      ["Grilled Salmon", null, ["yes", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Shrimp Pesto", null, ["no", "yes", "yes", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Veal Aristocat", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Stromboli", null, ["no", "yes", "no", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Tortellini", null, ["yes", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Spaghetti w/ Meatballs", null, ["no", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Chicken Piccata", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Lasagna", null, ["yes", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Veggie Pizza", null, ["yes", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Tiramisu", null, ["yes", "yes", "yes", "yes", "no"], "high", "user_list", null, "2026-04-09"],
      ["Ribeye Steak", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"]
    ]
  },
  {
    restaurantName: "Soul Out",
    address: "3801 Greensboro Ave Suite C",
    city: "Tuscaloosa",
    state: "AL",
    zip: "35405",
    website: null,
    phone: null,
    meals: [
      ["Cheese Burger", null, ["no", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Club Sandwich", null, ["no", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Pork Chops", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Catfish", null, ["no", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Hamburger Steak", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Baked Chicken", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Shrimp and Grits", null, ["yes", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Wings", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Chicken Gizzards", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Philly Cheese Steak", null, ["no", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Chicken Tenders", null, ["no", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"]
    ]
  },
  {
    restaurantName: "Chuck's Fish",
    address: "508 Greensboro Ave",
    city: "Tuscaloosa",
    state: "AL",
    zip: "35401",
    website: null,
    phone: null,
    meals: [
      ["Seafood Gumbo", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Spring Rolls", null, ["no", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Uptown Shrimp", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Kimchi Brussels", null, ["yes", "yes", "yes", "no", "no"], "high", "user_list", null, "2026-04-09"],
      ["Tuna Poke Nachos", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Chicken Scaloppine", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["New York Strip", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Ribeye", null, ["yes", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Fried Shrimp Plate", null, ["no", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Parmesan-Crusted Grouper", null, ["yes", "yes", "yes", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Stuffed Shrimp", null, ["yes", "yes", "yes", "no", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Filet of Beef", null, ["yes", "yes", "no", "no", "yes"], "high", "user_list", null, "2026-04-09"]
    ]
  },
  {
    restaurantName: "Zoe's and Marky's Kitchen",
    address: "1665 McFarland Blvd N",
    city: "Tuscaloosa",
    state: "AL",
    zip: "35406",
    website: null,
    phone: null,
    meals: [
      ["Chicken Roll-up", null, ["yes", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Greek Pita", null, ["yes", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Gruben", null, ["yes", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Chicken and Slaw Pita", null, ["yes", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Pita Pizza", null, ["yes", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Greek Salad", null, ["yes", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Grilled Cheese", null, ["no", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Pimento Cheese Sandwich", null, ["no", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Lean Turkey Pita", null, ["yes", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Chicken Kabobs", null, ["yes", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"],
      ["Quesadilla", null, ["no", "yes", "no", "yes", "yes"], "high", "user_list", null, "2026-04-09"]
    ]
  }
];
