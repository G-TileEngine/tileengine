// Step 5a units. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s5a-units/smoke.mjs . 8802
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8802"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s5a-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const shots = join(tmpdir(), "s5a-shots"); mkdirSync(shots, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/local/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
const WOLF = "unit_01JDAN00000000000000000004", KNIGHT = "unit_01JDAN00000000000000000001";
const NAMES = ["Knight", "Archer", "Cleric", "Wolf", "Villager", "Crate", "Merchant"];
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); const sheetTiny = []; let scout = "";
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(shots, `${name}.png`) }); };
    const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? ""} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
    const open = async (act, mark) => { await tap(page, act); await page.waitForFunction((m) => document.querySelector(`[data-act="${m}"]`) !== null, mark, { timeout: 15000 }); sheetTiny.push(...await big()); };
    const step = async (name, fn) => { try { await fn(); const tiny = await big(); check(`${name} @${width}`, errs.length === 0 && tiny.length === 0, errs.length === 0 && tiny.length === 0 ? "ok" : [...errs, ...tiny].join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    const setHp = async (n) => { await page.locator('[data-knob="unit_hp"]').evaluate((el, n) => { el.value = String(n); el.dispatchEvent(new Event("input", { bubbles: true })); }, n); await page.waitForFunction((n) => document.querySelector('[data-val="unit_hp"]')?.textContent === String(n), n, { timeout: 15000 }); };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await waitText(page, "Units");
    await step("1 units", async () => {
      await page.evaluate(() => { const h = [...document.querySelectorAll("h2")].find((n) => n.textContent === "Units"); h?.scrollIntoView({ block: "start" }); });
      const text = await page.evaluate(() => document.body.innerText); if (NAMES.some((name) => !text.includes(name)) || !text.includes("Add unit")) throw new Error(text);
      await shot("01-units"); sheetTiny.push(...await big());
    });
    await step("2 add", async () => {
      await open("u:add", "u:create"); await page.locator("[data-unit]").waitFor({ timeout: 15000 }); await shot("02-name");
      await page.locator("[data-unit]").fill("Scout"); await tap(page, "u:create");
      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Scout" && document.body.innerText.includes("Start from a role"), null, { timeout: 15000 });
      await shot("03-editor"); sheetTiny.push(...await big());
      await tap(page, "u:back"); await waitText(page, "Add unit");
      scout = await page.evaluate(() => [...document.querySelectorAll("[data-act]")].map((el) => el.getAttribute("data-act") ?? "").find((act) => act.startsWith("u:open:") && (document.querySelector(`[data-act="${act}"]`)?.textContent ?? "").includes("Scout")) ?? "");
      if (!scout.startsWith("u:open:unit_")) throw new Error(scout || "no scout");
      await tap(page, scout);
      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Scout", null, { timeout: 15000 });
    });
    await step("3 role", async () => {
      await open("u:role", "u:apply:btf-warrior"); await waitText(page, "Warrior (BTF)"); await shot("04-roles");
      await tap(page, "u:apply:btf-warrior");
      await page.waitForFunction(() => document.querySelector('[data-val="unit_hp"]')?.textContent === "9" && document.querySelector('[data-val="unit_atk"]')?.textContent === "1" && !document.body.innerText.includes("Same as army"), null, { timeout: 15000 });
    });
    await step("4 health", async () => {
      await setHp(12); await tap(page, "u:back"); await waitText(page, "Units"); await tap(page, scout); await page.waitForFunction(() => document.querySelector('[data-val="unit_hp"]')?.textContent === "12", null, { timeout: 15000 });
      await tap(page, "u:reset:unit_hp"); await waitText(page, "Same as army");
    });
    await step("5 delete", async () => {
      const id = scout.slice("u:open:".length); await tap(page, "u:back"); await waitText(page, "Units"); await open(`u:menu:${id}`, "u:delete"); await tap(page, "u:delete");
      await page.waitForFunction((id) => document.body.innerText.includes("Deleted · Undo") && document.querySelector(`[data-act="u:open:${id}"]`) === null, id, { timeout: 15000 });
      await tap(page, "undo"); await page.waitForFunction((id) => document.querySelector(`[data-act="u:open:${id}"]`) !== null, id, { timeout: 15000 });
    });
    await step("6 refuse", async () => {
      await open(`u:menu:${WOLF}`, "u:delete"); await tap(page, "u:delete"); await waitText(page, "Used by Demo stage. Remove it there first."); await shot("05-refuse"); sheetTiny.push(...await big()); await tap(page, "u:close");
      await open(`u:menu:${KNIGHT}`, "u:delete"); await tap(page, "u:delete"); await waitText(page, "Used in your team list. Remove it there first."); await tap(page, "u:close");
    });
    await step("7 reload", async () => {
      await page.reload({ waitUntil: "load" }); await waitText(page, "My game"); await press(page, "My game"); await waitText(page, "Units"); await tap(page, scout);
      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Scout" && document.body.innerText.includes("Same as army") && document.querySelector('[data-val="unit_hp"]')?.textContent === "9", null, { timeout: 15000 });
    });
    check(`8 targets @${width}`, sheetTiny.length === 0, sheetTiny.length === 0 ? "ok" : [...new Set(sheetTiny)].join(" | "));
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
