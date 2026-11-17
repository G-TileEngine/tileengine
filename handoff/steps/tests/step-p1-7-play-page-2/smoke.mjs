// P1-7 kit-run browser smoke (the builder runs it; 0 repo lines): node smoke.mjs <worktree> [port] [shot.png]
// Env: PLAYWRIGHT_CORE = playwright-core package dir, CHROME = Chrome binary. Headless 390x844 and 360 wide @3x, touch. Exits 1 on any FAIL.
// Steps: open play-stage, HUD 44px targets, no sideways scroll, no page errors, walk stays at actMenu, Wait returns to idle, pan, wipe+End turn wins.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
const PW = process.env.PLAYWRIGHT_CORE ?? "/usr/local/lib/pnpm/5/.pnpm/playwright-core@1.59.1/node_modules/playwright-core/";
const { chromium } = createRequire(PW.endsWith("/") ? PW : `${PW}/`)(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8793", SHOT = "smoke-p17-390x844.png"] = process.argv; let bad = 0;
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
    await page.waitForFunction(() => window.__play !== undefined && window.__hud !== undefined && window.__cam !== undefined, null, { timeout: 15000 });
    await page.waitForTimeout(600);
    const wide = await page.evaluate(() => document.documentElement.scrollWidth);
    check(`no sideways scroll at ${width}`, wide <= width, `scrollWidth ${wide}`);
    const hud = await page.evaluate(() => {
      const vis = [...document.querySelectorAll("button")].map((b) => { const s = getComputedStyle(b), q = b.getBoundingClientRect(); return { t: (b.textContent ?? "").trim(), w: Math.round(q.width), h: Math.round(q.height), show: s.display !== "none" && s.visibility !== "hidden" && q.width > 0 && q.height > 0, id: b.id }; });
      const shown = vis.filter((b) => b.show), small = shown.filter((b) => b.w < 44 || b.h < 44);
      return { shown, small, end: shown.some((b) => b.id === "end" || /end/i.test(b.t)), menu: shown.some((b) => b.id === "menu") };
    });
    check(`touch targets >= 44x44 at ${width}`, hud.small.length === 0 && hud.end && hud.menu, JSON.stringify(hud));
    const cell = await page.evaluate(() => { const cam = window.__cam, dpr = window.devicePixelRatio || 1, css = (16 * cam.s) / dpr; return { s: cam.s, dpr, css }; });
    check(`cell CSS >= 44 after init at ${width}`, cell.css >= 44, JSON.stringify(cell));
    const walked = await page.evaluate(async () => {
      const play = window.__play, hud = window.__hud, cam = window.__cam;
      hud.hideBanner();
      const knight = play.world.units.all().find((u) => u.unitId === "knight" && u.alive);
      if (!knight) return { ok: false, why: "no knight" };
      const beforeX = cam.x; cam.follow = null; play.followId = null;
      const { pan } = await import("/tools/play-stage/camera-touch.ts");
      pan(cam, 24, 0);
      const panned = cam.x !== beforeX;
      play.intend({ type: "SelectUnit", unitId: knight.id });
      const dest = play.reach[0], start = { ...knight.at };
      if (!dest) return { ok: false, why: "no dest", panned };
      play.intend({ type: "TargetCell", at: dest });
      play.intend({ type: "TargetCell", at: dest });
      const moving = play.world.phases.battle;
      const t0 = performance.now();
      while (play.walk !== null && performance.now() - t0 < 4000) { await new Promise((r) => requestAnimationFrame(r)); play.sync(); }
      const end = play.world.units.get(knight.id)?.at;
      hud.render(play.view());
      const phase = play.world.phases.battle, waitOn = play.view().actions.wait.on;
      play.wait();
      return { ok: true, panned, moving, phase, waitOn, afterWait: play.world.phases.battle, dest, end, start };
    });
    check(`pan + walk stays actMenu then Wait → idle at ${width}`, walked.ok && walked.panned && walked.moving === "moving" && walked.phase === "actMenu" && walked.waitOn === true && walked.afterWait === "idle" && walked.end && walked.dest && walked.end.c === walked.dest.c && walked.end.r === walked.dest.r, JSON.stringify(walked));
    const won = await page.evaluate(() => {
      const play = window.__play;
      play.world.units.all().filter((u) => u.side === "wolves").forEach((u) => play.world.units.remove(u.id));
      play.endTurn();
      return { outcome: play.outcome, text: document.querySelector("#card h2")?.textContent ?? "" };
    });
    // rAF refresh should paint the veil; give it a couple of frames
    await page.waitForTimeout(400);
    const painted = await page.evaluate(() => ({ outcome: window.__play.outcome, text: document.querySelector("#card h2")?.textContent ?? "", veil: getComputedStyle(document.querySelector("#veil")).display !== "none" }));
    check(`wipe + End turn is a win at ${width}`, painted.outcome === "win" && /Victory/i.test(painted.text) && painted.veil, JSON.stringify({ won, painted }));
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
