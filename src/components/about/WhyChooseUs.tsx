import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { WhyChooseUsMotion } from "./WhyChooseUsMotion";

export default function WhyChooseUs() {
  return (
    <WhyChooseUsMotion>
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

      <div className="absolute -top-24 -right-24 w-[600px] h-[600px] opacity-[0.05] pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="100"
            cy="100"
            r="20"
            fill="none"
            stroke="rgb(var(--rgb-brand-green))"
            strokeWidth="0.5"
          ></circle>

          <circle
            cx="100"
            cy="100"
            r="40"
            fill="none"
            stroke="rgb(var(--rgb-brand-green))"
            strokeWidth="0.5"
          ></circle>

          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="rgb(var(--rgb-brand-green))"
            strokeWidth="0.5"
          ></circle>

          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="rgb(var(--rgb-brand-green))"
            strokeWidth="0.5"
          ></circle>

          <circle
            cx="100"
            cy="100"
            r="100"
            fill="none"
            stroke="rgb(var(--rgb-brand-green))"
            strokeWidth="0.5"
          ></circle>
        </svg>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          id="blob-why-1"
          className="absolute -top-24 -left-24 w-96 h-96 bg-brand-green/10 rounded-full blur-[100px]"
        ></div>

        <div
          id="blob-why-2"
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px]"
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-brand-green rounded-full animate-ping"></span>

            <span className="text-brand-green text-[10px] font-black uppercase tracking-[0.4em]">
              {"Strategic Partnership"}
            </span>
          </div>

          <h2 className="text-5xl lg:text-8xl font-black text-white tracking-tighter leading-none">
            {" Why Partners "}
            <span
              className="text-transparent"
              style={
                {
                  WebkitTextStroke: "1.5px rgb(var(--rgb-brand-green))",
                } as CSSProperties
              }
            >
              {"Trust Us"}
            </span>

            <br />
            {" With Their Vision "}
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 relative group overflow-hidden rounded-[3rem] bg-white/5 border border-white/10 p-10 flex flex-col justify-between min-h-[500px] hover:border-brand-green/30 transition-all duration-500 shadow-2xl">
            <div className="relative z-20">
              <h3 className="text-3xl font-bold text-white mb-6 leading-tight">
                {"Driving Success "}
                <br />
                {" Through Innovation."}
              </h3>

              <p className="text-slate-400 text-sm max-w-xs leading-relaxed italic">
                {
                  '"I don\'t just build websites; I build the digital engine that scales your business vision."'
                }
              </p>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none z-10">
              <svg
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full scale-90"
              >
                <path
                  d="M120 120 L280 280 M280 120 L120 280"
                  stroke="rgb(var(--rgb-brand-green))"
                  strokeWidth="0.5"
                  opacity="0.3"
                  strokeDasharray="4 4"
                ></path>

                <circle
                  cx="200"
                  cy="200"
                  r="140"
                  stroke="rgb(var(--rgb-brand-green))"
                  strokeWidth="0.5"
                  strokeDasharray="15 15"
                  opacity="0.2"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 200 200"
                    to="360 200 200"
                    dur="40s"
                    repeatCount="indefinite"
                  ></animateTransform>
                </circle>

                <path
                  d="M200 150 L243.3 175 V225 L200 250 L156.7 225 V175 Z"
                  stroke="rgb(var(--rgb-brand-green))"
                  strokeWidth="2"
                  fill="none"
                >
                  <animate
                    attributeName="opacity"
                    values="0.3;1;0.3"
                    dur="3s"
                    repeatCount="indefinite"
                  ></animate>
                </path>

                <circle
                  cx="200"
                  cy="200"
                  r="15"
                  fill="rgb(var(--rgb-brand-green))"
                  opacity="0.8"
                >
                  <animate
                    attributeName="r"
                    values="15;18;15"
                    dur="2s"
                    repeatCount="indefinite"
                  ></animate>
                </circle>

                <g>
                  <circle
                    cx="120"
                    cy="120"
                    r="5"
                    fill="rgb(var(--rgb-brand-green))"
                  ></circle>

                  <circle
                    cx="280"
                    cy="120"
                    r="5"
                    fill="rgb(var(--rgb-brand-green))"
                  ></circle>

                  <circle
                    cx="120"
                    cy="280"
                    r="5"
                    fill="rgb(var(--rgb-brand-green))"
                  ></circle>

                  <circle
                    cx="280"
                    cy="280"
                    r="5"
                    fill="rgb(var(--rgb-brand-green))"
                  ></circle>

                  <circle
                    cx="120"
                    cy="120"
                    r="5"
                    stroke="rgb(var(--rgb-brand-green))"
                  >
                    <animate
                      attributeName="r"
                      values="5;15"
                      dur="1.5s"
                      repeatCount="indefinite"
                    ></animate>

                    <animate
                      attributeName="opacity"
                      values="1;0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    ></animate>
                  </circle>

                  <circle
                    cx="280"
                    cy="280"
                    r="5"
                    stroke="rgb(var(--rgb-brand-green))"
                  >
                    <animate
                      attributeName="r"
                      values="5;15"
                      dur="1.5s"
                      begin="0.5s"
                      repeatCount="indefinite"
                    ></animate>

                    <animate
                      attributeName="opacity"
                      values="1;0"
                      dur="1.5s"
                      begin="0.5s"
                      repeatCount="indefinite"
                    ></animate>
                  </circle>
                </g>

                <circle r="3" fill="rgb(var(--rgb-white))">
                  <animateMotion
                    path="M120 120 L280 280"
                    dur="3s"
                    repeatCount="indefinite"
                  ></animateMotion>
                </circle>

                <circle r="3" fill="rgb(var(--rgb-white))">
                  <animateMotion
                    path="M280 120 L120 280"
                    dur="4s"
                    repeatCount="indefinite"
                  ></animateMotion>
                </circle>
              </svg>
            </div>

            <div className="relative z-20 flex items-center gap-4">
              <div className="p-5 bg-brand-green rounded-2xl shadow-[0_10px_30px_rgb(var(--rgb-brand-green)_/_0.3)]">
                <p className="text-3xl font-black text-brand-dark leading-none">
                  {"7+"}
                </p>

                <p className="text-[9px] font-black uppercase text-brand-dark/70 mt-1">
                  {"Years Exp"}
                </p>
              </div>

              <div className="p-5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10">
                <p className="text-3xl font-black text-white leading-none">
                  {"260+"}
                </p>

                <p className="text-[9px] font-black uppercase text-brand-green mt-1">
                  {"Global Trust"}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            <div className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-brand-green/40 hover:bg-white/[0.08] transition-all duration-500">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-brand-green mb-8 group-hover:bg-brand-green group-hover:text-brand-dark transition-all duration-700 group-hover:rotate-[360deg]">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
              </div>

              <h4 className="text-xl font-bold text-white mb-3 group-hover:text-brand-green">
                {"Deep Industry Expertise"}
              </h4>

              <p className="text-slate-400 text-sm leading-relaxed">
                {
                  "7+ years of engineering knowledge applied to every project."
                }
              </p>
            </div>

            <div className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-brand-green/40 hover:bg-white/[0.08] transition-all duration-500">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-brand-green mb-8 group-hover:bg-brand-green group-hover:text-brand-dark transition-all duration-700 group-hover:rotate-[360deg]">
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

              <h4 className="text-xl font-bold text-white mb-3 group-hover:text-brand-green">
                {"High Performance"}
              </h4>

              <p className="text-slate-400 text-sm leading-relaxed">
                {
                  "Page speed and security optimized for maximum conversions."
                }
              </p>
            </div>

            <div className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-brand-green/40 hover:bg-white/[0.08] transition-all duration-500">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-brand-green mb-8 group-hover:bg-brand-green group-hover:text-brand-dark transition-all duration-700 group-hover:rotate-[360deg]">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>

              <h4 className="text-xl font-bold text-white mb-3 group-hover:text-brand-green">
                {"On-Time Delivery"}
              </h4>

              <p className="text-slate-400 text-sm leading-relaxed">
                {
                  "Strict adherence to deadlines with zero compromise on quality."
                }
              </p>
            </div>

            <div className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-brand-green/40 hover:bg-white/[0.08] transition-all duration-500">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-brand-green mb-8 group-hover:bg-brand-green group-hover:text-brand-dark transition-all duration-700 group-hover:rotate-[360deg]">
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
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  ></path>
                </svg>
              </div>

              <h4 className="text-xl font-bold text-white mb-3 group-hover:text-brand-green">
                {"Future-Proof Tech"}
              </h4>

              <p className="text-slate-400 text-sm leading-relaxed">
                {
                  "Scaling your business with the latest, most secure technology stacks."
                }
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center justify-between p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md gap-8">
          <div className="flex items-center gap-6">
              <div className="flex -space-x-4">
              <Image
                width={48}
                height={48}
                sizes="48px"
                alt=""
                src="/assets/about/client_2_yxasft-665a43d7.png"
                  className="w-12 h-12 rounded-full border-4 border-brand-dark"
                loading="lazy"
              />

              <Image
                width={48}
                height={48}
                sizes="48px"
                alt=""
                src="/assets/about/client_1_uosiht-40d6d777.webp"
                  className="w-12 h-12 rounded-full border-4 border-brand-dark"
                loading="lazy"
              />

              <Image
                width={48}
                height={48}
                sizes="48px"
                alt=""
                src="/assets/about/WhatsApp_Image_2026-03-31_at_11-38-22_AM_ukxpfv-21f64a11.jpg"
                  className="w-12 h-12 rounded-full border-4 border-brand-dark"
                loading="lazy"
              />

              <div className="w-12 h-12 rounded-full bg-brand-green border-4 border-brand-dark flex items-center justify-center text-[10px] font-black text-brand-dark">
                {"260+"}
              </div>
            </div>

            <p className="text-white/60 text-sm font-medium italic">
              {'"Exceptional quality that exceeds industry standards."'}
            </p>
          </div>

          <Link
            href="/services/"
            className="px-10 py-4 bg-brand-green text-brand-dark font-black rounded-2xl hover:scale-105 transition-all shadow-[0_10px_40px_rgb(var(--rgb-brand-green)_/_0.4)]"
          >
            {" BUILD YOUR VISION "}
          </Link>
        </div>
      </div>
    </WhyChooseUsMotion>
  );
}
