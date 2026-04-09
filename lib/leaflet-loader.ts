"use client";

declare global {
  interface Window {
    L?: any;
    __leafletLoaderPromise?: Promise<any>;
  }
}

const LEAFLET_CSS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const LEAFLET_CSS_INTEGRITY = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
const LEAFLET_JS_INTEGRITY = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";

export async function loadLeaflet() {
  if (typeof window === "undefined") {
    throw new Error("Leaflet can only load in the browser.");
  }

  if (window.L) {
    return window.L;
  }

  if (window.__leafletLoaderPromise) {
    return window.__leafletLoaderPromise;
  }

  window.__leafletLoaderPromise = new Promise((resolve, reject) => {
    ensureLeafletStylesheet();

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-leaflet-loader="true"]'
    );

    const handleReady = () => {
      if (window.L) {
        resolve(window.L);
        return;
      }

      reject(new Error("Leaflet failed to initialize."));
    };

    const handleError = () => {
      reject(new Error("Leaflet failed to load."));
    };

    if (existingScript) {
      if (window.L) {
        resolve(window.L);
        return;
      }

      existingScript.addEventListener("load", handleReady, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = LEAFLET_JS_URL;
    script.async = true;
    script.defer = true;
    script.crossOrigin = "";
    script.integrity = LEAFLET_JS_INTEGRITY;
    script.dataset.leafletLoader = "true";
    script.addEventListener("load", handleReady, { once: true });
    script.addEventListener("error", handleError, { once: true });
    document.head.appendChild(script);
  }).catch((error) => {
    delete window.__leafletLoaderPromise;
    throw error;
  });

  return window.__leafletLoaderPromise;
}

function ensureLeafletStylesheet() {
  const existingLink = document.querySelector<HTMLLinkElement>(
    'link[data-leaflet-styles="true"]'
  );

  if (existingLink) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = LEAFLET_CSS_URL;
  link.crossOrigin = "";
  link.integrity = LEAFLET_CSS_INTEGRITY;
  link.dataset.leafletStyles = "true";
  document.head.appendChild(link);
}
