"use client";

import { useEffect, useState } from "react";
import BlogArticleContent from "@/components/blog/BlogArticleContent";
import BlogArticleSkeleton from "@/components/blog/BlogArticleSkeleton";
import { blogArticleScope, blogCategoriesScope, blogScope, isBlogArticle, isBlogCategories, isBlogPage, type BlogArticle, type BlogCategory, type BlogPage, type BlogPost } from "@/lib/blog";
import { getJson } from "@/lib/client-json";
import { readCachedPages, writeCachedPage } from "@/lib/indexed-page-cache";

type SidebarResponse = { posts: BlogPage; categories: BlogCategory[] };

function isSidebarResponse(data: unknown): data is SidebarResponse {
  if (!data || typeof data !== "object") return false;
  const sidebar = data as SidebarResponse;
  return isBlogPage(sidebar.posts) && isBlogCategories(sidebar.categories);
}

export default function BrowserCachedBlogArticle({ slug }: { slug: string }) {
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [errorState, setErrorState] = useState<{ slug: string; message: string } | null>(null);
  const [retryVersion, setRetryVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadArticle() {
      const scope = blogArticleScope(slug);
      const [articleEntries, pageEntries, categoryEntries] = await Promise.all([
        readCachedPages<BlogArticle>(scope, isBlogArticle),
        readCachedPages<BlogPage>(blogScope({ search: "", category: 0 }), isBlogPage),
        readCachedPages<BlogCategory[]>(blogCategoriesScope, isBlogCategories),
      ]);
      if (!active) return;

      if (articleEntries[0]) setArticle(articleEntries[0].data);
      const cachedPosts = pageEntries.find(entry => entry.page === 1)?.data;
      const cachedCategories = categoryEntries[0]?.data;
      if (cachedPosts) setRecentPosts(cachedPosts.posts.slice(0, 5));
      if (cachedCategories) setCategories(cachedCategories);

      const articleRequest = articleEntries[0]
        ? Promise.resolve(articleEntries[0].data)
        : getJson<{ article: BlogArticle | null }>(
            `/api/blog?resource=article&slug=${encodeURIComponent(slug)}`,
            controller.signal,
            "This article is temporarily unavailable. Please try again.",
          ).then(result => {
            if (!result.article || !isBlogArticle(result.article)) throw new Error("This article could not be loaded.");
            void writeCachedPage(scope, 1, result.article, Date.now());
            return result.article;
          });

      const sidebarRequest = cachedPosts && cachedCategories
        ? Promise.resolve(null)
        : getJson<SidebarResponse>("/api/blog?resource=sidebar", controller.signal)
            .then(result => {
              if (!isSidebarResponse(result)) throw new Error("Blog topics could not be loaded.");
              if (!cachedPosts) {
                void writeCachedPage(blogScope({ search: "", category: 0 }), 1, result.posts, result.posts.refreshedAt);
                if (active) setRecentPosts(result.posts.posts.slice(0, 5));
              }
              if (!cachedCategories) {
                void writeCachedPage(blogCategoriesScope, 1, result.categories, Date.now());
                if (active) setCategories(result.categories);
              }
              return result;
            });

      void articleRequest.then(post => {
        if (!active) return;
        setArticle(post);
      }).catch(reason => {
        if (active && !articleEntries[0]) {
          setErrorState({ slug, message: reason instanceof Error ? reason.message : "This article could not be loaded. Please try again." });
        }
      });
      void sidebarRequest.catch(() => {});
    }

    void loadArticle();
    return () => {
      active = false;
      controller.abort();
    };
  }, [slug, retryVersion]);

  const error = errorState?.slug === slug ? errorState.message : "";
  if (!article || article.slug !== slug) return <BlogArticleSkeleton error={error} onRetry={error ? () => {
    setErrorState(null);
    setRetryVersion(value => value + 1);
  } : undefined} />;

  return <BlogArticleContent post={article} recentPosts={recentPosts} categories={categories} />;
}
