"use server";

import { cacheLife } from "next/cache";

export type FeedbackResponse = {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  rating?: string | number | null;
  _embedded?: {
    "wp:featuredmedia"?: { source_url?: string }[];
  };
};

export const latestFeedback = async (): Promise<{
  items: FeedbackResponse[];
  total: number;
}> => {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 2678400 });

  const res = await fetch(
    `${process.env.NEXT_BASE_URL}/c-feedback?per_page=9&orderby=date&order=desc&_embed=wp:featuredmedia`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch client feedback");
  }

  const items: FeedbackResponse[] = await res.json();
  return {
    items,
    total: Number(res.headers.get("X-WP-Total") ?? items.length),
  };
};
