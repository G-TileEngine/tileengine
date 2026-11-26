// Step 11a2 ready sheet. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s11a2-ready-sheet/smoke.mjs . 8822 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8822", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), `s11a2-smoke-${REV}-`)); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
let hold = 0;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } const slow = path.includes("/play-stage/") && path.endsWith("/build.json"); if (slow && hold < 0) { rs.writeHead(404); rs.end("missing"); return; } try { const body = readFileSync(file); const send = () => { rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); }; if (slow && hold > 0) setTimeout(send, hold); else send(); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const got = await page.waitForFunction((act) => { const scrim = document.querySelector(".scrim"); const el = (scrim ?? document).querySelector(`[data-act="${act}"]`); if (!(el instanceof HTMLElement)) return null; if (scrim !== null && el.closest(".scrim") === null) return null; el.scrollIntoView({ block: "center", inline: "nearest" }); const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; const top = document.elementFromPoint(x, y); return top !== null && top.closest("[data-act]") === el ? { x, y } : null; }, act, { timeout: 15000 }); const pos = await got.jsonValue(); if (pos === null || typeof pos.x !== "number") throw new Error(`no ${act}`); await page.touchscreen.tap(pos.x, pos.y); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const stub = async (page, kind) => page.evaluate((kind) => { const set = (key, fn) => { try { navigator[key] = fn; } catch { Object.defineProperty(navigator, key, { configurable: true, writable: true, value: fn }); } }; if (kind === "off") set("canShare", () => false); if (kind === "on") { set("canShare", () => true); set("share", async (data) => { window.__share = data && data.files && data.files[0] ? data.files[0].name : ""; }); } if (kind === "abort") { window.__n = 0; set("canShare", () => true); set("share", async () => { window.__n += 1; throw new DOMException("dismissed", "AbortError"); }); } if (kind === "block") set("share", async () => { throw new DOMException("Sharing was blocked", "NotAllowedError"); }); }, kind);
try {
  const run = async (width) => {
    hold = 0;
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
    let id = "";
    await step("1 ready", async () => {
      await page.waitForFunction(() => document.querySelector('[data-act="build"]') !== null, null, { timeout: 15000 });
      id = await page.evaluate(() => JSON.parse(window.__read()["project.json"]).project.id); await stub(page, "off");
      const pending = page.waitForEvent("download", { timeout: 30000 }); await tap(page, "build"); const dl = await pending;
      if (dl.suggestedFilename() !== `${id}-game.zip`) throw new Error(dl.suggestedFilename());
      const sheet = await page.locator('[data-sheet="build"]').textContent();
      if (sheet === null || !sheet.includes(`Saved to Downloads as ${id}-game.zip. This is a web build`) || sheet.includes("unzip") || sheet.includes("index.html") || await page.locator('[data-act="build:share"]').count() !== 0 || await page.locator('[data-act="build:done"]').count() !== 1) throw new Error(sheet ?? "no sheet");
      await tap(page, "build:done"); await page.waitForFunction(() => document.querySelector('[data-sheet="build"]') === null, null, { timeout: 5000 });
    });
    await step("2 again", async () => {
      await stub(page, "on"); hold = -1; await tap(page, "build");
      await page.waitForFunction(() => { const s = document.querySelector('[data-sheet="build"]'); return s !== null && (s.textContent ?? "").includes("Couldn't build your game") && (s.textContent ?? "").includes("Can't build: build.json"); }, null, { timeout: 15000 });
      hold = 1500; const pending = page.waitForEvent("download", { timeout: 30000 }); await tap(page, "build");
      await page.waitForFunction(() => { const s = document.querySelector('[data-sheet="build"]'); const b = document.querySelector('[data-act="build"]'); return s === null && b instanceof HTMLButtonElement && b.disabled && (b.textContent ?? "").includes("Building"); }, null, { timeout: 1000 });
      const dl = await pending; if (dl.suggestedFilename() !== `${id}-game.zip`) throw new Error(dl.suggestedFilename());
      await page.waitForFunction(() => document.querySelector('[data-act="build:share"]') !== null, null, { timeout: 15000 });
      await tap(page, "build:share"); await page.waitForFunction((name) => window.__share === name, `${id}-game.zip`, { timeout: 5000 });
      await tap(page, "build:done"); await page.waitForFunction(() => document.querySelector('[data-sheet="build"]') === null, null, { timeout: 5000 }); hold = 0;
    });
    await step("3 share", async () => {
      await stub(page, "abort"); const pending = page.waitForEvent("download", { timeout: 30000 }); await tap(page, "build"); await pending;
      await page.waitForFunction(() => document.querySelector('[data-sheet="build"] h2')?.textContent === "Your game is ready", null, { timeout: 15000 });
      await tap(page, "build:share");
      await page.waitForFunction(() => (window.__n ?? 0) >= 1 && document.querySelector('[data-sheet="build"] h2')?.textContent === "Your game is ready" && !(document.querySelector('[data-sheet="build"]')?.textContent ?? "").includes("Couldn't build"), null, { timeout: 5000 });
      await stub(page, "block"); await tap(page, "build:share");
      await page.waitForFunction(() => { const s = document.querySelector('[data-sheet="build"]'); return s !== null && (s.textContent ?? "").includes("Couldn't build your game") && (s.textContent ?? "").includes("Sharing was blocked"); }, null, { timeout: 5000 });
      await tap(page, "build:done"); await page.waitForFunction(() => document.querySelector('[data-sheet="build"]') === null, null, { timeout: 5000 });
    });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
