import { MapPin, ShieldCheck, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const filters = [
  "100% Gluten-Free",
  "Dedicated GF Menu",
  "Verified Menu Items",
  "Nearby Now"
];

const featuredRestaurants = [
  {
    name: "Riverwalk Kitchen",
    category: "Dedicated GF Menu",
    note: "11 verified items and a lively downtown feel",
    distance: "0.7 mi"
  },
  {
    name: "Druid City Bowls",
    category: "100% Gluten-Free",
    note: "Entire menu marked safe for easy everyday dining",
    distance: "1.1 mi"
  },
  {
    name: "Campus Table",
    category: "Verified Menu Items",
    note: "6 items with source-backed notes and clear caution guidance",
    distance: "1.8 mi"
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-8 md:px-10 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border bg-white/70 p-8 shadow-[0_30px_80px_rgba(68,60,42,0.12)] backdrop-blur">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">
                Launch city: Tuscaloosa, Alabama
              </span>
              <span className="rounded-full border px-3 py-1">
                Discovery-first gluten-free guide
              </span>
            </div>

            <div className="mt-6 max-w-2xl space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                Discover Tuscaloosa restaurants with gluten-free confidence built in.
              </h1>
              <p className="text-lg leading-8 text-muted-foreground">
                Browse places that look worth visiting, then see menu-level
                gluten-free guidance, confidence notes, and caution details
                before you decide.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                className={cn(
                  "rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-sm transition hover:border-primary hover:text-primary"
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Featured restaurants
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    Start with a curated Tuscaloosa shortlist
                  </h2>
                </div>
                <Button variant="secondary">Browse all approved spots</Button>
              </div>

              <div className="grid gap-4">
                {featuredRestaurants.map((restaurant) => (
                  <article
                    key={restaurant.name}
                    className="rounded-[1.75rem] border bg-white/85 p-5 shadow-[0_20px_40px_rgba(68,60,42,0.08)] transition hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {restaurant.distance}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold">
                          {restaurant.name}
                        </h3>
                      </div>
                      <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                        {restaurant.category}
                      </span>
                    </div>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                      {restaurant.note}
                    </p>
                  </article>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <InsightCard
                  icon={<MapPin className="h-5 w-5" />}
                  title="Explore nearby picks"
                  description="Browse restaurants visually, the way people naturally discover where they want to eat."
                />
                <InsightCard
                  icon={<ShieldCheck className="h-5 w-5" />}
                  title="Built-in safety clarity"
                  description="See menu evidence and caution notes alongside each place instead of relying on generic tags alone."
                />
                <InsightCard
                  icon={<UtensilsCrossed className="h-5 w-5" />}
                  title="Dining decisions made easier"
                  description="Open a restaurant to view specific gluten-free items and practical notes before heading out."
                />
              </div>
            </div>
          
            <section className="overflow-hidden rounded-[2rem] border bg-[linear-gradient(180deg,rgba(238,233,219,0.96)_0%,rgba(255,255,255,0.9)_100%)] p-4 shadow-[0_30px_80px_rgba(68,60,42,0.12)]">
              <div className="flex h-full min-h-[540px] flex-col rounded-[1.5rem] border border-dashed border-primary/30 bg-[radial-gradient(circle_at_top,#ffffff,rgba(246,240,226,0.92))] p-4">
                <div className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
                  <div>
                    <p className="text-sm font-medium">Map Preview</p>
                    <p className="text-xs text-muted-foreground">
                      See featured restaurants alongside the map from the start
                    </p>
                  </div>
                  <Button size="sm">Use my location</Button>
                </div>

                <div className="relative mt-4 flex-1 overflow-hidden rounded-[1.25rem] border bg-[#efe5cc]">
                  <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(120,110,84,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(120,110,84,0.12)_1px,transparent_1px)] [background-size:42px_42px]" />
                  <div className="absolute left-[18%] top-[26%] h-5 w-5 rounded-full bg-primary shadow-[0_0_0_8px_rgba(48,112,87,0.18)]" />
                  <div className="absolute left-[58%] top-[36%] h-5 w-5 rounded-full bg-accent shadow-[0_0_0_8px_rgba(244,180,76,0.2)]" />
                  <div className="absolute left-[44%] top-[62%] h-5 w-5 rounded-full bg-primary shadow-[0_0_0_8px_rgba(48,112,87,0.18)]" />
                  <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/92 p-4 shadow-lg backdrop-blur">
                    <p className="text-sm font-semibold">Map as a discovery companion</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      The featured list leads the experience, while the map
                      helps users see where each trusted option fits.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border bg-white/75 p-6 shadow-[0_24px_64px_rgba(68,60,42,0.1)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Restaurant detail preview
            </p>
            <div className="mt-4 space-y-4">
              <h2 className="text-2xl font-semibold">Verified menu items come first</h2>
              <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
                <li>Specific gluten-free menu items</li>
                <li>Confidence and caution notes for each item</li>
                <li>Restaurant name, distance, and neighborhood</li>
                <li>Why the place is worth considering</li>
                <li>Safety category with supporting context</li>
                <li>Source-backed caveats when caution is needed</li>
              </ul>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featuredRestaurants.map((restaurant) => (
              <article
                key={restaurant.name}
                className="rounded-[1.75rem] border bg-white/80 p-5 shadow-[0_20px_40px_rgba(68,60,42,0.08)] transition hover:-translate-y-0.5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {restaurant.distance}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{restaurant.name}</h3>
                <p className="mt-2 inline-flex rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                  {restaurant.category}
                </p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {restaurant.note}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function InsightCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[1.5rem] border bg-background/80 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}
