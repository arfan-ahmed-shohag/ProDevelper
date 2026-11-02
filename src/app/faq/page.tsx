import type { CSSProperties } from "react";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Accordion } from "@/components/Accordion";
import { faqItems } from "@/data/faqs";

export const metadata: Metadata = {
  title: { absolute: "FAQ | Prodeveloper_2" },
  description:
    "Answers about web development services, design, migrations, security, and project support.",
  alternates: { canonical: "/faq/" },
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        variant="showcase"
        badge="Knowledge Base"
        badgePulse
        title="Clarity in Logic,"
        outline="Transparency in Delivery."
        description="Get detailed insights into my development workflow, security protocols, and commitment to project excellence. I believe in clear communication as the foundation of every successful partnership."
        stats={[
          { value: "7+", label: "Years Experience" },
          { value: "Global", label: "Client Base" },
          { value: "100%", label: "Satisfaction" },
          { value: "24/7", label: "Support" },
        ]}
      />

      <section className="relative overflow-hidden bg-slate-50/50 px-6 pt-12 pb-10 sm:px-8 lg:pt-24 lg:pb-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
          style={
            {
              backgroundImage:
                "linear-gradient(rgb(var(--rgb-brand-dark)) 1.5px, transparent 1.5px), linear-gradient(90deg, rgb(var(--rgb-brand-dark)) 1.5px, transparent 1.5px)",
              backgroundSize: "50px 50px",
            } as CSSProperties
          }
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          <Accordion
            items={faqItems}
            columns={2}
            defaultOpenId={null}
            variant="faq"
          />
        </div>
      </section>
    </>
  );
}
