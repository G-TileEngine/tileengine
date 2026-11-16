import assert from "node:assert/strict";
import { test } from "node:test";
import { roll } from "../../src/editor/effect/dice.ts";
import { blend } from "../../src/editor/effect/merge.ts";
import { canonStep, exportEffect, redo, undo, usedIds, valuesOf, write, type Op } from "../../src/editor/effect/writer.ts";
type Row = Record<string, unknown>;
const mint = () => { let n = 0; return (p: string) => `${p}${(n += 1)}`; };
const doc0 = (answers: Row = {}): Row => ({ kind: "behaviour-setup", id: "effect_X", rev: 0, answers, orphans: {}, history: { cap: 200, baseSeq: 0, ops: [] } });
const at = "2026-11-16T21:00:00.000Z";
const ops = (d: Row): Op[] => (d["history"] as { ops: Op[] }).ops;
const ans = (d: Row, k: string): Row => (d["answers"] as Row)[k] as Row;
test("E5 writer M6: aliases are written under canonical names (canonical wins), a boolean hold stays, the old list is kept as an orphan; seed 0 is absent, pixel_scale \"3\" is 3", () => {
  assert.deepEqual(canonStep({ start_at: 30, hold: 90, particle_life: 500, light: "pop", light_mode: "off", flash_seconds: 0.25, flash_center: "hit", blank_at: "step-start", smear_remnant: true, ease: "fast-out", radius_to: 3 }), { start_at_ms: 30, hold_ms: 90, particle_life_ms: 500, light_mode: "off", flash_ms: 250, anchor: "target", start_mode: "with-last", smear_remnant_ms: 40, look_ease: "out", wave_radius: 3 });
  assert.deepEqual(canonStep({ hold: true, ease: "in-out", light: "glow" }), { hold: true, ease: "in-out", light: "glow" });
  const d = write(doc0(), { steps: [{ id: "a", kind: "stamp", start_at: 60 }], variant_seed: 0, pixel_scale: "3" }, { at, mint: mint() });
  assert.deepEqual(ans(d, "steps")["value"], [{ id: "a", kind: "stamp", start_at_ms: 60 }]); assert.equal(ans(d, "variant_seed"), undefined); assert.equal(ans(d, "pixel_scale")["value"], 3);
  assert.equal(((d["orphans"] as Row)["steps#items"] as Row)["reason"], "aliases normalised (M6)");
  const e = write(d, { variant_seed: 7 }, { at, mint: mint() }), z = write(e, { variant_seed: 0 }, { at, mint: mint() });
  assert.equal(ans(z, "variant_seed")["source"], "default"); assert.equal("value" in ans(z, "variant_seed"), false); assert.equal(valuesOf(z)["variant_seed"], undefined);
});
test("E5 writer M4: missing, empty and repeated step ids are minted; an id deleted earlier is never reused; part ids too; minted ids skip any used id", () => {
  const m = mint(), d = write(doc0(), { steps: [{ kind: "stamp" }, { id: "", kind: "stamp" }, { id: "x", kind: "stamp" }, { id: "x", kind: "flash" }] }, { at, mint: m });
  assert.deepEqual(idsOf(d, "steps"), ["s-1", "s-2", "x", "s-3"]);
  const gone = write(d, { steps: [{ id: "x", kind: "stamp" }] }, { at, mint: m }), back = write(gone, { steps: [{ id: "x", kind: "stamp" }, { id: "s-2", kind: "dim" }] }, { at, mint: m });
  assert.deepEqual(idsOf(back, "steps"), ["x", "s-4"]); assert.ok(usedIds(back, "steps").has("s-3"));
  const clash = write(doc0(), { steps: [{ id: "s-1", kind: "stamp" }, { kind: "dim" }] }, { at, mint: mint() }); assert.deepEqual(idsOf(clash, "steps"), ["s-1", "s-2"]); assert.deepEqual(idsOf(write(clash, { steps: [{ id: "s-1", kind: "stamp" }, { id: "s-1", kind: "dim" }, { kind: "dim" }] }, { at, mint: () => "s-1" }), "steps"), ["s-1", "s-4", "s-5"]);
  const seq = ["s-1", "s-9"]; assert.deepEqual(idsOf(write(doc0(), { steps: [{ id: "s-1", kind: "stamp" }, { kind: "dim" }] }, { at, mint: () => seq.shift() ?? "z" }), "steps"), ["s-1", "s-9"]);
  const p = write(doc0(), { parts: [{ id: "q", kind: "shape", beats: ["cast"] }, { id: "q", kind: "light", beats: ["hit"] }] }, { at, mint: mint() }); assert.deepEqual(idsOf(p, "parts"), ["q", "p-1"]);
});
const idsOf = (d: Row, k: string): unknown[] => (ans(d, k)["value"] as Row[]).map((s) => s["id"]);
test("E5 writer history: one set op per action with only changed knobs, rev +1 on doc and answer, group and note kept; no change writes nothing; cap compaction moves baseSeq", () => {
  const d = write(doc0({ shake: { source: "user", value: 1, rev: 4 } }), { shake: 2, squash: true, hit_stop_ms: undefined }, { at, mint: mint(), group: "grp_1", note: "dice" });
  assert.equal(d["rev"], 1); assert.equal(d["updatedAt"], at); assert.equal(ans(d, "shake")["rev"], 5); assert.equal(ans(d, "squash")["rev"], 1);
  assert.deepEqual(ops(d), [{ seq: 1, at, kind: "set", changes: [{ knob: "shake", before: { source: "user", value: 1 }, after: { source: "user", value: 2 } }, { knob: "squash", before: { source: "default" }, after: { source: "user", value: true } }], group: "grp_1", note: "dice" }]);
  assert.equal(write(d, { shake: 2 }, { at, mint: mint() }), d);
  let c: Row = { ...doc0(), history: { cap: 2, baseSeq: 0, ops: [] } }; for (const v of [1, 2, 3]) c = write(c, { shake: v }, { at, mint: mint() });
  assert.deepEqual([(c["history"] as Row)["baseSeq"], ops(c).map((o) => o.seq)], [1, [2, 3]]);
});
test("E5 writer undo/redo: one group is one undo entry (newest first) and one redo; redo is refused after a new write; undo never crosses a migrate barrier", () => {
  const m = mint(); let d = write(doc0(), { shake: 1 }, { at, mint: m }); d = write(d, { shake: 2 }, { at, mint: m, group: "g" }); d = write(d, { squash: true }, { at, mint: m, group: "g" });
  const u = undo(d, at); assert.deepEqual(valuesOf(u), { shake: 1 }); assert.deepEqual(ops(u).slice(3).map((o) => [o.kind, o.target, o.group]), [["undo", 3, "g"], ["undo", 2, "g"]]); assert.equal(u["rev"], 5);
  const r = redo(u, at); assert.deepEqual(valuesOf(r), { shake: 2, squash: true }); assert.deepEqual(ops(r).slice(5).map((o) => o.kind), ["redo", "redo"]);
  assert.deepEqual(valuesOf(undo(undo(u, at), at)), {}); assert.equal(redo(write(u, { shake: 3 }, { at, mint: m }), at)["rev"], 6);
  const b: Row = { ...d, history: { cap: 200, baseSeq: 0, ops: [...ops(d).slice(0, 1), { seq: 2, at, kind: "migrate", changes: [] }] } }; assert.equal(undo(b, at), b);
  assert.equal(undo(doc0(), at)["rev"], 0); assert.equal(redo(d, at), d);
});
test("E5 writer Export clean: strips from on every part and drops history ops; a plain export is unchanged; valuesOf skips default answers", () => {
  let d = write(doc0(), { parts: [{ id: "p", kind: "sparks", beats: ["hit"], from: { effect: "fire", rev: 3 } }] }, { at, mint: mint() }); d = write(d, { shake: 1 }, { at, mint: mint() });
  assert.equal(exportEffect(d), d); assert.equal(exportEffect(d, { clean: false }), d);
  const c = exportEffect(d, { clean: true }); assert.deepEqual(ans(c, "parts")["value"], [{ id: "p", kind: "sparks", beats: ["hit"] }]); assert.deepEqual(c["history"], { cap: 200, baseSeq: 2, ops: [] });
  assert.deepEqual(valuesOf(doc0({ a: { source: "default", rev: 0 }, b: { source: "preset", value: 2, rev: 1 } })), { b: 2 }); assert.notDeepEqual(ans(d, "parts")["value"], ans(c, "parts")["value"]);
});
test("E5 writer + blend + dice: a merge and a dice tap are one op each (one undo back to the doc before); a stored seed 0 reads as 0 until that knob is written", () => {
  const m = mint();
  const base = write(doc0(), { connect_step: "h", variant_seed: 5, steps: [{ id: "h", kind: "stamp" }] }, { at, mint: m }), before = valuesOf(base);
  const mixed = blend({ id: "A", rev: 1, doc: before }, { id: "B", rev: 4, doc: { steps: [{ id: "b", kind: "particles", particle_count: 60 }] } }, { base: "a", mix: 50, mint: m }).doc;
  const d = write(base, mixed, { at, mint: m, group: "grp_merge", note: "blend" }); assert.equal(ops(d).length, 2); assert.equal(ops(d)[1]?.group, "grp_merge");
  assert.deepEqual(valuesOf(undo(d, at)), before); const r = write(d, roll(valuesOf(d), "sparks", 3).doc, { at, mint: m, group: "grp_dice" }); assert.equal(ops(r).length, 3); assert.deepEqual(valuesOf(undo(r, at)), valuesOf(d));
  const z = doc0({ variant_seed: { source: "user", value: 0, rev: 1 } }); assert.equal(valuesOf(z)["variant_seed"], 0); assert.equal(ans(write(z, { shake: 1 }, { at, mint: m }), "variant_seed")["value"], 0);
});
test("E5 r3 (QA S1-S5): junk history ops and non-record list items are dropped; prototype-name knobs are skipped; a group undo with a later non-undone op among it is refused (§4 rule 10); redo skips an entry compaction dropped", () => {
  const m = mint(), j = write({ ...doc0(), history: { cap: 200, baseSeq: 0, ops: [null, { seq: 1, changes: {} }, { seq: "5", changes: [] }, { seq: 2, changes: [null] }, { seq: 3, at, kind: "set", changes: [{ knob: "__proto__", before: { source: "default" }, after: { source: "user", value: 5 } }] }] } }, { shake: 1, steps: [null, 5, "x", [1], { kind: "stamp" }] }, { at, mint: m }), p = write(doc0(), JSON.parse('{"__proto__":5,"constructor":1,"prototype":2,"shake":2}') as Row, { at, mint: m });
  let g = write(doc0(), { shake: 1 }, { at, mint: m, group: "g" }); g = write(g, { shake: 2 }, { at, mint: m }); g = write(g, { squash: true }, { at, mint: m, group: "g" }); let c: Row = { ...doc0(), history: { cap: 3, baseSeq: 0, ops: [] } }; c = write(c, { shake: 1 }, { at, mint: m }); c = undo(undo(write(c, { squash: true }, { at, mint: m }), at), at); const r = redo(c, at);
  assert.deepEqual([ops(j).map((o) => o.seq), ans(j, "steps")["value"], valuesOf(undo(j, at)), Object.getPrototypeOf(undo(undo(j, at), at)["answers"]) === Object.prototype, Object.getPrototypeOf(p["answers"]) === Object.prototype, Object.keys(p["answers"] as Row), undo(g, at) === g, valuesOf(c), valuesOf(r), redo(r, at) === r], [[3, 4], [{ kind: "stamp", id: "s-1" }], {}, true, true, ["shake"], true, {}, { squash: true }, true]);
});
