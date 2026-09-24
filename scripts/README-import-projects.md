# Image optimizer (Moodilier)

Backend module for web-ready project photos.

## Library

`src/lib/optimize-image.ts`

- Presets: `cover` (1600px), `gallery` (1800px), `thumb` (640px), `logo`
- Output: WebP (or JPEG if smaller), EXIF-rotated
- Used by `/api/admin/upload`

## Import from DOWNLOAD AUG

```bash
npm run import:projects
```

Reads:

`C:\W O R K S P A C E\VG OTHERS\Moodilier\DOWNLOAD AUG`

Writes:

- `public/brand/logo-white.png`, `logo-dark.png`
- `public/projects/<slug>/*.webp` (max 16 imgs / project)
- `src/data/projects-aug.ts`
- `public/videos/moodilier-vid-*.mp4`

Override source path:

```bash
set MOODILIER_DOWNLOAD_AUG=D:\path\to\DOWNLOAD AUG
npm run import:projects
```
