// Step 35g5b real-clock smoke (outside green, like run.ts; run before a device run): node tools/pixel-suite/smoke.ts
// Real clock on purpose: Playwright's fake clock swaps in its own cancelAnimationFrame and hides an unbound one (34b build A: drawing stops after a tap).
// Checks, in mobile Chromium: lite on reaches the scene, so world-scene uses the 60 ms pose grid (34b build B never passed it); 60 fps cap on, cap off
// and run again each restart the driver, which keeps drawing; no page error. Chromium uses CHROME_PATH (default /usr/bin/google-chrome).
import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { serve } from "../serve.ts";
const { url, server } = await serve(0), fails: string[] = [];
const check = (what: string, ok: boolean, got: unknown): void => { console.log(`${ok ? "ok  " : "FAIL"} ${what}${ok ? "" : ` (got ${JSON.stringify(got)})`}`); if (!ok) fails.push(what); };
// Records the lite flag of every scene call: the page's SceneClock.lite is what world-scene turns into the pose grid (lite ? 60 : 30 ms).
const SPY = "\n{ const real = createSceneLink; createSceneLink = (...a) => { const l = real(...a), s = l.scene.bind(l); l.scene = (w, c) => { globalThis.smokeLite = c?.lite === true; return s(w, c); }; return l; }; }\n";
const browser = await chromium.launch({ executablePath: process.env["CHROME_PATH"] ?? "/usr/bin/google-chrome" });
try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 664 }, screen: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(), errors: string[] = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.route("**/src/runtime/scene/world-scene.ts", async (r) => { const res = await r.fetch(); await r.fulfill({ response: res, body: (await res.text()) + SPY }); });
  const read = async (): Promise<string> => (await p.textContent("#read")) ?? "";
  const draws = async (): Promise<number> => Number(/draws (\d+)/.exec(await read())?.[1] ?? -1);
  const drawing = async (what: string): Promise<void> => { await p.waitForTimeout(300); const a = await draws(); await p.waitForTimeout(1000); const b = await draws(); check(`${what}: still drawing`, b > a, [a, b]); };
  const lite = async (): Promise<unknown> => { await p.waitForTimeout(300); return p.evaluate("globalThis.smokeLite"); };
  await p.goto(`${url}/tools/device-page/index.html`); await p.waitForFunction("/draws [1-9]/.test(document.querySelector('#read')?.textContent ?? '')");
  await drawing("start");
  await p.tap("#lite"); await p.tap("#lite"); // auto → off → on
  check("lite on: the scene gets lite on (60 ms pose grid)", (await lite()) === true, [await p.textContent("#lite"), await lite()]);
  await p.tap("#lite"); await p.tap("#lite"); // on → auto → off
  check("lite off: the scene gets lite off (30 ms pose grid)", (await lite()) === false, [await p.textContent("#lite"), await lite()]);
  await p.tap("#cap"); await drawing("60 fps cap on");
  await p.tap("#cap"); await drawing("60 fps cap off");
  await p.tap("#again"); await drawing("run again");
  const mb = /canvas MB (\S+)/.exec(await read())?.[1], main = await p.evaluate("(() => { const v = document.querySelector('#view'); return v.width * v.height * 4 / 1048576; })()") as number;
  console.log(`info canvas MB ${mb ?? "?"} (main canvas alone ${main.toFixed(1)} MB)`);
  check("no page error", errors.length === 0, errors);
} finally { await browser.close(); server.close(); }
console.log(`smoke: ${fails.length} failed`);
assert.equal(fails.length, 0, fails.join("; "));
