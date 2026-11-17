import assert from "node:assert/strict";
import { test } from "node:test";
import { TERRAIN, XP_LEVELS, installOne, type BehaviourDef, type Installed } from "../../src/rules/behaviours/index.ts";

// QA pin (B1 r3): misses Q1, Q3, Q5, Q6, Q8, Q9, Q11, Q12, Q14–Q17, Q23 of docs/qa/qa-runs/b1/r3/b1-qa-plants.py; r4: N8; r5: S5e, S5f; r7: N4b, L3, L4 (r4/, r5/, r7/ plant files).
const user = (value: unknown): { source: string; value: unknown; rev: number } => ({ source: "user", value, rev: 1 });
const codes = (i: Installed): string[] => i.notes.filter((n) => n.code !== "knobUnsupported").map((n) => `${n.code} ${n.message}`);
const HP: BehaviourDef<unknown> = { id: "hp-qa", knobs: [{ id: "unit_hp", type: "slider", default: 9, min: 1, max: 99, step: 1, perUnit: true, l5: "hp" }, { id: "speed", type: "slider", default: 4, min: 0, max: 9, step: 1 }], install: (k) => [k.get("unit_hp"), k.get("speed")] };
const CHAIN: BehaviourDef<unknown> = { id: "chain-qa", knobs: [{ id: "a", type: "toggle", default: false }, { id: "b", type: "toggle", default: true, when: { knob: "a", eq: true } }, { id: "c", type: "slider", default: 1, when: { knob: "b", eq: true } }], install: (k) => k.get("c") };
const tiles = (list: unknown): Installed => installOne(TERRAIN, { answers: { tile_types: user(list) } });

test("B1 QA pin: own keys only, prototype-named item fields warn, empty ids and Infinity are hard", () => {
  assert.deepEqual(installOne(XP_LEVELS, { answers: Object.create({ xp_move: user(3) }) as object }).knobs["xp_move"], { value: 1, layer: "L0" });
  assert.deepEqual(codes(tiles([{ id: "bog", label: "B", toString: true }])).filter((c) => c.startsWith("unknownField")), ["unknownField terrain.tile_types bog.toString"]);
  assert.equal(tiles([{ id: "", label: "x" }]).playable, false);
  assert.deepEqual([tiles([{ id: "Bog", label: "B" }]).playable, tiles([{ id: "bog", label: "B" }]).playable], [false, true]);
  assert.deepEqual([48, 49].map((n) => { const t = tiles([{ id: "bog", label: "x".repeat(n) }]); return [codes(t).filter((c) => c.startsWith("outOfRange")).length, (t.knobs["tile_types"]?.value as { label: string }[])[0]?.label.length]; }), [[0, 48], [1, 49]]);
  assert.equal(installOne(HP, { answers: { speed: user(Infinity) } }).playable, false);
  assert.equal(Object.isFrozen(installOne(XP_LEVELS, {}).knobs), true);
  assert.deepEqual([TERRAIN.knobs, XP_LEVELS.knobs].map((k) => Object.isFrozen(k)), [true, true]);
});

test("B1 QA pin: L5 rounds to nearest and touches only l5 knobs; range edges; stageUnit notPerUnit; L2 ignores source", () => {
  assert.deepEqual(installOne(HP, { answers: { unit_hp: user(7) } }, { difficulty: { hp: 1.3 } }).out, [9, 4]);
  assert.deepEqual([codes(installOne(HP, { answers: { speed: user(0) } })), codes(installOne(HP, { answers: { speed: user(10.5) } }))], [[], ["outOfRange hp-qa.speed"]]);
  assert.deepEqual(codes(installOne(XP_LEVELS, { stageUnit: { xp_move: { value: 2, rev: 1 } } })), ["notPerUnit xp-levels.xp_move"]);
  assert.deepEqual(installOne(XP_LEVELS, { stage: { xp_move: { source: "default", value: 2, rev: 1 } } }).knobs["xp_move"], { value: 2, layer: "L2" });
});

test("B1 QA pin: a gate leaf on an inactive knob is false (§2.6); a buildable tile is reported", () => {
  const c = installOne(CHAIN, {}); assert.deepEqual([c.out, "b" in c.knobs, "c" in c.knobs], [undefined, false, false]);
  assert.equal(tiles([{ id: "bog", label: "B", buildable: true }]).unsupported.some((u) => u.detail === "bog.buildable"), true);
});
