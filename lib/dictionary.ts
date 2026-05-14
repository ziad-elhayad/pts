export type Locale = "en" | "ar";

export const dictionary = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.mice": "MICE",
    "nav.vip": "VIP Concierge",
    "nav.experiences": "Experiences",
    "nav.destinations": "Destinations",
    "nav.contact": "Contact",
    "nav.menu": "Menu",
    "nav.close": "Close",
    "cta.consult": "Request Consultation",
    "cta.begin": "Begin Your Experience",
    "cta.whatsapp": "WhatsApp",
    "cta.inquire": "Inquire",
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "lang.en": "English",
    "lang.ar": "العربية",
    "scroll": "Scroll",
    "hero.kicker": "Private Travel Services",
    "hero.tagline": "Crafting Executive Experiences Worldwide.",
    "brand.kicker": "OUR PHILOSOPHY",
    "brand.title": "The Art of Invisible Excellence",
    "brand.body":
      "At PTS, we orchestrate executive hospitality with absolute discretion—seamlessly aligning the highest global corporate standards with the authentic, world-renowned warmth of Saudi Arabian welcome. Every journey we craft is a silent statement of precision, ensuring that luxury is felt in every detail, yet never loud.",
    "mice.title": "MICE & corporate excellence",
    "mice.sub":
      "From intimate board settings to destination-wide programs, every touchpoint is composed with cinematic clarity.",
    "vip.title": "VIP concierge",
    "vip.sub":
      "A single relationship for reservations, movement, access, and the invisible details that define elite travel.",
    "exp.title": "Experiences",
    "exp.sub": "A curated glimpse into the world we build for our clients.",
    "lux.cta.title": "When the itinerary is the statement.",
    "lux.cta.body":
      "Share your objectives. We will return with a composed proposal—timing, partners, and atmosphere—calibrated to your standards.",
    "dest.title": "Destinations",
    "dest.sub":
      "The same calm precision in London, Paris, Tokyo, Dubai, New York—and home in Jeddah.",
    "testimonials.title": "Trusted voices",
    "testimonials.sub":
      "Discretion limits what we can print. These lines reflect the tone of relationships we protect.",
    "about.meta": "About",
    "mice.meta": "MICE Services",
    "vip.meta": "VIP Concierge",
    "exp.meta": "Experiences",
    "contact.meta": "Contact",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.about": "من نحن",
    "nav.mice": "خدمات MICE",
    "nav.vip": "الكونسيرج الفاخر",
    "nav.experiences": "التجارب",
    "nav.destinations": "الوجهات",
    "nav.contact": "تواصل",
    "nav.menu": "القائمة",
    "nav.close": "إغلاق",
    "cta.consult": "طلب استشارة",
    "cta.begin": "ابدأ تجربتك",
    "cta.whatsapp": "واتساب",
    "cta.inquire": "استفسار",
    "footer.rights": "جميع الحقوق محفوظة.",
    "footer.privacy": "الخصوصية",
    "footer.terms": "الشروط",
    "lang.en": "English",
    "lang.ar": "العربية",
    "scroll": "مرر للأسفل",
    "hero.kicker": "خدمات السفر الخاص",
    "hero.tagline": "نصوغ تجارب تنفيذية على مستوى العالم.",
    "brand.kicker": "فلسفتنا",
    "brand.title": "فن التميز الخفي",
    "brand.body":
      "في PTS، نقوم بتنسيق الضيافة التنفيذية بسرية مطلقة—حيث نمزج بسلاسة بين أرقى المعايير المؤسسية العالمية ودفء الضيافة السعودية الأصيلة. كل رحلة نصيغها هي بيان صامت من الدقة، مما يضمن أن تشعر بالفخامة في كل تفصيل، دون تكلف.",
    "mice.title": "MICE والتميز المؤسسي",
    "mice.sub":
      "من اجتماعات مجالس صغيرة إلى برامج بمستوى الوجهة، كل لحظة تُؤلّف بوضوح سينمائي.",
    "vip.title": "الكونسيرج الفاخر",
    "vip.sub":
      "علاقة واحدة للحجوزات، التنقل، الوصول، والتفاصيل غير المرئية التي تميّز السفر الراقي.",
    "exp.title": "التجارب",
    "exp.sub": "لمحة مختارة عن العالم الذي نصنعه لعملائنا.",
    "lux.cta.title": "عندما يكون البرنامج هو البيان.",
    "lux.cta.body":
      "شاركنا أهدافك. نعود بمقترح متكامل—التوقيت، الشركاء، والأجواء—بما يتوافق مع معاييرك.",
    "dest.title": "الوجهات",
    "dest.sub": "نفس الاتقان الهادئ في لندن وباريس وطوكيو ودبي ونيويورك—وجدة كبوابة المنزل.",
    "testimonials.title": "أصوات موثوقة",
    "testimonials.sub":
      "السرية تحدّ ما يمكن نشره. هذه الأسطر تعكس أجواء علاقات نحميها.",
    "about.meta": "من نحن",
    "mice.meta": "خدمات MICE",
    "vip.meta": "الكونسيرج الفاخر",
    "exp.meta": "التجارب",
    "contact.meta": "تواصل",
  },
} as const;

export type DictionaryKey = keyof (typeof dictionary)["en"];

export function t(locale: Locale, key: DictionaryKey): string {
  return dictionary[locale][key];
}
