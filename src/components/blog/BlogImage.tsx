"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/icon";

export default function BlogImage({ image, alt, sizes, className = "", natural = false, width, height }: {
  image: string | null;
  alt: string;
  sizes: string;
  className?: string;
  natural?: boolean;
  width?: number;
  height?: number;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  if (!image || failed === image) {
    return <div aria-hidden="true" style={natural && width && height ? { aspectRatio: `${width}/${height}` } : undefined}
      className={`flex w-full items-center justify-center bg-linear-to-br from-brand-dark to-brand-green/70 text-white/40 ${natural ? "min-h-32" : "h-full"} ${className}`}>
      <Icon name="code" className="h-14 w-14" />
    </div>;
  }
  if (natural) {
    if (width && height) return <Image src={image} alt={alt} width={width} height={height} sizes={sizes}
      className={`h-auto w-full ${className}`} onError={() => setFailed(image)} />;
    // Keep the reference's natural layout if WordPress cannot provide dimensions.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={alt} loading="lazy" decoding="async" className={`h-auto w-full ${className}`} onError={() => setFailed(image)} />;
  }
  return <Image src={image} alt={alt} fill sizes={sizes}
    className={`object-cover ${className}`} onError={() => setFailed(image)} />;
}
