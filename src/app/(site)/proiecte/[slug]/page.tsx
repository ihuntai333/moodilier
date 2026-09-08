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
import { pageMetadata } from "@/lib/site-seo";

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
    return pageMetadata({
      path: `/proiecte/${slug}`,
      title: "Proiect negăsit",
      description: "Proiectul căutat nu a fost găsit.",
      noIndex: true,
    });
  }
  const title =
    project.seoTitle?.trim() ||
    `${project.title} – Mobilier la comandă | Moodilier`;
  const description =
    project.shortDescription?.trim() ||
    (project.description
      ? project.description.split(/\n\n+/)[0].trim().slice(0, 160)
      : "") ||
    `Proiect Moodilier — mobilier premium la comandă. ${project.images.length} fotografii.`;
  return pageMetadata({
    path: `/proiecte/${project.slug}`,
    title,
    description,
    image: project.coverImage || null,
    type: "article",
  });
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
        bgImage={
          project.coverImage ||
          "/projects/villa-06/01.living.cover.webp"
        }
        bgVideo={heroVideo}
        overlayOpacity={0.45}
      />

      {gallery.length > 0 && (
        <section className="aw-page-section aw-project-gallery-section">
          <div className="aw-container">
            <SiteProjectGallery
              gallery={gallery}
              images={galleryImages}
              title={project.title}
            />
          </div>
        </section>
      )}

      {project.description?.trim() ? (
        <section className="aw-page-section aw-project-story-section" aria-labelledby="aw-project-story">
          <div className="aw-container aw-project-story">
            <p className="aw-label">Despre proiect</p>
            <h2 id="aw-project-story" className="aw-h2">
              {project.title}
            </h2>
            <div className="aw-project-story-body">
              {project.description
                .split(/\n\n+/)
                .map((para) => para.trim())
                .filter(Boolean)
                .map((para) => (
                  <p key={para.slice(0, 48)} className="aw-body">
                    {para}
                  </p>
                ))}
            </div>
          </div>
        </section>
      ) : null}

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
                <p className="aw-detail-value">
                  {(project.spaces?.length ? project.spaces : project.rooms).join(" · ")}
                </p>
              </div>
            ) : null}
            {project.location?.trim() ? (
              <div className="aw-detail-cell">
                <p className="aw-label">Locație</p>
                <p className="aw-detail-value">{project.location.trim()}</p>
              </div>
            ) : null}
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
