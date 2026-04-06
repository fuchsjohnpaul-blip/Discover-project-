# Tuscaloosa Sample Data

## Purpose

This file captures the first founder-provided sample dataset for the MVP.

It gives us a realistic starter set of Tuscaloosa restaurants and menu items so we can wire the UI to meaningful records.

## Important Note

The current seed file uses placeholder restaurant address text and shared Tuscaloosa coordinates for now.

That is intentional for MVP wiring. We should replace those placeholders with confirmed restaurant location details before launch.

## Seeded Menu Items

### Jim 'N Nick's BBQ

- `Beef Brisket (No Bun)` -> `Safe (Verified)`
- Why it meets the current standard: treated as verified because the restaurant labels it gluten-free when served without the bun.

### The Sanctuary on 25th

- `Bacon Wrapped Dates` -> `Safe (Verified)`
- Why it meets the current standard: treated as verified because the restaurant labels the item gluten-free.

### Full Moon BBQ

- `Loaded Bar-B-Q Baker` -> `Safe (Verified)`
- Why it meets the current standard: treated as verified because the restaurant labels the item gluten-free.

### Standard Pizza Co.

- `Regular Pepperoni Pizza` -> `Not Safe (Unverified)`
- Why it does not meet the current standard: a regular pizza crust typically contains wheat gluten and no gluten-free claim was provided in the seed input.

### Taco Casa

- `Flour Tortilla Burrito` -> `Not Safe (Unverified)`
- Why it does not meet the current standard: a flour tortilla typically contains wheat gluten and no gluten-free claim was provided in the seed input.

## Seed File

The SQL seed lives at:

`supabase/seeds/20260405_001_tuscaloosa_sample_data.sql`
