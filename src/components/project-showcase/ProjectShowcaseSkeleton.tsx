export function ProjectCardSkeleton() {
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
