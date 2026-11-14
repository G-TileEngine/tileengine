import assert from "node:assert/strict";
import { test } from "node:test";
import { createClock } from "../../../src/core/clock/index.ts";
import { createDriver, type HostEnv } from "../../../src/runtime/host/raf-driver.ts";
import { buildDrawList, fitView, present, snapCamera, type DrawCmd, type FxPiece, type Renderer, type Sheet } from "../../../src/runtime/render/index.ts";
import { createSceneLink, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";
import { FakeCanvas, type Raster } from "../canvas/fake-canvas.ts";

// QA G1 (step 33b-2 r4 review): the self-lit pass order, depth against a unit in front, and raf-driver's day path.
const spark: Sheet = { id: "spark", columns: 1, fw: 8, fh: 8 }, cmd = (band: DrawCmd["band"], sheet: string, selfLit = false): DrawCmd => ({ band, sheet, sx: 0, sy: 0, sw: 8, sh: 8, dx: 8, dy: 8, dw: 8, dh: 8, op: "normal", flipX: false, ...(selfLit ? { selfLit } : {}) });

test("QA 33b-2 r4: at night the self-lit pass draws right after the darkness, in list order, and before every ui command", () => {
  const log: string[] = [], rec = { beginFrame: () => undefined, endFrame: () => undefined, drawImage: (sheet: string) => { log.push(sheet); } } as unknown as Renderer;
  present(rec, fitView(64, 64, 1, 16, 16), { dueMs: Infinity, cmds: [cmd("base", "ground"), cmd("fxAir", "air", true), cmd("fxAir", "smoke"), cmd("glow", "halo", true), cmd("ui", "hud1"), cmd("ui", "hud2")] }, "#000000", () => { log.push("DARK"); });
  assert.deepEqual(log, ["ground", "smoke", "DARK", "air", "halo", "hud1", "hud2"]);
});

test("QA 33b-2 r4: a self-lit fxFront piece that a unit one row in front covers keeps its depth slot at night, as do an uncovered fxBehind or face-swapped piece; an uncovered fxFront piece takes the pass", () => {
  const piece: FxPiece = { at: 0, ms: 300, sheet: spark, anchor: "caster", draw_layer: "front-unit", anchor_point: "centre" }, idle = { name: "idle-down", frames: [0, 1], ms: [40, 40] };
  const w = (row: number): SceneWorld => ({ cols: 10, rows: 8, tileW: 16, tileH: 16, mapSeed: 3, assets: { hero: { sheet: { id: "hero", columns: 4, fw: 16, fh: 16 }, clips: [idle] }, tall: { sheet: { id: "tall", columns: 4, fw: 16, fh: 32 }, clips: [idle] } }, layers: [], units: [{ id: "a", sprite: "hero", at: { c: 2, r: 2 }, offset: null, facing: "S", alive: true, action: "idle" }, { id: "b", sprite: "tall", at: { c: 2, r: row }, offset: null, facing: "S", alive: true, action: "idle" }], objects: [], overlays: [], effects: [{ id: "e1", castMs: 1000, caster: "a", pieces: [piece] }] });
  const marks = (row: number): (boolean | undefined)[] => buildDrawList(createSceneLink().scene(w(row), { tMs: 1020, stepMs: 10 }), fitView(160, 128, 1, 16, 16), snapCamera(0, 0, 1), 1020, 10).cmds.filter((c) => c.sheet === "spark").map((c) => c.selfLit === true);
  const lone = (kind: "fxBehind" | "fxFront", faceSwap: boolean): boolean[] => buildDrawList({ cols: 4, rows: 4, tileW: 16, tileH: 16, mapSeed: 1, ground: [], above: [], overlays: [], standing: [{ kind, sheet: spark, c: 1, r: 1, ...(faceSwap ? { faceSwap } : {}) }] }, fitView(64, 64, 1, 16, 16), snapCamera(0, 0, 1), 0, 10).cmds.map((c) => c.selfLit === true); // nothing covers these, so only the band and rank decide
  assert.deepEqual([marks(3), marks(6), lone("fxBehind", false), lone("fxFront", true), lone("fxFront", false)], [[false], [true], [false], [false], [true]]);
});

test("QA 33b-2 r4: raf-driver passes no after when the view has no lights, so by day a self-lit piece stays under a later command", async () => {
  const q: ((ts: number) => void)[] = [], view = Object.assign(new FakeCanvas(), { clientWidth: 64, clientHeight: 64 }), bank = new Map<string, Raster>([["spark", { w: 8, h: 8, px: new Uint32Array(64).fill(0xffffc0e0) }], ["g", { w: 8, h: 8, px: new Uint32Array(64).fill(0xff2080c0) }]]);
  const env = { requestAnimationFrame: (cb: (ts: number) => void) => q.push(cb), cancelAnimationFrame: () => undefined, devicePixelRatio: 1, document: { visibilityState: "visible", addEventListener: () => undefined, removeEventListener: () => undefined, createElement: () => new FakeCanvas() } } as unknown as HostEnv;
  const scene = { cols: 4, rows: 4, tileW: 16, tileH: 16, mapSeed: 1, ground: [], above: [], standing: [], overlays: [{ band: "fxAir" as const, sheet: spark, x: 8, y: 8, selfLit: true }, { band: "flash" as const, sheet: { ...spark, id: "g" }, x: 8, y: 8 }] };
  const d = createDriver({ env, canvas: view, clock: createClock(), view: () => ({ scene, x: 0, y: 0, s: 1 }), load: (id) => Promise.resolve(bank.get(id) ?? {}) });
  d.start(); for (let i = 0; i < 4; i += 1) { q.shift()?.(1000 + 16 * i); await new Promise((done) => { setImmediate(done); }); }
  assert.equal(view.px[12 * 64 + 12], 0xff2080c0); d.dispose();
});
