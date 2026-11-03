"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type gsap from "gsap";

export function WhyChooseUsMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let active = true;
    let media: ReturnType<typeof gsap.matchMedia> | undefined;
    void import("gsap").then(({ default: gsap }) => {
      if (!active) return;
      media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const context = gsap.context(() => {
          const floats: [string, number, number, number][] = [
            ["#blob-why-1", 40, 20, 8],
            ["#blob-why-2", -30, -40, 10],
          ];

          floats.forEach(([selector, x, y, duration]) => {
            const element = root.querySelector(selector);
            if (!element) return;

            gsap.to(element, {
              x,
              y,
              duration,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          });
        }, root);

        return () => context.revert();
      });

    });
    return () => { active = false; media?.revert(); };
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative py-24 lg:py-40 px-6 bg-brand-dark overflow-hidden"
    >
      {children}
    </section>
  );
}
