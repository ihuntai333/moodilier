import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import FrontpageAwardsClient from "@/components/home/FrontpageAwardsClient";
import AwardsIntroLoader from "@/components/home/AwardsIntroLoader";
import HomeHeroSlider from "@/components/home/HomeHeroSlider";
import AwardsProjectCard from "@/components/site/AwardsProjectCard";
import EditableMedia from "@/components/site/EditableMedia";
import { getFeaturedProjects } from "@/lib/projects";
import { getSiteChrome } from "@/lib/site-settings";
import {
  pageMetadata,
  supplierNameFromSrc,
} from "@/lib/site-seo";
import { versionedMediaUrl } from "@/lib/media-url";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const maxDuration = 30;

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/",
    title: "Moodilier — Mobilier la comandă premium în București",
    description:
      "Mobilier premium pe comandă din București — bucătării, dressinguri, livinguri, dormitoare și spații comerciale. Design contemporan, materiale premium, execuție impecabilă în atelierul propriu.",
    image: "/projects/villa-06/01.living.cover.webp",
  }),
  keywords: [
    "mobilier la comandă",
    "mobilier premium București",
    "bucătărie la comandă",
    "dressing la comandă",
    "mobilier living",
    "atelier mobilier București",
    "Moodilier",
  ],
};

const BASE = "https://moodilier.ro";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "FurnitureStore"],
      "@id": `${BASE}/#organization`,
      name: "Moodilier",
      legalName: "SC Moodilier SRL",
      url: BASE,
      telephone: "+40729555431",
      email: "ofertare@moodilier.com",
      description:
        "Atelier premium de mobilier la comandă din București — bucătării, dressinguri, livinguri, dormitoare și spații comerciale executate impecabil.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Bd. Basarabia 256, incinta FAUR",
        addressLocality: "București",
        postalCode: "030694",
        addressRegion: "Sector 3",
        addressCountry: "RO",
      },
      foundingDate: "2013",
      priceRange: "€€€",
      sameAs: [
        "https://www.instagram.com/moodilier/",
        "https://www.facebook.com/moodilier",
        "https://www.tiktok.com/@moodilier",
      ],
    },
    {
      "@type": "WebPage",
      name: "Moodilier — Mobilier La Comandă Premium | București",
      description:
        "Atelier de mobilier la comandă din București — design contemporan și execuție în atelierul propriu.",
      isPartOf: { "@type": "WebSite", name: "Moodilier", url: BASE },
    },
  ],
};

const benefits = [
  {
    title: "La comandă",
    desc: "Proiecte unice, create special pentru spațiul tău.",
    icon: (
      <svg className="aw-benefit-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {/* Tailor's chalk + fine line — bespoke measure */}
        <path d="M8 24 L24 8" />
        <path d="M20.5 8.5 L24 8 L23.5 11.5" />
        <path d="M8 18 H14 M8 21 H11" />
        <circle cx="10" cy="10" r="2.25" />
      </svg>
    ),
  },
  {
    title: "Materiale premium",
    desc: "Selecție atentă — Egger, Blum, Häfele și parteneri.",
    icon: (
      <svg className="aw-benefit-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {/* Veneer / wood slab layers */}
        <path d="M6 11 H26" />
        <path d="M6 16 H26" />
        <path d="M6 21 H26" />
        <path d="M9 11 C11 13.5 13 13.5 15 11 C17 8.5 19 8.5 21 11 C23 13.5 25 13.5 26 11" />
        <path d="M9 16 C11 18.5 13 18.5 15 16 C17 13.5 19 13.5 21 16 C23 18.5 25 18.5 26 16" />
      </svg>
    ),
  },
  {
    title: "Producție proprie",
    desc: "100% execuție în atelierul din București.",
    icon: (
      <svg className="aw-benefit-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {/* Chisel + mallet — atelier craft */}
        <path d="M7 9 H15 L13.5 12 H8.5 Z" />
        <path d="M11 12 V22" />
        <path d="M9.5 22 H12.5 L12 25 H10 Z" />
        <path d="M18 8 L26 16" />
        <path d="M20 6.5 L21.5 8 L19.5 10 L18 8.5 Z" />
        <path d="M24.5 14.5 L26 16 L24 18 L22.5 16.5 Z" />
      </svg>
    ),
  },
  {
    title: "Răspuns în 24h",
    desc: "Îți răspundem rapid cu pașii concreți.",
    icon: (
      <svg className="aw-benefit-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {/* Fine chronograph */}
        <circle cx="16" cy="17" r="9" />
        <path d="M16 12.5 V17.2 L20 19.5" />
        <path d="M16 6.5 V8.5" />
        <path d="M12.5 7.25 H19.5" />
      </svg>
    ),
  },
];

const services = [
  {
    num: "01",
    title: "Servicii de proiectare",
    desc: "Concept, vizualizări 3D și proiectare tehnică completă, adaptată spațiului și stilului tău.",
    icon: (
      <svg className="aw-service-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {/* Architect compass / dividers */}
        <circle cx="20" cy="11" r="2.2" />
        <path d="M20 13.2 L12 31" />
        <path d="M20 13.2 L28 31" />
        <path d="M14.5 25 H25.5" />
        <path d="M11.2 31 H12.8 M27.2 31 H28.8" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Mobilier la comandă",
    desc: "Bucătării, dressinguri, livinguri, dormitoare și spații comerciale executate impecabil în atelierul propriu.",
    icon: (
      <svg className="aw-service-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {/* Side chair silhouette */}
        <path d="M12 18 H27 C29 18 30 19.5 30 21.5 V24 H11 V21 C11 19.2 11.8 18 12 18 Z" />
        <path d="M13 18 V12 C13 10 14.5 9 17 9 H22" />
        <path d="M14 24 V32 M27 24 V32" />
        <path d="M12 32 H16 M25 32 H29" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Perdele și draperii",
    desc: "Perdele, draperii, sisteme de umbrire, sine electrice și storuri romane.",
    icon: (
      <svg className="aw-service-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M10 8 V32" />
        <path d="M30 8 V32" />
        <path d="M10 8 Q20 14 30 8" />
        <path d="M10 12 Q20 20 30 12" />
        <path d="M10 18 Q20 26 30 18" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Montaj profesionist",
    desc: "Montaj precis și verificare finală pentru ca fiecare detaliu să respecte standardele noastre.",
    icon: (
      <svg className="aw-service-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {/* Spirit level */}
        <rect x="7" y="16" width="26" height="8" rx="1" />
        <circle cx="20" cy="20" r="2.4" />
        <path d="M20 17.6 V22.4" />
        <path d="M11 20 H14 M26 20 H29" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Spații comerciale",
    desc: "Recepții, birouri și magazine — mobilier care reflectă identitatea brandului.",
    icon: (
      <svg className="aw-service-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {/* Reception / counter desk */}
        <path d="M8 28 H32" />
        <path d="M10 28 V18 H30 V28" />
        <path d="M10 18 L14 12 H26 L30 18" />
        <path d="M16 22 H24" />
      </svg>
    ),
  },
  {
    num: "06",
    title: "Design interior",
    desc: "Consiliere completă de design interior pentru proiecte rezidențiale și comerciale premium.",
    icon: (
      <svg className="aw-service-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {/* Pendant lamp */}
        <path d="M20 7 V12" />
        <path d="M14 12 H26" />
        <path d="M14 12 C14 18 16.5 22 20 22 C23.5 22 26 18 26 12" />
        <circle cx="20" cy="16.5" r="1.4" />
        <path d="M17 22 L15.5 31 M23 22 L24.5 31" />
        <path d="M14 31 H26" />
      </svg>
    ),
  },
];

const aboutStats = [
  { num: "10+", label: "Ani experiență", count: "10", suffix: "+" },
  { num: "200+", label: "Proiecte finalizate", count: "200", suffix: "+" },
  { num: "2.000 mp", label: "Atelier propriu", count: "2000", suffix: " mp" },
  { num: "100%", label: "Execuție proprie", count: "100", suffix: "%" },
];

const steps = [
  { num: "01", title: "Ofertare", desc: "Analiză și ofertă personalizată." },
  { num: "02", title: "Relevare", desc: "Măsurători exacte pe spațiu." },
  { num: "03", title: "Dezvoltare", desc: "Soluții tehnice și funcționale." },
  { num: "04", title: "Proiectare", desc: "Documentație completă de execuție." },
  { num: "05", title: "Materiale", desc: "Comenzi premium, termene clare." },
  { num: "06", title: "Atelier", desc: "Prelucrare și finisaje de calitate." },
  { num: "07", title: "Montaj", desc: "Montaj și control final." },
];

const supplierLogos = [
  "/brand/logos/egger.png",
  "/brand/logos/blum.png",
  "/brand/logos/himacs.png",
  "/brand/logos/krono.png",
  "/brand/logos/avo.png",
  "/brand/logos/hafele.png",
  "/brand/logos/corian.png",
  "/brand/logos/sch.png",
];

export default async function HomePage() {
  const [featured, chrome] = await Promise.all([
    getFeaturedProjects(9),
    getSiteChrome(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AwardsIntroLoader config={chrome.intro} />
      <FrontpageAwardsClient />

      <div id="aw-home">
        {/* ── HERO full-bleed slider ── */}
        <HomeHeroSlider
          slides={chrome.heroSlides}
          defaultDurationSec={10}
          label=""
          titleHtml="The Art of<br />Custom Furniture"
          body=""
        />

        {/* ── Marquee ── */}
        <div className="aw-marquee" aria-hidden>
          <div className="aw-marquee-track">
            {(
              [
                "Bucătării",
                "Dressinguri",
                "Livinguri",
                "Dormitoare",
                "Spații comerciale",
                "Design interior",
                "Mobilier premium",
                "Execuție proprie",
              ] as const
            )
              .flatMap((item) => [item, item, item])
              .map((item, i) => (
                <span key={`${item}-${i}`} className="aw-marquee-item">
                  {item}
                  <span className="aw-marquee-dot">✦</span>
                </span>
              ))}
          </div>
        </div>

        {/* ── Benefits cu icoane ── */}
        <section
          className="aw-benefits"
          aria-label="Avantaje Moodilier"
          data-section-id="benefits"
          data-section-name="Avantaje"
        >
          <div className="aw-container aw-benefits-grid">
            {benefits.map((b, i) => (
              <article key={b.title} className="aw-benefit aw-reveal" data-delay={i * 0.06}>
                {b.icon}
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Despre noi ── */}
        <section
          className="aw-about"
          aria-labelledby="aw-about-title"
          data-section-id="about"
          data-section-name="Despre noi"
        >
          <div className="aw-container">
            <div className="aw-section-head aw-reveal">
              <p className="aw-label" data-key="home.about.label" data-editable="text">
                Despre noi
              </p>
              <h2
                id="aw-about-title"
                className="aw-h2"
                data-key="home.about.title"
                data-editable="text"
              >
                The Art of Custom Furniture
              </h2>
            </div>
            <div className="aw-about-grid">
              <div
                className="aw-about-media aw-clip aw-reveal"
                data-key="home.about.image"
                data-editable="image"
              >
                <div className="aw-clip-media" style={{ position: "absolute", inset: 0 }}>
                  <Image
                    src="/projects/villa-06/01.living.cover.webp"
                    alt="Atelier Moodilier — mobilier premium"
                    fill
                    sizes="(max-width: 900px) 100vw, 48vw"
                    quality={90}
                    loading="lazy"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <div className="aw-about-copy">
                <p
                  className="aw-body aw-reveal"
                  data-key="home.about.p1"
                  data-editable="text"
                >
                  La Moodilier transformăm ideile de amenajare în piese de mobilier premium la
                  comandă, create pentru spații elegante, funcționale și atemporale.
                </p>
                <p
                  className="aw-body aw-reveal"
                  data-key="home.about.p2"
                  data-editable="text"
                >
                  Cu peste 10 ani de experiență în proiectarea și producția de mobilier premium,
                  realizăm soluții personalizate pentru interioare rezidențiale și comerciale,
                  punând accent pe design contemporan, materiale atent selecționate și execuție
                  impecabilă.
                </p>
                <p
                  className="aw-body aw-reveal"
                  data-key="home.about.p3"
                  data-editable="text"
                >
                  Credem că mobilierul premium înseamnă mai mult decât estetică — echilibru între
                  design, funcționalitate și calitate autentică, fără compromisuri la detalii și
                  finisaje.
                </p>
                <div className="aw-hero-ctas aw-reveal" style={{ marginTop: "1.5rem" }}>
                  <a
                    href="/despre-noi"
                    className="aw-btn-ghost aw-link-slide"
                    data-key="home.about.cta_more"
                    data-editable="link"
                  >
                    <span data-key="home.about.cta_more_label" data-editable="text">
                      Află mai multe despre noi
                    </span>
                  </a>
                  <a
                    href="/contact"
                    className="aw-btn aw-btn-primary aw-btn-fill"
                    data-key="home.about.cta_offer"
                    data-editable="link"
                  >
                    <span data-key="home.about.cta_offer_label" data-editable="text">
                      Solicită ofertă
                    </span>
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            </div>
            <div className="aw-stats aw-about-stats">
              {aboutStats.map((st, i) => (
                <div key={st.label} className="aw-reveal" data-delay={i * 0.06}>
                  <p
                    className="aw-stat-num"
                    data-count={st.count}
                    data-suffix={st.suffix}
                    data-key={`home.stats.${i}.num`}
                    data-editable="number"
                  >
                    {st.num}
                  </p>
                  <p
                    className="aw-stat-label"
                    data-key={`home.stats.${i}.label`}
                    data-editable="text"
                  >
                    {st.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Portofoliu ── */}
        <section
          className="aw-portfolio aw-portfolio--home"
          aria-labelledby="aw-portfolio-title"
          data-section-id="portfolio"
          data-section-name="Portofoliu"
        >
          <div className="aw-container">
            <div className="aw-section-head aw-reveal">
              <p className="aw-label" data-key="home.portfolio.label" data-editable="text">
                Portofoliu
              </p>
              <h2
                id="aw-portfolio-title"
                className="aw-h2"
                data-key="home.portfolio.title"
                data-editable="text"
              >
                Proiecte realizate
              </h2>
            </div>

            <div className="aw-portfolio-grid">
              {featured.map((p, i) => (
                <AwardsProjectCard
                  key={p.slug}
                  title={p.title}
                  category={p.category}
                  image={
                    versionedMediaUrl(
                      p.coverImage || "/projects/villa-06/01.cover.webp",
                      p.updatedAt
                    )
                  }
                  href={`/proiecte/${p.slug}`}
                  video={p.video || null}
                  className="aw-project-reveal"
                  style={{ "--aw-i": i } as CSSProperties}
                />
              ))}
            </div>

            <div className="aw-section-foot aw-reveal">
              <Link
                href="/proiecte"
                className="aw-btn aw-btn-outline-dark aw-btn-fill"
              >
                Vezi toate proiectele
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="aw-btn aw-btn-primary aw-btn-fill"
               
              >
                Solicită ofertă
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Servicii ── */}
        <section
          className="aw-services"
          aria-labelledby="aw-services-title"
          data-section-id="services"
          data-section-name="Servicii"
        >
          <div className="aw-container">
            <div className="aw-section-head aw-reveal">
              <p className="aw-label" data-key="home.services.label" data-editable="text">
                Ce oferim
              </p>
              <h2
                id="aw-services-title"
                className="aw-h2"
                data-key="home.services.title"
                data-editable="text"
              >
                Servicii oferite
              </h2>
            </div>
            <div className="aw-services-grid">
              {services.map((s, i) => (
                <article key={s.num} className="aw-service aw-reveal" data-delay={(i % 3) * 0.06}>
                  <div className="aw-service-top">
                    {s.icon}
                    <p className="aw-service-num">{s.num}</p>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </article>
              ))}
            </div>
            <div className="aw-section-foot aw-reveal">
              <Link
                href="/servicii"
                className="aw-btn aw-btn-outline-dark aw-btn-fill"
              >
                Toate serviciile noastre
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="aw-btn aw-btn-primary aw-btn-fill"
               
              >
                Discută proiectul
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Proces ── */}
        <section
          className="aw-process"
          aria-labelledby="aw-process-title"
          data-section-id="process"
          data-section-name="Proces"
        >
          <div className="aw-container">
            <div className="aw-section-head aw-reveal">
              <p className="aw-label" data-key="home.process.label" data-editable="text">
                Cum lucrăm
              </p>
              <h2
                id="aw-process-title"
                className="aw-h2"
                data-key="home.process.title"
                data-editable="text"
              >
                Etapele unui proiect
              </h2>
              <p
                className="aw-body"
                style={{ margin: "1rem auto 0", maxWidth: "54ch", textAlign: "center" }}
                data-key="home.process.intro"
                data-editable="text"
              >
                Fiecare proiect Moodilier este construit în jurul unui proces clar, atent
                planificat și executat cu precizie. De la analiza inițială a spațiului și
                dezvoltarea proiectului tehnic, până la producție, montaj și controlul final,
                fiecare etapă este gândită pentru a livra mobilier premium la comandă, realizat
                impecabil în fiecare detaliu.
              </p>
            </div>

            <div className="aw-steps-wrap aw-steps-seven">
              <div className="aw-process-line" aria-hidden />
              <ol className="aw-steps">
                {steps.map((s, i) => (
                  <li key={s.num} className="aw-step aw-reveal" data-delay={i * 0.05}>
                    <p className="aw-step-num">{s.num}</p>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="aw-section-foot aw-reveal">
              <Link
                href="/contact"
                className="aw-btn aw-btn-primary aw-btn-fill"
              >
                Începe proiectul tău
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/proiecte"
                className="aw-btn aw-btn-outline-dark aw-btn-fill"
               
              >
                Vezi proiecte
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Motto ── */}
        <section
          className="aw-quote"
          aria-label="Motto Moodilier"
          data-section-id="quote"
          data-section-name="Motto"
        >
          <div className="aw-container aw-quote-inner aw-reveal">
            <blockquote data-key="home.quote" data-editable="text">
              „Pentru noi, adevăratul lux stă în calitatea lucrurilor create corect și în experiența pe care acestea o oferă zi de zi.”
            </blockquote>
          </div>
        </section>

        {/* ── Furnizori ── */}
        <section
          className="aw-suppliers"
          aria-labelledby="aw-suppliers-title"
          data-section-id="suppliers"
          data-section-name="Furnizori"
        >
          <div className="aw-container">
            <p className="aw-label aw-reveal" id="aw-suppliers-title" style={{ textAlign: "center" }}>
              Furnizori parteneri
            </p>
            <div className="aw-suppliers-grid aw-reveal">
              {supplierLogos.map((logo, i) => {
                const name = supplierNameFromSrc(logo);
                return (
                  <EditableMedia
                    key={logo}
                    className="aw-supplier"
                    dataKey={`home.suppliers.${i}.image`}
                  >
                    <Image
                      src={logo}
                      alt={name || ""}
                      width={160}
                      height={56}
                      unoptimized
                      style={{ height: 44, width: "auto", objectFit: "contain" }}
                    />
                  </EditableMedia>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          className="aw-cta aw-cta-visual"
          aria-labelledby="aw-cta-title"
          data-section-id="cta"
          data-section-name="CTA final"
        >
          <div className="aw-cta-bg" aria-hidden>
            <EditableMedia
              className="aw-cta-bg-shot aw-cta-bg-shot--left"
              dataKey="home.cta.image_left"
            >
              <Image
                src="/projects/villa-06/01.living.cover.webp"
                alt=""
                fill
                sizes="40vw"
                style={{ objectFit: "cover" }}
              />
            </EditableMedia>
            <EditableMedia
              className="aw-cta-bg-shot aw-cta-bg-shot--right"
              dataKey="home.cta.image_right"
            >
              <Image
                src="/projects/villa-05/01.living.cover.webp"
                alt=""
                fill
                sizes="40vw"
                style={{ objectFit: "cover" }}
              />
            </EditableMedia>
          </div>
          <div className="aw-container aw-cta-foreground">
            <p className="aw-label aw-reveal" data-key="home.cta.label" data-editable="text">
              Contact
            </p>
            <h2
              id="aw-cta-title"
              className="aw-h2 aw-reveal"
              data-split-lines
              data-key="home.cta.title"
              data-editable="html"
            >
              Transformăm viziunea ta
              <br />
              în mobilier premium
            </h2>
            <p className="aw-body aw-reveal" data-key="home.cta.body" data-editable="text">
              Moodilier înseamnă mobilier la comandă realizat cu precizie, rafinament și pasiune
              pentru design interior premium.
            </p>
            <div className="aw-cta-actions aw-reveal">
              <a
                href="/contact"
                className="aw-btn aw-btn-primary aw-btn-fill"
                data-key="home.cta.primary"
                data-editable="link"
              >
                <span data-key="home.cta.primary_label" data-editable="text">
                  Solicită o ofertă gratuită
                </span>
                <ArrowRight size={18} />
              </a>
              <a
                href="/proiecte"
                className="aw-btn aw-btn-outline-dark aw-btn-fill"
                data-key="home.cta.secondary"
                data-editable="link"
              >
                <span data-key="home.cta.secondary_label" data-editable="text">
                  Descoperă portofoliul
                </span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
