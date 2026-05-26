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
import { sportsCategoryImages } from "@/lib/service-category-images";
import { useMobileSliderView } from "@/hooks/useMobileSliderView";
import { useEnquirySubmit } from "@/hooks/useEnquirySubmit";
import { FormStatusMessage } from "@/components/forms/FormStatusMessage";
import { CountrySelect } from "@/components/forms/CountrySelect";
import { LuxurySelect } from "@/components/forms/LuxurySelect";
import { Modal } from "@/components/ui/Modal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SportsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const { isLowEnd, reducedMotion } = usePerformance();
  const { locale } = useLocale();
  const { isMobileSlider } = useMobileSliderView();
  const enquiry = useEnquirySubmit("sports");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create services array dynamically based on locale
  const services = sportsCategoryImages.map((image, index) => ({
    title: t(locale, `sports.service${index + 1}.title` as DictionaryKey),
    description: t(locale, `sports.service${index + 1}.description` as DictionaryKey),
    image,
  }));

  const slides = buildServiceSlides(services, isMobileSlider);

  // Create sportTypes array dynamically based on locale
  const sportTypes = services.map((service) => service.title);

  useGSAP(() => {
    if (!containerRef.current || reducedMotion || !mounted) return;

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
        gsap.set(slide, { yPercent: 0, opacity: 1, scale: 1, zIndex: 1 });
      } else {
        gsap.set(slide, { yPercent: 100, opacity: 0, scale: 1, zIndex: idx + 1 });
      }
    });

    slideElements.forEach((slide, idx) => {
      if (idx > 0) {
        const startTime = idx * 0.45;

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
          filter: (isTouch || isLowEnd) ? "none" : "blur(8px)",
          ease: "power2.inOut"
        }, startTime);
      }
    });

    ScrollTrigger.refresh();

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, { scope: containerRef, dependencies: [mounted, reducedMotion, isLowEnd, isMobileSlider] });

  return (
    <div className="bg-pts-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center border-b border-pts-line/20">
        <div className="absolute inset-0 bg-gradient-to-b from-pts-deep to-pts-bg" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="lux-heading text-[0.5rem] text-pts-gold mb-6 tracking-[0.5em] uppercase">{t(locale, "sports.page.hero" as DictionaryKey)}</p>
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl tracking-[0.1em] text-pts-parchment uppercase leading-[1.05] mb-6">
            {t(locale, "sports.page.title" as DictionaryKey)}
          </h1>
          <p className="lux-heading text-[0.6rem] text-pts-gold mb-8 tracking-[0.4em] uppercase">
            {t(locale, "sports.page.tagline" as DictionaryKey)}
          </p>
          <p className="max-w-2xl mx-auto text-[0.65rem] sm:text-[0.75rem] uppercase tracking-[0.2em] text-pts-muted/70 leading-relaxed mb-10">
            {t(locale, "sports.page.subtitle" as DictionaryKey)}
          </p>
          <MagneticButton
            onClick={() => setShowEnquiry(true)}
            className="border-pts-gold bg-pts-gold px-12 py-4 text-[0.65rem] font-bold text-pts-black uppercase tracking-[0.3em] hover:bg-pts-gold/90"
          >
            {t(locale, "sports.page.cta" as DictionaryKey)}
          </MagneticButton>
        </div>
      </section>

      {/* Services Section */}
      <section ref={containerRef} className="border-t border-pts-line bg-pts-black py-8 px-4 sm:py-10 sm:px-8 lg:px-10 relative overflow-hidden touch-pan-y">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="mb-12 text-center">
            <p className="lux-heading text-[0.5rem] text-pts-gold mb-4 tracking-[0.5em] uppercase">9 {t(locale, "sports.page.categories" as DictionaryKey)}</p>
            <h2 className="font-heading text-3xl sm:text-5xl tracking-[0.1em] text-pts-parchment uppercase">
              {t(locale, "sports.page.categories" as DictionaryKey)}
            </h2>
          </div>

          <div className="relative min-h-[min(72vh,680px)] sm:min-h-[450px] lg:min-h-[500px] overflow-hidden rounded-lg touch-pan-y">
            {slides.map((slideServices, slideIndex) => (
              <div
                key={`${isMobileSlider ? "m" : "d"}-${slideIndex}`}
                className="service-slide absolute inset-0 bg-pts-black will-change-transform"
                style={{ zIndex: slideIndex + 1, opacity: slideIndex === 0 ? 1 : 0 }}
              >
                <div
                  className="mx-auto grid h-full w-full max-w-md grid-cols-1 gap-4 lg:max-w-none lg:grid-cols-3 lg:gap-8"
                >
                  {slideServices.map((service, serviceIndex) => (
                    <div
                      key={serviceIndex}
                      className="w-full border border-pts-gold/40 bg-pts-deep/40 overflow-hidden hover:border-pts-gold/60 hover:bg-pts-deep/50 transition-all duration-300 shadow-lg hover:shadow-2xl"
                    >
                      <div className="relative h-48 sm:h-52 overflow-hidden">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover brightness-100 saturate-100"
                          sizes="(max-width: 767px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-pts-black/80 via-transparent to-transparent" />
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading text-[1rem] sm:text-[1.1rem] uppercase tracking-[0.12em] text-pts-parchment mb-4">
                          {service.title}
                        </h3>
                        <p className="text-[0.75rem] sm:text-[0.8rem] uppercase tracking-[0.18em] text-pts-muted/70 leading-loose">
                          {service.description}
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

      {/* Enquiry Modal */}
      <Modal isOpen={showEnquiry} onClose={() => setShowEnquiry(false)}>
        <div className="p-5 sm:p-6 md:p-8 flex-shrink-0">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <h3 className="font-heading text-lg sm:text-xl uppercase tracking-[0.1em] text-pts-parchment">
              {t(locale, "sports.page.enquiry.title" as DictionaryKey)}
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
            {t(locale, "sports.page.enquiry.subtitle" as DictionaryKey)}
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
                {t(locale, "services.concierge.form.firstName" as DictionaryKey)}
              </label>
              <input
                type="text"
                name="firstName"
                required
                className="w-full bg-pts-black/50 border border-pts-gold/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                placeholder={locale === "ar" ? "الاسم الأول" : "Your first name"}
              />
            </div>
            <div>
              <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
                {t(locale, "services.concierge.form.email" as DictionaryKey)}
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-pts-black/50 border border-pts-gold/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                placeholder={locale === "ar" ? "بريدك الإلكتروني" : "your@email.com"}
              />
            </div>
            <div>
              <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
                {t(locale, "sports.page.form.nationality" as DictionaryKey)}
              </label>
              <CountrySelect
                name="nationality"
                required
                placeholder={t(locale, "sports.page.form.selectCountry" as DictionaryKey)}
              />
            </div>
            <div>
              <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
                {t(locale, "sports.page.form.phone" as DictionaryKey)}
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
                {t(locale, "sports.page.form.sportType" as DictionaryKey)}
              </label>
              <LuxurySelect
                name="sportType"
                required
                placeholder={t(locale, "sports.page.form.selectSport" as DictionaryKey)}
                options={sportTypes.map((type) => ({ value: type, label: type }))}
              />
            </div>
            <div>
              <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
                {t(locale, "sports.page.form.message" as DictionaryKey)}
              </label>
              <textarea
                name="message"
                rows={4}
                required
                className="w-full bg-pts-black/50 border border-pts-gold/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors resize-none"
                placeholder={t(locale, "sports.page.form.placeholder.message" as DictionaryKey)}
              />
            </div>
            <FormStatusMessage status={enquiry.status} errorMessage={enquiry.errorMessage} />
            <MagneticButton
              type="submit"
              disabled={enquiry.isSending}
              className="w-full border-pts-gold bg-pts-gold px-6 sm:px-8 py-3 sm:py-4 text-[0.65rem] sm:text-[0.7rem] font-bold text-pts-black uppercase tracking-[0.25em] sm:tracking-[0.3em] hover:bg-pts-gold/90"
            >
              {t(locale, "sports.page.form.submit" as DictionaryKey)}
            </MagneticButton>
          </form>
        </div>
      </Modal>
    </div>
  );
}
