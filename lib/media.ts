/**
 * Curated cinematic media for PTS. Unsplash URLs use auto=format for web-friendly delivery.
 * Replace with self-hosted / CDN assets in production for full control.
 */

const img = (path: string, w: number, q = 65) =>
  `https://images.unsplash.com/${path}?auto=format&fm=webp&fit=crop&w=${w}&q=${q}`;

/** Full-screen hero: aviation / global travel mood + HD video (H.264). */
export const heroMedia = {
  poster: img("photo-1436491865332-7a61a109cc05", 2400),
  /** Primary loop — balanced bitrate for web; 1080p variant. */
  videoHd:
    "https://videos.pexels.com/video-files/1448735/1448735-hd_1920_1080_25fps.mp4",
  /** Optional heavier UHD for large displays (loaded via media query where supported). */
  videoUhd:
    "https://videos.pexels.com/video-files/1448735/1448735-uhd_2560_1440_25fps.mp4",
} as const;

export const brandMedia = {
  intro: img("photo-1564501049412-61c2a3083791", 1800),
} as const;

/** MICE cards — corporate travel, venues, scale, DMC. */
export const miceServiceMedia = [
  {
    src: img("photo-1521737604893-d14cc237f11d", 1200),
    alt: "Executive boardroom meeting",
  },
  {
    src: img("photo-1507525428034-b723cf961d3e", 1200),
    alt: "Coastal incentive destination",
  },
  {
    src: img("photo-1505373877841-8d25f7d46678", 1200),
    alt: "Grand cinematic conference hall",
  },
  {
    src: img("photo-1565034946487-077786996e27", 1200),
    alt: "Exhibition hall architecture",
  },
  {
    src: img("photo-1436491865332-7a61a109cc05", 1200),
    alt: "Aircraft wing over clouds at twilight",
  },
  {
    src: img("photo-1469854523086-cc02fe5d8800", 1200),
    alt: "Highway through dramatic landscape",
  },
  {
    src: img("photo-1512453979798-0ea884933476", 1200),
    alt: "Dubai skyline representing global reach",
  },
] as const;

/** VIP pillars — lifestyle, dining, movement, access, events, bespoke journeys. */
export const vipServiceMedia = [
  {
    src: img("photo-1564501049412-61c2a3083791", 1200),
    alt: "Luxury hotel suite interior",
  },
  {
    src: img("photo-1414235077428-338989a2e8c0", 1200),
    alt: "Fine dining table setting",
  },
  {
    src: img("photo-1544620347-c4fd4a3d5957", 1200),
    alt: "Executive chauffeured transport",
  },
  {
    src: img("photo-1519677100203-a0e668c92439", 1200),
    alt: "City skyline through aircraft window",
  },
  {
    src: img("photo-1511578314322-379afb476865", 1200),
    alt: "Evening gala lighting",
  },
  {
    src: img("photo-1469854523086-cc02fe5d8800", 1200),
    alt: "Open road through dramatic landscape",
  },
] as const;

/** Editorial destination strip — cities, airports, night energy. */
export const destinationTiles = [
  { city: "London", src: img("photo-1513635269975-596ae1548d6b", 1400), alt: "London skyline at dusk" },
  { city: "Paris", src: img("photo-1502602898657-c3fa9fe6a7de", 1400), alt: "Paris cityscape" },
  { city: "Tokyo", src: img("photo-1549693578-43e8925074d2", 1400), alt: "Tokyo urban night" },
  { city: "Dubai", src: img("photo-1512453979798-0ea884933476", 1400), alt: "Dubai skyline" },
  { city: "New York", src: img("photo-1514525253161-7a46d19cd819", 1400), alt: "New York at night" },
  { city: "Jeddah", src: img("photo-1507525428034-b723cf961d3e", 1400), alt: "Coastal horizon at dusk" },
] as const;

/** Soft abstract / lounge mood behind testimonials (very low opacity in UI). */
export const testimonialBackdrop = img("photo-1514933651103-005eec06f4ab", 2000);

/** Final CTA band — airport / motion blur, dark cinematic. */
export const ctaBackdrop = img("photo-1436491865332-7a61a109cc05", 2200);
