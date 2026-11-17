// ED-E7 kit-run browser smoke (E6 + the E7 carries + page 2) (the builder runs it; 0 repo lines): node smoke.mjs <worktree> [port] [shot.png]
// Env: PLAYWRIGHT_CORE = playwright-core package dir, CHROME = Chrome binary. Headless 390x844 @3x, touch. Exits 1 on any FAIL.
// Steps: Fit scale at open; carries (Save & use, Undo, Redo, Undo, reload purge, D8 redo with its .deleted copy gone), then page 2: chips + meter, Shelf two, Take a layer, Blend + Swap + Mix + trim Undo, Breed 3 at a time, Dice strip,
// house style blank, Advanced beat row, Save & use of a blend; then 4 bad owner files, Turn/zoom, touch targets, rAF, no localStorage/IndexedDB (D8.2), page errors.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
const PW = process.env.PLAYWRIGHT_CORE ?? "/usr/local/lib/pnpm/5/.pnpm/playwright-core@1.59.1/node_modules/playwright-core/";
const { chromium } = createRequire(PW.endsWith("/") ? PW : `${PW}/`)(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8791", SHOT = "smoke-390x844.png"] = process.argv; let bad = 0;
const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [shot.png]"); process.exit(2); }
const srv = spawn("node", ["-e", `import("./tools/serve.ts").then((m) => m.serve(${PORT})).then(() => console.log("up"))`], { cwd: WT, stdio: ["ignore", "pipe", "pipe"] });
await new Promise((ok, no) => { srv.stdout.on("data", (d) => String(d).includes("up") && ok()); srv.on("exit", (c) => no(new Error(`serve exit ${c}`))); setTimeout(() => no(new Error("serve timeout")), 15000); });
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox"] });
try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }), page = await ctx.newPage(), errs = [];
  page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => { if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) errs.push(`console: ${m.text()}`); }); page.on("response", (r) => { if (r.status() >= 400 && !r.url().endsWith("/favicon.ico")) errs.push(`http ${r.status()}: ${r.url()}`); });
  await page.addInitScript(() => { const raf = window.requestAnimationFrame.bind(window), w = window; w.__raf = new Map(); window.requestAnimationFrame = (cb) => raf((ts) => { w.__raf.set(ts, (w.__raf.get(ts) ?? 0) + 1); cb(ts); }); });
  const url = `http://127.0.0.1:${PORT}/tools/effect-designer/?for=basic-attack&kind=melee`, toast = async () => ((await page.textContent("#toast")) ?? "").trim();
  const ls = () => page.evaluate(async () => { const walk = async (d, p) => { const o = []; for await (const [n, h] of d.entries()) o.push(...(h.kind === "directory" ? await walk(h, `${p}${n}/`) : [`${p}${n}`])); return o; }; return (await walk(await navigator.storage.getDirectory(), "")).sort(); });
  const tap = async (sel, text) => { await page.locator(sel, { hasText: text }).first().click(); await page.waitForTimeout(500); };
  const raf = () => page.evaluate(() => { const v = [...window.__raf.values()]; return { frames: v.length, multi: v.filter((n) => n > 1).length }; });
  await page.goto(url, { waitUntil: "load" }); await page.waitForTimeout(800); await tap("#grid button", "Slash"); await page.waitForTimeout(1000);
  const px = await page.evaluate(() => { const c = document.getElementById("strip"), g = document.createElement("canvas"); g.width = c.width; g.height = c.height; const x = g.getContext("2d"); x.drawImage(c, 0, 0); const d = x.getImageData(0, 0, g.width, g.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n += 1; return n; });
  check("strip paints", px > 0, `${px} painted px`);
  const fitted = await page.evaluate(() => { const c = document.getElementById("strip"); return { on: [...document.querySelectorAll("#checks button[aria-pressed=true]")].map((b) => b.textContent), w: c.width, h: c.height, s: Math.floor(Math.min((c.clientWidth * devicePixelRatio) / 48, (c.clientHeight * devicePixelRatio) / 32)) }; });
  check("strip opens at the largest fitting scale (UX r2)", fitted.on.join() === "Fit" && fitted.s >= 3, `${JSON.stringify(fitted.on)} canvas ${fitted.w}x${fitted.h}, scale ${fitted.s} (${(fitted.s / 3).toFixed(1)}x css)`);
  await page.click("#save"); await page.waitForTimeout(800); const saved = await ls(), effect = saved.find((f) => /^effects\/setup_[0-9A-HJKMNP-TV-Z]{26}\.json$/.test(f));
  check("Save & use", /^Saved 'Slash arc' and basic-attack uses it\. One undo\./.test(await toast()) && effect !== undefined && saved.includes("setups/basic-attack.json"), `${JSON.stringify((await toast()).slice(0, 50))} ${JSON.stringify(saved)}`);
  await tap("#toast button", "Undo"); const undone = await ls(); check("Undo", (await toast()).startsWith("Undone.") && undone.includes(`effects/.deleted/${effect?.slice(8)}`) && !undone.includes(effect), JSON.stringify(undone));
  await tap("#toast button", "Redo"); const redone = await ls(); check("Redo", (await toast()).startsWith("Redone. One undo.") && redone.includes(effect) && !redone.some((f) => f.startsWith("effects/.deleted/")), JSON.stringify(redone));
  const owner = await page.evaluate(async () => JSON.parse(await (await (await (await (await navigator.storage.getDirectory()).getDirectoryHandle("setups")).getFileHandle("basic-attack.json")).getFile()).text()));
  check("owner uses it after Redo", owner.answers?.effect?.value === effect?.slice(8, -5) && owner.history.ops.at(-1)?.kind === "redo", `effect=${JSON.stringify(owner.answers?.effect?.value)} last op ${owner.history.ops.at(-1)?.kind}`);
  await tap("#toast button", "Undo"); check("Undo again", (await ls()).some((f) => f.startsWith("effects/.deleted/")), JSON.stringify(await ls()));
  await page.reload({ waitUntil: "load" }); await page.waitForTimeout(1000); const purged = await ls(); check("reload purges effects/.deleted/ (S2)", !purged.some((f) => f.startsWith("effects/.deleted/")), JSON.stringify(purged));
  await tap("#grid button", "Slash"); await page.click("#save"); await page.waitForTimeout(800); await tap("#toast button", "Undo"); const trashed = (await ls()).filter((f) => f.startsWith("effects/.deleted/"));
  await page.evaluate(async (n) => { const d = await (await (await navigator.storage.getDirectory()).getDirectoryHandle("effects")).getDirectoryHandle(".deleted"); await d.removeEntry(n); }, trashed[0]?.slice(17) ?? "?"); const left = await ls();
  await tap("#toast button", "Redo"); check("D8.1(a) redo with its .deleted copy gone fails cleanly", /^Not redone: its deleted copy is gone/.test(await toast()) && (await page.locator("#toast button", { hasText: "Redo" }).count()) === 0 && JSON.stringify(await ls()) === JSON.stringify(left), `${JSON.stringify((await toast()).slice(0, 80))} ${JSON.stringify(await ls())}`);
  const texts = (sel) => page.locator(sel).allTextContents(), label = () => page.evaluate(() => document.querySelector("#grid button[aria-pressed=true]")?.textContent ?? null);
  await tap("#grid button", "Slash"); check("layer chips + meter (UX-L1)", (await texts("#layers button")).join(",") === "shape,punch" && /^Particles \d+ of 48 · Draws \d+ of 60$/.test((await texts("#meter span"))[0] ?? ""), `${JSON.stringify(await texts("#layers button"))} ${JSON.stringify(await texts("#meter span"))}`);
  await tap("#shelf button", "Shelf it"); await tap("#intents button", "Slash"); await tap("#grid button", "Pop"); await tap("#shelf button", "Shelf it"); await tap("#grid button", "Arrow");
  check("shelf (UX-L5)", (await texts("#shelf button")).join(",") === "Shelf it,Pop,Slash arc", JSON.stringify(await texts("#shelf button")));
  await tap("#shelf button", "Pop"); const takes = await texts("#blend button"); check("Take a layer offers the other card's layers (UX-L4)", takes.join(",") === "Take its sparks,Take its punch", JSON.stringify(takes));
  await tap("#blend button", "Take its sparks"); check("Take its sparks", (await texts("#layers button")).join(",") === "shape A,sparks B", JSON.stringify(await texts("#layers button")));
  await tap("#shelf button", "Slash arc"); await tap("#blend button", "Blend with…"); const chipsAB = await texts("#layers button");
  check("Blend card + A/B badges (UX-L3)", chipsAB.some((t) => / (A|B|A\+B)$/.test(t)) && (await texts("#blend span"))[0] === "Base Pop", `${JSON.stringify(chipsAB)} ${JSON.stringify(await texts("#blend span"))}`);
  const trim = await texts("#meter span"); check("trim line never silent, with Undo", trim.length === 2 && (await texts("#meter button")).join() === "Undo", JSON.stringify(trim));
  await tap("#meter button", "Undo"); check("trim Undo goes back one", (await texts("#layers button")).join(",") === "shape A,sparks B", JSON.stringify(await texts("#layers button")));
  await tap("#blend button", "Swap"); check("Swap", (await texts("#blend span"))[0] === "Base Slash arc", JSON.stringify(await texts("#blend span")));
  await tap("#blend button", "75"); check("Mix snaps", (await page.locator("#blend button[aria-pressed=true]").allTextContents()).join() === "75", JSON.stringify(await page.locator("#blend button[aria-pressed=true]").allTextContents()));
  await tap("#breed button", "Breed"); const kids = await texts("#breed button"); check("Breed 3 at a time (UX-B1)", kids.join(",") === "Breed,Child 1,Child 2,Child 3,Next 3", JSON.stringify(kids));
  await tap("#breed button", "Next 3"); check("Next 3 plays child 4", (await page.locator("#breed button[aria-pressed=true]").allTextContents()).join() === "Child 4", JSON.stringify(await texts("#breed button")));
  await tap("#layers button", "sparks"); await tap("#dice button", "Dice sparks"); await tap("#dice button", "Dice sparks"); const dice = await texts("#dice button"); check("dice strip (UX-L6)", dice.join(",") === "Dice sparks,#1,#2", JSON.stringify(dice));
  await tap("#dice button", "#2"); check("a roll replays", (await texts("#dice button")).length === 3, JSON.stringify(await texts("#dice button")));
  await tap("#house button", "Punch 2"); await tap("#house button", "Motes"); await tap("#house button", "New blank"); check("house style blank (UX-L7)", (await texts("#layers button")).join(",") === "sparks,punch", JSON.stringify(await texts("#layers button")));
  await page.locator("details summary").click(); await page.waitForTimeout(300); const beats = await texts("#beats span"); check("Advanced beat row, Travel with no 'arrives later' label", beats.length === 4 && /^Cast /.test(beats[0]) && /^Travel /.test(beats[1]) && !/later/i.test(await page.textContent("body")), JSON.stringify(beats));
  await tap("#shelf button", "Pop"); await tap("#shelf button", "Pop"); await tap("#blend button", "Blend with…"); const picks = await texts("#picks button"); check("per-key picks (Advanced)", picks.length > 0 && picks.every((t) => / both$/.test(t)), JSON.stringify(picks)); await tap("#picks button", picks[0] ?? "?"); check("a key cycles to A", (await texts("#picks button"))[0]?.endsWith(" a") === true, JSON.stringify((await texts("#picks button"))[0])); const blended = (await texts("#blend span"))[0];
  await page.click("#save"); await page.waitForTimeout(800); check("Save & use a blend", /^Saved 'Slash arc × Pop' and basic-attack uses it\. One undo\./.test(await toast()), `${blended} ${JSON.stringify((await toast()).slice(0, 60))}`);
  const px2 = await page.evaluate(() => { const c = document.getElementById("strip"), g = document.createElement("canvas"); g.width = c.width; g.height = c.height; const x = g.getContext("2d"); x.drawImage(c, 0, 0); const d = x.getImageData(0, 0, g.width, g.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n += 1; return n; }); check("strip paints the blend", px2 > 0, `${px2} px; label ${await label()}`);
  for (const [label, text] of [["junk", "{"], ["null", "null"], ["array", "[]"], ["{}", "{}"]]) {
    await page.evaluate(async (t) => { const d = await (await navigator.storage.getDirectory()).getDirectoryHandle("setups", { create: true }), w = await (await d.getFileHandle("basic-attack.json", { create: true })).createWritable(); await w.write(t); await w.close(); }, text);
    await tap("#grid button", "Slash"); await page.click("#save"); await page.waitForTimeout(600); const kept = await page.evaluate(async () => (await (await (await (await navigator.storage.getDirectory()).getDirectoryHandle("setups")).getFileHandle("basic-attack.json")).getFile()).text());
    check(`owner ${label} refused`, /^Not saved: can't read setups\/basic-attack\.json/.test(await toast()) && kept === text, JSON.stringify((await toast()).slice(0, 70)));
  }
  for (const t of ["Turn", "1×", "2×", "3×", "Turn"]) await tap("#checks button", t);
  await page.evaluate(() => window.__raf.clear()); await page.waitForTimeout(1500); const r = await raf(); check("one rAF callback per frame", r.frames > 30 && r.multi === 0, `${r.frames} frames, ${r.multi} with >1`);
  const small = await page.evaluate(() => [...document.querySelectorAll("button")].map((b) => { const q = b.getBoundingClientRect(); return { t: b.textContent, w: Math.round(q.width), h: Math.round(q.height) }; }).filter((b) => b.w < 44 || b.h < 44));
  check("touch targets >= 44x44", small.length === 0, `${await page.locator("button").count()} buttons, small ${JSON.stringify(small)}`);
  const wide = await page.evaluate(() => document.documentElement.scrollWidth); check("no sideways scroll at 390", wide <= 390, `scrollWidth ${wide}`);
  const kept = await page.evaluate(async () => ({ ls: localStorage.length, ss: sessionStorage.length, idb: (await indexedDB.databases()).length })); check("D8.2 no localStorage, sessionStorage or IndexedDB", kept.ls === 0 && kept.ss === 0 && kept.idb === 0, JSON.stringify(kept));
  await page.screenshot({ path: SHOT, fullPage: true }); check("page errors", errs.length === 0, errs.length ? errs.join(" | ") : "none");
} catch (e) { check("no step timed out", false, String(e).split("\n")[0]); } finally { await browser.close(); srv.kill(); }
console.log(bad === 0 ? "SMOKE PASS" : `SMOKE FAIL (${bad})`); process.exit(bad === 0 ? 0 : 1);
