"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  MessageSquare,
  Settings,
  ArrowLeft,
  LogOut,
  Plus,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/pagini", label: "Pagini", icon: FileText },
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
    <aside className="adm-sidebar">
      <div className="adm-sidebar-brand">
        <div className="adm-sidebar-brand-name">
          Moodilier
          <span className="adm-sidebar-brand-tag">Studio</span>
        </div>
      </div>

      <div className="adm-sidebar-quick">
        <Link href="/admin/proiecte/nou" className="adm-btn adm-btn-primary adm-btn-block">
          <Plus size={14} />
          Proiect Nou
        </Link>
      </div>

      <nav className="adm-sidebar-nav">
        <div className="adm-sidebar-nav-label">Navigare</div>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`adm-nav-link${active ? " is-active" : ""}`}
            >
              <Icon size={17} strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="adm-sidebar-foot">
        <Link href="/" className="adm-nav-link adm-nav-link--muted">
          <ArrowLeft size={15} strokeWidth={1.5} />
          Înapoi la site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="adm-nav-link adm-nav-link--danger"
        >
          <LogOut size={15} strokeWidth={1.5} />
          Deconectare
        </button>
      </div>
    </aside>
  );
}
