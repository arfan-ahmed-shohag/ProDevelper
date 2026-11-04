import Skeleton from "@/components/Skeleton";

export default function BlogArticleSkeleton({ error, onRetry }: { error?: string; onRetry?: () => void }) {
  return (
    <div id="primary" className="site-main custom-blog-container">
      <section aria-label={error ? "Article unavailable" : "Loading article"} role={error ? "alert" : "status"}
        aria-busy={!error || undefined}
        className="hero-bg relative flex min-h-[50vh] items-center overflow-hidden pb-16 pt-28 lg:min-h-[60vh]">
        <div className="mx-auto w-full max-w-7xl px-6 text-center lg:px-16">
          <Skeleton tone="dark" className="mx-auto mb-8 h-8 w-44 rounded-full" />
          <div className="mx-auto mb-8 max-w-5xl space-y-3">
            <Skeleton tone="dark" className="mx-auto h-12 w-full max-w-4xl lg:h-20" />
            <Skeleton tone="dark" className="mx-auto h-12 w-4/5 lg:h-20" />
            <Skeleton tone="dark" className="mx-auto h-12 w-2/3 lg:h-20" />
          </div>
          <div className="flex items-center justify-center gap-4">
            <Skeleton tone="dark" className="size-12 rounded-full" />
            <div className="space-y-2 text-left">
              <Skeleton tone="dark" className="h-4 w-28" />
              <Skeleton tone="dark" className="h-3 w-44" />
            </div>
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden bg-white py-12 lg:py-24">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {error && <div className="mx-auto mb-8 max-w-4xl rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center text-sm text-amber-900">
            <p>{error}</p>
            {onRetry && <button type="button" onClick={onRetry} className="mt-3 font-bold underline">Try again</button>}
          </div>}
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
            <div className="min-w-0 lg:w-2/3">
              <article>
                <div className="mb-12 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-2 shadow-2xl shadow-slate-200/50">
                  <Skeleton className="aspect-[16/10] w-full rounded-4xl" />
                </div>
                <div className="space-y-6 pb-12">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-11/12" />
                  <Skeleton className="mx-auto h-56 w-4/5 rounded-2xl" />
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-10/12" />
                  <Skeleton className="mx-auto h-56 w-4/5 rounded-2xl" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="mx-auto h-56 w-4/5 rounded-2xl" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </article>
              <div className="grid grid-cols-1 gap-8 border-t border-slate-100 pt-10 md:grid-cols-2">
                <Skeleton className="h-28 rounded-3xl" />
                <Skeleton className="h-28 rounded-3xl" />
              </div>
            </div>
            <aside aria-label="Loading blog sidebar" className="h-fit min-w-0 space-y-8 lg:sticky lg:top-28 lg:mt-28 lg:w-1/3">
              <div className="space-y-8 rounded-4xl border border-slate-100 bg-white p-8 shadow-[0_15px_40px_rgb(var(--rgb-black)/0.03)]">
                <div className="space-y-5">
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-14 w-full rounded-2xl" />
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 4 }, (_, index) => <div key={index} className="flex items-center gap-4 p-2">
                    <Skeleton className="size-14 shrink-0 rounded-xl" />
                    <div className="flex-1 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-20" /></div>
                  </div>)}
                </div>
                <hr className="border-slate-50" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-28" />
                  {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-14 w-full rounded-2xl" />)}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
