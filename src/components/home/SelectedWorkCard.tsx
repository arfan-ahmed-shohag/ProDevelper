import Image from "next/image";
import { plainText } from "@/lib/plain-text";
import type { ProjectResponse } from "@/services/projects";

function projectHref(project: ProjectResponse) {
  const link = project.project_data?.website_link;
  if (typeof link !== "string") return link?.url || project.link;

  try {
    const parsed: { url?: string } = JSON.parse(link);
    return parsed.url || project.link;
  } catch {
    return /^https?:\/\//.test(link) ? link : project.link;
  }
}

export default function SelectedWorkCard({ project }: { project: ProjectResponse }) {
  const title = plainText(project.title.rendered);
  const href = projectHref(project);
  const media = project._embedded?.["wp:featuredmedia"]?.[0];
  const image = project.project_data?.featured_image || media?.source_url;
  const tags = project.tag_list ?? [];

  return (
    <div className="portfolio-item group relative flex flex-col">
      <div className="relative aspect-4/5 overflow-hidden rounded-[2.5rem] bg-white/5 p-4 shadow-2xl transition-all duration-700 group-hover:-translate-y-4 border border-white/10 group-hover:border-brand-green/30">
        <div className="image-box relative w-full h-full overflow-hidden rounded-[1.8rem] bg-brand-deepest">
          <a
            href={href}
            target="_blank"
            className="block w-full h-full"
            rel="noopener noreferrer"
          >
            {image && (
              <Image
                width={media?.media_details?.width ?? 890}
                height={media?.media_details?.height ?? 2560}
                src={image}
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 600px"
                alt={title}
                className="scroll-img w-full h-auto object-top transition-transform duration-[8s] ease-in-out"
                loading="lazy"
              />
            )}
          </a>
        </div>
      </div>

      <div className="mt-10 space-y-4 px-4">
        <div className="flex justify-between items-center gap-4 group/title">
          <a
            className="min-w-0 flex-1"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter transition-all group-hover:text-brand-green">
              {title}
            </h3>
          </a>

          <a
            href={href}
            target="_blank"
            className="w-12 h-12 shrink-0 rounded-full border border-white/10 flex items-center justify-center transition-all text-white group-hover/title:bg-brand-green group-hover/title:border-brand-green"
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
          {tags.slice(0, 4).map((label) => (
            <span
              key={label}
              className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-white/5 text-slate-300 rounded-lg border border-white/10 group-hover:border-brand-green/40 transition-all"
            >
              {plainText(label)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
