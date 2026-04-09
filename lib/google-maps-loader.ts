"use client";

declare global {
  interface Window {
    google?: {
      maps: any;
    };
    __googleMapsLoaderPromise?: Promise<any>;
  }
}

export async function loadGoogleMaps(apiKey: string) {
  if (typeof window === "undefined") {
    throw new Error("Google Maps can only load in the browser.");
  }

  if (window.google?.maps?.places) {
    return window.google.maps;
  }

  if (window.__googleMapsLoaderPromise) {
    return window.__googleMapsLoaderPromise;
  }

  window.__googleMapsLoaderPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-google-maps-loader="true"]'
    );

    const handleReady = () => {
      if (window.google?.maps?.places) {
        resolve(window.google.maps);
        return;
      }

      reject(new Error("Google Maps Places library failed to initialize."));
    };

    const handleError = () => {
      reject(new Error("Google Maps failed to load."));
    };

    if (existingScript) {
      if (window.google?.maps?.places) {
        resolve(window.google.maps);
        return;
      }

      existingScript.addEventListener("load", handleReady, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${apiKey}` +
      `&libraries=places&v=weekly`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsLoader = "true";
    script.addEventListener("load", handleReady, { once: true });
    script.addEventListener("error", handleError, { once: true });
    document.head.appendChild(script);
  }).catch((error) => {
    delete window.__googleMapsLoaderPromise;
    throw error;
  });

  return window.__googleMapsLoaderPromise;
}
