"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Images } from "lucide-react";
import PageHero from "@/components/PageHero";
import GatsbyProjectCard from "@/components/GatsbyProjectCard";
import PageRevealAnimations from "@/components/PageRevealAnimations";
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


  return (
    <>
      <PageRevealAnimations />
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
          <div className="gatsby-projects-grid">
            {filtered.map((project, i) => (
              <GatsbyProjectCard
                key={project.slug}
                title={project.title}
                category={project.category}
                image={project.coverImage || ""}
                href={`/proiecte/${project.slug}`}
                index={i}
                imageCount={project.images?.length}
                description={project.description || undefined}
              />
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
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Styles ─────────────────────────────────────────────── */}
      <style>{`
        /* ── Responsive grid ── */
        @media (max-width: 767px) {
          .projects-grid { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .project-card { transform-style: flat !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .projects-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* ── Image zoom on card hover ── */
        .project-card:hover .project-card-img img {
          transform: scale(1.08);
        }

        /* ── Gold overlay ── */
        .project-card .project-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(201,169,132,0) 0%,
            rgba(201,169,132,0.15) 50%,
            rgba(201,169,132,0) 100%
          );
          border: 1px solid rgba(201,169,132,0);
          transition: border-color 0.5s ease, background 0.5s ease;
          z-index: 2;
          pointer-events: none;
        }
        .project-card:hover .project-card-overlay {
          border-color: rgba(201,169,132,0.6);
          background: linear-gradient(
            135deg,
            rgba(201,169,132,0) 0%,
            rgba(201,169,132,0.12) 50%,
            rgba(201,169,132,0) 100%
          );
        }

        /* ── Gold corner accents ── */
        .project-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 0; height: 0;
          border-top: 2px solid var(--color-gold);
          border-left: 2px solid var(--color-gold);
          transition: width 0.4s ease 0.1s, height 0.4s ease;
          z-index: 3;
          pointer-events: none;
        }
        .project-card::after {
          content: '';
          position: absolute;
          bottom: 0; right: 0;
          width: 0; height: 0;
          border-bottom: 2px solid var(--color-gold);
          border-right: 2px solid var(--color-gold);
          transition: width 0.4s ease, height 0.4s ease 0.1s;
          z-index: 3;
          pointer-events: none;
        }
        .project-card:hover::before,
        .project-card:hover::after {
          width: 30px; height: 30px;
        }

        /* ── Arrow animate on hover ── */
        .card-arrow {
          transition: transform 0.3s ease, color 0.3s ease;
        }
        .project-card:hover .card-arrow {
          transform: translate(3px, -3px);
          color: var(--color-gold-light) !important;
        }

        /* ── Mobile touch active state ── */
        @media (max-width: 767px) {
          .project-card { touch-action: pan-y; }
          .project-card:active .project-card-overlay {
            border-color: rgba(201,169,132,0.5);
            background: rgba(201,169,132,0.1);
            transition: all 0.15s ease;
          }
          .project-card:active::before,
          .project-card:active::after {
            width: 20px; height: 20px;
            transition: width 0.15s, height 0.15s;
          }
        }
      `}</style>
    </>
  );
}
