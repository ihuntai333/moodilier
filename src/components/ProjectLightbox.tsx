"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

interface ProjectLightboxProps {
  images: string[];
  initialIndex: number;
  projectTitle: string;
  onClose: () => void;
}

export default function ProjectLightbox({
  images,
  initialIndex,
  projectTitle,
  onClose,
}: ProjectLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [displayIndex, setDisplayIndex] = useState(initialIndex);
  const [imgVisible, setImgVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const preferInstant = useRef(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const activeThumbnailRef = useRef<HTMLButtonElement | null>(null);

  // Fade in on mount
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // Soft crossfade on image change (skip for keyboard / reduced-motion)
  useEffect(() => {
    if (currentIndex === displayIndex) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (preferInstant.current || reduce) {
      preferInstant.current = false;
      setDisplayIndex(currentIndex);
      setImgVisible(true);
      return;
    }
    setImgVisible(false);
    const t = window.setTimeout(() => {
      setDisplayIndex(currentIndex);
      requestAnimationFrame(() => setImgVisible(true));
    }, 90);
    return () => window.clearTimeout(t);
  }, [currentIndex, displayIndex]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      setCurrentIndex((idx + images.length) % images.length);
    },
    [images.length]
  );

  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);
  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);

  // Keyboard navigation — instant (high frequency)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        preferInstant.current = true;
        goPrev();
      } else if (e.key === "ArrowRight") {
        preferInstant.current = true;
        goNext();
      } else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goPrev, goNext, onClose]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (activeThumbnailRef.current && thumbnailsRef.current) {
      activeThumbnailRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentIndex]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only horizontal swipes
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Click on overlay (outside image) to close
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.95)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Top bar: counter + close ──────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem 1.5rem",
          pointerEvents: "none",
        }}
      >
        {/* Counter */}
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            letterSpacing: "0.18em",
            color: "var(--color-gold)",
            textTransform: "uppercase",
            pointerEvents: "none",
          }}
        >
          {currentIndex + 1} / {images.length}
        </span>

        {/* Title (subtle) */}
        <span
          style={{
            position: "absolute",
            left: "1.5rem",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.45)",
            pointerEvents: "none",
            maxWidth: "40%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {projectTitle}
        </span>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: "1.25rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "50%",
            width: "2.25rem",
            height: "2.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#fff",
            transition: "border-color 0.2s, background 0.2s",
            pointerEvents: "all",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-gold)";
            e.currentTarget.style.background = "rgba(201,169,132,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            e.currentTarget.style.background = "none";
          }}
          aria-label="Închide"
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Main image area ───────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          width: "90vw",
          maxWidth: "1200px",
          height: "75vh",
          maxHeight: "calc(100vh - 160px)",
          pointerEvents: "none",
        }}
      >
        <Image
          key={displayIndex}
          src={images[displayIndex]}
          alt={`${projectTitle} — fotografie ${displayIndex + 1}`}
          fill
          sizes="90vw"
          quality={90}
          style={{
            objectFit: "contain",
            pointerEvents: "none",
            userSelect: "none",
            opacity: imgVisible ? 1 : 0,
            transition: "opacity 180ms cubic-bezier(0.23, 1, 0.32, 1)",
          }}
          priority
        />
      </div>

      {/* ── Prev / Next arrows ────────────────────────────────── */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50%",
              width: "3rem",
              height: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
              transition: "background 0.2s, border-color 0.2s",
              zIndex: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(201,169,132,0.3)";
              e.currentTarget.style.borderColor = "var(--color-gold)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.5)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            }}
            aria-label="Fotografie anterioară"
          >
            <ArrowLeft size={20} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50%",
              width: "3rem",
              height: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
              transition: "background 0.2s, border-color 0.2s",
              zIndex: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(201,169,132,0.3)";
              e.currentTarget.style.borderColor = "var(--color-gold)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.5)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            }}
            aria-label="Fotografie următoare"
          >
            <ArrowRight size={20} />
          </button>
        </>
      )}

      {/* ── Thumbnail strip ───────────────────────────────────── */}
      {images.length > 1 && (
        <div
          ref={thumbnailsRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            gap: "0.35rem",
            padding: "0.75rem 1rem",
            overflowX: "auto",
            scrollbarWidth: "none",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
            justifyContent: images.length <= 8 ? "center" : "flex-start",
          }}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              ref={idx === currentIndex ? activeThumbnailRef : null}
              onClick={(e) => {
                e.stopPropagation();
                goTo(idx);
              }}
              style={{
                flexShrink: 0,
                position: "relative",
                width: "4rem",
                height: "2.75rem",
                border:
                  idx === currentIndex
                    ? "2px solid var(--color-gold)"
                    : "2px solid rgba(255,255,255,0.15)",
                borderRadius: "2px",
                overflow: "hidden",
                cursor: "pointer",
                padding: 0,
                background: "rgba(0,0,0,0.4)",
                transition: "border-color 0.2s, opacity 0.2s",
                opacity: idx === currentIndex ? 1 : 0.55,
              }}
              aria-label={`Fotografie ${idx + 1}`}
              onMouseEnter={(e) => {
                if (idx !== currentIndex) {
                  e.currentTarget.style.opacity = "0.9";
                  e.currentTarget.style.borderColor =
                    "rgba(201,169,132,0.6)";
                }
              }}
              onMouseLeave={(e) => {
                if (idx !== currentIndex) {
                  e.currentTarget.style.opacity = "0.55";
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.15)";
                }
              }}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                style={{ objectFit: "cover", pointerEvents: "none" }}
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
