import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { wordpressCachePolicy } from "@/lib/cache-policy";
import { fetchWordPress, wordpressJson, wordpressUrl } from "@/lib/wordpress";
import { plainText } from "@/lib/plain-text";
import { blogPageSize, normalizeBlogQuery, populatedBlogCategories, type BlogArticle, type BlogCategory, type BlogPage, type BlogPost } from "@/lib/blog";

type WordPressPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  content?: { rendered: string; protected?: boolean };
  categories?: number[];
  featured_media?: number;
  post_meta?: {
    featured_image?: string;
    published_date?: string;
    author_name?: string;
    reading_time?: string;
    categories?: string[];
  };
  _embedded?: { "wp:featuredmedia"?: { source_url?: string }[] };
};
type WordPressMedia = {
  id: number;
  source_url?: string;
  media_details?: { width?: number; height?: number; sizes?: Record<string, { source_url?: string; width?: number; height?: number }> };
};
const postFields = "id,slug,date,title,excerpt,categories,featured_media,post_meta,_links,_embedded.wp:featuredmedia.source_url";

function imageUrl(value?: string): string | null {
  if (!value || typeof value !== "string") return null;
  try {
    const url = new URL(value, new URL(wordpressUrl("posts")).origin);
    // Match the existing Next Image remote pattern; unsupported images use the
    // local card placeholder instead of causing a render-time optimizer error.
    if (url.hostname !== "prodeveloper2.com" || !url.pathname.startsWith("/wp-content/uploads/")) return null;
    url.protocol = "https:";
    return url.href;
  } catch { return null; }
}

async function fallbackImages(posts: WordPressPost[]) {
  const ids = [...new Set(posts.filter(post => !imageUrl(post.post_meta?.featured_image) &&
    !imageUrl(post._embedded?.["wp:featuredmedia"]?.[0]?.source_url))
    .map(post => post.featured_media).filter((id): id is number => Boolean(id)))];
  if (!ids.length) return new Map<number, string | null>();
  try {
    const media = await wordpressJson<WordPressMedia[]>(wordpressUrl("media", new URLSearchParams({
      include: ids.join(","), per_page: String(ids.length),
      _fields: "id,source_url,media_details.sizes.large.source_url,media_details.sizes.medium_large.source_url",
    })));
    return new Map(media.map(item => [item.id, imageUrl(
      item.media_details?.sizes?.large?.source_url || item.media_details?.sizes?.medium_large?.source_url || item.source_url,
    )]));
  } catch { return new Map<number, string | null>(); }
}

function toBlogPost(post: WordPressPost, images: Map<number, string | null>): BlogPost {
  const date = new Date(`${post.date.slice(0, 10)}T12:00:00Z`);
  return {
    id: post.id, slug: post.slug, title: plainText(post.title.rendered),
    excerpt: plainText(post.excerpt?.rendered ?? ""), date: post.date,
    dateLabel: post.post_meta?.published_date || (Number.isNaN(date.getTime()) ? "" :
      new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(date)),
    image: imageUrl(post.post_meta?.featured_image) || images.get(post.featured_media ?? 0) ||
      imageUrl(post._embedded?.["wp:featuredmedia"]?.[0]?.source_url) || null,
    imageAlt: plainText(post.title.rendered),
    categoryIds: [...new Set((post.categories ?? []).filter(id => Number.isInteger(id) && id > 0))],
    categoryNames: (post.post_meta?.categories ?? []).map(plainText),
    author: plainText(post.post_meta?.author_name ?? ""),
    readingTime: plainText(post.post_meta?.reading_time ?? ""),
  };
}

function validatePosts(data: unknown): asserts data is WordPressPost[] {
  if (!Array.isArray(data) || !data.every(post => post && Number.isInteger(post.id) &&
    typeof post.slug === "string" && typeof post.date === "string" && typeof post.title?.rendered === "string")) {
    throw new Error("Invalid WordPress post response");
  }
}

async function cachedBlogPage(page: number, search: string, category: number): Promise<BlogPage> {
  "use cache";
  cacheLife(wordpressCachePolicy);
  cacheTag("wp:blog:posts");
  const params = new URLSearchParams({
    per_page: String(blogPageSize), page: String(page), orderby: "date", order: "desc", _fields: postFields,
    _embed: "wp:featuredmedia",
  });
  if (search) params.set("search", search);
  if (category) params.set("categories", String(category));
  const response = await fetchWordPress(wordpressUrl("posts", params));
  const posts: unknown = await response.json();
  validatePosts(posts);
  if (posts.length > blogPageSize) throw new Error("WordPress returned an oversized post page");
  const total = Number(response.headers.get("X-WP-Total") ?? posts.length);
  const totalPages = Number(response.headers.get("X-WP-TotalPages") ?? Math.ceil(total / blogPageSize));
  if (!Number.isInteger(total) || total < 0 || !Number.isInteger(totalPages) || totalPages < 0) {
    throw new Error("Invalid WordPress pagination totals");
  }
  const images = await fallbackImages(posts);
  return { posts: posts.map(post => toBlogPost(post, images)), total, totalPages, refreshedAt: Date.now() };
}

export function getBlogPage(page = 1, search = "", category: number | string = 0) {
  const query = normalizeBlogQuery(search, category);
  return cachedBlogPage(Math.min(10000, Math.max(1, Math.floor(page) || 1)), query.search, query.category);
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  "use cache";
  cacheLife(wordpressCachePolicy);
  cacheTag("wp:blog:categories");
  const categories: BlogCategory[] = [];
  for (let page = 1; page <= 20; page++) {
    const response = await fetchWordPress(wordpressUrl("categories", new URLSearchParams({
      per_page: "100", page: String(page), hide_empty: "true", _fields: "id,name,slug,count",
    })));
    const data: unknown = await response.json();
    if (!Array.isArray(data) || !data.every(term => term && Number.isInteger(term.id) &&
      typeof term.name === "string" && typeof term.slug === "string" && Number.isInteger(term.count) && term.count >= 0)) {
      throw new Error("Invalid WordPress categories");
    }
    categories.push(...data.map(term => ({ id: term.id, name: plainText(term.name), slug: term.slug, count: term.count })));
    if (page >= Number(response.headers.get("X-WP-TotalPages") || 1)) return populatedBlogCategories(categories);
  }
  throw new Error("Category dictionary exceeds the supported size");
}

export async function getBlogArticle(slug: string): Promise<BlogArticle | null> {
  "use cache";
  cacheLife({ stale: 30 * 24 * 60 * 60, revalidate: 30 * 24 * 60 * 60, expire: 31 * 24 * 60 * 60 });
  cacheTag("wp:blog:posts");
  if (!slug || slug.length > 200 || /[/?#]/.test(slug)) return null;
  const data: unknown = await wordpressJson(wordpressUrl("posts", new URLSearchParams({
    slug, per_page: "1", _fields: `${postFields},content`, _embed: "wp:featuredmedia",
  })));
  validatePosts(data);
  const post = data[0];
  if (!post || post.content?.protected) return null;
  const images = await fallbackImages([post]);
  const article = { ...toBlogPost(post, images), content: post.content?.rendered ?? "" };
  // A featured image keeps its real aspect ratio, rather than being cropped to
  // a generic video frame. Sized WP filenames already contain the dimensions.
  const dimensions = article.image?.match(/-(\d+)x(\d+)\.(?:jpe?g|png|webp|avif)(?:\?|$)/i);
  if (dimensions && Number(dimensions[1]) > 0 && Number(dimensions[2]) > 0) {
    return { ...article, imageWidth: Number(dimensions[1]), imageHeight: Number(dimensions[2]) };
  }
  return article;
}

export async function getBlogNeighbor(id: number, date: string, direction: "previous" | "next"): Promise<BlogPost | null> {
  "use cache";
  cacheLife(wordpressCachePolicy);
  cacheTag("wp:blog:posts");
  const data: unknown = await wordpressJson(wordpressUrl("posts", new URLSearchParams({
    per_page: "1", exclude: String(id), [direction === "previous" ? "before" : "after"]: date,
    orderby: "date", order: direction === "previous" ? "desc" : "asc", _fields: postFields,
    _embed: "wp:featuredmedia",
  })));
  validatePosts(data);
  if (!data[0]) return null;
  return toBlogPost(data[0], await fallbackImages(data));
}
