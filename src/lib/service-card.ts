import { plainText } from "@/lib/plain-text";
import type { ServiceResponse } from "@/services/services";

export type ServiceCardData = {
  title: string;
  href: string;
  description: string;
  image?: string;
};

export function toServiceCard(service: ServiceResponse): ServiceCardData {
  const description = plainText(
    service.service_data?.description || service.content.rendered,
  );
  const words = description.split(/\s+/);

  return {
    title: plainText(service.title.rendered),
    href: `/services/${service.slug}/`,
    description: `${words.slice(0, 15).join(" ")}${words.length > 15 ? "..." : ""}`,
    image: service.service_data?.image || undefined,
  };
}
