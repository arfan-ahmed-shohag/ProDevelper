"use client";

import Image from "next/image";
import { useState } from "react";

function normalizeSource(source: string) {
  const trimmed = source.trim();
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return trimmed.replace(/^http:\/\//i, "https://");
}

export function ShowcaseCardImage({
  sources,
  alt,
  width,
  height,
}: {
  sources: (string | null | undefined)[];
  alt: string;
  width: number;
  height: number;
}) {
  const normalizedSources = [...new Set(
    sources
      .filter((source): source is string => Boolean(source?.trim()))
      .map(normalizeSource),
  )];
  const sourceKey = normalizedSources.join("|");
  const [failedSource, setFailedSource] = useState({ key: "", index: 0 });
  const sourceIndex = failedSource.key === sourceKey ? failedSource.index : 0;

  const source = normalizedSources[sourceIndex];
  if (!source) return null;

  return (
    <Image
      width={width}
      height={height}
      src={source}
      sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 600px"
      alt={alt}
      className="scroll-img w-full h-auto object-top transition-transform duration-[8s] ease-in-out"
      loading="lazy"
      onError={() => setFailedSource({ key: sourceKey, index: sourceIndex + 1 })}
    />
  );
}
