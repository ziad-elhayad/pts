"use client";

import { CinematicSection } from "@/components/animations/CinematicSection";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { FaqSection } from "@/components/sections/FaqSection";
import { PerspectiveStackGallery } from "@/components/sections/PerspectiveStackGallery";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { SideDotNavigator } from "@/components/ui/SideDotNavigator";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { t, type DictionaryKey } from "@/lib/dictionary";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * HomePage — cinematic flow with consistent section rhythm and varied title reveals.
 */
export function HomePage() {
  const { locale } = useLocale();

  return (
    <div className="bg-pts-bg">
      <SideDotNavigator />
      <CinematicSection id="hero" mist={false}>
        <CinematicHero />
      </CinematicSection>

      <CinematicSection id="services" mist>
        <ServicesSection />
      </CinematicSection>

      <CinematicSection id="gallery" mist className="page-section">
        <div className="section-inner flex flex-col items-center text-center">
          <SectionTitle
            number="02"
            subtitle={t(locale, "home.gallery.subtitle" as DictionaryKey)}
            title={t(locale, "home.gallery.title" as DictionaryKey)}
            align="center"
            reveal="lift"
          />
          <h3 className="font-heading text-2xl sm:text-3xl uppercase tracking-[0.1em] text-pts-parchment mb-6">
            {t(locale, "home.gallery.title" as DictionaryKey)}
          </h3>
          <p className="max-w-3xl text-[0.65rem] uppercase tracking-[0.2em] text-pts-muted/70 leading-relaxed">
            {t(locale, "home.gallery.description" as DictionaryKey)}
          </p>
        </div>
        <PerspectiveStackGallery />
      </CinematicSection>

      <CinematicSection id="faq" mist>
        <FaqSection />
      </CinematicSection>
    </div>
  );
}
