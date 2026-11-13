import assert from "node:assert/strict";
import { test } from "node:test";
import { buildDrawList, crossed, fitView, placeStep, snapCamera, type FxActor, type FxPiece, type Overlay, type RenderScene, type Standing } from "../../../src/runtime/render/index.ts";

// QA additions for step 33a (A/B pick, must-fix): the shipped test stays verbatim.
const unitSheet = { id: "unit", columns: 1, fw: 16, fh: 16 }, fxSheet = { id: "fx", columns: 1, fw: 8, fh: 8 }, none = { hand: [], tip: [], head: [], centre: [] };
const actor = (over: Partial<FxActor> = {}): FxActor => ({ c: 2, r: 2, sheet: unitSheet, frame: 0, points: none, box: { x: 0, y: 0, w: 16, h: 16 }, ...over });
const place = (p: Partial<FxPiece>, unit: FxActor | null): Standing | Overlay | null => placeStep({ at: 0, ms: 500, sheet: fxSheet, ...p }, 1000, 1010, 1100, () => unit, { x: 40, y: 48 }, 16, 16, 10);
const ox = (s: Standing | Overlay | null): number | undefined => (s !== null && "kind" in s ? s.ox ?? 0 : s?.x);

test("foot is the sheet anchor on a flipped unit too: a foot step does not move when the unit mirrors (step 33a ruling 4, QA)", () => {
  for (const draw_layer of ["front-unit", "air"]) assert.equal(ox(place({ anchor_point: "foot", draw_layer }, actor({ flipX: true }))), ox(place({ anchor_point: "foot", draw_layer }, actor())));
  assert.equal(ox(place({ anchor_point: "foot", draw_layer: "front-unit" }, actor({ flipX: true }))), 0);
});

test("a unit-layer step keeps the anchor's dy and sorts at its key; with no unit it plays as air (step 33a rulings 13-14, QA)", () => {
  const fx = place({ anchor_point: "centre", draw_layer: "front-unit" }, actor({ dy: 5 }));
  assert.equal(fx !== null && "kind" in fx ? fx.dy : null, 5);
  const scene: RenderScene = { cols: 10, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, ground: [], above: [], overlays: [], standing: [fx as Standing, { kind: "unit", sheet: unitSheet, c: 2, r: 2, dy: 5 }] };
  assert.deepEqual(buildDrawList(scene, fitView(160, 96, 1, 16, 16), snapCamera(0, 0, 1), 0, 10).cmds.map((c) => c.sheet), ["unit", "fx"]);
  for (const draw_layer of ["front-unit", "behind-unit"]) assert.deepEqual(place({ anchor_point: "hand", draw_layer }, null), { band: "fxAir", sheet: fxSheet, x: 36, y: 40, frame: 0 });
});

test("crossed ends past 2^53 laps instead of spinning, and still fires a normal lap (law 13, QA)", () => {
  assert.deepEqual(crossed([], 1e17 - 10, 1e17, { from: 0, lapMs: 1 }), []);
  assert.deepEqual(crossed([], 0, 250, { from: 0, lapMs: 100 }).map((e) => e.at), [100, 200]);
});

test("a step's strip animates from the step start: a 4-frame strip shows frame 2 at 250 ms in every return shape; no clip or 1 frame stays on 0 (step 33a, EA ruling on QA S-1)", () => {
  const strip = { name: "s", frames: [0, 1, 2, 3], ms: [100, 100, 100, 100] }, one = { name: "o", frames: [0] };
  const frameOf = (p: Partial<FxPiece>, unit: FxActor | null): number | undefined => placeStep({ at: 0, ms: 500, sheet: fxSheet, ...p }, 1000, 1250, 1100, () => unit, { x: 40, y: 48 }, 16, 16, 10)?.frame;
  const shapes: [Partial<FxPiece>, FxActor | null][] = [[{ anchor_point: "tile", draw_layer: "air" }, null], [{ anchor_point: "hand", draw_layer: "air" }, actor()], [{ anchor_point: "hand", draw_layer: "front-unit" }, actor()], [{ anchor_point: "hand", draw_layer: "air" }, null]];
  assert.deepEqual(shapes.map(([p, u]) => [frameOf({ ...p, clip: strip }, u), frameOf(p, u), frameOf({ ...p, clip: one }, u)]), shapes.map(() => [2, 0, 0]));
  assert.equal(frameOf({ at: 100, anchor_point: "tile", clip: strip }, null), 1); // timed from the step start (effect 1000 + at 100), not the effect start
});
