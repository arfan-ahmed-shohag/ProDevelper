import details from "@/data/service-details.json";

export type ServiceDetail = (typeof details.services)[number];
export type ServiceProcessStep = ServiceDetail["steps"][number];

export const serviceDetailPages = details.services;
export const serviceDetailLayout = {
  hero: details.hero,
  process: details.process,
};

const servicesBySlug = new Map<string, ServiceDetail>(
  serviceDetailPages.map((service) => [service.slug, service]),
);

export function getServiceDetail(slug: string) {
  return servicesBySlug.get(slug);
}

export function getServicePath(slug: string) {
  return `/services/${slug}`;
}
