"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

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

  useLayoutEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const tween = gsap.to(element, {
      height: open ? "auto" : 0,
      opacity: open ? 1 : 0,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : duration,
      ease: "sine.inOut",
      overwrite: true,
    });

    return () => {
      tween.kill();
    };
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
