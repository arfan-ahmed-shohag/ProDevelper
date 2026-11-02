import type { ReactNode } from "react";

export type LegalDocumentSection = {
  title: string;
  content: ReactNode;
  details?: readonly ReactNode[];
};

type LegalDocumentContentProps = {
  eyebrow: string;
  title: string;
  outline: string;
  introduction: ReactNode;
  introductionClassName?: string;
  sections: readonly LegalDocumentSection[];
};

export function LegalDocumentContent({
  eyebrow,
  title,
  outline,
  introduction,
  introductionClassName = "text-lg",
  sections,
}: LegalDocumentContentProps) {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(var(--rgb-brand-dark)) 1.5px, transparent 1.5px), linear-gradient(90deg, rgb(var(--rgb-brand-dark)) 1.5px, transparent 1.5px)",
          backgroundSize: "50px 50px",
        }}
      />
      <div className="pointer-events-none absolute right-0 top-0 h-150 w-150 rounded-full bg-brand-green/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.5em] text-brand-green">
          {eyebrow}
        </span>
        <h2 className="mb-10 text-5xl font-black tracking-tighter text-slate-900 md:mb-14 md:text-6xl">
          {title}{" "}
          <span
            className="text-transparent"
            style={{
              WebkitTextStroke: "1.5px rgb(var(--rgb-brand-green))",
              fontFamily: "var(--font-outline)",
            }}
          >
            {outline}
          </span>
        </h2>

        <div className="space-y-10 text-base font-medium leading-relaxed text-slate-600 md:space-y-12">
          <section>
            <p className={introductionClassName}>{introduction}</p>
          </section>

          {sections.map((section, index) => (
            <section
              key={section.title}
              className={index === sections.length - 1 ? "border-t border-slate-100 pt-8" : ""}
            >
              <h3 className="mb-4 flex items-center gap-3 text-xl font-bold text-slate-900 md:text-2xl">
                <span aria-hidden="true" className="h-0.5 w-8 shrink-0 bg-brand-green" />
                {section.title}
              </h3>
              <p>{section.content}</p>
              {section.details && (
                <ul className="ml-6 mt-4 list-disc space-y-3 marker:text-brand-green">
                  {section.details.map((detail, detailIndex) => (
                    <li key={detailIndex}>{detail}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
