"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Lenis smooth scroll — desktop only.
 * On mobile/touch: skip Lenis entirely, use native scroll.
 * Lenis + touch = main thread blocking = lag + crashes.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Mobile: skip Lenis entirely, rely on native scroll
    if (isTouch) {
      // Normalize scroll for mobile - this fixes the address bar resize / pinning jump issues
      ScrollTrigger.normalizeScroll({ 
        allowNestedScroll: true,
        lockAxis: true,
        momentum: true 
      });
      
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 800);

      return () => {
        ScrollTrigger.normalizeScroll(false);
        clearTimeout(timer);
      };
    }

    // Desktop: full Lenis experience
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

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
