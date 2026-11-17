// P1-6 kit-run browser smoke (the builder runs it; 0 repo lines): node smoke.mjs <worktree> [port] [shot.png]
// Env: PLAYWRIGHT_CORE = playwright-core package dir, CHROME = Chrome binary. Headless 390x844 and 360 wide @3x, touch. Exits 1 on any FAIL.
// Steps: open play-stage, no page errors, no sideways scroll, 44px targets, rAF, select a knight, blue reach tiles, two-tap walk, unit arrives.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
const PW = process.env.PLAYWRIGHT_CORE ?? "/usr/local/lib/pnpm/5/.pnpm/playwright-core@1.59.1/node_modules/playwright-core/";
const { chromium } = createRequire(PW.endsWith("/") ? PW : `${PW}/`)(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8792", SHOT = "smoke-390x844.png"] = process.argv; let bad = 0;
const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [shot.png]"); process.exit(2); }
const srv = spawn("node", ["-e", `import("./tools/serve.ts").then((m) => m.serve(${PORT})).then(() => console.log("up"))`], { cwd: WT, stdio: ["ignore", "pipe", "pipe"] });
await new Promise((ok, no) => { srv.stdout.on("data", (d) => String(d).includes("up") && ok()); srv.on("exit", (c) => no(new Error(`serve exit ${c}`))); setTimeout(() => no(new Error("serve timeout")), 15000); });
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox"] });
try {
  const run = async (width, height, shot) => {
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }), page = await ctx.newPage(), errs = [];
    page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => { if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) errs.push(`console: ${m.text()}`); }); page.on("response", (r) => { if (r.status() >= 400 && !r.url().endsWith("/favicon.ico")) errs.push(`http ${r.status()}: ${r.url()}`); });
    await page.addInitScript(() => { const raf = window.requestAnimationFrame.bind(window), w = window; w.__raf = new Map(); window.requestAnimationFrame = (cb) => raf((ts) => { w.__raf.set(ts, (w.__raf.get(ts) ?? 0) + 1); cb(ts); }); });
    await page.goto(`http://127.0.0.1:${PORT}/tools/play-stage/`, { waitUntil: "load" });
    await page.waitForFunction(() => window.__play !== undefined, null, { timeout: 15000 });
    await page.waitForTimeout(600);
    const wide = await page.evaluate(() => document.documentElement.scrollWidth);
    check(`no sideways scroll at ${width}`, wide <= width, `scrollWidth ${wide}`);
    const small = await page.evaluate(() => [...document.querySelectorAll("button")].map((b) => { const q = b.getBoundingClientRect(); return { t: b.textContent, w: Math.round(q.width), h: Math.round(q.height) }; }).filter((b) => b.w < 44 || b.h < 44));
    check(`touch targets >= 44x44 at ${width}`, small.length === 0, `${await page.locator("button").count()} buttons, small ${JSON.stringify(small)}`);
    const started = await page.evaluate(() => {
      const play = window.__play, knight = play.world.units.all().find((u) => u.unitId === "knight" && u.alive);
      if (!knight) return { ok: false, why: "no knight" };
      play.intend({ type: "SelectUnit", unitId: knight.id });
      return { ok: true, id: knight.id, start: { c: knight.at.c, r: knight.at.r }, reach: play.reach.length, overlays: play.scene().overlays.length, phase: play.world.phases.battle };
    });
    check(`select knight at ${width}`, started.ok && started.reach >= 1 && started.overlays === started.reach && started.phase === "unitSelected", JSON.stringify(started));
    const walked = await page.evaluate(async () => {
      const play = window.__play, dest = play.reach[0], start = play.world.units.get(play.selected)?.at;
      if (!dest) return { ok: false, why: "no dest" };
      const preview = play.intend({ type: "TargetCell", at: dest });
      const before = play.world.units.get(play.selected)?.at;
      play.intend({ type: "TargetCell", at: dest });
      const moving = play.world.phases.battle;
      const t0 = performance.now();
      while (play.walk !== null && performance.now() - t0 < 4000) { /* rAF advances the clock */ await new Promise((r) => requestAnimationFrame(r)); play.sync(); }
      const end = play.world.units.get(play.selected)?.at ?? play.world.units.all().find((u) => u.id === startedId())?.at;
      function startedId() { return play.world.units.all().find((u) => u.unitId === "knight" && u.alive)?.id; }
      return { ok: true, preview: "preview" in preview, stayed: before && start && before.c === start.c && before.r === start.r, moving, phase: play.world.phases.battle, dest, end, walk: play.walk };
    });
    check(`two-tap walk at ${width}`, walked.ok && walked.preview && walked.stayed && walked.moving === "moving" && walked.phase === "idle" && walked.end && walked.dest && walked.end.c === walked.dest.c && walked.end.r === walked.dest.r && walked.walk === null, JSON.stringify(walked));
    await page.evaluate(() => window.__raf.clear()); await page.waitForTimeout(800);
    const r = await page.evaluate(() => { const v = [...window.__raf.values()]; return { frames: v.length, multi: v.filter((n) => n > 1).length }; });
    check(`one rAF callback per frame at ${width}`, r.frames > 10 && r.multi === 0, `${r.frames} frames, ${r.multi} with >1`);
    if (shot) await page.screenshot({ path: shot, fullPage: true });
    check(`page errors at ${width}`, errs.length === 0, errs.length ? errs.join(" | ") : "none");
    await ctx.close();
  };
  await run(390, 844, SHOT);
  await run(360, 844, null);
} catch (e) { check("no step timed out", false, String(e).split("\n")[0]); } finally { await browser.close(); srv.kill(); }
console.log(bad === 0 ? "SMOKE PASS" : `SMOKE FAIL (${bad})`); process.exit(bad === 0 ? 0 : 1);
