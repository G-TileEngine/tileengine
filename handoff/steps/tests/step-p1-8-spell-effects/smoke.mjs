// P1-8 kit-run browser smoke (the builder runs it; 0 repo lines): node smoke.mjs <worktree> [port] [shot.png]
// Env: PLAYWRIGHT_CORE = playwright-core package dir, CHROME = Chrome binary. Headless 390x844 and 360 wide @3x, touch. Exits 1 on any FAIL.
// Steps: open play-stage, HUD 44px targets, no sideways scroll, no page errors, the stage looks (every picture loads: dressing, shore, motion, idle clips; torch lights drawn),
// Spell two-tap: effect is live, fx:hit fires, effect light and shake show, then it retires.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
const PW = process.env.PLAYWRIGHT_CORE ?? "/usr/local/lib/pnpm/5/.pnpm/playwright-core@1.59.1/node_modules/playwright-core/";
const { chromium } = createRequire(PW.endsWith("/") ? PW : `${PW}/`)(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8795", SHOT = "smoke-p18-390x844.png"] = process.argv; let bad = 0;
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
    await page.waitForFunction(() => window.__play !== undefined && window.__hud !== undefined && window.__fx !== undefined && window.__link !== undefined, null, { timeout: 15000 });
    await page.waitForTimeout(600);
    const wide = await page.evaluate(() => document.documentElement.scrollWidth);
    check(`no sideways scroll at ${width}`, wide <= width, `scrollWidth ${wide}`);
    const hud = await page.evaluate(() => {
      const vis = [...document.querySelectorAll("button")].map((b) => { const s = getComputedStyle(b), q = b.getBoundingClientRect(); return { t: (b.textContent ?? "").trim(), w: Math.round(q.width), h: Math.round(q.height), show: s.display !== "none" && s.visibility !== "hidden" && q.width > 0 && q.height > 0, id: b.id }; });
      const shown = vis.filter((b) => b.show), small = shown.filter((b) => b.w < 44 || b.h < 44);
      return { shown, small, end: shown.some((b) => b.id === "end" || /end/i.test(b.t)), menu: shown.some((b) => b.id === "menu") };
    });
    check(`touch targets >= 44x44 at ${width}`, hud.small.length === 0 && hud.end && hud.menu, JSON.stringify(hud));
    const looks = await page.evaluate(() => { const d = window.__driver; return { failed: d.stats.failed, errors: d.stats.errors, missing: d.backend.stats.missing, lightBuilds: d.backend.stats.lightBuilds, draws: d.stats.draws }; });
    check(`stage looks load and torches draw at ${width}`, looks.failed === 0 && looks.errors === 0 && looks.missing === false && looks.lightBuilds > 0 && looks.draws > 0, JSON.stringify(looks));
    const fx = await page.evaluate(async () => {
      const play = window.__play, hud = window.__hud, link = window.__link;
      hud.hideBanner();
      const archer = play.world.units.all().find((u) => u.unitId === "archer" && u.alive);
      const wolf = play.world.units.all().find((u) => u.unitId === "wolf" && u.alive);
      if (!archer || !wolf) return { ok: false, why: "no units" };
      play.world.units.moveTo(archer.id, { c: wolf.at.c, r: wolf.at.r + 2 }, "move");
      play.intend({ type: "SelectUnit", unitId: archer.id });
      const why = play.choose("spell"); if (why !== null) return { ok: false, why };
      const at = play.aims[0] ?? wolf.at;
      play.intend({ type: "TargetCell", at });
      play.intend({ type: "TargetCell", at });
      let live = 0, hits = 0, retired = false, lit = 0, shook = 0;
      const t0 = performance.now();
      while (performance.now() - t0 < 4000) {
        await new Promise((r) => requestAnimationFrame(r));
        play.sync();
        const n = (play.scene().effects ?? []).length;
        if (n > 0) live = Math.max(live, n);
        hits += (link.fired ?? []).filter((e) => e.type === "fx:hit").length;
        if (link.lit.lights.length > 0) lit += 1; if (link.shake.x !== 0 || link.shake.y !== 0) shook += 1;
        if (live > 0 && n === 0) retired = true;
        if (live > 0 && hits > 0 && retired && lit > 0 && shook > 0) break;
      }
      return { ok: true, live, hits, retired, lit, shook, failed: window.__driver.stats.failed, notes: play.fx.engine.notes.map((n) => n.code) };
    });
    check(`spell effect live, hit, lit, shake, retire at ${width}`, fx.ok && fx.live > 0 && fx.hits > 0 && fx.retired === true && fx.lit > 0 && fx.shook > 0 && fx.failed === 0, JSON.stringify(fx));
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
