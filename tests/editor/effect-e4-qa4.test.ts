import assert from "node:assert/strict";
import { test } from "node:test";
import { fit } from "../../src/editor/effect/fit.ts";
import { blend, impactMarks } from "../../src/editor/effect/merge.ts";
type Row = Record<string, unknown>;
const st = (id: string, x: Row = {}): Row => ({ id, kind: "stamp", ...x });
const mint = () => { let n = 0; return (p: string) => `${p}${(n += 1)}`; };
test("E4 QA4 S6 (builds): Fit's own Bad count and Capped count lines skip steps 13+, which don't play", () => {
  const head = [...Array.from({ length: 11 }, (_, i) => st(`c${i}`)), st("h")];
  for (const c of [Number.NaN, 99]) assert.deepEqual(fit({ connect_step: "h", steps: [...head, { id: "x", kind: "particles", particle_count: c }] }, []).messages, ["Still 13 steps: steps 13+ are saved but won't play"]);
});
test("E4 QA4 ruling 15 (builds): beat spans stay ≤ 5 with no NaN when parts name Object.prototype keys as beats", () => {
  const names = ["__proto__", "constructor", "toString", "valueOf", "zap"];
  const m = impactMarks({ parts: names.map((b, i) => ({ id: `p${i}`, kind: "shape", beats: [b] })), steps: names.map((_, i) => st(`s${i}`, { part: `p${i}` })) });
  const keys = Object.keys(m.beats), spans = Object.values(m.beats);
  assert.ok(keys.length <= 5, keys.join()); assert.deepEqual(keys.slice(0, 4), ["cast", "travel", "hit", "linger"]);
  assert.ok(spans.every((s) => s === null || s.every(Number.isFinite)), JSON.stringify(spans));
});
test("E4 QA4 rule 2 (builds): a moved part whose only step Fit trims is dropped; with an empty base, a pick of a drops every B step", () => {
  const base = { id: "A", rev: 1, doc: { connect_step: "h", steps: [st("h"), ...Array.from({ length: 11 }, (_, i) => st(`l${i}`, { start_mode: "at-hit", hold_ms: 100 }))] } };
  const other = { id: "B", rev: 1, doc: { connect_step: "g", parts: [{ id: "tp", kind: "trail", beats: ["linger"] }], steps: [st("g"), st("t", { part: "tp", start_mode: "at-hit", hold_ms: 100, seconds: 0.1 })] } };
  const r = blend(base, other, { base: "a", mix: 50, mint: mint() });
  assert.equal((r.doc["steps"] as Row[]).length, 12); assert.deepEqual(r.doc["parts"], []);
  const e = blend({ id: "A", rev: 1, doc: { steps: [] } }, { id: "B", rev: 1, doc: { connect_step: "g", steps: [st("c"), st("g")] } }, { base: "a", mix: 50, mint: mint(), picks: { "shape:cast": "a", "shape:hit": "a" } });
  assert.deepEqual(e.doc["steps"], []);
});
