"use client";

import { useRef, useState } from "react";
import { GripVertical, Plus, Trash2, Upload, Image as ImageIcon, Film } from "lucide-react";
import {
  DEFAULT_HERO_SLIDES,
  type HeroSlide,
} from "@/lib/site-settings";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.85rem",
  background: "#0f0e0d",
  border: "1px solid #2a2724",
  borderRadius: "4px",
  color: "#e8e0d5",
  fontSize: "0.8125rem",
  outline: "none",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  fontWeight: 500,
  color: "#9a9088",
  letterSpacing: "0.05em",
  marginBottom: "0.4rem",
};

type Props = {
  slides: HeroSlide[];
  defaultDurationSec: number;
  onChange: (slides: HeroSlide[]) => void;
  onDefaultDurationChange: (sec: number) => void;
  onError: (msg: string) => void;
};

function newId() {
  return `slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function HeroSliderEditor({
  slides,
  defaultDurationSec,
  onChange,
  onDefaultDurationChange,
  onError,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<"image" | "video">("image");

  async function uploadFiles(files: FileList | null, type: "image" | "video") {
    if (!files?.length) return;
    setUploading(true);
    onError("");
    try {
      const added: HeroSlide[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("slug", "hero");
        if (type === "video") {
          formData.append("video", file);
        } else {
          formData.append("images", file);
        }
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload eșuat");
        const src =
          type === "video"
            ? data.videoUrl || data.paths?.[0] || data.urls?.[0]
            : data.paths?.[0] || data.urls?.[0];
        if (!src) throw new Error("URL lipsă după upload");
        added.push({
          id: newId(),
          type,
          src,
          durationSec:
            type === "video" ? Math.max(defaultDurationSec, 8) : defaultDurationSec,
        });
      }
      onChange([...slides, ...added]);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Upload eșuat");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function updateSlide(i: number, patch: Partial<HeroSlide>) {
    const next = slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    onChange(next);
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= slides.length || from === to) return;
    const next = [...slides];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div>
          <label style={labelStyle}>Durată implicită (secunde)</label>
          <input
            type="number"
            min={2}
            max={60}
            style={inputStyle}
            value={defaultDurationSec}
            onChange={(e) =>
              onDefaultDurationChange(Math.max(2, Number(e.target.value) || 6))
            }
          />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}>
          <button
            type="button"
            className="adm-btn adm-btn-ghost"
            style={{ fontSize: "0.75rem" }}
            onClick={() => onChange(DEFAULT_HERO_SLIDES.map((s) => ({ ...s })))}
          >
            Reset default
          </button>
        </div>
      </div>

      <p style={{ margin: 0, fontSize: "0.75rem", color: "#9a9088" }}>
        Trage rândurile pentru a schimba ordinea. Poți combina clipuri video și imagini.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex === null) return;
              move(dragIndex, i);
              setDragIndex(null);
            }}
            onDragEnd={() => setDragIndex(null)}
            style={{
              display: "grid",
              gridTemplateColumns: "auto 72px 1fr auto",
              gap: "0.65rem",
              alignItems: "center",
              padding: "0.65rem",
              background: "#0f0e0d",
              border: "1px solid #2a2724",
              borderRadius: 6,
              opacity: dragIndex === i ? 0.55 : 1,
              cursor: "grab",
            }}
          >
            <GripVertical size={16} color="#6a6460" />
            <div
              style={{
                width: 72,
                height: 48,
                borderRadius: 4,
                overflow: "hidden",
                background: "#1a1917",
                display: "grid",
                placeItems: "center",
              }}
            >
              {slide.type === "video" ? (
                <Film size={18} color="#9a9088" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slide.src}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", minWidth: 0 }}>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                <select
                  style={{ ...inputStyle, width: "auto", minWidth: 100 }}
                  value={slide.type}
                  onChange={(e) =>
                    updateSlide(i, {
                      type: e.target.value === "video" ? "video" : "image",
                    })
                  }
                >
                  <option value="video">Video</option>
                  <option value="image">Imagine</option>
                </select>
                <input
                  type="number"
                  min={2}
                  max={60}
                  title="Secunde pe slide"
                  style={{ ...inputStyle, width: 72 }}
                  value={slide.durationSec}
                  onChange={(e) =>
                    updateSlide(i, {
                      durationSec: Math.max(2, Number(e.target.value) || defaultDurationSec),
                    })
                  }
                />
                <span style={{ fontSize: "0.7rem", color: "#6a6460", alignSelf: "center" }}>
                  sec
                </span>
              </div>
              <input
                style={inputStyle}
                value={slide.src}
                placeholder="/videos/... sau /projects/..."
                onChange={(e) => updateSlide(i, { src: e.target.value })}
              />
              {slide.type === "video" ? (
                <input
                  style={inputStyle}
                  value={slide.poster || ""}
                  placeholder="Poster (opțional)"
                  onChange={(e) => updateSlide(i, { poster: e.target.value || undefined })}
                />
              ) : null}
            </div>
            <button
              type="button"
              aria-label="Șterge slide"
              onClick={() => onChange(slides.filter((_, idx) => idx !== i))}
              style={{
                background: "transparent",
                border: "1px solid #2a2724",
                borderRadius: 4,
                color: "#e07070",
                padding: "0.55rem",
                cursor: "pointer",
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={uploadType === "video" ? "video/mp4,video/webm" : "image/*"}
        multiple
        hidden
        onChange={(e) => void uploadFiles(e.target.files, uploadType)}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <button
          type="button"
          className="adm-btn adm-btn-secondary"
          disabled={uploading}
          onClick={() => {
            setUploadType("image");
            setTimeout(() => fileRef.current?.click(), 0);
          }}
        >
          <ImageIcon size={14} />
          {uploading && uploadType === "image" ? "Se încarcă..." : "Adaugă imagini"}
        </button>
        <button
          type="button"
          className="adm-btn adm-btn-secondary"
          disabled={uploading}
          onClick={() => {
            setUploadType("video");
            setTimeout(() => fileRef.current?.click(), 0);
          }}
        >
          <Film size={14} />
          {uploading && uploadType === "video" ? "Se încarcă..." : "Adaugă video"}
        </button>
        <button
          type="button"
          className="adm-btn adm-btn-ghost"
          onClick={() =>
            onChange([
              ...slides,
              {
                id: newId(),
                type: "image",
                src: "",
                durationSec: defaultDurationSec,
              },
            ])
          }
        >
          <Plus size={14} /> Slide gol
        </button>
      </div>
    </div>
  );
}
