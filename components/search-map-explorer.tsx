"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  AlertCircle,
  ArrowUpRight,
  Clock3,
  LoaderCircle,
  MapPin,
  Navigation,
  Search,
  ShieldCheck,
  Star,
  Users
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { loadGoogleMaps } from "@/lib/google-maps-loader";
import {
  buildCuratedFallbackResults,
  DEFAULT_LIVE_SEARCH_QUERY,
  DEFAULT_SEARCH_CENTER,
  buildInfoWindowContent,
  buildSearchByTextRequests,
  getDirectionsLinks,
  normalizePlacesResults,
  parseLiveSearchIntent,
  sortLiveSearchResults,
  type LiveSearchResult,
  type LiveSearchSource,
  type SearchLocation
} from "@/lib/maps-live-search";
import { type SampleRestaurant } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: {
      maps: any;
    };
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
  const [scriptStatus, setScriptStatus] = useState<
    "idle" | "loading" | "ready" | "missing_key" | "error"
  >("idle");
  const [locationStatus, setLocationStatus] = useState<
    "locating" | "ready" | "fallback" | "denied"
  >("locating");
  const [searchStatus, setSearchStatus] = useState<
    "idle" | "searching" | "ready" | "no_results" | "error"
  >("idle");
  const [openNowOnly, setOpenNowOnly] = useState(true);
  const [sortMode, setSortMode] = useState<"best_match" | "closest" | "top_rated">(
    "best_match"
  );
  const [currentLocation, setCurrentLocation] = useState<SearchLocation>(
    DEFAULT_SEARCH_CENTER
  );
  const [results, setResults] = useState<LiveSearchResult[]>([]);
  const [selectedResultId, setSelectedResultId] = useState("");
  const [hoveredResultId, setHoveredResultId] = useState("");
  const [resultSource, setResultSource] = useState<LiveSearchSource>("google_places");
  const [statusMessage, setStatusMessage] = useState(
    "Search for a nearby meal and the list and map will update together."
  );

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef<HTMLDivElement | null>(null);
  const resultsListRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const mapInstanceRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const requestIdRef = useRef(0);

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

  const selectedResult =
    sortedResults.find((result) => result.id === selectedResultId) ??
    sortedResults[0] ??
    null;

  useEffect(() => {
    if (!apiKey) {
      setScriptStatus("missing_key");
      return;
    }

    setScriptStatus("loading");
    let isActive = true;

    void loadGoogleMaps(apiKey)
      .then(() => {
        if (isActive) {
          setScriptStatus("ready");
        }
      })
      .catch(() => {
        if (isActive) {
          setScriptStatus("error");
        }
      });

    return () => {
      isActive = false;
    };
  }, [apiKey]);

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
    if (scriptStatus !== "ready" || !window.google?.maps || !mapRef.current) {
      return;
    }

    const googleMaps = window.google.maps;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new googleMaps.Map(mapRef.current, {
        center: {
          lat: currentLocation.latitude,
          lng: currentLocation.longitude
        },
        zoom: 13,
        gestureHandling: "cooperative",
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });
    }

    if (!infoWindowRef.current) {
      infoWindowRef.current = new googleMaps.InfoWindow();
    }

    mapInstanceRef.current.setCenter({
      lat: currentLocation.latitude,
      lng: currentLocation.longitude
    });
  }, [currentLocation, scriptStatus]);

  useEffect(() => {
    if (scriptStatus !== "ready" || locationStatus === "locating") {
      return;
    }

    void runSearch(submittedQuery);
  }, [currentLocation, locationStatus, openNowOnly, scriptStatus, submittedQuery]);

  useEffect(() => {
    if (scriptStatus !== "ready" || !window.google?.maps || !mapInstanceRef.current) {
      return;
    }

    const googleMaps = window.google.maps;
    const map = mapInstanceRef.current;
    const infoWindow = infoWindowRef.current;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current.clear();
    infoWindow?.close();

    if (sortedResults.length === 0) {
      map.setCenter({
        lat: currentLocation.latitude,
        lng: currentLocation.longitude
      });
      map.setZoom(13);
      return;
    }

    const bounds = new googleMaps.LatLngBounds();

    sortedResults.forEach((result, index) => {
      const marker = new googleMaps.Marker({
        map,
        position: { lat: result.latitude, lng: result.longitude },
        title: result.name,
        label: {
          text: String(index + 1),
          color: "#fff",
          fontWeight: "700"
        },
        icon: getMarkerIcon(googleMaps, "default")
      });

      marker.addListener("click", () => {
        focusResult(result.id, {
          panToMarker: true,
          scrollIntoView: true,
          openInfoWindow: true
        });
      });

      markersRef.current.set(result.id, marker);
      bounds.extend(marker.getPosition());
    });

    map.fitBounds(bounds, 56);
  }, [currentLocation, scriptStatus, sortedResults]);

  useEffect(() => {
    if (scriptStatus !== "ready" || !window.google?.maps) {
      return;
    }

    const googleMaps = window.google.maps;

    markersRef.current.forEach((marker, resultId) => {
      const markerState =
        resultId === selectedResultId
          ? "selected"
          : resultId === hoveredResultId
            ? "hovered"
            : "default";

      marker.setIcon(getMarkerIcon(googleMaps, markerState));
      marker.setZIndex(markerState === "selected" ? 2 : markerState === "hovered" ? 1 : 0);
    });
  }, [hoveredResultId, scriptStatus, selectedResultId]);

  function registerResultElement(resultId: string, element: HTMLDivElement | null) {
    if (!element) {
      resultsListRef.current.delete(resultId);
      return;
    }

    resultsListRef.current.set(resultId, element);
  }

  async function runSearch(nextQuery: string) {
    if (!window.google?.maps) {
      return;
    }

    const googleMaps = window.google.maps;
    const intent = parseLiveSearchIntent(nextQuery, {
      openNowOnly
    });
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setSearchStatus("searching");
    setStatusMessage("Searching Google Maps and syncing the result list with pins...");

    let rawResults: any[] = [];
    let lastSearchError: Error | null = null;

    try {
      const { Place } =
        typeof googleMaps.importLibrary === "function"
          ? await googleMaps.importLibrary("places")
          : { Place: googleMaps.places?.Place };

      if (!Place?.searchByText) {
        throw new Error("Google Places search is unavailable in this browser session.");
      }

      const searchRequests = buildSearchByTextRequests(
        googleMaps,
        intent,
        currentLocation
      );

      for (const request of searchRequests) {
        const response = await Place.searchByText(request);
        rawResults = response?.places ?? [];

        if (rawResults.length > 0) {
          break;
        }
      }
    } catch (error) {
      console.error("Google Places search failed", error);
      lastSearchError =
        error instanceof Error
          ? error
          : new Error("Google Maps search failed.");
    }

    if (requestId !== requestIdRef.current) {
      return;
    }

    if (lastSearchError) {
      if (isPlacesPermissionError(lastSearchError)) {
        const fallbackResults = sortLiveSearchResults(
          buildCuratedFallbackResults({
            intent,
            origin: currentLocation,
            curatedRestaurants
          })
        );

        if (fallbackResults.length > 0) {
          setResults(fallbackResults);
          setSelectedResultId(fallbackResults[0]?.id ?? "");
          setResultSource("curated_fallback");
          setSearchStatus("ready");
          setStatusMessage(
            "Google Places is not enabled for this key yet, so the map is showing approved Tuscaloosa fallback results while setup finishes."
          );
          return;
        }
      }

      setResults([]);
      setSelectedResultId("");
      setResultSource("google_places");
      setSearchStatus("error");
      setStatusMessage(
        "Google Maps could not complete that search. Make sure Places API (New) is enabled for this key, then try again."
      );
      return;
    }

    if (rawResults.length === 0) {
      const fallbackResults = sortLiveSearchResults(
        buildCuratedFallbackResults({
          intent,
          origin: currentLocation,
          curatedRestaurants
        })
      );

      if (fallbackResults.length > 0) {
        setResults(fallbackResults);
        setSelectedResultId(fallbackResults[0]?.id ?? "");
        setResultSource("curated_fallback");
        setSearchStatus("ready");
        setStatusMessage(
          "Live Google Places did not return a nearby match, so the map is showing the closest approved Tuscaloosa meals instead."
        );
        return;
      }

      setResults([]);
      setSelectedResultId("");
      setResultSource("google_places");
      setSearchStatus("no_results");
      setStatusMessage(
        "No results found in this area. Try broadening the wording or turning off Open Now."
      );
      return;
    }

    const normalizedResults = sortLiveSearchResults(
      normalizePlacesResults({
        places: rawResults,
        intent,
        origin: currentLocation,
        curatedRestaurants
      })
    );

    if (normalizedResults.length === 0) {
      const fallbackResults = sortLiveSearchResults(
        buildCuratedFallbackResults({
          intent,
          origin: currentLocation,
          curatedRestaurants
        })
      );

      if (fallbackResults.length > 0) {
        setResults(fallbackResults);
        setSelectedResultId(fallbackResults[0]?.id ?? "");
        setResultSource("curated_fallback");
        setSearchStatus("ready");
        setStatusMessage(
          "The live search came back too thin for this request, so the map is showing approved Tuscaloosa fallback meals with stronger safety signals."
        );
        return;
      }

      setResults([]);
      setSelectedResultId("");
      setResultSource("google_places");
      setSearchStatus("no_results");
      setStatusMessage("No results found in this area. Try a broader phrase like gluten-free restaurant near me.");
      return;
    }

    setResults(normalizedResults);
    setSelectedResultId(normalizedResults[0]?.id ?? "");
    setResultSource("google_places");
    setSearchStatus("ready");
    setStatusMessage(
      `Showing ${normalizedResults.length} synchronized place result${
        normalizedResults.length === 1 ? "" : "s"
      } from Google Maps.`
    );
  }

  function focusResult(
    resultId: string,
    options?: {
      panToMarker?: boolean;
      scrollIntoView?: boolean;
      openInfoWindow?: boolean;
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
      map.panTo({ lat: result.latitude, lng: result.longitude });
      if ((map.getZoom?.() ?? 0) < 14) {
        map.setZoom(14);
      }
    }

    if (options?.openInfoWindow && infoWindowRef.current) {
      infoWindowRef.current.setContent(buildInfoWindowContent(result));
      infoWindowRef.current.open({ anchor: marker, map });
    }
  }

  return (
    <section className="rounded-[2rem] border bg-white/90 p-5 shadow-[0_24px_64px_rgba(68,60,42,0.1)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Live map search
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            Search once, then let the map and result list move together.
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            This section uses one shared Google Places result stream for both the
            cards and the pins, so there is no mismatch between what the user
            reads and what they see on the map.
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
          <StatusChip label={openNowOnly ? "Open Now enabled" : "Showing all hours"} />
          <StatusChip
            label={
              resultSource === "google_places"
                ? "Google Places live"
                : "Curated Tuscaloosa fallback"
            }
          />
        </div>
      </div>

      <form
        className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]"
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
        <button
          type="button"
          onClick={() => setOpenNowOnly((current) => !current)}
          className={cn(
            "h-12 rounded-full border px-5 text-sm font-medium transition",
            openNowOnly
              ? "border-primary bg-primary text-primary-foreground"
              : "bg-background hover:border-primary hover:text-primary"
          )}
        >
          {openNowOnly ? "Open Now Only" : "Include Closed"}
        </button>
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
              label="Verified matches"
              value={String(sortedResults.filter((result) => result.badges.length > 0).length)}
            />
            <SummaryCard
              icon={<Clock3 className="h-4 w-4" />}
              label="Open now"
              value={String(sortedResults.filter((result) => result.isOpenNow === true).length)}
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
                          {result.matchedMenuItems[0]?.name ?? "Live place result"}
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
                        icon={<Navigation className="h-4 w-4" />}
                        label="Status"
                        value={
                          result.isOpenNow === true
                            ? "Open now"
                            : result.isOpenNow === false
                              ? "Closed"
                              : "Hours unknown"
                        }
                      />
                      <SummaryCard
                        icon={<Users className="h-4 w-4" />}
                        label="Signals"
                        value={result.badges.length > 0 ? `${result.badges.length} trust badge${result.badges.length === 1 ? "" : "s"}` : "Live place"}
                      />
                    </div>

                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {result.supportingText}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        type="button"
                        onClick={() =>
                          focusResult(result.id, {
                            panToMarker: true,
                            scrollIntoView: false,
                            openInfoWindow: true
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
                title="Searching nearby places"
                body="The map and the list will update from the same response as soon as Google Places returns matches."
              />
            ) : null}

            {searchStatus === "no_results" ? (
              <EmptyStateCard
                icon={<AlertCircle className="h-5 w-5" />}
                title="No results found in this area"
                body="Try a broader phrase like gluten-free restaurant near me or turn off the Open Now filter."
              />
            ) : null}

            {searchStatus === "error" ? (
              <EmptyStateCard
                icon={<AlertCircle className="h-5 w-5" />}
                title="Google search needs attention"
                body="The live search request failed. Double-check that Places API (New) is enabled for this Google Maps key."
              />
            ) : null}

            {scriptStatus === "missing_key" ? (
              <EmptyStateCard
                icon={<AlertCircle className="h-5 w-5" />}
                title="Google Maps key needed"
                body="Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY with Maps JavaScript API and Places enabled to turn on live search."
              />
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.8rem] border bg-[linear-gradient(180deg,rgba(238,233,219,0.96)_0%,rgba(255,255,255,0.9)_100%)] p-4 shadow-[0_24px_64px_rgba(68,60,42,0.1)]">
          <div className="flex items-center justify-between rounded-[1.4rem] bg-white/90 px-4 py-3 shadow-sm">
            <div>
              <p className="text-sm font-medium">Map view</p>
              <p className="text-xs text-muted-foreground">
                Markers stay synchronized with the live result cards
              </p>
            </div>
            <span className="rounded-full border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {sortedResults.length} markers
            </span>
          </div>

          <div className="relative mt-4 overflow-hidden rounded-[1.35rem] border bg-[#efe5cc]">
            <div ref={mapRef} className="h-[26rem] w-full lg:h-[40rem]" />
            {scriptStatus === "loading" ? (
              <MapOverlayCard message="Loading Google Maps and the Places library..." />
            ) : null}
            {scriptStatus === "missing_key" ? (
              <MapOverlayCard message="Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable live Places search." />
            ) : null}
            {scriptStatus === "error" ? (
              <MapOverlayCard message="Google Maps failed to load. Check the API key and library configuration." />
            ) : null}
            {searchStatus === "no_results" ? (
              <MapOverlayCard message="No results found in this area. The map stays centered so the view never feels blank." />
            ) : null}
            {searchStatus === "error" ? (
              <MapOverlayCard message="Google Maps search failed. Verify the key has Places API (New) enabled, then refresh the page." />
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
  icon: React.ReactNode;
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
  icon: React.ReactNode;
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

function getMarkerIcon(
  googleMaps: any,
  state: "default" | "hovered" | "selected"
) {
  return {
    path: googleMaps.SymbolPath.CIRCLE,
    fillColor:
      state === "selected"
        ? "#2f6a52"
        : state === "hovered"
          ? "#d68d31"
          : "#4c8a6c",
    fillOpacity: 1,
    strokeColor: "#ffffff",
    strokeWeight: 2,
    scale: state === "selected" ? 12 : state === "hovered" ? 10 : 8
  };
}

function isPlacesPermissionError(error: Error) {
  return (
    error.message.includes("PERMISSION_DENIED") ||
    error.message.includes("Places API (New) has not been used") ||
    error.message.includes("places.googleapis.com")
  );
}
