"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Activează modul luminos" : "Activează modul întunecat"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      style={{
        background: "none",
        border: "1px solid var(--color-border)",
        borderRadius: "50%",
        width: "2rem",
        height: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "var(--color-fg-subtle)",
        transition: "color 0.3s, border-color 0.3s",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.color = "var(--color-gold)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-gold)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.color = "var(--color-fg-subtle)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
      }}
    >
      {theme === "dark" ? (
        /* Sun icon */
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <line x1="12" y1="2" x2="12" y2="4"/>
          <line x1="12" y1="20" x2="12" y2="22"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="2" y1="12" x2="4" y2="12"/>
          <line x1="20" y1="12" x2="22" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        /* Moon icon */
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}
