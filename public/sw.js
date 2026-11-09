const PREFIX = "prodeveloper-browser-v2-";
const PAGE_CACHE = `${PREFIX}pages`;
const ASSET_CACHE = `${PREFIX}assets`;
const META_CACHE = `${PREFIX}metadata`;
const RETENTION = 30 * 24 * 60 * 60 * 1000;
const updates = new Map();

function pageUrl(value) {
  const url = new URL(value, self.location.origin);
  const path = url.pathname.replace(/\/$/, "") || "/";
  // Only the public routes implemented by this app may store HTML.
  if (url.origin !== self.location.origin ||
    !/^\/(?:about-us|services(?:\/[a-z0-9-]+)?|blog(?:\/[a-z0-9%_-]+)?|project-showcase|demo-showcase|client-feedback|faq|privacy-policy|terms-and-conditions)?$/i.test(path) ||
    [...url.searchParams.keys()].some(key => !(path === "/blog" ? ["search", "s_query", "categories", "category"] : ["search", "filters"]).includes(key)) || url.search.length > 1600) return null;
  url.pathname = path;
  url.hash = "";
  url.searchParams.sort();
  return url.href;
}

function isAsset(value) {
  if (typeof value !== "string") return false;
  const url = new URL(value, self.location.origin);
  return url.origin === self.location.origin && (
    url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/fonts/") || url.pathname === "/_next/image"
  );
}

async function metadata(key) {
  try {
    const response = await (await caches.open(META_CACHE)).match(key);
    const saved = response ? await response.json() : null;
    return Number.isFinite(saved?.savedAt) && saved.savedAt <= Date.now() + 60000 ? saved : null;
  } catch { return null; }
}

async function forget(cacheName, key) {
  await Promise.all([
    caches.open(cacheName).then(cache => cache.delete(key)),
    caches.open(META_CACHE).then(cache => cache.delete(typeof key === "string" ? key : key.url)),
  ]);
}

async function freshPage(key) {
  try {
    const cache = await caches.open(PAGE_CACHE);
    const response = await cache.match(key);
    if (!response) return null;
    const saved = await metadata(key);
    if (saved && Date.now() - saved.savedAt < RETENTION) return response;
    await forget(PAGE_CACHE, key);
  } catch { /* Fall through to the network when cached navigation is unreadable. */ }
  return null;
}

async function trim(cacheName, limit) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const entries = await Promise.all(keys.map(async key => ({ key, saved: await metadata(key.url) })));
  entries.sort((a, b) => (b.saved?.savedAt || 0) - (a.saved?.savedAt || 0));
  let bytes = 0;
  await Promise.all(entries.filter((entry, index) => {
    bytes += entry.saved?.bytes || 0;
    return index >= limit || bytes > 32 * 1024 * 1024 || !entry.saved || Date.now() - entry.saved.savedAt >= RETENTION;
  }).map(entry => forget(cacheName, entry.key)));
}

async function remember(cacheName, key, response, etag, bytes = 0) {
  if (!bytes) bytes = (await response.clone().blob()).size;
  if (bytes > 5 * 1024 * 1024 || response.headers.has("set-cookie")) return;
  await (await caches.open(cacheName)).put(key, response.clone());
  await (await caches.open(META_CACHE)).put(typeof key === "string" ? key : key.url,
    Response.json({ savedAt: Date.now(), etag, bytes }));
  await trim(cacheName, cacheName === PAGE_CACHE ? 20 : 96);
}

function refreshPage(key) {
  if (updates.has(key)) return updates.get(key);
  const update = (async () => {
    const previous = await metadata(key);
    const headers = new Headers({ Accept: "text/html" });
    if (previous?.etag) headers.set("If-None-Match", previous.etag);
    const response = await fetch(key, { headers, cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (response.status === 304) {
      const cached = await (await caches.open(PAGE_CACHE)).match(key);
      if (cached) {
        await (await caches.open(META_CACHE)).put(key, Response.json({ ...previous, savedAt: Date.now() }));
        return cached;
      }
      // A metadata entry alone is not a usable navigation response.
      await forget(PAGE_CACHE, key);
      return fetch(key, { headers: { Accept: "text/html" }, cache: "no-store", signal: AbortSignal.timeout(10000) });
    }
    if (response.status === 404 || response.status === 410) await forget(PAGE_CACHE, key);
    if (response.ok && !response.redirected && response.headers.get("content-type")?.includes("text/html")) {
      const html = await response.clone().text();
      if (/name="robots"[^>]*content="[^"]*noindex|NEXT_HTTP_ERROR_FALLBACK;404/.test(html)) {
        await forget(PAGE_CACHE, key);
      } else {
        await remember(PAGE_CACHE, key, response, response.headers.get("etag"), html.length * 2).catch(() => {});
      }
    }
    return response;
  })().finally(() => updates.delete(key));
  updates.set(key, update);
  return update;
}

async function asset(request, warm = false) {
  let cached;
  try {
    cached = await (await caches.open(ASSET_CACHE)).match(request);
    const saved = cached ? await metadata(request.url) : null;
    const age = saved ? Date.now() - saved.savedAt : Infinity;
    if (age >= RETENTION) { await forget(ASSET_CACHE, request); cached = undefined; }
    if (cached && age < RETENTION) return cached;
  } catch { /* Storage can be disabled independently of the network. */ }
  try {
    // First-visit resources arrived before SW control. Reuse the browser HTTP
    // cache when copying them into offline storage instead of redownloading them.
    const response = await fetch(request, warm ? { cache: "force-cache" } : undefined);
    if (response.ok && !response.headers.get("cache-control")?.includes("no-store")) {
      await remember(ASSET_CACHE, request, response, undefined, Number(response.headers.get("content-length") || 0)).catch(() => {});
    }
    return response;
  } catch (error) {
    if (cached) return cached;
    throw error;
  }
}

const offlineResponse = () => new Response(
  '<!doctype html><html lang="en"><meta name="viewport" content="width=device-width"><title>Offline | Prodeveloper2</title><body><main><h1>You are offline</h1><p>This page has not been saved. Reconnect and try again.</p><button onclick="location.reload()">Try again</button></main></body></html>',
  { status: 503, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } },
);

self.addEventListener("install", event => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", event => event.waitUntil((async () => {
  const names = await caches.keys();
  await Promise.all(names.filter(name => name.startsWith("prodeveloper-browser-") && !name.startsWith(PREFIX)).map(name => caches.delete(name)));
  await Promise.all([trim(PAGE_CACHE, 120), trim(ASSET_CACHE, 96)]).catch(() => {});
  await self.clients.claim();
})()));

self.addEventListener("fetch", event => {
  const { request } = event;
  if (request.method !== "GET" || request.headers.has("authorization") || request.headers.has("RSC") ||
    request.headers.has("Next-Action") || request.headers.has("Next-Router-State-Tree") || request.headers.has("Next-Router-Prefetch") ||
    new URL(request.url).searchParams.has("_rsc")) return;
  const key = request.mode === "navigate" ? pageUrl(request.url) : null;
  if (key) {
    event.respondWith((async () => {
      const cached = await freshPage(key);
      if (cached) return cached;
      try { return await refreshPage(key); } catch { return offlineResponse(); }
    })());
  } else if (isAsset(request.url)) {
    event.respondWith(asset(request));
  }
});

self.addEventListener("message", event => {
  if (!event.source || new URL(event.source.url).origin !== self.location.origin) return;
  if (!["CHECK_PAGE", "WARM_PAGE"].includes(event.data?.type)) return;
  const key = pageUrl(event.data?.path || "/");
  if (!key) return;
  event.waitUntil((async () => {
    if (event.data.type === "WARM_PAGE") {
      if (!(await freshPage(key))) await refreshPage(key);
      const assets = Array.isArray(event.data.assets) ? [...new Set(event.data.assets)].filter(isAsset).slice(0, 96) : [];
      for (let start = 0; start < assets.length; start += 4) {
        await Promise.all(assets.slice(start, start + 4).map(url => asset(new Request(url), true).catch(() => {})));
      }
    } else {
      if (!(await freshPage(key))) await refreshPage(key);
    }
  })().catch(() => {}));
});
