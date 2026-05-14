"use client";

import { LocaleProvider } from "@/contexts/LocaleContext";
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

/**
 * All client-only globals live here — never in the server layout.tsx.
 * This prevents SSR hydration mismatches for fixed-position elements.
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  useGSAP(() => {
    const isTouch = typeof window !== "undefined" && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (isTouch) return; // Skip velocity tunnel effect on mobile — gsap.to on scroll = jank

    // Tunnel Vision Effect based on velocity — desktop only
    const tunnel = document.querySelector(".tunnel-vignette");
    if (!tunnel) return;

    const setOpacity = gsap.quickSetter(tunnel, "opacity");
    const setScale   = gsap.quickSetter(tunnel, "scale");

    ScrollTrigger.create({
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity());
        const opacity = Math.min(velocity / 3000, 0.45);
        const scale   = 1 + (velocity / 6000);
        setOpacity(opacity);
        setScale(scale);
      }
    });
  });

  return (
    <LocaleProvider>
      <div className="tunnel-vignette" aria-hidden="true" />
      <SmoothScrollProvider>
        {/* Global overlays — rendered only client-side, no hydration mismatch */}
        <WebGLBackground />
        <CustomCursor />

        <Suspense fallback={null}>
          <ScrollLayoutSync />
        </Suspense>
        <LoaderScreen />
        {children}
      </SmoothScrollProvider>
    </LocaleProvider>
  );
}
