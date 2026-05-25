"use client";

import Image from "next/image";
import clsx from "clsx";

type BrandLogoProps = {
  className?: string;
  size?: number;
  variant?: "text" | "image";
};

/**
 * GERVAE Logo.
 */
export function BrandLogo({ className, size = 32, variant = "text" }: BrandLogoProps) {
  if (variant === "image") {
    return (
      <Image
        src="/images/gervae-logo.png"
        alt="GERVAE"
        width={size * 2}
        height={size}
        className={clsx("opacity-90", className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        "font-heading text-pts-gold font-bold tracking-[0.12em]",
        className
      )}
      style={{ fontSize: `${size}px` }}
    >
      GERVAE
    </div>
  );
}

/**
 * Full logo for wider contexts.
 */
export function BrandLogoFull({ className }: { className?: string }) {
  return (
    <div className={clsx("flex items-center gap-4", className)}>
      <BrandLogo size={28} />
    </div>
  );
}
