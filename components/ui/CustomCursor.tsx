"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * PTS Luxury Custom Cursor.
 * Two-layer: a fast outer ring + a slow inner dot.
 * Morphs on hover over links/buttons: ring expands, dot hides.
 */
export function CustomCursor() {
  const ringRef  = useRef<HTMLDivElement>(null);
  const dotRef   = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring  = ringRef.current;
    const dot   = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot) return;

    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;

    // Fast dot follows instantly
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.12,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    // Lerp ring for inertia feel
    const tick = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(ring, { x: ringX, y: ringY });
      if (label) gsap.set(label, { x: ringX, y: ringY });
    };
    gsap.ticker.add(tick);

    // Hover states
    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, [role='button']");
      if (!isInteractive) return;

      gsap.to(ring, {
        scale: 2.2,
        opacity: 0.7,
        borderColor: "rgba(168,143,100,0.8)",
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.to(dot, {
        scale: 0,
        duration: 0.3,
        ease: "power3.out",
      });
    };

    const onLeave = () => {
      gsap.to(ring, {
        scale: 1,
        opacity: 0.5,
        borderColor: "rgba(168,143,100,0.4)",
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.to(dot, {
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    // Hide/show on window focus
    const onLeaveWindow = () => {
      gsap.to([ring, dot], { autoAlpha: 0, duration: 0.3 });
    };
    const onEnterWindow = () => {
      gsap.to([ring, dot], { autoAlpha: 1, duration: 0.3 });
    };

    window.addEventListener("mousemove",  onMove,        { passive: true });
    document.addEventListener("mouseover",  onEnter);
    document.addEventListener("mouseout",   onLeave);
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
  }, []);

  return (
    <>
      {/* Outer ring — slow inertia */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{
          width: 40,
          height: 40,
          borderColor: "rgba(168,143,100,0.4)",
          opacity: 0.5,
          top: 0,
          left: 0,
          mixBlendMode: "normal",
        }}
        aria-hidden
      />
      {/* Inner dot — fast */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 6,
          height: 6,
          background: "rgba(168,143,100,0.9)",
          top: 0,
          left: 0,
        }}
        aria-hidden
      />
    </>
  );
}
