"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonialBackdrop } from "@/lib/media";
import { prefersReducedMotion } from "@/lib/motionPref";
import { Quote, Briefcase, Globe, CalendarDays } from "lucide-react";
import { LineRevealText } from "@/components/animations/LineRevealText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const quotes = [
  {
    quote:
      "PTS doesn’t just deliver services — it orchestrates experiences. Our executive board week was seamless, precise, and flawlessly executed with a level of sophistication you feel in every detail.",
    role: "Chief of Staff",
    org: "International Financial Group",
    index: "01",
    Icon: Briefcase,
  },
  {
    quote:
      "From Jeddah to three continents in ten days, every transfer, suite, and meeting was perfectly arranged before we even had to ask. That level of execution defines their service.",
    role: "VP Corporate Affairs",
    org: "Energy Conglomerate",
    index: "02",
    Icon: Globe,
  },
  {
    quote:
      "They understand that luxury is time. The entire MICE program felt carefully designed, not simply organized — every moment had purpose and precision.",
    role: "Global Events Director",
    org: "Luxury Automotive Brand",
    index: "03",
    Icon: CalendarDays,
  },
] as const;

/**
 * Testimonials — Clean, legible layout with elegant fade-in and premium icons.
 */
export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = cardsRef.current;
      if (!cards) return;
      if (prefersReducedMotion()) return;

      const cardEls = cards.querySelectorAll<HTMLElement>(".testimonial-card");
      
      cardEls.forEach((card) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 30,
            rotateX: 10,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              once: true,
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="section-transition relative overflow-hidden border-t border-pts-line/15 py-20 sm:py-28 lg:py-40 [perspective:1200px]"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0">
          <Image
            src={testimonialBackdrop}
            alt=""
            fill
            className="object-cover opacity-[0.1] saturate-0"
            sizes="100vw"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-pts-bg/95 via-pts-bg/88 to-pts-bg/95" />
      </div>

      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="gold-glow absolute left-1/4 top-1/2 h-[80%] w-[50%] -translate-y-1/2 opacity-[0.12]" />
      </div>

      <div className="relative mx-auto w-full max-w-[92rem] px-[clamp(1.25rem,3vw,2.5rem)]">
        <div
          ref={cardsRef}
          className="grid gap-6 sm:gap-8 lg:grid-cols-3"
        >
          {quotes.map((item) => (
            <blockquote
              key={item.index}
              className="testimonial-card relative border border-pts-gold/10 bg-pts-black/40 p-8 sm:p-10 transition-all duration-500 hover:border-pts-gold/30 hover:bg-pts-black/60 shadow-lux backdrop-blur-sm"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="lux-heading text-[0.44rem] tracking-[0.5em] text-pts-gold">{item.index}</span>
                <item.Icon size={24} className="text-pts-gold" strokeWidth={1} />
              </div>

              <div className="mb-8 h-px w-12 bg-pts-gold/30" />

              <div className="text-[1rem] sm:text-[1.1rem] leading-[1.8] text-pts-parchment/95 font-light">
                <LineRevealText 
                  text={item.quote} 
                  mode="cascade" 
                  stagger={0.015}
                  delay={0.3}
                />
              </div>

              <footer className="mt-10 sm:mt-12 border-t border-pts-line/20 pt-6 sm:pt-8 flex flex-col gap-1">
                <p className="lux-heading text-[0.55rem] tracking-[0.3em] text-pts-gold">{item.role}</p>
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-pts-gold-2">{item.org}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
