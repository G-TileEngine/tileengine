import assert from "node:assert/strict";
import { test } from "node:test";
import { beatOf } from "../../src/editor/effect/fit.ts";
import { blend, impactMarks, keyOf, layerOf, meter, type Pick } from "../../src/editor/effect/merge.ts";
import { docToLiveFx, stepTimes, type FxDocValues } from "../../src/runtime/render/fx-doc.ts";
type Row = Record<string, unknown>;
const ids = (d: FxDocValues): unknown[] => (d["steps"] as Row[]).map((s) => s["id"]);
const A = { id: "fire", rev: 2, doc: { shake: 1, hit_stop_ms: 50, squash: true, connect_step: "a2", parts: [{ id: "pa", kind: "shape", beats: ["travel"] }, { id: "ps", kind: "sparks", beats: ["hit", "linger"] }],
  steps: [{ id: "a1", kind: "stamp", seconds: 0.3 }, { id: "a2", kind: "straight", part: "pa", seconds: 0.6, tint_ramp: "fire" }, { id: "a3", kind: "particles", part: "ps", seconds: 0.3, particle_count: 24, particle_life_ms: 600, particle_motion: "rise", start_mode: "at-hit" }, { id: "a4", kind: "stamp", seconds: 0.3, start_mode: "at-hit", hold_ms: 300 }] } };
const B = { id: "frost", rev: 5, doc: { connect_step: "b1", shake: 2, hit_stop_ms: 100, hit_white_ms: 40, parts: [{ id: "pb", kind: "sparks", beats: ["hit"] }],
  steps: [{ id: "b0", kind: "stamp", seconds: 0.3 }, { id: "b1", kind: "swerve", seconds: 0.45, tint_ramp: "frost" }, { id: "b2", kind: "particles", part: "pb", seconds: 0.6, particle_count: 36, particle_life_ms: 1000, picture: "ice", start_mode: "at-hit" }] } };
const mk = (picks?: Readonly<Record<string, Pick>>, mix = 50, base: "a" | "b" = "a") => { let n = 0; return blend(A, B, { base, mix, mint: (p) => `${p}${(n += 1)}`, ...(picks === undefined ? {} : { picks }) }); };
test("E4 beats (carry d): one named beat wins; else a travel kind before the hit is travel, an at-hit step after it is hit unless it holds or fades (linger), the rest by list position; a multi-beat part keeps the position beat when the refined one is not its own", () => {
  assert.deepEqual([0, 1, 2, 3].map((i) => beatOf(A.doc, i)), ["cast", "travel", "hit", "linger"]); assert.deepEqual([0, 1, 2].map((i) => beatOf(B.doc, i)), ["cast", "hit", "hit"], "the hit step is hit unless its part names one beat");
  const d: FxDocValues = { connect_step: "h", parts: [{ id: "m", kind: "shape", beats: ["cast", "hit", "linger"] }, { id: "n", kind: "shape", beats: ["cast", "linger"] }], steps: [{ id: "t", kind: "orbit", part: "m" }, { id: "s", kind: "straight" }, { id: "h" }, { id: "x", start_mode: "at-hit", part: "n" }, { id: "f", kind: "stamp", start_mode: "at-hit", fade_out_ms: 100 }, { id: "y", start_mode: "at-hit", hold_ms: 0 }, { id: "z" }] };
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6].map((i) => beatOf(d, i)), ["cast", "travel", "hit", "linger", "linger", "hit", "linger"]);
});
test("E4 layers and keys: a step's layer is its part's kind, else sparks for particles and shape for the rest (an unknown part kind falls back); the key is layer:beat", () => {
  assert.deepEqual([0, 1, 2, 3].map((i) => keyOf(A.doc, i)), ["shape:cast", "shape:travel", "sparks:hit", "shape:linger"]);
  const d: FxDocValues = { parts: [{ id: "q", kind: "glitter", beats: ["hit"] }, { id: "l", kind: "light", beats: ["hit"] }], steps: [{ kind: "particles", part: "q" }, { kind: "stamp", part: "q" }, { kind: "stamp", part: "l" }, { kind: "particles", part: "gone" }] };
  assert.deepEqual([0, 1, 2, 3].map((i) => layerOf(d, i)), ["sparks", "shape", "light", "sparks"]);
});
test("E4 blend picks (rule 2): a keeps A's steps, b keeps B's, both (the default, and any unknown value) keeps both; the base hit step always stays (rule 1); a moved part left with no step is dropped; badges name the pick", () => {
  assert.deepEqual(ids(mk().doc), ["a1", "a2", "a3", "a4", "s-2", "s-3", "s-4"]); assert.deepEqual(mk().badges, { "shape:cast": "both", "shape:travel": "both", "sparks:hit": "both", "shape:linger": "both", "shape:hit": "both" });
  const r = mk({ "sparks:hit": "a", "shape:cast": "b", "shape:travel": "b" });
  assert.deepEqual(ids(r.doc), ["a2", "a3", "a4", "s-2", "s-3"], "a1 goes (cast: b), a2 is the base hit and stays, B's sparks go (hit: a)");
  assert.deepEqual((r.doc["parts"] as Row[]).map((p) => p["id"]), ["pa", "ps"]); assert.deepEqual(r.badges["sparks:hit"], "a");
  assert.deepEqual(ids(mk({ "sparks:hit": "b", "shape:linger": "zap" as Pick }).doc), ["a1", "a2", "a4", "s-2", "s-3", "s-4"]);
  assert.deepEqual(ids(mk({ "shape:cast": "a", "shape:hit": "a" }, 50, "b").doc), ["b1", "b2", "s-3", "s-4", "s-5", "s-6"], "Swap: B is the base; its cast b0 goes, its hit b1 stays though the pick is a");
});
test("E4 blend re-anchors (rule 1): when a pick drops base steps before the hit, the other side's steps move with the base hit, clamped at 0", () => {
  const all = mk(), cut = mk({ "shape:cast": "b" }), at = (d: FxDocValues, id: string): unknown => (d["steps"] as Row[]).find((s) => s["id"] === id)?.["start_at_ms"];
  assert.equal(stepTimes(all.doc).hitMs - stepTimes(cut.doc).hitMs, 300); assert.deepEqual(["s-2", "s-3", "s-4"].map((id) => [at(all.doc, id), at(cut.doc, id)]), [[138, 0], [438, 138], [852, 552]]);
  assert.equal(stepTimes(cut.doc).hitMs - (at(cut.doc, "s-4") as number), stepTimes(B.doc).hitMs - (stepTimes(B.doc).starts[2] ?? 0), "B's hit sparks still land on the base hit");
});
test("E4 Mix (rule 3, RISKY pick mix): pairs the k-th steps of a layer and beat; values both sides have are scaled (ms and counts whole, the rest 0.01), discrete ones come from A below 50, B above 50, the base at 50; the base keeps its id and timing; the badge shows the winner", () => {
  const row = (mix: number, base: "a" | "b" = "a"): Row => (mk({ "sparks:hit": "mix" }, mix, base).doc["steps"] as Row[]).find((s) => s["kind"] === "particles") ?? {};
  assert.deepEqual([25, 40, 75, 100].map((m) => [row(m)["particle_count"], row(m)["particle_life_ms"], row(m)["seconds"], row(m)["picture"], row(m)["particle_motion"]]), [[27, 700, 0.38, undefined, "rise"], [30, 800, 0.45, undefined, "rise"], [33, 900, 0.52, "ice", undefined], [36, 1000, 0.6, "ice", undefined]]);
  assert.deepEqual([row(50)["id"], row(50)["picture"], row(50, "b")["id"], row(50, "b")["picture"], row(50, "b")["start_mode"]], ["a3", undefined, "b2", "ice", "at-hit"]);
  assert.deepEqual(ids(mk({ "sparks:hit": "mix" }, 75).doc), ["a1", "a2", "a3", "a4", "s-2", "s-3"], "B's paired step is merged into the base's; its part is dropped");
  assert.deepEqual([mk({ "sparks:hit": "mix" }, 30).badges["sparks:hit"], mk({ "sparks:hit": "mix" }, 63).badges["sparks:hit"], mk({ "sparks:hit": "mix" }, 50, "b").badges["sparks:hit"]], ["a", "b", "b"]);
  assert.deepEqual(ids(mk({ "shape:cast": "mix", "shape:hit": "mix" }, 75).doc), ["a1", "a2", "a3", "a4", "s-3", "s-4"], "b0 merges into a1; B's unpaired hit b1 (s-3) stays");
  const two = (n: number[]): FxDocValues => ({ connect_step: "h", steps: [{ id: "h", kind: "stamp" }, ...n.map((c, i) => ({ id: `p${i}`, kind: "particles", start_mode: "at-hit", particle_count: c }))] });
  let k = 0; const pc = blend({ id: "X", rev: 1, doc: two([4, 8]) }, { id: "Y", rev: 1, doc: two([13, 20]) }, { base: "a", mix: 50, mint: (q) => `${q}${(k += 1)}`, picks: { "sparks:hit": "mix" } });
  assert.deepEqual((pc.doc["steps"] as Row[]).map((s) => s["particle_count"]), [undefined, 9, 14, undefined], "the k-th pairs with the k-th; counts round to whole; Y's own hit stays (shape:hit is both)");
});
test("E4 punch (rule 4, carry f): both = the max per knob, squash if either, capped at hit-stop 150, hit-white 200, shake 3 with a Capped line; a or b takes that side's knobs exactly; mix scales them", () => {
  const p = (r: { doc: FxDocValues }): unknown[] => ["shake", "hit_stop_ms", "hit_white_ms", "squash"].map((k) => r.doc[k]);
  assert.deepEqual(p(mk()), [2, 100, 40, true]); assert.deepEqual(p(mk({ "punch:hit": "a" })), [1, 50, undefined, true]); assert.deepEqual(p(mk({ "punch:hit": "b" })), [2, 100, 40, undefined]); assert.deepEqual(p(mk(undefined, 50, "b")), [2, 100, 40, true], "squash if either side has it");
  assert.deepEqual(p(mk({ "punch:hit": "mix" }, 25)), [1, 63, undefined, true]); assert.deepEqual(p(mk({ "punch:hit": "mix" }, 75)), [2, 88, 40, undefined]);
  let n = 0; const hot = blend({ ...A, doc: { ...A.doc, shake: 5, hit_white_ms: 400 } }, B, { base: "a", mix: 0, mint: (q) => `${q}${(n += 1)}` });
  assert.deepEqual(p(hot), [3, 100, 200, true]); assert.deepEqual(hot.messages.slice(-2), ["Capped hit_white_ms 400 → 200", "Capped shake 5 → 3"]);
});
test("E4 meter: particles, draws, lights and steps against 48 (32 preset), 60, 2 and 12 over the first 12 enabled steps (steps counts all); the line joins the trims with · and ends · Undo, empty when nothing was trimmed", () => {
  const d: FxDocValues = { steps: [{ kind: "particles", particle_count: 20 }, { kind: "particles" }, { kind: "particles", particle_count: 30, enabled: false }, { kind: "stamp", light_mode: "pop" }, { light: "steady" }, { light_mode: "off" }, ...Array.from({ length: 6 }, () => ({ kind: "stamp" })), { kind: "particles", particle_count: 40, light_mode: "pop" }] };
  const m = meter(d, ["Scaled sparks 60 → 47 to fit 48", "Trimmed 2 linger steps to fit"]);
  assert.deepEqual([m.particles, m.draws, m.lights, m.steps], [{ n: 32, cap: 48 }, { n: 41, cap: 60 }, { n: 2, cap: 2 }, { n: 13, cap: 12 }]);
  assert.equal(m.line, "Scaled sparks 60 → 47 to fit 48 · Trimmed 2 linger steps to fit · Undo"); assert.equal(meter(d).line, ""); assert.equal(meter(d, [], { preset: true }).particles.cap, 32);
});
test("E4 blend runs Fit (rule 4): its lines and the meter of the result come back; the same inputs give the same doc", () => {
  const r = mk(); assert.deepEqual(r.messages, ["Scaled sparks 60 → 47 to fit 48"]);
  assert.deepEqual([r.meter.particles.n, r.meter.steps.n], [47, 7]); assert.equal(r.meter.line.endsWith("· Undo"), true); assert.deepEqual(mk().doc, r.doc);
  let n = 0; assert.equal(blend(A, B, { base: "a", mix: 50, mint: (q) => `${q}${(n += 1)}`, preset: true }).meter.particles.n, 31, "pro rata, floored: 12 + 19");
});
test("E4 impact marks (M-B2, RISKY): hitMs is the converter's hitOffsetMs; hit-stop and hit-white windows start at the hit (capped); beat spans cover enabled steps; no knob gives null", () => {
  const host = { id: "x", castMs: 0, caster: "u", sheetOf: () => ({ id: "fx", fw: 16, fh: 16, columns: 4 }) }, m = impactMarks(A.doc);
  assert.equal(m.hitMs, docToLiveFx(A.doc, host).fx.hitOffsetMs); assert.deepEqual([m.hitMs, m.hitStep, m.stop, m.white, m.endMs], [852, "a2", [852, 902], null, 1452]);
  assert.deepEqual(m.beats, { cast: [0, 300], travel: [300, 900], hit: [852, 1152], linger: [852, 1452] });
  const off = impactMarks({ ...A.doc, hit_stop_ms: 900, hit_white_ms: 40, steps: [...A.doc.steps.slice(0, 3), { ...A.doc.steps[3], enabled: false }] });
  assert.deepEqual([off.stop, off.white, off.beats["linger"]], [[852, 1002], [852, 892], null]); assert.equal(impactMarks({ steps: [{ seconds: 0.3 }] }).hitStep, null); assert.deepEqual(impactMarks({ steps: [{ seconds: 0.3 }, { seconds: 0.3 }, { seconds: 0.3 }] }).beats["cast"], [0, 600]);
});
