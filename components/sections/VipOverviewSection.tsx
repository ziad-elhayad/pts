"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { vipServiceMedia } from "@/lib/media";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePerformance } from "@/contexts/PerformanceContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    title: "Concierge",
    subtitle: "Designed Around You and Delivered With Precision",
    description: "Luxury transportation services providing a curated selection of chauffeur-driven vehicles and premium travel solutions tailored for comfort, privacy, and reliability. Whether for airport transfers, executive travel, or dedicated vehicles for the entire day, every journey is handled with professionalism, discretion, and exceptional attention to detail.",
    button: "Read More →",
    link: "/services/concierge",
  },
  {
    title: "MICE & International Events Management",
    subtitle: "",
    description: "Connecting Excellence with Global Opportunities. Organizing professional global meetings, adhering to the highest international standards and protocols.",
    button: "Read More →",
    link: "/services/mice",
  },
  {
    title: "Elite Medical Tourism Concierge",
    subtitle: "",
    description: "Gervae makes medical journeys seamless — from arranging world-class treatment to handling travel and accommodations with precision. Every detail is managed confidentially and efficiently, so clients can focus on health and peace of mind. With Gervae, medical travel isn't just a trip — it's a worry-free experience, tailored just for you.",
    button: "ENQUIRE NOW",
    link: "/services/medical-tourism",
  },
  {
    title: "Elite Sports Events & Hospitality",
    subtitle: "",
    description: "Managing premium and specialized logistics and hospitality for the world's most prestigious sporting events. Whether hosting a tournament or organizing VIP travel for athletes and supporters, Gervae delivers a front-row experience.",
    button: "Read More →",
    link: "/services/sports",
  },
] as const;

export function VipOverviewSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { isLowEnd, reducedMotion } = usePerformance();

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    if (!containerRef.current || reducedMotion || !mounted) return;

    const stages = containerRef.current.querySelectorAll(".service-slide");
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${stages.length * (isLowEnd ? 30 : 40)}%`,
        pin: true,
        anticipatePin: 1,
        scrub: isLowEnd ? 0.15 : (isTouch ? 0.35 : 0.6),
      },
    });

    stages.forEach((stage, idx) => {
      if (idx > 0) {
        // Prepare stage off-screen
        gsap.set(stage, { yPercent: 100 });
        
        const startTime = idx * 0.45;

        tl.to(stage, {
          yPercent: 0,
          ease: "power2.inOut",
        }, startTime); 

        // Push the previous stage back slightly
        const prevStage = stages[idx - 1];
        tl.to(prevStage, {
          scale: isLowEnd ? 1 : 0.94,
          opacity: isLowEnd ? 0.2 : 0.4,
          yPercent: isLowEnd ? 0 : -8,
          filter: (isTouch || isLowEnd) ? "none" : "blur(4px)",
          ease: "power2.inOut"
        }, startTime);
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, { scope: containerRef, dependencies: [mounted, reducedMotion, isLowEnd] });

  return (
    <section ref={containerRef} id="services-section" className="border-t border-pts-line bg-pts-black/25 py-20 px-10 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="mb-12">
          <p className="lux-heading text-[0.5rem] text-pts-gold mb-4 tracking-[0.5em] uppercase">SERVICES</p>
          <h2 className="font-heading text-3xl sm:text-5xl tracking-[0.1em] text-pts-parchment uppercase">Our Services</h2>
        </div>

        <div className="relative min-h-[500px]">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-slide absolute inset-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
                {/* Left Side - Text Content */}
                <div className="order-2 lg:order-1">
                  {service.subtitle && (
                    <p className="lux-heading text-[0.5rem] text-pts-gold mb-4 tracking-[0.4em] uppercase">
                      {service.subtitle}
                    </p>
                  )}
                  <h3 className="font-heading text-2xl sm:text-4xl uppercase tracking-[0.1em] text-pts-parchment mb-6">
                    {service.title}
                  </h3>
                  <p className="text-[0.65rem] sm:text-[0.75rem] uppercase tracking-[0.2em] text-pts-muted/70 leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <MagneticButton
                    href={service.link}
                    className="border-pts-gold bg-pts-gold px-10 py-3 text-[0.6rem] uppercase tracking-[0.3em] text-pts-black hover:bg-pts-gold/90"
                  >
                    {service.button}
                  </MagneticButton>
                </div>

                {/* Right Side - Image */}
                <div className="order-1 lg:order-2">
                  <div className="relative h-80 sm:h-96 overflow-hidden rounded-sm border border-pts-gold/30 bg-pts-black">
                    <Image
                      src={vipServiceMedia[index % vipServiceMedia.length].src}
                      alt={service.title}
                      fill
                      className="object-cover brightness-100 saturate-100"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pts-black/80 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
