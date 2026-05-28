"use client";

import { useRef, useEffect, memo, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VideoSection } from "@/components/VideoSection";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FloatingScrollIndicator } from "@/components/ui/FloatingCTA";
import { heroMedia } from "@/lib/media";
import { t } from "@/lib/dictionary";
import { useLocale } from "@/contexts/LocaleContext";
import { usePerformance } from "@/contexts/PerformanceContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const CinematicHero = memo(function CinematicHero() {
  const { locale } = useLocale();
  const sectionRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);
  const botLineRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const { isLowEnd, reducedMotion } = usePerformance();

  useEffect(() => {
    setMounted(true);
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isTouch || isLowEnd) return;

    const onMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current = {
        x: (e.clientX / innerWidth - 0.5) * 2,
        y: (e.clientY / innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isLowEnd, isTouch]);

  useEffect(() => {
    if (isTouch || isLowEnd) return;

    const setL1X = gsap.quickSetter(layer1Ref.current, "x", "px");
    const setL1Y = gsap.quickSetter(layer1Ref.current, "y", "px");
    const setL2X = gsap.quickSetter(layer2Ref.current, "x", "px");
    const setL2Y = gsap.quickSetter(layer2Ref.current, "y", "px");

    let xLerp = 0;
    let yLerp = 0;

    const tick = () => {
      const { x, y } = mouseRef.current;
      xLerp += (x - xLerp) * 0.08;
      yLerp += (y - yLerp) * 0.08;
      setL1X(xLerp * -22);
      setL1Y(yLerp * -12);
      setL2X(xLerp * 14);
      setL2Y(yLerp * 8);
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [isLowEnd, isTouch]);

  const tagline = t(locale, "hero.tagline");
  const words = tagline.split(" ");

  useGSAP(
    () => {
      const kicker = sectionRef.current?.querySelector(".hero-kicker");
      const wordInners = sectionRef.current?.querySelectorAll(".hero-word-inner");
      const sub = sectionRef.current?.querySelector(".hero-sub");
      const ctas = sectionRef.current?.querySelector(".hero-cta");
      const scrollEl = sectionRef.current?.querySelector(".hero-scroll-hint");
      const coords = sectionRef.current?.querySelector(".hero-coords");

      if (reducedMotion || isTouch) {
        gsap.set([kicker, wordInners, sub, ctas, scrollEl, coords, topLineRef.current, botLineRef.current], {
          opacity: 1,
          clearProps: "transform,filter",
        });
        return;
      }

      if (!topLineRef.current || !botLineRef.current || !kicker || !sub || !ctas || !scrollEl || !coords || !wordInners || !mounted) return;

      const intro = gsap.timeline({ 
        defaults: { ease: "expo.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "center center",
          toggleActions: "play reverse play reverse",
        },
      });
      intro.fromTo(topLineRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1.6 }, 0);
      intro.fromTo(botLineRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1.6 }, 0.12);
      intro.fromTo(kicker, { opacity: 0, x: -40, filter: isLowEnd ? "none" : "blur(8px)" }, { opacity: 1, x: 0, filter: "none", duration: 1 }, 0.2);
      intro.fromTo(wordInners, { yPercent: 125, rotateX: isLowEnd ? 0 : 56, opacity: 0.2 }, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.25, stagger: 0.09 }, 0.35);
      intro.fromTo(sub, { opacity: 0, y: 36, filter: isLowEnd ? "none" : "blur(10px)" }, { opacity: 1, y: 0, filter: "none", duration: 1.2 }, 0.75);
      intro.fromTo(ctas, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.15 }, 0.95);
      intro.fromTo(scrollEl, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9 }, 1.15);
      intro.fromTo(coords, { opacity: 0, y: 10 }, { opacity: 0.35, y: 0, duration: 1 }, 1.35);



      if (auroraRef.current && !isLowEnd && !isTouch) {
        gsap.to(auroraRef.current, { rotate: 360, duration: 60, repeat: -1, ease: "none" });

      }
    },
    { scope: sectionRef, dependencies: [locale, isLowEnd, reducedMotion, mounted, isTouch], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      const media = mediaRef.current;
      const content = contentRef.current;
      const overlay = overlayRef.current;
      if (!media || !content || !mounted) return;

      if (isTouch) {
        gsap.set(media, { clearProps: "transform" });
      } else {
        gsap.to(media, {
        yPercent: isLowEnd || isTouch ? 15 : 32,
        scale: isLowEnd || isTouch ? 1 : 1.12,
        rotateY: isLowEnd || isTouch ? 0 : -4,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: isLowEnd ? 0.1 : (isTouch ? 0.3 : 0),
        },
        });
      }

      // Removed fade-out animation to keep content visible during scroll

      if (!isTouch) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
          scrub: true,
          anticipatePin: 1,
        });
      }

      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: isTouch ? 0.4 : true,
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [isLowEnd, mounted, isTouch], revertOnUpdate: true },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[500px] sm:min-h-[700px] w-full overflow-hidden bg-pts-deep [perspective:1600px] touch-pan-y"
    >
      {mounted && !isLowEnd && !isTouch && (
        <div
          ref={auroraRef}
          className="pointer-events-none absolute -left-1/2 top-1/2 z-[1] h-[180%] w-[200%] -translate-y-1/2 opacity-30 will-change-transform"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(168,143,100,0.06) 60deg, transparent 120deg, rgba(207,186,144,0.04) 200deg, transparent 280deg)",
          }}
          aria-hidden
        />
      )}

      <div
        ref={mediaRef}
        className="gpu-layer absolute inset-[-8%] will-change-transform [transform-style:preserve-3d]"
        style={{ transformOrigin: "center center" }}
      >
        <VideoSection
          poster={heroMedia.poster}
          src={heroMedia.videoHd}
          srcLarge={heroMedia.videoUhd}
          imagePriority
          className="h-full w-full"
          overlayClassName="none"
          lazyVideo
        />
      </div>

      {mounted && !isLowEnd && !isTouch && (
        <>
          <div
            ref={layer1Ref}
            className="pointer-events-none absolute inset-[-5%] z-[2] will-change-transform"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 30% 40%, rgba(168,143,100,0.08) 0%, transparent 60%)",
            }}
          />
          <div
            ref={layer2Ref}
            className="pointer-events-none absolute inset-[-5%] z-[3] will-change-transform"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 70% 60%, rgba(13,13,15,0.25) 0%, transparent 60%)",
            }}
          />
        </>
      )}

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-[4] opacity-75"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,13,15,0.7) 0%, rgba(13,13,15,0.4) 35%, rgba(13,13,15,0.7) 75%, rgba(13,13,15,0.95) 100%)",
        }}
        aria-hidden
      />

      {!isTouch && (
        <div className="pointer-events-none absolute inset-0 z-[5] mix-blend-soft-light" aria-hidden>
          <div className="mist-drift absolute -left-1/4 top-0 h-[120%] w-[150%] opacity-30" />
          <div className="mist-drift-slow absolute -right-1/3 top-1/4 h-full w-[140%] opacity-20" />
        </div>
      )}

      <div
        ref={topLineRef}
        className="pointer-events-none absolute left-0 right-0 top-0 z-[6] h-px origin-center scale-x-0 will-change-transform"
        style={{ background: "linear-gradient(90deg, transparent, rgba(168,143,100,0.35), transparent)" }}
      />
      <div
        ref={botLineRef}
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[6] h-px origin-center scale-x-0 will-change-transform"
        style={{ background: "linear-gradient(90deg, transparent, rgba(168,143,100,0.22), transparent)" }}
      />

      <div
        ref={contentRef}
        className="hero-content relative z-10 flex h-full transform-gpu flex-col justify-end px-6 pb-20 pt-32 [transform-style:preserve-3d] sm:px-10 sm:pb-24 sm:pt-40 lg:px-20"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="hero-kicker mb-6 flex items-center gap-4 sm:mb-8 sm:gap-5">
            <div className="h-px w-8 bg-pts-gold sm:w-12" />
            <p className="lux-heading text-[0.5rem] sm:text-[0.52rem] tracking-[0.4em] sm:tracking-[0.55em] text-pts-gold">
              <span suppressHydrationWarning>{t(locale, "hero.kicker")}</span>
            </p>
          </div>

          <h1 className="max-w-5xl font-heading text-[clamp(1.6rem,6vw,4rem)] font-bold uppercase leading-[1.08] tracking-[0.04em] text-pts-parchment [perspective:1200px] drop-shadow-[0_8px_40px_rgba(0,0,0,1)] sm:leading-[1.04] sm:tracking-[0.06em]">
            {words.map((word, wi) => (
              <span key={wi} className="mr-[0.25em] inline-block overflow-hidden py-1 align-top sm:py-2">
                <span className="hero-word-inner relative inline-block will-change-transform">
                  <span suppressHydrationWarning>{word}</span>
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-sub mt-8 max-w-xl text-[0.68rem] sm:mt-10 sm:text-[0.85rem] font-bold uppercase leading-[1.8] tracking-[0.12em] text-pts-parchment drop-shadow-[0_4px_20px_rgba(0,0,0,1)] sm:leading-[2.15] sm:tracking-[0.18em]">
            <span suppressHydrationWarning>{t(locale, "hero.sub")}</span>
          </p>

          <div className="hero-cta mt-10 flex flex-col items-stretch gap-4 sm:mt-16 sm:flex-row sm:items-center sm:gap-8">
            <MagneticButton href="/contact" className="btn-gold-glow border-pts-gold bg-pts-gold px-12 py-4 text-[0.65rem] font-bold text-pts-black sm:py-5 sm:text-[0.7rem] sm:w-auto">
              <span suppressHydrationWarning>{t(locale, "hero.cta.inquire")}</span>
            </MagneticButton>
          </div>

          <div className="hero-scroll-hint mt-10 sm:mt-14">
            <div className="hidden sm:block">
              <FloatingScrollIndicator />
            </div>
          </div>
        </div>

        <div className="hero-coords absolute bottom-6 right-6 text-right sm:bottom-8 sm:right-10">
          <p className="lux-heading text-[0.4rem] tracking-[0.4em] text-pts-gold sm:text-[0.45rem] sm:tracking-[0.5em]">21°N 39°E</p>
          <p className="lux-heading mt-1 text-[0.35rem] tracking-[0.3em] text-pts-gold/60 sm:text-[0.4rem] sm:tracking-[0.4em]">JEDDAH · GLOBAL</p>
        </div>
      </div>
    </section>
  );
});























