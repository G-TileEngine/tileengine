// Step 5b abilities. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s5b-abilities/smoke.mjs . 8803
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8803"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s5b-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const shots = join(tmpdir(), "s5b-shots"); mkdirSync(shots, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/local/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const ARCHER = "unit_01JDAN00000000000000000002", LINE = "setup_01JDAT00000000000000000005";
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); const tiny = [];
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(shots, `${name}.png`) }); };
    const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? el.tagName} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage");
    await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 });
    await step("1 sheet", async () => {
      await tap(page, "s:cell:1,8"); await page.waitForFunction(() => document.querySelector(".sheet h2")?.textContent === "Archer · Your team", null, { timeout: 15000 });
      const got = await page.evaluate(() => [...document.querySelectorAll(".sheet button")].map((b) => b.textContent));
      if (["Edit", "Move", "Delete", "Test"].some((name) => !got.includes(name))) throw new Error(got.join("|"));
      await shot("01-unit-sheet"); tiny.push(...await big());
    });
    await step("2 list", async () => {
      await tap(page, "s:edit"); await page.waitForFunction(() => document.body.innerText.includes("Basic Attack (reach and damage)") && document.body.innerText.includes("Line Shot (stops on first hit)"), null, { timeout: 15000 });
      const got = await page.evaluate((line) => { const card = document.querySelector(`[data-act="a:open:${line}"]`)?.closest(".card"); const acts = [...(card?.querySelectorAll("[data-act]") ?? [])].map((el) => el.getAttribute("data-act")); return { acts, star: document.querySelector('[data-act="s:cell:1,8"] .star')?.textContent }; }, LINE);
      if (!got.acts.includes(`a:test:${LINE}`) || !got.acts.some((act) => act?.startsWith("a:drop:")) || got.star !== "✦2") throw new Error(JSON.stringify(got));
      await shot("02-ability-list"); tiny.push(...await big());
    });
    await step("3 range", async () => {
      await tap(page, `a:open:${LINE}`);
      await page.waitForFunction(() => [...document.querySelectorAll(".ability summary")].map((n) => n.textContent).join("|") === "Which directions, and how far?|How much damage, and what kind of hit?", null, { timeout: 15000 });
      const knobs = await page.evaluate(() => [...document.querySelectorAll(".ability [data-knob]")].map((el) => el.getAttribute("data-knob")));
      if (knobs.join("|") !== "range|damage") throw new Error(knobs.join("|"));
      await page.locator('.ability [data-knob="range"]').evaluate((el) => { el.value = "4"; el.dispatchEvent(new Event("input", { bubbles: true })); });
      await page.waitForFunction(() => document.querySelector('.ability [data-val="range"]')?.textContent === "4", null, { timeout: 15000 });
      await shot("03-ability-panel"); tiny.push(...await big());
      await tap(page, "a:shut"); await page.waitForFunction((line) => document.querySelector(`[data-act="a:open:${line}"]`) !== null, LINE, { timeout: 15000 });
      await tap(page, `a:open:${LINE}`); await page.waitForFunction(() => document.querySelector('.ability [data-val="range"]')?.textContent === "4", null, { timeout: 15000 });
      await tap(page, "a:shut"); await page.waitForFunction((line) => document.querySelector(`[data-act="a:test:${line}"]`) !== null, LINE, { timeout: 15000 });
    });
    await step("4 test aim", async () => {
      await tap(page, `a:test:${LINE}`); await page.waitForFunction(() => window.__play !== undefined && window.__docs !== undefined, null, { timeout: 15000 });
      const live = await page.evaluate((id) => { const play = window.__play, unit = play.world.units.get(play.selected), aims = play.aims, reach = window.__docs.rules.abilities?.[id]?.[0]?.reach; return { id: unit?.unitId, side: unit?.side, me: play.sides.me, aim: play.aimKind, phase: play.world.phases.battle, reach, line: !!unit && aims.length > 0 && aims.every((c) => c.c === unit.at.c || c.r === unit.at.r), north: !!unit && aims.some((c) => c.c === unit.at.c && c.r === unit.at.r - reach) }; }, ARCHER);
      if (live.id !== ARCHER || live.side !== live.me || live.aim !== "spell" || live.phase !== "targeting" || live.reach !== 4 || !live.line || !live.north) throw new Error(JSON.stringify(live));
      await shot("04-test-start"); await press(page, "Back to maker");
      await page.waitForFunction((line) => document.querySelector(`[data-act="a:drop:${line}"]`) !== null, LINE, { timeout: 15000 });
    });
    await step("5 undo", async () => {
      await tap(page, `a:drop:${LINE}`); await page.waitForFunction(() => document.querySelector('[data-act="s:cell:1,8"] .star')?.textContent === "✦1", null, { timeout: 15000 });
      await tap(page, "undo"); await page.waitForFunction(() => document.querySelector('[data-act="s:cell:1,8"] .star')?.textContent === "✦2", null, { timeout: 15000 });
    });
    await step("6 whole", async () => {
      await tap(page, "s:cell:1,8"); await page.waitForFunction(() => document.querySelector('[data-act="s:edit"]') !== null, null, { timeout: 15000 });
      await tap(page, "s:edit"); await page.waitForFunction(() => document.querySelector('[data-act="a:test"]') !== null, null, { timeout: 15000 });
      await tap(page, "a:test"); await page.waitForFunction((id) => { const play = window.__play, unit = play?.world.units.get(play.selected); return unit?.unitId === id && unit.side === play.sides.me; }, ARCHER, { timeout: 15000 });
      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="u:back"]') !== null || document.querySelector('[data-act="s:back"]') !== null, null, { timeout: 15000 });
    });
    await step("7 nowhere", async () => {
      if (await page.locator('[data-act="u:back"]').count()) await tap(page, "u:back");
      await page.waitForFunction(() => document.querySelector('[data-act="s:back"]') !== null, null, { timeout: 15000 });
      await tap(page, "s:back"); await waitText(page, "Add unit"); await tap(page, "u:add");
      await page.waitForFunction(() => document.querySelector("[data-unit]") !== null, null, { timeout: 15000 }); await page.locator("[data-unit]").fill("Spare"); await tap(page, "u:create");
      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Spare" && document.body.innerText.includes("Place this unit on a stage to test it."), null, { timeout: 15000 });
      const shown = await page.evaluate(() => [...document.querySelectorAll("[data-act]")].some((el) => { const act = el.getAttribute("data-act") ?? ""; return act === "a:test" || act.startsWith("a:test:") || act === "s:try"; }));
      if (shown) throw new Error("test shown");
    });
    check(`8 targets @${width}`, tiny.length === 0, tiny.length === 0 ? "ok" : [...new Set(tiny)].join(" | "));
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
