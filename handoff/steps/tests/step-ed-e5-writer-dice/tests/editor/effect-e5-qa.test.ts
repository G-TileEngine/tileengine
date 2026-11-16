import assert from "node:assert/strict";
import { test } from "node:test";
import { canonKnob, canonStep, exportEffect, redo, undo, usedIds, valuesOf, write } from "../../src/editor/effect/writer.ts";
import { addPart, blankDoc, readHouse } from "../../src/editor/effect/house.ts";
type Row = Record<string, unknown>;
const at = "2026-11-16T22:00:00.000Z", mint = () => { let n = 0; return (p: string) => `${p}${(n += 1)}`; };
const doc0 = (answers: Row = {}, h: Row = {}, orphans: Row = {}): Row => ({ rev: 0, answers, orphans, history: { cap: 200, baseSeq: 0, ops: [], ...h } });
const H = (d: Row): Row => d["history"] as Row, ops = (d: Row): Row[] => H(d)["ops"] as Row[], ids = (d: Row, k: string): unknown[] => (((d["answers"] as Row)[k] as Row)["value"] as Row[]).map((s) => s["id"]);
test("E5 QA writer: inputs untouched, full M6 table, orphan copy, M4 held-before from before-states and orphans, pixel_scale aliases only 1-6", () => {
  const step = { kind: "stamp", start_at: 5 }, inD = doc0({ steps: { source: "user", value: [{ id: "a", kind: "stamp" }], rev: 1 } }); inD["rev"] = 3; const snap = JSON.stringify(inD), parts = [{ kind: "light", beats: ["hit"] }];
  const d = write(inD, { steps: [step], parts }, { at, mint: mint() }); assert.equal(JSON.stringify(inD), snap); assert.deepEqual([step, parts[0]], [{ kind: "stamp", start_at: 5 }, { kind: "light", beats: ["hit"] }]);
  assert.deepEqual((d["orphans"] as Row)["steps#items"], { answer: { source: "user", value: [{ id: "a", kind: "stamp" }], rev: 1 }, removedAtRev: 4, reason: "aliases normalised (M6)" });
  const raw = { smear_remnant: false, blank_at: "hit", flash_center: "caster", radius_from: 1, ring_thickness_px: 2, light: "steady" }, keep = JSON.stringify(raw);
  assert.deepEqual(canonStep(raw), { smear_remnant_ms: 0, start_mode: "at-hit", anchor: "caster", wave_from: 1, wave_thickness_px: 2, light_mode: "steady" }); assert.equal(JSON.stringify(raw), keep); assert.deepEqual(canonStep({ flash_center: "screen" }), { anchor: "screen" });
  assert.deepEqual([canonKnob("pixel_scale", "0"), canonKnob("pixel_scale", "7"), canonKnob("pixel_scale", "6")], ["0", "7", 6]);
  const loaded = doc0({ steps: { source: "user", value: [{ id: "a" }, { id: "b" }], rev: 1 } }), cut = write(loaded, { steps: [{ id: "a" }] }, { at, mint: mint() });
  assert.deepEqual(ids(write(cut, { steps: [{ id: "a" }, { id: "b" }] }, { at, mint: () => "s-9" }), "steps"), ["a", "s-9"]);
  const orph = doc0({}, {}, { "steps#items": { answer: { source: "user", value: [{ id: "z" }] } } }); assert.ok(usedIds(orph, "steps").has("z")); assert.deepEqual(ids(write(orph, { steps: [{ id: "z" }] }, { at, mint: () => "s-8" }), "steps"), ["s-8"]);
  assert.deepEqual(valuesOf(doc0({ x: { source: "user", rev: 2 }, y: { source: "user", value: 0 } })), { y: 0 });
});
test("E5 QA history: undo/redo bump answer rev, the last migrate is the wall, redo takes the last undone entry; Export clean keeps cap, drops parts orphans, seq carries on", () => {
  const m = mint(); let d = write(doc0(), { shake: 1 }, { at, mint: m }); d = write(d, { shake: 2 }, { at, mint: m });
  const u = undo(undo(d, at), at); assert.deepEqual(valuesOf(u), {}); assert.equal(((u["answers"] as Row)["shake"] as Row)["rev"], 4); assert.deepEqual(valuesOf(redo(u, at)), { shake: 1 });
  const mig = { seq: 9, at, kind: "migrate", changes: [] }, w: Row = { ...d, history: { cap: 200, baseSeq: 0, ops: [...ops(d).slice(0, 1), mig, ...ops(d).slice(1), { ...mig, seq: 10 }] } }; assert.equal(undo(w, at), w);
  let c = write(doc0({}, { cap: 50 }, { "parts#items": { answer: null } }), { parts: [{ id: "p", kind: "sparks", beats: ["hit"], from: { effect: "f", rev: 1 } }] }, { at, mint: m }); c = write(c, { shake: 1 }, { at, mint: m });
  const e = exportEffect(c, { clean: true }); assert.deepEqual([H(e), Object.keys(e["orphans"] as Row)], [{ cap: 50, baseSeq: 2, ops: [] }, []]); assert.equal(ops(write(e, { shake: 2 }, { at, mint: m }))[0]?.["seq"], 3);
});
test("E5 QA house: null/string/0/-1 are flagged, match-sprite kept, the first ramp is used, Punch row only on a punch part", () => {
  assert.deepEqual(readHouse({ effectHouse: null }, []).notes, [{ code: "invalidValue", message: "effectHouse" }]);
  assert.deepEqual(readHouse({ effectHouse: { ramps: "frost", punch: -1, pixel_scale: 0 } }, ["frost"]), { house: { ramps: [], punch: 0, motes: false }, notes: [{ code: "invalidValue", message: "effectHouse.ramps" }, { code: "outOfRange", message: "effectHouse.punch" }, { code: "outOfRange", message: "effectHouse.pixel_scale" }] });
  assert.deepEqual([readHouse({ effectHouse: { pixel_scale: "0" } }, []).notes.length, readHouse({ effectHouse: { pixel_scale: "match-sprite" } }, [])], [1, { house: { ramps: [], punch: 0, motes: false, pixel_scale: "match-sprite" }, notes: [] }]);
  const h = { ramps: ["frost", "holy"], punch: 3, motes: false }; assert.equal(blankDoc(h, mint())["tint_ramp"], "frost");
  const p = addPart({ shake: 1 }, { kind: "sparks", beats: ["hit"] }, [{ kind: "particles" }], h, mint()); assert.deepEqual([p["hit_stop_ms"], (p["steps"] as Row[])[0]?.["tint_ramp"]], [undefined, "frost"]);
});
