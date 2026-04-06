"use client";

import { useState } from "react";

import { MapPin, ShieldCheck, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { sampleRestaurants } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

const filters = [
  "100% Gluten-Free",
  "Dedicated GF Menu",
  "Verified Menu Items",
  "Contains Gluten",
  "Nearby Now"
] as const;

type FilterOption = (typeof filters)[number];

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("Verified Menu Items");
  const [selectedRestaurantSlug, setSelectedRestaurantSlug] = useState(
    sampleRestaurants[0]?.slug ?? ""
  );

  const filteredRestaurants = sampleRestaurants.filter((restaurant) => {
    if (activeFilter === "Verified Menu Items") {
      return restaurant.menuItems.some((item) => item.status === "Verified Safe");
    }

    if (activeFilter === "Contains Gluten") {
      return restaurant.menuItems.some(
        (item) => item.status === "Not Verified (Contains Gluten)"
      );
    }

    if (activeFilter === "Dedicated GF Menu") {
      return (
        restaurant.menuItems.filter((item) => item.status === "Verified Safe").length >=
        2
      );
    }

    if (activeFilter === "100% Gluten-Free") {
      return restaurant.menuItems.every((item) => item.status === "Verified Safe");
    }

    return true;
  });

  const selectedRestaurant =
    filteredRestaurants.find(
      (restaurant) => restaurant.slug === selectedRestaurantSlug
    ) ?? filteredRestaurants[0];
  const featuredItem = selectedRestaurant?.menuItems[0];

  const latitudePosition = `${12 + ((selectedRestaurant?.latitude ?? 33.2098) - 33.18) * 42}%`;
  const longitudePosition = `${20 + (((selectedRestaurant?.longitude ?? -87.56) + 87.59) * 70)}%`;

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
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-sm transition hover:border-primary hover:text-primary",
                  activeFilter === filter &&
                    "border-primary bg-primary text-primary-foreground hover:text-primary-foreground"
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
                  <p className="mt-2 text-sm text-muted-foreground">
                    Showing {filteredRestaurants.length} restaurants for{" "}
                    {activeFilter}.
                  </p>
                </div>
                <Button variant="secondary">Browse all approved spots</Button>
              </div>

              <div className="grid gap-4">
                {filteredRestaurants.map((restaurant) => (
                  <button
                    key={restaurant.slug}
                    type="button"
                    onClick={() => setSelectedRestaurantSlug(restaurant.slug)}
                    className={cn(
                      "rounded-[1.75rem] border bg-white/85 p-5 text-left shadow-[0_20px_40px_rgba(68,60,42,0.08)] transition hover:-translate-y-0.5",
                      selectedRestaurant?.slug === restaurant.slug &&
                        "border-primary ring-2 ring-primary/20"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {restaurant.menuItems[0]?.verificationMethod}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold">
                          {restaurant.name}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {restaurant.address}
                        </p>
                      </div>
                      <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                        {restaurant.glutenSafetyCategory}
                      </span>
                    </div>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {restaurant.menuItems[0]?.name}
                      </span>{" "}
                      -> {restaurant.menuItems[0]?.status}
                    </p>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                      {restaurant.detailSummary}
                    </p>
                  </button>
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
                  {filteredRestaurants.map((restaurant) => {
                    const top = `${12 + (restaurant.latitude - 33.18) * 42}%`;
                    const left = `${20 + ((restaurant.longitude + 87.59) * 70)}%`;
                    const isSelected = restaurant.slug === selectedRestaurant?.slug;

                    return (
                      <div
                        key={restaurant.slug}
                        className={cn(
                          "absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all",
                          isSelected
                            ? "bg-primary shadow-[0_0_0_8px_rgba(48,112,87,0.22)]"
                            : "bg-accent shadow-[0_0_0_6px_rgba(244,180,76,0.18)]"
                        )}
                        style={{ top, left }}
                      />
                    );
                  })}
                  {selectedRestaurant ? (
                    <div
                      className="absolute -translate-x-1/2 -translate-y-full rounded-2xl border bg-white/95 px-3 py-2 shadow-lg backdrop-blur"
                      style={{ top: latitudePosition, left: longitudePosition }}
                    >
                      <p className="text-sm font-semibold">{selectedRestaurant.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {featuredItem?.name}
                      </p>
                    </div>
                  ) : null}
                  <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/92 p-4 shadow-lg backdrop-blur">
                    <p className="text-sm font-semibold">Map as a discovery companion</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      The selected restaurant stays visually in sync here, so
                      the map and detail panel point to the same place.
                    </p>
                  </div>

                  {filteredRestaurants.length === 0 ? (
                    <div className="absolute inset-6 flex items-center justify-center rounded-[1.25rem] border border-dashed bg-white/80 p-6 text-center">
                      <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                        No restaurants match this filter yet. We can broaden the
                        sample dataset or adjust the filter logic next.
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border bg-white/75 p-6 shadow-[0_24px_64px_rgba(68,60,42,0.1)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Restaurant detail panel
            </p>
            <div className="mt-4 space-y-4">
              <h2 className="text-2xl font-semibold">
                Item-first detail experience
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                This preview shows the structure we can use when someone taps a
                restaurant: a short menu list first, confidence nearby, and
                caution information in a quieter supporting area.
              </p>
            </div>
          </div>

          <article className="rounded-[2rem] border bg-white/85 p-6 shadow-[0_24px_64px_rgba(68,60,42,0.1)] backdrop-blur">
            {selectedRestaurant ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Live sample preview
                    </p>
                    <h3 className="mt-2 text-3xl font-semibold">
                      {selectedRestaurant.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {selectedRestaurant.address}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedRestaurant.neighborhood}
                    </p>
                  </div>
                  <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                    {selectedRestaurant.glutenSafetyCategory}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {selectedRestaurant.detailSummary}
                </p>

                <div className="mt-6 rounded-[1.5rem] border bg-background/80 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Menu items to review first
                      </p>
                      <h4 className="mt-2 text-2xl font-semibold">
                        {selectedRestaurant.menuItems.length} highlighted choices
                      </h4>
                    </div>
                    <span className="inline-flex rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
                      {selectedRestaurant.glutenSafetyCategory}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4">
                    {selectedRestaurant.menuItems.map((item) => (
                      <article
                        key={item.name}
                        className="rounded-[1.25rem] border bg-white/80 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h5 className="text-lg font-semibold">{item.name}</h5>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.verificationMethod}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "inline-flex rounded-full px-3 py-1 text-sm font-medium",
                              item.status === "Verified Safe"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            )}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                          {item.rationale}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-foreground">
                          {item.confidenceNote}
                        </p>
                      </article>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.25rem] border bg-white/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Top pick
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground">
                        {featuredItem?.name}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border bg-white/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Strongest current basis
                      </p>
                      <p className="mt-2 text-sm leading-6 text-foreground">
                        {featuredItem?.verificationMethod}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-dashed bg-white/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Supporting caution section
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {selectedRestaurant.cautionSummary}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center rounded-[1.5rem] border border-dashed bg-background/70 p-6 text-center">
                <div>
                  <p className="text-sm font-semibold">No matching restaurant selected</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    This filter currently hides every sample restaurant, so the
                    detail panel is waiting for a broader selection.
                  </p>
                </div>
              </div>
            )}
          </article>
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
