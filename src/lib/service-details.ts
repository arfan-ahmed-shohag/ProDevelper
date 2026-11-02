import details from "@/data/service-details.json";

export const serviceDetailLayout = {
  hero: details.hero,
  process: details.process,
};

export function getServicePath(slug: string) {
  return `/services/${slug}`;
}
