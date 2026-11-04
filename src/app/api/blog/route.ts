import { getBlogArticle, getBlogCategories, getBlogPage } from "@/services/blog";
import { WordPressError } from "@/lib/wordpress";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const page = params.get("page") ?? "1";
  const search = params.get("search") ?? "";
  const category = params.get("categories") ?? "0";
  const resource = params.get("resource") ?? "posts";
  const slug = params.get("slug") ?? "";
  const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
  if (!/^[1-9]\d{0,3}$/.test(page) || search.length > 200 || !/^\d{1,10}$/.test(category) ||
    !["posts", "categories", "sidebar", "article"].includes(resource) ||
    (resource === "article" && (!slug || slug.length > 200 || /[/?#]/.test(slug)))) {
    return Response.json({ error: "Invalid blog query" }, { status: 400, headers });
  }
  try {
    const data = resource === "article"
      ? { article: await getBlogArticle(slug) }
      : resource === "sidebar"
        ? await Promise.all([getBlogPage(), getBlogCategories()]).then(([posts, categories]) => ({ posts, categories }))
        : resource === "categories"
          ? { categories: await getBlogCategories() }
          : await getBlogPage(Number(page), search, category);
    return Response.json(data, { headers });
  } catch (error) {
    return Response.json({ error: "Articles are temporarily unavailable. Please try again." }, {
      status: error instanceof WordPressError && error.status === 400 ? 400 : 503, headers,
    });
  }
}
