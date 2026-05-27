import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Pencil,
  ChefHat,
  LayoutGrid,
  Sofa,
  Building2,
  Package,
} from "lucide-react";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Servicii | Moodilier",
  description:
    "Descoperă toate serviciile Moodilier: proiectare 3D, mobilier la comandă pentru bucătării, dressinguri, livinguri, spații comerciale și import premium.",
};

const services = [
  {
    num: "01",
    icon: Pencil,
    title: "Servicii de proiectare",
    desc: "Proiectarea este fundația oricărui proiect reușit. Echipa noastră de designeri elaborează concepte personalizate pornind de la stilul dorit, dimensiunile spațiului și bugetul disponibil. Fiecare proiect include un mood board, vizualizări 3D realiste și un proiect tehnic complet.",
    bullets: [
      "Concept și mood board",
      "Randări 3D realiste",
      "Proiect tehnic detaliat",
      "Consultanță gratuită",
    ],
  },
  {
    num: "02",
    icon: ChefHat,
    title: "Bucătării la comandă",
    desc: "Realizăm bucătării cu fronturi din MDF vopsit, furnir natural, PAL melaminat sau HPL. Blat din granit, cuarț sau ceramică. Sistemele Blum asigură o experiență de utilizare silențioasă și durabilă pe termen lung.",
    bullets: [
      "Măsurare la domiciliu",
      "Materiale premium",
      "Electrocasnice integrate",
      "Blat granit/cuarț",
    ],
  },
  {
    num: "03",
    icon: LayoutGrid,
    title: "Dressinguri și depozitare",
    desc: "Proiectăm sisteme complete de dressing walk-in sau cu uși glisante, cu sau fără insulă centrală. Accesoriile premium și iluminarea integrată transformă depozitarea într-o experiență estetică și funcțională.",
    bullets: [
      "Design personalizat",
      "Sisteme culisante",
      "Iluminat integrat",
      "Oglindă integrată",
    ],
  },
  {
    num: "04",
    icon: Sofa,
    title: "Living și dormitoare",
    desc: "De la biblioteca pe toată înălțimea peretelui la paturi tapițate și comode — realizăm mobilier complet pentru living, dormitor și orice zonă a casei, conceput în coerență cu ansamblul de design ales.",
    bullets: [
      "Paturi tapițate",
      "Biblioteci pe perete",
      "Comode și noptiere",
      "TV units custom",
    ],
  },
  {
    num: "05",
    icon: Building2,
    title: "Spații comerciale",
    desc: "Mediul comercial reflectă identitatea brandului. Realizăm mobilier pentru recepții de hotel sau clinică, birouri executive, showroom-uri, magazine de retail și HoReCa, de la concept la montaj final.",
    bullets: [
      "Recepții și front desk",
      "Mobilier birou",
      "Amenajări magazine",
      "Restaurante și cafenele",
    ],
  },
  {
    num: "06",
    icon: Package,
    title: "Moodilier Store",
    desc: "Complementar producției proprii, Moodilier Store aduce în România colecții selecte de mobilier premium de la designeri și producători consacrați din Italia și Europa. Piese iconice disponibile în showroom-ul nostru.",
    bullets: [
      "Mărci europene selectate",
      "Livrare și montaj",
      "Garanție producător",
      "Disponibil în showroom",
    ],
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
    step: "1",
    title: "Consultare inițială",
    desc: "Analizăm cerințele, stilul dorit și particularitățile spațiului. Prima consultare este gratuită.",
  },
  {
    step: "2",
    title: "Design & proiectare 3D",
    desc: "Măsurători la fața locului și elaborarea conceptului cu randări 3D realiste.",
  },
  {
    step: "3",
    title: "Ofertă și materiale",
    desc: "Prezentăm oferta detaliată cu materiale, finisaje și termene de execuție.",
  },
  {
    step: "4",
    title: "Producție în atelier",
    desc: "Execuție în atelierul propriu cu tehnologie CNC modernă și control calitate riguros.",
  },
  {
    step: "5",
    title: "Livrare & montaj",
    desc: "Montaj profesionist la fața locului cu reglaj de precizie și verificare finală.",
  },
];

export default function ServiciiPage() {
  return (
    <>
      {/* ============== PAGE HERO ============== */}
      <PageHero
        label="Ce oferim"
        title="Servicii"
        subtitle="De la concept și proiectare 3D până la execuție, finisare și montaj — totul realizat în atelierul nostru din București."
        bgImage="/images-scraped/proiectare.jpg"
        overlayOpacity={0.7}
      />

      {/* ============== SECTION 1 — INTRO + STATS ============== */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "4rem",
              alignItems: "start",
            }}
            className="services-intro-grid"
          >
            {/* Left — Text */}
            <div className="reveal">
              <p className="label" style={{ marginBottom: "1.5rem" }}>
                Despre noi
              </p>
              <h2
                style={{
                  fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
                  lineHeight: 1.2,
                  marginBottom: "1.5rem",
                }}
              >
                Un serviciu complet,
                <br />
                <em>de la schiță la montaj</em>
              </h2>
              <span className="gold-line" />
              <p
                style={{
                  fontSize: "1.0625rem",
                  lineHeight: 1.8,
                  color: "var(--color-fg-muted)",
                  maxWidth: "58ch",
                }}
              >
                Moodilier oferă un serviciu complet de design și execuție
                mobilier la comandă, de la prima schiță până la montajul final
                în locuința sau spațiul tău. Fiecare proiect este tratat ca o
                colaborare unică — ascultăm, proiectăm și executăm cu precizie
                și atenție la fiecare detaliu.
              </p>
            </div>

            {/* Right — Stats */}
            <div
              className="reveal reveal-delay-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "2px",
                background: "var(--color-border)",
              }}
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="stat-item"
                  style={{ background: "var(--color-surface)" }}
                >
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <style>{`
            @media (min-width: 1024px) {
              .services-intro-grid {
                grid-template-columns: 1fr 1fr !important;
              }
            }
          `}</style>
        </div>
      </section>

      {/* ============== SECTION 2 — 6 SERVICES GRID ============== */}
      <section
        className="section"
        style={{ background: "var(--color-bg-alt)", paddingTop: "0" }}
      >
        <div className="container">
          <div
            className="section-header reveal"
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <p className="label" style={{ marginBottom: "1rem" }}>
              Ce realizăm
            </p>
            <h2>Serviciile noastre</h2>
            <p
              style={{
                maxWidth: "50ch",
                margin: "1.5rem auto 0",
                textAlign: "center",
              }}
            >
              Șase domenii de expertiză, o singură echipă dedicată excelenței în
              mobilier la comandă.
            </p>
          </div>

          {/* 3×2 grid desktop, 2×3 tablet, 1×6 mobile */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(1, 1fr)",
              gap: "1px",
              background: "var(--color-border)",
            }}
            className="services-cards-grid"
          >
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={i}
                  className={`reveal reveal-delay-${(i % 3) + 1}`}
                  style={{
                    background: "var(--color-surface)",
                    border: "none",
                    padding: "2.75rem 2.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all var(--transition-base)",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--color-gold-dark)";
                    (e.currentTarget as HTMLElement).style.transform =
                      "translateY(-4px)";
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 20px 60px rgba(0,0,0,0.35)";
                    (e.currentTarget as HTMLElement).style.zIndex = "2";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "";
                    (e.currentTarget as HTMLElement).style.transform = "";
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                    (e.currentTarget as HTMLElement).style.zIndex = "";
                  }}
                >
                  {/* Gold accent bottom line */}
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: "var(--color-gold)",
                      transformOrigin: "left",
                      transform: "scaleX(0)",
                      transition: "transform var(--transition-base)",
                    }}
                    className="service-card-line"
                  />

                  {/* Number */}
                  <div className="service-number">{service.num}</div>

                  {/* Icon + Title */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}
                  >
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        border: "1px solid var(--color-border-alt)",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--color-gold)",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.35rem",
                        fontWeight: 400,
                        color: "var(--color-fg)",
                        lineHeight: 1.2,
                      }}
                    >
                      {service.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-fg-subtle)",
                      lineHeight: 1.75,
                      maxWidth: "100%",
                    }}
                  >
                    {service.desc}
                  </p>

                  {/* Bullets */}
                  <ul
                    style={{
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      flex: 1,
                    }}
                  >
                    {service.bullets.map((b, j) => (
                      <li
                        key={j}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          fontSize: "0.8125rem",
                          color: "var(--color-fg-muted)",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: "1.25rem",
                            height: "1px",
                            background: "var(--color-gold)",
                            flexShrink: 0,
                          }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* CTA link */}
                  <Link
                    href="/contact"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--color-gold)",
                      marginTop: "0.5rem",
                      transition: "gap var(--transition-base)",
                    }}
                  >
                    Află mai multe
                    <ArrowRight size={12} />
                  </Link>
                </div>
              );
            })}
          </div>

          <style>{`
            .services-cards-grid {
              grid-template-columns: repeat(1, 1fr);
            }
            @media (min-width: 640px) {
              .services-cards-grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }
            @media (min-width: 1024px) {
              .services-cards-grid {
                grid-template-columns: repeat(3, 1fr);
              }
            }
            .services-cards-grid > div:hover .service-card-line {
              transform: scaleX(1) !important;
            }
          `}</style>
        </div>
      </section>

      {/* ============== SECTION 3 — PROCESS ============== */}
      <section className="section">
        <div className="container">
          <div
            className="section-header reveal"
            style={{ textAlign: "center", marginBottom: "5rem" }}
          >
            <p className="label" style={{ marginBottom: "1rem" }}>
              Cum lucrăm
            </p>
            <h2>Procesul nostru</h2>
            <p
              style={{
                maxWidth: "50ch",
                margin: "1.5rem auto 0",
                textAlign: "center",
              }}
            >
              Un proces clar, transparent și adaptat fiecărui client — de la
              prima discuție până la livrarea finală.
            </p>
          </div>

          {/* Steps with horizontal connector line on desktop */}
          <div
            style={{ position: "relative" }}
            className="process-wrapper"
          >
            {/* Connector line — desktop only, rendered via CSS */}
            <div
              aria-hidden
              className="process-connector-line"
              style={{
                position: "absolute",
                top: "1.5rem", /* center of the circle */
                left: "10%",
                right: "10%",
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, var(--color-border-alt) 15%, var(--color-border-alt) 85%, transparent)",
                display: "none",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            <div
              className="process-steps-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "2.5rem",
                position: "relative",
                zIndex: 1,
              }}
            >
              {processSteps.map((item, i) => (
                <div
                  key={i}
                  className={`reveal reveal-delay-${(i % 4) + 1}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "1rem",
                  }}
                >
                  {/* Circle number */}
                  <div
                    style={{
                      width: "3rem",
                      height: "3rem",
                      border: "1px solid var(--color-gold)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-gold)",
                      fontFamily: "var(--font-display)",
                      fontSize: "1.25rem",
                      background: "var(--color-bg)",
                      flexShrink: 0,
                    }}
                  >
                    {item.step}
                  </div>

                  <div>
                    <h4
                      style={{
                        color: "var(--color-fg)",
                        fontSize: "1rem",
                        fontWeight: 500,
                        fontFamily: "var(--font-body)",
                        marginBottom: "0.5rem",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "0.8375rem",
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
                </div>
              ))}
            </div>
          </div>

          <style>{`
            @media (min-width: 768px) {
              .process-steps-row {
                grid-template-columns: repeat(5, 1fr) !important;
                gap: 0 !important;
              }
              .process-connector-line {
                display: block !important;
              }
            }
          `}</style>
        </div>
      </section>

      {/* ============== SECTION 4 — FULL-BLEED IMAGE ============== */}
      <section
        style={{
          position: "relative",
          height: "55vh",
          minHeight: "380px",
          overflow: "hidden",
        }}
      >
        <Image
          src="/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg"
          alt="Atelier Moodilier București"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          unoptimized
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <p className="label" style={{ marginBottom: "1.25rem" }}>
            Atelierul nostru
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 3.5rem)",
              fontStyle: "italic",
              fontWeight: 300,
              color: "var(--color-fg)",
              maxWidth: "700px",
              lineHeight: 1.2,
              marginBottom: "1.25rem",
            }}
          >
            Calitate executată în atelierul nostru din București
          </h2>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--color-fg-muted)",
              maxWidth: "52ch",
              lineHeight: 1.7,
            }}
          >
            Fiecare piesă de mobilier este produsă manual, cu precizie și atenție
            la detalii, în atelierul propriu de 1.200 mp.
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
              Contactează-ne și un consultant Moodilier îți va răspunde în
              maxim 24 de ore cu o propunere personalizată.
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
