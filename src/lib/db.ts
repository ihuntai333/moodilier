import fs from "fs";
import path from "path";

export interface Message {
  id: string;
  nume: string;
  email: string;
  telefon?: string;
  mesaj: string;
  data: string;
  read: boolean;
}

export interface ProjectImage {
  url: string;
  alt?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: "Rezidențial" | "Comercial" | "Bucătărie" | "Vizualizare 3D";
  location?: string;
  description?: string;
  images: ProjectImage[];
  coverImage?: string;
  /** Hover + hero video public URL */
  video?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  ga4Id: string;
  pixelId: string;
  googleSiteVerification: string;
  facebookDomainVerification: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  siteTitle: string;
  metaDescription: string;
}

export interface Database {
  projects: Project[];
  messages: Message[];
  settings: Settings;
}

const DB_PATH = path.join(process.cwd(), "src", "data", "db.json");

export function readDb(): Database {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as Database;
  } catch {
    return {
      projects: [],
      messages: [],
      settings: {
        ga4Id: "",
        pixelId: "",
        googleSiteVerification: "",
        facebookDomainVerification: "",
        phone: "(+40) 729 555 431",
        email: "ofertare@moodilier.com",
        address: "Blv. Basarabia 256, incinta FAUR, Sector 3, București",
        instagram: "https://www.instagram.com/moodilier/",
        facebook: "https://www.facebook.com/moodilier",
        whatsapp: "40729555431",
        siteTitle: "Moodilier — Mobilier La Comandă Premium",
        metaDescription: "Mobilier premium la comandă din București",
      },
    };
  }
}

export function writeDb(data: Database): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}
