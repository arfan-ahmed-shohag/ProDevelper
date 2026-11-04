import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import BrowserCachedHomeData from "@/components/home/BrowserCachedHomeData";
import TechnologySection from "@/components/home/TechnologySection";
import StatsSection from "@/components/home/StatsSection";

export const metadata: Metadata = { title: { absolute: "Prodeveloper_2" } };

export default function Home() {
  return (
    <>
      <Hero />
      <BrowserCachedHomeData />
      <TechnologySection />
      <StatsSection />
    </>
  );
}
