// Step 11a export. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s11a-export-mvp/smoke.mjs . 8818 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"; import { tmpdir } from "node:os"; import { dirname, extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8818", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const { unzipStore } = await import(pathToFileURL(join(root, "tools/export/zip.ts")).href);
const { shipped } = await import(pathToFileURL(join(root, "tools/export/game.ts")).href);
const www = mkdtempSync(join(tmpdir(), `s11a-maker-${REV}-`)), game = mkdtempSync(join(tmpdir(), `s11a-game-${REV}-`)); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8", ".png": "image/png" };
const listen = (dir, port) => new Promise((ok) => { const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(dir, "." + path); if (!file.startsWith(dir + sep) && file !== dir) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } }); srv.listen(port, "127.0.0.1", () => ok(srv)); });
const maker = await listen(www, Number(PORT)), play = await listen(game, Number(PORT) + 1);
const makerOrigin = `http://127.0.0.1:${PORT}`, gameOrigin = `http://127.0.0.1:${Number(PORT) + 1}`;
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const got = await page.waitForFunction((act) => { const el = document.querySelector(`[data-act="${act}"]`); if (!(el instanceof HTMLElement)) return null; if (document.querySelector(".scrim") !== null && el.closest(".scrim") === null) return null; el.scrollIntoView({ block: "center", inline: "nearest" }); const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; const top = document.elementFromPoint(x, y); return top !== null && top.closest("[data-act]") === el ? { x, y } : null; }, act, { timeout: 15000 }); const pos = await got.jsonValue(); if (pos === null || typeof pos.x !== "number") throw new Error(`no ${act}`); await page.touchscreen.tap(pos.x, pos.y); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    await page.goto(`${makerOrigin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await tap(page, "m:menu");
    let id = "", gp = null;
    await step("1 zip", async () => {
      await page.waitForFunction(() => document.querySelector('[data-act="build"]') !== null, null, { timeout: 15000 });
      id = await page.evaluate(() => JSON.parse(window.__read()["project.json"]).project.id);
      const pending = page.waitForEvent("download", { timeout: 30000 }); await tap(page, "build"); const dl = await pending;
      if (dl.suggestedFilename() !== `${id}-game.zip`) throw new Error(dl.suggestedFilename());
      const entries = unzipStore(new Uint8Array(readFileSync(await dl.path())));
      for (const entry of entries) { const dest = join(game, entry.name); mkdirSync(dirname(dest), { recursive: true }); writeFileSync(dest, entry.data); }
      const saved = await page.evaluate(() => Object.keys(window.__read())), copy = join(game, `w${width}.mjs`);
      writeFileSync(copy, readFileSync(join(game, "project/files.js"))); const mod = await import(pathToFileURL(copy).href);
      if (!entries.some((entry) => entry.name === "index.html") || !entries.some((entry) => entry.name === "build.json") || !entries.some((entry) => entry.name === "project/files.js") || Object.keys(mod.default).sort().join("\n") !== saved.filter(shipped).sort().join("\n")) throw new Error("zip shape");
    });
    await step("2 play", async () => {
      const off = [];
      gp = await ctx.newPage();
      gp.on("request", (rq) => { const u = rq.url(); if (u.startsWith(gameOrigin) || u.startsWith("data:") || u.startsWith("blob:")) return; off.push(u); });
      gp.on("pageerror", (e) => errs.push(String(e)));
      await gp.goto(`${gameOrigin}/index.html`, { waitUntil: "load" });
      await gp.waitForFunction((pid) => window.__play && window.__docs?.manifest?.project?.id === pid && document.querySelector("#back-maker") === null, id, { timeout: 15000 });
      if (off.length > 0) throw new Error(off[0]);
    });
    await step("3 win", async () => {
      if (gp === null) throw new Error("no game");
      await gp.evaluate(() => { window.__play.world.units.all().filter((u) => u.side === "wolves").forEach((u) => window.__play.world.units.remove(u.id)); });
      const end = gp.locator("#end"); await end.waitFor({ timeout: 15000 }); const box = await end.boundingBox(); if (box === null) throw new Error("end");
      await gp.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
      await gp.waitForFunction(() => window.__play.outcome === "win" && document.querySelector("#hud h2")?.textContent === "Victory", null, { timeout: 15000 });
    });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); maker.close(); play.close(); rmSync(www, { recursive: true, force: true }); rmSync(game, { recursive: true, force: true }); }
