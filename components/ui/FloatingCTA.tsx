"use client";

import { useLocale } from "@/contexts/LocaleContext";
import { t } from "@/lib/dictionary";

export function FloatingScrollIndicator() {
  const { locale } = useLocale();
  const label = t(locale, "scroll").toUpperCase();

  return (
    <div className="pointer-events-none absolute bottom-12 left-1/2 flex -translate-x-1/2 animate-scroll-indicator-in items-center justify-center">
      <div className="relative flex h-24 w-24 animate-scroll-ring items-center justify-center">
        <svg viewBox="0 0 100 100" className="h-full w-full fill-pts-gold opacity-30">
          <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
          <text className="lux-heading text-[6.5px] tracking-[0.6em]">
            <textPath href="#circlePath">
              {label} - {label} - {label} -
            </textPath>
          </text>
        </svg>
      </div>

      <div className="absolute h-5 w-px animate-scroll-arrow bg-gradient-to-b from-pts-gold to-transparent" />
    </div>
  );
}
