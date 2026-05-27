import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Moodilier — Mobilier La Comandă Premium | București",
  description:
    "Mobilier premium la comandă din București — bucătării, dressinguri, livinguri, dormitoare și spații comerciale. Design contemporan, execuție impecabilă.",
};

const featuredProjects = [
  {
    title: "Vila Cosmopolis",
    category: "Rezidențial",
    image: "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg",
    href: "/proiecte",
  },
  {
    title: "Apt. Olimp",
    category: "Rezidențial",
    image: "/images-scraped/Olimp_03.jpg",
    href: "/proiecte",
  },
  {
    title: "Casa Mogoșoaia",
    category: "Rezidențial",
    image: "/images-scraped/Mogosoaia_01.jpg",
    href: "/proiecte",
  },
  {
    title: "Apt. Mamaia Nord",
    category: "Rezidențial",
    image: "/images-scraped/Black_Pearl_01.jpg",
    href: "/proiecte",
  },
  {
    title: "AppTown North",
    category: "Rezidențial",
    image: "/images-scraped/apptown_exec_28.jpg",
    href: "/proiecte",
  },
  {
    title: "Sediu de Birouri",
    category: "Comercial",
    image: "/images-scraped/carusel_office.jpg",
    href: "/proiecte",
  },
];

const services = [
  {
    num: "01",
    title: "Servicii de proiectare",
    desc: "Concept, vizualizări 3D și proiectare tehnică completă, adaptată spațiului și stilului tău.",
  },
  {
    num: "02",
    title: "Mobilier la comandă",
    desc: "Bucătării, dressinguri, livinguri, dormitoare și spații comerciale executate impecabil în atelierul propriu.",
  },
  {
    num: "03",
    title: "Moodilier Store",
    desc: "Import selecționat de mobilier premium de la designeri consacrați din Italia, Danemarca și Grecia.",
  },
  {
    num: "04",
    title: "Montaj profesionist",
    desc: "Montaj precis și verificare finală pentru ca fiecare detaliu să respecte standardele noastre.",
  },
  {
    num: "05",
    title: "Spații comerciale",
    desc: "Recepții, birouri, showroom-uri și magazine — mobilier care reflectă identitatea brandului.",
  },
  {
    num: "06",
    title: "Design interior",
    desc: "Consiliere completă de design interior pentru proiecte rezidențiale și comerciale premium.",
  },
];

const stats = [
  { num: "10+", label: "Ani experiență" },
  { num: "200+", label: "Proiecte finalizate" },
  { num: "100%", label: "Execuție proprie" },
  { num: "24h", label: "Răspuns ofertă" },
];

const supplierLogos = [
  "/images-scraped/logo_01_egger.png",
  "/images-scraped/logo_03_blum.png",
  "/images-scraped/logo_06_himacs.png",
  "/images-scraped/logo_05_krono.png",
  "/images-scraped/logo_02_avo.png",
  "/images-scraped/logo_07_hafele.png",
  "/images-scraped/logo_04_corian.png",
  "/images-scraped/logo_08_sch.png",
];

// Marquee items — duplicated so the loop looks seamless
const marqueeItems = [
  "Bucătării", "Dressinguri", "Livinguri", "Dormitoare",
  "Spații comerciale", "Design interior", "Mobilier premium",
  "Execuție proprie",
];

export default function HomePage() {
  return (
    <>
      {/* ============== HERO ============== */}
      <section className="hero" style={{ minHeight: "100vh" }}>
        <div className="hero-bg">
          <Image
            src="/images-scraped/Olimp_03.jpg"
            alt="Moodilier — Mobilier Premium"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            unoptimized
          />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-tagline">Tailored ✦ Furniture</p>
          <h1 className="hero-title">
            The Art of<br />Custom Furniture
          </h1>
          <p className="hero-subtitle">
            Mobilier premium pe comandă, executat impecabil.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/proiecte" className="btn btn-primary">
              Descoperă proiectele
              <ArrowRight size={14} />
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Solicită o ofertă
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <span className="scroll-label">Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ============== MARQUEE STRIP ============== */}
      <div className="marquee-strip">
        <div className="marquee-track" aria-hidden="true">
          {/* Duplicated 3× for seamless loop */}
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-dot">✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ============== ABOUT ============== */}
      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="reveal">
              <div className="about-image-wrap">
                <Image
                  src="/images-scraped/mobilier-premium-01.webp"
                  alt="Atelier Moodilier"
                  width={700}
                  height={500}
                  style={{ width: "100%", height: "500px", objectFit: "cover" }}
                  unoptimized
                />
              </div>
            </div>
            <div className="reveal reveal-delay-2">
              <p className="label" style={{ marginBottom: "1.5rem" }}>Despre noi</p>
              <h2 style={{ marginBottom: "1.5rem" }}>
                „The Art of Custom Furniture"
              </h2>
              <span className="gold-line" />
              <p style={{ marginBottom: "1.25rem" }}>
                La Moodilier transformăm ideile de amenajare în piese de mobilier premium la
                comandă, create pentru spații elegante, funcționale şi atemporale.
              </p>
              <p style={{ marginBottom: "1.25rem" }}>
                Cu peste 10 ani de experiență în proiectarea și producția de mobilier premium,
                realizăm soluții personalizate pentru interioare rezidențiale și comerciale,
                punând accent pe design contemporan, materiale atent selecționate și execuție impecabilă.
              </p>
              <p style={{ marginBottom: "2.5rem" }}>
                Fiecare proiect este conceput în jurul stilului și nevoilor fiecărui client —
                de la bucătării premium, livinguri și dormitoare, până la recepții, birouri,
                showroom-uri și spații comerciale moderne.
              </p>
              <Link href="/despre-noi" className="btn btn-ghost">
                Află mai multe despre noi
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-row">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item reveal">
                <p className="stat-num">{stat.num}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== SERVICES ============== */}
      <section className="section" style={{ background: "var(--color-bg-alt)", padding: "var(--space-xl) 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p className="label" style={{ marginBottom: "1rem" }}>Ce oferim</p>
            <h2>Servicii oferite</h2>
          </div>
          <div className="services-grid">
            {services.map((service, i) => (
              <div key={i} className="service-card reveal" style={{ transitionDelay: `${(i % 3) * 0.1}s` }}>
                <p className="service-number">{service.num}</p>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link href="/servicii" className="btn btn-outline">
              Toate serviciile noastre
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============== PROJECTS ============== */}
      <section className="section">
        <div className="section-header-flex">
          <div>
            <p className="label" style={{ marginBottom: "1rem" }}>Portofoliu</p>
            <h2>Proiecte realizate</h2>
          </div>
          <Link href="/proiecte" className="btn btn-ghost">
            Vezi toate proiectele
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="projects-grid">
          {featuredProjects.map((project, i) => (
            <Link
              key={i}
              href={project.href}
              className="project-card reveal"
              style={{ transitionDelay: `${(i % 3) * 0.1}s` }}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
              <div className="project-card-overlay">
                <p className="project-card-cat">{project.category}</p>
                <h3 className="project-card-title">{project.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============== PROCESS ============== */}
      <section className="section" style={{ background: "var(--color-bg-alt)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p className="label" style={{ marginBottom: "1rem" }}>Cum lucrăm</p>
            <h2>Etapele unui proiect</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2px", background: "var(--color-border)" }}>
            {[
              { step: "1", title: "Consultare inițială", desc: "Analizăm cerințele proiectului, stilul dorit și particularitățile spațiului." },
              { step: "2", title: "Măsurători și concept", desc: "Efectuăm măsurătorile exacte și dezvoltăm conceptul de design personalizat." },
              { step: "3", title: "Proiect tehnic", desc: "Realizăm proiectul tehnic complet cu dimensiuni, materiale, finisaje și accesorii." },
              { step: "4", title: "Producție", desc: "Piesele sunt executate în atelierul propriu cu tehnologie modernă și finisaje premium." },
              { step: "5", title: "Montaj și finisare", desc: "Montaj profesionist cu verificare finală a fiecărui detaliu." },
            ].map((item, i) => (
              <div
                key={i}
                className="service-card reveal"
                style={{ background: "var(--color-bg)", textAlign: "center", alignItems: "center", transitionDelay: `${i * 0.08}s` }}
              >
                <div className="process-step-num">{item.step}</div>
                <h4 style={{ color: "var(--color-fg)", fontSize: "1rem", fontWeight: 500 }}>{item.title}</h4>
                <p style={{ fontSize: "0.85rem", color: "var(--color-fg-subtle)", textAlign: "center", maxWidth: "100%" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FULL-BLEED IMAGE BREAK ============== */}
      <div className="full-bleed-image">
        <Image
          src="/images-scraped/vila_corbeanca_exec_living_4.jpg"
          alt="Moodilier — interior premium"
          fill
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
          unoptimized
        />
        <div className="full-bleed-overlay">
          <blockquote className="full-bleed-quote">
            „We Are The Furniture Engineers"
          </blockquote>
        </div>
      </div>

      {/* ============== SUPPLIERS ============== */}
      <section style={{ padding: "5rem 0", borderBottom: "1px solid var(--color-border)" }}>
        <div className="container">
          <p className="label" style={{ textAlign: "center", marginBottom: "2.5rem" }}>Furnizori parteneri</p>
          <div className="supplier-logos">
            {supplierLogos.map((logo, i) => (
              <div key={i} className="supplier-logo">
                <Image
                  src={logo}
                  alt={`Furnizor partener ${i + 1}`}
                  width={120}
                  height={50}
                  style={{ height: "32px", width: "auto", objectFit: "contain" }}
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section className="cta-section">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <p className="label" style={{ marginBottom: "1.5rem" }}>Hai să lucrăm împreună</p>
          <h2 style={{ maxWidth: "600px", margin: "0 auto 1.5rem" }}>
            Transformăm viziunea ta în mobilier premium
          </h2>
          <p style={{ maxWidth: "50ch", margin: "0 auto 2.5rem", textAlign: "center" }}>
            Moodilier înseamnă mobilier la comandă realizat cu precizie, rafinament și pasiune
            pentru design interior premium.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-primary">
              Solicită o ofertă gratuită
              <ArrowRight size={14} />
            </Link>
            <Link href="/proiecte" className="btn btn-outline">
              Descoperă portofoliul
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
