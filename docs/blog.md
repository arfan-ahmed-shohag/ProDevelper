# Blog

The current app's `/blog/` design follows the supplied pixel-bridge reference:
the existing branded hero, a two-column article grid, and a right sidebar with
search, collapsible recent posts, and topic counts. Mobile has search and a topic
selector before the cards. Read More opens `/blog/[slug]/` in the same app.
The article detail follows the reference's dark title hero, natural-size lead
image, rich body images, recent-post/topic sidebar, and previous/next navigation.
Topic filters hide categories whose WordPress post count is zero.

## WordPress data

The existing server-only `NEXT_BASE_URL` is reused. Its configured value should be
`https://prodeveloper2.com/wp-json/wp/v2`. No new environment variable is required.

- Posts: `posts?per_page=10&page=1&orderby=date&order=desc`.
- Search: add `search=wordpress`.
- Category: add `categories=5`; search/category can be combined.
- Topics: `categories?per_page=100`; additional category dictionary pages are
  supported if necessary. Post collections are never downloaded in full.
- Article: `posts?slug=<slug>&per_page=1`; full `content` is requested only here.

List requests select only the fields needed by cards. `post_meta` provides the
image, published date, author, reading time and category names. A featured-media
embed supplies an image fallback in the same posts request when the custom image
field is missing, avoiding a separate media lookup in normal reads. Totals and
page counts use WordPress's `X-WP-Total` and `X-WP-TotalPages` headers.

`GET /api/blog` reuses the same cached readers. It supports post pages, categories,
the detail article, and the detail sidebar. Examples:

```text
/api/blog?page=1
/api/blog?page=2&search=wordpress&categories=5
/api/blog?resource=categories
/api/blog?resource=article&slug=ai-chatbots
/api/blog?resource=sidebar
```

Browser URLs retain search and selected topics, for example
`/blog/?search=wordpress&categories=1672`. Back/forward and filtered refreshes are
supported. The reference's `s_query` search parameter is accepted as an alias.

## Caching and rendering

- The list, category, article, and sidebar data are read in the browser from
  IndexedDB first. Each saved query/page/article is retained for 30 days; a valid
  entry skips the API request until it expires. Search/category queries have
  separate cache keys, and reads do not extend retention.
- A cache miss requests the needed API data once and saves validated responses.
  Load More restores saved contiguous pages; uncached pages request only that
  page. Obsolete searches abort and rapid Load More clicks are guarded.
- The article endpoint returns the post independently of its sidebar. The
  client shows the article as soon as it arrives while recent posts/topics load
  from cache or in parallel. Article metadata is generated on the server from
  the server's 30-day cached article reader.
- The shared JSON GET layer now serves both showcase and blog readers.
- The service worker serves saved public HTML and assets without a network
  request for 30 days. API/RSC/Server Function responses continue to bypass HTML
  storage; dynamic page data comes from IndexedDB.
- Next's client-router cache retains visited page segments for 30 days, avoiding
  RSC roundtrips when returning to an already loaded route during that period.
- Cards use responsive Next Image with fixed image frames and image-error
  placeholders. Post links disable automatic article prefetching so opening the
  index does not fetch every article's full content.
- Article HTML is parsed with `htmlparser2`, the only new dependency.
  Only approved semantic elements and safe URLs are rendered. Scripts, styles,
  embedded frames, event handlers, arbitrary attributes and executable URL
  schemes are discarded. Existing CMS typography is preserved with scoped blog
  heading styles. Same-origin `/assets/` images and WordPress uploads are kept;
  other remote image hosts are discarded. Article metadata/canonicals and Open
  Graph data are generated from the post; missing/protected posts use the
  existing not-found behavior.

## Webhook

The existing authenticated revalidation receiver now accepts `post`/`posts` and
`category`/`categories`. Both invalidate `wp:blog:posts`, `wp:blog:categories`,
`/blog`, and `/blog/[slug]`. Configure the existing WordPress sender to send
`{"post_type":"post"}` for publish/update/delete and `{"taxonomy":"category"}`
for category changes, using its existing bearer secret. No secret is exposed in
the browser and no WordPress content was changed by this implementation.

## Validation

The initial public API inspection returned five published posts and eleven
categories, so the real feed currently has one ten-item page. Pagination is
implemented for larger collections; no placeholder records are added to reach ten.

The earlier production build completed while WordPress was unreachable. The
follow-up browser-cache change removes server-side data reads from repeat list
and detail renders. TypeScript, ESLint, the service-worker syntax check, and
twenty-two regression cases cover the existing showcase behavior
plus blog paging/fields, query isolation, API validation, webhook tags and article
HTML sanitization. Browser checks exercise the desktop/mobile layout, local article
navigation/metadata, filtered URLs, rapid 10/20/25-item pagination, search races,
back/forward, cached-card retention on 503/offline and empty categories.

During verification, the live WordPress host stopped accepting connections
from this environment (`UND_ERR_CONNECT_TIMEOUT`). Responsive/race checks therefore
used controlled WordPress responses in an isolated test copy, including the
reference's post/image fixtures. The application's `.env` and live data sources
were not replaced. The isolated test copy was removed after checking; the user's
running development server was left in place. Dependency links affected by the
temporary copy were restored from the original lockfile, and local checks were
rerun successfully. Desktop and mobile article screenshots match the reference
layout, preserve the featured image ratio, show only the populated topic, and
have no horizontal overflow. Raw test logs and screenshots remain in the ignored
`.performance/` directory. On the follow-up change, `pnpm lint` and `tsc --noEmit`
passed and Next compiled the production bundle, but the build environment returned
`spawn EPERM` while starting Next's TypeScript worker. A standalone TypeScript run
passed. Live content still needs WordPress on its first browser-cache miss.

Useful checks:

```text
pnpm build
pnpm lint
node node_modules/typescript/bin/tsc --noEmit
node --test scripts/performance.test.mjs
```
