import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import BlogPageContent from "@/components/blog/BlogPageContent";
import BlogListingSkeleton from "@/components/blog/BlogListingSkeleton";
import type { BlogSearchParams } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description: "Expert insights, web development guides, AI research, and digital strategies from Pro Developer. Explore the latest articles by Nizam Uddin.",
  alternates: { canonical: "/blog/" },
  openGraph: { title: "Blog & Insights | Pro Developer", type: "website", url: "/blog/" },
};

export default function BlogPage({ searchParams }: { searchParams: BlogSearchParams }) {
  return <>
    <PageHero badge="Company Blog & Insights" title="Expert Insights to" outline="Navigate the Digital Frontier."
      description="Deep dives into the latest web technologies, development frameworks, and strategic digital trends. I share my technical research to help you stay ahead in an ever-evolving digital landscape."
      stats={[{ value: "Tips", label: "Growth Hacks" }, { value: "News", label: "Latest Tech Trends" }, { value: "Tech", label: "Development Guides" }, { value: "Guides", label: "Expert Advice" }]}
      className="[&_h4]:uppercase [&_h4]:tracking-tighter" />
    <Suspense fallback={<BlogListingSkeleton />}><BlogPageContent searchParams={searchParams} /></Suspense>
  </>;
}
