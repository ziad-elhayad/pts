"use client";

import { useState } from "react";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { useLocale } from "@/contexts/LocaleContext";
import { t, type DictionaryKey } from "@/lib/dictionary";

type TabType = "patients" | "doctors" | "wellness";

export default function MedicalTourismPage() {
  const [activeTab, setActiveTab] = useState<TabType>("patients");
  const [showEnquiry, setShowEnquiry] = useState(false);
  const { locale } = useLocale();

  const tabs: { key: TabType; label: string }[] = [
    { key: "patients", label: t(locale, "medical.page.tab.patients" as DictionaryKey) },
    { key: "doctors", label: t(locale, "medical.page.tab.doctors" as DictionaryKey) },
    { key: "wellness", label: t(locale, "medical.page.tab.wellness" as DictionaryKey) },
  ];

  const content = {
    patients: {
      title: t(locale, "medical.page.content.patients.title" as DictionaryKey),
      description: t(locale, "medical.page.content.patients.description" as DictionaryKey),
      image: "/images/services/medical/medical-tourism-patients.webp",
    },
    doctors: {
      title: t(locale, "medical.page.content.doctors.title" as DictionaryKey),
      description: t(locale, "medical.page.content.doctors.description" as DictionaryKey),
      image: "/images/services/medical/medical-alex-bertha.webp",
    },
    wellness: {
      title: t(locale, "medical.page.content.wellness.title" as DictionaryKey),
      description: t(locale, "medical.page.content.wellness.description" as DictionaryKey),
      image: "/images/services/medical/medical-whatsapp.webp",
    },
  };

  return (
    <div className="bg-pts-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center border-b border-pts-line/20">
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
      <section className="border-t border-pts-line bg-pts-black py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-12 text-center">
            <p className="lux-heading text-[0.5rem] text-pts-gold mb-4 tracking-[0.5em] uppercase">{t(locale, "medical.page.pillars" as DictionaryKey)}</p>
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
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="space-y-6 order-2 lg:order-1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={`img-${activeTab}`}
                className="relative h-[400px] lg:h-[500px] overflow-hidden rounded-sm border border-pts-gold/20 order-1 lg:order-2"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={content[activeTab].image}
                  alt={content[activeTab].title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pts-black/60 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      {showEnquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-pts-black/80 backdrop-blur-sm p-4">
          <div className="bg-pts-deep border border-pts-gold/30 max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-heading text-xl uppercase tracking-[0.1em] text-pts-parchment">
                {t(locale, "medical.page.enquiry.title" as DictionaryKey)}
              </h3>
              <button
                type="button"
                onClick={() => setShowEnquiry(false)}
                className="text-pts-gold text-2xl hover:text-pts-parchment transition-colors"
              >
                ×
              </button>
            </div>
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-pts-muted/70 mb-6">
              {t(locale, "medical.page.enquiry.subtitle" as DictionaryKey)}
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-[0.6rem] uppercase tracking-[0.3em] text-pts-gold mb-2">
                  {t(locale, "medical.page.form.fullName" as DictionaryKey)}
                </label>
                <input
                  type="text"
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                  placeholder={t(locale, "medical.page.form.placeholder.name" as DictionaryKey)}
                />
              </div>
              <div>
                <label className="block text-[0.6rem] uppercase tracking-[0.3em] text-pts-gold mb-2">
                  {t(locale, "medical.page.form.email" as DictionaryKey)}
                </label>
                <input
                  type="email"
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                  placeholder={t(locale, "medical.page.form.placeholder.email" as DictionaryKey)}
                />
              </div>
              <div>
                <label className="block text-[0.6rem] uppercase tracking-[0.3em] text-pts-gold mb-2">
                  {t(locale, "medical.page.form.phone" as DictionaryKey)}
                </label>
                <input
                  type="tel"
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                  placeholder="+966 500 000 0000"
                />
              </div>
              <div>
                <label className="block text-[0.6rem] uppercase tracking-[0.3em] text-pts-gold mb-2">
                  {t(locale, "medical.page.form.serviceType" as DictionaryKey)}
                </label>
                <select className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-pts-parchment focus:border-pts-gold focus:outline-none transition-colors">
                  <option value="">{tabs.find((t) => t.key === "patients")?.label || "Select service type"}</option>
                  <option value="patients">{tabs.find((t) => t.key === "patients")?.label}</option>
                  <option value="doctors">{tabs.find((t) => t.key === "doctors")?.label}</option>
                  <option value="wellness">{tabs.find((t) => t.key === "wellness")?.label}</option>
                </select>
              </div>
              <div>
                <label className="block text-[0.6rem] uppercase tracking-[0.3em] text-pts-gold mb-2">
                  {t(locale, "medical.page.form.message" as DictionaryKey)}
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors resize-none"
                  placeholder={t(locale, "medical.page.form.placeholder.message" as DictionaryKey)}
                />
              </div>
              <MagneticButton
                type="submit"
                className="w-full border-pts-gold bg-pts-gold px-8 py-4 text-[0.65rem] font-bold text-pts-black uppercase tracking-[0.3em] hover:bg-pts-gold/90"
              >
                {t(locale, "medical.page.form.submit" as DictionaryKey)}
              </MagneticButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}