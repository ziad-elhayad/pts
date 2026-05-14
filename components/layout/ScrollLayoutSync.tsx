"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Refreshes ScrollTrigger after App Router navigations so pins/scrub
 * recalc to the new page geometry.
 */
export function ScrollLayoutSync() {
  const pathname = usePathname();

  useEffect(() => {
    // Add a small delay to ensure the DOM is stable and avoid main-thread jank during route transitions
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
