import type { Metadata, Viewport } from "next";
import { Cinzel, Tajawal } from "next/font/google";
import "./globals.css";
import { defaultMetadata } from "@/lib/seo";
import { ClientProviders } from "@/components/layout/ClientProviders";
import { heroMedia } from "@/lib/media";
import { site } from "@/lib/site";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  themeColor: "#333337",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "overlays-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/images/logo%20image/c8cee5ff-cee7-4268-98cd-771a25792a54.png`,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
    },
    sameAs: [site.social.instagram, site.social.linkedin],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var l = localStorage.getItem('pts-locale');
                  var next = l === 'ar' ? 'ar' : 'en';
                  document.documentElement.lang = next;
                  document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
                } catch (_) {}
              })();
            `,
          }}
        />
        <link
          rel="preload"
          as="image"
          href={heroMedia.poster}
          type="image/webp"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className={`${cinzel.variable} ${tajawal.variable} min-h-screen overflow-x-hidden bg-pts-bg font-body text-pts-parchment antialiased`}
        suppressHydrationWarning
      >
        <div className="grain-overlay" aria-hidden="true" />
        <div className="cinematic-vignette" aria-hidden="true" />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
