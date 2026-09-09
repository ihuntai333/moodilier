import assert from "node:assert/strict";
import { describe, it } from "node:test";

function resolveContactTopic(raw) {
  const t = String(raw || "")
    .trim()
    .toLowerCase();
  if (
    t === "draperii" ||
    t === "fabrics" ||
    t === "perdele" ||
    t === "perdele-draperii"
  ) {
    return "draperii";
  }
  return "mobilier";
}

function resolveContactInbox(topic) {
  return topic === "draperii"
    ? "draperii@moodilier.com"
    : "ofertare@moodilier.com";
}

function validateContactInput(body, opts = {}) {
  const now = opts.now ?? Date.now();
  if (
    (body.website && String(body.website).trim()) ||
    (body.company && String(body.company).trim())
  ) {
    return { ok: true, spam: true };
  }
  const opened = Number(body._t);
  if (!Number.isFinite(opened)) return { ok: true, spam: true };
  const age = now - opened;
  if (age < 2000 || age > 2 * 60 * 60 * 1000) return { ok: true, spam: true };

  const nume = String(body.nume ?? "").trim();
  const email = String(body.email ?? "").trim();
  const telefon = String(body.telefon ?? "").trim();
  const mesaj = String(body.mesaj ?? "").trim();
  const topic = resolveContactTopic(body.topic);
  if (nume.length < 2) return { ok: false };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false };
  if (opts.requirePhone && telefon.length < 6) return { ok: false };
  if (mesaj.length < 10) return { ok: false };
  return { ok: true, spam: false, topic, email };
}

function isAllowedMediaUrl(raw) {
  const url = String(raw || "").trim();
  if (!url) return false;
  if (url.startsWith("/projects/") || url.startsWith("/uploads/")) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

describe("form lead routing", () => {
  it("sends mobilier to ofertare and draperii to draperii inbox", () => {
    assert.equal(resolveContactInbox(resolveContactTopic("mobilier")), "ofertare@moodilier.com");
    assert.equal(resolveContactInbox(resolveContactTopic("draperii")), "draperii@moodilier.com");
    assert.equal(resolveContactInbox(resolveContactTopic("fabrics")), "draperii@moodilier.com");
  });
});

describe("form validation (no missed real leads, drop bots)", () => {
  const now = 1_000_000;
  const valid = {
    nume: "Ana Pop",
    email: "ana@example.com",
    telefon: "0729555431",
    mesaj: "Vreau o ofertă pentru o bucătărie pe comandă.",
    _t: now - 5000,
    topic: "mobilier",
  };

  it("accepts a real lead", () => {
    const r = validateContactInput(valid, { now });
    assert.equal(r.ok && !r.spam, true);
    assert.equal(r.email, "ana@example.com");
  });

  it("keeps draperii topic", () => {
    const r = validateContactInput({ ...valid, topic: "draperii" }, { now });
    assert.equal(r.topic, "draperii");
  });

  it("silently drops honeypot", () => {
    const r = validateContactInput({ ...valid, website: "x" }, { now });
    assert.deepEqual(r, { ok: true, spam: true });
  });

  it("rejects invalid email", () => {
    assert.equal(validateContactInput({ ...valid, email: "x" }, { now }).ok, false);
  });
});

describe("cover / media allowlist", () => {
  it("allows project and supabase URLs", () => {
    assert.equal(isAllowedMediaUrl("/projects/villa-02/01.altele.cover.webp"), true);
    assert.equal(
      isAllowedMediaUrl("https://abc.supabase.co/storage/v1/object/public/x.webp"),
      true
    );
    assert.equal(isAllowedMediaUrl("https://evil.example/x.png"), false);
  });
});
