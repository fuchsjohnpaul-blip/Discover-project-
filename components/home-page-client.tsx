"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import {
  Clock3,
  FlaskConical,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  UtensilsCrossed
} from "lucide-react";

import { SearchMapExplorer } from "@/components/search-map-explorer";
import { buttonVariants } from "@/components/ui/button";
import {
  buildMealFeedEntries,
  feedFilters,
  getDirectionsLinks,
  matchesFeedFilter,
  type FeedFilter,
  type MealFeedEntry
} from "@/lib/meal-query";
import { type SampleRestaurant, type VerificationBadge } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

const FEED_BATCH_SIZE = 4;

type HomePageClientProps = {
  initialRestaurants: SampleRestaurant[];
  dataSource: "supabase" | "sample";
};

export function HomePageClient({
  initialRestaurants,
  dataSource
}: HomePageClientProps) {
  const allFeedEntries = buildMealFeedEntries(initialRestaurants);
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("Safe To Start");
  const [selectedEntryId, setSelectedEntryId] = useState(
    allFeedEntries[0]?.id ?? ""
  );
  const [visibleCount, setVisibleCount] = useState(FEED_BATCH_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const filteredFeedEntries = allFeedEntries.filter((entry) =>
    matchesFeedFilter(entry, activeFilter)
  );
  const visibleFeedEntries = filteredFeedEntries.slice(0, visibleCount);
  const selectedEntry =
    filteredFeedEntries.find((entry) => entry.id === selectedEntryId) ??
    filteredFeedEntries[0] ??
    allFeedEntries[0];
  const selectedRestaurant = initialRestaurants.find(
    (restaurant) => restaurant.slug === selectedEntry?.restaurantSlug
  );
  const safeFeedCount = filteredFeedEntries.filter(
    (entry) => entry.menuItem.status === "Verified Safe"
  ).length;

  useEffect(() => {
    setVisibleCount(FEED_BATCH_SIZE);
  }, [activeFilter, initialRestaurants.length]);

  useEffect(() => {
    if (!filteredFeedEntries.some((entry) => entry.id === selectedEntryId)) {
      setSelectedEntryId(filteredFeedEntries[0]?.id ?? allFeedEntries[0]?.id ?? "");
    }
  }, [allFeedEntries, filteredFeedEntries, selectedEntryId]);

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
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="overflow-hidden rounded-[2rem] border bg-white/80 p-6 shadow-[0_30px_80px_rgba(68,60,42,0.12)] backdrop-blur">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">
              Launch city: Tuscaloosa, Alabama
            </span>
            <span className="rounded-full border px-3 py-1">
              Live list and map sync
            </span>
            <span className="rounded-full border px-3 py-1">
              Data source: {dataSource}
            </span>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Discovery + accuracy
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
                Find a nearby meal and watch the map stay perfectly in sync.
              </h1>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                The home tab now pairs a location-aware meal search with the
                curated feed below, so users can move from a natural-language
                request into synchronized pins, trusted result cards, and local
                meal context without friction.
              </p>
            </div>

            <div className="rounded-[1.75rem] border bg-[linear-gradient(135deg,rgba(252,249,241,0.98)_0%,rgba(241,233,216,0.98)_100%)] p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Home snapshot
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <FeedStatCard
                  icon={<MapPin className="h-5 w-5" />}
                  title="One search stream"
                  description="The map markers and search results now come from the same approved Tuscaloosa dataset."
                />
                <FeedStatCard
                  icon={<ShieldCheck className="h-5 w-5" />}
                  title={`${safeFeedCount} safer feed picks`}
                  description="The curated feed still keeps verified-friendly meal options easy to browse underneath the live search layer."
                />
                <FeedStatCard
                  icon={<UtensilsCrossed className="h-5 w-5" />}
                  title={`${filteredFeedEntries.length} feed cards`}
                  description="Approved meal cards continue to load as the user scrolls through the social-style home feed."
                />
              </div>
            </div>
          </div>
        </header>

        <SearchMapExplorer curatedRestaurants={initialRestaurants} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px] xl:items-start">
          <section className="rounded-[2rem] border bg-white/90 p-5 shadow-[0_24px_64px_rgba(68,60,42,0.1)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Infinite home feed
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Keep scrolling through approved meal drops
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This stays social and browseable after the live map search,
                  giving the app a discovery rhythm instead of a static directory feel.
                </p>
              </div>
              <span className="rounded-full border bg-background px-4 py-2 text-sm font-medium text-muted-foreground">
                {filteredFeedEntries.length} feed cards
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
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

            {filteredFeedEntries.length > 0 ? (
              <div className="mt-5 space-y-4">
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
                            <h3 className="mt-3 text-2xl font-semibold leading-tight md:text-3xl">
                              {entry.menuItem.name}
                            </h3>
                            <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                              <span>{entry.menuItem.priceLabel}</span>
                              <span>{entry.distanceMiles.toFixed(1)} miles away</span>
                              <span>{entry.menuItem.safetyLevel}</span>
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
                            Verification path
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {entry.menuItem.verificationBadges.map((badge) => (
                              <VerificationPill key={badge} badge={badge} />
                            ))}
                          </div>
                          <p className="mt-3 text-sm leading-6 text-foreground">
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
                            {entry.safeItemCount} of {entry.menuItemCount} curated
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
              <div className="mt-5 rounded-[2rem] border border-dashed bg-white/70 p-8 text-center shadow-[0_20px_50px_rgba(68,60,42,0.08)]">
                <p className="text-lg font-semibold">No meals match this feed yet</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Try a broader filter and the home feed will refill with more
                  approved options.
                </p>
              </div>
            )}
          </section>

          <article className="rounded-[2rem] border bg-white/85 p-6 shadow-[0_24px_64px_rgba(68,60,42,0.1)] backdrop-blur xl:sticky xl:top-6">
            {selectedRestaurant && selectedEntry ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Selected meal
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
                    {selectedEntry.menuItem.safetyLevel}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <MetricCard
                    icon={<Star className="h-4 w-4" />}
                    label="Safety rating"
                    value={selectedRestaurant.glutenSafetyRating.toFixed(1)}
                  />
                  <MetricCard
                    icon={<Clock3 className="h-4 w-4" />}
                    label="Prep time"
                    value={`${selectedEntry.menuItem.prepTimeMinutes} min`}
                  />
                  <MetricCard
                    icon={<MapPin className="h-4 w-4" />}
                    label="Distance"
                    value={`${selectedRestaurant.distanceMiles.toFixed(1)} mi`}
                  />
                </div>

                <div className="mt-5 rounded-[1.5rem] border bg-background/80 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Price and trust
                      </p>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {selectedEntry.menuItem.priceLabel} •{" "}
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

                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedEntry.menuItem.verificationBadges.map((badge) => (
                      <VerificationPill key={badge} badge={badge} />
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {selectedEntry.menuItem.confidenceNote}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-foreground">
                    {selectedEntry.menuItem.rationale}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    className={cn(
                      buttonVariants({ variant: "default", size: "sm" }),
                      "no-underline"
                    )}
                    href={getDirectionsLinks(selectedEntry).google}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Google Maps
                  </a>
                  <a
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "no-underline"
                    )}
                    href={getDirectionsLinks(selectedEntry).apple}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Apple Maps
                  </a>
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
                              {item.priceLabel} • {item.verificationMethod}
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
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.verificationBadges.map((badge) => (
                            <VerificationPill key={badge} badge={badge} />
                          ))}
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
                    Choose a curated meal card on the left and this panel will
                    fill in with restaurant context and the rest of that menu
                    preview.
                  </p>
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </main>
  );
}

function FeedStatCard({
  icon,
  title,
  description
}: {
  icon: ReactNode;
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

function MetricCard({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.15rem] border bg-white/80 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-[0.14em]">
          {label}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function VerificationPill({ badge }: { badge: VerificationBadge }) {
  const icon =
    badge === "Kitchen Certified" ? (
      <ShieldCheck className="h-4 w-4" />
    ) : badge === "User Vetted" ? (
      <Users className="h-4 w-4" />
    ) : (
      <FlaskConical className="h-4 w-4" />
    );

  return (
    <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
      {icon}
      {badge}
    </span>
  );
}
