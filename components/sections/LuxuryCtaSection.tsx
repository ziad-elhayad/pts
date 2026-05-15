"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ctaBackdrop } from "@/lib/media";
import { site } from "@/lib/site";
import { t } from "@/lib/dictionary";
import { useLocale } from "@/contexts/LocaleContext";
import { prefersReducedMotion } from "@/lib/motionPref";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function LuxuryCtaSection() {
  const { locale } = useLocale();
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const orbARef = useRef<HTMLDivElement>(null);
  const orbBRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      const bg = bgRef.current;
      const text = textRef.current;
      const orbA = orbARef.current;
      const orbB = orbBRef.current;
      const div = dividerRef.current;
      if (!bg || !text || !mounted) return;

      if (prefersReducedMotion()) {
        gsap.set(text.querySelectorAll("[data-cta-reveal]"), { opacity: 1, clearProps: "transform" });
        return;
      }

      gsap.fromTo(
        bg,
        { yPercent: -18, scale: 1.05 },
        {
          yPercent: 18,
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0,
          },
        },
      );

      if (orbA && orbB) {
        gsap.to(orbA, {
          xPercent: 22,
          yPercent: -14,
          scale: 1.2,
          duration: 7,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        gsap.to(orbB, {
          xPercent: -18,
          yPercent: 12,
          scale: 1.15,
          duration: 9,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: text,
          start: "top 78%",
          once: true,
        },
      });

      tl.fromTo(
        text.querySelectorAll("[data-cta-reveal]"),
        { opacity: 0, y: 70, rotateX: 22, transformOrigin: "50% 100%", filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 1.2,
          stagger: 0.14,
          ease: "power4.out",
        },
      );

      if (div) {
        tl.fromTo(div, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1.1, ease: "power3.inOut" }, 0.35);
      }
    },
    { scope: sectionRef, dependencies: [mounted] },
  );

  return (
    <section
      ref={sectionRef}
      className="section-transition relative flex min-h-[80vh] items-center overflow-hidden [perspective:1600px]"
    >
      <div ref={bgRef} className="absolute inset-[-22%] z-0 will-change-transform gpu-layer">
        <Image
          src={ctaBackdrop}
          alt=""
          fill
          className="object-cover brightness-[0.5] saturate-[0.7]"
          sizes="100vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pts-deep via-pts-deep/40 to-pts-deep" />
        <div className="absolute inset-0 bg-pts-black/30" />
      </div>

      <div
        ref={orbARef}
        className="pointer-events-none absolute -left-[10%] top-1/4 z-[1] h-[55vh] w-[55vh] rounded-full bg-pts-gold/8 blur-[100px] will-change-transform"
        aria-hidden
      />
      <div
        ref={orbBRef}
        className="pointer-events-none absolute -right-[8%] bottom-0 z-[1] h-[45vh] w-[45vh] rounded-full bg-pts-gold-2/6 blur-[90px] will-change-transform"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
        <div className="gold-glow absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 opacity-20" />
      </div>

      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-pts-gold/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pts-gold/15 to-transparent" />

      <div
        ref={textRef}
        className="relative z-10 mx-auto w-full max-w-[92rem] transform-gpu px-6 py-20 text-center [transform-style:preserve-3d] sm:px-[clamp(1.25rem,4vw,2.5rem)] sm:py-28"
      >
        <div data-cta-reveal className="mb-10 flex items-center justify-center gap-4 sm:mb-14 sm:gap-5">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-pts-gold/50 sm:w-16" />
          <p className="lux-heading text-[0.5rem] tracking-[0.5em] text-pts-gold sm:text-[0.54rem] sm:tracking-[0.8em]">Inquiry</p>
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-pts-gold/50 sm:w-16" />
        </div>

        <h2
          data-cta-reveal
          className="font-heading text-[clamp(1.3rem,6vw,3.15rem)] uppercase leading-[1.1] tracking-[0.06em] text-pts-parchment sm:text-[clamp(1.6rem,3.6vw,3.15rem)] sm:leading-[1.06] sm:tracking-[0.1em]"
        >
          {t(locale, "lux.cta.title")}
        </h2>

        <div
          ref={dividerRef}
          className="mx-auto mt-10 h-px w-16 origin-center scale-x-0 bg-pts-gold/35 will-change-transform sm:mt-14 sm:w-20"
        />

        <p
          data-cta-reveal
          className="mx-auto mt-10 max-w-2xl text-[0.56rem] uppercase leading-[2.1] tracking-[0.15em] text-pts-gold-2 sm:mt-12 sm:text-[0.6rem] sm:leading-[2.35] sm:tracking-[0.2em]"
        >
          {t(locale, "lux.cta.body")}
        </p>

        <div data-cta-reveal className="mt-10 flex flex-col items-center justify-center gap-4 sm:mt-16 sm:flex-row sm:gap-6">
          <MagneticButton href="/contact" className="btn-gold-glow w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 text-[0.65rem] sm:text-[0.68rem]">
            {t(locale, "cta.begin")}
          </MagneticButton>
          <MagneticButton
            href={site.whatsapp}
            className="border-pts-gold/25 bg-pts-gold/5 w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 text-[0.65rem] sm:text-[0.68rem] text-pts-gold"
          >
            {t(locale, "cta.whatsapp")}
          </MagneticButton>
        </div>

        <p data-cta-reveal className="mt-16 lux-heading text-[0.38rem] tracking-[0.5em] text-pts-gold sm:mt-20 sm:text-[0.42rem] sm:tracking-[0.8em]">
          PTS · JEDDAH · GLOBAL OPERATIONS · EST. 2010
        </p>
      </div>
    </section>
  );
}
