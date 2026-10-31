import StatsSection from "@/components/home/StatsSection";
import TechnologySection from "@/components/home/TechnologySection";
import PageHero from "@/components/PageHero";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: { absolute: "About Us – Prodeveloper_2" },
    description: "",
    alternates: { canonical: "/about-us/" },
};

export default function AboutUsPage() {
    return (
        <>
            <PageHero
                badge="The Story Behind The Code"
                title="Driven by"
                highlight="Logic"
                titleSuffix=","
                subtitle="Defined by"
                outline="Performance."
                description="I craft high-end digital experiences where sophisticated development meets intuitive design. Every project is built to scale, ensuring your business stays ahead of the curve."
                stats={[
                    { value: "7+", label: "Experience" },
                    { value: "700+", label: "Projects" },
                    { value: "99%", label: "Satisfaction" },
                    { value: "24/7", label: "Support" },
                ]}
            />
            <TechnologySection />
            <StatsSection />
        </>
    );
}
