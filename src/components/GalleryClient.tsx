"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const ProjectLightbox = dynamic(
  () => import("@/components/ProjectLightbox"),
  { ssr: false }
);

interface GalleryClientProps {
  images: string[];
  title: string;
}

export default function GalleryClient({ images, title }: GalleryClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleItemMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.borderBottomColor = "var(--color-gold)";
    const img = el.querySelector("img") as HTMLImageElement | null;
    if (img) {
      img.style.transform = "scale(1.04)";
      img.style.filter = "brightness(1.05)";
    }
  };

  const handleItemMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.borderBottomColor = "var(--color-border)";
    const img = el.querySelector("img") as HTMLImageElement | null;
    if (img) {
      img.style.transform = "scale(1)";
      img.style.filter = "brightness(1)";
    }
  };

  return (
    <>
      {/* Gallery section label */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "0.5rem",
          }}
        >
          <p
            className="label"
            style={{ margin: 0, letterSpacing: "0.2em" }}
          >
            Galerie fotografii
          </p>
          <span
            style={{
              fontSize: "0.65rem",
              color: "var(--color-fg-subtle)",
              letterSpacing: "0.1em",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              padding: "0.2rem 0.6rem",
            }}
          >
            {images.length} foto
          </span>
        </div>
      </div>

      {/* Gallery grid */}
      <div
        className="gallery-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.5rem",
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className={`gallery-item${i === 0 ? " gallery-item-featured" : ""}`}
            style={{
              gridColumn: i === 0 ? "span 2" : "span 1",
              position: "relative",
              aspectRatio: i === 0 ? "3/2" : "4/3",
              overflow: "hidden",
              background: "var(--color-surface)",
              cursor: "zoom-in",
              border: "1px solid var(--color-border)",
              borderBottomColor: "var(--color-border)",
              transition: "border-color 0.3s ease",
            }}
            onClick={() => setLightboxIndex(i)}
            onMouseEnter={handleItemMouseEnter}
            onMouseLeave={handleItemMouseLeave}
          >
            <Image
              src={img}
              alt={`${title} — fotografie ${i + 1}`}
              fill
              unoptimized
              style={{
                objectFit: "cover",
                transition: "transform 0.5s ease, filter 0.5s ease",
                pointerEvents: "none",
              }}
              sizes={
                i === 0
                  ? "(max-width: 767px) 100vw, 66vw"
                  : "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
              }
            />
          </div>
        ))}
      </div>

      {/* Caption */}
      <p
        style={{
          marginTop: "1rem",
          fontSize: "0.72rem",
          color: "var(--color-fg-subtle)",
          letterSpacing: "0.08em",
          textAlign: "center",
        }}
      >
        Click pe orice imagine pentru vizualizare completă
      </p>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <ProjectLightbox
          images={images}
          initialIndex={lightboxIndex}
          projectTitle={title}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {/* Gallery responsive styles */}
      <style>{`
        @media (max-width: 767px) {
          .gallery-grid {
            grid-template-columns: 1fr !important;
          }
          .gallery-item-featured {
            grid-column: span 1 !important;
            aspect-ratio: 4/3 !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .gallery-item-featured {
            grid-column: span 2 !important;
          }
        }
      `}</style>
    </>
  );
}
