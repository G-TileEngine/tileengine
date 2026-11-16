import assert from "node:assert/strict";
import { test } from "node:test";
import { fit } from "../../src/editor/effect/fit.ts";
import { blend, meter } from "../../src/editor/effect/merge.ts";
import { stepTimes, type FxDocValues } from "../../src/runtime/render/fx-doc.ts";
type Row = Record<string, unknown>;
const go = (a: FxDocValues, b: FxDocValues, picks: Record<string, "a" | "b"> = {}) => { let n = 0; return blend({ id: "A", rev: 1, doc: a }, { id: "B", rev: 1, doc: b }, { base: "a", mix: 50, mint: (p) => `${p}${(n += 1)}`, picks }); };
const B: FxDocValues = { connect_step: "g", steps: [{ id: "g", kind: "stamp", seconds: 0.9 }, { id: "q", kind: "particles", start_mode: "at-hit", particle_count: 6 }] };
test("E4 QA2 S1: a base hit whose id can't name it (\"\", not a string, or a repeat) is still the one hit moment: it gets a minted id and connect_step", () => {
  for (const id of ["", 7, "x"]) {
    const a: FxDocValues = { steps: [{ id: id === "x" ? "x" : "c", kind: "stamp", seconds: 0.6 }, { id, kind: "stamp", seconds: 0.3 }] }, r = go(a, B, { "shape:hit": "b" });
    const hit = (r.doc["steps"] as Row[])[stepTimes(r.doc).hitIndex] ?? {};
    assert.deepEqual([stepTimes(r.doc).hitMs, hit["seconds"], typeof r.doc["connect_step"] === "string" && r.doc["connect_step"] !== ""], [stepTimes(a).hitMs, 0.3, true], `hit id ${JSON.stringify(id)}`);
  }
});
test("E4 QA2 S4: 0 is a good count; only the first 12 are named; Fit names bad steps in step order; blend's meter line names each bad step once", () => {
  const p = (n: unknown): Row => ({ kind: "particles", particle_count: n });
  assert.deepEqual([meter({ steps: [p(0)] }).line, meter({ steps: [...Array.from({ length: 12 }, () => ({ kind: "stamp" })), p(Number.NaN)] }).line], ["", ""]);
  assert.deepEqual(fit({ steps: [p(-1), p(Number.NaN), p(4)] }, []).messages, ["Bad count -1 on step 1 → 0", "Bad count NaN on step 2 → 0"]);
  const r = go({ connect_step: "h", steps: [{ id: "h", kind: "stamp", seconds: 0.3 }] }, { connect_step: "g", steps: [{ id: "g", kind: "stamp" }, { id: "z", ...p(Number.NaN), start_mode: "at-hit" }] });
  assert.deepEqual([r.messages.filter((m) => m.startsWith("Bad count")), r.meter.line.split("Bad count").length - 1], [["Bad count NaN on step 3 → 0"], 1]);
});
