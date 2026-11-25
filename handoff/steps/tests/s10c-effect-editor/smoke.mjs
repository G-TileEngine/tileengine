// Step 10c effect editor. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s10c-effect-editor/smoke.mjs . 8816 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8816", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), `s10c-smoke-${REV}-`)); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const ARCHER = "unit_01JDAN00000000000000000002", LINE = "setup_01JDAT00000000000000000005", ID = /^effect_[0-9A-HJKMNP-TV-Z]{26}$/;
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const slide = async (page, sel, value) => { const node = page.locator(sel); await node.waitFor({ timeout: 15000 }); await node.evaluate((el, v) => { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); }, value); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
    let id = "";
    await step("1 empty", async () => { await page.waitForFunction(() => document.body.innerText.includes("Effects") && !document.body.innerText.includes("Not used yet") && document.querySelector('[data-act="e:new"]') !== null, null, { timeout: 15000 }); });
    await step("2 new shake", async () => {
      await tap(page, "e:new"); await page.waitForFunction(() => document.querySelector('[data-knob="shake"]') !== null, null, { timeout: 15000 }); await slide(page, '[data-knob="shake"]', "2");
      await page.waitForFunction(() => Object.entries(window.__read()).some(([p, text]) => p.startsWith("effects/") && !p.slice(8).includes("/") && JSON.parse(text).answers?.shake?.value === 2), null, { timeout: 15000 });
      id = await page.evaluate(() => { const hit = Object.entries(window.__read()).find(([p]) => p.startsWith("effects/") && !p.slice(8).includes("/")); return hit ? JSON.parse(hit[1]).id : ""; });
      if (!ID.test(id)) throw new Error(id || "no id");
    });
    await step("3 row and test", async () => {
      await tap(page, "e:close"); await tap(page, `u:open:${ARCHER}`); await tap(page, `a:open:${LINE}`);
      await page.waitForFunction((id) => document.querySelector(`[data-act="a:fx:${id}"]`) !== null && document.querySelector('[data-act="a:fx:none"]') !== null, id, { timeout: 15000 });
      await tap(page, `a:fx:${id}`); await page.evaluate(() => { const b = document.createElement("button"); b.setAttribute("data-act", "a:fx:effect_01JDB10C00000000000000000Y"); document.body.appendChild(b); b.click(); b.remove(); });
      await tap(page, "a:shut"); await tap(page, `a:test:${LINE}`);
      await page.waitForFunction(({ id, archer }) => window.__docs?.fxOf?.[`${archer}|line-shot`] === id && window.__fx?.values(id)?.values?.shake === 2, { id, archer: ARCHER }, { timeout: 15000 });
    });
    await step("4 dup delete undo", async () => {
      await press(page, "Back to maker"); await page.waitForFunction(() => document.querySelector('[data-act="u:back"]') !== null || document.querySelector('[data-act="e:new"]') !== null, null, { timeout: 15000 });
      if (await page.locator('[data-act="u:back"]').count()) await tap(page, "u:back");
      await tap(page, `e:menu:${id}`); await tap(page, "e:dup"); await page.waitForFunction(() => document.body.innerText.includes("Effect 1 copy"), null, { timeout: 15000 }); await tap(page, "e:none");
      await page.waitForFunction((id) => { const files = window.__read(), setup = JSON.parse(files["setups/setup_01JDAT00000000000000000005.json"]); return files[`effects/${id}.json`] === undefined && files[`effects/.deleted/${id}.json`] !== undefined && setup.answers.effect.value === "none"; }, id, { timeout: 15000 });
      await tap(page, "undo"); await page.waitForFunction((id) => { const files = window.__read(), setup = JSON.parse(files["setups/setup_01JDAT00000000000000000005.json"]); return files[`effects/${id}.json`] !== undefined && files[`effects/.deleted/${id}.json`] === undefined && setup.answers.effect.value === id && Object.values(files).some((text) => { try { return JSON.parse(text).name === "Effect 1 copy"; } catch { return false; } }); }, id, { timeout: 15000 });
    });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
