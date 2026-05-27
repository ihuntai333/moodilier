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
    <div
      style={{
        background: "#1a1917",
        border: "1px solid #2a2724",
        borderRadius: "8px",
        padding: "1.5rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          background: accent ? "rgba(201,169,132,0.12)" : "rgba(255,255,255,0.04)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon
          size={20}
          strokeWidth={1.5}
          color={accent ? "#c9a984" : "#6a6460"}
        />
      </div>
      <div>
        <div
          style={{
            fontSize: "0.7rem",
            color: "#6a6460",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "0.4rem",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "1.75rem",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 400,
            color: accent ? "#c9a984" : "#e8e0d5",
            lineHeight: 1,
          }}
        >
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
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: "1200px" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 500,
            color: "#e8e0d5",
            marginBottom: "0.25rem",
          }}
        >
          Dashboard
        </h1>
        <p style={{ fontSize: "0.85rem", color: "#6a6460", maxWidth: "none" }}>
          Bun venit în panoul de administrare Moodilier.
        </p>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                background: "#1a1917",
                border: "1px solid #2a2724",
                borderRadius: "8px",
                padding: "1.5rem",
                height: "96px",
                animation: "pulse 1.5s infinite",
              }}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
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

      {/* Quick actions */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#5a5450",
            marginBottom: "1rem",
          }}
        >
          Acțiuni rapide
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
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
          <Link
            href="/admin/setari"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.7rem 1.25rem",
              background: "transparent",
              color: "#c9a984",
              border: "1px solid #c9a984",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            <Settings size={14} />
            Setări
          </Link>
          <Link
            href="/admin/mesaje"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.7rem 1.25rem",
              background: "transparent",
              color: "#9a9088",
              border: "1px solid #2a2724",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            <MessageSquare size={14} />
            Vezi Mesaje
          </Link>
        </div>
      </div>

      {/* Recent messages */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#5a5450",
            }}
          >
            Mesaje Recente
          </div>
          <Link
            href="/admin/mesaje"
            style={{
              fontSize: "0.75rem",
              color: "#c9a984",
              textDecoration: "none",
            }}
          >
            Vezi toate →
          </Link>
        </div>

        <div
          style={{
            background: "#1a1917",
            border: "1px solid #2a2724",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {!stats || stats.recentMessages.length === 0 ? (
            <div
              style={{
                padding: "3rem",
                textAlign: "center",
                color: "#5a5450",
                fontSize: "0.875rem",
              }}
            >
              Nu există mesaje încă.
            </div>
          ) : (
            stats.recentMessages.map((msg, i) => (
              <div
                key={msg.id}
                style={{
                  padding: "1rem 1.5rem",
                  borderBottom:
                    i < stats.recentMessages.length - 1
                      ? "1px solid #1f1e1c"
                      : "none",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: msg.read ? "#3a3632" : "#c9a984",
                    marginTop: "0.4rem",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: msg.read ? 400 : 600,
                        color: "#e8e0d5",
                      }}
                    >
                      {msg.nume}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#5a5450" }}>
                      {msg.email}
                    </span>
                    {msg.telefon && (
                      <span style={{ fontSize: "0.75rem", color: "#5a5450" }}>
                        {msg.telefon}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#7a7270",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100%",
                    }}
                  >
                    {msg.mesaj}
                  </p>
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#4a4540",
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
