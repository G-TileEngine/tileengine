import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { canvas2d, type CanvasLike, type Ctx2D } from "../../src/runtime/canvas/canvas2d.ts";
import { buildDrawList, fitView, present, snapCamera, type FxPiece, type LiveFx } from "../../src/runtime/render/index.ts";
import { createSceneLink, type SceneWorld } from "../../src/runtime/scene/world-scene.ts";
import { PERF, judge } from "./fx-light-budget.ts";

/** Step 33b-3 budget: 12 looping effects in view, each 48 particles (two steps of 30, cut to 48) plus 2 outlined, turned pieces (120 fx draws: the total budget), on a 128x128 map; one frame = scene, draw list and present on a counting canvas. The suite checks `counts`; the 4 ms p95 runs alone: `node tests/perf/fx-particles-budget.ts`. */
export function particleRig(): { frame: (t: number) => void; counts: () => number[] } {
  let fills = 0, images = 0, rects = 0, most = 0, last = [0, 0, 0];
  const g: Ctx2D = { imageSmoothingEnabled: false, globalCompositeOperation: "source-over", fillStyle: "", save: () => undefined, restore: () => undefined, beginPath: () => undefined, rect: () => { rects += 1; }, clip: () => undefined, fill: () => { fills += 1; }, fillRect: () => undefined, translate: () => undefined, scale: () => undefined, drawImage: () => { images += 1; } };
  const counting = (w: number, h: number): CanvasLike => ({ width: w, height: h, getContext: () => g }), r = canvas2d(counting(390, 844), { images: () => ({}), makeCanvas: counting }), fit = fitView(390, 844, 2, 16, 16), cam = snapCamera(0, 0, 2);
  const dots: FxPiece = { at: 0, ms: 1000, sheet: { id: "spark", columns: 1, fw: 8, fh: 8 }, kind: "particles", particle_count: 30, particle_life_ms: 1000, tint_ramp: "bloom" }, piece: FxPiece = { at: 0, ms: 1000, sheet: { id: "rune", columns: 1, fw: 12, fh: 12 }, outline: "auto", angle: 45, tint_ramp: "bloom" };
  const effects = Array.from({ length: 12 }, (_, i): LiveFx => ({ id: `e${i}`, caster: `c${i}`, castMs: i * 25, loopMs: 1000, pieces: [dots, { ...dots, particle_motion: "spiral-in" }, piece, { ...piece, draw_layer: "ground" }] }));
  const world: SceneWorld = { cols: 128, rows: 128, tileW: 16, tileH: 16, mapSeed: 3, assets: { hero: { sheet: { id: "hero", columns: 1, fw: 16, fh: 16 } } }, layers: [], objects: [], overlays: [], effects, style: { ramps: { bloom: ["#402040", "#a04080", "#ffc0e0"] } }, units: Array.from({ length: 12 }, (_, i) => ({ id: `c${i}`, sprite: "hero", at: { c: 2 + (i % 4) * 3, r: 3 + Math.floor(i / 4) * 6 }, offset: null, facing: "E" as const, alive: true })) };
  const link = createSceneLink();
  return {
    frame: (t) => { last = [images, rects, fills]; const list = buildDrawList(link.scene(world, { tMs: t, stepMs: 10 }), fit, cam, t, 10), n = list.cmds.reduce((sum, c) => sum + (c.rects === undefined ? 1 : c.rects.length / 4), 0); if (n > most) most = n; present(r, fit, list, "#000000"); },
    counts: () => [most, images - (last[0] ?? 0), rects - (last[1] ?? 0), fills - (last[2] ?? 0)], // most draws in one frame (images + particle rects); the last frame's images, rects and fills
  };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rig = particleRig(), laps: number[][] = Array.from({ length: PERF.laps }, () => []);
  for (let n = 0, t = 0; t < PERF.laps * PERF.lapMs; n += 1, t += PERF.frameMs) { const t0 = performance.now(); rig.frame(t); if (n > 0) laps[Math.floor(t / PERF.lapMs)]?.push(performance.now() - t0); }
  const got = judge(laps); console.log(`fx-particles budget (limit ${PERF.limitMs} ms p95 every lap): ${got.stats.map((s, i) => `lap ${i + 1} p50 ${s[0]?.toFixed(2)} p95 ${s[1]?.toFixed(2)} max ${s[2]?.toFixed(2)} ms (${laps[i]?.length} frames)`).join("; ")}; counts ${rig.counts().join("/")}`);
  assert.ok((rig.counts()[0] ?? Infinity) <= 300); assert.ok(got.ok, `p95 over ${PERF.limitMs} ms`);
}
