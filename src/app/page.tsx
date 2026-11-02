import Hero from "@/components/home/Hero";
import ServicesSection from "@/components/ServicesSection";
import SelectedWorks from "@/components/home/SelectedWorks";
import TechnologySection from "@/components/home/TechnologySection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { Metadata } from "next";
import serviceData from "@/data/services.json";
import homeServices from "@/data/home-services.json";
import { cacheLife } from "next/cache";
import { oneMonthCachePolicy } from "@/lib/cache-policy";

export const metadata: Metadata = { title: { absolute: "Prodeveloper_2" } };

export default async function Home () {
  "use cache";
  cacheLife(oneMonthCachePolicy);

  return (
    <>
      <Hero />
      <ServicesSection
        initialServices={homeServices}
        source="featured"
        viewAll={serviceData.home.viewAll}
      />
      <SelectedWorks />
      <TechnologySection />
      <StatsSection />
      <TestimonialsSection />
    </>
  );
}
