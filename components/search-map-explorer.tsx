"use client";

import {
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import {
  AlertCircle,
  ArrowUpRight,
  LoaderCircle,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Users
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { loadLeaflet } from "@/lib/leaflet-loader";
import {
  DEFAULT_LIVE_SEARCH_QUERY,
  DEFAULT_SEARCH_CENTER,
  buildCuratedSearchResults,
  buildInfoWindowContent,
  getDirectionsLinks,
  parseLiveSearchIntent,
  sortLiveSearchResults,
  type CuratedSearchResponse,
  type LiveSearchResult,
  type SearchLocation
} from "@/lib/maps-live-search";
import {
  formatPositiveDietarySignals,
  type SampleRestaurant
} from "@/lib/sample-data";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    L?: any;
  }
}

type SearchMapExplorerProps = {
  curatedRestaurants: SampleRestaurant[];
};

export function SearchMapExplorer({
  curatedRestaurants
}: SearchMapExplorerProps) {
  const [query, setQuery] = useState(DEFAULT_LIVE_SEARCH_QUERY);
  const [submittedQuery, setSubmittedQuery] = useState(DEFAULT_LIVE_SEARCH_QUERY);
  const [mapStatus, setMapStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [locationStatus, setLocationStatus] = useState<
    "locating" | "ready" | "fallback" | "denied"
  >("locating");
  const [searchStatus, setSearchStatus] = useState<
    "idle" | "searching" | "ready" | "no_results"
  >("idle");
  const [sortMode, setSortMode] = useState<"best_match" | "closest" | "top_rated">(
    "best_match"
  );
  const [currentLocation, setCurrentLocation] = useState<SearchLocation>(
    DEFAULT_SEARCH_CENTER
  );
  const [results, setResults] = useState<LiveSearchResult[]>([]);
  const [selectedResultId, setSelectedResultId] = useState("");
  const [hoveredResultId, setHoveredResultId] = useState("");
  const [statusMessage, setStatusMessage] = useState(
    "Search approved Tuscaloosa meals and the list and map will update together."
  );

  const mapRef = useRef<HTMLDivElement | null>(null);
  const resultsListRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  const sortedResults = useMemo(() => {
    if (sortMode === "closest") {
      return [...results].sort(
        (resultA, resultB) => resultA.distanceMiles - resultB.distanceMiles
      );
    }

    if (sortMode === "top_rated") {
      return [...results].sort(
        (resultA, resultB) => (resultB.rating ?? 0) - (resultA.rating ?? 0)
      );
    }

    return sortLiveSearchResults(results);
  }, [results, sortMode]);

  useEffect(() => {
    setMapStatus("loading");
    let isActive = true;

    void loadLeaflet()
      .then(() => {
        if (isActive) {
          setMapStatus("ready");
        }
      })
      .catch(() => {
        if (isActive) {
          setMapStatus("error");
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationStatus("fallback");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationStatus("ready");
      },
      (error) => {
        setLocationStatus(error.code === error.PERMISSION_DENIED ? "denied" : "fallback");
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  }, []);

  useEffect(() => {
    if (mapStatus !== "ready" || !window.L || !mapRef.current) {
      return;
    }

    const L = window.L;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }

    mapInstanceRef.current.setView(
      [currentLocation.latitude, currentLocation.longitude],
      13
    );

    requestAnimationFrame(() => {
      mapInstanceRef.current?.invalidateSize?.();
    });
  }, [currentLocation, mapStatus]);

  useEffect(() => {
    if (locationStatus === "locating") {
      return;
    }

    runSearch(submittedQuery);
  }, [currentLocation, locationStatus, submittedQuery]);

  useEffect(() => {
    if (mapStatus !== "ready" || !window.L || !mapInstanceRef.current) {
      return;
    }

    const L = window.L;
    const map = mapInstanceRef.current;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    if (sortedResults.length === 0) {
      map.setView([currentLocation.latitude, currentLocation.longitude], 13);
      return;
    }

    const bounds = L.latLngBounds([]);

    sortedResults.forEach((result, index) => {
      const marker = L.circleMarker([result.latitude, result.longitude], {
        ...getMarkerStyle("default"),
        pane: "markerPane"
      }).addTo(map);

      marker.bindPopup(buildInfoWindowContent(result), {
        closeButton: false,
        offset: [0, -12]
      });

      marker.on("click", () => {
        focusResult(result.id, {
          panToMarker: true,
          scrollIntoView: true,
          openPopup: true
        });
      });

      marker.bindTooltip(String(index + 1), {
        permanent: true,
        direction: "center",
        className: "leaflet-meal-marker-label"
      });

      markersRef.current.set(result.id, marker);
      bounds.extend(marker.getLatLng());
    });

    if (sortedResults.length === 1) {
      const [onlyResult] = sortedResults;
      map.setView([onlyResult.latitude, onlyResult.longitude], 14);
      return;
    }

    map.fitBounds(bounds, {
      padding: [56, 56]
    });
  }, [currentLocation, mapStatus, sortedResults]);

  useEffect(() => {
    markersRef.current.forEach((marker, resultId) => {
      const markerState =
        resultId === selectedResultId
          ? "selected"
          : resultId === hoveredResultId
            ? "hovered"
            : "default";

      marker.setStyle(getMarkerStyle(markerState));

      if (markerState === "selected") {
        marker.bringToFront();
      }
    });
  }, [hoveredResultId, selectedResultId]);

  function registerResultElement(resultId: string, element: HTMLDivElement | null) {
    if (!element) {
      resultsListRef.current.delete(resultId);
      return;
    }

    resultsListRef.current.set(resultId, element);
  }

  function runSearch(nextQuery: string) {
    const intent = parseLiveSearchIntent(nextQuery);

    setSearchStatus("searching");
    setStatusMessage("Searching the approved Tuscaloosa meal dataset...");

    const searchResponse = buildCuratedSearchResults({
      intent,
      origin: currentLocation,
      curatedRestaurants
    });

    const normalizedResults = sortLiveSearchResults(searchResponse.results);

    if (normalizedResults.length === 0) {
      setResults([]);
      setSelectedResultId("");
      setSearchStatus("no_results");
      setStatusMessage(
        "No approved matches were found for that search yet. Try a broader phrase like gluten-free meal near me."
      );
      return;
    }

    setResults(normalizedResults);
    setSelectedResultId(normalizedResults[0]?.id ?? "");
    setSearchStatus("ready");
    setStatusMessage(buildStatusMessage(searchResponse, normalizedResults.length));
  }

  function focusResult(
    resultId: string,
    options?: {
      panToMarker?: boolean;
      scrollIntoView?: boolean;
      openPopup?: boolean;
    }
  ) {
    const result = sortedResults.find((entry) => entry.id === resultId);
    const marker = markersRef.current.get(resultId);
    const map = mapInstanceRef.current;

    if (!result || !marker || !map) {
      return;
    }

    setSelectedResultId(resultId);

    if (options?.scrollIntoView) {
      resultsListRef.current.get(resultId)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }

    if (options?.panToMarker) {
      map.panTo(marker.getLatLng());
      if ((map.getZoom?.() ?? 0) < 14) {
        map.setZoom(14);
      }
    }

    if (options?.openPopup) {
      marker.openPopup();
    }
  }

  const approvedMealCount = sortedResults.reduce(
    (sum, result) => sum + result.matchedMenuItems.length,
    0
  );
  const celiacSaferCount = sortedResults.filter(
    (result) => result.safetyLevel === "Celiac-Safer"
  ).length;

  return (
    <section className="rounded-[2rem] border bg-white/90 p-5 shadow-[0_24px_64px_rgba(68,60,42,0.1)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Local map search
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            Search once, then let the map and result list move together.
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            This section uses one shared approved Tuscaloosa result set for both
            the cards and the pins, so the experience stays synchronized without
            relying on a paid map API.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusChip
            label={
              locationStatus === "ready"
                ? "Using GPS location"
                : locationStatus === "denied"
                  ? "Location denied"
                  : "Using Tuscaloosa fallback"
            }
          />
          <StatusChip label="Approved Tuscaloosa data" />
          <StatusChip label="OpenStreetMap + Leaflet" />
        </div>
      </div>

      <form
        className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmittedQuery(query.trim() || DEFAULT_LIVE_SEARCH_QUERY);
        }}
      >
        <label className="sr-only" htmlFor="live-search-query">
          Search nearby meals
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="live-search-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={DEFAULT_LIVE_SEARCH_QUERY}
            className="h-12 w-full rounded-full border bg-background pl-11 pr-5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button className="h-12 px-6" type="submit">
          {searchStatus === "searching" ? "Searching..." : "Search"}
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["best_match", "closest", "top_rated"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setSortMode(mode)}
            className={cn(
              "rounded-full border bg-background px-4 py-2 text-sm font-medium transition hover:border-primary hover:text-primary",
              sortMode === mode &&
                "border-primary bg-primary text-primary-foreground hover:text-primary-foreground"
            )}
          >
            {mode === "best_match"
              ? "Best Match"
              : mode === "closest"
                ? "Closest"
                : "Top Rated"}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-[1.5rem] border bg-background/70 px-4 py-3">
        <p className="text-sm text-foreground">{statusMessage}</p>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryCard
              icon={<MapPin className="h-4 w-4" />}
              label="Pins"
              value={String(sortedResults.length)}
            />
            <SummaryCard
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Approved meals"
              value={String(approvedMealCount)}
            />
            <SummaryCard
              icon={<Star className="h-4 w-4" />}
              label="Celiac-safer"
              value={String(celiacSaferCount)}
            />
          </div>

          <div className="max-h-[42rem] space-y-3 overflow-y-auto pr-1">
            {sortedResults.map((result) => {
              const directions = getDirectionsLinks(result);

              return (
                <div
                  key={result.id}
                  ref={(element) => registerResultElement(result.id, element)}
                  onMouseEnter={() => setHoveredResultId(result.id)}
                  onMouseLeave={() => setHoveredResultId("")}
                >
                  <article
                    className={cn(
                      "rounded-[1.5rem] border bg-white/90 p-4 shadow-sm transition",
                      selectedResultId === result.id &&
                        "border-primary ring-2 ring-primary/20"
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {result.name}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold">
                          {result.matchedMenuItems[0]?.name ?? "Approved meal result"}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {result.address}
                        </p>
                      </div>
                      <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                        {result.distanceMiles.toFixed(1)} mi
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      <SummaryCard
                        icon={<Star className="h-4 w-4" />}
                        label="Rating"
                        value={result.rating ? result.rating.toFixed(1) : "N/A"}
                      />
                      <SummaryCard
                        icon={<ShieldCheck className="h-4 w-4" />}
                        label="Safety"
                        value={result.safetyLevel}
                      />
                      <SummaryCard
                        icon={<Users className="h-4 w-4" />}
                        label="Signals"
                        value={
                          result.badges.length > 0
                            ? `${result.badges.length} trust badge${
                                result.badges.length === 1 ? "" : "s"
                              }`
                            : "Reviewed data"
                        }
                      />
                    </div>

                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {result.supportingText}
                    </p>

                    <DietarySignalsRow result={result} />

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        type="button"
                        onClick={() =>
                          focusResult(result.id, {
                            panToMarker: true,
                            scrollIntoView: false,
                            openPopup: true
                          })
                        }
                      >
                        Highlight pin
                      </Button>
                      <a
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "gap-2 no-underline"
                        )}
                        href={directions.google}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Google Maps
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                      <a
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "gap-2 no-underline"
                        )}
                        href={directions.apple}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Apple Maps
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </div>
                  </article>
                </div>
              );
            })}

            {searchStatus === "searching" ? (
              <EmptyStateCard
                icon={<LoaderCircle className="h-5 w-5 animate-spin" />}
                title="Searching approved meals"
                body="The map and the list will update from the same approved Tuscaloosa dataset as soon as the search finishes."
              />
            ) : null}

            {searchStatus === "no_results" ? (
              <EmptyStateCard
                icon={<AlertCircle className="h-5 w-5" />}
                title="No approved matches yet"
                body="Try a broader phrase like gluten-free meal near me or gluten-free barbecue in Tuscaloosa."
              />
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.8rem] border bg-[linear-gradient(180deg,rgba(238,233,219,0.96)_0%,rgba(255,255,255,0.9)_100%)] p-4 shadow-[0_24px_64px_rgba(68,60,42,0.1)]">
          <div className="flex items-center justify-between rounded-[1.4rem] bg-white/90 px-4 py-3 shadow-sm">
            <div>
              <p className="text-sm font-medium">Map view</p>
              <p className="text-xs text-muted-foreground">
                Markers stay synchronized with the approved result cards
              </p>
            </div>
            <span className="rounded-full border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {sortedResults.length} markers
            </span>
          </div>

          <div className="relative mt-4 overflow-hidden rounded-[1.35rem] border bg-[#efe5cc]">
            <div ref={mapRef} className="h-[26rem] w-full lg:h-[40rem]" />
            {mapStatus === "loading" ? (
              <MapOverlayCard message="Loading the OpenStreetMap view..." />
            ) : null}
            {mapStatus === "error" ? (
              <MapOverlayCard message="The map could not load right now. The approved meal list still works below." />
            ) : null}
            {searchStatus === "no_results" ? (
              <MapOverlayCard message="No approved matches were found for this search. The map stays centered so the view never feels blank." />
            ) : null}
          </div>
        </div>
      </div>
    </section>
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

function EmptyStateCard({
  icon,
  title,
  body
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-dashed bg-white/70 p-5 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
        {icon}
      </div>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  );
}

function MapOverlayCard({ message }: { message: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/70 p-6 backdrop-blur-sm">
      <div className="max-w-md rounded-[1.5rem] border bg-white/90 p-5 text-center shadow-lg">
        <p className="text-sm font-semibold">Map Status</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

function StatusChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {label}
    </span>
  );
}

function DietarySignalsRow({ result }: { result: LiveSearchResult }) {
  const labels = result.matchedMenuItems[0]?.dietaryAttributes
    ? formatPositiveDietarySignals(result.matchedMenuItems[0].dietaryAttributes)
    : [];

  if (labels.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {labels.map((label) => (
        <span
          key={label}
          className="rounded-full border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function getMarkerStyle(state: "default" | "hovered" | "selected") {
  return {
    radius: state === "selected" ? 12 : state === "hovered" ? 10 : 8,
    color: "#ffffff",
    weight: 2,
    fillColor:
      state === "selected"
        ? "#2f6a52"
        : state === "hovered"
          ? "#d68d31"
          : "#4c8a6c",
    fillOpacity: 1
  };
}

function buildStatusMessage(
  searchResponse: CuratedSearchResponse,
  resultCount: number
) {
  if (searchResponse.matchMode === "exact") {
    return `Showing ${resultCount} approved result${
      resultCount === 1 ? "" : "s"
    } from the reviewed Tuscaloosa dataset.`;
  }

  if (searchResponse.matchMode === "fallback") {
    return "No exact keyword match was available, so the map is showing the closest approved Tuscaloosa meals with the strongest current safety signals.";
  }

  return "Showing the strongest approved Tuscaloosa meals from the reviewed local dataset.";
}
