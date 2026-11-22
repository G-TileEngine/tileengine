// Step 6d phone baseline. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s6d-baseline/smoke.mjs . 8808
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { dirname, extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8808"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/baseline/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s6d-smoke-")); build(join(www, "baseline-06c"), "0".repeat(40), root);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const num = (text, re) => { const m = re.exec(text); return m === null ? null : Number(m[1]); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = [], ext = [];
    page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    page.on("request", (r) => { const u = r.url(); if (!(u.startsWith(origin) || u.startsWith("data:") || u.startsWith("blob:"))) ext.push(u); });
    await page.goto(`${origin}/baseline-06c/`, { waitUntil: "load" });
    await page.waitForFunction(() => { const m = /of (\d+)/.exec(document.querySelector("#read")?.textContent ?? ""); return m !== null && Number(m[1]) >= 120; }, null, { timeout: 20000 });
    const text = await page.locator("#read").innerText(), board = await page.evaluate(() => { const c = document.querySelector("#board"); return { w: c instanceof HTMLCanvasElement ? c.width : 0, h: c instanceof HTMLCanvasElement ? c.height : 0, hud: document.querySelector("#hud") !== null }; });
    check(`1 board @${width}`, board.w > 0 && board.h > 0 && board.hud, `${board.w}x${board.h}`);
    const p50 = num(text, /frame ms p50 (\d+(?:\.\d+)?) p95/), p95 = num(text, /p95 (\d+(?:\.\d+)?) max/), max = num(text, /max (\d+(?:\.\d+)?)/);
    check(`2 frames @${width}`, p50 !== null && p95 !== null && max !== null && p50 > 0 && p50 <= p95 && p95 <= max, `${p50} ${p95} ${max}`);
    const d = num(text, /dropped \(>25 ms\) (\d+)/), b = num(text, /over 50 ms (\d+)/), n = num(text, /of (\d+)/);
    check(`3 dropped @${width}`, d !== null && b !== null && n !== null && n >= 120, `${d} ${b} of ${n}`);
    const mb = num(text, /canvas MB (\d+(?:\.\d+)?)/); check(`4 canvas @${width}`, mb !== null && mb > 0, String(mb));
    const heap = /heap MB peak (n\/a|\d+(?:\.\d+)?)/.exec(text); check(`5 heap @${width}`, heap !== null, heap === null ? "missing" : heap[1]);
    check(`6 gc @${width}`, text.trimEnd().endsWith("GC: n/a (browsers don't expose it)"), "line");
    check(`7 quiet @${width}`, errs.length === 0 && ext.length === 0, errs.concat(ext).join(" | ") || "ok");
    if (width === 390) { const shot = join(root, "handback/step-06d-baseline-page/r1/01-baseline.png"); mkdirSync(dirname(shot), { recursive: true }); await page.screenshot({ path: shot, scale: "css" }); }
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
