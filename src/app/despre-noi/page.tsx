import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Target, Award, Zap, Heart } from "lucide-react";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Despre noi | Moodilier",
  description:
    "Aflați povestea Moodilier — peste 10 ani de expertiză în producția de mobilier premium la comandă și amenajări interioare din București.",
};

const values = [
  {
    Icon: Target,
    title: "Precizie",
    desc: "Fiecare detaliu este măsurat, verificat și executat cu precizie milimetrică.",
  },
  {
    Icon: Award,
    title: "Calitate",
    desc: "Folosim doar materiale certificate, hardware european și finisaje de înaltă clasă.",
  },
  {
    Icon: Zap,
    title: "Inovație",
    desc: "Combinăm tehnologia CNC modernă cu designul contemporan pentru rezultate unice.",
  },
  {
    Icon: Heart,
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
    span: 2,
  },
  {
    src: "/images-despre-noi/dormitor-01.jpg",
    alt: "Dormitor premium cu tăblie tapițată aurie",
    span: 1,
  },
  {
    src: "/images-despre-noi/living-02.jpg",
    alt: "Living contemporan cu candelabru",
    span: 1,
  },
  {
    src: "/images-despre-noi/dressing-01.jpg",
    alt: "Dressing premium cu oglindă și iluminare LED",
    span: 1,
  },
  {
    src: "/images-despre-noi/bucatarie-01.jpg",
    alt: "Bucătărie premium cu blat de marmură",
    span: 1,
  },
];

const serviceTeasers = [
  {
    image: "/images-scraped/proiectare.jpg",
    alt: "Proiectare și design interior",
    title: "Proiectare & Design",
    href: "/servicii",
  },
  {
    image: "/images-scraped/buc_giurgiu_1.jpg",
    alt: "Mobilier la comandă — bucătărie premium",
    title: "Mobilier la Comandă",
    href: "/servicii",
  },
  {
    image: "/images-scraped/executie_sediu-office15.jpg",
    alt: "Spații comerciale — mobilier premium",
    title: "Spații Comerciale",
    href: "/servicii",
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
        bgImage="/images-despre-noi/living-02.jpg"
        overlayOpacity={0.6}
      />

      {/* ============== SECTION 1 — BRAND STORY 2 COLS ============== */}
      <section className="section">
        <div className="container">
          <div className="brand-story-grid">
            {/* Left — Large italic quote */}
            <div className="reveal brand-story-quote-col">
              <blockquote
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "var(--color-fg)",
                  lineHeight: 1.45,
                  borderLeft: "2px solid var(--color-gold)",
                  paddingLeft: "2rem",
                  margin: 0,
                }}
              >
                &ldquo;La Moodilier credem că mobilierul premium nu înseamnă
                doar obiecte bine executate, ci spații care transmit emoție,
                echilibru și identitate.&rdquo;
              </blockquote>
            </div>

            {/* Right — Story paragraphs */}
            <div className="reveal reveal-delay-2 brand-story-text-col">
              <p className="label" style={{ marginBottom: "1.25rem" }}>
                Povestea noastră
              </p>
              <span className="gold-line" />
              <p style={{ marginBottom: "1.25rem", lineHeight: 1.8 }}>
                Cu peste 10 ani de experiență în producția de mobilier la
                comandă și amenajări interioare premium, am dezvoltat un proces
                complet care îmbină designul contemporan, precizia tehnică și
                atenția impecabilă la detalii.
              </p>
              <p style={{ marginBottom: "1.25rem", lineHeight: 1.8 }}>
                În atelierul nostru de 1.200 mp din București, tehnologia
                modernă și măiestria execuției lucrează împreună pentru a crea
                mobilier personalizat cu linii curate, materiale premium și
                finisaje rafinate.
              </p>
              <p style={{ lineHeight: 1.8 }}>
                Pe lângă producția de mobilier premium la comandă, dezvoltăm și
                servicii specializate dedicate industriei de design interior și
                producție.
              </p>
            </div>
          </div>

          {/* Stats below the story */}
          <div
            className="brand-stats-row"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "2px",
              background: "var(--color-border)",
              marginTop: "4rem",
            }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="stat-item reveal"
                style={{ background: "var(--color-surface)" }}
              >
                <p className="stat-num">{s.num}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .brand-story-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 3rem;
            align-items: start;
          }
          @media (min-width: 900px) {
            .brand-story-grid {
              grid-template-columns: 1fr 1fr;
              gap: 5rem;
              align-items: center;
            }
          }
          @media (min-width: 640px) {
            .brand-stats-row {
              grid-template-columns: repeat(4, 1fr) !important;
            }
          }
        `}</style>
      </section>

      {/* ============== SECTION 2 — GALLERY MOSAIC ============== */}
      <section className="gallery-mosaic-section">
        <div className="gallery-mosaic">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className="gallery-mosaic-item"
              style={{ gridColumn: `span ${img.span}` }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  transition: "transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)",
                }}
                unoptimized
              />
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .gallery-mosaic-section {
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          background: var(--color-bg);
        }
        .gallery-mosaic {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: auto;
          gap: 3px;
        }
        .gallery-mosaic-item {
          position: relative;
          height: 260px;
          overflow: hidden;
          grid-column: span 1 !important;
        }
        .gallery-mosaic-item:hover img {
          transform: scale(1.05);
        }
        @media (min-width: 768px) {
          .gallery-mosaic {
            grid-template-columns: repeat(3, 1fr);
          }
          .gallery-mosaic-item {
            height: 380px;
            grid-column: span var(--span, 1) !important;
          }
          /* First item spans 2 cols */
          .gallery-mosaic-item:first-child {
            grid-column: span 2 !important;
          }
        }
      `}</style>

      {/* ============== SECTION 3 — VALUES ============== */}
      <section
        className="section"
        style={{ background: "var(--color-bg-alt)" }}
      >
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <p className="label" style={{ marginBottom: "1rem" }}>
              Valorile noastre
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
                fontWeight: 400,
                color: "var(--color-fg)",
                marginBottom: "1rem",
              }}
            >
              Valorile noastre
            </h2>
            <p
              style={{
                maxWidth: "52ch",
                margin: "0 auto",
                color: "var(--color-fg-muted)",
              }}
            >
              Principiile care ghidează fiecare proiect Moodilier
            </p>
          </div>

          <div className="values-grid">
            {values.map(({ Icon, title, desc }, i) => (
              <div
                key={i}
                className={`reveal reveal-delay-${i + 1} value-card`}
              >
                <div
                  style={{
                    width: "3.25rem",
                    height: "3.25rem",
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border-alt)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-gold)",
                    marginBottom: "1.25rem",
                    transition: "border-color var(--transition-base), background var(--transition-base)",
                  }}
                  className="value-card-icon"
                >
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 400,
                    color: "var(--color-fg)",
                    marginBottom: "0.75rem",
                    lineHeight: 1.15,
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-fg-subtle)",
                    lineHeight: 1.75,
                    maxWidth: "100%",
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .values-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2px;
            background: var(--color-border);
          }
          .value-card {
            background: var(--color-surface);
            padding: 2.75rem 2.5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            transition: border-color var(--transition-base), background var(--transition-base);
            border: 1px solid transparent;
          }
          .value-card:hover {
            border-color: var(--color-gold-dark);
            background: var(--color-bg);
          }
          .value-card:hover .value-card-icon {
            background: var(--color-gold-dark) !important;
            border-color: var(--color-gold-dark) !important;
            color: var(--color-bg) !important;
          }
          @media (min-width: 640px) {
            .values-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (min-width: 1024px) {
            .values-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }
        `}</style>
      </section>

      {/* ============== SECTION 4 — SERVICE TEASERS ============== */}
      <section className="section">
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: "center", marginBottom: "3.5rem" }}
          >
            <p className="label" style={{ marginBottom: "1rem" }}>
              Ce facem
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
                fontWeight: 400,
                color: "var(--color-fg)",
              }}
            >
              Ce facem
            </h2>
          </div>

          <div className="teasers-grid">
            {serviceTeasers.map((teaser, i) => (
              <Link
                key={i}
                href={teaser.href}
                className={`reveal reveal-delay-${i + 1} teaser-card`}
                aria-label={teaser.title}
              >
                {/* Background image */}
                <div className="teaser-card-img">
                  <Image
                    src={teaser.image}
                    alt={teaser.alt}
                    fill
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    unoptimized
                  />
                </div>

                {/* Overlay */}
                <div className="teaser-card-overlay" />

                {/* Arrow top-right */}
                <div
                  style={{
                    position: "absolute",
                    top: "1.5rem",
                    right: "1.5rem",
                    zIndex: 2,
                    width: "2.25rem",
                    height: "2.25rem",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-fg)",
                    transition: "background var(--transition-base), border-color var(--transition-base)",
                  }}
                  className="teaser-card-arrow"
                >
                  <ArrowRight size={14} strokeWidth={1.5} />
                </div>

                {/* Title bottom-left */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "1.75rem",
                    zIndex: 2,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.5rem",
                      fontWeight: 400,
                      color: "var(--color-fg)",
                      lineHeight: 1.2,
                    }}
                  >
                    {teaser.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <style>{`
          .teasers-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1px;
            background: var(--color-border);
          }
          .teaser-card {
            position: relative;
            height: 320px;
            overflow: hidden;
            display: block;
            text-decoration: none;
          }
          .teaser-card-img {
            position: absolute;
            inset: 0;
            transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94);
          }
          .teaser-card:hover .teaser-card-img {
            transform: scale(1.06);
          }
          .teaser-card-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.15) 100%);
            z-index: 1;
            transition: background var(--transition-base);
          }
          .teaser-card:hover .teaser-card-overlay {
            background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.1) 100%);
          }
          .teaser-card:hover .teaser-card-arrow {
            background: var(--color-gold) !important;
            border-color: var(--color-gold) !important;
            color: var(--color-bg) !important;
          }
          @media (min-width: 768px) {
            .teasers-grid {
              grid-template-columns: repeat(3, 1fr);
            }
            .teaser-card {
              height: 420px;
            }
          }
        `}</style>
      </section>

      {/* ============== SECTION 5 — CTA ============== */}
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
