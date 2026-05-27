"use client";

import { useEffect, useState } from "react";
import { SERVICE_SLIDER_MOBILE_MAX } from "@/lib/service-slides";

export function useMobileSliderView() {
  const [isMobileSlider, setIsMobileSlider] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${SERVICE_SLIDER_MOBILE_MAX}px)`);
    const sync = () => setIsMobileSlider(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return { isMobileSlider };
}
