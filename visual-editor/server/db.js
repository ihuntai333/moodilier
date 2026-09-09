/**
 * SQLite helpers for the visual editor Express server (sql.js — no native build).
 * DB file: data/visual-editor.sqlite (repo root)
 * Uploads: public/uploads
 */
const fs = require("fs");
const path = require("path");
const initSqlJs = require("sql.js");

const REPO_ROOT = path.join(__dirname, "..", "..");
const DATA_DIR = path.join(REPO_ROOT, "data");
const UPLOADS_DIR = path.join(REPO_ROOT, "public", "uploads");
const DB_PATH =
  process.env.VISUAL_EDITOR_DB ||
  path.join(DATA_DIR, "visual-editor.sqlite");
const SCHEMA_PATH = path.join(__dirname, "..", "schema.sql");
const WASM_PATH = path.join(
  __dirname,
  "node_modules",
  "sql.js",
  "dist",
  "sql-wasm.wasm"
);

let db;
let readyPromise;

function ensureDirs() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function persist() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

async function initDb() {
  ensureDirs();
  const SQL = await initSqlJs({
    locateFile: () =>
      fs.existsSync(WASM_PATH)
        ? WASM_PATH
        : path.join(
            REPO_ROOT,
            "node_modules",
            "sql.js",
            "dist",
            "sql-wasm.wasm"
          ),
  });
  if (fs.existsSync(DB_PATH)) {
    db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    db = new SQL.Database();
  }
  const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
  db.exec(schema);
  persist();
  return db;
}

function getDbSync() {
  if (!db) {
    throw new Error("DB not ready — call await ensureDb() first");
  }
  return db;
}

function ensureDb() {
  if (db) return Promise.resolve(db);
  if (!readyPromise) readyPromise = initDb();
  return readyPromise;
}

function getContentMap() {
  const database = getDbSync();
  const out = {};
  const result = database.exec("SELECT key, value FROM page_content");
  if (result[0]) {
    for (const row of result[0].values) {
      out[String(row[0])] = String(row[1] ?? "");
    }
  }
  return out;
}

function upsertContentBulk(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { saved: 0 };
  }
  const database = getDbSync();
  let saved = 0;
  database.run("BEGIN");
  try {
    for (const row of items) {
      if (!row || !row.key) continue;
      database.run(
        `INSERT INTO page_content (key, value, type)
         VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, type = excluded.type`,
        [
          String(row.key),
          row.value == null ? "" : String(row.value),
          row.type ? String(row.type) : "text",
        ]
      );
      saved += 1;
    }
    database.run("COMMIT");
  } catch (e) {
    try {
      database.run("ROLLBACK");
    } catch (_) {
      /* ignore */
    }
    throw e;
  }
  persist();
  return { saved };
}

function insertMedia({ filename, originalName, mimeType, size, relPath, url }) {
  const database = getDbSync();
  database.run(
    `INSERT INTO media (filename, original_name, mime_type, size, path, url)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [filename, originalName, mimeType, size, relPath, url]
  );
  const idRes = database.exec("SELECT last_insert_rowid()");
  const id = Number(idRes[0]?.values?.[0]?.[0] ?? 0);
  persist();
  return {
    id,
    filename,
    original_name: originalName,
    mime_type: mimeType,
    size,
    path: relPath,
    url,
  };
}

function listMedia() {
  const database = getDbSync();
  const result = database.exec(
    `SELECT id, filename, original_name, mime_type, size, path, url, created_at
     FROM media ORDER BY datetime(created_at) DESC, id DESC`
  );
  if (!result[0]) return [];
  return result[0].values.map((row) => ({
    id: Number(row[0]),
    filename: String(row[1]),
    original_name: String(row[2]),
    mime_type: String(row[3]),
    size: Number(row[4]),
    path: String(row[5]),
    url: String(row[6]),
    created_at: row[7] != null ? String(row[7]) : undefined,
  }));
}

function getUploadsDir() {
  ensureDirs();
  return UPLOADS_DIR;
}

module.exports = {
  ensureDb,
  getContentMap,
  upsertContentBulk,
  insertMedia,
  listMedia,
  getUploadsDir,
  DB_PATH,
  UPLOADS_DIR,
};
