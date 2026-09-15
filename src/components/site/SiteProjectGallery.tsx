"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { ProjectImage } from "@/lib/projects";
import { galleryRoomId } from "@/lib/room-anchor";

const ProjectLightbox = dynamic(() => import("@/components/ProjectLightbox"), {
  ssr: false,
});

const ROOM_ORDER = [
  "Bucătării",
  "Living",
  "Dressing",
  "Dormitoare",
  "Băi",
  "Hol",
  "Altele",
];

interface SiteProjectGalleryProps {
  images?: string[];
  gallery?: ProjectImage[];
  title: string;
}

export default function SiteProjectGallery({
  images = [],
  gallery,
  title,
}: SiteProjectGalleryProps) {
  const items: ProjectImage[] = useMemo(() => {
    if (gallery?.length) return gallery;
    return images.map((url) => ({ url, room: "Altele" }));
  }, [gallery, images]);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [broken, setBroken] = useState<Set<string>>(new Set());
  const openedFotoRef = useRef(false);

  const valid = useMemo(
    () => items.filter((g) => !broken.has(g.url)),
    [items, broken]
  );
  const sections = useMemo(() => {
    const map = new Map<string, ProjectImage[]>();
    for (const g of items) {
      if (broken.has(g.url)) continue;
      const room = g.room || "Altele";
      if (!map.has(room)) map.set(room, []);
      map.get(room)!.push(g);
    }
    const keys = [...map.keys()].sort((a, b) => {
      const ia = ROOM_ORDER.indexOf(a);
      const ib = ROOM_ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    if (keys.length === 1 && keys[0] === "Altele") {
      return [{ room: null as string | null, images: map.get("Altele")! }];
    }
    return keys.map((room) => ({
      room: room === "Altele" ? "Alte spații" : room,
      images: map.get(room)!,
    }));
  }, [items, broken]);

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    const foto =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("foto")
        : null;

    let tries = 0;
    let raf = 0;

    const scrollToHash = () => {
      if (!hash) return true;
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      }
      return false;
    };

    const openFoto = () => {
      if (!foto || openedFotoRef.current) return true;
      const idx = valid.findIndex((v) => v.url === foto);
      if (idx >= 0) {
        openedFotoRef.current = true;
        setLightboxIndex(idx);
        return true;
      }
      return false;
    };

    // Prefer opening the photo once gallery is ready; still scroll to room section
    const run = () => {
      const scrolled = !hash || scrollToHash();
      const opened = !foto || openFoto();
      return scrolled && opened;
    };

    if (run()) return;

    const tick = () => {
      tries += 1;
      if (run() || tries > 24) return;
      raf = window.setTimeout(tick, 50);
    };
    raf = window.setTimeout(tick, 50);
    return () => window.clearTimeout(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, valid.length]);

  return (
    <>
      <div className="aw-gallery-head">
        <p className="aw-label" style={{ textAlign: "left", width: "auto" }}>
          Galerie
        </p>
        <span className="aw-gallery-count">{valid.length} fotografii</span>
      </div>

      {sections.map((section) => {
        const sectionId = galleryRoomId(section.room);
        return (
          <div
            key={section.room || "all"}
            id={sectionId}
            className="aw-gallery-section"
            style={{ scrollMarginTop: "5.5rem" }}
          >
            {section.room ? (
              <h3 className="aw-gallery-room">{section.room}</h3>
            ) : null}
            <div className="aw-gallery-grid">
              {section.images.map((img, i) => {
                const flatIndex = valid.findIndex((v) => v.url === img.url);
                const isFeatured = i === 0 && sections[0] === section;

                return (
                  <button
                    key={img.url + i}
                    type="button"
                    className={`aw-gallery-item${isFeatured ? " is-featured" : ""}`}
                    onClick={() => setLightboxIndex(flatIndex >= 0 ? flatIndex : 0)}
                    aria-label={`Deschide fotografia ${flatIndex + 1} din ${title}`}
                  >
                    <Image
                      src={img.url}
                      alt={`${title}${section.room ? ` — ${section.room}` : ""} — fotografie ${i + 1}`}
                      fill
                      sizes="(max-width: 900px) 50vw, 33vw"
                      quality={90}
                      loading="lazy"
                      style={{ objectFit: "cover" }}
                      onError={() =>
                        setBroken((prev) => new Set([...prev, img.url]))
                      }
                    />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {lightboxIndex !== null && (
        <ProjectLightbox
          images={valid.map((v) => v.url)}
          initialIndex={lightboxIndex}
          projectTitle={title}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
