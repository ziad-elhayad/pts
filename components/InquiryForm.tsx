"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { site } from "@/lib/site";
import { useLocale } from "@/contexts/LocaleContext";

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
};

const initial: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  interest: "MICE",
  message: "",
};

const copy = {
  en: {
    title: "Inquire with discretion",
    subtitle:
      "Share the contours of your program. Our team responds with a composed plan—not a template.",
    name: "Full name",
    company: "Company",
    email: "Email",
    phone: "Phone",
    interest: "Service interest",
    message: "Message",
    submit: "Submit inquiry",
    success: "Received. A concierge will respond shortly.",
    errors: {
      name: "Please enter your name.",
      email: "A valid email is required.",
      message: "A short message helps us prepare.",
    },
    interests: ["MICE", "VIP Concierge", "Executive travel", "Other"],
  },
  ar: {
    title: "تواصل بسرية تامة",
    subtitle: "صف ملامح برنامجك. يعود فريقنا بخطة مؤلفة—وليس قالبًا جاهزًا.",
    name: "الاسم الكامل",
    company: "الشركة",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    interest: "نوع الخدمة",
    message: "الرسالة",
    submit: "إرسال الطلب",
    success: "تم الاستلام. سيتواصل معك فريق الكونسيرج قريبًا.",
    errors: {
      name: "يرجى إدخال الاسم.",
      email: "بريد إلكتروني صالح مطلوب.",
      message: "رسالة موجزة تساعدنا على التحضير.",
    },
    interests: ["MICE", "الكونسيرج الفاخر", "سفر تنفيذي", "أخرى"],
  },
} as const;

function validate(values: FormState, locale: "en" | "ar") {
  const c = copy[locale];
  const next: Partial<Record<keyof FormState, string>> = {};
  if (!values.name.trim()) next.name = c.errors.name;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = c.errors.email;
  if (!values.message.trim()) next.message = c.errors.message;
  return next;
}

export function InquiryForm() {
  const { locale } = useLocale();
  const c = copy[locale];
  const [values, setValues] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(values, locale);
    setErrors(v);
    if (Object.keys(v).length) return;
    setSent(true);
  };

  return (
    <motion.form
      layout
      onSubmit={onSubmit}
      className="mx-auto max-w-2xl space-y-6 border border-pts-line bg-pts-black/30 p-8 shadow-[var(--shadow-lux)] backdrop-blur-md sm:p-10"
    >
      <div>
        <h2 className="font-heading text-2xl tracking-[0.14em] text-pts-parchment">{c.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-pts-muted">{c.subtitle}</p>
      </div>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.p
            key="success"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="border border-pts-gold/30 bg-pts-gold/10 px-4 py-3 text-sm text-pts-parchment"
          >
            {c.success}
          </motion.p>
        ) : (
          <motion.div
            key="fields"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-[0.65rem] uppercase tracking-[0.28em] text-pts-muted">
                {c.name}
                <input
                  className={clsx("input-lux mt-2", errors.name && "border-red-400/60")}
                  value={values.name}
                  onChange={(e) => setValues({ ...values, name: e.target.value })}
                  autoComplete="name"
                />
                {errors.name ? (
                  <span className="mt-1 block text-[0.65rem] text-red-300/90">{errors.name}</span>
                ) : null}
              </label>
              <label className="block text-[0.65rem] uppercase tracking-[0.28em] text-pts-muted">
                {c.company}
                <input
                  className="input-lux mt-2"
                  value={values.company}
                  onChange={(e) => setValues({ ...values, company: e.target.value })}
                  autoComplete="organization"
                />
              </label>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-[0.65rem] uppercase tracking-[0.28em] text-pts-muted">
                {c.email}
                <input
                  className={clsx("input-lux mt-2", errors.email && "border-red-400/60")}
                  type="email"
                  value={values.email}
                  onChange={(e) => setValues({ ...values, email: e.target.value })}
                  autoComplete="email"
                />
                {errors.email ? (
                  <span className="mt-1 block text-[0.65rem] text-red-300/90">{errors.email}</span>
                ) : null}
              </label>
              <label className="block text-[0.65rem] uppercase tracking-[0.28em] text-pts-muted">
                {c.phone}
                <input
                  className="input-lux mt-2"
                  value={values.phone}
                  onChange={(e) => setValues({ ...values, phone: e.target.value })}
                  autoComplete="tel"
                />
              </label>
            </div>
            <label className="block text-[0.65rem] uppercase tracking-[0.28em] text-pts-muted">
              {c.interest}
              <select
                className="input-lux mt-2"
                value={values.interest}
                onChange={(e) => setValues({ ...values, interest: e.target.value })}
              >
                {c.interests.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[0.65rem] uppercase tracking-[0.28em] text-pts-muted">
              {c.message}
              <textarea
                className={clsx("input-lux mt-2 min-h-[140px] resize-y", errors.message && "border-red-400/60")}
                value={values.message}
                onChange={(e) => setValues({ ...values, message: e.target.value })}
              />
              {errors.message ? (
                <span className="mt-1 block text-[0.65rem] text-red-300/90">{errors.message}</span>
              ) : null}
            </label>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="submit"
                className="lux-heading border border-pts-gold/50 bg-pts-gold/15 px-8 py-3 text-[0.68rem] text-pts-gold-2 transition hover:border-pts-gold hover:bg-pts-gold/25"
              >
                {c.submit}
              </button>
              <a
                href={site.whatsapp}
                className="lux-heading inline-flex items-center border border-pts-line px-8 py-3 text-[0.68rem] text-pts-parchment transition hover:border-pts-gold/50"
              >
                WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
