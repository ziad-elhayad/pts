"use client";

import { useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-pts-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center border-b border-pts-line/20">
        <div className="absolute inset-0 bg-gradient-to-b from-pts-deep to-pts-bg" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="lux-heading text-[0.5rem] text-pts-gold mb-6 tracking-[0.5em] uppercase">Contact Us</p>
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl tracking-[0.1em] text-pts-parchment uppercase leading-[1.05] mb-8">
            Get in Touch
          </h1>
          <p className="max-w-2xl mx-auto text-[0.65rem] sm:text-[0.75rem] uppercase tracking-[0.2em] text-pts-muted/70 leading-relaxed mb-10">
            Request a private consultation for MICE programs or VIP concierge services. Our team responds with a composed proposal tailored to your requirements.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-pts-deep/40 border border-pts-gold/30 p-12">
            <h2 className="font-heading text-3xl sm:text-4xl tracking-[0.1em] text-pts-parchment uppercase mb-8 text-center">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[0.7rem] uppercase tracking-[0.3em] text-pts-gold mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-6 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase tracking-[0.3em] text-pts-gold mb-3">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-6 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase tracking-[0.3em] text-pts-gold mb-3">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-6 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                  placeholder="+966 500 000 0000"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase tracking-[0.3em] text-pts-gold mb-3">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-6 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase tracking-[0.3em] text-pts-gold mb-3">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-pts-black/50 border border-pts-gold/20 px-6 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-pts-parchment placeholder-pts-muted/50 focus:border-pts-gold focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your requirements..."
                  required
                />
              </div>

              <MagneticButton
                type="submit"
                className="w-full border-pts-gold bg-pts-gold px-12 py-5 text-[0.75rem] font-bold text-pts-black uppercase tracking-[0.3em] hover:bg-pts-gold/90"
              >
                Send Message
              </MagneticButton>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
