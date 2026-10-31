"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

export function StatsMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let active = true;
    let media: ReturnType<typeof gsap.matchMedia> | undefined;

    // ScrollTrigger must initialize after hydration because it measures the page.
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      if (!active) return;

      gsap.registerPlugin(ScrollTrigger);
      media = gsap.matchMedia();
      media.add(
        {
          fullMotion: "(prefers-reduced-motion: no-preference)",
          reducedMotion: "(prefers-reduced-motion: reduce)",
        },
        (match) => {
          const context = gsap.context(() => {
            const counters = root.querySelectorAll<HTMLElement>(
              ".counter[data-target]",
            );
            const ring = root.querySelector("#satisfaction-path");

            if (match.conditions?.reducedMotion) {
              counters.forEach((counter) => {
                gsap.set(counter, {
                  innerText: Number(counter.dataset.target),
                });
              });
              if (ring) gsap.set(ring, { strokeDashoffset: 1 });
              return;
            }

            const floats: [string, number, number, number][] = [
              ["#blob-1", 50, 30, 8],
              ["#blob-2", -40, -50, 10],
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

            counters.forEach((counter) => {
              gsap.fromTo(
                counter,
                { innerText: 0 },
                {
                  innerText: Number(counter.dataset.target),
                  duration: 2,
                  snap: { innerText: 1 },
                  scrollTrigger: {
                    trigger: counter,
                    start: "top 85%",
                    once: true,
                  },
                },
              );
            });

            if (ring) {
              gsap.fromTo(
                ring,
                { strokeDashoffset: 100 },
                {
                  strokeDashoffset: 1,
                  duration: 2,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: root.querySelector(".satisfaction-circle"),
                    start: "top 80%",
                    once: true,
                  },
                },
              );
            }
          }, root);

          return () => context.revert();
        },
      );

      document.fonts.ready.then(() => {
        if (active) ScrollTrigger.refresh();
      });
    });

    return () => {
      active = false;
      media?.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="stats-satisfaction"
      className="pd_reveal relative bg-brand-dark py-24 lg:py-40 px-6 overflow-hidden"
    >
      {children}
    </section>
  );
}
