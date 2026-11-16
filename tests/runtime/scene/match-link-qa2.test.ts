import assert from "node:assert/strict";
import { test } from "node:test";
import { matchPatch, nearestFoe } from "../../../src/runtime/scene/match-link.ts";
import type { SceneWorld } from "../../../src/runtime/scene/world-scene.ts";
const world = (cols: number, rows: number, c = 10, r = 10): SceneWorld => ({ cols, rows, tileW: 16, tileH: 16, mapSeed: 1, assets: {}, layers: [], objects: [], overlays: [], units: [{ id: "a", sprite: "s", at: { c, r }, offset: null, facing: null, alive: true }] });
const box = (cols: number, rows: number, map = world(20, 20)): number[] | null => { const p = matchPatch(map, { caster: "a" }, { cols, rows }); return p && [p.cols, p.rows, p.c, p.r]; };
const row = (id: string, side: string, c: number): Record<string, unknown> => ({ id, unitId: "knight", side, at: { c, r: 0 }, alive: true });
test("E3 QA: a non-finite matchPatch axis falls back on that axis only (3 cols or 2 rows, clamped to the map); the finite axis is kept (ruling 9)", () => {
  assert.deepEqual(box(Number.NaN, 5), [3, 5, 9, 8]);
  assert.deepEqual(box(7, Number.POSITIVE_INFINITY), [7, 2, 7, 10]);
  assert.deepEqual(box(Number.NEGATIVE_INFINITY, 0.5), [3, 1, 9, 10]);
  assert.deepEqual(box(Number.NaN, 30), [3, 16, 9, 3]);
  assert.deepEqual(box(Number.NaN, Number.NaN, world(12, 1, 10, 0)), [3, 1, 9, 0]);
});
test("E3 QA: nearestFoe never returns the caster's own id, even when a later row repeats it on a foe side (ruling 10)", () => {
  assert.equal(nearestFoe({ units: [row("me", "player", 0), row("me", "wolves", 1), row("w9", "wolves", 4)] }, "me", ["wolves"]), "w9");
  assert.equal(nearestFoe({ units: [row("me", "player", 0), row("me", "wolves", 1)] }, "me", ["wolves"]), null);
});
