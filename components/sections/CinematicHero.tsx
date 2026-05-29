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

// ─── Tuning constants ────────────────────────────────────────────────────────
// Keep parallax subtle — large yPercent values cause the most visible jank
const PARALLAX_Y_DESKTOP = 20;   // was 32 — reduced to cut repaint area
const PARALLAX_SCALE = 1.06;     // was 1.12 — smaller scale = smaller overdraw
const MOUSE_LERP = 0.06;         // smoother lerp = less per-frame delta
const LAYER1_STRENGTH = 16;      // was 22
const LAYER2_STRENGTH = 10;      // was 14
// ─────────────────────────────────────────────────────────────────────────────

export const CinematicHero = memo(function CinematicHero() {
  const { locale, dir } = useLocale();
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

  // ─── Mouse parallax ──────────────────────────────────────────────────────
  // FIX: Gate on `mounted` too so we never attach on SSR hydration
  useEffect(() => {
    if (!mounted || isTouch || isLowEnd) return;

    const onMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current = {
        x: (e.clientX / innerWidth - 0.5) * 2,
        y: (e.clientY / innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mounted, isLowEnd, isTouch]);

  // ─── Mouse lerp tick ─────────────────────────────────────────────────────
  // FIX: Use a single RAF loop instead of gsap.ticker to avoid double-ticking
  // with ScrollTrigger's internal tick. Also skip when section is out of view.
  useEffect(() => {
    if (!mounted || isTouch || isLowEnd) return;
    if (!layer1Ref.current || !layer2Ref.current) return;

    const setL1X = gsap.quickSetter(layer1Ref.current, "x", "px");
    const setL1Y = gsap.quickSetter(layer1Ref.current, "y", "px");
    const setL2X = gsap.quickSetter(layer2Ref.current, "x", "px");
    const setL2Y = gsap.quickSetter(layer2Ref.current, "y", "px");

    let xLerp = 0;
    let yLerp = 0;
    let rafId: number;
    let isVisible = true;

    // Pause lerp loop when hero is scrolled out of view — removes needless GPU work
    const io = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 },
    );
    if (sectionRef.current) io.observe(sectionRef.current);

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!isVisible) return;
      const { x, y } = mouseRef.current;
      xLerp += (x - xLerp) * MOUSE_LERP;
      yLerp += (y - yLerp) * MOUSE_LERP;
      setL1X(xLerp * -LAYER1_STRENGTH);
      setL1Y(yLerp * -LAYER1_STRENGTH * 0.55);
      setL2X(xLerp * LAYER2_STRENGTH);
      setL2Y(yLerp * LAYER2_STRENGTH * 0.57);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
    };
  }, [mounted, isLowEnd, isTouch]);

  const tagline = t(locale, "hero.tagline");
  const words = tagline.split(" ");

  // ─── Intro timeline ──────────────────────────────────────────────────────
  useGSAP(
    () => {
      const kicker = sectionRef.current?.querySelector(".hero-kicker");
      const wordInners = sectionRef.current?.querySelectorAll(".hero-word-inner");
      const sub = sectionRef.current?.querySelector(".hero-sub");
      const ctas = sectionRef.current?.querySelector(".hero-cta");
      const scrollEl = sectionRef.current?.querySelector(".hero-scroll-hint");
      const coords = sectionRef.current?.querySelector(".hero-coords");

      if (reducedMotion || isTouch) {
        gsap.set(
          [kicker, wordInners, sub, ctas, scrollEl, coords, topLineRef.current, botLineRef.current],
          { opacity: 1, clearProps: "transform,filter" },
        );
        return;
      }

      if (!topLineRef.current || !botLineRef.current || !kicker || !sub || !ctas || !scrollEl || !coords || !wordInners || !mounted) return;

      // RTL: kicker slides in from the right (+x), LTR from the left (-x).
      // Using a logical value prevents the browser from recalculating inline-start
      // offsets against the flipped writing-mode axis mid-animation.
      const isRTL = dir === "rtl";
      const kickerX = isRTL ? 40 : -40;

      const intro = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "center center",
          toggleActions: "play reverse play reverse",
        },
      });

      // FIX RTL: In RTL the logical start of the line is on the right.
      // `transformOrigin` must be "right center" so scaleX expands rightward,
      // matching the text flow direction and preventing a mid-frame origin jump.
      gsap.set([topLineRef.current, botLineRef.current], {
        transformOrigin: isRTL ? "right center" : "left center",
      });

      // FIX RTL: Word stagger — in RTL we reverse the NodeList so the first
      // visible word (rightmost) animates first, not the last DOM node.
      // Without this, Arabic text appears to animate backwards visually.
      const wordInnerArray = Array.from(wordInners);
      const orderedWords = isRTL ? [...wordInnerArray].reverse() : wordInnerArray;

      intro
        .fromTo(topLineRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1.6 }, 0)
        .fromTo(botLineRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1.6 }, 0.12)
        .fromTo(kicker, { opacity: 0, x: kickerX, filter: isLowEnd ? "none" : "blur(8px)" }, { opacity: 1, x: 0, filter: "none", duration: 1 }, 0.2)
        .fromTo(orderedWords, { yPercent: 125, rotateX: (isLowEnd || isRTL) ? 0 : 56, opacity: 0.2 }, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.25, stagger: 0.09 }, 0.35)
        .fromTo(sub, { opacity: 0, y: 36, filter: isLowEnd ? "none" : "blur(10px)" }, { opacity: 1, y: 0, filter: "none", duration: 1.2 }, 0.75)
        .fromTo(ctas, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.15 }, 0.95)
        .fromTo(scrollEl, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9 }, 1.15)
        .fromTo(coords, { opacity: 0, y: 10 }, { opacity: 0.35, y: 0, duration: 1 }, 1.35);

      // Aurora: CSS animation is cheaper than gsap.to rotate on a large div
      // Moved to CSS class `aurora-spin` — see style tag below
    },
    { scope: sectionRef, dependencies: [locale, isLowEnd, reducedMotion, mounted, isTouch], revertOnUpdate: true },
  );

  // ─── Scroll parallax ─────────────────────────────────────────────────────
  // FIX: Separated into its own useGSAP so it can be killed independently.
  // FIX: Removed `pin: true` with `pinSpacing: false` — this is the #1 cause
  //      of hero→about layout jumps. The section is full-viewport by default;
  //      pinning it adds a GSAP-managed translate that fights the browser's
  //      compositor thread during the handoff to the next section.
  //      If a sticky/pinned hero is required, use `position: sticky` in CSS
  //      instead — the browser handles it natively without scroll fighting.
  useGSAP(
    () => {
      const media = mediaRef.current;
      if (!media || !mounted) return;

      if (isTouch) {
        // On touch devices clear any transform GSAP may have set,
        // then let CSS `transform: translate3d(0,0,0)` handle the layer.
        gsap.set(media, { clearProps: "all" });
        return;
      }

      // Single ScrollTrigger for the parallax — no overlapping triggers.
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: isLowEnd ? 0.3 : 0.8, // FIX: small scrub value (not 0) adds micro-smoothing that removes stutter
        onUpdate: (self) => {
          const p = self.progress;
          // Use gsap.set directly (no tween) for scrub — avoids a second animation layer
          gsap.set(media, {
            // translate3d only — no rotateY on scroll (rotateY triggers expensive layer promotion)
            yPercent: p * PARALLAX_Y_DESKTOP,
            scale: 1 + p * (PARALLAX_SCALE - 1),
            force3D: true,
          });
        },
      });

      return () => st.kill();
    },
    { scope: sectionRef, dependencies: [isLowEnd, mounted, isTouch, dir], revertOnUpdate: true },
  );

  return (
    <>
      {/*
        FIX: Aurora rotation moved from gsap.ticker to a CSS keyframe.
        CSS animations run on the compositor thread — no JS involvement,
        no interaction with ScrollTrigger's tick loop.
      */}
      <style>{`
        @keyframes aurora-rotate {
          to { transform: rotate(360deg) translate3d(0,0,0); }
        }
        .aurora-spin {
          animation: aurora-rotate 60s linear infinite;
          /* will-change declared here rather than inline to avoid
             creating a stacking context on elements that don't need it */
          will-change: transform;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative h-[100svh] min-h-[500px] sm:min-h-[700px] w-full overflow-hidden bg-pts-deep touch-pan-y"
        // FIX: Removed [perspective:1600px] from the section root.
        // perspective on a scrolling ancestor forces the browser to composite
        // ALL descendants into a single layer, defeating individual will-change
        // hints and causing full-section repaints on scroll.
        // perspective is now scoped to the <h1> only (see below).
      >
        {mounted && !isLowEnd && !isTouch && (
          <div
            ref={auroraRef}
            className="aurora-spin pointer-events-none absolute -left-1/2 top-1/2 z-[1] h-[180%] w-[200%] -translate-y-1/2 opacity-30"
            // FIX: will-change moved to CSS class; removed from inline style
            // to prevent layout recalcs during hydration.
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(168,143,100,0.06) 60deg, transparent 120deg, rgba(207,186,144,0.04) 200deg, transparent 280deg)",
            }}
            aria-hidden
          />
        )}

        {/*
          FIX: Removed inset-[-8%] overflow expansion — the extra 8% on all
          sides forces layout recalculation every scroll frame because the
          browser must check if the overflowing area clips.
          Instead, we start with inset-0 and let the scale(1.06) handle the
          edge-bleed. The parent overflow-hidden clips cleanly.

          FIX: Removed [transform-style:preserve-3d] — this flag forces every
          child into its own compositing layer and makes the section impossible
          to cache as a single GPU texture. Only the h1 needs it.

          FIX: Added backface-visibility: hidden — prevents flicker on some
          WebKit versions when the element is scaled during scroll.
        */}
        <div
          ref={mediaRef}
          className="absolute inset-0"
          style={{
            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translate3d(0,0,0)", // force GPU layer from first paint
          }}
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

        {/* Mouse parallax layers — only rendered on desktop, gated by mounted */}
        {mounted && !isLowEnd && !isTouch && (
          <>
            <div
              ref={layer1Ref}
              className="pointer-events-none absolute inset-0 z-[2]"
              style={{
                background:
                  "radial-gradient(ellipse 70% 50% at 30% 40%, rgba(168,143,100,0.08) 0%, transparent 60%)",
                willChange: "transform",
                transform: "translate3d(0,0,0)",
              }}
            />
            <div
              ref={layer2Ref}
              className="pointer-events-none absolute inset-0 z-[3]"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 70% 60%, rgba(13,13,15,0.25) 0%, transparent 60%)",
                willChange: "transform",
                transform: "translate3d(0,0,0)",
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

        {/* Mist — CSS-only, no JS involvement */}
        {!isTouch && (
          <div className="pointer-events-none absolute inset-0 z-[5] mix-blend-soft-light" aria-hidden>
            <div className="mist-drift absolute -left-1/4 top-0 h-[120%] w-[150%] opacity-30" />
            <div className="mist-drift-slow absolute -right-1/3 top-1/4 h-full w-[140%] opacity-20" />
          </div>
        )}

        <div
          ref={topLineRef}
          className="pointer-events-none absolute left-0 right-0 top-0 z-[6] h-px origin-center scale-x-0"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(168,143,100,0.35), transparent)",
            willChange: "transform, opacity",
          }}
        />
        <div
          ref={botLineRef}
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-[6] h-px origin-center scale-x-0"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(168,143,100,0.22), transparent)",
            willChange: "transform, opacity",
          }}
        />

        <div
          ref={contentRef}
          className="hero-content relative z-10 flex h-full flex-col justify-end px-6 pb-20 pt-32 sm:px-10 sm:pb-24 sm:pt-40 lg:px-20"
          // FIX: Removed transform-gpu class + [transform-style:preserve-3d].
          // Applying preserve-3d here created an additional stacking context
          // that forced the overlay and gradient layers to repaint together
          // with the content layer on every scroll frame.
        >
          <div className="mx-auto w-full max-w-6xl">
            <div className="hero-kicker mb-6 flex items-center gap-4 sm:mb-8 sm:gap-5">
              <div className="h-px w-8 bg-pts-gold sm:w-12" />
              <p
                className={`lux-heading text-pts-gold ${
                  dir === "rtl"
                    ? "tracking-[0.2em] sm:tracking-[0.3em]"
                    : "text-[0.5rem] sm:text-[0.52rem] tracking-[0.4em] sm:tracking-[0.55em]"
                }`}
                style={dir === "rtl" ? { fontSize: "22px" } : undefined}
              >
                <span suppressHydrationWarning>{t(locale, "hero.kicker")}</span>
              </p>
            </div>

            <h1
              className={`font-heading font-bold uppercase text-pts-parchment drop-shadow-[0_8px_40px_rgba(0,0,0,1)] ${
                dir === "rtl"
                  ? "max-w-6xl leading-[1.2] tracking-[0.02em] sm:leading-[1.1] sm:tracking-[0.04em]"
                  : "max-w-5xl text-[clamp(1.6rem,6vw,4rem)] leading-[1.08] tracking-[0.04em] sm:leading-[1.04] sm:tracking-[0.06em]"
              }`}
              // FIX: perspective scoped to h1 only — not the whole section.
              // This means only the word-reveal animation gets the 3-D depth;
              // everything else composites independently.
              style={
                dir === "rtl"
                  ? {
                      fontSize: "52px",
                      // FIX RTL: perspective on an RTL element causes the browser
                      // to recalculate the 3-D vanishing point against the flipped
                      // inline axis on every paint, which triggers a compositing
                      // boundary change mid-scroll. We disable it in RTL and rely
                      // on yPercent-only for the word reveal (still looks great).
                      perspective: "none",
                    }
                  : { perspective: "1200px" }
              }
            >
              {words.map((word, wi) => (
                <span
                  key={wi}
                  className={`inline-block overflow-hidden py-1 align-top sm:py-2 ${
                    dir === "rtl" ? "ml-[0.25em]" : "mr-[0.25em]"
                  }`}
                >
                  <span
                    className="hero-word-inner relative inline-block"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <span suppressHydrationWarning>{word}</span>
                  </span>
                </span>
              ))}
            </h1>

            <p
              className={`hero-sub mt-8 font-bold uppercase text-pts-parchment drop-shadow-[0_4px_20px_rgba(0,0,0,1)] sm:mt-10 ${
                dir === "rtl"
                  ? "max-w-4xl leading-[1.6] tracking-[0.05em] sm:leading-[1.7]"
                  : "max-w-xl text-[0.68rem] leading-[1.8] tracking-[0.12em] sm:text-[0.85rem] sm:leading-[2.15] sm:tracking-[0.18em]"
              }`}
              style={dir === "rtl" ? { fontSize: "25px" } : undefined}
            >
              <span suppressHydrationWarning>{t(locale, "hero.sub")}</span>
            </p>

            <div className="hero-cta mt-10 flex flex-col items-stretch gap-4 sm:mt-16 sm:flex-row sm:items-center sm:gap-8">
              <MagneticButton
                href="/contact"
                className="btn-gold-glow border-pts-gold bg-pts-gold px-12 py-4 font-bold text-pts-black sm:py-5 sm:w-auto text-[0.65rem] sm:text-[0.7rem]"
              >
                <span suppressHydrationWarning>{t(locale, "hero.cta.inquire")}</span>
              </MagneticButton>
            </div>

            <div className="hero-scroll-hint mt-10 sm:mt-14">
              <div className="hidden sm:block">
                <FloatingScrollIndicator />
              </div>
            </div>
          </div>

          <div className={`hero-coords absolute bottom-6 sm:bottom-8 ${dir === "rtl" ? "left-6 sm:left-10 text-left" : "right-6 sm:right-10 text-right"}`}>
            <p className="lux-heading tracking-[0.4em] text-pts-gold sm:tracking-[0.5em] text-[0.4rem] sm:text-[0.45rem]">
              21°N 39°E
            </p>
            <p className="lux-heading mt-1 tracking-[0.3em] text-pts-gold/60 sm:tracking-[0.4em] text-[0.35rem] sm:text-[0.4rem]">
              JEDDAH · GLOBAL
            </p>
          </div>
        </div>
      </section>
    </>
  );
});
