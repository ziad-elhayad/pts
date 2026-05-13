"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import type { GalleryItem } from "@/lib/gallery";

type CinematicGalleryProps = {
  items: readonly GalleryItem[];
};

export function CinematicGallery({ items }: CinematicGalleryProps) {
  const [active, setActive] = useState<GalleryItem | null>(null);
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = grid.current?.querySelectorAll<HTMLElement>("[data-gallery-card]");
      if (!cards?.length) return;
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: grid.current,
            start: "top 80%",
            once: true,
          },
        },
      );
    },
    { scope: grid, dependencies: [items.length] },
  );

  return (
    <>
      <div
        ref={grid}
        className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>div]:mb-4"
      >
        {items.map((item) => (
          <div key={item.src} data-gallery-card className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setActive(item)}
              className="group relative block w-full overflow-hidden border border-pts-line text-left"
            >
              <div className="relative aspect-[4/5] w-full sm:aspect-[3/4]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-[1100ms] ease-out group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pts-black/80 via-transparent to-transparent opacity-80 transition duration-500 group-hover:opacity-100" />
              <span className="pointer-events-none absolute bottom-4 left-4 right-4 text-[0.62rem] uppercase tracking-[0.32em] text-pts-parchment">
                {item.caption}
              </span>
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-pts-black/85 px-4 py-10 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden border border-pts-line shadow-[var(--shadow-lux)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video w-full bg-pts-black">
                <Image src={active.src} alt={active.alt} fill className="object-cover" sizes="100vw" />
              </div>
              <div className="flex items-center justify-between border-t border-pts-line bg-pts-bg px-6 py-4">
                <p className="text-sm text-pts-muted">{active.caption}</p>
                <button
                  type="button"
                  className="lux-heading text-[0.62rem] text-pts-gold-2"
                  onClick={() => setActive(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
