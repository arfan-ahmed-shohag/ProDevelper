# Performance audit and implementation plan

Audit date: 2026-11-03. Existing uncommitted changes were present before this work;
they are preserved. This is an optimization of the existing app, not a rebuild.

## Evidence before implementation

- Both showcase pages initially request 10 items, but `getShowcaseFilters` then
  downloads **every post's taxonomy assignments** using `fetchAllPages`. At 700
  posts this adds seven post-list requests per kind plus taxonomy requests.
- Showcase pagination and filters import a top-level `use server` module into a
  client component, making repeat read requests Server Function POSTs.
- Showcase localStorage stores only page one. Initial server data is not seeded,
  loaded pages are not restored, rapid clicks can append duplicate cards, and a
  failed replacement request clears visible results. URL filters first run with
  empty taxonomy groups, then run again when filters arrive.
- The shared cache policy already revalidates server data after 60 seconds, but
  its **client router stale time is 30 days** and its server expiry is 31 days.
  Those are different settings; the issue is not a month-long server revalidate.
- Featured projects, feedback, and services have no request timeout. Service
  details reuse the small service dictionary, including content/process data;
  that reuse was retained after verifying per-detail requests increased build
  request fan-out.
- Webhooks omit project/demo filter tags on post changes and do not accept demo
  tags or featured-project taxonomy changes.
- The service worker serves saved HTML without consulting its age. Background
  HTML hashes can change with Next transport payloads and trigger router refreshes.
  A failed navigation refresh can cause a second network request. Page storage
  has no size limit and expired assets are kept indefinitely while offline.
- Theme CSS uses local Jakarta/Inter files with `font-display: block`, while the
  layout downloads/preloads unused Geist fonts. Process images have only a width
  and use unoptimized raw images. Other image cards reserve space and use sizes.
- GSAP contexts/listeners are generally cleaned up correctly. Dashboard imports
  GSAP eagerly and starts an infinite timeline; technology rails keep scheduling
  frames when outside the viewport and under reduced motion. Lenis has CSS and a
  dependency but no active JavaScript initializer. No third-party script or
  analytics loader was found. Static route content remains server rendered.
- Existing routes: home, both showcases, about, services, service details,
  feedback, FAQ, privacy, terms, and not-found. There is no contact or blog route
  implementation in this repository; optimization must not invent either route.
- Baseline sandbox build could not fetch Google Fonts; retried with authorized
  network access. Baseline lint/type/build results and timings are recorded below
  after the runs complete. No Lighthouse or field CWV numbers are assumed.

## Priorities and verification stages

1. **Data and freshness:** shared bounded WordPress requests; normalized cached
   showcase pages; public GET readers; correctly scoped taxonomy counts without
   post crawling; complete authenticated webhook invalidation. Verify types,
   validation, request construction, errors, and production rendering.
2. **Browser data:** versioned native IndexedDB, 30-day refresh-based retention,
   per-page storage, limits/cleanup, cache-first restoration, background refresh,
   cancellation, deduplication, and URL/pagination race handling. Verify storage
   failure and offline paths, contiguous restoration, and query isolation.
3. **Offline HTML/assets:** bounded and age-limited service-worker caches,
   conditional ETag requests, transport exclusions, and quiet update handling.
   Verify navigation, 304, offline fallback, expiry, and cache upgrades.
4. **Rendering/resources:** preserve typography/animation design while removing
   unused font work, reserve process-image space, and pause/defer nonessential
   animation work. Verify lint, types, production build, and browser rendering.
5. **Report:** record reproducible automated and browser checks, actual measured
   timings/bundle sizes where available, deployment configuration, and any
   WordPress-side installation required. Distinguish lab checks from field CWV.

Installed references read: `use-cache`, `cacheLife`, `cacheTag`, `revalidateTag`,
`revalidatePath`, Route Handlers, Image, and Font documentation under
`node_modules/next/dist/docs/01-app/`.

## Implemented behavior

- `/api/showcase` is a public GET reader of published portfolio data. Both the
  initial Server Components and this reader use the same normalized cached
  functions. Each kind/page/search/filter combination has a separate key;
  selected ID order and duplicates normalize before cache lookup. Query length,
  page, kind, and resource inputs are bounded. Errors never expose upstream URLs
  or environment values. Server-only code is guarded by `server-only` imports.
- `getShowcaseFilters` no longer crawls post collections. A scoped WordPress
  aggregation helper is supplied separately. Until it is installed, only taxonomy
  dictionaries are read and ambiguous counts are omitted. See
  [WordPress deployment instructions](./wordpress-cache-revalidation.md).
- The common `use cache` policy is `stale: 60, revalidate: 60, expire: 3600`
  (seconds). Projects and demos have separate data and filter tags. Concurrent
  identical WordPress requests within a process share work and get independent
  response bodies. Origin requests have 15-second attempt timeouts, at most one
  retry, and bounded retry delays. Client GET requests time out after 35 seconds.
  An upstream outage can still fail a cold prerender or read; it is not converted
  into a successful empty project page. Next's default cache is per process; no
  multi-instance shared cache backend was added.
- Native IndexedDB database `prodeveloper-dynamic`, schema version 1, stores one
  entry per requested page/query/kind plus filter dictionaries. The original
  successful `refreshedAt` travels with project pages from the origin fetch;
  reading an entry does not reset it. Retention is 30 days, with a shared limit
  of 120 records / 12 MiB and a 512 KiB maximum per entry. Expired/corrupt/schema-
  mismatched entries are ignored and cleaned on writes. Reads and database opens
  have bounded waits; denied storage, blocked upgrades and quota errors fall back
  to server/network data.
- Initial server data seeds page one. Repeat visits restore valid contiguous
  saved pages first, then refresh those previously requested pages (at most three
  concurrent page refreshes). Fresh results replace their page entries; unchanged
  cards/totals do not trigger a result-state update. Requests deduplicate and
  superseded query requests abort. Failed refreshes retain cards and expose retry;
  reconnect and visible one-minute checks retry the active query. Load More adds
  exactly one page, guards rapid clicks, and queues a click during background
  refresh. No entire project collection is fetched to populate storage.
- URL search/filter state survives back/forward and filtered reloads. Slug URLs
  wait for taxonomy resolution, and refreshed dictionaries reapply URL selection
  when necessary. Public headings and existing metadata remain server rendered.
- Service-worker v2 caches only allowlisted public HTML navigations and static
  assets. API, RSC, Next transport/prefetch, Server Function, POST and authorized
  requests bypass the HTML cache. HTML uses conditional ETag validation; 304
  extends a successful validation timestamp. Missing/deleted/noindex pages are
  removed. Storage is capped at 20 HTML pages, 96 assets, and 32 MiB per cache.
  Maximum retention is 30 days; unhashed assets refresh after one day. New worker
  activation removes this app's older namespaces only. First-visit assets are
  copied through the browser HTTP cache after registration; dynamic data remains
  solely in IndexedDB. Updated HTML is available on the next navigation, without
  update-triggered reloads of the current page.
- Existing Jakarta/Inter local files and weights are registered with
  `next/font/local` and swap display, with no blanket font preloading. Unused
  Geist downloads/preloads were removed. GSAP is loaded after hydration; rail and
  dashboard animation work pauses outside the viewport. Static service card lists
  skip the unused browser-cache/action wrapper. Existing responsive card images
  retain dimensions, lazy loading and sizes. Process images use Next Image when
  WordPress supplies their actual dimensions; legacy URL-only images are retained.
  A main landmark and icon-link accessible names were added without visual changes.

## Verification

- Baseline production build passed (35 outputs, 17.1 seconds static generation).
  Final build passed (36 outputs including the GET reader, 10.5 seconds static
  generation). These generation durations are single runs, not a speedup claim.
  Intermediate attempts exposed intermittent WordPress timeouts. The final bounded
  timeout was sized after observing about 4.0–4.5 seconds for three concurrent
  public WordPress service/featured/feedback requests. The external origin remains
  a reliability dependency during a cold build.
- TypeScript `tsc --noEmit`, ESLint, and service-worker syntax checks pass.
- Fourteen Node regression cases pass, covering normalized keys, one-page request
  construction, WP totals, taxonomy fallback, retry/error behavior, public query
  validation, concurrent origin readers, independent client cancellation,
  authenticated webhook tags, contiguous restoration, and service-worker
  transport exclusion, ETag validation, offline expiry, single navigation requests,
  and safe cache upgrades.
- Fifteen Chrome browser checks cover real IndexedDB timestamp/expiry/schema behavior and
  record limits, simulated denied/quota/blocked storage, contiguous-page restore,
  rapid Load More, superseded searches, back/forward, filtered URLs, 503/offline
  card retention, all ten existing routes at 1440px and 390px widths, runtime/
  hydration errors, and real offline HTML navigation through the installed worker.
- Sample production GET times: project page one 127 ms (already warm), its repeat
  8 ms, project page two 1,701 ms, demo page one 1,091 ms, demo page two 1,221 ms.
  Five concurrent cached readers completed in 51 ms, each with ten items. These
  are local samples with the real remote WordPress origin, not percentile results.
  The public API reported 256 projects / 26 pages and 616 demos / 62 pages during
  the sample; no total is hardcoded to the approximate catalogue size in the brief.

Reproduce checks with `pnpm build`, `pnpm lint`,
`node node_modules/typescript/bin/tsc --noEmit`, and
`node --test scripts/performance.test.mjs`. In the restricted Node 24 sandbox,
`--test-isolation=none` avoids a blocked worker spawn. Browser checks run via
`node scripts/performance-browser.mjs --puppeteer <module-path>` and an existing
Puppeteer/Chrome installation; set `PERF_BASE_URL` if the server is not on port
3100. No test tool was added to app dependencies. Raw lab reports are stored in
the ignored `.performance/` directory.

Lighthouse scores, LCP/CLS/TTFB/TBT, and resource transfers are recorded in
[the measured results](./performance-results.md). INP is not inferred from TBT.

## Files changed in this optimization pass

Existing edits/deletions outside this list were already present and preserved.

| Area | Files |
| --- | --- |
| WordPress/cache services | `src/lib/wordpress.ts`, `src/lib/cache-policy.ts`, `src/services/projects/index.ts`, `src/services/feedback/index.ts`, `src/services/services/index.ts` |
| Shared browser data | `src/lib/indexed-page-cache.ts`, `src/lib/showcase-query.ts`, `src/lib/showcase-client.ts`, `src/lib/use-showcase-data.ts` |
| Readers/invalidation | `src/app/api/showcase/route.ts`, `src/app/api/revalidate/route.ts` |
| Showcase routes/UI | `src/app/project-showcase/page.tsx`, `src/app/demo-showcase/page.tsx`, `src/components/project-showcase/ShowcasePageContent.tsx`, `src/components/project-showcase/ShowcaseGallery.tsx` |
| Offline HTML/assets | `public/sw.js`, `src/components/BrowserCache.tsx` |
| Typography/semantics | `src/app/layout.tsx`, `src/app/theme.css`, `src/components/home/SelectedWorkCard.tsx` |
| Animation loading/work | `src/components/Collapse.tsx`, `src/components/home/Dashboard.tsx`, `src/components/home/StatsMotion.tsx`, `src/components/home/TechnologyRail.tsx`, `src/components/about/WhyChooseUsMotion.tsx` |
| Other rendering | `src/components/ServicesSection.tsx`, `src/components/services/ServiceProcess.tsx`; policy import rename in `src/app/page.tsx`, `src/app/services/[serviceName]/page.tsx` |
| Verification/docs | `scripts/performance.test.mjs`, `scripts/performance-browser.mjs`, `docs/performance-audit.md`, `docs/performance-results.md`, `docs/wordpress-cache-revalidation.md`, `docs/wordpress-showcase-filters.php`, `.gitignore` |

## Remaining deployment work and limits

1. Install and validate `docs/wordpress-showcase-filters.php` on WordPress. It is
   supplied code, not a live-site change; PHP/WordPress execution was not available
   locally. The live reader currently reports `countsAvailable: false`. Confirm
   custom visibility rules, if any, match its published-post SQL before enabling
   counts. Until then controls work but counts are omitted and shared-taxonomy
   terms unused by the selected CPT can appear.
2. Configure the existing authenticated webhook sender for all documented post,
   taxonomy, ACF/meta and featured-membership events. The receiver/authentication
   was tested; actual WordPress-originated publish/delete delivery was not tested.
3. Return actual process image width/height in WordPress; unknown-ratio legacy
   images still use their existing renderer and can shift layout. Supplying a
   guessed ratio would change the design.
4. Investigate intermittent WordPress latency/timeouts and provide a shared Next
   cache backend if multi-instance origin deduplication is required. Existing
   cached browser content survives failures, but uncached data still needs a
   healthy origin. Offline navigation requires a previously saved HTML page and
   its assets. A cold server's initial SSR stream may still await WordPress before
   the gallery hydrates; saved service-worker HTML avoids that on repeat visits.
5. Existing color-contrast/heading-order findings and a navigation link to the
   unimplemented `/blog` route are preserved, rather than changing the design or
   removing a URL. No contact route exists in this repository. Production must set
   the existing `NEXT_PUBLIC_SITE_URL` so metadata does not use its localhost
   fallback. No field INP, real-user CWV, broad device matrix, or sustained
   multi-instance load test was measured.
