import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ShowcaseGallery from "@/components/project-showcase/ShowcaseGallery";
import { getShowcaseFallback } from "@/lib/showcase-fallback";

export const metadata: Metadata = {
  title: "Demo Showcase",
  description:
    "Explore ready-to-launch website demos built for speed, modern design, and a seamless user experience.",
  alternates: { canonical: "/demo-showcase/" },
};

export default function DemoShowcasePage() {
  const fallback = getShowcaseFallback("demos");

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
      <ShowcaseGallery
        kind="demos"
        groups={fallback.groups}
        initialProjects={fallback.results.projects}
        initialTotal={fallback.results.total}
        initialTotalPages={fallback.results.totalPages}
      />
    </>
  );
}
