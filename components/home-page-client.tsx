"use client";

import { useEffect, useRef, useState } from "react";

import { MapPin, ShieldCheck, UtensilsCrossed } from "lucide-react";

import { GoogleMapShell } from "@/components/google-map-shell";
import { type SampleRestaurant } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

const feedFilters = [
  "Safe To Start",
  "Use Extra Caution",
  "Restaurant Labeled",
  "Mixed Menus",
  "All Meals"
] as const;

const FEED_BATCH_SIZE = 4;

type FeedFilter = (typeof feedFilters)[number];

type MealFeedEntry = {
  id: string;
  restaurantSlug: string;
  restaurantName: string;
  address: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  glutenSafetyCategory: string;
  cautionSummary: string;
  detailSummary: string;
  safeItemCount: number;
  menuItemCount: number;
  menuItem: SampleRestaurant["menuItems"][number];
};

type HomePageClientProps = {
  initialRestaurants: SampleRestaurant[];
  dataSource: "supabase" | "sample";
};

export function HomePageClient({
  initialRestaurants,
  dataSource
}: HomePageClientProps) {
  const initialFeedEntries = buildMealFeedEntries(initialRestaurants);
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("Safe To Start");
  const [selectedEntryId, setSelectedEntryId] = useState(
    initialFeedEntries[0]?.id ?? ""
  );
  const [visibleCount, setVisibleCount] = useState(FEED_BATCH_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const filteredFeedEntries = initialFeedEntries.filter((entry) =>
    matchesFilter(entry, activeFilter)
  );
  const visibleFeedEntries = filteredFeedEntries.slice(0, visibleCount);
  const selectedEntry =
    filteredFeedEntries.find((entry) => entry.id === selectedEntryId) ??
    filteredFeedEntries[0];
  const selectedRestaurant = initialRestaurants.find(
    (restaurant) => restaurant.slug === selectedEntry?.restaurantSlug
  );
  const matchingRestaurants = initialRestaurants.filter((restaurant) =>
    filteredFeedEntries.some((entry) => entry.restaurantSlug === restaurant.slug)
  );
  const safeFeedCount = filteredFeedEntries.filter(
    (entry) => entry.menuItem.status === "Verified Safe"
  ).length;

  useEffect(() => {
    setVisibleCount(FEED_BATCH_SIZE);
  }, [activeFilter, initialRestaurants.length]);

  useEffect(() => {
    if (!filteredFeedEntries.some((entry) => entry.id === selectedEntryId)) {
      setSelectedEntryId(filteredFeedEntries[0]?.id ?? "");
    }
  }, [filteredFeedEntries, selectedEntryId]);

  useEffect(() => {
    const node = loadMoreRef.current;

    if (!node || visibleCount >= filteredFeedEntries.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }

        setVisibleCount((current) =>
          Math.min(current + FEED_BATCH_SIZE, filteredFeedEntries.length)
        );
      },
      {
        rootMargin: "0px 0px 420px 0px"
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [filteredFeedEntries.length, visibleCount]);

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
        <section className="space-y-5">
          <header className="overflow-hidden rounded-[2rem] border bg-white/80 p-6 shadow-[0_30px_80px_rgba(68,60,42,0.12)] backdrop-blur">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">
                Launch city: Tuscaloosa, Alabama
              </span>
              <span className="rounded-full border px-3 py-1">
                Home feed: approved meals
              </span>
              <span className="rounded-full border px-3 py-1">
                Data source: {dataSource}
              </span>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Home feed
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
                  Scroll through Tuscaloosa meal options like a living dining
                  feed.
                </h1>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                  The home experience now leads with individual menu items, so a
                  user can keep scrolling, spot meals that look promising, and
                  open restaurant context only when they want more detail.
                </p>
              </div>

              <div className="rounded-[1.75rem] border bg-[linear-gradient(135deg,rgba(252,249,241,0.98)_0%,rgba(241,233,216,0.98)_100%)] p-5 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Feed rhythm
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <FeedStatCard
                    icon={<UtensilsCrossed className="h-5 w-5" />}
                    title={`${filteredFeedEntries.length} meals`}
                    description="Approved meal cards matching the current feed filter."
                  />
                  <FeedStatCard
                    icon={<ShieldCheck className="h-5 w-5" />}
                    title={`${safeFeedCount} safer starts`}
                    description="Meals currently reading as the strongest gluten-free starting points."
                  />
                  <FeedStatCard
                    icon={<MapPin className="h-5 w-5" />}
                    title={`${matchingRestaurants.length} map spots`}
                    description="Restaurants that stay visible beside the feed."
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {feedFilters.map((filter) => (
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
          </header>

          {filteredFeedEntries.length > 0 ? (
            <div className="space-y-4">
              {visibleFeedEntries.map((entry, index) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelectedEntryId(entry.id)}
                  className="w-full text-left"
                >
                  <article
                    className={cn(
                      "rounded-[2rem] border bg-white/90 p-4 shadow-[0_20px_50px_rgba(68,60,42,0.1)] transition hover:-translate-y-1",
                      selectedEntry?.id === entry.id &&
                        "border-primary ring-2 ring-primary/20"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-[1.6rem] p-5",
                        entry.menuItem.status === "Verified Safe"
                          ? "bg-[linear-gradient(135deg,rgba(247,251,242,1)_0%,rgba(221,241,230,1)_100%)]"
                          : "bg-[linear-gradient(135deg,rgba(255,247,239,1)_0%,rgba(244,228,213,1)_100%)]"
                      )}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            Meal drop {String(index + 1).padStart(2, "0")} •{" "}
                            {entry.restaurantName}
                          </p>
                          <h2 className="mt-3 text-2xl font-semibold leading-tight md:text-3xl">
                            {entry.menuItem.name}
                          </h2>
                          <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                            <span>{entry.neighborhood}</span>
                            <span>{entry.glutenSafetyCategory}</span>
                            <span>{entry.menuItem.verificationMethod}</span>
                          </p>
                        </div>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1 text-sm font-medium",
                            entry.menuItem.status === "Verified Safe"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          )}
                        >
                          {entry.menuItem.status}
                        </span>
                      </div>

                      <p className="mt-5 max-w-2xl text-sm leading-7 text-foreground/85">
                        {entry.menuItem.confidenceNote}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-[1.15fr_0.85fr]">
                      <div className="rounded-[1.35rem] border bg-background/70 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Why it appears
                        </p>
                        <p className="mt-2 text-sm leading-6 text-foreground">
                          {entry.menuItem.rationale}
                        </p>
                      </div>

                      <div className="rounded-[1.35rem] border bg-background/70 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Restaurant snapshot
                        </p>
                        <p className="mt-2 text-sm font-semibold text-foreground">
                          {entry.restaurantName}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {entry.address}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-foreground">
                          {entry.safeItemCount} of {entry.menuItemCount} sample
                          items currently read as safer starting points.
                        </p>
                      </div>
                    </div>
                  </article>
                </button>
              ))}

              <div
                ref={filteredFeedEntries.length > visibleCount ? loadMoreRef : null}
                className="rounded-[1.75rem] border border-dashed bg-white/70 p-6 text-center"
              >
                <p className="text-sm font-semibold">
                  {filteredFeedEntries.length > visibleCount
                    ? "Loading more meal cards as you scroll..."
                    : "You are caught up for now."}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {filteredFeedEntries.length > visibleCount
                    ? "The feed will keep revealing more approved meals automatically."
                    : "We can keep adding richer sample items and real Supabase records to make this feed feel deeper."}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed bg-white/70 p-8 text-center shadow-[0_20px_50px_rgba(68,60,42,0.08)]">
              <p className="text-lg font-semibold">No meals match this feed yet</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Try a broader filter and the meal feed will repopulate with more
                approved options.
              </p>
            </div>
          )}
        </section>

        <aside className="space-y-5 xl:sticky xl:top-6">
          <section className="overflow-hidden rounded-[2rem] border bg-white/85 p-4 shadow-[0_30px_80px_rgba(68,60,42,0.12)]">
            <div className="flex items-center justify-between rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(238,233,219,0.96)_0%,rgba(255,255,255,0.9)_100%)] px-4 py-3 shadow-sm">
              <div>
                <p className="text-sm font-medium">Map focus</p>
                <p className="text-xs text-muted-foreground">
                  Restaurants matching the current meal feed
                </p>
              </div>
              <span className="rounded-full border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {matchingRestaurants.length} spots
              </span>
            </div>

            <GoogleMapShell
              restaurants={matchingRestaurants}
              selectedRestaurant={selectedRestaurant}
            />
          </section>

          <article className="rounded-[2rem] border bg-white/85 p-6 shadow-[0_24px_64px_rgba(68,60,42,0.1)] backdrop-blur">
            {selectedRestaurant && selectedEntry ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Selected from home feed
                    </p>
                    <h3 className="mt-2 text-3xl font-semibold">
                      {selectedEntry.menuItem.name}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-foreground">
                      {selectedRestaurant.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
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

                <div className="mt-5 rounded-[1.5rem] border bg-background/80 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Meal confidence
                      </p>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {selectedEntry.menuItem.verificationMethod}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-3 py-1 text-sm font-medium",
                        selectedEntry.menuItem.status === "Verified Safe"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      {selectedEntry.menuItem.status}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {selectedEntry.menuItem.confidenceNote}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-foreground">
                    {selectedEntry.menuItem.rationale}
                  </p>
                </div>

                <div className="mt-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        More from this restaurant
                      </p>
                      <h4 className="mt-2 text-2xl font-semibold">
                        {selectedRestaurant.menuItems.length} highlighted menu
                        items
                      </h4>
                    </div>
                    <span className="inline-flex rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
                      {selectedRestaurant.menuItems.filter(
                        (item) => item.status === "Verified Safe"
                      ).length}{" "}
                      safer picks
                    </span>
                  </div>

                  <div className="mt-4 grid gap-4">
                    {selectedRestaurant.menuItems.map((item) => (
                      <article
                        key={item.name}
                        className={cn(
                          "rounded-[1.25rem] border bg-white/80 p-4",
                          item.name === selectedEntry.menuItem.name &&
                            "border-primary bg-primary/5"
                        )}
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
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-dashed bg-white/70 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Supporting caution section
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {selectedRestaurant.cautionSummary}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {selectedRestaurant.detailSummary}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex min-h-[420px] items-center justify-center rounded-[1.5rem] border border-dashed bg-background/70 p-6 text-center">
                <div>
                  <p className="text-sm font-semibold">
                    The feed is waiting for a selection
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Choose a meal card on the left and this panel will fill in
                    with restaurant context and the rest of that menu preview.
                  </p>
                </div>
              </div>
            )}
          </article>
        </aside>
      </div>
    </main>
  );
}

function FeedStatCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[1.35rem] border bg-white/80 p-4">
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

function buildMealFeedEntries(restaurants: SampleRestaurant[]): MealFeedEntry[] {
  return restaurants
    .flatMap((restaurant) => {
      const safeItemCount = restaurant.menuItems.filter(
        (item) => item.status === "Verified Safe"
      ).length;

      return restaurant.menuItems.map((menuItem, index) => ({
        id: `${restaurant.slug}-${index}`,
        restaurantSlug: restaurant.slug,
        restaurantName: restaurant.name,
        address: restaurant.address,
        neighborhood: restaurant.neighborhood,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        glutenSafetyCategory: restaurant.glutenSafetyCategory,
        cautionSummary: restaurant.cautionSummary,
        detailSummary: restaurant.detailSummary,
        safeItemCount,
        menuItemCount: restaurant.menuItems.length,
        menuItem
      }));
    })
    .sort((entryA, entryB) => {
      const scoreA = entryA.menuItem.status === "Verified Safe" ? 0 : 1;
      const scoreB = entryB.menuItem.status === "Verified Safe" ? 0 : 1;

      if (scoreA !== scoreB) {
        return scoreA - scoreB;
      }

      if (entryA.restaurantName !== entryB.restaurantName) {
        return entryA.restaurantName.localeCompare(entryB.restaurantName);
      }

      return entryA.menuItem.name.localeCompare(entryB.menuItem.name);
    });
}

function matchesFilter(entry: MealFeedEntry, activeFilter: FeedFilter) {
  switch (activeFilter) {
    case "Safe To Start":
      return entry.menuItem.status === "Verified Safe";
    case "Use Extra Caution":
      return entry.menuItem.status !== "Verified Safe";
    case "Restaurant Labeled":
      return entry.menuItem.verificationMethod === "Restaurant labeled";
    case "Mixed Menus":
      return (
        entry.safeItemCount > 0 && entry.safeItemCount < entry.menuItemCount
      );
    default:
      return true;
  }
}
