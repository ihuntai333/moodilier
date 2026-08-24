/**
 * Services mirrored from https://moodilier.ro/servicii/
 * + atelier pages: CNC, Vopsitorie MDF, Termoformare
 */
export const servicesIntro = {
  eyebrow: "Servicii",
  title: "Servicii complete de",
  titleAccent: "design interior, mobilier premium și prelucrări personalizate",
  body: `La Moodilier oferim servicii complete pentru proiecte de amenajare interioară și producție de mobilier premium la comandă, cu accent pe design contemporan, precizie tehnică și execuție impecabilă.

Gestionăm întregul proces — de la concept și proiectare tehnică, până la producție, finisare și montaj — pentru spații elegante, funcționale și adaptate fiecărui proiect.

Pe lângă mobilier personalizat, oferim termoformare, vopsitorie MDF premium și prelucrări CNC de înaltă precizie.`,
};

export const mainServices = [
  {
    slug: "proiectare",
    title: "Servicii de proiectare",
    short:
      "Concept, mood board, vizualizări 3D și proiect tehnic — spațiul tău prinde formă înainte de producție.",
    href: "/servicii#proiectare",
    image: "/images-scraped/proiectare.jpg",
  },
  {
    slug: "mobilier-la-comanda",
    title: "Mobilier la comandă",
    short:
      "Bucătării, dressinguri, livinguri, dormitoare și băi — executate în atelierul propriu, pe măsură.",
    href: "/servicii#mobilier-la-comanda",
    image: "/images-scraped/buc_giurgiu_1.jpg",
  },
  {
    slug: "moodilier-store",
    title: "Moodilier Store",
    short:
      "Selecție de mobilier premium importat, pentru a completa execuția locală cu piese de colecție.",
    href: "/servicii#moodilier-store",
    image: "/images-scraped/mobilier-premium-01.webp",
  },
] as const;

export const atelierServices = [
  {
    slug: "prelucrare-cnc",
    title: "Servicii Prelucrare CNC",
    tagline: "Ideile tale, transformate în realitate.",
    desc: "Prelucrare CNC de înaltă calitate cu echipamente de ultimă generație — precizie, repetabilitate și eficiență pentru piese complexe, panouri decorative și elemente arhitecturale.",
    points: ["Precizie — toleranțe foarte mici", "Flexibilitate pe materiale diverse", "Eficiență și reducerea erorilor"],
    href: "/servicii#prelucrare-cnc",
    image: "/images-scraped/montaj.jpg",
  },
  {
    slug: "vopsitorie-mdf",
    title: "Servicii Vopsitorie MDF",
    tagline: "Rezultate pe măsura așteptărilor tale.",
    desc: "Vopsitorie profesională MDF cu vopsele rezistente și finisaj impecabil — de la mat ultra la lucios extra și variante metalizate.",
    points: [
      "MDF Mat ULTRA / Mat / Lucios / Lucios Extra",
      "Variante metalizate",
      "Finisaj durabil, ușor de întreținut",
    ],
    href: "/servicii#vopsitorie-mdf",
    image: "/images-scraped/living_01_.jpg",
  },
  {
    slug: "termoformare",
    title: "Termoformare",
    tagline: "Tehnologii de ultimă generație.",
    desc: "Termoformare pentru forme complexe și detaliate — proces precis, cost-eficient, cu materiale durabile și plăcute estetic.",
    points: ["Costuri reduse", "Forme complexe", "Calitate superioară"],
    href: "/servicii#termoformare",
    image: "/images-scraped/cameraA_03_.jpg",
  },
] as const;
