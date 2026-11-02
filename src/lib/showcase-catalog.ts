import { plainText } from "@/lib/plain-text";
import type {
  ProjectResponse,
  ShowcaseFilterGroup,
  ShowcaseKind,
} from "@/services/projects";

export type ShowcaseCatalogSelection = {
  taxonomy: ShowcaseFilterGroup["taxonomy"];
  id: number;
};

export function buildShowcaseFilterGroups(
  kind: ShowcaseKind,
  posts: ProjectResponse[],
): ShowcaseFilterGroup[] {
  const countTerms = (taxonomy: ShowcaseFilterGroup["taxonomy"]) => {
    const counts = new Map<number, { label: string; slug: string; count: number }>();

    for (const post of posts) {
      const terms = new Map(
        (post._embedded?.["wp:term"] ?? [])
          .flat()
          .filter((term) => term.taxonomy === taxonomy)
          .map((term) => [term.id, term]),
      );

      for (const [id, term] of terms) {
        const entry = counts.get(id) ?? {
          label: plainText(term.name),
          slug: term.slug,
          count: 0,
        };
        entry.count += 1;
        counts.set(id, entry);
      }
    }

    return [...counts.entries()]
      .map(([id, option]) => ({ id, ...option }))
      .sort((first, second) => first.label.localeCompare(second.label));
  };

  return [
    {
      taxonomy: "industry-type",
      name: kind === "demos" ? "Industry Type" : "Industry",
      options: countTerms("industry-type"),
    },
    {
      taxonomy: "functionality",
      name: "Functionality",
      options: countTerms("functionality"),
    },
  ];
}

export function filterShowcaseCatalog(
  posts: ProjectResponse[],
  query: string,
  selected: ShowcaseCatalogSelection[],
) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const selectedByTaxonomy = new Map<ShowcaseFilterGroup["taxonomy"], number[]>();
  for (const item of selected) {
    selectedByTaxonomy.set(item.taxonomy, [
      ...(selectedByTaxonomy.get(item.taxonomy) ?? []),
      item.id,
    ]);
  }

  return posts.filter((post) => {
    if (normalizedQuery) {
      const terms = post._embedded?.["wp:term"]?.flat() ?? [];
      const searchable = [
        plainText(post.title.rendered),
        ...(post.tag_list ?? []).map(plainText),
        ...terms.flatMap((term) => [plainText(term.name), term.slug]),
      ]
        .join(" ")
        .toLocaleLowerCase();
      if (!searchable.includes(normalizedQuery)) return false;
    }

    return [...selectedByTaxonomy].every(([taxonomy, selectedIds]) => {
      const postIds =
        taxonomy === "industry-type" ? post["industry-type"] : post.functionality;
      return selectedIds.some((id) => postIds?.includes(id));
    });
  });
}
