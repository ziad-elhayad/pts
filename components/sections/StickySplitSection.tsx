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
 * VIP split — rail-camera scroll: global yaw + per-stage depth stacks (unique motion).
 */
export function StickySplitSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    if (prefersReducedMotion()) return;

    const stages = containerRef.current.querySelectorAll(".split-stage");

    if (railRef.current) {
      gsap.fromTo(
        railRef.current,
        { rotateY: 9, xPercent: -2 },
        {
          rotateY: -11,
          xPercent: 2,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.65,
          },
        },
      );
    }

    stages.forEach((stage, idx) => {
      const img = stage.querySelector(".split-img");
      const content = stage.querySelector(".split-content-box");
      const number = stage.querySelector(".split-number");
      const frame = stage.querySelector(".split-image-frame");
      const titleWords = stage.querySelectorAll<HTMLElement>(".vip-word");
      const line = stage.querySelector(".vip-scroll-line");

      if (line) {
        gsap.to(line, { x: 10, duration: 1.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
      }

      if (frame) {
        gsap.fromTo(
          frame,
          { clipPath: "polygon(8% 12%, 92% 8%, 88% 92%, 12% 88%)" },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ease: "none",
            scrollTrigger: {
              trigger: stage,
              start: "top 88%",
              end: "top 22%",
              scrub: 0.75,
            },
          },
        );
      }

      if (img) {
        gsap.fromTo(
          img,
          { yPercent: -12, scale: 1.12, rotate: idx % 2 === 0 ? -1.2 : 1.2 },
          {
            yPercent: 12,
            scale: 1,
            rotate: 0,
            ease: "none",
            scrollTrigger: {
              trigger: stage,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      if (content) {
        gsap.fromTo(
          content,
          { rotateY: -14, x: -80, opacity: 0, transformOrigin: "left center" },
          {
            rotateY: 0,
            x: 0,
            opacity: 1,
            duration: 1.35,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stage,
              start: "top 72%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      if (number) {
        gsap.fromTo(
          number,
          { y: 120, opacity: 0, scale: 0.92 },
          {
            y: -40,
            opacity: 0.09,
            scale: 1.05,
            ease: "none",
            scrollTrigger: {
              trigger: stage,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      titleWords.forEach((w, wi) => {
        gsap.fromTo(
          w,
          { yPercent: 110, rotateZ: wi % 2 === 0 ? -6 : 6, opacity: 0 },
          {
            yPercent: 0,
            rotateZ: 0,
            opacity: 1,
            duration: 0.95,
            delay: wi * 0.06,
            ease: "power4.out",
            scrollTrigger: {
              trigger: stage,
              start: "top 68%",
              once: true,
            },
          },
        );
      });
    });
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-pts-black [perspective:1600px]"
    >
      <div
        ref={railRef}
        className="vip-rail transform-gpu [transform-style:preserve-3d] will-change-transform"
      >
        {pillars.map((item, i) => (
          <div
            key={i}
            className="split-stage relative flex min-h-screen items-center justify-center px-6 py-20 md:px-12"
          >
            <div className="split-number pointer-events-none absolute left-10 top-1/2 z-0 -translate-y-1/2 select-none lux-heading text-[25vw] text-pts-gold md:left-20">
              0{i + 1}
            </div>

            <div className="relative flex w-full flex-col items-center gap-12 px-8 sm:px-16 lg:flex-row lg:gap-0">
              <div className="split-image-frame relative z-10 aspect-[4/3] w-full overflow-hidden rounded-sm border border-pts-gold/10 lg:ml-auto lg:aspect-auto lg:h-[75vh] lg:w-2/3">
                <div className="split-img absolute inset-0 top-[-10%] h-[120%] w-full">
                  <Image
                    src={vipServiceMedia[i].src}
                    alt={vipServiceMedia[i].alt}
                    fill
                    className="object-cover brightness-[0.7] saturate-[0.8]"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-pts-black via-transparent to-transparent opacity-40" />
              </div>

              <div className="split-content-box glass-deep relative z-20 w-full border border-pts-gold/20 p-8 shadow-lux md:p-16 lg:absolute lg:left-0 lg:top-1/2 lg:w-1/2 lg:-translate-y-1/2 [transform-style:preserve-3d]">
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-px w-8 bg-pts-gold" />
                  <p className="lux-heading text-[0.45rem] uppercase tracking-[0.6em] text-pts-gold">VIP Concierge</p>
                </div>

                <h3 className="mb-8 font-heading text-2xl uppercase leading-[1.12] tracking-[0.05em] text-pts-parchment md:text-5xl">
                  {item.title.split(" ").map((word, wi) => (
                    <span key={wi} className="mr-[0.22em] inline-block overflow-hidden align-baseline">
                      <span className="vip-word inline-block will-change-transform">{word}</span>
                    </span>
                  ))}
                </h3>

                <p className="mb-12 max-w-sm text-[0.68rem] uppercase leading-[2.35] tracking-[0.2em] text-pts-muted/70">
                  {item.description}
                </p>

                {i === pillars.length - 1 ? (
                  <MagneticButton href="/vip-concierge" className="btn-gold-glow px-12 py-5 text-[0.65rem]">
                    Explore VIP
                  </MagneticButton>
                ) : (
                  <div className="flex items-center gap-3 text-pts-gold/40">
                    <span className="lux-heading text-[0.5rem] uppercase tracking-[0.4em]">Scroll to uncover</span>
                    <div className="vip-scroll-line h-px w-6 bg-pts-gold/40 will-change-transform" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
