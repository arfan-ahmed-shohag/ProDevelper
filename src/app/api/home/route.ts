import { io } from "next/cache";
import { WordPressError } from "@/lib/wordpress";
import { getLatestFeedback } from "@/services/feedback";
import { featuredProjects } from "@/services/projects";
import { getFeaturedServiceCards } from "@/services/services";

const headers = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

export async function GET() {
  await io();

  try {
    const [services, projects, feedback] = await Promise.all([
      getFeaturedServiceCards(),
      featuredProjects(),
      getLatestFeedback(),
    ]);

    return Response.json({ services, projects, feedback }, { headers });
  } catch (error) {
    const status = error instanceof WordPressError && error.status === 400 ? 400 : 503;
    return Response.json(
      { error: "Homepage content is temporarily unavailable. Please try again." },
      { status, headers },
    );
  }
}
