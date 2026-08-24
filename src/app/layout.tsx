import type { Metadata } from "next";
import ConsentAnalytics from "@/components/ConsentAnalytics";
import ScrollToTopOnNavigate from "@/components/ScrollToTopOnNavigate";
import { getSiteChrome } from "@/lib/site-settings";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const chrome = await getSiteChrome();
  return {
    metadataBase: new URL("https://moodilier.ro"),
    title: {
      default: chrome.siteTitle || "Moodilier — Mobilier La Comandă Premium",
      template: "%s | Moodilier",
    },
    description:
      chrome.metaDescription ||
      "Moodilier — atelier de mobilier premium la comandă din București. Bucătării, dressinguri, livinguri, dormitoare și spații comerciale executate impecabil.",
    keywords: [
      "mobilier la comandă",
      "mobilier premium București",
      "bucătărie la comandă",
      "dressing la comandă",
      "mobilier living",
      "atelier mobilier București",
      "Moodilier",
    ],
    authors: [{ name: "Moodilier", url: "https://moodilier.ro" }],
    creator: "Moodilier",
    publisher: "SC Moodilier SRL",
    alternates: { canonical: "https://moodilier.ro" },
    openGraph: {
      type: "website",
      locale: "ro_RO",
      url: "https://moodilier.ro",
      siteName: "Moodilier",
      title: chrome.siteTitle,
      description: chrome.metaDescription,
      images: [
        {
          url: "/projects/villa-06/01.cover.webp",
          width: 1200,
          height: 630,
          alt: "Moodilier — mobilier premium la comandă",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: chrome.siteTitle,
      description: chrome.metaDescription,
      images: ["/projects/villa-06/01.cover.webp"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: {
      google: chrome.googleSiteVerification || undefined,
      other: chrome.facebookDomainVerification
        ? { "facebook-domain-verification": chrome.facebookDomainVerification }
        : undefined,
    },
    icons: {
      icon: "/brand/logo-dark.png",
      apple: "/brand/logo-dark.png",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chrome = await getSiteChrome();

  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="geo.region" content="RO-B" />
        <meta name="geo.placename" content="București" />
      </head>
      <body>
        <ScrollToTopOnNavigate />
        {children}
        <ConsentAnalytics ga4Id={chrome.ga4Id} pixelId={chrome.pixelId} />
      </body>
    </html>
  );
}
