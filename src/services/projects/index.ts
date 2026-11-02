"use server";

import { cacheLife } from "next/cache";
import { oneMonthCachePolicy } from "@/lib/cache-policy";
import { plainText } from "@/lib/plain-text";

const pageSize = 10;

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

async function fetchPagedCollection<T>(
  path: string,
  params: URLSearchParams,
  errorMessage: string,
) {
  const firstParams = new URLSearchParams(params);
  firstParams.set("page", "1");
  const firstResponse = await fetch(apiUrl(path, firstParams));
  if (!firstResponse.ok) throw new Error(errorMessage);

  const firstPage = (await firstResponse.json()) as T[];
  const totalPages = Number(firstResponse.headers.get("X-WP-TotalPages") || 1);
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(0, totalPages - 1) }, async (_, index) => {
      const pageParams = new URLSearchParams(firstParams);
      pageParams.set("page", String(index + 2));
      const response = await fetch(apiUrl(path, pageParams));
      if (!response.ok) throw new Error(errorMessage);
      return (await response.json()) as T[];
    }),
  );

  return [...firstPage, ...remainingPages.flat()];
}

async function fetchTaxonomy(taxonomy: ShowcaseFilterGroup["taxonomy"]) {
  const terms = await fetchPagedCollection<{
    id: number;
    name: string;
    slug: string;
    count?: number;
  }>(
    taxonomy,
    new URLSearchParams({ per_page: "100", hide_empty: "true" }),
    `Failed to fetch ${taxonomy} filters`,
  );

  return terms
    .filter((term) => (term.count ?? 0) > 0)
    .map((term) => ({
      id: term.id,
      label: term.name,
      slug: term.slug,
      count: term.count ?? 0,
    }));
}

export async function getProjectShowcaseFilters(): Promise<ShowcaseFilterGroup[]> {
  "use cache";
  cacheLife(oneMonthCachePolicy);

  const [industryOptions, functionalityOptions] = await Promise.all([
    fetchTaxonomy("industry-type"),
    fetchTaxonomy("functionality"),
  ]);
  return [
    { taxonomy: "industry-type", name: "Industry", options: industryOptions },
    { taxonomy: "functionality", name: "Functionality", options: functionalityOptions },
  ];
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
  page: number,
  selected: { taxonomy: ShowcaseFilterGroup["taxonomy"]; id: number }[],
): Promise<ProjectShowcaseResult> {
  const params = new URLSearchParams({
    per_page: String(pageSize),
    page: String(page),
    orderby: "date",
    order: "desc",
    _embed: "wp:featuredmedia",
    _fields: "id,title,link,industry-type,functionality,tag_list,project_data,acf,_links,_embedded",
  });
  for (const filter of selected) params.append(`${filter.taxonomy}[]`, String(filter.id));

  const response = await fetch(apiUrl("p-showcase", params));
  if (!response.ok) throw new Error("Failed to fetch project showcase");
  const projects = (await response.json()) as ProjectResponse[];
  return {
    projects,
    total: Number(response.headers.get("X-WP-Total") || projects.length),
    totalPages: Number(response.headers.get("X-WP-TotalPages") || 1),
  };
}

async function fetchProjectSearchIndex() {
  const params = new URLSearchParams({
    per_page: "100",
    orderby: "date",
    order: "desc",
    _embed: "wp:featuredmedia,wp:term",
    _fields: "id,title,link,industry-type,functionality,tag_list,project_data,acf,_links,_embedded",
  });
  return fetchPagedCollection<ProjectResponse>(
    "p-showcase",
    params,
    "Failed to search project showcase",
  );
}

async function getProjectSearchIndex() {
  "use cache";
  cacheLife(oneMonthCachePolicy);
  return fetchProjectSearchIndex();
}

export async function warmProjectShowcaseSearchIndex() {
  "use cache";
  cacheLife(oneMonthCachePolicy);
  await getProjectSearchIndex();
  return true;
}

function projectMatchesSearch(project: ProjectResponse, query: string) {
  const terms = project._embedded?.["wp:term"]?.flat() ?? [];
  const searchable = [
    plainText(project.title.rendered),
    ...terms.flatMap((term) => [term.name, term.slug]),
  ]
    .join(" ")
    .toLocaleLowerCase();
  return searchable.includes(query);
}

function projectMatchesFilters(project: ProjectResponse, selected: { taxonomy: string; id: number }[]) {
  const taxonomies = [...new Set(selected.map((filter) => filter.taxonomy))];
  return taxonomies.every((taxonomy) => {
    const ids = selected
      .filter((filter) => filter.taxonomy === taxonomy)
      .map((filter) => filter.id);
    const projectIds =
      taxonomy === "industry-type" ? project["industry-type"] : project.functionality;
    return ids.some((id) => projectIds?.includes(id));
  });
}

export async function getProjectShowcaseResults(
  page = 1,
  search = "",
  filters = "",
): Promise<ProjectShowcaseResult> {
  "use cache";
  cacheLife(oneMonthCachePolicy);

  const normalizedPage = Math.max(1, Math.floor(page));
  const query = search.trim().toLocaleLowerCase();
  const selected = parseFilterIds(filters);
  if (!query) return fetchProjectPage(normalizedPage, selected);

  const projects = await getProjectSearchIndex();
  const matches = projects.filter(
    (project) => projectMatchesSearch(project, query) && projectMatchesFilters(project, selected),
  );
  const totalPages = Math.ceil(matches.length / pageSize);
  return {
    projects: matches.slice((normalizedPage - 1) * pageSize, normalizedPage * pageSize),
    total: matches.length,
    totalPages,
  };
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
