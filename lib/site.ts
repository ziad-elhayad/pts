export const site = {
  name: "GERVAE",
  shortName: "GERVAE",
  tagline: "Crafting Executive Experiences Worldwide.",
  description:
    "Luxury corporate hospitality, elite MICE solutions, and VIP concierge for executives and international corporations—with a strategic presence in Saudi Arabia.",
  url: "https://pts-private-travel.com",
  email: "info@gervae.com",
  enquiryEmail: "info@gervae.com",
  phone: "+966 12 000 0000",
  whatsapp: "https://wa.me/966500000000",
  city: "Jeddah, Saudi Arabia",
  social: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
  },
} as const;

export const navItems = [
  { href: "/", key: "nav.home" as const },
  { href: "#about", key: "nav.about" as const, anchor: true },
  { href: "#services", key: "nav.services" as const, dropdown: true, anchor: true },
  { href: "#faq", key: "nav.faq" as const, anchor: true },
  { href: "/contact", key: "nav.contact" as const },
] as const;

export const serviceItems = [
  { href: "/services/concierge", key: "services.concierge" as const },
  { href: "/services/mice", key: "services.mice" as const },
  { href: "/services/medical-tourism", key: "services.medical" as const },
  { href: "/services/sports", key: "services.sports" as const },
  { href: "/services/visa", key: "services.section.visa.title" as const },
  { href: "/services/education", key: "services.section.education.title" as const },
] as const;
