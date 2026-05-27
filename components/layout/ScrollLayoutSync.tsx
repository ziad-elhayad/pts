"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  cancelScheduledScrollTriggerRefresh,
  requestScrollTriggerRefresh,
} from "@/lib/scrollTriggerRefresh";

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
    // Debounced refresh avoids repeated global geometry work during transitions.
    requestScrollTriggerRefresh(260);
    return () => cancelScheduledScrollTriggerRefresh();
  }, [pathname]);

  return null;
}
