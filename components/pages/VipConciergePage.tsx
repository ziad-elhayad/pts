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
    <div className="min-h-[60vh] flex items-center justify-center">
      {/* Content removed per request */}
    </div>
  );
}
