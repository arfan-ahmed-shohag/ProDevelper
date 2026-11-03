"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  getFeedbackPage,
  type FeedbackPageResult,
} from "@/services/feedback";
import { feedbackPageSize } from "@/lib/feedback";
import {
  readBrowserDataCache,
  writeBrowserDataCache,
} from "@/lib/use-browser-data-cache";
import FeedbackCard from "@/components/home/FeedbackCard";
import FeedbackSkeleton, { FeedbackCardSkeleton } from "@/components/home/FeedbackSkeleton";

type CachedFeedbackCatalog = FeedbackPageResult & { loadedPages: number };
const refreshAfter = 5 * 60 * 1000;

function pageCacheKey(page: number) {
  return `client-feedback-page-${page}-v3`;
}

export default function ClientFeedbackGallery({
  initialData,
}: {
  initialData: FeedbackPageResult;
}) {
  const [catalog, setCatalog] = useState<CachedFeedbackCatalog>({
    ...initialData,
    loadedPages: initialData.items.length ? 1 : 0,
  });
  const catalogRef = useRef(catalog);
  const pageRequestsRef = useRef(new Map<number, Promise<FeedbackPageResult>>());
  const loadingMoreRef = useRef(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const commitCatalog = useCallback((next: CachedFeedbackCatalog) => {
    catalogRef.current = next;
    setCatalog(next);
  }, []);

  const requestPage = useCallback((page: number) => {
    const pending = pageRequestsRef.current.get(page);
    if (pending) return pending;

    const request = getFeedbackPage(page)
      .then((pageData) => {
        writeBrowserDataCache(pageCacheKey(page), pageData);
        return pageData;
      })
      .finally(() => pageRequestsRef.current.delete(page));
    pageRequestsRef.current.set(page, request);
    return request;
  }, []);

  useEffect(() => {
    const nextPage = catalog.loadedPages + 1;
    if (nextPage > catalog.totalPages) return;

    const cachedPage = readBrowserDataCache<FeedbackPageResult>(pageCacheKey(nextPage));
    if (cachedPage && Date.now() - cachedPage.updatedAt < refreshAfter) return;

    // Warm the next page before the user presses Load More.
    void requestPage(nextPage).catch(() => {});
  }, [catalog.loadedPages, catalog.totalPages, requestPage]);

  const applyPage = useCallback(
    (pageData: FeedbackPageResult) => {
      const current = catalogRef.current;
      const start = (pageData.page - 1) * feedbackPageSize;
      const end = start + pageData.items.length;
      const items = [
        ...current.items.slice(0, start),
        ...pageData.items,
        ...current.items.slice(end),
      ];

      commitCatalog({
        ...current,
        items,
        page: pageData.page,
        total: pageData.total,
        totalPages: pageData.totalPages,
        loadedPages: Math.max(current.loadedPages, pageData.page),
      });
    },
    [commitCatalog],
  );

  const loadMore = async () => {
    const nextPage = catalogRef.current.loadedPages + 1;
    if (loadingMoreRef.current || nextPage > catalogRef.current.totalPages) return;

    setError("");
    const cachedPage = readBrowserDataCache<FeedbackPageResult>(pageCacheKey(nextPage));
    if (cachedPage) {
      applyPage(cachedPage.data);
      if (Date.now() - cachedPage.updatedAt < refreshAfter) return;

      // Serve stale cached data immediately, then refresh it in the background.
      void requestPage(nextPage).then(applyPage).catch(() => {});
      return;
    }

    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const freshPage = await requestPage(nextPage);
      applyPage(freshPage);
    } catch {
      setError("More feedback could not be loaded. Please try again.");
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  };

  const ratingSummaryStyle = {
    WebkitTextStroke: "1px rgb(var(--rgb-brand-dark))",
    fontFamily: "var(--font-outline)",
  } as CSSProperties;

  return (
    <section className="relative overflow-hidden bg-white px-6 py-20 md:py-28 lg:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(var(--rgb-brand-dark)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--rgb-brand-dark)) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col items-start justify-between gap-10 lg:mb-20 lg:flex-row lg:items-end">
          <div>
            <span className="mb-6 block text-[10px] font-bold uppercase tracking-[0.4em] text-brand-green">
              Testimonials
            </span>
            <h2 className="text-6xl font-black leading-[0.85] tracking-tighter text-slate-900 md:text-8xl md:leading-none">
              Loved by
              <br />
              <span className="text-transparent" style={ratingSummaryStyle}>
                Clients.
              </span>
            </h2>
          </div>

          <div className="hidden items-center gap-6 rounded-[2.5rem] border border-slate-100 bg-slate-50 p-6 shadow-sm lg:flex">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark text-[10px] font-bold text-brand-green">
              4.9
            </div>
            <div>
              <div className="mb-1 text-[10px] tracking-wide text-brand-green" aria-label="4.9 out of 5 stars">
                ★★★★★
              </div>
              <p className="text-sm font-black leading-none tracking-tight text-slate-900">
                Avg. Client Rating
              </p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                Based on {catalog.total.toLocaleString()}+ Reviews
              </p>
            </div>
          </div>
        </div>

        {catalog.items.length === 0 ? (
          <FeedbackSkeleton count={feedbackPageSize} />
        ) : (
          <div className="columns-1 gap-8 space-y-8 md:columns-2 lg:columns-3">
            {catalog.items.map((feedback, index) => (
              <FeedbackCard
                key={feedback.id}
                feedback={feedback}
                index={index}
                defaultRating={5}
              />
            ))}
            {loadingMore &&
              Array.from(
                {
                  length: Math.min(
                    feedbackPageSize,
                    Math.max(0, catalog.total - catalog.items.length),
                  ),
                },
                (_, index) => (
                  <FeedbackCardSkeleton key={`feedback-loading-${index}`} />
                ),
              )}
          </div>
        )}

        {error && (
          <p role="alert" className="mt-8 text-center text-sm text-slate-500">
            {error}
          </p>
        )}

        {catalog.loadedPages < catalog.totalPages && (
          <div className="mt-16 text-center">
            <button
              type="button"
              onClick={() => void loadMore()}
              disabled={loadingMore}
              className="group relative inline-flex min-w-60 items-center justify-center gap-3 overflow-hidden rounded-full bg-brand-dark px-12 py-5 font-black text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-green/20 disabled:cursor-wait disabled:opacity-70"
            >
              <span className="absolute inset-0 w-0 bg-white/10 transition-all duration-250 ease-out group-hover:w-full" />
              <span className="relative z-10 text-xs uppercase tracking-[0.2em]">
                {loadingMore ? "Loading Stories..." : "Load More Stories"}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
