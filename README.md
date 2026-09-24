# Moodilier

Site Next.js pentru **Moodilier** — mobilier premium la comandă (București).

## Deploy — Hostinger

Producția e **Hostinger Node.js / Next.js** (Node 22), cu GitHub auto-deploy din `main`.

Acest proiect **nu** e export static. Are admin, API routes și date din **Supabase** (DB + Storage). Nu are nevoie de disc local persistent.

### Hostinger

1. Conectează repo-ul `ihuntai333/moodilier`, branch `main`.
2. Node.js **22**. Build: `npm run build`. Start: `npm start` (`next start`).
3. Environment variables din dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - (opțional) `SMTP_*` pentru notificări contact
   - (opțional preview privat) `SITE_LOCK_FORCE=1` + `SITE_LOCK_PASSWORD`
4. Leagă domeniul `moodilier.ro`.
5. În Admin → Setări: pune **GA4**, Search Console verification, Pixel.
6. În Google Search Console: submit `https://moodilier.ro/sitemap.xml`.

Site-ul este **public** — `/acces` e doar dacă activezi lock-ul de mai sus.

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Admin: `/admin/login` (parola din `ADMIN_PASSWORD`).

## Structură

```
src/app/(site)/     # site public
src/app/admin/      # panou admin
src/app/api/        # API
src/components/site # UI live
src/components/home # motion homepage
src/lib/            # projects, settings, supabase
src/styles/         # site.css + awards.css
```

## SEO & analytics

- `sitemap.xml`, `robots.txt`, metadata Open Graph, JSON-LD pe proiecte
- GA4 + Meta Pixel din Admin → Setări, încărcate **doar după consimțământ cookie**
- Cache ISR ~60s pe proiecte / setări
