"use client";

import Link from "next/link";

export default function BlogError({ reset }: { reset: () => void }) {
  return <section className="bg-white px-6 pb-24 pt-40 text-center">
    <h1 className="mb-4 text-3xl font-black text-slate-900">This article is temporarily unavailable</h1>
    <p className="mb-8 text-slate-500">Please try again in a moment.</p>
    <div className="flex flex-wrap items-center justify-center gap-5">
      <button type="button" onClick={reset} className="rounded-xl bg-brand-dark px-6 py-3 font-bold text-white">Try again</button>
      <Link href="/blog/" className="font-bold text-brand-green">Back to all articles</Link>
    </div>
  </section>;
}
