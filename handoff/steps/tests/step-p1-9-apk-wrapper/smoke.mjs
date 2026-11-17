// P1-9 kit-run browser smoke (the builder runs it; 0 repo lines): node smoke.mjs <worktree> [port] [shot.png]
// Env: PLAYWRIGHT_CORE = playwright-core package dir, CHROME = Chrome binary. Headless 390x844 and 360 wide @3x, touch.
// Serves the tools/apk --web (play-stage) www/ output statically. Exits 1 on any FAIL, any page error, or any request that is not this localhost origin.
// Checks: boot, HUD 44px targets, no sideways scroll, no page errors, no external http(s)/ws(s) requests.
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
const { buildWeb, networkUrls, playOnly } = await import(pathToFileURL(join(resolve(WT), "tools/apk/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "p19-smoke-www-"));
buildWeb(www, "0".repeat(40), resolve(WT));
const urls = networkUrls(www), extra = playOnly(www);
check("www has no network URL", urls.length === 0, urls.join(" | ") || "none");
check("www is play-only", extra.length === 0, extra.join(" | ") || "ok");
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((req, res) => {
  const raw = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const path = normalize(raw === "/" ? "/index.html" : raw);
  const file = resolve(www, "." + path);
  if (!file.startsWith(www + sep) && file !== www) { res.writeHead(403); res.end("no"); return; }
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
    await page.waitForFunction(() => window.__play !== undefined && window.__hud !== undefined, null, { timeout: 15000 });
    await page.waitForTimeout(600);
    const wide = await page.evaluate(() => document.documentElement.scrollWidth);
    check(`no sideways scroll at ${width}`, wide <= width, `scrollWidth ${wide}`);
    const hud = await page.evaluate(() => {
      const vis = [...document.querySelectorAll("button")].map((b) => { const s = getComputedStyle(b), q = b.getBoundingClientRect(); return { t: (b.textContent ?? "").trim(), w: Math.round(q.width), h: Math.round(q.height), show: s.display !== "none" && s.visibility !== "hidden" && q.width > 0 && q.height > 0, id: b.id }; });
      const shown = vis.filter((b) => b.show), small = shown.filter((b) => b.w < 44 || b.h < 44);
      return { shown: shown.map((b) => ({ t: b.t, w: b.w, h: b.h, id: b.id })), small, end: shown.some((b) => b.id === "end" || /end/i.test(b.t)), menu: shown.some((b) => b.id === "menu") };
    });
    check(`touch targets >= 44x44 at ${width}`, hud.small.length === 0 && hud.end && hud.menu, JSON.stringify(hud));
    check(`no page errors at ${width}`, errs.length === 0, errs.join(" | ") || "none");
    check(`no external request at ${width}`, ext.length === 0, ext.join(" | ") || "none");
    if (shot) await page.screenshot({ path: shot, fullPage: true });
    await ctx.close();
  };
  await run(390, 844, SHOT);
  await run(360, 844, null);
} finally {
  await browser.close();
  srv.close();
  rmSync(www, { recursive: true, force: true });
}
console.log(bad === 0 ? "SMOKE PASS" : `SMOKE FAIL (${bad})`); process.exit(bad === 0 ? 0 : 1);
