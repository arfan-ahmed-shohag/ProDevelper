import type { CSSProperties } from "react";
import { StatsMotion } from "./StatsMotion";
export default function StatsSection() {
  return (
    <StatsMotion>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          id="blob-1"
          className="absolute -top-24 -left-24 w-96 h-96 bg-brand-green/10 rounded-full blur-[100px]"
        ></div>

        <div
          id="blob-2"
          className="absolute bottom-0 right-0 w-125 h-125 bg-emerald-900/20 rounded-full blur-[120px]"
        ></div>
      </div>

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={
          {
            backgroundImage:
              "linear-gradient(rgb(var(--rgb-brand-green)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--rgb-brand-green)) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          } as CSSProperties
        }
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-24 gap-12">
          <div className="lg:w-2/3 wow animate__animated animate__fadeInLeft">
            <span className="text-brand-green font-bold uppercase tracking-[0.5em] text-[10px] mb-4 block">
              {"Proven Track Record"}
            </span>

            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] md:leading-none">
              {" Delivering "}
              <br />

              <span
                className="text-transparent"
                style={
                  {
                    WebkitTextStroke: "1.5px rgb(var(--rgb-brand-green))",
                  } as CSSProperties
                }
              >
                {"Pure Excellence."}
              </span>
            </h2>
          </div>

          <div className="lg:w-1/3 wow animate__animated animate__fadeInRight">
            <div className="relative p-8 border-l-2 border-brand-green/30 bg-white/5 backdrop-blur-sm rounded-r-3xl group hover:bg-white/10 transition-all duration-500">
              <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">
                {
                  ' "We believe every pixel and line of code should be perfect. Our mission is to transform your digital vision into a scalable success story." '
                }
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="text-[9px] font-bold text-brand-green px-3 py-1 bg-brand-green/10 rounded-full border border-brand-green/20">
                  {"STRATEGY"}
                </span>

                <span className="text-[9px] font-bold text-brand-green px-3 py-1 bg-brand-green/10 rounded-full border border-brand-green/20">
                  {"DESIGN"}
                </span>

                <span className="text-[9px] font-bold text-brand-green px-3 py-1 bg-brand-green/10 rounded-full border border-brand-green/20">
                  {"CODE"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6" id="bento-grid">
          <div className="md:col-span-4 group relative bg-white/5 border border-white/10 rounded-[2.5rem] p-10 overflow-hidden transition-all duration-500 hover:border-brand-green/60 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgb(var(--rgb-black)/0.3)] wow animate__animated animate__fadeInUp">
            <div className="relative z-10">
              <h3 className="text-6xl font-black text-white mb-2 tracking-tighter group-hover:text-brand-green transition-colors">
                <span className="counter" data-target="260">
                  {"0"}
                </span>
                <span className="text-brand-green">{"+"}</span>
              </h3>

              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
                {"Happy Clients"}
              </p>
            </div>

            <div className="absolute -bottom-4 -right-4 text-white/5 text-8xl font-black italic group-hover:text-brand-green/10 group-hover:scale-110 transition-all duration-700">
              {"TRUST"}
            </div>
          </div>

          <div
            className="md:col-span-4 group relative bg-white/5 border border-white/10 rounded-[2.5rem] p-10 overflow-hidden transition-all duration-500 hover:border-brand-green/60 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgb(var(--rgb-black)/0.3)] wow animate__animated animate__fadeInUp"
            data-wow-delay="0.2s"
          >
            <h3 className="text-6xl font-black text-white mb-2 tracking-tighter group-hover:text-brand-green transition-colors">
              <span className="counter" data-target="700">
                {"0"}
              </span>
              <span className="text-brand-green">{"+"}</span>
            </h3>

            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
              {"Projects Done"}
            </p>

            <div className="mt-8 flex gap-1 stat-bars">
              <div className="h-1 flex-1 bg-brand-green rounded-full transition-all duration-700 group-hover:flex-2"></div>

              <div className="h-1 flex-1 bg-brand-green rounded-full transition-all duration-700 group-hover:flex-1"></div>

              <div className="h-1 flex-1 bg-brand-green rounded-full transition-all duration-700 group-hover:flex-3"></div>

              <div className="h-1 flex-1 bg-white/10 rounded-full group-hover:bg-brand-green/40 transition-colors"></div>
            </div>
          </div>

          <div
            className="md:col-span-4 group relative bg-brand-green rounded-[2.5rem] p-10 overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgb(var(--rgb-brand-green)/0.4)] hover:-translate-y-3 wow animate__animated animate__fadeInUp"
            data-wow-delay="0.4s"
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center text-brand-green mb-12 transition-transform duration-700 group-hover:rotate-360">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>

              <div>
                <h3 className="text-6xl font-black text-brand-dark mb-1 tracking-tighter">
                  {"7"}
                  <span className="text-white text-3xl uppercase ml-2">
                    {"Years"}
                  </span>
                </h3>

                <p className="text-brand-dark/70 font-black uppercase tracking-widest text-[10px]">
                  {"Innovation & Experience"}
                </p>
              </div>
            </div>

            <div className="absolute -top-10 -right-10 w-40 h-40 border-20 border-white/10 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
          </div>

          <div
            className="md:col-span-12 group relative bg-white/5 border border-white/10 rounded-[3rem] p-10 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-700 hover:border-brand-green/40 hover:bg-white/8 wow animate__animated animate__fadeInUp"
            data-wow-delay="0.6s"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-28 h-28 flex items-center justify-center satisfaction-circle transition-transform duration-500 group-hover:scale-110">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/5"
                  ></circle>

                  <circle
                    id="satisfaction-path"
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    pathLength="100"
                    strokeDasharray="100"
                    strokeDashoffset="100"
                    className="text-brand-green"
                  ></circle>
                </svg>

                <span className="absolute text-2xl font-black text-white">
                  {"99%"}
                </span>
              </div>

              <div className="text-center md:text-left">
                <h3 className="text-4xl font-black text-white tracking-tight group-hover:text-brand-green transition-colors">
                  {"Satisfaction Guaranteed"}
                </h3>

                <p className="text-slate-400 text-sm mt-1 uppercase tracking-wider font-semibold opacity-70">
                  {"Quality Assurance & Client Success"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 relative z-10">
              <span className="px-8 py-4 bg-white/5 rounded-2xl border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-brand-green hover:text-brand-dark hover:border-brand-green hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg">
                {" Quality First "}
              </span>

              <span className="px-8 py-4 bg-white/5 rounded-2xl border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-brand-green hover:text-brand-dark hover:border-brand-green hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg">
                {" Fast Delivery "}
              </span>

              <span className="px-8 py-4 bg-white/5 rounded-2xl border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-brand-green hover:text-brand-dark hover:border-brand-green hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg">
                {" Support 24/7 "}
              </span>
            </div>
          </div>
        </div>
      </div>
    </StatsMotion>
  );
}
