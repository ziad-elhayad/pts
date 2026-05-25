"use client";

import { useState } from "react";
import Image from "next/image";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

type TabType = "patients" | "doctors" | "wellness";

const tabs: { key: TabType; label: string }[] = [
  { key: "patients", label: "Medical Tourism for Patients" },
  { key: "doctors", label: "Medical Travel for Doctors" },
  { key: "wellness", label: "Wellness & Recovery Tourism" },
];

const content = {
  patients: {
    title: "Medical Tourism for Patients",
    description:
      "Gervae medical tourism concierge service supports patients seeking high-quality medical care abroad. Assistance includes hospital and doctor selection, appointment scheduling, travel arrangements, accommodation, and full coordination throughout the treatment journey. The goal is a comfortable, safe, and professionally managed medical experience from start to end.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba88f0d55?auto=format&fit=crop&w=800&q=80",
  },
  doctors: {
    title: "Medical Travel for Doctors",
    description:
      "Gervae provides specialized concierge services for medical professionals traveling for conferences, training programs, and international collaborations. The team handles travel planning, accommodation, scheduling, and logistics to ensure doctors can focus entirely on professional development and networking opportunities.",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80",
  },
  wellness: {
    title: "Wellness & Recovery Tourism",
    description:
      "Gervae wellness and recovery tourism services are designed for individuals seeking relaxation, rehabilitation, or preventive health programs. Tailored wellness experiences include medical spas, rehabilitation centers, and recovery programs, combined with comfortable travel and accommodation arrangements for a truly restorative experience.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
  },
};

export default function MedicalTourismPage() {
  const [activeTab, setActiveTab] = useState<TabType>("patients");
  const [showEnquiry, setShowEnquiry] = useState(false);

  return (
    <div className="bg-pts-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center border-b border-pts-line/20">
        <div className="absolute inset-0 bg-gradient-to-b from-pts-deep to-pts-bg" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="lux-heading text-[0.5rem] text-pts-gold mb-6 tracking-[0.5em] uppercase">Medical Tourism</p>
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl tracking-[0.1em] text-pts-parchment uppercase leading-[1.05] mb-8">
            World-Class Healthcare, Seamlessly Delivered
          </h1>
          <p className="max-w-2xl mx-auto text-[0.65rem] sm:text-[0.75rem] uppercase tracking-[0.2em] text-pts-muted/70 leading-relaxed mb-10">
            Comprehensive medical tourism solutions connecting patients and professionals with premier healthcare destinations worldwide.
          </p>
          <MagneticButton
            onClick={() => setShowEnquiry(true)}
            className="border-pts-gold bg-pts-gold px-12 py-4 text-[0.65rem] font-bold text-pts-black uppercase tracking-[0.3em] hover:bg-pts-gold/90"
          >
            ENQUIRE NOW
          </MagneticButton>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="border-t border-pts-line bg-pts-black py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-12 text-center">
            <p className="lux-heading text-[0.5rem] text-pts-gold mb-4 tracking-[0.5em] uppercase">Three Pillars</p>
            <h2 className="font-heading text-3xl sm:text-5xl tracking-[0.1em] text-pts-parchment uppercase">
              Medical Tourism Services
            </h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={clsx(
                  "px-6 py-3 text-[0.6rem] uppercase tracking-[0.3em] transition-all duration-300 border",
                  activeTab === tab.key
                    ? "border-pts-gold bg-pts-gold/15 text-pts-gold"
                    : "border-pts-line/30 text-pts-muted/60 hover:border-pts-gold/40 hover:text-pts-parchment"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="space-y-6 order-2 lg:order-1"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="font-heading text-2xl sm:text-3xl uppercase tracking-[0.1em] text-pts-parchment">
                  {content[activeTab].title}
                </h3>
                <p className="text-[0.7rem] sm:text-[0.8rem] uppercase tracking-[0.2em] text-pts-muted/80 leading-loose">
                  {content[activeTab].description}
                </p>
                <div className="pt-4">
                  <MagneticButton
                    onClick={() => setShowEnquiry(true)}
                    className="border-pts-gold/50 bg-transparent px-8 py-3 text-[0.6rem] font-bold text-pts-gold uppercase tracking-[0.3em] hover:bg-pts-gold/10 hover:border-pts-gold transition-all duration-300"
                  >
                    Learn More
                  </MagneticButton>
                </div>
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={`img-${activeTab}`}
                className="relative h-[400px] lg:h-[500px] overflow-hidden rounded-sm border border-pts-gold/20 order-1 lg:order-2"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={content[activeTab].image}
                  alt={content[activeTab].title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pts-black/60 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      {showEnquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-pts-black/80 backdrop-blur-sm p-4">
          <div className="bg-pts-deep border border-pts-gold/30 max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-heading text-xl uppercase tracking-[0.1em] text-pts-parchment">
                Medical Tourism Enquiry
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
              Please fill out the form below and our medical tourism team will get back to you shortly.
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-[0.6rem] uppercase tracking-[0.3em] text-pts-gold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                  placeholder="Your full name"
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
                  Service Type
                </label>
                <select className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-pts-parchment focus:border-pts-gold focus:outline-none transition-colors">
                  <option value="">Select service type</option>
                  <option value="patients">Medical Tourism for Patients</option>
                  <option value="doctors">Medical Travel for Doctors</option>
                  <option value="wellness">Wellness & Recovery Tourism</option>
                </select>
              </div>
              <div>
                <label className="block text-[0.6rem] uppercase tracking-[0.3em] text-pts-gold mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-4 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your medical tourism requirements..."
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