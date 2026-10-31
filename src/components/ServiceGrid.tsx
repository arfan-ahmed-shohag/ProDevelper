"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export type Service = {
  title: string;
  href: string;
  description: string;
  image?: string;
};

export function ServiceGrid({
  id,
  services,
  initialCount = services.length,
  showLoadMore = true,
  loadMoreCount = 12,
  loadMoreLabel = "Load More Services",
  cardLinkLabel = "Explore Service",
}: {
  id?: string;
  services: readonly Service[];
  initialCount?: number;
  showLoadMore?: boolean;
  loadMoreCount?: number;
  loadMoreLabel?: string;
  cardLinkLabel?: string;
}) {
  const [visible, setVisible] = useState(() =>
    Math.max(0, Math.min(initialCount, services.length)),
  );
  return (
    <>
      <div id={id} className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, visible).map((service, index) => (
          <Link
            key={service.href}
            href={service.href}
            className={`service-item group relative overflow-hidden rounded-4xl border border-brand-dark bg-slate-50 p-10 text-left shadow-xs transition-all duration-500 hover:-translate-y-3 hover:bg-brand-dark hover:shadow-2xl ${index >= initialCount ? "content-enter" : ""}`}
          >
            <span className="absolute top-8 right-10 text-6xl font-black text-slate-200 transition-colors group-hover:text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="relative z-10">
              <div className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-white shadow-md transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-green">
                {service.image && (
                  <Image
                    src={service.image}
                    sizes="32px"
                    alt=""
                    width={32}
                    height={32}
                    loading="lazy"
                    className="size-8 object-contain"
                  />
                )}
              </div>
              <h3 className="mb-4 text-2xl font-black text-slate-900 transition-colors group-hover:text-white">
                {service.title}
              </h3>
              <p className="mb-10 leading-relaxed text-slate-500 transition-colors group-hover:text-slate-300">
                {service.description}
              </p>
              <div className="flex items-center gap-3 text-sm font-black text-slate-900 transition-colors group-hover:text-brand-green">
                <span className="tracking-widest uppercase">
                  {cardLinkLabel}
                </span>
                <span className="h-0.5 w-8 bg-slate-200 transition-all group-hover:w-12 group-hover:bg-brand-green" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-hover:bg-brand-green transition-all" />
          </Link>
        ))}
      </div>
      {showLoadMore && visible < services.length && (
        <div className="mt-20 text-center">
          <button
            type="button"
            onClick={() =>
              setVisible((count) =>
                Math.min(count + loadMoreCount, services.length),
              )
            }
            className="group relative inline-flex items-center justify-center gap-3 px-12 py-5 bg-brand-dark text-white rounded-full font-black overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-brand-green/20 hover:-translate-y-1 min-w-60"
          >
            <span className="absolute inset-0 w-0 bg-white/10 transition-all duration-250 ease-out group-hover:w-full" />
            <span className="uppercase tracking-[0.2em] text-xs relative z-10">
              {loadMoreLabel}
            </span>
          </button>
        </div>
      )}
    </>
  );
}
