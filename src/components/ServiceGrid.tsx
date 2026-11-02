import Link from "next/link";
import Image from "next/image";
import type { ServiceCardData } from "@/lib/service-card";

export function ServiceGrid({
  service,
  index,
  cardLinkLabel = "Explore Service",
}: {
  service: ServiceCardData;
  index: number;
  cardLinkLabel?: string;
}) {
  return (
    <Link
      href={service.href}
      className="service-item group relative overflow-hidden rounded-4xl border border-brand-dark bg-slate-50 p-10 text-left shadow-xs transition-all duration-500 hover:-translate-y-3 hover:bg-brand-dark hover:shadow-2xl"
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
  );
}
