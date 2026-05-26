import type { Metadata } from "next";
import { site } from "./site";

const ogImage = "/og-pts.svg";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    "MICE",
    "VIP concierge",
    "corporate travel",
    "luxury hospitality",
    "Jeddah",
    "Saudi Arabia",
    "executive travel",
  ],
  authors: [{ name: site.shortName }],
  alternates: {
    canonical: site.url,
    languages: {
      en: site.url,
      ar: `${site.url}/?lang=ar`,
    },
  },
  category: "travel",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_SA"],
    siteName: site.shortName,
    title: site.name,
    description: site.description,
    url: site.url,
    images: [{ url: ogImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: [ogImage],
  },
  robots: { index: true, follow: true },
};
