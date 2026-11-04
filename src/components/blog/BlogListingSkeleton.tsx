import Skeleton from "@/components/Skeleton";

export default function BlogListingSkeleton() {
  return <section aria-label="Loading articles" role="status" className="bg-white px-4 py-24">
    <span className="sr-only">Loading articles</span>
    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
      <div className="grid gap-8 md:grid-cols-2 lg:col-span-8">
        {Array.from({ length: 6 }, (_, index) => <div key={index} className="rounded-[2.5rem] border border-slate-100 p-4">
          <Skeleton className="h-60 w-full rounded-[1.8rem]" />
          <div className="space-y-4 p-4"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-3/4" /><Skeleton className="h-16 w-full" /></div>
        </div>)}
      </div>
      <div className="space-y-6 lg:col-span-4"><Skeleton className="h-24 w-full rounded-3xl" /><Skeleton className="h-96 w-full rounded-3xl" /></div>
    </div>
  </section>;
}
