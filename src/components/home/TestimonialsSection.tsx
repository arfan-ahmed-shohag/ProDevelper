import type { CSSProperties } from "react";
import Link from "next/link";
import type { FeedbackResponse } from "@/services/feedback";
import FeedbackCard from "./FeedbackCard";
import FeedbackSkeleton, { FeedbackSummarySkeleton } from "./FeedbackSkeleton";

export default function TestimonialsSection({
  initialData,
}: {
  initialData: { items: FeedbackResponse[]; total: number };
}) {
  const ratings = initialData.items
    .map((item) => Number(item.rating))
    .filter((rating) => Number.isFinite(rating) && rating > 0 && rating <= 5);
  const average = ratings.length
    ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
    : null;
  const stars = average ? Math.round(Number(average)) : 0;

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

          {average ? (
            <div className="hidden items-center gap-6 rounded-[2.5rem] border border-slate-100 bg-slate-50 p-6 shadow-sm lg:flex">
              <div className="flex -space-x-3">
                <div className="h-12 w-12 rounded-full border-4 border-white bg-slate-200 shadow-sm" />
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-brand-dark text-[10px] font-bold text-brand-green">
                  {average}
                </div>
              </div>
              <div>
                <div
                  className="mb-1 flex text-[10px] text-brand-green"
                  aria-label={`${average} out of 5 stars for recent reviews`}
                >
                  <span aria-hidden="true">
                    {"\u2605".repeat(stars)}{"\u2606".repeat(5 - stars)}
                  </span>
                </div>
                <p className="text-sm font-black leading-none tracking-tight text-slate-900">
                  Recent Client Rating
                </p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 text-nowrap">
                  {`Latest ${initialData.items.length} of ${initialData.total} Reviews`}
                </p>
              </div>
            </div>
          ) : (
            <FeedbackSummarySkeleton />
          )}
        </div>

        {initialData.items.length ? (
          <div id="feedback-grid" className="columns-1 gap-8 space-y-8 md:columns-2 lg:columns-3">
            {initialData.items.map((feedback, index) => (
              <FeedbackCard key={feedback.id} feedback={feedback} index={index} />
            ))}
          </div>
        ) : (
          <FeedbackSkeleton />
        )}

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
