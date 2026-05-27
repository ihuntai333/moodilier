#!/usr/bin/env node
// migrate-to-supabase.js
// Reads projects.json, cleans entries, and POSTs each to the local API.
// Usage: node src/scripts/migrate-to-supabase.js
// Requires: Next.js dev server running at http://localhost:3000

"use strict";

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const PROJECTS_JSON = path.join(__dirname, "../data/projects.json");
const API_URL = "http://localhost:3000/api/admin/projects";

// Titles that identify non-project pages — skip these
const SKIP_TITLE_FRAGMENTS = [
  "Politica",
  "Servicii Prelucrare",
  "Servicii Vopsitorie",
  "Termoformare",
  "Proiecte \u2013 Moodilier", // already decoded em-dash
  "Proiecte – Moodilier",
];

// Image filename substrings that should be removed
const BAD_IMAGE_FRAGMENTS = [
  "Moodelier-L-WS-White",
  "Moodelier-White-scaled",
  "prev-p22s",
  "next-p22s",
];

// ---------------------------------------------------------------------------
// HTML entity decoding (no external deps)
// ---------------------------------------------------------------------------
function decodeHtmlEntities(str) {
  return str
    .replace(/&#8211;/g, "\u2013") // en-dash –
    .replace(/&#8212;/g, "\u2014") // em-dash —
    .replace(/&#8217;/g, "\u2019") // right single quote '
    .replace(/&#8216;/g, "\u2018") // left single quote '
    .replace(/&#8220;/g, "\u201C") // left double quote "
    .replace(/&#8221;/g, "\u201D") // right double quote "
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
}

// ---------------------------------------------------------------------------
// Title cleaning
// ---------------------------------------------------------------------------
function cleanTitle(raw) {
  let t = decodeHtmlEntities(raw);

  // Remove trailing ' – Moodilier' (with various dash types)
  t = t.replace(/\s*[\u2013\u2014-]\s*Moodilier\s*$/i, "").trim();

  // Remove leading project prefixes
  t = t.replace(/^Proiect execu[tț]ie\s*[\u2013\u2014-]\s*/i, "").trim();

  return t;
}

// ---------------------------------------------------------------------------
// Image filtering
// ---------------------------------------------------------------------------
function isBadImage(imgPath) {
  return BAD_IMAGE_FRAGMENTS.some((frag) => imgPath.includes(frag));
}

// ---------------------------------------------------------------------------
// HTTP POST helper (Node 18+ native fetch)
// ---------------------------------------------------------------------------
async function postProject(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { _raw: text };
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(json)}`);
  }
  return json;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  if (!fs.existsSync(PROJECTS_JSON)) {
    console.error(`❌ Cannot find projects.json at:\n   ${PROJECTS_JSON}`);
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(PROJECTS_JSON, "utf8"));
  console.log(`\n📂 Loaded ${raw.length} entries from projects.json`);

  // Filter out non-project entries
  const entries = raw.filter((p) => {
    const decoded = decodeHtmlEntities(p.title || "");
    return !SKIP_TITLE_FRAGMENTS.some((frag) => decoded.includes(frag));
  });

  console.log(`🔍 After filtering: ${entries.length} real projects\n`);

  let imported = 0;
  let failed = 0;

  for (const entry of entries) {
    const title = cleanTitle(entry.title || "");

    // Filter bad images
    const allImages = (entry.images || []).filter(
      (img) => !isBadImage(img)
    );

    const coverImage = allImages[0] || entry.coverImage || "";

    const payload = {
      title,
      slug: entry.slug || "",
      category: entry.category || "Rezidențial",
      location: "",
      description: decodeHtmlEntities(entry.description || ""),
      coverImage,
      images: allImages,
    };

    try {
      await postProject(payload);
      console.log(`✅ Imported: ${title}`);
      imported++;
    } catch (err) {
      console.error(`❌ Error: ${title}`);
      console.error(`   ${err.message}`);
      failed++;
    }
  }

  console.log(
    `\nDone! Imported ${imported}/${entries.length} projects` +
      (failed > 0 ? ` (${failed} failed)` : "")
  );
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
