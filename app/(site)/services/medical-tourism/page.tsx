"use client";

import { useState } from "react";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";
import clsx from "clsx";
import { useLocale } from "@/contexts/LocaleContext";
import { t, type DictionaryKey } from "@/lib/dictionary";
import { useEnquirySubmit } from "@/hooks/useEnquirySubmit";
import { FormStatusMessage } from "@/components/forms/FormStatusMessage";
import { CountrySelect } from "@/components/forms/CountrySelect";
import { LuxurySelect } from "@/components/forms/LuxurySelect";
import { Modal } from "@/components/ui/Modal";
import { medicalTabImages } from "@/lib/service-category-images";

type TabType = "patients" | "doctors" | "wellness";

export default function MedicalTourismPage() {
  const [activeTab, setActiveTab] = useState<TabType>("patients");
  const [showEnquiry, setShowEnquiry] = useState(false);
  const { locale } = useLocale();
  const enquiry = useEnquirySubmit("medical-tourism");

  const tabs: { key: TabType; label: string }[] = [
    { key: "patients", label: t(locale, "medical.page.tab.patients" as DictionaryKey) },
    { key: "doctors", label: t(locale, "medical.page.tab.doctors" as DictionaryKey) },
    { key: "wellness", label: t(locale, "medical.page.tab.wellness" as DictionaryKey) },
  ];

  const content = {
    patients: {
      title: t(locale, "medical.page.content.patients.title" as DictionaryKey),
      description: t(locale, "medical.page.content.patients.description" as DictionaryKey),
      image: medicalTabImages.patients,
    },
    doctors: {
      title: t(locale, "medical.page.content.doctors.title" as DictionaryKey),
      description: t(locale, "medical.page.content.doctors.description" as DictionaryKey),
      image: medicalTabImages.wellness,
    },
    wellness: {
      title: t(locale, "medical.page.content.wellness.title" as DictionaryKey),
      description: t(locale, "medical.page.content.wellness.description" as DictionaryKey),
      image: medicalTabImages.doctors,
    },
  };

  return (
    <div className="bg-pts-bg min-h-screen">
      {/* Hero Section — pt clears the fixed navbar on mobile/tablet (lg already has layout-level offset) */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center border-b border-pts-line/20 pt-[4.5rem] sm:pt-[5rem] lg:pt-0">
        <div className="absolute inset-0 bg-gradient-to-b from-pts-deep to-pts-bg" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="lux-heading text-[0.5rem] text-pts-gold mb-6 tracking-[0.5em] uppercase">{t(locale, "medical.page.hero" as DictionaryKey)}</p>
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl tracking-[0.1em] text-pts-parchment uppercase leading-[1.05] mb-8">
            {t(locale, "medical.page.title" as DictionaryKey)}
          </h1>
          <p className="max-w-2xl mx-auto text-[0.65rem] sm:text-[0.75rem] uppercase tracking-[0.2em] text-pts-muted/70 leading-relaxed mb-10">
            {t(locale, "medical.page.subtitle" as DictionaryKey)}
          </p>
          <MagneticButton
            onClick={() => setShowEnquiry(true)}
            className="border-pts-gold bg-pts-gold px-12 py-4 text-[0.65rem] font-bold text-pts-black uppercase tracking-[0.3em] hover:bg-pts-gold/90"
          >
            {t(locale, "medical.page.cta" as DictionaryKey)}
          </MagneticButton>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="border-t border-pts-line bg-pts-black py-16 px-6 pt-[2rem] sm:pt-[3rem] lg:pt-[4rem]">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-12 text-center pt-8">
            <h2 className="font-heading text-3xl sm:text-5xl tracking-[0.1em] text-pts-parchment uppercase">
              {t(locale, "medical.page.services" as DictionaryKey)}
            </h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={clsx(
                  "px-6 py-3 text-[0.6rem] uppercase tracking-[0.3em] transition-all duration-300 border",
                  activeTab === tab.key
                    ? "border-pts-gold bg-pts-gold/15 text-pts-gold"
                    : "border-pts-line/30 text-pts-muted/60 hover:border-pts-gold/40 hover:text-pts-parchment"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div
              key={activeTab}
              className="order-2 space-y-6 animate-tab-content-in lg:order-1"
            >
                <h3 className="font-heading text-2xl sm:text-3xl uppercase tracking-[0.1em] text-pts-parchment">
                  {content[activeTab].title}
                </h3>
                <p className="text-[0.7rem] sm:text-[0.8rem] uppercase tracking-[0.2em] text-pts-muted/80 leading-loose">
                  {content[activeTab].description}
                </p>
                <div className="pt-4">
                  <MagneticButton
                    onClick={() => setShowEnquiry(true)}
                    className="border-pts-gold/50 bg-transparent px-8 py-3 text-[0.6rem] font-bold text-pts-gold uppercase tracking-[0.3em] hover:bg-pts-gold/10 hover:border-pts-gold transition-all duration-300"
                  >
                    {t(locale, "medical.page.learn.more" as DictionaryKey)}
                  </MagneticButton>
                </div>
            </div>
            <div
              key={`img-${activeTab}`}
              className="relative order-1 h-[400px] overflow-hidden rounded-sm border border-pts-gold/20 animate-tab-image-in lg:order-2 lg:h-[500px]"
            >
                <Image
                  src={content[activeTab].image}
                  alt={content[activeTab].title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pts-black/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      <Modal isOpen={showEnquiry} onClose={() => setShowEnquiry(false)}>
        <div className="p-5 sm:p-6 md:p-8 flex-shrink-0">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <h3 className="font-heading text-lg sm:text-xl uppercase tracking-[0.1em] text-pts-parchment">
              {t(locale, "medical.page.enquiry.title" as DictionaryKey)}
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
            {t(locale, "medical.page.enquiry.subtitle" as DictionaryKey)}
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
              {t(locale, "medical.page.form.fullName" as DictionaryKey)}
            </label>
            <input
              type="text"
              name="fullName"
              required
              className="w-full bg-pts-black/50 border border-pts-gold/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
              placeholder={t(locale, "medical.page.form.placeholder.name" as DictionaryKey)}
            />
          </div>
          <div>
            <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
              {t(locale, "medical.page.form.email" as DictionaryKey)}
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-pts-black/50 border border-pts-gold/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                  placeholder={t(locale, "medical.page.form.placeholder.email" as DictionaryKey)}
            />
          </div>
          <div>
            <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
              {locale === "ar" ? "الجنسية" : "Nationality"}
            </label>
            <CountrySelect
              name="nationality"
              required
              placeholder={locale === "ar" ? "اختر جنسيتك" : "Select your nationality"}
            />
          </div>
          <div>
            <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
              Phone
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
              {t(locale, "medical.page.form.serviceType" as DictionaryKey)}
            </label>
            <LuxurySelect
              name="serviceType"
              required
              placeholder={tabs.find((tab) => tab.key === "patients")?.label || "Select service type"}
              options={tabs.map((tab) => ({ value: tab.key, label: tab.label }))}
            />
          </div>
          <div>
            <label className="block text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-pts-gold mb-1.5 sm:mb-2">
              {t(locale, "medical.page.form.message" as DictionaryKey)}
            </label>
            <textarea
              name="message"
              rows={4}
              required
              className="w-full bg-pts-black/50 border border-pts-gold/20 px-3 sm:px-4 py-2.5 sm:py-3 text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors resize-none"
              placeholder={t(locale, "medical.page.form.placeholder.message" as DictionaryKey)}
            />
          </div>
          <FormStatusMessage status={enquiry.status} errorMessage={enquiry.errorMessage} />
          <MagneticButton
            type="submit"
            disabled={enquiry.isSending}
            className="w-full border-pts-gold bg-pts-gold px-6 sm:px-8 py-3 sm:py-4 text-[0.65rem] sm:text-[0.7rem] font-bold text-pts-black uppercase tracking-[0.25em] sm:tracking-[0.3em] hover:bg-pts-gold/90"
          >
            {t(locale, "medical.page.form.submit" as DictionaryKey)}
          </MagneticButton>
        </form>
        </div>
      </Modal>
    </div>
  );
}
