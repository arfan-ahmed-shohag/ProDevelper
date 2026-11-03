import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
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
import { getAllServices, getServiceDetail } from "@/services/services";
import { plainText } from "@/lib/plain-text";
import { wordpressCachePolicy } from "@/lib/cache-policy";
import { getLatestFeedback } from "@/services/feedback";
import { featuredProjects, type ProjectResponse } from "@/services/projects";
import type { FeedbackResponse } from "@/services/feedback";
import SelectedWorksSkeleton from "@/components/home/SelectedWorksSkeleton";
import FeedbackSkeleton, { FeedbackSummarySkeleton } from "@/components/home/FeedbackSkeleton";

type ServicePageProps = {
  params: Promise<{ serviceName: string }>;
};

export async function generateStaticParams() {
  const services = await getAllServices();
  return services.map((service) => ({ serviceName: service.slug }));
}

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
  cacheLife(wordpressCachePolicy);
  cacheTag("wp:services", `wp:service:${serviceName}`);

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

async function CachedServiceShowcaseAndReviews() {
  "use cache";
  cacheLife(wordpressCachePolicy);
  cacheTag("wp:home");

  const [projects, feedback] = await Promise.all([
    featuredProjects().catch(() => [] as ProjectResponse[]),
    getLatestFeedback().catch(
      () => ({ items: [], total: 0 }) as { items: FeedbackResponse[]; total: number },
    ),
  ]);

  return (
    <>
      <SelectedWorks projects={projects} />
      <TestimonialsSection initialData={feedback} />
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
      <Suspense
        fallback={
          <>
            <SelectedWorksSkeleton />
            <section className="relative bg-white px-6 py-24 lg:py-40">
              <div className="mx-auto max-w-7xl">
                <FeedbackSummarySkeleton />
                <FeedbackSkeleton />
              </div>
            </section>
          </>
        }
      >
        <CachedServiceShowcaseAndReviews />
      </Suspense>
    </>
  );
}
