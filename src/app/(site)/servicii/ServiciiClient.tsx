"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FabricsOfferModal from "@/components/FabricsOfferModal";
import EditableMedia from "@/components/site/EditableMedia";
import {
  servicesIntro,
  mainServices,
  atelierServices,
} from "@/data/services-content";

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
      "Perdele & draperii custom",
      "Sisteme de umbrire",
      "Sine electrice",
      "Storuri romane",
    ],
  },
] as const;

export default function ServiciiClient() {
  const [fabricsOpen, setFabricsOpen] = useState(false);

  return (
    <>
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
        {mainExtended.map((service, i) => {
          const isDraperii = service.slug === "perdele-draperii";
          return (
            <article
              key={service.slug}
              id={service.slug}
              className={`aw-service-block${i % 2 === 1 ? " is-flip" : ""}`}
            >
              <EditableMedia
                className="aw-service-media"
                dataKey={`servicii.main.${service.slug}.image`}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              </EditableMedia>
              <div className="aw-service-copy">
                <p className="aw-label">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="aw-h3">{service.title}</h3>
                <p className="aw-body">{service.short}</p>
                <ul className="aw-service-points">
                  {service.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                {isDraperii ? (
                  <a
                    href="#perdele-draperii"
                    className="aw-btn aw-btn-primary aw-btn-fill"
                    onClick={(e) => {
                      e.preventDefault();
                      setFabricsOpen(true);
                    }}
                  >
                    Solicită ofertă
                    <ArrowRight size={14} />
                  </a>
                ) : (
                  <a href="/contact" className="aw-btn aw-btn-primary aw-btn-fill">
                    Solicită ofertă
                    <ArrowRight size={14} />
                  </a>
                )}
              </div>
            </article>
          );
        })}
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
              <EditableMedia
                className="svc-atelier-media"
                dataKey={`servicii.atelier.${service.slug}.image`}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </EditableMedia>
              <div className="svc-atelier-copy">
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <ul>
                  {service.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <a href="/contact" className="aw-link-slide">
                  Solicită ofertă <ArrowRight size={14} />
                </a>
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

      <FabricsOfferModal open={fabricsOpen} onClose={() => setFabricsOpen(false)} />
    </>
  );
}
