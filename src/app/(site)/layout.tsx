import type { ReactNode } from "react";
import Script from "next/script";
import { Playfair_Display, Montserrat } from "next/font/google";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import SiteScrollProgress from "@/components/site/SiteScrollProgress";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieBanner from "@/components/CookieBanner";
import { getSiteChrome } from "@/lib/site-settings";
import "@/styles/site.css";

export const revalidate = 60;

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--awards-font-display",
  preload: true,
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--awards-font-body",
  preload: true,
});

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const chrome = await getSiteChrome();

  return (
    <div className={`awards-root ${playfair.variable} ${montserrat.variable}`}>
      <SiteNav
        brandName={chrome.brandName}
        logoUrl={chrome.logoUrl}
        links={chrome.headerMenu}
        ctaLabel={chrome.ctaLabel}
        ctaHref={chrome.ctaHref}
      />
      <SiteScrollProgress />
      {children}
      <SiteFooter chrome={chrome} />
      <WhatsAppButton phone={chrome.whatsapp || "40729555431"} />
      <CookieBanner />
      <Script src="/editor.js" strategy="afterInteractive" />
    </div>
  );
}
