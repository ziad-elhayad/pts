"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { usePerformance } from "@/contexts/PerformanceContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextScrollReveal } from "@/components/animations/TextScrollReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    title: "Abroad Corporate Services",
    description: "Bespoke business travel, incentive programs, and executive meetings tailored for global corporate growth.",
    image: "https://images.unsplash.com/photo-1565514020116-4d3c1c698725?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Medical Exhibitions & Symposium",
    description: "Premier platforms showcasing the latest breakthroughs in healthcare technology and medical equipment.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Medical Associations Conferences",
    description: "Comprehensive management for professional medical unions and scientific societies' annual gatherings.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Pharmaceutical Exhibitions",
    description: "Strategic hubs for global labs and pharma companies to launch innovations and network with industry leaders.",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Tourism Exhibitions",
    description: "Vibrant trade shows bringing together luxury brands, suppliers, and beauty industry professionals.",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Building Materials Exhibitions",
    description: "The ultimate destination for architects and contractors to explore the future of construction and design.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Defense Exhibitions",
    description: "High-security, elite-level logistics and organization for international defense and security forums.",
    image: "https://images.unsplash.com/photo-1580752300992-559f8e9cc36a?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "International Conferences",
    description: "Smart, scalable solutions for cross-border conferences that unite global experts and thought leaders.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Davos Summit & Global Forums",
    description: "Exclusive concierge and management services for high-profile participation in the World Economic Forum and elite summits.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Political Conferences",
    description: "Premium arrangements and VIP access to international political conferences, summits, and diplomatic events around the world.",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Fashion & Jewelry Exhibitions",
    description: "VIP experiences at the world's most prestigious fashion and jewelry events, connecting clients with renowned designers.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
  },
];

// Group services into slides of 3 each (last slide will have 2)
const slides = [
  services.slice(0, 3),
  services.slice(3, 6),
  services.slice(6, 9),
  services.slice(9, 11),
];

const eventTypes = [
  "Abroad Corporate Services",
  "Medical Exhibitions & Symposium",
  "Medical Associations Conferences",
  "Pharmaceutical Exhibitions",
  "Tourism Exhibitions",
  "Building Materials Exhibitions",
  "Defense Exhibitions",
  "International Conferences",
  "Davos Summit & Global Forums",
  "Political Conferences",
  "Fashion & Jewelry Exhibitions",
];

export function MiceInternationalPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const { isLowEnd, reducedMotion } = usePerformance();

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    if (!containerRef.current || reducedMotion || !mounted) return;

    const slideElements = containerRef.current.querySelectorAll(".service-slide");
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${slideElements.length * (isLowEnd ? 30 : 40)}%`,
        pin: true,
        anticipatePin: 1,
        scrub: isLowEnd ? 0.15 : (isTouch ? 0.35 : 0.6),
      },
    });

    slideElements.forEach((slide, idx) => {
      if (idx > 0) {
        gsap.set(slide, { yPercent: 100 });
        
        const startTime = idx * 0.45;

        tl.to(slide, {
          yPercent: 0,
          ease: "power2.inOut",
        }, startTime); 

        const prevSlide = slideElements[idx - 1];
        tl.to(prevSlide, {
          scale: isLowEnd ? 1 : 0.94,
          opacity: 0,
          yPercent: isLowEnd ? 0 : -8,
          filter: (isTouch || isLowEnd) ? "none" : "blur(8px)",
          ease: "power2.inOut"
        }, startTime);
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, { scope: containerRef, dependencies: [mounted, reducedMotion, isLowEnd] });

  return (
    <div className="bg-pts-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center border-b border-pts-line/20">
        <div className="absolute inset-0 bg-gradient-to-b from-pts-deep to-pts-bg" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <TextScrollReveal as="p" className="lux-heading text-[0.5rem] text-pts-gold mb-6 tracking-[0.5em] uppercase">MICE & International Events</TextScrollReveal>
          <TextScrollReveal as="h1" className="font-heading text-3xl sm:text-5xl lg:text-6xl tracking-[0.1em] text-pts-parchment uppercase leading-[1.05] mb-6" delay={80}>
            MICE & International Events<br/>Management
          </TextScrollReveal>
          <TextScrollReveal as="p" className="lux-heading text-[0.6rem] text-pts-gold mb-8 tracking-[0.4em] uppercase" delay={160}>
            Connecting Excellence with Global Opportunities
          </TextScrollReveal>
          <TextScrollReveal as="p" className="max-w-2xl mx-auto text-[0.65rem] sm:text-[0.75rem] uppercase tracking-[0.2em] text-pts-muted/70 leading-relaxed mb-10" delay={240}>
            End-to-end solutions for the MICE industry, blending logistical precision with innovative execution. From high-level diplomatic summits to specialized industrial exhibitions, every event is ensured to be a world-class experience.
          </TextScrollReveal>
          <MagneticButton
            onClick={() => setShowEnquiry(true)}
            className="border-pts-gold bg-pts-gold px-12 py-4 text-[0.65rem] font-bold text-pts-black uppercase tracking-[0.3em] hover:bg-pts-gold/90"
          >
            Enquire Now
          </MagneticButton>
        </div>
      </section>

      {/* Services Section */}
      <section ref={containerRef} className="border-t border-pts-line bg-pts-black py-10 px-10 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="mb-12 text-center">
            <p className="lux-heading text-[0.5rem] text-pts-gold mb-4 tracking-[0.5em] uppercase">11 Categories</p>
            <h2 className="font-heading text-3xl sm:text-5xl tracking-[0.1em] text-pts-parchment uppercase">
              MICE Event Categories
            </h2>
          </div>

          <div className="relative min-h-[450px]">
            {slides.map((slideServices, slideIndex) => (
              <div
                key={slideIndex}
                className="service-slide absolute inset-0 bg-pts-black"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                  {slideServices.map((service, serviceIndex) => (
                    <div
                      key={serviceIndex}
                      className="border border-pts-gold/40 bg-pts-deep/40 overflow-hidden hover:border-pts-gold/60 hover:bg-pts-deep/50 transition-all duration-300 shadow-lg hover:shadow-2xl"
                    >
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-pts-deep/90 to-transparent" />
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading text-lg tracking-[0.1em] text-pts-parchment uppercase mb-3">
                          {service.title}
                        </h3>
                        <p className="text-[0.65rem] text-pts-muted/70 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form Modal */}
      {showEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pts-black/90 backdrop-blur-sm">
          <div className="bg-pts-deep border border-pts-gold/40 max-w-lg w-full p-8 relative">
            <button
              onClick={() => setShowEnquiry(false)}
              className="absolute top-4 right-4 text-pts-gold hover:text-pts-parchment transition-colors"
            >
              ✕
            </button>
            <h2 className="font-heading text-2xl tracking-[0.1em] text-pts-parchment uppercase mb-6">
              MICE Enquiry
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-[0.65rem] text-pts-gold uppercase tracking-[0.2em] mb-2">Full Name</label>
                <input type="text" className="w-full bg-pts-black border border-pts-gold/40 p-3 text-pts-parchment text-sm focus:border-pts-gold focus:outline-none" />
              </div>
              <div>
                <label className="block text-[0.65rem] text-pts-gold uppercase tracking-[0.2em] mb-2">Email</label>
                <input type="email" className="w-full bg-pts-black border border-pts-gold/40 p-3 text-pts-parchment text-sm focus:border-pts-gold focus:outline-none" />
              </div>
              <div>
                <label className="block text-[0.65rem] text-pts-gold uppercase tracking-[0.2em] mb-2">Company Name</label>
                <input type="text" className="w-full bg-pts-black border border-pts-gold/40 p-3 text-pts-parchment text-sm focus:border-pts-gold focus:outline-none" />
              </div>
              <div>
                <label className="block text-[0.65rem] text-pts-gold uppercase tracking-[0.2em] mb-2">Company Address</label>
                <input type="text" className="w-full bg-pts-black border border-pts-gold/40 p-3 text-pts-parchment text-sm focus:border-pts-gold focus:outline-none" />
              </div>
              <div>
                <label className="block text-[0.65rem] text-pts-gold uppercase tracking-[0.2em] mb-2">Nationality</label>
                <select className="w-full bg-pts-black border border-pts-gold/40 p-3 text-pts-parchment text-sm focus:border-pts-gold focus:outline-none">
                  <option value="">Select Country</option>
                  <option value="SA">Saudi Arabia</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="QA">Qatar</option>
                  <option value="KW">Kuwait</option>
                  <option value="BH">Bahrain</option>
                  <option value="OM">Oman</option>
                  <option value="EG">Egypt</option>
                  <option value="JO">Jordan</option>
                  <option value="LB">Lebanon</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[0.65rem] text-pts-gold uppercase tracking-[0.2em] mb-2">Phone/Mobile</label>
                <input type="tel" className="w-full bg-pts-black border border-pts-gold/40 p-3 text-pts-parchment text-sm focus:border-pts-gold focus:outline-none" />
              </div>
              <div>
                <label className="block text-[0.65rem] text-pts-gold uppercase tracking-[0.2em] mb-2">Event Type</label>
                <select className="w-full bg-pts-black border border-pts-gold/40 p-3 text-pts-parchment text-sm focus:border-pts-gold focus:outline-none">
                  <option value="">Select Event Type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[0.65rem] text-pts-gold uppercase tracking-[0.2em] mb-2">Message</label>
                <textarea rows={4} className="w-full bg-pts-black border border-pts-gold/40 p-3 text-pts-parchment text-sm focus:border-pts-gold focus:outline-none" />
              </div>
              <button
                type="submit"
                className="w-full bg-pts-gold text-pts-black font-bold uppercase tracking-[0.3em] py-4 hover:bg-pts-gold/90 transition-colors"
              >
                Submit Form
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
