import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import SitePageHero from "@/components/site/SitePageHero";
import SiteCTA from "@/components/site/SiteCTA";
import ContactClient from "./ContactClient";
import { getContactFormSettings } from "@/lib/contact-settings";
import { CANONICAL_ADDRESS, pageMetadata } from "@/lib/site-seo";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: "Contact",
  description: `Contactați Moodilier pentru o ofertă personalizată de mobilier premium la comandă. Atelier — ${CANONICAL_ADDRESS}.`,
  image: "/projects/villa-05/01.living.cover.webp",
});

export default async function ContactPage() {
  const settings = await getContactFormSettings();
  const tel = settings.phone.replace(/[^\d+]/g, "");

  return (
    <>
      <JsonLd type="contact" />
      <SitePageHero
        label="Contactează-ne"
        title="Contact"
        subtitle="Pentru orice întrebare sau solicitare de ofertă, ne poți contacta oricând — revenim cu un răspuns cât mai rapid posibil."
        bgImage="/projects/villa-05/01.living.cover.webp"
        overlayOpacity={0.55}
      />
      <ContactClient settings={settings} />
      <SiteCTA
        title="Portofoliu"
        body="Înainte de a ne scrie, poți explora proiectele finalizate — rezidențial, comercial și bucătării la comandă."
        primaryLabel="Sună-ne acum"
        primaryHref={tel ? `tel:${tel}` : "/contact"}
        secondaryLabel="Descoperă portofoliul"
        secondaryHref="/proiecte"
      />
    </>
  );
}
