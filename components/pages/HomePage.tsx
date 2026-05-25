"use client";

import { CinematicSection } from "@/components/animations/CinematicSection";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { BrandIntroSection } from "@/components/sections/BrandIntroSection";
import { VipOverviewSection } from "@/components/sections/VipOverviewSection";
import { FaqSection } from "@/components/sections/FaqSection";

import { PerspectiveStackGallery } from "@/components/sections/PerspectiveStackGallery";
import { SideDotNavigator } from "@/components/ui/SideDotNavigator";
import { SectionTitle } from "@/components/ui/SectionTitle";

/**
 * HomePage — cinematic flow with consistent section rhythm and varied title reveals.
 */
export function HomePage() {
  return (
    <div className="bg-pts-bg">
      <SideDotNavigator />

      <CinematicSection id="hero" mist={false}>
        <CinematicHero />
      </CinematicSection>

      <CinematicSection id="about" mist>
        <BrandIntroSection />
      </CinematicSection>

      <CinematicSection id="services" mist>
        <VipOverviewSection />
      </CinematicSection>

      <CinematicSection id="gallery" mist className="page-section">
        <div className="section-inner flex flex-col items-center text-center">
          <SectionTitle number="03" subtitle="Archive" title="FOLLOW THE JOURNEY" align="center" reveal="lift" />
          <h3 className="font-heading text-2xl sm:text-3xl uppercase tracking-[0.1em] text-pts-parchment mb-6">
            Experience the World Like Never Before
          </h3>
          <p className="max-w-3xl text-[0.65rem] uppercase tracking-[0.2em] text-pts-muted/70 leading-relaxed">
            Explore our handpicked, exclusive stays and create unforgettable memories across the globe. Every destination is curated for comfort, luxury, and moments you'll cherish forever.
          </p>
        </div>
        <PerspectiveStackGallery />
      </CinematicSection>

      <FaqSection />
    </div>
  );
}
