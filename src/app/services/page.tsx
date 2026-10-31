import PageHero from "@/components/PageHero";
import ServicesSection from "@/components/ServicesSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "",
  alternates: { canonical: "/services/" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        badge="Our Expert Solutions"
        title="High-End"
        highlight="Services"
        subtitle="Crafted for"
        outline="Market Leadership."
        description="I deliver industrial-grade development and strategic design to transform your vision into a scalable, high-performance digital product. Built for those who don't settle for average."
        statsVariant="features"
        stats={[
          { value: "Build", label: "Custom Full-Stack Web Applications" },
          { value: "Design", label: "High-End UI/UX Strategy & Layouts" },
          { value: "Grow", label: "SEO & Conversion-Rate Optimization" },
          {
            value: "Solve",
            label: "API Integrations, Performance Debugging & Problem Solving",
          },
        ]}
      />
      <ServicesSection />
    </>
  );
}
