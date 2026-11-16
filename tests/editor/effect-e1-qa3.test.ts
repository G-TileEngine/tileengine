// QA pins from the ED-E1 builds A/B (plants the shipped E1 tests missed): a shared acyclic source is not a cycle, a piece
// lasts len + hold + fade, connect out of range is noted, blendSeed reads seeds through variantSeed, and flatten runs Fit.
import assert from "node:assert/strict";
import { test } from "node:test";
import { flatten } from "../../src/editor/effect/fit.ts";
import { blendSeed, fromInfo, type Source } from "../../src/editor/effect/parts.ts";
import { docToLiveFx, stepTimes, type DocHost, type FxDocValues } from "../../src/runtime/render/fx-doc.ts";
type Row = Record<string, unknown>;
const P = (id: string, from?: string): Row => ({ id, kind: "sparks", beats: ["hit"], ...(from === undefined ? {} : { from: { effect: from, rev: 1 } }) });
const st = (parts: Row[], m: Record<string, Row[]>): string[] => fromInfo("S", { parts }, (id): Source => (m[id] === undefined ? null : { rev: 1, doc: { parts: m[id] } })).map((r) => r.state);
test("E1 QA3 provenance: a shared acyclic source is current; a loop back to this effect and a self-loop stay cycle", () => {
  assert.deepEqual(st([P("a", "X")], { X: [P("x1", "Y"), P("x2", "Y")], Y: [P("y")] }), ["current"]);
  assert.deepEqual(st([P("a", "X")], { X: [P("x1", "Y"), P("x2", "W")], Y: [P("y", "W")], W: [] }), ["current"]);
  assert.deepEqual(st([P("a", "X"), P("b", "Z")], { X: [P("x", "Y")], Z: [P("z", "Y")], Y: [] }), ["current", "current"]);
  assert.deepEqual(st([P("a", "X")], { X: [P("x", "S")] }), ["cycle"]);
  assert.deepEqual(st([P("a", "S")], { S: [P("a", "S")] }), ["cycle"]);
});
const host: DocHost = { id: "h", castMs: 0, caster: "u", sheetOf: () => ({ id: "fx", fw: 16, fh: 16, columns: 4 }) };
test("E1 QA3 converter: a piece lasts len + hold_ms + fade_out_ms (fade on dim/stamp only); connect out of range is noted; hold_ms clamps to 0", () => {
  const doc: FxDocValues = { steps: [{ id: "a", kind: "stamp", seconds: 0.3, hold_ms: 200, fade_out_ms: 100 }, { id: "b", kind: "straight", seconds: 0.3, hold_ms: 150, fade_out_ms: 100 }] };
  assert.deepEqual(docToLiveFx(doc, host).fx.pieces.map((p) => [p.at, p.ms]), [[0, 600], [500, 450]]);
  assert.deepEqual(stepTimes({ steps: [{ id: "a" }], connect: 5 }).notes, [{ code: "outOfRange", message: "connect" }]);
  assert.deepEqual(stepTimes({ steps: [{ id: "a", seconds: 0.3, hold_ms: -500 }, { id: "b" }] }).starts, [0, 300]);
});
test("E1 QA3 merge: blendSeed reads seeds through variantSeed; flatten runs Fit (sparks to 48, 32 for a preset; 12 steps) with its lines", () => {
  for (const bad of [-1, 2.5, 2 ** 31, Number.NaN, "5"]) assert.equal(blendSeed(bad, 7, 50, "a"), blendSeed(0, 7, 50, "a"));
  let k = 0; const mint = (x: string): string => `${x}${(k += 1)}`;
  const mk = (id: string, n: number): { id: string; rev: number; doc: FxDocValues } => ({ id, rev: 1, doc: { steps: Array.from({ length: n }, (_, i) => ({ id: `${id}${i}`, kind: "particles", particle_count: 20, seconds: 0.3 })) } });
  const f = flatten(mk("A", 8), mk("B", 8), { base: "a", mix: 50, mint }), steps = f.doc["steps"] as Row[];
  assert.equal(steps.length, 12); assert.equal(steps.reduce((s, x) => s + (typeof x["particle_count"] === "number" ? x["particle_count"] : 0), 0), 36);
  assert.deepEqual(f.messages, ["Scaled sparks 320 → 48 to fit 48", "Trimmed 4 linger steps to fit"]);
  assert.deepEqual((flatten(mk("A", 1), mk("B", 1), { base: "a", mix: 50, mint, preset: true }).doc["steps"] as Row[]).map((x) => x["particle_count"]), [16, 16]);
});
