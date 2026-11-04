import Link from "next/link";
import { Icon } from "@/components/icon";
import BlogImage from "@/components/blog/BlogImage";
import { blogPostHref, type BlogCategory, type BlogPost } from "@/lib/blog";

export default function BlogCard({ post, categories }: { post: BlogPost; categories: BlogCategory[] }) {
  const category = categories.find(item => post.categoryIds.includes(item.id));
  return (
    <article className="unique-blog-card group flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgb(var(--rgb-black)/0.08)] motion-safe:animate-[content-enter_.4s_ease_both]">
      <div className="relative m-4 h-60 overflow-hidden rounded-[1.8rem]">
        <Link href={blogPostHref(post)} prefetch={false} aria-label={`Read ${post.title}`} className="relative block h-full">
          <BlogImage image={post.image} alt={post.imageAlt}
            sizes="(max-width: 767px) calc(100vw - 64px), (max-width: 1023px) 44vw, 384px"
            className="transition-transform duration-1000 group-hover:scale-110" />
        </Link>
        <span className="pointer-events-none absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-full bg-brand-light px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
          {category?.name || post.categoryNames[0] || "Insights"}
        </span>
      </div>
      <div className="flex grow flex-col p-8 pt-2">
        <div className="mb-3 flex flex-wrap items-center gap-3 text-[10px] font-semibold text-slate-400">
          {post.dateLabel && <time dateTime={post.date} className="inline-flex items-center gap-1.5"><Icon name="calendar" className="h-3.5 w-3.5" />{post.dateLabel}</time>}
          {post.readingTime && <span className="inline-flex items-center gap-1.5"><Icon name="clock" className="h-3.5 w-3.5" />{post.readingTime}</span>}
        </div>
        <h2 className="mb-4 line-clamp-2 text-2xl font-black leading-tight text-slate-900 transition-colors group-hover:text-brand-green">
          <Link href={blogPostHref(post)} prefetch={false}>{post.title}</Link>
        </h2>
        <p className="mb-8 line-clamp-3 text-sm font-medium leading-relaxed text-slate-500">{post.excerpt}</p>
        <div className="mt-auto border-t border-slate-50 pt-6">
          <Link href={blogPostHref(post)} prefetch={false} aria-label={`Read more about ${post.title}`}
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-brand-green">
            Read More <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
