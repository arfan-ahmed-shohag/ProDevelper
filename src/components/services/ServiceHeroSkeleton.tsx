import Skeleton from "@/components/Skeleton";
import { serviceDetailLayout } from "@/lib/service-details";

export default function ServiceHeroSkeleton() {
  return (
    <section
      role="status"
      aria-label="Loading service details"
      aria-busy="true"
      className="hero-bg relative min-h-[50vh] lg:min-h-[60vh] flex items-center overflow-hidden pt-28 pb-16"
    >
      <div className="absolute top-0 right-0 w-125 h-125 bg-brand-light/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-75 h-75 bg-brand-light/5 rounded-full blur-[100px] -z-10" />
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-10 lg:py-16 w-full text-center">
        <div className="inline-flex items-center gap-2 bg-brand-light/10 px-4 py-2 rounded-full border border-brand-light/20 mb-8">
          <span className="w-1.5 h-1.5 bg-brand-light rounded-full" />
          <span className="text-[10px] font-bold text-brand-light uppercase tracking-[0.2em]">
            {serviceDetailLayout.hero.badge}
          </span>
        </div>
        <div className="min-h-[1.2em] lg:min-h-[1.8em] flex items-center justify-center mb-8">
          <Skeleton tone="dark" className="h-24 lg:h-18 2xl:h-24 w-full max-w-5xl" />
        </div>
        <div className="max-w-2xl mx-auto mb-12 space-y-3">
          <Skeleton tone="dark" className="h-5 w-full" />
          <Skeleton tone="dark" className="h-5 w-5/6 mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 max-w-4xl mx-auto border-t border-white/10 pt-10">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="md:border-r border-white/5 last:border-0 px-4">
              <Skeleton tone="dark" className="h-9 w-24 mx-auto" />
              <Skeleton tone="dark" className="h-2.5 w-full max-w-36 mx-auto mt-1" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
