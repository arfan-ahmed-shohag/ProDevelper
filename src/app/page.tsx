import Hero from "@/components/home/Hero";
import ServicesSection from "@/components/home/ServicesSection";
import SelectedWorks from "@/components/home/SelectedWorks";
import TechnologySection from "@/components/home/TechnologySection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { Metadata } from "next";

export const metadata: Metadata = { title: { absolute: "Prodeveloper_2" } };

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <SelectedWorks />
      <TechnologySection />
      <StatsSection />
      <TestimonialsSection />
    </>
  );
}
