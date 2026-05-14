"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { LineRevealText } from "@/components/animations/LineRevealText";
import { heroMedia } from "@/lib/media";
import { t } from "@/lib/dictionary";
import { useLocale } from "@/contexts/LocaleContext";
import { prefersReducedMotion } from "@/lib/motionPref";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STATS = [
  { value: 14, suffix: "+", label: "Years of Excellence" },
  { value: 38, suffix: "", label: "Global Destinations" },
  { value: 100, suffix: "%", label: "Bespoke Execution" },
  { value: 24, suffix: "/7", label: "Concierge Access" },
] as const;

/**
 * Brand intro — scroll-scrubbed “editorial depth” + kinetic stats (unique vs other sections).
 */
export function BrandIntroSection() {
  const { locale } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);

  const colRef = useRef<HTMLDivElement>(null);
  const imageShellRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;

      const col = colRef.current;
      const shell = imageShellRef.current;
      const floater = floatRef.current;
      if (!root || !col || !shell) return;

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

      /* Title words */
      const titleWords = col.querySelectorAll<HTMLElement>(".biw");

      if (isTouch) {
        // Mobile: simple staggered fade-in
        gsap.fromTo(
          titleWords,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { 
              trigger: col, 
              start: "top 98%", 
              end: "top 60%", 
              scrub: 0.5 
            },
          },
        );
      } else {
        // Desktop: scrub with skew
        gsap.fromTo(
          titleWords,
          { yPercent: 120, skewY: 6, opacity: 0.15 },
          {
            yPercent: 0,
            skewY: 0,
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: {
              trigger: col,
              start: "top 88%",
              end: "top 42%",
              scrub: 0.45,
            },
          },
        );
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

      /* Copy block */
      const copy = col.querySelector<HTMLElement>(".bi-copy");
      if (copy) {
        if (isTouch) {
          gsap.fromTo(
            copy,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: { trigger: copy, start: "top 92%", once: true },
            },
          );
        } else {
          gsap.fromTo(
            copy,
            { rotateX: 12, y: 40, transformOrigin: "50% 0%", opacity: 0.2 },
            {
              rotateX: 0,
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: copy,
                start: "top 92%",
                end: "top 55%",
                scrub: 0.6,
              },
            },
          );
        }
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
    { scope: sectionRef },
  );

  const title = t(locale, "brand.title");
  const titleWords = title.split(" ");

  return (
    <section
      ref={sectionRef}
      className="section-transition relative overflow-hidden border-t border-pts-line/20 h-[100svh] min-h-[500px] sm:min-h-[700px] w-full"
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
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-pts-black via-pts-black/80 to-transparent opacity-100" />
      <div className="absolute inset-0 z-10 bg-pts-black/40" />
      
      {/* Glow Effects */}
      <div
        ref={floatRef}
        className="pointer-events-none absolute left-[10%] top-[20%] z-10 h-40 w-40 rounded-full bg-pts-gold/10 blur-[80px]"
        aria-hidden
      />

      <div className="relative z-20 mx-auto flex h-full w-full max-w-[92rem] flex-col justify-center px-[clamp(1.25rem,3vw,2.5rem)] sm:px-[clamp(1.25rem,4vw,2.5rem)]">
        <div
          ref={colRef}
          className="max-w-4xl [transform-style:preserve-3d]"
        >
          <div className="mb-4">
            <div className="mb-10 flex items-center gap-4">
              <div className="h-px w-8 bg-pts-gold" />
              <p className="lux-heading text-[0.55rem] tracking-[0.6em] text-pts-gold">
                {t(locale, "brand.kicker")}
              </p>
            </div>
            <h2 className="font-heading text-[clamp(1.5rem,5vw,2.4rem)] sm:text-[clamp(1.85rem,4vw,3.2rem)] font-bold uppercase leading-[1.12] tracking-[0.12em] text-pts-parchment drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
              {titleWords.map((w, i) => (
                <span key={i} className="mr-[0.22em] inline-block overflow-hidden align-baseline">
                  <span className="biw inline-block will-change-transform">{w}</span>
                </span>
              ))}
            </h2>
            <div className="bi-accent mt-8 h-[2px] w-24 scale-x-0 bg-pts-gold will-change-transform" />
          </div>

          <div className="bi-copy mt-10 max-w-2xl [transform-style:preserve-3d]">
            <LineRevealText
              text={t(locale, "brand.body")}
              mode="cascade"
              className="text-[0.8rem] sm:text-[0.95rem] font-bold uppercase leading-[2.2] tracking-[0.18em] text-pts-parchment drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
            />
          </div>


        </div>
      </div>
    </section>
  );
}
