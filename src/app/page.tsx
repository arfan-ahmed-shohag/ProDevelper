import Hero from "@/components/home/Hero";
import ServicesSection from "@/components/ServicesSection";
import SelectedWorks from "@/components/home/SelectedWorks";
import TechnologySection from "@/components/home/TechnologySection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { Metadata } from "next";
import serviceData from "@/data/services.json";
import { cacheLife } from "next/cache";

export const metadata: Metadata = { title: { absolute: "Prodeveloper_2" } };

export default async function Home () {
  "use cache";
  cacheLife({ stale: 2592000, revalidate: 60, expire: 2678400 });

  return (
    <>
      <Hero />
      <ServicesSection
        viewAll={serviceData.home.viewAll}
      />
      <SelectedWorks />
      <TechnologySection />
      <StatsSection />
      <TestimonialsSection />
    </>
  );
}
