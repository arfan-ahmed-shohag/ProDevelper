"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
export function Dashboard() {
  const rootRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const scope = element;
    // Resolve global RGB channels into colors GSAP can interpolate.
    const themeColor = (name: string, opacity = 1) => {
      const channels = getComputedStyle(scope)
        .getPropertyValue(`--rgb-${name}`)
        .trim()
        .split(/\s+/)
        .join(", ");
      return `rgba(${channels}, ${opacity})`;
    };
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        function startPerfectAnimation() {
          const cursor = scope.querySelector<HTMLElement>("#magic-cursor")!;
          const btnSpeed = scope.querySelector<HTMLElement>("#btn-speed")!;
          const btnDone = scope.querySelector<HTMLElement>("#btn-done")!;
          const btnCode = scope.querySelector<HTMLElement>("#btn-code")!;
          const badge = scope.querySelector<HTMLElement>("#floating-badge")!;
          const container = scope;
          const speedCount = scope.querySelector<HTMLElement>("#speed-count")!;
          const getPos = (el: HTMLElement) => {
            const rect = el.getBoundingClientRect();
            const contRect = container.getBoundingClientRect();
            return {
              x: rect.left - contRect.left + rect.width / 2,
              y: rect.top - contRect.top + rect.height / 2,
            };
          };
          const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
          tl.set(cursor, { opacity: 0, x: 500, y: 400 })
            .set(badge, { opacity: 0, y: 30, scale: 0.8 })
            .set(["#line1", "#line2", "#line3"], {
              width: 0,
              borderRight: () => `2px solid ${themeColor("brand-light")}`,
            })
            .set("#profile-img", { rotation: -45, scale: 0.5 });
          tl.to("#line1", { width: "100%", duration: 1, ease: "steps(25)" })
            .set("#line1", { borderRight: "none" })
            .to("#line2", { width: "100%", duration: 1, ease: "steps(30)" })
            .set("#line2", { borderRight: "none" })
            .to("#line3", { width: "100%", duration: 0.8, ease: "steps(20)" })
            .to({}, { duration: 0.5 });
          const posSpeed = getPos(btnSpeed);
          tl.to(cursor, { opacity: 1, duration: 0.5 })
            .to(cursor, {
              x: posSpeed.x,
              y: posSpeed.y - 73,
              duration: 1.2,
              ease: "power3.inOut",
            })
            .to(btnSpeed, { scale: 0.8, duration: 0.1 })
            .to(btnSpeed, {
              scale: 1,
              duration: 0.1,
              backgroundColor: () => themeColor("brand-light"),
              color: () => themeColor("black"),
            })
            .to(
              btnCode,
              {
                backgroundColor: () => themeColor("white", 0.05),
                color: () => themeColor("white", 0.2),
              },
              "-=0.2",
            )
            .to("#state-1", { opacity: 0, y: -20, duration: 0.4 })
            .to("#state-2", { opacity: 1, y: 0, duration: 0.4 }, "-=0.2")
            .to(speedCount, {
              innerText: 99,
              duration: 1.5,
              snap: { innerText: 1 },
              ease: "power2.out",
            })
            .to({}, { duration: 1 });
          const posDone = getPos(btnDone);
          tl.to(cursor, {
            x: posDone.x,
            y: posDone.y - 73,
            duration: 1,
            ease: "power3.inOut",
          })
            .to(btnDone, { scale: 0.8, duration: 0.1 })
            .to(btnDone, {
              scale: 1,
              duration: 0.1,
              backgroundColor: () => themeColor("brand-light"),
              color: () => themeColor("black"),
            })
            .to(
              btnSpeed,
              {
                backgroundColor: () => themeColor("white", 0.05),
                color: () => themeColor("white", 0.2),
              },
              "-=0.2",
            )
            .to("#state-2", { opacity: 0, y: -20, duration: 0.4 })
            .to("#state-3", { opacity: 1, duration: 0.1 })
            .to("#profile-img", {
              scale: 1,
              rotation: 0,
              duration: 0.8,
              ease: "back.out(1.7)",
            })
            .from(
              "#success-text",
              { opacity: 0, y: 10, duration: 0.4 },
              "-=0.4",
            )
            .to(
              badge,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: "elastic.out(1, 0.7)",
                onComplete: () => badge.classList.add("badge-glow"),
              },
              "-=0.3",
            )
            .to(badge, {
              y: -10,
              duration: 1.5,
              repeat: 1,
              yoyo: !0,
              ease: "sine.inOut",
            })
            .to({}, { duration: 1.5 });
          tl.to([cursor, badge, "#state-3"], { opacity: 0, duration: 0.5 })
            .set(btnCode, {
              backgroundColor: () => themeColor("brand-light"),
              color: () => themeColor("black"),
            })
            .set(btnDone, {
              backgroundColor: () => themeColor("white", 0.05),
              color: () => themeColor("white", 0.2),
            })
            .set("#state-1", { opacity: 1, y: 0 })
            .set(speedCount, { innerText: 0 })
            .call(() => badge.classList.remove("badge-glow"));
        }
        startPerfectAnimation();
      }, scope);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);
  return (
    <div
      className="relative h-100 lg:h-[450px] md:pt-20"
      id="dashboard-container"
      ref={rootRef}
    >
      <div id="magic-cursor" className="opacity-0">
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="rgb(var(--rgb-white))"
          stroke="rgb(var(--rgb-black))"
          strokeWidth="1"
        >
          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
        </svg>
      </div>

      <div className="dashboard-frame overflow-hidden w-full max-w-150 mx-auto relative">
        <div className="bg-black/60 border-b border-white/5 p-4 flex items-center justify-between relative z-20">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/60"></div>

            <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>

            <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono italic">
            {"Prodeveloper2.com"}
          </div>
        </div>

        <div className="flex 2xl:h-100 h-75 relative z-10">
          <div className="w-20 bg-white/5 border-r border-white/5 p-6 flex flex-col items-center gap-10">
            <div
              id="btn-code"
              className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-black"
            >
              <svg
                className="w-5 h-5"
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

            <div
              id="btn-speed"
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40"
            >
              <svg
                className="w-5 h-5"
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

            <div
              id="btn-done"
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>

          <div className="flex-1 relative bg-slate-900/40 p-10">
            <div
              id="state-1"
              className="absolute inset-0 p-8 flex flex-col gap-2 opacity-100"
            >
              <div className="code-block font-mono text-xs" id="line1">
                {"const developer = new Nizam(); "}
              </div>

              <div className="code-block font-mono text-xs" id="line2">
                {"developer.init({ status: 'Elite' });"}
              </div>

              <div className="code-block font-mono text-xs" id="line3">
                {"developer.build('Future'); "}
              </div>
            </div>

            <div
              id="state-2"
              className="absolute inset-0 flex flex-col items-center justify-center opacity-0"
            >
              <div className="flex gap-3">
                <div
                  className="text-7xl font-black text-brand-light tracking-tighter"
                  id="speed-count"
                >
                  {"0"}
                </div>
                <span className="text-7xl font-black text-brand-light tracking-tighter">
                  {"%"}
                </span>
              </div>

              <p className="text-[10px] tracking-widest uppercase mt-2 text-white/60">
                {"Page Speed Score "}
              </p>
            </div>

            <div
              id="state-3"
              className="absolute inset-0 flex flex-col items-center justify-center opacity-0"
            >
              <Image
                src="/assets/home/image-311db27f.png"
                id="profile-img"
                className="w-24 h-24 rounded-full border-4 border-brand-light shadow-2xl mb-4 object-cover scale-50"
                loading="lazy"
                alt="Nizam Uddin"
                width={96}
                height={96}
              />

              <h3
                className="font-bold text-white uppercase tracking-widest text-sm"
                id="success-text"
              >
                {"Deployment Success"}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div
        id="floating-badge"
        className="absolute -bottom-8 md:-left-8 -left-4 bg-white p-2 md:p-4 rounded-4xl shadow-2xl items-center md:gap-4 gap-2"
      >
        <div className="md:w-12 w-10 md:h-12 h-10 bg-black rounded-2xl flex items-center justify-center md:text-lg text-sm font-black text-brand-light">
          {" 99%"}
        </div>

        <div className="text-black">
          <p className="text-[9px] uppercase font-black opacity-40 leading-none">
            {"Success"}
          </p>

          <p className="text-xs font-bold">{"Verified Result"}</p>
        </div>
      </div>
    </div>
  );
}
