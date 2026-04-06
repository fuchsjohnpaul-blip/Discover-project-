# Technical Foundation

## Current Direction

The app foundation is set up around:

- Next.js App Router
- TypeScript
- Tailwind CSS with shadcn/ui conventions
- Supabase client wiring
- A launch-city-first homepage focused on Tuscaloosa, Alabama

## What Is Ready

- Project configuration files for a Next.js app
- A styled homepage shell for the product direction
- A reusable button component
- Utility helpers
- A starter Supabase browser client
- Environment variable template

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
3. Define the Supabase schema for restaurants, menus, and verification records
4. Integrate a mapping provider
5. Replace placeholder homepage data with real Tuscaloosa seed data
