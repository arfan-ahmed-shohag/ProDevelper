import type { ProjectResponse } from "@/services/projects";

function readWebsiteField(value: unknown): string | undefined {
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      if (parsed && typeof parsed === "object" && "url" in parsed) {
        const url = (parsed as { url?: unknown }).url;
        if (typeof url === "string") return url;
      }
    } catch {
      // ACF returns a plain URL on the showcase endpoint.
    }
    return /^https?:\/\//i.test(value) ? value : undefined;
  }

  if (value && typeof value === "object" && "url" in value) {
    const url = (value as { url?: unknown }).url;
    if (typeof url === "string") return url;
  }
  return undefined;
}

export function getProjectWebsiteUrl(project: ProjectResponse) {
  return (
    readWebsiteField(project.project_data?.website_link) ??
    readWebsiteField(project.acf?.["website-link"]) ??
    project.link
  );
}
