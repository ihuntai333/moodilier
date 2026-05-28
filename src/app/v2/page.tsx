import type { Metadata } from "next";
import V2Home from "./V2Home";

export const metadata: Metadata = {
  title: "V2 — Moodilier | The Art of Custom Furniture",
  description: "Moodilier — mobilier premium la comandă din București.",
  robots: { index: false, follow: false }, // test page — don't index
};

export default function V2Page() {
  return <V2Home />;
}
