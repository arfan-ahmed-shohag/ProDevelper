import ShowcaseGallery from "@/components/project-showcase/ShowcaseGallery";
import type { ShowcaseKind } from "@/services/projects";

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
  return (
    <ShowcaseGallery
      kind={kind}
      groups={[]}
      initialFiltersComplete={false}
      initialSearch={search}
      initialProjects={[]}
      initialTotal={0}
      initialTotalPages={0}
      initialRefreshedAt={0}
    />
  );
}
