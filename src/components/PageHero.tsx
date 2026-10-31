import type { ReactNode } from "react";

export type PageHeroStat = {
  value: string | number;
  label: string;
};

export type PageHeroProps = {
  badge: string;
  title: ReactNode;
  highlight?: ReactNode;
  titleSuffix?: ReactNode;
  subtitle?: ReactNode;
  outline: ReactNode;
  description: ReactNode;
  stats?: readonly PageHeroStat[];
  statsVariant?: "metrics" | "features";
  badgePulse?: boolean;
  className?: string;
};

export default function PageHero({
  badge,
  title,
  highlight,
  titleSuffix,
  subtitle,
  outline,
  description,
  stats = [],
  statsVariant = "metrics",
  badgePulse = false,
  className = "",
}: PageHeroProps) {
  return (
    <section
      className={`pd_reveal hero-bg relative min-h-[50vh] lg:min-h-[60vh] flex items-center overflow-hidden pt-28 pb-16 ${className}`}
    >
      <div className="absolute top-0 right-0 w-125 h-125 bg-brand-light/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-75 h-75 bg-brand-light/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-10 lg:py-16 w-full text-center">
        <div className="inline-flex items-center gap-2 bg-brand-light/10 px-4 py-2 rounded-full border border-brand-light/20 mb-8">
          <span
            className={`w-1.5 h-1.5 bg-brand-light rounded-full${badgePulse ? " animate-pulse" : ""}`}
          />
          <span className="text-[10px] font-bold text-brand-light uppercase tracking-[0.2em]">
            {badge}
          </span>
        </div>

        <h1 className="text-5xl lg:text-7xl 2xl:text-8xl font-black text-white leading-[0.9] lg:leading-none tracking-tighter mb-8">
          {title}
          {highlight && (
            <>
              {" "}
              <span className="text-brand-light">{highlight}</span>
            </>
          )}
          {titleSuffix}
          <br />
          {subtitle && <>{subtitle} </>}
          <span
            className="text-transparent"
            style={{
              WebkitTextStroke: "1.5px rgb(var(--rgb-white))",
              fontFamily: "var(--font-outline)",
            }}
          >
            {outline}
          </span>
        </h1>

        <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed md:leading-7 mb-12">
          {description}
        </p>

        {stats.length > 0 && (
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-4 mx-auto border-t border-white/10 pt-10 ${
              statsVariant === "features"
                ? "max-w-5xl"
                : "md:gap-0 max-w-4xl"
            }`}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center md:border-r border-white/5 last:border-0"
              >
                <h4 className="text-3xl font-black text-brand-light">
                  {stat.value}
                </h4>
                <p
                  className={`text-[9px] font-bold uppercase tracking-widest ${
                    statsVariant === "features" ? "text-white/60" : "text-white/40"
                  }`}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
