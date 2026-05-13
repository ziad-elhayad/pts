"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { LineRevealText } from "@/components/animations/LineRevealText";
import { brandMedia } from "@/lib/media";
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
  const statsRef = useRef<HTMLDivElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const imageShellRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      const stats = statsRef.current;
      const col = colRef.current;
      const shell = imageShellRef.current;
      const floater = floatRef.current;
      if (!root || !stats || !col || !shell) return;

      if (prefersReducedMotion()) return;

      /* Floating gold shards — ambient */
      if (floater) {
        gsap.to(floater, {
          y: -18,
          x: 12,
          rotation: 2,
          duration: 6.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      /* Title: line mask + skew scrub */
      const titleWords = col.querySelectorAll<HTMLElement>(".biw");
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

      const accent = col.querySelector<HTMLElement>(".bi-accent");
      if (accent) {
        gsap.fromTo(
          accent,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.inOut",
            scrollTrigger: { trigger: col, start: "top 78%", once: true },
          },
        );
      }

      /* Copy block: depth + slight rotate scrub */
      const copy = col.querySelector<HTMLElement>(".bi-copy");
      if (copy) {
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

      /* Image shell: dual-depth parallax + iris mask */
      gsap.fromTo(
        shell,
        { clipPath: "circle(18% at 50% 50%)", filter: "brightness(0.45)" },
        {
          clipPath: "circle(72% at 50% 48%)",
          filter: "brightness(0.85)",
          ease: "none",
          scrollTrigger: {
            trigger: shell,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );

      const counters = stats.querySelectorAll<HTMLElement>("[data-stat-val]");
      counters.forEach((el) => {
        const target = parseInt(el.dataset.statVal ?? "0", 10);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2.4,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = Math.round(obj.val).toString();
          },
        });
      });

      gsap.fromTo(
        stats.querySelectorAll(".stat-card"),
        { rotateX: -55, z: -140, opacity: 0, transformOrigin: "50% 100%" },
        {
          rotateX: 0,
          z: 0,
          opacity: 1,
          duration: 1.25,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: stats,
            start: "top 82%",
            once: true,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  const title = t(locale, "brand.title");
  const titleWords = title.split(" ");

  return (
    <section
      ref={sectionRef}
      className="section-transition relative overflow-hidden border-t border-pts-line/20 bg-pts-black/30 [perspective:1600px]"
    >
      <div
        ref={floatRef}
        className="pointer-events-none absolute right-[8%] top-[20%] h-40 w-40 rounded-full bg-pts-gold/5 blur-3xl"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="gold-glow absolute -top-32 left-1/4 h-[60%] w-[60%] opacity-20" />
      </div>

      <div className="mx-auto grid w-full max-w-[92rem] transform-gpu items-stretch gap-0 px-[clamp(1.25rem,3vw,2.5rem)] sm:px-[clamp(1.25rem,4vw,2.5rem)] lg:grid-cols-2">
        <div
          ref={colRef}
          className="flex flex-col justify-center py-24 [transform-style:preserve-3d] lg:py-36 lg:pr-20"
        >
          <div className="mb-4">
            <div className="mb-10 flex items-center gap-4">
              <div className="h-px w-8 bg-pts-gold/60" />
              <p className="lux-heading text-[0.55rem] tracking-[0.6em] text-pts-gold opacity-70">PTS</p>
            </div>
            <h2 className="font-heading text-[clamp(1.55rem,3.1vw,2.65rem)] uppercase leading-[1.12] tracking-[0.1em] text-pts-parchment">
              {titleWords.map((w, i) => (
                <span key={i} className="mr-[0.22em] inline-block overflow-hidden align-baseline">
                  <span className="biw inline-block will-change-transform">{w}</span>
                </span>
              ))}
            </h2>
            <div className="bi-accent mt-8 h-px w-20 scale-x-0 bg-gradient-to-r from-pts-gold to-transparent will-change-transform" />
          </div>

          <div className="bi-copy mt-8 max-w-md [transform-style:preserve-3d]">
            <LineRevealText
              text={t(locale, "brand.body")}
              mode="cascade"
              className="text-[0.64rem] uppercase leading-[2.35] tracking-[0.2em] text-pts-muted/70"
            />
          </div>

          <div
            ref={statsRef}
            className="mt-16 grid grid-cols-2 gap-px border border-pts-gold/10 bg-pts-gold/10 [transform-style:preserve-3d]"
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="stat-card group relative bg-pts-bg/80 p-8 transition-colors duration-500 will-change-transform lg:p-10 hover:bg-pts-black/60"
              >
                <div className="absolute right-4 top-4 h-4 w-4 border-t border-r border-pts-gold/20 transition-colors duration-500 group-hover:border-pts-gold/50" />

                <div className="flex items-end gap-0.5">
                  <span
                    className="stat-number lux-heading text-[clamp(1.45rem,3vw,2.35rem)] leading-none text-pts-gold"
                    data-stat-val={s.value}
                  >
                    0
                  </span>
                  <span className="lux-heading mb-1 text-xl leading-none text-pts-gold/60">{s.suffix}</span>
                </div>
                <p className="mt-3 text-[0.58rem] uppercase leading-loose tracking-[0.35em] text-pts-muted/50">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[60vh] overflow-hidden lg:min-h-0">
          <div ref={imageShellRef} className="relative h-full min-h-[60vh] overflow-hidden lg:min-h-0 will-change-[clip-path,filter]">
            <ParallaxImage
              src={brandMedia.intro}
              alt="Luxury suite interior with evening light"
              priority={false}
              intensity={16}
              zoomScrub
            />
          </div>
        </div>
      </div>
    </section>
  );
}
