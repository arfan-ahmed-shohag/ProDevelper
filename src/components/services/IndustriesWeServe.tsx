import Link from "next/link";
import { Icon } from "@/components/icon";

const industries = [
  { label: "E-commerce", icon: "shopping-cart" },
  { label: "Real Estate", icon: "building" },
  { label: "Software", icon: "code" },
  { label: "Health", icon: "heart" },
  { label: "Food & Drink", icon: "coffee" },
  { label: "Music", icon: "music" },
  { label: "Medical", icon: "user" },
  { label: "Pharma", icon: "flask" },
  { label: "Automotive", icon: "repeat" },
  { label: "Education", icon: "graduation-cap" },
  { label: "Travel", icon: "globe" },
  { label: "Entertainment", icon: "film" },
  { label: "Retail", icon: "store" },
  { label: "Business", icon: "briefcase" },
  { label: "Photo & Video", icon: "camera" },
  { label: "Startup", icon: "bolt" },
  { label: "Furniture", icon: "chair" },
  { label: "Finance", icon: "dollar-sign" },
] as const;

function demoFilterHref(label: string) {
  const query = new URLSearchParams({ filters: `industry-type:${label}` });
  return `/demo-showcase/?${query.toString()}`;
}

export default function IndustriesWeServe() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-dark px-6 py-20 text-white md:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(var(--rgb-white)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--rgb-white)) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(91,160,112,0.16),transparent_68%)]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <header className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-light/20 bg-brand-light/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-light">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-light" />
            Global Expertise
          </span>
          <h2 className="text-5xl font-black leading-[0.95] tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
            Industries{" "}
            <span
              className="text-transparent"
              style={{
                WebkitTextStroke: "1.5px rgb(var(--rgb-brand-light))",
                fontFamily: "var(--font-outline)",
              }}
            >
              We Serve.
            </span>
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            Empowering businesses across diverse sectors with specialized digital
            solutions and strategic innovation.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-6">
          {industries.map((industry) => (
            <Link
              key={industry.label}
              href={demoFilterHref(industry.label)}
              prefetch={false}
              className="group flex min-h-36 flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.045] px-3 py-6 text-center transition duration-300 hover:-translate-y-2 hover:border-brand-light hover:bg-brand-light hover:shadow-[0_20px_55px_rgba(0,0,0,0.18)] focus-visible:border-brand-light focus-visible:bg-brand-light md:min-h-40"
            >
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-brand-light transition duration-300 group-hover:rotate-12 group-hover:bg-white group-hover:text-brand-dark group-focus-visible:rotate-12 group-focus-visible:bg-white group-focus-visible:text-brand-dark">
                <Icon name={industry.icon} className="h-6 w-6" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.08em] text-white sm:text-xs">
                {industry.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
