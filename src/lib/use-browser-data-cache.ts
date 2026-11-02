"use client";

import { useEffect, useState } from "react";

const browserCacheLifetime = 30 * 24 * 60 * 60 * 1000;
const browserRefreshAfter = 5 * 60 * 1000;
const pendingRequests = new Map<string, Promise<unknown>>();

type CacheEntry<T> = {
  updatedAt: number;
  data: T;
};

function loadOnce<T>(key: string, load: () => Promise<T>) {
  const existing = pendingRequests.get(key);
  if (existing) return existing as Promise<T>;

  const request = load().finally(() => pendingRequests.delete(key));
  pendingRequests.set(key, request);
  return request;
}

export function useBrowserDataCache<T>(
  key: string,
  fallback: T,
  load: () => Promise<T>,
) {
  const [data, setData] = useState(fallback);

  useEffect(() => {
    let active = true;
    let updatedAt = 0;

    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const entry = JSON.parse(raw) as CacheEntry<T>;
        if (
          Number.isFinite(entry.updatedAt) &&
          Date.now() - entry.updatedAt <= browserCacheLifetime
        ) {
          updatedAt = entry.updatedAt;
          setData(entry.data);
        } else {
          window.localStorage.removeItem(key);
        }
      }
    } catch {
      // Continue with the bundled fallback if browser storage is unavailable.
    }

    if (updatedAt && Date.now() - updatedAt < browserRefreshAfter) {
      return () => {
        active = false;
      };
    }

    void loadOnce(key, load)
      .then((freshData) => {
        if (!active) return;
        setData(freshData);
        try {
          window.localStorage.setItem(
            key,
            JSON.stringify({ updatedAt: Date.now(), data: freshData } satisfies CacheEntry<T>),
          );
        } catch {
          // Keep fresh data in memory when browser storage is full.
        }
      })
      .catch(() => {
        // Keep showing cached or bundled data if the API is temporarily unavailable.
      });

    return () => {
      active = false;
    };
  }, [key, load]);

  return data;
}
