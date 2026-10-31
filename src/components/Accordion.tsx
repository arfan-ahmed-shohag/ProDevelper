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
};

export function Accordion({
  items,
  columns = 1,
  defaultOpenId = null,
}: AccordionProps) {
  const accordionId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId);
  const middle = Math.ceil(items.length / 2);
  const groups =
    columns === 2 ? [items.slice(0, middle), items.slice(middle)] : [items];

  return (
    <div
      data-accordion=""
      className={columns === 2 ? "grid lg:grid-cols-2 gap-8" : "grid gap-8"}
    >
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-6">
          {group.map((item) => {
            const open = openId === item.id;
            const triggerId = `${accordionId}-${item.id}-trigger`;
            const answerId = `${accordionId}-${item.id}-answer`;

            return (
              <div
                key={item.id}
                data-accordion-item={item.id}
                data-state={open ? "open" : "closed"}
                className={`group h-fit overflow-hidden rounded-[2.5rem] border bg-white transition-all duration-500 hover:border-brand-green/30 ${
                  open
                    ? "border-brand-green shadow-[0_20px_40px_-15px_rgb(var(--rgb-black)/0.05)]"
                    : "border-slate-100 shadow-[0_15px_40px_-15px_rgb(var(--rgb-black)/0.05)]"
                }`}
              >
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={answerId}
                  onClick={() =>
                    setOpenId((current) => (current === item.id ? null : item.id))
                  }
                  className="p-8 flex justify-between items-center gap-3.75 cursor-pointer w-full text-left"
                >
                  <span className="min-w-0 font-black text-slate-900 text-lg leading-tight group-hover:text-brand-green transition-colors">
                    {item.question}
                  </span>

                  <span
                    className={`w-10 h-10 shrink-0 rounded-2xl border border-slate-100 flex items-center justify-center transition-all duration-500 ${
                      open
                        ? "bg-brand-green text-white rotate-180"
                        : "bg-slate-50 text-slate-400 group-hover:bg-brand-dark group-hover:text-brand-green"
                    }`}
                  >
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
                  </span>
                </button>

                <Collapse
                  open={open}
                  id={answerId}
                  labelledBy={triggerId}
                  duration={0.5}
                >
                  <div className="pb-5">
                    <div className="px-8 pb-8 text-slate-500 text-sm leading-relaxed font-medium">
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
