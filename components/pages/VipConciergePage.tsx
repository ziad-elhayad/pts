"use client";

import { HorizontalScrollSection } from "@/components/animations/HorizontalScrollSection";
import { PageTransition } from "@/components/animations/PageTransition";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { vipServiceMedia } from "@/lib/media";

const pillars = [
  {
    title: "Executive lifestyle management",
    body: "Households, calendars, and travel ecosystems—synchronized with discretion and long-term memory of preference.",
  },
  {
    title: "Luxury reservations",
    body: "Tables and suites secured through relationships; never left to chance or last-minute improvisation.",
  },
  {
    title: "Private transportation",
    body: "Chauffeured fleets, airside choreography, and routes chosen for time, privacy, and ease.",
  },
  {
    title: "Exclusive access",
    body: "Private viewings, closed venues, and introductions that respect both sides of the door.",
  },
  {
    title: "High-profile event coordination",
    body: "Guest experience as a signature—protocol, staffing, and atmosphere aligned to your narrative.",
  },
  {
    title: "Tailored private experiences",
    body: "Desert horizons, coastal sanctuaries, urban ateliers—composed as one seamless arc.",
  },
] as const;

export function VipConciergePage() {
  return (
    <PageTransition>
      <HorizontalScrollSection
        kicker="VIP CONCIERGE"
        title="Discretion as a discipline"
        description="We operate as an extension of your office, not a call center. Availability, judgment, and follow-through remain absolute."
      >
        {pillars.map((item, i) => {
          const media = vipServiceMedia[i];
          return (
            <PremiumCard
              key={item.title}
              kicker={`SIGNATURE 0${i + 1}`}
              title={item.title}
              description={item.body}
              image={{ src: media.src, alt: item.title, priority: true }}
            />
          );
        })}

        <div className="w-[35vw] flex-shrink-0 flex flex-col justify-center px-16 border-r border-pts-line/5 bg-pts-black/5">
          <p className="lux-heading text-[0.5rem] text-pts-gold tracking-[0.5em] mb-6 opacity-30 uppercase">PTS — VIP</p>
          <h2 className="font-heading text-2xl text-pts-parchment tracking-widest leading-relaxed uppercase mb-10">
            Personalized. Private. Perfect.
          </h2>
          <button className="lux-heading border border-pts-line/40 px-10 py-5 text-[0.62rem] text-pts-parchment tracking-[0.4em] hover:bg-pts-parchment hover:text-pts-bg transition-all uppercase">
            Initiate
          </button>
        </div>
      </HorizontalScrollSection>
    </PageTransition>
  );
}
