import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import SitePageHero from "@/components/site/SitePageHero";
import SiteCTA from "@/components/site/SiteCTA";
import JsonLd from "@/components/JsonLd";
import {
  servicesIntro,
  mainServices,
  atelierServices,
} from "@/data/services-content";

export const metadata: Metadata = {
  title: "Servicii | Moodilier",
  description:
    "Servicii complete Moodilier: proiectare 3D, mobilier la comandă, Moodilier Store, prelucrare CNC, vopsitorie MDF și termoformare — atelier propriu în București.",
  openGraph: {
    title: "Servicii | Moodilier",
    description:
      "De la concept și proiectare 3D până la execuție, finisare și montaj — totul în atelierul Moodilier din București.",
    images: ["/projects/villa-01/01.bucatarii.cover.webp"],
  },
};

const mainExtended = [
  {
    ...mainServices[0],
    points: [
      "Concept & Mood Board",
      "Randare 3D realistă",
      "Proiect tehnic detaliat",
      "Consultanță gratuită",
    ],
  },
  {
    ...mainServices[1],
    points: [
      "Bucătării, dressinguri, livinguri",
      "MDF vopsit & furnir premium",
      "Hardware european",
      "Măsurare, livrare și montaj",
    ],
  },
  {
    ...mainServices[2],
    points: [
      "Mărci europene selectate",
      "Disponibil în showroom",
      "Livrare & montaj",
      "Garanție producător",
    ],
  },
] as const;

const processSteps = [
  {
    step: "01",
    title: "Ofertarea proiectului",
    desc: "Analizăm cerințele, stilul dorit și particularitățile spațiului — ofertă personalizată, adaptată nevoilor și bugetului.",
  },
  {
    step: "02",
    title: "Relevarea spațiului",
    desc: "Măsurători exacte și verificări tehnice pentru ca proiectul să fie executat cu precizie.",
  },
  {
    step: "03",
    title: "Dezvoltarea proiectului",
    desc: "Soluții tehnice și funcționale, optimizate pentru integrarea perfectă în spațiu.",
  },
  {
    step: "04",
    title: "Proiectare & documentare",
    desc: "Proiect tehnic complet: dimensiuni, materiale, finisaje și accesorii.",
  },
  {
    step: "05",
    title: "Execuție în atelier",
    desc: "Producție CNC modernă și control riguros al calității la fiecare etapă.",
  },
  {
    step: "06",
    title: "Livrare & montaj",
    desc: "Livrare și montaj cu precizie — verificăm fiecare detaliu înainte de recepție.",
  },
];

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

      <section className="svc-intro">
        <div className="aw-container svc-intro-inner">
          <p className="aw-label">Ce oferim</p>
          <h2 className="svc-intro-title">
            {servicesIntro.title}{" "}
            <span>design interior, mobilier premium și prelucrări personalizate.</span>
          </h2>
          <div className="svc-intro-body">
            {servicesIntro.body.split("\n\n").map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </div>
          <nav className="svc-jump" aria-label="Servicii atelier">
            {atelierServices.map((s) => (
              <Link key={s.slug} href={s.href} className="svc-jump-link">
                {s.title.replace(/^Servicii\s+/i, "")}
                <ArrowRight size={14} />
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section aria-label="Servicii principale" className="svc-list">
        {mainExtended.map((service, i) => (
          <article
            key={service.slug}
            id={service.slug}
            className={`aw-service-block${i % 2 === 1 ? " is-flip" : ""}`}
          >
            <div className="aw-service-media">
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="aw-service-copy">
              <p className="aw-label">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="aw-h3">{service.title}</h3>
              <p className="aw-body">{service.short}</p>
              <ul className="aw-service-points">
                {service.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <Link href="/contact" className="aw-btn aw-btn-primary aw-btn-fill">
                Solicită ofertă
                <ArrowRight size={14} />
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="svc-atelier" aria-labelledby="atelier-title">
        <div className="aw-container">
          <div className="svc-atelier-head">
            <p className="aw-label">Atelier</p>
            <h2 id="atelier-title" className="aw-h2">
              Servicii specializate
            </h2>
            <p className="aw-body">
              CNC, vopsitorie MDF și termoformare — pentru proiecte rezidențiale, comerciale și
              parteneri din industrie.
            </p>
          </div>
        </div>

        <div className="svc-atelier-grid aw-container">
          {atelierServices.map((service) => (
            <article key={service.slug} id={service.slug} className="svc-atelier-card">
              <div className="svc-atelier-media">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="svc-atelier-copy">
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <ul>
                  {service.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <Link href="/contact" className="aw-link-slide">
                  Solicită ofertă <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="svc-process" aria-labelledby="process-title">
        <div className="aw-container">
          <div className="svc-process-head">
            <p className="aw-label">Proces</p>
            <h2 id="process-title" className="aw-h2">
              Cum lucrăm
            </h2>
          </div>
          <ol className="svc-process-grid">
            {processSteps.map((s) => (
              <li key={s.step}>
                <span>{s.step}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SiteCTA
        title="Hai să lucrăm împreună"
        body="Spune-ne despre spațiul tău — pregătim o ofertă clară, cu materiale, termene și montaj incluse."
        primaryLabel="Solicită o ofertă gratuită"
        secondaryLabel="Descoperă portofoliul"
      />
    </>
  );
}
