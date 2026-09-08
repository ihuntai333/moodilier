import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import SitePageHero from "@/components/site/SitePageHero";
import SiteCTA from "@/components/site/SiteCTA";
import JsonLd from "@/components/JsonLd";

import { pageMetadata } from "@/lib/site-seo";

export const metadata: Metadata = pageMetadata({
  path: "/despre-noi",
  title: "Despre Moodilier | Mobilier premium la comandă",
  description:
    "Povestea Moodilier — peste 10 ani de expertiză în producția de mobilier premium la comandă și amenajări interioare din București.",
  image: "/projects/villa-06/01.living.cover.webp",
});

const values = [
  {
    title: "Precizie",
    desc: "Fiecare detaliu este măsurat, verificat și executat cu precizie milimetrică.",
  },
  {
    title: "Calitate",
    desc: "Materiale certificate, hardware european și finisaje de înaltă clasă.",
  },
  {
    title: "Inovație",
    desc: "Tehnologie CNC modernă îmbinată cu design contemporan pentru rezultate unice.",
  },
  {
    title: "Pasiune",
    desc: "Fiecare proiect este tratat ca și cum ar fi propriul nostru spațiu de locuit.",
  },
];

const stats = [
  { num: "10+", label: "Ani experiență" },
  { num: "200+", label: "Proiecte finalizate" },
  { num: "2.000 mp", label: "Atelier propriu" },
  { num: "100%", label: "La comandă" },
];

/** Project photos under the story — brief: „sub descriere câteva poze din proiecte”. */
const galleryImages = [
  {
    src: "/projects/villa-06/01.living.cover.webp",
    alt: "Villa 06 — living cu mobilier la comandă Moodilier",
  },
  {
    src: "/projects/villa-03/01.living.cover.webp",
    alt: "Villa 03 — living contemporan",
  },
  {
    src: "/projects/villa-01/01.bucatarii.cover.webp",
    alt: "Villa 01 — bucătărie premium",
  },
  {
    src: "/projects/villa-05/01.living.cover.webp",
    alt: "Villa 05 — amenajare interioară",
  },
  {
    src: "/projects/villa-04/01.altele.cover.webp",
    alt: "Villa 04 — detalii și finisaje",
  },
];

const serviceTeasers = [
  {
    image: "/projects/villa-06/01.living.cover.webp",
    title: "Proiectare & Design",
    href: "/servicii#proiectare",
  },
  {
    image: "/projects/villa-01/01.bucatarii.cover.webp",
    title: "Mobilier la comandă",
    href: "/servicii#mobilier-la-comanda",
  },
  {
    image: "/projects/villa-02/01.altele.cover.webp",
    title: "Spații comerciale",
    href: "/servicii#mobilier-la-comanda",
  },
];

export default function DespreNoiPage() {
  return (
    <>
      <JsonLd type="about" />

      <SitePageHero
        label="Despre noi"
        title="The Art of Custom Furniture"
        subtitle="Precizie, rafinament și pasiune pentru design interior — executat în atelierul din București."
        bgImage="/projects/villa-06/01.living.cover.webp"
        overlayOpacity={0.5}
      />

      <section className="aw-about">
        <div className="aw-container">
          <div
            className="aw-about-copy"
            style={{ maxWidth: "52rem", margin: "0 auto", textAlign: "center" }}
          >
            <p className="aw-label" style={{ margin: "0 auto 1.25rem" }}>
              Povestea noastră
            </p>
            <h2 className="aw-h2" style={{ marginBottom: "1.5rem" }}>
              Spații cu emoție, echilibru și identitate
            </h2>
            <p className="aw-body" style={{ margin: "0 auto 1.1rem", maxWidth: "58ch" }}>
              La Moodilier credem că mobilierul premium nu înseamnă doar obiecte bine
              executate, ci spații care transmit emoție, echilibru și identitate. Fiecare
              proiect începe cu o idee, o nevoie sau o viziune, iar rolul nostru este să o
              transformăm într-un rezultat autentic, construit în jurul stilului de viață al
              fiecărui client.
            </p>
            <p className="aw-body" style={{ margin: "0 auto 1.1rem", maxWidth: "58ch" }}>
              Cu peste 10 ani de experiență în producția de mobilier la comandă și amenajări
              interioare premium, am dezvoltat un proces complet care îmbină designul
              contemporan, precizia tehnică și atenția impecabilă la detalii. De la concept și
              proiectare, până la execuție, finisare și montaj, fiecare etapă este gestionată
              intern pentru a garanta calitate și coerență în fiecare proiect.
            </p>
            <p className="aw-body" style={{ margin: "0 auto 1.1rem", maxWidth: "58ch" }}>
              În atelierul nostru de 2.000 mp, tehnologia modernă și măiestria execuției
              lucrează împreună pentru a crea mobilier personalizat cu linii curate, materiale
              premium și finisaje rafinate. Pe lângă producție, oferim prelucrări CNC de înaltă
              precizie, vopsitorie MDF premium și termoformare pentru proiecte rezidențiale și
              comerciale.
            </p>
            <p className="aw-body" style={{ margin: "0 auto 1.1rem", maxWidth: "58ch" }}>
              Moodilier înseamnă mai mult decât mobilier. Înseamnă pasiune pentru detalii,
              respect pentru calitate și dorința de a construi spații care inspiră prin
              eleganță, funcționalitate și autenticitate.
            </p>
            <p className="aw-body" style={{ margin: "0 auto 1.75rem", maxWidth: "58ch" }}>
              Fiecare proiect pe care îl realizăm reflectă aceeași filozofie: design bine
              gândit, execuție impecabilă și materiale alese fără compromisuri. Pentru noi,
              adevăratul lux stă în calitatea lucrurilor create corect și în experiența pe
              care acestea o oferă zi de zi.
            </p>
            <Link href="/servicii" className="aw-btn-ghost aw-link-slide">
              Descoperă serviciile →
            </Link>
          </div>

          <div className="aw-stats aw-about-stats" style={{ marginTop: "3rem" }}>
            {stats.map((s) => (
              <div key={s.label}>
                <p className="aw-stat-num">{s.num}</p>
                <p className="aw-stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="aw-page-section aw-about-gallery" aria-labelledby="aw-about-gallery">
        <div className="aw-container">
          <div className="aw-section-head">
            <p className="aw-label">Portofoliu</p>
            <h2 id="aw-about-gallery" className="aw-h2">
              Din proiectele noastre
            </h2>
            <p className="aw-body" style={{ margin: "0.85rem auto 0", maxWidth: "42ch" }}>
              Câteva imagini din execuțiile Moodilier — mobilier la comandă, integrat în spații
              rezidențiale premium.
            </p>
          </div>
        </div>
        <div className="aw-mosaic">
          {galleryImages.map((img) => (
            <div key={img.src} className="aw-mosaic-item">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 700px) 100vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="aw-page-section aw-page-section--gray">
        <div className="aw-container">
          <div className="aw-section-head">
            <p className="aw-label">Valorile noastre</p>
            <h2 className="aw-h2">Principiile care ghidează fiecare proiect</h2>
          </div>
          <div className="aw-values-grid">
            {values.map((v) => (
              <div key={v.title} className="aw-value">
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="aw-page-section aw-about-services">
        <div className="aw-container">
          <div className="aw-section-head">
            <p className="aw-label">Ce facem</p>
            <h2 className="aw-h2">De la proiectare la montaj</h2>
          </div>
          <div className="aw-about-services-grid">
            {serviceTeasers.map((s) => (
              <Link key={s.title} href={s.href} className="aw-about-service-card">
                <div className="aw-about-service-media">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <h3>{s.title}</h3>
                <span className="aw-about-service-link">Află mai mult →</span>
              </Link>
            ))}
          </div>
          <div className="aw-section-foot">
            <Link href="/servicii" className="aw-btn aw-btn-outline-dark aw-btn-fill">
              Toate serviciile
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <SiteCTA
        title="Transformăm viziunea ta în mobilier premium"
        body="Spune-ne despre proiectul tău — transformăm viziunea în mobilier premium, executat în atelierul nostru."
      />
    </>
  );
}
