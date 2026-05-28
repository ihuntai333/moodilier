import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieBanner from "@/components/CookieBanner";
import ScrollReveal from "@/components/ScrollReveal";
import FacebookPixel from "@/components/FacebookPixel";
import { readDb } from "@/lib/db";

function getSettings() {
  try {
    const db = readDb();
    return db.settings;
  } catch {
    return null;
  }
}

export const metadata: Metadata = {
  metadataBase: new URL("https://moodilier.ro"),
  title: {
    default: "Moodilier — Mobilier La Comandă Premium",
    template: "%s | Moodilier",
  },
  description:
    "Moodilier — atelier de mobilier premium la comandă din București. Bucătării, dressinguri, livinguri, dormitoare și spații comerciale executate impecabil.",
  keywords: ["mobilier la comanda", "mobilier premium", "bucatarie la comanda", "dressing", "living", "mobilier bucuresti"],
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://moodilier.ro",
    siteName: "Moodilier",
    images: [{ url: "/images-scraped/Moodelier-White-scaled.png" }],
  },
  icons: {
    icon: "/images-scraped/cropped-Untitled-design-8-192x192.png",
    apple: "/images-scraped/cropped-Untitled-design-8-180x180.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = getSettings();
  const ga4Id = settings?.ga4Id?.trim();
  const pixelId = settings?.pixelId?.trim();

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {ga4Id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`,
              }}
            />
          </>
        )}
        {pixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`,
            }}
          />
        )}
      </head>
      <body>
        {!isAdmin && <Header />}
        <main>{children}</main>
        {!isAdmin && <Footer />}
        {!isAdmin && <WhatsAppButton phone="40729555431" />}
        {!isAdmin && <CookieBanner />}
        {!isAdmin && <ScrollReveal />}
        {pixelId && <FacebookPixel pixelId={pixelId} />}
      </body>
    </html>
  );
}
