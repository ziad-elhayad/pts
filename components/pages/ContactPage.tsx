"use client";

import { useCallback, useMemo, useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { FormStatusMessage } from "@/components/forms/FormStatusMessage";
import { CountrySelect } from "@/components/forms/CountrySelect";
import { LuxurySelect } from "@/components/forms/LuxurySelect";
import { useEnquirySubmit } from "@/hooks/useEnquirySubmit";
import { useLocale } from "@/contexts/LocaleContext";
import { t, type DictionaryKey } from "@/lib/dictionary";
import {
  getContactServiceCategoryOptions,
  getContactServiceOptions,
  getVisaTypeCategoryOptions,
  getInternationalVisaLabel,
  type VisaTypeKey,
} from "@/lib/contact-service-options";

export default function ContactPage() {
  const { locale } = useLocale();
  const { status, errorMessage, isSending, handleSubmit } = useEnquirySubmit("contact");
  const [selectedService, setSelectedService] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Visa-type radio state (only used when International Visa is selected)
  const [selectedVisaType, setSelectedVisaType] = useState<VisaTypeKey | "">("");
  const [selectedVisaCategory, setSelectedVisaCategory] = useState("");

  const serviceOptions = useMemo(() => getContactServiceOptions(locale), [locale]);

  const internationalVisaLabel = useMemo(() => getInternationalVisaLabel(locale), [locale]);
  const isVisaSelected = selectedService === internationalVisaLabel;

  // For non-visa services: flat category list
  const typeOptions = useMemo(
    () => isVisaSelected ? [] : getContactServiceCategoryOptions(locale, selectedService),
    [locale, selectedService, isVisaSelected]
  );

  // Visa type options (Long Stay / Short Stay / Specialized)
  const visaTypeOptions = useMemo(
    () => [
      { value: "long-stay" as VisaTypeKey, label: t(locale, "visa.categories.longStay.title" as DictionaryKey) },
      { value: "short-stay" as VisaTypeKey, label: t(locale, "visa.categories.shortStay.title" as DictionaryKey) },
      { value: "specialized" as VisaTypeKey, label: t(locale, "visa.categories.specialized.title" as DictionaryKey) },
    ],
    [locale]
  );

  // Visa category options filtered by selected visa type
  const visaCategoryOptions = useMemo(
    () => getVisaTypeCategoryOptions(locale, selectedVisaType),
    [locale, selectedVisaType]
  );

  const hasSelectedService = selectedService.length > 0;

  const handleServiceChange = useCallback((value: string) => {
    setSelectedService(value);
    setSelectedType("");
    // Reset visa-specific state when service changes
    setSelectedVisaType("");
    setSelectedVisaCategory("");
  }, []);

  const handleTypeChange = useCallback((value: string) => {
    setSelectedType(value);
  }, []);

  const handleVisaTypeChange = useCallback((type: VisaTypeKey) => {
    setSelectedVisaType(type);
    setSelectedVisaCategory(""); // reset category when visa type changes
  }, []);

  const handleVisaCategoryChange = useCallback((value: string) => {
    setSelectedVisaCategory(value);
  }, []);

  return (
    <div className="bg-pts-bg min-h-screen" style={{ scrollBehavior: 'smooth' }}>
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center border-b border-pts-line/20">
        <div className="absolute inset-0 bg-gradient-to-b from-pts-deep to-pts-bg" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="lux-heading text-[0.5rem] text-pts-gold mb-6 tracking-[0.5em] uppercase">{t(locale, "contact.page.hero" as DictionaryKey)}</p>
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl tracking-[0.1em] text-pts-parchment uppercase leading-[1.05] mb-8">
            {t(locale, "contact.page.title" as DictionaryKey)}
          </h1>
          <p className="max-w-2xl mx-auto text-[0.65rem] sm:text-[0.75rem] uppercase tracking-[0.2em] text-pts-muted/70 leading-relaxed mb-10">
            {t(locale, "contact.page.subtitle" as DictionaryKey)}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto w-full">
          <div className="bg-pts-deep/40 border border-pts-gold/30 p-6 sm:p-8 md:p-10 lg:p-12">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl tracking-[0.1em] text-pts-parchment uppercase mb-6 sm:mb-8 text-center">
              {t(locale, "contact.page.form.title" as DictionaryKey)}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 md:space-y-8">
              <div>
                <label className="block text-[0.6rem] sm:text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-2 sm:mb-3">
                  {t(locale, "contact.page.form.fullName" as DictionaryKey)}
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-[0.7rem] sm:text-[0.72rem] md:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors rounded-none"
                  placeholder={t(locale, "contact.page.form.placeholder.name" as DictionaryKey)}
                />
              </div>

              <div>
                <label className="block text-[0.6rem] sm:text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-2 sm:mb-3">
                  {t(locale, "contact.page.form.email" as DictionaryKey)}
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-[0.7rem] sm:text-[0.72rem] md:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors rounded-none"
                  placeholder={t(locale, "contact.page.form.placeholder.email" as DictionaryKey)}
                />
              </div>

              <div>
                <label className="block text-[0.6rem] sm:text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-2 sm:mb-3">
                  Nationality
                </label>
                <CountrySelect
                  name="nationality"
                  required
                  placeholder="Select your nationality"
                />
              </div>

              <div>
                <label className="block text-[0.6rem] sm:text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-2 sm:mb-3">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-[0.7rem] sm:text-[0.72rem] md:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors rounded-none"
                  placeholder="+966 500 000 0000"
                />
              </div>

              <div>
                <label className="block text-[0.6rem] sm:text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-2 sm:mb-3">
                  Choose Service
                </label>
                <LuxurySelect
                  name="enquiryType"
                  value={selectedService}
                  onChange={handleServiceChange}
                  required
                  placeholder="Choose service"
                  options={serviceOptions}
                />
              </div>

              {/* ── International Visa: show Visa Type radio group ── */}
              {isVisaSelected && (
                <div className="visa-category-field">
                  <label className="block text-[0.6rem] sm:text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-2 sm:mb-3">
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
                  {/* Hidden fields to pass visa type label to form submission */}
                  <input
                    type="hidden"
                    name="visaType"
                    value={selectedVisaType ? (visaTypeOptions.find(o => o.value === selectedVisaType)?.label ?? "") : ""}
                  />
                </div>
              )}

              {/* ── Visa category dropdown (after visa type is selected) ── */}
              {isVisaSelected && selectedVisaType && (
                <div key={selectedVisaType} className="visa-category-field">
                  <label className="block text-[0.6rem] sm:text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-2 sm:mb-3">
                    {t(locale, "visa.page.form.category" as DictionaryKey)}
                  </label>
                  <LuxurySelect
                    name="type"
                    value={selectedVisaCategory}
                    onChange={handleVisaCategoryChange}
                    required
                    placeholder={t(locale, "visa.page.form.selectCategory" as DictionaryKey)}
                    options={visaCategoryOptions}
                  />
                </div>
              )}

              {/* ── Non-visa services: flat type dropdown ── */}
              {hasSelectedService && !isVisaSelected && (
                <div className="visa-category-field">
                  <label className="block text-[0.6rem] sm:text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-2 sm:mb-3">
                    Type
                  </label>
                  <LuxurySelect
                    name="type"
                    value={selectedType}
                    onChange={handleTypeChange}
                    required
                    placeholder="Select type"
                    options={typeOptions}
                  />
                </div>
              )}

              <div>
                <label className="block text-[0.6rem] sm:text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-2 sm:mb-3">
                  {t(locale, "contact.page.form.message" as DictionaryKey)}
                </label>
                <textarea
                  name="message"
                  rows={6}
                  required
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 text-[0.7rem] sm:text-[0.72rem] md:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors resize-none rounded-none"
                  placeholder={t(locale, "contact.page.form.placeholder.message" as DictionaryKey)}
                />
              </div>

              <FormStatusMessage status={status} errorMessage={errorMessage} />

              <div className="flex justify-center pt-2 sm:pt-4">
                <MagneticButton
                  type="submit"
                  disabled={isSending}
                  className="w-full sm:w-auto min-w-[200px] border-pts-gold bg-pts-gold px-10 sm:px-12 py-3.5 sm:py-4 text-[0.65rem] sm:text-[0.7rem] font-bold text-pts-black uppercase tracking-[0.3em] hover:bg-pts-gold/90"
                >
                  {t(locale, "contact.page.form.submit" as DictionaryKey)}
                </MagneticButton>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
