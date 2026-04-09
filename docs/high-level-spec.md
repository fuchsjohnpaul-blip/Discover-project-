# Dietary-Safe Map App High-Level Spec

## Working Product Vision

Build a web application that helps people with dietary restrictions discover restaurants they can trust.

The first version will focus on gluten-free dining and will prioritize clarity, confidence, and ease of use over trying to cover every dietary need at once.

The product should feel primarily like a discovery-oriented dining app, with strong safety information built directly into the browsing experience.

## Core Problem

Existing apps often label restaurants as "gluten-free" without confirming which menu items are actually safe.

This product should go further by connecting restaurant discovery with menu-level verification, so users can make decisions with more confidence.

## Initial Target User

People who need or strongly prefer gluten-free food, including:

- People with celiac disease
- People with gluten sensitivity
- Parents, partners, or caregivers helping someone eat safely
- Travelers trying to find trustworthy nearby options quickly

## Launch Geography

The first launch market will be `Tuscaloosa, Alabama`.

This means the MVP should optimize for depth and trust in one city instead of shallow coverage everywhere.

Benefits of this approach:

- Higher data quality in the first release
- Easier manual verification of restaurant and menu data
- More realistic MVP scope
- Stronger local testing before expanding to other cities

## First Version Goal

Help a user open the app, scroll through gluten-free-friendly meal options in Tuscaloosa, filter by dietary safety level, and tap into a restaurant to view verified gluten-free menu items and supporting details.

The experience should feel inviting and useful for exploring where to eat, not only for checking risk.

The main home tab should feel like an infinite-scroll-style feed of approved meal options, with the map and restaurant context visible as supporting discovery tools.

## Core User Experience

### 1. Map Interface

The app should show a map-based interface similar to common consumer map apps.

For the MVP, the map should support the featured restaurant experience rather than dominate the first screen.

Users should be able to:

- See restaurants near their current location
- Pan and zoom the map
- Tap a restaurant marker to open a detail view
- Submit a natural-language local search and watch the map fit to all returned markers
- Hover or tap a result card and highlight the matching map marker
- Tap a map marker and jump the matching result card into view

### 2. Search and Filters

Users should be able to search by place or area and filter restaurants by dietary safety level.

The filters should help users narrow choices quickly while still encouraging exploration.

The home feed should be easy to scan and feel more like a social-style stream of meal options than a static restaurant directory.

The main search interaction should also support natural-language meal requests through a chat-style interface. For example, a user should be able to type a phrase like `Show me gluten-free pasta options near me with Celiac-safe certification` and see structured results instead of a text-only answer.

The app should parse that request into useful product signals such as:

- Dietary tag
- Cuisine or dish keyword
- Trust or certification constraint
- Location intent such as `near me`

Instead of replying with a paragraph, the assistant should trigger a dynamic result tray made of scrollable meal cards.

The live tray and the live map should always be populated from the same synchronized result array so there is no discrepancy between the visible list and the visible pins.

Early filters may include:

- `100% Gluten-Free`
- `Dedicated Gluten-Free Menu`
- `Gluten-Free Options Available`
- `Verified Menu Items Only`
- `Kitchen Certified`
- `Use Extra Caution`

### 3. Restaurant Detail View

When a user selects a restaurant, the app should show:

- Specific verified gluten-free menu items
- Restaurant name
- Location
- Dietary-safety category
- Summary of why it appears in results
- Important safety notes or caveats when available

The detail view should lead with the verified gluten-free items first, then provide the restaurant overview and supporting context underneath.

Important caution information should still be available, but it should live in a smaller supporting section so the overall experience stays clean and easy to browse.

The detail view should balance practical safety information with the feeling of discovering a place worth visiting.

### 3A. Dynamic Result Cards

When the assistant returns matches, each meal card should feel useful at a glance.

Each card should aim to show:

- Dish name
- Price
- Restaurant name
- Distance or location badge
- A direct directions link to Google Maps or Apple Maps
- Verification icons such as `Kitchen Certified`, `User Vetted`, or `Laboratory Tested`
- Safety rating or confidence indicators
- Estimated prep speed when available

For the synchronized local search experience, the result system should also:

- Clear old markers before every new search
- Prefer businesses currently open when `Open Now` is enabled
- Show a clear `No results found in this area` state instead of leaving the map blank
- Stack cleanly on smaller screens while staying side-by-side on larger screens

Broad searches should be able to reorganize the tray by useful sub-categories such as:

- `Top Rated`
- `Speed`
- `Safety Level`

### 4. Verification Layer

This is the main differentiator of the product.

Instead of relying only on a broad restaurant tag, the app should reference menu data and determine whether specific items appear to be dietary-safe.

In the first version, "verified" should mean we have structured evidence from one or more trusted sources such as:

- Restaurant menu text
- Restaurant-provided dietary labels
- Internal review logic or classification rules
- Human review or admin approval for higher-confidence results

For the MVP, a menu item can count as verified when the restaurant itself labels it gluten-free, even if we have not independently reviewed that specific item.

We should still be transparent about the basis for that verification.

## Product Principles

- Safety-first: avoid overstating confidence
- Discovery-friendly: make browsing feel enjoyable and useful
- Transparent: explain why an item is shown as safe
- Simple: make it easy for non-technical users to understand
- Trustworthy: clearly separate verified items from uncertain ones
- Expandable: design the system so other dietary restrictions can be added later

## Product Positioning

For the MVP, the app should be positioned as a dining discovery product first, with trustworthy gluten-free intelligence as its advantage.

That means:

- The map and browsing experience should feel welcoming and easy to explore
- The homepage should lead with a curated meal feed sourced from approved restaurants
- Restaurants should still feel appealing, not clinical
- Safety information should be clearly available without making the interface feel overly medical
- Verification and caution notes remain essential, but they support discovery rather than dominate it
- Caution details should be visually quieter than the primary verified menu content

## Suggested MVP Scope

### In Scope

- Account-free browsing for the first version
- Map view with nearby restaurants
- Search by location
- Filters for gluten-free suitability
- Restaurant detail panel or modal
- Structured menu-item display
- Basic verification/confidence labeling
- Admin-managed or seeded restaurant/menu dataset for the earliest release
- A small hand-picked list of trusted Tuscaloosa restaurants curated carefully before launch
- Only restaurants that have been manually reviewed and approved should appear in the app
- Menu items may appear as verified based on restaurant-provided gluten-free labeling, even without independent item-by-item review

### Out of Scope for the Earliest Version

- Full crowdsourced reviews
- Reservations
- Online ordering
- Social features
- Support for all dietary restrictions on day one
- Fully automated ingestion from every restaurant source

## Recommended Technical Direction

### Frontend

- Next.js
- TypeScript
- Shadcn/ui

### Backend and Database

- Supabase for database and storage needs now, with room for authentication later if needed

### Deployment

- Vercel

### Mapping

The MVP will use `Leaflet` with `OpenStreetMap` tiles as the mapping foundation so the map can stay interactive without requiring paid map API setup.

## Recommended Early Data Model

We will refine this later, but the first version will likely need:

- `restaurants`
- `locations`
- `menus`
- `menu_items`
- `dietary_tags`
- `verification_records`
- `sources`

This structure will let us distinguish between a restaurant being generally friendly to a diet and a specific menu item being verified as safe.

## MVP Data Strategy

The first release will favor trust over coverage.

Instead of trying to include every restaurant in Tuscaloosa, we will begin with a smaller curated set of restaurants that we review carefully.

This means:

- We only show restaurants we have actively reviewed
- We only publish restaurants after manual approval
- We prefer fewer results with higher confidence
- Menu items should be tied to source evidence wherever possible
- We can manually update records when restaurant menus change

This curated approach is a strong fit for the MVP because it reduces risk, improves trust, and gives us a manageable operational starting point.

## Important Trust and Safety Notes

Because this app relates to health and dietary safety, we should be careful with wording.

The product should avoid implying medical certainty unless a standard truly supports that claim.

Examples of safer wording:

- `Verified from menu data`
- `Restaurant labels this item as gluten-free`
- `Verified based on restaurant labeling`
- `Requires extra caution`
- `Not enough evidence yet`

## Proposed Phased Plan

### Phase 1: Foundation

- Create product spec
- Set up Next.js app with TypeScript and shadcn/ui
- Set up Supabase project and schema
- Prepare the Leaflet + OpenStreetMap map integration
- Build basic map and restaurant detail experience

### Phase 2: Verified Dining MVP

- Add seeded restaurant and menu data
- Curate the first trusted Tuscaloosa restaurant set
- Build verification pipeline and confidence labels
- Add filters for gluten-free categories
- Improve restaurant detail panel with verified menu items

### Phase 3: Expansion

- Add user accounts and saved places if later needed
- Add more dietary restrictions
- Add admin review workflows
- Improve source ingestion and confidence scoring

## Open Product Questions

These are high-level questions I can help you answer as we shape the product:

1. Should the first launch focus on one city/region or be more general?
2. Do you want the app to feel more like a discovery tool, a safety tool, or both?
3. How strict should the first version be about what counts as "verified"?
4. Should we add accounts later, or keep the product entirely public for a long time?
5. How prominent should map interactions be compared with the featured restaurant list?

## Immediate Next Step

After this spec is approved, the next iteration should set up the actual application foundation:

- Initialize a Next.js app with TypeScript
- Add shadcn/ui
- Prepare Supabase integration
- Define the first-pass database schema
- Create the first homepage and map layout shell
