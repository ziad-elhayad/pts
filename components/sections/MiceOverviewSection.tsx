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
        

      </HorizontalScrollSection>
    </section>
  );
}
