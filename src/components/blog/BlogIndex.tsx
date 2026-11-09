"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import BlogCard from "@/components/blog/BlogCard";
import BlogSidebar, { BlogSearch } from "@/components/blog/BlogSidebar";
import Skeleton from "@/components/Skeleton";
import { blogCategoriesScope, blogHref, blogScope, isBlogCategories, normalizeBlogQuery, populatedBlogCategories, type BlogCategory, type BlogPage, type BlogPost, type BlogQuery } from "@/lib/blog";
import { getJson } from "@/lib/client-json";
import { readCachedPages, writeCachedPage } from "@/lib/indexed-page-cache";
import { useBlogData } from "@/lib/use-blog-data";

export default function BlogIndex({ initialData, initialCategories, recentPosts, initialQuery, initialError = "", initialCategoriesError = "", allPostsTotal }: {
  initialData: BlogPage; initialCategories: BlogCategory[]; recentPosts: BlogPost[]; initialQuery: BlogQuery;
  initialError?: string; initialCategoriesError?: string; allPostsTotal: number | null;
}) {
  const [search, setSearch] = useState(initialQuery.search);
  const [query, setQuery] = useState(initialQuery);
  const queryRef = useRef(initialQuery);
  const [categories, setCategories] = useState(() => populatedBlogCategories(initialCategories));
  const [categoriesError, setCategoriesError] = useState(initialCategoriesError);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScope = useRef("");
  const { posts, total, totalPages, loadedPages, loading, loadingMore, error, offline, load } = useBlogData(initialData, initialQuery, initialError);

  const loadCategories = useCallback(async () => {
    const cached = await readCachedPages<BlogCategory[]>(blogCategoriesScope, isBlogCategories);
    if (cached[0]) {
      setCategories(populatedBlogCategories(cached[0].data));
      setCategoriesError("");
      return;
    }
    try {
      const data = await getJson<{ categories: BlogCategory[] }>("/api/blog?resource=categories", AbortSignal.timeout(35000));
      if (!isBlogCategories(data.categories)) throw new Error("Invalid category response");
      setCategories(populatedBlogCategories(data.categories));
      setCategoriesError("");
      void writeCachedPage(blogCategoriesScope, 1, data.categories, Date.now());
    } catch {
      setCategoriesError("Topics could not be loaded. Please try again.");
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(loadCategories); }, [loadCategories]);

  const commit = useCallback((next: BlogQuery, updateUrl = true) => {
    if (timer.current) clearTimeout(timer.current);
    const normalized = normalizeBlogQuery(next.search, next.category);
    queryRef.current = normalized;
    setQuery(normalized);
    setSearch(normalized.search);
    if (updateUrl) {
      const nextUrl = blogHref(normalized) + window.location.hash;
      if (nextUrl !== window.location.pathname + window.location.search + window.location.hash) {
        window.history.pushState(null, "", nextUrl);
      }
    }
    const scope = blogScope(normalized);
    if (lastScope.current === scope) return;
    lastScope.current = scope;
    void load(normalized);
  }, [load]);

  useEffect(() => {
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      commit(normalizeBlogQuery(params.get("search") ?? params.get("s_query") ?? "", params.get("categories") ?? params.get("category") ?? "0"), false);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => { lastScope.current = ""; if (timer.current) clearTimeout(timer.current); window.removeEventListener("popstate", sync); };
  }, [commit]);

  const changeSearch = (value: string) => {
    setSearch(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => commit({ search: value, category: queryRef.current.category }), 500);
  };
  const changeCategory = (category: number) => commit({ search, category });
  const retryCategories = () => { void loadCategories(); };
  const activeCategory = categories.find(category => category.id === query.category);

  return (
    <section id="blog-section" className="relative overflow-hidden bg-white px-4 py-16 font-sans lg:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgb(var(--rgb-brand-dark)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--rgb-brand-dark)) 1px, transparent 1px)", backgroundSize: "50px 50px",
        }} />
        <div className="absolute right-0 top-0 h-125 w-125 rounded-full bg-brand-green/5 blur-[120px]" />
      </div>
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="order-1 min-w-0 lg:col-span-8">
          <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:hidden">
            <BlogSearch value={search} onChange={changeSearch} mobile />
            <label className="relative">
              <span className="sr-only">Filter articles by topic</span>
              <select value={query.category} onChange={event => changeCategory(Number(event.target.value))}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 pr-10 font-medium text-slate-900">
                <option value={0}>All Topics</option>
                {categories.map(category => <option key={category.id} value={category.id}>{category.name} ({category.count})</option>)}
              </select>
              <Icon name="chevron-down" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" />
            </label>
          </div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p role="status" aria-live="polite" className="text-xs font-semibold text-slate-500">
              {loading ? "Finding articles..." : `${total} ${total === 1 ? "article" : "articles"}${query.search ? ` for \u201c${query.search}\u201d` : ""}${activeCategory ? ` in ${activeCategory.name}` : ""}`}
            </p>
            {(query.search || query.category > 0) && <button type="button" onClick={() => commit({ search: "", category: 0 })}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-green hover:underline"><Icon name="times" className="h-3.5 w-3.5" />Clear filters</button>}
          </div>
          {offline && <p role="status" className="mb-6 rounded-2xl bg-slate-50 px-5 py-3 text-sm text-slate-600">You are offline. Showing your saved articles.</p>}
          <div id="blog-posts-grid" aria-busy={loading || loadingMore} className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {loading ? Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-120 rounded-[2.5rem]" />)
              : posts.map(post => <BlogCard key={post.id} post={post} categories={categories} />)}
            {loadingMore && Array.from({ length: 2 }, (_, index) => <Skeleton key={`more-${index}`} className="h-120 rounded-[2.5rem]" />)}
          </div>
          {error && <div role="alert" className="mt-8 rounded-3xl border border-slate-100 bg-slate-50 p-8 text-center text-sm text-slate-600">
            <p>{error}</p><button type="button" onClick={() => void load(query)} className="mt-3 font-bold text-brand-green underline">Try again</button>
          </div>}
          {!loading && !error && !posts.length && <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
            <Icon name="search" className="mx-auto mb-4 h-9 w-9 text-slate-300" />
            <h2 className="mb-2 text-xl font-black text-slate-900">No articles found</h2>
            <p className="mb-5 text-sm text-slate-500">Try another search or explore a different topic.</p>
            <button type="button" onClick={() => commit({ search: "", category: 0 })} className="text-sm font-bold text-brand-green underline">View all articles</button>
          </div>}
          {!loading && loadedPages < totalPages && <div className="mt-16 text-center">
            <button id="blog-load-more" type="button" disabled={loadingMore} onClick={() => void load(query, true)}
              className="inline-flex items-center gap-3 rounded-2xl bg-slate-900 px-9 py-4 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-brand-green disabled:cursor-wait disabled:opacity-60">
              {loadingMore ? "Loading articles..." : "Load More Articles"}<Icon name="arrow-right" className="h-4 w-4" />
            </button>
          </div>}
        </div>
        <BlogSidebar categories={categories} recentPosts={!query.search && !query.category ? posts.slice(0, 5) : recentPosts} search={search} category={query.category}
          total={!query.search && !query.category ? total : allPostsTotal} categoriesError={categoriesError} onSearch={changeSearch} onCategory={changeCategory} onRetryCategories={() => void retryCategories()} />
      </div>
    </section>
  );
}
