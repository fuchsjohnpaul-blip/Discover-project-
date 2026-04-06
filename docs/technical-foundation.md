# Technical Foundation

## Current Direction

The app foundation is set up around:

- Next.js App Router
- TypeScript
- Tailwind CSS with shadcn/ui conventions
- Supabase client wiring
- Planned Google Maps integration
- A launch-city-first homepage focused on Tuscaloosa, Alabama

## What Is Ready

- Project configuration files for a Next.js app
- A styled homepage shell for the product direction
- A reusable button component
- Utility helpers
- A starter Supabase browser client
- Environment variable template

## Product Access Model

The MVP will support public browsing with no sign-in required.

For now, the experience should stay simple and fully accessible without accounts.

## What Is Still Needed Before Running Locally

This machine currently does not have `node` or `npm` installed, so dependencies have not yet been installed.

Once a Node.js toolchain is available, the next setup step is:

```bash
npm install
```

After that, local development should be:

```bash
npm run dev
```

## Next Build Priorities

1. Install dependencies and verify the app runs
2. Add real shadcn/ui components through the CLI or manually as needed
3. Seed the Supabase schema with trusted Tuscaloosa restaurant data
4. Integrate Google Maps
5. Replace placeholder homepage data with real Tuscaloosa seed data
