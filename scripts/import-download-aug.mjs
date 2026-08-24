/**
 * Import + optimize Moodilier projects from:
 *   C:\W O R K S P A C E\VG OTHERS\Moodilier\DOWNLOAD AUG
 *
 * Outputs:
 *   public/brand/logo-white.png, logo-dark.png
 *   public/projects/<slug>/*.{webp,jpg}
 *   src/data/projects-aug.ts
 *
 * Usage: node scripts/import-download-aug.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SOURCE =
  process.env.MOODILIER_DOWNLOAD_AUG ||
  "C:\\W O R K S P A C E\\VG OTHERS\\Moodilier\\DOWNLOAD AUG";

const OUT_PROJECTS = path.join(ROOT, "public", "projects");
const OUT_BRAND = path.join(ROOT, "public", "brand");
const OUT_DATA = path.join(ROOT, "src", "data", "projects-aug.ts");
const OUT_VIDEOS = path.join(ROOT, "public", "videos");

const GALLERY_MAX_EDGE = 1800;
const COVER_MAX_EDGE = 1600;
const QUALITY = 76;
const MAX_IMAGES_PER_PROJECT = 16;
const CONCURRENCY = 3;

const IMAGE_RE = /\.(jpe?g|png|webp)$/i;
const SKIP_NAME_RE = /copy|logo|moodelier|signature|prev-|next-|ds_store|thumbs/i;

const ROOM_LABELS = [
  "Bucătării",
  "Living",
  "Dressing",
  "Dormitoare",
  "Băi",
  "Hol",
  "Altele",
];

function normalizeRoom(folderName) {
  const n = folderName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (n.includes("bucat") || n.includes("kitchen")) return "Bucătării";
  if (n.includes("living")) return "Living";
  if (n.includes("dress")) return "Dressing";
  if (n.includes("dormit") || n.includes("bedroom") || n.includes("camera"))
    return "Dormitoare";
  if (n.includes("bai") || n.includes("baie") || n.includes("bath")) return "Băi";
  if (n.includes("hol") || n.includes("entry") || n.includes("hallway")) return "Hol";
  return "Altele";
}

function slugifyRoom(room) {
  return room
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function slugify(input) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/moodilier/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function parseProjectFolder(folderName) {
  // "1. MOODILIER Villa - 06" → { order:1, kind:"Villa", code:"06", title:"Villa 06" }
  const cleaned = folderName.replace(/\s+/g, " ").trim();
  const m = cleaned.match(
    /^(\d+)\.\s*MOODILIER\s+(Villa|Apartment|Showroom)\s*-?\s*(.*)$/i
  );
  if (!m) {
    const slug = slugify(cleaned);
    return {
      order: 999,
      kind: "Rezidențial",
      title: cleaned.replace(/^\d+\.\s*/, "").replace(/MOODILIER\s*/i, "").trim(),
      slug: slug || `proiect-${Date.now()}`,
    };
  }
  const order = Number(m[1]);
  const kindRaw = m[2];
  const code = (m[3] || "").replace(/[-–—]/g, "").trim();
  const kindLabel =
    kindRaw.toLowerCase() === "showroom"
      ? "Showroom"
      : kindRaw.toLowerCase() === "villa"
        ? "Villa"
        : "Apartment";
  const title = code ? `${kindLabel} ${code}` : kindLabel;
  const category =
    kindRaw.toLowerCase() === "showroom" ? "Comercial" : "Rezidențial";
  const slug = slugify(`${kindLabel}-${code || order}`);
  return { order, kind: kindLabel, title, slug, category, code };
}

function walkFiles(dir, acc = [], roomHint = "Altele") {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (/^Proiecte\s+\d+/i.test(ent.name)) continue;
      if (/^poze$/i.test(ent.name)) {
        walkFiles(full, acc, roomHint);
        continue;
      }
      const room = normalizeRoom(ent.name);
      walkFiles(full, acc, room);
    } else if (ent.isFile() && IMAGE_RE.test(ent.name)) {
      if (SKIP_NAME_RE.test(ent.name)) continue;
      acc.push({ path: full, room: roomHint || "Altele" });
    }
  }
  return acc;
}

function pickImages(files) {
  const uniq = [];
  const seen = new Set();
  for (const f of files.sort((a, b) => a.path.localeCompare(b.path, "en"))) {
    const base = path
      .basename(f.path)
      .toLowerCase()
      .replace(/\s*-\s*copy(?:\s*-\s*copy)*/gi, "")
      .replace(/\s+/g, " ");
    const key = `${f.room}::${base}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniq.push(f);
  }

  if (uniq.length <= MAX_IMAGES_PER_PROJECT) return uniq;

  const picked = [];
  const step = uniq.length / MAX_IMAGES_PER_PROJECT;
  for (let i = 0; i < MAX_IMAGES_PER_PROJECT; i++) {
    picked.push(uniq[Math.min(uniq.length - 1, Math.floor(i * step))]);
  }
  return [...new Map(picked.map((p) => [p.path, p])).values()];
}

async function optimizeToFile(srcPath, destPath, maxEdge) {
  const input = fs.readFileSync(srcPath);
  const originalBytes = input.length;

  let pipeline = sharp(input, { failOn: "none" }).rotate();
  const meta = await sharp(input, { failOn: "none" }).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (w > maxEdge || h > maxEdge) {
    pipeline = pipeline.resize({
      width: maxEdge,
      height: maxEdge,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const webp = await pipeline
    .webp({ quality: QUALITY, effort: 5, smartSubsample: true })
    .toBuffer();

  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, webp);

  return {
    originalBytes,
    optimizedBytes: webp.length,
    width: (await sharp(webp).metadata()).width ?? w,
    height: (await sharp(webp).metadata()).height ?? h,
  };
}

async function mapPool(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

function listProjectDirs() {
  const batches = ["Proiecte 01 - 04", "Proiecte 05 - 09", "Proiecte 10 - 22"];
  const dirs = [];
  for (const batch of batches) {
    const batchPath = path.join(SOURCE, batch);
    if (!fs.existsSync(batchPath)) {
      console.warn("Missing batch:", batchPath);
      continue;
    }
    for (const name of fs.readdirSync(batchPath)) {
      if (/^Proiecte\s+\d+/i.test(name)) continue; // nested dump
      const full = path.join(batchPath, name);
      if (!fs.statSync(full).isDirectory()) continue;
      if (!/MOODILIER/i.test(name)) continue;
      dirs.push(full);
    }
  }
  return dirs;
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

async function copyLogos() {
  const logoDir = path.join(SOURCE, "3. Logo");
  fs.mkdirSync(OUT_BRAND, { recursive: true });
  const whiteSrc = path.join(logoDir, "M-Signature-White.png");
  const blackSrc = path.join(logoDir, "M-Signature-Black.png");
  if (fs.existsSync(whiteSrc)) {
    const buf = fs.readFileSync(whiteSrc);
    const out = await sharp(buf).png({ compressionLevel: 9 }).toBuffer();
    fs.writeFileSync(path.join(OUT_BRAND, "logo-white.png"), out);
    console.log("✓ logo-white.png", formatBytes(out.length));
  }
  if (fs.existsSync(blackSrc)) {
    const buf = fs.readFileSync(blackSrc);
    const out = await sharp(buf).png({ compressionLevel: 9 }).toBuffer();
    fs.writeFileSync(path.join(OUT_BRAND, "logo-dark.png"), out);
    console.log("✓ logo-dark.png", formatBytes(out.length));
  }
}

async function copyVideos() {
  const vidDir = path.join(SOURCE, "1. Filmulete pagini Site");
  if (!fs.existsSync(vidDir)) return;
  fs.mkdirSync(OUT_VIDEOS, { recursive: true });
  for (const name of fs.readdirSync(vidDir)) {
    if (!/\.mp4$/i.test(name)) continue;
    const src = path.join(vidDir, name);
    const destName =
      name.toLowerCase() === "mood1.mp4"
        ? "moodilier-vid-1.mp4"
        : name.toLowerCase() === "2.mp4"
          ? "moodilier-vid-2.mp4"
          : `moodilier-${slugify(name)}.mp4`;
    const dest = path.join(OUT_VIDEOS, destName);
    if (fs.existsSync(dest) && fs.statSync(dest).size === fs.statSync(src).size) {
      console.log("skip video (exists)", destName);
      continue;
    }
    fs.copyFileSync(src, dest);
    console.log("✓ video", destName, formatBytes(fs.statSync(dest).size));
  }
}

async function importProject(dir) {
  const folderName = path.basename(dir);
  const meta = parseProjectFolder(folderName);
  const files = pickImages(walkFiles(dir));
  if (!files.length) {
    console.warn("! no images", folderName);
    return null;
  }

  const outDir = path.join(OUT_PROJECTS, meta.slug);
  fs.mkdirSync(outDir, { recursive: true });

  let totalIn = 0;
  let totalOut = 0;
  const webPaths = [];

  await mapPool(files, CONCURRENCY, async (file, idx) => {
    const isCover = idx === 0;
    const roomSlug = slugifyRoom(file.room);
    const destName = `${String(idx + 1).padStart(2, "0")}.${roomSlug}.${isCover ? "cover" : "img"}.webp`;
    const dest = path.join(outDir, destName);
    const result = await optimizeToFile(
      file.path,
      dest,
      isCover ? COVER_MAX_EDGE : GALLERY_MAX_EDGE
    );
    totalIn += result.originalBytes;
    totalOut += result.optimizedBytes;
    webPaths[idx] = {
      url: `/projects/${meta.slug}/${destName}`,
      room: file.room,
    };
  });

  const gallery = webPaths.filter(Boolean);
  const images = gallery.map((g) => g.url);
  const rooms = [...new Set(gallery.map((g) => g.room).filter((r) => r && r !== "Altele"))];

  console.log(
    `✓ ${meta.slug} — ${images.length} imgs [${rooms.join(", ") || "—"}]  ${formatBytes(totalIn)} → ${formatBytes(totalOut)}`
  );

  return {
    slug: meta.slug,
    title: meta.title,
    category: meta.category || "Rezidențial",
    description: `Proiect Moodilier — ${meta.title}. Mobilier premium la comandă, executat în atelierul propriu.`,
    coverImage: images[0],
    images,
    gallery,
    rooms,
    location: undefined,
    order: meta.order,
  };
}

function writeDataFile(projects) {
  const sorted = [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const payload = sorted.map(({ order, ...rest }) => rest);
  const body = `/* Auto-generated by scripts/import-download-aug.mjs — do not edit by hand */
export type ProjectImage = { url: string; room: string };

export interface Project {
  slug: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  images: string[];
  gallery: ProjectImage[];
  rooms: string[];
  location?: string;
}

export const ROOM_FILTERS = ${JSON.stringify(ROOM_LABELS.filter((r) => r !== "Altele"), null, 2)} as const;

export const projects: Project[] = ${JSON.stringify(payload, null, 2)};
`;
  fs.writeFileSync(OUT_DATA, body, "utf8");
  console.log(`\nWrote ${payload.length} projects → ${OUT_DATA}`);
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error("SOURCE not found:", SOURCE);
    process.exit(1);
  }

  console.log("Source:", SOURCE);
  console.log("Out projects:", OUT_PROJECTS);

  await copyLogos();
  await copyVideos();

  const dirs = listProjectDirs().sort((a, b) =>
    path.basename(a).localeCompare(path.basename(b), "en", { numeric: true })
  );
  console.log(`\nFound ${dirs.length} project folders\n`);

  const projects = [];
  for (const dir of dirs) {
    try {
      const p = await importProject(dir);
      if (p) projects.push(p);
    } catch (err) {
      console.error("FAIL", path.basename(dir), err);
    }
  }

  writeDataFile(projects);
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
