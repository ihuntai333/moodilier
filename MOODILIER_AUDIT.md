# Moodilier — Audit complet

> **Obsolete pentru deploy:** producția e Hostinger (GitHub `main`, Node 22, `next start`). Notele despre cPanel / Passenger / `app.js` de mai jos nu mai sunt planul de lucru.

**Data:** 15 septembrie 2026  
**Mod:** audit only (fără modificări de cod, fără install, fără refactor)  
**Repo analizat:** proiectul Next.js din working tree la data auditului

---

## Executive Summary

Moodilier nu este un site WordPress și nu este un site static. Este o aplicație **Next.js 16** care se generează pe server la fiecare vizită (SSR). Are panou admin, formular de contact, upload de poze, editor vizual pe pagini și un catalog de proiecte.

Datele importante (proiecte CMS, setări, mesaje de contact, poze noi din admin) stau în **Supabase** (cloud, în afara cPanel). Pozele vechi din portofoliu stau în folderul `public/projects/` din proiect. Editorul vizual (texte pe pagini) stă pe **disc local** (fișier SQLite), nu în Supabase.

De aceea **nu poate fi exportat ca HTML static** și **nu poate rula pe cPanel clasic doar PHP**. Are nevoie de **Node.js 20+ care rulează tot timpul**.

Build-ul `next build` pe cPanel a picat cu `spawn node EAGAIN` din cauza **limitelor de procese** ale hostingului, nu din cauza unui bug de cod. Local, `npm run build` trece (exit 0). Concluzia operațională: **nu construi pe cPanel; construiește local (sau pe un VPS) și urcă artefactul**.

Aplicația rulează deja pe **Vercel**. Mutarea pe cPanel este posibilă doar cu un flux „build în altă parte + Node Selector”, nu cu `next build` pe shared hosting.

---

## Current Architecture

**Router:** App Router (`src/app/`). Nu există Pages Router (`pages/`).

```
Browser (site public + /admin)
        ↓
Next.js Node server  (app.js / next start / Passenger)
        ↓
middleware.ts  (site lock, admin session, rate-limit login)
        ↓
┌──────────────────────┬─────────────────────────┐
│ Pagini SSR           │ API routes (18)         │
│ force-dynamic        │ fără Server Actions     │
└──────────┬───────────┴────────────┬────────────┘
           ↓                        ↓
    Catalog static            ┌─────┴──────┐
    src/data/projects-aug.ts  │ Supabase   │ sql.js / disk
                              │ Postgres   │ data/visual-editor.sqlite
                              │ Storage    │ public/uploads/
                              └────────────┘
                              SMTP (nodemailer)
```

### Structura `src/app/`

| Zonă | Path | Rol |
|------|------|-----|
| Root layout | `src/app/layout.tsx` | HTML shell |
| Site public | `src/app/(site)/` | homepage, proiecte, servicii, despre, contact, legale |
| Site layout | `(site)/layout.tsx` | **`dynamic = "force-dynamic"`**, `fetchCache = "force-no-store"`, `revalidate = 0` |
| Admin | `src/app/admin/` | dashboard, proiecte, mesaje, setări, stub-uri pagini |
| Unlock | `src/app/acces/` | lock opțional de preview |
| API | `src/app/api/` | 18 route handlers |
| SEO | `sitemap.ts`, `robots.ts`, `llms.txt/route.ts` | generate la runtime |

**Server Actions:** **nu există** (`"use server"` nu apare în proiect). Toate mutațiile sunt API routes.

**Middleware:** `src/middleware.ts` — site lock, protecție `/admin` și `/api/admin/*`, rate-limit login, protecție write pe `/api/content`. Next 16 îl raportează ca deprecat (vrea `proxy`).

**Instrumentation:** `src/instrumentation.ts` — forțează DNS IPv4-first pentru fetch-urile către Supabase. Webpack nu rezolvă modulul `dns` la build (warning, catch silent).

### Componente principale

- Site: `src/components/site/` (nav, footer, cards, gallery, hero)
- Home: `src/components/home/` (slider, awards)
- Admin: `src/components/admin/` (`ProjectForm`, sidebar, hero slider editor)
- Editor: `public/editor.js` + `VisualEditorLoader` + `src/lib/visual-editor/store.ts`
- Contact/analytics: `CookieBanner`, `ConsentAnalytics`, `FacebookPixel`, `WhatsAppButton`

### Logica unde

| Funcție | Unde |
|---------|------|
| Admin UI | `src/app/admin/**`, `src/components/admin/**` |
| Admin API | `src/app/api/admin/**` |
| Auth admin | `src/lib/admin-session.ts`, `src/lib/admin-auth.ts`, `POST /api/admin/auth` |
| Editor vizual | `src/lib/visual-editor/store.ts`, `/api/content`, `/api/content/upload`, `/api/media` |
| Proiecte publice | `src/lib/projects.ts` (catalog + overlay CMS) |
| Date CMS admin | `src/lib/admin-projects.ts` |
| Setări site | `src/lib/site-settings.ts` → tabel `settings` |
| Upload proiecte | `POST /api/admin/upload` → Supabase Storage |
| Upload editor | `POST /api/content/upload` → `public/uploads/` |
| Contact | `POST /api/contact` + `src/lib/contact-*.ts` |

### Servicii externe

- **Supabase** (Postgres + Storage `project-images`)
- **SMTP** (nodemailer)
- **GA4 / Meta Pixel** (după consimțământ cookie)
- **Google Fonts** (încorporate de `next/font` la build)
- **Google Maps** iframe (URL din setări)

Nu există Prisma, Drizzle, MySQL, MariaDB, Auth Supabase pentru useri.

---

## Database

**Bază principală de producție: Supabase (PostgreSQL gestionat), nu pe cPanel.**

Nu există `DATABASE_URL`. Nu există Prisma/Drizzle.

Tabele folosite în cod:

| Tabel | Date |
|-------|------|
| `projects` | slug, title, category, description, seo_*, cover_image, images, location, is_featured, year, surface, status, updated_at (+ încercări opționale video/gallery/rooms, schema live poate să nu le aibă) |
| `settings` | key/value: chrome site, contact, GA4, Pixel, hero slides |
| `messages` | lead-uri contact (name, email, phone, message, is_read) |

**Fallback-uri locale (nu sunt „baza de producție”):**

| Store | Path | Când |
|-------|------|------|
| sql.js SQLite | `data/visual-editor.sqlite` | editor vizual pe host cu disc scriibil |
| JSON fallback | `data/visual-editor-fallback.json` | dacă sql.js pică / ephemeral |
| `src/data/db.json` | mesaje contact | **doar non-production**, dacă Supabase lipsește |
| Catalog TypeScript | `src/data/projects-aug.ts` | sursa canonică de slugs/ordine; CMS doar overlay |

**Auth DB:** nu există tabel de useri. Un singur parolă de mediu.

Dacă Supabase e paused/down: site-ul public cade pe catalogul static; adminul CMS și mesajele de contact nu mai persistă corect.

---

## Admin & Editor

### Admin

- **URL:** `/admin` (login: `/admin/login`)
- **Autentificare:** o parolă `ADMIN_PASSWORD`, comparată timing-safe în `POST /api/admin/auth`
- **Useri:** niciunul în DB. Nu e Supabase Auth.
- **Sesiune:** cookie httpOnly `admin_session`, token HMAC `v1.exp.nonce.sig`, 7 zile, semnat cu `ADMIN_SESSION_SECRET` (obligatoriu în production)
- **Cookie UI:** `ihuntev_logged_in=true` — **nu** autorizează API-ul
- **Protecție:** middleware pe `/admin/*` și `/api/admin/*` (exceptând auth/session/logout) + `assertSameOrigin` pe mutații

Ce poate edita:

| Zonă | Persistă în | După restart |
|------|-------------|--------------|
| Proiecte (CRUD, copertă, featured, SEO, video hover) | Supabase `projects` + Storage | Da, independent de cPanel |
| Setări (logo, meniuri, contact, analytics, hero) | Supabase `settings` | Da |
| Mesaje contact | Supabase `messages` | Da |
| `/admin/pagini/homepage\|servicii\|despre` | **stub-uri** (instrucțiuni, nu CMS) | N/A |

Depinde de: **Supabase + API routes + cookie session**. Nu de localStorage pentru date. Nu de Server Actions.

### Editor vizual (inline pe site)

- Se încarcă `public/editor.js` doar dacă `admin_session` e valid (`VisualEditorLoader`)
- Citește/scrie `GET/POST /api/content`
- Upload: `POST /api/content/upload` → disc `public/uploads/` (sau `/tmp` dacă `VERCEL=1`)
- Date: sql.js (`page_content`, `media`) pe filesystem

**Persistență editor după deploy/restart:**

| Host | Persistă? |
|------|-----------|
| cPanel/VPS cu `data/` + `public/uploads/` persistente | Da |
| Vercel (ephemeral `/tmp`) | **Nu** — se pierde la cold start |
| Redeploy care șterge `data/` sau `public/uploads/` | **Nu** |

Există și un server Express opțional `visual-editor/server/` (port 4001). **Nu e necesar** în producție: Next deja expune aceleași API-uri.

---

## Image Storage

Trei canale separate:

### 1. Catalog / site (Git)

- `public/projects/` — ~686 webp, **~70 MB**, servite de Next ca fișiere statice
- `public/brand/` — logo + poze atelier servicii
- `public/images-scraped/` — **~214 MB**, folosit încă pentru logo-uri furnizori, legale, `/frontpage-v2`
- `public/videos/` — hero

La redeploy: rămân, dacă folderul e pe server / în Git.

### 2. Upload admin proiecte → **Supabase Storage**

- API: `POST /api/admin/upload` (`runtime = "nodejs"`)
- Bucket public: `project-images`
- Imagini: Sharp → WebP, max ~1920px, URL public salvat în `projects.cover_image` / `projects.images`
- Video proiect: mp4/webm/mov, max 80 MB, același bucket
- Validare: MIME allowlist, fără SVG, re-encode Sharp

La redeploy cPanel: **nu dispar** (sunt în Supabase).

### 3. Upload editor vizual → **filesystem**

- API: `POST /api/content/upload`
- Destinație default: `public/uploads/`
- Pe Vercel: `/tmp/moodilier-uploads`
- URL salvat: `/uploads/{filename}` în SQLite editor

La redeploy / Vercel restart: **risc real să dispară**.

`next/image` (`/_next/image`) optimizează la runtime (AVIF/WebP, quality 75 și 90). Necesită **sharp** nativ pe Linuxul de producție.

---

## Video

| Path | Size | Folosit în | Git | Servit de Next |
|------|------|------------|-----|----------------|
| `public/videos/moodilier-vid-1.mp4` | 1.64 MB | Hero default (`site-settings`), frontpage-v2 | Da | Da, `/videos/...` |
| `public/videos/moodilier-vid-2.mp4` | 1.48 MB | Disponibil în folder; poster-2 e fallback în slider | Da | Da |
| `public/videos/0603(2).mp4` | 8.56 MB | **Nu e referit în `src/`** | **Da (tracked), deși e în `.gitignore`** | Da dacă e cerut direct |
| `public/videos/moodilier-vid-1.orig.mp4` | 94.68 MB | Master, nu e folosit în UI | Nu (`*.orig.mp4`) | Nu trebuie urcat |
| `public/videos/moodilier-vid-2.orig.mp4` | 97.77 MB | Master | Nu | Nu trebuie urcat |
| `uploads/Screen Recording 2026-06-05 101651.mp4` | 14.26 MB | Nu e în `src/` | Nu (`uploads/`) | Nu |

Niciun `.mov` / `.webm` / `.avi` în `public/` (doar mp4 + postere jpg/webp).

Video-urile de proiect (hover) vin din CMS ca URL (adesea Supabase Storage), nu din `public/videos/`.

---

## Large Files

Top fișiere din working tree, **exclus** `node_modules`, `.next`, `.git`:

| MB | Path | Tip | Necesar producție? |
|----|------|-----|-------------------|
| 97.77 | `public/videos/moodilier-vid-2.orig.mp4` | master video | Nu |
| 94.68 | `public/videos/moodilier-vid-1.orig.mp4` | master video | Nu |
| 14.26 | `uploads/Screen Recording … .mp4` | local | Nu |
| 8.56 | `public/videos/0603(2).mp4` | mp4 nefolosit în UI | Nu (ar trebui scos din Git) |
| 2.41–1.04 | `scripts/modificari-sept-2026-media/image*.png` | script assets | Nu pe runtime |
| 1.64 | `public/videos/moodilier-vid-1.mp4` | hero | Da |
| 1.48 | `public/videos/moodilier-vid-2.mp4` | hero alt | Opțional |
| ~1.03 | `public/images-scraped/.../DSC09496-HDR-1-1.png` | scraped | Parțial (folderul e folosit) |
| 0.60–0.32 | rest `images-scraped` + câteva `public/projects` | jpg/webp | Catalog da; scraped parțial |

Foldere:

| Folder | ~MB | Notă |
|--------|-----|------|
| `public/images-scraped` | 214 | Cel mai greu folder din Git; o parte e încă live |
| `public/videos` | 204 | Inclusiv orig ~193 MB care **nu** trebuie pe cPanel |
| `public/projects` | 70 | Necesar |
| `scripts` | 10.5 | Nu e necesar la runtime |

---

## Environment Variables

Doar **nume**. Nicio valoare.

### Runtime Node / hosting

| Variabilă | Unde | Obligatorie | Server/client |
|-----------|------|-------------|---------------|
| `NODE_ENV` | `app.js`, cookies, CSRF, next.config | Da (production) | server |
| `PORT` | `app.js` (Passenger) | Da pe cPanel | server |
| `HOSTNAME` | `app.js` | Opțională (default 127.0.0.1) | server |
| `VERCEL` | contact, visual-editor store, session, editor Express | Nu pe cPanel (nu o seta) | server |

### Supabase

| Variabilă | Unde | Obligatorie | Server/client |
|-----------|------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `src/lib/supabase.ts` | Da pentru CMS | **client-bundled** (prefix NEXT_PUBLIC) dar fișierul e importat doar din server code |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | idem | Da | aceeași notă |
| `SUPABASE_SERVICE_ROLE_KEY` | idem, `supabaseAdmin` | Da (bypass RLS) | **server only** |

### Admin / lock

| Variabilă | Unde | Obligatorie | Server/client |
|-----------|------|-------------|---------------|
| `ADMIN_PASSWORD` | `/api/admin/auth` | Da în production | server |
| `ADMIN_SESSION_SECRET` | `admin-session.ts`, site-lock fallback | Da în production | server |
| `SITE_LOCK_FORCE` | `site-lock.ts` | Nu (doar preview privat) | server |
| `SITE_LOCK_PASSWORD` | idem | Dacă lock e on | server |
| `SITE_LOCK_SECRET` | idem | Opțională | server |

### SMTP / contact

| Variabilă | Unde | Obligatorie | Server/client |
|-----------|------|-------------|---------------|
| `SMTP_HOST` | `contact-mail.ts` | Pentru email | server |
| `SMTP_PORT` | idem | Pentru email | server |
| `SMTP_USER` | idem | Pentru email | server |
| `SMTP_PASS` | idem | Pentru email | server |
| `SMTP_FROM` | idem | Opțională | server |
| `CONTACT_AUTO_REPLY` | idem (`"0"` oprește) | Nu | server |
| `CONTACT_DRAPERII_EMAIL` | `contact-topic.ts` | Nu | server |
| `CONTACT_MOBILIER_EMAIL` | idem | Nu | server |
| `CONTACT_NOTIFY_EMAIL` | idem | Nu | server |

### Visual editor

| Variabilă | Unde | Obligatorie | Server/client |
|-----------|------|-------------|---------------|
| `VISUAL_EDITOR_DATA_DIR` | `visual-editor/store.ts` | Nu | server |
| `VISUAL_EDITOR_DB` | store + `visual-editor/server/db.js` | Nu | server |
| `VISUAL_EDITOR_UPLOADS` | store | Nu | server |
| `VISUAL_EDITOR_EPHEMERAL` | store | Nu | server |
| `VISUAL_EDITOR_PORT` | Express opțional | Nu | server |

### Altele

| Variabilă | Unde | Obligatorie | Server/client |
|-----------|------|-------------|---------------|
| `MOODILIER_DOWNLOAD_AUG` | `scripts/import-download-aug.mjs` | Nu (script import) | CLI |

`.env*` este în `.gitignore`. Nu există `.env.example` în repo (README îl menționează).

---

## Package.json

**Next.js:** 16.2.6  
**React:** 19.2.4  
**Node:** `engines.node >= 20`  
**Build bundler:** `next build --webpack` (nu Turbopack în producție)

### Scripts

| Script | Comandă | Rol |
|--------|---------|-----|
| `dev` | `next dev` | local |
| `build` | `next build --webpack` | producție (cel care trece local) |
| `build:cpanel` | `next build > build-cpanel.log 2>&1` | diagnostic; **fără `--webpack`** |
| `start` | `node app.js` | cPanel / producție |
| `lint` / `typecheck` / `test` | calitate | nu pe server |
| `import:projects` / `editor:*` | unelte | nu pe server |

### Dependencies (runtime)

| Pachet | Notă hosting |
|--------|----------------|
| `next`, `react`, `react-dom` | obligatorii |
| `@supabase/supabase-js` | obligatoriu CMS |
| `nodemailer` | email |
| **`sharp`** | **binar nativ Linux** — nu copia `node_modules` de pe Windows |
| `sql.js` | WASM, editor; OK pe Node |
| `gsap`, `lenis` | animații client, nu blochează hostul |
| `lucide-react` | iconițe |

### devDependencies

Tailwind 4, ESLint, TypeScript, types. Pe producție se pot omite (`npm ci --omit=dev`) **după** build.

**Grele / problematice pe shared hosting:** `sharp` (native), `next build` (spawnează multe procese Node — cauza `EAGAIN`), `sql.js` e acceptabil. Nimic de eliminat în acest audit.

---

## next.config.ts

Fișier unic: `next.config.ts`. Nu există `.js` / `.mjs`.

Setări:

- `devIndicators: false`
- `turbopack.root` (doar dev)
- `images`: AVIF/WebP, deviceSizes inclusiv 1440, `qualities: [75, 90]`, `minimumCacheTTL: 60`
- `remotePatterns`: moodilier.ro, moodilier.vercel.app, localhost, `*.supabase.co`
- `poweredByHeader: false`, `compress: true`
- `headers()`: CSP, HSTS, CORS API doar `https://moodilier.ro`, cache 1 an pe `/videos`, `/projects`, `/brand`
- **Fără** `output: 'standalone'`
- **Fără** `output: 'export'`
- **Fără** `experimental`
- **Fără** webpack custom (doar scriptul de build `--webpack`)
- **Fără** rewrites/redirects

`output: 'standalone'` **se poate adăuga** (nu e blocat de config). Vezi secțiunea 12: **nu se combină** cu `app.js` custom server.

---

## Funcții care cer Node (static export)

**Static export possible: NO**

Motive concrete din acest repo:

1. `(site)/layout.tsx` este `force-dynamic` + fetch Supabase la fiecare request  
2. 18 API routes (contact, admin, upload, editor, preview)  
3. `middleware.ts` (auth, lock, rate-limit)  
4. `next/image` optimizer (`/_next/image`) + sharp  
5. Cookies / sesiune admin  
6. SMTP  
7. `sitemap.ts` și `/llms.txt` citesc proiecte (fetch `no-store`)  
8. Filesystem writes (editor uploads, sqlite)  
9. `app.js` custom HTTP server  
10. Dynamic route `/proiecte/[slug]` cu date CMS  

Un export static ar pierde adminul, contactul, CMS-ul și imaginile optimizate.

---

## cPanel Compatibility

**Scor: 3 / 10** pentru „build + run pe același shared cPanel”.  
**Scor: 6 / 10** dacă build-ul se face **în altă parte** și pe cPanel rulează doar Node + artefact.

Avem deja:

- Application startup file: `app.js`
- `npm start` → `node app.js`
- Passenger: `listen("passenger")` dacă `PhusionPassenger` există
- Node 20 / 22 / 24: **20 este minimul**; 22 e rezonabil; 24 e ok dacă sharp are binary

`spawn node EAGAIN` = limita **nproc** (prea multe procese copil la `next build`). Nu se rezolvă „reparând” React. Shared CloudLinux taie de obicei build-ul Next 16.

### Răspunsuri cerute

**A. Putem face build local și urca rezultatul?**  
**DA**, cu condiții: build pe **Linux** (sau WSL), urci `package.json`, `.next/`, `public/`, `app.js`, `node_modules` instalat **pe server** (`npm ci --omit=dev`, **fără** `next build` pe cPanel) **sau** folosești standalone (B). `node_modules` de pe Windows + sharp = eșec.

**B. Putem folosi Next.js standalone?**  
**DA, ca plan**, dar **nu împreună cu `app.js`**. Documentația Next: standalone emite propriul `.next/standalone/server.js` și **nu trace-uiește custom server files**. Startup file pe cPanel ar deveni acel `server.js`, nu `app.js`.

**C. Avem nevoie obligatoriu de build pe server?**  
**NU.** Dimpotrivă: pe acest cPanel **nu trebuie** `next build`.

**D. Ce împiedică standalone?**  
Nu împiedică runtime-ul (admin/API/Supabase). Împiedică **reutilizarea `app.js`**. Editorul pe disc trebuie ca `data/` și `public/uploads/` să fie **în afara** folderului șters la fiecare upload. `sql.js` / `sharp` trebuie să intre în trace-ul standalone (de obicei da, sunt dependențe).

---

## Standalone Compatibility

**PARTIAL / YES-with-caveats**

Dacă se activează `output: 'standalone'` (în viitor, nu acum):

Build-ul ar genera:

- `.next/standalone/` — server minim + subset `node_modules`
- `.next/static/` — trebuie copiat în `standalone/.next/static`
- `public/` — trebuie copiat în `standalone/public`

Pe cPanel s-ar urca conținutul `standalone/` + copiile de mai sus.  
**Application startup file:** `server.js` (cel din standalone), **nu** `app.js`.  
`PORT` rămâne de la Passenger.

| Feature | Continuă? |
|---------|-----------|
| Admin + cookie session | Da |
| API routes | Da |
| Server Actions | N/A (nu există) |
| Supabase | Da, dacă env e setat la runtime (`NEXT_PUBLIC_*` sunt inlinate la **build**) |
| `next/image` | Da, dacă `sharp` e prezent în artefactul Linux |
| Editor sqlite / uploads | Da, dacă path-urile persistă pe disc |
| Middleware | Da pe self-host `next start` / standalone server |

`NEXT_PUBLIC_SUPABASE_*` se bake-uiesc la build: build-ul local trebuie făcut **cu aceleași public env** ca producția.

---

## Build Warnings

### 1. `middleware` deprecated → `proxy`

- **Severitate:** joasă (deprecation Next 16)  
- **Producție:** middleware-ul **rulează**  
- **Înainte de deploy cPanel:** nu e blocker  
- **Poate fi lăsat:** da, momentan  

### 2. `Can't resolve 'dns'` în `instrumentation.ts`

- **Severitate:** joasă; `register()` are try/catch  
- **Producție:** IPv4-first poate să **nu** se aplice; pe cPanel IPv4 e de obicei default  
- **Blocker deploy:** nu  
- **Poate fi lăsat:** da  

### 3. `/sitemap.xml` + fetch `no-store`

- **Severitate:** zgomot la `next build` (`DYNAMIC_SERVER_USAGE`)  
- **Producție:** sitemap-ul e ruta `ƒ` dinamică — la request funcționează  
- **Blocker:** nu (build tot exit 0)  
- **Poate fi lăsat:** da  

---

## Security (rapid)

| Punct | Stare |
|-------|--------|
| `SUPABASE_SERVICE_ROLE_KEY` | Folosit doar în importuri server (`api/`, `lib/` server). Nu în componente `"use client"`. |
| `NEXT_PUBLIC_*` | Expuse intenționat (anon). Anon + RLS trebuie să rămână restrictive în Supabase. |
| Admin | Un singur secret; fără 2FA; sesiune HMAC ok |
| `ihuntev_logged_in` | Nu e încredințat pentru write |
| API publice | `POST /api/contact` (same-origin + rate-limit); `GET /api/content` (citire map editor, fără secrets); `GET /api/preview/status` |
| API admin | Middleware + cookie |
| Upload | MIME, size, no SVG, Sharp re-encode (admin); editor similar |
| Storage | Bucket `project-images` e **public** (URL-uri de portofoliu) |
| `.env` | gitignored (`.env*`) |
| Placeholder JWT în `supabase.ts` | String dummy, nu un secret real |
| Rate-limit | In-memory, per proces — reset la restart |
| CSP | Permite încă `*.vercel.app` / vercel-scripts — cosmetic după mutare |

Nu afișa și nu copia chei în Git sau în documentația de pe server.

---

## Git / Deploy

`.gitignore` **exclude deja:** `node_modules/`, `.next/`, `.env*`, `src/data/db.json`, `public/uploads/*`, `uploads/`, `*.orig.mp4`, `public/videos/*.orig.mp4`, `public/videos/0603(2).mp4`.

`data/.gitignore` exclude sqlite-ul editorului.

**Probleme:**

1. `public/videos/0603(2).mp4` e în ignore **dar rămâne tracked** în Git (8.56 MB).  
2. `build-cpanel.log` **nu** e ignorat — un `npm run build:cpanel` local îl poate comite.  
3. `public/images-scraped` (~214 MB) e în Git și în clone-ul de producție.  
4. Masterele `.orig.mp4` sunt ignorate (bine) dar stau pe disc local (~193 MB) — nu le urca pe cPanel.

**Ar trebui excluse / ne-urcate pe hosting (fără a schimba acum `.gitignore`):**

- `.env`, `.next`, `node_modules` (se reinstalează pe Linux)
- `build-cpanel.log`
- `*.orig.mp4`, recording-uri din `uploads/`
- ideal `0603(2).mp4` dacă nu e folosit
- sqlite/json din `data/` (se creează pe server)

---

## Hosting Requirements

| Resursă | Minim realist pentru ACEST proiect |
|---------|-------------------------------------|
| Node | **20.x** (22 acceptabil) |
| RAM runtime | 512 MB–1 GB (Passenger + Next + sharp) |
| RAM **build** | 2–4 GB + multe procese → **nu pe shared nproc** |
| CPU | 1 vCPU runtime; build vrea mai mult |
| Disk | ~300 MB `public` util + `.next`; **evită** orig videos și tot scraped dacă nu e nevoie |
| Database | **Supabase cloud** (nu MySQL cPanel) |
| Persistent disk | **Da**, pentru `data/` + `public/uploads/` dacă folosești editorul vizual |
| Outbound | HTTPS către `*.supabase.co`; SMTP 587/465 (nu port 25) |
| Proces | Persistent `node` (Passenger / PM2 / systemd) |

---

## Recommended Deployment Options

Comparate pe **acest** cod (SSR + middleware + sharp + Supabase + `app.js` + eșec `next build` pe cPanel).

### 1. cPanel actual + build local / standalone

- **Dificultate:** mare  
- **Cost:** ce plătești deja pe cPanel  
- **Plus:** domeniul/mail rămân la host  
- **Minus:** `next build` pe server e mort (`EAGAIN`); `app.js` și standalone nu coexistă; trebuie Linux build + `npm ci` pe server **fără** rebuild; nproc/RAM slabe; sharp; clone Git greu (`images-scraped`)  
- **Verdict:** posibil ca **compromis**, nu ca flux confortabil  

### 2. Hostinger Node.js

- **Dificultate:** medie–mare  
- **Cost:** similar shared/VPS mic  
- **Plus:** UI Node, Git  
- **Minus:** aceleași limite shared (procese, RAM) apar des la `next build`; nu rezolvă arhitectura  
- **Verdict:** nu e o ieșire magică din `EAGAIN`  

### 3. VPS (2 GB RAM, Ubuntu, PM2 + nginx)

- **Dificultate:** medie  
- **Cost:** ~8–20 €/lună  
- **Plus:** `npm run build` chiar pe mașină; `app.js` sau standalone; disc persistent pentru editor; control SMTP/DNS  
- **Minus:** tu întreții OS, SSL, backup, update-uri  
- **Verdict:** **cea mai bună mutare „de pe Vercel pe hosting propriu”** pentru acest stack  

### 4. Vercel (starea actuală de producție)

- **Dificultate:** mică (deja merge)  
- **Cost:** Hobby/Pro; bandwidth imagini  
- **Plus:** Next 16 nativ; Image Optimization; env; fără `EAGAIN`; Supabase rămâne  
- **Minus:** editor vizual **nu persistă** (`/tmp`); vendor lock; cPanel mail e separat  
- **Verdict:** **cea mai potrivită operațional pentru codul de azi**, dacă editorul vizual nu e critic sau îl ții doar pe un disc persistent altundeva  

### 5. Railway

- **Dificultate:** mică–medie  
- **Cost:** pay-as-you-go, ușor peste Vercel Hobby la trafic + disc  
- **Plus:** Node persistent, disc volum pentru `data/` + uploads (avantaj vs Vercel pentru editor)  
- **Minus:** nu e cPanel; DNS separat; tot trebuie build (dar nproc e ok)  
- **Verdict:** bun dacă vrei **Node persistent + editor care nu se șterge**, fără să administrezi VPS  

---

## Final Recommendation

Pentru **Moodilier așa cum e construit acum** (App Router SSR, 18 API-uri, middleware, sharp, Supabase, catalog mare în `public/`, `app.js` pentru Passenger):

1. **Nu construi cu `next build` pe cPanel.** Eșecul `spawn node EAGAIN` se va repeta. Nu e un bug de site.
2. **Dacă prioritatea e site-ul live, adminul CMS și contactul:** rămâi pe **Vercel** (deja dovedit) + Supabase. Editorul vizual e singurul care suferă acolo.
3. **Dacă prioritatea e „totul pe hosting-ul meu” (mail + Node + editor persistent):** ia un **VPS 2 GB**, Node 20, `npm ci && npm run build && node app.js` (sau PM2). Asta e singura variantă care respectă și `app.js`, și build-ul greu, și `data/`.
4. **cPanel Node Selector** merită doar ca etapă temporară: **build local Linux / CI → urci artefactul → `npm ci --omit=dev` fără build pe server**, sau treci pe **standalone** și schimbi startup file-ul din `app.js` în `server.js`. Nu combina cele două. Nu te aștepta ca shared nproc să țină Next 16 build.
5. **Hostinger Node** nu schimbă fizica problemei. **Railway** e alternativa gestionată dacă vrei disc persistent fără VPS.

Recomandarea concretă: **păstrează producția pe Vercel până ai un VPS**; folosește cPanel doar pentru mail/DNS, nu pentru `next build`. Dacă trebuie neapărat Node pe cPanel săptămâna asta: **standalone build local + `server.js`**, nu `next build` pe selector.

---

*Audit only. Niciun fișier de aplicație nu a fost modificat în afara acestui raport.*
