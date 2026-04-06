# Tuscaloosa Sample Data

## Purpose

This file captures the first founder-provided sample dataset for the MVP.

It gives us a realistic starter set of Tuscaloosa restaurants and menu items so we can wire the UI to meaningful records.

## Location Status

The current seed file now includes founder-provided addresses and coordinates for all five sample restaurants.

These details are suitable for MVP wiring and should still be spot-checked before launch.

## Seeded Menu Items

### Jim 'N Nick's Bar-B-Q

- `Beef Brisket (No Bun)` -> `Safe (Verified)`
- Address: `305 21st Ave, Tuscaloosa, AL 35401`
- Why it meets the current standard: treated as verified because the restaurant labels it gluten-free when served without the bun.

### The Sanctuary on 25th

- `Bacon Wrapped Dates` -> `Safe (Verified)`
- Address: `1710 25th Ave, Tuscaloosa, AL 35401`
- Why it meets the current standard: treated as verified because the restaurant labels the item gluten-free.

### Full Moon Bar-B-Que

- `Loaded Bar-B-Q Baker` -> `Safe (Verified)`
- Address: `1434 McFarland Blvd E, Tuscaloosa, AL 35404`
- Why it meets the current standard: treated as verified because the restaurant labels the item gluten-free.

### The Standard

- `Regular Pepperoni Pizza` -> `Not Safe (Unverified)`
- Address: `1217 University Blvd, Tuscaloosa, AL 35401`
- Why it does not meet the current standard: a regular pizza crust typically contains wheat gluten and no gluten-free claim was provided in the seed input.

### Taco Casa

- `Flour Tortilla Burrito` -> `Not Safe (Unverified)`
- Address: `603 15th St E, Tuscaloosa, AL 35401`
- Why it does not meet the current standard: a flour tortilla typically contains wheat gluten and no gluten-free claim was provided in the seed input.

## Seed File

The SQL seed lives at:

`supabase/seeds/20260405_001_tuscaloosa_sample_data.sql`
