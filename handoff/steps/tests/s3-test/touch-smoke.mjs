// Step 3 ?project= touch smoke. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s3-test/touch-smoke.mjs . 8798
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8798"] = process.argv;
if (!WT) { console.error("usage: node touch-smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT);
const { fitView } = await import(pathToFileURL(join(root, "src/runtime/render/fit.ts")).href);
const { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s3-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const shot = async (page) => page.evaluate(() => { const c = document.querySelector("#board"), rect = c.getBoundingClientRect(), cam = window.__cam; return { w: c.width, h: c.height, left: rect.left, top: rect.top, rw: rect.width, rh: rect.height, x: cam.x, y: cam.y, s: cam.s }; });
const screenOf = (g, c, r) => { const k = g.w / g.rw, ky = g.h / g.rh, f = fitView(g.w, g.h, g.s, 16, 16); return { x: g.left + (f.padX + ((c + 0.5) * 16 - g.x) * f.s) / k, y: g.top + (f.padY + ((r + 0.5) * 16 - g.y) * f.s) / ky, f }; };
const tileOf = (cam, ox, oy) => { const f = fitView(cam.w, cam.h, cam.s, 16, 16); return { c: Math.floor(((ox * (cam.w / cam.rw) - f.padX) / f.s + cam.x) / 16), r: Math.floor(((oy * (cam.h / cam.rh) - f.padY) / f.s + cam.y) / 16) }; };
const tapCell = async (page, c, r) => { const g = await shot(page), at = screenOf(g, c, r); await page.evaluate(() => { window.__up = null; }); await page.touchscreen.tap(at.x, at.y); await page.waitForTimeout(60); const up = await page.evaluate(() => window.__up), tile = up === null ? null : tileOf(up.cam, up.x, up.y); if (up === null || up.trust !== true || tile === null || tile.c !== c || tile.r !== r) throw new Error(`tap ${c},${r} -> ${JSON.stringify({ at, up, tile })}`); };
const until = async (page, ms) => { const t = Date.now(); while (Date.now() - t < ms) { if (await page.evaluate(() => window.__wait())) return; await page.waitForTimeout(40); } throw new Error("timeout"); };
const fingers = async (page, pts) => { const cdp = await page.context().newCDPSession(page); const send = (type, at) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: at.map((p, i) => ({ x: p[0], y: p[1], id: i + 1 })) }); await send("touchStart", pts); for (let i = 1; i <= 6; i += 1) await send("touchMove", pts.map((p) => [p[0] + p[2] * i, p[1] + p[3] * i])); await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await cdp.detach(); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }); await btn.first().waitFor({ timeout: 15000 }); await btn.first().scrollIntoViewIfNeeded(); const box = await btn.first().boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); await page.waitForTimeout(80); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    const page = await ctx.newPage(); const errs = [], ext = [];
    page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    page.on("request", (r) => { const u = r.url(); if (!(u.startsWith(origin) || u.startsWith("data:") || u.startsWith("blob:"))) ext.push(u); });
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
    const testAt = await page.locator("[data-act=test]").boundingBox(); if (testAt === null) throw new Error("no test");
    await press(page, "Test");
    await page.waitForFunction(() => location.search.includes("project=") && window.__play !== undefined && window.__hud !== undefined && window.__driver.stats.draws > 0, null, { timeout: 15000 });
    const opened = await page.evaluate(() => { const p = window.__docs.manifest.project, q = new URLSearchParams(location.search); return { id: p.id, name: p.name, query: q.get("project"), canopy: window.__docs.looks.canopy.length, braziers: window.__docs.looks.braziers.length }; });
    if (opened.name !== "My game" || opened.id !== opened.query || opened.id === "project_01JDAP00000000000000000001" || opened.canopy !== 0 || opened.braziers !== 0) throw new Error(JSON.stringify(opened));
    await page.evaluate(() => { const c = document.querySelector("#board"); window.__up = null; c.addEventListener("pointerup", (e) => { const cam = window.__cam, b = c.getBoundingClientRect(); window.__up = { trust: e.isTrusted, x: e.offsetX, y: e.offsetY, cam: { w: c.width, h: c.height, rw: b.width, rh: b.height, x: cam.x, y: cam.y, s: cam.s } }; }, true); window.__hud.hideBanner(); window.__play.followId = null; const s = Math.max(1, Math.floor(Math.min(c.width / 96, c.height / 144))); Object.assign(window.__cam, { x: 0, y: 0, follow: null, s }); });
    await page.waitForTimeout(80);
    const knight = await page.evaluate(() => window.__play.scene().units.find((u) => u.sprite === "starter:hero-sword").id);
    const turns0 = await page.evaluate(() => window.__play.view().turns);
    const step = async (name, ms, fn) => { try { await Promise.race([fn(), new Promise((_, no) => setTimeout(() => no(new Error("timeout")), ms))]); check(`${name} @${width}`, true, "ok"); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e)); } };
    await step("1 select", 5000, async () => { const at = await page.evaluate((id) => window.__play.world.units.get(id).at, knight); await tapCell(page, at.c, at.r); const sel = await page.evaluate(() => window.__play.selected); if (sel !== knight) throw new Error(`selected ${sel}`); });
    await step("2 walk", 5000, async () => {
      const cell = await page.evaluate(() => { const c = window.__play.reach[0]; return c ? { c: c.c, r: c.r } : null; }); if (cell === null) throw new Error("no reach");
      const from = await page.evaluate((id) => { const u = window.__play.world.units.get(id); return { c: u.at.c, r: u.at.r }; }, knight);
      await page.evaluate((p) => { window.__wait = () => { const u = window.__play.world.units.get(p.id); return window.__play.walk === null && u.at.c === p.c && u.at.r === p.r && window.__play.world.phases.battle === "actMenu"; }; }, { id: knight, c: cell.c, r: cell.r });
      await tapCell(page, cell.c, cell.r); await until(page, 4800);
      const moved = await page.evaluate((p) => { const u = window.__play.world.units.get(p.id); return u.at.c !== p.c || u.at.r !== p.r; }, { id: knight, c: from.c, r: from.r }); if (!moved) throw new Error("still at start");
    });
    await step("3 attack", 5000, async () => {
      const placed = await page.evaluate((id) => { const play = window.__play, me = play.world.units.get(id), occ = (c, r) => play.world.units.all().some((u) => u.alive && u.at.c === c && u.at.r === r); const spots = [[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dc, dr]) => ({ c: me.at.c + dc, r: me.at.r + dr })).filter((p) => play.world.grid.inBounds(p) && play.world.grid.isOpen(p) && !occ(p.c, p.r)); const wolf = play.scene().units.find((u) => u.sprite === "starter:enemy-wolf" && u.alive); if (spots[0] === undefined || wolf === undefined || !play.world.units.moveTo(wolf.id, spots[0], "move").ok) return null; return { id: wolf.id, c: spots[0].c, r: spots[0].r, before: play.world.log.entries().filter((e) => e.action.kind === "ability").length }; }, knight);
      if (placed === null) throw new Error("no neighbour");
      await page.locator("#attack").waitFor({ state: "visible", timeout: 3000 }); const btn = await page.locator("#attack").boundingBox(); if (btn === null) throw new Error("no attack");
      await page.touchscreen.tap(btn.x + btn.width / 2, btn.y + btn.height / 2); await page.waitForTimeout(40); await tapCell(page, placed.c, placed.r);
      const got = await page.evaluate((p) => { const play = window.__play, hp = play.world.rules.state().units.find((u) => u.id === p.id)?.hp ?? 99; return { hp, phase: play.world.phases.battle, done: play.done.has(p.knight), logs: play.world.log.entries().filter((e) => e.action.kind === "ability").length, before: p.before }; }, { ...placed, knight });
      if (!(got.hp < 4 && got.phase === "idle" && got.done && got.logs === got.before + 1)) throw new Error(JSON.stringify(got));
    });
    await step("4 pan then select", 5000, async () => {
      await page.evaluate(() => { const c = document.querySelector("#board"); window.__play.followId = null; const s = Math.max(window.__cam.s, Math.floor(Math.min(c.width / 96, c.height / 144))); Object.assign(window.__cam, { x: 0, y: 0, follow: null, s }); });
      const g0 = await shot(page), s0 = g0.s; await fingers(page, [[g0.left + 28, g0.top + g0.rh - 28, -8, 0], [g0.left + 52, g0.top + g0.rh - 28, 8, 0]]);
      const g1 = await shot(page); if (!(g1.s > s0)) throw new Error(`zoom ${s0}->${g1.s}`);
      const pan = await shot(page); await fingers(page, [[pan.left + pan.rw / 2, pan.top + pan.rh / 2, -20, 0]]);
      const g2 = await shot(page), grew = g2.x - g1.x, want = (120 * (g2.w / g2.rw)) / g2.s; if (!(g2.x > 0 && Math.abs(grew - want) <= 0.5)) throw new Error(`pan x ${g1.x}->${g2.x} grew ${grew} want ${want}`);
      const spot = await page.evaluate(() => {
        const play = window.__play, cam = window.__cam, c = document.querySelector("#board"), s = Math.max(1, Math.trunc(cam.s)), artW = Math.floor(c.width / s), artH = Math.floor(c.height / s);
        const open = (col, row) => play.world.grid.inBounds({ c: col, r: row }) && play.world.grid.isOpen({ c: col, r: row }) && !play.world.units.all().some((u) => u.alive && u.at.c === col && u.at.r === row);
        const on = (col, row) => (col + 0.5) * 16 > cam.x + 16 && (col + 0.5) * 16 < cam.x + artW - 16 && (row + 0.5) * 16 > cam.y + 16 && (row + 0.5) * 16 < cam.y + artH - 16;
        let ar = null, vi = null;
        for (let r = 0; r < play.world.grid.rows && ar === null; r += 1) for (let col = 0; col < play.world.grid.cols; col += 1) { if (!on(col, r) || !open(col, r)) continue; const nb = [[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dc, dr]) => ({ c: col + dc, r: r + dr })).find((p) => on(p.c, p.r) && open(p.c, p.r)); if (nb !== undefined) { ar = { c: col, r }; vi = nb; break; } }
        if (ar === null || vi === null) return null;
        const archer = play.scene().units.find((u) => u.sprite === "starter:hero-staff" && u.alive), villager = play.scene().units.find((u) => u.sprite === "starter:npc-villager" && u.alive);
        if (archer === undefined || villager === undefined || !play.world.units.moveTo(archer.id, ar, "move").ok || !play.world.units.moveTo(villager.id, vi, "move").ok) return null;
        return { archer: archer.id, ac: ar.c, ar: ar.r, vc: vi.c, vr: vi.r };
      });
      if (spot === null) throw new Error("no on-screen pair");
      await tapCell(page, spot.ac, spot.ar); const sel = await page.evaluate(() => window.__play.selected);
      const g3 = await shot(page), at = screenOf(g3, spot.ac, spot.ar), dpr = await page.evaluate(() => devicePixelRatio || 1);
      const oldC = Math.floor((((at.x - g3.left) * dpr) - at.f.padX) / g3.s / 16), oldR = Math.floor((((at.y - g3.top) * dpr) - at.f.padY) / g3.s / 16);
      if (sel !== spot.archer || (oldC === spot.ac && oldR === spot.ar)) throw new Error(JSON.stringify({ sel, spot, oldC, oldR }));
      await page.evaluate((s) => { window.__spot = s; }, spot);
    });
    await step("5 talk", 5000, async () => {
      const live = await page.evaluate((t0) => ({ side: window.__play.side, turns: window.__play.view().turns, t0 }), turns0); if (live.side !== "player" || live.turns !== live.t0) throw new Error(JSON.stringify(live));
      const spot = await page.evaluate(() => window.__spot), talk = await page.locator("#talk").boundingBox(); if (talk === null || spot === null) throw new Error("no talk");
      await page.touchscreen.tap(talk.x + talk.width / 2, talk.y + talk.height / 2); await page.waitForTimeout(40); await tapCell(page, spot.vc, spot.vr);
      const panel = await page.evaluate(() => { const n = document.querySelector("#sheet"), q = n.getBoundingClientRect(), st = getComputedStyle(n); return { show: st.display !== "none", h: q.height, text: n.textContent ?? "", vh: innerHeight }; });
      if (!(panel.show && panel.h > 0 && panel.h <= panel.vh * 0.35 && panel.text.includes("Villager") && panel.text.includes("Hello, traveler."))) throw new Error(JSON.stringify(panel));
      const close = await page.locator("#close").boundingBox(); if (close === null || close.width < 44 || close.height < 44) throw new Error("close");
      await page.touchscreen.tap(close.x + close.width / 2, close.y + close.height / 2); await page.waitForTimeout(40);
      const after = await page.evaluate((s) => { const n = document.querySelector("#sheet"); return { hidden: getComputedStyle(n).display === "none", phase: window.__play.world.phases.battle, knight: window.__play.done.has(s.knight), archer: window.__play.done.has(s.archer) }; }, { ...spot, knight });
      if (!(after.hidden && after.phase === "idle" && after.knight && after.archer)) throw new Error(JSON.stringify(after));
    });
    await step("6 end turn", 10000, async () => {
      const end = await page.locator("#end").boundingBox(); if (end === null) throw new Error("no end");
      await page.evaluate((t0) => {
        const play = window.__play; window.__saw = false; const bot = play.bot.bind(play);
        play.bot = (world, side) => { if (side === "wolves") window.__saw = true; return bot(world, side); };
        window.__wait = () => window.__saw === true && play.side === "player" && play.view().turns === t0 + 1 && play.world.phases.battle === "idle" && play.done.size === 0;
      }, turns0);
      await page.touchscreen.tap(end.x + end.width / 2, end.y + end.height / 2); await until(page, 9000);
      await page.evaluate((id) => { const u = window.__play.world.units.get(id), c = document.querySelector("#board"), cam = window.__cam, s = Math.max(1, Math.trunc(cam.s)); window.__play.followId = null; cam.follow = null; cam.x = Math.max(0, (u.at.c + 0.5) * 16 - Math.floor(c.width / s) / 2); cam.y = Math.max(0, (u.at.r + 0.5) * 16 - Math.floor(c.height / s) / 2); }, knight);
      const at = await page.evaluate((id) => window.__play.world.units.get(id).at, knight); await tapCell(page, at.c, at.r);
      const sel = await page.evaluate(() => window.__play.selected); if (sel !== knight) throw new Error(`reselect ${sel}`);
    });
    await step("7 buttons", 5000, async () => {
      const hud = await page.evaluate(() => [...document.querySelectorAll("button")].filter((b) => { const s = getComputedStyle(b), q = b.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && q.width > 0 && q.height > 0; }).map((b) => { const q = b.getBoundingClientRect(); return { id: b.id, w: q.width, h: q.height }; }));
      const small = hud.filter((b) => b.w < 44 || b.h < 44); if (small.length > 0 || !hud.some((b) => b.id === "recentre") || errs.length > 0 || ext.length > 0) throw new Error(JSON.stringify({ small, recentre: hud.some((b) => b.id === "recentre"), errs, ext }));
    });
    await step("8 back to maker", 5000, async () => {
      const live = await page.evaluate((b) => { const n = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2); return n instanceof Element && n.closest("[data-act=test]") !== null; }, testAt);
      if (live) throw new Error("test still live");
      const back = await page.locator("#back-maker").boundingBox(); if (back === null || back.width < 48 || back.height < 48) throw new Error("no back");
      await page.touchscreen.tap(back.x + back.width / 2, back.y + back.height / 2);
      await page.waitForFunction(() => document.querySelector("[data-act=test]") !== null && !location.search.includes("project="));
      const name = await page.locator("h1").innerText(); if (name !== "My game") throw new Error(name);
    });
    await step("9 empty blocked", 15000, async () => {
      await press(page, "Back"); await press(page, "New project");
      const empty = page.getByRole("button", { name: "Empty", exact: true }); await empty.waitFor({ timeout: 15000 }); const box = await empty.boundingBox(); if (box === null) throw new Error("empty");
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); await page.waitForTimeout(80);
      await press(page, "Continue"); await press(page, "Create"); await press(page, "Test");
      const got = await page.evaluate(() => ({ app: getComputedStyle(document.querySelector("#app")).display, board: document.querySelector("#board") !== null, text: document.querySelector(".sheet")?.textContent ?? "", test: document.querySelector("[data-act=test]") !== null }));
      if (got.app === "none" || got.board || !got.text.includes("no unit roster yet") || !got.test) throw new Error(JSON.stringify(got));
    });
    await ctx.close();
  };
  await run(390); await run(360);
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
console.log(bad === 0 ? "TOUCH SMOKE PASS" : `TOUCH SMOKE FAIL (${bad})`);
process.exit(bad === 0 ? 0 : 1);
