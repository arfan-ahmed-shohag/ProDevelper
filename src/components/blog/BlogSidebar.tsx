"use client";

import Link from "next/link";
import { useState } from "react";
import { Collapse } from "@/components/Collapse";
import { Icon } from "@/components/icon";
import BlogImage from "@/components/blog/BlogImage";
import { blogPostHref, populatedBlogCategories, type BlogCategory, type BlogPost } from "@/lib/blog";

export function BlogSearch({ value, onChange, mobile = false }: {
  value: string; onChange: (value: string) => void; mobile?: boolean;
}) {
  const id = mobile ? "blog-search-mobile" : "blog-search";
  return <div className="relative">
    <label htmlFor={id} className="sr-only">Search articles</label>
    <input id={id} type="search" maxLength={200} value={value} onChange={event => onChange(event.target.value)}
      placeholder="Search everything here..."
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-5 font-medium text-slate-900 outline-none transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-light/20" />
    <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
  </div>;
}

export default function BlogSidebar({ categories, recentPosts, search, category, total, categoriesError, onSearch, onCategory, onRetryCategories }: {
  categories: BlogCategory[]; recentPosts: BlogPost[]; search: string; category: number; total: number | null;
  categoriesError?: string; onSearch: (value: string) => void; onCategory: (id: number) => void; onRetryCategories: () => void;
}) {
  const [recentOpen, setRecentOpen] = useState(true);
  return (
    <aside aria-label="Blog filters and recent posts" className="order-2 space-y-8 lg:col-span-4">
      <div className="space-y-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_15px_40px_rgb(var(--rgb-black)/0.03)] lg:sticky lg:top-28">
        <div className="hidden lg:block">
          <h2 className="mb-4 border-l-4 border-brand-light pl-4 text-lg font-black text-slate-900">Quick Filter</h2>
          <BlogSearch value={search} onChange={onSearch} />
        </div>
        <hr className="hidden border-slate-100 lg:block" />
        <div>
          <button type="button" aria-expanded={recentOpen} aria-controls="blog-recent-posts"
            onClick={() => setRecentOpen(value => !value)}
            className="flex w-full items-center justify-between rounded-2xl bg-slate-50 p-4 font-bold text-slate-900 transition-all duration-300 hover:bg-brand-light hover:text-white">
            <span className="flex items-center gap-2"><Icon name="clock" className="h-4 w-4 opacity-50" />Recent Posts</span>
            <Icon name="chevron-down" className={`h-4 w-4 transition-transform ${recentOpen ? "rotate-180" : ""}`} />
          </button>
          <Collapse open={recentOpen} id="blog-recent-posts">
            <div className="mt-4 space-y-4">
              {recentPosts.map(post => <Link key={post.id} href={blogPostHref(post)} prefetch={false} className="group flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <BlogImage image={post.image} alt="" sizes="64px" className="transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-xs font-bold text-slate-800 transition-colors group-hover:text-brand-green">{post.title}</h3>
                  <time dateTime={post.date} className="mt-1 block text-[10px] font-medium text-slate-400">{post.dateLabel}</time>
                </div>
              </Link>)}
              {!recentPosts.length && <p className="text-sm text-slate-500">Recent articles will appear here.</p>}
            </div>
          </Collapse>
        </div>
        <hr className="border-slate-100" />
        <div className="pt-2">
          <h2 className="mb-6 border-l-4 border-brand-light pl-4 text-sm font-black uppercase tracking-wider text-slate-900">Topics</h2>
          {categoriesError && <div role="status" className="mb-4 text-xs leading-relaxed text-slate-500">
            <p>{categoriesError}</p><button type="button" onClick={onRetryCategories} className="mt-2 font-bold text-brand-green underline">Try again</button>
          </div>}
          <ul className="space-y-3">
            {[{ id: 0, name: "All Topics", count: total }, ...populatedBlogCategories(categories)].map(item => <li key={item.id}>
              <button type="button" aria-pressed={category === item.id} onClick={() => onCategory(item.id)}
                className={`group flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-all ${category === item.id ? "border-brand-light/30 bg-brand-light/10 text-brand-dark" : "border-slate-50 text-slate-600 hover:border-brand-light/20 hover:bg-slate-50"}`}>
                <span className="text-sm font-bold transition-colors group-hover:text-brand-green">{item.name}</span>
                {item.count !== null && <span className="rounded-lg border border-slate-100 bg-white px-2 py-1 text-[10px] font-black text-slate-500">{item.count}</span>}
              </button>
            </li>)}
          </ul>
        </div>
      </div>
    </aside>
  );
}
