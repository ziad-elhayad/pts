"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, Plane, Building2, Gem } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    title: "Executive Aviation",
    desc: "Private charters and seamless global mobility with meticulous precision.",
    icon: Plane,
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "VIP Concierge",
    desc: "Discreet access and lifestyle management reserved for the elite.",
    icon: Gem,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "MICE Excellence",
    desc: "Large-scale events orchestrated with boutique, granular attention to detail.",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1540575467063-27a04d7b431c?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Curated Retreats",
    desc: "Exclusive escapes tailored to personal narratives and executive pacing.",
    icon: Compass,
    image: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=800&q=80",
  },
];

export function LuxuryServiceHighlights() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    const cards = containerRef.current.querySelectorAll(".service-card");
    
    gsap.fromTo(cards, 
      { opacity: 0, y: 60, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 1.2, 
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true
        }
      }
    );

    // Subtle float animation for icons
    cards.forEach((card, i) => {
      const icon = card.querySelector(".service-icon");
      if (icon) {
        gsap.to(icon, {
          y: -5,
          duration: 2 + i * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-20 sm:py-32 bg-pts-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,143,100,0.05),transparent_70%)] pointer-events-none" />
      
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 relative z-10">
        {services.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className="service-card group relative h-[380px] sm:h-[450px] w-full overflow-hidden border border-pts-gold/10 bg-pts-deep p-8 sm:p-12 transition-all duration-700 hover:border-pts-gold/30 hover:shadow-[0_0_40px_rgba(168,143,100,0.1)] cursor-pointer"
            >
              {/* Background Image Reveal */}
              <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-700 group-hover:opacity-40">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover scale-110 transition-transform duration-[2s] ease-out group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pts-deep via-pts-deep/80 to-pts-deep/20" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-auto">
                  <div className="service-icon mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full border border-pts-gold/20 bg-pts-gold/5 text-pts-gold shadow-inner backdrop-blur-md transition-colors duration-500 group-hover:bg-pts-gold group-hover:text-pts-black">
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl uppercase tracking-[0.1em] text-pts-parchment mb-4">
                    {item.title}
                  </h3>
                  <p className="text-[0.65rem] sm:text-[0.7rem] uppercase leading-[2.2] tracking-[0.2em] text-pts-muted/70 max-w-sm transition-colors duration-500 group-hover:text-pts-parchment/90">
                    {item.desc}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 mt-8 opacity-60 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="h-px w-12 bg-pts-gold/50" />
                  <span className="lux-heading text-[0.45rem] tracking-[0.4em] text-pts-gold">Explore</span>
                </div>
              </div>

              {/* Corner Accents */}
              <div className="absolute right-0 top-0 h-16 w-16 pointer-events-none transition-transform duration-700 group-hover:translate-x-2 group-hover:-translate-y-2">
                <div className="absolute right-6 top-6 h-px w-6 bg-pts-gold/30" />
                <div className="absolute right-6 top-6 h-6 w-px bg-pts-gold/30" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
