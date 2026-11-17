// P1-9 kit-run browser smoke (the builder runs it; 0 repo lines): node smoke.mjs <worktree> [port] [shot.png]
// Env: PLAYWRIGHT_CORE = playwright-core package dir, CHROME = Chrome binary. Headless 390x844 and 360 wide @3x, touch.
// Serves the tools/apk --web (play-stage) www/ output statically. Exits 1 on any FAIL, any page error, or any request that is not this localhost origin.
// Checks: boot, HUD 44px targets, no sideways scroll, the stage looks (every picture loads; torch lights drawn), no page errors, no external http(s)/ws(s) requests.
// r5: map row 0 is whole on the canvas and every point of it hits the canvas (a real tap lands) with the YOUR TURN banner up and dismissed;
// the release www (served at /rel/) has no window debug globals in its files or at run time and still draws. The dev www (`buildWeb(..., true)`) keeps them for these checks.
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join, normalize, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/usr/local/lib/pnpm/5/.pnpm/playwright-core@1.59.1/node_modules/playwright-core/";
const { chromium } = createRequire(PW.endsWith("/") ? PW : `${PW}/`)(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8796", SHOT = "smoke-p19-390x844.png"] = process.argv; let bad = 0;
const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [shot.png]"); process.exit(2); }
const { buildWeb, debugGlobals, networkUrls, playOnly } = await import(pathToFileURL(join(resolve(WT), "tools/apk/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "p19-smoke-www-")), rel = mkdtempSync(join(tmpdir(), "p19-smoke-rel-"));
buildWeb(www, "0".repeat(40), resolve(WT), true); buildWeb(rel, "0".repeat(40), resolve(WT));
const urls = networkUrls(rel), extra = playOnly(rel), dbg = debugGlobals(rel);
check("www has no network URL", urls.length === 0, urls.join(" | ") || "none");
check("www is play-only", extra.length === 0, extra.join(" | ") || "ok");
check("release www has no debug globals", dbg.length === 0 && debugGlobals(www).includes("tools/play-stage/page.js"), dbg.join(" | ") || "none (dev www keeps them)");
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((req, res) => {
  let raw = decodeURIComponent((req.url ?? "/").split("?")[0]), dir = www;
  if (raw === "/rel" || raw.startsWith("/rel/")) { dir = rel; raw = raw.slice(4) || "/"; }
  const path = normalize(raw === "/" ? "/index.html" : raw);
  const file = resolve(dir, "." + path);
  if (!file.startsWith(dir + sep) && file !== dir) { res.writeHead(403); res.end("no"); return; }
  try {
    const st = statSync(file);
    if (st.isDirectory()) { res.writeHead(301, { Location: path.endsWith("/") ? path + "index.html" : path + "/" }); res.end(); return; }
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream", "cache-control": "no-store" });
    res.end(readFileSync(file));
  } catch { res.writeHead(404); res.end("missing"); }
});
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox"] });
try {
  const run = async (width, height, shot) => {
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }), page = await ctx.newPage(), errs = [], ext = [];
    page.on("pageerror", (e) => errs.push(String(e)));
    page.on("console", (m) => { if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) errs.push(`console: ${m.text()}`); });
    page.on("request", (r) => { const u = r.url(); if (!(u.startsWith(origin) || u.startsWith("data:") || u.startsWith("blob:"))) ext.push(u); });
    page.on("response", (r) => { if (r.status() >= 400 && !r.url().endsWith("/favicon.ico")) errs.push(`http ${r.status()}: ${r.url()}`); });
    await page.goto(`${origin}/`, { waitUntil: "load" });
    await page.waitForFunction(() => window.__play !== undefined && window.__hud !== undefined && window.__driver.stats.draws > 0, null, { timeout: 15000 });
    const probe = async (label, want) => {
      // The camera is reset to the top-left (as seated at boot) so row 0 is in view; the tap is on the empty cell (0,0).
      const wait = page.evaluate(() => new Promise((ok) => { const c = document.querySelector("#board"), on = () => { c.removeEventListener("pointerdown", on); ok(true); }; c.addEventListener("pointerdown", on); setTimeout(() => ok(false), 1500); }));
      await page.evaluate(() => { window.__play.followId = null; Object.assign(window.__cam, { x: 0, y: 0, follow: null }); });
      await page.waitForTimeout(100);
      const at = await page.evaluate(() => {
        // Geometry from the driver's real backing store (canvas.width / clientWidth), not devicePixelRatio: headless Chrome reports the
        // device-pixel-content-box in CSS px under an emulated scale factor, so the backing can be 1x there and 3x on a phone.
        const c = document.querySelector("#board"), b = c.getBoundingClientRect(), k = c.width / c.clientWidth, cam = window.__cam, play = window.__play, tile = play.scene().tileW, cols = play.world.grid.cols;
        const devW = c.width, devH = c.height, s = cam.s, padX = Math.floor((devW - Math.floor(devW / s) * s) / 2), padY = Math.floor((devH - Math.floor(devH / s) * s) / 2), cell = (tile * s) / k;
        const y0 = b.top + (padY - cam.y * s) / k, bad = [];
        if (y0 < b.top - 0.5 || y0 + cell > b.bottom + 0.5) bad.push(`row 0 spans ${Math.round(y0)}-${Math.round(y0 + cell)} outside the canvas ${Math.round(b.top)}-${Math.round(b.bottom)}`);
        let shown = 0;
        for (let col = 0; col < cols; col += 1) {
          const x0 = b.left + (padX + (col * tile - cam.x) * s) / k, xa = Math.max(x0, b.left), xb = Math.min(x0 + cell, b.right);
          if (xb - xa < 4) continue; shown += 1;
          for (const [x, y] of [[xa + 2, y0 + 2], [xb - 2, y0 + 2], [(xa + xb) / 2, y0 + cell / 2], [xa + 2, y0 + cell - 2], [xb - 2, y0 + cell - 2]]) { const hit = document.elementFromPoint(x, y); if (hit !== c) bad.push(`col ${col} (${Math.round(x)},${Math.round(y)}) hits ${hit === null ? "nothing" : hit.id || hit.tagName}`); }
        }
        if (shown === 0) bad.push("no row 0 cell on screen");
        // Covered also counts click-through chrome: no visible HUD part (top bar, banner, plate, buttons) may overlap row 0.
        const row = { l: b.left, r: b.right, t: y0, b: y0 + cell };
        for (const el of document.querySelectorAll("#top, #banner, #plate, #row button, #bubble")) {
          const q = el.getBoundingClientRect(), st = getComputedStyle(el);
          if (st.display === "none" || st.visibility === "hidden" || q.width === 0 || q.height === 0) continue;
          if (q.left < row.r && q.right > row.l && q.top < row.b && q.bottom > row.t) bad.push(`#${el.id || el.tagName} covers row 0 (${Math.round(q.top)}-${Math.round(q.bottom)})`);
        }
        const banner = document.querySelector("#banner"), up = banner !== null && getComputedStyle(banner).display !== "none";
        return { up, rowTop: Math.round(y0), rowBottom: Math.round(y0 + cell), canvasTop: Math.round(b.top), cols: shown, backing: k, tap: [b.left + (padX - cam.x * s) / k + Math.min(cell, b.width) / 2, y0 + cell / 2], bad };
      });
      await page.touchscreen.tap(at.tap[0], at.tap[1]);
      const tapped = await wait;
      check(`map row 0 whole and tappable, banner ${label} at ${width}`, at.up === want && at.bad.length === 0 && tapped, JSON.stringify({ banner: at.up ? "up" : "dismissed", rowTop: at.rowTop, rowBottom: at.rowBottom, canvasTop: at.canvasTop, cols: at.cols, backing: at.backing, tapped, bad: at.bad.slice(0, 4) }));
    };
    await probe("up", true);
    await page.evaluate(() => window.__hud.hideBanner());
    await probe("dismissed", false);
    await page.waitForTimeout(600);
    const wide = await page.evaluate(() => document.documentElement.scrollWidth);
    check(`no sideways scroll at ${width}`, wide <= width, `scrollWidth ${wide}`);
    const hud = await page.evaluate(() => {
      const vis = [...document.querySelectorAll("button")].map((b) => { const s = getComputedStyle(b), q = b.getBoundingClientRect(); return { t: (b.textContent ?? "").trim(), w: Math.round(q.width), h: Math.round(q.height), show: s.display !== "none" && s.visibility !== "hidden" && q.width > 0 && q.height > 0, id: b.id }; });
      const shown = vis.filter((b) => b.show), small = shown.filter((b) => b.w < 44 || b.h < 44);
      return { shown: shown.map((b) => ({ t: b.t, w: b.w, h: b.h, id: b.id })), small, end: shown.some((b) => b.id === "end" || /end/i.test(b.t)), menu: shown.some((b) => b.id === "menu") };
    });
    check(`touch targets >= 44x44 at ${width}`, hud.small.length === 0 && hud.end && hud.menu, JSON.stringify(hud));
    const looks = await page.evaluate(() => { const d = window.__driver; return { failed: d.stats.failed, errors: d.stats.errors, missing: d.backend.stats.missing, lightBuilds: d.backend.stats.lightBuilds, draws: d.stats.draws }; });
    check(`stage looks load and torches draw at ${width}`, looks.failed === 0 && looks.errors === 0 && looks.missing === false && looks.lightBuilds > 0 && looks.draws > 0, JSON.stringify(looks));
    check(`no page errors at ${width}`, errs.length === 0, errs.join(" | ") || "none");
    check(`no external request at ${width}`, ext.length === 0, ext.join(" | ") || "none");
    if (shot) await page.screenshot({ path: shot, fullPage: true });
    await ctx.close();
  };
  await run(390, 844, SHOT);
  await run(360, 844, null);
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }), page = await ctx.newPage(), errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  await page.goto(`${origin}/rel/`, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  const live = await page.evaluate(() => { const c = document.querySelector("#board"); return { globals: ["__play", "__driver", "__cam", "__hud", "__fx", "__link"].filter((k) => k in window), w: c.width, h: c.height, hud: document.querySelector("#end") !== null }; });
  check("release www runs with no debug globals at 390", live.globals.length === 0 && live.w > 0 && live.h > 0 && live.hud && errs.length === 0, JSON.stringify({ ...live, errors: errs.length }));
  await ctx.close();
} finally {
  await browser.close();
  srv.close();
  rmSync(www, { recursive: true, force: true }); rmSync(rel, { recursive: true, force: true });
}
console.log(bad === 0 ? "SMOKE PASS" : `SMOKE FAIL (${bad})`); process.exit(bad === 0 ? 0 : 1);
