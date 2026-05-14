"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Lenis smooth scroll — correctly integrated with GSAP ScrollTrigger.
 *
 * Pattern: Lenis v1+ with GSAP ticker as RAF driver.
 * - Single RAF loop, zero jank
 * - No scrollerProxy (causes double-interpolation)
 * - scrub: 0 gives frame-perfect scroll sync
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Normalize scroll on mobile to prevent address bar jumps and jank
    if (isTouch) {
      ScrollTrigger.normalizeScroll(true);
      ScrollTrigger.config({ ignoreMobileResize: true });
    }

    const lenis = new Lenis({
      lerp: isTouch ? 0.12 : 0.085, // Faster lerp on mobile for responsiveness
      wheelMultiplier: 0.9,
      touchMultiplier: isTouch ? 1.0 : 1.8, // Reduced for mobile
      smoothWheel: true,
      syncTouch: false,
    });

    // Keep ScrollTrigger in sync
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP ticker (single RAF)
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Expose for debugging only (typed window slot)
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    document.documentElement.classList.add("lenis", "lenis-smooth");

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      delete (window as Window & { __lenis?: Lenis }).__lenis;
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, []);

  return <>{children}</>;
}
