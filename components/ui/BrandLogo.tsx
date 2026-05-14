"use client";

import clsx from "clsx";

type BrandLogoProps = {
  className?: string;
  size?: number;
};

/**
 * Stylized PTS Interlocking Logo.
 * Mimics the interlocking serif typography from the brand assets.
 */
export function BrandLogo({ className, size = 48 }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("transition-transform duration-500", className)}
    >
      {/* T - Central Pillar */}
      <path
        d="M35 25H65M50 25V75M42 75H58"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="serif"
        className="text-pts-gold"
      />
      
      {/* P - Left Interlock */}
      <path
        d="M30 40H42C48 40 48 52 42 52H30V70"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="serif"
        className="text-pts-gold-2"
      />
      <path
        d="M30 40V70"
        stroke="currentColor"
        strokeWidth="3.5"
      />

      {/* S - Right Interlock */}
      <path
        d="M70 42C70 38 64 38 60 38C55 38 52 41 52 45C52 55 70 52 70 62C70 68 64 72 58 72C52 72 50 68 50 65"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="serif"
        className="text-pts-gold-2"
      />
    </svg>
  );
}

/**
 * Text-based logo for wider contexts.
 */
export function BrandLogoFull({ className }: { className?: string }) {
  return (
    <div className={clsx("flex items-center gap-4", className)}>
      <BrandLogo size={42} />
      <div className="flex flex-col gap-0.5">
        <span className="lux-heading text-[0.72rem] tracking-[0.45em] text-pts-gold-2">PTS</span>
        <span className="text-[0.42rem] tracking-[0.38em] text-pts-gold-2/60 uppercase">
          Private Travel Services
        </span>
      </div>
    </div>
  );
}
