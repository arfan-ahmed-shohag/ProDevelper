import type { SVGProps } from "react";

const paths: Record<string, string> = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  "message-square":
    "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  "arrow-right": "M4 12h16m-6-6 6 6-6 6",
  "arrow-up-right": "M7 17 17 7M7 7h10v10",
  "chevron-down": "m6 9 6 6 6-6",
  "chevron-right": "m9 6 6 6-6 6",
  "chevron-left": "m15 6-6 6 6 6",
  "chevron-up": "m6 15 6-6 6 6",
  check: "m5 12 4 4L19 6",
  "check-circle": "m8 12 3 3 5-6 M21 12a9 9 0 1 1-5-8",
  "shield-alt": "M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6Z m-4 9 3 3 5-6",
  bolt: "m13 2-9 12h7l-1 8 10-12h-7Z",
  code: "m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18",
  search: "M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  times: "m6 6 12 12M6 18 18 6",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  bars: "M4 6h16M4 12h16M4 18h16",
  home: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
  envelope: "M3 5h18v14H3Zm0 0 9 8 9-8",
  phone: "M7 3H4C1 12 12 23 21 20v-4l-5-2-2 3-7-7 3-2Z",
  star: "m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z",
  "quote-left": "M9 5H3v7h5v7M21 5h-6v7h5v7",
  calendar: "M4 5h16v16H4ZM8 3v4m8-4v4M4 10h16",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 7v5l3 2",
  globe:
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18",
  briefcase: "M3 7h18v14H3ZM8 7V3h8v4M3 12l9 3 9-3",
  "external-link-alt": "M14 3h7v7m-11 4L21 3M10 3H3v18h18v-7",
  filter: "M3 4h18l-7 8v7l-4 2v-9Z",
  "shopping-cart": "M2 3h2l2.2 11h11.5l2-8H5M8 20h.01M17 20h.01M7 14l-1 3h12",
  building: "M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 7h2m2 0h2m-6 4h2m2 0h2m-6 4h2m2 0h2m-4 6v-4h2v4",
  heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z",
  coffee: "M4 8h14v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8Zm14 2h1a2 2 0 1 1 0 4h-1M8 4v2m4-2v2m4-2v2",
  music: "M9 18V5l12-2v13M9 18a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3Zm12-2a3 3 0 1 1-3-3c1.7 0 3 1.3 3 3Z",
  user: "M20 21a8 8 0 0 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  flask: "M9 3h6m-5 0v7l-5.5 8.2A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.8L14 10V3m-7 12h10",
  repeat: "m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3",
  "graduation-cap": "m2 10 10-5 10 5-10 5-10-5Zm4 2.5V17c3.5 2.7 8.5 2.7 12 0v-4.5M22 10v6",
  film: "M4 4h16v16H4zM4 8h16M4 16h16M8 4v4m8-4v4m-8 8v4m8-4v4",
  store: "M3 10h18l-2-7H5l-2 7Zm1 0v11h16V10M9 21v-7h6v7M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0",
  camera: "M14 5h-4L8 8H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-4l-2-3Zm-2 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  chair: "M5 3v8m14-8v8M4 11h16v10M8 21v-5m8 5v-5M4 16h16",
  "dollar-sign": "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3 6H10a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H9m3-11v2m0 10v2",
};

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: string }) {
  const normalized = name.replace(/^fa-/, "");
  const path = paths[normalized] || paths["arrow-up-right"];
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={normalized === "star" ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {normalized === "grid" ? (
        <>
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </>
      ) : (
        <path d={path} />
      )}
    </svg>
  );
}
