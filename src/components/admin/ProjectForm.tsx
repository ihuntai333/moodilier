"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, GripVertical, AlertCircle, CheckCircle } from "lucide-react";

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

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [form, setForm] = useState<ProjectFormData>({
    title: initialData?.title || "",
    category: initialData?.category || "Rezidențial",
    location: initialData?.location || "",
    description: initialData?.description || "",
    images: initialData?.images || [],
    status: initialData?.status || "published",
    year: initialData?.year || "",
    surface: initialData?.surface || "",
    seoTitle: initialData?.seoTitle || "",
    seoDescription: initialData?.seoDescription || "",
    isFeatured: initialData?.isFeatured || false,
  });

  // Auto-fill SEO title from project title when SEO title is empty
  useEffect(() => {
    if (!initialData?.seoTitle && form.title && !form.seoTitle) {
      setForm((prev) => ({ ...prev, seoTitle: form.title }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  function handleDragStart(index: number) {
    setDragIndex(index);
  }
  function handleDragEnter(index: number) {
    setDragOverIndex(index);
  }
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

      const payload = {
        title: form.title.trim(),
        category: form.category,
        location: form.location.trim(),
        description: form.description.trim(),
        images,
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
        res = await fetch(`/api/admin/projects/${initialData?.id}`, {
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
        setSuccess("Proiect actualizat cu succes!");
        setTimeout(() => setSuccess(""), 3000);
        setForm((prev) => ({ ...prev, images }));
      }
    } catch {
      setError("Eroare la salvare. Verificați conexiunea.");
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
          <div style={{ fontSize: "0.75rem", color: "#4a4540" }}>
            JPG, PNG, WebP, GIF • Multiple fișiere acceptate
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {form.images.map((img, i) => (
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
                    dragOverIndex === i && dragIndex !== i ? "#c9a984" : "#2a2724"
                  }`,
                  opacity: dragIndex === i ? 0.5 : 1,
                  cursor: "grab",
                }}
              >
                <img
                  src={img.preview || img.url}
                  alt={img.alt || `Imagine ${i + 1}`}
                  style={{
                    width: "100%",
                    aspectRatio: "4/3",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {/* Cover badge */}
                {i === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0.4rem",
                      left: "0.4rem",
                      background: "rgba(201,169,132,0.9)",
                      color: "#0f0e0d",
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "0.2rem 0.4rem",
                      borderRadius: "2px",
                    }}
                  >
                    Copertă
                  </div>
                )}
                {/* Drag handle */}
                <div
                  style={{
                    position: "absolute",
                    top: "0.4rem",
                    left: "0.4rem",
                    color: "rgba(255,255,255,0.6)",
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
                    bottom: "0.4rem",
                    right: "0.4rem",
                    background: "rgba(0,0,0,0.5)",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.6rem",
                    padding: "0.15rem 0.4rem",
                    borderRadius: "2px",
                  }}
                >
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
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
        }}
      >
        <button
          type="submit"
          disabled={submitting || uploadingImages}
          style={{
            padding: "0.875rem 2rem",
            background: submitting || uploadingImages ? "#8a7a64" : "#c9a984",
            color: "#0f0e0d",
            border: "none",
            borderRadius: "4px",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: submitting || uploadingImages ? "not-allowed" : "pointer",
          }}
        >
          {uploadingImages
            ? "Se încarcă imaginile..."
            : submitting
            ? "Se salvează..."
            : mode === "create"
            ? "Creează Proiect"
            : "Salvează Modificările"}
        </button>
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
