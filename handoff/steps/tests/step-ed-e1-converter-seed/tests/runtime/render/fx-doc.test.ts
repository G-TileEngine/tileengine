import assert from "node:assert/strict";
import { test } from "node:test";
import { docToLiveFx, stepTimes, type DocHost, type FxDocValues } from "../../../src/runtime/render/fx-doc.ts";
import { createSceneLink } from "../../../src/runtime/scene/world-scene.ts";
const sheet = { id: "fx", fw: 16, fh: 16, columns: 4 }, host: DocHost = { id: "e1", castMs: 0, caster: "u0", target: "u1", loopMs: 1200, sheetOf: (s) => (s["picture"] === "missing" ? null : sheet) };
const st = (o: Record<string, unknown>): Record<string, unknown> => ({ kind: "straight", seconds: 0.3, ...o });
const sparks = (o: Record<string, unknown> = {}): FxDocValues => ({ connect: 0.5, steps: [st({ id: "a" }), st({ id: "b", kind: "particles", particle_count: 30, start_mode: "with-last" }), st({ id: "c", kind: "particles", particle_count: 18, start_mode: "at-hit", start_at_ms: 60 })], connect_step: "a", ...o });
const play = (doc: FxDocValues): { json: string; notes: string } => { const link = createSceneLink(), fx = docToLiveFx(doc, host).fx, units = [0, 1].map((i) => ({ id: `u${i}`, sprite: "hero", at: { c: 2 + i * 3, r: 2 }, offset: null, facing: "E" as const, alive: true }));
  const world = { cols: 8, rows: 6, tileW: 16, tileH: 16, mapSeed: 3, overlays: [], objects: [], layers: [], units, assets: { hero: { sheet }, fx: { sheet } }, effects: [fx] };
  const json = [0, 90, 200, 420, 700].map((t) => JSON.stringify(link.scene(world, { tMs: t, stepMs: 10 }))).join(); return { json, notes: JSON.stringify(link.notices) }; };
test("E1 R1 timing: after-last chains on len + hold (a fade never delays it), with-last, at-time, at-hit after the hit; disabled steps keep their slot; the hit is connect_step + max(50, len) × connect, ceiled", () => {
  const t = stepTimes({ connect: 0.5, connect_step: "b", steps: [st({ id: "a", hold_ms: 100, kind: "stamp", fade_out_ms: 500 }), st({ id: "b", enabled: false }), st({ id: "c", start_mode: "with-last" }), st({ id: "d", start_mode: "at-time", start_at_ms: 1000 }), st({ id: "e", start_mode: "at-hit", start_at_ms: 30 }), st({ id: "f", seconds: 0.01 })] });
  assert.deepEqual(t.starts, [0, 400, 400, 1000, 580, 880]); assert.equal(t.hitMs, 550); assert.deepEqual(t.ends.slice(0, 2), [900, 700]); assert.equal(t.endMs, 1300); assert.ok(t.notes.some((n) => n.code === "outOfRange" && n.message === "steps[5].seconds"));
  assert.equal(stepTimes({ connect: 0.92, steps: [st({}), st({ seconds: 0.48 })] }).hitMs, 742, "no connect_step: the last step, 300 + ceil(480 × 0.92)");
  const odd = stepTimes({ connect_step: "zz", steps: [st({ start_mode: "at-hit" }), st({ start_mode: "sideways" })] }); assert.deepEqual(odd.starts, [0, 300]);
  assert.deepEqual(odd.notes.map((n) => n.code).sort(), ["atHitBeforeHit", "outOfRange", "unknownRef"]); assert.equal(odd.hitIndex, 1);
  const many = stepTimes({ steps: Array.from({ length: 14 }, () => st({})) }); assert.equal(many.starts.length, 12); assert.match(JSON.stringify(many.notes), /overCap.*13\+/);
});
test("E1 R1 compiler: steps → pieces with absolute times, Feel knobs pass through, the hit is hitOffsetMs; disabled and pictureless steps draw nothing; parts/part/from/nudge_ms never reach play (CN-020 rule 1)", () => {
  const { fx, notes } = docToLiveFx({ ...sparks({ hit_stop_ms: 100, shake: 2, tint_ramp: "fire" }), steps: [...(sparks().steps as object[]), st({ enabled: false }), st({ picture: "missing" })] }, host);
  assert.deepEqual(fx.pieces.map((p) => [p.at, p.ms, p.kind]), [[0, 300, "straight"], [0, 300, "particles"], [210, 300, "particles"]]); assert.equal(fx.hitOffsetMs, 150);
  assert.equal(fx.hit_stop_ms, 100); assert.equal(fx.shake, 2); assert.equal(fx.tint_ramp, "fire"); assert.equal(fx.target, "u1"); assert.equal(fx.loopMs, 1200); assert.deepEqual(notes.map((n) => n.code), ["noPicture"]);
  const tagged = sparks({ parts: [{ id: "p1", kind: "sparks", beats: ["hit"], from: { effect: "effect_X", rev: 4 }, nudge_ms: 30, label: "Sparks" }], steps: (sparks().steps as Record<string, unknown>[]).map((s) => ({ ...s, part: "p1" })) });
  assert.deepEqual(docToLiveFx(tagged, host).fx, docToLiveFx(sparks(), host).fx); assert.doesNotMatch(JSON.stringify(docToLiveFx(tagged, host).fx), /"part"|"from"|"parts"|nudge_ms/);
  assert.equal(play(tagged).json, play(sparks()).json, "play is byte-identical with or without part metadata, even a dangling part");
});
test("E1 R2 variant_seed (CN-021): absent = 0 = today's hash; an int folds in; out of range or non-integer plays 0 with outOfRange; a wrong type plays 0 with invalidValue", () => {
  const off = play(sparks()), zero = play(sparks({ variant_seed: 0 })), five = play(sparks({ variant_seed: 5 }));
  assert.equal(zero.json, off.json); assert.notEqual(five.json, off.json); assert.equal(play(sparks({ variant_seed: 5 })).json, five.json, "same seed, same dots");
  for (const v of [-1, 2.5, 2147483648]) { const r = play(sparks({ variant_seed: v })); assert.equal(r.json, off.json, String(v)); assert.match(r.notes, /outOfRange","message":"variant_seed/); }
  for (const v of [true, "5", [5]]) { const r = play(sparks({ variant_seed: v })); assert.equal(r.json, off.json); assert.match(r.notes, /invalidValue","message":"variant_seed/); }
  assert.equal(play(sparks({ variant_seed: 2147483647 })).json === off.json, false); assert.doesNotMatch(off.notes, /variant_seed/);
});
