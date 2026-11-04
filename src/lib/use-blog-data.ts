"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { blogScope, isBlogPage, normalizeBlogQuery, type BlogPage, type BlogPost, type BlogQuery } from "@/lib/blog";
import { getJson } from "@/lib/client-json";
import { contiguousPages, pageRetentionMs, readCachedPages, writeCachedPage } from "@/lib/indexed-page-cache";

type BlogView = { posts: BlogPost[]; total: number; totalPages: number; loadedPages: number };

export function useBlogData(initial: BlogPage, initialQuery: BlogQuery, initialError: string) {
  const [view, setView] = useState<BlogView>({ ...initial, loadedPages: 1 });
  const [loading, setLoading] = useState(!initial.posts.length && !initialError);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(initialError);
  const [offline, setOffline] = useState(false);
  const seed = useRef({ data: initial, scope: blogScope(initialQuery), error: initialError });
  const state = useRef({
    pages: new Map<number, BlogPage>(), scope: "", query: initialQuery,
    controller: null as AbortController | null, version: 0, busy: false, appending: false, queued: false,
  });
  const loadRef = useRef<((query: BlogQuery, append?: boolean) => Promise<void>) | null>(null);

  const publish = useCallback(() => {
    const pages = state.current.pages;
    const first = pages.get(1);
    if (!first) return;
    const seen = new Set<number>();
    const posts = [...pages].sort(([a], [b]) => a - b).flatMap(([, value]) => value.posts)
      .filter(post => { if (seen.has(post.id)) return false; seen.add(post.id); return true; });
    const next = { posts, total: first.total, totalPages: first.totalPages, loadedPages: pages.size };
    setView(current => JSON.stringify(current) === JSON.stringify(next) ? current : next);
  }, []);

  const load = useCallback(async (raw: BlogQuery, append = false) => {
    const query = normalizeBlogQuery(raw.search, raw.category);
    const scope = blogScope(query);
    const request = state.current;
    if (append && (request.scope !== scope || !request.pages.has(1))) return;
    if (append && request.busy) {
      if (!request.appending) { request.queued = true; setLoadingMore(true); }
      return;
    }
    const memory = request.scope === scope ? new Map([...request.pages]
      .filter(([, data]) => Date.now() - data.refreshedAt < pageRetentionMs)) : new Map<number, BlogPage>();
    if (!append) {
      request.controller?.abort();
      request.controller = new AbortController();
      request.version++;
      request.scope = scope;
      request.query = query;
      request.queued = false;
      request.pages = memory;
    }
    const version = request.version;
    const signal = request.controller!.signal;
    const active = () => version === request.version && !signal.aborted;
    request.busy = true;
    request.appending = append;
    setLoadingMore(append);
    setError("");
    const requestPage = async (page: number) => {
      const params = new URLSearchParams({ page: String(page), search: query.search, categories: String(query.category) });
      const data = await getJson<BlogPage>(`/api/blog?${params}`, signal, "Articles are temporarily unavailable. Please try again.");
      if (!isBlogPage(data)) throw new Error("Articles could not be loaded. Please try again.");
      if (active()) void writeCachedPage(scope, page, data, data.refreshedAt);
      return data;
    };
    try {
      if (!append) {
        setLoading(!memory.size);
        const saved = await readCachedPages(scope, isBlogPage);
        if (!active()) return;
        for (const entry of saved) {
          if (entry.refreshedAt > (memory.get(entry.page)?.refreshedAt ?? 0)) memory.set(entry.page, entry.data);
        }
        request.pages = contiguousPages([...memory].map(([page, data]) => ({ page, data })));
        const restored = request.pages.has(1);
        if (!restored && scope === seed.current.scope && !seed.current.error && seed.current.data.refreshedAt > 0) {
          request.pages.set(1, seed.current.data);
          void writeCachedPage(scope, 1, seed.current.data, seed.current.data.refreshedAt);
        }
        publish();
        setLoading(!request.pages.size);
        setOffline(!navigator.onLine);
        if (restored) {
          setError("");
          return;
        }
      }
      const page = append ? request.pages.size + 1 : 1;
      const fresh = await requestPage(page);
      if (!active()) return;
      if (append) {
        request.pages.set(page, fresh);
        const first = request.pages.get(1)!;
        request.pages.set(1, { ...first, total: fresh.total, totalPages: fresh.totalPages });
      } else {
        const previous = request.pages;
        const next = new Map<number, BlogPage>([[1, fresh]]);
        const count = Math.min(previous.size || 1, Math.max(1, fresh.totalPages));
        for (let start = 2; start <= count; start += 3) {
          await Promise.all(Array.from({ length: Math.min(3, count - start + 1) }, async (_, offset) => {
            const number = start + offset;
            try { next.set(number, await requestPage(number)); }
            catch { if (previous.has(number)) next.set(number, previous.get(number)!); }
          }));
          if (!active()) return;
        }
        request.pages = next;
      }
      publish();
      setOffline(false);
    } catch (reason) {
      if (!active()) return;
      setOffline(!navigator.onLine);
      setError(request.pages.size ? "Refresh unavailable. Your saved articles are still available."
        : reason instanceof Error ? reason.message : "Articles could not be loaded. Please try again.");
      if (!request.pages.size) setView({ posts: [], total: 0, totalPages: 0, loadedPages: 1 });
    } finally {
      if (active()) {
        request.busy = false;
        request.appending = false;
        setLoading(false);
        setLoadingMore(false);
        if (request.queued) {
          request.queued = false;
          if (request.pages.size < (request.pages.get(1)?.totalPages ?? 0)) void loadRef.current?.(query, true);
        }
      }
    }
  }, [publish]);

  useEffect(() => { loadRef.current = load; }, [load]);
  useEffect(() => {
    const request = state.current;
    const online = () => setOffline(false);
    const offline = () => setOffline(true);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    return () => {
      request.version++;
      request.controller?.abort();
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  return { ...view, loading, loadingMore, error, offline, load };
}
