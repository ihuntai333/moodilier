"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";
import PageHero from "@/components/PageHero";
import { projects } from "@/data/projects-clean";

const CATEGORIES = [
  "Toate",
  "Rezidențial",
  "Comercial",
  "Bucătărie",
  "Vizualizare 3D",
] as const;
type Category = (typeof CATEGORIES)[number];

export default function ProiectePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Toate");
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  // Animated sliding indicator
  useEffect(() => {
    const idx = CATEGORIES.indexOf(activeCategory);
    const btn = buttonRefs.current[idx];
    const container = tabsRef.current;
    if (btn && container) {
      const bRect = btn.getBoundingClientRect();
      const cRect = container.getBoundingClientRect();
      setIndicator({
        left: bRect.left - cRect.left + container.scrollLeft,
        width: bRect.width,
      });
    }
  }, [activeCategory]);

  // 3D card handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateZ(8px)`;
    e.currentTarget.style.boxShadow = `${-x * 20}px ${-y * 20}px 40px rgba(0,0,0,0.4)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform =
      "perspective(800px) rotateX(0) rotateY(0) translateZ(0)";
    e.currentTarget.style.boxShadow = "none";
  };

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
          position: "sticky",
          top: 0,
          zIndex: 90,
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg-alt)",
        }}
      >
        <div className="container">
          <div
            ref={tabsRef}
            style={{
              display: "flex",
              gap: 0,
              overflowX: "auto",
              scrollbarWidth: "none",
              position: "relative",
            }}
          >
            {CATEGORIES.map((cat, idx) => (
              <button
                key={cat}
                ref={(el) => {
                  buttonRefs.current[idx] = el;
                }}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "1.25rem 1.5rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color:
                    activeCategory === cat
                      ? "var(--color-gold)"
                      : "var(--color-fg-subtle)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.3s ease",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {cat}{" "}
                <span
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--color-fg-subtle)",
                    marginLeft: "0.25rem",
                  }}
                >
                  ({counts[cat] ?? 0})
                </span>
              </button>
            ))}

            {/* Animated gold sliding indicator */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: indicator.left,
                width: indicator.width,
                height: "2px",
                background: "var(--color-gold)",
                transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Projects uniform grid ─────────────────────────────────── */}
      <section className="section" style={{ paddingTop: "3rem" }}>
        <div className="container">
          <div
            className="projects-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
            }}
          >
            {filtered.map((project) => (
              <Link
                key={project.slug}
                href={`/proiecte/${project.slug}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  className="project-card"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    transition: "transform 0.4s ease, box-shadow 0.4s ease",
                    transformStyle: "preserve-3d",
                    cursor: "pointer",
                    height: "100%",
                  }}
                >
                  {/* Cover image */}
                  <div
                    className="project-card-img"
                    style={{
                      position: "relative",
                      aspectRatio: "4/3",
                      overflow: "hidden",
                    }}
                  >
                    {project.coverImage ? (
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        unoptimized
                        style={{
                          objectFit: "cover",
                          transition: "transform 0.5s ease",
                        }}
                        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "var(--color-bg)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--color-fg-subtle)",
                            fontSize: "0.75rem",
                          }}
                        >
                          Fără imagine
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card content */}
                  <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
                    {/* Category badge */}
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "var(--color-gold)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {project.category}
                    </span>

                    {/* Title */}
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.2rem",
                        fontWeight: 400,
                        color: "var(--color-fg)",
                        lineHeight: 1.25,
                        marginBottom: "0.6rem",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {project.title}
                    </h3>

                    {/* Description — 2 lines clamped */}
                    {project.description && (
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--color-fg-muted)",
                          lineHeight: 1.6,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          marginBottom: "0.85rem",
                        }}
                      >
                        {project.description}
                      </p>
                    )}

                    {/* Footer: photo count + arrow */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "auto",
                        paddingTop: project.description ? 0 : "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          color: "var(--color-fg-subtle)",
                        }}
                      >
                        <Images size={12} />
                        <span
                          style={{
                            fontSize: "0.68rem",
                            letterSpacing: "0.1em",
                          }}
                        >
                          {project.images.length} fotografii
                        </span>
                      </div>
                      <ArrowRight
                        size={14}
                        style={{ color: "var(--color-gold)" }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 0",
                color: "var(--color-fg-subtle)",
              }}
            >
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

      {/* ── Responsive styles ─────────────────────────────────────── */}
      <style>{`
        @media (max-width: 767px) {
          .projects-grid { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .project-card { transform-style: flat !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .projects-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* Image zoom on hover */
        .project-card:hover .project-card-img img {
          transform: scale(1.08);
        }

        /* Mobile touch shimmer */
        .project-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(201,169,132,0.08) 50%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          z-index: 1;
        }
        .project-card:active::after { opacity: 1; }

        @media (max-width: 767px) {
          .project-card { touch-action: pan-y; }
        }
      `}</style>
    </>
  );
}
