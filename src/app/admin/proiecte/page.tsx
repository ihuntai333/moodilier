"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Star,
  Copy,
} from "lucide-react";

interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  location?: string;
  year?: string;
  surface?: string;
  images: { url: string; alt?: string }[];
  coverImage?: string;
  cover_image?: string;
  updatedAt: string;
  updated_at?: string;
  status?: "published" | "draft";
  is_featured?: boolean;
  source?: "cms" | "catalog";
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
  const [meta, setMeta] = useState({ total: 0, catalogCount: 0, cmsCount: 0 });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState<string | null>(null);

  const fetchProjects = useCallback(async (opts?: { sync?: boolean }) => {
    setLoading(true);
    try {
      const url = opts?.sync
        ? "/api/admin/projects?sync=1"
        : "/api/admin/projects";
      const res = await fetch(url);
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.projects)
          ? data.projects
          : [];
      setProjects(list);
      setMeta({
        total: data?.meta?.total ?? list.length,
        catalogCount: data?.meta?.catalogCount ?? list.length,
        cmsCount: data?.meta?.cmsCount ?? 0,
      });
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fast list load — no full catalog sync (that made admin feel stuck)
    fetchProjects();
  }, [fetchProjects]);

  async function handleSyncCatalog() {
    setSyncing(true);
    try {
      await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync-catalog" }),
      });
      await fetchProjects();
    } finally {
      setSyncing(false);
    }
  }

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (String(id).startsWith("catalog:")) {
      alert(
        "Proiectul există doar în catalogul site-ului. Apasă „Sincronizează catalog” ca să-l aduci în CMS, apoi poți șterge versiunea din CMS."
      );
      setConfirmDelete(null);
      return;
    }
    setDeleting(id);
    try {
      await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setMeta((m) => ({
        ...m,
        total: Math.max(0, m.total - 1),
        cmsCount: Math.max(0, m.cmsCount - 1),
      }));
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  }

  async function handleDuplicate(project: Project) {
    setDuplicating(project.id);
    try {
      const newTitle = `${project.title} (copie)`;
      const newSlug =
        project.slug.replace(/-\d+$/, "") + "-copy-" + Date.now();

      const payload = {
        title: newTitle,
        slug: newSlug,
        category: project.category,
        location: project.location || "",
        description: "",
        images: project.images || [],
        status: "draft", // duplicates start as draft
        year: project.year || "",
        surface: project.surface || "",
        seoTitle: newTitle,
        seoDescription: "",
        isFeatured: false,
      };

      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchProjects();
      }
    } finally {
      setDuplicating(null);
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
    <div className="adm-page adm-page--wide">
      {/* Header */}
      <div className="adm-header-row">
        <div>
          <h1 className="adm-title">Proiecte</h1>
          <p className="adm-subtitle">
            {meta.total || projects.length} proiect
            {(meta.total || projects.length) !== 1 ? "e" : ""} pe site
            {meta.cmsCount > 0 && (
              <span style={{ color: "#8a847c", marginLeft: "0.5rem" }}>
                · {meta.cmsCount} în CMS
              </span>
            )}
            {projects.filter((p) => p.is_featured).length > 0 && (
              <span style={{ color: "var(--adm-gold)", marginLeft: "0.5rem" }}>
                · {projects.filter((p) => p.is_featured).length} featured
              </span>
            )}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            className="adm-btn adm-btn-secondary"
            onClick={handleSyncCatalog}
            disabled={syncing || loading}
          >
            {syncing ? "Se sincronizează…" : "Sincronizează catalog"}
          </button>
          <Link href="/admin/proiecte/nou" className="adm-btn adm-btn-primary">
            <Plus size={14} />
            Proiect Nou
          </Link>
        </div>
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
            gridTemplateColumns: "90px 1fr 130px 110px 100px 130px",
            gap: "0",
            padding: "0.75rem 1rem",
            background: "#141312",
            borderBottom: "1px solid #2a2724",
          }}
        >
          {["", "Titlu", "Categorie / Status", "An · Suprafață", "Actualizat", "Acțiuni"].map((h) => (
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
          ))}
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
          filtered.map((project, i) => {
            const thumbnail =
              project.coverImage ||
              project.cover_image ||
              project.images?.[0]?.url ||
              "";
            const updatedAt = project.updatedAt || project.updated_at || "";
            const status = project.status || "published";

            return (
              <div
                key={project.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 1fr 130px 110px 100px 130px",
                  alignItems: "center",
                  borderBottom:
                    i < filtered.length - 1 ? "1px solid #1f1e1c" : "none",
                  background: i % 2 === 0 ? "#1a1917" : "#171614",
                  transition: "background 120ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#1e1c19";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    i % 2 === 0 ? "#1a1917" : "#171614";
                }}
              >
                {/* Thumbnail */}
                <div style={{ padding: "0.75rem 0.5rem 0.75rem 1rem" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "60px",
                      borderRadius: "4px",
                      overflow: "hidden",
                      background: "#141312",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      flexShrink: 0,
                    }}
                  >
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={project.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <ImageIcon size={20} color="#3a3632" />
                    )}
                    {/* Featured star overlay */}
                    {project.is_featured && (
                      <div
                        style={{
                          position: "absolute",
                          top: "3px",
                          right: "3px",
                          width: "16px",
                          height: "16px",
                          background: "rgba(201,169,132,0.9)",
                          borderRadius: "2px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Proiect featured"
                      >
                        <Star size={9} color="#0f0e0d" fill="#0f0e0d" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Title + location + image count */}
                <div style={{ padding: "0.75rem 0.5rem" }}>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#e8e0d5",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    {project.is_featured && (
                      <Star
                        size={11}
                        color="#c9a984"
                        fill="#c9a984"
                        style={{ flexShrink: 0 }}
                      />
                    )}
                    {project.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: "3px",
                    }}
                  >
                    {project.location && (
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "#5a5450",
                        }}
                      >
                        {project.location}
                      </span>
                    )}
                    {project.images?.length > 0 && (
                      <span
                        style={{
                          fontSize: "0.65rem",
                          color: "#4a4540",
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                      >
                        <ImageIcon size={9} />
                        {project.images.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* Category + Status badge */}
                <div style={{ padding: "0.75rem 0.5rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.2rem 0.6rem",
                      background: "rgba(201,169,132,0.1)",
                      color: "#c9a984",
                      borderRadius: "3px",
                      fontSize: "0.68rem",
                      letterSpacing: "0.04em",
                      marginBottom: "4px",
                    }}
                  >
                    {project.category}
                  </span>
                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.15rem 0.45rem",
                        background:
                          status === "published"
                            ? "rgba(109,191,138,0.12)"
                            : "rgba(90,84,80,0.25)",
                        color:
                          status === "published" ? "#6dbf8a" : "#7a7270",
                        borderRadius: "2px",
                        fontSize: "0.62rem",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {status === "published" ? "Publicat" : "Ciornă"}
                    </span>
                  </div>
                </div>

                {/* Year + Surface */}
                <div style={{ padding: "0.75rem 0.5rem" }}>
                  {project.year && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#7a7270",
                        marginBottom: "2px",
                      }}
                    >
                      {project.year}
                    </div>
                  )}
                  {project.surface && (
                    <div style={{ fontSize: "0.72rem", color: "#5a5450" }}>
                      {project.surface}
                    </div>
                  )}
                  {!project.year && !project.surface && (
                    <span style={{ fontSize: "0.7rem", color: "#3a3632" }}>—</span>
                  )}
                </div>

                {/* Date */}
                <div
                  style={{
                    padding: "0.75rem 0.5rem",
                    fontSize: "0.75rem",
                    color: "#5a5450",
                  }}
                >
                  {updatedAt ? formatDate(updatedAt) : "—"}
                </div>

                {/* Actions: Edit + Duplicate + Delete */}
                <div
                  style={{
                    padding: "0.75rem 1rem 0.75rem 0.5rem",
                    display: "flex",
                    gap: "0.4rem",
                    alignItems: "center",
                  }}
                >
                  {/* Edit */}
                  <Link
                    href={`/admin/proiecte/${encodeURIComponent(project.slug || project.id)}`}
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

                  {/* Duplicate */}
                  <button
                    onClick={() => handleDuplicate(project)}
                    disabled={duplicating === project.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      background: "rgba(100,130,180,0.1)",
                      border: "none",
                      borderRadius: "4px",
                      color: "#7090c8",
                      cursor: duplicating === project.id ? "wait" : "pointer",
                      opacity: duplicating === project.id ? 0.5 : 1,
                    }}
                    title="Duplică proiectul"
                  >
                    <Copy size={14} />
                  </button>

                  {/* Delete */}
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
            );
          })
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
