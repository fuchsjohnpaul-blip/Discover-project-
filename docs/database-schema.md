# Database Schema Notes

## Goal

The database should support a curated, trust-first launch in Tuscaloosa.

That means the schema needs to do more than store restaurants. It also needs to capture:

- Menu items
- Verification evidence
- Review status
- Publishing control
- Confidence and caution notes

## Main Tables

### `restaurants`

Stores the restaurant itself, including:

- Name and slug
- Address and coordinates
- Gluten-free category
- Overall confidence level
- Cross-contact risk
- Review and publish status

For MVP behavior, the app should only query restaurants where:

- `review_status = 'approved'`
- `is_published = true`

### `restaurant_hours`

Stores open hours by day so the app can later support "open now" style filters.

### `menu_sections`

Lets menu items be grouped into meaningful sections like breakfast, mains, desserts, or drinks.

### `menu_items`

Stores individual dishes and their gluten-related status.

Important fields include:

- `gluten_status`
- `confidence_level`
- `caution_notes`
- `is_published`

Menu items should only appear publicly when they are approved for a published restaurant workflow.

### `verification_sources`

Stores the evidence behind a restaurant or menu item.

Examples:

- Restaurant website
- Menu PDF
- Direct contact note
- Internal review

### `verification_records`

Stores the human or system review outcome for a restaurant or item.

This helps us separate raw source material from the actual product decision about what should be shown.

## Why This Schema Fits The MVP

- It supports a small curated launch set
- It allows manual review before publishing
- It makes confidence visible in the data model
- It creates a clean path toward admin tooling later

## Public Data Rule

When we build the app queries, the public-facing experience should only read records that are ready for release.

At minimum:

- Restaurants must be `approved` and `is_published = true`
- Menu items must be `is_published = true`
- Menu items should only be shown for published restaurants

## Current Migration File

The first draft schema lives at:

`supabase/migrations/20260405_001_initial_schema.sql`

## Likely Next Schema Step

The next iteration will probably add starter seed data for a few example Tuscaloosa restaurants so we can start wiring the UI to real records.
