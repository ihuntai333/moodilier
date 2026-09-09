import type { Metadata } from "next";
import SitePageHero from "@/components/site/SitePageHero";
import SiteCTA from "@/components/site/SiteCTA";
import JsonLd from "@/components/JsonLd";
import ServiciiClient from "./ServiciiClient";
import { pageMetadata } from "@/lib/site-seo";

export const metadata: Metadata = pageMetadata({
  path: "/servicii",
  title: "Servicii mobilier la comandă",
  description:
    "Servicii complete Moodilier: proiectare 3D, mobilier la comandă, perdele și draperii, prelucrare CNC, vopsitorie MDF și termoformare — atelier propriu în București.",
  image: "/projects/villa-01/01.bucatarii.cover.webp",
});

export default function ServiciiPage() {
  return (
    <>
      <JsonLd type="service" />

      <SitePageHero
        title="Servicii"
        subtitle="Design interior, mobilier premium la comandă și prelucrări specializate — totul în atelierul nostru din București."
        bgImage="/projects/villa-01/01.bucatarii.cover.webp"
        overlayOpacity={0.48}
      />

      <ServiciiClient />

      <SiteCTA
        title="Transformăm viziunea ta în mobilier premium"
        body="Spune-ne despre proiectul tău — îți oferim consultanță și o propunere personalizată."
      />
    </>
  );
}
