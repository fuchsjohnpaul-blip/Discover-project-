# Tuscaloosa Sample Data

## Purpose

This file captures the first founder-provided sample dataset for the MVP.

It gives us a realistic starter set of Tuscaloosa restaurants and menu items so we can wire the UI to meaningful records.

## Location Status

The current seed file now includes founder-provided addresses and coordinates for all five sample restaurants.

These details are suitable for MVP wiring and should still be spot-checked before launch.

## Seeded Menu Items

The current sample dataset now includes multiple menu items per restaurant so the detail panel can show a richer list instead of a single item.

### Jim 'N Nick's Bar-B-Q

- `Beef Brisket (No Bun)` -> `Safe (Verified)`
- `Pulled Pork Plate` -> `Safe (Verified)`
- `Macaroni and Cheese` -> `Not Safe (Unverified)`
- Address: `305 21st Ave, Tuscaloosa, AL 35401`
- Why it meets the current standard: the no-bun brisket remains the lead verified item, and the broader set now includes additional safe and not-safe examples for UI wiring.

### The Sanctuary on 25th

- `Bacon Wrapped Dates` -> `Safe (Verified)`
- `House Salad` -> `Safe (Verified)`
- `Seasonal Flatbread` -> `Not Safe (Unverified)`
- Address: `1710 25th Ave, Tuscaloosa, AL 35401`
- Why it meets the current standard: the original labeled item remains, and added items help represent a fuller mixed menu.

### Full Moon Bar-B-Que

- `Loaded Bar-B-Q Baker` -> `Safe (Verified)`
- `Smoked Turkey Plate` -> `Safe (Verified)`
- `Texas Toast` -> `Not Safe (Unverified)`
- Address: `1434 McFarland Blvd E, Tuscaloosa, AL 35404`
- Why it meets the current standard: the original labeled item remains, with additional examples to show both safer and gluten-containing choices.

### The Standard

- `Regular Pepperoni Pizza` -> `Not Safe (Unverified)`
- `Cheese Pizza Slice` -> `Not Safe (Unverified)`
- `Garden Salad` -> `Safe (Verified)`
- Address: `1217 University Blvd, Tuscaloosa, AL 35401`
- Why it does not meet the current standard: pizza remains the clearest not-safe example, while the added salad shows how a restaurant can still have a safer item.

### Taco Casa

- `Flour Tortilla Burrito` -> `Not Safe (Unverified)`
- `Crunchy Taco` -> `Safe (Verified)`
- `Nachos` -> `Safe (Verified)`
- Address: `603 15th St E, Tuscaloosa, AL 35401`
- Why it does not meet the current standard: the flour burrito remains the clear gluten-containing example, while corn-based items provide a richer comparison set.

## Seed File

The SQL seed lives at:

`supabase/seeds/20260405_001_tuscaloosa_sample_data.sql`
