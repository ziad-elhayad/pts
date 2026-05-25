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
    title: "Luxury & Michelin-Star Restaurants",
    description: "Experience the pinnacle of gastronomy with curated Restaurant and Dining Services. Not just a table booking — a secured experience. From hidden local gems to world-renowned Michelin-starred establishments, the concierge team ensures every meal is a highlight of the journey.",
    image: "/images/services/concierge/photo-1518780664697-55e3ad937233.jpeg",
  },
  {
    title: "Worldwide Cinema",
    description: "Exclusive Cinema and Media Services providing access to the most luxurious viewing environments. Whether catching the latest blockbuster or hosting a private screening, the experience is immersive, comfortable, and entirely bespoke.",
    image: "/images/services/concierge/photo-1489599849927-2ee91cede3ba.jpeg",
  },
  {
    title: "Private Jet",
    description: "Travel without limits through exclusive private jet services for clients who value comfort, flexibility, and privacy. For business or leisure — seamless private aviation experiences with premium aircraft, VIP terminals, and personalized onboard services.",
    image: "/images/services/concierge/photo-1540962351504-03099e0a754b.jpeg",
  },
  {
    title: "Guard & Accompanying",
    description: "Bodyguard and Accompanying services designed to provide discreet, rigorous protection that integrates seamlessly with the itinerary. Prioritizes privacy and security without compromising mobility or comfort.",
    image: "/images/services/concierge/photo-1566073771259-6a8506099945.jpeg",
  },
  {
    title: "Childcare Abroad While Traveling",
    description: "International childcare services providing experienced nannies and personalized family support, allowing parents to relax and enjoy their journey while ensuring children remain safe, entertained, and comfortable.",
    image: "/images/services/concierge/photo-1567899378494-47b22a2ae96a.jpeg",
  },
  {
    title: "Luxury Hotels",
    description: "Access to the world's most prestigious luxury hotels and resorts. From exclusive suites and beachfront escapes to city landmarks and boutique retreats — personalized stays enhanced with VIP privileges, premium amenities, and exceptional hospitality.",
    image: "/images/services/concierge/photo-1507525428034-b723cf961d3e.jpeg",
  },
  {
    title: "Luxury Chalet",
    description: "Luxury chalet experiences — mountain retreats, lakeside escapes, or private resort stays — combining privacy, comfort, breathtaking views, and world-class services for unforgettable stays.",
    image: "/images/services/concierge/photo-1503220317375-aaad61436b1b.jpeg",
  },
  {
    title: "Beautiful Islands in the World",
    description: "Tailor-made luxury travel experiences to the most stunning islands. From tropical paradises and crystal-clear waters to hidden exclusive destinations — unforgettable island getaways designed around relaxation, adventure, and ultimate luxury.",
    image: "/images/services/concierge/photo-1514362545857-3bc16c4c7d1b.jpeg",
  },
  {
    title: "Yachts",
    description: "Bespoke yacht charter services for private vacations, romantic escapes, celebrations, or corporate events. Luxury yachts equipped with premium amenities, professional crews, and customized itineraries for extraordinary experiences at sea.",
    image: "/images/services/concierge/photo-1515562141207-7a88fb7ce338.jpeg",
  },
  {
    title: "Adventures",
    description: "Unique luxury adventure experiences worldwide — desert safaris, diving trips, mountain expeditions, and exclusive outdoor activities — combining thrill, comfort, and personalized planning.",
    image: "/images/services/concierge/photo-1469334031218-e382a71b716b.jpeg",
  },
  {
    title: "International Fashion Shows",
    description: "Privileged access to prestigious international fashion shows and elite events in the world's leading fashion capitals. VIP invitations, luxury accommodations, transportation, and exclusive experiences for style enthusiasts.",
    image: "/images/services/concierge/photo-1449965408869-eaa3f722e40d.jpeg",
  },
  {
    title: "International Jewelry Shows",
    description: "Exclusive access to international jewelry exhibitions and elite showcases. Connections to renowned jewelry brands, private collections, and prestigious events for collectors and luxury enthusiasts.",
    image: "/images/services/concierge/photo-1436491865332-7a61a109cc05.jpeg",
  },
  {
    title: "Chauffeur Service",
    description: "Professional chauffeur-driven vehicles for business and leisure. Each ride offers privacy, elegance, and convenience. Experienced drivers ensure a smooth, punctual, and refined travel experience.",
    image: "/images/services/concierge/lai-man-nung-Td6Yy3S3Ls0-unsplash.jpg",
  },
  {
    title: "Meet & Greet",
    description: "Professional Meet & Greet service at airports: personalized name signage, baggage assistance, and priority guidance through the airport. A welcoming, hassle-free experience from the moment of arrival.",
    image: "/images/services/concierge/dx_www-XJ2NPqVcjwY-unsplash.jpg",
  },
  {
    title: "Airport Transfers",
    description: "Reliable airport transfer service with seamless door-to-door transportation, real-time flight monitoring, timely pickups, and comfortable vehicles. Efficient, relaxing, and completely stress-free.",
    image: "/images/services/concierge/b2-1024x617-1.jpg",
  },
];

// Group services into slides of 3 each
const slides = [
  services.slice(0, 3),
  services.slice(3, 6),
  services.slice(6, 9),
  services.slice(9, 12),
  services.slice(12, 15),
];

export default function ConciergePage() {
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

    const totalSlides = slideElements.length;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${(totalSlides + 0.5) * (isLowEnd ? 30 : 40)}%`,
        pin: true,
        anticipatePin: 1,
        scrub: isLowEnd ? 0.15 : (isTouch ? 0.35 : 0.6),
      },
    });

    // Set initial states
    slideElements.forEach((slide, idx) => {
      if (idx === 0) {
        gsap.set(slide, { yPercent: 0, opacity: 1, scale: 1 });
      } else {
        gsap.set(slide, { yPercent: 100, opacity: 1, scale: 1 });
      }
    });

    slideElements.forEach((slide, idx) => {
      if (idx > 0) {
        const startTime = idx * 0.5;

        // Animate current slide in
        tl.to(slide, {
          yPercent: 0,
          ease: "power2.inOut",
        }, startTime);

        // Animate previous slide out
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
          <p className="lux-heading text-[0.5rem] text-pts-gold mb-6 tracking-[0.5em] uppercase">Concierge Services</p>
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl tracking-[0.1em] text-pts-parchment uppercase leading-[1.05] mb-8">
            Designed Around You and Delivered With Precision
          </h1>
          <p className="max-w-2xl mx-auto text-[0.65rem] sm:text-[0.75rem] uppercase tracking-[0.2em] text-pts-muted/70 leading-relaxed mb-10">
            Our luxury transportation services provide a curated selection of chauffeur-driven vehicles and premium travel solutions tailored for comfort, privacy, and reliability. Whether you need airport transfers, executive travel, or dedicated vehicles for the entire day, every journey is handled with professionalism, discretion, and exceptional attention to detail.
          </p>
          <MagneticButton
            onClick={() => setShowEnquiry(true)}
            className="border-pts-gold bg-pts-gold px-12 py-4 text-[0.65rem] font-bold text-pts-black uppercase tracking-[0.3em] hover:bg-pts-gold/90"
          >
            ENQUIRE FOR CONCIERGE
          </MagneticButton>
        </div>
      </section>

      {/* Services Section */}
      <section ref={containerRef} className="border-t border-pts-line bg-pts-black py-10 px-10 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="mb-12 text-center">
            <p className="lux-heading text-[0.5rem] text-pts-gold mb-4 tracking-[0.5em] uppercase">15 Services</p>
            <h2 className="font-heading text-3xl sm:text-5xl tracking-[0.1em] text-pts-parchment uppercase">
              Concierge Service Categories
            </h2>
          </div>

          <div className="relative min-h-[450px] overflow-hidden">
            {slides.map((slideServices, slideIndex) => (
              <div
                key={slideIndex}
                className="service-slide absolute inset-0 bg-pts-black will-change-transform"
                style={{ zIndex: slides.length - slideIndex }}
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
                Enquire for Concierge
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
              Please fill out the form below and our concierge team will get back to you shortly.
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
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your requirements..."
                />
              </div>
              <MagneticButton
                type="submit"
                className="w-full border-pts-gold bg-pts-gold px-8 py-4 text-[0.65rem] font-bold text-pts-black uppercase tracking-[0.3em] hover:bg-pts-gold/90"
              >
                Submit Enquiry
              </MagneticButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}