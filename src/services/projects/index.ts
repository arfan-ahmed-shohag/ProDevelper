"use server";

import { cacheLife } from "next/cache";
import { oneMonthCachePolicy } from "@/lib/cache-policy";
import { buildShowcaseFilterGroups } from "@/lib/showcase-catalog";

const pageSize = 10;
const requestTimeoutMs = 8000;
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
  count: number;
};

export type ShowcaseFilterGroup = {
  taxonomy: "industry-type" | "functionality";
  name: string;
  options: ShowcaseFilterOption[];
};

export type ProjectShowcaseResult = {
  projects: ProjectResponse[];
  total: number;
  totalPages: number;
};

function apiUrl(path: string, params?: URLSearchParams) {
  const baseUrl = process.env.NEXT_BASE_URL;
  if (!baseUrl) throw new Error("NEXT_BASE_URL is not configured");
  return `${baseUrl}/${path}${params?.size ? `?${params}` : ""}`;
}

async function fetchWordPress(url: string, errorMessage: string) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    let response: Response;
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(requestTimeoutMs) });
    } catch (error) {
      lastError = error;
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 250));
        continue;
      }
      break;
    }

    if (response.ok) return response;

    lastError = new Error(`${errorMessage} (${response.status})`);
    if (response.status < 500 && response.status !== 429) break;
    if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw lastError instanceof Error ? lastError : new Error(errorMessage);
}

async function fetchPagedCollection<T>(
  path: string,
  params: URLSearchParams,
  errorMessage: string,
) {
  const firstParams = new URLSearchParams(params);
  firstParams.set("page", "1");
  const firstResponse = await fetchWordPress(apiUrl(path, firstParams), errorMessage);

  const firstPage = (await firstResponse.json()) as T[];
  const totalPages = Number(firstResponse.headers.get("X-WP-TotalPages") || 1);
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(0, totalPages - 1) }, async (_, index) => {
      const pageParams = new URLSearchParams(firstParams);
      pageParams.set("page", String(index + 2));
      const response = await fetchWordPress(apiUrl(path, pageParams), errorMessage);
      return (await response.json()) as T[];
    }),
  );

  return [...firstPage, ...remainingPages.flat()];
}

export async function getShowcaseCatalog(kind: ShowcaseKind): Promise<ProjectResponse[]> {
  "use cache";
  cacheLife(oneMonthCachePolicy);

  const params = new URLSearchParams({
    per_page: "100",
    orderby: "date",
    order: "desc",
    _embed: "wp:featuredmedia,wp:term",
    _fields:
      "id,slug,date,title,link,industry-type,functionality,demo-tags,tag_list,project_data,_embedded",
  });

  const posts = await fetchPagedCollection<ProjectResponse>(
    showcaseEndpoint[kind],
    params,
    `Failed to fetch ${kind} catalog`,
  );

  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    date: post.date,
    title: post.title,
    link: post.link,
    "industry-type": post["industry-type"] ?? [],
    functionality: post.functionality ?? [],
    "demo-tags": post["demo-tags"] ?? [],
    tag_list: post.tag_list ?? [],
    project_data: post.project_data
      ? {
          website_link: post.project_data.website_link,
          featured_image: post.project_data.featured_image,
        }
      : undefined,
    _embedded: {
      "wp:featuredmedia": (post._embedded?.["wp:featuredmedia"] ?? []).map((media) => ({
        source_url: media.source_url,
        media_details: media.media_details
          ? {
              width: media.media_details.width,
              height: media.media_details.height,
            }
          : undefined,
      })),
      "wp:term": (post._embedded?.["wp:term"] ?? []).map((group) =>
        group.map(({ id, name, slug, taxonomy }) => ({ id, name, slug, taxonomy })),
      ),
    },
  }));
}

export async function getShowcaseFilters(kind: ShowcaseKind): Promise<ShowcaseFilterGroup[]> {
  "use cache";
  cacheLife(oneMonthCachePolicy);
  return buildShowcaseFilterGroups(kind, await getShowcaseCatalog(kind));
}

export async function getProjectShowcaseFilters() {
  return getShowcaseFilters("projects");
}

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

async function fetchProjectPage(
  kind: ShowcaseKind,
  page: number,
  selected: { taxonomy: ShowcaseFilterGroup["taxonomy"]; id: number }[],
  search = "",
): Promise<ProjectShowcaseResult> {
  const params = new URLSearchParams({
    per_page: String(pageSize),
    page: String(page),
    orderby: "date",
    order: "desc",
    _embed: "wp:featuredmedia,wp:term",
    _fields: "id,title,link,industry-type,functionality,tag_list,project_data,acf,_links,_embedded",
  });
  if (search) params.set("search", search);
  for (const filter of selected) params.append(`${filter.taxonomy}[]`, String(filter.id));

  const response = await fetchWordPress(
    apiUrl(showcaseEndpoint[kind], params),
    `Failed to fetch ${kind} showcase`,
  );
  const projects = (await response.json()) as ProjectResponse[];
  return {
    projects,
    total: Number(response.headers.get("X-WP-Total") || projects.length),
    totalPages: Number(response.headers.get("X-WP-TotalPages") || 1),
  };
}

export async function getShowcaseResults(
  kind: ShowcaseKind,
  page = 1,
  search = "",
  filters = "",
): Promise<ProjectShowcaseResult> {
  "use cache";
  cacheLife(oneMonthCachePolicy);

  const normalizedPage = Math.max(1, Math.floor(page));
  const query = search.trim();
  const selected = parseFilterIds(filters);
  return fetchProjectPage(kind, normalizedPage, selected, query);
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
  cacheLife(oneMonthCachePolicy);

  const res = await fetch(
    `${process.env.NEXT_BASE_URL}/p-showcase?project-categories=134&per_page=4&_embed=wp:featuredmedia`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch featured projects");
  }

  return res.json();
};
