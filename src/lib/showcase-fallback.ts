import demos from "@/data/demos.json";
import demoFilters from "@/data/demo-filters.json";
import projects from "@/data/projects.json";
import projectFilters from "@/data/project-filters.json";
import { mapShowcaseSnapshotItems, type SnapshotItem } from "@/lib/showcase-snapshot";
import type {
  ProjectShowcaseResult,
  ShowcaseFilterGroup,
  ShowcaseKind,
} from "@/services/projects";

const pageSize = 10;

export function getShowcaseFallback(kind: ShowcaseKind): {
  groups: ShowcaseFilterGroup[];
  results: ProjectShowcaseResult;
} {
  const items = (kind === "demos" ? demos : projects) as SnapshotItem[];
  const fallbackProjects = mapShowcaseSnapshotItems(items).slice(0, pageSize);
  const groups = (kind === "demos" ? demoFilters : projectFilters) as ShowcaseFilterGroup[];

  return {
    groups,
    results: {
      projects: fallbackProjects,
      total: items.length,
      totalPages: Math.ceil(items.length / pageSize),
    },
  };
}
