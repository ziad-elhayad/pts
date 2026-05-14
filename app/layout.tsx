import type { Metadata, Viewport } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";
import { defaultMetadata } from "@/lib/seo";
import { ClientProviders } from "@/components/layout/ClientProviders";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  themeColor: "#333337",
  width: "device-width",
  initialScale: 1,
  // Prevents address bar show/hide from resizing the layout and re-firing ScrollTrigger
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.cdnfonts.com/css/glacial-indifference"
        />
      </head>
      <body
        className={`${cinzel.variable} min-h-screen bg-pts-bg font-body text-pts-parchment antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <div className="grain-overlay" aria-hidden="true" />
        <div className="cinematic-vignette" aria-hidden="true" />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
