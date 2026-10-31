import type { CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-white">
      <div
        className="absolute bottom-0 left-0 w-full h-[80%] lg:h-[75%] z-0"
        style={
          { backgroundColor: "rgb(var(--rgb-brand-dark))" } as CSSProperties
        }
      >
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={
            {
              backgroundImage:
                "linear-gradient(rgb(var(--rgb-white) / 0.2) 1px, transparent 1px), \n                   linear-gradient(90deg, rgb(var(--rgb-white) / 0.2) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            } as CSSProperties
          }
        ></div>

        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={
            {
              background: "url('/assets/home/dark-matter-8a208fb9.png')",
            } as CSSProperties
          }
        ></div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-green/15 rounded-full blur-[100px]"></div>

          <div className="absolute bottom-0 right-0 w-125 h-125 bg-black/30 rounded-full blur-[120px]"></div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 top-0 h-100 opacity-[0.03] z-0 pointer-events-none"
        style={
          {
            backgroundImage:
              "linear-gradient(rgb(var(--rgb-brand-dark)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--rgb-brand-dark)) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          } as CSSProperties
        }
      ></div>

      <div className="max-w-7xl mx-auto relative z-10 px-6">
        <div className="pb-16">
          <div className="relative bg-white border border-slate-100 p-10 lg:p-24 rounded-[3rem] lg:rounded-[5rem] shadow-[0_50px_100px_-20px_rgb(var(--rgb-brand-dark)/0.15)] transition-all duration-700">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-brand-green/10 rounded-full mb-10 border border-brand-green/20">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>

                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-green"></span>
                </span>

                <span className="text-brand-dark font-black text-[10px] uppercase tracking-[0.4em]">
                  {"Project Inquiries"}
                </span>
              </div>

              <h2 className="text-6xl md:text-[8rem] font-black text-slate-900 tracking-tighter leading-[0.8] mb-12">
                {" Let's Build "}
                <br />

                <span
                  className="text-transparent"
                  style={
                    {
                      WebkitTextStroke: "1.5px rgb(var(--rgb-brand-green))",
                      fontFamily: "var(--font-outline)",
                    } as CSSProperties
                  }
                >
                  {"Excellence."}
                </span>
              </h2>

              <p className="text-slate-500 max-w-xl text-lg md:text-xl font-medium leading-relaxed mb-16">
                {
                  " Ready to scale your digital presence? Choose your preferred way to start our professional partnership. "
                }
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link
                  href="/project-showcase/"
                  className="group relative bg-brand-dark text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgb(var(--rgb-brand-dark)/0.3)]"
                >
                  <span className="relative z-10">{"Project Showcase"}</span>

                  <div className="absolute inset-0 bg-brand-green -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                </Link>

                <Link
                  href="/client-feedback"
                  className="group px-12 py-6 rounded-2xl border-2 border-slate-200 font-black text-xs uppercase tracking-[0.2em] text-slate-900 hover:border-brand-green hover:text-brand-green transition-all duration-500"
                >
                  {" Client Feedback "}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 pb-24 lg:pb-16 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
            <div className="space-y-6 text-left lg:text-left">
              <Link
                href="/"
                className="inline-block transform transition hover:scale-105"
              >
                <Image
                  width="1087"
                  height="356"
                  src="/assets/home/ProDeveloper-Photoroom-Photoroom-c922420e.png"
                  alt=""
                  className="h-10 w-auto object-contain footer-white-logo"
                  loading="lazy"
                />
              </Link>

              <p className="text-white/70 leading-relaxed text-sm">
                {
                  " A full-stack developer crafting fast, secure, and scalable digital experiences for modern businesses "
                }
              </p>
            </div>

            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold mb-8 flex items-center justify-center lg:justify-start">
                <span className="w-8 h-1 bg-brand-green mr-3 rounded-full"></span>
                {"Our Services "}
              </h3>

              <div className="space-y-4 text-white/60">
                <ul id="menu-footer-our-services" className="space-y-4">
                  <li>
                    <Link
                      href="/services/wordpress-website-development/"
                      className="text-gray-100 hover:text-white hover:pl-2 transition-all duration-300 flex items-center"
                    >
                      <i className="fas fa-chevron-right text-[12px] mr-3 opacity-70"></i>
                      <span>{"WordPress Website Development"}</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/services/shopify-website-development/"
                      className="text-gray-100 hover:text-white hover:pl-2 transition-all duration-300 flex items-center"
                    >
                      <i className="fas fa-chevron-right text-[12px] mr-3 opacity-70"></i>
                      <span>{"Shopify Website Development"}</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/services/webflow-website-development/"
                      className="text-gray-100 hover:text-white hover:pl-2 transition-all duration-300 flex items-center"
                    >
                      <i className="fas fa-chevron-right text-[12px] mr-3 opacity-70"></i>
                      <span>{"Webflow Website Development"}</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/services/wix-website-development/"
                      className="text-gray-100 hover:text-white hover:pl-2 transition-all duration-300 flex items-center"
                    >
                      <i className="fas fa-chevron-right text-[12px] mr-3 opacity-70"></i>
                      <span>{"Wix Website Development"}</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/services/full-stack-web-application-development-next-js/"
                      className="text-gray-100 hover:text-white hover:pl-2 transition-all duration-300 flex items-center"
                    >
                      <i className="fas fa-chevron-right text-[12px] mr-3 opacity-70"></i>
                      <span>
                        {"Full Stack Web Application Development (Next.js)"}
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold mb-8 flex items-center justify-center lg:justify-start">
                <span className="w-8 h-1 bg-brand-green mr-3 rounded-full"></span>
                {"Project Showcase "}
              </h3>

              <div className="space-y-4 text-white/60">
                <ul id="menu-footer-project-showcase" className="space-y-4">
                  <li>
                    <a
                      href="/project-showcase/?filters=industry-type:ecommerce"
                      className="text-gray-100 hover:text-white hover:pl-2 transition-all duration-300 flex items-center"
                    >
                      <i className="fas fa-chevron-right text-[12px] mr-3 opacity-70"></i>
                      <span>{"Ecommerce"}</span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="/project-showcase/?filters=industry-type:agency"
                      className="text-gray-100 hover:text-white hover:pl-2 transition-all duration-300 flex items-center"
                    >
                      <i className="fas fa-chevron-right text-[12px] mr-3 opacity-70"></i>
                      <span>{"Agency & Business"}</span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="/project-showcase/?filters=industry-type:real-state"
                      className="text-gray-100 hover:text-white hover:pl-2 transition-all duration-300 flex items-center"
                    >
                      <i className="fas fa-chevron-right text-[12px] mr-3 opacity-70"></i>
                      <span>{"Real Estate"}</span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="/project-showcase/?filters=industry-type:hotel-%26-restaurant"
                      className="text-gray-100 hover:text-white hover:pl-2 transition-all duration-300 flex items-center"
                    >
                      <i className="fas fa-chevron-right text-[12px] mr-3 opacity-70"></i>
                      <span>{"Hotel & Restaurant"}</span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="/project-showcase/?filters=functionality:speed-optimization"
                      className="text-gray-100 hover:text-white hover:pl-2 transition-all duration-300 flex items-center"
                    >
                      <i className="fas fa-chevron-right text-[12px] mr-3 opacity-70"></i>
                      <span>{"Speed Optimization"}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold mb-8 flex items-center justify-center lg:justify-start">
                <span className="w-8 h-1 bg-brand-green mr-3 rounded-full"></span>
                {"Demo Showcase "}
              </h3>

              <div className="space-y-4 text-white/60">
                <ul id="menu-footer-demo-showcase" className="space-y-4">
                  <li>
                    <a
                      href="/demo-showcase/?filters=industry-type:ecommerce"
                      className="text-gray-100 hover:text-white hover:pl-2 transition-all duration-300 flex items-center"
                    >
                      <i className="fas fa-chevron-right text-[12px] mr-3 opacity-70"></i>
                      <span>{"Ecommerce"}</span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="/demo-showcase/?filters=industry-type:business,agency"
                      className="text-gray-100 hover:text-white hover:pl-2 transition-all duration-300 flex items-center"
                    >
                      <i className="fas fa-chevron-right text-[12px] mr-3 opacity-70"></i>
                      <span>{"Business"}</span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="/demo-showcase/?filters=industry-type:real-state"
                      className="text-gray-100 hover:text-white hover:pl-2 transition-all duration-300 flex items-center"
                    >
                      <i className="fas fa-chevron-right text-[12px] mr-3 opacity-70"></i>
                      <span>{"Real Estate"}</span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="/demo-showcase/?filters=industry-type:rental"
                      className="text-gray-100 hover:text-white hover:pl-2 transition-all duration-300 flex items-center"
                    >
                      <i className="fas fa-chevron-right text-[12px] mr-3 opacity-70"></i>
                      <span>{"Rental"}</span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="/demo-showcase/?filters=functionality:speed-optimization"
                      className="text-gray-100 hover:text-white hover:pl-2 transition-all duration-300 flex items-center"
                    >
                      <i className="fas fa-chevron-right text-[12px] mr-3 opacity-70"></i>
                      <span>{"Speed Optimization"}</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] text-center md:text-left">
                {
                  " © 2026 Nizam Uddin • Crafted with Passion • All Rights Reserved "
                }
              </p>

              <div className="flex gap-6 text-white/30 text-[10px] uppercase tracking-[0.3em]">
                <Link
                  href="/privacy-policy"
                  className="hover:text-brand-green transition-colors"
                >
                  {" Privacy Policy "}
                </Link>

                <Link
                  href="/terms-and-conditions"
                  className="hover:text-brand-green transition-colors"
                >
                  {" Terms & Conditions "}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
