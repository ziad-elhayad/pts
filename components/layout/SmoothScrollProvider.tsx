"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePerformance } from "@/contexts/PerformanceContext";
import {
  cancelScheduledScrollTriggerRefresh,
  requestScrollTriggerRefresh,
} from "@/lib/scrollTriggerRefresh";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Lenis smooth scroll — desktop pointer devices.
 * Touch: native scroll only (better battery + fewer jank / double-scroll issues).
 */
export function SmoothScrollProvider({
  children,
  disabled = false,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const { isLowEnd, reducedMotion } = usePerformance();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Fix for Vercel/Production: Ensure ScrollTrigger is ready
    gsap.registerPlugin(ScrollTrigger);

    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (disabled) {
      requestScrollTriggerRefresh(120);
      return () => cancelScheduledScrollTriggerRefresh();
    }

    if (isLowEnd || reducedMotion) {
      requestScrollTriggerRefresh(180);
      return () => cancelScheduledScrollTriggerRefresh();
    }

    if (isTouch) {
      // Keep native scrolling untouched on touch devices.
      requestScrollTriggerRefresh(220);
      return () => {
        cancelScheduledScrollTriggerRefresh();
      };
    }

    // Desktop: Lenis
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.6,
      smoothWheel: true,
      syncTouch: false,
      allowNestedScroll: true,
    });

    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    (window as Window & { __lenis?: Lenis }).__lenis = lenis;
    document.documentElement.classList.add("lenis", "lenis-smooth");

    // One deferred refresh after initial render settles.
    requestScrollTriggerRefresh(320);

    // Refresh on focus/visibility (Fixes Chrome/Brave background tab throttling)
    const onFocus = () => requestScrollTriggerRefresh(0);
    const onVisibility = () => {
      if (document.visibilityState === "visible") requestScrollTriggerRefresh(0);
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelScheduledScrollTriggerRefresh();
      delete (window as Window & { __lenis?: Lenis }).__lenis;
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, [disabled, isLowEnd, reducedMotion]);

  return <>{children}</>;
}
