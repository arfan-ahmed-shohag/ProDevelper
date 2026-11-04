"use client";

import Image from "next/image";
import Link from "next/link";
import { blogHref, blogPostHref, populatedBlogCategories, type BlogArticle, type BlogCategory, type BlogPost } from "@/lib/blog";
import { Icon } from "@/components/icon";
import BlogImage from "@/components/blog/BlogImage";
import WordPressArticle from "@/components/blog/WordPressArticle";

function PostNavigationCard({ post, direction }: { post: BlogPost; direction: "previous" | "next" }) {
  const next = direction === "next";
  return <Link href={blogPostHref(post)} prefetch={false}
    className={`group flex min-w-0 items-center gap-4 rounded-3xl border border-slate-50 bg-white p-4 transition-all duration-500 hover:border-brand-light hover:shadow-xl ${next ? "flex-row-reverse text-right md:col-start-2" : ""}`}>
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
      <BlogImage image={post.image} alt="" sizes="80px" className="transition-transform duration-500 group-hover:scale-110" />
    </div>
    <div className="min-w-0">
      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">{next ? "Next Post" : "Previous Post"}</span>
      <h2 className="line-clamp-1 font-bold text-slate-800 transition-colors group-hover:text-brand-light">{post.title}</h2>
    </div>
  </Link>;
}

function ArticleSidebar({ posts, categories }: { posts: BlogPost[]; categories: BlogCategory[] }) {
  return <aside aria-label="Search, recent posts and topics" className="h-fit min-w-0 space-y-8 lg:sticky lg:top-28 lg:mt-28 lg:w-1/3">
    <div className="space-y-8 rounded-4xl border border-slate-100 bg-white p-8 shadow-[0_15px_40px_rgb(var(--rgb-black)/0.03)]">
      <div>
        <h2 className="mb-6 flex items-center gap-2 text-xl font-black text-slate-900"><span aria-hidden="true" className="h-6 w-1.5 rounded-full bg-brand-light" />Search Blog</h2>
        <form action="/blog/" method="get" className="relative" role="search">
          <label htmlFor="article-blog-search" className="sr-only">Search blog articles</label>
          <input id="article-blog-search" name="search" type="search" maxLength={200} placeholder="Search & hit enter..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-5 font-medium text-slate-600 outline-none transition-all focus:ring-2 focus:ring-brand-light/20" />
          <button type="submit" aria-label="Search blog" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-brand-light"><Icon name="search" className="h-6 w-6" /></button>
        </form>
      </div>
      {posts.length > 0 && <nav aria-label="Recent posts" className="space-y-4">
        {posts.slice(0, 4).map(post => <Link key={post.id} href={blogPostHref(post)} prefetch={false}
          className="group flex items-center gap-4 rounded-2xl border border-transparent p-2 transition-all hover:border-slate-100 hover:bg-slate-50">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 shadow-sm">
            <BlogImage image={post.image} alt="" sizes="56px" className="transition-transform duration-500 group-hover:scale-110" />
          </div>
          <div className="min-w-0 space-y-1">
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-800 transition-colors group-hover:text-brand-light">{post.title}</h3>
            <time dateTime={post.date} className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{post.dateLabel}</time>
          </div>
        </Link>)}
      </nav>}
      {categories.length > 0 && <>
        <hr className="border-slate-50" />
        <div>
          <h2 className="mb-6 flex items-center gap-2 text-xl font-black text-slate-900"><span aria-hidden="true" className="h-6 w-1.5 rounded-full bg-brand-light" />Topics</h2>
          <ul className="space-y-3">{populatedBlogCategories(categories).map(category => <li key={category.id}>
            <Link href={blogHref({ search: "", category: category.id })}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-50 bg-white p-4 transition-all hover:border-brand-light/30 hover:bg-slate-50">
              <span className="text-sm font-bold text-slate-600 transition-colors group-hover:text-brand-light">{category.name}</span>
              <span className="rounded-lg border border-slate-100 bg-white px-2 py-1 text-[10px] font-black text-slate-400 shadow-sm transition-all group-hover:bg-brand-light group-hover:text-white">{String(category.count).padStart(2, "0")}</span>
            </Link>
          </li>)}</ul>
        </div>
      </>}
    </div>
  </aside>;
}

export default function BlogArticleContent({ post, recentPosts, categories }: {
  post: BlogArticle;
  recentPosts: BlogPost[];
  categories: BlogCategory[];
}) {
  const index = recentPosts.findIndex(item => item.id === post.id);
  const previous = index >= 0 ? recentPosts[index + 1] ?? null : null;
  const next = index > 0 ? recentPosts[index - 1] : null;
  const year = /^\d{4}/.exec(post.date)?.[0];

  return <div id="primary" className="site-main custom-blog-container">
    <section className="hero-bg relative flex min-h-[50vh] items-center overflow-hidden pb-16 pt-28 lg:min-h-[60vh]">
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 -z-10 h-125 w-125 rounded-full bg-brand-light/5 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 -z-10 h-75 w-75 rounded-full bg-brand-light/5 blur-[100px]" />
      <div className="mx-auto w-full max-w-7xl px-6 text-center lg:px-16">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-light/20 bg-brand-light/10 px-4 py-2">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-light" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-light">{year ? `${year} Exclusive Guide` : "Exclusive Guide"}</span>
        </div>
        <h1 className="mx-auto mb-8 max-w-5xl text-4xl font-black italic leading-[1.1] tracking-tighter text-white lg:text-7xl">{post.title}</h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-brand-light/30 p-0.5">
            <Image src="/assets/db4185bfab85742d5fc9c3cf4758023313c48d83aa86a6d0844239c7b5c3d8ad-85e5375c.webp" alt="" width={96} height={96} sizes="40px" className="h-full w-full rounded-full object-cover" />
          </div>
          <div className="text-left">
            {post.author && <p className="mb-1 text-sm font-bold leading-none text-white">{post.author}</p>}
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Expert Developer <span aria-hidden="true">&bull;</span> <time dateTime={post.date}>{post.dateLabel}</time></p>
          </div>
        </div>
      </div>
    </section>
    <section className="relative overflow-hidden bg-white py-12 lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgb(var(--rgb-brand-dark)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--rgb-brand-dark)) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <div className="min-w-0 lg:w-2/3">
            <article id={`post-${post.id}`}>
              {post.image && <div className="mb-12 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-2 shadow-2xl shadow-slate-200/50">
                <BlogImage image={post.image} alt={post.imageAlt} natural width={post.imageWidth} height={post.imageHeight}
                  sizes="(max-width: 1023px) 90vw, 768px" className="rounded-4xl" />
              </div>}
              <div className="blog-entry entry-content max-w-none text-lg leading-relaxed text-slate-600 [&_table]:block [&_table]:overflow-x-auto [&_pre]:max-w-full">
                <WordPressArticle html={post.content} />
              </div>
            </article>
            {(previous || next) && <nav aria-label="Post navigation" className="mt-16 border-t border-slate-100 pt-10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {previous && <PostNavigationCard post={previous} direction="previous" />}
                {next && <PostNavigationCard post={next} direction="next" />}
              </div>
            </nav>}
          </div>
          <ArticleSidebar posts={recentPosts} categories={populatedBlogCategories(categories)} />
        </div>
      </div>
    </section>
  </div>;
}
