"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePerformance } from "@/contexts/PerformanceContext";
import { useLocale } from "@/contexts/LocaleContext";
import { t, type DictionaryKey } from "@/lib/dictionary";
import { buildServiceSlides } from "@/lib/service-slides";
import { educationDestinationImages } from "@/lib/service-category-images";
import { useClientLayoutMode } from "@/hooks/useClientLayoutMode";
import { useEnquirySubmit } from "@/hooks/useEnquirySubmit";
import { FormStatusMessage } from "@/components/forms/FormStatusMessage";
import { CountrySelect } from "@/components/forms/CountrySelect";
import { LuxurySelect } from "@/components/forms/LuxurySelect";
import { Modal } from "@/components/ui/Modal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EducationPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const { isLowEnd, reducedMotion } = usePerformance();
  const { locale } = useLocale();
  const { ready, useMobileSlides } = useClientLayoutMode();
  const enquiry = useEnquirySubmit("education");

  const destinations = educationDestinationImages.map((image, index) => ({
    title: t(locale, `education.destination${index + 1}.title` as DictionaryKey),
    description: t(locale, `education.destination${index + 1}.description` as DictionaryKey),
    image,
  }));

  const slides = buildServiceSlides(destinations, useMobileSlides);
  const studyDestinations = destinations.map((dest) => dest.title);

  useEffect(() => {
    if (!useMobileSlides || reducedMotion || !containerRef.current) return;
    const slideEls = Array.from(containerRef.current.querySelectorAll<HTMLElement>(".service-slide"));
    if (!slideEls.length) return;

    slideEls.forEach((slide) => {
      gsap.set(slide, { opacity: 0.01, y: 20 });
      slide.dataset.revealed = "false";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const slide = entry.target as HTMLElement;
          if (slide.dataset.revealed === "true") return;
          slide.dataset.revealed = "true";
          gsap.to(slide, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", overwrite: true });
        });
      },
      { threshold: 0.45 },
    );

    slideEls.forEach((slide) => io.observe(slide));
    return () => io.disconnect();
  }, [useMobileSlides, reducedMotion, destinations.length]);

  useGSAP(() => {
    if (!containerRef.current || reducedMotion || !ready || useMobileSlides) return;

    const slideElements = containerRef.current.querySelectorAll(".service-slide");

    const totalSlides = slideElements.length;
    // Build snap points: one per slide except last slide to allow scrolling past it
    const snapPoints = Array.from({ length: totalSlides - 1 }, (_, i) =>
      i === 0 ? 0 : i / (totalSlides - 2)
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        // Reduce scroll distance further
        end: `+=${(totalSlides + 1) * (isLowEnd ? 120 : 150)}%`,
        pin: true,
        anticipatePin: 1,
        // Lower scrub value for faster scroll response
        scrub: isLowEnd ? 1 : 2,
        // Snap to each slide after scrolling stops
        snap: {
          snapTo: snapPoints,
          duration: { min: 0.8, max: 1.2 },
          delay: 0,
          ease: "power2.inOut",
          inertia: false,
        },
        fastScrollEnd: true,
      },
    });

    // Set initial states
    slideElements.forEach((slide, idx) => {
      if (idx === 0) {
        gsap.set(slide, { yPercent: 0, opacity: 1, scale: 1, zIndex: 1 });
      } else {
        gsap.set(slide, { yPercent: 100, opacity: 0, scale: 1, zIndex: idx + 1 });
      }
    });

    slideElements.forEach((slide, idx) => {
      if (idx > 0) {
        const startTime = idx * 0.8;

        tl.to(slide, {
          yPercent: 0,
          opacity: 1,
          zIndex: idx + 1,
          ease: "power2.inOut",
        }, startTime); 

        const prevSlide = slideElements[idx - 1];
        tl.to(prevSlide, {
          scale: isLowEnd ? 1 : 0.94,
          opacity: 0,
          yPercent: isLowEnd ? 0 : -8,
          zIndex: idx,
          filter: isLowEnd ? "none" : "blur(8px)",
          ease: "power2.inOut"
        }, startTime);
      }
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, { scope: containerRef, dependencies: [ready, reducedMotion, isLowEnd, useMobileSlides], revertOnUpdate: true });

  return (
    <div className="bg-pts-bg min-h-screen">
      {/* Hero Section — pt clears the fixed navbar on mobile/tablet (lg already has layout-level offset) */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center border-b border-pts-line/20 pt-[4.5rem] sm:pt-[5rem] lg:pt-0">
        <div className="absolute inset-0 bg-gradient-to-b from-pts-deep to-pts-bg" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="lux-heading text-[0.5rem] text-pts-gold mb-6 tracking-[0.5em] uppercase">{t(locale, "education.page.hero" as DictionaryKey)}</p>
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl tracking-[0.1em] text-pts-parchment uppercase leading-[1.05] mb-6">
            {t(locale, "education.page.title" as DictionaryKey)}
          </h1>
          <p className="lux-heading text-[0.6rem] text-pts-gold mb-8 tracking-[0.4em] uppercase">
            {t(locale, "education.page.tagline" as DictionaryKey)}
          </p>
          <p className="max-w-2xl mx-auto text-[0.65rem] sm:text-[0.75rem] uppercase tracking-[0.2em] text-pts-muted/70 leading-relaxed mb-10">
            {t(locale, "education.page.subtitle" as DictionaryKey)}
          </p>
          <MagneticButton
            onClick={() => setShowEnquiry(true)}
            className="border-pts-gold bg-pts-gold px-12 py-4 text-[0.65rem] font-bold text-pts-black uppercase tracking-[0.3em] hover:bg-pts-gold/90"
          >
            {t(locale, "education.page.cta" as DictionaryKey)}
          </MagneticButton>
        </div>
      </section>

      {/* Destinations Section */}
      <section ref={containerRef} className="border-t border-pts-line bg-pts-black py-8 px-4 sm:py-10 sm:px-8 lg:px-10 relative overflow-hidden touch-pan-y pt-[2rem] sm:pt-[3rem] lg:pt-[4rem]">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="mb-12 text-center pt-8">
            <h2 className="font-heading text-3xl sm:text-5xl tracking-[0.1em] text-pts-parchment uppercase mb-4">
              {t(locale, "education.page.destinations" as DictionaryKey)}
            </h2>
          </div>

          <div className={`relative ${useMobileSlides ? "min-h-0" : "min-h-[min(72vh,680px)] sm:min-h-[450px] lg:min-h-[500px]"} overflow-hidden rounded-lg touch-pan-y`}>
            {slides.map((slideDestinations, slideIndex) => (
              <div
                key={`slide-${slideIndex}`}
                className={`service-slide bg-pts-black will-change-transform ${useMobileSlides ? "relative mb-6 min-h-[78svh] flex items-center" : "absolute inset-0"}`}
                style={
                  useMobileSlides
                    ? undefined
                    : { zIndex: slideIndex + 1, opacity: slideIndex === 0 ? 1 : 0 }
                }
              >
                <div
                  className="mx-auto grid h-full w-full max-w-md grid-cols-1 gap-4 lg:max-w-none lg:grid-cols-3 lg:gap-8"
                >
                  {slideDestinations.map((destination, destinationIndex) => (
                    <div
                      key={destinationIndex}
                      className="w-full border border-pts-gold/40 bg-pts-deep/40 overflow-hidden hover:border-pts-gold/60 hover:bg-pts-deep/50 transition-all duration-300 shadow-lg hover:shadow-2xl"
                    >
                      <div className="relative h-40 sm:h-44 overflow-hidden">
                        <Image
                          src={destination.image}
                          alt={destination.title}
                          fill
                          className="object-cover brightness-100 saturate-100"
                          sizes="(max-width: 767px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-pts-black/80 via-transparent to-transparent" />
                      </div>
                      <div className="p-6 pt-4 pb-4">
                        <h3 className="font-heading text-[1rem] sm:text-[1.1rem] uppercase tracking-[0.12em] text-pts-parchment mb-4">
                          {destination.title}
                        </h3>
                        <p className="text-[0.75rem] sm:text-[0.8rem] uppercase tracking-[0.18em] text-pts-muted/70 leading-loose">
                          {destination.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacer to create space between slider and footer */}
      <div className="h-[8vh] lg:h-[12vh]"></div>

      {/* Enquiry Modal */}
      <Modal isOpen={showEnquiry} onClose={() => setShowEnquiry(false)}>
        <div className="p-5 sm:p-6 md:p-8 flex-shrink-0">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <h3 className="font-heading text-lg sm:text-xl uppercase tracking-[0.1em] text-pts-parchment">
              {t(locale, "education.page.enquiry.title" as DictionaryKey)}
            </h3>
            <button
              type="button"
              onClick={() => setShowEnquiry(false)}
              className="text-pts-gold text-2xl hover:text-pts-parchment transition-colors flex-shrink-0"
            >
              ×
            </button>
          </div>
          <p className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.2em] text-pts-muted/70 mb-4 sm:mb-6">
            {t(locale, "education.page.enquiry.subtitle" as DictionaryKey)}
          </p>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-6 md:px-8 pb-5 sm:pb-6 md:pb-8" style={{ WebkitOverflowScrolling: 'touch' }}>
          <form
            className="space-y-3 sm:space-y-4"
            onSubmit={async (event) => {
              const ok = await enquiry.handleSubmit(event);
              if (ok) {
                setShowEnquiry(false);
                enquiry.reset();
              }
            }}
          >
            <div>
              <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
                {t(locale, "education.page.form.fullName" as DictionaryKey)}
              </label>
              <input
                type="text"
                name="firstName"
                required
                className="w-full bg-pts-black/50 border border-pts-gold/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                placeholder={t(locale, "education.page.form.placeholder.name" as DictionaryKey)}
              />
            </div>
            <div>
              <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
                {t(locale, "education.page.form.email" as DictionaryKey)}
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-pts-black/50 border border-pts-gold/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                placeholder={t(locale, "education.page.form.placeholder.email" as DictionaryKey)}
              />
            </div>
            <div>
              <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
                {t(locale, "education.page.form.phone" as DictionaryKey)}
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full bg-pts-black/50 border border-pts-gold/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                placeholder="+966 500 000 0000"
              />
            </div>
            <div>
              <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
                {t(locale, "education.page.form.destination" as DictionaryKey)}
              </label>
              <LuxurySelect
                name="destination"
                required
                placeholder={t(locale, "education.page.form.selectDestination" as DictionaryKey)}
                options={studyDestinations.map((dest) => ({ value: dest, label: dest }))}
              />
            </div>
            <div>
              <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
                {t(locale, "education.page.form.message" as DictionaryKey)}
              </label>
              <textarea
                name="message"
                rows={4}
                required
                className="w-full bg-pts-black/50 border border-pts-gold/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors resize-none"
                placeholder={t(locale, "education.page.form.placeholder.message" as DictionaryKey)}
              />
            </div>
            <FormStatusMessage status={enquiry.status} errorMessage={enquiry.errorMessage} />
            <MagneticButton
              type="submit"
              disabled={enquiry.isSending}
              className="w-full border-pts-gold bg-pts-gold px-6 sm:px-8 py-3 sm:py-4 text-[0.65rem] sm:text-[0.7rem] font-bold text-pts-black uppercase tracking-[0.25em] sm:tracking-[0.3em] hover:bg-pts-gold/90"
            >
              {t(locale, "education.page.form.submit" as DictionaryKey)}
            </MagneticButton>
          </form>
        </div>
      </Modal>
    </div>
  );
}
