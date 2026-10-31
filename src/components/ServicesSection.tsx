import Link from "next/link";
import serviceData from "@/data/services.json";
import { ServiceGrid } from "./ServiceGrid";

type ServicesSectionProps = {
  variant?: "home" | "catalog";
};

export default function ServicesSection({
  variant = "catalog",
}: ServicesSectionProps) {
  const isHome = variant === "home";
  const services = isHome
    ? serviceData.items.slice(0, serviceData.home.limit)
    : serviceData.items;

  return (
    <section
      id="services"
      className={`relative px-6 overflow-hidden ${
        isHome ? "pd_reveal py-16 md:py-24 lg:py-40" : "py-24 lg:py-40"
      }`}
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(var(--rgb-brand-dark)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--rgb-brand-dark)) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute top-0 right-0 w-150 h-150 bg-brand-green/5 rounded-full blur-[120px]" />
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[30%] h-[40%] bg-brand-dark/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-5%] w-[25%] h-[35%] bg-brand-dark/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div
          className={`flex flex-col items-center text-center ${
            isHome ? "mb-20 md:mb-32" : "mb-32"
          }`}
        >
          <span className="text-brand-dark font-bold uppercase tracking-[0.6em] text-[10px] mb-8 block opacity-80">
            {serviceData.badge}
          </span>

          <h2 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85] md:leading-none mb-4">
            {serviceData.heading.title}
            <br />
            <span
              className="text-transparent"
              style={{
                WebkitTextStroke: "1.5px rgb(var(--rgb-brand-green) / 0.7)",
                fontFamily: "var(--font-outline)",
              }}
            >
              {serviceData.heading.outline}
            </span>
          </h2>

          <p className="text-slate-500 max-w-2xl text-lg md:text-xl leading-relaxed md:leading-7 font-medium mt-8">
            {serviceData.description}
          </p>
        </div>

        <ServiceGrid
          id="service-grid"
          services={services}
          initialCount={isHome ? services.length : serviceData.catalog.initialCount}
          showLoadMore={!isHome}
          loadMoreCount={serviceData.catalog.batchSize}
          loadMoreLabel={serviceData.catalog.loadMoreLabel}
          cardLinkLabel={serviceData.cardLinkLabel}
        />

        {isHome && (
          <div className="md:mt-40 mt-10 text-center relative z-10">
            <Link
              href={serviceData.home.viewAll.href}
              className="inline-block group"
            >
              <h4 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-4 transition-all duration-500 group-hover:-translate-y-2">
                {serviceData.home.viewAll.title}{" "}
                <span
                  className="text-transparent"
                  style={{
                    WebkitTextStroke: "1.5px rgb(var(--rgb-brand-green))",
                    fontFamily: "var(--font-outline)",
                  }}
                >
                  {serviceData.home.viewAll.outline}
                </span>
              </h4>

              <div className="relative h-1.5 w-24 bg-brand-green mx-auto transition-all duration-500 group-hover:w-full rounded-full" />
              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.5em] text-brand-dark opacity-50 group-hover:opacity-100 transition-opacity">
                {serviceData.home.viewAll.label}
              </p>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
