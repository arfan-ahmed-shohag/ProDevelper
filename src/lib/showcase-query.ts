import type { ShowcaseKind } from "@/services/projects";

export const showcasePageSize = 10;

export function normalizeShowcaseQuery(search = "", filters = "") {
  const terms = new Map<string, Set<number>>();
  for (const part of filters.split(";")) {
    const [taxonomy, values = ""] = part.split(":");
    if (taxonomy !== "industry-type" && taxonomy !== "functionality") continue;
    const ids = terms.get(taxonomy) ?? new Set<number>();
    for (const raw of values.split(",")) {
      if (/^[1-9]\d{0,9}$/.test(raw)) ids.add(Number(raw));
    }
    if (ids.size) terms.set(taxonomy, ids);
  }
  return {
    search: search.trim().slice(0, 200),
    filters: [...terms].sort(([a], [b]) => a.localeCompare(b))
      .map(([taxonomy, ids]) => `${taxonomy}:${[...ids].sort((a, b) => a - b).slice(0, 50).join(",")}`)
      .join(";"),
  };
}

export function showcaseScope(kind: ShowcaseKind, search = "", filters = "") {
  const normalized = normalizeShowcaseQuery(search, filters);
  return JSON.stringify([kind, normalized.search, normalized.filters]);
}
