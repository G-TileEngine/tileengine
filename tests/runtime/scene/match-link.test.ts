import assert from "node:assert/strict";
import { test } from "node:test";
import { createMatchLink, MATCH, sceneFromMatch, type MatchArt } from "../../../src/runtime/scene/match-link.ts";
import { createSceneLink } from "../../../src/runtime/scene/world-scene.ts";
import { docToLiveFx } from "../../../src/runtime/render/fx-doc.ts";
const sheet = (id: string): { id: string; fw: number; fh: number; columns: number } => ({ id, fw: 16, fh: 16, columns: 4 });
const art: MatchArt = { cols: 8, rows: 6, tileW: 16, tileH: 16, mapSeed: 7, assets: { ground: { sheet: sheet("ground") }, knight: { sheet: sheet("knight") }, wolf: { sheet: sheet("wolf") }, fx: { sheet: sheet("fx") } }, layers: [{ tileset: "ground", aboveUnits: false, visible: true, tiles: Array.from({ length: 48 }, () => 0) }], sprites: { knight: "knight", wolf: "wolf" } };
const unit = (id: string, unitId: string, c: number, r: number, extra: Record<string, unknown> = {}): Record<string, unknown> => ({ id, unitId, side: unitId === "wolf" ? "wolves" : "player", at: { c, r }, offset: null, facing: "E", alive: true, ...extra });
const snap = (units: unknown[]): Record<string, unknown> => ({ tick: 3, clockMs: 30, units, logSeq: 2 });
test("E3 sceneFromMatch (D3 shape): each unit maps to id, sprite by unitId, at, offset, facing, alive; move while offset is set, else idle; the map, objects, style and water come from the art", () => {
  const props = [{ assetId: "knight", at: { c: 0, r: 0 } }], style = { ramps: {} } as unknown as NonNullable<MatchArt["style"]>, water = { ground: [3] };
  const { world, notes } = sceneFromMatch(snap([unit("k1", "knight", 2, 3, { offset: { dx: 4, dy: -2 }, facing: "N" }), unit("w1", "wolf", 5, 1, { alive: false, facing: null })]), { ...art, objects: props, style, waterTiles: water });
  assert.deepEqual(notes, []); assert.deepEqual([world.cols, world.rows, world.tileW, world.tileH, world.mapSeed], [8, 6, 16, 16, 7]);
  assert.deepEqual(world.units, [{ id: "k1", sprite: "knight", at: { c: 2, r: 3 }, offset: { dx: 4, dy: -2 }, facing: "N", alive: true, action: "move" }, { id: "w1", sprite: "wolf", at: { c: 5, r: 1 }, offset: null, facing: null, alive: false, action: "idle" }]);
  assert.equal(world.objects, props); assert.equal(world.style, style); assert.equal(world.waterTiles, water); assert.deepEqual(world.overlays, []); assert.equal(world.rev, undefined); assert.equal(world.effects, undefined);
  const bare = sceneFromMatch(snap([]), art).world; assert.deepEqual(bare.objects, []); assert.equal("style" in bare || "waterTiles" in bare, false);
});
test("E3 sceneFromMatch copies the snapshot: nothing in the world is shared with it, the art's assets and layers are shared by reference, and the same input gives the same output", () => {
  const s = snap([unit("k1", "knight", 2, 3, { offset: { dx: 1, dy: 1 } })]), a = sceneFromMatch(s, art), u = (s["units"] as Record<string, Record<string, number>>[])[0];
  assert.ok(u !== undefined); assert.notEqual(a.world.units[0]?.at, u["at"]); assert.notEqual(a.world.units[0]?.offset, u["offset"]);
  (u["at"] as unknown as { c: number }).c = 0; (u["offset"] as unknown as { dx: number }).dx = 9; assert.deepEqual([a.world.units[0]?.at.c, a.world.units[0]?.offset?.dx], [2, 1]);
  assert.equal(a.world.assets, art.assets); assert.equal(a.world.layers, art.layers); assert.deepEqual(sceneFromMatch(s, art), sceneFromMatch(JSON.parse(JSON.stringify(s)), art));
});
test("E3 sceneFromMatch never throws: a bad row is skipped with invalidValue units[i] (not a record, id or unitId not a string, at not integer cells, alive not a boolean); outside the map is outOfRange; a repeated id keeps the first; a snapshot with no units list gives invalidValue snapshot.units", () => {
  const { world, notes } = sceneFromMatch(snap([7, unit("a", "knight", 0, 0, { id: 3 }), unit("b", "knight", 0, 0, { unitId: null }), unit("c", "knight", 1.5, 0), unit("d", "knight", 0, 0, { at: null }), unit("e", "knight", 0, 0, { alive: 1 }), unit("f", "knight", 8, 0), unit("g", "knight", 0, -1), unit("h", "knight", 0, 6), unit("k", "knight", 1, 1), unit("k", "wolf", 2, 2)]), art);
  assert.deepEqual(world.units.map((u) => [u.id, u.sprite]), [["k", "knight"]]);
  assert.deepEqual(notes.map((n) => `${n.code} ${n.message}`), ["invalidValue units[0]", "invalidValue units[1]", "invalidValue units[2]", "invalidValue units[3]", "invalidValue units[4]", "invalidValue units[5]", "outOfRange units[6].at", "outOfRange units[7].at", "outOfRange units[8].at", "invalidValue units[10].id"]);
  for (const bad of [null, 3, "x", [], { units: {} }, { units: null }]) assert.deepEqual(sceneFromMatch(bad, art), { world: { ...sceneFromMatch(snap([]), art).world }, notes: [{ code: "invalidValue", message: "snapshot.units" }] });
});
test("E3 sprites: a unitId with no sprite in the art is skipped with one unknownRef per unitId; a prototype key is not a sprite", () => {
  const { world, notes } = sceneFromMatch(snap([unit("a", "dragon", 0, 0), unit("b", "dragon", 1, 0), unit("c", "constructor", 2, 0), unit("d", "toString", 3, 0), unit("e", "knight", 4, 0)]), art);
  assert.deepEqual(world.units.map((u) => u.id), ["e"]); assert.deepEqual(notes, [{ code: "unknownRef", message: "units[0].unitId" }, { code: "unknownRef", message: "units[2].unitId" }, { code: "unknownRef", message: "units[3].unitId" }]);
});
test("E3 facing and offset: absent reads null with no note; a facing outside N/E/S/W/null, or an offset that is not two finite numbers, is null with invalidValue, and a unit with no offset is idle", () => {
  const { world, notes } = sceneFromMatch(snap([{ id: "a", unitId: "knight", at: { c: 0, r: 0 }, alive: true }, unit("b", "knight", 1, 0, { facing: "NE" }), unit("c", "knight", 2, 0, { facing: 2 }), unit("d", "knight", 3, 0, { offset: { dx: Number.NaN, dy: 0 } }), unit("e", "knight", 4, 0, { offset: { dx: "1", dy: 0 } }), unit("f", "knight", 5, 0, { offset: { dx: 0, dy: 0 } })]), art);
  assert.deepEqual(world.units.map((u) => [u.id, u.facing, u.offset, u.action]), [["a", null, null, "idle"], ["b", null, null, "idle"], ["c", null, null, "idle"], ["d", "E", null, "idle"], ["e", "E", null, "idle"], ["f", "E", { dx: 0, dy: 0 }, "move"]]);
  assert.deepEqual(notes.map((n) => `${n.code} ${n.message}`), ["invalidValue units[1].facing", "invalidValue units[2].facing", "invalidValue units[3].offset", "invalidValue units[4].offset"]);
});
test("E3 cap (law 13): only the first 1024 units are read; more give one overCap snapshot.units", () => {
  assert.equal(MATCH.units, 1024); const big = { ...art, cols: 64, rows: 64 }, many = Array.from({ length: 1030 }, (_, i) => unit(`u${i}`, "knight", i % 64, Math.floor(i / 64)));
  const { world, notes } = sceneFromMatch(snap(many), big); assert.equal(world.units.length, 1024); assert.equal(world.units.at(-1)?.id, "u1023"); assert.deepEqual(notes, [{ code: "overCap", message: "snapshot.units" }]);
  assert.deepEqual(sceneFromMatch(snap(many.slice(0, 1024)), big).notes, []);
});
test("E3 createMatchLink: the same snapshot and art objects give the same world object back with no rebuild; a new snapshot or new art rebuilds with the next rev; notes are the last build's", () => {
  const link = createMatchLink(), s1 = snap([unit("a", "knight", 0, 0)]), s2 = snap([unit("a", "dragon", 0, 0)]); assert.deepEqual([link.builds, link.notes], [0, []]);
  const w1 = link.world(s1, art); assert.equal(link.world(s1, art), w1); assert.deepEqual([w1.rev, link.builds], [1, 1]); assert.deepEqual({ ...w1, rev: undefined }, { ...sceneFromMatch(s1, art).world, rev: undefined });
  const w2 = link.world(s2, art); assert.deepEqual([w2.rev, link.builds, link.notes], [2, 2, [{ code: "unknownRef", message: "units[0].unitId" }]]);
  const w3 = link.world(s2, { ...art }); assert.deepEqual([w3.rev, link.builds], [3, 3]); assert.notEqual(w3, w2); assert.equal(link.world(s1, art).rev, 4); assert.equal(createMatchLink().world(s1, art).rev, 1);
});
test("E3 rev (post34 items 18, 19): with a rev and the same units array the scene link skips its per-frame unit key and keeps the scene; a moved rev re-reads an effects list edited in place; without a rev it is today", () => {
  const link = createMatchLink(), w = link.world(snap([unit("k1", "knight", 2, 3), unit("w1", "wolf", 2, 1)]), art), json = JSON.stringify; let keyed = 0;
  JSON.stringify = ((v: unknown, ...rest: []) => { if (Array.isArray(v) && v[0] === "k1") keyed += 1; return json(v, ...rest); }) as typeof JSON.stringify;
  try {
    const scene = createSceneLink(), at = { tMs: 0, stepMs: 10 }, a = scene.scene(w, at); assert.equal(keyed, 1); assert.equal(scene.scene({ ...w }, at), a); assert.equal(keyed, 1);
    const u2 = [...w.units], b = scene.scene({ ...w, units: u2 }, at); assert.equal(keyed, 2); assert.notEqual(scene.scene({ ...w, units: u2, mapSeed: 8 }, at), b); assert.equal(keyed, 3); const plain = createSceneLink(), bare = { ...w, rev: undefined } as unknown as typeof w; keyed = 0; plain.scene(bare, at); plain.scene(bare, at); assert.equal(keyed, 2);
    const r1 = { ...w, units: [...w.units], rev: 7 }, gap = createSceneLink(); keyed = 0; gap.scene(r1, at); gap.scene({ ...r1, rev: undefined } as unknown as typeof w, at); gap.scene(r1, at); assert.equal(keyed, 3);
  } finally { JSON.stringify = json; }
  const fx = (id: string): ReturnType<typeof docToLiveFx>["fx"] => docToLiveFx({ steps: [{ kind: "stamp" }] }, { id, castMs: 0, caster: "k1", target: "w1", sheetOf: () => sheet("fx") }).fx;
  const list = [fx("e1")], scene = createSceneLink(), at = { tMs: 30, stepMs: 10 }, one = scene.scene({ ...w, effects: list }, at).overlays.length; list.push(fx("e2"));
  assert.equal(scene.scene({ ...w, effects: list }, at).overlays.length, one); assert.equal(scene.scene({ ...w, effects: list, rev: 99 }, at).overlays.length, one * 2); assert.ok(one > 0);
});
