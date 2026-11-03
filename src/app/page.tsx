import Hero from "@/components/home/Hero";
import ServicesSection from "@/components/ServicesSection";
import SelectedWorks from "@/components/home/SelectedWorks";
import TechnologySection from "@/components/home/TechnologySection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { Metadata } from "next";
import serviceData from "@/data/services.json";
import { cacheLife, cacheTag } from "next/cache";
import { wordpressCachePolicy } from "@/lib/cache-policy";
import { getFeaturedServiceCards } from "@/services/services";
import { featuredProjects } from "@/services/projects";
import { getLatestFeedback } from "@/services/feedback";

export const metadata: Metadata = { title: { absolute: "Prodeveloper_2" } };

export default async function Home () {
  "use cache";
  cacheLife(wordpressCachePolicy);
  cacheTag("wp:home");

  const [services, projects, feedback] = await Promise.all([
    getFeaturedServiceCards().catch(() => []),
    featuredProjects().catch(() => []),
    getLatestFeedback().catch(() => ({ items: [], total: 0 })),
  ]);

  return (
    <>
      <Hero />
      <ServicesSection
        initialServices={services}
        source="featured"
        useCachedData={false}
        viewAll={serviceData.home.viewAll}
      />
      <SelectedWorks projects={projects} />
      <TechnologySection />
      <StatsSection />
      <TestimonialsSection initialData={feedback} />
    </>
  );
}
