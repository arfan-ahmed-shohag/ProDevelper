import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrowserCachedBlogArticle from "@/components/blog/BrowserCachedBlogArticle";
import { getBlogArticle } from "@/services/blog";
import { blogPostHref } from "@/lib/blog";

type ArticleProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogArticle(slug);
  if (!post) notFound();
  return {
    title: post.title, description: post.excerpt.slice(0, 160),
    alternates: { canonical: blogPostHref(post) },
    openGraph: { title: post.title, description: post.excerpt.slice(0, 160), type: "article", url: blogPostHref(post),
      publishedTime: post.date, ...(post.author ? { authors: [post.author] } : {}),
      ...(post.image ? { images: [{ url: post.image, alt: post.imageAlt }] } : {}) },
  };
}

export default async function BlogArticlePage({ params }: ArticleProps) {
  const { slug } = await params;
  return <BrowserCachedBlogArticle slug={slug} />;
}
