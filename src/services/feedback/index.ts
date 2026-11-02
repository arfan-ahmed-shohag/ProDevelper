"use server";

import { cacheLife } from "next/cache";
import { oneMonthCachePolicy } from "@/lib/cache-policy";
import { feedbackPageSize } from "@/lib/feedback";

export type FeedbackResponse = {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  rating?: string | number | null;
  _embedded?: {
    "wp:featuredmedia"?: { source_url?: string }[];
  };
};

export type FeedbackPageResult = {
  items: FeedbackResponse[];
  page: number;
  total: number;
  totalPages: number;
};

function feedbackPageUrl(page: number, perPage: number) {
  const baseUrl = process.env.NEXT_BASE_URL;
  if (!baseUrl) throw new Error("NEXT_BASE_URL is not configured");

  const params = new URLSearchParams({
    per_page: String(perPage),
    page: String(page),
    orderby: "date",
    order: "desc",
    _embed: "wp:featuredmedia",
  });
  return `${baseUrl}/c-feedback?${params}`;
}

async function parseFeedbackPage(
  res: Response,
  page: number,
  perPage: number,
): Promise<FeedbackPageResult> {
  if (!res.ok) throw new Error(`Failed to fetch client feedback (${res.status})`);

  const items: FeedbackResponse[] = await res.json();
  const total = Number(res.headers.get("X-WP-Total") ?? items.length);
  return {
    items,
    page,
    total,
    totalPages: Number(res.headers.get("X-WP-TotalPages") ?? Math.ceil(total / perPage)),
  } satisfies FeedbackPageResult;
}

async function fetchFeedbackPage(page: number, perPage: number) {
  const res = await fetch(feedbackPageUrl(page, perPage));
  return parseFeedbackPage(res, page, perPage);
}

export async function getFreshFeedbackPage(): Promise<FeedbackPageResult> {
  const res = await fetch(feedbackPageUrl(1, feedbackPageSize), {
    cache: "no-store",
  });
  return parseFeedbackPage(res, 1, feedbackPageSize);
}

export async function getFreshLatestFeedback(): Promise<{
  items: FeedbackResponse[];
  total: number;
}> {
  const res = await fetch(feedbackPageUrl(1, 9), { cache: "no-store" });
  const result = await parseFeedbackPage(res, 1, 9);
  return { items: result.items, total: result.total };
}

export const getFeedbackPage = async (page = 1): Promise<FeedbackPageResult> => {
  "use cache";
  cacheLife(oneMonthCachePolicy);
  const normalizedPage = Math.max(1, Math.floor(page));
  return fetchFeedbackPage(normalizedPage, feedbackPageSize);
};
