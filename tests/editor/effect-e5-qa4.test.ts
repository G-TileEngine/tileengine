import assert from "node:assert/strict";
import { test } from "node:test";
import { redo, undo, valuesOf, write } from "../../src/editor/effect/writer.ts";
import { breed } from "../../src/editor/effect/dice.ts";
type Row = Record<string, unknown>;
const at = "2026-11-16T22:40:00.000Z", mint = (): ((p: string) => string) => { let n = 0; return (p: string) => `${p}${(n += 1)}`; };
const doc0 = (ops: unknown[] = []): Row => ({ rev: 0, answers: {}, orphans: {}, history: { cap: 200, baseSeq: 0, ops } });
const seqs = (d: Row): unknown[] => ((d["history"] as Row)["ops"] as Row[]).map((o) => o["seq"]);
test("E5 QA r3: a non-integer seq is dropped; redo skips prototype knobs; another live group inside a group refuses its undo; nulls drop before the first-3 cut", () => {
  for (const seq of [2.5, Number.NaN, Infinity]) assert.deepEqual(seqs(write(doc0([{ seq: 1, at, kind: "set", changes: [] }, { seq, at, kind: "set", changes: [] }]), { shake: 1 }, { at, mint: mint() })), [1, 2], String(seq));
  const p = { knob: "__proto__", before: { source: "default" }, after: { source: "user", value: { polluted: 1 } } }, d = doc0([{ seq: 1, at, kind: "set", changes: [p] }, { seq: 2, at, kind: "undo", target: 1, changes: [] }]);
  const r = redo(d, at); assert.equal(Object.getPrototypeOf(r["answers"]), Object.prototype); assert.equal((r["answers"] as Row)["polluted"], undefined);
  let g = write(doc0(), { shake: 1 }, { at, mint: mint(), group: "g" }); g = write(g, { hit_stop_ms: 10 }, { at, mint: mint(), group: "h" }); g = write(g, { squash: true }, { at, mint: mint(), group: "g" });
  assert.equal(undo(g, at), g); assert.deepEqual(valuesOf(g), { shake: 1, hit_stop_ms: 10, squash: true });
  const sp = (id: string): Row => ({ id, kind: "particles", particle_count: 20, start_mode: "at-hit" }), src = (id: string) => ({ id, rev: 1, doc: { steps: [sp(id.toLowerCase())] } });
  assert.deepEqual(breed([null, src("A"), src("B"), src("C")], { seed: 1, mint: mint() }).map((c) => c.parents), [[1, 2], [1, 2], [2, 3], [2, 3], [3, 1], [3, 1]]);
});
