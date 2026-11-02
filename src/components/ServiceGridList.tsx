"use client";

import { useState } from "react";
import type { ServiceCardData } from "@/lib/service-card";
import { ServiceGrid } from "./ServiceGrid";
import { ServiceGridSkeletonCard } from "./ServiceGridSkeleton";

export default function ServiceGridList({
  services,
  initialCount,
  batchSize = 12,
  cardLinkLabel,
  placeholderCount = 0,
  loadMoreLabel = "Load More Services",
}: {
  services: ServiceCardData[];
  initialCount: number;
  batchSize?: number;
  cardLinkLabel: string;
  placeholderCount?: number;
  loadMoreLabel?: string;
}) {
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(initialCount, services.length),
  );

  return (
    <>
      <div
        id="service-grid"
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {services.slice(0, visibleCount).map((service, index) => (
          <ServiceGrid
            key={service.href}
            service={service}
            index={index}
            cardLinkLabel={cardLinkLabel}
          />
        ))}
        {Array.from({ length: placeholderCount }, (_, index) => (
          <ServiceGridSkeletonCard key={`placeholder-${index}`} />
        ))}
      </div>
      {visibleCount < services.length && (
        <div className="mt-20 text-center">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((count) =>
                Math.min(count + batchSize, services.length),
              )
            }
            className="group relative inline-flex min-w-60 items-center justify-center gap-3 overflow-hidden rounded-full bg-brand-dark px-12 py-5 font-black text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-green/20"
          >
            <span className="absolute inset-0 w-0 bg-white/10 transition-all duration-250 ease-out group-hover:w-full" />
            <span className="relative z-10 text-xs uppercase tracking-[0.2em]">
              {loadMoreLabel}
            </span>
          </button>
        </div>
      )}
    </>
  );
}
