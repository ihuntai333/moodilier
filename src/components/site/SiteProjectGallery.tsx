"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { ProjectImage } from "@/lib/projects";

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

  const valid = items.filter((g) => !broken.has(g.url));
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
    // Single unlabelled dump if everything is Altele
    if (keys.length === 1 && keys[0] === "Altele") {
      return [{ room: null as string | null, images: map.get("Altele")! }];
    }
    return keys.map((room) => ({
      room: room === "Altele" ? "Alte spații" : room,
      images: map.get(room)!,
    }));
  }, [items, broken]);

  return (
    <>
      <div className="aw-gallery-head">
        <p className="aw-label" style={{ textAlign: "left", width: "auto" }}>
          Galerie
        </p>
        <span className="aw-gallery-count">{valid.length} fotografii</span>
      </div>

      {sections.map((section) => (
        <div key={section.room || "all"} className="aw-gallery-section">
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
                    sizes="(max-width: 700px) 100vw, 50vw"
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
      ))}

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
