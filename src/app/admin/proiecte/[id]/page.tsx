"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";

interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  category: "Rezidențial" | "Comercial" | "Bucătărie" | "Vizualizare 3D";
  location?: string;
  description?: string;
  images: { url: string; alt?: string }[];
  video?: string | null;
  status?: "published" | "draft";
  year?: string | null;
  surface?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  is_featured?: boolean;
  // camelCase fallbacks
  seoTitle?: string;
  seoDescription?: string;
  isFeatured?: boolean;
}

export default function EditProjectPage() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/projects/${id}`)
      .then((r) => {
        if (!r.ok) {
          setNotFound(true);
          setLoading(false);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setProject(data);
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
            title: project.title,
            category: project.category,
            location: project.location || "",
            description: project.description || "",
            images: project.images || [],
            video: project.video || "",
            status: project.status || "published",
            year: project.year || "",
            surface: project.surface || "",
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
