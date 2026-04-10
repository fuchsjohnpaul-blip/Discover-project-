"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import {
  Filter,
  ExternalLink,
  FlaskConical,
  MapPin,
  Star,
  ShieldCheck,
  Users,
  UtensilsCrossed
} from "lucide-react";

import { DietaryExpertChat } from "@/components/dietary-expert-chat";
import { SearchMapExplorer } from "@/components/search-map-explorer";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  buildMealFeedEntries,
  feedBrowseFilters,
  getDirectionsLinks,
  matchesFeedBrowseFilter,
  type FeedBrowseFilter,
  type MealFeedEntry
} from "@/lib/meal-query";
import {
  formatPositiveDietarySignals,
  type SampleRestaurant,
  type VerificationBadge
} from "@/lib/sample-data";
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
  const [activeFilter, setActiveFilter] =
    useState<FeedBrowseFilter>("gluten-free-meals");
  const [selectedEntryId, setSelectedEntryId] = useState("");
  const [visibleCount, setVisibleCount] = useState(FEED_BATCH_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const feedEntryRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [pendingJumpEntryId, setPendingJumpEntryId] = useState("");

  const filteredFeedEntries = allFeedEntries.filter((entry) =>
    matchesFeedBrowseFilter(entry, activeFilter)
  );
  const visibleFeedEntries = filteredFeedEntries.slice(0, visibleCount);
  const verifiedSafeCount = filteredFeedEntries.filter(
    (entry) => entry.menuItem.status === "Verified Safe"
  ).length;
  const activeFilterLabel =
    feedBrowseFilters.find((filter) => filter.id === activeFilter)?.label ??
    "All Approved Picks";

  useEffect(() => {
    setVisibleCount(FEED_BATCH_SIZE);
  }, [activeFilter, initialRestaurants.length]);

  useEffect(() => {
    if (
      selectedEntryId &&
      !filteredFeedEntries.some((entry) => entry.id === selectedEntryId)
    ) {
      setSelectedEntryId("");
    }
  }, [filteredFeedEntries, selectedEntryId]);

  useEffect(() => {
    if (!pendingJumpEntryId) {
      return;
    }

    const targetElement = feedEntryRefs.current.get(pendingJumpEntryId);

    if (!targetElement) {
      return;
    }

    requestAnimationFrame(() => {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });
    setPendingJumpEntryId("");
  }, [pendingJumpEntryId, visibleFeedEntries.length]);

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

  function registerFeedEntryElement(
    entryId: string,
    element: HTMLDivElement | null
  ) {
    if (!element) {
      feedEntryRefs.current.delete(entryId);
      return;
    }

    feedEntryRefs.current.set(entryId, element);
  }

  function focusFeedEntry(entryId: string) {
    setActiveFilter("all-approved-picks");
    setVisibleCount(allFeedEntries.length);
    setSelectedEntryId(entryId);
    setPendingJumpEntryId(entryId);
  }

  function toggleFeedEntry(entryId: string) {
    setSelectedEntryId((currentId) => (currentId === entryId ? "" : entryId));
  }

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
              <p className="text-[2rem] font-semibold tracking-tight text-foreground md:text-[2.5rem]">
                Discover
              </p>
            </div>

            <div className="rounded-[1.75rem] border bg-[linear-gradient(135deg,rgba(252,244,236,0.98)_0%,rgba(242,230,216,0.98)_100%)] p-5 shadow-sm">
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
                  title={`${verifiedSafeCount} verified-safe picks`}
                  description="Cards in the current dietary lane that still read as verified safe in the structured dataset."
                />
                <FeedStatCard
                  icon={<UtensilsCrossed className="h-5 w-5" />}
                  title={`${filteredFeedEntries.length} feed cards`}
                  description={`The feed is currently scoped to ${activeFilterLabel.toLowerCase()} for faster browsing.`}
                />
              </div>
            </div>
          </div>
        </header>

        <SearchMapExplorer curatedRestaurants={initialRestaurants} />

        <div>
          <section className="rounded-[2rem] border bg-white/90 p-5 shadow-[0_24px_64px_rgba(68,60,42,0.1)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Infinite home feed
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Browse approved food drops faster
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Each card now stays compact by default, so users can scan
                  more meals or appetizers quickly and only open the deeper
                  trust details when they want them.
                </p>
              </div>
              <span className="rounded-full border bg-background px-4 py-2 text-sm font-medium text-muted-foreground">
                {filteredFeedEntries.length} matching cards
              </span>
            </div>

            <div className="mt-5 rounded-[1.5rem] border bg-[linear-gradient(135deg,rgba(252,244,236,0.98)_0%,rgba(244,233,221,0.95)_100%)] p-4 shadow-sm">
              <div className="flex flex-wrap items-start gap-4">
                <div className="min-w-[18rem] flex-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    <label
                      htmlFor="feed-browse-filter"
                      className="text-xs font-semibold uppercase tracking-[0.18em]"
                    >
                      Feed popup
                    </label>
                  </div>
                  <select
                    id="feed-browse-filter"
                    value={activeFilter}
                    onChange={(event) =>
                      setActiveFilter(event.target.value as FeedBrowseFilter)
                    }
                    className="mt-3 h-11 w-full rounded-2xl border bg-white px-4 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {feedBrowseFilters.map((filter) => (
                      <option key={filter.id} value={filter.id}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="max-w-xl flex-1 text-sm leading-6 text-muted-foreground">
                  This keeps the feed much cleaner by letting one popup control
                  both the dietary lane and whether users are browsing meals or
                  appetizers.
                </div>
              </div>
            </div>

            {filteredFeedEntries.length > 0 ? (
              <div className="mt-5 space-y-4">
                {visibleFeedEntries.map((entry) => (
                  <div
                    key={entry.id}
                    ref={(element) => registerFeedEntryElement(entry.id, element)}
                  >
                    <article
                      className={cn(
                        "rounded-[1.8rem] border bg-white/95 p-4 shadow-[0_18px_42px_rgba(68,60,42,0.08)] transition",
                        selectedEntryId === entry.id &&
                          "border-primary ring-2 ring-primary/15"
                      )}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl font-bold tracking-tight text-foreground">
                            {entry.restaurantName}
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {entry.address}
                          </p>
                        </div>
                        <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                          {entry.distanceMiles.toFixed(1)} mi
                        </span>
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        <SummaryCard
                          icon={<Star className="h-4 w-4" />}
                          label="Rating"
                          value={entry.glutenSafetyRating.toFixed(1)}
                        />
                        <SummaryCard
                          icon={<ShieldCheck className="h-4 w-4" />}
                          label="Match"
                          value={buildFeedMatchLabel(entry, activeFilter)}
                        />
                        <SummaryCard
                          icon={<Users className="h-4 w-4" />}
                          label="Signals"
                          value={`${entry.menuItem.verificationBadges.length} trust badge${
                            entry.menuItem.verificationBadges.length === 1 ? "" : "s"
                          }`}
                        />
                      </div>

                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Dish match
                        </p>
                        <p className="mt-1 text-base font-semibold text-foreground/90">
                          {entry.menuItem.name}
                        </p>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-muted-foreground">
                        {buildFeedSupportingText(
                          entry,
                          activeFilterLabel,
                          filteredFeedEntries.filter(
                            (candidate) => candidate.restaurantSlug === entry.restaurantSlug
                          ).length
                        )}
                      </p>

                      <DietarySignalPills
                        dietarySignals={entry.menuItem.dietaryAttributes}
                        maxVisible={3}
                      />

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          type="button"
                          onClick={() => toggleFeedEntry(entry.id)}
                        >
                          {selectedEntryId === entry.id ? "Hide details" : "Show details"}
                        </Button>
                        <a
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                            "gap-2 no-underline"
                          )}
                          href={getDirectionsLinks(entry).google}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Google Maps
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <a
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                            "gap-2 no-underline"
                          )}
                          href={getDirectionsLinks(entry).apple}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Apple Maps
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>

                      {selectedEntryId === entry.id ? (
                        <div className="mt-4 border-t border-border/80 pt-4">
                          <div
                          className={cn(
                            "rounded-[1.5rem] p-4",
                            entry.menuItem.status === "Verified Safe"
                              ? "bg-[linear-gradient(135deg,rgba(252,240,241,1)_0%,rgba(244,221,225,1)_100%)]"
                              : "bg-[linear-gradient(135deg,rgba(255,247,239,1)_0%,rgba(244,228,213,1)_100%)]"
                          )}
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            Safety note
                          </p>
                          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground/85">
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
                        </div>
                      ) : null}
                    </article>
                  </div>
                ))}

                <div
                  ref={filteredFeedEntries.length > visibleCount ? loadMoreRef : null}
                  className="rounded-[1.75rem] border border-dashed bg-white/70 p-6 text-center"
                >
                  <p className="text-sm font-semibold">
                    {filteredFeedEntries.length > visibleCount
                      ? "Loading more compact meal cards as you scroll..."
                      : "You are caught up for now."}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {filteredFeedEntries.length > visibleCount
                      ? "The feed will keep revealing more approved picks automatically without opening the full detail layout every time."
                      : `You are at the end of the ${activeFilterLabel.toLowerCase()} lane for now.`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-[2rem] border border-dashed bg-white/70 p-8 text-center shadow-[0_20px_50px_rgba(68,60,42,0.08)]">
                <p className="text-lg font-semibold">No picks match this lane yet</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Try a different dietary popup option and the home feed will
                  refill with more approved options.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      <DietaryExpertChat entries={allFeedEntries} onJumpToEntry={focusFeedEntry} />
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

function SummaryCard({
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

function DietarySignalPills({
  dietarySignals,
  maxVisible
}: {
  dietarySignals?: MealFeedEntry["menuItem"]["dietaryAttributes"];
  maxVisible?: number;
}) {
  if (!dietarySignals) {
    return null;
  }

  const labels = formatPositiveDietarySignals(dietarySignals);
  const visibleLabels = maxVisible ? labels.slice(0, maxVisible) : labels;

  if (visibleLabels.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {visibleLabels.map((label) => (
        <span
          key={label}
          className="rounded-full border bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function buildFeedMatchLabel(
  entry: MealFeedEntry,
  activeFilter: FeedBrowseFilter
) {
  const activeFilterConfig = feedBrowseFilters.find(
    (filter) => filter.id === activeFilter
  );

  if (
    activeFilterConfig &&
    "dietaryKey" in activeFilterConfig &&
    activeFilterConfig.dietaryKey
  ) {
    return humanizeFeedDietaryKey(activeFilterConfig.dietaryKey);
  }

  const positiveSignals = entry.menuItem.dietaryAttributes
    ? formatPositiveDietarySignals(entry.menuItem.dietaryAttributes)
    : [];

  return positiveSignals[0] ?? entry.menuItem.safetyLevel;
}

function buildFeedSupportingText(
  entry: MealFeedEntry,
  activeFilterLabel: string,
  restaurantMatchCount: number
) {
  const filterPhrase =
    activeFilterLabel === "All Approved Picks"
      ? restaurantMatchCount === 1
        ? "approved pick"
        : "approved picks"
      : restaurantMatchCount === 1
        ? activeFilterLabel.toLowerCase().replace(/s$/, "")
        : activeFilterLabel.toLowerCase();

  return `${restaurantMatchCount} ${filterPhrase} currently visible from the reviewed Tuscaloosa dataset.`;
}

function humanizeFeedDietaryKey(key: keyof NonNullable<MealFeedEntry["menuItem"]["dietaryAttributes"]>) {
  switch (key) {
    case "glutenFree":
      return "Gluten-Free";
    case "soyFree":
      return "Soy-Free";
    case "nutFree":
      return "Nut-Free";
    case "vegetarian":
      return "Vegetarian";
    case "pescatarian":
      return "Pescatarian";
    case "kosher":
      return "Kosher";
    case "halal":
      return "Halal";
  }
}
