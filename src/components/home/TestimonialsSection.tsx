import feedback from "@/data/feedback.json";
import Image from "next/image";
import type { CSSProperties } from "react";
import Link from "next/link";
export default function TestimonialsSection() {
  return (
    <section
      id="reviews"
      className="pd_reveal relative py-24 lg:py-40 px-6 overflow-hidden bg-white"
      style={{ marginBottom: "-10px" } as CSSProperties}
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

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-12">
          <div className="max-w-2xl">
            <span className="text-brand-green font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">
              {"Testimonials"}
            </span>

            <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85] md:leading-none">
              {" Loved by "}
              <br />

              <span
                className="text-transparent"
                style={
                  {
                    WebkitTextStroke: "1.5px rgb(var(--rgb-brand-dark))",
                    fontFamily: "var(--font-outline)",
                  } as CSSProperties
                }
              >
                {"Clients."}
              </span>
            </h2>
          </div>

          <div className="hidden lg:flex items-center gap-6 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex -space-x-3">
              <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 shadow-sm"></div>

              <div className="w-12 h-12 rounded-full border-4 border-white bg-brand-dark flex items-center justify-center text-brand-green text-[10px] font-bold">
                {"4.9"}
              </div>
            </div>

            <div>
              <div className="flex text-brand-green text-[10px] mb-1">
                {"★★★★★"}
              </div>

              <p className="text-slate-900 font-black text-sm leading-none tracking-tight">
                {"Avg. Client Rating"}
              </p>

              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1 text-nowrap">
                {`Based on ${feedback.length}+ Reviews`}
              </p>
            </div>
          </div>
        </div>

        <div
          id="feedback-grid"
          className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
        >
          {feedback.slice(0, 9).map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="feedback-item break-inside-avoid relative bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgb(var(--rgb-black)_/_0.05)] transition-all duration-500 hover:shadow-2xl hover:border-brand-green/30 group mb-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 shrink-0 rounded-2xl overflow-hidden shadow-sm ring-1 ring-slate-100">
                  {item.avatar ? (
                    <Image
                      width={100}
                      height={100}
                      src={item.avatar}
                      sizes="48px"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      alt={item.name}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white font-black text-lg"
                      style={{
                        background:
                          item.color?.replaceAll("--color-", "--rgb-") || "rgb(var(--rgb-brand-green))",
                      }}
                    >
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-black text-slate-900 text-[15px] leading-none mb-1">
                    {item.name}
                  </h4>

                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                    {item.role}
                  </p>
                </div>
              </div>

              <div className="flex text-rating text-[16px] gap-0.5 mb-5">
                {" ★★★★★ "}
              </div>

              <p className="text-slate-600 text-[15px] leading-relaxed font-medium group-hover:text-slate-900 transition-colors">{` "${item.quote}" `}</p>
            </div>
          ))}
        </div>

        <div className="mt-40 text-center relative z-10">
          <Link href="/client-feedback" className="inline-block group">
            <h4 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-4 transition-all duration-500 group-hover:-translate-y-2 leading-none">
              {" Client "}
              <span
                className="text-transparent"
                style={
                  {
                    WebkitTextStroke: "1.5px rgb(var(--rgb-brand-green))",
                    fontFamily: "var(--font-outline)",
                  } as CSSProperties
                }
              >
                {"Stories."}
              </span>
            </h4>

            <div className="relative h-1.5 w-24 bg-brand-green mx-auto transition-all duration-500 group-hover:w-full rounded-full"></div>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.5em] text-brand-dark opacity-50 group-hover:opacity-100 transition-opacity">
              {" Show All Success Feedbacks "}
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
