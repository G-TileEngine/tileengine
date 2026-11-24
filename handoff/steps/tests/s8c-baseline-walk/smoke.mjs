// Step 08c baseline walk. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s8c-baseline-walk/smoke.mjs . 8812 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8812", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/baseline/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s8c-smoke-")); build(www, "0".repeat(40), root);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const out = join(root, `handback/step-08c-baseline-walk/${REV}`); mkdirSync(out, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const heroFn = () => { const canvas = document.querySelector("#board"); if (!(canvas instanceof HTMLCanvasElement)) return null; const g = canvas.getContext("2d"); if (g === null) return null; const w = canvas.width, h = canvas.height, data = g.getImageData(0, 0, w, h).data; let n = 0, x0 = w, y0 = h, x1 = -1, y1 = -1; for (let y = 0, i = 0; y < h; y += 1) for (let x = 0; x < w; x += 1, i += 4) { const r = data[i] ?? 0, gr = data[i + 1] ?? 0, b = data[i + 2] ?? 0; if (b > r + 40 && b > gr + 20 && gr > r + 20 && b > 100 && r < 80) { n += 1; if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; } } if (n === 0 || x1 - x0 !== y1 - y0) return null; const rect = canvas.getBoundingClientRect(), bw = x1 - x0 + 1, sx = rect.width / w, sy = rect.height / h; return { n, cx: rect.left + (x0 + bw / 2) * sx, cy: rect.top + (y0 + (y1 - y0 + 1) / 2) * sy, cell: bw * sx, hook: Object.hasOwn(window, "__play") }; };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(out, name) }); };
    const quiet = () => errs.join(" | ") || "ok";
    await page.goto(`${origin}/?scene=shop`, { waitUntil: "load" });
    const hero = await page.waitForFunction(heroFn, null, { timeout: 15000 }).then(() => page.evaluate(heroFn));
    check(`1 shop hero @${width}`, hero !== null && hero.n > 0 && hero.hook === false && errs.length === 0, hero === null ? quiet() : `${hero.n}px hook ${hero.hook} ${quiet()}`);
    await shot("01-shop.png");
    if (hero !== null) {
      await page.touchscreen.tap(hero.cx, hero.cy);
      const plate = await page.waitForFunction(() => document.querySelector("#who")?.textContent === "Hero" && document.querySelector("#hpText")?.textContent === "20/20", null, { timeout: 8000 }).then(() => page.evaluate(() => `${document.querySelector("#who")?.textContent ?? ""} ${document.querySelector("#hpText")?.textContent ?? ""}`)).catch((e) => String(e && e.message ? e.message : e));
      check(`2 shop select @${width}`, plate === "Hero 20/20" && errs.length === 0, `${plate} ${quiet()}`);
      await shot("02-selected.png");
      await page.touchscreen.tap(hero.cx + hero.cell, hero.cy); await page.touchscreen.tap(hero.cx + hero.cell, hero.cy);
      const walked = await page.waitForFunction(() => { const t = document.querySelector("#read")?.textContent ?? ""; if (t.startsWith("DONE")) return false; const m = /worst ms in 3 frames after a swap (\d+(?:\.\d+)?)/.exec(t); return t.includes("stage changes 1") && m !== null && Number(m[1]) > 0; }, null, { timeout: 10000 }).then(() => true).catch(() => false);
      const read = await page.locator("#read").innerText();
      check(`3 shop walk @${width}`, walked && !read.startsWith("DONE") && errs.length === 0, `${read.split("\n").slice(-2).join(" | ")} ${quiet()}`);
      await shot("03-walked.png");
    } else check(`2 shop select @${width}`, false, "no hero"); if (hero === null) check(`3 shop walk @${width}`, false, "no hero");
    await page.goto(`${origin}/`, { waitUntil: "load" });
    const foe = await page.waitForFunction(heroFn, null, { timeout: 15000 }).then(() => page.evaluate(heroFn)).catch(() => null);
    if (foe !== null) { await page.touchscreen.tap(foe.cx, foe.cy); const plate = await page.waitForFunction(() => document.querySelector("#who")?.textContent === "Hero" && document.querySelector("#hpText")?.textContent === "20/20", null, { timeout: 8000 }).then(() => page.evaluate(() => `${document.querySelector("#who")?.textContent ?? ""} ${document.querySelector("#hpText")?.textContent ?? ""}`)).catch((e) => String(e && e.message ? e.message : e)); check(`4 skirmish @${width}`, foe.n > 0 && foe.hook === false && plate === "Hero 20/20" && errs.length === 0, `${foe.n}px ${plate} ${quiet()}`); await shot("04-skirmish.png"); }
    else check(`4 skirmish @${width}`, false, quiet());
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
