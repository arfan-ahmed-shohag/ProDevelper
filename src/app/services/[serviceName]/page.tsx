import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import ServiceProcess, { ServiceProcessSkeleton } from "@/components/services/ServiceProcess";
import ServiceHeroSkeleton from "@/components/services/ServiceHeroSkeleton";
import SelectedWorks from "@/components/home/SelectedWorks";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import {
  getServicePath,
  serviceDetailLayout,
} from "@/lib/service-details";
import { getServiceDetail } from "@/services/services";
import { plainText } from "@/lib/plain-text";

type ServicePageProps = {
  params: Promise<{ serviceName: string }>;
};

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { serviceName } = await params;
  const service = await getServiceDetail(serviceName);
  if (!service) notFound();

  return {
    title: plainText(service.title.rendered),
    description: plainText(
      service.service_data?.short_intro ||
        service.service_data?.description ||
        service.content.rendered,
    ).slice(0, 160),
    alternates: { canonical: getServicePath(service.slug) },
  };
}

async function CachedServiceContent({ serviceName }: { serviceName: string }) {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 2678400 });

  const service = await getServiceDetail(serviceName);
  if (!service) return null;

  return (
    <>
      <PageHero
        variant="service"
        badge={serviceDetailLayout.hero.badge}
        title={plainText(service.title.rendered)}
        description={plainText(
          service.service_data?.short_intro ||
            service.service_data?.description ||
            service.content.rendered,
        )}
        stats={(service.service_data?.trust_indicators ?? []).map((indicator) => ({
          value: plainText(indicator.heading),
          label: plainText(indicator.sub_heading),
        }))}
      />
      <ServiceProcess steps={service.service_data?.process_steps ?? []} />
    </>
  );
}

async function ServiceContent({ params }: ServicePageProps) {
  const { serviceName } = await params;
  const service = await getServiceDetail(serviceName);
  if (!service) notFound();

  return <CachedServiceContent serviceName={serviceName} />;
}

export default function ServiceDetailsPage({ params }: ServicePageProps) {
  return (
    <>
      <Suspense
        fallback={
          <>
            <ServiceHeroSkeleton />
            <ServiceProcessSkeleton />
          </>
        }
      >
        <ServiceContent params={params} />
      </Suspense>
      <SelectedWorks />
      <TestimonialsSection />
    </>
  );
}
