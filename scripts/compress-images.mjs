/**
 * compress-images.mjs — v2
 * 
 * Fix-uri față de v1:
 * - Scanare recursivă (include proiecte/ subdirectoare)
 * - Citire ca Buffer (fix pentru eroarea UNKNOWN pe Windows)
 * - Scriere atomică (temp file → rename)
 * 
 * Rulare: node scripts/compress-images.mjs
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT_DIR = path.join(__dirname, '../public/images-scraped');

const SKIP_BELOW_KB = 80;    // Skip files already under 80 KB
const JPEG_QUALITY  = 78;
const WEBP_QUALITY  = 78;
const PNG_QUALITY   = 80;
const MAX_WIDTH     = 1920;  // Resize if wider

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp']);

let totalBefore = 0, totalAfter = 0;
let processed = 0, skipped = 0, errors = 0;
let fileCount = 0;

const fmt = (bytes) => bytes < 1024 * 1024
  ? `${Math.round(bytes / 1024)} KB`
  : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

// ── Recursive file walker ─────────────────────────────────────────────
function* walkFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkFiles(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

// ── Compress one file ─────────────────────────────────────────────────
async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED.has(ext)) return;

  const sizeBefore = fs.statSync(filePath).size;
  totalBefore += sizeBefore;

  if (sizeBefore < SKIP_BELOW_KB * 1024) {
    totalAfter += sizeBefore;
    skipped++;
    return;
  }

  try {
    // Read as Buffer — avoids Windows path issues with sharp
    const inputBuffer = fs.readFileSync(filePath);
    
    let instance = sharp(inputBuffer, { failOnError: false });
    const meta = await instance.metadata();

    // Resize if too wide
    if (meta.width && meta.width > MAX_WIDTH) {
      instance = instance.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    let outBuffer;

    if (ext === '.png') {
      if (meta.hasAlpha) {
        outBuffer = await instance.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toBuffer();
      } else {
        // No alpha → convert to JPEG (smaller, same quality)
        outBuffer = await instance.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
      }
    } else if (ext === '.webp') {
      outBuffer = await instance.webp({ quality: WEBP_QUALITY }).toBuffer();
    } else {
      outBuffer = await instance.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
    }

    const sizeAfter = outBuffer.length;

    if (sizeAfter < sizeBefore * 0.95) {
      // Atomic write: temp → rename
      const tmpPath = filePath + '.tmp';
      fs.writeFileSync(tmpPath, outBuffer);
      fs.renameSync(tmpPath, filePath);

      totalAfter += sizeAfter;
      processed++;

      const pct = Math.round((1 - sizeAfter / sizeBefore) * 100);
      const name = path.relative(INPUT_DIR, filePath).padEnd(60);
      process.stdout.write(`✓ ${name} ${fmt(sizeBefore).padStart(8)} → ${fmt(sizeAfter).padStart(7)}  -${pct}%\n`);
    } else {
      totalAfter += sizeBefore;
      skipped++;
    }
  } catch (err) {
    totalAfter += sizeBefore;
    errors++;
    console.error(`✗ ${path.basename(filePath)}: ${err.message}`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────
async function run() {
  console.log('🖼️  Moodilier Image Compressor v2');
  console.log('====================================');
  console.log(`📁 ${INPUT_DIR}`);
  console.log(`⚙️  JPEG/WebP: q${JPEG_QUALITY} | PNG: q${PNG_QUALITY} | Skip < ${SKIP_BELOW_KB}KB | Max ${MAX_WIDTH}px wide\n`);

  const files = [];
  for (const f of walkFiles(INPUT_DIR)) {
    if (SUPPORTED.has(path.extname(f).toLowerCase())) files.push(f);
  }
  console.log(`📊 Found ${files.length} images to process...\n`);

  for (const f of files) {
    fileCount++;
    if (fileCount % 50 === 0) {
      console.log(`   [${fileCount}/${files.length}] processed so far...`);
    }
    await compressImage(f);
  }

  const saved = totalBefore - totalAfter;
  const pctSaved = totalBefore > 0 ? Math.round((saved / totalBefore) * 100) : 0;

  console.log('\n====================================');
  console.log(`✅ Compressed: ${processed} images`);
  console.log(`⏭️  Skipped:   ${skipped} (already small / no improvement)`);
  console.log(`❌ Errors:    ${errors}`);
  console.log(`\n📦 Before: ${fmt(totalBefore)}`);
  console.log(`📦 After:  ${fmt(totalAfter)}`);
  console.log(`💾 Saved:  ${fmt(saved)} (${pctSaved}% reduction)`);
}

run().catch(console.error);
