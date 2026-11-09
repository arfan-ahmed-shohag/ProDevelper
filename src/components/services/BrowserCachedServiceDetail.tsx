"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import { ServiceProcessSkeleton } from "@/components/services/ServiceProcess";
import ServiceProcess from "@/components/services/ServiceProcess";
import ServiceHeroSkeleton from "@/components/services/ServiceHeroSkeleton";
import { serviceDetailLayout } from "@/lib/service-details";
import { plainText } from "@/lib/plain-text";
import { readCachedPages, writeCachedPage } from "@/lib/indexed-page-cache";
import { getJson } from "@/lib/client-json";
import type { ServiceResponse } from "@/services/services";

function isService(data: unknown): data is ServiceResponse {
  if (!data || typeof data !== "object") return false;
  const service = data as ServiceResponse;
  return typeof service.slug === "string" && typeof service.title?.rendered === "string" &&
    typeof service.content?.rendered === "string" &&
    (service.service_data?.process_steps === undefined || service.service_data.process_steps === null ||
      (Array.isArray(service.service_data.process_steps) && service.service_data.process_steps.every(step =>
        typeof step.title === "string" && typeof step.text === "string")));
}

export default function BrowserCachedServiceDetail({ slug }: { slug: string }) {
  const [service, setService] = useState<ServiceResponse | null>(null);
  const [errorState, setErrorState] = useState<{ slug: string; message: string } | null>(null);
  const [retryVersion, setRetryVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const scope = `service-detail:v1:${slug}`;

    async function load() {
      const cached = await readCachedPages<ServiceResponse>(scope, isService);
      if (!active) return;
      if (cached[0]) {
        setService(cached[0].data);
        return;
      }
      try {
        const result = await getJson<{ service: ServiceResponse }>(
          `/api/services?slug=${encodeURIComponent(slug)}`,
          controller.signal,
          "This service is temporarily unavailable. Please try again.",
        );
        if (!isService(result.service) || result.service.slug !== slug) throw new Error("Service data could not be loaded.");
        void writeCachedPage(scope, 1, result.service, Date.now());
        if (active) {
          setService(result.service);
        }
      } catch (reason) {
        if (active) setErrorState({ slug, message: reason instanceof Error ? reason.message : "Service data could not be loaded." });
      }
    }

    void load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [slug, retryVersion]);

  const error = errorState?.slug === slug ? errorState.message : "";
  if (!service || service.slug !== slug) return <>
    <ServiceHeroSkeleton />
    <ServiceProcessSkeleton />
    {error && <div role="alert" className="mx-auto max-w-3xl px-6 pb-10 text-center text-sm text-slate-600">
      <p>{error}</p>
      <button type="button" onClick={() => { setErrorState(null); setRetryVersion(value => value + 1); }} className="mt-3 font-bold text-brand-green underline">Try again</button>
    </div>}
  </>;

  return <>
    <PageHero
      variant="service"
      badge={serviceDetailLayout.hero.badge}
      title={plainText(service.title.rendered)}
      description={plainText(service.service_data?.short_intro || service.service_data?.description || service.content.rendered)}
      stats={(service.service_data?.trust_indicators ?? []).map(indicator => ({
        value: plainText(indicator.heading),
        label: plainText(indicator.sub_heading),
      }))}
    />
    <ServiceProcess steps={service.service_data?.process_steps ?? []} />
  </>;
}
