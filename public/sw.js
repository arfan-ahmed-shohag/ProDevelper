const PREFIX = "prodeveloper-browser-v1-";
const PAGE_CACHE = `${PREFIX}pages`;
const ASSET_CACHE = `${PREFIX}assets`;
const META_CACHE = `${PREFIX}metadata`;
// Keep static resources cached beyond a calendar month to avoid edge expiry.
const MONTH = 32 * 24 * 60 * 60 * 1000;
const updates = new Map();

function pageUrl(value) {
  const url = new URL(value, self.location.origin);
  const path = url.pathname.replace(/\/$/, "");
  const privateOrInternal = /^\/(?:_next|api|wp-admin|wp-login|wp-json)(?:\/|$)/i.test(path);
  const filePath = /\/[^/]+\.[a-z0-9]{1,8}$/i.test(path);
  if (url.origin !== self.location.origin || url.search || privateOrInternal || filePath) return null;
  return new URL(path || "/", self.location.origin).href;
}

async function forgetPage(key) {
  const pages = await caches.open(PAGE_CACHE);
  const metadataCache = await caches.open(META_CACHE);
  await Promise.all([pages.delete(key), metadataCache.delete(key)]);
}

function isAsset(value) {
  const url = new URL(value, self.location.origin);
  return url.origin === self.location.origin && (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/assets/") ||
    url.pathname === "/_next/image"
  );
}

async function metadata(key) {
  const cache = await caches.open(META_CACHE);
  const response = await cache.match(key);
  return response ? response.json() : null;
}

async function remember(cacheName, key, response, version) {
  const cache = await caches.open(cacheName);
  await cache.put(key, response.clone());
  const meta = await caches.open(META_CACHE);
  await meta.put(typeof key === "string" ? key : key.url, Response.json({ savedAt: Date.now(), version }));
}

async function notify(path) {
  const clients = await self.clients.matchAll({ type: "window" });
  for (const client of clients) {
    client.postMessage({ type: "PAGE_UPDATED", path });
  }
}

function refreshPage(key) {
  if (updates.has(key)) return updates.get(key);
  const update = (async () => {
    const previous = await metadata(key);
    const headers = new Headers({ Accept: "text/html" });
    if (previous?.version?.startsWith('"') || previous?.version?.startsWith('W/"')) {
      headers.set("If-None-Match", previous.version);
    }
    // Never persist or replay Next.js RSC/prefetch transport responses as HTML.
    const response = await fetch(key, { headers, cache: "no-store" });
    if (response.status === 304) {
      const meta = await caches.open(META_CACHE);
      await meta.put(key, Response.json({ ...previous, savedAt: Date.now() }));
      return;
    }
    if (response.status === 404 || response.status === 410) {
      await forgetPage(key);
      return;
    }
    if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) return;
    const html = await response.clone().text();
    if (/name="robots"[^>]*content="[^"]*noindex|NEXT_HTTP_ERROR_FALLBACK;404/.test(html)) {
      await forgetPage(key);
      return;
    }
    let version = response.headers.get("etag");
    if (!version) {
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(html));
      version = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    }
    await remember(PAGE_CACHE, key, response, version);
    if (previous && previous.version !== version) {
      await notify(new URL(key).pathname.replace(/\/$/, ""));
    }
  })().finally(() => updates.delete(key));
  updates.set(key, update);
  return update;
}

async function asset(request) {
  const cache = await caches.open(ASSET_CACHE);
  // Keep the request's Vary headers in the cache key, especially for optimized images.
  const cached = await cache.match(request);
  const saved = cached ? await metadata(request.url) : null;
  if (cached && saved && Date.now() - saved.savedAt < MONTH) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      await remember(ASSET_CACHE, request, response).catch(() => {});
    }
    return response;
  } catch (error) {
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener("install", (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith("prodeveloper-browser-") && !name.startsWith(PREFIX)).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || request.headers.has("RSC") || request.headers.has("Next-Router-State-Tree") || request.headers.has("Next-Router-Prefetch")) return;
  const key = request.mode === "navigate" ? pageUrl(request.url) : null;
  if (key) {
    // Start the check immediately so waitUntil is registered during the event.
    const update = refreshPage(key).catch(() => {});
    event.waitUntil(update);
    event.respondWith((async () => {
      const cache = await caches.open(PAGE_CACHE);
      const cached = await cache.match(key);
      // Always show a saved page immediately; keep refreshing it in background.
      if (cached) return cached;
      await update;
      return (await cache.match(key)) || cached || fetch(request);
    })());
  } else if (isAsset(request.url)) {
    event.respondWith(asset(request));
  }
});

self.addEventListener("message", (event) => {
  if (!event.source || new URL(event.source.url).origin !== self.location.origin) return;
  const key = pageUrl(event.data?.path || "/");
  if (!key || !["CHECK_PAGE", "WARM_PAGE"].includes(event.data?.type)) return;
  const work = [];
  if (event.data.type === "WARM_PAGE") {
    work.push(caches.open(PAGE_CACHE).then(async (cache) => {
      if (!(await cache.match(key))) await refreshPage(key);
    }).catch(() => {}));
    const assets = Array.isArray(event.data.assets) ? event.data.assets : [];
    work.push(...assets.filter(isAsset).map((url) => asset(new Request(url)).catch(() => {})));
  } else {
    work.push(refreshPage(key).catch(() => {}));
  }
  event.waitUntil(Promise.all(work));
});
