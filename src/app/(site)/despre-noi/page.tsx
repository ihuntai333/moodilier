import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import SitePageHero from "@/components/site/SitePageHero";
import SiteCTA from "@/components/site/SiteCTA";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Despre noi | Moodilier",
  description:
    "Povestea Moodilier — peste 10 ani de expertiză în producția de mobilier premium la comandă și amenajări interioare din București.",
  openGraph: {
    title: "Despre noi | Moodilier",
    description:
      "Atelier de mobilier premium la comandă din București — design contemporan, precizie tehnică și atenție impecabilă la detalii.",
    images: ["/images-despre-noi/living-02.jpg"],
  },
};

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
  { num: "1.200 mp", label: "Atelier propriu" },
  { num: "100%", label: "La comandă" },
];

const galleryImages = [
  {
    src: "/images-despre-noi/living-01.jpg",
    alt: "Living premium cu perete de marmură și mobilier la comandă",
  },
  {
    src: "/images-despre-noi/dormitor-01.jpg",
    alt: "Dormitor premium cu tăblie tapițată",
  },
  {
    src: "/images-despre-noi/living-02.jpg",
    alt: "Living contemporan cu candelabru",
  },
  {
    src: "/images-despre-noi/dressing-01.jpg",
    alt: "Dressing premium cu oglindă și iluminare LED",
  },
  {
    src: "/images-despre-noi/bucatarie-01.jpg",
    alt: "Bucătărie premium cu blat de marmură",
  },
];

const serviceTeasers = [
  {
    image: "/images-scraped/proiectare.jpg",
    title: "Proiectare & Design",
    href: "/servicii#proiectare",
  },
  {
    image: "/images-scraped/buc_giurgiu_1.jpg",
    title: "Mobilier la comandă",
    href: "/servicii#mobilier-la-comanda",
  },
  {
    image: "/images-scraped/carusel_office.jpg",
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
        subtitle="Mobilier premium la comandă — precizie, rafinament și pasiune pentru design interior."
        bgImage="/images-despre-noi/living-02.jpg"
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
              „The Art of Custom Furniture”
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
              În atelierul nostru, tehnologia modernă și măiestria execuției lucrează împreună
              pentru a crea mobilier personalizat cu linii curate, materiale premium și
              finisaje rafinate. Pe lângă producție, oferim prelucrări CNC, vopsitorie MDF și
              termoformare pentru proiecte rezidențiale și comerciale.
            </p>
            <p className="aw-body" style={{ margin: "0 auto 1.75rem", maxWidth: "58ch" }}>
              Moodilier înseamnă mai mult decât mobilier. Înseamnă pasiune pentru detalii,
              respect pentru calitate și dorința de a construi spații care inspiră prin
              eleganță, funcționalitate și autenticitate.
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

      <section aria-label="Galerie" style={{ marginTop: "1rem" }}>
        <div className="aw-mosaic">
          {galleryImages.map((img) => (
            <div key={img.src} className="aw-mosaic-item">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                unoptimized
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

      <section className="aw-collections aw-page-section">
        <div className="aw-container">
          <div className="aw-section-head">
            <p className="aw-label">Ce facem</p>
            <h2 className="aw-h2">De la proiectare la montaj</h2>
          </div>
          <div className="aw-collections-grid">
            {serviceTeasers.map((s) => (
              <Link key={s.title} href={s.href} className="aw-collection-card">
                <div className="aw-collection-media">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    unoptimized
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <h3>{s.title}</h3>
                <span className="aw-collection-link">Află mai mult →</span>
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
        title="Hai să lucrăm împreună"
        body="Spune-ne despre proiectul tău — transformăm viziunea în mobilier premium, executat în atelierul nostru."
      />
    </>
  );
}
