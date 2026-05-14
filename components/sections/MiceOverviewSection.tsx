"use client";

import Link from "next/link";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HorizontalScrollSection } from "@/components/animations/HorizontalScrollSection";
import { miceServiceMedia } from "@/lib/media";
import { t } from "@/lib/dictionary";
import { useLocale } from "@/contexts/LocaleContext";

const services = [
  {
    title: "Meetings",
    description: "Board-level intimacy with flawless logistics, privacy, and timing calibrated to executive rhythm.",
  },
  {
    title: "Incentives",
    description: "Reward programs that feel cinematic—destination pacing, sensory detail, and discreet recognition.",
  },
  {
    title: "Conferences",
    description: "Large-scale orchestration with a boutique touch: flow, hospitality suites, and VIP corridors.",
  },
  {
    title: "Exhibitions",
    description: "Presence that commands attention—premium build, concierge staffing, and seamless guest journeys.",
  },
  {
    title: "Executive Coordination",
    description: "Invisible choreography across airports, motorcades, security, and calendar-critical transitions.",
  },
  {
    title: "Destination Management",
    description: "Local mastery with international standards—Jeddah to global capitals, composed as one narrative.",
  },
] as const;

export function MiceOverviewSection() {
  const { locale } = useLocale();

  return (
    <section id="mice-section" className="mx-auto max-w-[92rem] border-t border-pts-line bg-pts-black/10">
      <HorizontalScrollSection
        kicker="MICE"
        title={t(locale, "mice.title")}
        description={t(locale, "mice.sub")}
        gap="0"
      >
        {services.map((item, index) => {
          const media = miceServiceMedia[index];
          return (
            <PremiumCard
              key={item.title}
              kicker="Corporate"
              title={item.title}
              description={item.description}
              image={{ src: media.src, alt: media.alt, priority: index < 2 }}
              footer={
                <Link
                  href="/mice"
                  className="lux-heading text-[0.5rem] text-pts-gold tracking-[0.3em] uppercase hover:text-pts-parchment transition"
                >
                  View Details
                </Link>
              }
            />
          );
        })}
        
        {/* Final CTA card */}
        <div className="w-[85vw] sm:w-[60vw] md:w-[38vw] flex-shrink-0 flex flex-col justify-center px-8 sm:px-16 bg-pts-deep/20">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px w-6 bg-pts-gold/40" />
            <p className="lux-heading text-[0.44rem] text-pts-gold tracking-[0.6em] opacity-50 uppercase">Next Step</p>
          </div>
          
          <h3 className="font-heading text-xl sm:text-2xl text-pts-gold-2 tracking-[0.15em] leading-[1.3] uppercase mb-12 max-w-sm font-light">
            Scalable Solutions for Global Leaders.
          </h3>
          
          <MagneticButton href="/mice" className="w-fit px-10 py-5">
            Discover MICE
          </MagneticButton>
          
          <div className="mt-20 h-px w-12 bg-pts-gold/20" />
        </div>
      </HorizontalScrollSection>
    </section>
  );
}
