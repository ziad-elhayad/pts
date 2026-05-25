"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePerformance } from "@/contexts/PerformanceContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    title: "Tennis Championships",
    description: "Premium access and event management for Grand Slams and ATP tours, ensuring world-class hospitality for fans and players.",
    image: "/images/services/sports/abhinand-venugopal-1WZfzLWBSi4-unsplash.jpg",
  },
  {
    title: "Formula 1® Grand Prix",
    description: "High-octane logistics and VIP Paddock Club arrangements for the world's most elite motorsport circuits.",
    image: "/images/services/sports/daniil-zanevskiy-NIZS__PjZyM-unsplash.jpg",
  },
  {
    title: "Professional Racing",
    description: "Specialized support for international racing series, from GT endurance to motorcycle championships and rally events.",
    image: "/images/services/sports/mike-kotsch-PiP3mbzg6To-unsplash.jpg",
  },
  {
    title: "Football Leagues",
    description: "Comprehensive management for international matches, club tours, and major tournaments like the World Cup and Champions League.",
    image: "/images/services/sports/photo-1549719386-74dfcbf7dbed.jpeg",
  },
  {
    title: "Championship Boxing",
    description: "Expert coordination for global title fights, focusing on venue management, media logistics, and elite fan experiences.",
    image: "/images/services/sports/photo-1551524559-8af4e6624178 (1).jpeg",
  },
  {
    title: "MMA & Combat Sports",
    description: "Full-scale event production and hospitality for major MMA organizations and global combat sport spectacles.",
    image: "/images/services/sports/photo-1554068865-24cecd4e34b8 (1).jpeg",
  },
  {
    title: "Skiing & Winter Sports",
    description: "World-class logistics for alpine tournaments and luxury ski retreats, featuring elite resort management and professional competition support.",
    image: "/images/services/sports/photo-1568605117036-5fe5e7bab0b7.jpeg",
  },
  {
    title: "Horse Racing & Equestrian",
    description: "Exclusive VIP hospitality and paddock access for premier global races, from Royal Ascot to the Grand National.",
    image: "/images/services/sports/photo-1579952363873-27f3bade9f55 (1).jpeg",
  },
  {
    title: "Camel Racing",
    description: "Celebrating desert heritage with professional management of traditional races, featuring high-tech robotic jockeys and authentic cultural experiences.",
    image: "/images/services/sports/tom-macret-xH34lqnzVJ4-unsplash.jpg",
  },
];

// Group services into slides of 3 each (last slide will have 1)
const slides = [
  services.slice(0, 3),
  services.slice(3, 6),
  services.slice(6, 9),
  services.slice(9, 10),
];

const sportTypes = [
  "Tennis Championships",
  "Formula 1® Grand Prix",
  "Professional Racing",
  "Football Tournaments",
  "Championship Boxing",
  "MMA & Combat Sports",
  "Skiing",
  "Horse Racing",
  "Camel Racing",
];

export default function SportsPage() {
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
          <p className="lux-heading text-[0.5rem] text-pts-gold mb-6 tracking-[0.5em] uppercase">Sports Services</p>
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl tracking-[0.1em] text-pts-parchment uppercase leading-[1.05] mb-6">
            Elite Sports Events & Hospitality
          </h1>
          <p className="lux-heading text-[0.6rem] text-pts-gold mb-8 tracking-[0.4em] uppercase">
            Experience the Thrill of Global Competition
          </p>
          <p className="max-w-2xl mx-auto text-[0.65rem] sm:text-[0.75rem] uppercase tracking-[0.2em] text-pts-muted/70 leading-relaxed mb-10">
            Managing premium and specialized logistics and hospitality for the world's most prestigious sporting events. Whether hosting a tournament or organizing VIP travel for athletes and supporters, Gervae delivers a front-row experience.
          </p>
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
            <p className="lux-heading text-[0.5rem] text-pts-gold mb-4 tracking-[0.5em] uppercase">9 Categories</p>
            <h2 className="font-heading text-3xl sm:text-5xl tracking-[0.1em] text-pts-parchment uppercase">
              Sports Categories
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
                          className="object-cover brightness-100 saturate-100"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-pts-black/80 via-transparent to-transparent" />
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading text-[1rem] sm:text-[1.1rem] uppercase tracking-[0.12em] text-pts-parchment mb-4">
                          {service.title}
                        </h3>
                        <p className="text-[0.75rem] sm:text-[0.8rem] uppercase tracking-[0.18em] text-pts-muted/70 leading-loose">
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

      {/* Enquiry Modal */}
      {showEnquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-pts-black/80 backdrop-blur-sm p-4">
          <div className="bg-pts-deep border border-pts-gold/30 max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-heading text-xl uppercase tracking-[0.1em] text-pts-parchment">
                Sports Enquiry
              </h3>
              <button
                type="button"
                onClick={() => setShowEnquiry(false)}
                className="text-pts-gold text-2xl hover:text-pts-parchment transition-colors"
              >
                ×
              </button>
            </div>
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-pts-muted/70 mb-6">
              Please fill out the form below and our sports team will get back to you shortly.
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-[0.6rem] uppercase tracking-[0.3em] text-pts-gold mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                  placeholder="Your first name"
                />
              </div>
              <div>
                <label className="block text-[0.6rem] uppercase tracking-[0.3em] text-pts-gold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-[0.6rem] uppercase tracking-[0.3em] text-pts-gold mb-2">
                  Nationality
                </label>
                <select className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-pts-parchment focus:border-pts-gold focus:outline-none transition-colors">
                  <option value="">Select country</option>
                  <option value="SA">Saudi Arabia</option>
                  <option value="AE">United Arab Emirates</option>
                  <option value="QA">Qatar</option>
                  <option value="KW">Kuwait</option>
                  <option value="BH">Bahrain</option>
                  <option value="OM">Oman</option>
                  <option value="EG">Egypt</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="CN">China</option>
                  <option value="IN">India</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[0.6rem] uppercase tracking-[0.3em] text-pts-gold mb-2">
                  Phone/Mobile
                </label>
                <input
                  type="tel"
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                  placeholder="+966 500 000 0000"
                />
              </div>
              <div>
                <label className="block text-[0.6rem] uppercase tracking-[0.3em] text-pts-gold mb-2">
                  Sport Type
                </label>
                <select className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-pts-parchment focus:border-pts-gold focus:outline-none transition-colors">
                  <option value="">Select sport type</option>
                  {sportTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[0.6rem] uppercase tracking-[0.3em] text-pts-gold mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your sports event requirements..."
                />
              </div>
              <MagneticButton
                type="submit"
                className="w-full border-pts-gold bg-pts-gold px-8 py-4 text-[0.65rem] font-bold text-pts-black uppercase tracking-[0.3em] hover:bg-pts-gold/90"
              >
                Submit Form
              </MagneticButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
