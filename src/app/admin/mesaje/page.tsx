"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Mail,
  Phone,
  Trash2,
  Eye,
  EyeOff,
  X,
} from "lucide-react";

interface Message {
  id: string;
  nume: string;
  email: string;
  telefon?: string;
  mesaj: string;
  data: string;
  read: boolean;
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

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n) + "…" : str;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  async function markRead(id: string, read: boolean) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read } : m))
    );
    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, read } : null));
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } finally {
      setDeleting(null);
    }
  }

  async function openMessage(msg: Message) {
    setSelected(msg);
    if (!msg.read) {
      await markRead(msg.id, true);
    }
  }

  const filtered =
    filter === "unread" ? messages.filter((m) => !m.read) : messages;
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: "1100px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
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
            Mesaje
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#6a6460", maxWidth: "none" }}>
            {messages.length} mesaj{messages.length !== 1 ? "e" : ""} total
            {unreadCount > 0 && (
              <span
                style={{
                  marginLeft: "0.5rem",
                  background: "rgba(201,169,132,0.15)",
                  color: "#c9a984",
                  padding: "0.1rem 0.5rem",
                  borderRadius: "999px",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                }}
              >
                {unreadCount} necitit{unreadCount !== 1 ? "e" : ""}
              </span>
            )}
          </p>
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            background: "#1a1917",
            border: "1px solid #2a2724",
            borderRadius: "6px",
            padding: "0.25rem",
          }}
        >
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "0.4rem 0.875rem",
                borderRadius: "4px",
                background: filter === f ? "#2a2724" : "transparent",
                color: filter === f ? "#e8e0d5" : "#6a6460",
                border: "none",
                fontSize: "0.75rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 150ms ease",
              }}
            >
              {f === "all" ? "Toate" : "Necitite"}
            </button>
          ))}
        </div>
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
            gridTemplateColumns: "8px 1fr 160px 1fr 120px 80px 100px",
            padding: "0.75rem 1rem",
            background: "#141312",
            borderBottom: "1px solid #2a2724",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          {["", "Nume", "Email", "Mesaj", "Data", "Status", "Acțiuni"].map(
            (h) => (
              <div
                key={h}
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#5a5450",
                  fontWeight: 600,
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
            {filter === "unread"
              ? "Nu există mesaje necitite."
              : "Nu există mesaje."}
          </div>
        ) : (
          filtered.map((msg, i) => (
            <div
              key={msg.id}
              onClick={() => openMessage(msg)}
              style={{
                display: "grid",
                gridTemplateColumns: "8px 1fr 160px 1fr 120px 80px 100px",
                gap: "0.75rem",
                alignItems: "center",
                padding: "0.875rem 1rem",
                borderBottom:
                  i < filtered.length - 1 ? "1px solid #1f1e1c" : "none",
                background: i % 2 === 0 ? "#1a1917" : "#171614",
                cursor: "pointer",
                transition: "background 100ms ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#1f1e1c")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background =
                  i % 2 === 0 ? "#1a1917" : "#171614")
              }
            >
              {/* Unread dot */}
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: msg.read ? "transparent" : "#c9a984",
                  flexShrink: 0,
                }}
              />

              {/* Name + phone */}
              <div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: msg.read ? 400 : 600,
                    color: "#e8e0d5",
                    marginBottom: "2px",
                  }}
                >
                  {msg.nume}
                </div>
                {msg.telefon && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#5a5450",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <Phone size={10} />
                    {msg.telefon}
                  </div>
                )}
              </div>

              {/* Email */}
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#7a7270",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {msg.email}
              </div>

              {/* Message preview */}
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#5a5450",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {truncate(msg.mesaj, 80)}
              </div>

              {/* Date */}
              <div style={{ fontSize: "0.75rem", color: "#4a4540" }}>
                {formatDate(msg.data)}
              </div>

              {/* Status */}
              <div>
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "3px",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    background: msg.read
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(201,169,132,0.12)",
                    color: msg.read ? "#5a5450" : "#c9a984",
                  }}
                >
                  {msg.read ? "citit" : "nou"}
                </span>
              </div>

              {/* Actions */}
              <div
                style={{ display: "flex", gap: "0.4rem" }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => markRead(msg.id, !msg.read)}
                  title={msg.read ? "Marchează necitit" : "Marchează citit"}
                  style={{
                    width: "30px",
                    height: "30px",
                    background: "rgba(255,255,255,0.04)",
                    border: "none",
                    borderRadius: "4px",
                    color: "#7a7270",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {msg.read ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <button
                  onClick={() => handleDelete(msg.id)}
                  disabled={deleting === msg.id}
                  title="Șterge"
                  style={{
                    width: "30px",
                    height: "30px",
                    background: "rgba(224,112,112,0.08)",
                    border: "none",
                    borderRadius: "4px",
                    color: "#e07070",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Drawer/Modal */}
      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 100,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "480px",
              height: "100vh",
              background: "#1a1917",
              borderLeft: "1px solid #2a2724",
              padding: "2rem",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "#5a5450",
                    marginBottom: "0.25rem",
                  }}
                >
                  Mesaj de la
                </div>
                <div
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "#e8e0d5",
                  }}
                >
                  {selected.nume}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{
                  width: "36px",
                  height: "36px",
                  background: "#141312",
                  border: "1px solid #2a2724",
                  borderRadius: "6px",
                  color: "#7a7270",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Contact info */}
            <div
              style={{
                background: "#141312",
                border: "1px solid #2a2724",
                borderRadius: "6px",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Mail size={14} color="#c9a984" />
                <a
                  href={`mailto:${selected.email}`}
                  style={{
                    fontSize: "0.875rem",
                    color: "#c9a984",
                    textDecoration: "none",
                  }}
                >
                  {selected.email}
                </a>
              </div>
              {selected.telefon && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Phone size={14} color="#7a7270" />
                  <a
                    href={`tel:${selected.telefon}`}
                    style={{
                      fontSize: "0.875rem",
                      color: "#9a9088",
                      textDecoration: "none",
                    }}
                  >
                    {selected.telefon}
                  </a>
                </div>
              )}
              <div style={{ fontSize: "0.75rem", color: "#4a4540" }}>
                {formatDate(selected.data)}
              </div>
            </div>

            {/* Message body */}
            <div>
              <div
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#5a5450",
                  marginBottom: "0.75rem",
                }}
              >
                Conținut mesaj
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "#c8bfb5",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                }}
              >
                {selected.mesaj}
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginTop: "auto",
                paddingTop: "1.5rem",
                borderTop: "1px solid #2a2724",
              }}
            >
              <a
                href={`mailto:${selected.email}?subject=Re: Moodilier`}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.7rem",
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
                <Mail size={14} />
                Răspunde
              </a>
              <button
                onClick={() => handleDelete(selected.id)}
                style={{
                  padding: "0.7rem 1rem",
                  background: "rgba(224,112,112,0.1)",
                  color: "#e07070",
                  border: "1px solid rgba(224,112,112,0.2)",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Trash2 size={14} />
                Șterge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
