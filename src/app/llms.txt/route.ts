import { NextResponse } from "next/server";
import { getPublishedProjects } from "@/lib/projects";

const BASE = "https://moodilier.ro";

export async function GET() {
  const projects = await getPublishedProjects();
  const projectList = projects
    .slice(0, 24)
    .map((p) => `- [${p.title}](${BASE}/proiecte/${p.slug}) — ${p.category}`)
    .join("\n");

  const content = `# Moodilier — Mobilier Premium la Comandă | București

> Moodilier este un atelier premium de mobilier la comandă din București, România — bucătării, dressinguri, livinguri, dormitoare și spații comerciale.

## Companie

- **SC Moodilier SRL**
- Bd. Basarabia 256, incinta FAUR, București
- Telefon: (+40) 729 555 431
- Email: ofertare@moodilier.com

## Pagini

- [Acasă](${BASE})
- [Proiecte](${BASE}/proiecte)
- [Servicii](${BASE}/servicii)
- [Despre noi](${BASE}/despre-noi)
- [Contact](${BASE}/contact)

## Proiecte recente

${projectList}

## Sitemap

${BASE}/sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
