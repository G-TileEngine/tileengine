import assert from "node:assert/strict";
import { test } from "node:test";
import { createMatchLink, matchPatch, nearestFoe, sceneFromMatch, type MatchArt } from "../../../src/runtime/scene/match-link.ts";
import { createSceneLink, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";
import { docToLiveFx } from "../../../src/runtime/render/fx-doc.ts";
const sheet = (id: string): { id: string; fw: number; fh: number; columns: number } => ({ id, fw: 16, fh: 16, columns: 4 });
const art: MatchArt = { cols: 8, rows: 6, tileW: 16, tileH: 16, mapSeed: 7, assets: { knight: { sheet: sheet("knight") }, fx: { sheet: sheet("fx") } }, layers: [], sprites: { knight: "knight" } };
const unit = (id: unknown, unitId: string, c: unknown, r: number, extra: Record<string, unknown> = {}): Record<string, unknown> => ({ id, unitId, side: "p", at: { c, r }, offset: null, facing: "E", alive: true, ...extra });
const map = (cols: number, rows: number, units: [string, number, number][]): SceneWorld => ({ cols, rows, tileW: 16, tileH: 16, mapSeed: 1, assets: {}, layers: [], objects: [], overlays: [], units: units.map(([id, c, r]) => ({ id, sprite: "s", at: { c, r }, offset: null, facing: null, alive: true })) });
test("E3 QA: rows skipped as off-map or sprite-less still claim their id; checks run invalid, repeated id, off-map, sprite; at is a fresh {c, r}; a rebuild draws the new snapshot", () => {
  const { world, notes } = sceneFromMatch({ units: [unit("a", "knight", 9, 0), unit("a", "knight", 1, 0), unit("b", "dragon", 2, 0), unit("b", "knight", 3, 0), unit("c", "dragon", 8, 0), unit("a", "knight", 9, 9), unit("d", "knight", 4, 0, { at: { c: 4, r: 0, z: 1 } })] }, art);
  assert.deepEqual(world.units.map((u) => [u.id, u.at]), [["d", { c: 4, r: 0 }]]);
  assert.deepEqual(notes.map((n) => `${n.code} ${n.message}`), ["outOfRange units[0].at", "invalidValue units[1].id", "unknownRef units[2].unitId", "invalidValue units[3].id", "outOfRange units[4].at", "invalidValue units[5].id"]);
  const link = createMatchLink(); link.world({ units: [unit("a", "knight", 0, 0)] }, art); assert.deepEqual(link.world({ units: [unit("z", "knight", 5, 5)] }, art).units.map((u) => u.id), ["z"]);
});
test("E3 QA: a moved rev re-reads units edited in place, and the first rev after frames without one re-reads the effects (ruling 8)", () => {
  const units = [{ id: "k", sprite: "knight", at: { c: 1, r: 1 }, offset: null, facing: null, alive: true }], bare: SceneWorld = { ...sceneFromMatch({ units: [] }, art).world, units }, w: SceneWorld = { ...bare, rev: 1 }, scene = createSceneLink(), at = { tMs: 0, stepMs: 10 };
  assert.equal(scene.scene(w, at).standing[0]?.c, 1); units[0] = { ...units[0], at: { c: 5, r: 2 } } as (typeof units)[0]; assert.equal(scene.scene({ ...w, rev: 2 }, at).standing[0]?.c, 5);
  const fx = (id: string): ReturnType<typeof docToLiveFx>["fx"] => docToLiveFx({ steps: [{ kind: "stamp" }] }, { id, castMs: 0, caster: "k", sheetOf: () => sheet("fx") }).fx;
  const list = [fx("e1")], s2 = createSceneLink(), t = { tMs: 30, stepMs: 10 }, one = s2.scene({ ...bare, effects: list }, t).overlays.length; list.push(fx("e2"));
  assert.equal(s2.scene({ ...bare, effects: list }, t).overlays.length, one); assert.equal(s2.scene({ ...w, effects: list, rev: 5 }, t).overlays.length, one * 2); assert.ok(one > 0);
});
test("E3 QA: matchPatch fits a pair only when |Δ| < size; the 3 × 2 default is clamped to the map; a map with no rows is null", () => {
  assert.deepEqual(matchPatch(map(10, 8, [["a", 2, 4], ["b", 5, 4]]), { caster: "a", target: "b" }, { cols: 3, rows: 2 }), { c: 1, r: 4, cols: 3, rows: 2, x: 16, y: 64, w: 48, h: 32 });
  assert.deepEqual(matchPatch(map(2, 1, [["a", 1, 0]]), { caster: "a" }, { cols: Number.NaN, rows: Number.NaN }), { c: 0, r: 0, cols: 2, rows: 1, x: 0, y: 0, w: 32, h: 16 });
  assert.equal(matchPatch(map(5, 0, [["a", 1, 0]]), { caster: "a" }, { cols: 3, rows: 2 }), null);
});
test("E3 QA: nearestFoe reads only the first 1024 rows and skips rows with no alive: true, a bad cell or a non-string id; a caster with a bad cell is null", () => {
  const me = unit("me", "x", 0, 0), foe = (extra: Record<string, unknown>): Record<string, unknown> => ({ ...unit("w", "x", 1, 0), side: "wolves", ...extra });
  assert.equal(nearestFoe({ units: [me, ...Array.from({ length: 1028 }, (_, i) => unit(`a${i}`, "x", 1, 1)), foe({})] }, "me", ["wolves"]), null); assert.equal(nearestFoe({ units: [me, foe({})] }, "me", ["wolves"]), "w");
  for (const bad of [{ alive: undefined }, { alive: 1 }, { at: { c: 1.5, r: 0 } }, { id: 7 }]) assert.equal(nearestFoe({ units: [me, foe(bad)] }, "me", ["wolves"]), null, JSON.stringify(bad));
  assert.equal(nearestFoe({ units: [{ ...me, at: null }, foe({})] }, "me", ["wolves"]), null);
});
