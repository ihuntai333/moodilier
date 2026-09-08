"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";

interface ProjectImage {
  url: string;
  alt?: string;
}

interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  category: "Rezidențial" | "Comercial" | "Bucătărie" | "Vizualizare 3D";
  location?: string;
  description?: string;
  images?: unknown;
  video?: string | null;
  status?: "published" | "draft";
  year?: string | null;
  surface?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  is_featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  isFeatured?: boolean;
}

function normalizeImages(raw: unknown, fallbackAlt = ""): ProjectImage[] {
  if (!Array.isArray(raw)) return [];
  const out: ProjectImage[] = [];
  for (const item of raw) {
    if (typeof item === "string") {
      const url = item.trim();
      if (url) out.push(fallbackAlt ? { url, alt: fallbackAlt } : { url });
      continue;
    }
    if (item && typeof item === "object" && "url" in item) {
      const url = String((item as { url: unknown }).url || "").trim();
      if (!url) continue;
      const alt =
        typeof (item as { alt?: unknown }).alt === "string"
          ? (item as { alt: string }).alt
          : fallbackAlt || undefined;
      out.push(alt ? { url, alt } : { url });
    }
  }
  return out;
}

export default function EditProjectPage() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const encoded = encodeURIComponent(decodeURIComponent(id));
    fetch(`/api/admin/projects/${encoded}`)
      .then((r) => {
        if (!r.ok) {
          setNotFound(true);
          setLoading(false);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data && !data.error) setProject(data);
        else if (data) setNotFound(true);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="adm-page">
        <p className="adm-subtitle">Se încarcă proiectul...</p>
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="adm-page">
        <h1 className="adm-title" style={{ color: "var(--adm-danger)" }}>
          Proiect negăsit
        </h1>
        <p className="adm-subtitle">
          Proiectul cu ID-ul specificat nu există.
        </p>
      </div>
    );
  }

  const images = normalizeImages(project.images, project.title || "");

  return (
    <div className="adm-page adm-page--narrow">
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="adm-title">Editare: {project.title}</h1>
        <p className="adm-subtitle">
          Modificați detaliile, video-ul sau imaginile proiectului.
        </p>
      </div>

      <div
        style={{
          background: "#1a1917",
          border: "1px solid #2a2724",
          borderRadius: "8px",
          padding: "2rem",
        }}
      >
        <ProjectForm
          mode="edit"
          initialData={{
            id: project.id,
            slug: project.slug,
            title: project.title || "",
            category: project.category || "Rezidențial",
            location: project.location || "",
            description: project.description || "",
            images,
            video: project.video || "",
            status: project.status || "published",
            year: project.year != null ? String(project.year) : "",
            surface: project.surface != null ? String(project.surface) : "",
            seoTitle: project.seo_title || project.seoTitle || "",
            seoDescription:
              project.seo_description || project.seoDescription || "",
            isFeatured: Boolean(project.is_featured ?? project.isFeatured),
          }}
        />
      </div>
    </div>
  );
}
