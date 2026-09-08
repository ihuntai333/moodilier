import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { supplierNameFromSrc } from "@/lib/site-seo";
import { ArrowRight } from "lucide-react";
import FrontpageV2Client from "@/components/home/FrontpageV2Client";
import AwardsProjectCard from "@/components/site/AwardsProjectCard";
import { getFeaturedProjects } from "@/lib/projects";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Frontpage v2 (preview) | Moodilier",
  description:
    "Versiune premium awards a homepage-ului Moodilier. Mobilier la comandă din București.",
  robots: { index: false, follow: false },
};

const benefits = [
  {
    title: "La comandă",
    desc: "Proiecte unice, create special pentru spațiul tău.",
  },
  {
    title: "Materiale premium",
    desc: "Selecție atentă: Egger, Blum, Häfele și parteneri.",
  },
  {
    title: "Producție proprie",
    desc: "100% execuție în atelierul din București.",
  },
  {
    title: "Răspuns în 24h",
    desc: "Îți răspundem rapid cu pașii concreți.",
  },
];

const services = [
  {
    num: "01",
    title: "Servicii de proiectare",
    desc: "Concept, vizualizări 3D și proiectare tehnică completă, adaptată spațiului și stilului tău.",
    image: "/images-scraped/proiectare.jpg",
    href: "/servicii#proiectare",
  },
  {
    num: "02",
    title: "Mobilier la comandă",
    desc: "Bucătării, dressinguri, livinguri, dormitoare și spații comerciale executate impecabil în atelierul propriu.",
    image: "/images-scraped/buc_giurgiu_1.jpg",
    href: "/servicii#mobilier-la-comanda",
  },
  {
    num: "03",
    title: "Moodilier Fabrics",
    desc: "Import selecționat de mobilier premium de la designeri consacrați din Italia, Danemarca și Grecia.",
    image: "/images-scraped/mobilier-premium-01.webp",
    href: "/servicii#moodilier-store",
  },
  {
    num: "04",
    title: "Montaj profesionist",
    desc: "Montaj precis și verificare finală, ca fiecare detaliu să respecte standardele noastre.",
    image: "/images-scraped/montaj.jpg",
    href: "/servicii#montaj",
  },
  {
    num: "05",
    title: "Spații comerciale",
    desc: "Recepții, birouri și magazine: mobilier care reflectă identitatea brandului.",
    image: "/images-scraped/living_01_.jpg",
    href: "/servicii#spatii-comerciale",
  },
  {
    num: "06",
    title: "Design interior",
    desc: "Consiliere completă de design interior pentru proiecte rezidențiale și comerciale premium.",
    image: "/images-scraped/cameraA_03_.jpg",
    href: "/servicii#design-interior",
  },
];

const aboutStats = [
  { num: "10+", label: "Ani experiență", count: "10", suffix: "+" },
  { num: "200+", label: "Proiecte finalizate", count: "200", suffix: "+" },
  { num: "100%", label: "Execuție proprie", count: "100", suffix: "%" },
  { num: "24h", label: "Răspuns ofertă", count: "24", suffix: "h" },
];

const steps = [
  {
    num: "01",
    title: "Consultare inițială",
    desc: "Analizăm cerințele proiectului, stilul dorit și particularitățile spațiului.",
  },
  {
    num: "02",
    title: "Măsurători și concept",
    desc: "Efectuăm măsurătorile exacte și dezvoltăm conceptul de design personalizat.",
  },
  {
    num: "03",
    title: "Proiect tehnic",
    desc: "Proiect tehnic complet: dimensiuni, materiale, finisaje și accesorii.",
  },
  {
    num: "04",
    title: "Producție",
    desc: "Execuție în atelierul propriu, cu tehnologie modernă și finisaje premium.",
  },
  {
    num: "05",
    title: "Montaj și finisare",
    desc: "Montaj profesionist cu verificare finală a fiecărui detaliu.",
  },
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

const marqueeItems = [
  "Bucătării",
  "Dressinguri",
  "Livinguri",
  "Dormitoare",
  "Spații comerciale",
  "Design interior",
  "Mobilier premium",
  "Execuție proprie",
];

function cleanTitle(title: string) {
  return title
    .replace(/\s*[–—]\s*Moodilier\s*$/i, "")
    .replace(/^Proiect\s+executie\s*[–—]?\s*/i, "")
    .replace(/\s*[–—]\s*/g, " · ")
    .trim();
}

export default async function FrontpageV2Page() {
  const featured = await getFeaturedProjects(6);

  return (
    <>
      <FrontpageV2Client />

      <div id="aw-home-v2" className="fpv2">
        {/* Hero: brand-first, full-bleed media */}
        <section className="aw-hero" aria-labelledby="aw-v2-hero-title">
          <div className="aw-hero-copy">
            <p className="aw-label aw-reveal">Tailored Furniture</p>
            <p className="aw-brand-mark aw-reveal">Moodilier</p>
            <h1 id="aw-v2-hero-title" className="aw-h1 aw-reveal">
              The Art of
              <br />
              Custom Furniture
            </h1>
            <p className="aw-body aw-reveal">
              Transformăm ideile de amenajare în piese create pentru spații elegante, funcționale și atemporale.
            </p>
            <div className="aw-hero-ctas aw-reveal">
              <Link href="/proiecte" className="aw-btn aw-btn-primary aw-btn-fill">
                Descoperă proiectele
                <ArrowRight size={14} />
              </Link>
              <Link href="/contact" className="aw-btn-ghost aw-link-slide">
                Solicită o ofertă
              </Link>
            </div>
          </div>
          <div className="aw-hero-media aw-clip">
            <div className="aw-hero-media-inner aw-clip-media">
              <video
                className="aw-hero-video"
                src="/videos/moodilier-vid-1.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/images-scraped/Olimp_03.jpg"
                aria-label="Proiect Moodilier, mobilier premium la comandă"
              />
            </div>
          </div>
        </section>

        <div className="aw-marquee" aria-hidden>
          <div className="aw-marquee-track">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={`${item}-${i}`} className="aw-marquee-item">
                {item}
                <span className="aw-marquee-dot">✦</span>
              </span>
            ))}
          </div>
        </div>

        <section className="aw-benefits" aria-label="Avantaje Moodilier">
          <div className="aw-container aw-benefits-grid">
            {benefits.map((b, i) => (
              <article key={b.title} className="aw-benefit aw-reveal" data-delay={i * 0.05}>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="aw-about" aria-labelledby="aw-v2-about-title">
          <div className="aw-container">
            <div className="aw-section-head aw-reveal">
              <p className="aw-label">Despre noi</p>
              <h2 id="aw-v2-about-title" className="aw-h2">
                The Art of Custom Furniture
              </h2>
            </div>
            <div className="aw-about-grid">
              <div className="aw-about-media aw-clip aw-reveal">
                <div className="aw-clip-media" style={{ position: "absolute", inset: 0 }}>
                  <Image
                    src="/images-scraped/mobilier-premium-01.webp"
                    alt="Atelier Moodilier, mobilier premium"
                    fill
                    sizes="(max-width: 900px) 100vw, 48vw"
                    unoptimized
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <div className="aw-about-copy">
                <p className="aw-body aw-reveal">
                  La Moodilier transformăm ideile de amenajare în piese de mobilier premium la
                  comandă, create pentru spații elegante, funcționale și atemporale.
                </p>
                <p className="aw-body aw-reveal">
                  Cu peste 10 ani de experiență în proiectare și producție, realizăm soluții
                  personalizate pentru interioare rezidențiale și comerciale. Accent pe design
                  contemporan, materiale selecționate și execuție impecabilă.
                </p>
                <p className="aw-body aw-reveal">
                  Fiecare proiect pornește de la stilul și nevoile clientului: bucătării premium,
                  livinguri, dormitoare, recepții, birouri și spații comerciale moderne.
                </p>
                <div className="aw-hero-ctas aw-reveal" style={{ marginTop: "1.5rem" }}>
                  <Link href="/despre-noi" className="aw-btn-ghost aw-link-slide">
                    Află mai multe despre noi
                  </Link>
                  <Link href="/contact" className="aw-btn aw-btn-primary aw-btn-fill">
                    Solicită ofertă
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
            <div className="aw-stats aw-about-stats">
              {aboutStats.map((st, i) => (
                <div key={st.label} className="aw-reveal" data-delay={i * 0.05}>
                  <p className="aw-stat-num" data-count={st.count} data-suffix={st.suffix}>
                    {st.num}
                  </p>
                  <p className="aw-stat-label">{st.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="aw-portfolio" aria-labelledby="aw-v2-portfolio-title">
          <div className="aw-container">
            <div className="aw-section-head aw-reveal">
              <p className="aw-label">Portofoliu</p>
              <h2 id="aw-v2-portfolio-title" className="aw-h2">
                Proiecte realizate
              </h2>
            </div>
            <div className="aw-featured-note aw-reveal">
              <p>
                Selecție din proiecte rezidențiale și comerciale, executate integral în atelierul
                Moodilier.
              </p>
              <Link href="/proiecte" className="aw-btn-ghost aw-link-slide">
                Vezi tot portofoliul
              </Link>
            </div>
            <div className="aw-portfolio-grid">
              {featured.map((p) => (
                <AwardsProjectCard
                  key={p.slug}
                  title={cleanTitle(p.title)}
                  category={p.category}
                  image={p.coverImage || "/images-scraped/Olimp_03.jpg"}
                  href={`/proiecte/${p.slug}`}
                  video={p.video || null}
                />
              ))}
            </div>
            <div className="aw-section-foot aw-reveal">
              <Link href="/proiecte" className="aw-btn aw-btn-outline-dark aw-btn-fill">
                Vezi toate proiectele
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="aw-btn aw-btn-primary aw-btn-fill"
                style={{ marginLeft: "0.75rem" }}
              >
                Solicită ofertă
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Services: hover background images, readable text */}
        <section className="aw-services" aria-labelledby="aw-v2-services-title">
          <div className="aw-container">
            <div className="aw-section-head aw-reveal">
              <p className="aw-label">Ce oferim</p>
              <h2 id="aw-v2-services-title" className="aw-h2">
                Servicii oferite
              </h2>
            </div>
            <div className="aw-services-grid">
              {services.map((s, i) => (
                <Link
                  key={s.num}
                  href={s.href}
                  className="aw-service-panel aw-reveal"
                  data-delay={(i % 3) * 0.06}
                >
                  <div className="aw-service-panel-bg" aria-hidden>
                    <Image
                      src={s.image}
                      alt=""
                      fill
                      sizes="(max-width: 700px) 100vw, 33vw"
                      unoptimized
                    />
                  </div>
                  <span className="aw-service-panel-shade" aria-hidden />
                  <div className="aw-service-panel-content">
                    <p className="aw-service-num">{s.num}</p>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <span className="aw-service-panel-cta">Explorează →</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="aw-section-foot aw-reveal">
              <Link href="/servicii" className="aw-btn aw-btn-outline-dark aw-btn-fill">
                Toate serviciile noastre
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="aw-btn aw-btn-primary aw-btn-fill"
                style={{ marginLeft: "0.75rem" }}
              >
                Discută proiectul
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <section className="aw-process" aria-labelledby="aw-v2-process-title">
          <div className="aw-container">
            <div className="aw-section-head aw-reveal">
              <p className="aw-label">Cum lucrăm</p>
              <h2 id="aw-v2-process-title" className="aw-h2">
                Etapele unui proiect
              </h2>
            </div>
            <div className="aw-steps-wrap aw-steps-five">
              <div className="aw-process-line" aria-hidden />
              <ol className="aw-steps">
                {steps.map((s, i) => (
                  <li key={s.num} className="aw-step aw-reveal" data-delay={i * 0.04}>
                    <p className="aw-step-num">{s.num}</p>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="aw-section-foot aw-reveal">
              <Link href="/contact" className="aw-btn aw-btn-primary aw-btn-fill">
                Începe proiectul tău
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/proiecte"
                className="aw-btn aw-btn-outline-dark aw-btn-fill"
                style={{ marginLeft: "0.75rem" }}
              >
                Vezi proiecte
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <section className="aw-quote" aria-label="Motto Moodilier">
          <div className="aw-container aw-quote-inner aw-reveal">
            <blockquote>We Are The Furniture Engineers</blockquote>
          </div>
        </section>

        <section className="aw-suppliers" aria-labelledby="aw-v2-suppliers-title">
          <div className="aw-container">
            <p
              className="aw-label aw-reveal"
              id="aw-v2-suppliers-title"
              style={{ textAlign: "center" }}
            >
              Furnizori parteneri
            </p>
            <div className="aw-suppliers-grid aw-reveal">
              {supplierLogos.map((logo) => (
                <div key={logo} className="aw-supplier">
                  <Image
                    src={logo}
                    alt={supplierNameFromSrc(logo) || ""}
                    width={160}
                    height={56}
                    unoptimized
                    style={{ height: 44, width: "auto", objectFit: "contain" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visual CTA with suggestive imagery */}
        <section className="aw-cta-visual" aria-labelledby="aw-v2-cta-title">
          <div className="aw-cta-visual-media" aria-hidden>
            <Image
              src="/images-scraped/Olimp_03.jpg"
              alt=""
              fill
              sizes="100vw"
              unoptimized
              style={{ objectFit: "cover" }}
            />
          </div>
          <span className="aw-cta-visual-shade" aria-hidden />
          <div className="aw-cta-visual-inner aw-reveal">
            <p className="aw-label">Hai să lucrăm împreună</p>
            <h2 id="aw-v2-cta-title" className="aw-h2">
              Transformăm viziunea ta în mobilier premium
            </h2>
            <p className="aw-body">
              Moodilier înseamnă mobilier la comandă realizat cu precizie, rafinament și pasiune
              pentru design interior premium.
            </p>
            <div className="aw-cta-actions">
              <Link href="/contact" className="aw-btn aw-btn-primary aw-btn-fill">
                Solicită o ofertă gratuită
                <ArrowRight size={14} />
              </Link>
              <Link href="/proiecte" className="aw-btn aw-btn-outline-dark aw-btn-fill">
                Descoperă portofoliul
              </Link>
            </div>
          </div>
        </section>

        <div className="aw-container" style={{ paddingBottom: "clamp(3rem, 6vw, 4.5rem)" }}>
          <div className="aw-cta-pair aw-reveal">
            <Link href="/proiecte" className="aw-cta-card">
              <Image
                src="/images-scraped/Mogosoaia_01.jpg"
                alt=""
                fill
                sizes="(max-width: 700px) 100vw, 50vw"
                unoptimized
              />
              <span>Vezi proiecte realizate →</span>
            </Link>
            <Link href="/contact" className="aw-cta-card">
              <Image
                src="/images-scraped/Black_Pearl_01.jpg"
                alt=""
                fill
                sizes="(max-width: 700px) 100vw, 50vw"
                unoptimized
              />
              <span>Programează o consultare →</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
