"use client";

import { useState, useMemo, useRef, useEffect, type CSSProperties } from "react";
import Image from "next/image";
import SitePageHero from "@/components/site/SitePageHero";
import SiteCTA from "@/components/site/SiteCTA";
import AwardsProjectCard from "@/components/site/AwardsProjectCard";
import { ROOM_FILTERS, type ProjectImage, type SiteProject } from "@/lib/projects";
import { galleryRoomId } from "@/lib/room-anchor";

const CATEGORIES = [
  "Toate",
  ...ROOM_FILTERS.filter((r) => r !== "Hol"),
  "Comercial",
] as const;
type Category = (typeof CATEGORIES)[number];

function isRoomCategory(filter: Category): boolean {
  return filter !== "Toate" && filter !== "Comercial";
}

function matchesProjectFilter(p: SiteProject, filter: Category): boolean {
  if (filter === "Toate") return true;
  if (filter === "Comercial") {
    return p.category === "Comercial" && !/showroom/i.test(p.slug);
  }
  if (p.rooms?.includes(filter)) return true;
  return p.gallery?.some((g) => g.room === filter) ?? false;
}

function projectHref(slug: string, filter: Category): string {
  if (filter === "Toate" || filter === "Comercial") {
    return `/proiecte/${slug}`;
  }
  return `/proiecte/${slug}#${galleryRoomId(filter)}`;
}

type RoomPhoto = {
  key: string;
  url: string;
  room: string;
  projectSlug: string;
  projectTitle: string;
  href: string;
};

function collectRoomPhotos(projects: SiteProject[], room: string): RoomPhoto[] {
  const out: RoomPhoto[] = [];
  for (const p of projects) {
    const imgs: ProjectImage[] =
      p.gallery?.length
        ? p.gallery
        : (p.images || []).map((url) => ({ url, room: "Altele" }));

    imgs.forEach((g, i) => {
      if (g.room !== room) return;
      out.push({
        key: `${p.slug}-${g.url}-${i}`,
        url: g.url,
        room: g.room,
        projectSlug: p.slug,
        projectTitle: p.title,
        href: `/proiecte/${p.slug}#${galleryRoomId(room)}`,
      });
    });
  }
  return out;
}

export default function ProiecteClient({
  projects = [],
}: {
  projects: SiteProject[];
}) {
  const [activeCategory, setActiveCategory] = useState<Category>("Toate");
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const roomMode = isRoomCategory(activeCategory);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => matchesProjectFilter(p, activeCategory));
  }, [activeCategory, projects]);

  const roomPhotos = useMemo(() => {
    if (!roomMode) return [];
    return collectRoomPhotos(projects, activeCategory);
  }, [activeCategory, projects, roomMode]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      if (isRoomCategory(cat)) {
        map[cat] = collectRoomPhotos(projects, cat).length;
      } else {
        map[cat] = projects.filter((p) => matchesProjectFilter(p, cat)).length;
      }
    }
    return map;
  }, [projects]);

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
  }, [activeCategory, projects]);

  return (
    <>
      <SitePageHero
        label="Portofoliu"
        title="Proiecte"
        subtitle="Fiecare proiect Moodilier este construit în jurul unui proces clar — de la analiză și proiectare până la montajul final, cu precizie de atelier."
        bgImage="/projects/villa-06/01.living.cover.webp"
        overlayOpacity={0.52}
      />

      <div className="aw-filter-bar">
        <div className="aw-container">
          <div
            ref={tabsRef}
            className="aw-filter-tabs"
            role="tablist"
            aria-label="Categorii proiecte"
          >
            {CATEGORIES.map((cat, idx) => (
              <button
                key={cat}
                ref={(el) => {
                  buttonRefs.current[idx] = el;
                }}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                className={`aw-filter-tab${activeCategory === cat ? " is-active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                <span>({counts[cat] ?? 0})</span>
              </button>
            ))}
            <div
              className="aw-filter-indicator"
              style={
                {
                  ["--aw-ind-x"]: `${indicator.left}px`,
                  ["--aw-ind-w"]: String(Math.max(1, indicator.width)),
                } as CSSProperties
              }
              aria-hidden
            />
          </div>
        </div>
      </div>

      <section
        className="aw-portfolio aw-page-section"
        aria-label={roomMode ? `Fotografii — ${activeCategory}` : "Listă proiecte"}
      >
        <div className="aw-container">
          {roomMode ? (
            <>
              <div className="aw-room-feed-head">
                <p className="aw-label" style={{ textAlign: "left", width: "auto", marginBottom: "0.5rem" }}>
                  Galerie pe tip de spațiu
                </p>
                <h2 className="aw-h2" style={{ margin: 0 }}>
                  {activeCategory}
                </h2>
                <p className="aw-body" style={{ marginTop: "0.75rem", maxWidth: "42ch" }}>
                  Toate fotografiile din proiecte pentru {activeCategory.toLowerCase()}. Click pe o
                  imagine pentru a deschide proiectul la secțiunea respectivă.
                </p>
              </div>

              <div className="aw-room-feed-grid">
                {roomPhotos.map((photo, i) => (
                  <a
                    key={photo.key}
                    href={photo.href}
                    className="aw-room-feed-item"
                    style={{ ["--aw-i" as string]: String(Math.min(i, 24)) } as CSSProperties}
                    aria-label={`${photo.projectTitle} — ${photo.room}`}
                  >
                    <Image
                      src={photo.url}
                      alt={`${photo.projectTitle} — ${photo.room}`}
                      fill
                      sizes="(max-width: 700px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    <span className="aw-room-feed-meta">
                      <span className="aw-room-feed-title">{photo.projectTitle}</span>
                      <span className="aw-room-feed-room">{photo.room}</span>
                    </span>
                  </a>
                ))}
              </div>

              {roomPhotos.length === 0 && (
                <p className="aw-body" style={{ textAlign: "center", padding: "4rem 0" }}>
                  Nicio fotografie în această categorie.
                </p>
              )}
            </>
          ) : (
            <>
              <div className="aw-portfolio-grid">
                {filteredProjects.map((project) => (
                  <AwardsProjectCard
                    key={project.slug}
                    title={project.title}
                    category={project.rooms?.[0] || project.category}
                    image={project.coverImage || "/projects/villa-06/01.living.cover.webp"}
                    href={projectHref(project.slug, activeCategory)}
                    video={project.video || null}
                  />
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <p className="aw-body" style={{ textAlign: "center", padding: "4rem 0" }}>
                  Niciun proiect în această categorie.
                </p>
              )}
            </>
          )}
        </div>
      </section>

      <SiteCTA
        title="Hai să lucrăm împreună"
        body="Dorești un proiect similar? Contactează-ne pentru consultanță și o ofertă personalizată."
        primaryLabel="Solicită o ofertă gratuită"
        secondaryLabel="Vezi serviciile"
        secondaryHref="/servicii"
      />
    </>
  );
}
