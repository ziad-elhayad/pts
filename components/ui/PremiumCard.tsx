"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import type { ReactNode } from "react";
import { X } from "lucide-react";

type CardImage = {
  src: string;
  alt: string;
  priority?: boolean;
};

type PremiumCardProps = {
  title: string;
  description: string;
  kicker?: string;
  className?: string;
  footer?: ReactNode;
  image?: CardImage;
};

export function PremiumCard({
  title,
  description,
  kicker,
  className,
  footer,
  image,
}: PremiumCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotX = useSpring(rawY, { stiffness: 180, damping: 22, mass: 0.4 });
  const rotY = useSpring(rawX, { stiffness: 180, damping: 22, mass: 0.4 });
  const shine = useTransform(rawX, [-0.5, 0.5], ["rgba(207,186,144,0)", "rgba(207,186,144,0.08)"]);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(nx);
    rawY.set(ny * -1);
  };

  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const rotXDeg = useTransform(rotX, [-0.5, 0.5], ["-8deg", "8deg"]);
  const rotYDeg = useTransform(rotY, [-0.5, 0.5], ["-8deg", "8deg"]);

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-pts-black/90 p-6 sm:p-20 backdrop-blur-xl"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-5xl aspect-[4/5] sm:aspect-video overflow-hidden rounded-xl shadow-[0_50px_100px_rgba(0,0,0,1)] border border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            {image && (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                quality={100}
              />
            )}
            
            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-pts-black via-transparent to-pts-black/20 opacity-80" />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-8 bg-pts-gold" />
                <span className="lux-heading text-[0.5rem] tracking-[0.6em] text-pts-gold uppercase">
                  {kicker || "Service Detail"}
                </span>
              </div>
              
              <h2 className="font-heading text-3xl sm:text-5xl uppercase tracking-[0.15em] text-pts-parchment mb-8 leading-tight">
                {title}
              </h2>
              
              <p className="max-w-2xl text-[0.7rem] sm:text-[0.8rem] uppercase leading-[2.4] tracking-[0.25em] text-pts-parchment/70 font-light">
                {description}
              </p>
              
              <div className="mt-12 h-px w-24 bg-pts-gold/40" />
            </div>

            {/* Minimal Close Control */}
            <button 
              className="absolute top-8 right-8 z-50 text-pts-gold/40 hover:text-pts-gold transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <X size={32} strokeWidth={1} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.article
        ref={cardRef}
        onClick={() => setIsOpen(true)}
        whileHover={typeof window !== 'undefined' && !('ontouchstart' in window || navigator.maxTouchPoints > 0) ? { scale: 1.015 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={clsx(
          "group relative flex flex-col overflow-hidden border-r border-pts-gold/10 h-full w-[85vw] sm:w-[60vw] md:w-[38vw] shrink-0 cursor-pointer",
          className,
        )}
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <motion.div
          className="relative h-full w-full flex flex-col"
          style={{
            rotateX: rotXDeg,
            rotateY: rotYDeg,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Background image */}
          {image ? (
            <div className="absolute inset-0 z-0 overflow-hidden">
              <div className="hg-parallax-img absolute inset-0 w-[140%] h-full left-[-20%]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 85vw, (max-width: 1200px) 60vw, 38vw"
                  className="object-cover brightness-100 saturate-100 transition-transform duration-[3s] ease-out group-hover:scale-105"
                  priority={image.priority}
                  loading={image.priority ? "eager" : "lazy"}
                />
              </div>

              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-pts-black/80 via-pts-black/20 to-transparent opacity-40" />
            </div>
          ) : null}

          {/* Dynamic shine overlay */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-20"
            style={{ background: shine, mixBlendMode: "screen" }}
          />

          {/* Geometric accent — top left */}
          <div className="absolute top-10 left-10 z-20 transition-transform duration-700 group-hover:translate-x-1 group-hover:-translate-y-1">
            <div className="h-px w-10 bg-pts-gold/40" />
            <div className="h-10 w-px bg-pts-gold/40" />
          </div>

          {/* Content panel */}
          <div
            className="relative z-10 mt-auto mx-6 mb-10 glass-deep p-10 lg:p-14 border border-pts-gold/15 transition-[border-color,box-shadow] duration-700 group-hover:border-pts-gold/30 group-hover:shadow-[0_0_40px_rgba(168,143,100,0.08)]"
            style={{ transform: "translateZ(30px)" }}
          >
            {kicker ? (
              <span className="lux-heading text-[0.44rem] text-pts-gold tracking-[0.6em] uppercase mb-5 block">
                {kicker}
              </span>
            ) : null}

            <h3 className="font-heading text-xl tracking-[0.14em] text-pts-gold-2 uppercase leading-[1.25] mb-6 max-w-xs font-light lg:text-2xl">
              {title}
            </h3>

            <p className="max-w-xs text-[0.63rem] uppercase tracking-[0.22em] leading-[2] text-pts-gold-2/80 transform translate-y-4 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:translate-y-0">
              {description}
            </p>

            <div className="mt-8 flex items-center gap-4 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
              <span className="lux-heading text-[0.44rem] tracking-[0.4em] text-pts-gold">Expand View</span>
              <div className="h-px w-12 bg-pts-gold/30" />
            </div>
          </div>
        </motion.div>
      </motion.article>

      {mounted && createPortal(modal, document.body)}
    </>
  );
}
