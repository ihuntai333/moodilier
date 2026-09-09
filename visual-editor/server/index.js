/**
 * Moodilier Inline Visual Page Editor — Express API server (canonical)
 *
 * GET  /api/content         — public content map
 * POST /api/content         — bulk upsert (auth)
 * POST /api/content/upload  — media upload → /uploads (auth)
 * GET  /api/media           — media list (auth)
 *
 * Auth: cookie ihuntev_logged_in=true (also accepts admin_session)
 */
const path = require("path");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const {
  ensureDb,
  getContentMap,
  upsertContentBulk,
  insertMedia,
  listMedia,
  getUploadsDir,
  DB_PATH,
} = require("./db");
const { requireEditorAuth } = require("./middleware");

const PORT = Number(process.env.VISUAL_EDITOR_PORT || 4001);
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "4mb" }));

app.use("/uploads", express.static(getUploadsDir()));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, getUploadsDir()),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safe}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error("Doar imagini sunt permise."));
  },
});

app.get("/api/content", async (_req, res) => {
  try {
    await ensureDb();
    res.json(getContentMap());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la citirea conținutului." });
  }
});

app.post("/api/content", requireEditorAuth, async (req, res) => {
  try {
    await ensureDb();
    const items = Array.isArray(req.body) ? req.body : req.body?.items;
    if (!Array.isArray(items)) {
      return res
        .status(400)
        .json({ error: "Body trebuie să fie un array { key, value, type }[]." });
    }
    const result = upsertContentBulk(items);
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la salvare." });
  }
});

app.post("/api/content/upload", requireEditorAuth, (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || "Upload eșuat." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Lipsește fișierul." });
    }
    try {
      await ensureDb();
      const url = `/uploads/${req.file.filename}`;
      const row = insertMedia({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        relPath: path.join("uploads", req.file.filename).replace(/\\/g, "/"),
        url,
      });
      res.json({ ok: true, url: row.url, media: row });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Eroare la salvarea media." });
    }
  });
});

app.get("/api/media", requireEditorAuth, async (_req, res) => {
  try {
    await ensureDb();
    res.json(listMedia());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la listarea media." });
  }
});

app.get("/health", async (_req, res) => {
  try {
    await ensureDb();
    res.json({
      ok: true,
      service: "moodilier-visual-editor",
      db: DB_PATH,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err.message || err) });
  }
});

ensureDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[visual-editor] listening on http://localhost:${PORT}`);
      console.log(`[visual-editor] db → ${DB_PATH}`);
      console.log(`[visual-editor] uploads → ${getUploadsDir()}`);
    });
  })
  .catch((err) => {
    console.error("[visual-editor] failed to open DB", err);
    process.exit(1);
  });
