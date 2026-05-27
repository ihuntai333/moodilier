"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";

interface Project {
  id: string;
  slug: string;
  title: string;
  category: "Rezidențial" | "Comercial" | "Bucătărie" | "Vizualizare 3D";
  location?: string;
  description?: string;
  images: { url: string; alt?: string }[];
}

export default function EditProjectPage() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
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
      <div
        style={{
          padding: "2.5rem 2rem",
          color: "#6a6460",
          fontSize: "0.875rem",
        }}
      >
        Se încarcă proiectul...
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div style={{ padding: "2.5rem 2rem" }}>
        <h1 style={{ fontSize: "1.5rem", color: "#e07070", marginBottom: "0.5rem" }}>
          Proiect negăsit
        </h1>
        <p style={{ color: "#6a6460", fontSize: "0.875rem" }}>
          Proiectul cu ID-ul specificat nu există.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: "860px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 500,
            color: "#e8e0d5",
            marginBottom: "0.25rem",
          }}
        >
          Editare: {project.title}
        </h1>
        <p style={{ fontSize: "0.85rem", color: "#6a6460", maxWidth: "none" }}>
          Modificați detaliile sau imaginile proiectului.
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
            images: project.images,
          }}
        />
      </div>
    </div>
  );
}
