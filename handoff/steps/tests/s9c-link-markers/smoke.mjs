// Step 09c link markers. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s9c-link-markers/smoke.mjs . 8814 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8814", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/baseline/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s9c-smoke-")); build(www, "0".repeat(40), root);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const out = join(root, `handback/step-09c-link-markers/${REV}`); mkdirSync(out, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const see = () => { const canvas = document.querySelector("#board"); if (!(canvas instanceof HTMLCanvasElement)) return null; const g = canvas.getContext("2d"); if (g === null) return null; const w = canvas.width, h = canvas.height, data = g.getImageData(0, 0, w, h).data; let n = 0, x0 = w, y0 = h, x1 = -1, y1 = -1; for (let y = 0, i = 0; y < h; y += 1) for (let x = 0; x < w; x += 1, i += 4) { const r = data[i] ?? 0, gr = data[i + 1] ?? 0, b = data[i + 2] ?? 0; if (b > r + 40 && b > gr + 20 && gr > r + 20 && b > 100 && r < 80) { n += 1; if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; } } if (n === 0 || x1 - x0 !== y1 - y0) return null; const bw = x1 - x0 + 1, rect = canvas.getBoundingClientRect(), sx = rect.width / w, sy = rect.height / h; return { n, x0, y0, bw, w, cx: rect.left + (x0 + bw / 2) * sx, cy: rect.top + (y0 + bw / 2) * sy }; };
const lights = (box) => { const canvas = document.querySelector("#board"); if (!(canvas instanceof HTMLCanvasElement)) return null; const g = canvas.getContext("2d"); if (g === null) return null; const data = g.getImageData(0, 0, canvas.width, canvas.height).data, cell = (cells) => { let c = 0; const xa = box.x0 + cells * box.bw, ya = box.y0; for (let y = ya; y < ya + box.bw; y += 1) for (let x = xa; x < xa + box.bw; x += 1) { const k = (y * box.w + x) * 4, r = data[k] ?? 0, gr = data[k + 1] ?? 0, b = data[k + 2] ?? 0; if (r > 120 && gr > 120 && b > 120) c += 1; } return c; }; return { stairs: cell(1), floor: cell(3) }; };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(out, name) }); };
    const quiet = () => errs.join(" | ") || "ok";
    await page.goto(`${origin}/?scene=shop`, { waitUntil: "load" });
    const hero = await page.waitForFunction(see, null, { timeout: 15000 }).then((h) => h.jsonValue());
    check(`1 hero @${width}`, hero !== null && hero.n > 0 && errs.length === 0, hero === null ? quiet() : `${hero.n}px ${quiet()}`);
    await shot("01-hero.png");
    const lit = hero === null ? null : await page.evaluate(lights, hero);
    check(`2 stairs @${width}`, lit !== null && lit.stairs > 20 && lit.floor === 0, lit === null ? "no hero" : `stairs ${lit.stairs} floor ${lit.floor}`);
    await shot("02-stairs.png");
    if (hero !== null) {
      await page.touchscreen.tap(hero.cx, hero.cy);
      const plate = await page.waitForFunction(() => document.querySelector("#who")?.textContent === "Hero" && document.querySelector("#hpText")?.textContent === "20/20", null, { timeout: 8000 }).then(() => page.evaluate(() => `${document.querySelector("#who")?.textContent ?? ""} ${document.querySelector("#hpText")?.textContent ?? ""}`)).catch((e) => String(e && e.message ? e.message : e));
      const still = await page.evaluate(lights, hero);
      check(`3 selected @${width}`, plate === "Hero 20/20" && still !== null && still.stairs > 20 && errs.length === 0, `${plate} stairs ${still === null ? "none" : still.stairs} ${quiet()}`);
      await shot("03-selected.png");
    } else check(`3 selected @${width}`, false, "no hero");
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
