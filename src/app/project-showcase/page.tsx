import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ShowcaseGallery from "@/components/project-showcase/ShowcaseGallery";
import { getShowcaseFallback } from "@/lib/showcase-fallback";

export const metadata: Metadata = {
  title: "Project Showcase",
  description:
    "Explore a collection of high-performance web solutions crafted with precision and built for impact.",
  alternates: { canonical: "/project-showcase/" },
};

export default function ProjectShowcasePage() {
  const fallback = getShowcaseFallback("projects");

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
      <ShowcaseGallery
        kind="projects"
        groups={fallback.groups}
        initialProjects={fallback.results.projects}
        initialTotal={fallback.results.total}
        initialTotalPages={fallback.results.totalPages}
      />
    </>
  );
}
