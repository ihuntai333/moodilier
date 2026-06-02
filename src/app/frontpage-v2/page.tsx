import type { Metadata } from "next";
import FrontPageV2 from "./FrontPageV2";

export const metadata: Metadata = {
  title: "Moodilier — Mobilier La Comandă Premium | București",
  description: "Mobilier premium la comandă din București — bucătării, dressinguri, livinguri, dormitoare și spații comerciale. Design contemporan, execuție impecabilă.",
};

export default function FrontPageV2Route() {
  return <FrontPageV2 />;
}
