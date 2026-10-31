import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import ServiceProcess from "@/components/services/ServiceProcess";
import SelectedWorks from "@/components/home/SelectedWorks";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import {
  getServiceDetail,
  getServicePath,
  serviceDetailLayout,
  serviceDetailPages,
} from "@/lib/service-details";

type ServicePageProps = {
  params: Promise<{ serviceName: string }>;
};

export function generateStaticParams() {
  return serviceDetailPages.map((service) => ({ serviceName: service.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { serviceName } = await params;
  const service = getServiceDetail(serviceName);
  if (!service) notFound();

  return {
    title: service.seo.title,
    description: service.seo.description,
    alternates: { canonical: getServicePath(service.slug) },
  };
}

export default async function ServiceDetailsPage({ params }: ServicePageProps) {
  const { serviceName } = await params;
  const service = getServiceDetail(serviceName);
  if (!service) notFound();

  return (
    <>
      <PageHero
        variant="service"
        badge={serviceDetailLayout.hero.badge}
        title={service.title}
        description={service.introduction}
        stats={service.indicators}
      />
      <ServiceProcess steps={service.steps} />
      <SelectedWorks />
      <TestimonialsSection />
    </>
  );
}
