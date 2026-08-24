"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderOpen,
  MessageSquare,
  Image,
  Clock,
  Plus,
  Settings,
  FileText,
} from "lucide-react";

interface Stats {
  totalProjects: number;
  unreadMessages: number;
  totalImages: number;
  lastUpdated: string | null;
  recentMessages: {
    id: string;
    nume: string;
    email: string;
    telefon?: string;
    mesaj: string;
    data: string;
    read: boolean;
  }[];
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="adm-stat-card">
      <div className={`adm-stat-icon${accent ? " is-accent" : ""}`}>
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div>
        <div className="adm-stat-label">{label}</div>
        <div className={`adm-stat-value${accent ? " is-accent" : ""}`}>
          {value}
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data?.error) {
          setStats({
            totalProjects: 0,
            unreadMessages: 0,
            totalImages: 0,
            lastUpdated: null,
            recentMessages: [],
          });
        } else {
          setStats({
            totalProjects: data.totalProjects ?? 0,
            unreadMessages: data.unreadMessages ?? 0,
            totalImages: data.totalImages ?? 0,
            lastUpdated: data.lastUpdated ?? null,
            recentMessages: Array.isArray(data.recentMessages)
              ? data.recentMessages
              : [],
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="adm-page">
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 className="adm-title">Dashboard</h1>
        <p className="adm-subtitle">
          Bun venit în panoul de administrare Moodilier.
        </p>
      </div>

      <div className="adm-tip">
        <div className="adm-tip-icon">
          <FileText size={18} strokeWidth={1.75} />
        </div>
        <div className="adm-tip-body">
          <h2 className="adm-tip-title">Unde editezi conținutul?</h2>
          <p className="adm-tip-text">
            Homepage-ul se editează din{" "}
            <Link href="/admin/pagini">Pagini → Homepage</Link>. Proiectele
            (poze, video hover, SEO) din{" "}
            <Link href="/admin/proiecte">Proiecte</Link>. Contact &amp; site din{" "}
            <Link href="/admin/setari">Setări</Link>.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="adm-stat-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="adm-skeleton" />
          ))}
        </div>
      ) : (
        <div className="adm-stat-grid">
          <StatCard
            icon={FolderOpen}
            label="Total Proiecte"
            value={stats?.totalProjects ?? 0}
            accent
          />
          <StatCard
            icon={MessageSquare}
            label="Mesaje Necitite"
            value={stats?.unreadMessages ?? 0}
            accent={(stats?.unreadMessages ?? 0) > 0}
          />
          <StatCard
            icon={Image}
            label="Total Imagini"
            value={stats?.totalImages ?? 0}
          />
          <StatCard
            icon={Clock}
            label="Ultima Actualizare"
            value={
              stats?.lastUpdated
                ? new Intl.DateTimeFormat("ro-RO", {
                    day: "2-digit",
                    month: "short",
                  }).format(new Date(stats.lastUpdated))
                : "—"
            }
          />
        </div>
      )}

      <div style={{ marginBottom: "2.5rem" }}>
        <div className="adm-section-label">Acțiuni rapide</div>
        <div className="adm-actions">
          <Link href="/admin/pagini/homepage" className="adm-btn adm-btn-primary">
            <FileText size={14} />
            Editează Homepage
          </Link>
          <Link href="/admin/proiecte/nou" className="adm-btn adm-btn-secondary">
            <Plus size={14} />
            Proiect Nou
          </Link>
          <Link href="/admin/setari" className="adm-btn adm-btn-ghost">
            <Settings size={14} />
            Setări
          </Link>
          <Link href="/admin/mesaje" className="adm-btn adm-btn-ghost">
            <MessageSquare size={14} />
            Vezi Mesaje
          </Link>
        </div>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div className="adm-section-label" style={{ marginBottom: 0 }}>
            Mesaje Recente
          </div>
          <Link
            href="/admin/mesaje"
            style={{
              fontSize: "0.75rem",
              color: "var(--adm-gold-hover)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Vezi toate →
          </Link>
        </div>

        <div className="adm-msg-list">
          {!stats || (stats.recentMessages?.length ?? 0) === 0 ? (
            <div className="adm-table-empty">Nu există mesaje încă.</div>
          ) : (
            stats.recentMessages.map((msg) => (
              <div key={msg.id} className="adm-msg-item">
                <div
                  className={`adm-dot${msg.read ? "" : " is-unread"}`}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.25rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: msg.read ? 400 : 600,
                        color: "var(--adm-text)",
                      }}
                    >
                      {msg.nume}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--adm-text-muted)",
                      }}
                    >
                      {msg.email}
                    </span>
                    {msg.telefon && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--adm-text-muted)",
                        }}
                      >
                        {msg.telefon}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--adm-text-soft)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100%",
                      margin: 0,
                    }}
                  >
                    {msg.mesaj}
                  </p>
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--adm-text-muted)",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {formatDate(msg.data)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
