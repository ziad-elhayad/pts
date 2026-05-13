"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "pts-loader-seen";

export function LoaderScreen() {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) {
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

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        sessionStorage.setItem(SESSION_KEY, "1");
        document.documentElement.style.overflow = "";
        setVisible(false);
      },
    });

    // Animate counter from 0 to 100
    const counterObj = { val: 0 };

    tl.set(root, { autoAlpha: 1 })
      // Lines slide in
      .fromTo(topLine, { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, 0)
      .fromTo(botLine, { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, 0)
      // Label reveals
      .fromTo(label, { autoAlpha: 0, y: 24, letterSpacing: "1em" },
        { autoAlpha: 1, y: 0, letterSpacing: "0.55em", duration: 1.1 }, 0.2)
      .fromTo(sub,   { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.9 }, 0.5)
      // Counter
      .to(counterObj, {
        val: 100,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counter) counter.textContent = Math.round(counterObj.val).toString().padStart(3, "0");
        },
      }, 0.3)
      // Progress bar
      .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power2.inOut" }, 0.3)
      // Cinematic exit — overlay slides up
      .fromTo(overlay,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.65, ease: "power4.inOut" }, "+=0.1")
      .to(root, { autoAlpha: 0, duration: 0.01 });

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
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
      {/* Top decorative line */}
      <div
        data-loader-top-line
        className="absolute top-12 left-16 right-16 h-px origin-left"
        style={{ background: "linear-gradient(90deg, var(--pts-gold), transparent)" }}
      />

      {/* Central content */}
      <div className="relative flex flex-col items-center gap-8">
        {/* Brand mark */}
        <div
          data-loader-label
          className="lux-heading loader-glow text-center text-3xl sm:text-4xl text-pts-gold-2 tracking-[0.5em] font-light"
          style={{ visibility: "visible" }}
        >
          PTS
        </div>

        <p
          data-loader-sub
          className="text-center text-[0.62rem] uppercase tracking-[0.5em] text-pts-muted"
        >
          Private Travel Services
        </p>

        {/* Progress bar */}
        <div className="w-48 h-px bg-pts-line/30 overflow-hidden mt-6">
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

      {/* Counter */}
      <div className="absolute bottom-16 right-16">
        <span
          data-loader-counter
          className="lux-heading text-[0.6rem] text-pts-gold/40 tracking-[0.4em] stat-number"
        >
          000
        </span>
      </div>

      {/* Bottom decorative line */}
      <div
        data-loader-bot-line
        className="absolute bottom-12 left-16 right-16 h-px origin-right"
        style={{ background: "linear-gradient(90deg, transparent, var(--pts-gold))" }}
      />

      {/* Cinematic exit overlay */}
      <div
        data-loader-overlay
        className="absolute inset-0 bg-pts-bg"
        style={{ transform: "translateY(100%)" }}
      />
    </div>
  );
}
