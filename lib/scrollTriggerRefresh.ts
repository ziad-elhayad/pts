"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";

let scheduledTimer: number | null = null;
let lastRefreshAt = 0;

const MIN_REFRESH_GAP_MS = 350;

export function requestScrollTriggerRefresh(delayMs = 120): void {
  if (typeof window === "undefined") return;
  if (document.visibilityState === "hidden") return;

  if (scheduledTimer) {
    window.clearTimeout(scheduledTimer);
  }

  scheduledTimer = window.setTimeout(() => {
    scheduledTimer = null;
    const now = performance.now();
    if (now - lastRefreshAt < MIN_REFRESH_GAP_MS) return;
    lastRefreshAt = now;
    ScrollTrigger.refresh();
  }, delayMs);
}

export function cancelScheduledScrollTriggerRefresh(): void {
  if (scheduledTimer) {
    window.clearTimeout(scheduledTimer);
    scheduledTimer = null;
  }
}
