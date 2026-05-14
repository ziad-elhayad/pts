"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonialBackdrop } from "@/lib/media";
import { prefersReducedMotion } from "@/lib/motionPref";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const quotes = [
  {
    quote:
      "PTS does not shout—it delivers. Our board week landed with a quiet rhythm that felt expensive in every sense except noise.",
    role: "Chief of Staff",
    org: "International financial group",
    index: "01",
  },
  {
    quote:
      "From Jeddah to three continents in ten days—every transfer, suite, and side-meeting appeared before we asked. That is the product.",
    role: "VP Corporate Affairs",
    org: "Energy conglomerate",
    index: "02",
  },
  {
    quote:
      "They understand that luxury is time returned. The MICE program felt authored, not assembled.",
    role: "Global Events Director",
    org: "Luxury automotive brand",
    index: "03",
  },
] as const;

/**
 * Testimonials — magnetic card deck + word-wave quote (unique).
 */
export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const cards = cardsRef.current;
      const bg = bgRef.current;
      if (!section || !cards) return;
      if (prefersReducedMotion()) return;

      if (bg) {
        gsap.fromTo(
          bg,
          { scale: 1.08, yPercent: -4 },
          {
            scale: 1.18,
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      const cardEls = cards.querySelectorAll<HTMLElement>(".testimonial-card");
      gsap.fromTo(
        cardEls,
        {
          opacity: 0,
          y: 120,
          rotateX: -42,
          z: -200,
          transformOrigin: "50% 100%",
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          z: 0,
          duration: 1.35,
          stagger: { each: 0.16, from: "end" },
          ease: "power4.out",
          scrollTrigger: {
            trigger: cards,
            start: "top 84%",
            once: true,
          },
        },
      );

      cardEls.forEach((card) => {
        const words = card.querySelectorAll<HTMLElement>(".tm-w");
        gsap.fromTo(
          words,
          { y: 18, opacity: 0.15, skewX: -3 },
          {
            y: 0,
            opacity: 1,
            skewX: 0,
            ease: "none",
            stagger: 0.035,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "top 55%",
              scrub: 0.5,
            },
          },
        );
      });

      cardEls.forEach((card) => {
        const onMove = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, {
            rotateY: nx * 8,
            rotateX: -ny * 6,
            duration: 0.6,
            ease: "power3.out",
            overwrite: "auto",
          });
        };
        const onLeave = () => {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.9, ease: "power3.out" });
        };
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        (card as HTMLElement & { _tmMove?: (e: PointerEvent) => void; _tmLeave?: () => void })._tmMove = onMove;
        (card as HTMLElement & { _tmLeave?: () => void })._tmLeave = onLeave;
      });

      return () => {
        cardEls.forEach((card) => {
          const c = card as HTMLElement & { _tmMove?: (e: PointerEvent) => void; _tmLeave?: () => void };
          if (c._tmMove) card.removeEventListener("pointermove", c._tmMove);
          if (c._tmLeave) card.removeEventListener("pointerleave", c._tmLeave);
        });
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="section-transition relative overflow-hidden border-t border-pts-line/15 py-20 sm:py-28 lg:py-40 [perspective:1400px]"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div ref={bgRef} className="absolute inset-[-8%] will-change-transform">
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
          className="grid transform-gpu gap-px border border-pts-gold/8 bg-pts-gold/8 [transform-style:preserve-3d] lg:grid-cols-3"
        >
          {quotes.map((item) => (
            <blockquote
              key={item.index}
              className="testimonial-card group relative bg-pts-bg/90 p-8 sm:p-10 transition-[background-color,box-shadow] duration-700 will-change-transform [transform-style:preserve-3d] lg:p-12 hover:bg-pts-black/60"
            >
              <div className="mb-8 sm:mb-10 flex items-center justify-between">
                <span className="lux-heading text-[0.44rem] tracking-[0.5em] text-pts-gold/35">{item.index}</span>
                <span
                  className="font-heading text-4xl leading-none text-pts-gold/15 transition-colors duration-700 group-hover:text-pts-gold/25"
                  aria-hidden
                >
                  {"\u201C"}
                </span>
              </div>

              <div className="mb-8 h-px w-full bg-pts-gold/10 transition-colors duration-700 group-hover:bg-pts-gold/25" />

              <p className="text-[0.62rem] uppercase leading-[2.35] tracking-[0.16em] text-pts-parchment/80 transition-colors duration-500 group-hover:text-pts-parchment/95">
                <span className="text-pts-gold/25">&ldquo;</span>
                {item.quote.split(" ").map((w, wi) => (
                  <span key={wi} className="tm-w mr-[0.35em] inline-block will-change-transform">
                    {w}
                  </span>
                ))}
                <span className="text-pts-gold/25">&rdquo;</span>
              </p>

              <footer className="mt-8 sm:mt-10 border-t border-pts-line/20 pt-6 sm:pt-8">
                <p className="lux-heading text-[0.52rem] tracking-[0.4em] text-pts-gold">{item.role}</p>
                <p className="mt-2 text-[0.58rem] uppercase tracking-[0.3em] text-pts-muted/45">{item.org}</p>
              </footer>

              <div className="absolute right-5 top-5 h-5 w-5 border-t border-r border-pts-gold/0 transition-all duration-700 group-hover:border-pts-gold/30" />
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
