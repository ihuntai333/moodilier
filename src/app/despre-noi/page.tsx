import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Despre noi | Moodilier",
  description:
    "Aflați povestea Moodilier — peste 10 ani de expertiză în producția de mobilier premium la comandă și amenajări interioare din București.",
};

const values = [
  {
    title: "Precizie",
    desc: "Fiecare piesă de mobilier este produsă cu toleranțe minime, respectând cu strictețe dimensiunile și detaliile tehnice din proiect.",
    num: "01",
  },
  {
    title: "Calitate",
    desc: "Folosim exclusiv materiale premium de la furnizori certificați — Egger, Blum, Häfele, Corian — pentru a garanta durabilitate și estetică pe termen lung.",
    num: "02",
  },
  {
    title: "Inovație",
    desc: "Investim constant în tehnologie modernă de prelucrare CNC și în pregătirea echipei noastre pentru a livra soluții contemporane, funcționale și elegante.",
    num: "03",
  },
  {
    title: "Pasiune",
    desc: "Mobilierul nu este doar un produs — este expresia personalității tale. Aproachul nostru este mereu uman, empatic și dedicat excelenței.",
    num: "04",
  },
];

const servicesSummary = [
  {
    title: "Servicii de proiectare",
    desc: "De la concept și mood board la vizualizări 3D și proiect tehnic complet. Designul este fundamentul oricărui proiect reușit.",
    href: "/servicii",
    num: "01",
  },
  {
    title: "Mobilier la comandă",
    desc: "Bucătării, dressinguri, livinguri, dormitoare — executate integral în atelierul propriu cu materiale de primă clasă.",
    href: "/servicii",
    num: "02",
  },
  {
    title: "Moodilier Store",
    desc: "Import selecționat de mobilier premium de la designeri consacrați din Italia, Danemarca și Grecia pentru completarea amenajărilor.",
    href: "/servicii",
    num: "03",
  },
];

const galleryImages = [
  {
    src: "/images-scraped/apptown_exec_28.jpg",
    alt: "Proiect AppTown — mobilier premium la comandă",
  },
  {
    src: "/images-scraped/Mogosoaia_01.jpg",
    alt: "Casa Mogoșoaia — amenajare interioară",
  },
  {
    src: "/images-scraped/vila_corbeanca_exec_living_4.jpg",
    alt: "Vila Corbeanca — living la comandă",
  },
];

export default function DespreNoiPage() {
  return (
    <>
      {/* ============== PAGE HERO ============== */}
      <PageHero
        label="Despre noi"
        title="Despre noi"
        subtitle="Cu peste 10 ani de experiență în producția de mobilier la comandă, creăm spații care transmit emoție, echilibru și identitate."
        bgImage="/images-scraped/mobilier-premium-01.webp"
        overlayOpacity={0.65}
      />

      {/* ============== ABOUT — SECTION 1 ============== */}
      <section className="section">
        <div className="container">
          <div className="about-grid">
            {/* Text Left */}
            <div className="reveal">
              <p className="label" style={{ marginBottom: "1.5rem" }}>
                Povestea noastră
              </p>
              <h2 style={{ marginBottom: "1.5rem" }}>
                Mobilier care transmite emoție
              </h2>
              <span className="gold-line" />
              <p style={{ marginBottom: "1.25rem" }}>
                La Moodilier credem că mobilierul premium nu înseamnă doar
                obiecte bine executate, ci spații care transmit emoție,
                echilibru și identitate.
              </p>
              <p style={{ marginBottom: "1.25rem" }}>
                Cu peste 10 ani de experiență în producția de mobilier la
                comandă și amenajări interioare premium, am dezvoltat un proces
                complet care îmbină designul contemporan, precizia tehnică și
                atenția impecabilă la detalii.
              </p>
              <p style={{ marginBottom: "1.25rem" }}>
                În atelierul nostru, tehnologia modernă și măiestria execuției
                lucrează împreună pentru a crea mobilier personalizat cu linii
                curate, materiale premium și finisaje rafinate.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                Moodilier înseamnă mai mult decât mobilier. Înseamnă pasiune
                pentru detalii, respect pentru calitate și dorința de a
                construi spații care inspiră prin eleganță, funcționalitate și
                autenticitate.
              </p>
              <Link href="/contact" className="btn btn-primary">
                Solicită o ofertă
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Image Right */}
            <div className="reveal reveal-delay-2">
              <div className="about-image-wrap">
                <Image
                  src="/images-scraped/mobilier-premium-01.webp"
                  alt="Atelier Moodilier — producție mobilier premium"
                  width={700}
                  height={500}
                  style={{ width: "100%", height: "500px", objectFit: "cover" }}
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== STATS ============== */}
      <section
        style={{
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="stats-row" style={{ marginTop: 0 }}>
          {[
            { num: "10+", label: "Ani experiență" },
            { num: "200+", label: "Proiecte finalizate" },
            { num: "100%", label: "Execuție proprie" },
            { num: "24h", label: "Răspuns ofertă" },
          ].map((stat, i) => (
            <div key={i} className="stat-item reveal">
              <p className="stat-num">{stat.num}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============== ABOUT — SECTION 2 (atelier) ============== */}
      <section className="section" style={{ background: "var(--color-bg-alt)" }}>
        <div className="container">
          <div className="about-grid">
            {/* Image Left */}
            <div className="reveal">
              <div className="about-image-wrap">
                <Image
                  src="/images-scraped/mobilier-premium-02.webp"
                  alt="Atelier de producție mobilier la comandă Moodilier"
                  width={700}
                  height={500}
                  style={{ width: "100%", height: "500px", objectFit: "cover" }}
                  unoptimized
                />
              </div>
            </div>

            {/* Text Right */}
            <div className="reveal reveal-delay-2">
              <p className="label" style={{ marginBottom: "1.5rem" }}>
                Atelierul nostru
              </p>
              <h2 style={{ marginBottom: "1.5rem" }}>
                Tehnologie modernă, măiestrie autentică
              </h2>
              <span className="gold-line" />
              <p style={{ marginBottom: "1.25rem" }}>
                Pe lângă producția de mobilier premium la comandă, dezvoltăm și
                servicii specializate dedicate industriei de design interior și
                producție.
              </p>
              <p style={{ marginBottom: "1.25rem" }}>
                Atelierul Moodilier este dotat cu echipamente CNC de ultimă
                generație, iar fiecare piesă trece printr-un proces riguros de
                control al calității înainte de livrare.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                De la concept și proiectare, până la execuție, finisare și
                montaj, fiecare etapă este gestionată intern — pentru a garanta
                calitate, coerență și respect pentru termenele convenite.
              </p>
              <Link href="/servicii" className="btn btn-outline">
                Descoperă serviciile noastre
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============== SERVICES SUMMARY ============== */}
      <section className="section">
        <div className="container">
          <div
            className="section-header reveal"
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <p className="label" style={{ marginBottom: "1rem" }}>
              Ce oferim
            </p>
            <h2>Serviciile noastre principale</h2>
          </div>
          <div className="services-grid">
            {servicesSummary.map((service, i) => (
              <Link
                key={i}
                href={service.href}
                className={`service-card reveal reveal-delay-${i + 1}`}
                style={{ textDecoration: "none" }}
              >
                <p className="service-number">{service.num}</p>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.7rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--color-gold)",
                    marginTop: "auto",
                  }}
                >
                  Află mai mult <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============== GALLERY STRIP ============== */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2px",
          background: "var(--color-border)",
        }}
      >
        {galleryImages.map((img, i) => (
          <div
            key={i}
            className="img-overlay"
            style={{ aspectRatio: "4/3", overflow: "hidden" }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              style={{ objectFit: "cover" }}
              unoptimized
            />
            <div className="img-overlay-content">
              <p
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--color-gold)",
                }}
              >
                Portofoliu
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ============== VALUES ============== */}
      <section className="section" style={{ background: "var(--color-bg-alt)" }}>
        <div className="container">
          <div
            className="section-header reveal"
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <p className="label" style={{ marginBottom: "1rem" }}>
              Valorile noastre
            </p>
            <h2>Principiile care ne ghidează</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "2px",
              background: "var(--color-border)",
            }}
          >
            {values.map((value, i) => (
              <div
                key={i}
                className={`service-card reveal reveal-delay-${i + 1}`}
                style={{ textAlign: "center", alignItems: "center" }}
              >
                <div
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    border: "1px solid var(--color-gold)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-gold)",
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {value.num}
                </div>
                <h3 className="service-title" style={{ fontSize: "1.4rem" }}>
                  {value.title}
                </h3>
                <p
                  className="service-desc"
                  style={{ textAlign: "center", maxWidth: "100%" }}
                >
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== ABOUT IMAGE 3 ============== */}
      <section className="section">
        <div className="container">
          <div className="about-grid">
            {/* Text Left */}
            <div className="reveal">
              <p className="label" style={{ marginBottom: "1.5rem" }}>
                Viziunea noastră
              </p>
              <h2 style={{ marginBottom: "1.5rem" }}>
                Spații care inspiră prin eleganță
              </h2>
              <span className="gold-line" />
              <p style={{ marginBottom: "1.25rem" }}>
                Moodilier înseamnă mai mult decât mobilier. Înseamnă pasiune
                pentru detalii, respect pentru calitate și dorința de a
                construi spații care inspiră prin eleganță, funcționalitate și
                autenticitate.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                Fie că este vorba despre o bucătărie modernă în nuanțe
                neutre, un dressing cu oglinzi și iluminare integrată sau un
                living care reunește familia — fiecare proiect Moodilier
                reflectă identitatea unică a clientului nostru.
              </p>
              <Link href="/contact" className="btn btn-primary">
                Contactează-ne
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Image Right */}
            <div className="reveal reveal-delay-2">
              <div className="about-image-wrap">
                <Image
                  src="/images-scraped/mobilier-premium-03.webp"
                  alt="Mobilier premium Moodilier — eleganță și funcționalitate"
                  width={700}
                  height={500}
                  style={{ width: "100%", height: "500px", objectFit: "cover" }}
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section className="cta-section">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="reveal">
            <p className="label" style={{ marginBottom: "1.5rem" }}>
              Hai să lucrăm împreună
            </p>
            <h2
              style={{
                marginBottom: "1.5rem",
                maxWidth: "600px",
                margin: "0 auto 1.5rem",
              }}
            >
              Transformăm viziunea ta în realitate
            </h2>
            <p
              style={{
                maxWidth: "50ch",
                margin: "0 auto 2.5rem",
                textAlign: "center",
              }}
            >
              Contactează-ne pentru o consultare inițială gratuită și află cum
              putem crea împreună spațiul perfect pentru tine.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="/contact" className="btn btn-primary">
                Solicită o ofertă gratuită
                <ArrowRight size={14} />
              </Link>
              <Link href="/proiecte" className="btn btn-outline">
                Descoperă portofoliul
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
