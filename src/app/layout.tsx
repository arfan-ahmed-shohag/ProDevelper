import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/Header";
import SiteFooter from "@/components/Footer";
import branding from "../data/branding.json";
import BrowserCache from "@/components/BrowserCache";

const jakarta = localFont({
  src: [
    { path: "../../public/fonts/jakarta-0.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/jakarta-1.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/jakarta-2.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/jakarta-3.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/jakarta-4.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-jakarta",
  display: "swap",
  preload: false,
});

const inter = localFont({
  src: [
    { path: "../../public/fonts/inter-0.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/inter-1.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/inter-2.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/inter-3.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/inter-4.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Prodeveloper2 | Nizam Uddin",
    template: "%s | Prodeveloper2",
  },
  description:
    "Nizam Uddin builds high-performance websites and scalable web applications for modern businesses.",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: branding.icon32, sizes: "32x32", type: "image/png" },
      { url: branding.icon192, sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: branding.appleIcon, sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <BrowserCache />
      </body>
    </html>
  );
}
