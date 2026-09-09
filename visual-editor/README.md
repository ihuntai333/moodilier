# Moodilier Inline Visual Page Editor

Self-contained inline editor for public site pages. Admins see a floating toolbar (bottom-right); visitors only get saved content applied to `[data-key]` elements.

## Architecture

| Piece | Role |
|-------|------|
| `visual-editor/server` | Canonical Express + SQLite via `sql.js` (no native build) |
| `src/app/api/content`, `/upload`, `/api/media` | Same 4 endpoints mirrored in Next.js (Vercel / `next dev`) via `sql.js` |
| `public/editor.js` | Browser editor (source: `visual-editor/public/editor.js`) |
| Cookie `ihuntev_logged_in=true` | UI mode detection (readable by JS, **not** httpOnly) |
| Cookie `admin_session` | Real admin auth (httpOnly) — Next mutating APIs accept either |

Shared SQLite path (local): **`data/visual-editor.sqlite`**  
Uploads: **`public/uploads/`** (URL `/uploads/...`)

### Production / Vercel note

Serverless hosts often have a **read-only** filesystem. Next routes then use `/tmp/moodilier-visual-editor/visual-editor.sqlite` (or JSON fallback under `/tmp`). Data is **ephemeral** across cold starts. Prefer the Express server on a Node host with a persistent disk for durable content, or point `VISUAL_EDITOR_DB` at a writable volume.

## Quick start (recommended — Next only)

```bash
# from repo root
npm install
npm run editor:sync
npm run dev
```

1. Open `/admin/login` and sign in with `ADMIN_PASSWORD`.
2. Login sets both `admin_session` (httpOnly) and `ihuntev_logged_in=true` (readable).
3. Visit `/` — floating toolbar appears (Edit Mode, Salvează Tot, Anulează, Structură).
4. Toggle **Edit Mode**, edit marked fields, **Salvează Tot**.

## Express server (canonical SQLite via sql.js)

```bash
cd visual-editor/server
npm install
npm start
# → http://localhost:4001
```

Or from repo root: `npm run editor:install` then `npm run editor:server`.

Uses **sql.js** (pure WASM SQLite — no native `node-gyp` build). Same schema file: `visual-editor/schema.sql`.

| Variable | Default | Meaning |
|----------|---------|---------|
| `VISUAL_EDITOR_PORT` | `4001` | Listen port |
| `VISUAL_EDITOR_DB` | `data/visual-editor.sqlite` | SQLite path |

Optional dual-dev (point browser at Express):

```html
<script>window.__VISUAL_EDITOR_API__ = 'http://localhost:4001';</script>
```

CORS is enabled with credentials. Cookies must be sent (`credentials: 'include'`).

### API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/content` | Public | Key → value map |
| `POST` | `/api/content` | Cookie | Bulk upsert `[{ key, value, type }]` transactional |
| `POST` | `/api/content/upload` | Cookie | Multipart `file` → `/uploads/...` |
| `GET` | `/api/media` | Cookie | Media list (newest first) |

Auth cookie for Express: `ihuntev_logged_in=true` **or** `admin_session=authenticated`.

## Marking HTML

```html
<h1 data-key="home.hero.title" data-editable="html">…</h1>
<p data-key="home.hero.body" data-editable="text">…</p>
<a href="/contact" data-key="home.hero.cta" data-editable="link">…</a>
<div data-key="home.about.image" data-editable="image"><img src="…" /></div>

<section data-section-id="hero" data-section-name="Hero">…</section>
```

`data-editable`: `text` | `html` | `number` | `link` | `image`.

Section layout is saved as `layout_<pageName>` JSON `{ order, hidden }`. Homepage → `layout_home`.

## Auth bridge

`POST /api/admin/auth` sets:

- `admin_session=authenticated` (httpOnly)
- `ihuntev_logged_in=true` (readable — required by `editor.js`)

`DELETE /api/admin/logout` clears both.

## Sync `editor.js`

```bash
npm run editor:sync
# or: copy visual-editor\public\editor.js public\editor.js
```

Site layout `(site)/layout.tsx` loads `/editor.js` via `next/script`.
