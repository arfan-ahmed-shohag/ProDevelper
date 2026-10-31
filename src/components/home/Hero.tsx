import Link from "next/link";
import { Dashboard } from "./Dashboard";
export default function Hero() {
  return (
    <section className="pd_reveal hero-bg min-h-screen overflow-hidden">
      <div className="relative min-h-screen flex items-center pt-32 pb-20 lg:py-40 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full">
          <div className="z-6">
            <div className="inline-flex items-center gap-2 bg-brand-light/10 px-4 py-1.5 rounded-full border border-brand-light/20 mb-8">
              <span className="w-2 h-2 bg-brand-light rounded-full animate-ping"></span>

              <span className="text-[10px] font-bold text-brand-light uppercase tracking-[0.2em]">
                {"Full-Stack Engineering Master"}
              </span>
            </div>

            <h1 className="text-6xl 2xl:text-8xl font-extrabold leading-[0.95] 2xl:leading-none mb-8 text-white">
              {" Build the "}
              <span className="text-brand-light">{"Future"}</span>

              <br />
              {" of Your Business. "}
            </h1>

            <p className="text-xl text-white 2xl:mb-12 mb-8 max-w-xl leading-relaxed">
              {" I am "}
              <span className="text-brand-light font-bold">
                {"Nizam Uddin"}
              </span>
              {
                ", your partner in building high-performance, scalable web solutions that turn complex ideas into seamless digital experiences. "
              }
            </p>

            <div className="flex flex-wrap md:gap-5 gap-2">
              <Link
                href="/project-showcase/"
                className="custom-bg-green btn-shine shine-white group relative md:px-8 px-4 md:py-4 py-2 text-white md:text-[18px] text-[14px] font-bold rounded-2xl overflow-hidden shadow-xl shadow-slate-900/20 transition-all hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative flex items-center md:gap-3 gap-2 z-10">
                  {" Project Showcase "}
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    ></path>
                  </svg>
                </span>
              </Link>

              <Link
                href="/client-feedback"
                className="custom-bg-white btn-shine shine-green group relative md:px-8 px-4 md:py-4 py-2 text-white md:text-[18px] text-[14px] font-bold rounded-2xl overflow-hidden shadow-xl shadow-slate-900/20 transition-all hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative flex items-center md:gap-3 gap-2 z-10">
                  {" Client Feedback "}
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    ></path>
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          <Dashboard />
        </div>
      </div>
    </section>
  );
}
