"use client";

import clsx from "clsx";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMemo, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type AnimatedTextProps = {
  text: string;
  className?: string;
};

export function AnimatedText({ text, className }: AnimatedTextProps) {
  const root = useRef<HTMLParagraphElement>(null);
  const words = useMemo(() => text.split(" "), [text]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const chars = el.querySelectorAll<HTMLElement>("[data-char]");
      
      gsap.fromTo(
        chars,
        { 
          opacity: 0, 
          y: 20, 
          filter: "blur(12px)",
          scale: 0.94,
          rotateX: -15
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          rotateX: 0,
          duration: 1.2,
          ease: "power4.out",
          stagger: {
            amount: 0.8,
            from: "start"
          },
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        },
      );
    },
    { scope: root, dependencies: [text] },
  );

  return (
    <p ref={root} className={clsx(className, "perspective-1000")} style={{ perspective: "1200px" }}>
      {words.map((word, wi) => (
        <span key={`${word}-${wi}`} className="inline-block overflow-hidden mr-[0.25em] py-1">
          {word.split("").map((char, ci) => (
            <span 
              key={ci} 
              data-char 
              className="inline-block will-change-transform transform-gpu"
              style={{ transformStyle: "preserve-3d" }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </p>
  );
}
