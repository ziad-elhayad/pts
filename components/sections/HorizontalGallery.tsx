"use client";

import { useRef, memo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePerformance } from "@/contexts/PerformanceContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ITEMS = [
  {
    id: 1,
    title: "Desert Horizons",
    subtitle: "Saudi Arabia",
    desc: "Ancient landscapes, five-star camps, timeless silence.",
    src: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 2,
    title: "Executive Aviation",
    subtitle: "Global Mobility",
    desc: "Private terminals, seamless transfers, sky-high precision.",
    src: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 3,
    title: "Urban Sanctuaries",
    subtitle: "Elite Hospitality",
    desc: "City suites, discreet arrivals, curated urban escapes.",
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 4,
    title: "Private Venues",
    subtitle: "Discreet Access",
    desc: "Behind-the-velvet access. Curated introductions. Intimate.",
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 5,
    title: "Coastal Escapes",
    subtitle: "The Red Sea",
    desc: "Yacht charters, coral reefs, and warm Arabian waters.",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
  },
] as const;

export const HorizontalGallery = memo(function HorizontalGallery() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { tier, isLowEnd, reducedMotion } = usePerformance();

  useGSAP(() => {
    const wrapper  = wrapperRef.current;
    const track    = trackRef.current;
    const progress = progressRef.current;
    if (!wrapper || !track) return;

    const getScrollDistance = () => {
      const dist = track.scrollWidth - window.innerWidth;
      return dist > 0 ? dist : 0;
    };

    const updateHeight = () => {
      const distance = getScrollDistance();
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // On mobile, use a more stable height reference to avoid URL bar resize loops
      const baseHeight = isTouch ? document.documentElement.clientHeight : window.innerHeight;
      
      wrapper.style.height = distance > 0 ? `${baseHeight + distance}px` : "auto";
      
      // Debounce refresh slightly
      ScrollTrigger.refresh();
    };

    const ro = new ResizeObserver(updateHeight);
    ro.observe(track);

    gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: isLowEnd ? 0.2 : 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progress) progress.style.transform = `scaleX(${self.progress})`;
        },
      },
    });

    // Velocity-based skew
    if (!isLowEnd && !reducedMotion) {
      const items = track.querySelectorAll(".hg-parallax-img");
      const proxy = { skew: 0 };
      const skewSetter = gsap.quickSetter(items, "skewX", "deg");
      const clamp = gsap.utils.clamp(-10, 10);

      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const skew = clamp(self.getVelocity() / -400);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.8,
              ease: "power3",
              overwrite: true,
              onUpdate: () => skewSetter(proxy.skew),
            });
          }
        },
      });
    }

    return () => ro.disconnect();
  }, { dependencies: [isLowEnd, reducedMotion] });

  return (
    <div
      id="experience-section"
      ref={wrapperRef}
      className="relative w-full overflow-visible scroll-mt-20"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex flex-col bg-pts-bg">

        {/* Atmospheric lighting */}
        {!isLowEnd && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="gold-glow absolute -top-1/4 -right-1/4 w-[60%] h-full opacity-20" />
            <div className="gold-glow absolute -bottom-1/4 -left-1/4 w-[60%] h-full opacity-15" />
          </div>
        )}

        {/* Editorial Header */}
        <div className="relative z-20 px-6 sm:px-10 pt-16 sm:pt-20 pb-6 sm:pb-8 bg-pts-bg"
             style={{ borderBottom: "1px solid rgba(168,143,100,0.07)" }}>
          <div className="mx-auto max-w-[1400px] flex items-end justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px w-6 bg-pts-gold/50" />
                <p className="lux-heading text-[0.5rem] text-pts-gold tracking-[0.6em] opacity-50">Gallery</p>
              </div>
              <h2 className="font-heading text-[clamp(1.6rem,3vw,2.5rem)] tracking-[0.15em] text-pts-parchment uppercase leading-none">
                Our Experiences
              </h2>
            </div>
            <p className="hidden lg:block lux-heading text-[0.44rem] text-pts-gold/30 tracking-[0.6em]">
              Scroll →
            </p>
          </div>
        </div>

        {/* Gallery Track */}
        <div className="relative flex-1 flex items-stretch z-10 overflow-hidden">
          <div
            ref={trackRef}
            className="flex h-full items-stretch will-change-transform transform-gpu"
            style={{ width: "max-content", paddingLeft: "8vw", paddingRight: "12vw" }}
          >
            {ITEMS.map((item, i) => (
              <div
                key={item.id}
                className="relative flex-shrink-0 group overflow-hidden h-full border-r border-pts-line/8 w-[85vw] sm:w-[60vw] md:w-[42vw]"
              >
                <div className="hg-parallax-img absolute inset-0 w-[140%] h-full left-[-20%] transform-gpu">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover brightness-[0.7] saturate-[0.85] transition-[filter] duration-[3s] ease-out group-hover:brightness-[0.85] group-hover:saturate-[1]"
                    priority
                    quality={isLowEnd ? 75 : 85}
                  />
                </div>

                {/* Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-pts-deep via-pts-deep/30 to-transparent opacity-60" />
                {!isLowEnd && <div className="absolute inset-0 bg-gradient-to-r from-pts-deep/30 via-transparent to-transparent" />}

                {/* Content */}
                <div className="absolute inset-0 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
                  {/* Index */}
                  <div className="flex items-center gap-3">
                    <div className="h-px w-5 bg-pts-gold/30" />
                    <p className="lux-heading text-[0.42rem] text-pts-gold tracking-[0.5em] opacity-40">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                  </div>

                  {/* Bottom */}
                  <div>
                    <p className="lux-heading text-[0.44rem] text-pts-gold tracking-[0.4em] opacity-40 mb-4">
                      {item.subtitle}
                    </p>
                    <h3 className="font-heading text-[clamp(1.4rem,2.5vw,2.2rem)] tracking-[0.12em] text-pts-parchment uppercase leading-tight max-w-xs">
                      {item.title}
                    </h3>

                    {/* Desc — reveals on hover */}
                    <p className="mt-5 text-[0.6rem] uppercase tracking-[0.22em] leading-[2] text-pts-muted/45 max-w-xs opacity-0 translate-y-4 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                      {item.desc}
                    </p>

                    {/* Gold line */}
                    <div className="mt-6 h-px w-0 bg-pts-gold/35 transition-all duration-700 group-hover:w-10" />
                  </div>
                </div>
              </div>
            ))}

            {/* End card */}
            <div
              className="flex-shrink-0 flex flex-col justify-center px-10 sm:px-16 border-r border-pts-line/8 w-[80vw] sm:w-[50vw] md:w-[30vw]"
            >
              <p className="lux-heading text-[0.48rem] text-pts-gold tracking-[0.6em] mb-6 opacity-25">
                PTS — GLOBAL PRECISION
              </p>
              <p className="text-pts-muted/35 text-[0.62rem] uppercase tracking-[0.22em] leading-loose max-w-xs italic">
                <span className="text-pts-gold/30">&ldquo;</span>
                The world is composed of moments we author together.
                <span className="text-pts-gold/30">&rdquo;</span>
              </p>
              <div className="mt-10 h-px w-12 bg-pts-gold/20" />
            </div>
          </div>
        </div>

        {/* Progress + Footer bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div
            ref={progressRef}
            className="h-[2px] origin-left will-change-transform"
            style={{
              transform: "scaleX(0)",
              background: "linear-gradient(90deg, var(--pts-gold), var(--pts-gold-2))",
            }}
          />
          <div className="flex items-center justify-between px-6 sm:px-10 py-4 sm:py-5"
               style={{ borderTop: "1px solid rgba(168,143,100,0.06)" }}>
            <div className="flex items-center gap-5">
              <span className="lux-heading text-[0.48rem] text-pts-gold tracking-[0.5em]">01</span>
              <div className="h-px w-14 bg-pts-line/20" />
              <span className="lux-heading text-[0.48rem] text-pts-muted/25 tracking-[0.5em]">05</span>
            </div>
            {!isLowEnd && <p className="lux-heading text-[0.42rem] text-pts-gold/20 tracking-[1em]">Scroll</p>}
          </div>
        </div>
      </div>
    </div>
  );
});
