import type { CSSProperties } from "react";
import Link from "next/link";
import type { FeedbackResponse } from "@/services/feedback";
import CachedFeedbackCards from "./CachedFeedbackCards";
import CachedFeedbackSummary from "./CachedFeedbackSummary";

export default function TestimonialsSection() {
  const initialFeedback: { items: FeedbackResponse[]; total: number } = {
    items: [],
    total: 0,
  };

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

        <div className="absolute top-0 right-0 w-125 h-125 bg-brand-green/5 rounded-full blur-[120px]"></div>
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

          <CachedFeedbackSummary initialData={initialFeedback} />
        </div>

        <CachedFeedbackCards initialData={initialFeedback} />

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
