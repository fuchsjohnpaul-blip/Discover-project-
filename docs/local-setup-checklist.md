# Local Setup Checklist

## Goal

This checklist explains what needs to happen before the app can run locally with:

- Next.js
- Supabase
- Leaflet
- OpenStreetMap

It is written in a practical order so the setup is easier to follow.

## 1. Install Node.js

You will need a current Node.js version installed first.

Recommended target:

- Node.js 20 or newer

Once Node.js is installed, confirm these commands work:

```bash
node -v
npm -v
```

## 2. Install Project Dependencies

From the project root:

```bash
npm install
```

This will install the Next.js app dependencies used by the project.

## 3. Create Your Local Environment File

Copy the example env file values into a real local env file.

Expected variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Use:

- `NEXT_PUBLIC_SUPABASE_URL` from your Supabase project
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project API settings

## 4. Prepare Supabase

You will need a Supabase project created for this app.

At minimum, the project should be ready to receive:

- The schema migration in `supabase/migrations/20260405_001_initial_schema.sql`
- The seed data in `supabase/seeds/20260405_001_tuscaloosa_sample_data.sql`

The current codebase already includes:

- Base restaurant schema
- Verification tables
- Seed data for Tuscaloosa sample restaurants

## 5. Map Requirements

The codebase now includes a Leaflet + OpenStreetMap map experience.

For the current MVP map, no paid map API key is required.

The browser still needs internet access so it can load Leaflet and the OpenStreetMap tile layer.

## 6. Start Local Development

Once Node.js is installed and env vars are ready:

```bash
npm run dev
```

Then open the local Next.js app in your browser.

## 7. What Should Work First

After setup is complete, the first things to verify are:

- The homepage loads
- Featured restaurant cards are clickable
- The restaurant detail panel updates when a card is selected
- Filters change the visible restaurant list
- The Leaflet map loads
- The search list and the map markers stay synchronized from one approved result set

## 8. Known Current Limits

Right now, the project uses curated meal data plus a no-billing map layer.

That means:

- Search results come from the approved Tuscaloosa dataset
- The map layer comes from Leaflet with OpenStreetMap tiles
- Supabase reads are available with a fallback path when live configuration is missing

## 9. Recommended Next Technical Step

After local setup works, the best next engineering step is:

1. Replace sample-data reads with real Supabase-backed queries
2. Verify the Leaflet map with those same records
