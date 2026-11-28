// Step 6b levels. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s6b-levels/smoke.mjs . 8806
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8806"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const { fitView } = await import(pathToFileURL(join(root, "src/runtime/render/fit.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s6b-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const shots = join(tmpdir(), "s6b-shots"); mkdirSync(shots, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).last(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name, exact = false) => { const btn = page.getByRole("button", { name, exact }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
const quiet = (page) => page.waitForFunction(() => document.querySelector(".toast") === null, null, { timeout: 15000 });
const shotOf = async (page) => page.evaluate(() => { const c = document.querySelector("#board"), rect = c.getBoundingClientRect(), cam = window.__cam; return { w: c.width, h: c.height, left: rect.left, top: rect.top, rw: rect.width, rh: rect.height, x: cam.x, y: cam.y, s: cam.s }; });
const screenOf = (g, c, r) => { const k = g.w / g.rw, ky = g.h / g.rh, f = fitView(g.w, g.h, g.s, 16, 16); return { x: g.left + (f.padX + ((c + 0.5) * 16 - g.x) * f.s) / k, y: g.top + (f.padY + ((r + 0.5) * 16 - g.y) * f.s) / ky }; };
const tileOf = (cam, ox, oy) => { const f = fitView(cam.w, cam.h, cam.s, 16, 16); return { c: Math.floor(((ox * (cam.w / cam.rw) - f.padX) / f.s + cam.x) / 16), r: Math.floor(((oy * (cam.h / cam.rh) - f.padY) / f.s + cam.y) / 16) }; };
const tapCell = async (page, c, r) => { const g = await shotOf(page), at = screenOf(g, c, r); await page.evaluate(() => { window.__up = null; }); await page.touchscreen.tap(at.x, at.y); await page.waitForFunction(() => window.__up !== null, null, { timeout: 15000 }); const up = await page.evaluate(() => window.__up), tile = up === null ? null : tileOf(up.cam, up.x, up.y); if (up === null || up.trust !== true || tile === null || tile.c !== c || tile.r !== r) throw new Error(`tap ${c},${r} -> ${JSON.stringify(tile)}`); };
const slide = async (page, sel, value) => { const node = page.locator(sel); await node.waitFor({ timeout: 15000 }); await node.evaluate((el, v) => { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); }, value); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); const tiny = []; let saw = false;
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(shots, `${name}.png`) }); };
    const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? el.tagName} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).replace(/\s+/g, " ").slice(0, 400)); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await tap(page, "m:menu"); await tap(page, "m:levels");
    await step("1 levels off then on", async () => {
      await page.locator('[data-act="l:on"]').scrollIntoViewIfNeeded(); await waitText(page, "Levels: Off"); await shot("01-levels-off");
      await tap(page, "l:on"); await waitText(page, "Levels: 9 · 112 XP to the top"); await quiet(page); await page.locator('[data-act="l:open"]').scrollIntoViewIfNeeded(); await shot("02-levels-on");
    });
    await step("2 editor rows", async () => {
      await tap(page, "l:open"); await page.waitForFunction(() => document.querySelectorAll("[data-row]").length === 9 && document.querySelector("[data-sheet=levels] h1")?.textContent === "Levels", null, { timeout: 15000 });
      await shot("03-editor-top");
      await page.locator('[data-row="8"]').scrollIntoViewIfNeeded(); await page.waitForFunction(() => { const row = document.querySelector('[data-row="8"]'), sheet = document.querySelector("[data-sheet=levels] .sheet"); if (row === null || sheet === null) return false; const b = row.getBoundingClientRect(), s = sheet.getBoundingClientRect(); return b.top < s.bottom && b.bottom > s.top; }, null, { timeout: 15000 });
      await shot("04-editor-scrolled"); tiny.push(...await big()); saw = true;
      await slide(page, '[data-lvl="levels"]', "3"); await page.waitForFunction(() => document.querySelectorAll("[data-row]").length === 3, null, { timeout: 15000 });
      await quiet(page); await tap(page, "l:close"); await page.waitForFunction(() => document.querySelector("[data-sheet=levels]") === null, null, { timeout: 15000 });
      await tap(page, "l:open"); await page.waitForFunction(() => document.querySelectorAll("[data-row]").length === 3, null, { timeout: 15000 });
    });
    await step("3 strip before", async () => {
      await slide(page, '[data-lvl="row-0"]', "2"); await slide(page, '[data-lvl="xp_move"]', "1");
      await page.waitForFunction(() => document.querySelector('[data-val="row-0"]')?.textContent === "2 XP", null, { timeout: 15000 });
      await quiet(page); await tap(page, "test"); await page.waitForFunction(() => document.querySelector("#xp")?.textContent === "Level 0 · 0/2 XP" && window.__play !== undefined, null, { timeout: 15000 });
      await shot("05-xp-before");
    });
    await step("4 two moves", async () => {
      await page.evaluate(() => { const c = document.querySelector("#board"); window.__up = null; c.addEventListener("pointerup", (e) => { const cam = window.__cam, b = c.getBoundingClientRect(); window.__up = { trust: e.isTrusted, x: e.offsetX, y: e.offsetY, cam: { w: c.width, h: c.height, rw: b.width, rh: b.height, x: cam.x, y: cam.y, s: cam.s } }; }, true); window.__hud.hideBanner(); window.__play.followId = null; });
      await page.waitForFunction(() => window.__driver.stats.draws > 0, null, { timeout: 15000 });
      const knight = await page.evaluate(() => window.__play.scene().units.find((u) => u.sprite === "starter:hero-sword").id);
      const hop = async () => {
        await page.evaluate((id) => { const u = window.__play.world.units.get(id), c = document.querySelector("#board"), cam = window.__cam, s = Math.max(1, Math.trunc(cam.s)); window.__play.followId = null; cam.follow = null; cam.x = Math.max(0, (u.at.c + 0.5) * 16 - Math.floor(c.width / s) / 2); cam.y = Math.max(0, (u.at.r + 0.5) * 16 - Math.floor(c.height / s) / 2); }, knight);
        const at = await page.evaluate((id) => window.__play.world.units.get(id).at, knight); await tapCell(page, at.c, at.r);
        await page.waitForFunction((id) => window.__play.selected === id && window.__play.reach.length > 0, knight, { timeout: 15000 });
        const cell = await page.evaluate(() => { const c = window.__play.reach[0]; return { c: c.c, r: c.r }; });
        await page.evaluate((p) => { window.__wait = () => { const u = window.__play.world.units.get(p.id); return window.__play.walk === null && u.at.c === p.c && u.at.r === p.r; }; }, { id: knight, ...cell });
        await tapCell(page, cell.c, cell.r); await page.waitForFunction(() => window.__wait(), null, { timeout: 15000 });
      };
      await hop();
      const turns = await page.evaluate(() => window.__play.view().turns);
      await page.evaluate((t0) => { window.__wait = () => window.__play.side === "player" && window.__play.view().mine === true && window.__play.view().turns === t0 + 1 && window.__play.world.phases.battle === "idle" && window.__play.done.size === 0; }, turns);
      const end = page.locator("#end"); await end.waitFor({ timeout: 15000 }); const box = await end.boundingBox(); if (box === null) throw new Error("no end"); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForFunction(() => window.__wait(), null, { timeout: 15000 });
      await hop();
      await page.waitForFunction(() => document.querySelector("#xp")?.textContent === "Level 1 · 0/11 XP", null, { timeout: 15000 });
      await shot("06-xp-after");
    });
    await step("5 reset curve", async () => {
      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="l:reset"]') !== null, null, { timeout: 15000 });
      await quiet(page); await tap(page, "l:reset"); await page.waitForFunction(() => ["17 XP", "11 XP", "13 XP"].every((t, i) => document.querySelector(`[data-val="row-${i}"]`)?.textContent === t), null, { timeout: 15000 });
    });
    await step("6 turn off", async () => {
      await quiet(page); await tap(page, "l:off"); await page.waitForFunction(() => document.body.innerText.includes("Levels: Off") && document.querySelector("[data-sheet=levels]") === null, null, { timeout: 15000 });
      await quiet(page); await tap(page, "m:close"); await tap(page, "s:test"); await page.waitForFunction(() => window.__play !== undefined && window.__driver.stats.draws > 0 && document.querySelector("#xp")?.textContent === "" && getComputedStyle(document.querySelector("#xp")).display === "none", null, { timeout: 15000 });
    });
    await step("7 reload", async () => {
      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="s:test"]') !== null, null, { timeout: 15000 });
      await page.goto(`${origin}/maker/`, { waitUntil: "load" }); await press(page, "My game"); await tap(page, "m:menu"); await tap(page, "m:levels");
      await waitText(page, "Levels: Off"); await tap(page, "l:on"); await quiet(page); await tap(page, "l:open");
      await page.waitForFunction(() => document.querySelectorAll("[data-row]").length === 3 && ["17 XP", "11 XP", "13 XP"].every((t, i) => document.querySelector(`[data-val="row-${i}"]`)?.textContent === t), null, { timeout: 15000 });
    });
    check(`8 targets @${width}`, saw && tiny.length === 0 && errs.length === 0, !saw ? "not measured" : tiny.length === 0 ? "ok" : [...new Set(tiny)].join(" | "));
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
