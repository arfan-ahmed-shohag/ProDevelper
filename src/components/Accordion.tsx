"use client";

import { useId, useState, type ReactNode } from "react";
import { Collapse } from "./Collapse";

export type AccordionItem = {
  id: string;
  question: ReactNode;
  answer: ReactNode;
};

type AccordionProps = {
  items: readonly AccordionItem[];
  columns?: 1 | 2;
  defaultOpenId?: string | null;
  variant?: "default" | "faq";
};

export function Accordion({
  items,
  columns = 1,
  defaultOpenId = null,
  variant = "default",
}: AccordionProps) {
  const accordionId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId);
  const faqStyle = variant === "faq";
  const middle = Math.ceil(items.length / 2);
  const groups =
    columns === 2
      ? [items.slice(0, middle), items.slice(middle)]
      : [items];

  return (
    <div
      data-accordion=""
      className={
        columns === 2
          ? faqStyle
            ? "grid items-start gap-6 md:grid-cols-2 lg:gap-8"
            : "grid lg:grid-cols-2 gap-8"
          : "grid gap-8"
      }
    >
      {groups.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className={
            faqStyle ? "flex flex-col gap-6 lg:gap-8" : "space-y-6"
          }
        >
          {group.map((item) => {
            const open = openId === item.id;
            const triggerId = `${accordionId}-${item.id}-trigger`;
            const answerId = `${accordionId}-${item.id}-answer`;

            return (
              <div
                key={item.id}
                data-accordion-item={item.id}
                data-state={open ? "open" : "closed"}
                className={
                  faqStyle
                    ? `group self-start overflow-hidden rounded-3xl border bg-white transition-all duration-500 hover:border-brand-light/40 hover:shadow-lg hover:shadow-brand-light/5 ${
                        open ? "border-brand-light/40 shadow-lg shadow-brand-light/5" : "border-slate-200/80"
                      }`
                    : `group h-fit overflow-hidden rounded-[2.5rem] border bg-white transition-all duration-500 hover:border-brand-green/30 ${
                        open
                          ? "border-brand-green shadow-[0_20px_40px_-15px_rgb(var(--rgb-black)/0.05)]"
                          : "border-slate-100 shadow-[0_15px_40px_-15px_rgb(var(--rgb-black)/0.05)]"
                      }`
                }
              >
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={answerId}
                  onClick={() =>
                    setOpenId((current) => (current === item.id ? null : item.id))
                  }
                  className={
                    faqStyle
                      ? "flex w-full min-h-[128px] cursor-pointer list-none items-center justify-between p-7 text-left outline-none sm:min-h-[136px] sm:p-8 md:min-h-[144px] lg:min-h-[136px] lg:p-10"
                      : "p-8 flex justify-between items-center gap-3.75 cursor-pointer w-full text-left"
                  }
                >
                  <span
                    className={
                      faqStyle
                        ? "min-w-0 pr-4 text-base font-black leading-snug tracking-tight text-slate-800 transition-colors group-hover:text-brand-light sm:text-lg lg:text-xl"
                        : "min-w-0 font-black text-slate-900 text-lg leading-tight group-hover:text-brand-green transition-colors"
                    }
                  >
                    {item.question}
                  </span>

                  <span
                    className={
                      faqStyle
                        ? "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50 transition-all duration-500 group-hover:border-brand-light/20 group-hover:bg-brand-light/5"
                        : `w-10 h-10 shrink-0 rounded-2xl border border-slate-100 flex items-center justify-center transition-all duration-500 ${
                            open
                              ? "bg-brand-green text-white rotate-180"
                              : "bg-slate-50 text-slate-400 group-hover:bg-brand-dark group-hover:text-brand-green"
                          }`
                    }
                  >
                    {faqStyle ? (
                      <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                        <span
                          className={`absolute h-[2px] w-full rounded-full transition-colors ${
                            open ? "bg-brand-light" : "bg-slate-400 group-hover:bg-brand-light"
                          }`}
                        />
                        <span
                          className={`absolute h-full w-[2px] rounded-full transition-all duration-300 ${
                            open ? "scale-y-0 bg-brand-light" : "bg-slate-400 group-hover:bg-brand-light"
                          }`}
                        />
                      </span>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </span>
                </button>

                <Collapse
                  open={open}
                  id={answerId}
                  labelledBy={triggerId}
                  duration={0.5}
                >
                  <div className={faqStyle ? "px-7 pb-8 sm:px-8 lg:px-10 lg:pb-10" : "pb-5"}>
                    <div
                      className={
                        faqStyle
                          ? "border-t border-slate-100/80 pt-6 text-[15px] font-medium leading-relaxed text-slate-500 lg:text-base"
                          : "px-8 pb-8 text-slate-500 text-sm leading-relaxed font-medium"
                      }
                    >
                      {item.answer}
                    </div>
                  </div>
                </Collapse>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
