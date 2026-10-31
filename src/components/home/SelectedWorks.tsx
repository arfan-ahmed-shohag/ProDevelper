import items from "@/data/projects.json";
import featuredIds from "@/data/featured-projects.json";
import Image from "next/image";
import { SelectedWorksGrid } from "./SelectedWorksGrid";
import type { CSSProperties } from "react";
import Link from "next/link";
type Project = (typeof items)[number];

export default function SelectedWorks() {
  const projects = featuredIds
    .map((id) => items.find((project) => project.id === id))
    .filter((project): project is Project => Boolean(project));

  return (
    <section
      id="portfolio"
      className="pd_reveal relative bg-brand-dark py-16 md:py-24 lg:py-40 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-125 h-125 rounded-[100px] rotate-45 blur-[80px] animate-pulse bg-transparent"></div>

        <div className="absolute bottom-[20%] left-[-10%] w-87.5 h-87.5 bg-transparent rounded-full blur-[100px]"></div>

        <svg
          className="absolute top-20 left-10 opacity-10 w-64 h-64 text-brand-green"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M44.7,-76.4C58.1,-69.2,70.1,-58.3,77.4,-45.3C84.7,-32.3,87.2,-17.1,85.1,-2.5C83,12.1,76.2,26.2,67.3,38.6C58.3,51.1,47.2,61.9,34.1,68.9C21,75.9,5.9,79.1,-9.4,78.2C-24.7,77.3,-40.1,72.3,-53.4,63.1C-66.6,53.8,-77.7,40.3,-82.4,25.2C-87.1,10.1,-85.4,-6.5,-79.8,-21.5C-74.2,-36.5,-64.7,-49.8,-52.3,-57.4C-39.9,-65,-24.5,-66.8,-10.1,-74.6C4.4,-82.4,18.8,-96.2,33.2,-94.3C47.6,-92.4,62.1,-74.8,44.7,-76.4Z"
            transform="translate(100 100)"
          ></path>
        </svg>
      </div>

      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={
          {
            backgroundImage:
              "linear-gradient(rgb(var(--rgb-brand-green)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--rgb-brand-green)) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          } as CSSProperties
        }
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-32 text-center">
          <span className="text-brand-green font-bold uppercase tracking-[0.6em] text-[10px] mb-8 block">
            {"Crafted with precision"}
          </span>

          <h2 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] md:leading-none mb-4">
            {" Selected "}
            <br />

            <span
              className="text-transparent"
              style={
                {
                  WebkitTextStroke: "1.5px rgb(var(--rgb-brand-green) / 0.7)",
                  fontFamily: "var(--font-outline)",
                } as CSSProperties
              }
            >
              {"Works."}
            </span>
          </h2>
        </div>

        <SelectedWorksGrid>
          {projects.map((project) => (
            <div
              key={project.id || project.href}
              className="portfolio-item group relative flex flex-col"
            >
              <div className="relative aspect-4/5 overflow-hidden rounded-[2.5rem] bg-white/5 p-4 shadow-2xl transition-all duration-700 group-hover:-translate-y-4 border border-white/10 group-hover:border-brand-green/30">
                <div className="image-box relative w-full h-full overflow-hidden rounded-[1.8rem] bg-brand-deepest">
                  <a
                    href={project.href}
                    target="_blank"
                    className="block w-full h-full"
                    rel="noopener noreferrer"
                  >
                    <Image
                      width={890}
                      height={2560}
                      src={project.image}
                      sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 600px"
                      alt={project.title}
                      className="scroll-img w-full h-auto object-top transition-transform duration-[8s] ease-in-out"
                      loading="lazy"
                    />
                  </a>
                </div>
              </div>

              <div className="mt-10 space-y-4 px-4">
                <div className="flex justify-between items-center gap-4 group/title">
                  <a
                    className="min-w-0 flex-1"
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter transition-all group-hover:text-brand-green">
                      {project.title}
                    </h3>
                  </a>

                  <a
                    href={project.href}
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
                  {project.tags.slice(0, 4).map((label) => (
                    <span
                      key={label}
                      className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-white/5 text-slate-300 rounded-lg border border-white/10 group-hover:border-brand-green/40 transition-all"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </SelectedWorksGrid>

        <div className="mt-16 md:mt-40 text-center relative z-10">
          <Link href="/project-showcase" className="inline-block group">
            <h4 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 transition-all duration-500 group-hover:-translate-y-2">
              {" See All "}
              <span
                className="text-transparent"
                style={
                  {
                    WebkitTextStroke: "1.5px rgb(var(--rgb-brand-green))",
                    fontFamily: "var(--font-outline)",
                  } as CSSProperties
                }
              >
                {"Projects"}
              </span>
            </h4>

            <div className="relative h-1.5 w-24 bg-brand-green mx-auto transition-all duration-500 group-hover:w-full rounded-full shadow-[0_0_15px_rgb(var(--rgb-brand-green)/0.5)]"></div>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.5em] text-white opacity-50 group-hover:opacity-100 transition-opacity">
              {" View My All Projects "}
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
