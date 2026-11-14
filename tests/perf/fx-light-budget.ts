import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { canvas2d, type CanvasLike, type Ctx2D } from "../../src/runtime/canvas/canvas2d.ts";
import { buildDrawList, createLighting, fitView, present, snapCamera, type FxPiece, type LiveFx } from "../../src/runtime/render/index.ts";
import { createSceneLink, type SceneWorld } from "../../src/runtime/scene/world-scene.ts";

/** Step 33b-2 budget (user ruling on QA M-C, option a): the suite checks the rig's counts and `judge`; the 4 ms p95 wall clock runs alone, never in `npm test`: `node tests/perf/fx-light-budget.ts`. */
export const PERF = { limitMs: 4, laps: 3, lapMs: 3000, frameMs: 16 } as const;
/** Every lap's p95 (sorted[floor(n * 0.95)]) must be at or under the limit; per lap [p50, p95, max]. */
export const judge = (laps: readonly (readonly number[])[]): { stats: number[][]; p95: number[]; ok: boolean } => {
  const stats = laps.map((lap) => { const s = [...lap].sort((a, b) => a - b); return [s[Math.floor(s.length * 0.5)] ?? Infinity, s[Math.floor(s.length * 0.95)] ?? Infinity, s[s.length - 1] ?? Infinity]; }), p95 = stats.map((s) => s[1] ?? Infinity);
  return { stats, p95, ok: p95.length > 0 && p95.every((v) => v <= PERF.limitMs) };
};
/** 128×128 map at res 4, 16 torches, 80 units, 40 looping effects: a steady lamp on each caster (4 lights after the cap) and a self-lit piece following each target, which moves every frame; one frame = scene, plan, draw list, present and the light canvases on a counting canvas. */
export function budgetRig(): { frame: (n: number, t: number) => void; counts: () => number[] } {
  let fills = 0, first = -1;
  const ctx = (tally: boolean): Ctx2D => ({ imageSmoothingEnabled: false, globalCompositeOperation: "source-over", fillStyle: "", save: () => undefined, restore: () => undefined, beginPath: () => undefined, rect: () => undefined, clip: () => undefined, fillRect: () => { if (tally) fills += 1; }, translate: () => undefined, scale: () => undefined, drawImage: () => undefined });
  const counting = (w: number, h: number, tally = true): CanvasLike => { const g = ctx(tally); return { width: w, height: h, getContext: () => g }; }, r = canvas2d(counting(390, 844, false), { images: () => undefined, makeCanvas: counting }), fit = fitView(390, 844, 2, 16, 16), cam = snapCamera(0, 0, 2);
  const pop: FxPiece = { at: 0, ms: 400, sheet: { id: "spark", columns: 1, fw: 8, fh: 8 }, anchor: "target", light_radius: 2, light_ramp: "bloom" }, lamp: FxPiece = { ...pop, light_mode: "steady", anchor: "caster" }, mover: FxPiece = { ...pop, light_mode: "off", attach: "follow" };
  const effects = Array.from({ length: 40 }, (_, i): LiveFx => ({ id: `e${i}`, caster: `c${i}`, target: `t${i}`, castMs: 0, loopMs: 400, pieces: [lamp, mover] })), torches = Array.from({ length: 16 }, (_, i) => ({ x: 64 + 512 * (i % 4), y: 64 + 512 * Math.floor(i / 4), radius: 48 }));
  const hero = { sheet: { id: "hero-sheet", columns: 4, fw: 16, fh: 16 }, clips: [{ name: "atk-right", frames: [0, 1, 2, 3], ms: [100, 100, 100, 100], events: [{ frame: 3, name: "contact" }] }, { name: "idle-down", frames: [4, 5], ms: [40, 40] }] };
  const at = (n: number): SceneWorld => ({ cols: 128, rows: 128, tileW: 16, tileH: 16, mapSeed: 3, assets: { hero }, layers: [], objects: [], overlays: [], effects, style: { ramps: { bloom: ["#402040", "#a04080", "#ffc0e0"] } }, units: Array.from({ length: 80 }, (_, i) => ({ id: i < 40 ? `c${i}` : `t${i - 40}`, sprite: "hero", at: { c: 2 + 3 * (i % 40) % 120 + (i < 40 ? 0 : n % 3), r: i < 40 ? 4 + Math.floor(i / 20) * 6 : 6 + Math.floor((i - 40) / 20) * 6 }, offset: null, facing: "E" as const, alive: true, action: "idle" })) });
  const lw = { cols: 128, rows: 128, tileW: 16, tileH: 16, blocks: new Uint8Array(128 * 128) }, L = createLighting(), link = createSceneLink();
  return {
    frame: (n, t) => { const scene = link.scene(at(n), { tMs: t, stepMs: 10 }), plan = L.plan(lw, torches, 0.5, 0, 4, link.lit); present(r, fit, buildDrawList(scene, fit, cam, t, 10), "#000000", () => { r.lights(plan, fit, cam); }); if (first < 0) first = fills; },
    counts: () => [L.stats.plans, r.stats.lightBuilds, fills - first, link.lit.lights.length], // plans, light-canvas builds, light fills after the first frame, lights
  };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rig = budgetRig(), laps: number[][] = Array.from({ length: PERF.laps }, () => []);
  for (let n = 0, t = 0; t < PERF.laps * PERF.lapMs; n += 1, t += PERF.frameMs) { const t0 = performance.now(); rig.frame(n, t); if (n > 0) laps[Math.floor(t / PERF.lapMs)]?.push(performance.now() - t0); }
  const got = judge(laps); console.log(`fx-light budget (limit ${PERF.limitMs} ms p95 every lap): ${got.stats.map((s, i) => `lap ${i + 1} p50 ${s[0]?.toFixed(2)} p95 ${s[1]?.toFixed(2)} max ${s[2]?.toFixed(2)} ms (${laps[i]?.length} frames)`).join("; ")}; counts ${rig.counts().join("/")}`);
  assert.deepEqual(rig.counts(), [1, 1, 0, 4]); assert.ok(got.ok, `p95 over ${PERF.limitMs} ms`);
}
