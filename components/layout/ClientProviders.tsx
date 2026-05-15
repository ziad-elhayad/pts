"use client";

import { LocaleProvider } from "@/contexts/LocaleContext";
import { PerformanceProvider, usePerformance } from "@/contexts/PerformanceContext";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { ScrollLayoutSync } from "@/components/layout/ScrollLayoutSync";
import { LoaderScreen } from "@/components/LoaderScreen";
import { WebGLBackground } from "@/components/animations/WebGLBackground";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Suspense, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function TunnelEffect() {
  const { isLowEnd, reducedMotion } = usePerformance();

  useGSAP(() => {
    if (typeof window === "undefined") return;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch || isLowEnd || reducedMotion) return;

    const tunnel = document.querySelector(".tunnel-vignette");
    if (!tunnel) return;

    const setOpacity = gsap.quickSetter(tunnel, "opacity", "number");
    const setScale = gsap.quickSetter(tunnel, "scale", "number");

    let raf = 0;
    let pendingVel = 0;
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "max max",
      onUpdate: (self) => {
        pendingVel = Math.abs(self.getVelocity());
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const velocity = pendingVel;
          const opacity = Math.min(velocity / 4000, 0.32);
          const scale = 1 + Math.min(velocity / 8000, 0.05);
          setOpacity(opacity);
          setScale(scale);
        });
      },
    });

    return () => {
      st.kill();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isLowEnd, reducedMotion]);

  return <div className="tunnel-vignette" aria-hidden="true" />;
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Global ScrollTrigger refresh after mount and load
    const refresh = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", refresh);
    
    // Multiple refreshes to catch lazy-loaded content or dynamic layout shifts
    const timers = [
      setTimeout(refresh, 500),
      setTimeout(refresh, 1500),
      setTimeout(refresh, 3000),
    ];

    return () => {
      window.removeEventListener("load", refresh);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <PerformanceProvider>
      <LocaleProvider>
        {mounted && <TunnelEffect />}
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
