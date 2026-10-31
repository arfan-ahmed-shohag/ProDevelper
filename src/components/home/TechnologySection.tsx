import type { CSSProperties } from "react";
import { TechnologyRail } from "./TechnologyRail";
import technologies from "@/data/technologies.json";
export default function TechnologySection() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-40 bg-white selection:bg-brand-green selection:text-white">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={
            {
              backgroundImage:
                "linear-gradient(rgb(var(--rgb-brand-dark)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--rgb-brand-dark)) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            } as CSSProperties
          }
        ></div>

        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-24 text-center">
          <span className="text-brand-green font-bold uppercase tracking-[0.6em] text-[10px] mb-6 block">
            {"My Powerhouse"}
          </span>

          <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85] md:leading-none mb-4">
            {" Built with "}
            <br />

            <span
              className="text-transparent"
              style={
                {
                  WebkitTextStroke: "1.5px rgb(var(--rgb-brand-green))",
                  fontFamily: "var(--font-outline)",
                } as CSSProperties
              }
            >
              {"Excellence."}
            </span>
          </h2>
        </div>

        <div className="tech-slider-mask relative w-full overflow-hidden mb-24">
          <TechnologyRail items={technologies[0]} reverse={false} />

          <TechnologyRail items={technologies[1]} reverse={true} />
        </div>

        <div className="features-card-section">
          <div className="feature-card">
            <div className="card-blob"></div>

            <div className="card-content">
              <div className="icon-box">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
              </div>

              <h3>{"24/7 Support"}</h3>

              <p>
                {
                  "Round-the-clock technical assistance keeping your platform always online."
                }
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="card-blob"></div>

            <div className="card-content">
              <div className="icon-box">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
              </div>

              <h3>{"Secure & Scalable"}</h3>

              <p>
                {
                  "Enterprise-grade security with architecture that grows with your business."
                }
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="card-blob"></div>

            <div className="card-content">
              <div className="icon-box">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>

              <h3>{"High Performance"}</h3>

              <p>
                {
                  "Optimized code for lightning-fast speeds and global peak performance."
                }
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8"></div>
      </div>
    </section>
  );
}
