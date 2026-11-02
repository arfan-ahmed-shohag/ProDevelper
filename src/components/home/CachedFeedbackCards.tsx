"use client";

import { latestFeedback, type FeedbackResponse } from "@/services/feedback";
import { useBrowserDataCache } from "@/lib/use-browser-data-cache";
import FeedbackCard from "./FeedbackCard";

export default function CachedFeedbackCards({
  fallback,
}: {
  fallback: { items: FeedbackResponse[]; total: number };
}) {
  const { items } = useBrowserDataCache(
    "home-feedback-v1",
    fallback,
    latestFeedback,
  );

  return (
    <div id="feedback-grid" className="columns-1 gap-8 space-y-8 md:columns-2 lg:columns-3">
      {items.map((feedback, index) => (
        <FeedbackCard key={feedback.id} feedback={feedback} index={index} />
      ))}
    </div>
  );
}
