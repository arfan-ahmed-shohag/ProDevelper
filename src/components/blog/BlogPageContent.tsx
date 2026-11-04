import BlogIndex from "@/components/blog/BlogIndex";
import { normalizeBlogQuery, type BlogPage, type BlogSearchParams } from "@/lib/blog";

export default async function BlogPageContent({ searchParams }: { searchParams: BlogSearchParams }) {
  const params = await searchParams;
  const query = normalizeBlogQuery(
    typeof params.search === "string" ? params.search : typeof params.s_query === "string" ? params.s_query : "",
    typeof params.categories === "string" ? params.categories : typeof params.category === "string" ? params.category : "0",
  );
  const empty: BlogPage = { posts: [], total: 0, totalPages: 0, refreshedAt: 0 };
  return <BlogIndex
    initialData={empty}
    initialCategories={[]}
    recentPosts={[]}
    allPostsTotal={null}
    initialQuery={query}
    initialError=""
    initialCategoriesError=""
  />;
}
