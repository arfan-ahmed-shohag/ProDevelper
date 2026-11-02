import type { ProjectResponse, ShowcaseKind } from "@/services/projects";

export type SnapshotItem = {
  id: number;
  title: string;
  href: string;
  image: string;
  tags: string[];
  publishedAt?: string;
  taxonomies?: {
    "industry-type"?: number[];
    functionality?: number[];
  };
};

export function mapShowcaseSnapshotItems(items: SnapshotItem[]) {
  return [...items]
    .sort(
      (first, second) =>
        Date.parse(second.publishedAt ?? "") - Date.parse(first.publishedAt ?? ""),
    )
    .map(
      (item): ProjectResponse => ({
        id: item.id,
        date: item.publishedAt,
        title: { rendered: item.title },
        link: item.href,
        "industry-type": item.taxonomies?.["industry-type"] ?? [],
        functionality: item.taxonomies?.functionality ?? [],
        tag_list: item.tags,
        project_data: {
          website_link: item.href,
          featured_image: item.image,
        },
      }),
    );
}

export async function loadShowcaseSnapshot(kind: ShowcaseKind) {
  const items = (kind === "demos"
    ? (await import("@/data/demos.json")).default
    : (await import("@/data/projects.json")).default) as SnapshotItem[];

  return mapShowcaseSnapshotItems(items);
}
