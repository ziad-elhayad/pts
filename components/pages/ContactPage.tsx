"use client";

import { useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useLocale } from "@/contexts/LocaleContext";
import { t, type DictionaryKey } from "@/lib/dictionary";

export default function ContactPage() {
  const { locale } = useLocale();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-pts-bg min-h-screen">
      {/* Hero Section */}
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

      {/* Contact Form Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-pts-deep/40 border border-pts-gold/30 p-12">
            <h2 className="font-heading text-3xl sm:text-4xl tracking-[0.1em] text-pts-parchment uppercase mb-8 text-center">
              {t(locale, "contact.page.form.title" as DictionaryKey)}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[0.7rem] uppercase tracking-[0.3em] text-pts-gold mb-3">
                  {t(locale, "contact.page.form.fullName" as DictionaryKey)}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-6 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                  placeholder={t(locale, "contact.page.form.placeholder.name" as DictionaryKey)}
                  required
                />
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase tracking-[0.3em] text-pts-gold mb-3">
                  {t(locale, "contact.page.form.email" as DictionaryKey)}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-6 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                  placeholder={t(locale, "contact.page.form.placeholder.email" as DictionaryKey)}
                  required
                />
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase tracking-[0.3em] text-pts-gold mb-3">
                  {t(locale, "contact.page.form.phone" as DictionaryKey)}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-6 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                  placeholder="+966 500 000 0000"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase tracking-[0.3em] text-pts-gold mb-3">
                  {t(locale, "contact.page.form.company" as DictionaryKey)}
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-6 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase tracking-[0.3em] text-pts-gold mb-3">
                  {t(locale, "contact.page.form.message" as DictionaryKey)}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-6 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors resize-none"
                  placeholder={t(locale, "contact.page.form.placeholder.message" as DictionaryKey)}
                  required
                />
              </div>

              <MagneticButton
                type="submit"
                className="w-full border-pts-gold bg-pts-gold px-12 py-5 text-[0.75rem] font-bold text-pts-black uppercase tracking-[0.3em] hover:bg-pts-gold/90"
              >
                {t(locale, "contact.page.form.submit" as DictionaryKey)}
              </MagneticButton>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}