import type { ProjectShowcaseResult, ShowcaseFilterData, ShowcaseKind } from "@/services/projects";
import { normalizeShowcaseQuery } from "@/lib/showcase-query";

import { getJson } from "@/lib/client-json";

export function isShowcaseResult(data: unknown): data is ProjectShowcaseResult {
  try {
    if (!data || typeof data !== "object") return false;
    const value = data as ProjectShowcaseResult;
    return Number.isInteger(value.total) && value.total >= 0 &&
      Number.isInteger(value.totalPages) && value.totalPages >= 0 && Number.isFinite(value.refreshedAt) &&
      Array.isArray(value.projects) && value.projects.length <= 10 && value.projects.every(project =>
        Number.isInteger(project.id) && typeof project.title?.rendered === "string" && typeof project.link === "string" &&
        (project.project_data?.featured_image == null || typeof project.project_data.featured_image === "string") &&
        (project.tag_list == null || (Array.isArray(project.tag_list) && project.tag_list.every(tag => typeof tag === "string"))) &&
        (project["demo-tags"] == null || (Array.isArray(project["demo-tags"]) && project["demo-tags"].every(Number.isInteger))) &&
        (project._embedded?.["wp:featuredmedia"] == null || (Array.isArray(project._embedded["wp:featuredmedia"]) &&
          project._embedded["wp:featuredmedia"].every(media =>
            (media.source_url == null || typeof media.source_url === "string") &&
            (media.media_details == null || (Number.isFinite(media.media_details.width) && media.media_details.width > 0 &&
              Number.isFinite(media.media_details.height) && media.media_details.height > 0))))) &&
        (project._embedded?.["wp:term"] == null || (Array.isArray(project._embedded["wp:term"]) &&
          project._embedded["wp:term"].every(terms => Array.isArray(terms) && terms.every(term =>
            typeof term.name === "string" && typeof term.taxonomy === "string")))));
  } catch { return false; }
}

export async function requestShowcasePage(kind: ShowcaseKind, page: number, search: string, filters: string, signal: AbortSignal) {
  const query = normalizeShowcaseQuery(search, filters);
  const params = new URLSearchParams({ kind, page: String(page), ...query });
  const data = await getJson<ProjectShowcaseResult>(`/api/showcase?${params}`, signal);
  if (!isShowcaseResult(data)) throw new Error("Invalid showcase response. Please try again.");
  return data;
}

export function requestShowcaseFilters(kind: ShowcaseKind, signal: AbortSignal) {
  return getJson<ShowcaseFilterData>(`/api/showcase?kind=${kind}&resource=filters`, signal);
}
