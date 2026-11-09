import { getShowcaseFilters, getShowcaseResults } from "@/services/projects";
import { WordPressError } from "@/lib/wordpress";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const kind = params.get("kind");
  const page = params.get("page") ?? "1";
  const search = params.get("search") ?? "";
  const filters = params.get("filters") ?? "";
  const resource = params.get("resource") ?? "pages";
  const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
  if ((kind !== "projects" && kind !== "demos") ||
    !/^[1-9]\d{0,3}$/.test(page) || search.length > 200 || filters.length > 1200 ||
    !["pages", "filters"].includes(resource)) {
    return Response.json({ error: "Invalid showcase query" }, { status: 400, headers });
  }
  try {
    // Public, published portfolio data only. Credentials/config stay server-side.
    const data = resource === "filters"
      ? await getShowcaseFilters(kind)
      : await getShowcaseResults(kind, Number(page), search, filters);
    return Response.json(data, { headers });
  } catch (error) {
    const status = error instanceof WordPressError && error.status === 400 ? 400 : 503;
    return Response.json({ error: "Showcase is temporarily unavailable. Please try again." }, { status, headers });
  }
}
