"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { navItems, serviceItems } from "@/lib/site";
import { t, type DictionaryKey } from "@/lib/dictionary";
import { useLocale } from "@/contexts/LocaleContext";
import { Magnetic } from "@/components/ui/Magnetic";
import { BrandLogoFull } from "@/components/ui/BrandLogo";

export function LuxuryNavbar() {
  const pathname        = usePathname();
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const [nav, setNav] = useState({ scrolled: false, hidden: false, progress: 0 });
  const lastScroll = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = y > 60;
        const progress = max > 0 ? y / max : 0;
        const prev = lastScroll.current;
        const hidden = y > prev && y > 100;
        lastScroll.current = y;
        setNav((prev) => {
          if (prev.scrolled === scrolled && prev.hidden === hidden && Math.abs(prev.progress - progress) < 0.002) {
            return prev;
          }
          return { scrolled, hidden, progress };
        });
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const { scrolled, hidden, progress } = nav;

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
        className={clsx(
          "fixed inset-x-0 top-0 z-[90] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pt-[env(safe-area-inset-top,0px)]",
          hidden ? "-translate-y-full" : "translate-y-0"
        )}
    >
      {/* ── Main nav bar ────────────────────────────────────────────── */}
      <div
        className={clsx(
          "transition-[background,backdrop-filter,border-color] duration-500",
          scrolled
            ? "bg-pts-deep/95 lg:bg-pts-deep/82 lg:backdrop-blur-xl border-b border-pts-gold/10"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-5 md:px-12">
          {/* Logo */}
          <Magnetic strength={0.3}>
            <Link href="/" className="group">
              <BrandLogoFull />
            </Link>
          </Magnetic>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => {
              const isHomePage = pathname === "/";
              const isAnchor = "anchor" in item && item.anchor;
              const anchorId = item.href === "/" ? "hero" : item.href.replace(/^[\/#]+/, "");
              const navActive = isHomePage ? false : pathname === item.href;

              // Handle anchor links (About and FAQ)
              if (isAnchor) {
                const handleAnchorClick = () => {
                  if (isHomePage) {
                    const element = document.getElementById(anchorId);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  } else {
                    window.location.href = `/#${anchorId}`;
                  }
                };

                return (
                  <Magnetic strength={0.25} key={item.href}>
                    <button
                      type="button"
                      onClick={handleAnchorClick}
                      className={clsx(
                        "relative text-[0.62rem] uppercase tracking-[0.32em] transition-colors duration-300 cursor-pointer border-none bg-transparent outline-none",
                        pathname === "/"
                          ? "text-pts-parchment"
                          : "text-pts-gold-2 hover:text-pts-parchment"
                      )}
                    >
                      {t(locale, item.key as DictionaryKey)}
                    </button>
                  </Magnetic>
                );
              }

              if ("dropdown" in item && item.dropdown) {
                const [servicesHovered, setServicesHovered] = useState(false);
                const dropdownActive = serviceItems.some((sub) => pathname === sub.href);
                return (
                  <div
                    key={item.key}
                    className="relative py-2"
                    onMouseEnter={() => setServicesHovered(true)}
                    onMouseLeave={() => setServicesHovered(false)}
                  >
                    <Magnetic strength={0.25}>
                      <button
                        type="button"
                        className={clsx(
                          "relative flex items-center gap-1.5 text-[0.62rem] uppercase tracking-[0.32em] transition-colors duration-300 cursor-pointer border-none bg-transparent outline-none font-body",
                          dropdownActive
                            ? "text-pts-parchment"
                            : "text-pts-gold-2 hover:text-pts-parchment"
                        )}
                      >
                        <span>{t(locale, item.key as DictionaryKey)}</span>
                        <svg
                          className={clsx("w-3 h-3 transition-transform duration-300 text-pts-gold/70", servicesHovered && "rotate-180")}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        {dropdownActive && (
                          <span className="absolute -bottom-1.5 left-0 h-px w-full bg-gradient-to-r from-pts-gold via-pts-gold-2 to-transparent" />
                        )}
                      </button>
                    </Magnetic>

                    <AnimatePresence>
                      {servicesHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute left-1/2 top-full -translate-x-1/2 pt-4 z-50 w-64"
                        >
                          <div className="border border-pts-gold/20 bg-pts-deep/98 backdrop-blur-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-sm space-y-1">
                            {serviceItems.map((subItem) => {
                              const subActive = pathname === subItem.href;
                              return (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className={clsx(
                                    "group flex items-center justify-between w-full px-4 py-3 text-[0.62rem] uppercase tracking-[0.2em] rounded-sm transition-all duration-300",
                                    subActive
                                      ? "bg-pts-gold/12 text-pts-gold"
                                      : "text-pts-gold-2 hover:text-pts-parchment hover:bg-pts-gold/6"
                                  )}
                                >
                                  <span>{t(locale, subItem.key as DictionaryKey)}</span>
                                  <svg
                                    className="w-3.5 h-3.5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-pts-gold"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                  </svg>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Magnetic strength={0.25} key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "relative text-[0.62rem] uppercase tracking-[0.32em] transition-colors duration-300",
                      navActive
                        ? "text-pts-parchment"
                        : "text-pts-gold-2 hover:text-pts-parchment"
                    )}
                  >
                    {t(locale, item.key as DictionaryKey)}
                    {navActive && (
                      <span className="absolute -bottom-1.5 left-0 h-px w-full bg-gradient-to-r from-pts-gold via-pts-gold-2 to-transparent" />
                    )}
                  </Link>
                </Magnetic>
              );
            })}
          </nav>

          {/* Right: Language + CTA */}
          <div className="hidden items-center gap-5 lg:flex">
            {/* Language toggle */}
            <div className="flex rounded-full border border-pts-line/30 bg-pts-black/30 p-1 text-[0.58rem] uppercase tracking-[0.28em]">
              {(["en", "de", "ar"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={clsx(
                    "rounded-full px-3 py-1 transition-colors duration-300",
                    locale === lang
                      ? "bg-pts-gold/20 text-pts-parchment"
                      : "text-pts-gold-2 hover:text-pts-parchment"
                  )}
                  onClick={() => setLocale(lang)}
                >
                  {lang === "en" ? "EN" : lang === "de" ? "DE" : "AR"}
                </button>
              ))}
            </div>

            {/* Consult CTA */}
            <Link
              href="/contact"
              className="lux-heading border border-pts-gold/35 bg-pts-gold/8 px-5 py-2.5 text-[0.6rem] text-pts-gold-2 tracking-[0.4em] transition-all duration-400 hover:border-pts-gold hover:bg-pts-gold/18 hover:shadow-[0_0_20px_rgba(168,143,100,0.15)]"
            >
              {t(locale, "cta.consult")}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex items-center justify-center text-pts-gold lg:hidden transition-all duration-300 hover:scale-110"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t(locale, "nav.close") : t(locale, "nav.menu")}
          >
            {open ? (
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 8L24 24M8 24L24 8" />
              </svg>
            ) : (
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M6 12H30M6 18H30M6 24H30" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Scroll progress bar ──────────────────────────────────────── */}
      <div
        className="h-[1.5px] origin-left transition-none will-change-transform"
        style={{
          transform: `scaleX(${progress})`,
          background: "linear-gradient(90deg, var(--pts-gold), var(--pts-gold-2))",
          opacity: scrolled ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      {/* ── Mobile menu ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-pts-line/15 bg-pts-deep/95 px-4 py-8 backdrop-blur-xl sm:px-8 sm:py-10 lg:hidden max-h-[min(85vh,calc(100dvh-5rem))] overflow-y-auto overscroll-y-contain pb-[max(2rem,env(safe-area-inset-bottom))]"
          >
            <div className="mx-auto flex max-w-sm flex-col gap-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                >
                  <Link
                    href={item.href}
                    className={clsx(
                      "lux-heading text-[0.72rem] tracking-[0.4em] transition-colors",
                      pathname === item.href ? "text-pts-gold" : "text-pts-parchment/80 hover:text-pts-gold-2"
                    )}
                  >
                    {t(locale, item.key as DictionaryKey)}
                  </Link>
                </motion.div>
              ))}

              <div className="flex gap-3 pt-4 border-t border-pts-line/15">
                {(["en", "ar"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    className={clsx(
                      "flex-1 border py-2.5 text-[0.6rem] uppercase tracking-[0.3em] transition-colors",
                      locale === lang
                        ? "border-pts-gold text-pts-gold"
                        : "border-pts-line/30 text-pts-gold-2"
                    )}
                    onClick={() => setLocale(lang)}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
