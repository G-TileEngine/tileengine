import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { canvas2d, type CanvasLike, type Ctx2D } from "../../src/runtime/canvas/canvas2d.ts";
import { chunkedList, createLighting, fitView, lightOps, present, snapCamera, type Clip, type FxPiece, type LiveFx, type Pixels, type Sheet } from "../../src/runtime/render/index.ts";
import { createSceneLink, type SceneAsset, type SceneUnit, type SceneWorld } from "../../src/runtime/scene/world-scene.ts";
import { PERF, judge } from "./fx-light-budget.ts";

/** Step 34a stress: 200 units (20 walking), a river with shore, 100 effects (hit-stop, squash, hit-white, outline + turn, 12 particles) and a moving torch at res 4. One frame = scene, chunked list, present on a counting canvas, light plan and ops. The suite checks counts and the draw-list hash; the 4 ms p95 runs alone: `node tests/perf/stress-budget.ts`. */
export type Stress = { readonly size: number; readonly water: boolean; readonly moving: number; readonly effects: number; readonly res?: number };
export const STRESS: Readonly<Record<string, Stress>> = { A: { size: 64, water: false, moving: 0, effects: 0 }, B: { size: 64, water: true, moving: 20, effects: 0 }, C: { size: 64, water: true, moving: 20, effects: 100 }, E: { size: 128, water: true, moving: 20, effects: 100 }, L: { size: 128, water: false, moving: 0, effects: 0, res: 4 } };
const source = (_id: string, _f: number, fw: number, fh: number): Pixels => ({ w: fw, h: fh, data: new Uint8ClampedArray(fw * fh * 4).map((_, i) => ((i & 3) === 3 ? 255 : ((i >> 2) % fw) * 9)) });
const tiles: Sheet = { id: "tiles", columns: 4, fw: 16, fh: 16 }, slash: Sheet = { id: "slash", columns: 8, fw: 8, fh: 8 };
const assets: Record<string, SceneAsset> = { river: { sheet: tiles, tileProps: { "1": { motion: { scroll: { step: 1 } } } } }, hero: { sheet: { id: "hero", columns: 4, fw: 16, fh: 16 }, clips: [{ name: "atk-right", frames: [0, 1, 2, 3], ms: [100, 100, 100, 100], events: [{ frame: 3, name: "contact" }] }, { name: "idle-down", frames: [4, 5, 6, 7], ms: [120, 120, 120, 120] }] } };
const style = { ramps: { water: ["#102040", "#204080", "#4080c0", "#80c0ff"], bloom: ["#402040", "#a04080", "#ffc0e0"] } };
const piece: FxPiece = { at: 0, ms: 500, sheet: slash, clip: { name: "s", frames: [0, 1, 2, 3, 4, 5, 6, 7], ms: [60, 60, 60, 60, 60, 60, 60, 60], loop: false } as Clip, anchor: "target", outline: "auto", angle: 30 };
const dots: FxPiece = { at: 0, ms: 500, sheet: slash, kind: "particles", particle_count: 12, particle_life_ms: 500, tint_ramp: "bloom", anchor: "target" };
export function stressRig(o: Stress, hashing = false): { frame: (f: number) => void; counts: () => number[]; hash: () => string } {
  let draws = 0, most = 0, ops = 0; const sha = createHash("sha256"), n = o.size, link = createSceneLink(source), fit = fitView(390, 844, 2, 16, 16), L = createLighting();
  const g: Ctx2D = { imageSmoothingEnabled: false, globalCompositeOperation: "source-over", fillStyle: "", save: () => undefined, restore: () => undefined, beginPath: () => undefined, rect: () => { draws += 1; }, clip: () => undefined, fill: () => undefined, fillRect: () => { draws += 1; }, translate: () => undefined, scale: () => undefined, drawImage: () => { draws += 1; } };
  const mk = (w: number, h: number): CanvasLike => ({ width: w, height: h, getContext: () => g }), r = canvas2d(mk(390, 844), { images: () => ({}), makeCanvas: mk });
  const layers = [{ tileset: "river", aboveUnits: false, visible: true, tiles: Array.from({ length: n * n }, (_, i) => ((i % n) + Math.floor(i / n)) % 9 < 2 ? 1 : 0) }], blocks = { cols: n, rows: n, tileW: 16, tileH: 16, blocks: new Uint8Array(n * n).map((_, i) => (i % 13 === 0 ? 1 : 0)) };
  const units0: SceneUnit[] = Array.from({ length: 200 }, (_, i) => ({ id: `u${i}`, sprite: "hero", at: { c: 2 + (i % 20) * 3, r: 2 + Math.floor(i / 20) * 6 }, offset: null, facing: "E", alive: true, action: i % 2 === 0 ? "atk" : "idle" }));
  return {
    frame: (f) => {
      const t = f * 16, cyc = Math.floor(t / 600) * 600, units = units0.map((u, i) => (i < o.moving ? { ...u, offset: { dx: (f % 16) - 8, dy: 0 } } : u));
      const effects: LiveFx[] = Array.from({ length: o.effects }, (_, i) => ({ id: `e${i}@${cyc}`, castMs: cyc + (i % 10) * 10, caster: `u${(i * 2) % 200}`, target: `u${(i * 2 + 1) % 200}`, hitOffsetMs: 150, hit_stop_ms: 60, squash: true, hit_white_ms: 60, pieces: [piece, dots] }));
      const w: SceneWorld = { cols: n, rows: n, tileW: 16, tileH: 16, mapSeed: 3, assets, layers: o.water ? layers : [], units, objects: [], overlays: [], effects, style, ...(o.water ? { waterTiles: { river: [1] } } : {}) };
      const cam = snapCamera(200 + (f % 64) * 4, 300, 2), list = chunkedList(link.scene(w, { tMs: t, stepMs: 10 }), fit, cam, t, 10), d0 = draws;
      present(r, fit, list, "#000000"); most = Math.max(most, draws - d0); if (hashing) sha.update(JSON.stringify(list.cmds));
      if (o.res !== undefined) { const lit = lightOps(L.plan(blocks, [{ x: 300 + (f % 64) * 4, y: 400, radius: 64 }, { x: 200, y: 200, radius: 48 }], 0.6, 0, o.res), fit, cam); ops = lit.length; if (hashing) sha.update(JSON.stringify(lit)); }
    },
    counts: () => [most, ops, link.notices.length], // most draws in one frame, the last frame's light fills, notices
    hash: () => sha.copy().digest("hex"),
  };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const [name, o] of Object.entries(STRESS)) {
    const rig = stressRig(o), laps: number[][] = Array.from({ length: PERF.laps }, () => []);
    for (let f = 0, t = 0; t < PERF.laps * PERF.lapMs; f += 1, t += PERF.frameMs) { const t0 = performance.now(); rig.frame(f); if (f > 0) laps[Math.floor(t / PERF.lapMs)]?.push(performance.now() - t0); }
    const got = judge(laps); console.log(`stress ${name} (${JSON.stringify(o)}): ${got.stats.map((s, i) => `lap ${i + 1} p50 ${s[0]?.toFixed(2)} p95 ${s[1]?.toFixed(2)} ms`).join("; ")}; counts ${rig.counts().join("/")}`);
    assert.ok((rig.counts()[0] ?? Infinity) <= 300); assert.ok(got.ok, `${name}: p95 over ${PERF.limitMs} ms`);
  }
}
