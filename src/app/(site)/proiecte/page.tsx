import type { Metadata } from "next";
import { Suspense } from "react";
import { getPublishedProjects } from "@/lib/projects";
import { pageMetadata } from "@/lib/site-seo";
import ProiecteClient from "./ProiecteClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const maxDuration = 30;

export const metadata: Metadata = pageMetadata({
  path: "/proiecte",
  title: "Proiecte mobilier la comandă",
  description:
    "Portofoliu Moodilier: proiecte rezidențiale și comerciale de mobilier la comandă din București — bucătării, dressinguri, livinguri și spații complete.",
  image: "/projects/villa-06/01.living.cover.webp",
});

export default async function ProiectePage() {
  const projects = await getPublishedProjects();
  return (
    <Suspense fallback={null}>
      <ProiecteClient projects={projects} />
    </Suspense>
  );
}
