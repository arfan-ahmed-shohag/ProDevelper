import Image from "next/image";
import { plainText } from "@/lib/plain-text";
import type { FeedbackResponse } from "@/services/feedback";

const avatarColors = [
  "--rgb-brand-green",
  "--rgb-blue-500",
  "--rgb-amber-500",
  "--rgb-brand-dark",
  "--rgb-red-500",
];

export default function FeedbackCard({
  feedback,
  index,
}: {
  feedback: FeedbackResponse;
  index: number;
}) {
  const name = plainText(feedback.title.rendered);
  const quote = plainText(feedback.content.rendered);
  const avatar = feedback._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const rating = Math.max(0, Math.min(5, Number(feedback.rating) || 0));

  return (
    <div className="feedback-item break-inside-avoid relative bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgb(var(--rgb-black)/0.05)] transition-all duration-500 hover:shadow-2xl hover:border-brand-green/30 group mb-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 shrink-0 rounded-2xl overflow-hidden shadow-sm ring-1 ring-slate-100">
          {avatar ? (
            <Image
              width={100}
              height={100}
              src={avatar}
              sizes="48px"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              alt={name}
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white font-black text-lg"
              style={{ background: `rgb(var(${avatarColors[index % avatarColors.length]}))` }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-black text-slate-900 text-[15px] leading-none mb-1 wrap-break-word">
            {name}
          </h4>
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">
            Global Partner
          </p>
        </div>
      </div>
      {rating > 0 && (
        <div className="flex text-rating text-[16px] gap-0.5 mb-5" aria-label={`${rating} out of 5 stars`}>
          <span aria-hidden="true">
            {"\u2605".repeat(Math.round(rating))}{"\u2606".repeat(5 - Math.round(rating))}
          </span>
        </div>
      )}
      <p className="text-slate-600 text-[15px] leading-relaxed font-medium group-hover:text-slate-900 transition-colors">
        {` "${quote}" `}
      </p>
    </div>
  );
}
