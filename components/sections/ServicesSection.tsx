"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePerformance } from "@/contexts/PerformanceContext";
import { t, type DictionaryKey } from "@/lib/dictionary";
import { useLocale } from "@/contexts/LocaleContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reducedMotion, isLowEnd } = usePerformance();
  const { locale } = useLocale();
  const [currentSlide, setCurrentSlide] = useState(0);

  const services = [
    {
      title: t(locale, "services.section.concierge.title" as DictionaryKey),
      subtitle: t(locale, "services.section.concierge.subtitle" as DictionaryKey),
      description: t(locale, "services.section.concierge.description" as DictionaryKey),
      image: "/images/services/concierge/lai-man-nung-Td6Yy3S3Ls0-unsplash.jpg",
      link: "/services/concierge",
    },
    {
      title: t(locale, "services.section.mice.title" as DictionaryKey),
      subtitle: t(locale, "services.section.mice.subtitle" as DictionaryKey),
      description: t(locale, "services.section.mice.description" as DictionaryKey),
      image: "/images/services/mice/evangeline-shaw-DNVYaleNUF0-unsplash.jpg",
      link: "/services/mice",
    },
    {
      title: t(locale, "services.section.medical.title" as DictionaryKey),
      subtitle: t(locale, "services.section.medical.subtitle" as DictionaryKey),
      description: t(locale, "services.section.medical.description" as DictionaryKey),
      image: "/images/services/medical/medical-alex-bertha.webp",
      link: "/services/medical-tourism",
    },
    {
      title: t(locale, "services.section.sports.title" as DictionaryKey),
      subtitle: t(locale, "services.section.sports.subtitle" as DictionaryKey),
      description: t(locale, "services.section.sports.description" as DictionaryKey),
      image: "/images/services/sports/photo-1554068865-24cecd4e34b8 (1).jpeg",
      link: "/services/sports",
    },
  ];

  // Group services into slides of 1 each
  const slides = [
    [services[0]],
    [services[1]],
    [services[2]],
    [services[3]],
  ];

  useGSAP(() => {
    if (!containerRef.current || reducedMotion) return;

    const slideElements = containerRef.current.querySelectorAll(".service-slide");
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${slideElements.length * (isLowEnd ? 30 : 40)}%`,
        pin: true,
        anticipatePin: 1,
        scrub: isLowEnd ? 0.15 : (isTouch ? 0.35 : 0.6),
      },
    });

    // Set initial states
    slideElements.forEach((slide, idx) => {
      if (idx === 0) {
        gsap.set(slide, { yPercent: 0, opacity: 1, zIndex: slides.length });
        gsap.set(slide, { pointerEvents: 'auto' });
      } else {
        gsap.set(slide, { yPercent: 100, opacity: 0, zIndex: slides.length - idx });
        gsap.set(slide, { pointerEvents: 'none' });
      }
    });

    slideElements.forEach((slide, idx) => {
      if (idx > 0) {
        const startTime = idx * 0.45;

        // Animate current slide in
        tl.to(slide, {
          yPercent: 0,
          opacity: 1,
          zIndex: slides.length,
          pointerEvents: 'auto',
          ease: "power2.inOut",
        }, startTime);

        const prevSlide = slideElements[idx - 1];
        tl.to(prevSlide, {
          scale: isLowEnd ? 1 : 0.94,
          opacity: 0,
          yPercent: isLowEnd ? 0 : -8,
          zIndex: slides.length - idx,
          pointerEvents: 'none',
          filter: (isTouch || isLowEnd) ? "none" : "blur(8px)",
          ease: "power2.inOut"
        }, startTime);
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, { scope: containerRef, dependencies: [reducedMotion, isLowEnd] });

  return (
    <section ref={containerRef} className="relative min-h-screen bg-pts-bg">
      <div className="relative min-h-screen overflow-hidden">
        {slides.map((slideServices, slideIndex) => (
          <div
            key={slideIndex}
            className="service-slide absolute inset-0 bg-pts-black will-change-transform"
            style={{ zIndex: slides.length - slideIndex }}
          >
            <div className="flex items-center justify-center h-full">
              {slideServices.map((service, serviceIndex) => (
                <div
                  key={serviceIndex}
                  className="w-full max-w-7xl mx-auto px-6 md:px-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Text and Button on Left */}
                    <div className="relative z-10 flex flex-col justify-center order-2 md:order-1">
                      <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl tracking-[0.1em] text-pts-gold uppercase mb-4">
                        {service.title}
                      </h3>
                      <p className="lux-heading text-[0.7rem] md:text-[0.8rem] text-pts-parchment/80 tracking-[0.3em] uppercase mb-5">
                        {service.subtitle}
                      </p>
                      <p className="text-[0.7rem] md:text-[0.8rem] uppercase tracking-[0.18em] text-pts-muted/70 leading-relaxed mb-8 max-w-xl">
                        {service.description}
                      </p>
                      <MagneticButton
                        href={service.link}
                        className="border-pts-gold bg-pts-gold px-10 py-4 text-[0.7rem] font-bold text-pts-black uppercase tracking-[0.3em] hover:bg-pts-gold/90 w-fit"
                      >
                        {t(locale, "services.read.more" as DictionaryKey)}
                      </MagneticButton>
                    </div>

                    {/* Image on Right */}
                    <div className="relative h-[350px] md:h-[450px] lg:h-[500px] order-1 md:order-2">
                      <div className="absolute inset-0">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
                          priority={slideIndex === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-pts-deep/90 via-pts-deep/50 to-transparent rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
