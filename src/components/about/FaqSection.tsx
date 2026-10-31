import type { CSSProperties } from "react";
import { Accordion, type AccordionItem } from "@/components/Accordion";

const faqItems = [
  {
    "id": "about-faq-1",
    "question": "What services do you offer?",
    "answer": "We offer a variety of services including website design, development, WordPress customization, SEO, advanced security, speed optimization, and ongoing website maintenance."
  },
  {
    "id": "about-faq-2",
    "question": "What industries do you specialize in?",
    "answer": "We work with a variety of industries, including E-commerce, Real Estate, Retail, Business, Education, Finance, Travel, and Logistics."
  },
  {
    "id": "about-faq-3",
    "question": "What industries do you specialize in?",
    "answer": "We work with a variety of industries, including E-commerce, Real Estate, Retail, Business, Education, Finance, Travel, and Logistics."
  },
  {
    "id": "about-faq-4",
    "question": "What industries do you specialize in?",
    "answer": "We work with a variety of industries, including E-commerce, Real Estate, Retail, Business, Education, Finance, Travel, and Logistics."
  },
  {
    "id": "about-faq-5",
    "question": "Is my website secure?",
    "answer": "Yes, we implement advanced security protocols, including SSL integration, brute-force protection, and regular security updates."
  },
  {
    "id": "about-faq-6",
    "question": "How long will my project take?",
    "answer": "Timeline depends on project scope. A basic site might take 5-7 days, while a complex e-commerce site can take 2-4 weeks."
  },
  {
    "id": "about-faq-7",
    "question": "How long will my project take?",
    "answer": "Timeline depends on project scope. A basic site might take 5-7 days, while a complex e-commerce site can take 2-4 weeks."
  },
  {
    "id": "about-faq-8",
    "question": "How long will my project take?",
    "answer": "Timeline depends on project scope. A basic site might take 5-7 days, while a complex e-commerce site can take 2-4 weeks."
  }
] satisfies readonly AccordionItem[];

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="pd_reveal relative py-24 lg:py-40 px-6 overflow-hidden bg-white"
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={
            {
              backgroundImage:
                "linear-gradient(rgb(var(--rgb-brand-dark)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--rgb-brand-dark)) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            } as CSSProperties
          }
        ></div>

        <div className="absolute top-0 right-0 w-125 h-125 bg-brand-green/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-12">
          <div className="max-w-2xl text-left">
            <span className="text-brand-green font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">
              {"Support Centre"}
            </span>

            <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85] md:leading-none">
              {" Frequently "}
              <br />

              <span
                className="text-transparent"
                style={
                  {
                    WebkitTextStroke: "1.5px rgb(var(--rgb-brand-dark))",
                    fontFamily: "var(--font-outline)",
                  } as CSSProperties
                }
              >
                {"Asked Qs."}
              </span>
            </h2>

            <p className="mt-8 text-slate-500 max-w-lg font-medium leading-relaxed italic">
              {
                '"Everything you need to know about our process, performance, and partnership."'
              }
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-6 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-brand-dark flex items-center justify-center text-brand-green">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>

            <div>
              <p className="text-slate-900 font-black text-sm leading-none tracking-tight">
                {"Active Support"}
              </p>

              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">
                {"Ready to help you"}
              </p>
            </div>
          </div>
        </div>

        <Accordion items={faqItems} columns={2} />

        <div className="mt-32 text-center relative z-10">
          <div className="inline-block group cursor-pointer">
            <h4 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 transition-all duration-500 group-hover:-translate-y-2 leading-none">
              {" Still have "}
              <span
                className="text-transparent"
                style={
                  {
                    WebkitTextStroke: "1.5px rgb(var(--rgb-brand-green))",
                    fontFamily: "var(--font-outline)",
                  } as CSSProperties
                }
              >
                {"Questions?"}
              </span>
            </h4>

            <div className="relative h-1.5 w-20 bg-brand-green mx-auto transition-all duration-500 group-hover:w-full rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
