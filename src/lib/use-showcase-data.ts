"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectShowcaseResult, ShowcaseKind } from "@/services/projects";
import { contiguousPages, pageRetentionMs, readCachedPages, writeCachedPage } from "@/lib/indexed-page-cache";
import { isShowcaseResult, requestShowcasePage } from "@/lib/showcase-client";
import { showcaseScope } from "@/lib/showcase-query";

type View = {
  projects: ProjectShowcaseResult["projects"];
  total: number;
  totalPages: number;
  currentPage: number;
};

export function useShowcaseData(kind: ShowcaseKind, initial: ProjectShowcaseResult, initialError: string, initialQuery = { search: "", filters: "" }) {
  const [view, setView] = useState<View>({ ...initial, currentPage: 1 });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(initialError);
  const [offline, setOffline] = useState(false);
  const initialRef = useRef({ data: initial, error: initialError, scope: showcaseScope(kind, initialQuery.search, initialQuery.filters) });
  const pages = useRef(new Map<number, ProjectShowcaseResult>());
  const activeScope = useRef("");
  const generation = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const busy = useRef(false);
  const busyMore = useRef(false);
  const queuedMore = useRef(false);
  const activeQuery = useRef({ search: "", filters: "" });
  const loadRef = useRef<((search: string, filters: string, page: number, append: boolean) => Promise<void>) | null>(null);

  const publish = useCallback(() => {
    const first = pages.current.get(1);
    if (!first) return;
    const seen = new Set<number>();
    const projects = [...pages.current.entries()].sort(([a], [b]) => a - b)
      .flatMap(([, value]) => value.projects).filter(project => {
        if (seen.has(project.id)) return false;
        seen.add(project.id);
        return true;
      });
    const next = { projects, total: first.total, totalPages: first.totalPages, currentPage: pages.current.size };
    setView(current => JSON.stringify(current) === JSON.stringify(next) ? current : next);
  }, []);

  const loadResults = useCallback(async (search: string, filters: string, page: number, append: boolean) => {
    const scope = showcaseScope(kind, search, filters);
    const memory = activeScope.current === scope
      ? contiguousPages([...pages.current].filter(([, data]) => Date.now() - data.refreshedAt < pageRetentionMs)
        .map(([page, data]) => ({ page, data })))
      : new Map<number, ProjectShowcaseResult>();
    if (append && (activeScope.current !== scope || page !== pages.current.size + 1)) return;
    if (append && busy.current) {
      if (busyMore.current) return;
      queuedMore.current = true;
      setLoadingMore(true);
      return;
    }
    if (!append) {
      generation.current++;
      controller.current?.abort();
      controller.current = new AbortController();
      activeScope.current = scope;
      activeQuery.current = { search, filters };
      pages.current = new Map();
      queuedMore.current = false;
    }
    const thisGeneration = generation.current;
    const signal = controller.current!.signal;
    const current = () => thisGeneration === generation.current && !signal.aborted;
    busy.current = true;
    busyMore.current = append;
    setError("");
    setLoadingMore(append);
    try {
      if (!append) {
        const cached = await readCachedPages(scope, isShowcaseResult);
        if (!current()) return;
        pages.current = contiguousPages(cached);
        for (const [number, value] of memory) {
          if (value.refreshedAt > (pages.current.get(number)?.refreshedAt ?? 0)) pages.current.set(number, value);
        }
        pages.current = contiguousPages([...pages.current].map(([page, data]) => ({ page, data })));
        const first = pages.current.get(1);
        if (first) {
          for (const number of pages.current.keys()) {
            if (number > Math.max(1, first.totalPages)) pages.current.delete(number);
          }
          publish();
        } else if (scope === initialRef.current.scope && !initialRef.current.error) {
          const seed = initialRef.current.data;
          pages.current.set(1, seed);
          publish();
          void writeCachedPage(scope, 1, seed, seed.refreshedAt);
        }
        setLoading(!pages.current.has(1));
        setOffline(!navigator.onLine);
        // A first server-rendered visit already supplied this page. Repeat visits
        // and old offline HTML always check the GET reader in the background.
        if (!first && pages.current.has(1) && Date.now() - initialRef.current.data.refreshedAt < 60000) return;
      }

      const data = await requestShowcasePage(kind, page, search, filters, signal);
      if (!current()) return;
      void writeCachedPage(scope, page, data, data.refreshedAt);
      if (append) {
        pages.current.set(page, data);
        const first = pages.current.get(1)!;
        pages.current.set(1, { ...first, total: data.total, totalPages: data.totalPages });
      } else {
        const previous = pages.current;
        const next = new Map<number, ProjectShowcaseResult>([[1, data]]);
        const count = Math.min(previous.size || 1, Math.max(1, data.totalPages));
        // Refresh only previously requested pages, with bounded concurrency.
        for (let start = 2; start <= count; start += 3) {
          await Promise.all(Array.from({ length: Math.min(3, count - start + 1) }, async (_, offset) => {
            const number = start + offset;
            try {
              const fresh = await requestShowcasePage(kind, number, search, filters, signal);
              if (!current()) return;
              next.set(number, fresh);
              void writeCachedPage(scope, number, fresh, fresh.refreshedAt);
            } catch {
              // Preserve valid cached pages during partial upstream failures.
              if (previous.has(number)) next.set(number, previous.get(number)!);
            }
          }));
          if (!current()) return;
        }
        pages.current = next;
      }
      publish();
      setOffline(false);
    } catch (reason) {
      if (!current()) return;
      setOffline(!navigator.onLine);
      setError(pages.current.size
        ? "Refresh unavailable. Saved work is still available; please try again."
        : reason instanceof Error ? reason.message : "Showcase could not be loaded. Please try again.");
      if (!pages.current.size) setView({ projects: [], total: 0, totalPages: 0, currentPage: 1 });
    } finally {
      if (current()) {
        busy.current = false;
        busyMore.current = false;
        setLoading(false);
        setLoadingMore(false);
        if (queuedMore.current) {
          queuedMore.current = false;
          const next = pages.current.size + 1;
          if (next <= (pages.current.get(1)?.totalPages ?? 0)) {
            void loadRef.current?.(search, filters, next, true);
          }
        }
      }
    }
  }, [kind, publish]);

  useEffect(() => { loadRef.current = loadResults; }, [loadResults]);
  useEffect(() => {
    const online = () => {
      setOffline(false);
      if (!busy.current) void loadRef.current?.(activeQuery.current.search, activeQuery.current.filters, 1, false);
    };
    const offline = () => setOffline(true);
    let lastRefresh = Date.now();
    const visible = () => {
      if (document.visibilityState === "visible" && navigator.onLine && !busy.current && activeScope.current && Date.now() - lastRefresh >= 60000) {
        lastRefresh = Date.now();
        void loadRef.current?.(activeQuery.current.search, activeQuery.current.filters, 1, false);
      }
    };
    const interval = window.setInterval(visible, 60000);
    const requestController = controller;
    const requestGeneration = generation;
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    document.addEventListener("visibilitychange", visible);
    return () => {
      requestGeneration.current++;
      requestController.current?.abort();
      window.clearInterval(interval);
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
      document.removeEventListener("visibilitychange", visible);
    };
  }, []);

  return { ...view, loading, loadingMore, error, offline, loadResults };
}
