"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import branding from "../data/branding.json";
import { NavigationIcon } from "./navigation-icons";
import Image from "next/image";

const navigation = [
  ["Home", "/"],
  ["About Us", "/about-us/"],
  ["Services", "/services/"],
  ["Project Showcase", "/project-showcase/"],
  ["Demo Showcase", "/demo-showcase/"],
  ["Blog", "/blog/"],
  ["FAQ", "/faq/"],
];

export function SiteHeader() {
  const pathname = usePathname();
  const [headerState, setHeaderState] = useState("is-top");
  const [menuOpen, setMenuOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const dock = useRef<HTMLElement>(null);
  const close = () => setMenuOpen(false);
  const active = (href: string) =>
    pathname.replace(/\/$/, "") === href.replace(/\/$/, "");

  useEffect(() => {
    const update = () =>
      setHeaderState(
        window.innerWidth >= 1024
          ? window.scrollY > 50
            ? "pd_sticky"
            : "is-top"
          : "",
      );
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const viewport = window.visualViewport;
    const positionDock = () => {
      if (viewport && dock.current)
        dock.current.style.transform = `translateY(${-Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px)`;
    };
    viewport?.addEventListener("resize", positionDock);
    viewport?.addEventListener("scroll", positionDock);
    positionDock();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      viewport?.removeEventListener("resize", positionDock);
      viewport?.removeEventListener("scroll", positionDock);
    };
  }, []);

  useEffect(() => {
    document.dispatchEvent(new CustomEvent("site-menu", { detail: menuOpen }));
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const before = document.activeElement as HTMLElement | null;
    panel.current
      ?.querySelector<HTMLButtonElement>("button")
      ?.focus({ preventScroll: true });
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab") return;
      const focusable = panel.current?.querySelectorAll<HTMLElement>(
        "a[href],button:not([disabled])",
      );
      if (!focusable?.length) return;
      const first = focusable[0],
        last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", keyboard);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", keyboard);
      before?.focus({ preventScroll: true });
      document.dispatchEvent(new CustomEvent("site-menu", { detail: false }));
    };
  }, [menuOpen]);

  const links = (mobile = false) =>
    navigation.map(([label, href]) => (
      <li key={href} className={active(href) ? "current-menu-item" : ""}>
        <Link
          href={href}
          onClick={mobile ? close : undefined}
          aria-current={active(href) ? "page" : undefined}
        >
          {label}
        </Link>
      </li>
    ));

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100002 focus:bg-white focus:p-4 focus:text-brand-dark"
      >
        Skip to content
      </a>
      <div className="pd_wrapper">
        <header id="pd_header" className={`pd_header ${headerState}`}>
          <div className="pd_container">
            <div className="pd_logo">
              <Link href="/" aria-label="Prodeveloper2 home">
                <Image
                  src={branding.logo}
                  width="1087"
                  height="356"
                  alt="Prodeveloper2"
                />
              </Link>
            </div>
            <nav className="pd_nav_desktop" aria-label="Main navigation">
              <ul id="menu-menu-1" className="navigation">
                {links()}
              </ul>
            </nav>
            <div className="pd_right">
              <Link href="/client-feedback/" className="pd_btn_cta">
                Client Feedback
              </Link>
              <button
                ref={trigger}
                type="button"
                id="pd_hamburger_icon"
                className="pd_mobile_toggle"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen(true)}
              >
                <span className="pd_bar pd_t" />
                <span className="pd_bar pd_m" />
                <span className="pd_bar pd_b" />
              </button>
            </div>
          </div>
        </header>
        <div
          ref={panel}
          id="mobile-menu"
          className={`pd_side_panel ${menuOpen ? "pd_open" : ""}`}
          role="dialog"
          aria-label="Navigation menu"
          aria-modal={menuOpen || undefined}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          data-lenis-prevent
        >
          <div className="pd_side_inner">
            <div className="pd_side_top">
              <div className="pd_logo">
                <Link href="/" onClick={close}>
                  <img
                    src={branding.logo}
                    alt="Prodeveloper2 home"
                    width="1087"
                    height="356"
                  />
                </Link>
              </div>
              <button
                type="button"
                className="pd_side_close"
                aria-label="Close menu"
                onClick={close}
              >
                ×
              </button>
            </div>
            <nav className="pd_side_nav" aria-label="Mobile navigation">
              <ul className="pd_side_links navigation">{links(true)}</ul>
            </nav>
            <div className="mt-8">
              <Link
                href="/client-feedback/"
                onClick={close}
                className="group flex items-center justify-between bg-white md:bg-brand-green text-brand-dark px-6 py-5 rounded-2xl transition-all duration-300 shadow-lg shadow-brand-green/20 hover:bg-brand-green md:hover:bg-white hover:text-white md:hover:text-brand-dark hover:-translate-y-1 active:scale-95"
              >
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 leading-none mb-1">
                    Success Stories
                  </span>
                  <span className="text-[13px] font-black uppercase tracking-widest leading-none">
                    Client Feedback
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-brand-dark/10 flex items-center justify-center group-hover:bg-brand-dark group-hover:text-white md:group-hover:text-brand-green transition-colors duration-300">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close navigation overlay"
          className={`pd_overlay ${menuOpen ? "open" : ""}`}
          onClick={close}
        />
      </div>
      <nav
        ref={dock}
        id="bottom-mobile-menu"
        aria-label="Quick navigation"
        className="fixed bottom-0 left-0 w-full bg-brand-dark border-t border-white/5 lg:hidden z-[9999] will-change-transform"
      >
        <div className="relative z-10 flex items-center justify-between py-5 px-4">
          {[
            ["Home", "/", "home"],
            ["Projects", "/project-showcase/", "grid"],
            ["Feedback", "/client-feedback/", "message-square"],
          ].map(([label, href, icon]) => (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1.5 text-white/60 hover:text-brand-green transition-all"
            >
              <NavigationIcon name={icon} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {label}
              </span>
            </Link>
          ))}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex-1 flex flex-col items-center gap-1.5 text-white/60 hover:text-brand-green transition-all outline-none"
          >
            <NavigationIcon name="bars" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Menu
            </span>
          </button>
        </div>
        <div className="ios-mask-layer" />
      </nav>
    </>
  );
}
