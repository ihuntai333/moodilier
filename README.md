# Moodilier

Site Next.js pentru **Moodilier** — mobilier premium la comandă (București).

## Deploy — ce alegi

| Hosting | Compatibil? | Notă |
|---------|-------------|------|
| **Vercel** | Da — recomandat | Înlocuiește proiectul vechi, domeniu `moodilier.ro` |
| **VPS / Node** (`next start`) | Da | Node 20+, `npm run build && npm start` |
| **cPanel clasic (doar PHP/Apache)** | Nu | Nu rulează API, admin, SSR |

Acest proiect **nu** e export static. Are admin, API routes și date din Supabase.

### Acces public (go-live)

Site-ul este **public** — nu mai cere parolă pe `/acces`.

Lock-ul opțional pentru demo privat: setează pe Vercel Preview `SITE_LOCK_FORCE=1` + `SITE_LOCK_PASSWORD`. Pe Production lasă-le goale / șterse.

Dacă tot apare autentificare Vercel (pagină „Authentication Required”), în Vercel Dashboard → Project → **Settings → Deployment Protection** → dezactivează „Vercel Authentication” pentru Production.

### Preview rapid pe Vercel (client)

```bash
# din rădăcina proiectului (proiect deja linkat)
npx vercel --yes
# sau Production:
npx vercel --prod --yes
```

Trimite clientului: URL-ul generat + parola `SITE_LOCK_PASSWORD`.

### Vercel (peste site-ul vechi / go-live)

1. Push pe GitHub / conectează repo-ul în Vercel.
2. Environment variables (Production):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD` (obligatoriu — fără default)
   - Pentru preview privat: `SITE_LOCK_PASSWORD` + `SITE_LOCK_SECRET`
   - (opțional email) `SMTP_*` dacă folosești contact
3. Deploy → leagă domeniul `moodilier.ro` (DNS la Vercel).
4. Scoate `SITE_LOCK_PASSWORD` când site-ul e gata de public.
5. În Admin → Setări: pune **GA4**, Search Console verification, Pixel.
6. În Google Search Console: submit `https://moodilier.ro/sitemap.xml`.

### Node pe hosting (dacă ai Node pe cPanel / VPS)

```bash
npm ci
npm run build
npm start
```

Procesul trebuie să ruleze persistent (PM2 / systemd). Document root trebuie să pointeze la procesul Node, nu la `public/` static.

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
