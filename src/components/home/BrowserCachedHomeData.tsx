"use client";

import { useEffect, useState } from "react";
import ServicesSection from "@/components/ServicesSection";
import SelectedWorks from "@/components/home/SelectedWorks";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import serviceData from "@/data/services.json";
import { isHomePageData, type HomePageData } from "@/lib/home-data";
import { readCachedPages, writeCachedPage } from "@/lib/indexed-page-cache";

const cacheScope = "home-featured-v1";
let pendingRequest: Promise<HomePageData> | undefined;

function fetchHomePageData() {
  if (pendingRequest) return pendingRequest;

  pendingRequest = fetch("/api/home", {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/json" },
  })
    .then(async (response) => {
      if (!response.ok) throw new Error("Homepage data request failed");
      const data: unknown = await response.json();
      if (!isHomePageData(data)) throw new Error("Homepage data response was invalid");
      return data;
    })
    .finally(() => {
      pendingRequest = undefined;
    });

  return pendingRequest;
}

export default function BrowserCachedHomeData({
  showServices = true,
  showProjects = true,
  showFeedback = true,
}: {
  showServices?: boolean;
  showProjects?: boolean;
  showFeedback?: boolean;
} = {}) {
  const [data, setData] = useState<HomePageData | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const cachedPages = await readCachedPages<HomePageData>(cacheScope, isHomePageData);
      const cached = cachedPages.find((entry) => entry.page === 1);

      if (cached) {
        if (active) setData(cached.data);
        return;
      }

      try {
        const freshData = await fetchHomePageData();
        void writeCachedPage(cacheScope, 1, freshData, Date.now());
        if (active) setData(freshData);
      } catch {
        // Keep the section skeletons visible when both the cache and API are unavailable.
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      {showServices && (
        <ServicesSection
          initialServices={data?.services ?? []}
          source="featured"
          useCachedData={false}
          viewAll={serviceData.home.viewAll}
        />
      )}
      {showProjects && <SelectedWorks projects={data?.projects ?? []} />}
      {showFeedback && (
        <TestimonialsSection
          initialData={data?.feedback ?? { items: [], total: 0 }}
        />
      )}
    </>
  );
}
