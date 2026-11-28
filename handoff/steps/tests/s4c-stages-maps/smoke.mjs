// Step 4c stages and maps. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s4c-stages-maps/smoke.mjs . 8801
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8801"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s4c-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const shots = join(tmpdir(), "s4c-shots"); mkdirSync(shots, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/local/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
const gone = (page, s) => page.waitForFunction((s) => !document.body.innerText.includes(s), s, { timeout: 15000 });
const MAP = "map_01JDAM00000000000000000001", DEMO = "stage_01JDAS00000000000000000001";
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); let id = ""; const sheetTiny = [];
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(shots, `${name}.png`) }); };
    const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? ""} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
    const open = async (act, mark) => { await tap(page, act); await page.waitForFunction((m) => document.querySelector(`[data-act="${m}"]`) !== null, mark, { timeout: 15000 }); sheetTiny.push(...await big()); };
    const drop = async () => { await tap(page, "r:apply"); await waitText(page, "will be removed"); sheetTiny.push(...await big()); };
    const step = async (name, fn) => { try { await fn(); const tiny = await big(); check(`${name} @${width}`, errs.length === 0 && tiny.length === 0, errs.length === 0 && tiny.length === 0 ? "ok" : [...errs, ...tiny].join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    const nudge = async (axis, from, to) => { const dir = to < from ? -1 : 1, label = axis === "c" ? "Columns" : "Rows"; for (let n = from; n !== to; n += dir) { await tap(page, `r:step:${axis}:${dir}`); await waitText(page, `${label} ${n + dir}`); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await waitText(page, "Demo stage"); await tap(page, "m:switch");
    await step("1 add", async () => {
      await shot("01-project"); await open("r:add", "r:new"); await shot("02-add"); await tap(page, "r:new");
      await page.waitForFunction(() => document.querySelectorAll(".cell").length === 1 && new URLSearchParams(location.search).get("stage") !== null, null, { timeout: 15000 });
      id = await page.evaluate(() => new URLSearchParams(location.search).get("stage") ?? "");
      const text = await page.evaluate(() => document.body.innerText); if (!text.includes("Stage 2") || id === "") throw new Error(text);
    });
    await step("2 rename", async () => {
      await tap(page, "m:switch"); await waitText(page, "Maps"); await open(`r:menu:stage:${id}`, "r:rename"); await open("r:rename", "r:save-name"); await shot("03-rename");
      await page.locator("[data-room]").fill("Upstairs"); await tap(page, "r:save-name");
      await page.waitForFunction((id) => document.body.innerText.includes("Upstairs") && new URLSearchParams(location.search).get("stage") === id, id, { timeout: 15000 });
    });
    await step("3 resize", async () => {
      await open(`r:menu:map:${MAP}`, "r:resize"); await open("r:resize", "r:apply"); await waitText(page, "Columns 6"); await nudge("c", 6, 4); await nudge("r", 9, 4); await drop();
      await waitText(page, "0,8"); await shot("04-resize"); await tap(page, "r:close"); await gone(page, "Resize anyway"); await tap(page, `stage:${DEMO}`);
      await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 }); await tap(page, "m:switch"); await waitText(page, "Maps");
      await open(`r:menu:map:${MAP}`, "r:resize"); await open("r:resize", "r:apply"); await nudge("c", 6, 4); await nudge("r", 9, 4); await drop();
      await tap(page, "r:anyway"); await waitText(page, "was outside the map and was removed"); await tap(page, `stage:${DEMO}`);
      await page.waitForFunction(() => document.querySelectorAll(".cell").length === 16, null, { timeout: 15000 }); await tap(page, "m:switch"); await waitText(page, "Maps");
    });
    await step("4 refuse map", async () => { await open(`r:menu:map:${MAP}`, "r:delete"); await tap(page, "r:delete"); await waitText(page, "Used by: Demo stage"); await shot("05-refuse"); await tap(page, "r:close"); });
    await step("5 test", async () => {
      await press(page, "Upstairs"); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 1, null, { timeout: 15000 }); await tap(page, "s:test");
      await waitText(page, "Place a unit on this stage to test it."); const held = await page.evaluate(() => ({ play: window.__play, from: new URLSearchParams(location.search).get("from"), stage: new URLSearchParams(location.search).get("stage") })); if (held.play !== undefined || held.from !== "stage" || held.stage !== id) throw new Error(JSON.stringify(held));
      await tap(page, "s:cell:0,0"); await waitText(page, "Your team start"); await tap(page, "s:place:spawn"); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:0,0"]')?.getAttribute("aria-label") ?? "").includes("You"), null, { timeout: 15000 }); await tap(page, "s:test");
      await page.waitForFunction((id) => new URLSearchParams(location.search).get("stage") === id && window.__play !== undefined && window.__play.world.grid.cols === 1 && window.__play.world.grid.rows === 1, id, { timeout: 15000 });
      await page.evaluate(() => window.__hud.hideBanner()); await shot("06-play"); await press(page, "Back to maker");
      await page.waitForFunction(() => document.querySelectorAll(".cell").length === 1, null, { timeout: 15000 });
    });
    await step("6 undo", async () => {
      await tap(page, "m:switch"); await waitText(page, "Upstairs"); await open(`r:menu:stage:${id}`, "r:delete"); await tap(page, "r:delete");
      await page.waitForFunction((id) => document.body.innerText.includes("Deleted · Undo") && document.querySelector(`[data-act="stage:${id}"]`) === null, id, { timeout: 15000 });
      await tap(page, "undo"); await page.waitForFunction((id) => document.querySelector(`[data-act="stage:${id}"]`) !== null, id, { timeout: 15000 });
    });
    await step("7 last stage", async () => {
      await open(`r:menu:stage:${id}`, "r:delete"); await tap(page, "r:delete");
      await page.waitForFunction((id) => document.querySelector(`[data-act="stage:${id}"]`) === null, id, { timeout: 15000 });
      await open(`r:menu:stage:${DEMO}`, "r:delete"); await tap(page, "r:delete"); await waitText(page, "A game needs at least one stage");
    });
    check(`8 targets @${width}`, sheetTiny.length === 0, sheetTiny.length === 0 ? "ok" : [...new Set(sheetTiny)].join(" | "));
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
