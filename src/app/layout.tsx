import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/Header";
import SiteFooter from "@/components/Footer";
import branding from "../data/branding.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
