/**
 * Visual editor persistence for Next.js API routes.
 *
 * Prefers sql.js against data/visual-editor.sqlite (shared with Express).
 * On read-only hosts (Vercel): /tmp or in-memory, then JSON fallback.
 * Avoids requiring better-sqlite3 from Next (native bind errors on Windows/Vercel).
 */
import fs from "fs";
import path from "path";
import { createRequire } from "module";

export type ContentItem = { key: string; value: string; type: string };

export type MediaRow = {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  path: string;
  url: string;
  created_at?: string;
};

type DbApi = {
  getContentMap: () => Record<string, string>;
  upsertContentBulk: (items: ContentItem[]) => { saved: number };
  insertMedia: (row: {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    relPath: string;
    url: string;
  }) => MediaRow;
  listMedia: () => MediaRow[];
  getUploadsDir: () => string;
};

const SCHEMA = `
CREATE TABLE IF NOT EXISTS page_content (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  type  TEXT NOT NULL DEFAULT 'text'
);
CREATE TABLE IF NOT EXISTS media (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  filename      TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type     TEXT NOT NULL,
  size          INTEGER NOT NULL,
  path          TEXT NOT NULL,
  url           TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);
`;

function resolveDataDir(): string {
  if (process.env.VISUAL_EDITOR_DATA_DIR) {
    return process.env.VISUAL_EDITOR_DATA_DIR;
  }
  if (process.env.VERCEL || process.env.VISUAL_EDITOR_EPHEMERAL === "1") {
    return "/tmp/moodilier-visual-editor";
  }
  return path.join(process.cwd(), "data");
}

function resolveDbPath(): string {
  if (process.env.VISUAL_EDITOR_DB) return process.env.VISUAL_EDITOR_DB;
  return path.join(resolveDataDir(), "visual-editor.sqlite");
}

function resolveUploadsDir(): string {
  if (process.env.VISUAL_EDITOR_UPLOADS) {
    return process.env.VISUAL_EDITOR_UPLOADS;
  }
  if (process.env.VERCEL || process.env.VISUAL_EDITOR_EPHEMERAL === "1") {
    return path.join("/tmp", "moodilier-uploads");
  }
  return path.join(process.cwd(), "public", "uploads");
}

function resolveJsonPath(): string {
  return path.join(resolveDataDir(), "visual-editor-fallback.json");
}

type JsonStore = {
  page_content: Record<string, { value: string; type: string }>;
  media: MediaRow[];
  nextMediaId: number;
};

function ensureDir(dir: string) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch {
    /* ignore */
  }
}

function readJson(): JsonStore {
  ensureDir(resolveDataDir());
  try {
    const raw = fs.readFileSync(resolveJsonPath(), "utf-8");
    return JSON.parse(raw) as JsonStore;
  } catch {
    return { page_content: {}, media: [], nextMediaId: 1 };
  }
}

function writeJson(store: JsonStore) {
  ensureDir(resolveDataDir());
  fs.writeFileSync(resolveJsonPath(), JSON.stringify(store, null, 2), "utf-8");
}

const jsonApi: DbApi = {
  getContentMap() {
    const store = readJson();
    const out: Record<string, string> = {};
    for (const [key, row] of Object.entries(store.page_content)) {
      out[key] = row.value;
    }
    return out;
  },
  upsertContentBulk(items) {
    const store = readJson();
    let saved = 0;
    for (const item of items) {
      if (!item?.key) continue;
      store.page_content[String(item.key)] = {
        value: item.value == null ? "" : String(item.value),
        type: item.type ? String(item.type) : "text",
      };
      saved += 1;
    }
    writeJson(store);
    return { saved };
  },
  insertMedia({ filename, originalName, mimeType, size, relPath, url }) {
    const store = readJson();
    const row: MediaRow = {
      id: store.nextMediaId++,
      filename,
      original_name: originalName,
      mime_type: mimeType,
      size,
      path: relPath,
      url,
      created_at: new Date().toISOString(),
    };
    store.media.unshift(row);
    writeJson(store);
    return row;
  },
  listMedia() {
    return readJson().media;
  },
  getUploadsDir() {
    const dir = resolveUploadsDir();
    ensureDir(dir);
    return dir;
  },
};

type SqlJsDb = {
  run: (sql: string, params?: unknown[]) => void;
  exec: (sql: string) => Array<{ columns: string[]; values: unknown[][] }>;
  export: () => Uint8Array;
};

function createSqlJsApi(database: SqlJsDb, persist: () => void): DbApi {
  database.exec(SCHEMA);

  return {
    getContentMap() {
      const out: Record<string, string> = {};
      const result = database.exec("SELECT key, value FROM page_content");
      if (result[0]) {
        for (const row of result[0].values) {
          out[String(row[0])] = String(row[1] ?? "");
        }
      }
      return out;
    },
    upsertContentBulk(items) {
      let saved = 0;
      database.run("BEGIN");
      try {
        for (const item of items) {
          if (!item?.key) continue;
          database.run(
            `INSERT INTO page_content (key, value, type) VALUES (?, ?, ?)
             ON CONFLICT(key) DO UPDATE SET value = excluded.value, type = excluded.type`,
            [
              String(item.key),
              item.value == null ? "" : String(item.value),
              item.type ? String(item.type) : "text",
            ]
          );
          saved += 1;
        }
        database.run("COMMIT");
      } catch (e) {
        try {
          database.run("ROLLBACK");
        } catch {
          /* ignore */
        }
        throw e;
      }
      persist();
      return { saved };
    },
    insertMedia({ filename, originalName, mimeType, size, relPath, url }) {
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
    },
    listMedia() {
      const result = database.exec(
        `SELECT id, filename, original_name, mime_type, size, path, url, created_at
         FROM media ORDER BY created_at DESC, id DESC`
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
    },
    getUploadsDir() {
      const dir = resolveUploadsDir();
      ensureDir(dir);
      return dir;
    },
  };
}

function trySqlJsApi(): DbApi | null {
  try {
    const require = createRequire(path.join(process.cwd(), "package.json"));
    const initSqlJs = require("sql.js") as (cfg?: {
      locateFile?: (file: string) => string;
    }) => Promise<{
      Database: new (data?: ArrayLike<number> | Buffer | null) => SqlJsDb;
    }>;

    // sql.js is async — we bootstrap synchronously via deasync-less pattern:
    // load wasm file ourselves and use the sync-ish init by reading wasm buffer.
    // In practice Next route handlers are async; we cache a sync-ready API by
    // blocking on a preloaded promise stored on globalThis.
    const g = globalThis as unknown as {
      __veSqlJsApi?: DbApi;
      __veSqlJsPromise?: Promise<DbApi | null>;
    };

    if (g.__veSqlJsApi) return g.__veSqlJsApi;

    // Kick off async init if needed; for first request fall through to JSON
    // until ready, then subsequent requests use sql.js.
    if (!g.__veSqlJsPromise) {
      g.__veSqlJsPromise = (async () => {
        try {
          const wasmPath = path.join(
            process.cwd(),
            "node_modules",
            "sql.js",
            "dist",
            "sql-wasm.wasm"
          );
          const SQL = await initSqlJs({
            locateFile: () => wasmPath,
          });
          const dbPath = resolveDbPath();
          ensureDir(path.dirname(dbPath));

          let database: SqlJsDb;
          if (fs.existsSync(dbPath)) {
            const buf = fs.readFileSync(dbPath);
            database = new SQL.Database(buf);
          } else {
            database = new SQL.Database();
          }

          const persist = () => {
            try {
              const data = database.export();
              fs.writeFileSync(dbPath, Buffer.from(data));
            } catch (err) {
              console.warn("[visual-editor] persist sqlite failed:", err);
            }
          };

          // Ensure schema + initial persist so file exists locally
          const api = createSqlJsApi(database, persist);
          persist();
          g.__veSqlJsApi = api;
          return api;
        } catch (err) {
          console.warn("[visual-editor] sql.js unavailable:", err);
          return null;
        }
      })();
    }

    return g.__veSqlJsApi || null;
  } catch {
    return null;
  }
}

let cached: DbApi | null = null;

export function getEditorDb(): DbApi {
  if (cached) return cached;
  const sqlJs = trySqlJsApi();
  cached = sqlJs || jsonApi;
  // Warm sql.js in background so later requests use SQLite file
  if (!sqlJs) {
    const g = globalThis as unknown as {
      __veSqlJsPromise?: Promise<DbApi | null>;
    };
    void g.__veSqlJsPromise?.then((api) => {
      if (api) cached = api;
    });
  }
  return cached;
}

/** Awaitable init for route handlers that want SQLite before first write. */
export async function ensureEditorDb(): Promise<DbApi> {
  const g = globalThis as unknown as {
    __veSqlJsApi?: DbApi;
    __veSqlJsPromise?: Promise<DbApi | null>;
  };
  if (g.__veSqlJsApi) {
    cached = g.__veSqlJsApi;
    return cached;
  }
  trySqlJsApi();
  if (g.__veSqlJsPromise) {
    const api = await g.__veSqlJsPromise;
    if (api) {
      cached = api;
      return cached;
    }
  }
  cached = jsonApi;
  return cached;
}

export function getUploadsDir(): string {
  return getEditorDb().getUploadsDir();
}

import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import { verifyAdminSessionToken } from "@/lib/admin-session";

/** Writes require a cryptographically verified admin_session — never the UI cookie. */
export async function isEditorWriteAuthorized(cookies: {
  get: (name: string) => { value: string } | undefined;
}): Promise<boolean> {
  const session = cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(session);
}
