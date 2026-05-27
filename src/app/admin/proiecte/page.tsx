"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, Image as ImageIcon } from "lucide-react";

interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  location?: string;
  images: { url: string; alt?: string }[];
  coverImage?: string;
  updatedAt: string;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  }

  const inputStyle: React.CSSProperties = {
    background: "#1a1917",
    border: "1px solid #2a2724",
    borderRadius: "4px",
    color: "#e8e0d5",
    fontSize: "0.875rem",
    padding: "0.6rem 0.9rem",
    outline: "none",
  };

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: "1200px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 500,
              color: "#e8e0d5",
              marginBottom: "0.25rem",
            }}
          >
            Proiecte
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#6a6460", maxWidth: "none" }}>
            {projects.length} proiect{projects.length !== 1 ? "e" : ""} în total
          </p>
        </div>
        <Link
          href="/admin/proiecte/nou"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.7rem 1.25rem",
            background: "#c9a984",
            color: "#0f0e0d",
            borderRadius: "4px",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          <Plus size={14} />
          Proiect Nou
        </Link>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "1.5rem", position: "relative" }}>
        <Search
          size={16}
          style={{
            position: "absolute",
            left: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#5a5450",
          }}
        />
        <input
          type="text"
          placeholder="Caută după titlu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            ...inputStyle,
            width: "100%",
            maxWidth: "360px",
            paddingLeft: "2.25rem",
          }}
        />
      </div>

      {/* Table */}
      <div
        style={{
          background: "#1a1917",
          border: "1px solid #2a2724",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "56px 1fr 140px 80px 100px 110px",
            gap: "0",
            padding: "0.75rem 1rem",
            background: "#141312",
            borderBottom: "1px solid #2a2724",
          }}
        >
          {["", "Titlu", "Categorie", "Imagini", "Actualizat", "Acțiuni"].map(
            (h) => (
              <div
                key={h}
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#5a5450",
                  fontWeight: 600,
                  padding: "0 0.5rem",
                }}
              >
                {h}
              </div>
            )
          )}
        </div>

        {loading ? (
          <div
            style={{
              padding: "4rem",
              textAlign: "center",
              color: "#5a5450",
              fontSize: "0.875rem",
            }}
          >
            Se încarcă...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: "4rem",
              textAlign: "center",
              color: "#5a5450",
              fontSize: "0.875rem",
            }}
          >
            {search
              ? "Niciun proiect nu corespunde căutării."
              : "Nu există proiecte. Adaugă primul proiect!"}
          </div>
        ) : (
          filtered.map((project, i) => (
            <div
              key={project.id}
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr 140px 80px 100px 110px",
                alignItems: "center",
                borderBottom:
                  i < filtered.length - 1 ? "1px solid #1f1e1c" : "none",
                background: i % 2 === 0 ? "#1a1917" : "#171614",
              }}
            >
              {/* Thumbnail */}
              <div style={{ padding: "0.75rem 0.5rem 0.75rem 1rem" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "4px",
                    overflow: "hidden",
                    background: "#141312",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <ImageIcon size={16} color="#3a3632" />
                  )}
                </div>
              </div>

              {/* Title */}
              <div style={{ padding: "0.75rem 0.5rem" }}>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#e8e0d5",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {project.title}
                </div>
                {project.location && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#5a5450",
                      marginTop: "2px",
                    }}
                  >
                    {project.location}
                  </div>
                )}
              </div>

              {/* Category */}
              <div style={{ padding: "0.75rem 0.5rem" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.2rem 0.6rem",
                    background: "rgba(201,169,132,0.1)",
                    color: "#c9a984",
                    borderRadius: "3px",
                    fontSize: "0.7rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {project.category}
                </span>
              </div>

              {/* Image count */}
              <div
                style={{
                  padding: "0.75rem 0.5rem",
                  fontSize: "0.875rem",
                  color: "#7a7270",
                }}
              >
                {project.images.length}
              </div>

              {/* Date */}
              <div
                style={{
                  padding: "0.75rem 0.5rem",
                  fontSize: "0.75rem",
                  color: "#5a5450",
                }}
              >
                {formatDate(project.updatedAt)}
              </div>

              {/* Actions */}
              <div
                style={{
                  padding: "0.75rem 1rem 0.75rem 0.5rem",
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                <Link
                  href={`/admin/proiecte/${project.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    background: "rgba(201,169,132,0.1)",
                    borderRadius: "4px",
                    color: "#c9a984",
                  }}
                  title="Editează"
                >
                  <Edit2 size={14} />
                </Link>
                <button
                  onClick={() => setConfirmDelete(project.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    background: "rgba(224,112,112,0.1)",
                    border: "none",
                    borderRadius: "4px",
                    color: "#e07070",
                    cursor: "pointer",
                  }}
                  title="Șterge"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={() => setConfirmDelete(null)}
        >
          <div
            style={{
              background: "#1a1917",
              border: "1px solid #2a2724",
              borderRadius: "8px",
              padding: "2rem",
              maxWidth: "400px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                color: "#e8e0d5",
                marginBottom: "0.75rem",
              }}
            >
              Confirmare ștergere
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#7a7270",
                marginBottom: "1.5rem",
              }}
            >
              Ești sigur că vrei să ștergi proiectul{" "}
              <strong style={{ color: "#e8e0d5" }}>
                {projects.find((p) => p.id === confirmDelete)?.title}
              </strong>
              ? Această acțiune este ireversibilă.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting === confirmDelete}
                style={{
                  flex: 1,
                  padding: "0.7rem",
                  background: "#e07070",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {deleting === confirmDelete ? "Se șterge..." : "Șterge"}
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  flex: 1,
                  padding: "0.7rem",
                  background: "transparent",
                  color: "#9a9088",
                  border: "1px solid #2a2724",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
