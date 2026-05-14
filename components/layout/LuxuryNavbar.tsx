"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { navItems, site } from "@/lib/site";
import { t, type DictionaryKey } from "@/lib/dictionary";
import { useLocale } from "@/contexts/LocaleContext";
import { Magnetic } from "@/components/ui/Magnetic";
import { BrandLogoFull } from "@/components/ui/BrandLogo";

export function LuxuryNavbar() {
  const pathname        = usePathname();
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [hidden, setHidden]       = useState(false);
  const [progress, setProgress]   = useState(0);
  const lastScroll = useRef(0);

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => {
      const y   = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      setScrolled(y > 60);
      setProgress(max > 0 ? y / max : 0);

      if (y > lastScroll.current && y > 100) setHidden(true);
      else setHidden(false);

      lastScroll.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-[90] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        hidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      {/* ── Main nav bar ────────────────────────────────────────────── */}
      <div
        className={clsx(
          "transition-[background,backdrop-filter,border-color] duration-500",
          scrolled
            ? "bg-pts-deep/80 backdrop-blur-2xl border-b border-pts-gold/10"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-5 sm:px-12">
          {/* Logo */}
          <Magnetic strength={0.3}>
            <Link href="/" className="group">
              <BrandLogoFull />
            </Link>
          </Magnetic>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Magnetic strength={0.25} key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "relative text-[0.62rem] uppercase tracking-[0.32em] transition-colors duration-300",
                      active
                        ? "text-pts-parchment"
                        : "text-pts-gold-2 hover:text-pts-parchment"
                    )}
                  >
                    {t(locale, item.key as DictionaryKey)}
                    {active && (
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
              {(["en", "ar"] as const).map((lang) => (
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
                  {t(locale, `lang.${lang}` as DictionaryKey)}
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
            className="border-t border-pts-line/15 bg-pts-deep/95 px-8 py-10 backdrop-blur-2xl lg:hidden"
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
