// Step 4b stage place smoke. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s4b-stage-place/smoke.mjs . 8800
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8800"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const slice = JSON.parse(readFileSync(join(root, "fixtures/demo.tileproj/catalogue/slice.json"), "utf8"));
const max = slice.behaviours.find((b) => b.id === "talk").knobs.find((k) => k.id === "line").max_len;
const www = mkdtempSync(join(tmpdir(), "s4b-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/local/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); return box; };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); await page.waitForTimeout(80); };
const label = (page, c, r) => page.locator(`[data-act="s:cell:${c},${r}"]`).getAttribute("aria-label");
const waitLabel = (page, c, r, bit, on) => page.waitForFunction(([c, r, bit, on]) => { const n = document.querySelector(`[data-act="s:cell:${c},${r}"]`); const t = n ? (n.getAttribute("aria-label") ?? "") : ""; return on ? t.includes(bit) : t.length > 0 && !t.includes(bit); }, [c, r, bit, on], { timeout: 15000 });
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e)); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage");
    await step("1 add here", async () => { await tap(page, "s:cell:0,0"); await waitText(page, "Your team start"); const got = await page.evaluate(() => { const buttons = [...document.querySelectorAll(".sheet button")].map((b) => b.textContent.trim()); const choice = [...document.querySelectorAll(".sheet .pick")].map((b) => b.textContent.trim()); const small = [...document.querySelectorAll(".sheet button")].map((b) => b.getBoundingClientRect()).filter((b) => b.width > 0 && (b.width < 48 || b.height < 48)); return { buttons, choice, small: small.length }; }); if (got.choice.join("|") !== "Floor|Water|Wall block" || !got.buttons.includes("Your team start") || !got.buttons.includes("NPC") || !got.buttons.includes("Enemy") || got.small !== 0) throw new Error(JSON.stringify(got)); await tap(page, "s:close"); });
    await step("2 what", async () => { await tap(page, "s:cell:2,8"); await tap(page, "s:place:npc"); await tap(page, "s:unit:unit_01JDAN00000000000000000003"); await waitLabel(page, 2, 8, "NPC", true); const rows = await page.evaluate(() => [...document.querySelectorAll(".sheet button")].map((b) => b.textContent.trim()).filter((t) => t !== "Close")); if (rows.join("|") !== "Just stand here|Talk" || rows.some((t) => /Hostile|Wander|Seller|Quest/.test(t))) throw new Error(rows.join("|")); });
    await step("3 talk", async () => { await tap(page, "s:talk-open"); const input = page.locator("[data-talk]"); await input.fill("x".repeat(max + 3)); const n = await input.evaluate((el) => [...el.value].length); if (n !== max) throw new Error(`len ${n}`); await input.fill("Smoke hello"); await tap(page, "s:talk-save"); await page.waitForFunction(() => { const n = document.querySelector('[data-act="s:cell:2,8"]'); return ((n && n.getAttribute("aria-label")) || "").includes("NPC") && document.querySelector("[data-talk]") === null; }, null, { timeout: 15000 }); const who = await label(page, 2, 8); if (!String(who).includes("NPC")) throw new Error(String(who)); });
    await step("4 enemy", async () => { await tap(page, "s:cell:4,0"); await tap(page, "s:place:enemy"); await tap(page, "s:unit:unit_01JDAN00000000000000000004"); await waitLabel(page, 4, 0, "Enemy", true); const who = await label(page, 4, 0); if (!String(who).includes("Enemy")) throw new Error(String(who)); });
    await step("5 move", async () => { await tap(page, "s:cell:2,8"); await tap(page, "s:move"); await tap(page, "s:cell:0,3"); await waitText(page, "Water blocks units"); await tap(page, "s:cell:1,7"); await waitLabel(page, 1, 7, "NPC", true); const who = await label(page, 1, 7); if (!String(who).includes("NPC")) throw new Error(String(who)); });
    await step("6 test", async () => {
      await tap(page, "s:test"); await page.waitForFunction(() => location.search.includes("stage=") && window.__play !== undefined, null, { timeout: 15000 }); await page.evaluate(() => window.__hud.hideBanner());
      const live = await page.evaluate(() => { const units = window.__play.world.units.all(); const npc = units.find((u) => u.at.c === 1 && u.at.r === 7); const foe = units.find((u) => u.at.c === 4 && u.at.r === 0); const me = units.find((u) => u.at.c === 1 && u.at.r === 8); window.__play.feed({ type: "SelectUnit", unitId: me.id }); const err = window.__play.choose("talk"); window.__play.feed({ type: "TargetCell", at: { c: 1, r: 7 } }); return { npc: npc && npc.side, foe: foe && foe.side, err, text: window.__play.talk && window.__play.talk.text }; });
      if (live.npc !== "neutral" || live.foe === "player" || live.foe === "neutral" || live.foe == null || live.text !== "Smoke hello") throw new Error(JSON.stringify(live));
      await press(page, "Back to maker"); if ((await page.locator(".cell").count()) !== 54) throw new Error("not editor");
    });
    await step("7 undo", async () => { await tap(page, "s:cell:4,0"); await tap(page, "s:delete"); await waitLabel(page, 4, 0, "Enemy", false); if (String(await label(page, 4, 0)).includes("Enemy")) throw new Error("still there"); await tap(page, "s:undo"); await waitLabel(page, 4, 0, "Enemy", true); if (!String(await label(page, 4, 0)).includes("Enemy")) throw new Error("undo lost enemy"); });
    await step("8 roam", async () => {
      await tap(page, "s:fresh"); await tap(page, "s:fresh-go"); await waitText(page, "No enemies: free roam."); const gone = await page.evaluate(() => ({ text: document.body.innerText, pills: [...document.querySelectorAll(".pill")].map((n) => n.textContent) })); if (!gone.text.includes("No enemies: free roam.") || gone.pills.some((p) => p === "NPC" || p === "Enemy")) throw new Error(JSON.stringify(gone));
      await tap(page, "s:test"); await page.waitForFunction(() => location.search.includes("stage=") && window.__play !== undefined, null, { timeout: 15000 });
      const end = await page.evaluate(() => { const play = window.__play, before = play.side; play.endTurn(); return { before, after: play.side, outcome: play.outcome }; });
      if (end.after !== end.before || end.outcome !== null) throw new Error(JSON.stringify(end));
      await press(page, "Back to maker"); await tap(page, "s:undo"); await waitLabel(page, 1, 7, "NPC", true); await waitLabel(page, 4, 0, "Enemy", true); const back = await label(page, 1, 7); if (!String(back).includes("NPC") || !String(await label(page, 4, 0)).includes("Enemy")) throw new Error(String(back));
    });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
