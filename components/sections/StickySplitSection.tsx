"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { vipServiceMedia } from "@/lib/media";
import { prefersReducedMotion } from "@/lib/motionPref";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const pillars = [
  {
    title: "Executive lifestyle",
    description: "Calendars, households, and travel ecosystems—handled with quiet precision.",
  },
  {
    title: "Luxury reservations",
    description: "Tables, suites, and private rooms secured through relationships—not algorithms.",
  },
  {
    title: "Private transport",
    description: "Chauffeured fleets, aviation coordination, and arrival choreography.",
  },
  {
    title: "Exclusive access",
    description: "Behind-the-velvet moments: private viewings and curated introductions.",
  },
] as const;

/**
 * VIP split — overlapping stacked panels.
 * As the user scrolls, each subsequent panel slides up over the previous one.
 */
export function StickySplitSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    if (prefersReducedMotion()) return;

    const stages = containerRef.current.querySelectorAll(".split-stage");

    // Pin the entire container
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${stages.length * 100}%`,
        pin: true,
        scrub: 1,
      },
    });

    stages.forEach((stage, idx) => {
      // The first stage is already visible, don't animate its entry
      if (idx > 0) {
        gsap.set(stage, { yPercent: 100 });
        
        // Slide up the current stage
        tl.to(stage, {
          yPercent: 0,
          ease: "none",
        }, idx - 1); // Sequence it based on index

        // Push the previous stage back slightly
        const prevStage = stages[idx - 1];
        tl.to(prevStage, {
          scale: 0.95,
          opacity: 0.5,
          yPercent: -5,
          ease: "none"
        }, idx - 1);
      }

      // Internal parallax for the image inside the stage
      const img = stage.querySelector(".split-img");
      if (img) {
        gsap.fromTo(img, 
          { yPercent: -15 },
          {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: () => `top+=${idx * window.innerHeight} top`,
              end: () => `+=${window.innerHeight}`,
              scrub: true,
            }
          }
        );
      }
    });

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] w-full overflow-hidden bg-pts-black"
    >
      {pillars.map((item, i) => (
        <div
          key={i}
          className="split-stage absolute inset-0 flex h-[100svh] w-full items-center justify-center bg-pts-black px-4 sm:px-6 md:px-12 origin-top will-change-transform shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
          style={{ zIndex: i }}
        >
          <div className="split-number pointer-events-none absolute left-4 sm:left-10 top-1/2 z-0 -translate-y-1/2 select-none lux-heading text-[35vw] sm:text-[25vw] text-pts-gold md:left-20 opacity-10">
            0{i + 1}
          </div>

          <div className="relative flex w-full max-w-6xl flex-col items-center gap-0 sm:gap-12 px-0 sm:px-8 lg:flex-row lg:gap-0 lg:px-16 pt-16 sm:pt-0">
            <div className="split-image-frame relative z-10 aspect-[16/11] max-h-[40svh] sm:max-h-none sm:aspect-[4/3] w-full overflow-hidden rounded-sm border border-pts-gold/10 lg:ml-auto lg:aspect-auto lg:h-[75vh] lg:w-2/3">
              <div className="absolute inset-0 top-[-15%] h-[130%] w-full">
                <Image
                  src={vipServiceMedia[i].src}
                  alt={vipServiceMedia[i].alt}
                  fill
                  className="split-img object-cover brightness-[0.95] saturate-[0.9] will-change-transform"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-pts-black via-transparent to-transparent opacity-20" />
            </div>

            <div className="split-content-box glass-deep relative z-20 w-[95%] sm:w-full border border-pts-gold/20 p-5 sm:p-8 shadow-lux md:p-14 lg:absolute lg:left-0 lg:top-1/2 lg:w-1/2 lg:-translate-y-1/2 -mt-10 sm:mt-0">
              <div className="mb-4 sm:mb-6 flex items-center gap-4">
                <div className="h-px w-8 bg-pts-gold" />
                <p className="lux-heading text-[0.45rem] uppercase tracking-[0.6em] text-pts-gold">VIP Concierge</p>
              </div>

              <h3 className="mb-4 sm:mb-8 font-heading text-xl sm:text-2xl uppercase leading-[1.12] tracking-[0.05em] text-pts-parchment md:text-5xl">
                {item.title}
              </h3>

              <p className="mb-6 sm:mb-12 max-w-sm text-[0.6rem] sm:text-[0.68rem] uppercase leading-[2.1] sm:leading-[2.35] tracking-[0.2em] text-pts-muted/70">
                {item.description}
              </p>

              {i === pillars.length - 1 ? (
                <MagneticButton href="/vip-concierge" className="btn-gold-glow w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 text-[0.65rem]">
                  Explore VIP
                </MagneticButton>
              ) : (
                <div className="flex items-center gap-3 text-pts-gold/40">
                  <span className="lux-heading text-[0.5rem] uppercase tracking-[0.4em]">Scroll to uncover</span>
                  <div className="vip-scroll-line h-px w-6 bg-pts-gold/40" />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
