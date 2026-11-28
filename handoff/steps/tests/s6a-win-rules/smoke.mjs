// Step 6a win rules. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s6a-win-rules/smoke.mjs . 8805
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8805"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s6a-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const shots = join(tmpdir(), "s6a-shots"); mkdirSync(shots, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name, exact = false) => { const btn = page.getByRole("button", { name, exact }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); const tiny = [];
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(shots, `${name}.png`) }); };
    const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? el.tagName} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
    const cover = async (sheet) => page.evaluate((sel) => { const toast = document.querySelector(".toast"), box = document.querySelector(sel); if (toast === null || box === null) return "missing"; const t = toast.getBoundingClientRect(); return [...box.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); if (b.width < 48 || b.height < 48) return false; return b.left < t.right && b.right > t.left && b.top < t.bottom && b.bottom > t.top; }).map((el) => el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? el.tagName).join("|"); }, sheet);
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).replace(/\s+/g, " ").slice(0, 240)); } };
    const wiped = () => page.evaluate(() => window.__docs?.win?.wipe);
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); 
    await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 });
    await step("1 rules on", async () => {
      await tap(page, "r:open"); await page.waitForFunction(() => document.body.innerText.includes("Default rule") && document.querySelector('[data-seg="k:toggle:wipe_wins"] [aria-pressed="true"]')?.textContent === "On", null, { timeout: 15000 });
      await shot("01-rules-on"); tiny.push(...await big());
    });
    await step("2 rules off", async () => {
      await tap(page, "k:toggle:wipe_wins"); await waitText(page, "With this off, nobody wins: Test plays until you leave."); await shot("02-rules-off"); tiny.push(...await big());
      if (width === 360) { await page.waitForFunction(() => document.querySelector(".toast.above") !== null, null, { timeout: 15000 }); const hit = await cover("[data-sheet=rules] .sheet"); if (hit !== "") throw new Error(`toast ${hit}`); await page.waitForFunction(() => document.querySelector(".toast") === null, null, { timeout: 15000 }); }
      await tap(page, "r:close"); await tap(page, "m:switch"); await tap(page, "stage:stage_01JDAS00000000000000000001"); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 });
      await tap(page, "r:open"); await page.waitForFunction(() => document.body.innerText.includes("This stage's rule") && document.querySelector('[data-seg="k:toggle:wipe_wins"] [aria-pressed="true"]')?.textContent === "Off", null, { timeout: 15000 });
    });
    await step("3 test off", async () => {
      await tap(page, "r:close"); await tap(page, "s:test"); await page.waitForFunction(() => window.__docs?.win?.wipe === false, null, { timeout: 15000 });
      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="r:open"]') !== null, null, { timeout: 15000 });
    });
    await step("4 reset", async () => {
      await tap(page, "r:open"); await tap(page, "r:reset"); await page.waitForFunction(() => document.querySelector('[data-seg="k:toggle:wipe_wins"] [aria-pressed="true"]')?.textContent === "On", null, { timeout: 15000 });
      await tap(page, "r:close"); await tap(page, "s:test"); await page.waitForFunction(() => window.__docs?.win?.wipe === true, null, { timeout: 15000 }); if (await wiped() !== true) throw new Error("wipe");
      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="s:cell:1,8"]') !== null, null, { timeout: 15000 });
    });
    await step("7 archer sheet", async () => {
      await tap(page, "s:cell:1,8"); await page.waitForFunction(() => (document.querySelector(".sheet h2")?.textContent ?? "").includes(" · ") && !document.body.innerText.includes("A unit stands here"), null, { timeout: 15000 });
      await shot("05-occupied"); tiny.push(...await big());
    });
    await step("8 editor", async () => {
      await tap(page, "s:edit"); await page.waitForFunction(() => document.querySelector('[aria-label="On your team: On"]') !== null, null, { timeout: 15000 });
      tiny.push(...await big()); if (width === 360) { await tap(page, "t:team"); await page.waitForFunction(() => document.querySelector(".toast.above") !== null, null, { timeout: 15000 }); const hit = await cover(".scrim .sheet"); if (hit !== "") throw new Error(`toast ${hit}`); await page.waitForFunction(() => document.querySelector(".toast") === null, null, { timeout: 15000 }); }
    });
    await step("5 empty hero", async () => {
      await tap(page, "u:back"); await tap(page, "m:menu"); await tap(page, "m:games"); await press(page, "New project"); await press(page, "Empty", true); await press(page, "Continue"); await press(page, "Create");
      await tap(page, "m:menu"); await tap(page, "m:units"); await tap(page, "u:add"); await page.locator("[data-unit]").fill("Hero"); await tap(page, "u:create");
      await page.waitForFunction(() => document.querySelector('[data-knob="unit_hp"]')?.value === "9" && document.querySelector('[aria-label="On your team: On"]')?.getAttribute("aria-pressed") === "false", null, { timeout: 15000 });
      await tap(page, "u:role"); await waitText(page, "Warrior (BTF)"); tiny.push(...await big()); await tap(page, "u:close");
      await page.locator('[aria-label="On your team: On"]').scrollIntoViewIfNeeded(); await shot("03-on-your-team"); tiny.push(...await big());
      await tap(page, "t:team"); await page.waitForFunction(() => { const files = window.__read(), gear = JSON.parse(files["project.json"]).project.loadout, id = gear.roster.at(-1); return gear.roster.length === 1 && gear.size === 1 && typeof id === "string" && String(files[`units/${id}.json`] ?? "").includes("Hero"); }, null, { timeout: 15000 });
    });
    await step("6 empty board", async () => {
      await tap(page, "u:back"); await tap(page, "m:close"); await page.waitForFunction(() => document.querySelector('[data-act="s:test"]') !== null, null, { timeout: 15000 });
      await tap(page, "s:test"); await waitText(page, "Place a unit on this stage to test it.");
      const board = await page.evaluate(() => document.querySelector("#board") !== null || document.querySelector("#app")?.hidden === true); if (board) throw new Error("board");
      await shot("04-empty-board");
    });
    check(`8 targets @${width}`, tiny.length === 0 && errs.length === 0, tiny.length === 0 ? "ok" : [...new Set(tiny)].join(" | "));
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
