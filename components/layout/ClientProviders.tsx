"use client";

import { LocaleProvider } from "@/contexts/LocaleContext";
import { PerformanceProvider, usePerformance } from "@/contexts/PerformanceContext";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { ScrollLayoutSync } from "@/components/layout/ScrollLayoutSync";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  cancelScheduledScrollTriggerRefresh,
  requestScrollTriggerRefresh,
} from "@/lib/scrollTriggerRefresh";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LoaderScreen = dynamic(
  () => import("@/components/LoaderScreen").then((mod) => mod.LoaderScreen),
  { ssr: false }
);

const WebGLBackground = dynamic(
  () => import("@/components/animations/WebGLBackground").then((mod) => mod.WebGLBackground),
  { ssr: false }
);

const CustomCursor = dynamic(
  () => import("@/components/ui/CustomCursor").then((mod) => mod.CustomCursor),
  { ssr: false }
);

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

function GlobalEffects({ disabled = false }: { disabled?: boolean }) {
  const { tier, isLowEnd, reducedMotion } = usePerformance();

  if (disabled || reducedMotion || isLowEnd) {
    return null;
  }

  return (
    <>
      {tier === "Elite" ? <WebGLBackground /> : null}
      <CustomCursor />
    </>
  );
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const isContactPage = pathname === "/contact";

  useEffect(() => {
    setMounted(true);

    const scheduleRefresh = () => {
      const idle = (window as Window & {
        requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      }).requestIdleCallback;

      if (typeof idle === "function") {
        idle(() => requestScrollTriggerRefresh(0), { timeout: 1200 });
        return;
      }

      requestScrollTriggerRefresh(220);
    };

    window.addEventListener("load", scheduleRefresh, { once: true });
    scheduleRefresh();

    // Detect when loader is removed from DOM
    const observer = new MutationObserver(() => {
      const loader = document.querySelector('[style*="z-[200]"]');
      if (!loader) {
        setLoaderVisible(false);
        observer.disconnect();
      }
    });

    // Start observing after a short delay to ensure loader is rendered
    setTimeout(() => {
      const loader = document.querySelector('[style*="z-[200]"]');
      if (loader) {
        observer.observe(document.body, { childList: true, subtree: true });
      } else {
        setLoaderVisible(false);
      }
    }, 100);

    return () => {
      window.removeEventListener("load", scheduleRefresh);
      cancelScheduledScrollTriggerRefresh();
      observer.disconnect();
    };
  }, []);

  return (
    <PerformanceProvider>
      <LocaleProvider>
        {mounted && !isContactPage && <TunnelEffect />}
        <SmoothScrollProvider disabled={isContactPage}>
          <GlobalEffects disabled={isContactPage} />
          <Suspense fallback={null}>
            <ScrollLayoutSync />
          </Suspense>
          {mounted && <LoaderScreen />}
          <div className={loaderVisible ? "opacity-0 pointer-events-none" : "opacity-100"}>{children}</div>
        </SmoothScrollProvider>
      </LocaleProvider>
    </PerformanceProvider>
  );
}
