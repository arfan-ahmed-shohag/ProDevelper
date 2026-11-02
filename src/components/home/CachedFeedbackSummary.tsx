"use client";

import { useCallback } from "react";
import { getFreshLatestFeedback, type FeedbackResponse } from "@/services/feedback";
import { useBrowserDataCache } from "@/lib/use-browser-data-cache";
import { FeedbackSummarySkeleton } from "./FeedbackSkeleton";

export default function CachedFeedbackSummary({
  initialData,
}: {
  initialData: { items: FeedbackResponse[]; total: number };
}) {
  const load = useCallback(() => getFreshLatestFeedback(), []);
  const { items, total } = useBrowserDataCache(
    "home-feedback-v2",
    initialData,
    load,
    0,
    true,
    false,
  );

  const ratings = items
    .map((item) => Number(item.rating))
    .filter((rating) => Number.isFinite(rating) && rating > 0 && rating <= 5);
  if (ratings.length === 0) return <FeedbackSummarySkeleton />;

  const average = (
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
  ).toFixed(1);
  const stars = Math.round(Number(average));

  return (
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
          {`Latest ${items.length} of ${total} Reviews`}
        </p>
      </div>
    </div>
  );
}
