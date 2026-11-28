// Step 6c tactics checkpoint. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s6c-checkpoint/smoke.mjs . 8807
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"; import { tmpdir } from "node:os"; import { dirname, extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8807"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s6c-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const out = join(root, "handback/step-06c-checkpoint/r1"); mkdirSync(out, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).last(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
const quiet = (page) => page.waitForFunction(() => document.querySelector(".toast") === null, null, { timeout: 15000 });
const slide = async (page, sel, value) => { const node = page.locator(sel); await node.waitFor({ timeout: 15000 }); await node.evaluate((el, v) => { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); }, value); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); const tiny = [];
    if (width === 390) rmSync(join(out, "checkpoint.tileproj"), { recursive: true, force: true });
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(out, `${name}.png`) }); };
    const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? el.tagName} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
    const see = async () => { tiny.push(...await big()); };
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).replace(/\s+/g, " ").slice(0, 400)); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await step("1 new empty", async () => {
      await tap(page, "new"); await tap(page, "tpl:empty"); await tap(page, "toname"); await page.locator("[data-name]").fill("Skirmish"); await tap(page, "create");
      await page.waitForFunction(() => document.querySelector("h1")?.textContent === "Blank", null, { timeout: 15000 }); await tap(page, "m:switch");
    });
    await step("2 resize 6x6", async () => {
      const menu = await page.evaluate(() => document.querySelector('[data-act^="r:menu:map:"]')?.getAttribute("data-act") ?? ""); if (menu === "") throw new Error("map");
      await tap(page, menu); await tap(page, "r:resize"); await waitText(page, "Columns 1"); await see();
      for (let i = 0; i < 5; i += 1) { await tap(page, "r:step:c:1"); await tap(page, "r:step:r:1"); }
      await page.waitForFunction(() => document.body.innerText.includes("Columns 6") && document.body.innerText.includes("Rows 6"), null, { timeout: 15000 });
      await tap(page, "r:apply"); await page.waitForFunction(() => document.querySelector('[data-act="r:apply"]') === null && document.body.innerText.includes("6 × 6"), null, { timeout: 15000 }); await quiet(page);
      await tap(page, "m:close"); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 36 && document.body.innerText.includes("No enemies: free roam.") && document.body.innerText.includes("No player side: Test never reaches an outcome."), null, { timeout: 15000 });
      await shot("02-stage");
    });
    await step("3 wall gap", async () => {
      await tap(page, "s:cell:0,2"); await page.waitForFunction(() => document.querySelector(".sheet h2")?.textContent === "Add here", null, { timeout: 15000 }); await see();
      await tap(page, "s:type:wall-block"); await waitText(page, "Painting Wall block");
      for (const act of ["s:cell:1,2", "s:cell:2,2", "s:cell:4,2", "s:cell:5,2"]) await tap(page, act);
      await tap(page, "s:done");
      await page.waitForFunction(() => document.querySelector(".chip") === null && ["0,2", "1,2", "2,2", "4,2", "5,2"].every((at) => document.querySelector(`[data-act="s:cell:${at}"]`)?.getAttribute("data-tile") === "wall-block") && document.querySelector('[data-act="s:cell:3,2"]')?.getAttribute("data-tile") !== "wall-block", null, { timeout: 15000 });
      await shot("03-walls");
    });
    await step("4 hero", async () => {
      await tap(page, "m:menu"); await tap(page, "m:units"); await page.waitForFunction(() => document.querySelector('[data-act="u:add"]') !== null, null, { timeout: 15000 });
      await tap(page, "u:add"); await page.locator("[data-unit]").fill("Hero"); await see(); await tap(page, "u:create");
      await page.waitForFunction(() => [...document.querySelectorAll("h1")].some((h) => h.textContent === "Hero"), null, { timeout: 15000 });
      await slide(page, '[data-knob="unit_hp"]', "20"); await page.waitForFunction(() => document.querySelector('[data-val="unit_hp"]')?.textContent === "20", null, { timeout: 15000 }); await quiet(page);
      await slide(page, '[data-knob="unit_atk"]', "5"); await page.waitForFunction(() => document.querySelector('[data-val="unit_atk"]')?.textContent === "2", null, { timeout: 15000 }); await quiet(page);
      await see(); await tap(page, "t:team"); await page.waitForFunction(() => document.querySelector('[aria-label="On your team: On"]')?.getAttribute("aria-pressed") === "true", null, { timeout: 15000 }); await quiet(page);
      await tap(page, "g:open"); await page.waitForFunction(() => document.querySelector('[data-sheet="goals"]') !== null, null, { timeout: 15000 }); await see();
      const bin = await page.evaluate(() => document.querySelector('[data-goal="Attack"]')?.getAttribute("data-act") ?? ""); if (bin === "") throw new Error("bin"); await tap(page, bin);
      await page.waitForFunction(() => document.querySelector('[data-sheet="cards"]') !== null, null, { timeout: 15000 }); await see(); await tap(page, "g:add:line-shot");
      await page.waitForFunction(() => document.querySelector('[data-act="a:shut"]') !== null && document.querySelector('[data-knob="range"]')?.value === "3" && document.querySelector('[data-knob="damage"]')?.value === "2", null, { timeout: 15000 }); await see();
      await tap(page, "a:shut"); await page.waitForFunction(() => document.body.innerText.includes("Line Shot") && document.querySelector('[aria-label="On your team: On"]')?.getAttribute("aria-pressed") === "true", null, { timeout: 15000 });
      await page.locator('[aria-label="On your team: On"]').scrollIntoViewIfNeeded(); await shot("04-hero");
      await page.locator('[data-role="card"]').last().scrollIntoViewIfNeeded(); await shot("04b-ability");
    });
    await step("5 raider", async () => {
      await tap(page, "u:back"); await quiet(page); await tap(page, "u:add"); await page.locator("[data-unit]").fill("Raider"); await see(); await tap(page, "u:create");
      await page.waitForFunction(() => [...document.querySelectorAll("h1")].some((h) => h.textContent === "Raider"), null, { timeout: 15000 });
      await slide(page, '[data-knob="unit_hp"]', "2"); await page.waitForFunction(() => document.querySelector('[data-val="unit_hp"]')?.textContent === "2" && document.querySelector('[data-act="u:reset:unit_hp"]') !== null && document.querySelector('[aria-label="On your team: On"]')?.getAttribute("aria-pressed") === "false", null, { timeout: 15000 });
      await see(); await shot("05-raider"); await tap(page, "u:back"); await quiet(page);
    });
    await step("6 place", async () => {
      await tap(page, "m:close"); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 36, null, { timeout: 15000 });
      await tap(page, "s:cell:0,0"); await page.waitForFunction(() => document.querySelector(".sheet h2")?.textContent === "Add here", null, { timeout: 15000 }); await see(); await tap(page, "s:place:spawn"); await quiet(page);
      await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:0,0"]')?.getAttribute("aria-label") ?? "").includes("Hero"), null, { timeout: 15000 });
      await tap(page, "s:cell:5,5"); await tap(page, "s:place:enemy"); await page.waitForFunction(() => [...document.querySelectorAll(".sheet h2")].some((n) => n.textContent === "Pick a unit"), null, { timeout: 15000 }); await see();
      const foe = await page.evaluate(() => [...document.querySelectorAll("[data-act]")].find((el) => el.getAttribute("data-act")?.startsWith("s:unit:") && el.textContent === "Raider")?.getAttribute("data-act") ?? ""); if (foe === "") throw new Error("raider");
      await tap(page, foe); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:5,5"]')?.getAttribute("aria-label") ?? "").includes("Raider"), null, { timeout: 15000 }); await shot("06-placed");
    });
    await step("7 rules on", async () => {
      await tap(page, "r:open"); await page.waitForFunction(() => document.querySelector('[data-seg="k:toggle:wipe_wins"] [aria-pressed="true"]')?.textContent === "On" && document.body.innerText.includes("Win by defeating every enemy") && document.body.innerText.includes("Default rule"), null, { timeout: 15000 });
      await see(); await shot("07-rules"); await tap(page, "r:close"); await page.waitForFunction(() => document.querySelector('[data-sheet="rules"]') === null, null, { timeout: 15000 });
    });
    await step("8 victory", async () => {
      await tap(page, "s:test"); await page.waitForFunction(() => window.__play !== undefined && document.querySelector("#veil") !== null, null, { timeout: 15000 });
      await page.evaluate(() => { window.__snap = () => { const m = window.__play, all = m.world.units.all(), me = all.find((u) => u.alive && u.side === m.sides.me), foe = all.find((u) => u.alive && u.side !== m.sides.me && u.side !== "neutral"), xp = m.view().xp; return { id: me ? me.id : "", at: me ? { c: me.at.c, r: me.at.r } : null, foe: foe ? { c: foe.at.c, r: foe.at.r } : null, phase: m.world.phases.battle, outcome: m.outcome, level: xp ? xp.level : 0, turns: m.view().turns, side: m.side, mine: m.sides.me }; }; });
      let leveled = false;
      const read = () => page.evaluate(() => window.__snap());
      const flush = () => page.evaluate(() => { const m = window.__play; for (let i = 0; i < 40; i += 1) { m.world.clock.advance(400); m.sync(); } window.__hud.render(m.view()); });
      const shoot = async (s) => {
        if (s.phase === "idle") { await page.evaluate((id) => window.__play.feed({ type: "SelectUnit", unitId: id }), s.id); await page.waitForFunction((id) => window.__play.selected === id && window.__play.world.phases.battle === "unitSelected", s.id, { timeout: 15000 }); }
        const no = await page.evaluate(() => window.__play.choose("spell")); if (no !== null) throw new Error(String(no));
        await page.waitForFunction(() => window.__play.world.phases.battle === "targeting", null, { timeout: 15000 });
        await page.evaluate((at) => window.__play.feed({ type: "TargetCell", at }), s.foe); await flush();
        await page.waitForFunction(() => window.__play.outcome === "win" || window.__play.world.phases.battle === "idle", null, { timeout: 15000 });
      };
      for (let n = 0; n < 30; n += 1) {
        const s = await read(); if (s.outcome === "win") break; if (s.foe === null || s.at === null || s.id === "") throw new Error(JSON.stringify(s)); if (s.level >= 1) leveled = true;
        const can = (a, b) => a !== null && b !== null && (a.c === b.c || a.r === b.r) && Math.abs(a.c - b.c) + Math.abs(a.r - b.r) <= 3 && Math.abs(a.c - b.c) + Math.abs(a.r - b.r) >= 1;
        if (can(s.at, s.foe)) { await shoot(s); break; }
        const stepAt = await page.evaluate(({ id, foe }) => { const m = window.__play, from = m.world.units.get(id).at, key = (c, r) => c + "," + r, open = (c, r) => c >= 0 && r >= 0 && c < m.world.grid.cols && r < m.world.grid.rows && m.world.grid.isOpen({ c, r }) && m.world.units.occupantAt({ c, r }) === undefined, prev = new Map([[key(from.c, from.r), ""]]), q = [{ c: from.c, r: from.r }]; while (q.length) { const at = q.shift(), d = Math.abs(at.c - foe.c) + Math.abs(at.r - foe.r); if ((at.c === foe.c || at.r === foe.r) && d >= 1 && d <= 3) { let cur = key(at.c, at.r); while (prev.get(cur) !== key(from.c, from.r) && prev.get(cur) !== "") cur = prev.get(cur); const [c, r] = cur.split(","); return { c: Number(c), r: Number(r) }; } for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n2 = { c: at.c + dc, r: at.r + dr }, k = key(n2.c, n2.r); if (prev.has(k) || !open(n2.c, n2.r)) continue; prev.set(k, key(at.c, at.r)); q.push(n2); } } return null; }, { id: s.id, foe: s.foe });
        if (stepAt === null) throw new Error("path " + JSON.stringify(s));
        await page.evaluate((p) => { const m = window.__play; if (m.world.phases.battle === "idle") m.feed({ type: "SelectUnit", unitId: p.id }); m.feed({ type: "TargetCell", at: p.at }); }, { id: s.id, at: stepAt }); await flush();
        await page.waitForFunction((at) => { const m = window.__play, me = m.world.units.all().find((u) => u.side === m.sides.me); return m.walk === null && me !== undefined && me.at.c === at.c && me.at.r === at.r && m.world.phases.battle === "actMenu"; }, stepAt, { timeout: 15000 });
        const now = await read(); if (now.level >= 1) leveled = true; if (can(now.at, now.foe)) { await shoot(now); break; }
        const turns = now.turns; await page.evaluate(() => window.__play.endTurn()); await flush();
        await page.waitForFunction((t0) => { const m = window.__play; return m.side === m.sides.me && m.world.phases.battle === "idle" && m.walk === null && m.view().turns === t0 + 1; }, turns, { timeout: 15000 });
      }
      const end = await read(); if (end.outcome !== "win" || end.turns > 30) throw new Error(JSON.stringify({ ...end, leveled }));
      await page.evaluate(() => window.__hud.render(window.__play.view()));
      await page.waitForFunction(() => document.querySelector("#veil h2")?.textContent === "Victory", null, { timeout: 15000 }); await shot("08-victory");
      if (width === 390) { const files = await page.evaluate(() => window.__read()); for (const [rel, text] of Object.entries(files)) { const file = join(out, "checkpoint.tileproj", rel); mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, text); } }
    });
    check(`9 check 8 @${width}`, tiny.length === 0 && errs.length === 0, tiny.length === 0 ? "ok" : [...new Set(tiny)].join(" | "));
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
