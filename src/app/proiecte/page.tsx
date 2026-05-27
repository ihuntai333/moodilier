"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Images } from "lucide-react";
import PageHero from "@/components/PageHero";
import { projects } from "@/data/projects-clean";

const CATEGORIES = ["Toate", "Rezidențial", "Comercial", "Bucătărie", "Vizualizare 3D"] as const;
type Category = (typeof CATEGORIES)[number];

export default function ProiectePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Toate");

  const filtered = useMemo(() => {
    if (activeCategory === "Toate") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { Toate: projects.length };
    for (const cat of CATEGORIES.slice(1)) {
      map[cat] = projects.filter((p) => p.category === cat).length;
    }
    return map;
  }, []);

  return (
    <>
      <PageHero
        label="Portofoliu"
        title="Proiecte"
        subtitle="Fiecare proiect Moodilier este construit în jurul unui proces clar, atent planificat și executat cu precizie — de la analiza inițială până la montajul final."
        bgImage="/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg"
        overlayOpacity={0.6}
      />

      {/* ── Filter tabs ──────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-alt)",
          position: "sticky",
          top: 0,
          zIndex: 90,
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              gap: 0,
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "1.1rem 1.75rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color:
                    activeCategory === cat
                      ? "var(--color-gold)"
                      : "var(--color-fg-subtle)",
                  background: "none",
                  border: "none",
                  borderBottom:
                    activeCategory === cat
                      ? "2px solid var(--color-gold)"
                      : "2px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {cat}
                <span
                  style={{
                    marginLeft: "0.5rem",
                    fontSize: "0.6rem",
                    opacity: 0.6,
                    fontWeight: 400,
                  }}
                >
                  ({counts[cat] ?? 0})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Projects masonry grid ────────────────────────────────── */}
      <section className="section" style={{ paddingTop: "3rem" }}>
        <div className="container">
          <div
            style={{
              columnCount: 3,
              columnGap: "1px",
              background: "var(--color-border)",
            }}
            className="projects-masonry"
          >
            {filtered.map((project) => (
              <Link
                key={project.slug}
                href={`/proiecte/${project.slug}`}
                style={{
                  display: "block",
                  breakInside: "avoid",
                  marginBottom: "1px",
                  textDecoration: "none",
                }}
              >
                <article
                  className="project-card-new"
                  style={{
                    background: "var(--color-bg)",
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  {/* Cover image */}
                  <div
                    style={{ position: "relative", aspectRatio: "4/3" }}
                    className="img-overlay"
                  >
                    {project.coverImage ? (
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "var(--color-surface)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ color: "var(--color-fg-subtle)", fontSize: "0.75rem" }}>
                          Fără imagine
                        </span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="img-overlay-content">
                      <p className="project-card-cat">{project.category}</p>
                      <h3
                        className="project-card-title"
                        style={{ fontSize: "1.15rem" }}
                      >
                        {project.title}
                      </h3>
                      {project.location && (
                        <p
                          style={{
                            fontSize: "0.7rem",
                            color: "var(--color-fg-muted)",
                            marginTop: "0.25rem",
                          }}
                        >
                          {project.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.6rem",
                        gap: "1rem",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Category badge */}
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "var(--color-bg)",
                            background: "var(--color-gold)",
                            padding: "0.2rem 0.6rem",
                            marginBottom: "0.6rem",
                          }}
                        >
                          {project.category}
                        </span>
                        <h3
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.1rem",
                            fontWeight: 400,
                            color: "var(--color-fg)",
                            lineHeight: 1.2,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {project.title}
                        </h3>
                      </div>
                      <ArrowUpRight
                        size={16}
                        style={{
                          color: "var(--color-gold)",
                          flexShrink: 0,
                          marginTop: "0.25rem",
                        }}
                      />
                    </div>

                    {project.description && (
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--color-fg-subtle)",
                          lineHeight: 1.6,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          maxWidth: "100%",
                        }}
                      >
                        {project.description}
                      </p>
                    )}

                    {/* Photo count */}
                    {project.images.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          marginTop: "0.75rem",
                          color: "var(--color-fg-subtle)",
                        }}
                      >
                        <Images size={12} />
                        <span style={{ fontSize: "0.68rem", letterSpacing: "0.1em" }}>
                          {project.images.length} fotografii
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--color-fg-subtle)" }}>
              <p>Niciun proiect în această categorie.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
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
            Dorești un proiect similar?
          </h2>
          <p
            style={{
              maxWidth: "50ch",
              margin: "0 auto 2.5rem",
              textAlign: "center",
            }}
          >
            Contactează-ne și hai să discutăm despre viziunea ta. Oferim
            consultanță gratuită și ofertă personalizată.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Solicită o ofertă gratuită
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Masonry responsive styles */}
      <style>{`
        @media (max-width: 767px) {
          .projects-masonry { column-count: 1 !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .projects-masonry { column-count: 2 !important; }
        }
        .project-card-new { transition: opacity 0.2s ease; }
        .project-card-new:hover { opacity: 0.92; }
      `}</style>
    </>
  );
}
