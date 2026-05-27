"use client";

import { memo } from "react";
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
export const BrandLogo = memo(function BrandLogo({ className, size = 32, variant = "text" }: BrandLogoProps) {
  if (variant === "image") {
    return (
      <Image
        src="/images/logo image/c8cee5ff-cee7-4268-98cd-771a25792a54.png"
        alt="GERVAE"
        width={size}
        height={size}
        className={clsx("opacity-90 object-contain", className)}
        style={{ background: "transparent" }}
        loading="lazy"
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
});

/**
 * Full logo for wider contexts.
 */
export const BrandLogoFull = memo(function BrandLogoFull({ className }: { className?: string }) {
  return (
    <div className={clsx("flex items-center gap-4", className)}>
      <BrandLogo size={28} />
    </div>
  );
});
