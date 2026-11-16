import assert from "node:assert/strict";
import { test } from "node:test";
import { createMatchLink, matchPatch, nearestFoe, sceneFromMatch, type MatchArt } from "../../../src/runtime/scene/match-link.ts";
import { createSceneLink, type SceneWorld } from "../../../src/runtime/scene/world-scene.ts";
import { docToLiveFx } from "../../../src/runtime/render/fx-doc.ts";
import { createWorld, replay, runMatch, snapshot, type SimInput } from "../../../src/sim/index.ts";
import { bot, reachFarRow, seedless } from "../../sim/ai.ts";
import { input } from "../../sim/input.ts";
import { seatAll } from "../../sim/seats.ts";
const sheet = (id: string): { id: string; fw: number; fh: number; columns: number } => ({ id, fw: 16, fh: 16, columns: 4 });
const map = (cols: number, rows: number, units: [string, number, number][], tileW = 16, tileH = 16): SceneWorld => ({ cols, rows, tileW, tileH, mapSeed: 1, assets: {}, layers: [], objects: [], overlays: [], units: units.map(([id, c, r]) => ({ id, sprite: "s", at: { c, r }, offset: null, facing: null, alive: true })) });
const box = (p: ReturnType<typeof matchPatch>): number[] | null => p === null ? null : [p.c, p.r, p.cols, p.rows, p.x, p.y, p.w, p.h];
test("E3 matchPatch (RISKY, M-B8): a window on the real map that holds the caster and the target when both fit, centred on the pair and clamped inside the map; its pixel box is tiles × tileW / tileH", () => {
  const w = map(10, 8, [["a", 4, 4], ["b", 6, 4], ["c", 0, 0], ["d", 9, 7]]);
  assert.deepEqual(box(matchPatch(w, { caster: "a", target: "b" }, { cols: 3, rows: 2 })), [4, 4, 3, 2, 64, 64, 48, 32]);
  assert.deepEqual(box(matchPatch(w, { caster: "a", target: "b" }, { cols: 5, rows: 4 })), [3, 3, 5, 4, 48, 48, 80, 64]);
  assert.deepEqual(box(matchPatch(w, { caster: "c" }, { cols: 3, rows: 2 })), [0, 0, 3, 2, 0, 0, 48, 32]);
  assert.deepEqual(box(matchPatch(w, { caster: "d", target: null }, { cols: 3, rows: 2 })), [7, 6, 3, 2, 112, 96, 48, 32]);
  assert.deepEqual(box(matchPatch(map(10, 8, [["a", 4, 4], ["b", 4, 2]], 32, 16), { caster: "b", target: "a" }, { cols: 3, rows: 4 })), [3, 2, 3, 4, 96, 32, 96, 64]);
});
test("E3 matchPatch: a target that does not fit gives the caster's window; size is whole tiles 1–16 and at most the map, NaN gives 3 × 2; an unknown caster or an empty or non-number map is null; a fractional map counts whole tiles; the world is never cropped", () => {
  const w = map(20, 20, [["a", 2, 2], ["b", 9, 2]]), copy = JSON.parse(JSON.stringify(w)) as SceneWorld;
  assert.deepEqual(box(matchPatch(w, { caster: "a", target: "b" }, { cols: 5, rows: 4 })), [0, 1, 5, 4, 0, 16, 80, 64]);
  assert.deepEqual(box(matchPatch(w, { caster: "a", target: "zz" }, { cols: 3, rows: 2 })), [1, 2, 3, 2, 16, 32, 48, 32]);
  assert.deepEqual([[40, 40], [0, -3], [2.9, 1.2], [Number.NaN, Number.POSITIVE_INFINITY]].map(([c, r]) => matchPatch(w, { caster: "a" }, { cols: c ?? 0, rows: r ?? 0 })).map((p) => [p?.cols, p?.rows]), [[16, 16], [1, 1], [2, 1], [3, 2]]);
  assert.deepEqual(box(matchPatch(map(2, 1, [["a", 1, 0]]), { caster: "a" }, { cols: 5, rows: 4 })), [0, 0, 2, 1, 0, 0, 32, 16]);
  assert.equal(matchPatch(w, { caster: "zz" }, { cols: 3, rows: 2 }), null); assert.equal(matchPatch(map(0, 0, [["a", 0, 0]]), { caster: "a" }, { cols: 3, rows: 2 }), null);
  for (const [c, r] of [[Number.NaN, 8], [10, Number.NaN], [0.5, 8]]) assert.equal(matchPatch(map(c ?? 0, r ?? 0, [["a", 0, 0]]), { caster: "a" }, { cols: 3, rows: 2 }), null); assert.deepEqual(box(matchPatch(map(2.5, 1.9, [["a", 1, 0]]), { caster: "a" }, { cols: 5, rows: 4 })), [0, 0, 2, 1, 0, 0, 32, 16]); assert.deepEqual(w, copy);
});
test("E3 nearestFoe (RISKY): the nearest living unit on a foe side by |dc| + |dr|, ties by id; foes (the foe sides) is required: omitting it is a type error and an untyped call with no list is null; dead, same-side and sideless units are skipped; a missing or sideless caster is null", () => {
  const u = (id: string, side: unknown, c: number, r: number, alive = true): Record<string, unknown> => ({ id, unitId: "x", side, at: { c, r }, alive }), s = { units: [u("me", "p", 2, 2), u("ally", "p", 2, 3), u("crate", "neutral", 3, 2), u("w2", "wolves", 2, 5), u("w1", "wolves", 5, 2), u("dead", "wolves", 2, 1, false), u("ghost", null, 1, 2), 7] };
  assert.equal(nearestFoe(s, "me", ["neutral", "wolves"]), "crate"); assert.equal(nearestFoe(s, "me", ["wolves"]), "w1"); assert.equal(nearestFoe(s, "me", []), null); assert.equal(nearestFoe(s, "me", ["p", "nobody"]), null); assert.equal(nearestFoe(s, "w1", ["neutral", "p"]), "crate"); assert.equal(nearestFoe(s, "w1", ["p"]), "me");
  assert.equal(nearestFoe(s, "nobody", ["wolves"]), null); assert.equal(nearestFoe(s, "ghost", ["wolves"]), null); assert.equal(nearestFoe(null, "me", ["wolves"]), null); assert.equal(nearestFoe({ units: [u("me", "p", 0, 0)] }, "me", ["wolves"]), null);
  const required: Parameters<typeof nearestFoe>["length"] extends 3 ? true : false = true; assert.equal(required, true); assert.doesNotThrow(() => nearestFoe(s, "me", undefined as unknown as string[])); assert.equal(nearestFoe(s, "me", undefined as unknown as string[]), null);
});
test("E3 end to end (X3 closed, M-B8): a stage-fixed replay's JSON snapshot goes through the link and draws every living unit standing; an effect from a real unit to its nearestFoe travels from the caster's cell and lands on the foe's cell; the same run gives the same picture", () => {
  const run = (): { standing: number; units: number; foe: string | null; at0: number[]; land: number[]; foeCell: number[] } => {
    const src: SimInput = seedless(input("stage-fixed", 1)), sides = ["player", "wolves"] as const, played = createWorld(src);
    runMatch(played, { sides: [...sides], victory: reachFarRow, fuse: 60000, maxRounds: 40, maxSimMs: 600000, seats: seatAll(played, sides, bot(1), 200) });
    const plain: unknown = JSON.parse(JSON.stringify(snapshot(replay(src, played.log, played.clock.tick())))), names = ["knight", "archer", "wolf", "crate", "merchant", "ground", "fx"];
    const art: MatchArt = { cols: 6, rows: 9, tileW: 16, tileH: 16, mapSeed: 1, layers: [], assets: Object.fromEntries(names.map((n) => [n, { sheet: sheet(n) }])), sprites: Object.fromEntries(names.slice(0, 5).map((n) => [n, n])) };
    const world = createMatchLink().world(plain, art), foe = nearestFoe(plain, "knight#1", ["wolves"]), scene = createSceneLink(), me = world.units.find((x) => x.id === "knight#1"), it = world.units.find((x) => x.id === foe);
    const fx = docToLiveFx({ connect_step: "a", steps: [{ id: "a", kind: "straight", seconds: 0.6, bend: 0, hold_ms: 300 }] }, { id: "e", castMs: 0, caster: "knight#1", ...(foe === null ? {} : { target: foe }), sheetOf: () => sheet("fx") }).fx;
    const at = (t: number): number[] => { const o = scene.scene({ ...world, effects: [fx] }, { tMs: t, stepMs: 10 }).overlays[0]; return o === undefined ? [] : [o.x, o.y]; };
    return { standing: scene.scene(world, { tMs: 0, stepMs: 10 }).standing.length, units: world.units.length, foe, at0: [...at(0), ...[me?.at.c ?? -1, me?.at.r ?? -1].map((v) => v * 16)], land: at(800), foeCell: [it?.at.c ?? -1, it?.at.r ?? -1].map((v) => v * 16) };
  };
  const a = run(); assert.deepEqual([a.units, a.standing, a.foe], [6, 6, "wolf#3"]); assert.deepEqual(a.at0.slice(0, 2), a.at0.slice(2)); assert.deepEqual(a.land, a.foeCell); assert.deepEqual(run(), a);
  assert.equal(sceneFromMatch(JSON.parse(JSON.stringify({ units: [{ id: "x", unitId: "knight", at: { c: 0, r: 0 }, alive: true }] })), { cols: 1, rows: 1, tileW: 16, tileH: 16, mapSeed: 0, assets: {}, layers: [], sprites: { knight: "knight" } }).world.units.length, 1);
});
