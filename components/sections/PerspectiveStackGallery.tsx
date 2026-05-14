"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { galleryItems } from "@/lib/gallery";
import { prefersReducedMotion } from "@/lib/motionPref";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Perspective stack — asymmetric “deck” choreography: Z-lift + yaw + drift (unique).
 */
export function PerspectiveStackGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !trackRef.current) return;

    if (prefersReducedMotion()) {
      const items = trackRef.current.querySelectorAll(".stack-item");
      gsap.set(items, { opacity: 1, clearProps: "transform" });
      return;
    }

    const items = trackRef.current.querySelectorAll<HTMLElement>(".stack-item");
    const totalItems = items.length;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${totalItems * 95}%`,
        pin: true,
        scrub: 0.85,
      },
    });

    if (glowRef.current) {
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
      const dir = i % 2 === 0 ? 1 : -1;
      
      // Initial state
      if (i === 0) {
        gsap.set(item, { opacity: 1, scale: 1, z: 0, y: 0, rotateY: 0, rotateZ: 0 });
      } else {
        gsap.set(item, {
          opacity: 0,
          scale: 0.85,
          y: 100,
          rotateY: 15 * dir,
          z: -200,
          transformOrigin: "50% 50%",
        });
      }

      // Timeline mapping: each item gets roughly 1 unit of the scroll duration
      // Item 0: Stays for 0-1, exits 1-2
      if (i === 0) {
        tl.to(item, {
          opacity: 0,
          y: -150,
          scale: 1.1,
          rotateY: -10 * dir,
          z: 100,
          duration: 1,
          ease: "power2.inOut"
        }, 1.2); // Start exit a bit later for breathing room
      } 
      // Middle items: enter, stay, exit
      else {
        // Enter transition
        tl.to(item, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateY: 0,
          z: 0,
          duration: 1,
          ease: "power2.out"
        }, i * 1.2);

        // Exit transition (except for the last one)
        if (i < totalItems - 1) {
          tl.to(item, {
            opacity: 0,
            y: -150,
            scale: 1.1,
            rotateY: -10 * dir,
            z: 100,
            duration: 1,
            ease: "power2.inOut"
          }, (i + 1) * 1.2);
        }
      }
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-pts-bg [perspective:1600px]"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 origin-center bg-[radial-gradient(circle_at_center,rgba(168,143,100,0.12),transparent_62%)] opacity-25 will-change-transform"
      />

      <div
        ref={trackRef}
        className="relative mx-auto flex h-[min(68vh,640px)] w-[min(90vw,1020px)] max-w-[1020px] transform-gpu items-center justify-center [transform-style:preserve-3d] sm:h-[min(70vh,680px)]"
      >
        {galleryItems.slice(0, 6).map((img, i) => (
          <div
            key={i}
            className="stack-item absolute inset-0 will-change-transform transform-gpu [transform-style:preserve-3d]"
          >
            <div className="relative h-full w-full overflow-hidden rounded-xl border border-pts-gold/20 bg-pts-black shadow-[0_28px_90px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.04]">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-center brightness-[1] transition-all duration-700 hover:brightness-110"
                sizes="(max-width: 640px) 90vw, 1020px"
                quality={92}
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
}
