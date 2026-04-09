# Local Setup Checklist

## Goal

This checklist explains what needs to happen before the app can run locally with:

- Next.js
- Supabase
- Google Maps

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
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

Use:

- `NEXT_PUBLIC_SUPABASE_URL` from your Supabase project
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project API settings
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` from your Google Maps project

## 4. Prepare Supabase

You will need a Supabase project created for this app.

At minimum, the project should be ready to receive:

- The schema migration in `supabase/migrations/20260405_001_initial_schema.sql`
- The seed data in `supabase/seeds/20260405_001_tuscaloosa_sample_data.sql`

The current codebase already includes:

- Base restaurant schema
- Verification tables
- Seed data for Tuscaloosa sample restaurants

## 5. Enable Google Maps

The codebase now includes a live Google Maps + Places search experience.

For the live map to work, the Google Maps JavaScript API key must be active and placed in:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

Without that key, the app will show a graceful fallback state instead of the live map.

The Google Maps project should have both of these enabled:

- Maps JavaScript API
- Places API (New)

If `Places API (New)` was just enabled, Google can take a few minutes to start accepting live requests from the key. During that delay, the app may show the reviewed Tuscaloosa fallback dataset instead of live Google Places results.

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
- The Google Maps shell loads if the API key is valid
- The live search list and the map markers stay synchronized from one search response

## 8. Known Current Limits

Right now, the project uses a mix of live Google Places search and curated sample meal data.

That means:

- Google Places can power the live list and map when the API key is configured
- Curated meal verification still comes from the app dataset, not directly from Google Places
- Supabase reads are available with a fallback path when live configuration is missing

## 9. Recommended Next Technical Step

After local setup works, the best next engineering step is:

1. Replace sample-data reads with real Supabase-backed queries
2. Verify the live Google Maps shell with those same records
