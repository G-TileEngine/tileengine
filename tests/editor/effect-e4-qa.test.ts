import assert from "node:assert/strict";
import { test } from "node:test";
import { blend, impactMarks, meter, type Pick } from "../../src/editor/effect/merge.ts";
import type { FxDocValues } from "../../src/runtime/render/fx-doc.ts";
type Row = Record<string, unknown>;
const go = (a: FxDocValues, b: FxDocValues, base: "a" | "b" = "a", picks: Record<string, Pick> = {}, mix = 50, preset = false) => { let n = 0; return blend({ id: "A", rev: 1, doc: a }, { id: "B", rev: 1, doc: b }, { base, mix, mint: (p) => `${p}${(n += 1)}`, picks, preset }); };
const knobs = (d: FxDocValues): unknown[] => ["hit_stop_ms", "hit_white_ms", "shake", "squash"].map((k) => d[k]);
const one: FxDocValues = { connect_step: "h", steps: [{ id: "h", kind: "stamp", seconds: 0.3 }] };
test("E4 QA punch: the cap is > cap on every pick (150 stays, 151 caps); NaN never wins the max; a/b mean the card, not the base (Swap); squash both keeps the base's false", () => {
  const p = (x: Row, y: Row, base: "a" | "b" = "a", pk?: Pick) => go({ ...one, ...x }, { ...one, ...y }, base, pk === undefined ? {} : { "punch:hit": pk }, 0);
  const at = p({ hit_stop_ms: 150, hit_white_ms: 200, shake: 3 }, {}); assert.deepEqual([knobs(at.doc), at.messages], [[150, 200, 3, undefined], []], "exactly the cap is not capped");
  assert.deepEqual(p({ hit_stop_ms: 151 }, {}).messages, ["Capped hit_stop_ms 151 → 150"]);
  const pa = p({ shake: 5, hit_white_ms: 201 }, { shake: 1 }, "a", "a"); assert.deepEqual([pa.doc["shake"], pa.doc["hit_white_ms"], pa.messages], [3, 200, ["Capped hit_white_ms 201 → 200", "Capped shake 5 → 3"]], "a pick is capped too");
  assert.deepEqual(knobs(p({ hit_stop_ms: Number.NaN, squash: false }, { hit_stop_ms: 50 }).doc), [50, undefined, undefined, false], "NaN loses to the finite side; squash both = base's false");
  assert.deepEqual(knobs(p({ shake: 1, hit_stop_ms: 40, squash: true }, { shake: 2, hit_stop_ms: 90 }, "b", "a").doc), [40, undefined, 1, true], "Swap + pick a = card A's knobs");
});
test("E4 QA mix: hold/fade ms round whole; a one-sided scale value is kept; a Mix that moves the base hit moves the other side (clamped at 20000)", () => {
  const a: FxDocValues = { connect_step: "h", steps: [{ id: "h", kind: "stamp", seconds: 0.3, bend: 0.5 }, { id: "l", kind: "stamp", start_mode: "at-hit", hold_ms: 100 }] };
  const b: FxDocValues = { connect_step: "g", steps: [{ id: "g", kind: "stamp", seconds: 0.9 }, { id: "q", kind: "stamp", start_mode: "at-hit", hold_ms: 205 }] };
  const s = (r: { doc: FxDocValues }, id: string): Row => (r.doc["steps"] as Row[]).find((x) => x["id"] === id) ?? {};
  assert.deepEqual([s(go(a, b, "a", { "shape:linger": "mix" }, 25), "l")["hold_ms"], s(go(a, b, "a", { "shape:hit": "mix" }, 25), "h")["bend"]], [126, 0.5]);
  const A: FxDocValues = { connect_step: "g", steps: [{ id: "c", kind: "stamp", seconds: 3 }, { id: "g", kind: "stamp", seconds: 0.3 }, { id: "z", kind: "stamp", start_mode: "at-hit", start_at_ms: 19500 }] };
  const m = go(A, { connect_step: "h", steps: [{ id: "c", kind: "stamp", seconds: 0.15 }, { id: "e", kind: "stamp", seconds: 3 }, { id: "h", kind: "stamp", seconds: 0.3 }] }, "b", { "shape:cast": "mix" }, 0);
  assert.deepEqual([s(m, "c")["seconds"], s(m, "s-2")["start_at_ms"], s(m, "s-3")["start_at_ms"]], [3, 6000, 20000], "Mix moved B's hit 3426 → 6276; A's hit step follows, A's late step stays clamped at 20000");
});
test("E4 QA meter and parts: disabled steps draw no draw and no light; blend's meter uses the preset cap; the base's unused part stays", () => {
  const m = meter({ steps: [{ kind: "stamp", light_mode: "pop", enabled: false }, { kind: "stamp" }] }); assert.deepEqual([m.draws.n, m.lights.n], [1, 0]);
  const r = go({ ...one, parts: [{ id: "u", kind: "light", beats: ["cast"] }] }, one, "a", {}, 50, true);
  assert.deepEqual([r.meter.particles.cap, (r.doc["parts"] as Row[]).map((p) => p["id"])], [32, ["u"]]);
});
test("E4 QA impact marks: 0 and Infinity give no window (the runtime plays none); fractions round; steps 13+ are not spanned", () => {
  const w = (v: number): unknown => impactMarks({ ...one, hit_stop_ms: v, hit_white_ms: v }).stop;
  assert.deepEqual([w(0), w(Number.POSITIVE_INFINITY), w(50.6)], [null, null, [276, 327]]);
  assert.equal(impactMarks({ steps: Array.from({ length: 13 }, () => ({ kind: "stamp", seconds: 0.3 })) }).beats["linger"], null);
});
