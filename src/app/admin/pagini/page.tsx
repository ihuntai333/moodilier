import Link from "next/link";
import {
  Home,
  FolderOpen,
  Briefcase,
  Users,
  Mail,
  Pencil,
  Lightbulb,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "Pagini | Admin Moodilier",
};

const pages = [
  {
    id: "homepage",
    title: "Homepage",
    description:
      "Proiecte featured, branding și SEO — controlate din Proiecte + Setări.",
    href: "/admin/pagini/homepage",
    icon: Home,
    badge: "Live",
    featured: true,
    cta: "Deschide",
  },
  {
    id: "proiecte",
    title: "Proiecte (listă)",
    description:
      "Gestionează proiectele din portofoliu: poze, video la hover, SEO, status publicat/ciornă.",
    href: "/admin/proiecte",
    icon: FolderOpen,
    badge: "Disponibil",
    featured: true,
    cta: "Editează",
  },
  {
    id: "servicii",
    title: "Servicii",
    description:
      "Conținutul paginii Servicii este încă în cod pentru moment. Editor dedicat urmează.",
    href: "/admin/pagini/servicii",
    icon: Briefcase,
    badge: "Stub",
    featured: false,
    cta: "Vezi detalii",
  },
  {
    id: "despre",
    title: "Despre noi",
    description:
      "Pagină Despre noi — editor dedicat în pregătire. Momentan conținutul e în cod.",
    href: "/admin/pagini/despre",
    icon: Users,
    badge: "Stub",
    featured: false,
    cta: "Vezi detalii",
  },
  {
    id: "contact",
    title: "Contact",
    description:
      "Telefon, email, adresă și rețele sociale se editează din Setări (informații de contact).",
    href: "/admin/setari",
    icon: Mail,
    badge: "Via Setări",
    featured: false,
    cta: "Deschide Setări",
  },
] as const;

export default function AdminPaginiPage() {
  return (
    <div className="adm-page">
      <div style={{ marginBottom: "1.75rem" }}>
        <p className="adm-eyebrow">Conținut site</p>
        <h1 className="adm-title">Pagini</h1>
        <p className="adm-subtitle">
          Alege pagina pe care vrei să o editezi. Fiecare card te duce direct la
          editorul sau la zona de setări corespunzătoare.
        </p>
      </div>

      <div className="adm-tip">
        <div className="adm-tip-icon">
          <Lightbulb size={18} strokeWidth={1.75} />
        </div>
        <div className="adm-tip-body">
          <h2 className="adm-tip-title">Cum editezi rapid</h2>
          <p className="adm-tip-text">
            Proiectele (poze, video, featured, SEO) din{" "}
            <Link href="/admin/proiecte">Proiecte</Link>. Logo, meniuri, contact
            și Google Analytics din <Link href="/admin/setari">Setări</Link>.
          </p>
        </div>
      </div>

      <div className="adm-page-grid">
        {pages.map((page) => {
          const Icon = page.icon;
          return (
            <article
              key={page.id}
              className={`adm-page-card${page.featured ? " is-featured" : ""}`}
            >
              <div className="adm-page-card-icon">
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <span
                className={`adm-page-card-badge${
                  page.featured ? "" : " adm-page-card-badge--muted"
                }`}
              >
                {page.badge}
              </span>
              <h2 className="adm-page-card-title">{page.title}</h2>
              <p className="adm-page-card-desc">{page.description}</p>
              <Link
                href={page.href}
                className={`adm-btn ${
                  page.featured ? "adm-btn-primary" : "adm-btn-secondary"
                }`}
              >
                <Pencil size={14} />
                {page.cta}
                {page.id === "contact" && <ExternalLink size={13} />}
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
