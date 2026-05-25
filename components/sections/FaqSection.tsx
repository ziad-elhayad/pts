"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What types of visas does Gervae assist with?",
    answer: "Short-term visas, long-term visas, education visas, business visas, and medical tourism visas. Each application is handled with precision and confidentiality.",
  },
  {
    question: "How long does the visa process take?",
    answer: "Processing times vary depending on the type of visa and the country's requirements. Gervae guides clients through each step to ensure applications are submitted efficiently, reducing delays.",
  },
  {
    question: "Do you guarantee visa approval?",
    answer: "While expert guidance and thorough application support is provided, visa approval ultimately depends on the embassy or consulate. The goal is to maximize chances with complete and accurate documentation.",
  },
  {
    question: "Can you assist with document preparation?",
    answer: "Absolutely. Gervae helps gather, review, and organize all necessary documents to ensure applications meet every requirement.",
  },
  {
    question: "Is my personal information secure with Gervae?",
    answer: "Yes. Confidentiality is a core part of the service. All data is handled with the utmost security and discretion.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="border-t border-pts-line bg-pts-black/25 py-20 px-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <p className="lux-heading text-[0.5rem] text-pts-gold mb-4 tracking-[0.5em] uppercase">FAQ</p>
          <h2 className="font-heading text-3xl sm:text-5xl tracking-[0.1em] text-pts-parchment uppercase">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-pts-gold/20 bg-pts-deep/30 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-pts-gold/5 transition-colors"
              >
                <span className="font-heading text-[0.7rem] sm:text-[0.8rem] uppercase tracking-[0.15em] text-pts-parchment pr-4">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-pts-gold text-xl"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-pts-muted/70 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
