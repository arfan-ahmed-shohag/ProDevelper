import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import PageHero from "@/components/PageHero";
import ProjectShowcase from "@/components/project-showcase/ProjectShowcase";
import { oneMonthCachePolicy } from "@/lib/cache-policy";
import {
  getProjectShowcaseFilters,
  getProjectShowcaseResults,
} from "@/services/projects";

export const metadata: Metadata = {
  title: "Project Showcase",
  description:
    "Explore a collection of high-performance web solutions crafted with precision and built for impact.",
  alternates: { canonical: "/project-showcase/" },
};

export default async function ProjectShowcasePage() {
  "use cache";
  cacheLife(oneMonthCachePolicy);

  const [groups, results] = await Promise.all([
    getProjectShowcaseFilters(),
    getProjectShowcaseResults(1, "", ""),
  ]);

  return (
    <>
      <PageHero
        variant="showcase"
        badge="Our Masterpieces"
        title="Elite Digital Artifacts"
        outline="Crafted for Impact."
        description="Explore a curated collection of high-performance web solutions where cutting-edge tech meets pixel-perfect execution. I don’t just build websites; I deliver digital assets that redefine excellence."
        stats={[
          { value: "Live", label: "Deployments" },
          { value: "Global", label: "Client Base" },
          { value: "Award", label: "Winning Work" },
          { value: "Scalable", label: "Performance" },
        ]}
      />
      <ProjectShowcase
        groups={groups}
        initialProjects={results.projects}
        initialTotal={results.total}
        initialTotalPages={results.totalPages}
      />
    </>
  );
}
