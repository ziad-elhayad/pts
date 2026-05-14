"use client";

import { CinematicSection } from "@/components/animations/CinematicSection";
import { CinematicHero } from "@/components/sections/CinematicHero";
import { BrandIntroSection } from "@/components/sections/BrandIntroSection";
import { MiceOverviewSection } from "@/components/sections/MiceOverviewSection";
import { StickySplitSection } from "@/components/sections/StickySplitSection";
import { ExpandingItineraries } from "@/components/sections/ExpandingItineraries";

import { PerspectiveStackGallery } from "@/components/sections/PerspectiveStackGallery";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { LuxuryCtaSection } from "@/components/sections/LuxuryCtaSection";
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

      <CinematicSection id="intro" mist className="page-section">
        <BrandIntroSection />
      </CinematicSection>

      <CinematicSection id="mice" mist className="page-section">
        <MiceOverviewSection />
      </CinematicSection>

      <CinematicSection id="vip-split" mist className="page-section">
        <div className="section-inner">
          <SectionTitle number="03" subtitle="Elite Access" title="VIP Concierge" reveal="blur-in" />
        </div>
        <StickySplitSection />
      </CinematicSection>

      <CinematicSection id="itineraries" mist className="page-section">
        <div className="section-inner">
          <SectionTitle number="04" subtitle="Experiences" title="Curated Itineraries" reveal="scale-soft" />
        </div>
        <ExpandingItineraries />
      </CinematicSection>



      <CinematicSection id="gallery" mist className="page-section">
        <div className="section-inner">
          <SectionTitle number="05" subtitle="Archive" title="Experiences & Gallery" reveal="lift" />
        </div>
        <PerspectiveStackGallery />
      </CinematicSection>

      <CinematicSection id="testimonials" mist className="page-section">
        <div className="section-inner flex flex-col items-center">
          <SectionTitle
            number="06"
            subtitle="Voices"
            title="Experience Highlights"
            align="center"
            reveal="scale-soft"
          />
        </div>
        <TestimonialsSection />
      </CinematicSection>

      <CinematicSection id="cta" mist scrubReveal className="page-section">
        <div className="section-inner flex flex-col items-center">
          <SectionTitle number="07" subtitle="Begin" title="Global Inquiry" align="center" reveal="clip-wipe" />
        </div>
        <LuxuryCtaSection />
      </CinematicSection>
    </div>
  );
}
