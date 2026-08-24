"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import SitePageHero from "@/components/site/SitePageHero";
import SiteCTA from "@/components/site/SiteCTA";
import AwardsProjectCard from "@/components/site/AwardsProjectCard";
import { ROOM_FILTERS, type SiteProject } from "@/lib/projects";

const CATEGORIES = [
  "Toate",
  ...ROOM_FILTERS.filter((r) => r !== "Hol"),
  "Comercial",
] as const;
type Category = (typeof CATEGORIES)[number];

function matchesFilter(p: SiteProject, filter: Category): boolean {
  if (filter === "Toate") return true;
  if (filter === "Comercial") {
    return (
      p.category === "Comercial" ||
      /showroom/i.test(p.slug) ||
      /showroom/i.test(p.title)
    );
  }
  if (p.rooms?.includes(filter)) return true;
  // Legacy exact category match (e.g. old "Bucătărie")
  const normalized = filter.replace(/ării$/i, "ărie").replace(/uri$/i, "");
  return (
    p.category === filter ||
    p.category === normalized ||
    p.category.toLowerCase().includes(filter.toLowerCase().slice(0, 5))
  );
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

  const filtered = useMemo(() => {
    return projects.filter((p) => matchesFilter(p, activeCategory));
  }, [activeCategory, projects]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      map[cat] = projects.filter((p) => matchesFilter(p, cat)).length;
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
              style={{ left: indicator.left, width: indicator.width }}
              aria-hidden
            />
          </div>
        </div>
      </div>

      <section className="aw-portfolio aw-page-section" aria-label="Listă proiecte">
        <div className="aw-container">
          <div className="aw-portfolio-grid">
            {filtered.map((project) => (
              <AwardsProjectCard
                key={project.slug}
                title={project.title}
                category={
                  activeCategory !== "Toate" && activeCategory !== "Comercial"
                    ? activeCategory
                    : project.rooms?.[0] || project.category
                }
                image={project.coverImage || "/projects/villa-06/01.living.cover.webp"}
                href={`/proiecte/${project.slug}`}
                video={project.video || null}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="aw-body" style={{ textAlign: "center", padding: "4rem 0" }}>
              Niciun proiect în această categorie.
            </p>
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
