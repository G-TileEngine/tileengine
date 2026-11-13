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
