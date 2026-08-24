// JSON-LD Structured Data — server component (no "use client" needed)
// Renders Schema.org structured data for Google rich results and LLM understanding
// Schema types: Organization, LocalBusiness, WebSite, BreadcrumbList

interface JsonLdProps {
  type: "home" | "project" | "service" | "contact" | "about";
  data?: {
    title?: string;
    description?: string;
    image?: string;
    breadcrumbs?: { name: string; url: string }[];
  };
}

const BASE = "https://moodilier.ro";

const organization = {
  "@type": ["LocalBusiness", "FurnitureStore"],
  "@id": `${BASE}/#organization`,
  name: "Moodilier",
  legalName: "SC Moodilier SRL",
  url: BASE,
  logo: `${BASE}/brand/logo-white.png`,
  image: `${BASE}/projects/villa-06/01.cover.webp`,
  description:
    "Atelier premium de mobilier la comandă din București — bucătării, dressinguri, livinguri, dormitoare și spații comerciale executate impecabil.",
  foundingDate: "2013",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Bulevardul Basarabia 256, incinta FAUR",
    addressLocality: "București",
    postalCode: "030694",
    addressRegion: "Sector 3",
    addressCountry: "RO",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 44.424,
    longitude: 26.127,
  },
  telephone: "+40729555431",
  email: "ofertare@moodilier.com",
  openingHours: ["Mo-Fr 09:00-18:00"],
  priceRange: "€€€",
  currenciesAccepted: "RON, EUR",
  paymentAccepted: "Cash, Card, Transfer bancar",
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: { "@type": "GeoCoordinates", latitude: 44.424, longitude: 26.127 },
    geoRadius: "300000",
  },
  sameAs: [
    "https://www.instagram.com/moodilier/",
    "https://www.facebook.com/moodilier",
    "https://www.tiktok.com/@moodilier",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicii Moodilier",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Bucătării la comandă" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dressinguri la comandă" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Livinguri și dormitoare la comandă" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Spații comerciale" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Servicii de proiectare 3D" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Montaj profesionist" } },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "47",
    bestRating: "5",
  },
};

const websiteSchema = {
  "@type": "WebSite",
  "@id": `${BASE}/#website`,
  url: BASE,
  name: "Moodilier",
  description: "Mobilier premium la comandă din București",
  publisher: { "@id": `${BASE}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${BASE}/proiecte?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
  inLanguage: "ro-RO",
};

export default function JsonLd({ type, data }: JsonLdProps) {
  const schemas: Record<string, unknown>[] = [
    { "@context": "https://schema.org", ...organization },
    { "@context": "https://schema.org", ...websiteSchema },
  ];

  // Page-specific schema
  if (type === "home") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${BASE}/#webpage`,
      url: BASE,
      name: "Moodilier — Mobilier La Comandă Premium | București",
      isPartOf: { "@id": `${BASE}/#website` },
      about: { "@id": `${BASE}/#organization` },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [{ "@type": "ListItem", position: 1, name: "Acasă", item: BASE }],
      },
    });
  }

  if (type === "project" && data?.breadcrumbs) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Acasă", item: BASE },
        { "@type": "ListItem", position: 2, name: "Proiecte", item: `${BASE}/proiecte` },
        ...data.breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 3,
          name: b.name,
          item: b.url,
        })),
      ],
    });

    if (data.title) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: data.title,
        description: data.description,
        image: data.image ? `${BASE}${data.image}` : undefined,
        creator: { "@id": `${BASE}/#organization` },
        url: data.breadcrumbs[0]?.url,
        keywords: "mobilier la comanda, mobilier premium, Moodilier, București",
        inLanguage: "ro-RO",
      });
    }
  }

  if (type === "service") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Acasă", item: BASE },
        { "@type": "ListItem", position: 2, name: "Servicii", item: `${BASE}/servicii` },
      ],
    });
  }

  if (type === "contact") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      url: `${BASE}/contact`,
      name: "Contact Moodilier",
      mainEntity: { "@id": `${BASE}/#organization` },
    });
  }

  if (type === "about") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      url: `${BASE}/despre-noi`,
      name: "Despre Moodilier",
      mainEntity: { "@id": `${BASE}/#organization` },
    });
  }

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 0) }}
        />
      ))}
    </>
  );
}
