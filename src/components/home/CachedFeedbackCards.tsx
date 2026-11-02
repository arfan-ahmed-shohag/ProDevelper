"use client";

import { useCallback } from "react";
import { getFreshLatestFeedback, type FeedbackResponse } from "@/services/feedback";
import { useBrowserDataCache } from "@/lib/use-browser-data-cache";
import FeedbackSkeleton from "./FeedbackSkeleton";
import FeedbackCard from "./FeedbackCard";

export default function CachedFeedbackCards({
  initialData,
}: {
  initialData: { items: FeedbackResponse[]; total: number };
}) {
  const load = useCallback(() => getFreshLatestFeedback(), []);
  const { items } = useBrowserDataCache(
    "home-feedback-v2",
    initialData,
    load,
    0,
    true,
    false,
  );

  if (items.length === 0) return <FeedbackSkeleton />;

  return (
    <div id="feedback-grid" className="columns-1 gap-8 space-y-8 md:columns-2 lg:columns-3">
      {items.map((feedback, index) => (
        <FeedbackCard key={feedback.id} feedback={feedback} index={index} />
      ))}
    </div>
  );
}
