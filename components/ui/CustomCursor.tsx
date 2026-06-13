"use client";

import { useEffect, useRef, useState, memo } from "react";
import gsap from "gsap";
import { usePerformance } from "@/contexts/PerformanceContext";

/**
 * PTS Luxury Custom Cursor.
 * Two-layer: a fast outer ring + a slow inner dot.
 * Morphs on hover over links/buttons: ring expands, dot hides.
 * Disabled on touch devices and low-end performance tier.
 */
export const CustomCursor = memo(function CustomCursor() {
  const ringRef  = useRef<HTMLDivElement>(null);
  const dotRef   = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const { isLowEnd } = usePerformance();

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch || isLowEnd) return;

    const ring  = ringRef.current;
    const dot   = dotRef.current;
    if (!ring || !dot) return;

    // quickSetter is much faster for high-frequency updates
    const setDotX = gsap.quickSetter(dot, "x", "px");
    const setDotY = gsap.quickSetter(dot, "y", "px");
    const setRingX = gsap.quickSetter(ring, "x", "px");
    const setRingY = gsap.quickSetter(ring, "y", "px");

    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;
    let dotX   = mouseX;
    let dotY   = mouseY;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Smooth everything in the ticker
    const tick = () => {
      // Ring inertia
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      
      // Dot is fast but still slightly smoothed for "liquid" feel
      dotX += (mouseX - dotX) * 0.45;
      dotY += (mouseY - dotY) * 0.45;

      setDotX(dotX);
      setDotY(dotY);
      setRingX(ringX);
      setRingY(ringY);
    };
    
    gsap.ticker.add(tick);

    // Hover states
    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, [role='button']");
      if (!isInteractive) return;

      gsap.to(ring, {
        scale: 2.2,
        opacity: 1,
        borderColor: "rgba(168,143,100,1)",
        duration: 0.4,
        ease: "power3.out",
        overwrite: true,
      });
      gsap.to(dot, {
        scale: 0,
        duration: 0.3,
        ease: "power3.out",
        overwrite: true,
      });
    };

    const onLeave = () => {
      gsap.to(ring, {
        scale: 1,
        opacity: 1,
        borderColor: "rgba(168,143,100,1)",
        duration: 0.5,
        ease: "power3.out",
        overwrite: true,
      });
      gsap.to(dot, {
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
        overwrite: true,
      });
    };

    // Hide/show on window focus
    const onLeaveWindow = () => gsap.to([ring, dot], { autoAlpha: 0, duration: 0.3 });
    const onEnterWindow = () => gsap.to([ring, dot], { autoAlpha: 1, duration: 0.3 });

    window.addEventListener("mousemove",  onMove,        { passive: true });
    document.addEventListener("mouseover",  onEnter,     { passive: true });
    document.addEventListener("mouseout",   onLeave,     { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseover",  onEnter);
      document.removeEventListener("mouseout",   onLeave);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTouch]);

  if (isTouch || isLowEnd) return null;

  return (
    <>
      {/* Outer ring — slow inertia */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[11000] -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{
          width: 40,
          height: 40,
          borderWidth: 3,
          borderColor: "rgba(168,143,100,1)",
          opacity: 1,
          top: 0,
          left: 0,
          mixBlendMode: "normal",
        }}
        aria-hidden
      />
      {/* Inner dot — fast */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[11000] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 6,
          height: 6,
          background: "rgba(168,143,100,1)",
          top: 0,
          left: 0,
        }}
        aria-hidden
      />
    </>
  );
});
