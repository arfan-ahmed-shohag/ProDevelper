import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { wordpressCachePolicy } from "@/lib/cache-policy";
import { plainText } from "@/lib/plain-text";
import { fetchWordPress, wordpressUrl, wordpressJson, WordPressError } from "@/lib/wordpress";
import { normalizeShowcaseQuery, showcasePageSize } from "@/lib/showcase-query";

export type ShowcaseKind = "projects" | "demos";
const showcaseEndpoint: Record<ShowcaseKind, string> = {
  projects: "p-showcase",
  demos: "d-showcase",
};

type ProjectTerm = { id: number; name: string; slug: string; taxonomy: string };
type ProjectMedia = {
  source_url?: string;
  media_details?: { width: number; height: number };
};

export type ProjectResponse = {
  id: number;
  slug?: string;
  date?: string;
  title: { rendered: string };
  link: string;
  "industry-type"?: number[];
  functionality?: number[];
  "demo-tags"?: number[];
  tag_list?: string[];
  acf?: Record<string, unknown>;
  project_data?: {
    website_link?: { url?: string } | string | null;
    featured_image?: string | null;
  };
  _embedded?: {
    "wp:featuredmedia"?: ProjectMedia[];
    "wp:term"?: ProjectTerm[][];
  };
};

export type ShowcaseFilterOption = {
  id: number;
  label: string;
  slug: string;
  count: number | null;
};

export type ShowcaseFilterGroup = {
  taxonomy: "industry-type" | "functionality";
  name: string;
  options: ShowcaseFilterOption[];
};

export type ShowcaseFilterData = {
  groups: ShowcaseFilterGroup[];
  demoTagNames: Record<number, string>;
  countsAvailable?: boolean;
};

export type ProjectShowcaseResult = {
  projects: ProjectResponse[];
  total: number;
  totalPages: number;
  refreshedAt: number;
};

function parseFilterIds(filters: string) {
  const selected: { taxonomy: ShowcaseFilterGroup["taxonomy"]; id: number }[] = [];
  for (const entry of filters.split(";")) {
    const separator = entry.indexOf(":");
    if (separator < 0) continue;
    const taxonomy = entry.slice(0, separator);
    if (taxonomy !== "industry-type" && taxonomy !== "functionality") continue;
    for (const rawId of entry.slice(separator + 1).split(",")) {
      const id = Number(rawId);
      if (Number.isInteger(id) && id > 0) selected.push({ taxonomy, id });
    }
  }
  return selected;
}

type ShowcaseTaxonomyTerm = { id: number; name: string; slug: string };

async function getTaxonomyTerms(taxonomy: string): Promise<ShowcaseTaxonomyTerm[]> {
  "use cache";
  cacheLife(wordpressCachePolicy);
  cacheTag("wp:showcase:projects:filters", "wp:showcase:demos:filters");
  const terms: ShowcaseTaxonomyTerm[] = [];
  // Only paginate taxonomy dictionaries, never the showcase post collection.
  for (let page = 1; page <= 20; page++) {
    const response = await fetchWordPress(wordpressUrl(taxonomy, new URLSearchParams({
      per_page: "100", page: String(page), hide_empty: "false", _fields: "id,name,slug",
    })));
    terms.push(...await response.json() as ShowcaseTaxonomyTerm[]);
    if (page >= Number(response.headers.get("X-WP-TotalPages") || 1)) return terms;
  }
  throw new Error("Taxonomy exceeds the supported dictionary size");
}

async function getScopedFilters(kind: ShowcaseKind): Promise<ShowcaseFilterData | null> {
  "use cache";
  cacheLife(wordpressCachePolicy);
  cacheTag(`wp:showcase:${kind}:filters`);
  const base = process.env.NEXT_BASE_URL?.replace(/\/$/, "");
  const endpoint = process.env.WORDPRESS_SHOWCASE_FILTERS_URL ||
    (base?.endsWith("/wp/v2") ? `${base.slice(0, -6)}/pro-developer/v1/showcase-filters` : "");
  if (!endpoint) return null;
  try {
    const url = new URL(endpoint);
    url.searchParams.set("kind", kind);
    const data = await wordpressJson<ShowcaseFilterData>(url.href);
    if (!Array.isArray(data.groups) || !data.groups.every(group =>
      ["industry-type", "functionality"].includes(group.taxonomy) && Array.isArray(group.options) &&
      group.options.every(option => Number.isInteger(option.id) && typeof option.label === "string" &&
        typeof option.slug === "string" && typeof option.count === "number" && option.count >= 0)
    )) throw new Error("Invalid scoped filter response");
    return { ...data, countsAvailable: true };
  } catch (error) {
    if (error instanceof WordPressError && error.status === 404) return null;
    throw error;
  }
}

export async function getShowcaseFilters(kind: ShowcaseKind): Promise<ShowcaseFilterData> {
  "use cache";
  cacheLife(wordpressCachePolicy);
  cacheTag(`wp:showcase:${kind}:filters`);
  const scoped = await getScopedFilters(kind);
  if (scoped) return scoped;
  const [industries, functionalities, demoTags] = await Promise.all([
    getTaxonomyTerms("industry-type"), getTaxonomyTerms("functionality"),
    kind === "demos" ? getTaxonomyTerms("demo-tags") : Promise.resolve([]),
  ]);
  // WP term.count can include other post types. Until the scoped endpoint is
  // installed, retain all filter controls and omit counts rather than inventing them.
  const options = (terms: ShowcaseTaxonomyTerm[]) => terms.map(term => ({
    id: term.id, label: plainText(term.name), slug: term.slug, count: null,
  })).sort((a, b) => a.label.localeCompare(b.label));
  return {
    countsAvailable: false,
    groups: [
      { taxonomy: "industry-type", name: kind === "demos" ? "Industry Type" : "Industry", options: options(industries) },
      { taxonomy: "functionality", name: "Functionality", options: options(functionalities) },
    ],
    demoTagNames: Object.fromEntries(demoTags.map(term => [term.id, plainText(term.name)])),
  };
}

async function fetchProjectPage(
  kind: ShowcaseKind,
  page: number,
  selected: { taxonomy: ShowcaseFilterGroup["taxonomy"]; id: number }[],
  search = "",
): Promise<ProjectShowcaseResult> {
  const params = new URLSearchParams({
    per_page: String(showcasePageSize),
    page: String(page),
    orderby: "date",
    order: "desc",
    _embed: "wp:featuredmedia",
    _fields: "id,title,link,industry-type,functionality,demo-tags,tag_list,project_data.featured_image,project_data.website_link,acf.website-link,_links,_embedded.wp:featuredmedia.source_url,_embedded.wp:featuredmedia.media_details.width,_embedded.wp:featuredmedia.media_details.height",
  });
  if (search) params.set("search", search);
  for (const filter of selected) params.append(`${filter.taxonomy}[]`, String(filter.id));

  const response = await fetchWordPress(
    wordpressUrl(showcaseEndpoint[kind], params),
  );
  const projects = (await response.json()) as ProjectResponse[];
  if (!Array.isArray(projects) || projects.length > showcasePageSize ||
    !projects.every(project => Number.isInteger(project.id) && typeof project.title?.rendered === "string")) {
    throw new Error("Invalid WordPress showcase response");
  }
  return {
    projects,
    refreshedAt: Date.now(),
    total: Number(response.headers.get("X-WP-Total") || projects.length),
    totalPages: Number(response.headers.get("X-WP-TotalPages") || 1),
  };
}

async function cachedShowcasePage(kind: ShowcaseKind, page: number, search: string, filters: string) {
  "use cache";
  cacheLife(wordpressCachePolicy);
  cacheTag(`wp:showcase:${kind}`);
  return fetchProjectPage(kind, page, parseFilterIds(filters), search);
}

export async function getShowcaseResults(
  kind: ShowcaseKind, page = 1, search = "", filters = "",
): Promise<ProjectShowcaseResult> {
  const query = normalizeShowcaseQuery(search, filters);
  return cachedShowcasePage(kind, Math.min(10000, Math.max(1, Math.floor(page) || 1)), query.search, query.filters);
}

export async function getProjectShowcaseResults(
  page = 1,
  search = "",
  filters = "",
): Promise<ProjectShowcaseResult> {
  return getShowcaseResults("projects", page, search, filters);
}

export const featuredProjects = async (): Promise<ProjectResponse[]> => {
  "use cache";
  cacheLife(wordpressCachePolicy);
  cacheTag("wp:showcase:projects", "wp:home:featured-projects");

  const params = new URLSearchParams({
    "project-categories": "134",
    per_page: "4",
    _embed: "wp:featuredmedia",
    _fields: "id,title,link,project_data.featured_image,project_data.website_link,acf.website-link,tag_list,_links,_embedded.wp:featuredmedia.source_url,_embedded.wp:featuredmedia.media_details",
  });
  return wordpressJson<ProjectResponse[]>(wordpressUrl("p-showcase", params));
};
