"use client";

import clsx from "clsx";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect } from "react";
import { requestScrollTriggerRefresh } from "@/lib/scrollTriggerRefresh";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type SectionRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "snap" | "scrub";
};

export function SectionReveal({
  children,
  className,
  delay = 0,
  variant = "snap",
}: SectionRevealProps) {
  const root = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !mounted) return;
      const items = el.querySelectorAll<HTMLElement>("[data-reveal]");
      if (!items.length) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      requestScrollTriggerRefresh(260);

      if (variant === "scrub") {
        // Mobile: remove blur filter for better performance
        if (isTouch) {
          gsap.fromTo(
            items,
            { opacity: 0.08, y: 40 },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              stagger: 0.08,
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                end: "top 35%",
                scrub: 0.5, // Reduced scrub on mobile
                invalidateOnRefresh: true,
              },
            },
          );
        } else {
          gsap.fromTo(
            items,
            { opacity: 0.08, y: 56, rotateZ: -2, filter: "blur(4px)" },
            {
              opacity: 1,
              y: 0,
              rotateZ: 0,
              filter: "blur(0px)",
              ease: "none",
              stagger: 0.1,
              scrollTrigger: {
                trigger: el,
                start: "top 92%",
                end: "top 35%",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      } else {
        // Mobile: simplified animations, no 3D transforms
        if (isTouch) {
          gsap.fromTo(
            items,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.1,
              delay,
              scrollTrigger: {
                trigger: el,
                start: "top 94%",
                once: true, // No scrub on mobile for better performance
              },
            },
          );
        } else {
          gsap.fromTo(
            items,
            { opacity: 0, y: 48, rotateX: 22, z: -60, transformOrigin: "50% 80%" },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              z: 0,
              duration: 1.15,
              ease: "power4.out",
              stagger: 0.14,
              delay,
              scrollTrigger: {
                trigger: el,
                start: "top 94%",
                end: "bottom bottom",
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      }

      return;
    },
    { scope: root, dependencies: [delay, variant, mounted, isTouch], revertOnUpdate: true }
  );

  return (
    <div ref={root} className={clsx(className)}>
      {children}
    </div>
  );
}
