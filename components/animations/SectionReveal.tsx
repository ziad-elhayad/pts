"use client";

import clsx from "clsx";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

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

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const items = el.querySelectorAll<HTMLElement>("[data-reveal]");
      if (!items.length) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Force a refresh after a short delay to catch any layout shifts
      const timeoutId = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 1500);

      if (variant === "scrub") {
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
              scrub: 0.8, // Reversible even in 'snap' mode
              invalidateOnRefresh: true,
            },
          },
        );
      }

      return () => clearTimeout(timeoutId);
    },
    { scope: root, dependencies: [delay, variant] }
  );

  return (
    <div ref={root} className={clsx(className)}>
      {children}
    </div>
  );
}
