"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type gsap from "gsap";

type CollapseProps = {
  open: boolean;
  children: ReactNode;
  id?: string;
  labelledBy?: string;
  className?: string;
  duration?: number;
};

export function Collapse({
  open,
  children,
  id,
  labelledBy,
  className,
  duration = 0.4,
}: CollapseProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    let active = true;
    let tween: gsap.core.Tween | undefined;
    void import("gsap").then(({ default: gsap }) => {
      if (!active) return;
      gsap.killTweensOf(element);
      const currentHeight = element.getBoundingClientRect().height;
      const currentOpacity = Number.parseFloat(getComputedStyle(element).opacity);
      tween = gsap.fromTo(
        element,
        { height: currentHeight, opacity: Number.isFinite(currentOpacity) ? currentOpacity : 0 },
        {
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
          duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? 0
            : duration,
          ease: "sine.inOut",
          overwrite: true,
        },
      );

    });
    return () => { active = false; tween?.kill(); };

  }, [open, duration]);

  return (
    <div
      ref={rootRef}
      id={id}
      className={className}
      role={labelledBy ? "region" : undefined}
      aria-labelledby={labelledBy}
      aria-hidden={!open}
      inert={!open}
      style={{ height: 0, opacity: 0, overflow: "hidden" }}
    >
      {children}
    </div>
  );
}
