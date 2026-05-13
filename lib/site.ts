export const site = {
  name: "PTS — Private Travel Services",
  shortName: "PTS",
  tagline: "Crafting Executive Experiences Worldwide.",
  description:
    "Luxury corporate hospitality, elite MICE solutions, and VIP concierge for executives and international corporations—with a strategic presence in Saudi Arabia.",
  url: "https://pts-private-travel.com",
  email: "concierge@pts-private-travel.com",
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
  { href: "/about", key: "nav.about" as const },
  { href: "/mice", key: "nav.mice" as const },
  { href: "/vip-concierge", key: "nav.vip" as const },
  { href: "/experiences", key: "nav.experiences" as const },
  { href: "/contact", key: "nav.contact" as const },
] as const;
