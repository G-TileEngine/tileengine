import assert from "node:assert/strict";
import { test } from "node:test";
import { docToLiveFx, type DocHost, type FxDocValues } from "../../../src/runtime/render/fx-doc.ts";
import type { LiveFx } from "../../../src/runtime/render/fx-live.ts";
import { createSceneLink } from "../../../src/runtime/scene/world-scene.ts";
import { flatten } from "../../../src/editor/effect/fit.ts";
const sheet = { id: "fx", fw: 16, fh: 16, columns: 4 }, host: DocHost = { id: "e2", castMs: 0, caster: "u0", target: "u1", sheetOf: () => sheet };
const throwDown: FxDocValues = { steps: [{ id: "a", kind: "straight", seconds: 0.6, bend: 0, hold_ms: 300 }, { id: "b", kind: "particles", particle_count: 4, start_mode: "with-last", ride: "a" }] };
type Out = { overlays: { x: number; y: number; look?: string }[]; dots?: { x: number; y: number }[]; standing: { sheet: { id: string }; c: number; r: number; ox?: number; oy?: number; look?: string }[] };
const scene = (fx: LiveFx, t: number, o: { lite?: boolean; target?: boolean } = {}): Out => { const units = [0, 1].map((i) => ({ id: `u${i}`, sprite: "hero", at: { c: 2, r: 2 + i * 3 }, offset: null, facing: "E" as const, alive: true })).slice(0, o.target === false ? 1 : 2);
  const world = { cols: 8, rows: 8, tileW: 16, tileH: 16, mapSeed: 3, overlays: [], objects: [], layers: [], units, assets: { hero: { sheet: { ...sheet, id: "hero" } }, fx: { sheet } }, effects: [fx] };
  return createSceneLink().scene(world, { tMs: t, stepMs: 10, ...(o.lite === true ? { lite: true } : {}) }) as unknown as Out; };
const at = (fx: LiveFx, t: number, o: { lite?: boolean; target?: boolean } = {}): [number, number, string | undefined] => { const p = scene(fx, t, o).overlays[0]; assert.ok(p !== undefined, `t=${t}`); return [p.x, p.y, p.look]; };
test("E2 converter: travel steps get path {kind, at, ms = len (not hold), bend, ease}; other kinds get none; bad path values are noted per step; a disabled step is not noted", () => {
  const { fx, notes } = docToLiveFx({ steps: [{ id: "a", kind: "swerve", seconds: 0.3, hold_ms: 200, bend: 4 }, { kind: "straight", seconds: 0.2 }, { kind: "stamp" }, { kind: "orbit", look_ease: "x", enabled: false }] }, host);
  assert.deepEqual(fx.pieces.map((p) => p.path ?? null), [{ kind: "swerve", at: 0, ms: 300, bend: 2.5, ease: "linear" }, { kind: "straight", at: 500, ms: 200, bend: 0.8, ease: "linear" }, null]); assert.equal(fx.pieces[0]?.ms, 500);
  assert.deepEqual(notes, [{ code: "outOfRange", message: "steps[0].bend" }]);
});
test("E2 ride (M-B6, CN-026): a particles, stamp or circle flash step with ride = a travel step's id takes that step's own path and timing (one hop); an empty, unknown, self, non-travel, disabled or past-12 target is unknownRef, a non-string is invalidValue; ride on any other kind or a screen flash is ignored", () => {
  const { fx, notes } = docToLiveFx({ steps: [...(throwDown["steps"] as object[]), { id: "c", kind: "stamp", ride: "b" }, { kind: "stamp", ride: "zz" }, { id: "d", kind: "orbit", seconds: 0.3, ride: "a", start_mode: "at-time", start_at_ms: 900 }, { kind: "stamp", ride: 7 }, { kind: "particles", ride: null }, { id: "e", kind: "stamp", ride: "e" }, { kind: "flash", flash_shape: "circle", ride: "a" }, { kind: "dim", ride: "a" }, { kind: "stamp", ride: "" }, { kind: "stamp", ride: "far" }, { id: "far", kind: "straight" }] }, host);
  assert.deepEqual(fx.pieces[1]?.path, fx.pieces[0]?.path); assert.deepEqual(fx.pieces.map((p, i) => [i, p.path]).filter(([, p]) => p === undefined).map(([i]) => i), [2, 3, 5, 6, 7, 9, 10, 11]); assert.deepEqual(fx.pieces[8]?.path, fx.pieces[0]?.path, "a circle flash rides");
  assert.deepEqual(fx.pieces[4]?.path, { kind: "orbit", at: 900, ms: 300, bend: 0.8, ease: "linear", radius: 1.05, turns: 1 }, "ride on a travel kind is ignored: it keeps its own path");
  assert.deepEqual(notes, [{ code: "overCap", message: "Steps 13+ are saved but won't play" }, { code: "unknownRef", message: "steps[2].ride" }, { code: "unknownRef", message: "steps[3].ride" }, { code: "invalidValue", message: "steps[5].ride" }, { code: "invalidValue", message: "steps[6].ride" }, { code: "unknownRef", message: "steps[7].ride" }, { code: "unknownRef", message: "steps[10].ride" }, { code: "unknownRef", message: "steps[11].ride" }], "empty, missing, self, non-travel and past-12 targets are unknownRef");
  const hop = docToLiveFx({ steps: [{ id: "A", kind: "stamp", ride: "B" }, { id: "B", kind: "straight", seconds: 0.3, ride: "C" }, { id: "C", kind: "orbit", seconds: 0.3 }, { id: "X", kind: "swerve", enabled: false }, { kind: "stamp", ride: "X" }, { kind: "stamp", ride: "zz", enabled: false }, { kind: "flash", ride: "B" }] }, host);
  assert.equal(hop.fx.pieces[1]?.path?.kind, "straight"); assert.deepEqual(hop.fx.pieces[0]?.path, hop.fx.pieces[1]?.path, "one hop: A rides B's own path, never B's ride (C)"); assert.equal(hop.fx.pieces.length, 5); assert.equal(hop.fx.pieces[4]?.path, undefined, "a screen flash (the default) does not ride, with no note");
  assert.equal(hop.fx.pieces[3]?.path, undefined, "a disabled travel step can't be ridden"); assert.deepEqual(hop.notes, [{ code: "unknownRef", message: "steps[4].ride" }], "a disabled rider is not noted");
});
test("E2 play: a straight step flies caster → target on the 30 ms pose grid, turns to its heading (look bucket, 8 in lite: 90° = n4) and holds on the target through hold_ms", () => {
  const fx = docToLiveFx(throwDown, host).fx;
  assert.deepEqual([at(fx, 0), at(fx, 300), at(fx, 600), at(fx, 850)], [[32, 32, "r4"], [32, 56, "r4"], [32, 80, "r4"], [32, 80, "r4"]]);
  assert.deepEqual(at(fx, 31), at(fx, 59), "one pose per 30 ms"); assert.notDeepEqual(at(fx, 59), at(fx, 60)); assert.equal(at(fx, 300, { lite: true })[2], "n4");
  assert.equal(JSON.stringify(scene(fx, 420)), JSON.stringify(scene(fx, 420)), "deterministic");
  const unitBand = docToLiveFx({ steps: [{ id: "a", kind: "straight", seconds: 0.6, bend: 0, draw_layer: "front-unit", anchor_point: "centre" }, { kind: "stamp", ride: "a", start_mode: "with-last" }] }, host).fx;
  const fly = (t: number): unknown => { const o = scene(unitBand, t), u = o.standing.find((p) => p.sheet.id === "fx"); return [u?.c, u?.r, u?.oy, u?.look, o.overlays[0]?.y, o.overlays[0]?.look]; };
  assert.deepEqual([fly(0), fly(300)], [[2, 2, -8, "r4", 32, undefined], [2, 2, 16, "r4", 56, undefined]], "a unit-band piece moves by ox/oy and keeps its unit's sort key; a non-travel rider moves but never turns");
});
test("E2 absent = today: a piece without path never moves or turns (hand-built LiveFx), and with no target unit or cell a path plays at its anchor", () => {
  const fx = docToLiveFx(throwDown, host).fx, bare: LiveFx = { ...fx, pieces: fx.pieces.map((p) => { const q = { ...p }; delete q.path; return q; }) };
  assert.deepEqual([at(bare, 0), at(bare, 600)], [[32, 32, undefined], [32, 32, undefined]]); const arc = docToLiveFx({ steps: [{ kind: "straight", seconds: 0.6 }] }, host).fx; assert.deepEqual([at(arc, 0, { target: false }), at(arc, 300, { target: false })], [[32, 32, undefined], [32, 32, undefined]]);
  const toCell: LiveFx = { ...fx, at: { c: 5, r: 2 } }; delete (toCell as { target?: string }).target; assert.deepEqual([at(toCell, 0), at(toCell, 600)], [[32, 32, undefined], [80, 32, undefined]], "a cell target (LiveFx.at) is a landing point too");
});
test("E2 riders move with the path (particles centre); flatten remaps ride to the moved step's fresh id and removes a ride naming no step of its side", () => {
  const fx = docToLiveFx(throwDown, host).fx, mean = (t: number): number => { const d = scene(fx, t).dots ?? []; assert.ok(d.length > 0); return d.reduce((s, p) => s + p.y, 0) / d.length; };
  assert.ok(mean(300) - mean(30) > 16, "the spark cloud travels down with the throw");
  let n = 0; const base = { id: "effect_A", rev: 1, doc: { steps: [{ id: "h", kind: "stamp", seconds: 0.3 }] } }, other = { id: "effect_B", rev: 2, doc: { steps: [...(throwDown["steps"] as object[]), { id: "q", kind: "stamp", ride: "h" }] } };
  const merged = flatten(base, other, { base: "a", mix: 50, mint: (p) => `${p}${(n += 1)}` }).doc, out = merged["steps"] as Record<string, unknown>[];
  assert.deepEqual(out.map((s) => [s["id"], s["ride"]]), [["h", undefined], ["s-1", undefined], ["s-2", "s-1"], ["s-3", undefined]]); assert.equal("ride" in (out[3] ?? {}), false, "a ride naming no step of its side is removed (absent), never null or a base id");
  const re = docToLiveFx(merged, host), flat = re.fx; assert.deepEqual(flat.pieces[2]?.path, flat.pieces[1]?.path); assert.deepEqual(re.notes.filter((x) => x.code === "invalidValue"), [], "the flattened doc re-validates with no H2");
});
