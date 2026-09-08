"use client";

import Image from "next/image";
import Link from "next/link";

export type MarqueeCategory = {
  label: string;
  camera: string;
  image: string;
};

const DEFAULT_ITEMS: MarqueeCategory[] = [
  {
    label: "Bucătării",
    camera: "Bucătării",
    image: "/projects/villa-01/01.bucatarii.cover.webp",
  },
  {
    label: "Livinguri",
    camera: "Living",
    image: "/projects/villa-06/01.living.cover.webp",
  },
  {
    label: "Dressinguri",
    camera: "Dressing",
    image: "/projects/apartment-15/16.dressing.img.webp",
  },
  {
    label: "Dormitoare",
    camera: "Dormitoare",
    image: "/projects/apartment-02/01.dormitoare.cover.webp",
  },
  {
    label: "Băi",
    camera: "Băi",
    image: "/projects/villa-05/15.bai.img.webp",
  },
  {
    label: "Spații comerciale",
    camera: "Comercial",
    image: "/projects/villa-02/01.altele.cover.webp",
  },
];

export default function HomeCategoryMarquee({
  items = DEFAULT_ITEMS,
}: {
  items?: MarqueeCategory[];
}) {
  const loop = [...items, ...items, ...items];

  return (
    <div className="aw-marquee aw-marquee--cats" aria-label="Categorii proiecte">
      <div className="aw-marquee-track">
        {loop.map((item, i) => (
          <Link
            key={`${item.camera}-${i}`}
            href={`/proiecte?camera=${encodeURIComponent(item.camera)}`}
            className="aw-marquee-cat"
          >
            <span className="aw-marquee-cat-media">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="72px"
                quality={60}
                loading="lazy"
                style={{ objectFit: "cover" }}
              />
            </span>
            <span className="aw-marquee-cat-label">{item.label}</span>
            <span className="aw-marquee-dot" aria-hidden>
              ✦
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
