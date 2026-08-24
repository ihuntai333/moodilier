"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import FacebookPixel from "@/components/FacebookPixel";

type Consents = {
  necessary: boolean;
  statistics: boolean;
  marketing: boolean;
};

function readConsents(): Consents | null {
  try {
    const raw = localStorage.getItem("moodilier-cookie-consent");
    if (!raw) return null;
    return JSON.parse(raw) as Consents;
  } catch {
    return null;
  }
}

/**
 * Loads GA4 / Meta Pixel only after cookie consent (GDPR).
 * IDs come from Admin → Setări (Supabase).
 */
export default function ConsentAnalytics({
  ga4Id,
  pixelId,
}: {
  ga4Id?: string;
  pixelId?: string;
}) {
  const [consents, setConsents] = useState<Consents | null>(null);

  useEffect(() => {
    setConsents(readConsents());
    const onConsent = () => setConsents(readConsents());
    window.addEventListener("moodilier-consent", onConsent);
    window.addEventListener("storage", onConsent);
    return () => {
      window.removeEventListener("moodilier-consent", onConsent);
      window.removeEventListener("storage", onConsent);
    };
  }, []);

  if (!consents) return null;

  const ga = ga4Id?.trim();
  const pixel = pixelId?.trim();

  return (
    <>
      {consents.statistics && ga ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}

      {consents.marketing && pixel ? (
        <>
          <FacebookPixel pixelId={pixel} />
          <Script id="fb-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
