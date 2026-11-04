# WordPress cache revalidation

The Next.js app exposes `POST /api/revalidate`. It accepts only the content types
listed below and invalidates their related data and page caches. It does not
change WordPress data.

Set `WORDPRESS_REVALIDATE_SECRET` in the Next.js deployment environment to a
random secret. Configure the WordPress webhook sender to make a POST request to
`https://<your-site>/api/revalidate` after publishing, updating, or deleting a
post or taxonomy term. Send the secret as a bearer token and include the
WordPress REST base slug in the JSON body:

```http
Authorization: Bearer <WORDPRESS_REVALIDATE_SECRET>
Content-Type: application/json
```

```json
{"post_type":"d-showcase"}
```

Accepted values are `service`, `p-showcase`, `d-showcase`, `c-feedback`,
`industry-type`, `functionality`, `demo-tags`, and `project-categories`.
The aliases `project-showcase` and
`demo-showcase` are also accepted. Requests without a valid secret are rejected.

Blog events additionally accept `post` (alias `posts`) and `category` (alias
`categories`). They invalidate `wp:blog:posts`, `wp:blog:categories`, `/blog`, and
`/blog/[slug]`. See [the blog setup](./blog.md) for query and rendering behavior.

Existing payload keys `post_type`, `taxonomy`, and `type` are supported, in that
precedence order. Send one content type per request. The action can be publish,
update, delete, trash/untrash, status change, or taxonomy assignment change: the
same type invalidates all affected entries regardless of action.

Project changes invalidate `wp:showcase:projects`,
`wp:showcase:projects:filters`, `wp:home:featured-projects`, and `wp:home`.
Demo changes invalidate `wp:showcase:demos` and `wp:showcase:demos:filters`.
Shared industry/functionality changes invalidate both kinds and filter caches;
demo tag changes invalidate demos; featured-category changes invalidate projects
and the featured home/service sections. Ensure meta/ACF changes and changes to
featured category membership also trigger the corresponding post webhook.

`revalidateTag(tag, "max")` marks data stale; the next read can serve it while
Next regenerates it. `revalidatePath` also invalidates the affected page routes,
including the service detail pattern where featured projects/reviews appear.
There is no webhook parameter that can invalidate arbitrary tags or paths.

Most server entries revalidate after 60 seconds and expire after one hour. Blog
article bodies use a 30-day server cache. Next client-router segments, browser
IndexedDB/localStorage data, and service-worker pages/assets retain visited
content for 30 days and serve valid entries without a refresh request. A webhook
invalidates server caches but cannot clear a visitor's browser storage; that
visitor can continue seeing the saved version until browser entries expire or
site data is cleared.

## Scoped showcase filter counts

Install [wordpress-showcase-filters.php](./wordpress-showcase-filters.php) as
`wp-content/mu-plugins/pro-developer-showcase-filters.php`. This file is provided
for deployment; this repository change does **not** install it on the live site.
It registers:

```text
GET /wp-json/pro-developer/v1/showcase-filters?kind=projects
GET /wp-json/pro-developer/v1/showcase-filters?kind=demos
```

The endpoint performs indexed taxonomy joins and counts distinct published
posts of the selected CPT. It returns only filter options,
scoped counts, and demo tag names. It resolves internal post/taxonomy keys from
their REST bases. There is no post crawling or second transient cache.

The app discovers that URL from `NEXT_BASE_URL` when it ends in `/wp/v2`.
For a nonstandard REST root set the server-only environment variable
`WORDPRESS_SHOWCASE_FILTERS_URL` to the full endpoint URL (without `kind`).
Test both kinds against the WordPress editor's published totals before release.

If that endpoint returns 404, filter controls still use the ordinary taxonomy
dictionaries. Counts are omitted (`count: null`, `countsAvailable: false`), since
WordPress's ordinary term count can include other CPTs. No project collection is
downloaded to compute counts. Other endpoint errors remain errors, so a temporary
outage cannot replace valid browser filter data with an empty dictionary.

Counts cover direct assignments, matching the app's array-style REST filters
(`industry-type[]=123`), which do not request descendant inclusion. This behavior
was checked against the [WordPress REST taxonomy query implementation](https://developer.wordpress.org/reference/classes/wp_rest_posts_controller/prepare_tax_query/).
Counts represent each taxonomy option across that CPT, independently of a current
text search or selections in other groups. Sites with custom REST visibility or
query filters must apply the same restrictions to the aggregation SQL before
enabling counts.

## Process image dimensions

For each service's `service_data.process_steps` entry, return `image_width` and
`image_height` alongside `image`, using the attachment's actual dimensions
(for example `wp_get_attachment_metadata`). When present, the existing process
layout uses responsive Next Image optimization and reserves the correct aspect
ratio. URL-only legacy entries keep the original lazy image rendering. Guessing
their aspect ratios would change the existing layout. Those legacy images remain
a potential CLS/transfer cost until WordPress supplies their dimensions.

`NEXT_BASE_URL`, `WORDPRESS_SHOWCASE_FILTERS_URL`, and
`WORDPRESS_REVALIDATE_SECRET` must remain server environment variables; do not
prefix them with `NEXT_PUBLIC_`.
