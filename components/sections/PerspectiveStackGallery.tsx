"use client";

import { useRef, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { galleryItems } from "@/lib/gallery";
import { usePerformance } from "@/contexts/PerformanceContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Perspective stack — asymmetric “deck” choreography: Z-lift + yaw + drift (unique).
 */
export const PerspectiveStackGallery = memo(function PerspectiveStackGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { tier, isLowEnd, reducedMotion } = usePerformance();

  useGSAP(() => {
    if (!containerRef.current || !trackRef.current) return;

    if (reducedMotion) {
      const items = trackRef.current.querySelectorAll(".stack-item");
      gsap.set(items, { opacity: 1, clearProps: "transform" });
      return;
    }

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const items = trackRef.current.querySelectorAll<HTMLElement>(".stack-item");
    const totalItems = items.length;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalItems * (isLowEnd ? 40 : (isTouch ? 50 : 70))}%`,
        pin: true,
        scrub: isLowEnd ? 0.2 : (isTouch ? 0.4 : 0.8), 
        anticipatePin: 1,
        snap: {
          snapTo: 1 / (totalItems - 1),
          duration: { min: 0.2, max: 0.6 },
          delay: 0,
          ease: "power2.inOut"
        }
      },
    });

    if (glowRef.current && !isLowEnd) {
      gsap.to(glowRef.current, {
        scale: 1.15,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${totalItems * 95}%`,
          scrub: true,
        },
      });
    }

    items.forEach((item, i) => {
      // initial stack order: first item on top
      gsap.set(item, { 
        zIndex: totalItems - i,
        opacity: 1, 
        scale: 1, 
        x: 0, 
        y: 0, 
        rotateY: 0, 
        rotateZ: 0, 
        z: -i * 2,
        backfaceVisibility: "hidden"
      });

      // Exit animations: Only for items that are NOT the last one
      if (i < totalItems - 1) {
        tl.to(item, {
          z: isLowEnd ? 50 : 150, 
          x: (isTouch || isLowEnd) ? "105%" : "120%", 
          rotateZ: isLowEnd ? 0 : 8,
          rotateY: isLowEnd ? 0 : 15,
          opacity: 0,
          duration: 1.5,
          ease: "power2.inOut"
        }, i * 1.5);
      }
    });
  }, { scope: containerRef, dependencies: [tier, reducedMotion] });

  return (
    <section
      ref={containerRef}
      className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-pts-bg [perspective:1600px]"
    >
      {!isLowEnd && (
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 origin-center bg-[radial-gradient(circle_at_center,rgba(168,143,100,0.12),transparent_62%)] opacity-25 will-change-transform"
        />
      )}

      <div
        ref={trackRef}
        className="relative mx-auto h-[min(68vh,640px)] w-[min(90vw,1020px)] max-w-[1020px] transform-gpu [transform-style:preserve-3d] sm:h-[min(70vh,680px)]"
      >
        {galleryItems.slice(0, 6).map((img, i) => (
          <div
            key={i}
            className="stack-item absolute left-0 top-0 h-full w-full will-change-transform transform-gpu [transform-style:preserve-3d]"
          >
            <div className="relative h-full w-full overflow-hidden rounded-xl border border-pts-gold/20 bg-pts-black shadow-[0_28px_90px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.04]">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-center brightness-[1] transition-all duration-700 hover:brightness-110"
                sizes="(max-width: 640px) 90vw, 1020px"
                quality={isLowEnd ? 75 : 92}
                priority={i < 2}
                loading={i < 2 ? "eager" : "lazy"}
              />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-pts-black via-pts-black/80 to-transparent p-6 sm:p-10">
                <div className="flex flex-col gap-2">
                  <span className="lux-heading text-[0.5rem] uppercase tracking-[0.6em] text-pts-gold">
                    Perspective Archive
                  </span>
                  <span className="font-heading text-lg uppercase tracking-[0.15em] text-pts-parchment md:text-2xl">
                    {img.caption}
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="lux-heading text-[1rem] text-pts-gold">0{i + 1}</span>
                  <span className="text-[0.6rem] tracking-tighter text-pts-muted/50">/ 06</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="float-gentle absolute bottom-6 sm:bottom-12 right-6 sm:right-12 flex flex-col items-end gap-2 opacity-25">
        <div className="h-20 w-px bg-gradient-to-t from-pts-gold to-transparent" />
        <span className="lux-heading translate-x-2 translate-y-8 origin-right rotate-90 text-[0.5rem] tracking-[0.5em] text-pts-gold">
          PTS025
        </span>
      </div>
    </section>
  );
});
