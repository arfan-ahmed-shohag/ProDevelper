import ShowcaseGallery from "@/components/project-showcase/ShowcaseGallery";
import {
  getShowcaseResults,
  getShowcaseFilters,
  type ProjectShowcaseResult,
  type ShowcaseKind,
} from "@/services/projects";
import { parseShowcaseFilters, serializeShowcaseFilterIds } from "@/lib/project-showcase";

export type ShowcaseSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ShowcasePageContent({
  kind,
  searchParams,
}: {
  kind: ShowcaseKind;
  searchParams: ShowcaseSearchParams;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search.slice(0, 200) : "";
  const filters = typeof params.filters === "string" ? params.filters : "";
  const filterData = filters ? await getShowcaseFilters(kind).catch(() => null) : null;
  const selected = parseShowcaseFilters(filters, filterData?.groups ?? []);
  let result: ProjectShowcaseResult;
  try {
    if (filters && !filterData) throw new Error("Filters unavailable");
    result = await getShowcaseResults(kind, 1, search, serializeShowcaseFilterIds(selected));
  } catch {
    return (
      <ShowcaseGallery
        kind={kind}
        groups={[]}
        initialProjects={[]}
        initialTotal={0}
        initialTotalPages={0}
        initialRefreshedAt={0}
        initialError="Showcase items could not be loaded. Please try again."
      />
    );
  }

  return (
    <ShowcaseGallery
      kind={kind}
      groups={filterData?.groups ?? []}
      initialFiltersComplete={Boolean(filterData)}
      demoTagNames={filterData?.demoTagNames}
      initialSearch={search}
      initialSelected={selected}
      initialProjects={result.projects}
      initialTotal={result.total}
      initialTotalPages={result.totalPages}
      initialRefreshedAt={result.refreshedAt}
    />
  );
}
