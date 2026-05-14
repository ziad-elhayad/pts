"use client";

import { LocaleProvider } from "@/contexts/LocaleContext";
import { PerformanceProvider, usePerformance } from "@/contexts/PerformanceContext";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { ScrollLayoutSync } from "@/components/layout/ScrollLayoutSync";
import { LoaderScreen } from "@/components/LoaderScreen";
import { WebGLBackground } from "@/components/animations/WebGLBackground";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function TunnelEffect() {
  const { isLowEnd, reducedMotion } = usePerformance();
  
  useGSAP(() => {
    const isTouch = typeof window !== "undefined" && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (isTouch || isLowEnd || reducedMotion) return;

    const tunnel = document.querySelector(".tunnel-vignette");
    if (!tunnel) return;

    const setOpacity = gsap.quickSetter(tunnel, "opacity");
    const setScale   = gsap.quickSetter(tunnel, "scale");

    ScrollTrigger.create({
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity());
        const opacity = Math.min(velocity / 4000, 0.4);
        const scale   = 1 + (velocity / 8000);
        setOpacity(opacity);
        setScale(scale);
      }
    });
  }, [isLowEnd, reducedMotion]);

  return <div className="tunnel-vignette" aria-hidden="true" />;
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <PerformanceProvider>
      <LocaleProvider>
        <TunnelEffect />
        <SmoothScrollProvider>
          <WebGLBackground />
          <CustomCursor />
          <Suspense fallback={null}>
            <ScrollLayoutSync />
          </Suspense>
          <LoaderScreen />
          {children}
        </SmoothScrollProvider>
      </LocaleProvider>
    </PerformanceProvider>
  );
}
