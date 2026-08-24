import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SitePageHero from "@/components/site/SitePageHero";
import SiteCTA from "@/components/site/SiteCTA";
import SiteProjectGallery from "@/components/site/SiteProjectGallery";
import JsonLd from "@/components/JsonLd";
import {
  getProjectBySlug,
  getPublishedProjects,
  getProjectSlugs,
} from "@/lib/projects";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return { title: "Proiect negăsit | Moodilier" };
  }
  return {
    title: `${project.title} | Moodilier`,
    description:
      project.description ||
      `Proiect Moodilier — mobilier premium la comandă. ${project.images.length} fotografii.`,
    openGraph: {
      title: `${project.title} | Moodilier`,
      description:
        project.description ||
        `Proiect Moodilier — mobilier premium la comandă.`,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, all] = await Promise.all([
    getProjectBySlug(slug),
    getPublishedProjects(),
  ]);
  if (!project) notFound();

  const projectIndex = all.findIndex((p) => p.slug === slug);
  const prevProject = projectIndex > 0 ? all[projectIndex - 1] : null;
  const nextProject =
    projectIndex >= 0 && projectIndex < all.length - 1
      ? all[projectIndex + 1]
      : null;

  const heroVideo = project.video || null;
  const galleryImages = project.images.length
    ? project.images
    : project.coverImage
      ? [project.coverImage]
      : [];
  const gallery =
    project.gallery?.length
      ? project.gallery
      : galleryImages.map((url) => ({ url, room: "Altele" }));
  const projectUrl = `https://moodilier.ro/proiecte/${project.slug}`;

  return (
    <>
      <JsonLd
        type="project"
        data={{
          title: project.title,
          description: project.description || undefined,
          image: project.coverImage || undefined,
          breadcrumbs: [{ name: project.title, url: projectUrl }],
        }}
      />

      <SitePageHero
        label={project.rooms?.[0] || project.category}
        title={project.title}
        subtitle={project.description || undefined}
        bgImage={
          project.coverImage ||
          "/projects/villa-06/01.living.cover.webp"
        }
        bgVideo={heroVideo}
        overlayOpacity={0.45}
      />

      {gallery.length > 0 && (
        <section className="aw-page-section">
          <div className="aw-container">
            <SiteProjectGallery
              gallery={gallery}
              images={galleryImages}
              title={project.title}
            />
          </div>
        </section>
      )}

      <section aria-label="Detalii proiect">
        <div className="aw-container">
          <div className="aw-detail-strip">
            <div className="aw-detail-cell">
              <p className="aw-label">Categorie</p>
              <p className="aw-detail-value">{project.category}</p>
            </div>
            {project.rooms?.length ? (
              <div className="aw-detail-cell">
                <p className="aw-label">Spații</p>
                <p className="aw-detail-value">{project.rooms.join(" · ")}</p>
              </div>
            ) : project.location ? (
              <div className="aw-detail-cell">
                <p className="aw-label">Locație</p>
                <p className="aw-detail-value">{project.location}</p>
              </div>
            ) : (
              <div className="aw-detail-cell">
                <p className="aw-label">Execuție</p>
                <p className="aw-detail-value">Atelier București</p>
              </div>
            )}
            <div className="aw-detail-cell">
              <p className="aw-label">Fotografii</p>
              <p className="aw-detail-value">{gallery.length}</p>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="Navigare proiecte">
        <div className="aw-container aw-project-nav">
          {prevProject ? (
            <Link href={`/proiecte/${prevProject.slug}`}>
              <ArrowLeft size={16} />
              <span>
                <span className="aw-label">Anterior</span>
                <span className="aw-project-nav-title">{prevProject.title}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {nextProject ? (
            <Link href={`/proiecte/${nextProject.slug}`} className="is-next">
              <span>
                <span className="aw-label">Următor</span>
                <span className="aw-project-nav-title">{nextProject.title}</span>
              </span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </nav>

      <SiteCTA
        title="Îți place ce vezi?"
        body="Hai să discutăm despre spațiul tău — îți oferim consultanță și o propunere personalizată."
        primaryLabel="Solicită o ofertă"
        secondaryLabel="Toate proiectele"
        secondaryHref="/proiecte"
      />
    </>
  );
}
