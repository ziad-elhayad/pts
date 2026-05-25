/**
 * Curated cinematic media for GERVAE.
 * All images are stored locally in /public/images/ for optimal performance and control.
 *
 * Folder structure:
 * /public/images/hero/ - Hero section images
 * /public/images/brand/ - Brand intro section images
 * /public/images/mice/ - MICE services images
 * /public/images/vip/ - VIP concierge services images
 * /public/images/destinations/ - Destination tiles
 * /public/images/testimonials/ - Testimonials backdrop
 * /public/images/cta/ - CTA section backdrops
 * /public/images/services/ - Service-specific images (concierge, medical, sports)
 */

const img = (path: string) => `/images/${path}`;

/** Full-screen hero: aviation / global travel mood + HD video (H.264). */
export const heroMedia = {
  poster: img("hero/hero-poster.webp"),
  /** Primary loop — balanced bitrate for web; 1080p variant. */
  videoHd: "/videos/hero-hd.mp4",
  /** Optional heavier UHD for large displays (loaded via media query where supported). */
  videoUhd: "/videos/hero-uhd.mp4",
} as const;

export const brandMedia = {
  intro: img("brand/brand-intro.webp"),
} as const;

/** MICE cards — corporate travel, venues, scale, DMC. */
export const miceServiceMedia = [
  {
    src: img("mice/meetings.webp"),
    alt: "Executive boardroom meeting",
  },
  {
    src: img("mice/incentives.webp"),
    alt: "Coastal incentive destination",
  },
  {
    src: img("mice/conferences.webp"),
    alt: "Grand cinematic conference hall",
  },
  {
    src: img("mice/exhibitions.webp"),
    alt: "Exhibition hall architecture",
  },
  {
    src: img("mice/executive-coordination.webp"),
    alt: "Aircraft wing over clouds at twilight",
  },
  {
    src: img("mice/destination-management.webp"),
    alt: "Highway through dramatic landscape",
  },
  {
    src: img("mice/global-reach.webp"),
    alt: "Dubai skyline representing global reach",
  },
] as const;

/** VIP pillars — lifestyle, dining, movement, access, events, bespoke journeys. */
export const vipServiceMedia = [
  {
    src: img("vip/luxury-hotels.webp"),
    alt: "Luxury hotel suite interior",
  },
  {
    src: img("vip/fine-dining.webp"),
    alt: "Fine dining table setting",
  },
  {
    src: img("vip/chauffeur.webp"),
    alt: "Executive chauffeured transport",
  },
  {
    src: img("vip/private-aviation.webp"),
    alt: "City skyline through aircraft window",
  },
  {
    src: img("vip/events.webp"),
    alt: "Evening gala lighting",
  },
  {
    src: img("vip/bespoke-journeys.webp"),
    alt: "Open road through dramatic landscape",
  },
] as const;

/** Editorial destination strip — cities, airports, night energy. */
export const destinationTiles = [
  { city: "London", src: img("destinations/london.webp"), alt: "London skyline at dusk" },
  { city: "Paris", src: img("destinations/paris.webp"), alt: "Paris cityscape" },
  { city: "Tokyo", src: img("destinations/tokyo.webp"), alt: "Tokyo urban night" },
  { city: "Dubai", src: img("destinations/dubai.webp"), alt: "Dubai skyline" },
  { city: "New York", src: img("destinations/new-york.webp"), alt: "New York at night" },
  { city: "Jeddah", src: img("destinations/jeddah.webp"), alt: "Coastal horizon at dusk" },
] as const;

/** Soft abstract / lounge mood behind testimonials (very low opacity in UI). */
export const testimonialBackdrop = img("testimonials/testimonials-bg.webp");

/** Final CTA band — airport / motion blur, dark cinematic. */
export const ctaBackdrop = img("cta/cta-bg.webp");