"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/animations/PageTransition";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import Image from "next/image";

const PHILOSOPHY = [
  {
    title: "Orchestration",
    text: "We don't just manage travel; we compose itineraries as editorial narratives—timing, tone, and access calibrated to the principal's rhythm.",
  },
  {
    title: "Regional Fluency",
    text: "With a strategic emphasis on Saudi Arabia and Jeddah, we pair local mastery with global standards vetted over years of discreet service.",
  },
  {
    title: "Exclusivity",
    text: "Access is not a checklist—it's a relationship. We provide the invisible infrastructure that makes the impossible routine.",
  },
];

export function AboutPage() {
  return (
    <PageTransition>
      <div className="bg-pts-bg min-h-screen">
        
        {/* Cinematic Manifesto Header */}
        <section className="relative h-[80vh] w-full overflow-hidden border-b border-pts-line/5">
          <ParallaxImage
            src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=2000&q=80"
            alt="Cinematic city horizon"
            className="h-full w-full"
            intensity={15}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pts-bg via-pts-bg/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-10 sm:p-20">
            <div className="max-w-[1400px] mx-auto w-full">
               <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 0.6, y: 0 }}
                 className="lux-heading text-[0.6rem] text-pts-gold mb-6 tracking-[0.5em] uppercase"
               >
                 THE MANIFESTO
               </motion.p>
               <motion.h1 
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="font-heading text-3xl sm:text-5xl lg:text-6xl tracking-[0.1em] text-pts-parchment uppercase leading-[1.05] max-w-5xl"
               >
                 A composed presence<br/>across capitals.
               </motion.h1>
            </div>
          </div>
        </section>

        {/* Philosophy Grid - White Desert Style */}
        <section className="py-32 px-10 border-b border-pts-line/5">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
             {PHILOSOPHY.map((item, i) => (
               <div key={item.title} className="flex flex-col">
                  <span className="lux-heading text-[0.5rem] text-pts-gold mb-8 opacity-40">
                    0{i + 1}
                    {' // '}
                    {item.title}
                  </span>
                  <p className="text-[0.8rem] uppercase tracking-[0.25em] leading-loose text-pts-muted/70">
                    {item.text}
                  </p>
               </div>
             ))}
          </div>
        </section>

        {/* Saudi Arabia Focus - Full Screen Visual */}
        <section className="relative h-screen w-full flex items-center overflow-hidden">
           <div className="absolute inset-0 z-0">
             <Image 
               src="https://images.unsplash.com/photo-1505761671935-60b3a742bccd?auto=format&fit=crop&w=2000&q=80"
               alt="Jeddah focus"
               fill
               className="object-cover brightness-[0.4]"
             />
             <div className="absolute inset-0 bg-pts-bg/30 backdrop-blur-[2px]" />
           </div>
           
           <div className="relative z-10 px-10 sm:px-20 max-w-[1400px] mx-auto w-full">
              <p className="lux-heading text-[0.55rem] text-pts-gold mb-8 tracking-[0.6em] uppercase">Strategic Pivot</p>
              <h2 className="font-heading text-3xl sm:text-5xl tracking-[0.1em] text-pts-parchment uppercase leading-tight max-w-3xl">
                 Regional fluency<br/>Global Standards.
              </h2>
              <div className="mt-12 h-px w-32 bg-pts-gold/30" />
              <p className="mt-12 max-w-xl text-[0.75rem] uppercase tracking-[0.2em] leading-relaxed text-pts-muted/80">
                 Our expertise in Saudi Arabia, particularly Jeddah and Riyadh, allows us to bridge the gap between local nuances and international executive expectations.
              </p>
           </div>
        </section>

        {/* Partnerships - Minimalist Grid */}
        <section className="py-32 px-10 bg-pts-black/5">
           <div className="max-w-[1400px] mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
                 <h2 className="font-heading text-xl tracking-[0.2em] text-pts-parchment uppercase">International Partnerships</h2>
                 <p className="max-w-xs text-[0.55rem] uppercase tracking-[0.3em] text-pts-muted/40 text-right">Continuity is more valuable than volume.</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-pts-line/10 border border-pts-line/10">
                 {["Aviation", "Hospitality", "Security", "Production"].map(item => (
                   <div key={item} className="bg-pts-bg p-16 flex items-center justify-center group hover:bg-pts-gold/5 transition-colors">
                      <span className="lux-heading text-[0.6rem] tracking-[0.5em] text-pts-muted/50 group-hover:text-pts-gold transition-colors">{item}</span>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Call to Action */}
        <section className="py-40 text-center px-10 border-t border-pts-line/5">
           <p className="lux-heading text-[0.55rem] text-pts-gold mb-10 tracking-[0.8em] uppercase">Inquire about partnership</p>
           <button className="lux-heading border border-pts-line/40 px-12 py-6 text-[0.7rem] text-pts-parchment tracking-[0.5em] hover:bg-pts-parchment hover:text-pts-bg transition-all uppercase">
             Start the Narrative
           </button>
        </section>

      </div>
    </PageTransition>
  );
}
