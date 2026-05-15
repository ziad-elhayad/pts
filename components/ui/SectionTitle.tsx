"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { useRef, useMemo, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motionPref";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type SectionTitleReveal =
  | "lift"
  | "blur-in"
  | "word-stagger"
  | "clip-wipe"
  | "scale-soft"
  | "char-drift";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  number: string;
  align?: "left" | "center";
  reveal?: SectionTitleReveal;
}

/** Play-once reveals — no scrub on titles to avoid scroll jitter / flicker on mobile. */
const ST = {
  enter: { start: "top 88%", toggleActions: "play none none none" as const },
};

/**
 * Section titles — each `reveal` uses a distinct GSAP + ScrollTrigger choreography.
 */
export function SectionTitle({
  title,
  subtitle,
  number,
  align = "left",
  reveal = "lift",
}: SectionTitleProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const words = useMemo(() => title.split(" "), [title]);
  const chars = useMemo(() => title.split(""), [title]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !mounted) return;
      if (prefersReducedMotion()) {
        gsap.set(root.querySelectorAll("[data-st-anim]"), { clearProps: "opacity,transform,filter,clipPath" });
        return;
      }

      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const meta = root.querySelectorAll("[data-st-meta]");
      const easeLux = "power4.out";
      const easeSnap = "back.out(1.35)";

      gsap.fromTo(
        meta,
        { opacity: 0, x: align === "center" ? 0 : -28, filter: isTouch ? "none" : "blur(6px)" },
        {
          opacity: 1,
          x: 0,
          filter: "none",
          duration: 0.75,
          stagger: 0.08,
          ease: easeLux,
          scrollTrigger: { trigger: root, ...ST.enter },
        },
      );

      const lineEl = root.querySelector<HTMLElement>("[data-st-line]");
      if (lineEl) {
        gsap.fromTo(
          lineEl,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power2.inOut",
            scrollTrigger: { trigger: root, ...ST.enter },
          },
        );
      }

      if (reveal === "word-stagger") {
        const nodes = root.querySelectorAll<HTMLElement>(".st-word-inner");
        gsap.set(nodes, { yPercent: 118, rotateX: isTouch ? 0 : 52, transformOrigin: "50% 0%", opacity: 0.35 });
        gsap.to(nodes, {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.05,
          ease: "expo.out",
          scrollTrigger: { trigger: root, ...ST.enter },
        });
        return;
      }

      if (reveal === "clip-wipe") {
        const el = root.querySelector<HTMLElement>(".st-clip-title");
        if (!el) return;
        gsap.fromTo(
          el,
          { clipPath: "inset(0 100% 0 0)", x: -18, skewX: -4 },
          {
            clipPath: "inset(0 0% 0 0)",
            x: 0,
            skewX: 0,
            duration: 1.05,
            ease: "power4.inOut",
            scrollTrigger: { trigger: root, ...ST.enter },
          },
        );
        return;
      }

      if (reveal === "blur-in") {
        const nodes = root.querySelectorAll<HTMLElement>(".st-char");
        nodes.forEach((node, i) => {
          gsap.fromTo(
            node,
            {
              opacity: 0,
              y: 28,
              rotateZ: i % 2 === 0 ? -6 : 6,
              filter: isTouch ? "none" : "blur(10px)",
            },
            {
              opacity: 1,
              y: 0,
              rotateZ: 0,
              filter: "none",
              duration: 0.65,
              delay: Math.abs(i - nodes.length / 2) * 0.012,
              ease: "power3.out",
              scrollTrigger: { trigger: root, ...ST.enter },
            },
          );
        });
        return;
      }

      if (reveal === "scale-soft") {
        const el = root.querySelector<HTMLElement>(".st-scale-title");
        if (!el) return;
        gsap.fromTo(
          el,
          {
            opacity: 0,
            scale: isTouch ? 1 : 0.88,
            rotateX: isTouch ? 0 : 18,
            letterSpacing: isTouch ? "0.05em" : "0.32em",
            transformOrigin: "50% 100%",
            y: 40,
          },
          {
            opacity: 1,
            scale: 1,
            rotateX: 0,
            letterSpacing: "0.02em",
            y: 0,
            duration: 1.1,
            ease: "power4.out",
            scrollTrigger: { trigger: root, ...ST.enter },
          },
        );
        return;
      }

      if (reveal === "char-drift") {
        const nodes = root.querySelectorAll<HTMLElement>(".st-drift");
        const order = gsap.utils.shuffle([...Array(nodes.length).keys()]);
        order.forEach((origIndex, orderIndex) => {
          const node = nodes[origIndex];
          gsap.fromTo(
            node,
            {
              opacity: 0,
              y: 20 + (origIndex % 3) * 12,
              x: origIndex % 2 === 0 ? -36 : 36,
              rotateZ: -5 + (origIndex % 5),
            },
            {
              opacity: 1,
              y: 0,
              x: 0,
              rotateZ: 0,
              duration: 1.05,
              delay: orderIndex * 0.025,
              ease: "expo.out",
              scrollTrigger: { trigger: root, ...ST.enter },
            },
          );
        });
        return;
      }

      /* lift (default) — cinematic rise + depth */
      const el = root.querySelector<HTMLElement>(".st-lift-title");
      if (!el) return;
      gsap.fromTo(
        el,
        {
          opacity: 0,
          yPercent: 55,
          rotateX: isTouch ? 0 : 42,
          transformOrigin: "50% 100%",
          z: isTouch ? 0 : -120,
        },
        {
          opacity: 1,
          yPercent: 0,
          rotateX: 0,
          z: 0,
          duration: 1.05,
          ease: easeSnap,
          scrollTrigger: { trigger: root, ...ST.enter },
        },
      );
    },
    { scope: rootRef, dependencies: [reveal, title, align, mounted] },
  );

  const isCenter = align === "center";

  const metaRow = (
    <div
      className={clsx(
        "mb-4 flex items-center gap-6",
        isCenter && "flex-wrap justify-center",
      )}
    >
      <span data-st-meta className="lux-heading text-[0.52rem] text-pts-gold tracking-[0.45em]">
        {number}
      </span>
      <div data-st-line className="h-px w-12 origin-left scale-x-0 bg-pts-gold/40" />
      {subtitle && (
        <p
          data-st-meta
          className="lux-heading text-[0.45rem] uppercase tracking-[0.8em] text-pts-gold opacity-60"
        >
          {subtitle}
        </p>
      )}
    </div>
  );

  const decorLine = (
    <div
      className={clsx(
        "absolute -left-12 top-0 bottom-0 hidden w-px bg-gradient-to-b from-pts-gold/30 to-transparent xl:block",
        isCenter && "hidden",
      )}
    />
  );

  const titleBase = clsx(
    "font-heading text-[clamp(1.75rem,7vw,2.5rem)] uppercase leading-tight tracking-[0.02em] text-pts-parchment md:text-7xl md:leading-none",
    isCenter && "text-center",
  );

  const perspectiveWrap = "transform-gpu [transform-style:preserve-3d] perspective-[1400px]";

  let titleBlock: ReactNode;

  if (reveal === "word-stagger") {
    titleBlock = (
      <h2 className={clsx(titleBase, perspectiveWrap)}>
        {words.map((word, wi) => (
          <span key={wi} className="mr-[0.2em] inline-block overflow-hidden align-baseline">
            <span data-st-anim className="st-word-inner inline-block will-change-transform">
              {word}
            </span>
          </span>
        ))}
      </h2>
    );
  } else if (reveal === "clip-wipe") {
    titleBlock = (
      <div className="overflow-hidden">
        <h2 data-st-anim className={clsx(titleBase, "st-clip-title will-change-[clip-path,transform]")}>
          {title}
        </h2>
      </div>
    );
  } else if (reveal === "blur-in") {
    titleBlock = (
      <h2 className={clsx(titleBase, perspectiveWrap)}>
        {chars.map((char, i) => (
          <span key={`${char}-${i}`} data-st-anim className="st-char inline-block will-change-transform">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h2>
    );
  } else if (reveal === "scale-soft") {
    titleBlock = (
      <div className={clsx("overflow-hidden", perspectiveWrap)}>
        <h2 data-st-anim className={clsx(titleBase, "st-scale-title inline-block will-change-transform")}>
          {title}
        </h2>
      </div>
    );
  } else if (reveal === "char-drift") {
    titleBlock = (
      <h2 className={clsx(titleBase, perspectiveWrap)}>
        {chars.map((char, i) => (
          <span key={`d-${char}-${i}`} data-st-anim className="st-drift inline-block will-change-transform">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h2>
    );
  } else {
    titleBlock = (
      <div className={clsx("overflow-visible", perspectiveWrap)}>
        <h2 data-st-anim className={clsx(titleBase, "st-lift-title inline-block will-change-transform")}>
          {title}
        </h2>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={clsx(
        "relative mb-10 md:mb-12",
        isCenter && "flex flex-col items-center text-center",
      )}
    >
      {metaRow}
      {titleBlock}
      {decorLine}
    </div>
  );
}
