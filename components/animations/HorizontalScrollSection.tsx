"use client";

import { useRef, Children, memo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePerformance } from "@/contexts/PerformanceContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HorizontalScrollSectionProps {
  children: React.ReactNode;
  title: string;
  kicker: string;
  description?: string;
  gap?: string;
  paddingLeft?: string;
  paddingRight?: string;
  id?: string;
}

export const HorizontalScrollSection = memo(function HorizontalScrollSection({
  children,
  title,
  kicker,
  description,
  gap = "0vw",
  paddingLeft = "0vw",
  paddingRight = "10vw",
  id,
}: HorizontalScrollSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInnerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const { tier, isLowEnd, reducedMotion } = usePerformance();

  useGSAP(() => {
    const wrapper  = wrapperRef.current;
    const track    = trackRef.current;
    const progress = progressRef.current;
    if (!wrapper || !track) return;

    const isTouch = typeof window !== "undefined" && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    // Performance: Force GPU acceleration on the track
    gsap.set(track, { 
      force3D: true, 
      backfaceVisibility: "hidden" 
    });

    const getScrollDistance = () => track.scrollWidth - window.innerWidth;

    const slideTween = gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        pin: true,
        scrub: isLowEnd ? 0.1 : (isTouch ? 0.4 : 0.8),
        invalidateOnRefresh: true, // Crucial for mobile orientation/address bar changes
        pinType: isTouch ? "fixed" : "transform", // Fixed is more stable on real mobile
        fastScrollEnd: true,
        anticipatePin: isTouch ? 1.5 : 1, // More anticipation for touch devices
        onUpdate: (self) => {
          if (progress) {
            progress.style.transform = `scaleX(${self.progress}) translateZ(0)`;
          }
        },
      },
    });

    // Velocity-based skew effect — Performance Dependent
    if (!isTouch && !isLowEnd && !reducedMotion) {
      const items = track.querySelectorAll(".hg-item");
      const proxy = { skew: 0 };
      const skewSetter = gsap.quickSetter(items, "skewX", "deg");
      const scaleSetter = gsap.quickSetter(items, "scale", "number");
      const clamp = gsap.utils.clamp(-8, 8);

      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        onUpdate: (self) => {
          const skew = clamp(self.getVelocity() / -300);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            const squash = 1 - Math.min(Math.abs(skew) * 0.004, 0.04);
            scaleSetter(squash);
            gsap.to(proxy, {
              skew: 0,
              duration: 0.85,
              ease: "power3",
              overwrite: true,
              onUpdate: () => {
                skewSetter(proxy.skew);
                scaleSetter(1 - Math.min(Math.abs(proxy.skew) * 0.004, 0.04));
              },
              onComplete: () => scaleSetter(1),
            });
          }
        },
      });

      // Internal image parallax — Elite/Standard Only
      track.querySelectorAll(".hg-parallax-img").forEach((img) => {
        gsap.fromTo(
          img,
          { x: "-15%" },
          {
            x: "15%",
            ease: "none",
            scrollTrigger: {
              trigger: img,
              containerAnimation: slideTween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });
    }

    // Header perspective — Elite/Standard Only
    if (!isLowEnd && !reducedMotion && headerRef.current && headerInnerRef.current) {
      gsap.to(headerInnerRef.current, {
        rotateX: -7,
        y: -18,
        z: -40,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          scrub: 1.2,
        },
      });
    }

    // Ambient glow — Optimized for both but simplified on mobile/low-end
    if (glowRef.current && !isLowEnd) {
      gsap.to(glowRef.current, {
        xPercent: isTouch ? 8 : 18,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          scrub: 0.5,
        },
      });
    }

    // Title words reveal
    const titleWords = wrapper.querySelectorAll<HTMLElement>(".mice-title-word");
    if (titleWords.length) {
      gsap.fromTo(
        titleWords,
        { 
          yPercent: 118, 
          rotateX: (isTouch || isLowEnd) ? 0 : 52, 
          opacity: 0.15, 
          transformOrigin: "50% 0%" 
        },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: (isTouch || isLowEnd) ? 0.8 : 1.25,
          stagger: 0.05,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 96%",
            once: true,
          },
        },
      );
    }
    // Refresh on content changes (images loading, etc.)
    const ro = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    ro.observe(track);

    return () => ro.disconnect();
  }, { scope: wrapperRef, dependencies: [tier, reducedMotion] });

  const flatChildren = Children.toArray(children);

  return (
    <div ref={wrapperRef} id={id} className="relative w-full h-[100svh] overflow-hidden bg-pts-bg">
      <div className="flex h-full w-full flex-col [perspective:1400px]">

        {/* Atmospheric lighting */}
        {!isLowEnd && (
          <div ref={glowRef} className="pointer-events-none absolute inset-0 z-0 will-change-transform">
            <div className="gold-glow absolute -top-1/3 right-0 h-full w-[45%] opacity-[0.2]" />
            <div className="gold-glow absolute -bottom-1/3 left-0 h-full w-[42%] opacity-[0.12]" />
          </div>
        )}

        {/* ── Editorial Header ──────────────────────────────────────── */}
        <div
          ref={headerRef}
          className="relative z-30 origin-top border-b border-pts-gold/[0.08] px-[clamp(1.25rem,3vw,2.5rem)] pb-8 pt-16 will-change-transform [transform-style:preserve-3d] md:px-[clamp(1.25rem,4vw,2.5rem)]"
        >
          <div
            ref={headerInnerRef}
            className="mx-auto flex w-full max-w-[92rem] transform-gpu flex-col justify-between gap-6 [transform-style:preserve-3d] md:flex-row md:items-end"
          >
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px w-6 bg-pts-gold/50" />
                <p className="lux-heading text-[0.5rem] tracking-[0.6em] text-pts-gold opacity-55">{kicker}</p>
              </div>
              <h2 className="mice-title-strip font-heading text-[clamp(1.4rem,2.65vw,2.35rem)] font-light uppercase leading-[1.06] tracking-[0.13em] text-pts-gold-2">
                {title.split(" ").map((w, i) => (
                  <span key={i} className="mr-[0.28em] inline-block overflow-hidden align-baseline">
                    <span className="mice-title-word inline-block will-change-transform">{w}</span>
                  </span>
                ))}
              </h2>
            </div>

            {description && (
              <div className="max-w-sm">
                <p className="text-[0.56rem] uppercase tracking-[0.26em] leading-[1.95] text-pts-gold-2/35 border-l-2 border-pts-gold/15 pl-8">
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Gallery Track ──────────────────────────────────────────── */}
        <div className="relative flex-1 w-full flex items-stretch z-10 overflow-hidden">
          <div
            ref={trackRef}
            className="flex items-stretch will-change-transform h-full"
            style={{ 
              width: "max-content", 
              paddingLeft, 
              paddingRight, 
              gap,
              transform: "translateZ(0)" // Force GPU
            }}
          >
            {flatChildren.map((child, i) => (
              <div key={i} className="hg-item flex-shrink-0 h-full flex items-stretch">
                {child}
              </div>
            ))}
          </div>
        </div>

        {/* ── Progress System ────────────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          {/* Cinematic progress bar */}
          <div
            ref={progressRef}
            className="h-[2px] origin-left"
            style={{
              transform: "scaleX(0)",
              background: "linear-gradient(90deg, var(--pts-gold), var(--pts-gold-2), var(--pts-gold))",
              willChange: "transform"
            }}
          />

          {/* Footer info strip */}
          <div
            className="flex items-center justify-between px-[clamp(1.25rem,3vw,2.5rem)] py-5 md:px-[clamp(1.25rem,4vw,2.5rem)]"
            style={{ borderTop: "1px solid rgba(168,143,100,0.06)" }}
          >
            <div className="flex items-center gap-5">
              <span className="lux-heading text-[0.48rem] text-pts-gold tracking-[0.5em]">01</span>
              <div className="h-px w-16 bg-pts-line/20" />
              <span className="lux-heading text-[0.48rem] text-pts-muted/25 tracking-[0.5em]">
                {flatChildren.length.toString().padStart(2, "0")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {!isLowEnd && <div className="h-1.5 w-1.5 rounded-full bg-pts-gold/30 animate-pulse" />}
              <p className="lux-heading text-[0.42rem] text-pts-gold/25 tracking-[0.4em] sm:tracking-[0.8em]">
                Drag to Navigate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
