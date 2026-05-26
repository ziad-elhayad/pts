"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePerformance } from "@/contexts/PerformanceContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Lenis smooth scroll — desktop pointer devices.
 * Touch: native scroll only (better battery + fewer jank / double-scroll issues).
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLowEnd, reducedMotion } = usePerformance();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Fix for Vercel/Production: Ensure ScrollTrigger is ready
    gsap.registerPlugin(ScrollTrigger);

    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (isLowEnd || reducedMotion) {
      const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 500);
      return () => window.clearTimeout(refreshTimer);
    }

    if (isTouch) {
      // Normalize scroll on touch to prevent pinning jank and erratic behavior
      const normalized = ScrollTrigger.normalizeScroll({
        allowNestedScroll: true,
      });
      
      const timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 1000);
      
      return () => {
        clearTimeout(timer);
        if (normalized && 'kill' in normalized) {
          (normalized as { kill: () => void }).kill();
        }
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

    // Force a refresh after a delay to ensure all assets are loaded
    const refresh = () => ScrollTrigger.refresh();
    const refreshTimer = setTimeout(refresh, 1500);

    // Refresh on focus/visibility (Fixes Chrome/Brave background tab throttling)
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      clearTimeout(refreshTimer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      delete (window as Window & { __lenis?: Lenis }).__lenis;
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, [isLowEnd, reducedMotion]);

  return <>{children}</>;
}
