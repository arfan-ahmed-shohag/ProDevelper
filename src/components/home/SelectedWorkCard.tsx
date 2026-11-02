import Image from "next/image";
import { plainText } from "@/lib/plain-text";
import { getProjectWebsiteUrl } from "@/lib/project-card";
import type { ProjectResponse } from "@/services/projects";
import { ShowcaseCardImage } from "./ShowcaseCardImage";

export default function SelectedWorkCard({
  project,
  variant = "home",
}: {
  project: ProjectResponse;
  variant?: "home" | "showcase";
}) {
  const showcase = variant === "showcase";
  const title = plainText(project.title.rendered);
  const href = getProjectWebsiteUrl(project);
  const media = project._embedded?.["wp:featuredmedia"]?.[0];
  const image = project.project_data?.featured_image || media?.source_url;
  const demoTags = project._embedded?.["wp:term"]
    ?.flat()
    .filter((term) => term.taxonomy === "demo-tags")
    .map((term) => term.name);
  const tags = project.tag_list ?? (showcase ? demoTags : undefined) ?? [];

  return (
    <div className="portfolio-item group relative flex flex-col">
      <div
        className={`project-preview relative aspect-4/5 overflow-hidden rounded-[2.5rem] shadow-2xl transition-all duration-700 group-hover:-translate-y-4 ${
          showcase
            ? "border-2 border-gray-200"
            : "bg-white/5 p-4 border border-white/10 group-hover:border-brand-green/30"
        }`}
      >
        <div className="image-box relative w-full h-full overflow-hidden rounded-[1.8rem] bg-brand-deepest">
          <a
            href={href}
            target="_blank"
            className="block w-full h-full"
            rel="noopener noreferrer"
          >
            {showcase ? (
              <ShowcaseCardImage
                key={project.id}
                sources={[project.project_data?.featured_image, media?.source_url]}
                width={media?.media_details?.width ?? 890}
                height={media?.media_details?.height ?? 2560}
                alt={title}
              />
            ) : (
              image && (
                <Image
                  width={media?.media_details?.width ?? 890}
                  height={media?.media_details?.height ?? 2560}
                  src={image}
                  sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 600px"
                  alt={title}
                  className="scroll-img w-full h-auto object-top transition-transform duration-[8s] ease-in-out"
                  loading="lazy"
                />
              )
            )}
          </a>
        </div>
      </div>

      <div className={`mt-10 space-y-4 px-4 ${showcase ? "text-left" : ""}`}>
        <div className="flex justify-between items-center gap-4 group/title">
          <a
            className="min-w-0 flex-1"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3
              className={`text-3xl md:text-4xl font-black tracking-tighter transition-all ${
                showcase
                  ? "text-slate-900 group-hover:text-brand-green"
                  : "text-white group-hover:text-brand-green"
              }`}
            >
              {title}
            </h3>
          </a>

          <a
            href={href}
            target="_blank"
            className={`w-12 h-12 shrink-0 rounded-full border flex items-center justify-center transition-all group-hover/title:bg-brand-green group-hover/title:border-brand-green ${
              showcase ? "border-slate-200 text-slate-900 group-hover/title:text-white" : "border-white/10 text-white"
            }`}
            rel="noopener noreferrer"
          >
            <svg
              className="w-5 h-5 -rotate-45 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </a>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.slice(0, showcase ? undefined : 4).map((label) => (
            <span
              key={label}
              className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${
                showcase
                  ? "bg-slate-50 text-slate-500 border-slate-100 group-hover:border-brand-green/40"
                  : "bg-white/5 text-slate-300 border-white/10 group-hover:border-brand-green/40"
              }`}
            >
              {plainText(label)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
