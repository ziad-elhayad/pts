"use client";

import { useRef, useState, useLayoutEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motionPref";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EXPERIENCES = [
  {
    id: 1,
    title: "Executive Retreats",
    category: "VIP Concierge",
    description:
      "Private villas, yacht charters, and curated desert escapes—composed as a personal narrative for C-suite executives.",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1600&q=80",
    tag: "Bespoke",
  },
  {
    id: 2,
    title: "Incentive Journeys",
    category: "MICE Excellence",
    description:
      "Reward programs that feel cinematic—destination pacing, sensory detail, and discreet recognition for elite performers.",
    image:
      "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1600&q=80",
    tag: "Corporate",
  },
  {
    id: 3,
    title: "AlUla & Saudi Luxury",
    category: "Destination",
    description:
      "Ancient landscapes, five-star camps, and cultural immersion through the lens of PTS's deep Saudi expertise.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
    tag: "Saudi Arabia",
  },
  {
    id: 4,
    title: "Global Conference Programs",
    category: "MICE",
    description:
      "From Jeddah to London, Tokyo to New York—large-scale orchestration with a boutique touch at every touchpoint.",
    image:
      "https://images.unsplash.com/photo-1540575467063-27a04d7b431c?auto=format&fit=crop&w=1600&q=80",
    tag: "Worldwide",
  },
] as const;

/**
 * Itineraries — pinned “control room” with scanline + GSAP-driven panel depth (unique).
 */
export function ExpandingItineraries() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const root = sectionRef.current;
      const scan = scanRef.current;
      if (!root || prefersReducedMotion()) return;

      if (scan) {
        gsap.fromTo(
          scan,
          { yPercent: -80 },
          {
            yPercent: 180,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      const panels = root.querySelectorAll<HTMLElement>(".exp-it-panel");
      panels.forEach((panel) => {
        const img = panel.querySelector("img");
        if (!img) return;
        gsap.fromTo(
          img,
          { scale: 1.14, yPercent: -6, rotate: 0.5 },
          {
            scale: 1.22,
            yPercent: 6,
            rotate: -0.5,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  useLayoutEffect(() => {
    panelsRef.current.forEach((panel, i) => {
      if (!panel) return;
      const detail = panel.querySelector<HTMLElement>(".exp-detail");
      const tag = panel.querySelector<HTMLElement>(".exp-tag");
      if (!detail || !tag) return;
      const active = i === activeIndex;
      if (active) {
        gsap.fromTo(
          tag,
          { opacity: 0, y: -8 },
          { opacity: 0.8, y: 0, duration: 0.45, ease: "power2.out" },
        );
        gsap.fromTo(
          detail,
          { autoAlpha: 0, y: 36, rotateX: 16, transformOrigin: "50% 0%" },
          { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.65, ease: "power3.out", delay: 0.08 },
        );
      } else {
        gsap.to(tag, { opacity: 0, y: -6, duration: 0.3, ease: "power2.in" });
        gsap.to(detail, { autoAlpha: 0, y: 24, duration: 0.35, ease: "power2.in" });
      }
    });
  }, [activeIndex]);

  return (
    <section
      ref={sectionRef}
      className="section-transition relative min-h-[600px] w-full overflow-hidden border-t border-pts-line/10 bg-pts-black/20 [perspective:2000px]"
    >
      <div
        className="pointer-events-none absolute -left-[20%] top-0 h-full w-[55%] rounded-full bg-pts-gold/[0.045] blur-[120px]"
        aria-hidden
      />
      <div
        ref={scanRef}
        className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-[32%] -translate-y-full bg-gradient-to-b from-pts-gold/10 via-transparent to-transparent opacity-70 mix-blend-screen will-change-transform"
        aria-hidden
      />

      <div className="relative flex flex-col sm:flex-row h-[120vh] sm:h-[90vh] min-h-[800px] sm:min-h-[600px] w-full items-stretch">
        {EXPERIENCES.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <div
              key={item.id}
              ref={(el) => {
                panelsRef.current[index] = el;
              }}
              role="button"
              tabIndex={0}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              className={clsx(
                "exp-it-panel relative h-full cursor-pointer overflow-hidden transition-[flex,filter] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d]",
                isActive ? "flex-[4.5] z-10" : "flex-[1] z-0 brightness-[0.68] hover:brightness-[0.88]",
              )}
            >
              <div className="absolute inset-0 will-change-transform">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className={clsx(
                    "object-cover transition-[transform,filter] duration-[2.2s] ease-out",
                    isActive ? "scale-100 saturate-[0.88]" : "scale-[1.12] saturate-[0.35] grayscale-[0.35]",
                  )}
                  priority={index === 0}
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-pts-black/60" />
              <div
                className={clsx(
                  "absolute inset-0 bg-pts-deep/30 transition-opacity duration-500",
                  isActive ? "opacity-0" : "opacity-100",
                )}
              />

              <div
                className={clsx(
                  "absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-pts-gold/35 to-transparent transition-opacity duration-700",
                  isActive ? "opacity-100" : "opacity-25",
                )}
              />

              <div className="absolute inset-0 flex flex-col justify-between overflow-hidden p-6 sm:p-10 lg:p-14">
                <div className="exp-tag lux-heading text-[0.48rem] tracking-[0.5em] text-pts-gold opacity-0">
                  {item.tag}
                </div>

                <div>
                  <div className="overflow-hidden">
                    <h3
                      className={clsx(
                        "font-heading font-light uppercase leading-[1.1] text-pts-gold-2 transition-transform duration-500",
                        isActive
                          ? "translate-y-0 text-[clamp(1.35rem,2.35vw,2.35rem)]"
                          : "translate-y-2 text-[1rem] sm:text-base sm:[writing-mode:vertical-rl] sm:rotate-180",
                      )}
                    >
                      {item.title}
                    </h3>
                  </div>

                  <div className={clsx("exp-detail pt-8", !isActive && "pointer-events-none invisible max-h-0 opacity-0")}>
                    <div className="pt-8">
                      <div className="mb-6 flex items-center gap-4">
                        <div className="h-px w-8 bg-pts-gold/50" />
                        <span className="lux-heading text-[0.48rem] tracking-[0.4em] text-pts-gold opacity-60">
                          {item.category}
                        </span>
                      </div>
                      <div className="glass-deep max-w-md border border-pts-gold/15 p-8">
                        <p className="text-[0.58rem] uppercase leading-[2.15] tracking-[0.2em] text-pts-gold-2/55">
                          {item.description}
                        </p>
                        <div className="mt-8 flex items-center gap-4">
                          <span className="lux-heading text-[0.48rem] tracking-[0.5em] text-pts-gold">Inquire</span>
                          <div className="h-px max-w-[60px] flex-1 bg-pts-gold/30" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute right-6 sm:right-8 top-6 sm:top-10 lux-heading text-[0.42rem] tracking-[0.4em] text-pts-gold/30">
                0{index + 1}
              </div>
            </div>
          );
        })}

        <div className="group relative hidden sm:flex h-full w-16 shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden border-l border-pts-gold/10 bg-pts-deep/80 transition-colors duration-700 hover:bg-pts-gold/10">
          <div className="absolute inset-0 origin-bottom scale-y-0 bg-pts-gold opacity-90 transition-transform duration-700 group-hover:scale-y-100" />
          <p
            className="relative whitespace-nowrap lux-heading text-[0.55rem] tracking-[0.6em] text-pts-gold/50 transition-colors duration-700 group-hover:text-pts-bg"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
          >
            EXPERIENCE ARCHITECTURE +
          </p>
        </div>
      </div>
    </section>
  );
}
