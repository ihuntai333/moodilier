-- Moodilier Inline Visual Page Editor schema (SQLite)

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
