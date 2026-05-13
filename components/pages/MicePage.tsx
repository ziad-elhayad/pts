"use client";

import { HorizontalScrollSection } from "@/components/animations/HorizontalScrollSection";
import { PageTransition } from "@/components/animations/PageTransition";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { miceServiceMedia } from "@/lib/media";

const services = [
  {
    title: "Meetings",
    description: "Precision agendas, acoustic comfort, and privacy architecture—so leadership conversations stay where they belong.",
  },
  {
    title: "Incentives",
    description: "Programs that reward through immersion—pacing, surprise, and sensory detail choreographed as one arc.",
  },
  {
    title: "Conferences",
    description: "Scale without noise: delegate flows, speaker sanctuaries, and hospitality suites that feel bespoke.",
  },
  {
    title: "Exhibitions",
    description: "Stand design, staffing, and guest journeys engineered for presence—measured in conversations, not footfall.",
  },
  {
    title: "Executive coordination",
    description: "Motorcades, airside transitions, and calendar-critical choreography—handled as a single command channel.",
  },
  {
    title: "Destination management",
    description: "Local intelligence with international polish—Jeddah to global hubs, authored with continuity.",
  },
];

export function MicePage() {
  return (
    <PageTransition>
      <HorizontalScrollSection
        kicker="MICE"
        title="Corporate Excellence"
        description="Senior producers who speak the language of boards, brands, and production timelines."
      >
        {services.map((item, index) => {
          const media = miceServiceMedia[index];
          return (
            <PremiumCard
              key={item.title}
              kicker={`SERVICE 0${index + 1}`}
              title={item.title}
              description={item.description}
              image={{ src: media.src, alt: item.title, priority: true }}
            />
          );
        })}
        
        <div className="w-[35vw] flex-shrink-0 flex flex-col justify-center px-16 border-r border-pts-line/5 bg-pts-black/5">
          <p className="lux-heading text-[0.5rem] text-pts-gold tracking-[0.5em] mb-6 opacity-30 uppercase">PTS — MICE</p>
          <h2 className="font-heading text-2xl text-pts-parchment tracking-widest leading-relaxed uppercase mb-10">
            Ready to compose your next statement?
          </h2>
          <button className="lux-heading border border-pts-line/40 px-10 py-5 text-[0.62rem] text-pts-parchment tracking-[0.4em] hover:bg-pts-parchment hover:text-pts-bg transition-all uppercase">
            Start Consultation
          </button>
        </div>
      </HorizontalScrollSection>
    </PageTransition>
  );
}
