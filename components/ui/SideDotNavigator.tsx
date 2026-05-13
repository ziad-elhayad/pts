"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const sections = [
  { id: "hero", label: "Home" },
  { id: "intro", label: "The Brand" },
  { id: "mice", label: "MICE Operations" },
  { id: "vip-split", label: "VIP Concierge" },
  { id: "itineraries", label: "Itineraries" },
  { id: "lens", label: "Perspective" },
  { id: "gallery", label: "The Gallery" },
  { id: "testimonials", label: "Testimonials" },
  { id: "cta", label: "Contact" },
] as const;

/**
 * SideDotNavigator — Provides a clear visual indication of where the user 
 * is on the page. Essential for clear section division.
 */
export function SideDotNavigator() {
  const [activeSection, setActiveSection] = useState("hero");
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      sections.forEach((section) => {
        ScrollTrigger.create({
          trigger: `#${section.id}`,
          start: "top 40%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) setActiveSection(section.id);
          },
        });
      });
    },
    { scope: rootRef },
  );

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={rootRef}
      className="fixed right-8 top-1/2 z-[100] hidden -translate-y-1/2 flex-col items-end gap-6 lg:flex"
    >
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollTo(section.id)}
          className="group relative flex items-center gap-4"
        >
          <span className={clsx(
            "lux-heading text-[0.45rem] tracking-[0.4em] uppercase transition-all duration-500 opacity-0 group-hover:opacity-100",
            activeSection === section.id ? "text-pts-gold opacity-100 translate-x-0" : "text-pts-muted translate-x-2"
          )}>
            {section.label}
          </span>
          <div className="relative h-2 w-2">
            <motion.div 
              className={clsx(
                "absolute inset-0 rounded-full border border-pts-gold/30 transition-all duration-500",
                activeSection === section.id ? "scale-150 border-pts-gold" : "scale-100"
              )}
            />
            <div className={clsx(
              "absolute inset-0.5 rounded-full transition-all duration-500",
              activeSection === section.id ? "bg-pts-gold" : "bg-pts-muted/20"
            )} />
          </div>
        </button>
      ))}
    </div>
  );
}

function clsx(...args: Array<string | false | undefined | null>) {
  return args.filter(Boolean).join(" ");
}
