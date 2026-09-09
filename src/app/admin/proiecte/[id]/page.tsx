"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import {
  decodeProjectParam,
  normalizeAdminImages,
} from "@/lib/admin-projects";

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

export default function EditProjectPage() {
  const params = useParams();
  const id = decodeProjectParam(String(params?.id || ""));
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/admin/projects/${encodeURIComponent(id)}`, {
      credentials: "same-origin",
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (cancelled) return;
        if (!r.ok) {
          const msg =
            typeof data?.error === "string" ? data.error : "";
          // Never surface raw Node/undici errors like "TypeError: fetch failed"
          const friendly =
            /fetch failed|ECONNREFUSED|ETIMEDOUT|network/i.test(msg)
              ? "Conexiune temporar indisponibilă. Reîncearcă peste câteva secunde."
              : msg ||
                (r.status === 401
                  ? "Sesiune expirată — reautentifică-te."
                  : "Proiectul cu ID-ul specificat nu există.");
          setError(friendly);
          setProject(null);
          return;
        }
        if (data?.error || !data?.id) {
          setError(
            typeof data?.error === "string"
              ? data.error
              : "Proiectul cu ID-ul specificat nu există."
          );
          setProject(null);
          return;
        }
        setProject(data as ProjectRow);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Nu am putut încărca proiectul. Încearcă din nou.");
          setProject(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="adm-page">
        <p className="adm-subtitle">Se încarcă proiectul...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="adm-page">
        <h1 className="adm-title" style={{ color: "var(--adm-danger)" }}>
          Proiect negăsit
        </h1>
        <p className="adm-subtitle">
          {error || "Proiectul cu ID-ul specificat nu există."}
        </p>
        <p style={{ marginTop: "1.25rem" }}>
          <Link href="/admin/proiecte" className="adm-btn adm-btn-secondary">
            ← Înapoi la proiecte
          </Link>
        </p>
      </div>
    );
  }

  const images = normalizeAdminImages(project.images, project.title || "");

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
