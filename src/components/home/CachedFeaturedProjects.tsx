"use client";

import { featuredProjects } from "@/services/projects";
import { useBrowserDataCache } from "@/lib/use-browser-data-cache";
import SelectedWorkCard from "./SelectedWorkCard";
import { SelectedWorksGrid } from "./SelectedWorksGrid";
import type { ProjectResponse } from "@/services/projects";

export default function CachedFeaturedProjects({
  fallback,
}: {
  fallback: ProjectResponse[];
}) {
  const projects = useBrowserDataCache(
    "home-featured-projects-v1",
    fallback,
    featuredProjects,
  );

  return (
    <SelectedWorksGrid refreshKey={projects.map((project) => project.id).join(",")}>
      {projects.map((project) => (
        <SelectedWorkCard key={project.id} project={project} />
      ))}
    </SelectedWorksGrid>
  );
}
