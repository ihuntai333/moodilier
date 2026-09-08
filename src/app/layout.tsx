import type { Metadata } from "next";
import ConsentAnalytics from "@/components/ConsentAnalytics";
import ScrollToTopOnNavigate from "@/components/ScrollToTopOnNavigate";
import { getSiteChrome } from "@/lib/site-settings";
import { SITE_URL } from "@/lib/site-seo";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const chrome = await getSiteChrome();
  const defaultTitle =
    chrome.siteTitle ||
    "Moodilier — Mobilier la comandă premium în București";
  const description =
    chrome.metaDescription ||
    "Moodilier — atelier de mobilier premium la comandă din București. Bucătării, dressinguri, livinguri, dormitoare și spații comerciale executate impecabil.";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: defaultTitle,
      // Pages that already include "Moodilier" must use title.absolute
      template: "%s | Moodilier",
    },
    description,
    keywords: [
      "mobilier la comandă",
      "mobilier premium București",
      "bucătărie la comandă",
      "dressing la comandă",
      "mobilier living",
      "atelier mobilier București",
      "Moodilier",
    ],
    authors: [{ name: "Moodilier", url: SITE_URL }],
    creator: "Moodilier",
    publisher: "SC Moodilier SRL",
    // Canonical / og:url are set per-page via pageMetadata()
    openGraph: {
      type: "website",
      locale: "ro_RO",
      siteName: "Moodilier",
      title: defaultTitle,
      description,
      images: [
        {
          url: "/projects/villa-06/01.living.cover.webp",
          width: 1200,
          height: 630,
          alt: "Moodilier — mobilier premium la comandă",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
      images: ["/projects/villa-06/01.living.cover.webp"],
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
        {/* Block homepage paint until intro mounts — runs before body content */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;if(p!=="/"&&p!=="")return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;document.documentElement.classList.add("aw-intro-pending");document.documentElement.classList.remove("aw-intro-done");}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ScrollToTopOnNavigate />
        {children}
        <ConsentAnalytics ga4Id={chrome.ga4Id} pixelId={chrome.pixelId} />
      </body>
    </html>
  );
}
