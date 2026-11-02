import Skeleton from "@/components/Skeleton";

export default function SelectedWorksSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading selected works"
      aria-busy="true"
      className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 md:gap-y-32"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} aria-hidden="true" className="flex flex-col">
          <div className="relative aspect-4/5 overflow-hidden rounded-[2.5rem] bg-white/5 p-4 shadow-2xl border border-white/10">
            <Skeleton tone="dark" className="w-full h-full rounded-[1.8rem]" />
          </div>
          <div className="mt-10 space-y-4 px-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton tone="dark" className="h-8 w-full" />
                <Skeleton tone="dark" className="h-8 w-2/3" />
              </div>
              <Skeleton tone="dark" className="size-12 shrink-0 rounded-full" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton tone="dark" className="h-7 w-20" />
              <Skeleton tone="dark" className="h-7 w-24" />
              <Skeleton tone="dark" className="h-7 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
