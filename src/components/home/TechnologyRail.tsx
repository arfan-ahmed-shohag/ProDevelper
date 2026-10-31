"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type Technology = {
  label: string;
  image: string;
  width?: number;
  height?: number;
};

export function TechnologyRail({
  items,
  reverse = false,
}: {
  items: Technology[];
  reverse?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let x = 0,
      width = 0,
      lastTime = performance.now(),
      dragging = false,
      hovered = false,
      startX = 0,
      pointerX = 0,
      frame = 0;
    const normalize = () => {
      if (!width) return;
      while (x <= -width) x += width;
      while (x > 0) x -= width;
    };
    const apply = () => {
      track.style.transform = `translate3d(${x}px,0,0)`;
    };
    const measure = () => {
      width = track.scrollWidth / 2;
      normalize();
      apply();
    };
    const tick = (time: number) => {
      const dt = Math.min(0.064, Math.max(0, (time - lastTime) / 1000));
      lastTime = time;
      if (!motion.matches && width > 0 && !dragging && !hovered) {
        x += (reverse ? 60 : -60) * dt;
        normalize();
        apply();
      }
      frame = requestAnimationFrame(tick);
    };
    const enter = () => {
      hovered = true;
    };
    const leave = () => {
      if (!dragging) hovered = false;
    };
    const down = (event: PointerEvent) => {
      if (event.button !== 0) return;
      dragging = true;
      startX = x;
      pointerX = event.clientX;
      track.classList.add("is-dragging");
      track.setPointerCapture(event.pointerId);
      event.preventDefault();
    };
    const move = (event: PointerEvent) => {
      if (dragging) {
        x = startX + event.clientX - pointerX;
        normalize();
        apply();
        event.preventDefault();
      }
    };
    const up = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove("is-dragging");
      if (track.hasPointerCapture(event.pointerId))
        track.releasePointerCapture(event.pointerId);
      if (!track.matches(":hover")) hovered = false;
    };
    measure();
    frame = requestAnimationFrame(tick);
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    track.addEventListener("mouseenter", enter);
    track.addEventListener("mouseleave", leave);
    track.addEventListener("pointerdown", down);
    track.addEventListener("pointermove", move);
    track.addEventListener("pointerup", up);
    track.addEventListener("pointercancel", up);
    track.addEventListener("lostpointercapture", up);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      track.removeEventListener("mouseenter", enter);
      track.removeEventListener("mouseleave", leave);
      track.removeEventListener("pointerdown", down);
      track.removeEventListener("pointermove", move);
      track.removeEventListener("pointerup", up);
      track.removeEventListener("pointercancel", up);
      track.removeEventListener("lostpointercapture", up);
    };
  }, [reverse]);

  return (
    <div
      className={`marquee-wrapper overflow-hidden ${reverse ? "-mt-8" : ""}`}
    >
      <div
        ref={trackRef}
        className={reverse ? "marquee-track-reverse" : "marquee-track"}
        style={{ touchAction: "none" }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className="marquee-segment shrink-0"
          >
            {items.map((item) => (
              <div key={item.label} className="relative group shrink-0">
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-xl text-[12px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-top-16 transition-all duration-300 shadow-xl z-50 pointer-events-none">
                  {item.label}
                  <div className="tooltip-arrow-custom" />
                </div>
                <div className="bg-slate-50 w-24 h-24 2xl:w-32 2xl:h-32 rounded-[2.5rem] flex items-center justify-center border border-slate-100 group-hover:border-brand-green/30 group-hover:bg-white group-hover:shadow-2xl transition-all duration-500 p-3 2xl:p-4 min-w-0">
                  <Image
                    src={item.image}
                    sizes="(min-width: 1536px) 64px, 48px"
                    alt={copy === 0 ? item.label : ""}
                    width={item.width || 96}
                    height={item.height || 96}
                    loading="lazy"
                    draggable={false}
                    className="block w-auto h-auto max-h-12 max-w-12 2xl:max-h-16 2xl:max-w-16 object-contain object-center grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-[transform,opacity,filter] duration-500 pointer-events-none shrink-0"
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
