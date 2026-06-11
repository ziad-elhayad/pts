"use client";

import { useEffect, useRef, useState } from "react";
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
  const [ready, setReady] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const { reducedMotion, isLowEnd } = usePerformance();
  const { locale, dir } = useLocale();

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
    {
      title: t(locale, "services.section.visa.title" as DictionaryKey),
      subtitle: t(locale, "services.section.visa.subtitle" as DictionaryKey),
      description: t(locale, "services.section.visa.description" as DictionaryKey),
      image: "/images/services/visa/visa-passport-travel.jpg",
      link: "/services/visa",
    },
    {
      title: t(locale, "services.section.education.title" as DictionaryKey),
      subtitle: t(locale, "services.section.education.subtitle" as DictionaryKey),
      description: t(locale, "services.section.education.description" as DictionaryKey),
      image: "/images/services/education/education-study-abroad.jpg",
      link: "/services/education",
    },
  ];

  // Group services into slides of 1 each
  const slides = [
    [services[0]],
    [services[1]],
    [services[2]],
    [services[3]],
    [services[4]],
    [services[5]],
  ];

  useEffect(() => {
    setReady(true);
    setIsTouch(typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0));
  }, []);

  useEffect(() => {
    if (!isTouch || reducedMotion || !containerRef.current) return;

    const slides = Array.from(containerRef.current.querySelectorAll<HTMLElement>(".mobile-service-slide"));
    if (!slides.length) return;

    slides.forEach((slide) => {
      gsap.set(slide, { opacity: 0.01, y: 24 });
      slide.dataset.revealed = "false";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const slide = entry.target as HTMLElement;
          if (slide.dataset.revealed === "true") return;
          slide.dataset.revealed = "true";
          gsap.to(slide, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            overwrite: true,
          });
        });
      },
      { threshold: 0.5 },
    );

    slides.forEach((slide) => io.observe(slide));
    return () => io.disconnect();
  }, [isTouch, reducedMotion, services.length]);

  useGSAP(() => {
    if (!containerRef.current || reducedMotion || isTouch) return;

    const slideElements = containerRef.current.querySelectorAll(".service-slide");

    const totalSlides = slideElements.length;
    // Build snap points: evenly distributed across slides
    const snapPoints = Array.from({ length: totalSlides - 1 }, (_, i) =>
      i / (totalSlides - 1)
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        // Reduce scroll distance further
        end: `+=${(totalSlides + 1) * (isLowEnd ? 80 : 100)}%`,
        pin: true,
        anticipatePin: 1,
        // Lower scrub value for faster scroll response
        scrub: 0.3,
        // Snap to each slide after scrolling stops
        snap: {
          snapTo: snapPoints,
          duration: { min: 0.4, max: 0.6 },
          delay: 0,
          ease: "power2.out",
          inertia: false,
        },
        fastScrollEnd: true,
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
        const startTime = idx * 1.0;

        // Animate current slide in
        tl.to(slide, {
          yPercent: 0,
          opacity: 1,
          zIndex: slides.length,
          pointerEvents: 'auto',
          ease: "power3.inOut",
          duration: 0.8,
        }, startTime);

        const prevSlide = slideElements[idx - 1];
        tl.to(prevSlide, {
          scale: isLowEnd ? 1 : 0.94,
          opacity: 0,
          yPercent: isLowEnd ? 0 : -8,
          zIndex: slides.length - idx,
          pointerEvents: 'none',
          filter: (isTouch || isLowEnd) ? "none" : "blur(8px)",
          ease: "power3.inOut",
          duration: 0.8,
        }, startTime);
      }
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, { scope: containerRef, dependencies: [reducedMotion, isLowEnd, slides, isTouch], revertOnUpdate: true });

  if (ready && isTouch) {
    return (
      <>
        <section ref={containerRef} className="relative w-full bg-pts-bg">
          <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-12">
            <p className="lux-heading mb-2 text-[0.65rem] uppercase tracking-[0.4em] text-pts-gold/70">GERVAE</p>
            <h2 
              className={`font-heading uppercase tracking-[0.15em] text-pts-parchment ${dir === 'rtl' ? '' : 'text-3xl'}`}
              style={dir === 'rtl' ? { fontSize: '25px' } : undefined}
            >
              {t(locale, "services.section.heading" as DictionaryKey)}
            </h2>
            <div className="mt-3 h-px w-12 bg-pts-gold/50" />
          </div>

          <div className="mx-auto w-full max-w-7xl px-6 pb-8 md:px-12">
            {services.map((service) => (
              <div key={service.link} className="mobile-service-slide min-h-[84svh] flex items-center py-6">
                <div className="w-full rounded-lg border border-pts-gold/15 bg-pts-black flex flex-col">
                  <div className="relative h-[42svh] overflow-hidden flex-shrink-0">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pts-deep/90 via-pts-deep/50 to-transparent" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="mb-3 font-heading text-2xl uppercase tracking-[0.08em] text-pts-gold flex-shrink-0 leading-tight">{service.title}</h3>
                    <p className={`mb-4 lux-heading uppercase tracking-[0.22em] text-pts-parchment/80 ${dir === 'rtl' ? 'text-[0.8rem]' : 'text-[0.66rem]'} flex-shrink-0 leading-tight`}>{service.subtitle}</p>
                    <p className={`mb-6 uppercase leading-relaxed tracking-[0.14em] text-pts-muted/70 ${dir === 'rtl' ? 'text-[0.85rem]' : 'text-[0.7rem]'} flex-1`}>{service.description}</p>
                    <MagneticButton
                      href={service.link}
                      className="w-fit border-pts-gold bg-pts-gold px-8 py-3.5 text-[0.7rem] font-bold uppercase tracking-[0.28em] text-pts-black hover:bg-pts-gold/90 flex-shrink-0"
                    >
                      {t(locale, "services.read.more" as DictionaryKey)}
                    </MagneticButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Spacer to create space between slider and footer */}
        <div className="h-[8vh] lg:h-[12vh]"></div>
      </>
    );
  }

  return (
    <>
      <section ref={containerRef} className="relative min-h-screen bg-pts-bg">
        {/* Section Heading — offset clears the fixed navbar (~72–82 px tall) */}
        <div className="absolute top-[4.75rem] sm:top-[5rem] left-0 right-0 z-50 flex flex-col items-start px-6 md:px-12 pointer-events-none">
          <p className="lux-heading text-[0.65rem] tracking-[0.4em] text-pts-gold/70 uppercase mb-2">
            GERVAE
          </p>
          <h2 
            className={`font-heading tracking-[0.15em] text-pts-parchment uppercase ${dir === 'rtl' ? '' : 'text-3xl md:text-4xl lg:text-5xl'}`}
            style={dir === 'rtl' ? { fontSize: '25px' } : undefined}
          >
            {t(locale, "services.section.heading" as DictionaryKey)}
          </h2>
          <div className="mt-3 w-12 h-px bg-pts-gold/50" />
        </div>

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
                      <div className="relative z-10 flex flex-col justify-center order-2 md:order-1 flex-1">
                        <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl tracking-[0.08em] text-pts-gold uppercase mb-4 pt-4 flex-shrink-0 leading-tight">
                          {service.title}
                        </h3>
                        <p className={`lux-heading text-pts-parchment/80 tracking-[0.22em] uppercase mb-5 ${dir === 'rtl' ? 'text-[0.85rem] md:text-[0.95rem]' : 'text-[0.7rem] md:text-[0.8rem]'} flex-shrink-0 leading-tight`}>
                          {service.subtitle}
                        </p>
                        <p className={`uppercase tracking-[0.14em] text-pts-muted/70 leading-relaxed mb-8 max-w-xl ${dir === 'rtl' ? 'text-[0.85rem] md:text-[0.95rem]' : 'text-[0.7rem] md:text-[0.8rem]'} flex-1`}>
                          {service.description}
                        </p>
                        <MagneticButton
                          href={service.link}
                          className="border-pts-gold bg-pts-gold px-10 py-4 text-[0.7rem] font-bold text-pts-black uppercase tracking-[0.3em] hover:bg-pts-gold/90 w-fit flex-shrink-0"
                        >
                          {t(locale, "services.read.more" as DictionaryKey)}
                        </MagneticButton>
                      </div>

                      {/* Image on Right */}
                      <div className="relative h-[350px] md:h-[450px] lg:h-[500px] order-1 md:order-2 flex-shrink-0">
                        <div className="absolute inset-0">
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            loading="lazy"
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

      {/* Spacer to create space between slider and footer */}
      <div className="h-[8vh] lg:h-[12vh]"></div>
    </>
  );
}
