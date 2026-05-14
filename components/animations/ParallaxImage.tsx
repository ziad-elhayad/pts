"use client";

import Image from "next/image";
import clsx from "clsx";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  intensity?: number;
  zoomScrub?: boolean;
};

export function ParallaxImage({
  src,
  alt,
  className,
  priority,
  intensity = 12,
  zoomScrub = false,
}: ParallaxImageProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = wrap.current;
      const target = img.current;
      if (!container || !target) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(target, { yPercent: 0, scale: 1 });
        return;
      }

      // Skip ALL parallax on touch — two scrubbing STs per image are too heavy
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isTouch) {
        gsap.set(target, { yPercent: 0, scale: 1 });
        return;
      }

      // Vertical parallax + optional zoom — scrub:0 for Lenis sync
      gsap.fromTo(
        target,
        { yPercent: -intensity, scale: zoomScrub ? 1.02 : 1 },
        {
          yPercent: intensity,
          scale: zoomScrub ? 1.08 : 1,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        }
      );

      // Subtle 3D depth shift — desktop only
      gsap.fromTo(
        container,
        { rotateX: 2, z: -20 },
        {
          rotateX: 0,
          z: 0,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 90%",
            end: "top 30%",
            scrub: 0.8,
          },
        }
      );
    },
    { scope: wrap, dependencies: [intensity, zoomScrub] }
  );

  return (
    <div
      ref={wrap}
      className={clsx("relative overflow-hidden scene-3d", className)}
    >
      <div
        ref={img}
        className="gpu-layer relative h-[115%] w-full -translate-y-[7.5%] will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
