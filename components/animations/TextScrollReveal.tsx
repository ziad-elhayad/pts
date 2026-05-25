"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface TextScrollRevealProps {
  as?: "div" | "p" | "span" | "h1" | "h2" | "h3";
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function TextScrollReveal({
  as: Component = "div",
  children,
  className,
  delay = 0,
}: TextScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref as never}
      className={clsx("text-scroll-reveal", visible && "is-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}
