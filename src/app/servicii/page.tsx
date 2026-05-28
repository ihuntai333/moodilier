import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Servicii | Moodilier",
  description:
    "Descoperă toate serviciile Moodilier: proiectare 3D, mobilier la comandă pentru bucătării, dressinguri, livinguri, spații comerciale și import premium.",
};

const services = [
  {
    num: "01",
    title: "Proiectare & Design 3D",
    desc: "Conceptul vizual al spațiului tău prinde viață înainte ca orice piesă de mobilier să fie produsă. Lucrăm cu programe profesionale de randare 3D pentru a-ți arăta cum va arăta rezultatul final.",
    features: [
      "Concept & Mood Board",
      "Randare 3D realistă",
      "Proiect tehnic detaliat",
      "Consultanță gratuită",
    ],
    image: "/images-scraped/proiectare.jpg",
    imageAlt: "Proiectare și design 3D mobilier la comandă Moodilier",
    imageLeft: true,
  },
  {
    num: "02",
    title: "Bucătării la Comandă",
    desc: "Bucătăria este inima casei. O proiectăm și o producem în totalitate în atelierul nostru, folosind materiale premium și hardware european.",
    features: [
      "MDF vopsit & furnir",
      "Blaturi granit / cuarț",
      "Electrocasnice integrate",
      "Măsurare la domiciliu",
    ],
    image: "/images-scraped/buc_giurgiu_1.jpg",
    imageAlt: "Bucătărie la comandă Moodilier — materiale premium",
    imageLeft: false,
  },
  {
    num: "03",
    title: "Living și Dormitoare",
    desc: "De la biblioteci și unități TV la paturi tapițate și dressinguri, mobilierăm întreg spațiul rezidențial cu piese la comandă.",
    features: [
      "Unități TV custom",
      "Paturi tapițate",
      "Dressinguri complete",
      "Biblioteci pe perete",
    ],
    image: "/images-scraped/living_01_.jpg",
    imageAlt: "Living la comandă — mobilier premium Moodilier",
    imageLeft: true,
  },
  {
    num: "04",
    title: "Spații Comerciale",
    desc: "Birouri, magazine, restaurante și hoteluri — proiectăm și executăm mobilier durabil și estetic pentru orice tip de spațiu comercial.",
    features: [
      "Recepții & front desk",
      "Mobilier de birou",
      "Amenajări retail",
      "Restaurante & HoReCa",
    ],
    image: "/images-scraped/carusel_office.jpg",
    imageAlt: "Mobilier pentru spații comerciale — Moodilier",
    imageLeft: false,
  },
  {
    num: "05",
    title: "Moodilier Store",
    desc: "Importăm mobilier premium din Italia și Europa pentru clienții care însoțesc producția locală cu piese selectate din colecții europene.",
    features: [
      "Mărci europene",
      "Disponibil în showroom",
      "Livrare & montaj",
      "Garanție producător",
    ],
    image: "/images-scraped/mobilier-premium-01.webp",
    imageAlt: "Moodilier Store — mobilier premium importat din Europa",
    imageLeft: true,
  },
];

const stats = [
  { num: "10+", label: "Ani experiență" },
  { num: "200+", label: "Proiecte finalizate" },
  { num: "100%", label: "La comandă" },
  { num: "2 ani", label: "Garanție" },
];

const processSteps = [
  {
    step: "01",
    title: "Ofertarea Proiectului",
    desc: "În urma discuției inițiale analizăm cerințele proiectului, stilul dorit și particularitățile spațiului, pentru a realiza o ofertă personalizată, adaptată nevoilor și bugetului clientului.",
  },
  {
    step: "02",
    title: "Relevarea Spațiului",
    desc: "Efectuăm măsurătorile exacte ale spațiului și verificăm toate detaliile tehnice necesare pentru ca proiectul să fie executat cu precizie și eficiență.",
  },
  {
    step: "03",
    title: "Analiza și Dezvoltarea Proiectului",
    desc: "Stabilim soluțiile tehnice și funcționale ale mobilierului, optimizând fiecare detaliu pentru integrarea perfectă în spațiul amenajat.",
  },
  {
    step: "04",
    title: "Proiectare și Documentare",
    desc: "Realizăm proiectul tehnic complet și documentația necesară pentru producție, incluzând dimensiuni, materiale, finisaje și accesorii.",
  },
  {
    step: "05",
    title: "Execuție în Atelier",
    desc: "Producția se realizează în atelierul propriu cu tehnologie CNC modernă și control riguros al calității la fiecare etapă a procesului.",
  },
  {
    step: "06",
    title: "Livrare & Montaj",
    desc: "Livrăm și montăm mobilierul cu precizie, verificând fiecare detaliu pentru a garanta calitatea așteptată.",
  },
];

export default function ServiciiPage() {
  return (
    <>
      <JsonLd type="service" />
      {/* ============== PAGE HERO ============== */}
      <PageHero
        label="Ce oferim"
        title="Servicii"
        subtitle="De la concept și proiectare 3D până la execuție, finisare și montaj — totul realizat în atelierul nostru din București."
        bgImage="/images-scraped/proiectare.jpg"
        overlayOpacity={0.7}
      />

      {/* ============== SECTION 1 — INTRO STRIP ============== */}
      <section
        style={{
          background: "var(--color-bg-alt)",
          padding: "5rem 0",
          textAlign: "center",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="container">
          <p className="label" style={{ marginBottom: "1.25rem" }}>
            CE OFERIM
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              lineHeight: 1.2,
              marginBottom: "1.5rem",
              color: "var(--color-fg)",
            }}
          >
            Un serviciu complet, de la concept la montaj
          </h2>
          <p
            style={{
              maxWidth: "60ch",
              margin: "0 auto 3.5rem",
              color: "var(--color-fg-muted)",
              lineHeight: 1.8,
              fontSize: "1.0625rem",
            }}
          >
            Fiecare proiect Moodilier trece printr-un proces complet — de la
            prima discuție până la livrarea mobilierului în spațiul tău. Totul
            realizat în atelierul nostru din București.
          </p>

          {/* Stats row */}
          <div
            className="intro-stats-row"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "2px",
              background: "var(--color-border)",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="stat-item"
                style={{ background: "var(--color-surface)", padding: "2.25rem 1.5rem" }}
              >
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
          <style>{`
            @media (min-width: 640px) {
              .intro-stats-row {
                grid-template-columns: repeat(4, 1fr) !important;
              }
            }
          `}</style>
        </div>
      </section>

      {/* ============== SECTION 2 — ALTERNATING SERVICE ROWS ============== */}
      <div>
        {services.map((service, i) => (
          <div
            key={i}
            className="service-row reveal"
            style={{
              background:
                i % 2 === 0
                  ? "var(--color-bg)"
                  : "var(--color-bg-alt)",
            }}
          >
            {/* Image panel */}
            <div
              className="service-row-image"
              style={{
                order: service.imageLeft ? 0 : 1,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  minHeight: "340px",
                }}
              >
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  unoptimized
                />
                {/* Subtle dark tint */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.18)",
                  }}
                />
              </div>
            </div>

            {/* Text panel */}
            <div
              className="service-row-text"
              style={{
                order: service.imageLeft ? 1 : 0,
                padding: "4rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "1.5rem",
                position: "relative",
              }}
            >
              {/* Ghost number behind title */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: "2rem",
                  right: service.imageLeft ? "2rem" : "auto",
                  left: service.imageLeft ? "auto" : "2rem",
                  fontFamily: "var(--font-display)",
                  fontSize: "8rem",
                  fontWeight: 700,
                  lineHeight: 1,
                  color: "var(--color-fg)",
                  opacity: 0.05,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {service.num}
              </span>

              {/* Gold line */}
              <div
                style={{
                  width: "60px",
                  height: "2px",
                  background: "var(--color-gold)",
                }}
              />

              {/* Title */}
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 2.5vw, 2.5rem)",
                  fontWeight: 400,
                  color: "var(--color-fg)",
                  lineHeight: 1.2,
                  marginBottom: "0.25rem",
                }}
              >
                {service.title}
              </h2>

              {/* Description */}
              <p
                style={{
                  color: "var(--color-fg-muted)",
                  fontSize: "0.9375rem",
                  lineHeight: 1.8,
                  maxWidth: "52ch",
                }}
              >
                {service.desc}
              </p>

              {/* Features */}
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                {service.features.map((feat, j) => (
                  <li
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.875rem",
                      fontSize: "0.875rem",
                      color: "var(--color-fg-muted)",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--color-gold)",
                        fontWeight: 700,
                        fontSize: "1rem",
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .service-row {
          display: grid;
          grid-template-columns: 1fr;
          min-height: 400px;
          border-bottom: 1px solid var(--color-border);
        }
        .service-row-image {
          order: 0;
        }
        .service-row-text {
          order: 1;
          padding: 3rem 2rem;
        }
        @media (min-width: 900px) {
          .service-row {
            grid-template-columns: 1fr 1fr;
            min-height: 500px;
          }
          .service-row-text {
            padding: 4rem !important;
          }
        }
      `}</style>

      {/* ============== SECTION 3 — PROCESS TIMELINE ============== */}
      <section
        className="section"
        style={{ background: "var(--color-bg-alt)" }}
      >
        <div className="container">
          <div
            className="reveal"
            style={{ textAlign: "center", marginBottom: "5rem" }}
          >
            <p className="label" style={{ marginBottom: "1rem" }}>
              Etapele unui proiect
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 400,
                color: "var(--color-fg)",
              }}
            >
              Etapele unui proiect
            </h2>
            <p
              style={{
                maxWidth: "58ch",
                margin: "1.5rem auto 0",
                color: "var(--color-fg-muted)",
                lineHeight: 1.7,
              }}
            >
              Abordarea noastră în fiecare proiect este construită în jurul preciziei,
              comunicării și execuției premium, pentru a transforma fiecare spațiu
              íntr-un rezultat impecabil.
            </p>
          </div>

          {/* Timeline wrapper */}
          <div style={{ position: "relative" }} className="process-wrapper">
            {/* Horizontal connector line — desktop only */}
            <div
              aria-hidden
              className="process-connector"
              style={{
                position: "absolute",
                top: "2.25rem",
                left: "calc(10% + 2.25rem)",
                right: "calc(10% + 2.25rem)",
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, var(--color-gold) 10%, var(--color-gold) 90%, transparent)",
                opacity: 0.3,
                display: "none",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            {/* Steps */}
            <div className="process-steps" style={{ position: "relative", zIndex: 1 }}>
              {processSteps.map((item, i) => (
                <div
                  key={i}
                  className={`reveal reveal-delay-${(i % 4) + 1} process-step-item`}
                >
                  {/* Circle with number */}
                  <div
                    style={{
                      width: "4.5rem",
                      height: "4.5rem",
                      border: "1px solid var(--color-gold)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--color-bg-alt)",
                      margin: "0 auto 1.25rem",
                      flexShrink: 0,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "2rem",
                        fontWeight: 300,
                        color: "var(--color-gold)",
                        lineHeight: 1,
                      }}
                    >
                      {item.step}
                    </span>
                  </div>

                  <h4
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.25rem",
                      fontWeight: 400,
                      color: "var(--color-fg)",
                      marginBottom: "0.625rem",
                      lineHeight: 1.2,
                      textAlign: "center",
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--color-fg-subtle)",
                      textAlign: "center",
                      maxWidth: "22ch",
                      margin: "0 auto",
                      lineHeight: 1.65,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          .process-steps {
            display: grid;
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .process-step-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          @media (min-width: 768px) {
            .process-steps {
              grid-template-columns: repeat(3, 1fr);
              gap: 2rem;
            }
            .process-connector {
              display: block !important;
            }
          }
          @media (min-width: 1100px) {
            .process-steps {
              grid-template-columns: repeat(6, 1fr);
              gap: 1rem;
            }
          }
        `}</style>
      </section>

      {/* ============== SECTION 4 — FULL-BLEED QUOTE ============== */}
      <section
        style={{
          position: "relative",
          height: "60vh",
          minHeight: "420px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg"
          alt="Proiect Moodilier — vilă premium"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          unoptimized
        />
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
          }}
        />
        {/* Quote */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "2rem",
            maxWidth: "860px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3.5vw, 2.75rem)",
              fontStyle: "italic",
              fontWeight: 300,
              color: "var(--color-fg)",
              lineHeight: 1.35,
              marginBottom: "1.5rem",
              maxWidth: "100%",
            }}
          >
            &ldquo;Mobilierul pe care îl creăm nu este doar funcțional — este
            expresia identității tale&rdquo;
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
            }}
          >
            — Echipa Moodilier
          </p>
        </div>
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
              Solicită o ofertă fără angajament
            </h2>
            <p
              style={{
                maxWidth: "50ch",
                margin: "0 auto 2.5rem",
                textAlign: "center",
              }}
            >
              Contactează-ne și un consultant Moodilier îți va răspunde în maxim
              24 de ore cu o propunere personalizată.
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
