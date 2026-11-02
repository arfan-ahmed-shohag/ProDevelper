import Skeleton from "@/components/Skeleton";

const skeletonLineCounts = [4, 5, 7, 6, 2, 4, 4, 5, 2];

export function FeedbackCardSkeleton({ lines = 5 }: { lines?: number }) {
  return (
    <div
      aria-hidden="true"
      className="feedback-item break-inside-avoid relative bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgb(var(--rgb-black)/0.05)] mb-8"
    >
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="size-12 shrink-0 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full max-w-32" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      </div>
      <Skeleton className="h-6 w-24 mb-5" />
      <div className="space-y-2">
        {Array.from({ length: lines }, (_, line) => (
          <Skeleton
            key={line}
            className={`h-4 ${line === lines - 1 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function FeedbackSkeleton({ count = 9 }: { count?: number } = {}) {
  return (
    <div
      id="feedback-grid"
      role="status"
      aria-label="Loading client feedback"
      aria-busy="true"
      className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
    >
      {Array.from({ length: count }, (_, index) => (
        <FeedbackCardSkeleton
          key={index}
          lines={skeletonLineCounts[index % skeletonLineCounts.length]}
        />
      ))}
    </div>
  );
}

export function FeedbackSummarySkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading feedback rating"
      aria-busy="true"
      className="hidden lg:flex items-center gap-6 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm"
    >
      <div className="flex -space-x-3">
        <Skeleton className="size-12 rounded-full border-4 border-white" />
        <Skeleton className="size-12 rounded-full border-4 border-white" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-2.5 w-16" />
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-2 w-40" />
      </div>
    </div>
  );
}
