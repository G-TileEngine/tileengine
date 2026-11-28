// Step 5c + Add ability. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s5c-add-ability/smoke.mjs . 8804
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8804"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s5c-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const shots = join(tmpdir(), "s5c-shots"); mkdirSync(shots, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/local/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const KNIGHT = "unit_01JDAN00000000000000000001";
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); const tiny = [];
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(shots, `${name}.png`) }); };
    const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? el.tagName} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).replace(/\s+/g, " ").slice(0, 240)); } };
    const lineAct = () => page.evaluate(() => [...document.querySelectorAll("[data-add]")].find((el) => (el.getAttribute("data-add") ?? "").includes("Line Shot"))?.getAttribute("data-act") ?? "");
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); 
    await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 });
    await tap(page, "s:cell:0,8"); await page.waitForFunction(() => document.querySelector(".sheet h2")?.textContent === "Knight · Your team", null, { timeout: 15000 });
    await tap(page, "s:edit"); await page.waitForFunction(() => document.querySelector('[data-act="g:open"]') !== null, null, { timeout: 15000 });
    await step("1 goals", async () => {
      await tap(page, "g:open"); await page.waitForFunction(() => document.querySelector('[data-sheet="goals"]') !== null, null, { timeout: 15000 });
      const titles = await page.evaluate(() => [...document.querySelectorAll("[data-goal]")].map((el) => el.getAttribute("data-goal")));
      const other = titles.indexOf("Other abilities"); if (!titles.includes("Attack") || (other !== -1 && other !== titles.length - 1)) throw new Error(titles.join("|"));
      await shot("01-goals"); tiny.push(...await big());
    });
    await step("2 diagrams", async () => {
      const act = await page.evaluate(() => document.querySelector('[data-goal="Attack"]')?.getAttribute("data-act") ?? ""); await tap(page, act);
      await page.waitForFunction(() => document.body.innerText.includes("Tap a card to add it with defaults") && document.querySelectorAll(".reach-grid span.on").length > 0, null, { timeout: 15000 });
      const grids = await page.evaluate(() => [...document.querySelectorAll("[data-add]")].map((el) => el.querySelectorAll(".reach-grid span.on").length));
      if (grids.length < 1 || grids.some((n) => n < 1)) throw new Error(grids.join("|"));
      await shot("02-cards"); tiny.push(...await big());
    });
    await step("3 add", async () => {
      const act = await lineAct(); if (act === "") throw new Error("no line shot"); await tap(page, act);
      await page.waitForFunction(() => document.querySelector('[data-knob="range"]') !== null && document.querySelector('[data-act="s:cell:0,8"] .star')?.textContent === "✦1", null, { timeout: 15000 });
      await page.locator(".reach-grid").scrollIntoViewIfNeeded(); await shot("03-panel");
    });
    await step("4 test aim", async () => {
      await tap(page, "a:shut"); await page.waitForFunction(() => document.querySelector('[data-act^="a:test:setup_"]') !== null, null, { timeout: 15000 });
      const act = await page.evaluate(() => [...document.querySelectorAll("[data-act]")].map((el) => el.getAttribute("data-act") ?? "").find((item) => item.startsWith("a:test:setup_")) ?? "");
      await tap(page, act); await page.waitForFunction(() => window.__play !== undefined, null, { timeout: 15000 });
      const live = await page.evaluate(() => { const play = window.__play, unit = play.world.units.get(play.selected); return { id: unit?.unitId, side: unit?.side, me: play.sides.me, aim: play.aimKind, phase: play.world.phases.battle }; });
      if (live.id !== KNIGHT || live.side !== live.me || live.aim !== "spell" || live.phase !== "targeting") throw new Error(JSON.stringify(live));
      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act^="a:drop:setup_"]') !== null, null, { timeout: 15000 });
    });
    await step("5 again", async () => {
      const drop = await page.evaluate(() => [...document.querySelectorAll("[data-act]")].map((el) => el.getAttribute("data-act") ?? "").find((item) => item.startsWith("a:drop:setup_")) ?? "");
      const before = await page.evaluate(() => window.__read()["catalogue/slice.json"]);
      await tap(page, drop); await page.waitForFunction(() => document.querySelector('[data-act="s:cell:0,8"] .star') === null, null, { timeout: 15000 });
      await tap(page, "g:open"); await page.waitForFunction(() => document.querySelector('[data-goal="Attack"]') !== null, null, { timeout: 15000 });
      const act = await page.evaluate(() => document.querySelector('[data-goal="Attack"]')?.getAttribute("data-act") ?? ""); await tap(page, act);
      await page.waitForFunction(() => [...document.querySelectorAll("[data-add]")].some((el) => (el.getAttribute("data-add") ?? "").includes("Line Shot")), null, { timeout: 15000 });
      const kept = await page.evaluate((text) => { const files = window.__read(); return files["catalogue/slice.json"] === text && Object.entries(files).some(([path, body]) => path.startsWith("setups/") && body.includes("line-shot")); }, before);
      if (!kept) throw new Error("pruned"); await tap(page, "g:back"); await page.waitForFunction(() => document.querySelector('[data-sheet="goals"]') !== null, null, { timeout: 15000 }); await tap(page, "g:close");
    });
    await step("6 offer", async () => {
      await page.evaluate((d) => { const proj = JSON.parse(window.__read()["project.json"]); proj.project.catalogueRev += d; window.__write("project.json", JSON.stringify(proj)); }, -1);
      await tap(page, "g:open"); await waitText(page, "New abilities are available. Update this project to use them?");
      await shot("04-offer"); tiny.push(...await big()); await tap(page, "g:update");
      await page.waitForFunction(() => document.querySelector('[data-sheet="offer"]') === null && document.querySelector('[data-act="g:open"]') !== null, null, { timeout: 15000 });
      await tap(page, "g:open"); await page.waitForFunction(() => document.querySelector('[data-goal="Attack"]') !== null, null, { timeout: 15000 });
    });
    await step("7 newer", async () => {
      await page.evaluate((d) => { const proj = JSON.parse(window.__read()["project.json"]); proj.project.catalogueRev += d; window.__write("project.json", JSON.stringify(proj)); }, 1);
      await waitText(page, "This project was made with a newer TileEngine. Update the app to add abilities.");
      const shown = await page.evaluate(() => document.querySelector('[data-act="g:open"]') !== null); if (shown) throw new Error("add shown");
      await shot("05-newer");
    });
    check(`8 targets @${width}`, tiny.length === 0, tiny.length === 0 ? "ok" : [...new Set(tiny)].join(" | "));
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
