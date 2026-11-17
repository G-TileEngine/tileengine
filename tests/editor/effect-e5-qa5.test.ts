import assert from "node:assert/strict";
import { test } from "node:test";
import { valuesOf } from "../../src/editor/effect/writer.ts";
import { DICE, roll, rollValue } from "../../src/editor/effect/dice.ts";
type Slider = readonly [string, number, number, number];
test("E5 QA builds: dice keeps negatives inside the format range; a default answer holding a value is not a value", () => {
  const bend = DICE.sliders.shape[1] as Slider;
  for (let seed = 0; seed < 200; seed += 1) for (const v of [-2.5, -2.4, -2.1]) {
    const r = rollValue(v, bend, seed, "dice:shape:bend", 0) as number;
    assert.ok(r >= -2.5 && r <= v * 0.75 && r >= Math.max(-2.5, v * 1.25), `${v} seed ${seed} -> ${r}`);
  }
  const steps = (roll({ steps: [{ id: "s-1", kind: "straight", seconds: 1, bend: -2.4 }] }, "shape", 7).doc["steps"] ?? []) as Record<string, unknown>[];
  assert.ok((steps[0]?.["bend"] as number) >= -2.5);
  assert.deepEqual(valuesOf({ answers: { shake: { source: "default", value: 2, rev: 1 }, squash: { source: "user", value: true, rev: 1 } } }), { squash: true });
});
