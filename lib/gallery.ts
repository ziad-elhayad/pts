export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
};

export const galleryItems: readonly GalleryItem[] = [
  {
    src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=2400&q=88",
    alt: "Private aviation lounge",
    caption: "Aviation & arrivals",
  },
  {
    src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2400&q=88",
    alt: "Evening hospitality",
    caption: "Evening hospitality",
  },
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=88",
    alt: "Fine dining",
    caption: "Culinary programs",
  },
  {
    src: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&w=2400&q=88",
    alt: "Curated itineraries",
    caption: "Curated itineraries",
  },
  {
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2400&q=88",
    alt: "Executive workspace",
    caption: "Executive suites",
  },
  {
    src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2400&q=88",
    alt: "Boardroom detail",
    caption: "Boardroom detail",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2400&q=88",
    alt: "Corporate gathering",
    caption: "Corporate gatherings",
  },
  {
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=2400&q=88",
    alt: "Event lighting",
    caption: "Event lighting design",
  },
] as const;
