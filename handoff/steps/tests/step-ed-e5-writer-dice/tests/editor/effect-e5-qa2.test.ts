import assert from "node:assert/strict";
import { test } from "node:test";
import { write } from "../../src/editor/effect/writer.ts";
type Row = Record<string, unknown>;
const at = "2026-11-16T22:00:00.000Z", mint = (p: string): string => `${p}1`;
test("E5 QA Law 13: a stored history cap outside whole 1-200 reads as 200, so history stays bounded and baseSeq moves by the ops dropped", () => {
  for (const cap of [Infinity, Number.NaN, 1e6, 0, -3, 2.5, "9"]) {
    let d: Row = { rev: 0, answers: {}, orphans: {}, history: { cap, baseSeq: 0, ops: [] } };
    for (let i = 1; i <= 205; i += 1) d = write(d, { shake: i }, { at, mint });
    const h = d["history"] as { cap: number; baseSeq: number; ops: unknown[] }; assert.deepEqual([h.cap, h.baseSeq, h.ops.length], [200, 5, 200], String(cap));
  }
  let k: Row = { rev: 0, answers: {}, orphans: {}, history: { cap: 3, baseSeq: 0, ops: [] } }; for (let i = 1; i <= 5; i += 1) k = write(k, { shake: i }, { at, mint });
  assert.deepEqual([(k["history"] as Row)["cap"], (k["history"] as Row)["baseSeq"]], [3, 2]);
});
