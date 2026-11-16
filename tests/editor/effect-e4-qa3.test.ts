import assert from "node:assert/strict";
import { test } from "node:test";
import { fit } from "../../src/editor/effect/fit.ts";
import { meter } from "../../src/editor/effect/merge.ts";
type Row = Record<string, unknown>;
const p = (n: unknown): Row => ({ kind: "particles", particle_count: n });
test("E4 QA3 S5/S4 edges: 48 and -0 are good counts (no line); 48.4 and 49 cap with the value as given; the meter names a capped step too", () => {
  assert.deepEqual([fit({ steps: [p(48)] }, []).messages, fit({ steps: [p(-0)] }, []).messages, meter({ steps: [p(48), p(-0)] }).line], [[], [], ""]);
  assert.deepEqual(fit({ steps: [p(48.4), p(-0)] }, []).messages, ["Capped count 48.4 on step 1 → 48"]);
  assert.equal(meter({ steps: [p(49), p(Number.NaN)] }).line, "Capped count 49 on step 1 → 48 · Bad count NaN on step 2 → 0 · Undo");
});
