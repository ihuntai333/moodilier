import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/projects";
import ProiecteClient from "./ProiecteClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Proiecte | Moodilier — Portofoliu mobilier premium",
  description:
    "Portofoliu Moodilier: proiecte rezidențiale și comerciale de mobilier la comandă din București — bucătării, dressinguri, livinguri și spații complete.",
  alternates: { canonical: "https://moodilier.ro/proiecte" },
};

export default async function ProiectePage() {
  const projects = await getPublishedProjects();
  return <ProiecteClient projects={projects} />;
}
