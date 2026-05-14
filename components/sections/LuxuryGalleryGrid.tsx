"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LineRevealText } from "@/components/animations/LineRevealText";
import { prefersReducedMotion } from "@/lib/motionPref";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * LuxuryGalleryGrid — Transformed into "The Lens Expansion".
 * A truly bespoke experience where a small framed image expands to fill 
 * the entire screen on scroll, transitioning into a full-bleed narrative.
 */
export function LuxuryGalleryGrid() {
  const containerRef = useRef<HTMLElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const lensImgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const h2Line1Ref = useRef<HTMLSpanElement>(null);
  const h2Line2Ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !lensRef.current || !contentRef.current || !lensImgRef.current) return;

    if (prefersReducedMotion()) {
      gsap.set(lensRef.current, { width: "100%", height: "100%", borderRadius: 0 });
      gsap.set(contentRef.current, { opacity: 1, y: 0 });
      gsap.set(lensImgRef.current, { scale: 1.15 });
      return;
    }

    gsap.set(contentRef.current, { opacity: 0, y: 72 });

    if (ringRef.current) {
      gsap.to(ringRef.current, { rotation: 360, duration: 32, repeat: -1, ease: "none" });
    }

    const lineA = h2Line1Ref.current;
    const lineB = h2Line2Ref.current;

    // drive the expansion based on the container's scroll progress
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // Phase 1: Expansion (mapping scroll to scale/border-radius)
    tl.to(lensRef.current, {
      width: "100%",
      height: "100%",
      borderRadius: "0px",
      duration: 1.5,
      ease: "none",
    })
      // Phase 2: Content Reveal
      .to(
        contentRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.35",
      );

    if (lineA && lineB) {
      tl.fromTo(
        [lineA, lineB],
        { yPercent: 110, skewX: -5, opacity: 0 },
        {
          yPercent: 0,
          skewX: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: "power4.out",
        },
        "-=0.45",
      );
    }

    gsap.fromTo(
      lensImgRef.current,
      { scale: 1.12 },
      {
        scale: 1.28,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      },
    );
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative h-[300vh] w-full bg-pts-black overflow-visible"
    >
      {/* Sticky viewport wrapper */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center">
        {/* Decorative Text behind the lens */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
          <h2 className="lux-heading text-[15vw] tracking-tighter text-pts-gold uppercase font-bold ambient-orb">
            BEYOND
          </h2>
        </div>

        {/* The Lens — starts as a small framed window */}
        <div
          ref={lensRef}
          className="relative z-10 h-[55vh] max-h-[400px] sm:h-[400px] w-[75vw] sm:w-[280px] overflow-hidden rounded-lg border border-pts-gold/20 shadow-2xl will-change-[width,height,border-radius] md:h-[500px] md:w-[350px]"
        >
          <div
            ref={ringRef}
            className="pointer-events-none absolute -inset-[3px] z-[4] rounded-xl opacity-40 mix-blend-screen will-change-transform"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(207,186,144,0.35) 90deg, transparent 180deg, rgba(168,143,100,0.2) 270deg, transparent 360deg)",
            }}
            aria-hidden
          />
          <div
            ref={lensImgRef}
            className="absolute inset-0 h-full w-full scale-[1.12] will-change-transform"
          >
            <Image
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=2000&q=80"
              alt="Cinematic luxury horizon"
              fill
              className="object-cover"
            />
          </div>

          {/* Subtle inner shadow for the lens */}
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
        </div>

        {/* Expanding Narrative Content */}
        <div
          ref={contentRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center sm:px-20"
        >
        <div className="w-full max-w-6xl">
          <p className="lux-heading text-[0.6rem] text-pts-gold tracking-[0.8em] mb-10 uppercase">The Signature Experience</p>
          
          <h2 className="mb-10 font-heading text-3xl uppercase leading-none tracking-[0.02em] text-pts-parchment md:text-6xl">
            <span className="block overflow-hidden">
              <span ref={h2Line1Ref} className="inline-block will-change-transform">
                Redefining
              </span>
            </span>
            <span className="block overflow-hidden">
              <span ref={h2Line2Ref} className="inline-block will-change-transform text-pts-gold-2">
                Bespoke Travel
              </span>
            </span>
          </h2>
          
          <div className="flex justify-center">
            <LineRevealText 
              text="From the silence of AlUla to the vibrant pulse of the Red Sea, we curate moments that transcend the ordinary. Every journey is a signature, written specifically for you."
              className="text-[0.68rem] md:text-[0.76rem] uppercase tracking-[0.22em] leading-[2.45] text-pts-muted/80 max-w-2xl text-center"
            />
          </div>
          
          <div className="mt-16 h-px w-24 bg-pts-gold mx-auto" />
        </div>
      </div>

      {/* Frame markers */}
      <div className="absolute top-6 left-6 sm:top-10 sm:left-10 text-pts-gold/30 lux-heading text-[0.45rem] sm:text-[0.5rem] tracking-[0.5em] z-30">
        [ 24.7136 N / 46.6753 E ]
      </div>
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 text-pts-gold/30 lux-heading text-[0.45rem] sm:text-[0.5rem] tracking-[0.5em] z-30">
        BEYOND THE SCROLL
      </div>
    </div>
  </section>
);
}
