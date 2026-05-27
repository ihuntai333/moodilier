import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowLeft, ChevronRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { projects } from "@/data/projects-clean";

// ── Static params ────────────────────────────────────────────
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// ── Dynamic metadata ─────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) {
    return { title: "Proiect negăsit | Moodilier" };
  }
  return {
    title: `${project.title} | Moodilier`,
    description:
      project.description ||
      `Proiect Moodilier — mobilier premium la comandă. ${project.images.length} fotografii.`,
    openGraph: {
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

// ── Page ─────────────────────────────────────────────────────
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const projectIndex = projects.findIndex((p) => p.slug === slug);
  if (projectIndex === -1) notFound();

  const project = projects[projectIndex];
  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject =
    projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <PageHero
        label={project.category}
        title={project.title}
        subtitle={project.description || undefined}
        bgImage={
          project.coverImage ||
          "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg"
        }
        overlayOpacity={0.55}
        align="left"
      />

      {/* ── Breadcrumb ───────────────────────────────────────── */}
      <div
        style={{
          background: "var(--color-bg-alt)",
          borderBottom: "1px solid var(--color-border)",
          padding: "0.85rem 0",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.7rem",
            color: "var(--color-fg-subtle)",
            letterSpacing: "0.1em",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              color: "var(--color-fg-subtle)",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-gold)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-fg-subtle)")
            }
          >
            Acasă
          </Link>
          <ChevronRight size={12} style={{ flexShrink: 0 }} />
          <Link
            href="/proiecte"
            style={{
              color: "var(--color-fg-subtle)",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--color-gold)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--color-fg-subtle)")
            }
          >
            Proiecte
          </Link>
          <ChevronRight size={12} style={{ flexShrink: 0 }} />
          <span style={{ color: "var(--color-gold)" }}>{project.title}</span>
        </div>
      </div>

      {/* ── Gallery ──────────────────────────────────────────── */}
      {project.images.length > 0 && (
        <section
          style={{
            padding: "4rem 0 5rem",
            background: "var(--color-bg)",
          }}
        >
          <div className="container">
            {/* Section header */}
            <div style={{ marginBottom: "2.5rem" }}>
              <p className="label" style={{ marginBottom: "0.5rem" }}>
                Galerie fotografii
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                    fontWeight: 400,
                  }}
                >
                  {project.title}
                </h2>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--color-fg-subtle)",
                    letterSpacing: "0.1em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {project.images.length} fotografii
                </span>
              </div>
              {project.description && (
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--color-fg-muted)",
                    marginTop: "1rem",
                    maxWidth: "70ch",
                    lineHeight: 1.7,
                  }}
                >
                  {project.description}
                </p>
              )}
            </div>

            {/* 3-col masonry grid */}
            <div
              style={{
                columnCount: 3,
                columnGap: "4px",
              }}
              className="gallery-masonry"
            >
              {project.images.map((img, i) => (
                <div
                  key={i}
                  style={{
                    breakInside: "avoid",
                    marginBottom: "4px",
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: i % 5 === 0 ? "3/4" : i % 3 === 0 ? "16/9" : "4/3",
                    background: "var(--color-surface)",
                  }}
                  className="gallery-item"
                >
                  <Image
                    src={img}
                    alt={`${project.title} — fotografie ${i + 1}`}
                    fill
                    unoptimized
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Responsive gallery styles */}
          <style>{`
            @media (max-width: 767px) {
              .gallery-masonry { column-count: 1 !important; }
            }
            @media (min-width: 768px) and (max-width: 1023px) {
              .gallery-masonry { column-count: 2 !important; }
            }
            .gallery-item { transition: transform 0.4s ease; cursor: zoom-in; }
            .gallery-item:hover { transform: scale(1.01); z-index: 1; }
          `}</style>
        </section>
      )}

      {/* ── Prev / Next navigation ───────────────────────────── */}
      <nav
        style={{
          background: "var(--color-bg-alt)",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1px",
            background: "var(--color-border)",
          }}
        >
          {/* Previous */}
          {prevProject ? (
            <Link
              href={`/proiecte/${prevProject.slug}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.75rem 2rem",
                background: "var(--color-bg-alt)",
                transition: "background 0.3s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--color-surface)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--color-bg-alt)")
              }
            >
              <ArrowLeft
                size={20}
                style={{ color: "var(--color-gold)", flexShrink: 0 }}
              />
              <div>
                <p
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--color-fg-subtle)",
                    marginBottom: "0.3rem",
                  }}
                >
                  Proiect anterior
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1rem",
                    color: "var(--color-fg)",
                    lineHeight: 1.2,
                  }}
                >
                  {prevProject.title}
                </p>
              </div>
            </Link>
          ) : (
            <div
              style={{
                padding: "1.75rem 2rem",
                background: "var(--color-bg-alt)",
              }}
            />
          )}

          {/* Next */}
          {nextProject ? (
            <Link
              href={`/proiecte/${nextProject.slug}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "1rem",
                padding: "1.75rem 2rem",
                background: "var(--color-bg-alt)",
                transition: "background 0.3s",
                textDecoration: "none",
                textAlign: "right",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--color-surface)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--color-bg-alt)")
              }
            >
              <div>
                <p
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--color-fg-subtle)",
                    marginBottom: "0.3rem",
                  }}
                >
                  Proiect următor
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1rem",
                    color: "var(--color-fg)",
                    lineHeight: 1.2,
                  }}
                >
                  {nextProject.title}
                </p>
              </div>
              <ArrowRight
                size={20}
                style={{ color: "var(--color-gold)", flexShrink: 0 }}
              />
            </Link>
          ) : (
            <div
              style={{
                padding: "1.75rem 2rem",
                background: "var(--color-bg-alt)",
              }}
            />
          )}
        </div>
      </nav>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <p className="label" style={{ marginBottom: "1.5rem" }}>
            Solicită o ofertă
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
              Toate proiectele
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
