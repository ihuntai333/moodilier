import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Inter, Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieBanner from "@/components/CookieBanner";
import ScrollReveal from "@/components/ScrollReveal";
import FacebookPixel from "@/components/FacebookPixel";
import { ThemeProvider } from "@/components/ThemeProvider";
import PageLoader from "@/components/PageLoader";
import { readDb } from "@/lib/db";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// ── next/font: fonts served from same domain, zero render blocking ──
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-body",
  preload: true,
});

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
  const googleVerify = settings?.googleSiteVerification?.trim();
  const fbDomainVerify = settings?.facebookDomainVerification?.trim();

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html
      lang="ro"
      suppressHydrationWarning
      className={cn(cormorant.variable, inter.variable, "font-sans", geist.variable)}
    >
      <head>
        {/* Resource hints for external services */}
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Verification meta tags */}
        {googleVerify && <meta name="google-site-verification" content={googleVerify} />}
        {fbDomainVerify && <meta name="facebook-domain-verification" content={fbDomainVerify} />}

        {/* Viewport & color scheme */}
        <meta name="theme-color" content="#1f1d1a" />
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var t=localStorage.getItem('moodilier-theme');
            if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}
            document.documentElement.setAttribute('data-theme',t);
          })();
        `}} />
        {/* Prevent page flash before loader: if loader not yet shown, cover with black immediately */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try{
              if(!sessionStorage.getItem('cl-shown')){
                document.documentElement.style.background='#080706';
              }
            }catch(e){}
          })();
        `}} />
      </head>
      <body>
        <ThemeProvider>
          {!isAdmin && <PageLoader />}
          {!isAdmin && <Header />}
          <main>{children}</main>
          {!isAdmin && <Footer />}
          {!isAdmin && <WhatsAppButton phone="40729555431" />}
          {!isAdmin && <CookieBanner />}
          {!isAdmin && <ScrollReveal />}
          {pixelId && <FacebookPixel pixelId={pixelId} />}

        {/* ── Analytics: deferred until page is interactive ── */}
        {ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}
            </Script>
          </>
        )}
        {pixelId && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
          </Script>
        )}
        </ThemeProvider>
      </body>
    </html>
  );
}
