"use client";

import { featuredProjects, type ProjectResponse } from "@/services/projects";
import { useBrowserDataCache } from "@/lib/use-browser-data-cache";
import SelectedWorkCard from "./SelectedWorkCard";
import { SelectedWorksGrid } from "./SelectedWorksGrid";
import SelectedWorksSkeleton from "./SelectedWorksSkeleton";

export default function CachedFeaturedProjects() {
  const projects = useBrowserDataCache<ProjectResponse[]>(
    "home-featured-projects-v1",
    [],
    featuredProjects,
    0,
    false,
    false,
  );

  if (projects.length === 0) return <SelectedWorksSkeleton />;

  return (
    <SelectedWorksGrid refreshKey={projects.map((project) => project.id).join(",")}>
      {projects.map((project) => (
        <SelectedWorkCard key={project.id} project={project} />
      ))}
    </SelectedWorksGrid>
  );
}
