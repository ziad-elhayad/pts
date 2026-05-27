"use client";

import clsx from "clsx";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type CinematicSectionProps = {
  children: React.ReactNode;
  className?: string;
  mist?: boolean;
  scrubReveal?: boolean;
  snap?: boolean;
  id?: string;
};

/**
 * Section wrapper with atmospheric mist overlays.
 * Per-element animations stay inside child sections; optional scrub line
 * adds a premium transition cue without clipping 3D content.
 */
export function CinematicSection({
  children,
  className,
  mist = true,
  scrubReveal = false,
  id,
}: CinematicSectionProps) {
  const root = useRef<HTMLDivElement>(null);
  const scrubLineRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useGSAP(
    () => {
      if (!scrubReveal || !root.current || !scrubLineRef.current || !mounted) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(scrubLineRef.current, { scaleX: 1, transformOrigin: "left center" });
        return;
      }
      // Disable scrub reveal on mobile for better performance
      if (isTouch) return;
      
      gsap.fromTo(
        scrubLineRef.current,
        { scaleX: 0.08, opacity: 0.35 },
        {
          scaleX: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 88%",
            end: "top 38%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: root, dependencies: [scrubReveal, mounted, isTouch] }
  );

  return (
    <div ref={root} id={id} className={clsx("section-bridge relative z-10 bg-pts-bg", className)}>
      {scrubReveal && !isTouch && (
        <div
          ref={scrubLineRef}
          className="pointer-events-none absolute bottom-0 left-[8%] right-[8%] z-[3] h-px origin-left scale-x-[0.08] opacity-35"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(207,186,144,0.45), rgba(168,143,100,0.25), transparent)",
          }}
          aria-hidden
        />
      )}
      {mist && mounted && (
        <>
          <div className="section-border-top" aria-hidden="true" />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-pts-black/70 via-transparent to-transparent opacity-90"
            aria-hidden
          />
          {!isTouch && (
            <>
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-t from-pts-black/75 via-pts-black/22 to-transparent opacity-90"
                aria-hidden
              />
              <div
                className="mist-drift pointer-events-none absolute inset-0 z-[1] opacity-[0.22]"
                aria-hidden
              />
            </>
          )}
        </>
      )}
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}
