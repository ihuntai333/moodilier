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
    <div className="adm-login">
      <div className="adm-login-inner">
        <div className="adm-login-brand">
          <div className="adm-login-brand-name">Moodilier</div>
          <div className="adm-login-brand-tag">Panou de Administrare</div>
        </div>

        <div className="adm-login-card">
          <h1 className="adm-title" style={{ fontSize: "1.35rem" }}>
            Conectare
          </h1>
          <p className="adm-subtitle" style={{ marginBottom: "1.75rem" }}>
            Introduceți parola pentru a accesa panoul de administrare.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="adm-field">
              <label className="adm-label">Utilizator</label>
              <input type="text" value="admin" disabled className="adm-input" />
            </div>

            <div className="adm-field">
              <label className="adm-label">Parolă</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                autoFocus
                className="adm-input"
                style={error ? { borderColor: "var(--adm-danger)" } : undefined}
              />
            </div>

            {error && <div className="adm-alert adm-alert--error">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="adm-btn adm-btn-primary adm-btn-block"
            >
              {loading ? "Se conectează..." : "Conectare"}
            </button>
          </form>
        </div>

        <p className="adm-login-footer">
          Moodilier © {new Date().getFullYear()} — Acces restricționat
        </p>
      </div>
    </div>
  );
}
