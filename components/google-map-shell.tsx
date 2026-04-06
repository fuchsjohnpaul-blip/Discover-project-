"use client";

import { useEffect, useRef, useState } from "react";

import { sampleRestaurants, type SampleRestaurant } from "@/lib/sample-data";

declare global {
  interface Window {
    google?: {
      maps: any;
    };
  }
}

type GoogleMapShellProps = {
  restaurants: SampleRestaurant[];
  selectedRestaurant?: SampleRestaurant;
};

export function GoogleMapShell({
  restaurants,
  selectedRestaurant
}: GoogleMapShellProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const infoWindowRef = useRef<any>(null);
  const [scriptStatus, setScriptStatus] = useState<
    "idle" | "loading" | "ready" | "missing_key" | "error"
  >("idle");

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setScriptStatus("missing_key");
      return;
    }

    if (window.google?.maps) {
      setScriptStatus("ready");
      return;
    }

    setScriptStatus("loading");

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-google-maps-loader="true"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad);
      existingScript.addEventListener("error", handleError);

      return () => {
        existingScript.removeEventListener("load", handleLoad);
        existingScript.removeEventListener("error", handleError);
      };
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsLoader = "true";
    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };

    function handleLoad() {
      setScriptStatus("ready");
    }

    function handleError() {
      setScriptStatus("error");
    }
  }, [apiKey]);

  useEffect(() => {
    if (scriptStatus !== "ready" || !window.google?.maps || !mapRef.current) {
      return;
    }

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 33.2098, lng: -87.5692 },
        zoom: 12,
        disableDefaultUI: false,
        gestureHandling: "cooperative",
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });
    }

    if (!infoWindowRef.current) {
      infoWindowRef.current = new window.google.maps.InfoWindow();
    }

    const map = mapInstanceRef.current;
    const infoWindow = infoWindowRef.current;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current.clear();

    const bounds = new window.google.maps.LatLngBounds();

    restaurants.forEach((restaurant) => {
      const marker = new window.google.maps.Marker({
        map,
        position: { lat: restaurant.latitude, lng: restaurant.longitude },
        title: restaurant.name,
        animation:
          selectedRestaurant?.slug === restaurant.slug
            ? window.google.maps.Animation.DROP
            : undefined
      });

      marker.addListener("click", () => {
        infoWindow.setContent(
          `<div style="padding: 4px 6px; max-width: 220px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${restaurant.name}</div>
            <div style="font-size: 12px; color: #5b675f;">${restaurant.menuItems[0]?.name ?? ""}</div>
          </div>`
        );
        infoWindow.open({ anchor: marker, map });
      });

      markersRef.current.set(restaurant.slug, marker);
      bounds.extend(marker.getPosition());
    });

    if (restaurants.length > 0) {
      map.fitBounds(bounds, 48);
    }

    if (selectedRestaurant) {
      const marker = markersRef.current.get(selectedRestaurant.slug);
      if (marker) {
        map.panTo({
          lat: selectedRestaurant.latitude,
          lng: selectedRestaurant.longitude
        });
        map.setZoom(13);
        infoWindow.setContent(
          `<div style="padding: 4px 6px; max-width: 220px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${selectedRestaurant.name}</div>
            <div style="font-size: 12px; color: #5b675f;">${selectedRestaurant.menuItems[0]?.name ?? ""}</div>
          </div>`
        );
        infoWindow.open({ anchor: marker, map });
      }
    }
  }, [restaurants, scriptStatus, selectedRestaurant]);

  if (scriptStatus === "missing_key") {
    return <MapFallbackCard message="Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to load the real Google Maps shell." />;
  }

  if (scriptStatus === "error") {
    return <MapFallbackCard message="Google Maps failed to load. Check the API key and script access." />;
  }

  if (restaurants.length === 0) {
    return <MapFallbackCard message="No restaurants match the current filter, so there are no map markers to show." />;
  }

  return (
    <div className="relative mt-4 flex-1 overflow-hidden rounded-[1.25rem] border bg-[#efe5cc]">
      <div ref={mapRef} className="h-full min-h-[360px] w-full" />
      {scriptStatus !== "ready" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <p className="rounded-full border bg-white px-4 py-2 text-sm text-muted-foreground">
            Loading Google Maps shell...
          </p>
        </div>
      ) : null}
    </div>
  );
}

function MapFallbackCard({ message }: { message: string }) {
  return (
    <div className="relative mt-4 flex min-h-[360px] items-center justify-center overflow-hidden rounded-[1.25rem] border bg-[#efe5cc] p-6">
      <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(120,110,84,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(120,110,84,0.12)_1px,transparent_1px)] [background-size:42px_42px]" />
      {sampleRestaurants.slice(0, 3).map((restaurant, index) => (
        <div
          key={restaurant.slug}
          className="absolute h-5 w-5 rounded-full bg-primary shadow-[0_0_0_8px_rgba(48,112,87,0.18)]"
          style={{
            left: `${24 + index * 18}%`,
            top: `${28 + index * 14}%`
          }}
        />
      ))}
      <div className="relative z-10 max-w-md rounded-[1.5rem] border bg-white/90 p-5 text-center shadow-lg backdrop-blur">
        <p className="text-sm font-semibold">Google Maps Shell Ready</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
