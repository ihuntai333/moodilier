import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import SitePageHero from "@/components/site/SitePageHero";
import SiteCTA from "@/components/site/SiteCTA";
import ContactClient from "./ContactClient";
import { getContactFormSettings } from "@/lib/contact-settings";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact | Moodilier",
  description:
    "Contactați Moodilier pentru o ofertă personalizată de mobilier premium la comandă. Atelier la Bulevardul Basarabia 256, Sector 3, București.",
  openGraph: {
    title: "Contact | Moodilier",
    description:
      "Solicită o ofertă de mobilier la comandă. Răspundem în maxim 24 de ore. Atelier — Blv. Basarabia 256, București.",
    images: ["/images-scraped/executie_sediu-office15.jpg"],
  },
};

export default async function ContactPage() {
  const settings = await getContactFormSettings();
  const tel = settings.phone.replace(/[^\d+]/g, "");

  return (
    <>
      <JsonLd type="contact" />
      <SitePageHero
        label="Contactează-ne"
        title="Contact"
        subtitle="Suntem la dispoziția ta pentru orice întrebare sau solicitare de ofertă. Răspundem în maxim 24 de ore."
        bgImage="/images-scraped/executie_sediu-office15.jpg"
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
