import assert from "node:assert/strict";
import { test } from "node:test";
import { canvas2d, type CanvasLike, type Ctx2D } from "../../../src/runtime/canvas/canvas2d.ts";
import { createLighting, fitView, lightOps, snapCamera, STEPS, type LightPlan, type LiveFx } from "../../../src/runtime/render/index.ts";
import { createSceneLink, type SceneUnit, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";
import { STRESS, stressRig } from "../../perf/stress-budget.ts";
const src = (_id: string, _f: number, fw: number, fh: number): { w: number; h: number; data: Uint8ClampedArray } => ({ w: fw, h: fh, data: new Uint8ClampedArray(fw * fh * 4).fill(200) });
const blocks = (n: number): { cols: number; rows: number; tileW: number; tileH: number; blocks: Uint8Array } => ({ cols: n, rows: n, tileW: 16, tileH: 16, blocks: new Uint8Array(n * n).map((_, i) => (i % 13 === 0 ? 1 : 0)) });
const unit = (id: string, c: number): SceneUnit => ({ id, sprite: "hero", at: { c, r: 2 }, offset: null, facing: "E", alive: true, action: "atk" });
const n = 12, wet = Array.from({ length: n * n }, (_, i) => (i % n < 4 ? 1 : 0)), style = { ramps: { water: ["#102040", "#204080", "#4080c0", "#80c0ff"] } }, waterTiles = { river: [1] };
const assets = { river: { sheet: { id: "tiles", columns: 4, fw: 16, fh: 16 } }, hero: { sheet: { id: "hero", columns: 4, fw: 16, fh: 16 }, clips: [{ name: "atk-right", frames: [0, 1, 2, 3], ms: [100, 100, 100, 100] }] } };
const river = [{ tileset: "river", aboveUnits: false, visible: true, tiles: wet }];
const world = (over: Partial<SceneWorld> = {}): SceneWorld => ({ cols: n, rows: n, tileW: 16, tileH: 16, mapSeed: 3, assets, layers: river, units: [unit("u0", 5), unit("u1", 7)], objects: [], overlays: [], style, waterTiles, ...over });
const fx = (castMs: number): LiveFx => ({ id: `e@${castMs}`, castMs, caster: "u0", target: "u1", hitOffsetMs: 150, hit_stop_ms: 60, squash: true, hit_white_ms: 60, pieces: [{ at: 0, ms: 500, sheet: { id: "slash", columns: 8, fw: 8, fh: 8 }, clip: { name: "s", frames: [0, 1, 2, 3], ms: [60, 60, 60, 60], loop: false }, anchor: "target" }] });

test("stress rig: draws per frame stay in budget, no notices, and the draw list hashes as on 1bd476bd (step 34a)", () => {
  for (const [k, frames, want] of [["C", 60, "da3c665e805d5ce99ac34e7e8035e2d2aa402e662e87ee4ec64d52080d549a35"], ["L", 30, "18d97599b307e87da6b1da2809a3c5449839c19c320f64d2232393535234d644"]] as const) {
    const rig = stressRig(STRESS[k] ?? { size: 0, water: false, moving: 0, effects: 0 }, true); for (let f = 0; f < frames; f += 1) rig.frame(f);
    const [most = 0, , notices] = rig.counts(); assert.ok(most <= 300, `${k} ${most}`); assert.equal(notices, 0); assert.equal(rig.hash(), want, k);
  }
});
test("light: ops read only the view's squares and match the plan square for square, a torch at either view edge included; the canvas paints one fill per run (step 34a)", () => {
  const L = createLighting(), fit = fitView(390, 844, 2, 16, 16), res = 4;
  for (const [cx, cy, lx, ly] of [[0, 0, 6, 100], [200, 300, 200 + fit.artW + 30, 500], [201, 301, 190, 300 + fit.artH + 2], [1200, 1500, 1300, 1500]] as const) {
    const plan = L.plan(blocks(128), [{ x: lx, y: ly, radius: 64 }, { x: 1800, y: 200, radius: 48 }], 0.6, 0, res), cam = snapCamera(cx, cy, 2), far = plan.dark[plan.w * plan.h - 1] ?? 0; let reads = 0;
    for (let i = 0; i < plan.w * plan.h; i += 1) assert.ok((plan.level[i] ?? 0) > 0 ? (plan.dark[i] ?? 0) < far : plan.dark[i] === far, `plan square ${i}`);
    const ops = lightOps(new Proxy(plan, { get: (t, k) => { reads += 1; return Reflect.get(t, k) as unknown; } }), fit, cam), s = fit.s, ox = fit.padX - cam.devX, oy = fit.padY - cam.devY;
    assert.ok(reads < (plan.w * plan.h) / 8, `reads ${reads}`);
    const x0 = cam.devX / s, y0 = cam.devY / s, x1 = x0 + fit.artW + res, y1 = y0 + fit.artH + res, got = new Map<string, string>(), glow = new Set<number>();
    for (const op of ops) for (let ix = Math.round((op.x - ox) / (res * s)); ix < Math.round((op.x - ox + op.w) / (res * s)); ix += 1) { const i = Math.round((op.y - oy) / (res * s)) * plan.w + ix; if (op.op === "add") glow.add(i); else got.set(String(i), op.colour); }
    let lit = 0; for (let iy = 0; iy < plan.h; iy += 1) for (let ix = 0; ix < plan.w; ix += 1) {
      const i = iy * plan.w + ix, seen = (ix + 1) * res > x0 && ix * res < x1 && (iy + 1) * res > y0 && iy * res < y1, k = plan.dark[i] ?? 0;
      assert.equal(got.get(String(i)), seen && k > 0 ? `rgba(3,8,26,${k / STEPS})` : undefined, `${cx},${cy} dark ${ix},${iy}`); assert.equal(glow.has(i), seen && (plan.level[i] ?? 0) >= 4, `${cx},${cy} glow ${ix},${iy}`); if (glow.has(i)) lit += 1;
    }
    assert.ok(lit > 0 || cx >= 1200, `torch at the edge lit nothing (${cx},${cy})`);
  }
  let fills = 0; const g: Ctx2D = { imageSmoothingEnabled: false, globalCompositeOperation: "source-over", fillStyle: "", save: () => undefined, restore: () => undefined, beginPath: () => undefined, rect: () => undefined, clip: () => undefined, fill: () => undefined, fillRect: () => { fills += 1; }, translate: () => undefined, scale: () => undefined, drawImage: () => undefined };
  const mk = (w: number, h: number): CanvasLike => ({ width: w, height: h, getContext: () => g }), r = canvas2d(mk(390, 844), { images: () => ({}), makeCanvas: mk }), plan: LightPlan = L.plan(blocks(32), [{ x: 100, y: 100, radius: 40 }], 0.6, 0, 8);
  r.world({ cols: 1, rows: 1, tileW: 16, tileH: 16, mapSeed: 1, ground: [], above: [], standing: [], overlays: [] }, 1); r.beginFrame(fit, "#000000"); fills = 0; r.lights(plan, fit, snapCamera(0, 0, 2)); assert.ok(fills > 0 && fills < (plan.w * plan.h) / 4, `fills ${fills} of ${plan.w * plan.h}`);
});
test("shore: the water grid and foam are kept while tiles, water ids, style and size stay; a dig, a new style or a size change rebuilds (step 34a)", () => {
  let reads = 0; const tiles = new Proxy(wet, { get: (t, k) => { if (typeof k === "string" && /^\d+$/.test(k)) reads += 1; return Reflect.get(t, k) as unknown; } });
  const link = createSceneLink(src), layers = [{ tileset: "river", aboveUnits: false, visible: true, tiles }], at = { tMs: 0, stepMs: 10 };
  const a = link.scene(world({ layers }), at), r0 = reads, b = link.scene(world({ layers, units: [unit("u0", 6), unit("u1", 7)] }), at);
  assert.equal(reads, r0); assert.equal(b.overlays[0], a.overlays[0]);
  const dug = wet.map((t, i) => (i === 3 ? 0 : t)), c = link.scene(world({ layers: [{ ...layers[0], tiles: dug }] as SceneWorld["layers"] }), at); assert.notEqual(c.overlays[0]?.sheet.id, b.overlays[0]?.sheet.id);
  const d = link.scene(world({ layers: [{ ...layers[0], tiles: dug }] as SceneWorld["layers"], style: { ramps: { water: ["#000000", "#111111", "#222222", "#333333"] } } }), at); assert.notEqual(d.overlays[0], c.overlays[0]);
  const dugged = [{ ...layers[0], tiles: dug }] as SceneWorld["layers"], e = link.scene(world({ layers: dugged }), at), g = link.scene(world({ layers: dugged, mapSeed: 4 }), at), f = link.scene(world({ layers: dugged, mapSeed: 4 }), { ...at, reduce: true });
  assert.notDeepEqual(f.overlays[0], g.overlays[0], "reduce"); assert.notDeepEqual(g.overlays[0], e.overlays[0], "seed");
  const g3 = link.scene(world({ layers: dugged, mapSeed: 4 }), at), k = link.scene(world({ layers: dugged, mapSeed: 4, tileW: 8 }), at), g4 = link.scene(world({ layers: dugged, mapSeed: 4 }), at), k2 = link.scene(world({ layers: dugged, mapSeed: 4, tileH: 8 }), at); assert.notDeepEqual(k.overlays[0], g3.overlays[0], "a tile width change rebuilds (QA S3, step 34b)"); assert.notDeepEqual(k2.overlays[0], g4.overlays[0], "a tile height change rebuilds (QA 34b)");
  const g2 = link.scene(world({ layers: dugged, mapSeed: 4 }), at), h = link.scene(world({ layers: dugged, mapSeed: 4, waterTiles: { river: [1, 0] } }), at); assert.notDeepEqual(h.overlays[0], g2.overlays[0], "new water ids rebuild (QA 34a)");
});
test("effects: the cache key never stringifies world.effects, an equal effects list keeps the cached scene, new effects at the same pose redraw (step 34a)", () => {
  const link = createSceneLink(src), at = { tMs: 200, stepMs: 10 }, list = [fx(100)], json = JSON.stringify; let hits = 0;
  JSON.stringify = ((v: unknown, ...rest: []) => { if (v === list) hits += 1; return json(v, ...rest); }) as typeof JSON.stringify;
  try { const units = world().units, a = link.scene(world({ units, effects: list }), at), b = link.scene(world({ units, effects: [...list] }), at); assert.equal(hits, 0); assert.equal(b, a); assert.notEqual(link.scene(world({ units, effects: [fx(150)] }), at), a); assert.notEqual(link.scene(world({ units, effects: [fx(100), fx(150)] }), at), a); } finally { JSON.stringify = json; }
  { const link = createSceneLink(src), units = world().units, e0 = fx(100), a = link.scene(world({ units, effects: [e0] }), at); assert.notEqual(link.scene(world({ units, effects: [{ ...e0, castMs: 101 }] }), at), a, "a replaced effect with the same id redraws (QA 34a)"); }
});
test("effects: the actor lookup indexes units once per call instead of a find per actor; a duplicate id still resolves to its first unit (step 34a)", () => {
  let finds = 0; const units = [unit("u0", 5), unit("u1", 7), { ...unit("u1", 9), facing: "W" as const }], base = Array.prototype.find;
  Object.defineProperty(units, "find", { value: function (this: SceneUnit[], ...a: Parameters<typeof base>) { finds += 1; return base.apply(this, a); } });
  const at = { tMs: 270, stepMs: 10 }, got = createSceneLink(src).scene(world({ units, effects: [fx(100), fx(120)] }), at); assert.equal(finds, 0);
  const want = createSceneLink(src).scene(world({ units: [unit("u0", 5), unit("u1", 7), { ...unit("u2", 9), facing: "W" as const }], effects: [fx(100), fx(120)] }), at); assert.deepEqual(got.overlays, want.overlays, "a duplicate id resolves to its first unit");
  let reads = 0; const many = new Proxy(Array.from({ length: 40 }, (_, i) => unit(`u${i}`, i % 12)), { get: (t, k) => { if (typeof k === "string" && /^\d+$/.test(k)) reads += 1; return Reflect.get(t, k) as unknown; } }), count = (k: number): number => { reads = 0; createSceneLink(src).scene(world({ units: many, effects: Array.from({ length: k }, (_, i) => fx(100 + i)) }), at); return reads; }; assert.ok(count(20) - count(1) < 40, `units read once per call, not per actor (QA 34a): ${count(20)} vs ${count(1)}`);
});
