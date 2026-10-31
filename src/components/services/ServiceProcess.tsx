import Image from "next/image";
import {
  serviceDetailLayout,
  type ServiceProcessStep,
} from "@/lib/service-details";

export default function ServiceProcess({
  steps,
}: {
  steps: readonly ServiceProcessStep[];
}) {
  const content = serviceDetailLayout.process;

  return (
    <section
      id="process"
      className="relative py-24 lg:py-40 px-6 overflow-hidden bg-white"
    >
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(var(--rgb-brand-dark)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--rgb-brand-dark)) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute top-0 right-0 w-150 h-150 bg-brand-green/5 rounded-full blur-[120px]" />
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[30%] h-[40%] bg-brand-dark/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[25%] h-[35%] bg-brand-dark/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-32">
          <span className="text-brand-dark font-bold uppercase tracking-[0.6em] text-[10px] mb-8 block opacity-80">
            {content.badge}
          </span>
          <h2 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85] md:leading-none mb-4">
            {content.title}
            <br />
            <span
              className="text-transparent"
              style={{
                WebkitTextStroke: "1.5px rgb(var(--rgb-brand-green) / 0.7)",
                fontFamily: "var(--font-outline)",
              }}
            >
              {content.outline}
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl text-lg md:text-xl leading-relaxed md:leading-7 font-medium mt-8">
            {content.description}
          </p>
        </div>

        <div className="relative timeline-wrapper">
          <div className="line-glow" />
          <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-linear-to-b from-transparent via-brand-dark to-transparent hidden md:block" />

          {steps.map((step, index) => (
            <div
              key={`${step.number}-${index}`}
              className={`step-container relative flex flex-col md:flex-row items-center justify-between mb-24 md:mb-32 w-full group ${
                step.reverse ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="w-full md:w-[45%] flex items-center justify-center mb-10 md:mb-0">
                <div className="relative z-10 transition-transform duration-700 group-hover:scale-105">
                  <Image
                    src={step.image.src}
                    alt={step.image.alt}
                    width={step.image.width}
                    height={step.image.height}
                    style={{
                      aspectRatio: `${step.image.width} / ${step.image.height}`,
                    }}
                    sizes="(max-width: 768px) 100vw, 500px"
                    loading="lazy"
                    className="w-full h-auto md:w-[500px] md:h-auto object-contain drop-shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-brand-green/10 blur-[60px] -z-10 rounded-full" />
                </div>
              </div>

              <div className="central-dot absolute left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-brand-surface rounded-full z-20 flex items-center justify-center shadow-lg transition-all duration-500 group-hover:border-brand-green group-hover:scale-110 hidden md:flex">
                <span className="text-brand-dark font-black text-lg">
                  {step.number}
                </span>
              </div>

              <div
                className={`w-full md:w-[45%] text-center md:text-left ${
                  step.reverse ? "md:pr-16" : "md:pl-16"
                }`}
              >
                <div className="step-card bg-white border border-slate-100 p-8 md:p-12 rounded-[2.5rem] shadow-[0_10px_40px_-10px_rgb(var(--rgb-black)/0.05)] transition-all duration-500 hover:shadow-2xl hover:border-brand-green/30 hover:-translate-y-2">
                  <span className="md:hidden inline-block text-brand-green font-black text-2xl mb-4">
                    {step.number}.
                  </span>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 group-hover:text-brand-green transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-base md:text-lg leading-relaxed md:leading-7 font-medium">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
