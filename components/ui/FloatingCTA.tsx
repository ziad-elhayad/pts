"use client";

import { motion } from "framer-motion";
import { useLocale } from "@/contexts/LocaleContext";
import { t } from "@/lib/dictionary";

export function FloatingScrollIndicator() {
  const { locale } = useLocale();

  return (
    <motion.div 
      className="pointer-events-none absolute bottom-12 left-1/2 flex -translate-x-1/2 items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 1 }}
    >
      {/* Rotating text ring */}
      <motion.div 
        className="relative h-24 w-24 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full opacity-30 fill-pts-gold">
          <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
          <text className="lux-heading text-[6.5px] tracking-[0.6em]">
            <textPath href="#circlePath">
              {t(locale, "scroll").toUpperCase()} • {t(locale, "scroll").toUpperCase()} • {t(locale, "scroll").toUpperCase()} •
            </textPath>
          </text>
        </svg>
      </motion.div>

      {/* Bouncing Arrow */}
      <motion.div 
        className="absolute h-5 w-px bg-gradient-to-b from-pts-gold to-transparent"
        animate={{ y: [0, 8, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
