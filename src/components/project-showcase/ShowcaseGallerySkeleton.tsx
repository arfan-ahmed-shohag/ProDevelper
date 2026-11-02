export function ShowcaseCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] rounded-[2.5rem] bg-slate-100" />
      <div className="mt-10 space-y-4 px-4">
        <div className="h-9 rounded-lg bg-slate-100" />
        <div className="flex gap-2">
          <div className="h-7 w-24 rounded-lg bg-slate-100" />
          <div className="h-7 w-20 rounded-lg bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default function ShowcaseGallerySkeleton() {
  return (
    <section className="relative w-full bg-white px-4 py-16 md:py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-32 flex flex-col items-center text-center">
          <div className="mb-8 h-3 w-24 animate-pulse rounded bg-slate-100" />
          <div className="h-36 w-full max-w-lg animate-pulse rounded-2xl bg-slate-100" />
          <div className="mt-8 h-6 w-full max-w-2xl animate-pulse rounded-lg bg-slate-100" />
        </div>

        <div className="flex flex-col gap-12 lg:flex-row">
          <aside className="hidden w-full lg:block lg:w-1/4">
            <div className="space-y-5 rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50">
              <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-14 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-14 animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-14 animate-pulse rounded-2xl bg-slate-100" />
            </div>
          </aside>
          <div className="w-full min-w-0 lg:w-3/4">
            <div className="mb-12 flex justify-end border-b border-slate-100 pb-6">
              <div className="h-12 w-52 animate-pulse rounded-2xl bg-slate-100" />
            </div>
            <div className="grid min-h-[500px] grid-cols-1 gap-8 md:grid-cols-2">
              {Array.from({ length: 10 }, (_, index) => (
                <ShowcaseCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
