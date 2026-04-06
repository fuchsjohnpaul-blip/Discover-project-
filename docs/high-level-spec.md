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

Help a user open the app, see gluten-free-friendly restaurants in Tuscaloosa on a map, filter by dietary safety level, and tap into a restaurant to view verified gluten-free menu items and supporting details.

The experience should feel inviting and useful for exploring where to eat, not only for checking risk.

## Core User Experience

### 1. Map Interface

The app should show a map-based interface similar to common consumer map apps.

Users should be able to:

- See restaurants near their current location
- Pan and zoom the map
- Tap a restaurant marker to open a detail view

### 2. Search and Filters

Users should be able to search by place or area and filter restaurants by dietary safety level.

The filters should help users narrow choices quickly while still encouraging exploration.

Early filters may include:

- `100% Gluten-Free`
- `Dedicated Gluten-Free Menu`
- `Gluten-Free Options Available`
- `Verified Menu Items Only`

### 3. Restaurant Detail View

When a user selects a restaurant, the app should show:

- Restaurant name
- Location
- Dietary-safety category
- Summary of why it appears in results
- Specific verified gluten-free menu items
- Important safety notes or caveats when available

The detail view should balance practical safety information with the feeling of discovering a place worth visiting.

### 4. Verification Layer

This is the main differentiator of the product.

Instead of relying only on a broad restaurant tag, the app should reference menu data and determine whether specific items appear to be dietary-safe.

In the first version, "verified" should mean we have structured evidence from one or more trusted sources such as:

- Restaurant menu text
- Restaurant-provided dietary labels
- Internal review logic or classification rules
- Human review or admin approval for higher-confidence results

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
- Restaurants should still feel appealing, not clinical
- Safety information should be clearly available without making the interface feel overly medical
- Verification and caution notes remain essential, but they support discovery rather than dominate it

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
- Only restaurants and menu items that have been manually reviewed and approved should appear in the app

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

- Supabase for database, authentication, and storage needs

### Deployment

- Vercel

### Mapping

We will likely use a modern web mapping provider such as Mapbox or Google Maps, but we should choose this deliberately because pricing, developer experience, and styling flexibility differ.

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
- `Requires extra caution`
- `Not enough evidence yet`

## Proposed Phased Plan

### Phase 1: Foundation

- Create product spec
- Set up Next.js app with TypeScript and shadcn/ui
- Set up Supabase project and schema
- Choose mapping provider
- Build basic map and restaurant detail experience

### Phase 2: Verified Dining MVP

- Add seeded restaurant and menu data
- Curate the first trusted Tuscaloosa restaurant set
- Build verification pipeline and confidence labels
- Add filters for gluten-free categories
- Improve restaurant detail panel with verified menu items

### Phase 3: Expansion

- Add user accounts and saved places
- Add more dietary restrictions
- Add admin review workflows
- Improve source ingestion and confidence scoring

## Open Product Questions

These are high-level questions I can help you answer as we shape the product:

1. Should the first launch focus on one city/region or be more general?
2. Do you want the app to feel more like a discovery tool, a safety tool, or both?
3. How strict should the first version be about what counts as "verified"?
4. Should users log in during the MVP, or should we keep it open and simple at first?
5. Which mapping provider do you prefer once we compare tradeoffs?

## Immediate Next Step

After this spec is approved, the next iteration should set up the actual application foundation:

- Initialize a Next.js app with TypeScript
- Add shadcn/ui
- Prepare Supabase integration
- Define the first-pass database schema
- Create the first homepage and map layout shell
