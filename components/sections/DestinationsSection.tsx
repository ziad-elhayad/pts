"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HorizontalScrollSection } from "@/components/animations/HorizontalScrollSection";
import { destinationTiles } from "@/lib/media";
import { t } from "@/lib/dictionary";
import { useLocale } from "@/contexts/LocaleContext";

export function DestinationsSection() {
  const { locale } = useLocale();

  return (
    <section id="destinations-section" className="border-t border-pts-line bg-pts-black/35">
      <HorizontalScrollSection
        id="destinations"
        kicker="GLOBAL"
        title={t(locale, "dest.title")}
        description={t(locale, "dest.sub")}
        gap="4vw"
      >
        {destinationTiles.map((tile, i) => (
          <div key={tile.city} className="w-[340px] sm:w-[480px] aspect-[16/11] flex-shrink-0">
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group relative h-full w-full overflow-hidden border border-pts-line shadow-2xl"
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover brightness-[0.65] contrast-[1.1] saturate-[0.85] transition duration-[1200ms] ease-out group-hover:scale-[1.1] group-hover:brightness-[0.8]"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pts-black via-transparent to-pts-black/20" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-8 pb-8 pt-24">
                <div>
                  <span className="lux-heading text-[0.5rem] text-pts-gold mb-2 block opacity-70 tracking-widest">Destination</span>
                  <p className="font-heading text-2xl tracking-[0.2em] text-pts-parchment">{tile.city}</p>
                </div>
                <span className="lux-heading text-[0.7rem] text-pts-gold-2/40 font-medium">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </motion.div>
          </div>
        ))}
        
        {/* Placeholder for the "And More" experience */}
        <div className="w-[360px] flex-shrink-0 flex items-center justify-center h-full px-12 border border-pts-line/40 bg-pts-black/15 backdrop-blur-sm italic text-pts-muted text-sm tracking-widest text-center leading-loose">
          <span className="text-pts-gold/35">&ldquo;</span>
          The world is composed of moments we author together.
          <span className="text-pts-gold/35">&rdquo;</span>
        </div>
      </HorizontalScrollSection>
    </section>
  );
}
