"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AccesUnlockClient() {
  const router = useRouter();
  const search = useSearchParams();
  const from = search.get("from") || "/";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/preview/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string; locked?: boolean };
      if (!res.ok) {
        setError(data.error || "Parolă incorectă.");
        setLoading(false);
        return;
      }
      const target = from.startsWith("/") && !from.startsWith("//") ? from : "/";
      router.replace(target);
      router.refresh();
    } catch {
      setError("Eroare de conexiune. Încercați din nou.");
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "2rem 1.25rem",
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, #1a1a1a 0%, #070707 55%)",
        color: "#fff",
        fontFamily: "Montserrat, system-ui, sans-serif",
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: "min(100%, 400px)",
          padding: "2.25rem 1.75rem",
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(12,12,12,0.85)",
          backdropFilter: "blur(10px)",
        }}
      >
        <p
          style={{
            margin: "0 0 0.65rem",
            fontSize: "0.65rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#efae74",
          }}
        >
          Preview privat
        </p>
        <h1
          style={{
            margin: "0 0 0.5rem",
            fontFamily: "Georgia, 'Playfair Display', serif",
            fontSize: "1.85rem",
            fontWeight: 500,
          }}
        >
          Moodilier
        </h1>
        <p style={{ margin: "0 0 1.5rem", opacity: 0.7, fontSize: "0.92rem", lineHeight: 1.5 }}>
          Site-ul este protejat. Introduceți parola de acces pentru a-l vizualiza.
        </p>

        <label
          htmlFor="preview-password"
          style={{
            display: "block",
            marginBottom: "0.4rem",
            fontSize: "0.7rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            opacity: 0.75,
          }}
        >
          Parolă
        </label>
        <input
          id="preview-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          autoComplete="current-password"
          placeholder="••••••••"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "0.85rem 0.9rem",
            border: error ? "1px solid #c44" : "1px solid rgba(255,255,255,0.2)",
            background: "#111",
            color: "#fff",
            marginBottom: "0.85rem",
            fontSize: "1rem",
          }}
        />

        {error ? (
          <p style={{ margin: "0 0 0.85rem", color: "#f0a0a0", fontSize: "0.85rem" }}>{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.9rem 1rem",
            border: "none",
            background: "#fff",
            color: "#111",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            cursor: loading ? "wait" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Se verifică…" : "Intră pe site"}
        </button>
      </form>
    </main>
  );
}
