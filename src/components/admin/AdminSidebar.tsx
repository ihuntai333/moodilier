"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  Settings,
  ArrowLeft,
  LogOut,
  Plus,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/proiecte", label: "Proiecte", icon: FolderOpen },
  { href: "/admin/mesaje", label: "Mesaje", icon: MessageSquare },
  { href: "/admin/setari", label: "Setări", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "DELETE" });
    router.push("/admin/login");
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#141312",
        borderRight: "1px solid #2a2724",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "1.75rem 1.5rem 1.5rem",
          borderBottom: "1px solid #2a2724",
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.4rem",
            fontWeight: 300,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#e8e0d5",
          }}
        >
          Moodilier
          <span
            style={{
              display: "block",
              fontSize: "0.6rem",
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.3em",
              color: "#c9a984",
              marginTop: "0.25rem",
            }}
          >
            ADMIN PANEL
          </span>
        </div>
      </div>

      {/* Quick action */}
      <div style={{ padding: "1rem 1.5rem 0.5rem" }}>
        <Link
          href="/admin/proiecte/nou"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#c9a984",
            color: "#0f0e0d",
            padding: "0.6rem 1rem",
            borderRadius: "4px",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "background 200ms ease",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#d9c09a")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#c9a984")
          }
        >
          <Plus size={14} />
          Proiect Nou
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "0.75rem 0.75rem" }}>
        <div
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#5a5450",
            padding: "0.5rem 0.75rem",
            marginBottom: "0.25rem",
          }}
        >
          Navigare
        </div>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.7rem 0.75rem",
                borderRadius: "6px",
                fontSize: "0.875rem",
                fontWeight: active ? 500 : 400,
                color: active ? "#c9a984" : "#9a9088",
                background: active ? "rgba(201,169,132,0.08)" : "transparent",
                textDecoration: "none",
                transition: "all 150ms ease",
                marginBottom: "2px",
                borderLeft: active
                  ? "2px solid #c9a984"
                  : "2px solid transparent",
              }}
            >
              <Icon size={17} strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div
        style={{
          padding: "1rem 0.75rem",
          borderTop: "1px solid #2a2724",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.6rem 0.75rem",
            borderRadius: "6px",
            fontSize: "0.8rem",
            color: "#6a6460",
            textDecoration: "none",
            transition: "color 150ms ease",
          }}
        >
          <ArrowLeft size={15} strokeWidth={1.5} />
          Înapoi la site
        </Link>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.6rem 0.75rem",
            borderRadius: "6px",
            fontSize: "0.8rem",
            color: "#e07070",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "color 150ms ease",
            textAlign: "left",
          }}
        >
          <LogOut size={15} strokeWidth={1.5} />
          Deconectare
        </button>
      </div>
    </aside>
  );
}
