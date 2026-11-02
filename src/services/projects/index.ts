"use server";

import { cacheLife } from "next/cache";

export type ProjectResponse = {
  id: number;
  title: { rendered: string };
  link: string;
  tag_list?: string[];
  project_data?: {
    website_link?: { url?: string } | string | null;
    featured_image?: string | null;
  };
  _embedded?: {
    "wp:featuredmedia"?: {
      source_url?: string;
      media_details?: { width: number; height: number };
    }[];
  };
};

export const featuredProjects = async (): Promise<ProjectResponse[]> => {
  "use cache";
  cacheLife({ stale: 60, revalidate: 60, expire: 2678400 });

  const res = await fetch(
    `${process.env.NEXT_BASE_URL}/p-showcase?project-categories=134&per_page=4&_embed=wp:featuredmedia`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch featured projects");
  }

  return res.json();
};
