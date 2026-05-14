"use client";

import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { usePerformance } from "@/contexts/PerformanceContext";

type VideoSectionProps = {
  poster: string;
  src?: string;
  srcLarge?: string;
  className?: string;
  overlayClassName?: string;
  lazyVideo?: boolean;
};

export function VideoSection({
  poster,
  src,
  srcLarge,
  className,
  overlayClassName,
  lazyVideo = true,
}: VideoSectionProps) {
  const [mountVideo, setMountVideo] = useState(false);
  const [useVideo, setUseVideo] = useState(true);
  const { isLowEnd, reducedMotion } = usePerformance();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Never load video on touch/mobile or Low-End — poster is enough
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch || isLowEnd || reducedMotion) {
      setUseVideo(false);
      return;
    }

    if (!lazyVideo) {
      setMountVideo(true);
      return;
    }

    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number })
      .requestIdleCallback;
    const cancel = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
    
    if (typeof ric === "function") {
      const id = ric(() => setMountVideo(true), { timeout: 2200 });
      return () => {
        if (typeof cancel === "function") cancel(id);
      };
    }
    const t = window.setTimeout(() => setMountVideo(true), 600);
    return () => window.clearTimeout(t);
  }, [lazyVideo, isLowEnd, reducedMotion]);

  const onVideoError = useCallback(() => {
    setUseVideo(false);
  }, []);

  return (
    <div className={clsx("relative overflow-hidden", className)}>
      {mountVideo && src && useVideo ? (
        <video
          className="absolute inset-0 h-full w-full scale-[1.06] object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          preload="metadata"
          onError={onVideoError}
        >
          {srcLarge ? (
            <source src={srcLarge} type="video/mp4" media="(min-width: 1600px)" />
          ) : null}
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}
      {overlayClassName !== "none" && (
        <div
          className={clsx(
            "absolute inset-0 bg-gradient-to-b from-pts-black/40 via-transparent to-pts-black/60",
            overlayClassName,
          )}
        />
      )}
    </div>
  );
}
