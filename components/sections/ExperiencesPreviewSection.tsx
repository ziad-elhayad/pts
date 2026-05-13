"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionReveal } from "@/components/animations/SectionReveal";
import { t } from "@/lib/dictionary";
import { useLocale } from "@/contexts/LocaleContext";

const tiles = [
  {
    src: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1200&q=80",
    alt: "Executive aviation",
    className: "md:col-span-2 md:row-span-2 min-h-[320px]",
  },
  {
    src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
    alt: "Luxury hotel interior",
    className: "min-h-[220px]",
  },
  {
    src: "https://images.unsplash.com/photo-1526481280695-3c687fd543c1?auto=format&fit=crop&w=900&q=80",
    alt: "Coastal destination",
    className: "min-h-[220px]",
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    alt: "Corporate event space",
    className: "md:col-span-2 min-h-[240px]",
  },
  {
    src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80",
    alt: "Executive portrait mood",
    className: "min-h-[240px]",
  },
] as const;

export function ExperiencesPreviewSection() {
  const { locale } = useLocale();

  return (
    <section className="border-t border-pts-line py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
        <SectionReveal>
          <div data-reveal className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="lux-heading text-[0.6rem] text-pts-gold">Gallery</p>
              <h2 className="mt-6 font-heading text-3xl tracking-[0.14em] text-pts-parchment sm:text-4xl">
                {t(locale, "exp.title")}
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-pts-muted sm:text-base">
                {t(locale, "exp.sub")}
              </p>
            </div>
            <Link
              href="/experiences"
              className="lux-heading border border-pts-gold/40 px-6 py-3 text-[0.62rem] text-pts-gold-2 transition hover:border-pts-gold hover:bg-pts-gold/10"
            >
              View Experiences
            </Link>
          </div>

          <div className="mt-14 grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-3">
            {tiles.map((tile, index) => (
              <div key={tile.src} data-reveal>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={`group relative overflow-hidden border border-pts-line ${tile.className}`}
                >
                  <Image
                    src={tile.src}
                    alt={tile.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-[1200ms] ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pts-black/70 via-transparent to-transparent opacity-80 transition duration-500 group-hover:opacity-100" />
                  <span className="absolute bottom-4 left-4 text-[0.58rem] uppercase tracking-[0.35em] text-pts-parchment/90">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </motion.div>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
