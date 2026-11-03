// Uses an existing Puppeteer installation (for example Lighthouse's ephemeral
// dependency), without adding a runtime or development dependency to this app.
import assert from "node:assert/strict";
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const modulePath = process.argv[process.argv.indexOf("--puppeteer") + 1];
if (!modulePath || modulePath === process.argv[0]) throw new Error("Pass --puppeteer <path to puppeteer-core module>");
const imported = await import(pathToFileURL(modulePath).href);
const puppeteer = imported.default;
const base = process.env.PERF_BASE_URL || "http://localhost:3100";
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true, args: ["--no-sandbox"],
});
const results = [];
const record = (name, detail = {}) => { results.push({ name, ...detail }); console.log(`PASS ${name}`); };
const cacheCode = ts.transpileModule(fs.readFileSync("src/lib/indexed-page-cache.ts", "utf8"), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const fixture = (page, search = "", kind = "projects") => ({
  projects: Array.from({ length: 10 }, (_, i) => ({
    id: (kind === "demos" ? 10000 : 0) + (search ? 1000 : 0) + (page - 1) * 10 + i + 1,
    title: { rendered: `${kind} ${search || "saved"} ${(page - 1) * 10 + i + 1}` },
    link: "https://example.com/", "industry-type": [1],
  })), total: 40, totalPages: 4, refreshedAt: Date.now(),
});
const filters = { groups: [
  { taxonomy: "industry-type", name: "Industry", options: [{ id: 1, label: "Commerce", slug: "commerce", count: 40 }] },
  { taxonomy: "functionality", name: "Functionality", options: [{ id: 2, label: "Booking", slug: "booking", count: 20 }] },
], demoTagNames: {} };
const waitCards = (page, count) => page.waitForFunction(n => document.querySelectorAll("#project-grid-container article").length === n, { timeout: 15000 }, count);

try {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  await page.setViewport({ width: 1440, height: 1000 });
  await page.setBypassServiceWorker(true);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`${base}/faq`, { waitUntil: "networkidle2" });
  await page.evaluate(code => { const exports = {}; new Function("exports", code)(exports); window.__pageCache = exports; }, cacheCode);

  const storage = await page.evaluate(async () => {
    const api = window.__pageCache;
    const now = Date.now() - 10000;
    await api.writeCachedPage("test", 1, { ok: true }, now);
    await api.readCachedPages("test", data => data?.ok === true);
    const reread = await api.readCachedPages("test", data => data?.ok === true);
    await api.writeCachedPage("expired", 1, { ok: true }, now - api.pageRetentionMs);
    const expired = await api.readCachedPages("expired", () => true);
    const db = await new Promise((resolve, reject) => { const request = indexedDB.open("prodeveloper-dynamic", 1); request.onsuccess = () => resolve(request.result); request.onerror = reject; });
    await new Promise(resolve => {
      const tx = db.transaction("pages", "readwrite");
      tx.objectStore("pages").put({ key: "corrupt:1", scope: "corrupt", page: 1, schema: 0, refreshedAt: Date.now(), data: null });
      tx.objectStore("pages").put({ key: "expired:1", scope: "expired", page: 1, schema: 1, refreshedAt: Date.now() - 31 * 86400000, data: { ok: true } });
      tx.oncomplete = resolve;
    });
    db.close();
    const corrupted = await api.readCachedPages("corrupt", data => data?.ok === true);
    const old = await api.readCachedPages("expired", () => true);
    return { timestampPreserved: reread[0]?.refreshedAt === now, expired: expired.length + old.length, corrupted: corrupted.length };
  });
  assert.equal(storage.timestampPreserved, true);
  assert.equal(storage.expired, 0);
  assert.equal(storage.corrupted, 0);
  record("native IndexedDB retention, read timestamps, schema and corrupt entries");

  const unavailable = await page.evaluate(async code => {
    const exports = {};
    new Function("exports", "indexedDB", code)(exports, { open() { throw new DOMException("Storage denied", "SecurityError"); } });
    await exports.writeCachedPage("test", 1, {}, Date.now());
    return (await exports.readCachedPages("test", () => true)).length;
  }, cacheCode);
  assert.equal(unavailable, 0);
  record("unavailable IndexedDB degrades to network without throwing");

  for (const failure of ["quota", "blocked"]) {
    const count = await page.evaluate(async ({ code, failure }) => {
      const exports = {};
      const storage = { open() {
        const request = {};
        queueMicrotask(() => {
          if (failure === "blocked") return request.onblocked();
          request.result = { close() {}, transaction() { throw new DOMException("Quota exceeded", "QuotaExceededError"); } };
          request.onsuccess();
        });
        return request;
      } };
      new Function("exports", "indexedDB", code)(exports, storage);
      await exports.writeCachedPage("test", 1, {}, Date.now());
      return (await exports.readCachedPages("test", () => true)).length;
    }, { code: cacheCode, failure });
    assert.equal(count, 0);
    record(`${failure} IndexedDB failure preserves the rendering path`);
  }

  const limited = await page.evaluate(async () => {
    for (let i = 0; i < 125; i++) await window.__pageCache.writeCachedPage(`limit:${i}`, 1, { ok: true }, Date.now());
    const db = await new Promise(resolve => { const request = indexedDB.open("prodeveloper-dynamic", 1); request.onsuccess = () => resolve(request.result); });
    const count = await new Promise(resolve => { const request = db.transaction("pages").objectStore("pages").count(); request.onsuccess = () => resolve(request.result); });
    db.close();
    return count;
  });
  assert.ok(limited <= 120);
  record("IndexedDB cleanup limits retained records to 120");

  await page.evaluate(async ({ first, second }) => {
    const scope = JSON.stringify(["projects", "", ""]);
    await window.__pageCache.writeCachedPage(scope, 1, first, first.refreshedAt);
    await window.__pageCache.writeCachedPage(scope, 2, second, second.refreshedAt);
  }, { first: fixture(1), second: fixture(2) });
  const requests = [];
  let fail = false;
  let delay = 150;
  await page.setRequestInterception(true);
  const intercept = async request => {
    if (!request.url().includes("/api/showcase?")) return request.continue();
    const params = new URL(request.url()).searchParams;
    requests.push(Object.fromEntries(params));
    await new Promise(resolve => setTimeout(resolve, delay));
    try {
      if (fail) return await request.respond({ status: 503, contentType: "application/json", body: "{}" });
      const data = params.get("resource") === "filters" ? filters : fixture(Number(params.get("page")), params.get("search"), params.get("kind"));
      await request.respond({ status: 200, contentType: "application/json", body: JSON.stringify(data) });
    } catch { /* A superseded browser request may already be cancelled. */ }
  };
  page.on("request", intercept);
  await page.goto(`${base}/project-showcase`, { waitUntil: "networkidle2", timeout: 45000 });
  await waitCards(page, 20);
  assert.match(await page.$eval("#project-grid-container", element => element.textContent), /projects saved/);
  record("repeat visit restores two contiguous pages and refreshes only those pages");

  await page.evaluate(() => { const button = document.querySelector("#load-more-btn"); button.click(); button.click(); button.click(); });
  await waitCards(page, 30);
  assert.equal(requests.filter(item => item.page === "3").length, 1);
  const titles = await page.$$eval("#project-grid-container article h3", elements => elements.map(element => element.textContent));
  assert.equal(new Set(titles).size, 30);
  record("rapid Load More clicks produce one GET and no duplicate cards");

  // Change search while the previous debounced request is still pending.
  delay = 900;
  const typeSearch = async value => page.$eval("#searchInput", (input, text) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, text);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
  await typeSearch("old");
  await new Promise(resolve => setTimeout(resolve, 650));
  await typeSearch("new");
  await page.waitForFunction(() => document.querySelector("#project-grid-container")?.textContent.includes("projects new"), { timeout: 15000 });
  assert.ok(!(await page.$eval("#project-grid-container", element => element.textContent)).includes("projects old"));
  record("superseded search responses cannot overwrite the latest query");

  await page.evaluate(() => history.back());
  await page.waitForFunction(() => document.querySelector("#searchInput")?.value === "old");
  await page.evaluate(() => history.forward());
  await page.waitForFunction(() => document.querySelector("#searchInput")?.value === "new");
  record("browser back and forward preserve search URL state");
  await page.waitForFunction(() => document.querySelector("#project-grid-container")?.textContent.includes("projects new"));

  fail = true;
  await page.evaluate(() => window.dispatchEvent(new Event("online")));
  await page.waitForFunction(() => document.querySelector('[role="alert"]')?.textContent.includes("Saved work"), { timeout: 15000 });
  assert.equal(await page.$$eval("#project-grid-container article", elements => elements.length), 10);
  record("503 refresh preserves saved cards and offers retry");

  await page.setOfflineMode(true);
  await page.waitForFunction(() => document.body.textContent.includes("You are offline"));
  assert.equal(await page.$$eval("#project-grid-container article", elements => elements.length), 10);
  await page.setOfflineMode(false);
  fail = false;
  delay = 50;
  record("offline event keeps valid cached content visible");

  await page.goto(`${base}/project-showcase?search=new&filters=industry-type%3Acommerce`, { waitUntil: "networkidle2", timeout: 45000 });
  await page.waitForSelector('.filter-item[aria-pressed="true"]');
  assert.equal(await page.$eval("#searchInput", input => input.value), "new");
  assert.ok(requests.some(item => item.filters === "industry-type:1" && item.search === "new"));
  record("filtered URL refresh resolves slugs before requesting the selected combination");

  // Real page smoke tests retain metadata and heading output, on both viewports.
  const smoke = [];
  page.off("request", intercept);
  await page.setRequestInterception(false);
  const routes = ["/", "/about-us", "/services", "/services/wordpress-website-development", "/project-showcase", "/demo-showcase", "/client-feedback", "/faq", "/privacy-policy", "/terms-and-conditions"];
  for (const route of routes) {
    await page.setViewport({ width: 1440, height: 1000 });
    const response = await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForSelector("h1", { timeout: 15000 });
    const detail = await page.evaluate(() => ({ title: document.title, heading: document.querySelector("h1")?.textContent, canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"), overflow: document.documentElement.scrollWidth > innerWidth }));
    assert.ok([200, 304].includes(response.status()), `${route}: ${response.status()}`);
    assert.ok(detail.title && detail.heading && detail.canonical, route);
    await page.setViewport({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route} mobile overflow`);
    smoke.push({ route, status: response.status(), ...detail });
  }
  record("all ten implemented page routes render metadata and headings on desktop/mobile", { routes: smoke });
  assert.equal(errors.filter(message => /hydration|Minified React error|Cannot read/i.test(message)).length, 0, errors.join("\n"));
  record("no hydration or runtime component errors", { otherErrors: errors });
  await context.close();

  const offlineContext = await browser.createBrowserContext();
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto(`${base}/faq`, { waitUntil: "networkidle2" });
  await offlinePage.waitForFunction(() => navigator.serviceWorker.controller, { timeout: 10000 });
  await offlinePage.reload({ waitUntil: "networkidle2" });
  const stored = await offlinePage.evaluate(async () => {
    const names = await caches.keys();
    const keys = (await Promise.all(names.filter(name => name.endsWith("pages")).map(async name => (await (await caches.open(name)).keys()).map(request => request.url)))).flat();
    return { names, keys };
  });
  assert.ok(stored.keys.some(url => url.endsWith("/faq")));
  assert.ok(stored.keys.every(url => !url.includes("_rsc") && !url.includes("/api/")));
  await offlinePage.setOfflineMode(true);
  const offlineResponse = await offlinePage.reload({ waitUntil: "domcontentloaded" });
  assert.equal(offlineResponse.status(), 200);
  assert.equal(offlineResponse.fromServiceWorker(), true);
  await offlinePage.waitForSelector("h1");
  record("real service worker serves saved HTML offline and stores no Next transport pages", stored);
  await offlineContext.close();
} finally {
  await browser.close();
  fs.mkdirSync(".performance", { recursive: true });
  fs.writeFileSync(".performance/browser-tests.json", JSON.stringify(results, null, 2));
}
