import type {
  ShowcaseFilterGroup,
  ShowcaseFilterOption,
} from "@/services/projects";

export type ShowcaseSelection = ShowcaseFilterOption & {
  taxonomy: ShowcaseFilterGroup["taxonomy"];
};

function normalizeFilterIdentifier(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]/g, "");
}

export function parseShowcaseFilters(
  filters: string,
  groups: ShowcaseFilterGroup[],
): ShowcaseSelection[] {
  const selected: ShowcaseSelection[] = [];
  for (const entry of filters.split(";")) {
    const separator = entry.indexOf(":");
    if (separator < 0) continue;
    const taxonomy = entry.slice(0, separator);
    if (taxonomy !== "industry-type" && taxonomy !== "functionality") continue;
    const identifiers = entry.slice(separator + 1).split(",").map((item) => item.trim());
    const normalizedIdentifiers = new Set(identifiers.map(normalizeFilterIdentifier));
    const group = groups.find((item) => item.taxonomy === taxonomy);
    for (const option of group?.options ?? []) {
      if (
        identifiers.includes(option.slug) ||
        normalizedIdentifiers.has(normalizeFilterIdentifier(option.slug)) ||
        normalizedIdentifiers.has(normalizeFilterIdentifier(option.label))
      ) {
        selected.push({ ...option, taxonomy });
      }
    }
  }
  return selected;
}

export function serializeShowcaseFilters(selection: ShowcaseSelection[]) {
  const groups = new Map<string, string[]>();
  for (const item of selection) {
    groups.set(item.taxonomy, [...(groups.get(item.taxonomy) ?? []), item.slug]);
  }
  return [...groups]
    .map(([taxonomy, slugs]) => `${taxonomy}:${slugs.join(",")}`)
    .join(";");
}

export function serializeShowcaseFilterIds(selection: ShowcaseSelection[]) {
  const groups = new Map<string, number[]>();
  for (const item of selection) {
    groups.set(item.taxonomy, [...(groups.get(item.taxonomy) ?? []), item.id]);
  }
  return [...groups]
    .map(([taxonomy, ids]) => `${taxonomy}:${ids.join(",")}`)
    .join(";");
}
