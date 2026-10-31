"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function SelectedWorksGrid({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cleanups: (() => void)[] = [];

    root.querySelectorAll<HTMLElement>(".portfolio-item").forEach((card) => {
      const image = card.querySelector<HTMLImageElement>(".scroll-img");
      const box = card.querySelector<HTMLElement>(".image-box");
      if (!image || !box) return;

      let timer: ReturnType<typeof setTimeout> | undefined;

      const start = () => {
        clearTimeout(timer);
        const distance = image.offsetHeight - box.offsetHeight;
        if (distance > 0) {
          image.style.transform = `translateY(-${distance}px)`;
        }
      };

      const reset = () => {
        clearTimeout(timer);
        image.style.transform = "translateY(0px)";
      };

      const touchEnd = () => {
        clearTimeout(timer);
        timer = setTimeout(reset, 2000);
      };

      card.addEventListener("mouseenter", start);
      card.addEventListener("mouseleave", reset);
      card.addEventListener("touchstart", start, { passive: true });
      card.addEventListener("touchend", touchEnd, { passive: true });
      card.addEventListener("touchcancel", reset, { passive: true });

      cleanups.push(() => {
        clearTimeout(timer);
        card.removeEventListener("mouseenter", start);
        card.removeEventListener("mouseleave", reset);
        card.removeEventListener("touchstart", start);
        card.removeEventListener("touchend", touchEnd);
        card.removeEventListener("touchcancel", reset);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 md:gap-y-32"
    >
      {children}
    </div>
  );
}
