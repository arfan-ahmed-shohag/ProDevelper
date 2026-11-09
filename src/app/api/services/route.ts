import { io } from "next/cache";
import { WordPressError } from "@/lib/wordpress";
import { getAllServiceCards, getServiceDetail } from "@/services/services";

const headers = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

export async function GET(request: Request) {
  await io();
  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  if (slug && (!/^[a-z0-9-]{1,200}$/i.test(slug))) {
    return Response.json({ error: "Invalid service slug" }, { status: 400, headers });
  }

  try {
    if (!slug) return Response.json({ services: await getAllServiceCards() }, { headers });
    const service = await getServiceDetail(slug);
    if (!service) return Response.json({ error: "Service not found" }, { status: 404, headers });
    return Response.json({ service }, { headers });
  } catch (error) {
    return Response.json(
      { error: "Services are temporarily unavailable. Please try again." },
      { status: error instanceof WordPressError && error.status === 400 ? 400 : 503, headers },
    );
  }
}
