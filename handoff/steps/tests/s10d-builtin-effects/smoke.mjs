// Step 10d built-in effects. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s10d-builtin-effects/smoke.mjs . 8817 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8817", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), `s10d-smoke-${REV}-`)); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const ARCHER = "unit_01JDAN00000000000000000002", LINE = "setup_01JDAT00000000000000000005", HOLY = "btf-holy-blade";
const tap = async (page, act) => { const got = await page.waitForFunction((act) => { const el = document.querySelector(`[data-act="${act}"]`); if (!(el instanceof HTMLElement)) return null; if (document.querySelector(".scrim") !== null && el.closest(".scrim") === null) return null; el.scrollIntoView({ block: "center", inline: "nearest" }); const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; const top = document.elementFromPoint(x, y); return top !== null && top.closest("[data-act]") === el ? { x, y } : null; }, act, { timeout: 15000 }); const pos = await got.jsonValue(); if (pos === null || typeof pos.x !== "number") throw new Error(`no ${act}`); await page.touchscreen.tap(pos.x, pos.y); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const openLine = async (page) => { await tap(page, `u:open:${ARCHER}`); await page.waitForFunction((line) => document.querySelector(".scrim") === null && document.querySelector(`[data-act="a:open:${line}"]`) !== null, LINE, { timeout: 15000 }); await tap(page, `a:open:${LINE}`); await page.waitForFunction((id) => document.querySelector(".scrim") === null && document.querySelector(`[data-act="a:fx:${id}"]`) !== null && document.querySelector('[data-act="a:shut"]') !== null, HOLY, { timeout: 15000 }); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
    await step("1 builtins", async () => {
      await openLine(page);
      const got = await page.evaluate(() => ({ btf: document.querySelectorAll('[data-act^="a:fx:btf-"]').length, te: document.querySelector('[data-act^="a:fx:te-"]') !== null, head: document.body.innerText.includes("Built-in") }));
      if (got.btf !== 10 || got.te || !got.head) throw new Error(JSON.stringify(got));
    });
    await step("2 pick undo", async () => {
      await tap(page, `a:fx:${HOLY}`);
      await page.waitForFunction((id) => { const files = window.__read(), setup = JSON.parse(files["setups/setup_01JDAT00000000000000000005.json"]), slice = JSON.parse(files["catalogue/slice.json"]); return setup.answers?.effect?.value === id && slice.behaviours.some((row) => row.id === "effect"); }, HOLY, { timeout: 15000 });
      await tap(page, "a:shut");
      await page.waitForFunction((line) => document.querySelector('[data-act="a:shut"]') === null && document.querySelector(`[data-act="a:test:${line}"]`) !== null, LINE, { timeout: 15000 });
      await tap(page, "u:back");
      await page.waitForFunction(() => document.querySelector('[data-act="undo"]') !== null, null, { timeout: 15000 });
      await tap(page, "undo");
      await page.waitForFunction((id) => { const files = window.__read(), setup = JSON.parse(files["setups/setup_01JDAT00000000000000000005.json"]), slice = JSON.parse(files["catalogue/slice.json"]); return setup.answers?.effect?.value !== id && !slice.behaviours.some((row) => row.id === "effect"); }, HOLY, { timeout: 15000 });
    });
    await step("3 test", async () => {
      await openLine(page);
      await tap(page, `a:fx:${HOLY}`);
      await page.waitForFunction((id) => document.querySelector(`[data-act="a:fx:${id}"]`)?.getAttribute("aria-pressed") === "true", HOLY, { timeout: 15000 });
      await tap(page, "a:shut");
      await page.waitForFunction((line) => document.querySelector('[data-act="a:shut"]') === null && document.querySelector(`[data-act="a:test:${line}"]`) !== null, LINE, { timeout: 15000 });
      await tap(page, `a:test:${LINE}`);
      await page.waitForFunction(({ id, archer }) => window.__docs?.fxOf?.[`${archer}|line-shot`] === id && window.__fx?.values(id)?.values?.tint === "#f4d56a", { id: HOLY, archer: ARCHER }, { timeout: 15000 });
    });
    await step("4 none stock", async () => {
      await press(page, "Back to maker");
      await page.waitForFunction((archer) => document.querySelector('[data-act="u:back"]') !== null || document.querySelector(`[data-act="u:open:${archer}"]`) !== null, ARCHER, { timeout: 15000 });
      if (await page.locator('[data-act="u:back"]').count() === 0) await openLine(page);
      else {
        await page.waitForFunction((line) => document.querySelector(`[data-act="a:open:${line}"]`) !== null || document.querySelector('[data-act="a:shut"]') !== null, LINE, { timeout: 15000 });
        if (await page.locator(`[data-act="a:open:${LINE}"]`).count()) await tap(page, `a:open:${LINE}`);
      }
      await page.waitForFunction(() => document.querySelector('[data-act="a:fx:none"]') !== null, null, { timeout: 15000 });
      await tap(page, "a:fx:none");
      await tap(page, "a:shut");
      await page.waitForFunction((line) => document.querySelector(`[data-act="a:test:${line}"]`) !== null, LINE, { timeout: 15000 });
      await tap(page, `a:test:${LINE}`);
      await page.waitForFunction((archer) => window.__play !== undefined && window.__docs?.fxOf?.[`${archer}|line-shot`] === undefined, ARCHER, { timeout: 15000 });
    });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
