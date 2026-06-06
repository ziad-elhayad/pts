"use client";

import { memo, useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { usePerformance } from "@/contexts/PerformanceContext";
import { useLocale } from "@/contexts/LocaleContext";
import { t } from "@/lib/dictionary";

const SLIDES = [
  {
    id: 1,
    src: "/images/hero/hero-aviation-lounge.webp",
  },
  {
    id: 2,
    src: "/images/hero/hero-cinematic-horizon.webp",
  },
  {
    id: 3,
    src: "/images/hero/hero-event-lighting.webp",
  },
  {
    id: 4,
    src: "/images/hero/hero-fine-dining.webp",
  },
  {
    id: 5,
    src: "/images/hero/hero-saudi-landscape.webp",
  },
];

export const SlideGallery = memo(function SlideGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isLowEnd, reducedMotion } = usePerformance();
  const { locale } = useLocale();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Create new interval
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, reducedMotion ? 3000 : 2000);
  }, [reducedMotion]);

  const handleDotClick = useCallback((index: number) => {
    setCurrentIndex(index);
    // Clear existing interval immediately
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Restart timer immediately
    startAutoplay();
  }, [startAutoplay]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startAutoplay]);

  return (
    <div className="relative w-full h-[100svh] flex flex-col items-center justify-center bg-pts-bg p-6 sm:p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl tracking-[0.2em] text-pts-gold uppercase mb-6">
          {t(locale, "home.gallery.title")}
        </h2>
        <p className="max-w-3xl text-lg sm:text-xl md:text-2xl font-heading tracking-[0.15em] text-pts-parchment leading-relaxed mb-4">
          {t(locale, "home.gallery.tagline")}
        </p>
        <p className="max-w-3xl text-[0.65rem] uppercase tracking-[0.2em] text-pts-muted/70 leading-relaxed">
          {t(locale, "home.gallery.description")}
        </p>
      </div>
      <div className="relative w-full h-full max-w-[1600px] flex-1">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all ${
              reducedMotion ? 'duration-300' : 'duration-1000'
            } ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95'
            }`}
          >
            <div className="relative h-full w-full overflow-hidden rounded-xl border border-pts-gold/20 bg-pts-black shadow-2xl">
              <Image
                src={slide.src}
                alt={`Slide ${slide.id}`}
                fill
                className="object-cover brightness-[0.85] contrast-[1.1] saturate-[0.85]"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw"
                quality={isLowEnd ? 70 : 85}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pts-black/80 via-transparent to-transparent" />
            </div>
          </div>
        ))}
        
        {/* Dots indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-pts-gold w-6' : 'bg-pts-gold/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>
    </div>
  );
});
