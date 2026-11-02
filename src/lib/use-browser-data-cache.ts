"use client";

import { useEffect, useState } from "react";

const browserCacheLifetime = 30 * 24 * 60 * 60 * 1000;
const browserRefreshAfter = 5 * 60 * 1000;
const pendingRequests = new Map<string, Promise<unknown>>();

type CacheEntry<T> = {
  updatedAt: number;
  data: T;
};

export function readBrowserDataCache<T>(key: string): CacheEntry<T> | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (
      !Number.isFinite(entry.updatedAt) ||
      Date.now() - entry.updatedAt > browserCacheLifetime
    ) {
      window.localStorage.removeItem(key);
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

export function writeBrowserDataCache<T>(key: string, data: T) {
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify({ updatedAt: Date.now(), data } satisfies CacheEntry<T>),
    );
  } catch {
    // Keep the data in memory if browser storage is unavailable or full.
  }
}

function loadOnce<T>(key: string, load: () => Promise<T>) {
  const existing = pendingRequests.get(key);
  if (existing) return existing as Promise<T>;

  const request = load().finally(() => pendingRequests.delete(key));
  pendingRequests.set(key, request);
  return request;
}

export function useBrowserDataCache<T>(
  key: string,
  initialData: T,
  load: () => Promise<T>,
  refreshAfter = browserRefreshAfter,
  refreshOnFocus = false,
  useCachedData = true,
) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    let active = true;
    let updatedAt = 0;
    let lastRefreshAt = 0;

    const refresh = () => {
      lastRefreshAt = Date.now();
      void loadOnce(key, load)
        .then((freshData) => {
          if (!active) return;
          setData(freshData);
          if (useCachedData) writeBrowserDataCache(key, freshData);
        })
        .catch(() => {
          // Keep showing any data already available if the API is temporarily unavailable.
        });
    };

    const refreshWhenVisible = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastRefreshAt > 1000
      ) {
        refresh();
      }
    };

    const cached = useCachedData ? readBrowserDataCache<T>(key) : null;
    if (cached) {
      updatedAt = cached.updatedAt;
      setData(cached.data);
    }

    if (!updatedAt || Date.now() - updatedAt >= refreshAfter) refresh();

    if (refreshOnFocus) {
      window.addEventListener("focus", refreshWhenVisible);
      document.addEventListener("visibilitychange", refreshWhenVisible);
    }

    return () => {
      active = false;
      if (refreshOnFocus) {
        window.removeEventListener("focus", refreshWhenVisible);
        document.removeEventListener("visibilitychange", refreshWhenVisible);
      }
    };
  }, [key, load, refreshAfter, refreshOnFocus, useCachedData]);

  return data;
}
