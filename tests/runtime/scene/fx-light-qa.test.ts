import assert from "node:assert/strict";
import { test } from "node:test";
import { canvas2d } from "../../../src/runtime/canvas/canvas2d.ts";
import { buildDrawList, createFxLive, createLighting, fitView, present, snapCamera, type Clip, type DrawCmd, type FxPiece, type LiveFx, type Sheet, type Standing } from "../../../src/runtime/render/index.ts";
import { createSceneLink, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";
import { FakeCanvas, type Raster } from "../canvas/fake-canvas.ts";

// QA G1 (step 33b-2 r2 review): plants the shipped fx-light.test.ts let through.
const unitSheet: Sheet = { id: "hero-sheet", columns: 4, fw: 16, fh: 16 }, spark: Sheet = { id: "spark", columns: 1, fw: 8, fh: 8 };
const atk: Clip = { name: "atk-right", frames: [0, 1, 2, 3], ms: [100, 100, 100, 100], events: [{ frame: 3, name: "contact" }], points: { hand: [[12, 6]] } }, idle: Clip = { name: "idle-down", frames: [4, 5], ms: [40, 40] };
const pop: FxPiece = { at: 0, ms: 300, sheet: spark, anchor: "target", light_mode: "pop", light_radius: 3, light_ramp: "bloom" };
const fx = (over: Partial<LiveFx> = {}): LiveFx => ({ id: "e1", castMs: 1000, caster: "a", target: "b", pieces: [pop], ...over });
const world = (effects: LiveFx[]): SceneWorld => ({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, assets: { hero: { sheet: unitSheet, clips: [atk, idle] } }, layers: [], units: [{ id: "a", sprite: "hero", at: { c: 2, r: 2 }, offset: null, facing: "E", alive: true, action: "atk" }, { id: "b", sprite: "hero", at: { c: 5, r: 2 }, offset: null, facing: "W", alive: true, action: "idle" }], objects: [], overlays: [], effects, style: { ramps: { bloom: ["#402040", "#ffc0e0"] } } });
const grid = { cols: 8, rows: 8, tileW: 16, tileH: 16, blocks: new Uint8Array(64) };

test("QA 33b-2: the darkness draws once, before the first ui command, so every HUD command stays as bright as by day; the canvas glow has only the 3 top bands", () => {
  const bank = new Map<string, Raster>([["g", { w: 32, h: 32, px: new Uint32Array(1024).fill(0xff2080c0) }], ["h", { w: 8, h: 8, px: new Uint32Array(64).fill(0xff0000f0) }]]), view = new FakeCanvas(), made: FakeCanvas[] = [];
  const r = canvas2d(view, { images: (id) => bank.get(id), makeCanvas: (w, h) => { const c = new FakeCanvas(); c.width = w; c.height = h; made.push(c); return c; } }), fit = fitView(64, 64, 1, 16, 16), cam = snapCamera(0, 0, 1);
  const cmd = (band: DrawCmd["band"], sheet: string, size: number, d: number): DrawCmd => ({ band, sheet, sx: 0, sy: 0, sw: size, sh: size, dx: d, dy: d, dw: size, dh: size, op: "normal", flipX: false });
  const list = { dueMs: Infinity, cmds: [cmd("base", "g", 32, 0), cmd("ui", "h", 8, 4), cmd("ui", "h", 8, 20)] }, night = { res: 4, w: 16, h: 16, dark: new Uint8Array(256).fill(20), level: new Uint8Array(256) };
  present(r, fit, list, "#000000"); const day = [view.px[6 * 64 + 6], view.px[22 * 64 + 22]];
  present(r, fit, list, "#000000", () => { r.lights(night, fit, cam); }); assert.deepEqual([view.px[6 * 64 + 6], view.px[22 * 64 + 22]], day);
  const glow = { res: 4, w: 16, h: 16, dark: new Uint8Array(256), level: new Uint8Array(256).map((_, i) => (i === 0 ? 3 : i === 1 ? 4 : 0)) }, one = { dueMs: Infinity, cmds: [cmd("base", "g", 32, 0)] };
  present(r, fit, one, "#000000", () => { r.lights(glow, fit, cam); }); assert.deepEqual([made[1]?.px[0], made[1]?.px[1] !== 0], [0, true]); // the glow canvas: band 3 stays empty, band 4 is filled
});

test("QA 33b-2: each cell takes its own brightest light's colour (a repeated colour keeps its index, host torches' colours count)", () => {
  const L = createLighting(), red = { radius: 16, colour: "#ff0000", keepInDim: true }, plan = L.plan(grid, [{ x: 104, y: 24, radius: 16, colour: "#00ff00" }], 0.5, 0, 4, { lights: [{ ...red, x: 24, y: 24 }, { x: 24, y: 104, radius: 16, colour: "#0000ff", keepInDim: true }, { ...red, x: 104, y: 104 }] });
  const at = (x: number, y: number): string | undefined => plan.colours?.[(plan.tint?.[Math.floor(y / 4) * plan.w + Math.floor(x / 4)] ?? 0) - 1];
  assert.deepEqual([at(24, 24), at(24, 104), at(104, 104), at(104, 24)], ["255,0,0", "0,0,255", "255,0,0", "0,255,0"]);
});

test("QA 33b-2: the 10 Hz gate lets a change through at once when time goes back; the 3rd lit step in step order never lights, even when it plays alone", () => {
  const link = createSceneLink(), w = world([fx()]), radii = (t: number): number[] => { link.scene(w, { tMs: t, stepMs: 10 }); return link.lit.lights.map((l) => l.radius); };
  assert.deepEqual([radii(1020), radii(1140), radii(1050)], [[48], [32], [48]]);
  const steady = { ...pop, light_mode: "steady", ms: 100 }, solo = createSceneLink(); solo.scene(world([fx({ pieces: [steady, steady, { ...steady, at: 200 }] })]), { tMs: 1250, stepMs: 10 });
  assert.deepEqual(solo.lit.lights, []);
});

test("QA 33b-2: a unit-layer piece's light sits at the centre of where the draw list draws it (self-lit), with the unit's dx and the anchor point's ox", () => {
  const g = { tileW: 16, tileH: 16, stepMs: 10, mapSeed: 3 }, st = { kind: "unit", key: "a", sheet: unitSheet, c: 2, r: 2, clip: atk } as Standing, piece: FxPiece = { ...pop, anchor: "caster", draw_layer: "front-unit", anchor_point: "hand" };
  for (const dx of [0, 5]) {
    const live = createFxLive(); // one light set per live, so each dx starts fresh (10 Hz gate)
    const out = live.frame([fx({ id: `d${dx}`, pieces: [piece] })], () => { const u = live.unit(st, "E", undefined, 1020, g); return { ...u, actor: { ...u.actor, dx } }; }, 1010, 1020, g);
    const drawn = buildDrawList({ cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, ground: [], above: [], standing: out.standing, overlays: out.overlays }, fitView(160, 96, 1, 16, 16), snapCamera(0, 0, 1), 1020, 10).cmds.find((c) => c.sheet === "spark");
    assert.deepEqual([out.lit.lights.map((l) => [l.x, l.y]), drawn?.selfLit, out.standing.some((s) => (s.ox ?? 0) !== 0)], [[[(drawn?.dx ?? 0) + 4, (drawn?.dy ?? 0) + 4]], true, true]);
  }
});
