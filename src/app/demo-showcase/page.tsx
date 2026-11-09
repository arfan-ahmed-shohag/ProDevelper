import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import ShowcasePageContent from "@/components/project-showcase/ShowcasePageContent";
import ShowcaseGallerySkeleton from "@/components/project-showcase/ShowcaseGallerySkeleton";
import type { ShowcaseSearchParams } from "@/components/project-showcase/ShowcasePageContent";

export const metadata: Metadata = {
  title: "Demo Showcase",
  description:
    "Explore ready-to-launch website demos built for speed, modern design, and a seamless user experience.",
  alternates: { canonical: "/demo-showcase/" },
};

export default function DemoShowcasePage({ searchParams }: { searchParams: ShowcaseSearchParams }) {
  return (
    <>
      <PageHero
        variant="showcase"
        badge="Ready to Launch"
        badgePulse
        title="High-End Demos"
        outline="Engineered for Instant Impact."
        description={
          <>
            {"Explore our diverse library of "}
            <span className="font-bold text-brand-light">pre-built solutions</span>
            {" optimized for ultra-fast speed, modern aesthetics, and a seamless user experience."}
          </>
        }
        stats={[
          { value: "Fast", label: "Optimized Speed" },
          { value: "Core", label: "Functionality" },
          { value: "Clean", label: "Code Structure" },
          { value: "SEO", label: "Ready Designs" },
        ]}
      />
      <Suspense fallback={<ShowcaseGallerySkeleton />}>
        <ShowcasePageContent kind="demos" searchParams={searchParams} />
      </Suspense>
    </>
  );
}
