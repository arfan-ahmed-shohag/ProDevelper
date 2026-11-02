import Skeleton from "./Skeleton";

export function ServiceGridSkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden rounded-4xl border border-brand-dark bg-slate-50 p-10 shadow-xs"
    >
      <Skeleton className="absolute top-8 right-10 h-15 w-16" />
      <div className="relative z-10">
        <div className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-white shadow-md">
          <Skeleton className="size-8" />
        </div>
        <div className="mb-4 h-16 space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="mb-10 flex h-26 flex-col justify-between py-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex h-5 items-center gap-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-0.5 w-8" />
        </div>
      </div>
    </div>
  );
}

export default function ServiceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      id="service-grid"
      role="status"
      aria-label="Loading services"
      aria-busy="true"
      className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }, (_, index) => (
        <ServiceGridSkeletonCard key={index} />
      ))}
    </div>
  );
}
