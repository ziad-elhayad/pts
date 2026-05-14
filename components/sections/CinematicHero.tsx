"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VideoSection } from "@/components/VideoSection";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FloatingScrollIndicator } from "@/components/ui/FloatingCTA";
import { heroMedia } from "@/lib/media";
import { site } from "@/lib/site";
import { t } from "@/lib/dictionary";
import { useLocale } from "@/contexts/LocaleContext";
import { prefersReducedMotion } from "@/lib/motionPref";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CinematicHero() {
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

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const onMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current = {
        x: (e.clientX / innerWidth - 0.5) * 2,
        y: (e.clientY / innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    // Never run mouse-follow parallax on touch — no mouse exists
    if (isTouch) return;

    // Use quickSetter for high-frequency updates (better performance than gsap.to in ticker)
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
  }, []);

  const tagline = t(locale, "hero.tagline");
  const words = tagline.split(" ");

  /* Intro + ambient (unique hero signature) */
  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const kicker = sectionRef.current?.querySelector(".hero-kicker");
      const wordInners = sectionRef.current?.querySelectorAll(".hero-word-inner");
      const sub = sectionRef.current?.querySelector(".hero-sub");
      const ctas = sectionRef.current?.querySelector(".hero-cta");
      const scrollEl = sectionRef.current?.querySelector(".hero-scroll-hint");
      const coords = sectionRef.current?.querySelector(".hero-coords");

      if (reduced) {
        gsap.set([kicker, wordInners, sub, ctas, scrollEl, coords, topLineRef.current, botLineRef.current], {
          opacity: 1,
          clearProps: "transform,filter",
        });
        return;
      }

      if (
        !topLineRef.current ||
        !botLineRef.current ||
        !kicker ||
        !sub ||
        !ctas ||
        !scrollEl ||
        !coords ||
        !wordInners ||
        wordInners.length === 0
      ) {
        return;
      }

      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro.fromTo(topLineRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1.6 }, 0);
      intro.fromTo(botLineRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1.6 }, 0.12);
      intro.fromTo(
        kicker,
        { opacity: 0, x: -40, filter: "blur(8px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 1 },
        0.2,
      );
      intro.fromTo(
        wordInners,
        { yPercent: 125, rotateX: 56, opacity: 0.2, transformOrigin: "50% 0%" },
        { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.25, stagger: 0.09 },
        0.35,
      );

      intro.fromTo(
        sub,
        { opacity: 0, y: 36, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2 },
        0.75,
      );
      intro.fromTo(
        ctas,
        { opacity: 0, y: 28, rotateX: 12, transformOrigin: "50% 100%" },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.15 },
        0.95,
      );
      intro.fromTo(scrollEl, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9 }, 1.15);
      intro.fromTo(coords, { opacity: 0, y: 10 }, { opacity: 0.35, y: 0, duration: 1 }, 1.35);

      if (auroraRef.current) {
        gsap.to(auroraRef.current, {
          rotate: 360,
          duration: 48,
          repeat: -1,
          ease: "none",
        });
      }
    },
    { scope: sectionRef, dependencies: [locale] },
  );

  useGSAP(
    () => {
      const media = mediaRef.current;
      const content = contentRef.current;
      const overlay = overlayRef.current;
      if (!media || !content) return;

      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Simplified parallax on mobile — no rotateY/scale to save GPU layers
      gsap.to(media, {
        yPercent: isTouch ? 18 : 32,
        scale: isTouch ? 1 : 1.12,
        rotateY: isTouch ? 0 : -4,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: isTouch ? 0.3 : 0,
        },
      });

      gsap.to(content, {
        autoAlpha: 0,
        yPercent: isTouch ? -12 : -22,
        rotateX: isTouch ? 0 : 8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "50% top",
          scrub: 0,
        },
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        scrub: true,
        anticipatePin: 1,
      });

      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[700px] w-full overflow-hidden bg-pts-deep [perspective:1600px]"
    >
      <div
        ref={auroraRef}
        className="pointer-events-none absolute -left-1/2 top-1/2 z-[1] h-[180%] w-[200%] -translate-y-1/2 opacity-30 will-change-transform"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(168,143,100,0.06) 60deg, transparent 120deg, rgba(207,186,144,0.04) 200deg, transparent 280deg)",
        }}
        aria-hidden
      />

      <div
        ref={mediaRef}
        className="gpu-layer absolute inset-[-8%] will-change-transform [transform-style:preserve-3d]"
        style={{ transformOrigin: "center center" }}
      >
        <VideoSection
          poster={heroMedia.poster}
          src={heroMedia.videoHd}
          srcLarge={heroMedia.videoUhd}
          className="h-full w-full"
          overlayClassName="none"
          lazyVideo
        />
      </div>

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

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-[4] opacity-60"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,13,15,0.4) 0%, rgba(13,13,15,0.2) 30%, rgba(13,13,15,0.6) 70%, rgba(13,13,15,0.85) 100%)",
        }}
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 z-[5] mix-blend-soft-light" aria-hidden>
        <div className="mist-drift absolute -left-1/4 top-0 h-[120%] w-[150%] opacity-30" />
        <div className="mist-drift-slow absolute -right-1/3 top-1/4 h-full w-[140%] opacity-20" />
      </div>

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
        className="hero-content relative z-10 flex h-full transform-gpu flex-col justify-end px-6 pb-24 pt-40 [transform-style:preserve-3d] sm:px-10 lg:px-20"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="hero-kicker mb-8 flex items-center gap-5">
            <div className="h-px w-12 bg-pts-gold" />
            <p className="lux-heading text-[0.52rem] tracking-[0.55em] text-pts-gold">
              {t(locale, "hero.kicker")}
            </p>
          </div>

          <h1 className="max-w-5xl font-heading text-[clamp(1.85rem,4.5vw,4rem)] font-bold uppercase leading-[1.04] tracking-[0.06em] text-pts-parchment [perspective:1200px] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            {words.map((word, wi) => (
              <span key={wi} className="mr-[0.25em] inline-block overflow-hidden py-2 align-top">
                <span className="hero-word-inner relative inline-block will-change-transform">
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-sub mt-10 max-w-xl text-[0.75rem] sm:text-[0.85rem] font-bold uppercase leading-[2.15] tracking-[0.18em] text-pts-parchment drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] opacity-0">
            {site.description}
          </p>

          <div className="hero-cta mt-12 sm:mt-16 flex flex-col sm:flex-row flex-wrap items-center gap-4 sm:gap-8 opacity-0">
            <MagneticButton href="/contact" className="btn-gold-glow border-pts-gold bg-pts-gold w-full sm:w-auto px-12 py-5 text-[0.7rem] font-bold text-pts-black">
              Inquire
            </MagneticButton>
            <MagneticButton
              href="/mice"
              className="border-pts-parchment bg-pts-black/80 w-full sm:w-auto px-12 py-5 text-[0.7rem] font-bold text-pts-parchment hover:bg-pts-black"
            >
              Begin Your Experience
            </MagneticButton>
          </div>

          <div className="hero-scroll-hint mt-14 opacity-0">
            <FloatingScrollIndicator />
          </div>
        </div>

        <div className="hero-coords absolute bottom-8 right-10 text-right opacity-0">
          <p className="lux-heading text-[0.45rem] tracking-[0.5em] text-pts-gold">21°N 39°E</p>
          <p className="lux-heading mt-1 text-[0.4rem] tracking-[0.4em] text-pts-gold/60">JEDDAH · GLOBAL</p>
        </div>
      </div>
    </section>
  );
}
