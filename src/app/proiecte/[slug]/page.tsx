import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft, ChevronRight, Images, MapPin, Tag } from "lucide-react";
import PageHero from "@/components/PageHero";
import GalleryClient from "@/components/GalleryClient";
import { projects } from "@/data/projects-clean";
import PageRevealAnimations from "@/components/PageRevealAnimations";

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

  const hasLocation = Boolean(project.location);
  const detailCols = hasLocation ? "1fr 1px 1fr 1px 1fr" : "1fr 1px 1fr";

  return (
    <>
      <PageRevealAnimations />
      {/* ── Hero ─────────────────────────────────────────────── */}
      <PageHero
        label={project.category}
        title={project.title}
        subtitle={project.description || undefined}
        bgImage={
          project.coverImage ||
          "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg"
        }
        overlayOpacity={0.5}
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
          <Link href="/" className="breadcrumb-link">
            Acasă
          </Link>
          <ChevronRight size={12} style={{ flexShrink: 0 }} />
          <Link href="/proiecte" className="breadcrumb-link">
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
            padding: "4rem 0 2rem",
            background: "var(--color-bg)",
          }}
        >
          <div className="container">
            <GalleryClient images={project.images} title={project.title} />
          </div>
        </section>
      )}

      {/* ── Project details strip ─────────────────────────────── */}
      <section
        style={{
          background: "var(--color-bg-alt)",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
          padding: "2.5rem 0",
        }}
      >
        <div className="container">
          <div
            className="project-details-strip"
            style={{
              display: "grid",
              gridTemplateColumns: detailCols,
              gap: 0,
              alignItems: "center",
            }}
          >
            {/* Category */}
            <div style={{ textAlign: "center", padding: "0 2rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginBottom: "0.4rem",
                }}
              >
                <Tag size={14} style={{ color: "var(--color-gold)" }} />
                <span
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--color-fg-subtle)",
                  }}
                >
                  Categorie
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  fontWeight: 400,
                  color: "var(--color-fg)",
                }}
              >
                {project.category}
              </p>
            </div>

            {/* Gold separator */}
            <div
              style={{
                width: "1px",
                height: "3rem",
                background: "var(--color-border)",
              }}
            />

            {/* Location (conditional) */}
            {hasLocation && (
              <>
                <div style={{ textAlign: "center", padding: "0 2rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <MapPin size={14} style={{ color: "var(--color-gold)" }} />
                    <span
                      style={{
                        fontSize: "0.6rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "var(--color-fg-subtle)",
                      }}
                    >
                      Locație
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.1rem",
                      fontWeight: 400,
                      color: "var(--color-fg)",
                    }}
                  >
                    {project.location}
                  </p>
                </div>

                {/* Gold separator */}
                <div
                  style={{
                    width: "1px",
                    height: "3rem",
                    background: "var(--color-border)",
                  }}
                />
              </>
            )}

            {/* Photo count */}
            <div style={{ textAlign: "center", padding: "0 2rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginBottom: "0.4rem",
                }}
              >
                <Images size={14} style={{ color: "var(--color-gold)" }} />
                <span
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--color-fg-subtle)",
                  }}
                >
                  Fotografii
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  fontWeight: 400,
                  color: "var(--color-fg)",
                }}
              >
                {project.images.length}
              </p>
            </div>
          </div>
        </div>

        {/* Details strip + nav + breadcrumb styles */}
        <style>{`
          @media (max-width: 767px) {
            .project-details-strip {
              grid-template-columns: 1fr !important;
              gap: 1.5rem !important;
            }
            .project-details-strip > div[style*="width: 1px"] {
              display: none;
            }
          }
          .breadcrumb-link {
            color: var(--color-fg-subtle);
            transition: color 0.3s;
            text-decoration: none;
          }
          .breadcrumb-link:hover { color: var(--color-gold); }
          .project-nav-link:hover { background: var(--color-surface) !important; }
        `}</style>
      </section>

      {/* ── Prev / Next navigation ───────────────────────────── */}
      <nav
        style={{
          background: "var(--color-bg-alt)",
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
              className="project-nav-link"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.75rem 2rem",
                background: "var(--color-bg-alt)",
                transition: "background 0.3s",
                textDecoration: "none",
              }}
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
              className="project-nav-link"
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
