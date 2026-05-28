import { MetadataRoute } from "next";
import { readDb } from "@/lib/db";
import { projects as staticProjects } from "@/data/projects-clean";

const BASE_URL = "https://moodilier.ro";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                             lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/proiecte`,               lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/servicii`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/despre-noi`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`,                lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/termeni-si-conditii`,    lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/politica-de-confidentialitate`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/politica-cookies`,       lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/nota-legala`,            lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  // Dynamic project pages from DB (fallback to static data)
  let projectSlugs: string[] = [];
  try {
    const db = readDb();
    if (db.projects.length > 0) {
      projectSlugs = db.projects.map((p) => p.slug);
    } else {
      projectSlugs = staticProjects.map((p) => p.slug);
    }
  } catch {
    projectSlugs = staticProjects.map((p) => p.slug);
  }

  const projectPages: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${BASE_URL}/proiecte/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...projectPages];
}
