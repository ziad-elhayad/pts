"use client";

import type { ReactNode } from "react";
import { memo } from "react";
import Link from "next/link";
import clsx from "clsx";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

function moveMagneticGlow(event: React.MouseEvent<HTMLElement>) {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const rect = event.currentTarget.getBoundingClientRect();
  const relX = event.clientX - rect.left - rect.width / 2;
  const relY = event.clientY - rect.top - rect.height / 2;

  event.currentTarget.style.setProperty("--magnetic-x", `${relX * 0.1}px`);
  event.currentTarget.style.setProperty("--magnetic-y", `${relY * 0.1}px`);
  event.currentTarget.style.setProperty("--glow-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
  event.currentTarget.style.setProperty("--glow-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
}

function resetMagneticGlow(event: React.MouseEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--magnetic-x", "0px");
  event.currentTarget.style.setProperty("--magnetic-y", "0px");
  event.currentTarget.style.setProperty("--glow-x", "50%");
  event.currentTarget.style.setProperty("--glow-y", "50%");
}

export const MagneticButton = memo(function MagneticButton({
  children,
  className,
  href,
  onClick,
  type = "button",
  disabled = false,
}: MagneticButtonProps) {
  const inner = (
    <span
      className={clsx(
        "relative inline-flex transform-gpu items-center justify-center gap-2 overflow-hidden",
        "translate-x-[var(--magnetic-x,0px)] translate-y-[var(--magnetic-y,0px)]",
        "border border-pts-gold/40 bg-pts-gold/8 px-7 py-3.5",
        "text-[0.66rem] uppercase tracking-[0.36em] text-pts-gold-2",
        "transition-[border-color,box-shadow,transform] duration-300 ease-out",
        "hover:scale-[1.02] hover:border-pts-gold hover:shadow-[0_0_40px_rgba(168,143,100,0.22),0_0_100px_rgba(168,143,100,0.08)] active:scale-[0.98]",
        className
      )}
    >
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at var(--glow-x,50%) var(--glow-y,50%), rgba(168,143,100,0.18) 0%, transparent 70%)",
        }}
      />
      <span className="pointer-events-none absolute inset-0 gold-shimmer opacity-0 transition-opacity group-hover:opacity-100" />
      <span className="relative z-10">{children}</span>
    </span>
  );

  if (href?.startsWith("/")) {
    return (
      <Link
        href={href}
        className="group inline-block"
        onMouseMove={moveMagneticGlow}
        onMouseLeave={resetMagneticGlow}
      >
        {inner}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-block"
        onMouseMove={moveMagneticGlow}
        onMouseLeave={resetMagneticGlow}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx("group inline-block", disabled && "pointer-events-none opacity-60")}
      onMouseMove={moveMagneticGlow}
      onMouseLeave={resetMagneticGlow}
    >
      {inner}
    </button>
  );
});
