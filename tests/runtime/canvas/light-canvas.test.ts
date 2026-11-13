import assert from "node:assert/strict";
import { test } from "node:test";
import { canvas2d } from "../../../src/runtime/canvas/canvas2d.ts";
import { createLighting, fitView, snapCamera, type LightPlan } from "../../../src/runtime/render/index.ts";
import { FakeCanvas } from "./fake-canvas.ts";

const planOf = (w: number, h: number, darkAt: number): LightPlan => { const dark = new Uint8Array(w * h), level = new Uint8Array(w * h); dark[darkAt] = 16; level[darkAt] = 6; return { res: 4, w, h, dark, level }; };
const open = (budget?: number, fail?: () => boolean): { r: ReturnType<typeof canvas2d>; view: FakeCanvas; made: FakeCanvas[] } => {
  const made: FakeCanvas[] = [], view = new FakeCanvas();
  const r = canvas2d(view, { images: () => undefined, ...(budget === undefined ? {} : { budgetBytes: budget }), makeCanvas: (w, h) => { const c = new FakeCanvas(); c.width = w; c.height = h; if (fail?.() === true) c.getContext = () => null; made.push(c); return c; } });
  return { r, view, made };
};

test("N-3: light fills are painted once per plan into one offscreen pair and blitted in two draws a frame, glow with lighter, inside the 300-draw budget (step 32)", () => {
  const fit = fitView(96, 64, 2, 16, 16), cam = snapCamera(16, 8, 2), plan = planOf(8, 4, 20), box = open(64), frame = (): void => { box.r.beginFrame(fit, "#112233"); box.r.lights(plan, fit, cam); box.r.endFrame(); };
  frame(); const draws = box.view.log.slice(-2); assert.equal(box.view.log.length, 2); assert.deepEqual(draws.map((row) => [row.op, row.smoothing]), [["source-over", false], ["lighter", false]]); assert.equal(box.view.px[0], 0xff000000); assert.equal(box.view.px[50 * 96 + 40], 0xff112233); assert.equal(box.r.stats.lightBuilds, 1); assert.equal(box.r.stats.bytes, 8 * 4 * 8);
  frame(); frame(); assert.equal(box.r.stats.lightBuilds, 1); assert.equal(box.made.length, 2); assert.equal(box.r.stats.bytes, 256); assert.ok(box.made.every((c) => c.width === 8));
  const world = { cols: 6, rows: 6, tileW: 16, tileH: 16, blocks: new Uint8Array(36) }, L = createLighting(), torch = [{ x: 16, y: 16, radius: 20 }], nan = L.plan(world, torch, NaN, NaN, 8); box.r.beginFrame(fit, "#112233"); box.r.lights(nan, fit, cam); box.r.lights(nan, fit, cam); box.r.endFrame(); for (let f = 0; f < 3; f += 1) assert.equal(L.plan(world, torch, NaN, NaN, 8), nan); assert.equal(L.stats.plans, 1); assert.equal(box.r.stats.lightBuilds, 2);
  const small = planOf(3, 3, 0); box.r.beginFrame(fit, "#112233"); box.r.lights(small, fit, cam); box.r.endFrame(); assert.equal(box.made[0]?.width, 0); assert.equal(box.made[4]?.width, 3); assert.equal(box.r.stats.bytes, 3 * 3 * 8);
  const lost = open(); lost.r.beginFrame(fit, "#112233"); const n = lost.view.log.length; lost.view.fire("contextlost"); lost.r.lights(plan, fit, cam); assert.equal(lost.view.log.length, n); lost.view.fire("contextrestored"); assert.equal(lost.r.stats.bytes, 0); lost.r.beginFrame(fit, "#112233"); lost.r.lights(plan, fit, cam); lost.r.endFrame(); assert.equal(lost.view.log.at(-1)?.op, "lighter");
  const seen = new Set<string>(), spy = canvas2d(new FakeCanvas(), { images: () => undefined, makeCanvas: (w, h) => { const c = new FakeCanvas(); c.width = w; c.height = h; const g = c.getContext("2d"), fill = g?.fillRect.bind(g); if (g !== null && fill !== undefined) g.fillRect = (x, y, fw, fh) => { seen.add(String(g.fillStyle)); fill(x, y, fw, fh); }; return c; } }), capped = planOf(4, 4, 5); capped.dark[5] = 23; spy.beginFrame(fit, "#112233"); spy.lights(capped, fit, cam); spy.endFrame(); assert.deepEqual([...seen].sort(), ["rgba(255,176,72,0.1875)", "rgba(3,8,26,0.71875)"]); // CEO s31: darkness rgba(3,8,26,n/32) under the 0.72 cap
  box.r.dispose(); assert.equal(box.r.stats.bytes, 0); assert.ok(box.made.every((c) => c.width === 0 && c.height === 0));
});

test("light canvases count in the memory budget, a missing 2D context is not retried every frame and leaves no sized canvas or stale plan, and glow is tagged by pass, not colour (step 32)", () => {
  let fail = true; const box = open(32, () => fail), fit = fitView(64, 64, 1, 16, 16), cam = snapCamera(0, 0, 1), plan = planOf(4, 4, 0);
  const show = (): void => { box.r.beginFrame(fit, "#010101"); box.r.lights(plan, fit, cam); box.r.endFrame(); };
  show(); assert.equal(box.r.stats.missing, true); assert.equal(box.r.stats.lightBuilds, 0); assert.ok(box.made.every((c) => c.width === 0 && c.height === 0)); const made = box.made.length; show(); assert.equal(box.made.length, made); assert.equal(box.r.stats.missing, false); assert.equal(box.r.busy(), false);
  box.view.fire("contextrestored"); fail = false; show(); assert.equal(box.r.stats.lightBuilds, 1); assert.equal(box.r.stats.missing, false); assert.equal(box.r.stats.bytes, 4 * 4 * 8); assert.ok(box.made.some((c) => c.width === 4));
  const live = box.made.filter((c) => c.width === 4); for (const c of live) c.getContext = () => null; const other = planOf(4, 4, 1); box.r.beginFrame(fit, "#010101"); box.r.lights(other, fit, cam); box.r.endFrame(); assert.ok(live.every((c) => c.width === 0)); assert.equal(box.r.stats.missing, true);
  for (const c of live) delete (c as { getContext?: unknown }).getContext; box.r.beginFrame(fit, "#010101"); box.r.lights(plan, fit, cam); box.r.endFrame(); assert.equal(box.r.stats.lightBuilds, 2); assert.ok(box.made.some((c) => c.width === 4)); assert.equal(box.view.log.at(-1)?.op, "lighter"); assert.equal(box.view.log.at(-2)?.op, "source-over");
  const tight = open(64); const fat = planOf(8, 2, 0); tight.r.beginFrame(fit, "#010101"); tight.r.lights(fat, fit, cam); tight.r.endFrame(); assert.equal(tight.r.stats.bytes, 8 * 2 * 8); assert.equal(tight.made[0]?.width, 8);
});
