"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import clsx from "clsx";
import type { ReactNode } from "react";

type CardImage = {
  src: string;
  alt: string;
  priority?: boolean;
};

type PremiumCardProps = {
  title: string;
  description: string;
  kicker?: string;
  className?: string;
  footer?: ReactNode;
  image?: CardImage;
};

/**
 * PremiumCard — full 3D perspective tilt on hover.
 * Mouse position drives rotateX/rotateY for a physical, depth-rich feel.
 */
export function PremiumCard({
  title,
  description,
  kicker,
  className,
  footer,
  image,
}: PremiumCardProps) {
  const cardRef  = useRef<HTMLElement>(null);

  const rawX  = useMotionValue(0);
  const rawY  = useMotionValue(0);
  const rotX  = useSpring(rawY, { stiffness: 180, damping: 22, mass: 0.4 });
  const rotY  = useSpring(rawX, { stiffness: 180, damping: 22, mass: 0.4 });
  const shine = useTransform(rawX, [-0.5, 0.5], ["rgba(207,186,144,0)", "rgba(207,186,144,0.08)"]);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx   = (e.clientX - rect.left) / rect.width  - 0.5;
    const ny   = (e.clientY - rect.top)  / rect.height - 0.5;
    rawX.set(nx);
    rawY.set(ny * -1);
  };

  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const rotXDeg = useTransform(rotX, [-0.5, 0.5], ["-8deg", "8deg"]);
  const rotYDeg = useTransform(rotY, [-0.5, 0.5], ["-8deg", "8deg"]);

  return (
    <motion.article
      ref={cardRef}
      className={clsx(
        "group relative flex flex-col overflow-hidden border-r border-pts-gold/10 h-full w-[85vw] sm:w-[60vw] md:w-[38vw] shrink-0",
        className,
      )}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        className="relative h-full w-full flex flex-col"
        style={{
          rotateX: rotXDeg,
          rotateY: rotYDeg,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Background image */}
        {image ? (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="hg-parallax-img absolute inset-0 w-[140%] h-full left-[-20%]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover brightness-[0.65] saturate-[0.8] transition-[filter,transform] duration-[3s] ease-out group-hover:brightness-[0.9] group-hover:saturate-[1] group-hover:scale-105"
                priority={image.priority}
              />
            </div>

            {/* Multi-layer gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-pts-deep/70 via-pts-deep/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-pts-deep/20 via-transparent to-transparent" />
          </div>
        ) : null}

        {/* Dynamic shine overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20"
          style={{ background: shine, mixBlendMode: "screen" }}
        />

        {/* Geometric accent — top left */}
        <div className="absolute top-10 left-10 z-20 transition-transform duration-700 group-hover:translate-x-1 group-hover:-translate-y-1">
          <div className="h-px w-10 bg-pts-gold/40" />
          <div className="h-10 w-px bg-pts-gold/40" />
        </div>

        {/* Geometric accent — bottom right */}
        <div className="absolute bottom-10 right-10 z-20 opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:translate-y-1">
          <div className="h-px w-6 bg-pts-gold/30 ml-auto" />
          <div className="h-6 w-px bg-pts-gold/30 ml-auto" />
        </div>

        {/* Content panel */}
        <div
          className="relative z-10 mt-auto mx-6 mb-10 glass-deep p-10 lg:p-14 border border-pts-gold/15 transition-[border-color,box-shadow] duration-700 group-hover:border-pts-gold/30 group-hover:shadow-[0_0_40px_rgba(168,143,100,0.08)]"
          style={{ transform: "translateZ(30px)" }}
        >
          {kicker ? (
            <span className="lux-heading text-[0.44rem] text-pts-gold tracking-[0.6em] uppercase opacity-50 mb-5 block">
              {kicker}
            </span>
          ) : null}

          <h3 className="font-heading text-xl tracking-[0.14em] text-pts-gold-2 uppercase leading-[1.25] mb-6 max-w-xs font-light lg:text-2xl">
            {title}
          </h3>

          <p className="max-w-xs text-[0.63rem] uppercase tracking-[0.22em] leading-[2] text-pts-gold-2/45 opacity-0 transform translate-y-4 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:translate-y-0">
            {description}
          </p>

          {footer ? (
            <div className="mt-10 pt-5 border-t border-pts-gold/10 w-full opacity-0 transition-opacity duration-700 delay-100 group-hover:opacity-100">
              {footer}
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.article>
  );
}
