import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

function loader(overrides = {}, globals = {}) {
  const modules = new Map();
  function load(name) {
    if (Object.hasOwn(overrides, name)) return overrides[name];
    if (name === "server-only") return {};
    if (!name.startsWith("@/")) return require(name);
    const filename = path.resolve("src", `${name.slice(2)}.ts`);
    const resolved = fs.existsSync(filename) ? filename : path.resolve("src", name.slice(2), "index.ts");
    if (modules.has(resolved)) return modules.get(resolved).exports;
    const code = ts.transpileModule(fs.readFileSync(resolved, "utf8"), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    }).outputText;
    const loaded = { exports: {} };
    modules.set(resolved, loaded);
    const context = { module: loaded, exports: loaded.exports, require: load, process: { env: { NEXT_BASE_URL: "https://wordpress.test/wp-json/wp/v2", WORDPRESS_REVALIDATE_SECRET: "test-secret" } },
      fetch, Request, Response, URL, URLSearchParams, Headers, AbortSignal, AbortController, DOMException, Buffer, setTimeout, clearTimeout, ...globals };
    vm.runInNewContext(code, context, { filename: resolved });
    return loaded.exports;
  }
  return load;
}

const cache = { cacheLife() {}, cacheTag() {}, revalidateTag() {}, revalidatePath() {} };

test("query keys normalize order/duplicates and isolate search case", () => {
  const { normalizeShowcaseQuery, showcaseScope } = loader()("@/lib/showcase-query");
  const result = normalizeShowcaseQuery("  Design  ", "functionality:9,2,9;industry-type:4;functionality:3;other:12");
  assert.equal(result.search, "Design");
  assert.equal(result.filters, "functionality:2,3,9;industry-type:4");
  assert.notEqual(showcaseScope("projects"), showcaseScope("demos"));
  assert.notEqual(showcaseScope("projects", "Design"), showcaseScope("projects", "design"));
});

test("project and demo reads request exactly one 10-item page and preserve WP totals", async () => {
  const calls = [];
  const load = loader({ "next/cache": cache }, { fetch: async (url, init) => {
    calls.push({ url: new URL(url), init });
    return Response.json([], { headers: { "X-WP-Total": "700", "X-WP-TotalPages": "70" } });
  } });
  const service = load("@/services/projects");
  const result = await service.getShowcaseResults("projects", 2, "test", "industry-type:4");
  await service.getShowcaseResults("demos", 1);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url.searchParams.get("per_page"), "10");
  assert.equal(calls[0].url.searchParams.get("page"), "2");
  assert.equal(calls[0].url.searchParams.get("industry-type[]"), "4");
  assert.equal(calls[0].url.searchParams.get("_embed"), "wp:featuredmedia");
  assert.equal(calls[0].init.cache, "no-store");
  assert.match(calls[1].url.pathname, /d-showcase$/);
  assert.equal(result.total, 700);
  assert.equal(result.totalPages, 70);
  assert.ok(result.refreshedAt > 0);
});

test("missing aggregation endpoint never crawls posts or fabricates shared term counts", async () => {
  const calls = [];
  const load = loader({ "next/cache": cache }, { fetch: async url => {
    calls.push(new URL(url).pathname);
    if (url.includes("showcase-filters")) return Response.json({}, { status: 404 });
    return Response.json([{ id: 1, name: "Commerce", slug: "commerce", count: 999 }]);
  } });
  const result = await load("@/services/projects").getShowcaseFilters("projects");
  assert.equal(result.countsAvailable, false);
  assert.equal(result.groups[0].options[0].count, null);
  assert.ok(calls.every(url => !/p-showcase|d-showcase/.test(url)));
  assert.equal(calls.length, 3);
});

test("429 and 500 retry once; hard errors and timeout failures remain errors", async () => {
  for (const status of [429, 500, 404]) {
    let calls = 0;
    const load = loader({}, { setTimeout: fn => { fn(); return 0; }, fetch: async () => {
      calls++;
      return calls === 1 ? Response.json({}, { status }) : Response.json([]);
    } });
    const request = load("@/lib/wordpress").fetchWordPress("https://wordpress.test");
    if (status === 404) await assert.rejects(request, error => error.status === 404);
    else assert.ok((await request).ok);
    assert.equal(calls, status === 404 ? 1 : 2);
  }
  let calls = 0;
  const load = loader({}, { fetch: async () => { calls++; throw new DOMException("Timed out", "TimeoutError"); } });
  await assert.rejects(load("@/lib/wordpress").fetchWordPress("https://wordpress.test"), error => error.status === 504);
  assert.equal(calls, 2);
});

test("GET reader validates public inputs and shares the service implementation", async () => {
  let calls = 0;
  const load = loader({ "@/services/projects": {
    getShowcaseResults: async () => { calls++; return { projects: [], total: 0, totalPages: 0 }; },
    getShowcaseFilters: async () => ({}),
  } });
  const { GET } = load("@/app/api/showcase/route");
  for (const query of ["kind=private", "kind=projects&page=0", "kind=demos&page=NaN", `kind=projects&search=${"a".repeat(201)}`]) {
    assert.equal((await GET(new Request(`https://site.test/api/showcase?${query}`))).status, 400);
  }
  const response = await GET(new Request("https://site.test/api/showcase?kind=projects&page=2"));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(calls, 1);
});

test("concurrent server readers share WordPress requests and receive independent bodies", async () => {
  let count = 0;
  const load = loader({}, { fetch: async () => { count++; return Response.json({ ok: true }); } });
  const { fetchWordPress } = load("@/lib/wordpress");
  const [first, second] = await Promise.all([fetchWordPress("https://wordpress.test"), fetchWordPress("https://wordpress.test")]);
  assert.equal((await first.json()).ok, true);
  assert.equal((await second.json()).ok, true);
  assert.equal(count, 1);
});

test("authenticated webhook covers project/demo edits, deletes, tags and featured taxonomy", async () => {
  const tags = [];
  const load = loader({ "next/cache": { ...cache, revalidateTag: tag => tags.push(tag) } });
  const { POST } = load("@/app/api/revalidate/route");
  assert.equal((await POST(new Request("https://site.test/api/revalidate", { method: "POST", body: "{}" }))).status, 401);
  for (const [key, type, expected] of [
    ["post_type", "p-showcase", "wp:showcase:projects:filters"],
    ["type", "d-showcase", "wp:showcase:demos:filters"],
    ["taxonomy", "demo-tags", "wp:showcase:demos:filters"],
    ["taxonomy", "project-categories", "wp:home:featured-projects"],
    ["taxonomy", "industry-type", "wp:showcase:projects:filters"],
    ["taxonomy", "functionality", "wp:showcase:demos:filters"],
  ]) {
    tags.length = 0;
    const response = await POST(new Request("https://site.test/api/revalidate", { method: "POST", headers: { Authorization: "Bearer test-secret" }, body: JSON.stringify({ [key]: type, action: "delete" }) }));
    assert.equal(response.status, 200);
    assert.ok(tags.includes(expected));
  }
});

test("restoration accepts only contiguous cached pages", () => {
  const { contiguousPages } = loader()("@/lib/indexed-page-cache");
  assert.equal(contiguousPages([{ page: 1, data: "a" }, { page: 3, data: "c" }]).size, 1);
  assert.equal(contiguousPages([{ page: 3, data: "c" }, { page: 2, data: "b" }, { page: 1, data: "a" }]).size, 3);
});

test("client GET requests deduplicate while subscribers cancel independently", async () => {
  let count = 0;
  let complete;
  const load = loader({}, { fetch: () => { count++; return new Promise(resolve => { complete = resolve; }); } });
  const { requestShowcasePage } = load("@/lib/showcase-client");
  const first = new AbortController();
  const second = new AbortController();
  const one = requestShowcasePage("projects", 1, "", "", first.signal);
  const two = requestShowcasePage("projects", 1, "", "", second.signal);
  const rejected = assert.rejects(one, error => error.name === "AbortError");
  first.abort();
  complete(Response.json({ projects: [], total: 0, totalPages: 0, refreshedAt: Date.now() }));
  await rejected;
  assert.equal((await two).total, 0);
  assert.equal(count, 1);
});

test("corrupt cached render fields are rejected without throwing", () => {
  const { isShowcaseResult } = loader()("@/lib/showcase-client");
  const page = { projects: [{ id: 1, title: { rendered: "Test" }, link: "https://example.com/" }], total: 1, totalPages: 1, refreshedAt: Date.now() };
  assert.equal(isShowcaseResult(page), true);
  for (const bad of [null, { tag_list: {} }, { project_data: { featured_image: {} } }, { _embedded: { "wp:featuredmedia": [null] } }]) {
    assert.equal(isShowcaseResult({ ...page, projects: [bad === null ? null : { ...page.projects[0], ...bad }] }), false);
  }
});

function serviceWorker(network) {
  const events = new Map();
  const stores = new Map();
  const key = request => typeof request === "string" ? request : request.url;
  const caches = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const data = stores.get(name);
      return {
        match: async request => data.get(key(request))?.clone(),
        put: async (request, response) => data.set(key(request), response.clone()),
        delete: async request => data.delete(key(request)),
        keys: async () => [...data.keys()].map(url => new Request(url)),
      };
    },
    keys: async () => [...stores.keys()], delete: async name => stores.delete(name),
  };
  const self = { location: { origin: "https://site.test" }, addEventListener: (name, callback) => events.set(name, callback),
    skipWaiting: async () => {}, clients: { claim: async () => {} } };
  vm.runInNewContext(fs.readFileSync("public/sw.js", "utf8"), {
    self, caches, fetch: network, Request, Response, Headers, URL, AbortSignal, Date,
  });
  async function navigate(url, options = {}) {
    let result;
    const work = [];
    events.get("fetch")({ request: { url, method: "GET", mode: "navigate", headers: new Headers(), ...options },
      waitUntil: promise => work.push(promise), respondWith: promise => { result = promise; } });
    const response = result ? await result : undefined;
    await Promise.all(work);
    return response;
  }
  return { caches, stores, navigate, events };
}

test("service worker never stores RSC, Server Functions or API responses as HTML", async () => {
  let count = 0;
  const sw = serviceWorker(async () => { count++; return new Response("<h1>Page</h1>", { headers: { "Content-Type": "text/html" } }); });
  for (const headers of [{ RSC: "1" }, { "Next-Action": "abc" }, { "Next-Router-Prefetch": "1" }, { "Next-Router-State-Tree": "abc" }]) {
    assert.equal(await sw.navigate("https://site.test/", { headers: new Headers(headers) }), undefined);
  }
  assert.equal(await sw.navigate("https://site.test/api/showcase?kind=projects"), undefined);
  assert.equal(await sw.navigate("https://site.test/?_rsc=test"), undefined);
  assert.equal(await sw.navigate("https://site.test/", { method: "POST" }), undefined);
  assert.equal(count, 0);
});

test("service worker shares one navigation request, conditionally validates, and expires offline HTML", async () => {
  let count = 0, offline = false, conditional = false;
  const sw = serviceWorker(async (_url, init) => {
    count++;
    if (offline) throw new Error("Offline");
    if (conditional) {
      assert.equal(init.headers.get("If-None-Match"), '"v1"');
      return new Response(null, { status: 304 });
    }
    return new Response("<h1>Saved</h1>", { headers: { "Content-Type": "text/html", ETag: '"v1"' } });
  });
  assert.equal((await sw.navigate("https://site.test/")).status, 200);
  assert.equal(count, 1);
  conditional = true;
  assert.match(await (await sw.navigate("https://site.test/")).text(), /Saved/);
  offline = true;
  assert.match(await (await sw.navigate("https://site.test/")).text(), /Saved/);
  const meta = await sw.caches.open("prodeveloper-browser-v2-metadata");
  await meta.put("https://site.test/", Response.json({ savedAt: Date.now() - 31 * 86400000 }));
  assert.equal((await sw.navigate("https://site.test/")).status, 503);
  assert.equal(await (await sw.caches.open("prodeveloper-browser-v2-pages")).match("https://site.test/"), undefined);
});

test("service worker returns an upstream error without issuing a duplicate navigation", async () => {
  let count = 0;
  const sw = serviceWorker(async () => { count++; return new Response("Unavailable", { status: 500 }); });
  assert.equal((await sw.navigate("https://site.test/")).status, 500);
  assert.equal(count, 1);
});

test("service worker upgrades clean only this application's older caches", async () => {
  const sw = serviceWorker(fetch);
  await sw.caches.open("unrelated-cache");
  await sw.caches.open("prodeveloper-browser-v1-pages");
  let work;
  sw.events.get("activate")({ waitUntil: promise => { work = promise; } });
  await work;
  assert.equal(sw.stores.has("unrelated-cache"), true);
  assert.equal(sw.stores.has("prodeveloper-browser-v1-pages"), false);
});
