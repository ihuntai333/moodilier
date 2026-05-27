// Auto-generated from projects.json — cleaned, typed, filtered
// Rules applied:
//   • HTML entities decoded: &#8211; → –, &#8217; → ', &amp; → &
//   • Titles stripped of ' – Moodilier' suffix and 'Proiect executie – ' / 'Proiect execuție – ' prefix
//   • Non-project pages filtered out
//   • Logo/nav images removed from image lists
//   • coverImage is the first real photo (not a logo)
//   • category fixed for kitchen projects

export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  images: string[];
  location?: string;
}

const EXCLUDED_SLUGS = new Set([
  "politica-de-confidentialitate",
  "proiecte",
  "servicii-prelucrare-cnc",
  "servicii-vopsitorie-mdf",
  "termoformare",
]);

const BAD_IMAGE_PATTERNS = [
  "Moodelier-L-WS-White.png",
  "Moodelier-White-scaled.png",
  "prev-p22s",
  "next-p22s",
];

function isBadImage(path: string): boolean {
  return BAD_IMAGE_PATTERNS.some((p) => path.includes(p));
}

function decodeHtml(str: string): string {
  return str
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, "\u201c")
    .replace(/&#8221;/g, "\u201d")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
}

function cleanTitle(raw: string): string {
  // Remove ' – Moodilier' suffix
  let t = raw.replace(/\s*[–-]\s*Moodilier\s*$/, "").trim();
  // Remove 'Proiect executie – ' or 'Proiect execuție – ' prefix
  t = t.replace(/^Proiect execu[tț]ie\s*[–-]\s*/i, "").trim();
  // Remove 'Proiect execuție – ' (with the ț variant)
  t = t.replace(/^Proiect execuție\s*[–-]\s*/i, "").trim();
  // Remove 'mobilier ' prefix that sometimes appears
  t = t.replace(/^mobilier\s+/i, "").trim();
  // Decode entities
  return decodeHtml(t);
}

function fixCategory(title: string, currentCategory: string): string {
  const lower = title.toLowerCase();
  if (
    (lower.includes("bucatarie") ||
      lower.includes("bucătărie") ||
      lower.includes("bucatari")) &&
    currentCategory !== "Bucătărie"
  ) {
    return "Bucătărie";
  }
  // Vizualizare 3D projects
  if (lower.startsWith("vizualizare")) {
    return "Vizualizare 3D";
  }
  return currentCategory;
}

function extractLocation(title: string): string | undefined {
  // Known locations from project titles
  const locations: Record<string, string> = {
    "mamaia nord": "Mamaia Nord",
    olimp: "Olimp",
    mogosoaia: "Mogoșoaia",
    pipera: "Pipera",
    brasov: "Brașov",
    "one tower herastrau": "Herăstrău",
    "amber gardens": "Corbeanca",
    "bucuresti 2": "București",
    "cortina academy 2": "București",
    ploiesti: "Ploiești",
    showroom: "București",
    "cortina academy": "București",
    "apt. central": "București",
    "apt. unirii": "București",
    "babymatters": "București",
    "apartament bucuresti": "București",
    "bucatarie ploiesti": "Ploiești",
    "bucătărie ploiești": "Ploiești",
    buzau: "Buzău",
    "apt. dristor": "București",
    "sediu office": "București",
    "apptown north": "București",
    "apt. apptown north": "București",
    "vila cosmopolis": "Voluntari",
    "vilă corbeanca": "Corbeanca",
    corbeanca: "Corbeanca",
    popesti: "Popești-Leordeni",
    "giulești": "București",
    "giurgiu": "București",
  };

  const lower = title.toLowerCase();
  for (const [key, val] of Object.entries(locations)) {
    if (lower.includes(key)) return val;
  }
  return undefined;
}

// ============================================================
// RAW project data — cleaned inline
// ============================================================

const rawProjects = [
  {
    slug: "executie_apt-mamaia-nord",
    title: "Proiect executie &#8211; Apt. Mamaia Nord &#8211; Moodilier",
    category: "Rezidențial",
    description: "Mobilier bucatarie, living, dining, bai, hol si dormitoare.",
    images: [
      "/images-scraped/proiecte/executie_apt-mamaia-nord/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/living_01-2.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/bucatarie_01-1.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/bucatarie_02-1.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/bucatarie_03-1.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/bucatarie_04-1.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/bucatarie_05-1.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/bucatarie_06-1.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/living_02-2.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/living_03-2.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/living_04-2.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/living_05-2.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/living_06-2.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/living_07-2.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/living_08-2.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/living_09-1.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/living_10-1.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/living_11-1.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/living_12-1.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/dormitor_matr_01-1.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/dormitor_matr_02-1.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/dormitor_matr_03-1.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/dormitor_mic_01.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/dormitor_copii_01.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/hol_01-1.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/bai_01-1.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/bai_02-1.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/bai_03.jpg",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_apt-mamaia-nord/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_apt-olimp",
    title: "Proiect executie &#8211; Apt. Olimp &#8211; Moodilier",
    category: "Rezidențial",
    description: "Mobilier living, dining, bai, hol si dormitoare.",
    images: [
      "/images-scraped/proiecte/executie_apt-olimp/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_apt-olimp/living_06-1.jpg",
      "/images-scraped/proiecte/executie_apt-olimp/bai_01.jpg",
      "/images-scraped/proiecte/executie_apt-olimp/bai_02.jpg",
      "/images-scraped/proiecte/executie_apt-olimp/dormitor_1_01.jpg",
      "/images-scraped/proiecte/executie_apt-olimp/dormitor_1_02.jpg",
      "/images-scraped/proiecte/executie_apt-olimp/dormitor_1_03.jpg",
      "/images-scraped/proiecte/executie_apt-olimp/dormitor_2_01.jpg",
      "/images-scraped/proiecte/executie_apt-olimp/dormitor_2_02.jpg",
      "/images-scraped/proiecte/executie_apt-olimp/living_01-1.jpg",
      "/images-scraped/proiecte/executie_apt-olimp/living_02-1.jpg",
      "/images-scraped/proiecte/executie_apt-olimp/living_03-1.jpg",
      "/images-scraped/proiecte/executie_apt-olimp/living_04-1.jpg",
      "/images-scraped/proiecte/executie_apt-olimp/living_05-1.jpg",
      "/images-scraped/proiecte/executie_apt-olimp/living_07-1.jpg",
      "/images-scraped/proiecte/executie_apt-olimp/living_08-1.jpg",
      "/images-scraped/proiecte/executie_apt-olimp/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_apt-olimp/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_casa-mogosoaia",
    title: "Proiect executie &#8211; Casa Mogosoaia &#8211; Moodilier",
    category: "Rezidențial",
    description: "Mobilier bucatarie, living, dining, bai, hol si dormitoare.",
    images: [
      "/images-scraped/proiecte/executie_casa-mogosoaia/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_casa-mogosoaia/living_04.jpg",
      "/images-scraped/proiecte/executie_casa-mogosoaia/bucatarie_01.jpg",
      "/images-scraped/proiecte/executie_casa-mogosoaia/bucatarie_02.jpg",
      "/images-scraped/proiecte/executie_casa-mogosoaia/bucatarie_03.jpg",
      "/images-scraped/proiecte/executie_casa-mogosoaia/living_01.jpg",
      "/images-scraped/proiecte/executie_casa-mogosoaia/living_02.jpg",
      "/images-scraped/proiecte/executie_casa-mogosoaia/living_03.jpg",
      "/images-scraped/proiecte/executie_casa-mogosoaia/birou_01.jpg",
      "/images-scraped/proiecte/executie_casa-mogosoaia/hol_01.jpg",
      "/images-scraped/proiecte/executie_casa-mogosoaia/dormitor_f_01.jpg",
      "/images-scraped/proiecte/executie_casa-mogosoaia/dormitor_matr_01.jpg",
      "/images-scraped/proiecte/executie_casa-mogosoaia/dormitor_matr_02.jpg",
      "/images-scraped/proiecte/executie_casa-mogosoaia/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_casa-mogosoaia/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_apt-pipera",
    title: "Proiect executie &#8211; Pipera &#8211; Moodilier",
    category: "Rezidențial",
    description: "Mobilier living, dining, bai, hol si dormitoare.",
    images: [
      "/images-scraped/proiecte/executie_apt-pipera/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_apt-pipera/living_03-1.jpg",
      "/images-scraped/proiecte/executie_apt-pipera/baie_01.jpg",
      "/images-scraped/proiecte/executie_apt-pipera/baie_02.jpg",
      "/images-scraped/proiecte/executie_apt-pipera/baieA_01.jpg",
      "/images-scraped/proiecte/executie_apt-pipera/cameraA.jpg",
      "/images-scraped/proiecte/executie_apt-pipera/dining_01.jpg",
      "/images-scraped/proiecte/executie_apt-pipera/dormitorA_01.jpg",
      "/images-scraped/proiecte/executie_apt-pipera/hol_01.jpg",
      "/images-scraped/proiecte/executie_apt-pipera/living_01-1.jpg",
      "/images-scraped/proiecte/executie_apt-pipera/living_02-1.jpg",
      "/images-scraped/proiecte/executie_apt-pipera/living_04-1.jpg",
      "/images-scraped/proiecte/executie_apt-pipera/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_apt-pipera/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_apt-brasov",
    title: "Proiect executie &#8211; Brasov &#8211; Moodilier",
    category: "Rezidențial",
    description: "Mobilier dormitoare și living.",
    images: [
      "/images-scraped/proiecte/executie_apt-brasov/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_apt-brasov/living_01.jpg",
      "/images-scraped/proiecte/executie_apt-brasov/dormitor_01.jpg",
      "/images-scraped/proiecte/executie_apt-brasov/dormitor_02.jpg",
      "/images-scraped/proiecte/executie_apt-brasov/dormitor_03.jpg",
      "/images-scraped/proiecte/executie_apt-brasov/dormitorB_01.jpg",
      "/images-scraped/proiecte/executie_apt-brasov/dormitorB_02.jpg",
      "/images-scraped/proiecte/executie_apt-brasov/living_02.jpg",
      "/images-scraped/proiecte/executie_apt-brasov/living_03.jpg",
      "/images-scraped/proiecte/executie_apt-brasov/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_apt-brasov/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_apt-one-herastrau2",
    title:
      "Proiect executie &#8211; Apt. One Tower Herastrau 2 &#8211; Moodilier",
    category: "Rezidențial",
    description: "Mobilier living, bucatarie si dormitor.",
    images: [
      "/images-scraped/proiecte/executie_apt-one-herastrau2/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_apt-one-herastrau2/bucatarie-01.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau2/living-01-1.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau2/living-02-1.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau2/living-03-1.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau2/living-04-1.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau2/living-05-1.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau2/bucatarie-03.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau2/bucatarie-04.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau2/dormitor-01.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau2/dormitor-02.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau2/dormitor-03.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau2/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_apt-one-herastrau2/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_amber-gardens",
    title: "Proiect executie &#8211; Amber Gardens &#8211; Moodilier",
    category: "Rezidențial",
    description: "Mobilier living, dormitoare, dressing, hol si baie.",
    images: [
      "/images-scraped/proiecte/executie_amber-gardens/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_amber-gardens/living-03.jpg",
      "/images-scraped/proiecte/executie_amber-gardens/living-01.jpg",
      "/images-scraped/proiecte/executie_amber-gardens/living-06.jpg",
      "/images-scraped/proiecte/executie_amber-gardens/hol01.jpg",
      "/images-scraped/proiecte/executie_amber-gardens/dormitor_baiat_01.jpg",
      "/images-scraped/proiecte/executie_amber-gardens/dormitor_fata_01.jpg",
      "/images-scraped/proiecte/executie_amber-gardens/baie_bona_01.jpg",
      "/images-scraped/proiecte/executie_amber-gardens/baie_parter_01.jpg",
      "/images-scraped/proiecte/executie_amber-gardens/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_amber-gardens/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_apt-bucuresti2",
    title:
      "Proiect executie &#8211; Apartament Bucuresti 2 &#8211; Moodilier",
    category: "Rezidențial",
    description: "Mobilier living, dormitoare, dressing, baie, hol si birou.",
    images: [
      "/images-scraped/proiecte/executie_apt-bucuresti2/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_apt-bucuresti2/front.jpg",
      "/images-scraped/proiecte/executie_apt-bucuresti2/birou1.jpg",
      "/images-scraped/proiecte/executie_apt-bucuresti2/baie1.jpg",
      "/images-scraped/proiecte/executie_apt-bucuresti2/dormitor1.jpg",
      "/images-scraped/proiecte/executie_apt-bucuresti2/dressing1.jpg",
      "/images-scraped/proiecte/executie_apt-bucuresti2/hol_01.jpg",
      "/images-scraped/proiecte/executie_apt-bucuresti2/living_01.jpg",
      "/images-scraped/proiecte/executie_apt-bucuresti2/living_02.jpg",
      "/images-scraped/proiecte/executie_apt-bucuresti2/living_03.jpg",
      "/images-scraped/proiecte/executie_apt-bucuresti2/living_04.jpg",
      "/images-scraped/proiecte/executie_apt-bucuresti2/living_05.jpg",
      "/images-scraped/proiecte/executie_apt-bucuresti2/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_apt-bucuresti2/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_apt-cortina2",
    title:
      "Proiect executie &#8211; Apt. Cortina Academy 2 &#8211; Moodilier",
    category: "Rezidențial",
    description:
      "S-au realizat diferite piese de mobilier custom made cu materiale variate – MDF vopsit, MDF vopsit auriu, profil metalic vopsit, iluminare LED.",
    images: [
      "/images-scraped/proiecte/executie_apt-cortina2/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_apt-cortina2/living_13.jpg",
      "/images-scraped/proiecte/executie_apt-cortina2/bucatarie_06.jpg",
      "/images-scraped/proiecte/executie_apt-cortina2/bucatarie_01.jpg",
      "/images-scraped/proiecte/executie_apt-cortina2/living_07.jpg",
      "/images-scraped/proiecte/executie_apt-cortina2/living_08.jpg",
      "/images-scraped/proiecte/executie_apt-cortina2/dormitor1_01.jpg",
      "/images-scraped/proiecte/executie_apt-cortina2/dormitor2_01.jpg",
      "/images-scraped/proiecte/executie_apt-cortina2/dormitor2_02.jpg",
      "/images-scraped/proiecte/executie_apt-cortina2/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_apt-cortina2/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_ploiesti",
    title: "Proiect executie &#8211; Ploiesti &#8211; Moodilier",
    category: "Rezidențial",
    description:
      "S-au realizat diferite piese de mobilier custom made cu materiale variate – MDF vopsit, MDF vopsit auriu, profil metalic vopsit, iluminare LED.",
    images: [
      "/images-scraped/proiecte/executie_ploiesti/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_ploiesti/02a_living_02.jpg",
      "/images-scraped/proiecte/executie_ploiesti/01_bucatarie_01.jpg",
      "/images-scraped/proiecte/executie_ploiesti/01_bucatarie_02.jpg",
      "/images-scraped/proiecte/executie_ploiesti/02a_living_01.jpg",
      "/images-scraped/proiecte/executie_ploiesti/02a_living_03.jpg",
      "/images-scraped/proiecte/executie_ploiesti/03_cam_copii_01.jpg",
      "/images-scraped/proiecte/executie_ploiesti/04_hol_01.jpg",
      "/images-scraped/proiecte/executie_ploiesti/05_dormitor_01.jpg",
      "/images-scraped/proiecte/executie_ploiesti/06_baie_mat_01.jpg",
      "/images-scraped/proiecte/executie_ploiesti/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_ploiesti/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_showroom",
    title: "Proiect executie &#8211; Showroom &#8211; Moodilier",
    category: "Comercial",
    description:
      "Pentru spațiul de showroom s-au realizat diferite piese de mobilier custom made cu materiale variate – MDF vopsit, MDF vopsit auriu, profil metalic vopsit, iluminare LED.",
    images: [
      "/images-scraped/proiecte/executie_showroom/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_showroom/002.jpg",
      "/images-scraped/proiecte/executie_showroom/001.jpg",
      "/images-scraped/proiecte/executie_showroom/003.jpg",
      "/images-scraped/proiecte/executie_showroom/004-e1639470927533.jpg",
      "/images-scraped/proiecte/executie_showroom/005.jpg",
      "/images-scraped/proiecte/executie_showroom/006.jpg",
      "/images-scraped/proiecte/executie_showroom/007-e1639471103686.jpg",
      "/images-scraped/proiecte/executie_showroom/008.jpg",
      "/images-scraped/proiecte/executie_showroom/009.jpg",
      "/images-scraped/proiecte/executie_showroom/010.jpg",
      "/images-scraped/proiecte/executie_showroom/011.jpg",
      "/images-scraped/proiecte/executie_showroom/012.jpg",
      "/images-scraped/proiecte/executie_showroom/013.jpg",
      "/images-scraped/proiecte/executie_showroom/014.jpg",
      "/images-scraped/proiecte/executie_showroom/015.jpg",
      "/images-scraped/proiecte/executie_showroom/016-1-e1639473481978.jpg",
      "/images-scraped/proiecte/executie_showroom/017.jpg",
      "/images-scraped/proiecte/executie_showroom/018.jpg",
      "/images-scraped/proiecte/executie_showroom/019.jpg",
      "/images-scraped/proiecte/executie_showroom/020.jpg",
      "/images-scraped/proiecte/executie_showroom/022.jpg",
      "/images-scraped/proiecte/executie_showroom/021.jpg",
      "/images-scraped/proiecte/executie_showroom/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_showroom/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_apt-cortina",
    title:
      "Proiect executie &#8211; Apt. Cortina Academy &#8211; Moodilier",
    category: "Rezidențial",
    description:
      "Pentru spațiul rezidențial s-a inclus mobilierul custom made cu materiale variate – MDF vopsit, MDF vopsit auriu, profil metalic vopsit, blat bucatarie din compozit, iluminare LED.",
    images: [
      "/images-scraped/proiecte/executie_apt-cortina/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_apt-cortina/living_06-1.jpg",
      "/images-scraped/proiecte/executie_apt-cortina/living_01-1.jpg",
      "/images-scraped/proiecte/executie_apt-cortina/living_02-1.jpg",
      "/images-scraped/proiecte/executie_apt-cortina/dressing_01.jpg",
      "/images-scraped/proiecte/executie_apt-cortina/dormitor2_01.jpg",
      "/images-scraped/proiecte/executie_apt-cortina/dormitor_01-1.jpg",
      "/images-scraped/proiecte/executie_apt-cortina/dormitor_02-1.jpg",
      "/images-scraped/proiecte/executie_apt-cortina/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_apt-cortina/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_apt-one-herastrau",
    title:
      "Proiect executie &#8211; Apt. One Tower Herastrau &#8211; Moodilier",
    category: "Rezidențial",
    description:
      "Pentru spațiul rezidențial s-a inclus mobilierul custom made cu materiale variate – MDF vopsit, MDF vopsit auriu, profil metalic vopsit, blat bucatarie din compozit, iluminare LED.",
    images: [
      "/images-scraped/proiecte/executie_apt-one-herastrau/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_apt-one-herastrau/living_10.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau/living_05.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau/living_04.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau/bucatarie_04_.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau/bucatarie_01.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau/dormitor_06.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau/dormitor_02.jpg",
      "/images-scraped/proiecte/executie_apt-one-herastrau/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_apt-one-herastrau/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_central",
    title:
      "Proiect executie &#8211; mobilier Apt. Central &#8211; Moodilier",
    category: "Rezidențial",
    description:
      "Pentru spațiul rezidențial s-a inclus mobilierul custom made cu materiale variate – MDF PerfectSense, blat bucatarie din compozit, iluminare LED.",
    images: [
      "/images-scraped/proiecte/executie_central/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_central/living_03-3.jpg",
      "/images-scraped/proiecte/executie_central/living_01-3.jpg",
      "/images-scraped/proiecte/executie_central/living_02-3.jpg",
      "/images-scraped/proiecte/executie_central/hol_04-1.jpg",
      "/images-scraped/proiecte/executie_central/dormitor_09-1.jpg",
      "/images-scraped/proiecte/executie_central/baie_02.jpg",
      "/images-scraped/proiecte/executie_central/bucatarie_01-2.jpg",
      "/images-scraped/proiecte/executie_central/bucatarie_02-2.jpg",
      "/images-scraped/proiecte/executie_central/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_central/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_popesti",
    title:
      "Proiect executie &#8211; mobilier Popesti &#8211; Moodilier",
    category: "Rezidențial",
    description:
      "Pentru spațiul rezidențial s-a inclus mobilierul custom made cu materiale variate – MDF vopsit, MDF furniruit, profil metalic vopsit, blat bucatarie din compozit, iluminare LED.",
    images: [
      "/images-scraped/proiecte/executie_popesti/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_popesti/living_13-2.jpg",
      "/images-scraped/proiecte/executie_popesti/living_01-2.jpg",
      "/images-scraped/proiecte/executie_popesti/bucatarie_18.jpg",
      "/images-scraped/proiecte/executie_popesti/bucatarie_01-1.jpg",
      "/images-scraped/proiecte/executie_popesti/hol_01.jpg",
      "/images-scraped/proiecte/executie_popesti/dormitor1_01.jpg",
      "/images-scraped/proiecte/executie_popesti/dormitor2_01-1.jpg",
      "/images-scraped/proiecte/executie_popesti/baie1_01.jpg",
      "/images-scraped/proiecte/executie_popesti/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_popesti/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_apt-unirii",
    title: "Proiect executie &#8211; Apt. Unirii &#8211; Moodilier",
    category: "Rezidențial",
    description:
      "Pentru spațiul rezidențial s-a inclus mobilierul custom made cu materiale variate – MDF vopsit, MDF furniruit, MDF Perfectsense, profil metalic vopsit, blat bucatarie din compozit, iluminare LED, oglinzi cu halou LED.",
    images: [
      "/images-scraped/proiecte/executie_apt-unirii/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_apt-unirii/DSC9243-HDR.jpg",
      "/images-scraped/proiecte/executie_apt-unirii/DSC9246-HDR.jpg",
      "/images-scraped/proiecte/executie_apt-unirii/DSC8982-HDR.jpg",
      "/images-scraped/proiecte/executie_apt-unirii/DSC9144-HDR.jpg",
      "/images-scraped/proiecte/executie_apt-unirii/DSC9099-HDR.jpg",
      "/images-scraped/proiecte/executie_apt-unirii/DSC9069-HDR.jpg",
      "/images-scraped/proiecte/executie_apt-unirii/DSC9033-HDR.jpg",
      "/images-scraped/proiecte/executie_apt-unirii/DSC9165-HDR.jpg",
      "/images-scraped/proiecte/executie_apt-unirii/DSC9237-HDR.jpg",
      "/images-scraped/proiecte/executie_apt-unirii/DSC9189-HDR.jpg",
      "/images-scraped/proiecte/executie_apt-unirii/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_apt-unirii/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_magazin-babymatters",
    title:
      "Proiect executie &#8211; Magazin Babymatters &#8211; Moodilier",
    category: "Comercial",
    description:
      "Pentru spațiul comercial s-a inclus mobilierul custom made cu materiale variate – riflaje cu finisaj lemn, uni, profil metalic vopsit, iluminare LED, oglinzi fumurii.",
    images: [
      "/images-scraped/proiecte/executie_magazin-babymatters/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_magazin-babymatters/GSC_3830.jpg",
      "/images-scraped/proiecte/executie_magazin-babymatters/IMG_20210112_131412.jpg",
      "/images-scraped/proiecte/executie_magazin-babymatters/GSC_3913.jpg",
      "/images-scraped/proiecte/executie_magazin-babymatters/GSC_3890.jpg",
      "/images-scraped/proiecte/executie_magazin-babymatters/GSC_3880.jpg",
      "/images-scraped/proiecte/executie_magazin-babymatters/GSC_3868.jpg",
      "/images-scraped/proiecte/executie_magazin-babymatters/GSC_3791.jpg",
      "/images-scraped/proiecte/executie_magazin-babymatters/GSC_3761-scaled.jpg",
      "/images-scraped/proiecte/executie_magazin-babymatters/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_magazin-babymatters/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_apt-bucuresti",
    title:
      "Proiect executie &#8211; Apartament Bucuresti &#8211; Moodilier",
    category: "Rezidențial",
    description:
      "Amenajarea a tratat zona de open space a bucătăriei și zona de living.",
    images: [
      "/images-scraped/proiecte/executie_apt-bucuresti/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_apt-bucuresti/IMG_3370.jpg",
      "/images-scraped/proiecte/executie_apt-bucuresti/IMG_3332.jpg",
      "/images-scraped/proiecte/executie_apt-bucuresti/IMG_3326.jpg",
      "/images-scraped/proiecte/executie_apt-bucuresti/IMG_3333.jpg",
      "/images-scraped/proiecte/executie_apt-bucuresti/IMG_3325.jpg",
      "/images-scraped/proiecte/executie_apt-bucuresti/IMG_3324.jpg",
      "/images-scraped/proiecte/executie_apt-bucuresti/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_apt-bucuresti/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_buc-ploiesti",
    title:
      "Proiect executie &#8211; Bucatarie Ploiesti &#8211; Moodilier",
    category: "Bucătărie",
    description: "Proiect de execuție – Bucătărie Ploiești.",
    images: [
      "/images-scraped/proiecte/executie_buc-ploiesti/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_buc-ploiesti/IMG_3120.jpg",
      "/images-scraped/proiecte/executie_buc-ploiesti/IMG_3142.jpg",
      "/images-scraped/proiecte/executie_buc-ploiesti/IMG_3128.jpg",
      "/images-scraped/proiecte/executie_buc-ploiesti/IMG_3124.jpg",
      "/images-scraped/proiecte/executie_buc-ploiesti/IMG_3122.jpg",
      "/images-scraped/proiecte/executie_buc-ploiesti/IMG_3116.jpg",
      "/images-scraped/proiecte/executie_buc-ploiesti/IMG_3106.jpg",
      "/images-scraped/proiecte/executie_buc-ploiesti/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_buc-ploiesti/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_casa-buzau",
    title: "Proiect executie &#8211; Casa Buzau &#8211; Moodilier",
    category: "Rezidențial",
    description:
      "Amenajarea a tratat atât zona de open space a bucătăriei și partea de dining, precum și zona de living.",
    images: [
      "/images-scraped/proiecte/executie_casa-buzau/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_casa-buzau/executie_casa-buzau_buc_01.jpg",
      "/images-scraped/proiecte/executie_casa-buzau/executie_casa-buzau_buc_02.jpg",
      "/images-scraped/proiecte/executie_casa-buzau/executie_casa-buzau_buc_03.jpg",
      "/images-scraped/proiecte/executie_casa-buzau/executie_casa-buzau_buc_04.jpg",
      "/images-scraped/proiecte/executie_casa-buzau/executie_casa-buzau_buc_08.jpg",
      "/images-scraped/proiecte/executie_casa-buzau/executie_casa-buzau_living_08.jpg",
      "/images-scraped/proiecte/executie_casa-buzau/executie_casa-buzau_living_01.jpg",
      "/images-scraped/proiecte/executie_casa-buzau/executie_casa-buzau_living_02.jpg",
      "/images-scraped/proiecte/executie_casa-buzau/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_casa-buzau/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_apt-dristor",
    title: "Proiect executie &#8211; Apt. Dristor &#8211; Moodilier",
    category: "Rezidențial",
    description:
      "Pentru a fi în linie cu conceptul realizat de Arh. Dan Schiller în cadrul proiectului au fost selecționate materiale de înaltă calitate.",
    images: [
      "/images-scraped/proiecte/executie_apt-dristor/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_apt-dristor/executie_apt-dristor_living_03.jpg",
      "/images-scraped/proiecte/executie_apt-dristor/executie_apt-dristor_buc_01.jpg",
      "/images-scraped/proiecte/executie_apt-dristor/executie_apt-dristor_buc_02.jpg",
      "/images-scraped/proiecte/executie_apt-dristor/executie_apt-dristor_dorm_cop_01.jpg",
      "/images-scraped/proiecte/executie_apt-dristor/executie_apt-dristor_dorm_mat_01.jpg",
      "/images-scraped/proiecte/executie_apt-dristor/executie_apt-dristor_hol01.jpg",
      "/images-scraped/proiecte/executie_apt-dristor/executie_apt-dristor_living_01.jpg",
      "/images-scraped/proiecte/executie_apt-dristor/executie_apt-dristor_baie.jpg",
      "/images-scraped/proiecte/executie_apt-dristor/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_apt-dristor/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_apt-buzau",
    title: "Proiect executie &#8211; Apartament Buzau &#8211; Moodilier",
    category: "Rezidențial",
    description:
      "Amenajarea a tratat zona de open space a bucătăriei, living, precum și zona de birou.",
    images: [
      "/images-scraped/proiecte/executie_apt-buzau/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_apt-buzau/executie_casa-buzau_living_06.jpg",
      "/images-scraped/proiecte/executie_apt-buzau/executie_casa-buzau_living_09.jpg",
      "/images-scraped/proiecte/executie_apt-buzau/executie_casa-buzau_living_03.jpg",
      "/images-scraped/proiecte/executie_apt-buzau/executie_casa-buzau_buc2_01.jpg",
      "/images-scraped/proiecte/executie_apt-buzau/executie_casa-buzau_birou_01.jpg",
      "/images-scraped/proiecte/executie_apt-buzau/executie_casa-buzau_birou_02.jpg",
      "/images-scraped/proiecte/executie_apt-buzau/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_apt-buzau/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_sediu-office",
    title: "Proiect execuție &#8211; Sediu Office &#8211; Moodilier",
    category: "Comercial",
    description:
      "Mobilier office, scaune birou, mobilier sala de sedinte, chicineta.",
    images: [
      "/images-scraped/proiecte/executie_sediu-office/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_sediu-office/feature_sediu_office.jpg",
      "/images-scraped/proiecte/executie_sediu-office/executie_sediu-office01.jpg",
      "/images-scraped/proiecte/executie_sediu-office/executie_sediu-office02.jpg",
      "/images-scraped/proiecte/executie_sediu-office/executie_sediu-office03.jpg",
      "/images-scraped/proiecte/executie_sediu-office/executie_sediu-office05.jpg",
      "/images-scraped/proiecte/executie_sediu-office/executie_sediu-office06.jpg",
      "/images-scraped/proiecte/executie_sediu-office/executie_sediu-office10.jpg",
      "/images-scraped/proiecte/executie_sediu-office/executie_sediu-office15.jpg",
      "/images-scraped/proiecte/executie_sediu-office/executie_sediu-office20.jpg",
      "/images-scraped/proiecte/executie_sediu-office/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_sediu-office/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_apptown-north",
    title:
      "Proiect executie &#8211; Apt. AppTown North &#8211; Moodilier",
    category: "Rezidențial",
    description:
      "Propunerea de amenajare a cuprins atât zona open space de living și bucătărie, cât și dormitorul. Conceptual s-a ales o direcție minimalistă, cu spații de depozitare ascunse și nuanțe dominante de alb și gri.",
    images: [
      "/images-scraped/proiecte/executie_apptown-north/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_apptown-north/apptown_exec_15.jpg",
      "/images-scraped/proiecte/executie_apptown-north/apptown_exec_14.jpg",
      "/images-scraped/proiecte/executie_apptown-north/apptown_exec_11.jpg",
      "/images-scraped/proiecte/executie_apptown-north/apptown_exec_09.jpg",
      "/images-scraped/proiecte/executie_apptown-north/apptown_exec_08.jpg",
      "/images-scraped/proiecte/executie_apptown-north/apptown_exec_04.jpg",
      "/images-scraped/proiecte/executie_apptown-north/apptown_exec_28.jpg",
      "/images-scraped/proiecte/executie_apptown-north/apptown_exec_01.jpg",
      "/images-scraped/proiecte/executie_apptown-north/apptown_exec_24.jpg",
      "/images-scraped/proiecte/executie_apptown-north/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_apptown-north/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_vila-cosmopolis",
    title: "Proiect execuție &#8211; Vila Cosmopolis &#8211; Moodilier",
    category: "Rezidențial",
    description:
      "Acest proiect este unul din cele mai cuprinzătoare unde am realizat mobila pentru living, dining, bucătărie, hol, dressing, scară interioară, dormitor și băi.",
    images: [
      "/images-scraped/proiecte/executie_vila-cosmopolis/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_vila-cosmopolis/Cosmopolis_Vila_Andrei_Tudoran_02-scaled.jpg",
      "/images-scraped/proiecte/executie_vila-cosmopolis/vila_cosmopolis_exec_living_5.jpg",
      "/images-scraped/proiecte/executie_vila-cosmopolis/vila_cosmopolis_exec_living_3.jpg",
      "/images-scraped/proiecte/executie_vila-cosmopolis/vila_cosmopolis_exec_living_2.jpg",
      "/images-scraped/proiecte/executie_vila-cosmopolis/vila_cosmopolis_exec_hol_7.jpg",
      "/images-scraped/proiecte/executie_vila-cosmopolis/vila_cosmopolis_exec_dressing_4.jpg",
      "/images-scraped/proiecte/executie_vila-cosmopolis/vila_cosmopolis_exec_dormitor_3.jpg",
      "/images-scraped/proiecte/executie_vila-cosmopolis/vila_cosmopolis_exec_bucatarie_6.jpg",
      "/images-scraped/proiecte/executie_vila-cosmopolis/vila_cosmopolis_exec_bai_6.jpg",
      "/images-scraped/proiecte/executie_vila-cosmopolis/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_vila-cosmopolis/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_vila-corbeanca",
    title: "Proiect execuție &#8211; Vilă Corbeanca &#8211; Moodilier",
    category: "Rezidențial",
    description:
      "Conceptul de amenajarea a spațiului de locuit a avut ca inspirație spațiul exterior prin vegetația prezentă în abundență și mai ales prin cadrul intim, fiind o zonă depărtată de agitația metropolitană.",
    images: [
      "/images-scraped/proiecte/executie_vila-corbeanca/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_vila-corbeanca/vila_corbeanca_exec_dormitor_2.jpg",
      "/images-scraped/proiecte/executie_vila-corbeanca/vila_corbeanca_exec_living_5.jpg",
      "/images-scraped/proiecte/executie_vila-corbeanca/vila_corbeanca_exec_living_3.jpg",
      "/images-scraped/proiecte/executie_vila-corbeanca/vila_corbeanca_exec_living_2.jpg",
      "/images-scraped/proiecte/executie_vila-corbeanca/vila_corbeanca_exec_living_4.jpg",
      "/images-scraped/proiecte/executie_vila-corbeanca/vila_corbeanca_exec_bucatarie_4.jpg",
      "/images-scraped/proiecte/executie_vila-corbeanca/vila_corbeanca_exec_baie_1.jpg",
      "/images-scraped/proiecte/executie_vila-corbeanca/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/executie_vila-corbeanca/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "executie_buc-giurgiu",
    title: "Proiect execuție &#8211; Bucătărie Giulești &#8211; Moodilier",
    category: "Bucătărie",
    description: "Bucătărie premium la comandă cu finisaje mate.",
    images: [
      "/images-scraped/proiecte/executie_buc-giurgiu/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/executie_buc-giurgiu/buc_giurgiu_2.jpg",
      "/images-scraped/proiecte/executie_buc-giurgiu/buc_giurgiu_4.jpg",
      "/images-scraped/proiecte/executie_buc-giurgiu/buc_giurgiu_3.jpg",
      "/images-scraped/proiecte/executie_buc-giurgiu/buc_giurgiu_1.jpg",
      "/images-scraped/proiecte/executie_buc-giurgiu/buc_giurgiu_5.jpg",
      "/images-scraped/proiecte/executie_buc-giurgiu/next-p22s7tkx6obiahe3xa6kuh7sedmq4ebetzl8fa9uxc.png",
      "/images-scraped/proiecte/executie_buc-giurgiu/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "vizualizare_magazin-babymatters",
    title:
      "Vizualizare 3D &#8211; Magazin Babymatters &#8211; Moodilier",
    category: "Vizualizare 3D",
    description:
      "Pentru spațiul comercial s-a inclus mobilierul custom made cu materiale variate – riflaje cu finisaj lemn, uni, profil metalic vopsit, iluminare LED, oglinzi fumurii. Proiectul de executie este in desfasurare.",
    images: [
      "/images-scraped/proiecte/vizualizare_magazin-babymatters/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/vizualizare_magazin-babymatters/Randare-Babymatters-3.jpg",
      "/images-scraped/proiecte/vizualizare_magazin-babymatters/Randare-Babymatters-1.jpg",
      "/images-scraped/proiecte/vizualizare_magazin-babymatters/Randare-Babymatters-2.jpg",
      "/images-scraped/proiecte/vizualizare_magazin-babymatters/Randare-Babymatters-4.jpg",
      "/images-scraped/proiecte/vizualizare_magazin-babymatters/Randare-Babymatters-5.jpg",
      "/images-scraped/proiecte/vizualizare_magazin-babymatters/Randare-Babymatters-6.jpg",
      "/images-scraped/proiecte/vizualizare_magazin-babymatters/Randare-Babymatters-7.jpg",
      "/images-scraped/proiecte/vizualizare_magazin-babymatters/Randare-Babymatters-8.jpg",
      "/images-scraped/proiecte/vizualizare_magazin-babymatters/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/vizualizare_magazin-babymatters/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "vizualizare_casa-buzau",
    title: "Vizualizare 3D &#8211; Casa Buzau &#8211; Moodilier",
    category: "Vizualizare 3D",
    description:
      "Propunerea de amenajare a cuprins zona open space de living, bucătărie, dining și hol. Pentru a crea un ritm în spațiul generos s-au propus diferite texturi atât prin finisajul de lemn dispus în spic, tapetul cu pattern variat cât și fronturi cu un design geometric în zona de dining.",
    images: [
      "/images-scraped/proiecte/vizualizare_casa-buzau/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/vizualizare_casa-buzau/casa_buc_render_05.jpg",
      "/images-scraped/proiecte/vizualizare_casa-buzau/casa_buc_render_10.jpg",
      "/images-scraped/proiecte/vizualizare_casa-buzau/casa_buc_render_09.jpg",
      "/images-scraped/proiecte/vizualizare_casa-buzau/casa_buc_render_04.jpg",
      "/images-scraped/proiecte/vizualizare_casa-buzau/casa_buc_render_03.jpg",
      "/images-scraped/proiecte/vizualizare_casa-buzau/casa_buc_render_02.jpg",
      "/images-scraped/proiecte/vizualizare_casa-buzau/casa_buc_render_01.jpg",
      "/images-scraped/proiecte/vizualizare_casa-buzau/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/vizualizare_casa-buzau/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "vizualizare_apt-buzau",
    title: "Vizualizare 3D &#8211; Apartament Buzau &#8211; Moodilier",
    category: "Vizualizare 3D",
    description:
      "Propunerea de amenajare a cuprins completarea mobilierului din bucătărie și zona de birou. Aspectul luxuriant cerut de către client a fost rezultat din nuanțele aurii, finisajul lucios metalizat și formele rotunjite ale volumetriilor.",
    images: [
      "/images-scraped/proiecte/vizualizare_apt-buzau/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/vizualizare_apt-buzau/Randare-bucatarie-1.jpg",
      "/images-scraped/proiecte/vizualizare_apt-buzau/Randare-bucatarie-4.jpg",
      "/images-scraped/proiecte/vizualizare_apt-buzau/Randare-bucatarie-3.jpg",
      "/images-scraped/proiecte/vizualizare_apt-buzau/Randare-birou-6.jpg",
      "/images-scraped/proiecte/vizualizare_apt-buzau/Randare-birou-5.jpg",
      "/images-scraped/proiecte/vizualizare_apt-buzau/Randare-birou-1.jpg",
      "/images-scraped/proiecte/vizualizare_apt-buzau/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/vizualizare_apt-buzau/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "vizualizare_sediu-office",
    title: "Vizualizare 3D &#8211; Sediu Office &#8211; Moodilier",
    category: "Vizualizare 3D",
    description: "Interior design birouri, recepție, sală conferințe.",
    images: [
      "/images-scraped/proiecte/vizualizare_sediu-office/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/vizualizare_sediu-office/Propunere-receptie-9_2.jpg",
      "/images-scraped/proiecte/vizualizare_sediu-office/Propunere-receptie-2.jpg",
      "/images-scraped/proiecte/vizualizare_sediu-office/12-Randare-birou.jpg",
      "/images-scraped/proiecte/vizualizare_sediu-office/11-Randare-birou.jpg",
      "/images-scraped/proiecte/vizualizare_sediu-office/10-Randare-birou.jpg",
      "/images-scraped/proiecte/vizualizare_sediu-office/07-Randare-birou.jpg",
      "/images-scraped/proiecte/vizualizare_sediu-office/Randare-masa-meeting-1.jpg",
      "/images-scraped/proiecte/vizualizare_sediu-office/Randare-masa-meeting-2-1.jpg",
      "/images-scraped/proiecte/vizualizare_sediu-office/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/vizualizare_sediu-office/Moodelier-White-scaled.png",
    ],
  },
  {
    slug: "vizualizare_apptown-north",
    title:
      "Vizualizare 3D &#8211; Apt. AppTown North &#8211; Moodilier",
    category: "Vizualizare 3D",
    description: "Interior design living, bucătărie, hol și dormitor.",
    images: [
      "/images-scraped/proiecte/vizualizare_apptown-north/Moodelier-L-WS-White.png",
      "/images-scraped/proiecte/vizualizare_apptown-north/apptown_render_03.jpg",
      "/images-scraped/proiecte/vizualizare_apptown-north/apptown_render_16.jpg",
      "/images-scraped/proiecte/vizualizare_apptown-north/apptown_render_15.jpg",
      "/images-scraped/proiecte/vizualizare_apptown-north/apptown_render_14.jpg",
      "/images-scraped/proiecte/vizualizare_apptown-north/apptown_render_12.jpg",
      "/images-scraped/proiecte/vizualizare_apptown-north/apptown_render_11.jpg",
      "/images-scraped/proiecte/vizualizare_apptown-north/apptown_render_08.jpg",
      "/images-scraped/proiecte/vizualizare_apptown-north/apptown_render_02.jpg",
      "/images-scraped/proiecte/vizualizare_apptown-north/apptown_render_01.jpg",
      "/images-scraped/proiecte/vizualizare_apptown-north/prev-p22s3q09dophnpcgv0e5h0gf4vu3jx1jxp602uco28.png",
      "/images-scraped/proiecte/vizualizare_apptown-north/Moodelier-White-scaled.png",
    ],
  },
];

// ============================================================
// Build cleaned export
// ============================================================

export const projects: Project[] = rawProjects
  .filter((p) => !EXCLUDED_SLUGS.has(p.slug))
  .map((p) => {
    const cleanedImages = p.images.filter((img) => !isBadImage(img));
    const coverImage = cleanedImages[0] ?? "";
    const rawTitle = cleanTitle(p.title);
    const category = fixCategory(rawTitle, p.category);
    const location = extractLocation(rawTitle);

    return {
      slug: p.slug,
      title: rawTitle,
      category,
      description: decodeHtml(p.description),
      coverImage,
      images: cleanedImages,
      ...(location ? { location } : {}),
    };
  });
