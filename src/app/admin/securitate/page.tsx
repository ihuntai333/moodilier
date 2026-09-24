"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Shield,
  RefreshCw,
  Download,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";
import type { ScanCheck, SecurityScan } from "@/lib/security/scan";

function StatusIcon({ status }: { status: ScanCheck["status"] }) {
  if (status === "pass") return <CheckCircle size={16} color="#6dbf8a" />;
  if (status === "warn") return <AlertTriangle size={16} color="#c9a984" />;
  return <XCircle size={16} color="#e07070" />;
}

export default function AdminSecurityPage() {
  const [scan, setScan] = useState<SecurityScan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const runScan = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/security/scan");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan eșuat");
      setScan(data as SecurityScan);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan eșuat");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void runScan();
  }, [runScan]);

  return (
    <div className="adm-page adm-page--narrow">
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="adm-title">Securitate</h1>
        <p className="adm-subtitle">
          Scan intern: auth, headers, lock, upload, Pixel, robots. Nu trimite date
          în afara serverului.
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button
          type="button"
          className="adm-btn adm-btn-primary"
          onClick={() => void runScan()}
          disabled={loading}
        >
          <RefreshCw size={14} />
          {loading ? "Se scanează..." : "Rulează scan"}
        </button>
        <a className="adm-btn adm-btn-secondary" href="/api/admin/security/report">
          <Download size={14} />
          Descarcă raport
        </a>
      </div>

      {error ? (
        <p style={{ color: "#e07070", fontSize: "0.875rem" }}>{error}</p>
      ) : null}

      {scan ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <div className="adm-stat-card">
              <div className="adm-stat-icon is-accent">
                <Shield size={18} />
              </div>
              <div>
                <div className="adm-stat-label">Publicare</div>
                <div className={`adm-stat-value${scan.publishReady ? " is-accent" : ""}`}>
                  {scan.publishReady ? "Gata" : "Blocat"}
                </div>
              </div>
            </div>
            <div className="adm-stat-card">
              <div className="adm-stat-icon">
                <CheckCircle size={18} />
              </div>
              <div>
                <div className="adm-stat-label">OK</div>
                <div className="adm-stat-value">{scan.summary.pass}</div>
              </div>
            </div>
            <div className="adm-stat-card">
              <div className="adm-stat-icon">
                <AlertTriangle size={18} />
              </div>
              <div>
                <div className="adm-stat-label">Atenții</div>
                <div className="adm-stat-value">{scan.summary.warn}</div>
              </div>
            </div>
            <div className="adm-stat-card">
              <div className="adm-stat-icon">
                <XCircle size={18} />
              </div>
              <div>
                <div className="adm-stat-label">Eșuate</div>
                <div className="adm-stat-value">{scan.summary.fail}</div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#1a1917",
              border: "1px solid #2a2724",
              borderRadius: 8,
              padding: "1.25rem 1.5rem",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#5a5450",
                marginBottom: "1rem",
              }}
            >
              Imagini
            </div>
            <p style={{ margin: 0, color: "#c9c2b8", fontSize: "0.875rem", lineHeight: 1.6 }}>
              <ImageIcon size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
              Upload-ul din Admin → Proiecte trece prin Sharp (WebP, max 1920px). Pe site,
              Next/Image folosește quality 90 (listat în next.config). Logo-urile PNG rămân
              nescadate (unoptimized) ca să nu se șteargă transparența.
            </p>
          </div>

          <div
            style={{
              background: "#1a1917",
              border: "1px solid #2a2724",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            {scan.checks.map((c, i) => (
              <div
                key={c.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "20px 1fr",
                  gap: "0.85rem",
                  padding: "0.95rem 1.25rem",
                  borderTop: i === 0 ? "none" : "1px solid #2a2724",
                }}
              >
                <div style={{ paddingTop: 2 }}>
                  <StatusIcon status={c.status} />
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "baseline",
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ color: "#e8e0d5", fontSize: "0.875rem", fontWeight: 500 }}>
                      {c.title}
                    </span>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#6a6460",
                      }}
                    >
                      {c.area}
                    </span>
                  </div>
                  <p style={{ margin: "0.35rem 0 0", color: "#9a9088", fontSize: "0.8rem", lineHeight: 1.55 }}>
                    {c.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.75rem", color: "#5a5450", marginTop: "1rem" }}>
            Generat {new Date(scan.generatedAt).toLocaleString("ro-RO")} · valorile secretelor
            nu apar în raport.
          </p>
        </>
      ) : null}
    </div>
  );
}
