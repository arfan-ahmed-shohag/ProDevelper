import type { ServiceCardData } from "@/lib/service-card";
import type { FeedbackResponse } from "@/services/feedback";
import type { ProjectResponse } from "@/services/projects";

export type HomePageData = {
  services: ServiceCardData[];
  projects: ProjectResponse[];
  feedback: { items: FeedbackResponse[]; total: number };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isServiceCard(value: unknown): value is ServiceCardData {
  return isRecord(value) && typeof value.title === "string" &&
    typeof value.href === "string" && typeof value.description === "string" &&
    (value.image === undefined || typeof value.image === "string");
}

function isProject(value: unknown): value is ProjectResponse {
  return isRecord(value) && Number.isInteger(value.id) && isRecord(value.title) &&
    typeof value.title.rendered === "string" && typeof value.link === "string";
}

function isFeedback(value: unknown): value is FeedbackResponse {
  return isRecord(value) && Number.isInteger(value.id) && isRecord(value.title) &&
    typeof value.title.rendered === "string" && isRecord(value.content) &&
    typeof value.content.rendered === "string";
}

export function isHomePageData(value: unknown): value is HomePageData {
  return isRecord(value) && Array.isArray(value.services) && value.services.every(isServiceCard) &&
    Array.isArray(value.projects) && value.projects.every(isProject) &&
    isRecord(value.feedback) && Array.isArray(value.feedback.items) &&
    value.feedback.items.every(isFeedback) && Number.isFinite(value.feedback.total) &&
    Number(value.feedback.total) >= 0;
}
