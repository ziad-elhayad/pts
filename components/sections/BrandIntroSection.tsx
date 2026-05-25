"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { TextScrollReveal } from "@/components/animations/TextScrollReveal";
import { heroMedia } from "@/lib/media";
import { t } from "@/lib/dictionary";
import { useLocale } from "@/contexts/LocaleContext";
import { prefersReducedMotion } from "@/lib/motionPref";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STATS = (_locale: string) => [] as const; // Stats labels now come from dictionary

/**
 * Brand intro — scroll-scrubbed “editorial depth” + kinetic stats (unique vs other sections).
 */
export function BrandIntroSection() {
  const { locale } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  const colRef = useRef<HTMLDivElement>(null);
  const imageShellRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      const root = sectionRef.current;

      const col = colRef.current;
      const shell = imageShellRef.current;
      const floater = floatRef.current;
      if (!root || !col || !shell || !mounted) return;

      if (prefersReducedMotion()) return;

      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      /* Floating gold glow — skip on mobile (infinite repeat = constant repaints) */
      if (floater && !isTouch) {
        gsap.to(floater, {
          y: -22,
          x: 15,
          rotation: 3,
          duration: 4.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      const accent = col.querySelector<HTMLElement>(".bi-accent");
      if (accent) {
        gsap.fromTo(
          accent,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power4.inOut",
            scrollTrigger: { trigger: col, start: "top 78%", once: true },
          },
        );
      }

      /* Image shell: iris reveal — desktop only (clip-path is GPU-heavy on mobile) */
      if (!isTouch) {
        gsap.fromTo(
          shell,
          { clipPath: "circle(18% at 50% 50%)", filter: "brightness(0.6)" },
          {
            clipPath: "circle(72% at 50% 48%)",
            filter: "brightness(1)",
            ease: "none",
            scrollTrigger: {
              trigger: shell,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      }

    },
    { scope: sectionRef, dependencies: [mounted] },
  );

  const title = t(locale, "brand.title");
  const titleWords = title.split(" ");

  return (
    <section
      ref={sectionRef}
      className="section-transition relative overflow-hidden border-t border-pts-line/20 min-h-[100svh] w-full flex flex-col justify-center py-20 sm:h-[100svh] sm:min-h-[700px] sm:py-0"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <div ref={imageShellRef} className="relative h-full w-full will-change-[clip-path,filter]">
          <ParallaxImage
            src={heroMedia.poster}
            alt="Aircraft wing over clouds"
            priority={false}
            intensity={16}
            zoomScrub
          />
        </div>
      </div>

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-pts-black via-pts-black/80 to-transparent opacity-100 sm:from-pts-black sm:via-pts-black/80" />
      <div className="absolute inset-0 z-10 bg-pts-black/50 sm:bg-pts-black/40" />
      
      {/* Glow Effects */}
      <div
        ref={floatRef}
        className="pointer-events-none absolute left-[10%] top-[20%] z-10 h-40 w-40 rounded-full bg-pts-gold/10 blur-[80px]"
        aria-hidden
      />

      <div className="relative z-20 mx-auto flex w-full max-w-[92rem] flex-col justify-center px-6 sm:px-[clamp(1.25rem,4vw,2.5rem)] items-center text-center">
        <div
          ref={colRef}
          className="max-w-4xl [transform-style:preserve-3d] flex flex-col items-center"
        >
          <div className="mb-4">
            <div className="mb-8 flex items-center justify-center gap-4 sm:mb-10">
              <div className="h-px w-8 bg-pts-gold" />
              <p className="lux-heading text-[0.5rem] tracking-[0.4em] text-pts-gold sm:text-[0.55rem] sm:tracking-[0.6em]">
                {t(locale, "brand.kicker")}
              </p>
              <div className="h-px w-8 bg-pts-gold" />
            </div>
            <TextScrollReveal as="h2" className="font-heading text-[clamp(1.4rem,6vw,2.4rem)] font-bold uppercase leading-[1.2] tracking-[0.08em] text-pts-parchment drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] sm:text-[clamp(1.85rem,4vw,3.2rem)] sm:leading-[1.12] sm:tracking-[0.12em]">
              {titleWords.map((w, i) => (
                <span key={i} className="mr-[0.22em] inline-block overflow-hidden align-baseline">
                  <span className="inline-block">{w}</span>
                </span>
              ))}
            </TextScrollReveal>
            <div className="bi-accent mt-6 h-[2px] w-16 scale-x-0 bg-pts-gold will-change-transform sm:mt-8 sm:w-24" />
          </div>

          <div className="bi-copy mt-8 max-w-2xl [transform-style:preserve-3d] sm:mt-10">
            <TextScrollReveal
              as="p"
              className="text-[0.7rem] font-bold uppercase leading-[2] tracking-[0.12em] text-pts-parchment drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-[0.95rem] sm:leading-[2.2] sm:tracking-[0.18em]"
              delay={90}
            >
              {t(locale, "brand.body")}
            </TextScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
