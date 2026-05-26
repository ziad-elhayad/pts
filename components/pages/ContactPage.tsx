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
} from "@/lib/contact-service-options";

export default function ContactPage() {
  const { locale } = useLocale();
  const { status, errorMessage, isSending, handleSubmit } = useEnquirySubmit("contact");
  const [selectedService, setSelectedService] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const serviceOptions = useMemo(() => getContactServiceOptions(locale), [locale]);
  const typeOptions = useMemo(
    () => getContactServiceCategoryOptions(locale, selectedService),
    [locale, selectedService]
  );
  const hasSelectedService = selectedService.length > 0;

  const handleServiceChange = useCallback((value: string) => {
    setSelectedService(value);
    setSelectedType("");
  }, []);

  const handleTypeChange = useCallback((value: string) => {
    setSelectedType(value);
  }, []);

  return (
    <div className="bg-pts-bg min-h-screen">
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

              {hasSelectedService ? (
                <div>
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
              ) : null}

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
