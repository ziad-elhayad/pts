"use client";

import { useState, useMemo, useCallback } from "react";
import { t, type DictionaryKey } from "@/lib/dictionary";
import { useLocale } from "@/contexts/LocaleContext";

export function FaqSection() {
  const { locale } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = useMemo(() => [
    { question: t(locale, "faq.q1" as DictionaryKey), answer: t(locale, "faq.a1" as DictionaryKey) },
    { question: t(locale, "faq.q2" as DictionaryKey), answer: t(locale, "faq.a2" as DictionaryKey) },
    { question: t(locale, "faq.q3" as DictionaryKey), answer: t(locale, "faq.a3" as DictionaryKey) },
    { question: t(locale, "faq.q4" as DictionaryKey), answer: t(locale, "faq.a4" as DictionaryKey) },
    { question: t(locale, "faq.q5" as DictionaryKey), answer: t(locale, "faq.a5" as DictionaryKey) },
  ], [locale]);

  const toggleFaq = useCallback((index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  }, [openIndex]);

  return (
    <section id="faq" className="border-t border-pts-line bg-pts-black/25 py-20 px-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <p className="lux-heading text-[0.5rem] text-pts-gold mb-4 tracking-[0.5em] uppercase">{t(locale, "nav.faq" as DictionaryKey)}</p>
          <h2 className="font-heading text-3xl sm:text-5xl tracking-[0.1em] text-pts-parchment uppercase">
            {t(locale, "faq.title" as DictionaryKey)}
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
                <span className="font-heading uppercase tracking-[0.15em] text-pts-parchment pr-4 text-[0.7rem] sm:text-[0.8rem]">
                  {faq.question}
                </span>
                <span
                  className={clsx(
                    "text-xl text-pts-gold transition-transform duration-300",
                    openIndex === index && "rotate-45"
                  )}
                >
                  +
                </span>
              </button>
              <div
                className={clsx(
                  "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                  openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-5 pt-2">
                    <p className="text-[0.65rem] uppercase tracking-[0.2em] text-pts-muted/70 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function clsx(...args: Array<string | false>) {
  return args.filter(Boolean).join(" ");
}
