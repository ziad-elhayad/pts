"use client";

import Image from "next/image";
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
          <div key={tile.city} className="w-[85vw] sm:w-[480px] aspect-[16/11] flex-shrink-0">
            <div
              className="group relative h-full w-full overflow-hidden border border-pts-gold/20 shadow-2xl transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-pts-gold/60 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(168,143,100,0.15)]"
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover brightness-[0.85] contrast-[1.1] saturate-[0.85] transition duration-[1200ms] ease-out group-hover:scale-[1.1] group-hover:brightness-100"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pts-black/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-6 pt-24 sm:px-8 sm:pb-8">
                <div>
                  <span className="lux-heading text-[0.45rem] sm:text-[0.5rem] text-pts-gold mb-2 block opacity-70 tracking-widest">Destination</span>
                  <p className="font-heading text-xl sm:text-2xl tracking-[0.2em] text-pts-parchment">{tile.city}</p>
                </div>
                <span className="lux-heading text-[0.6rem] sm:text-[0.7rem] text-pts-gold-2/40 font-medium">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Placeholder for the "And More" experience */}
        <div className="w-[85vw] sm:w-[360px] flex-shrink-0 flex items-center justify-center h-full px-8 sm:px-12 border border-pts-line/40 bg-pts-black/15 backdrop-blur-sm italic text-pts-muted text-xs sm:text-sm tracking-widest text-center leading-loose">
          <span className="text-pts-gold/35">&ldquo;</span>
          The world is composed of moments we author together.
          <span className="text-pts-gold/35">&rdquo;</span>
        </div>
      </HorizontalScrollSection>
    </section>
  );
}
