import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import GatsbyProjectCard from "@/components/GatsbyProjectCard";
import HeroSlider from "@/components/HeroSlider";
import StatsSection from "@/components/StatsSection";

export const metadata: Metadata = {
  title: "Moodilier B&W — Mobilier Premium",
  description:
    "Mobilier premium la comandă din București — bucătării, dressinguri, livinguri, dormitoare și spații comerciale. Design contemporan, execuție impecabilă.",
};

/* ─── Data ─────────────────────────────────────────────────── */

const featuredProjects = [
  { title: "Vila Cosmopolis", category: "Rezidențial", image: "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg", href: "/proiecte/executie_vila-cosmopolis" },
  { title: "Apt. Olimp",      category: "Rezidențial", image: "/images-scraped/Olimp_03.jpg",                                  href: "/proiecte/executie_apt-olimp" },
  { title: "Casa Mogoșoaia",  category: "Rezidențial", image: "/images-scraped/Mogosoaia_01.jpg",                              href: "/proiecte/executie_casa-mogosoaia" },
  { title: "Apt. Mamaia Nord",category: "Rezidențial", image: "/images-scraped/Black_Pearl_01.jpg",                            href: "/proiecte/executie_apt-mamaia-nord" },
  { title: "AppTown North",   category: "Rezidențial", image: "/images-scraped/apptown_exec_28.jpg",                           href: "/proiecte/executie_apptown-north" },
];

const services = [
  { num: "01", title: "Servicii de proiectare",  desc: "Concept, vizualizări 3D și proiectare tehnică completă, adaptată spațiului și stilului tău." },
  { num: "02", title: "Mobilier la comandă",     desc: "Bucătării, dressinguri, livinguri, dormitoare și spații comerciale executate impecabil în atelierul propriu." },
  { num: "03", title: "Moodilier Store",         desc: "Import selecționat de mobilier premium de la designeri consacrați din Italia, Danemarca și Grecia." },
  { num: "04", title: "Montaj profesionist",     desc: "Montaj precis și verificare finală pentru ca fiecare detaliu să respecte standardele noastre." },
  { num: "05", title: "Spații comerciale",       desc: "Recepții, birouri, showroom-uri și magazine — mobilier care reflectă identitatea brandului." },
  { num: "06", title: "Design interior",         desc: "Consiliere completă de design interior pentru proiecte rezidențiale și comerciale premium." },
];

const marqueeItems = [
  "Bucătării", "Dressinguri", "Livinguri", "Dormitoare",
  "Spații comerciale", "Design interior", "Mobilier premium", "Execuție proprie",
];

const heroSlides = [
  { src: "/images-scraped/Olimp_03.jpg",                                pos: "center center" },
  { src: "/images-scraped/vila_corbeanca_exec_living_4.jpg",            pos: "center 40%" },
  { src: "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg",pos: "center 30%" },
  { src: "/images-scraped/apptown_exec_28.jpg",                         pos: "center 20%" },
  { src: "/images-scraped/Black_Pearl_01.jpg",                          pos: "center center" },
];

/* ─── Style tokens ─────────────────────────────────────────── */

const T = {
  fontDisplay: "'Cormorant Garamond', Georgia, serif",
  fontBody:    "'Inter', sans-serif",
  eyebrow: {
    fontFamily:    "'Inter', sans-serif",
    fontSize:      "0.65rem",
    fontWeight:    700,
    letterSpacing: "0.4em",
    textTransform: "uppercase" as const,
  },
  title: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontStyle:  "italic",
    fontWeight: 300,
  },
  /* Buttons */
  btnWhiteFilled: {
    background:    "#fff",
    color:         "#000",
    padding:       "1rem 2.5rem",
    letterSpacing: "0.2em",
    fontSize:      "0.75rem",
    fontWeight:    600,
    textTransform: "uppercase" as const,
    border:        "none",
    cursor:        "pointer",
    display:       "inline-block",
    textDecoration:"none",
    fontFamily:    "'Inter', sans-serif",
  },
  btnWhiteOutline: {
    background:    "transparent",
    color:         "#fff",
    padding:       "1rem 2.5rem",
    letterSpacing: "0.2em",
    fontSize:      "0.75rem",
    fontWeight:    600,
    textTransform: "uppercase" as const,
    border:        "1px solid #fff",
    cursor:        "pointer",
    display:       "inline-block",
    textDecoration:"none",
    fontFamily:    "'Inter', sans-serif",
  },
  btnBlackFilled: {
    background:    "#000",
    color:         "#fff",
    padding:       "1rem 2.5rem",
    letterSpacing: "0.2em",
    fontSize:      "0.75rem",
    fontWeight:    600,
    textTransform: "uppercase" as const,
    border:        "none",
    cursor:        "pointer",
    display:       "inline-block",
    textDecoration:"none",
    fontFamily:    "'Inter', sans-serif",
  },
  btnBlackOutline: {
    background:    "transparent",
    color:         "#000",
    padding:       "1rem 2.5rem",
    letterSpacing: "0.2em",
    fontSize:      "0.75rem",
    fontWeight:    600,
    textTransform: "uppercase" as const,
    border:        "1px solid #000",
    cursor:        "pointer",
    display:       "inline-block",
    textDecoration:"none",
    fontFamily:    "'Inter', sans-serif",
  },
};

/* ─── Page ──────────────────────────────────────────────────── */

export default function FrontpageBW() {
  return (
    <div style={{ fontFamily: T.fontBody, margin: 0, padding: 0 }}>

      {/* ── Floating B&W Badge ────────────────────────────────── */}
      <div
        style={{
          position:     "fixed",
          top:          "1.2rem",
          right:        "1.2rem",
          zIndex:       9999,
          background:   "#000",
          color:        "#fff",
          fontFamily:   T.fontBody,
          fontSize:     "0.6rem",
          fontWeight:   700,
          letterSpacing:"0.25em",
          textTransform:"uppercase",
          padding:      "0.4rem 0.9rem",
          borderRadius: "999px",
          border:       "1px solid rgba(255,255,255,0.25)",
          pointerEvents:"none",
        }}
        aria-label="B&W Edition"
      >
        B&amp;W Edition
      </div>

      {/* ══════════════════════════════════════════════════════════
          1. HERO — BLACK background
      ══════════════════════════════════════════════════════════ */}
      <section
        style={{
          position:   "relative",
          minHeight:  "100vh",
          background: "#000",
          overflow:   "hidden",
          display:    "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Slider — grayscale + dim */}
        <div
          style={{
            position: "absolute",
            inset:    0,
            filter:   "grayscale(100%) brightness(0.55)",
            zIndex:   0,
          }}
        >
          <HeroSlider slides={heroSlides} intervalMs={6000} />
        </div>

        {/* Vignette overlay */}
        <div
          style={{
            position:   "absolute",
            inset:      0,
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)",
            zIndex:     1,
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position:  "relative",
            zIndex:    2,
            textAlign: "center",
            padding:   "0 1.5rem",
            maxWidth:  "900px",
          }}
        >
          <p style={{ ...T.eyebrow, color: "#fff", marginBottom: "2rem", opacity: 0.7 }}>
            Tailored ✦ Furniture
          </p>
          <h1
            style={{
              ...T.title,
              fontSize:     "clamp(3.5rem, 10vw, 8rem)",
              lineHeight:   1.05,
              color:        "#fff",
              marginBottom: "1.5rem",
              letterSpacing:"0.01em",
            }}
          >
            The Art of<br />Custom Furniture
          </h1>
          <p
            style={{
              fontFamily:   T.fontBody,
              fontSize:     "1rem",
              color:        "rgba(255,255,255,0.75)",
              letterSpacing:"0.06em",
              marginBottom: "2.5rem",
              maxWidth:     "50ch",
              margin:       "0 auto 2.5rem",
            }}
          >
            Mobilier premium pe comandă, executat impecabil.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/proiecte" style={T.btnWhiteFilled}>
              Descoperă proiectele
            </Link>
            <Link href="/contact" style={T.btnWhiteOutline}>
              Solicită o ofertă
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position:   "absolute",
            bottom:     "2.5rem",
            left:       "50%",
            transform:  "translateX(-50%)",
            zIndex:     2,
            display:    "flex",
            flexDirection:"column",
            alignItems: "center",
            gap:        "0.5rem",
          }}
        >
          <span style={{ ...T.eyebrow, color: "rgba(255,255,255,0.5)", fontSize: "0.55rem" }}>Scroll</span>
          <div
            style={{
              width:      "1px",
              height:     "48px",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0))",
            }}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. MARQUEE STRIP — WHITE background
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          background: "#fff",
          borderTop:  "1px solid rgba(0,0,0,0.12)",
          borderBottom:"1px solid rgba(0,0,0,0.12)",
          overflow:   "hidden",
          padding:    "1.1rem 0",
        }}
      >
        <style>{`
          @keyframes bw-marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-33.333%); }
          }
          .bw-marquee-track {
            display: flex;
            width: max-content;
            animation: bw-marquee 28s linear infinite;
          }
        `}</style>
        <div className="bw-marquee-track" aria-hidden="true">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              style={{
                display:     "inline-flex",
                alignItems:  "center",
                gap:         "1rem",
                padding:     "0 2rem",
                fontFamily:  T.fontBody,
                fontSize:    "0.7rem",
                fontWeight:  600,
                letterSpacing:"0.3em",
                textTransform:"uppercase" as const,
                color:       "#000",
                whiteSpace:  "nowrap",
              }}
            >
              <span style={{ color: "#000", fontSize: "0.5rem" }}>✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          3. ABOUT — BLACK background
      ══════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "#000",
          padding:    "7rem 0",
          borderTop:  "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "1fr 1fr",
              gap:                 "5rem",
              alignItems:          "center",
            }}
          >
            {/* Image */}
            <div
              style={{
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Image
                src="/images-scraped/mobilier-premium-01.webp"
                alt="Atelier Moodilier"
                width={700}
                height={500}
                style={{
                  width:      "100%",
                  height:     "520px",
                  objectFit:  "cover",
                  filter:     "grayscale(100%)",
                  display:    "block",
                }}
                unoptimized
              />
              {/* Decorative border */}
              <div
                style={{
                  position: "absolute",
                  inset:    "1.5rem",
                  border:   "1px solid rgba(255,255,255,0.2)",
                  pointerEvents:"none",
                }}
              />
            </div>

            {/* Text */}
            <div>
              <p style={{ ...T.eyebrow, color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem" }}>
                Despre noi
              </p>
              <h2
                style={{
                  ...T.title,
                  fontSize:     "clamp(2rem, 4vw, 3.5rem)",
                  color:        "#fff",
                  marginBottom: "2rem",
                  lineHeight:   1.15,
                }}
              >
                „The Art of<br />Custom Furniture"
              </h2>
              <div
                style={{
                  width:      "3rem",
                  height:     "1px",
                  background: "#fff",
                  marginBottom:"2rem",
                  opacity:    0.4,
                }}
              />
              <p
                style={{
                  color:        "rgba(255,255,255,0.72)",
                  fontSize:     "0.925rem",
                  lineHeight:   1.8,
                  marginBottom: "1.25rem",
                  fontFamily:   T.fontBody,
                }}
              >
                La Moodilier transformăm ideile de amenajare în piese de mobilier premium la
                comandă, create pentru spații elegante, funcționale şi atemporale.
              </p>
              <p
                style={{
                  color:        "rgba(255,255,255,0.72)",
                  fontSize:     "0.925rem",
                  lineHeight:   1.8,
                  marginBottom: "1.25rem",
                  fontFamily:   T.fontBody,
                }}
              >
                Cu peste 10 ani de experiență în proiectarea și producția de mobilier premium,
                realizăm soluții personalizate pentru interioare rezidențiale și comerciale,
                punând accent pe design contemporan, materiale atent selecționate și execuție impecabilă.
              </p>
              <p
                style={{
                  color:        "rgba(255,255,255,0.72)",
                  fontSize:     "0.925rem",
                  lineHeight:   1.8,
                  marginBottom: "2.5rem",
                  fontFamily:   T.fontBody,
                }}
              >
                Fiecare proiect este conceput în jurul stilului și nevoilor fiecărui client —
                de la bucătării premium, livinguri și dormitoare, până la recepții, birouri,
                showroom-uri și spații comerciale moderne.
              </p>
              <Link href="/despre-noi" style={T.btnWhiteOutline}>
                Află mai multe despre noi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          STATS — WHITE background (grayscale wrapper)
      ══════════════════════════════════════════════════════════ */}
      <div style={{ filter: "grayscale(1)", background: "#fff", color: "#000" }}>
        <StatsSection />
      </div>

      {/* ══════════════════════════════════════════════════════════
          4. PROJECTS GRID — WHITE background
      ══════════════════════════════════════════════════════════ */}
      <section
        style={{
          background:  "#fff",
          padding:     "7rem 0",
          borderTop:   "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {/* Inject override CSS for GatsbyProjectCard on white bg */}
        <style>{`
          .bw-projects-wrap .gatsby-card { background: #fff !important; }
          .bw-projects-wrap .gatsby-card-link { color: #000 !important; }
          .bw-projects-wrap .gatsby-cat { color: #000 !important; opacity: 0.55 !important; }
          .bw-projects-wrap .gatsby-title { color: #000 !important; }
          .bw-projects-wrap .gatsby-cta { color: #000 !important; border-color: #000 !important; }
        `}</style>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem", textAlign: "center" }}>
          <p style={{ ...T.eyebrow, color: "#000", opacity: 0.5, marginBottom: "1rem" }}>Portofoliu</p>
          <h2
            style={{
              ...T.title,
              fontSize:     "clamp(2rem, 4vw, 3.5rem)",
              color:        "#000",
              marginBottom: "3.5rem",
            }}
          >
            Proiecte realizate
          </h2>
        </div>

        <div
          className="bw-projects-wrap"
          style={{
            filter: "grayscale(1)",
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))",
            gap:   "2px",
            maxWidth:"1600px",
            margin:"0 auto",
            padding:"0 2rem",
          }}
        >
          {featuredProjects.map((project, i) => (
            <GatsbyProjectCard
              key={i}
              title={project.title}
              category={project.category}
              image={project.image}
              href={project.href}
              index={i}
            />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link href="/proiecte" style={T.btnBlackOutline}>
            Vezi toate proiectele
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. SERVICES — BLACK background
      ══════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "#000",
          padding:    "7rem 0",
          borderTop:  "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <style>{`
          .bw-service-card {
            padding: 2.5rem;
            border: 1px solid rgba(255,255,255,0.12);
            transition: border-color 0.3s ease, background 0.3s ease;
            cursor: default;
          }
          .bw-service-card:hover {
            border-color: rgba(255,255,255,0.5);
            background: rgba(255,255,255,0.04);
          }
        `}</style>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <p style={{ ...T.eyebrow, color: "rgba(255,255,255,0.5)", marginBottom: "1rem" }}>Ce oferim</p>
            <h2
              style={{
                ...T.title,
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                color:    "#fff",
              }}
            >
              Servicii oferite
            </h2>
          </div>

          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap:                 "1px",
              background:          "rgba(255,255,255,0.08)",
            }}
          >
            {services.map((service, i) => (
              <div key={i} className="bw-service-card" style={{ background: "#000" }}>
                <p
                  style={{
                    ...T.eyebrow,
                    color:        "rgba(255,255,255,0.3)",
                    marginBottom: "1.5rem",
                    fontSize:     "0.6rem",
                  }}
                >
                  {service.num}
                </p>
                <h3
                  style={{
                    fontFamily:   T.fontDisplay,
                    fontStyle:    "italic",
                    fontWeight:   300,
                    fontSize:     "1.5rem",
                    color:        "#fff",
                    marginBottom: "1rem",
                    lineHeight:   1.3,
                  }}
                >
                  {service.title}
                </h3>
                <p
                  style={{
                    fontFamily: T.fontBody,
                    fontSize:   "0.875rem",
                    color:      "rgba(255,255,255,0.6)",
                    lineHeight: 1.75,
                  }}
                >
                  {service.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
            <Link href="/servicii" style={T.btnWhiteOutline}>
              Toate serviciile noastre
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          6. FULL-BLEED QUOTE — BLACK background
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position:   "relative",
          height:     "60vh",
          minHeight:  "400px",
          overflow:   "hidden",
          background: "#000",
        }}
      >
        {/* B&W image */}
        <Image
          src="/images-scraped/vila_corbeanca_exec_living_4.jpg"
          alt="Moodilier — interior premium"
          fill
          style={{
            objectFit:      "cover",
            objectPosition: "center 40%",
            filter:         "grayscale(100%) brightness(0.45)",
          }}
          unoptimized
        />

        {/* Dark overlay */}
        <div
          style={{
            position:   "absolute",
            inset:      0,
            background: "rgba(0,0,0,0.4)",
          }}
        />

        {/* Quote */}
        <div
          style={{
            position:       "absolute",
            inset:          0,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            padding:        "2rem",
            zIndex:         1,
          }}
        >
          <blockquote
            style={{
              fontFamily:   T.fontDisplay,
              fontStyle:    "italic",
              fontWeight:   300,
              fontSize:     "clamp(2rem, 5vw, 4.5rem)",
              color:        "#fff",
              textAlign:    "center",
              lineHeight:   1.2,
              maxWidth:     "14ch",
              margin:       0,
              borderLeft:   "none",
              padding:      0,
            }}
          >
            „We Are The<br />Furniture Engineers"
          </blockquote>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          7. CTA — WHITE background
      ══════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "#fff",
          padding:    "7rem 2rem",
          borderTop:  "1px solid rgba(0,0,0,0.08)",
          textAlign:  "center",
        }}
      >
        <p
          style={{
            ...T.eyebrow,
            color:        "#000",
            opacity:      0.5,
            marginBottom: "1.5rem",
          }}
        >
          Hai să lucrăm împreună
        </p>
        <h2
          style={{
            ...T.title,
            fontSize:     "clamp(2.5rem, 5vw, 4.5rem)",
            color:        "#000",
            maxWidth:     "600px",
            margin:       "0 auto 1.5rem",
            lineHeight:   1.1,
          }}
        >
          Transformăm viziunea ta în mobilier premium
        </h2>
        <p
          style={{
            fontFamily:   T.fontBody,
            fontSize:     "0.95rem",
            color:        "rgba(0,0,0,0.6)",
            maxWidth:     "50ch",
            margin:       "0 auto 2.5rem",
            lineHeight:   1.75,
          }}
        >
          Moodilier înseamnă mobilier la comandă realizat cu precizie, rafinament și pasiune
          pentru design interior premium.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact" style={T.btnBlackFilled}>
            Solicită o ofertă gratuită
          </Link>
          <Link href="/proiecte" style={T.btnBlackOutline}>
            Descoperă portofoliul
          </Link>
        </div>
      </section>

    </div>
  );
}
