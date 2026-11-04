export const blogPageSize = 10;

export type BlogQuery = { search: string; category: number };
export type BlogCategory = { id: number; name: string; slug: string; count: number };
export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateLabel: string;
  image: string | null;
  imageAlt: string;
  categoryIds: number[];
  categoryNames: string[];
  author: string;
  readingTime: string;
};
export type BlogPage = {
  posts: BlogPost[];
  total: number;
  totalPages: number;
  refreshedAt: number;
};
export type BlogArticle = BlogPost & { content: string; imageWidth?: number; imageHeight?: number };
export type BlogSearchParams = Promise<Record<string, string | string[] | undefined>>;

export const blogCategoriesScope = "blog:categories:v1";

export function blogArticleScope(slug: string) {
  return `blog:article:v1:${slug}`;
}

export function normalizeBlogQuery(search = "", category: number | string = 0): BlogQuery {
  const id = typeof category === "string" && !/^\d{1,10}$/.test(category) ? 0 : Number(category);
  return {
    search: search.trim().slice(0, 200),
    category: Number.isSafeInteger(id) && id > 0 ? id : 0,
  };
}

export function blogScope(query: BlogQuery) {
  const normalized = normalizeBlogQuery(query.search, query.category);
  return `blog:v1:${JSON.stringify([normalized.search, normalized.category])}`;
}

export function blogHref(query: BlogQuery) {
  const normalized = normalizeBlogQuery(query.search, query.category);
  const params = new URLSearchParams();
  if (normalized.search) params.set("search", normalized.search);
  if (normalized.category) params.set("categories", String(normalized.category));
  return `/blog/${params.size ? `?${params}` : ""}`;
}

export function blogPostHref(post: Pick<BlogPost, "slug">) {
  return `/blog/${encodeURIComponent(post.slug)}/`;
}

export function populatedBlogCategories(categories: BlogCategory[]) {
  return categories.filter(category => category.count > 0);
}

function isBlogPost(value: unknown): value is BlogPost {
  try {
    if (!value || typeof value !== "object") return false;
    const post = value as BlogPost;
    return Number.isInteger(post.id) && post.id > 0 && typeof post.slug === "string" &&
      typeof post.title === "string" && typeof post.excerpt === "string" && typeof post.date === "string" &&
      typeof post.dateLabel === "string" && (post.image === null || typeof post.image === "string") &&
      typeof post.imageAlt === "string" && typeof post.author === "string" && typeof post.readingTime === "string" &&
      Array.isArray(post.categoryIds) && post.categoryIds.every(Number.isInteger) &&
      Array.isArray(post.categoryNames) && post.categoryNames.every(name => typeof name === "string");
  } catch { return false; }
}

export function isBlogCategories(data: unknown): data is BlogCategory[] {
  return Array.isArray(data) && data.every(category => category && Number.isInteger(category.id) &&
    category.id > 0 && typeof category.name === "string" && typeof category.slug === "string" &&
    Number.isInteger(category.count) && category.count >= 0);
}

export function isBlogArticle(data: unknown): data is BlogArticle {
  if (!isBlogPost(data)) return false;
  const article = data as BlogArticle;
  return typeof article.content === "string" &&
    (article.imageWidth === undefined || (Number.isFinite(article.imageWidth) && article.imageWidth > 0)) &&
    (article.imageHeight === undefined || (Number.isFinite(article.imageHeight) && article.imageHeight > 0));
}

export function isBlogPage(data: unknown): data is BlogPage {
  try {
    if (!data || typeof data !== "object") return false;
    const value = data as BlogPage;
    return Number.isInteger(value.total) && value.total >= 0 &&
      Number.isInteger(value.totalPages) && value.totalPages >= 0 && Number.isFinite(value.refreshedAt) &&
      Array.isArray(value.posts) && value.posts.length <= blogPageSize && value.posts.every(isBlogPost);
  } catch { return false; }
}
