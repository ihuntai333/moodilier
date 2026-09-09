"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, GripVertical, AlertCircle, CheckCircle, Eye, Star } from "lucide-react";

interface ProjectImage {
  url: string;
  alt?: string;
  file?: File;
  preview?: string;
}

interface ProjectFormData {
  title: string;
  category: "Rezidențial" | "Comercial" | "Bucătărie" | "Vizualizare 3D";
  location: string;
  description: string;
  images: ProjectImage[];
  /** Hover + project-page hero video URL */
  video: string;
  // New fields
  status: "published" | "draft";
  year: string;
  surface: string;
  seoTitle: string;
  seoDescription: string;
  isFeatured: boolean;
}

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData & { id: string; slug: string }>;
  mode: "create" | "edit";
  projectSlug?: string;
}

const categories = ["Rezidențial", "Comercial", "Bucătărie", "Vizualizare 3D"] as const;

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  background: "#0f0e0d",
  border: "1px solid #2a2724",
  borderRadius: "4px",
  color: "#e8e0d5",
  fontSize: "0.875rem",
  outline: "none",
  transition: "border-color 150ms ease",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#9a9088",
  letterSpacing: "0.05em",
  marginBottom: "0.5rem",
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: "0.65rem",
  fontWeight: 700,
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  color: "#5a5450",
  paddingBottom: "0.75rem",
  borderBottom: "1px solid #2a2724",
  marginBottom: "1.25rem",
  marginTop: "0.25rem",
};

function focusGold(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  (e.target as HTMLElement).style.borderColor = "#c9a984";
}
function blurGray(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  (e.target as HTMLElement).style.borderColor = "#2a2724";
}

function coerceImages(raw: unknown, fallbackAlt = ""): ProjectImage[] {
  if (!Array.isArray(raw)) return [];
  const out: ProjectImage[] = [];
  for (const item of raw) {
    if (typeof item === "string") {
      const url = item.trim();
      if (url) out.push(fallbackAlt ? { url, alt: fallbackAlt } : { url });
      continue;
    }
    if (item && typeof item === "object" && "url" in item) {
      const obj = item as ProjectImage;
      const url = String(obj.url || "").trim();
      if (!url && !obj.preview && !obj.file) continue;
      const alt = obj.alt || fallbackAlt || undefined;
      out.push({
        url,
        ...(alt ? { alt } : {}),
        ...(obj.file ? { file: obj.file } : {}),
        ...(obj.preview ? { preview: obj.preview } : {}),
      });
    }
  }
  return out;
}

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const slug = initialData?.slug || "";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [pendingVideo, setPendingVideo] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [projectId, setProjectId] = useState(initialData?.id || "");

  const [form, setForm] = useState<ProjectFormData>(() => ({
    title: initialData?.title || "",
    category: initialData?.category || "Rezidențial",
    location: initialData?.location || "",
    description: initialData?.description || "",
    images: coerceImages(initialData?.images, initialData?.title || ""),
    video: initialData?.video || "",
    status: initialData?.status || "published",
    year: initialData?.year != null ? String(initialData.year) : "",
    surface: initialData?.surface != null ? String(initialData.surface) : "",
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    isFeatured: initialData?.isFeatured || false,
  }));

  // Keep form in sync when edit page loads / refreshes initialData
  useEffect(() => {
    if (!initialData || mode !== "edit") return;
    setProjectId(initialData.id || "");
    setForm({
      title: initialData.title || "",
      category: initialData.category || "Rezidențial",
      location: initialData.location || "",
      description: initialData.description || "",
      images: coerceImages(initialData.images, initialData.title || ""),
      video: initialData.video || "",
      status: initialData.status || "published",
      year: initialData.year != null ? String(initialData.year) : "",
      surface: initialData.surface != null ? String(initialData.surface) : "",
      seoTitle: initialData.seoTitle || "",
      seoDescription: initialData.seoDescription || "",
      isFeatured: initialData.isFeatured || false,
    });
  }, [mode, initialData?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-fill SEO title from project title when SEO title is empty
  useEffect(() => {
    if (!initialData?.seoTitle && form.title && !form.seoTitle) {
      setForm((prev) => ({ ...prev, seoTitle: form.title }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pendingVideo) {
      setVideoPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(pendingVideo);
    setVideoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingVideo]);

  function setField<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Auto-fill SEO title when typing the project title, if seoTitle is empty or was auto-filled
      if (key === "title" && (!prev.seoTitle || prev.seoTitle === prev.title)) {
        next.seoTitle = value as string;
      }
      // Auto-fill SEO description from description when empty
      if (key === "description" && (!prev.seoDescription || prev.seoDescription === prev.description)) {
        next.seoDescription = (value as string).slice(0, 160);
      }
      return next;
    });
  }

  function generateSlug(title: string): string {
    return (
      title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-") +
      "-" +
      Date.now()
    );
  }

  const addFiles = useCallback((files: FileList | File[]) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const newImages: ProjectImage[] = Array.from(files)
      .filter((f) => allowed.includes(f.type))
      .map((file) => ({
        url: "",
        alt: file.name.replace(/\.[^/.]+$/, ""),
        file,
        preview: URL.createObjectURL(file),
      }));
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  }, []);

  function removeImage(index: number) {
    setForm((prev) => {
      const imgs = [...prev.images];
      if (imgs[index].preview) {
        URL.revokeObjectURL(imgs[index].preview!);
      }
      imgs.splice(index, 1);
      return { ...prev, images: imgs };
    });
  }

  function handleDragStart(index: number) { setDragIndex(index); }
  function handleDragEnter(index: number) { setDragOverIndex(index); }
  function handleDragEnd() {
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      const imgs = [...form.images];
      const [moved] = imgs.splice(dragIndex, 1);
      imgs.splice(dragOverIndex, 0, moved);
      setForm((prev) => ({ ...prev, images: imgs }));
    }
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function setAsCover(index: number) {
    if (index === 0) return;
    setForm((prev) => {
      const imgs = [...prev.images];
      const [cover] = imgs.splice(index, 1);
      return { ...prev, images: [cover, ...imgs] };
    });
  }

  async function uploadPendingImages(slug: string): Promise<ProjectImage[]> {
    const toUpload = form.images.filter((img) => img.file);
    if (toUpload.length === 0) return form.images;

    setUploadingImages(true);
    const formData = new FormData();
    formData.append("slug", slug);
    toUpload.forEach((img) => formData.append("images", img.file!));

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUploadingImages(false);

    if (!res.ok) throw new Error(data.error || "Upload failed");

    const uploadedUrls: string[] = data.paths;
    let uploadIdx = 0;

    return form.images.map((img) => {
      if (img.file) {
        const url = uploadedUrls[uploadIdx++] || "";
        return { url, alt: img.alt };
      }
      return { url: img.url, alt: img.alt };
    });
  }

  async function uploadPendingVideo(slug: string): Promise<string> {
    if (!pendingVideo) return form.video;
    setUploadingVideo(true);
    const formData = new FormData();
    formData.append("slug", slug);
    formData.append("video", pendingVideo);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUploadingVideo(false);

    if (!res.ok) throw new Error(data.error || "Upload video eșuat");
    if (!data.videoUrl) throw new Error("URL video lipsă după upload");
    return data.videoUrl as string;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Titlul este obligatoriu.");
      return;
    }

    setSubmitting(true);

    try {
      const slug = initialData?.slug || generateSlug(form.title);
      const images = await uploadPendingImages(slug);
      const video = await uploadPendingVideo(slug);
      const coverUrl = images[0]?.url || "";

      const roomFromUrl = (url: string) => {
        const base = url.split("/").pop() || "";
        const m = base.match(/^\d+\.([a-z0-9-]+)\./i);
        if (!m) return "Altele";
        const map: Record<string, string> = {
          bucatarii: "Bucătării",
          living: "Living",
          dressing: "Dressing",
          dormitoare: "Dormitoare",
          bai: "Băi",
          hol: "Hol",
        };
        return map[m[1]] || "Altele";
      };

      const payload = {
        title: form.title.trim(),
        category: form.category,
        location: form.location.trim(),
        description: form.description.trim(),
        images,
        coverImage: coverUrl,
        // Keep gallery in the same order as images (cover first)
        gallery: images
          .filter((img) => img.url)
          .map((img) => ({ url: img.url, room: roomFromUrl(img.url) })),
        video,
        slug,
        status: form.status,
        year: form.year.trim(),
        surface: form.surface.trim(),
        seoTitle: form.seoTitle.trim(),
        seoDescription: form.seoDescription.trim(),
        isFeatured: form.isFeatured,
      };

      let res: Response;

      if (mode === "create") {
        res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        const editId =
          initialData?.slug || projectId || initialData?.id || "";
        res = await fetch(`/api/admin/projects/${encodeURIComponent(editId)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Eroare la salvare.");
        return;
      }

      if (mode === "create") {
        router.push("/admin/proiecte");
      } else {
        if (data?.id) setProjectId(String(data.id));
        setSuccess("Proiect actualizat cu succes!");
        setTimeout(() => setSuccess(""), 3000);
        setForm((prev) => ({
          ...prev,
          images: coerceImages(data?.images ?? images, form.title),
          video: typeof data?.video === "string" ? data.video : video,
        }));
        setPendingVideo(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Eroare la salvare. Verificați conexiunea."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Error / success banners */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.875rem 1rem",
            background: "rgba(224,112,112,0.1)",
            border: "1px solid rgba(224,112,112,0.3)",
            borderRadius: "6px",
            color: "#e07070",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
          }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.875rem 1rem",
            background: "rgba(109,191,138,0.1)",
            border: "1px solid rgba(109,191,138,0.3)",
            borderRadius: "6px",
            color: "#6dbf8a",
            fontSize: "0.875rem",
            marginBottom: "1.5rem",
          }}
        >
          <CheckCircle size={16} />
          {success}
        </div>
      )}

      {/* ===== SECTION: Informații de bază ===== */}
      <div style={sectionHeadingStyle}>Informații de bază</div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.25rem",
          marginBottom: "1.25rem",
        }}
      >
        {/* Title */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>
            Titlu <span style={{ color: "#e07070" }}>*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="ex. Bucătărie modernă în Floreasca"
            required
            style={inputStyle}
            onFocus={focusGold}
            onBlur={blurGray}
          />
        </div>

        {/* Category */}
        <div>
          <label style={labelStyle}>Categorie</label>
          <select
            value={form.category}
            onChange={(e) => setField("category", e.target.value as ProjectFormData["category"])}
            style={{
              ...inputStyle,
              cursor: "pointer",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236a6460' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              paddingRight: "2.5rem",
            }}
            onFocus={focusGold}
            onBlur={blurGray}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} style={{ background: "#0f0e0d" }}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label style={labelStyle}>Status</label>
          <select
            value={form.status}
            onChange={(e) => setField("status", e.target.value as ProjectFormData["status"])}
            style={{
              ...inputStyle,
              cursor: "pointer",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236a6460' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              paddingRight: "2.5rem",
            }}
            onFocus={focusGold}
            onBlur={blurGray}
          >
            <option value="published" style={{ background: "#0f0e0d" }}>
              Publicat
            </option>
            <option value="draft" style={{ background: "#0f0e0d" }}>
              Ciornă
            </option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label style={labelStyle}>Locație</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setField("location", e.target.value)}
            placeholder="ex. București, Sector 1"
            style={inputStyle}
            onFocus={focusGold}
            onBlur={blurGray}
          />
        </div>

        {/* Year */}
        <div>
          <label style={labelStyle}>An proiect</label>
          <input
            type="text"
            value={form.year}
            onChange={(e) => setField("year", e.target.value)}
            placeholder="ex. 2023"
            style={inputStyle}
            onFocus={focusGold}
            onBlur={blurGray}
          />
        </div>

        {/* Surface */}
        <div>
          <label style={labelStyle}>Suprafață</label>
          <input
            type="text"
            value={form.surface}
            onChange={(e) => setField("surface", e.target.value)}
            placeholder="ex. 120 mp"
            style={inputStyle}
            onFocus={focusGold}
            onBlur={blurGray}
          />
        </div>

        {/* Description */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Descriere</label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Descrieți proiectul: materiale folosite, dimensiuni, specificații..."
            rows={5}
            style={{
              ...inputStyle,
              resize: "vertical",
              lineHeight: "1.6",
            }}
            onFocus={focusGold}
            onBlur={blurGray}
          />
        </div>

        {/* Featured checkbox */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setField("isFeatured", e.target.checked)}
              style={{
                width: "16px",
                height: "16px",
                accentColor: "#c9a984",
                cursor: "pointer",
              }}
            />
            <span style={{ fontSize: "0.875rem", color: "#9a9088" }}>
              Proiect featured{" "}
              <span style={{ color: "#5a5450", fontSize: "0.75rem" }}>
                — apare prominent în portofoliu
              </span>
            </span>
          </label>
        </div>
      </div>

      {/* ===== SECTION: SEO ===== */}
      <div style={{ ...sectionHeadingStyle, marginTop: "2rem" }}>
        SEO & Meta
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1.25rem",
          marginBottom: "1.25rem",
        }}
      >
        {/* SEO Title */}
        <div>
          <label style={labelStyle}>
            SEO Title{" "}
            <span style={{ color: "#5a5450", fontWeight: 400 }}>
              ({form.seoTitle.length}/60 caractere)
            </span>
          </label>
          <input
            type="text"
            value={form.seoTitle}
            onChange={(e) => setField("seoTitle", e.target.value)}
            placeholder="Titlu SEO pentru pagina proiectului"
            maxLength={60}
            style={inputStyle}
            onFocus={focusGold}
            onBlur={blurGray}
          />
        </div>

        {/* SEO Description */}
        <div>
          <label style={labelStyle}>
            SEO Description{" "}
            <span style={{ color: "#5a5450", fontWeight: 400 }}>
              ({form.seoDescription.length}/160 caractere)
            </span>
          </label>
          <textarea
            value={form.seoDescription}
            onChange={(e) => setField("seoDescription", e.target.value)}
            placeholder="Meta descriere pentru motoarele de căutare (max. 160 caractere)"
            rows={3}
            maxLength={160}
            style={{
              ...inputStyle,
              resize: "vertical",
              lineHeight: "1.6",
            }}
            onFocus={focusGold}
            onBlur={blurGray}
          />
        </div>
      </div>

      {/* ===== SECTION: Video hover / hero ===== */}
      <div style={{ ...sectionHeadingStyle, marginTop: "2rem" }}>
        Video proiect
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ ...labelStyle, marginBottom: "0.75rem" }}>
          Video la hover &amp; hero{" "}
          <span style={{ color: "#5a5450", fontWeight: 400 }}>
            — MP4 / WebM, max. 80MB. Apare la hover pe carduri și în hero pe pagina proiectului.
          </span>
        </label>

        {(form.video || pendingVideo) && (
          <div
            style={{
              position: "relative",
              marginBottom: "0.85rem",
              borderRadius: "6px",
              overflow: "hidden",
              border: "1px solid #2a2724",
              background: "#0f0e0d",
              maxWidth: "420px",
            }}
          >
            <video
              src={videoPreviewUrl || form.video}
              muted
              playsInline
              controls
              style={{ width: "100%", display: "block", maxHeight: "220px" }}
            />
            <button
              type="button"
              onClick={() => {
                setPendingVideo(null);
                setField("video", "");
                if (videoInputRef.current) videoInputRef.current.value = "";
              }}
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                width: "28px",
                height: "28px",
                borderRadius: "4px",
                border: "none",
                background: "rgba(15,14,13,0.85)",
                color: "#e8e0d5",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Elimină video"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setPendingVideo(file);
          }}
        />
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.7rem 1.1rem",
            background: "#0f0e0d",
            border: "1px solid #2a2724",
            borderRadius: "4px",
            color: "#c9a984",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          <Upload size={14} />
          {form.video || pendingVideo ? "Înlocuiește video" : "Încarcă video"}
        </button>
        {pendingVideo && (
          <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#9a9088" }}>
            Se va încărca la salvare: {pendingVideo.name}
          </p>
        )}
      </div>

      {/* ===== SECTION: Imagini ===== */}
      <div style={{ ...sectionHeadingStyle, marginTop: "2rem" }}>Imagini</div>

      <div>
        <label style={{ ...labelStyle, marginBottom: "0.75rem" }}>
          Imagini{" "}
          <span style={{ color: "#5a5450", fontWeight: 400 }}>
            ({form.images.length} selectat{form.images.length !== 1 ? "e" : ""})
          </span>
        </label>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "#c9a984" : "#2a2724"}`,
            borderRadius: "8px",
            padding: "2.5rem",
            textAlign: "center",
            cursor: "pointer",
            background: dragOver ? "rgba(201,169,132,0.04)" : "#0f0e0d",
            transition: "all 150ms ease",
            marginBottom: "1rem",
          }}
        >
          <Upload
            size={28}
            color={dragOver ? "#c9a984" : "#3a3632"}
            style={{ margin: "0 auto 0.75rem" }}
          />
          <div
            style={{
              fontSize: "0.875rem",
              color: "#7a7270",
              marginBottom: "0.25rem",
            }}
          >
            Trage imagini aici sau{" "}
            <span style={{ color: "#c9a984" }}>click pentru selecție</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#5a5450", lineHeight: 1.45 }}>
            JPG, PNG, WEBP, GIF · la salvare se optimizează automat
            <br />
            (max ~2400px, WebP, fără metadata)
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />

        {/* Image previews grid */}
        {form.images.length > 0 && (
          <>
            <div style={{ fontSize: "0.7rem", color: "#5a5450", marginBottom: "0.6rem", letterSpacing: "0.04em" }}>
              ✦ Trage pentru a reordona • Click pe ★ pentru a seta coperta
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {form.images.map((img, i) => {
                const src = img.preview || img.url;
                return (
                  <div
                    key={i}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragEnter={() => handleDragEnter(i)}
                    onDragEnd={handleDragEnd}
                    style={{
                      position: "relative",
                      background: "#141312",
                      borderRadius: "6px",
                      overflow: "hidden",
                      border: `2px solid ${
                        i === 0
                          ? "#c9a984"
                          : dragOverIndex === i && dragIndex !== i
                          ? "#c9a984"
                          : "#2a2724"
                      }`,
                      opacity: dragIndex === i ? 0.4 : 1,
                      cursor: "grab",
                      transition: "border-color 150ms, opacity 150ms",
                    }}
                  >
                    {/* Image */}
                    {src ? (
                      <img
                        src={src}
                        alt={img.alt || `Imagine ${i + 1}`}
                        onError={(e) => {
                          const t = e.currentTarget;
                          t.style.display = "none";
                          const next = t.nextElementSibling as HTMLElement;
                          if (next) next.style.display = "flex";
                        }}
                        style={{
                          width: "100%",
                          aspectRatio: "4/3",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : null}
                    {/* Error fallback */}
                    <div
                      style={{
                        display: src ? "none" : "flex",
                        width: "100%",
                        aspectRatio: "4/3",
                        background: "#1a1814",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.3rem",
                        padding: "0.5rem",
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>🖼</span>
                      <span style={{ fontSize: "0.5rem", color: "#4a4540", textAlign: "center", wordBreak: "break-all" }}>
                        {src || "fără URL"}
                      </span>
                    </div>

                    {/* Cover badge */}
                    {i === 0 && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "0.4rem",
                          left: "0.4rem",
                          background: "rgba(201,169,132,0.92)",
                          color: "#0f0e0d",
                          fontSize: "0.52rem",
                          fontWeight: 700,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          padding: "0.2rem 0.4rem",
                          borderRadius: "2px",
                        }}
                      >
                        ★ Copertă
                      </div>
                    )}

                    {/* Set as cover button (non-cover images) */}
                    {i !== 0 && (
                      <button
                        type="button"
                        title="Setează ca imagine de copertă"
                        onClick={() => setAsCover(i)}
                        style={{
                          position: "absolute",
                          bottom: "0.4rem",
                          left: "0.4rem",
                          background: "rgba(0,0,0,0.65)",
                          border: "none",
                          borderRadius: "3px",
                          color: "#c9a984",
                          cursor: "pointer",
                          padding: "0.2rem 0.35rem",
                          fontSize: "0.5rem",
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.2rem",
                        }}
                      >
                        <Star size={8} /> Copertă
                      </button>
                    )}

                    {/* Drag handle */}
                    <div
                      style={{
                        position: "absolute",
                        top: "0.4rem",
                        left: "0.4rem",
                        color: "rgba(255,255,255,0.5)",
                        pointerEvents: "none",
                      }}
                    >
                      <GripVertical size={14} />
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      style={{
                        position: "absolute",
                        top: "0.4rem",
                        right: "0.4rem",
                        width: "22px",
                        height: "22px",
                        background: "rgba(0,0,0,0.6)",
                        border: "none",
                        borderRadius: "50%",
                        color: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <X size={12} />
                    </button>

                    {/* Index badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "0.4rem",
                        right: i === 0 ? "0.4rem" : "2rem",
                        background: "rgba(0,0,0,0.5)",
                        color: "rgba(255,255,255,0.55)",
                        fontSize: "0.58rem",
                        padding: "0.15rem 0.35rem",
                        borderRadius: "2px",
                      }}
                    >
                      {i + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Submit */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginTop: "2rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid #2a2724",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          type="submit"
          disabled={submitting || uploadingImages || uploadingVideo}
          style={{
            padding: "0.875rem 2rem",
            background:
              submitting || uploadingImages || uploadingVideo
                ? "#8a7a64"
                : "#c9a984",
            color: "#0f0e0d",
            border: "none",
            borderRadius: "4px",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor:
              submitting || uploadingImages || uploadingVideo
                ? "not-allowed"
                : "pointer",
          }}
        >
          {uploadingVideo
            ? "Se încarcă video..."
            : uploadingImages
            ? "Se încarcă imaginile..."
            : submitting
            ? "Se salvează..."
            : mode === "create"
            ? "Creează Proiect"
            : "Salvează Modificările"}
        </button>

        {/* Preview button — edit mode only */}
        {mode === "edit" && slug && (
          <a
            href={`/proiecte/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.875rem 1.5rem",
              background: "transparent",
              color: "#c9a984",
              border: "1px solid #c9a984",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              textDecoration: "none",
            }}
          >
            <Eye size={14} /> Preview
          </a>
        )}

        <button
          type="button"
          onClick={() => router.push("/admin/proiecte")}
          style={{
            padding: "0.875rem 1.5rem",
            background: "transparent",
            color: "#9a9088",
            border: "1px solid #2a2724",
            borderRadius: "4px",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Anulează
        </button>
      </div>
    </form>
  );
}
