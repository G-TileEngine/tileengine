import assert from "node:assert/strict";
import { test } from "node:test";
import { fit } from "../../src/editor/effect/fit.ts";
import { blankEffect } from "../../src/editor/effect/save.ts";
import { write, WRITER } from "../../src/editor/effect/writer.ts";
import { PRESETS } from "../../tools/effect-designer/presets.ts";
type Row = Record<string, unknown>;
const at = "2026-11-17T02:00:00.000Z", mint = (p: string): string => `${p}0001`;
test("E6 QA (ruling 2, Law 13): a new effect's history is {cap: WRITER.cap (200), baseSeq: 0, ops: []}", () => {
  assert.deepEqual(blankEffect("setup_E", "F", at, 1)["history"], { cap: 200, baseSeq: 0, ops: [] }); assert.equal(WRITER.cap, 200);
});
test("E6 QA (ruling 11): every stand-in preset is within the Fit caps (no message from fit, ≤ 3 steps), so Save & use never stores an over-cap tile", () => {
  for (const p of PRESETS) {
    const steps = p.doc["steps"] as Row[]; assert.ok(steps.length <= 3, p.id);
    assert.deepEqual(fit(p.doc, steps.map(() => "base"), { preset: true }).messages, [], p.id);
  }
});
test("E6 QA (E5 carry, no-op compare): a stored answer missing a field the write adds is a change, never a no-op", () => {
  const doc: Row = { kind: "behaviour-setup", formatVersion: 3, id: "setup_O", rev: 1, answers: { k: { source: "user", rev: 1 } }, orphans: {}, history: { cap: 200, baseSeq: 0, ops: [] } };
  const next = write(doc, { k: 5 }, { at, mint }); assert.notEqual(next, doc); assert.deepEqual((next["answers"] as Row)["k"], { source: "user", value: 5, rev: 2 });
});
