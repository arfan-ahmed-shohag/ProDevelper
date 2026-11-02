import featuredProjectIds from "@/data/featured-projects.json";
import projectItems from "@/data/projects.json";
import { mapShowcaseSnapshotItems, type SnapshotItem } from "@/lib/showcase-snapshot";
import type { ProjectResponse } from "@/services/projects";

export function getFeaturedProjectSnapshot(): ProjectResponse[] {
  const snapshot = mapShowcaseSnapshotItems(projectItems as SnapshotItem[]);
  const projectsById = new Map(snapshot.map((project) => [project.id, project]));

  return (featuredProjectIds as number[]).flatMap((id) => {
    const project = projectsById.get(id);
    return project ? [project] : [];
  });
}
