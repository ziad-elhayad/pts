"use client";

import { useRef, Children, memo, useState, useEffect } from "react";
import clsx from "clsx";
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

  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const { tier, isLowEnd, reducedMotion } = usePerformance();

  useGSAP(() => {
    const wrapper  = wrapperRef.current;
    const track    = trackRef.current;
    const progress = progressRef.current;
    if (!wrapper || !track) return;

    // Performance: Force GPU acceleration on the track
    gsap.set(track, { 
      force3D: true, 
      backfaceVisibility: "hidden" 
    });

    const getScrollDistance = () => track.scrollWidth - window.innerWidth;

    if (isTouch) {
      // On mobile, we use native horizontal scrolling with CSS snap for the best experience
      // No GSAP pinning or x-translation needed for the track itself
      return; 
    }

    const slideTween = gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        pin: true,
        scrub: isLowEnd ? 0.1 : 0.8,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        anticipatePin: 1,
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
    <div 
      ref={wrapperRef} 
      id={id} 
      className={clsx(
        "relative w-full bg-pts-bg transition-colors duration-1000",
        isTouch ? "h-auto overflow-hidden" : "h-[100svh] overflow-hidden"
      )}
    >
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
          className="relative z-30 origin-top border-b border-pts-gold/[0.08] px-[clamp(1.25rem,3vw,2.5rem)] pb-8 pt-12 will-change-transform [transform-style:preserve-3d] md:px-[clamp(1.25rem,4vw,2.5rem)] md:pt-16"
        >
          <div
            ref={headerInnerRef}
            className="mx-auto flex w-full max-w-[92rem] transform-gpu flex-col justify-between gap-6 [transform-style:preserve-3d] md:flex-row md:items-end"
          >
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px w-6 bg-pts-gold/50" />
                <p className="lux-heading text-[0.5rem] tracking-[0.4em] text-pts-gold opacity-55 sm:tracking-[0.6em]">{kicker}</p>
              </div>
              <h2 className="mice-title-strip font-heading text-[clamp(1.3rem,6vw,2.35rem)] font-light uppercase leading-[1.1] tracking-[0.1em] text-pts-gold-2 sm:text-[clamp(1.4rem,2.65vw,2.35rem)] sm:leading-[1.06] sm:tracking-[0.13em]">
                {title.split(" ").map((w, i) => (
                  <span key={i} className="mr-[0.28em] inline-block overflow-hidden align-baseline">
                    <span className="mice-title-word inline-block will-change-transform">{w}</span>
                  </span>
                ))}
              </h2>
            </div>

            {description && (
              <div className="max-w-sm">
                <p className="text-[0.52rem] uppercase tracking-[0.22em] leading-[1.8] text-pts-gold-2/35 border-l border-pts-gold/15 pl-6 sm:text-[0.56rem] sm:tracking-[0.26em] sm:leading-[1.95] sm:border-l-2 sm:pl-8">
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Gallery Track ──────────────────────────────────────────── */}
        <div className={clsx(
          "relative flex-1 w-full flex items-stretch z-10",
          isTouch ? "overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory py-10 px-[10vw]" : "overflow-hidden h-full"
        )}>
          <div
            ref={trackRef}
            className="flex items-stretch will-change-transform h-full"
            style={{ 
              width: "max-content", 
              paddingLeft: isTouch ? "1.5rem" : paddingLeft, 
              paddingRight: isTouch ? "1.5rem" : paddingRight, 
              gap: isTouch ? "1.25rem" : gap,
              transform: "translateZ(0)" // Force GPU
            }}
          >
            {flatChildren.map((child, i) => (
              <div key={i} className={clsx(
                "hg-item flex-shrink-0 flex items-stretch",
                isTouch ? "snap-center h-[55vh] min-h-[420px] w-[80vw]" : "h-full"
              )}>
                {child}
              </div>
            ))}
          </div>
        </div>

        {/* ── Progress System ────────────────────────────────────────── */}
        <div className={clsx(
          "relative z-30",
          isTouch ? "mt-4" : "absolute bottom-0 left-0 right-0"
        )}>
          {/* Cinematic progress bar */}
          {!isTouch && (
            <div
              ref={progressRef}
              className="h-[2px] origin-left"
              style={{
                transform: "scaleX(0)",
                background: "linear-gradient(90deg, var(--pts-gold), var(--pts-gold-2), var(--pts-gold))",
                willChange: "transform"
              }}
            />
          )}

          {/* Footer info strip */}
          <div
            className="flex items-center justify-between px-[clamp(1.25rem,3vw,2.5rem)] py-5 md:px-[clamp(1.25rem,4vw,2.5rem)]"
            style={{ borderTop: "1px solid rgba(168,143,100,0.06)" }}
          >
            <div className="flex items-center gap-5">
              <span className="lux-heading text-[0.48rem] text-pts-gold tracking-[0.5em]">01</span>
              <div className="h-px w-10 bg-pts-line/20 sm:w-16" />
              <span className="lux-heading text-[0.48rem] text-pts-muted/25 tracking-[0.5em]">
                {flatChildren.length.toString().padStart(2, "0")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {!isLowEnd && <div className="h-1 w-1 rounded-full bg-pts-gold/30 animate-pulse sm:h-1.5 sm:w-1.5" />}
              <p className="lux-heading text-[0.4rem] text-pts-gold/25 tracking-[0.3em] sm:text-[0.42rem] sm:tracking-[0.8em]">
                {isTouch ? "Swipe to Explore" : "Drag to Navigate"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
