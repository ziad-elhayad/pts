"use client";

import { HorizontalScrollSection } from "@/components/animations/HorizontalScrollSection";
import { PageTransition } from "@/components/animations/PageTransition";
import { galleryItems } from "@/lib/gallery";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function ExperiencesPage() {
  const [active, setActive] = useState<(typeof galleryItems)[0] | null>(null);

  return (
    <PageTransition>
      <HorizontalScrollSection
        kicker="GALLERY"
        title="A gallery of composed moments"
        description="Imagery is representative of categories we produce—aviation, hospitality, and private evenings—tailored to each client's brand language."
        gap="1.5vw"
      >
        {galleryItems.map((item, index) => (
          <div key={item.src} className="w-[300px] sm:w-[400px] aspect-[3/4] flex-shrink-0 group">
            <button
              type="button"
              onClick={() => setActive(item)}
              className="relative h-full w-full overflow-hidden border border-pts-line shadow-2xl text-left"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                priority
                quality={90}
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 300px, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pts-black/90 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="lux-heading text-[0.45rem] text-pts-gold/60 mb-2 block tracking-widest">
                  Moment 0{index + 1}
                </span>
                <p className="text-[0.65rem] uppercase tracking-[0.25em] text-pts-parchment">
                  {item.caption}
                </p>
              </div>
            </button>
          </div>
        ))}

        <div className="w-[30vw] flex-shrink-0 flex flex-col justify-center px-12 border-l border-pts-line h-full">
          <p className="italic text-pts-muted text-sm tracking-widest leading-loose">
            <span className="text-pts-gold/40">&ldquo;</span>
            We do not document travel; we author the memories that follow.
            <span className="text-pts-gold/40">&rdquo;</span>
          </p>
        </div>
      </HorizontalScrollSection>

      <AnimatePresence>
        {active ? (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-pts-black/90 px-4 py-10 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[85vh] w-full max-w-6xl overflow-hidden border border-pts-line bg-pts-bg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video w-full bg-pts-black">
                <Image
                  src={active.src}
                  alt={active.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1152px) 100vw, 1152px"
                  quality={92}
                />
              </div>
              <div className="flex items-center justify-between border-t border-pts-line px-8 py-5">
                <p className="lux-heading text-[0.55rem] text-pts-muted tracking-[0.2em]">{active.caption}</p>
                <button
                  type="button"
                  className="lux-heading text-[0.6rem] text-pts-gold-2 tracking-widest"
                  onClick={() => setActive(null)}
                >
                  [ Close ]
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </PageTransition>
  );
}
