"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import clsx from "clsx";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export function MagneticButton({
  children,
  className,
  href,
  onClick,
  type = "button",
}: MagneticButtonProps) {
  const x       = useMotionValue(0);
  const y       = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.3 });
  const transform = useMotionTemplate`translate3d(${springX}px, ${springY}px, 0)`;

  // Glow position follows mouse
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glowBg = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(168,143,100,0.18) 0%, transparent 70%)`;

  const onMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = event.clientX - rect.left - rect.width / 2;
    const relY = event.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.14);
    y.set(relY * 0.14);
    glowX.set(((event.clientX - rect.left) / rect.width) * 100);
    glowY.set(((event.clientY - rect.top) / rect.height) * 100);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
    glowX.set(50);
    glowY.set(50);
  };

  const inner = (
    <motion.span
      style={{ transform }}
      className={clsx(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden",
        "border border-pts-gold/40 bg-pts-gold/8 px-7 py-3.5",
        "text-[0.66rem] uppercase tracking-[0.36em] text-pts-gold-2",
        "transition-[border-color,box-shadow] duration-500",
        "hover:border-pts-gold hover:shadow-[0_0_30px_rgba(168,143,100,0.18),0_0_80px_rgba(168,143,100,0.06)]",
        className,
      )}
    >
      {/* Hover glow */}
      <motion.span
        className="pointer-events-none absolute inset-0"
        style={{ background: glowBg }}
      />
      {/* Shimmer sweep */}
      <span className="pointer-events-none absolute inset-0 gold-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.span>
  );

  if (href?.startsWith("/")) {
    return (
      <Link
        href={href}
        className="inline-block group"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {inner}
      </Link>
    );
  }

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block group"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className="inline-block group"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {inner}
    </motion.button>
  );
}
