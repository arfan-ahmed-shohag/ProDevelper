"use client";

import ServiceGridList from "@/components/ServiceGridList";
import type { ServiceCardData } from "@/lib/service-card";
import { useBrowserDataCache } from "@/lib/use-browser-data-cache";
import {
  getAllServiceCards,
  getFeaturedServiceCards,
} from "@/services/services";

export type ServiceCardSource = "featured" | "all";

export default function CachedServiceCards({
  initialServices,
  initialCount,
  source,
  cardLinkLabel,
}: {
  initialServices: ServiceCardData[];
  initialCount: number;
  source: ServiceCardSource;
  cardLinkLabel: string;
}) {
  const loader = source === "all" ? getAllServiceCards : getFeaturedServiceCards;
  const services = useBrowserDataCache(
    `service-cards-${source}-v1`,
    initialServices,
    loader,
  );

  return (
    <ServiceGridList
      key={Math.min(initialCount, services.length)}
      services={services}
      initialCount={initialCount}
      placeholderCount={Math.max(0, initialCount - services.length)}
      cardLinkLabel={cardLinkLabel}
    />
  );
}
