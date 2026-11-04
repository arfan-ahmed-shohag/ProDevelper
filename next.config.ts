import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    staleTimes: {
      dynamic: 30 * 24 * 60 * 60,
      static: 30 * 24 * 60 * 60,
    },
  },
  cacheComponents: true,
  partialPrefetching: true,
  headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      new URL("https://prodeveloper2.com/wp-content/uploads/**"),
    ],
  },
  redirects() {
    return [
      {
        source: "/service/:serviceName",
        destination: "/services/:serviceName",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
