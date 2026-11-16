import assert from "node:assert/strict";
import { test } from "node:test";
import { fit } from "../../src/editor/effect/fit.ts";
import { meter } from "../../src/editor/effect/merge.ts";
import { PARTICLES } from "../../src/runtime/render/fx-particles.ts";
type Row = Record<string, unknown>;
const p = (n: unknown, x: Row = {}): Row => ({ kind: "particles", particle_count: n, ...x }), st = (x: Row = {}): Row => ({ kind: "stamp", ...x });
test("E4 r3 S5: a count over the runtime's per-effect ceiling (PARTICLES.perEffect 48) counts 48 with a Capped count line; two Number.MAX_VALUE counts never give NaN or Infinity", () => {
  const m = Number.MAX_VALUE, f = fit({ steps: [p(m), p(m)] }, []), counts = (f.doc["steps"] as Row[]).map((s) => s["particle_count"]);
  assert.deepEqual([counts, f.messages], [[24, 24], [`Capped count ${String(m)} on step 1 → 48`, `Capped count ${String(m)} on step 2 → 48`, "Scaled sparks 96 → 48 to fit 48"]]);
  assert.deepEqual([PARTICLES.perEffect, meter({ steps: [p(m), p(60)] }).particles.n, (fit({ steps: [p(60)] }, []).doc["steps"] as Row[])[0]?.["particle_count"]], [48, 96, 48]);
  assert.deepEqual([meter({ steps: [p(2.5), p("10"), p(null)] }).particles.n, meter({ steps: [p(2.5)] }).line], [26.5, ""], "report-only: 2.5 counts 2.5; a string or null count is the default 12");
});
test("E4 r3 S6: Fit names only bad steps that play (enabled, first 12), numbered after its trims, in step order; the meter does not repeat them", () => {
  const steps = [st({ id: "h" }), st({ start_mode: "at-hit", hold_ms: 300 }), st({ start_mode: "at-hit", hold_ms: 300 }), p(-2, { enabled: false }), ...Array.from({ length: 8 }, () => st()), p(Number.NaN, { start_mode: "at-hit" })];
  const f = fit({ connect_step: "h", steps }, []);
  assert.deepEqual([(f.doc["steps"] as Row[]).length, f.messages], [12, ["Bad count NaN on step 12 → 0", "Trimmed 1 linger step to fit"]]);
  assert.equal(meter(f.doc, f.messages).line, "Bad count NaN on step 12 → 0 · Trimmed 1 linger step to fit · Undo");
});
