import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import ShowcasePageContent from "@/components/project-showcase/ShowcasePageContent";
import ShowcaseGallerySkeleton from "@/components/project-showcase/ShowcaseGallerySkeleton";
import type { ShowcaseSearchParams } from "@/components/project-showcase/ShowcasePageContent";

export const metadata: Metadata = {
  title: "Project Showcase",
  description:
    "Explore a collection of high-performance web solutions crafted with precision and built for impact.",
  alternates: { canonical: "/project-showcase/" },
};

export default function ProjectShowcasePage({ searchParams }: { searchParams: ShowcaseSearchParams }) {
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
      <Suspense fallback={<ShowcaseGallerySkeleton />}>
        <ShowcasePageContent kind="projects" searchParams={searchParams} />
      </Suspense>
    </>
  );
}
