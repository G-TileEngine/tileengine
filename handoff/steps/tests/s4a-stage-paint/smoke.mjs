// Step 4a stage paint smoke. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8799"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s4a-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/local/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); await page.waitForTimeout(120); return box; };
const settle = async (page, fn) => page.waitForFunction(fn, null, { timeout: 8000 });
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); await page.waitForTimeout(80); };
const tile = (page, c, r) => page.locator(`[data-act="s:cell:${c},${r}"]`).getAttribute("data-tile");
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e)); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage");
    await step("1 grid", async () => { const grid = await page.evaluate(() => { const cells = [...document.querySelectorAll(".cell")]; const box = cells[0].getBoundingClientRect(); return { n: cells.length, w: box.width, h: box.height }; }); if (grid.n !== 54 || grid.w < 48 || grid.h < 48) throw new Error(JSON.stringify(grid)); });
    await step("2 sheet", async () => { await tap(page, "s:cell:0,0"); const got = await page.evaluate(() => { const rows = [...document.querySelectorAll(".sheet .pick")].map((b) => b.textContent); const small = [...document.querySelectorAll("button")].map((b) => b.getBoundingClientRect()).filter((b) => b.width > 0 && (b.width < 48 || b.height < 48)); return { rows, small: small.length, title: document.querySelector(".sheet h2")?.textContent, here: document.body.innerText.includes("Tile 0,0") }; }); if (got.title !== "Add here" || !got.here || got.rows.join("|") !== "Floor|Water|Wall block" || got.small !== 0) throw new Error(JSON.stringify(got)); });
    await step("3 paint", async () => { await tap(page, "s:type:water"); await tap(page, "s:cell:1,0"); await tap(page, "s:done"); await settle(page, () => document.querySelector(".chip") === null); const a = await tile(page, 0, 0), b = await tile(page, 1, 0), chip = await page.locator(".chip").count(); if (a !== "water" || b !== "water" || chip !== 0) throw new Error(`${a} ${b} chip ${chip} ${await page.locator(".banner").textContent()}`); });
    await step("4 occupied", async () => { await tap(page, "s:cell:2,0"); const got = await page.evaluate(() => ({ rows: [...document.querySelectorAll(".sheet .pick")].map((b) => b.textContent), note: (document.querySelector(".sheet h2")?.textContent ?? "").includes(" · ") })); if (got.rows.join("|") !== "Floor" || !got.note) throw new Error(JSON.stringify(got)); await tap(page, "s:close"); });
    await step("5 undo", async () => { await tap(page, "s:undo"); await settle(page, () => document.querySelector('[data-act="s:cell:0,0"]')?.getAttribute("data-tile") === "floor"); const a = await tile(page, 0, 0), b = await tile(page, 1, 0); if (a !== "floor" || b !== "floor") throw new Error(`${a} ${b}`); });
    await step("6 test", async () => {
      await tap(page, "s:cell:0,0"); await tap(page, "s:type:water"); await tap(page, "s:done"); await settle(page, () => document.querySelector(".chip") === null); await tap(page, "s:test");
      await page.waitForFunction(() => location.search.includes("stage=") && window.__play !== undefined, null, { timeout: 15000 });
      await page.evaluate(() => window.__hud.hideBanner());
      const live = await page.evaluate(() => { const units = window.__play.world.units.all(); const knight = units.find((u) => String(u.unitId).endsWith("000001")); return { water: window.__play.world.grid.tileTypeAt({ c: 0, r: 0 }).id, knight: knight !== undefined && knight.at.c === 0 && knight.at.r === 8, stage: new URLSearchParams(location.search).get("stage") }; });
      if (live.water !== "water" || !live.knight || live.stage !== "stage_01JDAS00000000000000000001") throw new Error(JSON.stringify(live));
      await press(page, "Back to maker"); const back = await page.evaluate(() => ({ name: document.querySelector("h1")?.textContent, cells: document.querySelectorAll(".cell").length })); if (!String(back.name).includes("Demo stage") || back.cells !== 54) throw new Error(JSON.stringify(back));
    });
    await step("7 start new", async () => {
      await tap(page, "s:fresh"); await tap(page, "s:close"); if (await tile(page, 0, 0) !== "water") throw new Error("cancel painted");
      await tap(page, "s:fresh"); await tap(page, "s:fresh-go"); await settle(page, () => [...document.querySelectorAll(".cell")].every((b) => b.getAttribute("data-tile") === "floor")); const all = await page.evaluate(() => [...document.querySelectorAll(".cell")].every((b) => b.getAttribute("data-tile") === "floor")); if (!all) throw new Error("not floor");
      await tap(page, "s:undo"); await settle(page, () => document.querySelector('[data-act="s:cell:0,0"]')?.getAttribute("data-tile") === "water"); if (await tile(page, 0, 0) !== "water") throw new Error("undo lost water");
    });
    await step("8 reload", async () => { await page.goto(`${origin}/maker/`, { waitUntil: "load" }); await press(page, "My game"); await press(page, "Demo stage"); const a = await tile(page, 0, 0); if (a !== "water") throw new Error(String(a)); });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
