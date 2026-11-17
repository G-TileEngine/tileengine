import assert from "node:assert/strict";
import { test } from "node:test";
import { breed, rollValue } from "../../src/editor/effect/dice.ts";
import { blend } from "../../src/editor/effect/merge.ts";
import { hash32 } from "../../src/runtime/render/frames.ts";
type Row = Record<string, unknown>;
const mint = () => { let n = 0; return (p: string) => `${p}${(n += 1)}`; }, u = (s: number): number => hash32(s, "k", 0, 0) / 4294967296;
const sp = (id: string, x: Row = {}): Row => ({ id, kind: "particles", particle_count: 20, start_mode: "at-hit", ...x }), st = (id: string, x: Row = {}): Row => ({ id, kind: "stamp", ...x });
const steps = (d: unknown): Row[] => (d as Row)["steps"] as Row[];
test("E5 QA dice small whole numbers (Q5): exact keep/−1/+1 by u, reverse step at 0 or a bound; 4 is small, 5 and 2.5 use ±25%", () => {
  for (const [v, max] of [[1, 3], [2, 3], [3, 3], [4, 48]] as const) for (let s = 1; s <= 60; s += 1) {
    const x = u(s), d = x < 0.75 ? -1 : 1, ok = (n: number): boolean => n !== 0 && n >= 0 && n <= max;
    assert.equal(rollValue(v, ["shake", 0, max, 1], s, "k", 0), x < 0.5 ? v : ok(v + d) ? v + d : ok(v - d) ? v - d : v, `${v} seed ${s}`);
  }
  const five = Array.from({ length: 60 }, (_, i) => i + 1).filter((s) => u(s) >= 0.5).map((s) => rollValue(5, ["particle_count", 0, 48, 1], s, "k", 0)); assert.ok(five.includes(5), five.join());
  for (let s = 1; s <= 40; s += 1) assert.ok([2, 3].includes(rollValue(2.5, ["particle_count", 0, 48, 1], s, "k", 0) as number));
});
test("E5 QA Breed (Q6): flips come from either parent, only among the first 12 steps, picked by the child seed, for motion too; a layer only parent B has is still rolled", () => {
  const A = { id: "A", rev: 1, doc: { steps: [sp("x", { picture: "ember", particle_motion: "rise" })] } }, B = { id: "B", rev: 1, doc: { steps: [sp("y", { picture: "ember", particle_motion: "burst" })] } };
  for (const c of breed([A, B], { seed: 3, mint: mint() })) assert.notDeepEqual(steps(c.doc).map((s) => s["particle_motion"]), steps(blend(A, B, { base: c.base, mix: c.mix, mint: mint() }).doc).map((s) => s["particle_motion"]));
  const L = { id: "L", rev: 1, doc: { steps: Array.from({ length: 12 }, (_, i) => st(`s${i}`, { picture: "s" })).concat([sp("p", { picture: "a" })]) } }, R = { id: "R", rev: 1, doc: { steps: [sp("q", { picture: "b" })] } };
  for (const c of breed([L, R], { seed: 5, mint: mint() })) assert.deepEqual(steps(c.doc).slice(12).map((s) => s["picture"]), steps(blend(L, R, { base: c.base, mix: c.mix, mint: mint() }).doc).slice(12).map((s) => s["picture"]));
  const W = { id: "W", rev: 1, doc: { steps: [sp("a", { picture: "a" }), sp("b", { picture: "b" }), sp("c", { picture: "c" }), sp("d", { picture: "d" })] } }, firsts = new Set<string>();
  for (let s = 1; s <= 30; s += 1) { const c = breed([W, W], { seed: s, mint: mint() })[0]; firsts.add(JSON.stringify(steps(c?.doc).map((x) => x["picture"]))); } assert.ok(firsts.size > 2, [...firsts].join(" "));
  const T = { id: "T", rev: 1, doc: { parts: [{ id: "t", kind: "trail", beats: ["linger"] }], steps: [st("k"), st("tr", { part: "t", smear_ms: 80 })] } }, S = { id: "S", rev: 1, doc: { steps: [st("m")] } };
  assert.ok([1, 2, 3, 4, 5, 6].some((s) => breed([S, T], { seed: s, mint: mint() }).some((c) => steps(c.doc).some((x) => typeof x["smear_ms"] === "number" && x["smear_ms"] !== 80))));
});
