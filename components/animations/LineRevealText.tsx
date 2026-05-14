"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";
import { prefersReducedMotion } from "@/lib/motionPref";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface LineRevealTextProps {
  text: string;
  className?: string;
  /** "line" = gold underline paint (default). "cascade" = alternating diagonal word entrances (scrub). */
  mode?: "line" | "cascade";
  stagger?: number;
  delay?: number;
}

export function LineRevealText({ 
  text, 
  className, 
  mode = "line",
  stagger,
  delay = 0 
}: LineRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el || prefersReducedMotion()) return;

      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      if (mode === "cascade") {
        const nodes = el.querySelectorAll<HTMLElement>(".reveal-cascade");

        if (isTouch) {
          // Mobile: simple staggered fade-in, no scrub
          gsap.fromTo(
            nodes,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.03,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                once: true,
              },
            },
          );
          return;
        }

        // Desktop: full scrub cascade
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "top 48%",
            scrub: 0.55,
          },
          delay: delay
        });
        const finalStagger = stagger ?? 0.06;
        nodes.forEach((node, i) => {
          tl.fromTo(
            node,
            {
              opacity: 0.1,
              y: 38,
              x: i % 2 === 0 ? -32 : 32,
              rotateZ: i % 2 === 0 ? -3.5 : 3.5,
              filter: "blur(7px)",
            },
            {
              opacity: 1,
              y: 0,
              x: 0,
              rotateZ: 0,
              filter: "blur(0px)",
              duration: 0.35,
              ease: "none",
            },
            i * finalStagger,
          );
        });
        return;
      }

      // "line" mode
      const wordsEls = el.querySelectorAll<HTMLElement>(".reveal-word");
      const linesEls = el.querySelectorAll<HTMLElement>(".reveal-line");

      if (isTouch) {
        // Mobile: simple staggered fade-in, no scrub, no blur
        gsap.fromTo(
          wordsEls,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.04,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          },
        );
        return;
      }

      // Desktop: full scrub with underline paint
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "bottom 58%",
          scrub: 0.45,
        },
        delay: delay
      });

      const finalStagger = stagger ?? 0.08;
      wordsEls.forEach((word, i) => {
        const pos = i * finalStagger;
        tl.fromTo(
          word,
          { opacity: 0, y: 22, rotateX: 18, transformOrigin: "50% 100%", filter: "blur(5px)" },
          { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", duration: 0.45 },
          pos,
        );
        const line = linesEls[i];
        if (line) {
          tl.fromTo(line, { scaleX: 0, opacity: 0.85 }, { scaleX: 1, duration: 0.32, ease: "power2.inOut" }, pos).to(
            line,
            { opacity: 0, duration: 0.18 },
            pos + 0.28,
          );
        }
      });
    },
    { scope: containerRef, dependencies: [mode, text] },
  );

  if (mode === "cascade") {
    return (
      <div ref={containerRef} className={clsx("flex flex-wrap gap-x-[0.45em] gap-y-3", className)}>
        {words.map((word, i) => (
          <span key={i} className="reveal-cascade inline-block will-change-transform">
            {word}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={clsx("flex flex-wrap gap-x-[0.4em] gap-y-2", className)}>
      {words.map((word, i) => (
        <div key={i} className="relative inline-block overflow-hidden py-1">
          <span className="reveal-word inline-block will-change-transform">{word}</span>
          <div className="reveal-line absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-pts-gold" />
        </div>
      ))}
    </div>
  );
}
