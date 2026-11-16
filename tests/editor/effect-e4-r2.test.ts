import assert from "node:assert/strict";
import { test } from "node:test";
import { fit } from "../../src/editor/effect/fit.ts";
import { blend, impactMarks, meter, type Pick } from "../../src/editor/effect/merge.ts";
import { stopMs } from "../../src/runtime/render/feel.ts";
import { DOC, stepTimes, type FxDocValues } from "../../src/runtime/render/fx-doc.ts";
import { hitWhiteMs } from "../../src/runtime/render/fx-light.ts";
type Row = Record<string, unknown>;
const go = (a: FxDocValues, b: FxDocValues, mix = 50, picks: Record<string, Pick> = {}) => { let n = 0; return blend({ id: "A", rev: 1, doc: a }, { id: "B", rev: 1, doc: b }, { base: "a", mix, mint: (p) => `${p}${(n += 1)}`, picks }); };
const A: FxDocValues = { steps: [{ id: "c", kind: "stamp", seconds: 0.6 }, { kind: "stamp", seconds: 0.3, bend: 0.2 }] };
const B: FxDocValues = { connect_step: "g", steps: [{ id: "g", kind: "stamp", seconds: 0.9, bend: 0.8, picture: "frost" }] };
test("E4 r2 S1: the base hit is kept by its index, never its id: an id-less base hit survives a pick of the other side, gets a minted id and connect_step names it", () => {
  const r = go(A, B, 50, { "shape:hit": "b" }), steps = r.doc["steps"] as Row[], hit = steps.find((s) => s["id"] === r.doc["connect_step"]);
  assert.deepEqual([steps.length, hit?.["bend"], stepTimes(r.doc).hitMs], [3, 0.2, stepTimes(A).hitMs]);
  const named = go({ ...A, connect_step: "c" }, B, 50, { "shape:cast": "b" }); assert.equal((named.doc["steps"] as Row[]).some((s) => s["id"] === "c"), true, "an id'd hit stays too");
});
test("E4 r2 S2: a non-finite mix is 50 (the base wins ties); a finite mix is clamped to 0..100", () => {
  const d = (mix: number): unknown => go(A, B, mix, { "shape:hit": "mix", "shape:cast": "mix" }).doc;
  for (const v of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) assert.deepEqual(d(v), d(50), String(v));
  assert.deepEqual([d(250), d(-30)], [d(100), d(0)]);
  assert.equal(go(A, B, Number.NaN, { "shape:hit": "mix" }).badges["shape:hit"], "a");
});
test("E4 r2 S3: impact marks use the runtime's own hitWhiteMs and stopMs: a 40 ms white floor, 200 max; hit-stop on the step grid, capped 150, 50 with flashes, none reduced", () => {
  const one: FxDocValues = { connect_step: "h", steps: [{ id: "h", kind: "stamp", seconds: 0.3 }] }, at = stepTimes(one).hitMs;
  const m = (x: Row, g?: { stepMs?: number; reduce?: boolean; flashes?: boolean }) => impactMarks({ ...one, ...x }, g);
  assert.deepEqual([m({ hit_white_ms: 10 }).white, m({ hit_white_ms: 500 }).white], [[at, at + 40], [at, at + 200]]);
  assert.deepEqual([m({ hit_stop_ms: 70 }, { stepMs: 30 }).stop, m({ hit_stop_ms: 900 }).stop, m({ hit_stop_ms: 90 }, { flashes: true }).stop, m({ hit_stop_ms: 90 }, { reduce: true }).stop], [[at, at + 90], [at, at + 150], [at, at + 50], null]);
  for (const v of [-5, 0, 0.4, 39, 41.5, 77, 199, 201, Number.NaN]) assert.deepEqual([m({ hit_stop_ms: v, hit_white_ms: v }, { stepMs: 30, flashes: true }).stop?.[1] ?? at, m({ hit_white_ms: v }).white?.[1] ?? at], [at + stopMs(v, 30, false, true), at + hitWhiteMs(v).ms], String(v));
});
test("E4 r2 S4: a non-finite or negative particle_count counts 0 with a Bad count line, in the meter and in Fit (no NaN total)", () => {
  const p = (n: unknown, x: Row = {}): Row => ({ kind: "particles", particle_count: n, ...x }), steps = [p(Number.NaN), p(40), p(-3), p(20), p(Number.POSITIVE_INFINITY, { enabled: false })];
  const me = meter({ steps }); assert.deepEqual([me.particles.n, me.line], [60, "Bad count NaN on step 1 → 0 · Bad count -3 on step 3 → 0 · Undo"]);
  const f = fit({ steps }, []); assert.deepEqual([(f.doc["steps"] as Row[]).map((s) => s["particle_count"]), f.messages.slice(-1)], [[Number.NaN, 32, -3, 16, Number.POSITIVE_INFINITY], ["Scaled sparks 60 → 48 to fit 48"]]);
  assert.equal(f.messages.filter((x) => x.startsWith("Bad count")).length, 2); assert.equal(DOC.steps, 12);
});
