// Step 34b pixel suite (QA L2 + L3; outside green, run before a release): node tools/pixel-suite/run.ts
// L2: the fixture drawn by the real canvas in each browser equals the L1 recording-canvas hashes, in sRGB.
// L3: the phone page at DPR 1/2/2.625/2.75/3: backing store = device pixels, no CSS rescale, pixelated, letterbox = clear colour, screenshot = device size.
// L3 sets the real device scale with Chromium's --force-device-scale-factor: Playwright's emulated deviceScaleFactor does not reach ResizeObserver's device-pixel-content-box, so it would fail a correct page. Firefox/WebKit have no such switch headless: L3 runs there at DPR 1 only; real phones cover the rest (device log).
// Chromium uses CHROME_PATH (default /usr/bin/google-chrome); Firefox/WebKit use Playwright's own builds when installed (npx playwright-core install firefox webkit), else they are listed as skipped.
import assert from "node:assert/strict";
import { chromium, firefox, webkit, type Browser, type BrowserType } from "playwright-core";
import { FakeCanvas } from "../../tests/runtime/canvas/fake-canvas.ts";
import { fitView } from "../../src/runtime/render/index.ts";
import { serve } from "../serve.ts";
import { frames, RASTERS, VIEW } from "./fixture.ts";
const fake = new FakeCanvas(), L1 = frames(fake, (w, h) => { const c = new FakeCanvas(); c.width = w; c.height = h; return c; }, (id) => RASTERS[id], () => fake.px);
const { url, server } = await serve(0), fails: string[] = [], skipped: string[] = [], partial: string[] = [];
const check = (what: string, ok: boolean, got: unknown): void => { console.log(`${ok ? "ok  " : "FAIL"} ${what}${ok ? "" : ` (got ${JSON.stringify(got)})`}`); if (!ok) fails.push(what); };
const open = async (name: string, type: BrowserType, dpr = 1): Promise<Browser | undefined> => {
  try { return await type.launch(name === "chromium" ? { executablePath: process.env["CHROME_PATH"] ?? "/usr/bin/google-chrome", args: [`--force-device-scale-factor=${dpr}`, "--window-size=390,844"] } : {}); } catch { if (!skipped.includes(name)) skipped.push(name); return undefined; }
};
for (const [name, type] of [["chromium", chromium], ["firefox", firefox], ["webkit", webkit]] as const) {
  const browser = await open(name, type); if (browser === undefined) continue;
  const page = await browser.newPage(); await page.goto(`${url}/tools/pixel-suite/index.html`); await page.waitForFunction("typeof window.l2 === 'function'");
  const got = await page.evaluate("window.l2()") as { hashes: string[]; colorSpace: string };
  check(`${name} L2 colour space is srgb`, got.colorSpace === "srgb", got.colorSpace);
  got.hashes.forEach((h, i) => { check(`${name} L2 frame ${i + 1} equals L1 ${L1[i]}`, h === L1[i], h); });
  await browser.close();
  for (const dpr of [1, 2, 2.625, 2.75, 3]) {
    if (name !== "chromium" && dpr !== 1) { if (!partial.includes(name)) partial.push(name); continue; }
    const b = await open(name, type, dpr); if (b === undefined) continue;
    const p = await b.newPage(name === "chromium" ? { viewport: null } : { viewport: { width: 390, height: 844 } }), at = `${name} L3 dpr ${dpr}`;
    await p.goto(`${url}/tools/device-page/index.html?fixture=2`); await p.waitForFunction("typeof window.l3 === 'function' && window.l3().draws > 0", undefined, { timeout: 10000 });
    const l3 = await p.evaluate(`new Promise((ok) => { const v = document.getElementById("view"), r = new ResizeObserver((e) => { const d = e[0].devicePixelContentBoxSize?.[0]; ok({ ...window.l3(), devW: d?.inlineSize, devH: d?.blockSize, innerW: innerWidth, innerH: innerHeight }); }); r.observe(v, { box: "device-pixel-content-box" }); })`) as { backingW: number; backingH: number; cssW: number; cssH: number; dpr: number; rendering: string; transform: string; devW: number; devH: number; innerW: number; innerH: number };
    check(`${at} page sees the device scale`, Math.abs(l3.dpr - dpr) < 0.01, l3.dpr);
    check(`${at} backing store is device pixels`, l3.backingW === l3.devW && l3.backingH === l3.devH, l3);
    check(`${at} no CSS rescale`, l3.cssW === l3.innerW && l3.cssH === l3.innerH && l3.transform === "none", l3);
    check(`${at} image-rendering pixelated`, l3.rendering === "pixelated" || l3.rendering === "crisp-edges", l3.rendering);
    const shot = await p.screenshot({ scale: "device" }), w = shot.readUInt32BE(16), h = shot.readUInt32BE(20);
    check(`${at} screenshot is device size`, Math.abs(w - l3.backingW) <= 1 && Math.abs(h - l3.backingH) <= 1, [w, h]);
    const fit = fitView(l3.backingW, l3.backingH, 2, 16, 16), spots = [[l3.backingW - 1, l3.backingH - 1], ...(fit.padY > 0 ? [[Math.floor(l3.backingW / 2), 0]] : []), ...(fit.padX > 0 ? [[0, Math.floor(l3.backingH / 2)]] : [])]; // below the 192 px fixture map, and any letterbox bar
    const px = await p.evaluate(`(() => { const c = document.createElement("canvas"), v = document.getElementById("view"); c.width = v.width; c.height = v.height; const x = c.getContext("2d"); x.drawImage(v, 0, 0); return ${JSON.stringify(spots)}.map(([sx, sy]) => "#" + Array.from(x.getImageData(sx, sy, 1, 1).data.slice(0, 3), (n) => n.toString(16).padStart(2, "0")).join("")); })()`) as string[];
    check(`${at} letterbox is the clear colour`, px.every((c) => c === VIEW.clear), px);
    await b.close();
  }
}
server.close();
console.log(`pixel suite: ${fails.length} failed${skipped.length > 0 ? `; skipped (not installed): ${skipped.join(", ")}` : ""}${partial.length > 0 ? `; L3 at DPR 1 only: ${partial.join(", ")}` : ""}`);
assert.equal(fails.length, 0, fails.join("; "));
