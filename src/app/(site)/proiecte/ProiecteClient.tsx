"use client";

import { useState, useMemo, useRef, useEffect, type CSSProperties } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SitePageHero from "@/components/site/SitePageHero";
import SiteCTA from "@/components/site/SiteCTA";
import AwardsProjectCard from "@/components/site/AwardsProjectCard";
import { ROOM_FILTERS, type SiteProject } from "@/lib/projects";
import { galleryRoomId } from "@/lib/room-anchor";

const CATEGORIES = [
  "Toate",
  ...ROOM_FILTERS.filter((r) => r !== "Hol"),
  "Comercial",
] as const;
type Category = (typeof CATEGORIES)[number];

/** Canonical room labels so CMS variants still match filters. */
function normalizeRoomLabel(room: string): string {
  const key = room
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  const map: Record<string, string> = {
    bucatarii: "Bucătării",
    bucatarie: "Bucătării",
    kitchen: "Bucătării",
    living: "Living",
    livinguri: "Living",
    dressing: "Dressing",
    dressinguri: "Dressing",
    dormitoare: "Dormitoare",
    dormitor: "Dormitoare",
    bedroom: "Dormitoare",
    bai: "Băi",
    baie: "Băi",
    bath: "Băi",
    bathroom: "Băi",
    hol: "Hol",
    hallway: "Hol",
  };
  if (map[key]) return map[key];
  for (const [k, v] of Object.entries(map)) {
    if (key.includes(k)) return v;
  }
  return room.trim();
}

function projectRoomTags(p: SiteProject): string[] {
  const fromRooms = (p.rooms || []).map(normalizeRoomLabel);
  const fromGallery = (p.gallery || []).map((g) => normalizeRoomLabel(g.room));
  const fromSpaces = (p.spaces || []).map(normalizeRoomLabel);
  return [
    ...new Set(
      [...fromRooms, ...fromGallery, ...fromSpaces].filter(
        (r) => r && r !== "Altele" && CATEGORIES.includes(r as Category)
      )
    ),
  ];
}

function matchesProjectFilter(p: SiteProject, filter: Category): boolean {
  if (filter === "Toate") return true;
  if (filter === "Comercial") {
    return (
      (/comercial/i.test(p.category) || /comercial/i.test(p.projectType || "")) &&
      !/showroom/i.test(p.slug)
    );
  }
  return projectRoomTags(p).includes(filter);
}

function projectHref(slug: string, filter: Category): string {
  if (filter === "Toate" || filter === "Comercial") {
    return `/proiecte/${slug}`;
  }
  return `/proiecte/${slug}#${galleryRoomId(filter)}`;
}

function parseCategoryParam(raw: string | null): Category {
  if (!raw) return "Toate";
  const decoded = decodeURIComponent(raw).trim();
  const hit = CATEGORIES.find(
    (c) => c.toLowerCase() === decoded.toLowerCase() || normalizeRoomLabel(decoded) === c
  );
  return hit || "Toate";
}

export default function ProiecteClient({
  projects,
}: {
  projects: SiteProject[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initial = parseCategoryParam(
    searchParams.get("camera") || searchParams.get("categorie")
  );
  const [activeCategory, setActiveCategory] = useState<Category>(initial);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const categoryChangeRef = useRef(false);

  useEffect(() => {
    const fromUrl = parseCategoryParam(
      searchParams.get("camera") || searchParams.get("categorie")
    );
    setActiveCategory(fromUrl);
  }, [searchParams]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => matchesProjectFilter(p, activeCategory));
  }, [activeCategory, projects]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      map[cat] = projects.filter((p) => matchesProjectFilter(p, cat)).length;
    }
    return map;
  }, [projects]);

  const visibleCategories = useMemo(() => {
    return CATEGORIES.filter((cat) => {
      if (cat === "Toate") return true;
      return (counts[cat] ?? 0) > 0;
    });
  }, [counts]);

  useEffect(() => {
    const idx = visibleCategories.indexOf(activeCategory);
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
  }, [activeCategory, projects, visibleCategories]);

  useEffect(() => {
    if (!visibleCategories.includes(activeCategory)) {
      setActiveCategory("Toate");
    }
  }, [visibleCategories, activeCategory]);

  useEffect(() => {
    if (!categoryChangeRef.current) return;
    categoryChangeRef.current = false;
    const bar = filterBarRef.current;
    if (bar) {
      const top = bar.getBoundingClientRect().top + window.scrollY - 8;
      window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [activeCategory]);

  function selectCategory(cat: Category) {
    if (cat === activeCategory) return;
    categoryChangeRef.current = true;
    setActiveCategory(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "Toate") params.delete("camera");
    else params.set("camera", cat);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <>
      <SitePageHero
        label="Portofoliu"
        title="Proiecte"
        subtitle="Fiecare proiect Moodilier este construit în jurul unui proces clar, atent planificat și executat cu precizie. De la analiza inițială a spațiului și dezvoltarea proiectului tehnic, până la producție, montaj și controlul final, fiecare etapă este gândită pentru a livra mobilier premium la comandă, realizat impecabil în fiecare detaliu."
        bgImage="/projects/villa-06/01.living.cover.webp"
        overlayOpacity={0.52}
      />

      <div className="aw-filter-bar" ref={filterBarRef}>
        <div className="aw-container">
          <div
            ref={tabsRef}
            className="aw-filter-tabs"
            role="tablist"
            aria-label="Categorii proiecte"
          >
            {visibleCategories.map((cat, idx) => (
              <button
                key={cat}
                ref={(el) => {
                  buttonRefs.current[idx] = el;
                }}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                className={`aw-filter-tab${activeCategory === cat ? " is-active" : ""}`}
                onClick={() => selectCategory(cat)}
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

      <section className="aw-portfolio aw-page-section" aria-label="Listă proiecte">
        <div className="aw-container">
          <div className="aw-portfolio-grid">
            {filteredProjects.map((project) => {
              const tags = projectRoomTags(project);
              return (
                <AwardsProjectCard
                  key={project.slug}
                  title={project.title}
                  category={project.category}
                  tags={tags}
                  activeTag={activeCategory === "Toate" ? null : activeCategory}
                  image={project.coverImage || "/projects/villa-06/01.living.cover.webp"}
                  href={projectHref(project.slug, activeCategory)}
                  video={project.video || null}
                />
              );
            })}
          </div>

          {filteredProjects.length === 0 && (
            <p className="aw-body" style={{ textAlign: "center", padding: "4rem 0" }}>
              Niciun proiect în această categorie.
            </p>
          )}
        </div>
      </section>

      <SiteCTA
        title="Transformăm viziunea ta în mobilier premium"
        body="Dorești un proiect similar? Contactează-ne pentru consultanță și o ofertă personalizată."
      />
    </>
  );
}
