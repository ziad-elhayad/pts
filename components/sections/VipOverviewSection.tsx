"use client";

import Link from "next/link";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HorizontalScrollSection } from "@/components/animations/HorizontalScrollSection";
import { vipServiceMedia } from "@/lib/media";
import { t } from "@/lib/dictionary";
import { useLocale } from "@/contexts/LocaleContext";

const pillars = [
  {
    title: "Executive lifestyle management",
    description: "Calendars, households, and travel ecosystems—handled with quiet precision and absolute discretion.",
  },
  {
    title: "Luxury reservations",
    description: "Tables, suites, and private rooms secured through relationships—not algorithms.",
  },
  {
    title: "Private transportation",
    description: "Chauffeured fleets, aviation coordination, and arrival choreography without friction.",
  },
  {
    title: "Exclusive access",
    description: "Behind-the-velvet moments: private viewings, closed venues, and curated introductions.",
  },
  {
    title: "High-profile event coordination",
    description: "From gala evenings to discreet receptions—guest experience as a signature.",
  },
  {
    title: "Tailored private experiences",
    description: "Desert horizons, coastal escapes, and urban sanctuaries—authored as one seamless arc.",
  },
] as const;

export function VipOverviewSection() {
  const { locale } = useLocale();

  return (
    <section id="vip-section" className="border-t border-pts-line bg-pts-black/25">
      <HorizontalScrollSection
        id="vip"
        kicker="VIP"
        title={t(locale, "vip.title")}
        description={t(locale, "vip.sub")}
        gap="0"
      >
        {pillars.map((item, index) => {
          const media = vipServiceMedia[index];
          return (
            <PremiumCard
              key={item.title}
              kicker="Concierge"
              title={item.title}
              description={item.description}
              image={{ src: media.src, alt: media.alt, priority: true }}
              footer={
                <Link
                  href="/vip-concierge"
                  className="lux-heading text-[0.5rem] text-pts-gold tracking-[0.3em] uppercase hover:text-pts-parchment transition"
                >
                  Explore VIP
                </Link>
              }
            />
          );
        })}

        <div className="w-[85vw] sm:w-[60vw] md:w-[38vw] flex-shrink-0 flex flex-col justify-center px-8 sm:px-16 bg-pts-deep/20">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px w-6 bg-pts-gold/40" />
            <p className="lux-heading text-[0.44rem] text-pts-gold tracking-[0.6em] opacity-50 uppercase">Services</p>
          </div>
          
          <h3 className="font-heading text-xl sm:text-2xl text-pts-gold-2 tracking-[0.15em] leading-[1.3] uppercase mb-12 max-w-sm font-light">
            Personalized. Private. Perfect.
          </h3>
          
          <MagneticButton href="/vip-concierge" className="w-fit px-10 py-5">
            Explore VIP
          </MagneticButton>
          
          <div className="mt-20 h-px w-12 bg-pts-gold/20" />
        </div>
      </HorizontalScrollSection>
    </section>
  );
}
