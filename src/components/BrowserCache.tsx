"use client";

import { useEffect } from "react";

export default function BrowserCache() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) {
      return;
    }

    let disposed = false;
    const check = () => {
      if (!disposed && document.visibilityState === "visible") {
        navigator.serviceWorker.controller?.postMessage({
          type: "CHECK_PAGE",
          path: window.location.pathname + window.location.search,
        });
      }
    };
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then(() => navigator.serviceWorker.ready)
      .then(async (registration) => {
        await document.fonts.ready;
        if (disposed) return;
        registration.active?.postMessage({
          type: "WARM_PAGE",
          path: window.location.pathname + window.location.search,
          assets: performance.getEntriesByType("resource").map(resource => resource.name),
        });
      })
      .catch(() => {
        // Rendering and navigation keep working if browser storage is unavailable.
      });

    const interval = window.setInterval(check, 60000);
    window.addEventListener("online", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      disposed = true;
      window.clearInterval(interval);
      window.removeEventListener("online", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);

  return null;
}
