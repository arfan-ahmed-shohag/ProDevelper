import type { Metadata } from "next";
import { Suspense } from "react";
import BrowserCachedServiceDetail from "@/components/services/BrowserCachedServiceDetail";
import ServiceHeroSkeleton from "@/components/services/ServiceHeroSkeleton";
import { ServiceProcessSkeleton } from "@/components/services/ServiceProcess";
import SelectedWorksSkeleton from "@/components/home/SelectedWorksSkeleton";
import FeedbackSkeleton, { FeedbackSummarySkeleton } from "@/components/home/FeedbackSkeleton";
import BrowserCachedHomeData from "@/components/home/BrowserCachedHomeData";
import { getServicePath } from "@/lib/service-details";

type ServicePageProps = {
  params: Promise<{ serviceName: string }>;
};

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { serviceName } = await params;
  const title = serviceName
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => {
      if (part.toLowerCase() === "wordpress") return "WordPress";
      if (part.toLowerCase() === "seo") return "SEO";
      return part[0].toUpperCase() + part.slice(1);
    })
    .join(" ");

  return {
    title,
    description: `Explore our ${title.toLowerCase()} service.`,
    alternates: { canonical: getServicePath(serviceName) },
  };
}

async function ServiceDetails({ params }: ServicePageProps) {
  const { serviceName } = await params;
  return <>
    <BrowserCachedServiceDetail slug={serviceName} />
    <BrowserCachedHomeData showServices={false} />
  </>;
}

export default function ServiceDetailsPage({ params }: ServicePageProps) {
  return (
    <Suspense
      fallback={
        <>
          <ServiceHeroSkeleton />
          <ServiceProcessSkeleton />
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
      <ServiceDetails params={params} />
    </Suspense>
  );
}
