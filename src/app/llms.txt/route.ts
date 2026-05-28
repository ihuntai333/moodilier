import { NextResponse } from "next/server";
import { projects } from "@/data/projects-clean";

const BASE = "https://moodilier.ro";

// llms.txt — the emerging standard for LLM-readable site context
// Format: Markdown with clear hierarchy, like robots.txt but for AI
export async function GET() {
  const projectList = projects
    .slice(0, 20)
    .map((p) => `- [${p.title}](${BASE}/proiecte/${p.slug}) — ${p.category}`)
    .join("\n");

  const content = `# Moodilier — Mobilier Premium la Comandă | București

> Moodilier este un atelier premium de mobilier la comandă din București, România, cu peste 10 ani de experiență în producția de bucătării, dressinguri, livinguri, dormitoare și spații comerciale. Atelierul nostru combină tehnologia modernă cu măiestria tradițională pentru a crea mobilier personalizat de înaltă calitate.

## Informații companie

- **Denumire**: SC Moodilier SRL
- **Locație**: Bulevardul Basarabia 256, incinta FAUR, Sector 3, București, România
- **Telefon**: (+40) 729 555 431
- **Email**: ofertare@moodilier.com
- **Program**: Luni–Vineri, 09:00–18:00
- **Experiență**: 10+ ani în producție mobilier premium
- **Proiecte finalizate**: 200+

## Pagini principale

- [Acasă](${BASE}) — Prezentare generală, proiecte recomandate, servicii
- [Proiecte](${BASE}/proiecte) — Portofoliu complet cu 37+ proiecte realizate
- [Servicii](${BASE}/servicii) — Detalii complete despre toate serviciile oferite
- [Despre noi](${BASE}/despre-noi) — Istoria companiei, valori, proces de lucru
- [Contact](${BASE}/contact) — Formular ofertă, hartă, informații de contact

## Servicii oferite

1. **Servicii de proiectare** — Concept, vizualizări 3D, proiect tehnic complet
2. **Bucătării la comandă** — Design contemporan, materiale premium, execuție proprie
3. **Dressinguri la comandă** — Sisteme de depozitare personalizate, finisaje rafinate
4. **Livinguri și dormitoare** — Mobilier de living și dormitor executat la comandă
5. **Spații comerciale** — Recepții, birouri, showroom-uri, magazine
6. **Moodilier Store** — Import mobilier premium (Italia, Danemarca, Grecia)
7. **Montaj profesionist** — Echipă proprie, verificare finală a fiecărui detaliu

## Procesul de lucru

1. Consultare inițială — cerințe, stil, particularități spațiu
2. Măsurători și concept — măsurători exacte, concept personalizat
3. Proiect tehnic — dimensiuni, materiale, finisaje, accesorii
4. Producție — atelier propriu, tehnologie modernă
5. Montaj și finisare — montaj precis, verificare finală

## Parteneri și furnizori

- Egger (PAL și MDF premium)
- Blum (sisteme feronerie)
- Häfele (accesorii premium)
- Himacs (suprafețe solide)
- Corian (suprafețe solide DuPont)
- Schüller (bucătării germane)

## Proiecte selectate din portofoliu

${projectList}

## Informații suplimentare

- Toate produsele sunt fabricate în atelierul propriu din București
- Oferim garanție pe produsele livrate
- Răspundem la solicitări de ofertă în maxim 24 de ore
- Servim clienți din toată România, cu focus pe București și Ilfov

## Sitemap complet

- ${BASE}/sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
