"use client";

import Link from "next/link";
import { navItems, site } from "@/lib/site";
import { t, type DictionaryKey } from "@/lib/dictionary";
import { useLocale } from "@/contexts/LocaleContext";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function LuxuryFooter() {
  const { locale, setLocale } = useLocale();

  return (
    <footer className="relative overflow-hidden border-t border-pts-gold/10 bg-pts-deep section-transition">
      {/* Gold glow ambience */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="gold-glow absolute -top-20 left-1/4 w-[60%] h-[40%] opacity-12" />
      </div>

      {/* ── Main footer body ─────────────────────────────────────────── */}
      <div className="relative mx-auto grid max-w-[1400px] gap-16 px-10 py-24 sm:px-14 lg:grid-cols-[1.4fr_1fr]">

        {/* Brand column */}
        <div>
          <BrandLogo size={200} className="mb-6" variant="image" />

          <p className="text-[0.68rem] uppercase tracking-[0.18em] leading-[2.4] text-pts-muted/45 max-w-sm">
            {site.description}
          </p>

          <div className="mt-10 flex items-center gap-4">
            <div className="h-px w-8 bg-pts-gold/30" />
            <p className="lux-heading text-[0.5rem] text-pts-gold/50 tracking-[0.4em]">
              {site.city}
            </p>
          </div>
        </div>

        {/* Navigation + Contact */}
        <div className="grid gap-12 sm:grid-cols-2">
          {/* Navigation */}
          <div>
            <p className="lux-heading text-[0.52rem] text-pts-gold tracking-[0.5em] mb-8 opacity-60">
              Navigate
            </p>
            <ul className="space-y-5">
              {navItems.map((item) => (
                <li
                  key={item.href}
                >
                  <Link
                    href={item.href}
                    className="group flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.28em] text-pts-muted/50 transition-colors duration-300 hover:text-pts-gold-2"
                  >
                    <span className="h-px w-0 bg-pts-gold/40 transition-all duration-300 group-hover:w-5" />
                    {t(locale, item.key as DictionaryKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="lux-heading text-[0.52rem] text-pts-gold tracking-[0.5em] mb-8 opacity-60">
              CONTACT
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "info@gervae.com",
                "support@gervae.com",
                "visa@gervae.com",
                "hr@gervae.com",
                "accounts@gervae.com",
              ].map((email) => (
                <li key={email}>
                  <a
                    href={`mailto:${email}`}
                    className="group flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.28em] text-pts-muted/50 transition-colors duration-300 hover:text-pts-gold-2"
                  >
                    <span className="h-px w-0 bg-pts-gold/40 transition-all duration-300 group-hover:w-5" />
                    {email}
                  </a>
                </li>
              ))}
            </ul>

            <p className="lux-heading text-[0.52rem] text-pts-gold tracking-[0.5em] mb-4 opacity-60">
              Phone Number
            </p>
            <a
              href="tel:+201010180344"
              className="group flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.28em] text-pts-muted/50 transition-colors duration-300 hover:text-pts-gold-2 mb-10"
            >
              <span className="h-px w-0 bg-pts-gold/40 transition-all duration-300 group-hover:w-5" />
              +20 101 018 0344
            </a>

            {/* Language toggle */}
            <div className="flex gap-2">
              {(["en", "ar"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`lux-heading px-4 py-2 border transition-all duration-300 ${
                    locale === lang
                      ? "border-pts-gold text-pts-gold bg-pts-gold/8"
                      : "border-pts-line/20 text-pts-muted/35 hover:border-pts-gold/30 hover:text-pts-muted/60"
                  } ${locale === "ar" ? "text-[0.6rem]" : "text-[0.52rem]"}`}
                  onClick={() => setLocale(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid rgba(168,143,100,0.08)" }}>
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-10 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-14">
          <p className="text-[0.52rem] uppercase tracking-[0.28em] text-pts-muted/30">
            © 2026 Gervae. All rights reserved.
          </p>
          <div className="flex gap-6 text-[0.52rem] uppercase tracking-[0.28em] text-pts-muted/25">
            <span className="hover:text-pts-muted/50 cursor-default transition-colors">
              {t(locale, "footer.privacy")}
            </span>
            <span className="hover:text-pts-muted/50 cursor-default transition-colors">
              {t(locale, "footer.terms")}
            </span>
            <span className="lux-heading text-pts-gold/20 tracking-[0.5em]">21°N 39°E</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
