import type { Metadata } from "next";
import FrontPageV5 from "./FrontPageV5";

export const metadata: Metadata = {
  title: "Moodilier — Mobilier La Comandă Premium | București",
  description: "Mobilier premium la comandă din București — bucătării, dressinguri, livinguri, dormitoare și spații comerciale.",
};

export default function FrontPageV5Route() {
  return <FrontPageV5 />;
}
