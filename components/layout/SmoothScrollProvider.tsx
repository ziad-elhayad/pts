"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Fix for Vercel/Production: Ensure ScrollTrigger is ready
    gsap.registerPlugin(ScrollTrigger);

    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (isTouch) {
      // On touch, we just want to make sure ScrollTrigger is aware of the layout
      const timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Desktop: Lenis
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.6,
      smoothWheel: true,
      syncTouch: false,
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
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1500);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      clearTimeout(refreshTimer);
      delete (window as Window & { __lenis?: Lenis }).__lenis;
      document.documentElement.classList.remove("lenis", "lenis-smooth");
    };
  }, []);

  return <>{children}</>;
}
