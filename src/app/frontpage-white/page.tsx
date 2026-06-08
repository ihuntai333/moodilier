import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import GatsbyProjectCard from "@/components/GatsbyProjectCard";
import JsonLd from "@/components/JsonLd";
import HeroSlider from "@/components/HeroSlider";

export const metadata: Metadata = {
  title: "Moodilier — Mobilier La Comandă Premium | București",
  description:
    "Mobilier premium la comandă din București — bucătării, dressinguri, livinguri, dormitoare și spații comerciale. Design contemporan, execuție impecabilă.",
};

const featuredProjects = [
  { title: "Vila Cosmopolis",  category: "Rezidențial", image: "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg", href: "/proiecte/executie_vila-cosmopolis" },
  { title: "Apt. Olimp",       category: "Rezidențial", image: "/images-scraped/Olimp_03.jpg",             href: "/proiecte/executie_apt-olimp" },
  { title: "Casa Mogoșoaia",   category: "Rezidențial", image: "/images-scraped/Mogosoaia_01.jpg",         href: "/proiecte/executie_casa-mogosoaia" },
  { title: "Apt. Mamaia Nord", category: "Rezidențial", image: "/images-scraped/Black_Pearl_01.jpg",       href: "/proiecte/executie_apt-mamaia-nord" },
  { title: "AppTown North",    category: "Rezidențial", image: "/images-scraped/apptown_exec_28.jpg",      href: "/proiecte/executie_apptown-north" },
  { title: "Apt. Dristor",     category: "Rezidențial", image: "/images-scraped/executie_apt-dristor_living_03.jpg", href: "/proiecte" },
];

const services = [
  { num: "01", title: "Servicii de proiectare",  desc: "Concept, vizualizări 3D și proiectare tehnică completă, adaptată spațiului și stilului tău." },
  { num: "02", title: "Mobilier la comandă",     desc: "Bucătării, dressinguri, livinguri, dormitoare și spații comerciale executate impecabil în atelierul propriu." },
  { num: "03", title: "Moodilier Store",          desc: "Import selecționat de mobilier premium de la designeri consacrați din Italia, Danemarca și Grecia." },
  { num: "04", title: "Montaj profesionist",      desc: "Montaj precis și verificare finală pentru ca fiecare detaliu să respecte standardele noastre." },
  { num: "05", title: "Spații comerciale",        desc: "Recepții, birouri, showroom-uri și magazine — mobilier care reflectă identitatea brandului." },
  { num: "06", title: "Design interior",          desc: "Consiliere completă de design interior pentru proiecte rezidențiale și comerciale premium." },
];

const stats = [
  { num: "10+",  label: "Ani experiență" },
  { num: "200+", label: "Proiecte finalizate" },
  { num: "100%", label: "Execuție proprie" },
  { num: "24h",  label: "Răspuns ofertă" },
];

const supplierLogos = [
  "/images-scraped/logo_01_egger.png", "/images-scraped/logo_03_blum.png",
  "/images-scraped/logo_06_himacs.png","/images-scraped/logo_05_krono.png",
  "/images-scraped/logo_02_avo.png",   "/images-scraped/logo_07_hafele.png",
  "/images-scraped/logo_04_corian.png","/images-scraped/logo_08_sch.png",
];

const marqueeItems = [
  "Bucătării", "Dressinguri", "Livinguri", "Dormitoare",
  "Spații comerciale", "Design interior", "Mobilier premium", "Execuție proprie",
];

/* ─── Paletă light (inline, fără dependență de CSS vars) ─────────────────────
   Alb curat + accente maro/auriu + text închis
   Structura identică cu dark, culorile inversate.
   ─────────────────────────────────────────────────────────────────────────── */
const C = {
  bg:        "#f7f4ef",
  bgAlt:     "#edeae3",
  bgDeep:    "#e5e1d9",
  fg:        "#1a1714",
  fgMuted:   "#4a4540",
  fgSubtle:  "#7a7570",
  gold:      "#9a7a50",
  goldLight: "#b89a6a",
  border:    "rgba(26,23,20,0.1)",
  borderAlt: "rgba(26,23,20,0.06)",
};

export default function FrontPageWhite() {
  return (
    <div style={{ background: C.bg, color: C.fg, fontFamily: "'Inter', sans-serif" }}>
      <JsonLd type="home" />

      {/* ============== HERO (imagine + overlay light) ============== */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <HeroSlider slides={[
            { src: "/images-scraped/Olimp_03.jpg",                                pos: "center center" },
            { src: "/images-scraped/vila_corbeanca_exec_living_4.jpg",            pos: "center 40%" },
            { src: "/images-scraped/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg", pos: "center 30%" },
            { src: "/images-scraped/apptown_exec_28.jpg",                         pos: "center 20%" },
            { src: "/images-scraped/Black_Pearl_01.jpg",                          pos: "center center" },
          ]} intervalMs={6000} />
        </div>
        {/* Overlay mai deschis ca să bată alb/crem */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(247,244,239,0.45)", backdropFilter: "brightness(1.05)" }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 2rem" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.5em", textTransform: "uppercase", color: C.gold, marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <span style={{ display: "block", width: "2.5rem", height: "1px", background: C.gold, opacity: .7 }} />
            Tailored ✦ Furniture
            <span style={{ display: "block", width: "2.5rem", height: "1px", background: C.gold, opacity: .7 }} />
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(3.5rem,9vw,9rem)", fontStyle: "italic", fontWeight: 300, color: C.fg, lineHeight: 1, marginBottom: "2rem" }}>
            The Art of<br />Custom Furniture
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", fontWeight: 300, letterSpacing: "0.15em", color: C.fgMuted, marginBottom: "3rem", maxWidth: "500px", margin: "0 auto 3rem" }}>
            Mobilier premium pe comandă, executat impecabil.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/proiecte" style={{ display: "inline-flex", alignItems: "center", gap: ".75rem", padding: "1rem 2.5rem", background: C.fg, color: C.bg, fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", textDecoration: "none", border: "none" }}>
              Descoperă proiectele <ArrowRight size={14} />
            </Link>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: ".75rem", padding: "1rem 2.5rem", background: "transparent", color: C.fg, fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", textDecoration: "none", border: `1px solid ${C.fg}` }}>
              Solicită o ofertă
            </Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem" }}>
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: C.fgSubtle, textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: "1px", height: "3rem", background: `linear-gradient(to bottom, ${C.gold}, transparent)` }} />
        </div>
      </section>

      {/* ============== MARQUEE ============== */}
      <div style={{ background: C.fg, overflow: "hidden", padding: "1.1rem 0", borderTop: `1px solid ${C.fg}`, borderBottom: `1px solid ${C.fg}` }}>
        <style>{`
          @keyframes wm-scroll { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
          .wm-track { display: flex; width: max-content; animation: wm-scroll 55s linear infinite; }
          .wm-track:hover { animation-play-state: paused; }
        `}</style>
        <div className="wm-track" aria-hidden="true">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "1.25rem", padding: "0 2.5rem", fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: C.bgAlt, whiteSpace: "nowrap" }}>
              <span style={{ fontSize: "0.55rem", opacity: .5 }}>✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ============== STATS ============== */}
      <section style={{ background: C.bg, padding: "5rem 0", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: "100%", maxWidth: "1440px", margin: "0 auto", padding: "0 3rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "2rem", textAlign: "center" }}>
            {stats.map((s, i) => (
              <div key={i}>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2.5rem,5vw,4.5rem)", fontWeight: 300, fontStyle: "italic", color: C.fg, lineHeight: 1, marginBottom: ".25rem" }}>{s.num}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: C.fgSubtle }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== ABOUT ============== */}
      <section style={{ background: C.bg, padding: "6rem 0" }}>
        <div style={{ width: "100%", maxWidth: "1440px", margin: "0 auto", padding: "0 3rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
            <div>
              <Image src="/images-scraped/mobilier-premium-01.webp" alt="Atelier Moodilier" width={700} height={500} style={{ width: "100%", height: "520px", objectFit: "cover" }} unoptimized />
            </div>
            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: C.gold, marginBottom: "1.5rem" }}>Despre noi</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 300, color: C.fg, marginBottom: "1.5rem", lineHeight: 1.15 }}>
                „The Art of Custom Furniture"
              </h2>
              <span style={{ display: "block", width: "3rem", height: "1px", background: C.gold, margin: "1.5rem 0" }} />
              <p style={{ color: C.fgMuted, marginBottom: "1.25rem", lineHeight: 1.7, maxWidth: "55ch" }}>
                La Moodilier transformăm ideile de amenajare în piese de mobilier premium la comandă, create pentru spații elegante, funcționale și atemporale.
              </p>
              <p style={{ color: C.fgMuted, marginBottom: "1.25rem", lineHeight: 1.7, maxWidth: "55ch" }}>
                Cu peste 10 ani de experiență în proiectarea și producția de mobilier premium, realizăm soluții personalizate pentru interioare rezidențiale și comerciale.
              </p>
              <p style={{ color: C.fgMuted, marginBottom: "2.5rem", lineHeight: 1.7, maxWidth: "55ch" }}>
                Fiecare proiect este conceput în jurul stilului și nevoilor fiecărui client — de la bucătării premium, livinguri și dormitoare, până la showroom-uri și spații comerciale.
              </p>
              <Link href="/despre-noi" style={{ display: "inline-flex", alignItems: "center", gap: ".75rem", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: C.fg, textDecoration: "none" }}>
                <span style={{ display: "block", width: "2.5rem", height: "1px", background: C.fg }} />
                Află mai multe
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============== PROJECTS ============== */}
      <section style={{ background: C.bgAlt, padding: "6rem 0" }}>
        <div style={{ width: "100%", maxWidth: "1440px", margin: "0 auto", padding: "0 3rem", textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: C.gold, marginBottom: "1rem" }}>Portofoliu</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem,4vw,4rem)", fontWeight: 300, color: C.fg }}>Proiecte realizate</h2>
        </div>
        <div className="projects-grid">
          {featuredProjects.map((p, i) => (
            <GatsbyProjectCard key={i} title={p.title} category={p.category} image={p.image} href={p.href} index={i} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <Link href="/proiecte" style={{ display: "inline-flex", alignItems: "center", gap: ".75rem", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: C.fg, textDecoration: "none" }}>
            <span style={{ display: "block", width: "2.5rem", height: "1px", background: C.fg }} />
            Vezi toate proiectele
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ============== SERVICES ============== */}
      <section style={{ background: C.bg, padding: "6rem 0" }}>
        <div style={{ width: "100%", maxWidth: "1440px", margin: "0 auto", padding: "0 3rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: C.gold, marginBottom: "1rem" }}>Ce oferim</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem,4vw,4rem)", fontWeight: 300, color: C.fg }}>Servicii oferite</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: "1.5rem" }}>
            {services.map((s, i) => (
              <div key={i} style={{ background: C.bgAlt, border: `1px solid ${C.border}`, padding: "2.5rem 2rem" }}>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "3rem", fontWeight: 300, fontStyle: "italic", color: C.goldLight, marginBottom: ".5rem", lineHeight: 1 }}>{s.num}</p>
                <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.4rem", fontWeight: 400, color: C.fg, marginBottom: ".75rem" }}>{s.title}</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: C.fgMuted, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link href="/servicii" style={{ display: "inline-flex", alignItems: "center", gap: ".75rem", padding: ".9rem 2.5rem", background: "transparent", color: C.fg, fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", textDecoration: "none", border: `1px solid ${C.fg}` }}>
              Toate serviciile noastre <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============== PROCESS ============== */}
      <section style={{ background: C.bgAlt, padding: "5rem 0" }}>
        <div style={{ width: "100%", maxWidth: "1440px", margin: "0 auto", padding: "0 3rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: C.gold, marginBottom: "1rem" }}>Cum lucrăm</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem,4vw,4rem)", fontWeight: 300, color: C.fg }}>Etapele unui proiect</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1px", background: C.border }}>
            {[
              { step: "1", title: "Consultare inițială",    desc: "Analizăm cerințele proiectului, stilul dorit și particularitățile spațiului." },
              { step: "2", title: "Măsurători și concept", desc: "Efectuăm măsurătorile exacte și dezvoltăm conceptul de design personalizat." },
              { step: "3", title: "Proiect tehnic",         desc: "Realizăm proiectul tehnic complet cu dimensiuni, materiale, finisaje și accesorii." },
              { step: "4", title: "Producție",              desc: "Piesele sunt executate în atelierul propriu cu tehnologie modernă și finisaje premium." },
              { step: "5", title: "Montaj și finisare",     desc: "Montaj profesionist cu verificare finală a fiecărui detaliu." },
            ].map((item, i) => (
              <div key={i} style={{ background: C.bgAlt, padding: "2.5rem 2rem", textAlign: "center" }}>
                <div style={{ width: "3rem", height: "3rem", border: `1px solid ${C.gold}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto .75rem", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.25rem", color: C.gold }}>{item.step}</div>
                <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem", fontWeight: 500, color: C.fg, marginBottom: ".5rem" }}>{item.title}</h4>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: C.fgSubtle, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FULL-BLEED IMAGE ============== */}
      <div style={{ position: "relative", height: "55vh", minHeight: "350px", overflow: "hidden" }}>
        <Image src="/images-scraped/vila_corbeanca_exec_living_4.jpg" alt="Moodilier interior" fill style={{ objectFit: "cover", objectPosition: "center 40%" }} unoptimized />
        <div style={{ position: "absolute", inset: 0, background: "rgba(247,244,239,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <blockquote style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.75rem,4vw,3.5rem)", fontStyle: "italic", fontWeight: 300, color: C.fg, textAlign: "center", maxWidth: "800px", padding: "0 2rem", border: "none", margin: 0 }}>
            „We Are The Furniture Engineers"
          </blockquote>
        </div>
      </div>

      {/* ============== SUPPLIERS ============== */}
      <section style={{ background: C.bg, padding: "5rem 0", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: "100%", maxWidth: "1440px", margin: "0 auto", padding: "0 3rem" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: C.gold, textAlign: "center", marginBottom: "2.5rem" }}>Furnizori parteneri</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2.5rem", justifyContent: "center", alignItems: "center", filter: "brightness(0) opacity(0.35)" }}>
            {supplierLogos.map((logo, i) => (
              <Image key={i} src={logo} alt={`Furnizor ${i + 1}`} width={180} height={70} style={{ height: "50px", width: "auto", objectFit: "contain" }} unoptimized />
            ))}
          </div>
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section style={{ background: C.fg, padding: "7rem 0" }}>
        <div style={{ width: "100%", maxWidth: "1440px", margin: "0 auto", padding: "0 3rem", textAlign: "center" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: C.goldLight, marginBottom: "1.5rem" }}>Hai să lucrăm împreună</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem,4vw,4rem)", fontWeight: 300, color: C.bg, maxWidth: "600px", margin: "0 auto 1.5rem" }}>
            Transformăm viziunea ta în mobilier premium
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", color: "rgba(247,244,239,0.6)", maxWidth: "50ch", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
            Moodilier înseamnă mobilier la comandă realizat cu precizie, rafinament și pasiune pentru design interior premium.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: ".75rem", padding: "1rem 2.5rem", background: C.bg, color: C.fg, fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", textDecoration: "none" }}>
              Solicită o ofertă gratuită <ArrowRight size={14} />
            </Link>
            <Link href="/proiecte" style={{ display: "inline-flex", alignItems: "center", gap: ".75rem", padding: "1rem 2.5rem", background: "transparent", color: C.bg, fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", textDecoration: "none", border: `1px solid rgba(247,244,239,0.4)` }}>
              Descoperă portofoliul
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
