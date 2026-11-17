import assert from "node:assert/strict";
import { test } from "node:test";
import type { Action } from "../../src/core/log/index.ts";
import type { BattleSetup } from "../../src/rules/battle/index.ts";
import { createWorld, snapshot, submit, type SimWorld } from "../../src/sim/index.ts";
import { input } from "../sim/input.ts";

// QA P1-2 pins (G1 misses q01-q08, q11, q15): bad setup, atk 0, overkill amount, remove-then-died, rules last key.
const S: BattleSetup = { base: { hp: 9, atk: 1 }, stats: { wolf: { hp: 1, atk: 0 }, archer: { hp: 6, atk: 2 } }, hitClass: "basic" };
const arm = (rules: unknown = S) => createWorld({ ...input("stage-fixed"), rules: rules as BattleSetup });
const hit = (id: string, actor: string, unitId: string): Action => ({ id, kind: "ability", actor, target: { pipe: "unit", unitId }, durationMs: null, turns: null, effects: [] });
const seen = (w: SimWorld) => w.bus.history().flatMap((r) => (r.event.type === "hit" || r.event.type === "unit.died" ? [r.event] : []));

test("qa: a bad setup is refused, never skipped (step rule 4)", () => {
  const wolf = (s: unknown) => ({ ...S, stats: { wolf: s } });
  for (const bad of [{ ...S, base: { hp: 0, atk: 1 } }, wolf({ hp: 2, atk: 1.5 }), wolf({ hp: 2, atk: Infinity }), wolf({ hp: Infinity, atk: 1 }), wolf({ hp: NaN, atk: 1 }), { ...S, hitClass: "laser" }]) {
    assert.throws(() => arm(bad), /^RangeError: createBattle: bad setup$/);
  }
});

test("qa: atk 0 is a hit of amount 0 that never kills; overkill reports amount = atk, hp 0", () => {
  const w = arm(), died: unknown[] = [];
  w.bus.on("unit.died", (e) => died.push([e.type, w.units.get("wolf#3")?.alive, w.units.occupantsAt({ c: 2, r: 0 }).length]));
  submit(w, hit("a1", "wolf#3", "knight#1"));
  submit(w, hit("a2", "archer#2", "wolf#3"));
  assert.deepEqual(seen(w), [
    { type: "hit", unit: "knight#1", by: "wolf#3", amount: 0, hp: 9, hitClass: "basic" },
    { type: "hit", unit: "wolf#3", by: "archer#2", amount: 2, hp: 0, hitClass: "basic" },
    { type: "unit.died", unit: "wolf#3", by: "archer#2" },
  ]);
  assert.deepEqual([w.notices.length, w.units.get("knight#1")?.alive, died], [0, true, [["unit.died", false, 0]]]);
});

test("qa: snapshot adds rules as the last key, after turn", () => {
  const w = arm(); (w as { turn?: unknown }).turn = { sel: null, undo: [], fuseDueMs: null };
  assert.deepEqual(Object.keys(snapshot(w)).slice(-2), ["turn", "rules"]);
});
