"use client";

import { useEffect, useState } from "react";
import { SERVICE_SLIDER_MOBILE_MAX } from "@/lib/service-slides";

/**
 * Resolves touch/mobile layout only after mount so SSR and the first client
 * paint share the same markup (prevents hydration mismatch).
 */
export function useClientLayoutMode() {
  const [ready, setReady] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const touch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const mq = window.matchMedia(`(max-width: ${SERVICE_SLIDER_MOBILE_MAX}px)`);

    const sync = () => {
      setIsTouchDevice(touch);
      setIsMobileViewport(mq.matches);
    };

    sync();
    setReady(true);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const useMobileSlides = ready && (isTouchDevice || isMobileViewport);

  return { ready, isTouchDevice, isMobileViewport, useMobileSlides };
}
