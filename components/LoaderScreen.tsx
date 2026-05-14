"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";

const SESSION_KEY = "pts-loader-seen";

function detectLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 4;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return memory <= 4 || cores <= 4 || (isMobile && memory <= 4);
}

export function LoaderScreen() {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let hasSeenLoader = false;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        hasSeenLoader = true;
      }
    } catch (e) {
      console.warn("Session storage access denied");
    }

    if (hasSeenLoader) {
      setVisible(false);
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    const bar       = root.querySelector<HTMLElement>("[data-loader-bar]");
    const label     = root.querySelector<HTMLElement>("[data-loader-label]");
    const sub       = root.querySelector<HTMLElement>("[data-loader-sub]");
    const counter   = root.querySelector<HTMLElement>("[data-loader-counter]");
    const topLine   = root.querySelector<HTMLElement>("[data-loader-top-line]");
    const botLine   = root.querySelector<HTMLElement>("[data-loader-bot-line]");
    const overlay   = root.querySelector<HTMLElement>("[data-loader-overlay]");

    // Prevent scroll during loader
    document.documentElement.style.overflow = "hidden";

    // Durations for performance tiers (inline detect — avoids re-running this effect when
    // PerformanceContext tier updates after mount, which could kill GSAP mid-timeline on Vercel/mobile)
    const isLowEnd = detectLowEndDevice();
    const d = isLowEnd ? 0.4 : 1.0;

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch (e) {
          console.warn("Session storage not available");
        }
        document.documentElement.style.overflow = "";
        document.body.style.overflow = ""; // Safety for some mobile browsers
        setVisible(false);
      },
    });

    const counterObj = { val: 0 };

    tl.set(root, { autoAlpha: 1 })
      .fromTo(topLine, { scaleX: 0 }, { scaleX: 1, duration: 0.8 * d }, 0)
      .fromTo(botLine, { scaleX: 0 }, { scaleX: 1, duration: 0.8 * d }, 0)
      .fromTo(label, { autoAlpha: 0, y: 24, letterSpacing: "1em" },
        { autoAlpha: 1, y: 0, letterSpacing: "0.55em", duration: 1.1 * d }, 0.2 * d)
      .fromTo(sub,   { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.9 * d }, 0.5 * d)
      .to(counterObj, {
        val: 100,
        duration: 1.2 * d,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counter && !isLowEnd) counter.textContent = Math.round(counterObj.val).toString().padStart(3, "0");
          else if (counter && isLowEnd) counter.textContent = "100";
        },
      }, 0.3 * d)
      .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.2 * d, ease: "power2.inOut" }, 0.3 * d)
      .fromTo(overlay,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.65 * d, ease: "power4.inOut" }, "+=0.1")
      .to(root, { autoAlpha: 0, duration: 0.01 });

    // Emergency unlock after 5 seconds just in case GSAP fails
    const emergencyTimer = setTimeout(() => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      setVisible(false);
    }, 5000);

    return () => {
      tl.kill();
      clearTimeout(emergencyTimer);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[200] flex flex-col items-center justify-center bg-pts-deep"
      style={{ visibility: "visible" }}
      aria-hidden
    >
      <div
        data-loader-top-line
        className="absolute top-8 left-6 right-6 h-px origin-left sm:top-12 sm:left-16 sm:right-16"
        style={{ background: "linear-gradient(90deg, var(--pts-gold), transparent)" }}
      />

      <div className="relative flex flex-col items-center gap-8">
        <div data-loader-label className="flex flex-col items-center gap-6">
          <BrandLogo size={54} className="text-pts-gold sm:size-64" />
        </div>

        <p data-loader-sub className="text-center text-[0.55rem] uppercase tracking-[0.4em] text-pts-muted sm:text-[0.62rem] sm:tracking-[0.5em]">
          Private Travel Services
        </p>

        <div className="w-40 h-px bg-pts-line/30 overflow-hidden mt-6 sm:w-48">
          <div
            data-loader-bar
            className="h-full origin-left"
            style={{
              background: "linear-gradient(90deg, var(--pts-gold), var(--pts-gold-2))",
              transform: "scaleX(0)",
            }}
          />
        </div>
      </div>

      <div className="absolute bottom-10 right-8 sm:bottom-16 sm:right-16">
        <span
          data-loader-counter
          className="lux-heading text-[0.55rem] text-pts-gold/40 tracking-[0.3em] stat-number sm:text-[0.6rem] sm:tracking-[0.4em]"
        >
          000
        </span>
      </div>

      <div
        data-loader-bot-line
        className="absolute bottom-8 left-6 right-6 h-px origin-right sm:bottom-12 sm:left-16 sm:right-16"
        style={{ background: "linear-gradient(90deg, transparent, var(--pts-gold))" }}
      />

      <div
        data-loader-overlay
        className="absolute inset-0 bg-pts-bg"
        style={{ transform: "translateY(100%)" }}
      />
    </div>
  );
}
