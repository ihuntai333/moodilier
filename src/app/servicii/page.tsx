import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Servicii | Moodilier",
  description:
    "Descoperă toate serviciile Moodilier: proiectare 3D, mobilier la comandă pentru bucătării, dressinguri, livinguri, spații comerciale și import premium.",
};

const services = [
  {
    num: "01",
    title: "Servicii de proiectare",
    subtitle: "Concept · Vizualizări 3D · Proiect tehnic",
    desc: "Proiectarea este fundația oricărui proiect reușit. Echipa noastră de designeri elaborează concepte personalizate pornind de la stilul dorit, dimensiunile spațiului și bugetul disponibil. Fiecare proiect include un mood board, vizualizări 3D realiste și un proiect tehnic complet cu dimensiuni, materiale, finisaje și accesorii specificate.",
    image: "/images-scraped/proiectare.jpg",
    details: ["Analiză spațiu și cerințe", "Mood board și concept vizual", "Randări 3D realiste", "Proiect tehnic complet", "Consultanță materiale și finisaje"],
  },
  {
    num: "02",
    title: "Bucătării la comandă",
    subtitle: "Design modern · Funcționalitate · Materiale premium",
    desc: "Bucătăria este inima casei — de aceea fiecare proiect este tratat cu maximă atenție. Realizăm bucătării cu fronturi din PAL lăcuit mat sau lucios, MDF vopsit, furnir natural sau acril, cu blat din granit, Corian, Himacs sau ceramică. Sistemele de deschidere Blum asigură o experiență de utilizare silențioasă și durabilă.",
    image: "/images-scraped/buc_giurgiu_1.jpg",
    details: ["Fronturi PAL, MDF, furnir, acril", "Blat Corian, granit, ceramică", "Sisteme Blum silențioase", "Iluminare integrată LED", "Corpuri suspendate și la sol"],
  },
  {
    num: "03",
    title: "Dressinguri & Dormitoare",
    subtitle: "Organizare inteligentă · Eleganță · Personalizare totală",
    desc: "Un dressing bine gândit transformă dimineața în plăcere. Proiectăm dressinguri walk-in, dressinguri cu uși glisante sau batante, cu sau fără insulă centrală. Sistemele de iluminare integrată, oglinzile incorporate și accesoriile premium Häfele și Blum completează o experiență de depozitare elegantă și funcțională.",
    image: "/images-scraped/living_01_.jpg",
    details: ["Dressinguri walk-in și cu uși", "Sisteme modulare personalizate", "Iluminare LED integrată", "Oglinzi și accesorii premium", "Paturi tapițate și noptiere"],
  },
  {
    num: "04",
    title: "Livinguri & Amenajări complete",
    subtitle: "Coerență vizuală · Echilibru · Personalitate",
    desc: "De la biblioteca pe toată înălțimea peretelui la televizor integrat în mobilier, de la console la dulapuri de hol — realizăm piese de mobilier pentru orice zonă a casei. Fiecare element este conceput în coerență cu ansamblul, respectând un fir conductor al designului ales.",
    image: "/images-scraped/living_01_.jpg",
    details: ["Biblioteci și corpuri TV", "Console și dulapuri de hol", "Dulapuri de depozitare", "Rafturi și nișe personalizate", "Mobilier baie la comandă"],
  },
  {
    num: "05",
    title: "Spații comerciale",
    subtitle: "Recepții · Birouri · Showroom-uri · Magazine",
    desc: "Mediul de lucru și comercial reflectă identitatea brandului. Realizăm mobilier pentru recepții de hotel sau clinică, birouri executive, showroom-uri auto sau de modă, magazine de retail și HoReCa. Fiecare proiect comercial beneficiază de un management complet de la concept la montaj final.",
    image: "/images-scraped/executie_sediu-office15.jpg",
    details: ["Recepții și zone de așteptare", "Birouri executive și open space", "Mobilier HoReCa și retail", "Showroom-uri și expoziții", "Semnalistică și branding spațial"],
  },
  {
    num: "06",
    title: "Moodilier Store",
    subtitle: "Import selecționat · Italia · Danemarca · Grecia",
    desc: "Complementar producției proprii, Moodilier Store aduce în România colecții selecte de mobilier premium de la designeri și producători consacrați din Italia, Danemarca și Grecia. Piese iconice de design, fotolii, canapele, mese și corpuri de iluminat care completează orice amenajare de lux.",
    image: "/images-scraped/moodilier_store.jpg",
    details: ["Import Italia, Danemarca, Grecia", "Piese iconice de design", "Canapele și fotolii premium", "Mese și scaune de dining", "Corpuri de iluminat designer"],
  },
];

const processSteps = [
  {
    step: "1",
    title: "Consultare inițială",
    desc: "Analizăm cerințele proiectului, stilul dorit și particularitățile spațiului. Prima consultare este gratuită.",
  },
  {
    step: "2",
    title: "Măsurători și concept",
    desc: "Efectuăm măsurătorile exacte la fața locului și dezvoltăm conceptul de design personalizat.",
  },
  {
    step: "3",
    title: "Proiect tehnic",
    desc: "Realizăm proiectul tehnic complet cu dimensiuni, materiale, finisaje și accesorii specificate.",
  },
  {
    step: "4",
    title: "Producție în atelier",
    desc: "Piesele sunt executate în atelierul propriu cu tehnologie modernă CNC și finisaje premium controlate.",
  },
  {
    step: "5",
    title: "Montaj și finisare",
    desc: "Montaj profesionist la fața locului cu verificare finală a fiecărui detaliu și reglaj de precizie.",
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

      {/* ============== SERVICES DETAILED ============== */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6rem",
            }}
          >
            {services.map((service, i) => (
              <div
                key={i}
                className="reveal"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "3rem",
                  alignItems: "center",
                }}
              >
                {/* Alternating layout via CSS order */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "3rem",
                    alignItems: "center",
                  }}
                  className="about-grid"
                >
                  {/* Image */}
                  <div
                    style={{ order: i % 2 === 0 ? 2 : 1 }}
                    className={`reveal reveal-delay-${i % 3 + 1}`}
                  >
                    <div className="about-image-wrap">
                      <Image
                        src={service.image}
                        alt={service.title}
                        width={700}
                        height={480}
                        style={{
                          width: "100%",
                          height: "420px",
                          objectFit: "cover",
                        }}
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <div style={{ order: i % 2 === 0 ? 1 : 2 }}>
                    <p className="label" style={{ marginBottom: "0.75rem" }}>
                      {service.subtitle}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "3.5rem",
                          color: "var(--color-border-alt)",
                          fontWeight: 300,
                          lineHeight: 1,
                        }}
                      >
                        {service.num}
                      </span>
                      <h2
                        style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", lineHeight: 1.2 }}
                      >
                        {service.title}
                      </h2>
                    </div>
                    <span className="gold-line" />
                    <p style={{ marginBottom: "1.75rem" }}>{service.desc}</p>

                    {/* Details list */}
                    <ul
                      style={{
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                        marginBottom: "2rem",
                      }}
                    >
                      {service.details.map((detail, j) => (
                        <li
                          key={j}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            fontSize: "0.875rem",
                            color: "var(--color-fg-muted)",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              width: "1.5rem",
                              height: "1px",
                              background: "var(--color-gold)",
                              flexShrink: 0,
                            }}
                          />
                          {detail}
                        </li>
                      ))}
                    </ul>

                    <Link href="/contact" className="btn btn-outline">
                      Solicită ofertă
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== PROCESS ============== */}
      <section className="section" style={{ background: "var(--color-bg-alt)" }}>
        <div className="container">
          <div
            className="section-header reveal"
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <p className="label" style={{ marginBottom: "1rem" }}>
              Cum lucrăm
            </p>
            <h2>Etapele unui proiect</h2>
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "2px",
              background: "var(--color-border)",
            }}
          >
            {processSteps.map((item, i) => (
              <div
                key={i}
                className={`service-card reveal reveal-delay-${(i % 3) + 1}`}
                style={{
                  background: "var(--color-bg)",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
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
                    marginBottom: "0.5rem",
                    flexShrink: 0,
                  }}
                >
                  {item.step}
                </div>
                <h4
                  style={{
                    color: "var(--color-fg)",
                    fontSize: "1rem",
                    fontWeight: 500,
                  }}
                >
                  {item.title}
                </h4>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--color-fg-subtle)",
                    textAlign: "center",
                    maxWidth: "100%",
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== MONTAJ IMAGE ============== */}
      <section
        style={{
          position: "relative",
          height: "50vh",
          minHeight: "350px",
          overflow: "hidden",
        }}
      >
        <Image
          src="/images-scraped/montaj.jpg"
          alt="Montaj profesionist mobilier Moodilier"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          unoptimized
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(31,29,26,0.9) 0%, rgba(31,29,26,0.4) 100%)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div className="container">
            <p className="label" style={{ marginBottom: "1rem" }}>
              Montaj profesionist
            </p>
            <h2 style={{ marginBottom: "1rem", maxWidth: "500px" }}>
              Fiecare detaliu contează
            </h2>
            <p style={{ maxWidth: "45ch", marginBottom: "2rem" }}>
              Echipa noastră de montaj are experiență în proiecte rezidențiale
              și comerciale complexe, respectând cu strictețe planul tehnic și
              termenele convenite.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Programează o consultare
              <ArrowRight size={14} />
            </Link>
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
