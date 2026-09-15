/**
 * Services content — Moodilier atelier + main offers
 */
export const servicesIntro = {
  eyebrow: "Servicii",
  title: "Servicii complete de",
  titleAccent: "design interior, mobilier premium și prelucrări personalizate",
  body: `La Moodilier oferim servicii complete pentru proiecte de amenajare interioară și producție de mobilier premium la comandă, realizate cu accent pe design contemporan, precizie tehnică și execuție impecabilă.

Gestionăm întregul proces — de la concept și proiectare tehnică, până la producție, finisare și montaj — pentru a livra spații elegante, funcționale și perfect adaptate fiecărui proiect.

Pe lângă producția de mobilier personalizat pentru spații rezidențiale și comerciale, oferim și servicii specializate dedicate industriei de mobilier și amenajări interioare: termoformare materiale compozite; servicii premium de vopsitorie MDF; prelucrări CNC de înaltă precizie; realizare de elemente personalizate pentru mobilier și design interior.

Utilizăm materiale atent selecționate, tehnologii moderne de producție și finisaje premium pentru a obține rezultate durabile, estetice și perfect executate până la cel mai mic detaliu.

Fie că este vorba despre mobilier la comandă, elemente decorative sau componente tehnice speciale, fiecare proiect este realizat cu aceeași atenție pentru calitate, funcționalitate și rafinament.`,
};

export const mainServices = [
  {
    slug: "proiectare",
    title: "Servicii de proiectare",
    short:
      "Concept, mood board, vizualizări 3D și proiect tehnic — spațiul tău prinde formă înainte de producție.",
    href: "/servicii#proiectare",
    image: "/projects/villa-06/01.living.cover.webp",
  },
  {
    slug: "mobilier-la-comanda",
    title: "Mobilier la comandă",
    short:
      "Bucătării, dressinguri, livinguri, dormitoare și băi — executate în atelierul propriu, pe măsură.",
    href: "/servicii#mobilier-la-comanda",
    image: "/projects/villa-01/01.bucatarii.cover.webp",
  },
  {
    slug: "perdele-draperii",
    title: "Perdele și draperii",
    short:
      "Soluții de perdele și draperii, sisteme de umbrire, sine electrice și storuri romane — integrate în amenajarea spațiului.",
    href: "/servicii#perdele-draperii",
    image: "/projects/villa-05/01.living.cover.webp",
  },
] as const;

export const atelierServices = [
  {
    slug: "prelucrare-cnc",
    title: "Servicii Prelucrare CNC",
    tagline: "Ideile tale, transformate în realitate.",
    desc: "Prelucrare CNC de înaltă calitate cu echipamente de ultimă generație — precizie, repetabilitate și eficiență pentru piese complexe, panouri decorative și elemente arhitecturale.",
    points: [
      "Precizie — toleranțe foarte mici",
      "Flexibilitate pe materiale diverse",
      "Eficiență și reducerea erorilor",
    ],
    href: "/servicii#prelucrare-cnc",
    image: "/brand/servicii/prelucrare-cnc.webp",
    objectPosition: "center 35%",
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
    image: "/brand/servicii/vopsitorie-mdf.webp",
    objectPosition: "82% center",
  },
  {
    slug: "termoformare",
    title: "Termoformare",
    tagline: "Tehnologii de ultimă generație.",
    desc: "Termoformare pentru forme complexe și detaliate — proces precis, cost-eficient, cu materiale durabile și plăcute estetic.",
    points: ["Costuri reduse", "Forme complexe", "Calitate superioară"],
    href: "/servicii#termoformare",
    image: "/brand/servicii/termoformare.webp",
    objectPosition: "center 20%",
  },
] as const;
