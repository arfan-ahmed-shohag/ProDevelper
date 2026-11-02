import { featuredProjects } from "@/services/projects";
import { SelectedWorksGrid } from "./SelectedWorksGrid";
import { Suspense, type CSSProperties } from "react";
import Link from "next/link";
import SelectedWorkCard from "./SelectedWorkCard";
import SelectedWorksSkeleton from "./SelectedWorksSkeleton";

async function ProjectCards() {
  const projects = await featuredProjects();

  return (
    <SelectedWorksGrid>
      {projects.map((project) => (
        <SelectedWorkCard key={project.id} project={project} />
      ))}
    </SelectedWorksGrid>
  );
}

export default function SelectedWorks() {
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

        <Suspense fallback={<SelectedWorksSkeleton />}>
          <ProjectCards />
        </Suspense>

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
