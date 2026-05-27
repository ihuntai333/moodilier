"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Eroare la autentificare.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Eroare de conexiune. Încercați din nou.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0e0d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "2.5rem",
              fontWeight: 300,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#e8e0d5",
            }}
          >
            Moodilier
          </div>
          <div
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#c9a984",
              marginTop: "0.5rem",
            }}
          >
            Panou de Administrare
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#1a1917",
            border: "1px solid #2a2724",
            borderRadius: "8px",
            padding: "2.5rem",
          }}
        >
          <h1
            style={{
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "#e8e0d5",
              marginBottom: "0.5rem",
            }}
          >
            Conectare
          </h1>
          <p
            style={{
              fontSize: "0.8rem",
              color: "#6a6460",
              marginBottom: "2rem",
            }}
          >
            Introduceți parola pentru a accesa panoul de administrare.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "#9a9088",
                  letterSpacing: "0.05em",
                  marginBottom: "0.5rem",
                }}
              >
                Utilizator
              </label>
              <input
                type="text"
                value="admin"
                disabled
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "#0f0e0d",
                  border: "1px solid #2a2724",
                  borderRadius: "4px",
                  color: "#5a5450",
                  fontSize: "0.875rem",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "#9a9088",
                  letterSpacing: "0.05em",
                  marginBottom: "0.5rem",
                }}
              >
                Parolă
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                autoFocus
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "#0f0e0d",
                  border: `1px solid ${error ? "#e07070" : "#2a2724"}`,
                  borderRadius: "4px",
                  color: "#e8e0d5",
                  fontSize: "0.875rem",
                  outline: "none",
                  transition: "border-color 150ms ease",
                }}
                onFocus={(e) => {
                  if (!error)
                    (e.target as HTMLInputElement).style.borderColor = "#c9a984";
                }}
                onBlur={(e) => {
                  if (!error)
                    (e.target as HTMLInputElement).style.borderColor = "#2a2724";
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "rgba(224,112,112,0.1)",
                  border: "1px solid rgba(224,112,112,0.3)",
                  borderRadius: "4px",
                  color: "#e07070",
                  fontSize: "0.8rem",
                  marginBottom: "1.25rem",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.875rem",
                background: loading ? "#8a7a64" : "#c9a984",
                color: "#0f0e0d",
                border: "none",
                borderRadius: "4px",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 150ms ease",
              }}
            >
              {loading ? "Se conectează..." : "Conectare"}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "2rem",
            fontSize: "0.7rem",
            color: "#3a3632",
          }}
        >
          Moodilier © {new Date().getFullYear()} — Acces restricționat
        </p>
      </div>
    </div>
  );
}
