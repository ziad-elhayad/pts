"use client";

import { useRef, useState, useEffect } from "react";
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
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
    tag: "Bespoke",
  },
  {
    id: 2,
    title: "Incentive Journeys",
    category: "MICE Excellence",
    description:
      "Reward programs that feel cinematic—destination pacing, sensory detail, and discreet recognition for elite performers.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
    tag: "Corporate",
  },
  {
    id: 3,
    title: "AlUla & Saudi Luxury",
    category: "Destination",
    description:
      "Ancient landscapes, five-star camps, and cultural immersion through the lens of PTS's deep Saudi expertise.",
    image:
      "https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&w=1600&q=80",
    tag: "Saudi Arabia",
  },
  {
    id: 4,
    title: "Global Conference Programs",
    category: "MICE",
    description:
      "From Jeddah to London, Tokyo to New York—large-scale orchestration with a boutique touch at every touchpoint.",
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1600&q=80",
    tag: "Worldwide",
  },
] as const;

/**
 * Itineraries — pinned “control room” with scanline + GSAP-driven panel depth (unique).
 */
export function ExpandingItineraries() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      const root = sectionRef.current;
      const scan = scanRef.current;
      if (!root || prefersReducedMotion() || !mounted) return;

      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      if (scan && !isTouch) {
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

      // Skip image parallax on mobile — causes 4 simultaneous scrubbing tweens
      if (!isTouch) {
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
      }
    },
    { scope: sectionRef, dependencies: [mounted] },
  );

  useEffect(() => {
    if (!mounted) return;
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
          { opacity: 0.8, y: 0, duration: 1.0, ease: "power2.out", delay: 0.4 }
        );
        gsap.fromTo(
          detail,
          { autoAlpha: 0, y: 36, rotateX: 16, transformOrigin: "50% 0%" },
          { autoAlpha: 1, y: 0, rotateX: 0, duration: 1.2, ease: "power3.out", delay: 0.5 }
        );
      } else {
        gsap.to(tag, { opacity: 0, y: -6, duration: 0.6, ease: "power2.in" });
        gsap.to(detail, { autoAlpha: 0, y: 24, duration: 0.7, ease: "power2.in" });
      }
    });
  }, [activeIndex, mounted]);

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

      <div className="relative flex flex-col sm:flex-row h-auto min-h-[140svh] sm:h-[90vh] sm:min-h-[600px] w-full items-stretch">
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
              onMouseEnter={() => (!('ontouchstart' in window) ? setActiveIndex(index) : undefined)}
              onClick={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              className={clsx(
                "exp-it-panel relative cursor-pointer overflow-hidden transition-[flex,filter] duration-[1600ms] ease-[cubic-bezier(0.25,1,0.5,1)] [transform-style:preserve-3d]",
                isActive 
                  ? "flex-[8] sm:flex-[4.5] z-10 min-h-[450px]" 
                  : "flex-[1] sm:flex-[1] z-0 brightness-[0.5] hover:brightness-[0.8] min-h-[80px] sm:min-h-0",
              )}
            >
              <div className="absolute inset-0 will-change-transform">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className={clsx(
                    "object-cover object-center transition-[filter] duration-[1.4s] ease-out",
                    isActive ? "saturate-100 brightness-[0.7] sm:brightness-100" : "saturate-[0.2] brightness-[0.4]",
                  )}
                  priority={index === 0}
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-b from-pts-black/40 via-transparent to-pts-black/90" />
              <div
                className={clsx(
                  "absolute inset-0 bg-pts-deep/40 transition-opacity duration-700",
                  isActive ? "opacity-0" : "opacity-100",
                )}
              />

              <div
                className={clsx(
                  "absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-pts-gold/35 to-transparent transition-opacity duration-700 sm:w-[1.5px]",
                  isActive ? "opacity-100" : "opacity-25",
                )}
              />

              <div className="absolute inset-0 flex flex-col justify-between overflow-hidden p-6 sm:p-10 lg:p-14">
                <div className="exp-tag lux-heading text-[0.45rem] tracking-[0.4em] text-pts-gold opacity-0 sm:text-[0.48rem] sm:tracking-[0.5em]">
                  {item.tag}
                </div>

                <div>
                  <div className="relative h-16 sm:h-20 flex items-center">
                    <h3
                      className={clsx(
                        "font-heading font-light uppercase leading-[1.1] text-pts-gold-2 transition-all duration-[1600ms] origin-left sm:origin-center",
                        isActive
                          ? "rotate-0 text-[clamp(1.1rem,5vw,2.35rem)] opacity-100"
                          : "rotate-0 sm:-rotate-90 text-[0.65rem] sm:text-lg opacity-60 whitespace-nowrap",
                      )}
                    >
                      {item.title}
                    </h3>
                  </div>

                  <div className={clsx("exp-detail", !isActive && "pointer-events-none invisible max-h-0 opacity-0")}>
                    <div className="pt-4 sm:pt-8">
                      <div className="mb-4 flex items-center gap-4 sm:mb-6">
                        <div className="h-px w-6 bg-pts-gold/50 sm:w-8" />
                        <span className="lux-heading text-[0.45rem] tracking-[0.4em] text-pts-gold opacity-60 sm:text-[0.48rem]">
                          {item.category}
                        </span>
                      </div>
                      <div className="glass-deep max-w-md border border-pts-gold/15 p-6 sm:p-8">
                        <p className="text-[0.52rem] uppercase leading-[2] tracking-[0.15em] text-pts-gold-2/80 sm:text-[0.58rem] sm:leading-[2.15] sm:tracking-[0.2em]">
                          {item.description}
                        </p>
                        <div className="mt-6 flex items-center gap-4 sm:mt-8">
                          <span className="lux-heading text-[0.45rem] tracking-[0.4em] text-pts-gold sm:text-[0.48rem] sm:tracking-[0.5em]">Inquire</span>
                          <div className="h-px max-w-[40px] flex-1 bg-pts-gold/30" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute right-6 top-6 lux-heading text-[0.4rem] tracking-[0.3em] text-pts-gold/30 sm:right-8 sm:top-10 sm:text-[0.42rem] sm:tracking-[0.4em]">
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
