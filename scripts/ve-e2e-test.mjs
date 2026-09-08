/**
 * Local E2E smoke test for Inline Visual Page Editor.
 * Does not print secrets. Writes JSON results to stdout.
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const results = [];
const MARKER = `VE_E2E_${Date.now()}`;

function pass(name, detail = "") {
  results.push({ name, status: "PASS", detail });
  console.log(`PASS: ${name}${detail ? " — " + detail : ""}`);
}
function fail(name, detail = "") {
  results.push({ name, status: "FAIL", detail });
  console.log(`FAIL: ${name}${detail ? " — " + detail : ""}`);
}

function readAdminPassword() {
  const envPath = path.join(root, ".env.local");
  const text = fs.readFileSync(envPath, "utf8");
  const line = text.split(/\r?\n/).find((l) => l.startsWith("ADMIN_PASSWORD="));
  if (!line) throw new Error("ADMIN_PASSWORD missing in .env.local");
  return line.slice("ADMIN_PASSWORD=".length).trim().replace(/^["']|["']$/g, "");
}

async function main() {
  const password = readAdminPassword();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let saveStatus = null;
  page.on("response", async (res) => {
    try {
      if (res.url().includes("/api/content") && res.request().method() === "POST") {
        saveStatus = res.status();
      }
    } catch {
      /* ignore */
    }
  });

  // 1) Login
  await page.goto("http://localhost:3000/admin/login", { waitUntil: "networkidle" });
  await page.fill('input[type="password"]', password);
  await Promise.all([
    page.waitForURL((url) => {
      const p = url.pathname;
      return p.startsWith("/admin") && p !== "/admin/login";
    }, { timeout: 15000 }),
    page.click('button[type="submit"]'),
  ]);
  pass("admin_login", "logged in with ADMIN_PASSWORD from .env.local");

  // Confirm we are on admin dashboard (middleware requires admin_session)
  if (!page.url().includes("/admin/login")) {
    pass("admin_dashboard_reachable", page.url());
  } else {
    fail("admin_dashboard_reachable", "still on login — admin_session likely missing");
  }

  // 2) Session cookie via protected API (httpOnly) — use page.evaluate fetch to share document cookies
  const sessionCheck = await page.evaluate(async () => {
    const res = await fetch("/api/admin/session", { credentials: "same-origin" });
    const json = await res.json().catch(() => ({}));
    return { status: res.status, authenticated: json.authenticated === true };
  });
  const jarAfterLogin = await context.cookies();
  const hasSessionJar = jarAfterLogin.some(
    (c) => c.name === "admin_session" && c.value === "authenticated"
  );
  if (sessionCheck.authenticated || hasSessionJar) {
    pass(
      "admin_session_cookie",
      `authenticated=${sessionCheck.authenticated} jar=${hasSessionJar}`
    );
  } else {
    fail(
      "admin_session_cookie",
      `status=${sessionCheck.status} authenticated=${sessionCheck.authenticated} jar=${hasSessionJar}`
    );
  }

  // 3) Homepage toolbar + editor cookie (must be readable by editor.js)
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForSelector("#ve-toolbar", { timeout: 15000 });
  const toolbarTexts = await page.locator("#ve-toolbar").innerText();
  const needed = ["Edit Mode", "Salvează Tot", "Anulează", "Structură"];
  const missing = needed.filter((t) => !toolbarTexts.includes(t));
  if (missing.length === 0) pass("toolbar_visible", needed.join(", "));
  else fail("toolbar_visible", `missing: ${missing.join(", ")}`);

  const editorCookieMeta = await page.evaluate(() => {
    const visible = document.cookie.split(";").some((c) => c.trim() === "ihuntev_logged_in=true");
    return { visible };
  });
  const jar = await context.cookies();
  const editorJar = jar.find((c) => c.name === "ihuntev_logged_in");
  if (editorCookieMeta.visible && editorJar?.value === "true") {
    pass(
      "editor_cookie",
      `document.cookie ok; httpOnly=${editorJar.httpOnly} secure=${editorJar.secure}`
    );
  } else if (editorCookieMeta.visible) {
    pass("editor_cookie", "ihuntev_logged_in=true in document.cookie");
  } else if (editorJar) {
    fail(
      "editor_cookie",
      `in jar but not document.cookie (httpOnly=${editorJar.httpOnly}) — editor.js cannot read it`
    );
  } else {
    fail(
      "editor_cookie",
      "missing from document.cookie and jar (toolbar should not appear)"
    );
  }

  // 4) Edit mode highlights
  await page.click("#ve-btn-edit");
  await page.waitForTimeout(400);
  const editMode = await page.evaluate(() => document.body.classList.contains("ve-edit-mode"));
  const editableCount = await page.locator("[data-editable]").count();
  const outlined = await page.evaluate(() => {
    const el = document.querySelector("[data-editable]");
    if (!el) return false;
    const outline = getComputedStyle(el).outlineStyle;
    return outline === "dashed" || outline.includes("dashed");
  });
  if (editMode && editableCount > 0 && outlined) {
    pass("edit_mode_highlights", `${editableCount} data-editable elements, dashed outline`);
  } else {
    fail(
      "edit_mode_highlights",
      `editMode=${editMode} count=${editableCount} outlined=${outlined}`
    );
  }

  // 5) Text change + unsaved badge
  const target = page.locator('[data-key="home.about.label"][data-editable="text"]').first();
  await target.waitFor({ state: "visible", timeout: 10000 });
  const original = (await target.innerText()).trim();
  await target.click();
  await page.waitForTimeout(200);
  // contenteditable may be enabled on click
  await page.evaluate(
    ({ key, marker }) => {
      const el = document.querySelector(`[data-key="${key}"][data-editable="text"]`);
      if (!el) throw new Error("target missing");
      el.focus();
      el.textContent = marker;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("blur", { bubbles: true }));
    },
    { key: "home.about.label", marker: MARKER }
  );
  await page.waitForTimeout(500);
  const badgeHidden = await page.locator("#ve-unsaved").getAttribute("hidden");
  const badgeText = (await page.locator("#ve-unsaved").innerText()).trim();
  const badgeCount = Number(badgeText || "0");
  if (badgeHidden === null && badgeCount >= 1) {
    pass("unsaved_badge", `badge=${badgeCount}`);
  } else {
    // retry via typing API if programmatic set didn't register
    await target.click({ clickCount: 3 });
    await page.keyboard.type(MARKER);
    await page.keyboard.press("Tab");
    await page.waitForTimeout(500);
    const badge2 = (await page.locator("#ve-unsaved").innerText()).trim();
    const hidden2 = await page.locator("#ve-unsaved").getAttribute("hidden");
    if (hidden2 === null && Number(badge2) >= 1) {
      pass("unsaved_badge", `badge=${badge2} (via typing)`);
    } else {
      fail("unsaved_badge", `badgeText=${badgeText}|${badge2} hidden=${badgeHidden}|${hidden2}`);
    }
  }

  // 6) Save
  saveStatus = null;
  await page.click("#ve-btn-save");
  await page.waitForTimeout(1500);
  const toastOk = await page.evaluate(() => {
    const t = document.body.innerText;
    return /salvat|success|ok|reuşit|reușit|salvate/i.test(t);
  });
  // Also check toast element if present
  const toastVisible = await page.locator(".ve-toast, #ve-toast, [class*='toast']").count();
  if (saveStatus === 200) pass("save_post", "POST /api/content 200");
  else fail("save_post", `POST /api/content status=${saveStatus}`);
  if (toastOk || toastVisible > 0) pass("save_toast", toastOk ? "success text present" : "toast element present");
  else {
    // soft: some UIs only clear badge
    const afterBadge = await page.locator("#ve-unsaved").getAttribute("hidden");
    if (afterBadge !== null || (await page.locator("#ve-unsaved").innerText()).trim() === "0") {
      pass("save_toast", "badge cleared (toast text not found)");
    } else fail("save_toast", "no success toast detected");
  }

  // 7) Persist after reload
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForSelector("#ve-toolbar", { timeout: 15000 });
  const persisted = await page.evaluate((marker) => {
    const el = document.querySelector('[data-key="home.about.label"]');
    return el ? el.textContent.trim() : null;
  }, MARKER);
  if (persisted === MARKER) pass("persist_reload", `home.about.label === ${MARKER}`);
  else fail("persist_reload", `expected ${MARKER}, got ${JSON.stringify(persisted)}`);

  // 8) Optional Cancel / Structure
  await page.click("#ve-btn-edit");
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    const el = document.querySelector('[data-key="home.about.label"][data-editable="text"]');
    if (el) {
      el.textContent = "TEMP_CANCEL_TEST";
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("blur", { bubbles: true }));
    }
  });
  await page.waitForTimeout(300);
  await page.click("#ve-btn-cancel");
  await page.waitForTimeout(400);
  const afterCancel = await page.evaluate(() => {
    const el = document.querySelector('[data-key="home.about.label"]');
    return el ? el.textContent.trim() : null;
  });
  if (afterCancel === MARKER || afterCancel === original) {
    pass("cancel_reverts", `text=${afterCancel}`);
  } else {
    // Cancel may reload from API content (MARKER) which is fine
    fail("cancel_reverts", `unexpected text=${JSON.stringify(afterCancel)}`);
  }

  await page.click("#ve-btn-structure");
  await page.waitForTimeout(400);
  const structureVisible = await page.locator("#ve-structure, #ve-structure-list, .ve-structure").count();
  const structureText = await page.evaluate(() => document.body.innerText.includes("Structură"));
  if (structureVisible > 0 || structureText) pass("structure_sidebar", "opened");
  else fail("structure_sidebar", "not found");

  // Restore original label to avoid leaving test pollution if original known
  if (original && original !== MARKER) {
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.waitForSelector("#ve-toolbar");
    await page.click("#ve-btn-edit");
    await page.evaluate(
      ({ key, text }) => {
        const el = document.querySelector(`[data-key="${key}"][data-editable="text"]`);
        if (!el) return;
        el.textContent = text;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("blur", { bubbles: true }));
      },
      { key: "home.about.label", text: original }
    );
    await page.click("#ve-btn-save");
    await page.waitForTimeout(1000);
    pass("cleanup_restore", `restored original label`);
  }

  await browser.close();

  const failed = results.filter((r) => r.status === "FAIL");
  console.log("\n=== SUMMARY ===");
  console.log(`passed=${results.filter((r) => r.status === "PASS").length} failed=${failed.length}`);
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error("FATAL:", err.message);
  process.exit(2);
});
