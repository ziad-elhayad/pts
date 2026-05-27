"use client";

import { useEffect, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { CinematicSection } from "@/components/animations/CinematicSection";
import { CinematicHero } from "@/components/sections/CinematicHero";

const BrandIntroSection = dynamic(
  () => import("@/components/sections/BrandIntroSection").then((mod) => mod.BrandIntroSection),
  { ssr: false, loading: () => <div className="min-h-screen bg-pts-bg" aria-hidden /> }
);

const ServicesSection = dynamic(
  () => import("@/components/sections/ServicesSection").then((mod) => mod.ServicesSection),
  { ssr: false, loading: () => <div className="min-h-screen bg-pts-bg" aria-hidden /> }
);

const SlideGallery = dynamic(
  () => import("@/components/sections/SlideGallery").then((mod) => mod.SlideGallery),
  { ssr: false, loading: () => <div className="h-[100svh] bg-pts-bg" aria-hidden /> }
);

const FaqSection = dynamic(
  () => import("@/components/sections/FaqSection").then((mod) => mod.FaqSection),
  { ssr: false, loading: () => <div className="min-h-[50svh] bg-pts-bg" aria-hidden /> }
);

const SideDotNavigator = dynamic(
  () => import("@/components/ui/SideDotNavigator").then((mod) => mod.SideDotNavigator),
  { ssr: false }
);

/**
 * HomePage — cinematic flow with consistent section rhythm and varied title reveals.
 */
export function HomePage() {
  const [isDesktop, setIsDesktop] = useState(false);

  const handleHashChange = useCallback(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [handleHashChange]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  return (
    <div className="bg-pts-bg">
      {isDesktop ? <SideDotNavigator /> : null}
      <CinematicSection id="hero" mist={false}>
        <CinematicHero />
      </CinematicSection>

      <CinematicSection id="about" mist>
        <BrandIntroSection />
      </CinematicSection>

      <CinematicSection id="services" mist>
        <ServicesSection />
      </CinematicSection>

      <CinematicSection id="gallery" mist>
        <SlideGallery />
      </CinematicSection>

      <CinematicSection id="faq" mist>
        <FaqSection />
      </CinematicSection>
    </div>
  );
}
