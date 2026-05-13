"use client";

import Image from "next/image";
import clsx from "clsx";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type StickyParallaxMediaProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

/**
 * Sticky viewport-high media: background stays pinned while the section scrolls;
 * inner layer uses scrubbed parallax + subtle zoom for depth (GPU-friendly transforms).
 */
export function StickyParallaxMedia({
  src,
  alt,
  className,
  priority,
}: StickyParallaxMediaProps) {
  const root = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      const layer = inner.current;
      if (!section || !layer) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(layer, { yPercent: 0, scale: 1 });
        return;
      }

      gsap.fromTo(
        layer,
        { yPercent: -10, scale: 1 },
        {
          yPercent: 10,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.9,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className={clsx(
        "relative min-h-[min(72vh,620px)] w-full sm:min-h-[min(80vh,720px)] lg:min-h-[min(125vh,1100px)]",
        className,
      )}
    >
      <div className="sticky top-0 h-[min(72vh,620px)] w-full overflow-hidden border border-pts-line shadow-[var(--shadow-lux)] sm:h-[min(80vh,720px)] lg:h-[min(100svh,900px)]">
        <div
          ref={inner}
          className="gpu-layer absolute inset-0 h-[125%] w-full will-change-transform"
          style={{ top: "-12%" }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pts-black/75 via-pts-bg/25 to-pts-black/40" />
        </div>
      </div>
    </div>
  );
}
