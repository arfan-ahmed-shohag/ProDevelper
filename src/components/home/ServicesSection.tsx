import services from "@/data/services.json";
import Image from "next/image";
import type { CSSProperties } from "react";
import Link from "next/link";
export default function ServicesSection() {
  return (
    <section
      id="services"
      className="pd_reveal relative py-16 md:py-24 lg:py-40 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={
            {
              backgroundImage:
                "linear-gradient(rgb(var(--rgb-brand-dark)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--rgb-brand-dark)) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            } as CSSProperties
          }
        ></div>

        <div className="absolute top-0 right-0 w-150 h-150 bg-brand-green/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[30%] h-[40%] bg-brand-dark/5 rounded-full blur-[120px]"></div>

        <div className="absolute top-[20%] right-[-5%] w-[25%] h-[35%] bg-brand-dark/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col items-center text-center mb-20 md:mb-32">
          <span className="text-brand-dark font-bold uppercase tracking-[0.6em] text-[10px] mb-8 block opacity-80">
            {" What I Offer "}
          </span>

          <h2 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85] md:leading-none mb-4">
            {" Our "}
            <br />

            <span
              className="text-transparent"
              style={
                {
                  WebkitTextStroke: "1.5px rgb(var(--rgb-brand-green) / 0.7)",
                  fontFamily: "var(--font-outline)",
                } as CSSProperties
              }
            >
              {"Services."}
            </span>
          </h2>

          <p className="text-slate-500 max-w-2xl text-lg md:text-xl leading-relaxed font-medium mt-8">
            {
              " Helping businesses scale with high-end development and design solutions tailored to your unique digital goals. "
            }
          </p>
        </div>

        <div
          id="service-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.slice(0, 6).map((service, index) => (
            <Link
              key={service.href}
              className="service-item group relative p-10 cursor-pointer overflow-hidden transition-all duration-500 rounded-4xl bg-slate-50 border border-brand-dark hover:bg-brand-dark hover:-translate-y-3 shadow-sm hover:shadow-2xl"
              href={service.href}
            >
              <span className="absolute top-8 right-10 text-6xl text-slate-200 font-black transition-opacity group-hover:text-white">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-md transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-green">
                  <div className="transition-all">
                    <Image
                      loading={index === 0 ? "eager" : "lazy"}
                      width={225}
                      height={225}
                      src={service.image}
                      sizes="32px"
                      className="w-8 h-8 object-contain wp-post-image"
                      alt=""
                      decoding="async"
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-4 transition-colors duration-500 group-hover:text-white">
                  {service.title}
                </h3>

                <p className="text-slate-500 leading-relaxed mb-10 transition-colors duration-500 group-hover:text-slate-300">
                  {service.description}
                </p>

                <div className="flex items-center gap-3 text-sm font-black text-slate-900 group-hover:text-brand-green transition-all">
                  <span className="tracking-widest uppercase">
                    {"Explore Service"}
                  </span>

                  <div className="w-8 h-0.5 bg-slate-200 group-hover:bg-brand-green group-hover:w-12 transition-all"></div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-transparent group-hover:bg-brand-green transition-all"></div>
            </Link>
          ))}
        </div>

        <div className="md:mt-40 mt-10 text-center relative z-10">
          <Link href="/services" className="inline-block group">
            <h4 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-4 transition-all duration-500 group-hover:-translate-y-2">
              {" See All "}
              <span
                className="text-transparent"
                style={
                  {
                    WebkitTextStroke: "1.5px rgb(var(--rgb-brand-green))",
                    fontFamily: "var(--font-outline)",
                  } as CSSProperties
                }
              >
                {"Services"}
              </span>
            </h4>

            <div className="relative h-1.5 w-24 bg-brand-green mx-auto transition-all duration-500 group-hover:w-full rounded-full"></div>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.5em] text-brand-dark opacity-50 group-hover:opacity-100 transition-opacity">
              {" View My All Servicess "}
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
