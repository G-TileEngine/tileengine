// Step 11c1 budgets. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s11c1-budgets/smoke.mjs . 8823 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8823", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), `s11c1-smoke-${REV}-`)); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const out = join(root, `handback/step-11c1-budgets/${REV}`); mkdirSync(out, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const LINE = "Demo stage: 2 units take AI turns. The limit is 1. Remove some or put them on your team.";
const OVER = { units: { warn: 7, limit: 9 }, activeAi: { warn: 1, limit: 1 }, effects: { warn: 8, limit: 12 }, stageTiles: { warn: 16384, limit: 65536 } }, NEAR = { units: { warn: 7, limit: 9 }, activeAi: { warn: 12, limit: 24 }, effects: { warn: 8, limit: 12 }, stageTiles: { warn: 16384, limit: 65536 } };
const tap = async (page, act) => { const got = await page.waitForFunction((act) => { const el = document.querySelector(`[data-act="${act}"]`); if (!(el instanceof HTMLElement)) return null; if (document.querySelector(".scrim") !== null && el.closest(".scrim") === null) return null; el.scrollIntoView({ block: "center", inline: "nearest" }); const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; const top = document.elementFromPoint(x, y); return top !== null && top.closest("[data-act]") === el ? { x, y } : null; }, act, { timeout: 15000 }); const pos = await got.jsonValue(); if (pos === null || typeof pos.x !== "number") throw new Error(`no ${act}`); await page.touchscreen.tap(pos.x, pos.y); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const putBudgets = (page, budgets) => page.evaluate(async (budgets) => { const id = JSON.parse(window.__read()["project.json"]).project.id, rel = "project.json", root = await navigator.storage.getDirectory(), parts = `tileengine/projects/${id}/${rel}`.split("/"), leaf = parts.pop(); let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true }); const handle = await dir.getFileHandle(leaf), raw = JSON.parse(await (await handle.getFile()).text()); raw.project.settings.budgets = budgets; const text = JSON.stringify(raw); const w = await handle.createWritable(); await w.write(text); await w.close(); window.__write(rel, text); }, budgets);
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(out, `${name}.png`), scale: "css" }); };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" }); await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
    await step("1 all good", async () => {
      await page.waitForFunction(() => document.querySelector('[data-act="budgets"]')?.textContent?.includes("Budgets: all good"), null, { timeout: 15000 });
      const pos = await page.evaluate(() => document.querySelector("[data-budgets]")?.nextElementSibling?.getAttribute("data-act") ?? ""); if (pos !== "build") throw new Error(pos || "no row"); await tap(page, "budgets");
      const got = await page.waitForFunction(() => { const rows = [...document.querySelectorAll("p.budget")].map((p) => `${p.textContent}|${p.querySelector("meter")?.getAttribute("aria-hidden")}`); return rows.length === 4 ? rows : null; }, null, { timeout: 15000 }); const rows = await got.jsonValue();
      if (JSON.stringify(rows) !== JSON.stringify(["Units 7 of 80|true", "Active AI 2 of 24|true", "Effects 0 of 12|true", "Stage size 54 of 65536|true"])) throw new Error(JSON.stringify(rows));
      await tap(page, "budgets"); await page.waitForFunction(() => document.querySelector("p.budget") === null && document.querySelector('[data-act="budgets"]')?.getAttribute("aria-expanded") === "false", null, { timeout: 15000 });
    });
    await step("2 over", async () => {
      await putBudgets(page, OVER); await page.waitForFunction(() => document.querySelector('[data-act="budgets"]')?.textContent === "Budgets: 1 over the limit", null, { timeout: 15000 }); await shot("01-budgets-collapsed"); await tap(page, "budgets");
      await page.waitForFunction(() => { const u = document.querySelector('[data-budget="units"]')?.textContent ?? "", a = document.querySelector('[data-budget="activeAi"]')?.textContent ?? "", e = document.querySelector('[data-budget="effects"]')?.textContent ?? ""; return u.includes("7 of 9 · near limit") && a.includes("2 of 1 · over limit") && e.includes("0 of 12") && !e.includes("·") && document.querySelectorAll('meter[aria-hidden="true"]').length === 4; }, null, { timeout: 15000 }); await shot("02-budgets-expanded");
    });
    await step("3 gate", async () => {
      await page.evaluate(() => { delete window.__play; }); await tap(page, "test");
      await page.waitForFunction((line) => document.body.innerText.includes("Can't play yet") && document.body.innerText.includes(line) && window.__play === undefined, LINE, { timeout: 15000 }); const h = await page.evaluate(() => document.querySelector(".project .sheet")?.getBoundingClientRect().height ?? 0); if (!(h > 0)) throw new Error(`sheet ${h}`); await shot("03-gate-budget");
      await tap(page, "fix"); await page.waitForFunction(() => !document.body.innerText.includes("Can't play yet"), null, { timeout: 15000 }); await tap(page, "build");
      await page.waitForFunction((line) => document.body.innerText.includes(line) && document.querySelector('[data-sheet="build"]') === null && document.querySelector('[data-act="build"]')?.getAttribute("aria-busy") !== "true", LINE, { timeout: 15000 });
      await putBudgets(page, NEAR); await tap(page, "fix"); await page.evaluate(() => { delete window.__play; }); await tap(page, "test"); await page.waitForFunction(() => window.__play !== undefined, null, { timeout: 15000 });
    });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
