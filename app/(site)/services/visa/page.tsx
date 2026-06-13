"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";
import gsap from "gsap";
import { usePerformance } from "@/contexts/PerformanceContext";
import { useLocale } from "@/contexts/LocaleContext";
import { t, type DictionaryKey } from "@/lib/dictionary";
import { useClientLayoutMode } from "@/hooks/useClientLayoutMode";
import { useEnquirySubmit } from "@/hooks/useEnquirySubmit";
import { FormStatusMessage } from "@/components/forms/FormStatusMessage";
import { CountrySelect } from "@/components/forms/CountrySelect";
import { LuxurySelect } from "@/components/forms/LuxurySelect";
import { Modal } from "@/components/ui/Modal";
import {
  getVisaTypeCategoryOptions,
  type VisaTypeKey,
} from "@/lib/contact-service-options";

export default function VisaPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const { isLowEnd, reducedMotion } = usePerformance();
  const { locale } = useLocale();
  const { ready, useMobileSlides } = useClientLayoutMode();
  const enquiry = useEnquirySubmit("visa");

  // Visa type radio + category state
  const [selectedVisaType, setSelectedVisaType] = useState<VisaTypeKey | "">("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const visaTypeOptions = useMemo(
    () => [
      { value: "long-stay" as VisaTypeKey, label: t(locale, "visa.categories.longStay.title" as DictionaryKey) },
      { value: "short-stay" as VisaTypeKey, label: t(locale, "visa.categories.shortStay.title" as DictionaryKey) },
      { value: "specialized" as VisaTypeKey, label: t(locale, "visa.categories.specialized.title" as DictionaryKey) },
    ],
    [locale]
  );

  const categoryOptions = useMemo(
    () => getVisaTypeCategoryOptions(locale, selectedVisaType),
    [locale, selectedVisaType]
  );

  const handleVisaTypeChange = useCallback((type: VisaTypeKey) => {
    setSelectedVisaType(type);
    setSelectedCategory(""); // reset category when visa type changes
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
  }, []);

  const categories = [
    {
      id: "short-stay",
      title: t(locale, "visa.categories.shortStay.title" as DictionaryKey),
      description: t(locale, "visa.categories.shortStay.description" as DictionaryKey),
      visas: [
        {
          title: t(locale, "visa.shortStay.medical.title" as DictionaryKey),
          description: t(locale, "visa.shortStay.medical.description" as DictionaryKey),
          image: "/images/services/visa/visa-medical-treatment.jpg",
        },
        {
          title: t(locale, "visa.shortStay.business.title" as DictionaryKey),
          description: t(locale, "visa.shortStay.business.description" as DictionaryKey),
          image: "/images/services/visa/visa-business.jpg",
        },
        {
          title: t(locale, "visa.shortStay.tourist.title" as DictionaryKey),
          description: t(locale, "visa.shortStay.tourist.description" as DictionaryKey),
          image: "/images/services/visa/visa-tourist-regular1.jpg",
        },
        {
          title: t(locale, "visa.shortStay.family.title" as DictionaryKey),
          description: t(locale, "visa.shortStay.family.description" as DictionaryKey),
          image: "/images/services/visa/visa-family-reunification.jpg",
        },
      ],
    },
    {
      id: "long-stay",
      title: t(locale, "visa.categories.longStay.title" as DictionaryKey),
      description: t(locale, "visa.categories.longStay.description" as DictionaryKey),
      visas: [
        {
          title: t(locale, "visa.longStay.student.title" as DictionaryKey),
          description: t(locale, "visa.longStay.student.description" as DictionaryKey),
          image: "/images/services/visa/visa-studying.jpg",
        },
        {
          title: t(locale, "visa.longStay.employment.title" as DictionaryKey),
          description: t(locale, "visa.longStay.employment.description" as DictionaryKey),
          image: "/images/services/visa/visa-work.jpg",
        },
        {
          title: t(locale, "visa.longStay.jobSeeker.title" as DictionaryKey),
          description: t(locale, "visa.longStay.jobSeeker.description" as DictionaryKey),
          image: "/images/services/visa/visa-d-visa.jpg",
        },
        {
          title: t(locale, "visa.longStay.familyReunion.title" as DictionaryKey),
          description: t(locale, "visa.longStay.familyReunion.description" as DictionaryKey),
          image: "/images/services/visa/visa-family-reunification.jpg",
        },
        {
          title: t(locale, "visa.longStay.euBlueCard.title" as DictionaryKey),
          description: t(locale, "visa.longStay.euBlueCard.description" as DictionaryKey),
          image: "/images/services/visa/visa-schengen-uk.jpg",
        },
      ],
    },
    {
      id: "specialized",
      title: t(locale, "visa.categories.specialized.title" as DictionaryKey),
      description: t(locale, "visa.categories.specialized.description" as DictionaryKey),
      visas: [
        {
          title: t(locale, "visa.specialized.retirement.title" as DictionaryKey),
          description: t(locale, "visa.specialized.retirement.description" as DictionaryKey),
          image: "/images/services/visa/visa-retirement.jpg",
        },
        {
          title: t(locale, "visa.specialized.investor.title" as DictionaryKey),
          description: t(locale, "visa.specialized.investor.description" as DictionaryKey),
          image: "/images/services/visa/visa-business.jpg",
        },
        {
          title: t(locale, "visa.specialized.digitalNomad.title" as DictionaryKey),
          description: t(locale, "visa.specialized.digitalNomad.description" as DictionaryKey),
          image: "/images/services/visa/visa-schengen-usa.jpg",
        },
        {
          title: t(locale, "visa.specialized.permanent.title" as DictionaryKey),
          description: t(locale, "visa.specialized.permanent.description" as DictionaryKey),
          image: "/images/services/visa/visa-long-term-resident.jpg",
        },
        {
          title: t(locale, "visa.specialized.transit.title" as DictionaryKey),
          description: t(locale, "visa.specialized.transit.description" as DictionaryKey),
          image: "/images/services/visa/visa-transit.jpg",
        },
      ],
    },
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const activeCategoryData = categories.find((cat) => cat.id === activeCategory) || categories[0];

  useEffect(() => {
    if (!useMobileSlides || reducedMotion || !containerRef.current) return;
    const slideEls = Array.from(containerRef.current.querySelectorAll<HTMLElement>(".visa-card"));
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
  }, [useMobileSlides, reducedMotion, categories.length]);

  return (
    <div className="bg-pts-bg min-h-screen">
      {/* Hero Section — pt clears the fixed navbar on mobile/tablet (lg already has layout-level offset) */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center border-b border-pts-line/20 pt-[4.5rem] sm:pt-[5rem] lg:pt-0">
        <div className="absolute inset-0 bg-gradient-to-b from-pts-deep to-pts-bg" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="lux-heading text-[0.5rem] text-pts-gold mb-6 tracking-[0.5em] uppercase">{t(locale, "visa.page.hero" as DictionaryKey)}</p>
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl tracking-[0.1em] text-pts-parchment uppercase leading-[1.05] mb-6">
            {t(locale, "visa.page.title" as DictionaryKey)}
          </h1>
          <p className="lux-heading text-[0.6rem] text-pts-gold mb-8 tracking-[0.4em] uppercase">
            {t(locale, "visa.page.tagline" as DictionaryKey)}
          </p>
          <p className="max-w-2xl mx-auto text-[0.65rem] sm:text-[0.75rem] uppercase tracking-[0.2em] text-pts-muted/70 leading-relaxed mb-10">
            {t(locale, "visa.page.subtitle" as DictionaryKey)}
          </p>
          <MagneticButton
            onClick={() => setShowEnquiry(true)}
            className="border-pts-gold bg-pts-gold px-12 py-4 text-[0.65rem] font-bold text-pts-black uppercase tracking-[0.3em] hover:bg-pts-gold/90"
          >
            {t(locale, "visa.page.cta" as DictionaryKey)}
          </MagneticButton>
        </div>
      </section>

      {/* Services Section */}
      <section ref={containerRef} className="border-t border-pts-line bg-pts-black py-8 px-4 sm:py-10 sm:px-8 lg:px-10 relative overflow-hidden touch-pan-y pt-[2rem] sm:pt-[3rem] lg:pt-[4rem] min-h-screen">
        <div className="w-full relative z-10">
          <div className="mb-12 text-center pt-8">
            <h2 className="font-heading text-3xl sm:text-5xl tracking-[0.1em] text-pts-parchment uppercase">
              {t(locale, "visa.page.categories" as DictionaryKey)}
            </h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.25em] transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-pts-gold text-pts-black"
                    : "bg-pts-deep/40 text-pts-parchment border border-pts-gold/40 hover:border-pts-gold/60"
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>

          {/* Category Description */}
          <div className="mb-8 text-center">
            <p className="text-[0.7rem] sm:text-[0.8rem] uppercase tracking-[0.2em] text-pts-muted/80 leading-loose max-w-3xl mx-auto">
              {activeCategoryData.description}
            </p>
          </div>

          {/* Visa Cards Grid */}
          <div className="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10 max-w-[1200px]">
            {activeCategoryData.visas.map((visa, index) => (
              <div
                key={index}
                className="visa-card w-full border border-pts-gold/40 bg-pts-deep/40 hover:border-pts-gold/60 hover:bg-pts-deep/50 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col items-stretch animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 sm:h-52 overflow-hidden flex-shrink-0">
                  <Image
                    src={visa.image}
                    alt={visa.title || "Visa"}
                    fill
                    className="object-cover brightness-100 saturate-100"
                    sizes="(max-width: 767px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pts-black/80 via-transparent to-transparent" />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <h3 className="font-heading text-[1.1rem] sm:text-[1.15rem] uppercase tracking-[0.1em] text-pts-parchment mb-3 flex-shrink-0 leading-tight">
                    {visa.title}
                  </h3>
                  <p className="text-[0.8rem] sm:text-[0.85rem] uppercase tracking-[0.14em] text-pts-muted/70 leading-relaxed flex-1">
                    {visa.description}
                  </p>
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
              {t(locale, "visa.page.enquiry.title" as DictionaryKey)}
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
            {t(locale, "visa.page.enquiry.subtitle" as DictionaryKey)}
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
                setSelectedVisaType("");
                setSelectedCategory("");
              }
            }}
          >
            <div>
              <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
                {t(locale, "visa.page.form.fullName" as DictionaryKey)}
              </label>
              <input
                type="text"
                name="firstName"
                required
                className="w-full bg-pts-black/50 border border-pts-gold/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                placeholder={t(locale, "visa.page.form.placeholder.name" as DictionaryKey)}
              />
            </div>
            <div>
              <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
                {t(locale, "visa.page.form.email" as DictionaryKey)}
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-pts-black/50 border border-pts-gold/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                placeholder={t(locale, "visa.page.form.placeholder.email" as DictionaryKey)}
              />
            </div>
            <div>
              <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
                {t(locale, "visa.page.form.phone" as DictionaryKey)}
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full bg-pts-black/50 border border-pts-gold/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                placeholder="+966 500 000 0000"
              />
            </div>

            {/* ── Visa Type Radio Group ── */}
            <div>
              <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-2 sm:mb-3">
                {t(locale, "visa.page.form.visaTypeGroup" as DictionaryKey)}
                <span className="text-pts-gold/60 ml-1">*</span>
              </label>
              <div className="visa-type-radio-group">
                {visaTypeOptions.map((option) => (
                  <label key={option.value} className="visa-type-radio-option">
                    <input
                      type="radio"
                      name="visaTypeGroup"
                      value={option.value}
                      required
                      checked={selectedVisaType === option.value}
                      onChange={() => handleVisaTypeChange(option.value)}
                    />
                    <span className="visa-type-radio-label">
                      <span className="visa-type-radio-dot" aria-hidden="true" />
                      <span className="visa-type-radio-text">{option.label}</span>
                    </span>
                  </label>
                ))}
              </div>
              {/* Hidden field to submit the visa type label */}
              <input
                type="hidden"
                name="visaType"
                value={selectedVisaType ? (visaTypeOptions.find(o => o.value === selectedVisaType)?.label ?? "") : ""}
              />
            </div>

            {/* ── Category Dropdown (conditional on visa type) ── */}
            {selectedVisaType && (
              <div key={selectedVisaType} className="visa-category-field">
                <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
                  {t(locale, "visa.page.form.category" as DictionaryKey)}
                </label>
                <LuxurySelect
                  name="category"
                  required
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  placeholder={t(locale, "visa.page.form.selectCategory" as DictionaryKey)}
                  options={categoryOptions}
                />
              </div>
            )}

            <div>
              <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
                {t(locale, "visa.page.form.destination" as DictionaryKey)}
              </label>
              <CountrySelect
                name="destination"
                required
                placeholder={t(locale, "visa.page.form.selectCountry" as DictionaryKey)}
              />
            </div>
            <div>
              <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
                {t(locale, "visa.page.form.message" as DictionaryKey)}
              </label>
              <textarea
                name="message"
                rows={4}
                required
                className="w-full bg-pts-black/50 border border-pts-gold/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors resize-none"
                placeholder={t(locale, "visa.page.form.placeholder.message" as DictionaryKey)}
              />
            </div>
            <FormStatusMessage status={enquiry.status} errorMessage={enquiry.errorMessage} />
            <MagneticButton
              type="submit"
              disabled={enquiry.isSending}
              className="w-full border-pts-gold bg-pts-gold px-6 sm:px-8 py-3 sm:py-4 text-[0.65rem] sm:text-[0.7rem] font-bold text-pts-black uppercase tracking-[0.25em] sm:tracking-[0.3em] hover:bg-pts-gold/90"
            >
              {t(locale, "visa.page.form.submit" as DictionaryKey)}
            </MagneticButton>
          </form>
        </div>
      </Modal>
    </div>
  );
}
