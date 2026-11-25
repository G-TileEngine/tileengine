// Step 10b effect data. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s10b-effect-data/smoke.mjs . 8815 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8815", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), `s10b-smoke-${REV}-`)); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const FRESH = "effect_01JDB10B00000000000000000A", LEGACY = "setup_01JDB10B00000000000000000B", ARCHER = "unit_01JDAN00000000000000000002", GONE = "effect_01JDB10B00000000000000000Z";
const doc = (id) => JSON.stringify({ kind: "behaviour-setup", formatVersion: 3, id, rev: 1, behaviourId: "effect", catalogue: { rev: 30 }, answers: { steps: { source: "user", value: [{ kind: "stamp", seconds: 0.15 }] } } });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    const put = (rel, text) => page.evaluate(async ({ rel, text }) => { const id = JSON.parse(window.__read()["project.json"]).project.id, root = await navigator.storage.getDirectory(), parts = `tileengine/projects/${id}/${rel}`.split("/"), leaf = parts.pop(); let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true }); const w = await (await dir.getFileHandle(leaf, { create: true })).createWritable(); await w.write(text); await w.close(); window.__write(rel, text); }, { rel, text });
    const setAnswer = (value) => page.evaluate(async (value) => { const id = JSON.parse(window.__read()["project.json"]).project.id, rel = "setups/setup_01JDAT00000000000000000005.json", root = await navigator.storage.getDirectory(), parts = `tileengine/projects/${id}/${rel}`.split("/"), leaf = parts.pop(); let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true }); const handle = await dir.getFileHandle(leaf), raw = JSON.parse(await (await handle.getFile()).text()); raw.answers.effect = { source: "user", value, rev: 1 }; const text = JSON.stringify(raw); const w = await handle.createWritable(); await w.write(text); await w.close(); window.__write(rel, text); }, value);
    const drop = () => page.evaluate(() => { delete window.__play; delete window.__docs; delete window.__fx; });
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await step("1 new", async () => { await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await press(page, "Demo stage"); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 }); });
    await step("2 saved", async () => {
      await put(`effects/${FRESH}.json`, doc(FRESH)); await put(`effects/${LEGACY}.json`, doc(LEGACY)); await put(`effects/.deleted/${GONE}.json`, doc(GONE)); await put("effects/talk.json", JSON.stringify({ kind: "behaviour-setup", formatVersion: 3, id: "setup_01JDB10B00000000000000000C", rev: 1, behaviourId: "talk", catalogue: { rev: 30 } }));
      await setAnswer(FRESH); await tap(page, "s:test"); await page.waitForFunction(() => window.__docs !== undefined && window.__fx !== undefined, null, { timeout: 15000 });
      const got = await page.evaluate(({ FRESH, LEGACY, ARCHER, GONE }) => { const ids = (window.__docs.effects ?? []).map((d) => d.id), fx = window.__docs.fxOf ?? {}; return { fresh: ids.includes(FRESH), legacy: ids.includes(LEGACY), gone: ids.includes(GONE) || ids.includes("setup_01JDB10B00000000000000000C"), fx: fx[`${ARCHER}|line-shot`], rev: window.__fx.values(FRESH)?.rev }; }, { FRESH, LEGACY, ARCHER, GONE });
      if (!got.fresh || !got.legacy || got.gone || got.fx !== FRESH || got.rev !== 1) throw new Error(JSON.stringify(got));
    });
    await step("3 legacy", async () => {
      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="s:test"]') !== null, null, { timeout: 15000 }); await setAnswer(LEGACY); await drop(); await tap(page, "s:test"); await page.waitForFunction(({ id, archer }) => window.__docs?.fxOf?.[`${archer}|line-shot`] === id, { id: LEGACY, archer: ARCHER }, { timeout: 15000 });
      const got = await page.evaluate(({ LEGACY, ARCHER }) => ({ fx: (window.__docs.fxOf ?? {})[`${ARCHER}|line-shot`], rev: window.__fx.values(LEGACY)?.rev }), { LEGACY, ARCHER }); if (got.fx !== LEGACY || got.rev !== 1) throw new Error(JSON.stringify(got));
    });
    await step("4 missing", async () => {
      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="s:test"]') !== null, null, { timeout: 15000 }); await setAnswer("effect_01JDB10B00000000000000000Y"); await drop(); await tap(page, "s:test"); await page.waitForFunction((archer) => window.__play !== undefined && window.__docs !== undefined && window.__docs.fxOf?.[`${archer}|line-shot`] === undefined, ARCHER, { timeout: 15000 });
      const got = await page.evaluate(({ ARCHER, FRESH, LEGACY }) => { const fx = window.__docs.fxOf ?? {}, picked = Object.values(fx); return { open: window.__play !== undefined, shot: fx[`${ARCHER}|line-shot`] ?? null, picked: picked.includes(FRESH) || picked.includes(LEGACY), stock: window.__fx.values("line-shot") !== null }; }, { ARCHER, FRESH, LEGACY });
      if (!got.open || got.shot !== null || got.picked || !got.stock) throw new Error(JSON.stringify(got));
    });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
