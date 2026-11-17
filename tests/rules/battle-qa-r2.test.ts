import assert from "node:assert/strict";
import { test } from "node:test";
import type { Action } from "../../src/core/log/index.ts";
import { HIT_REFUSED_REASONS, type BattleSetup } from "../../src/rules/battle/index.ts";
import { createWorld, submit } from "../../src/sim/index.ts";
import { input } from "../sim/input.ts";

// QA P1-2 r2 pin (G1 misses d11-d13, d15): D7 precedence needs two faults at once; the reason list is frozen.
const S: BattleSetup = { base: { hp: 9, atk: 1 }, stats: { wolf: { hp: 2, atk: 1 }, archer: { hp: 6, atk: 2 } }, reach: { wolf: 99, archer: 99, knight: 99 }, hitClass: "basic" };
const hit = (id: string, actor: string, more: Partial<Action> = {}): Action => ({ id, kind: "ability", actor, target: { pipe: "unit", unitId: "archer#2" }, durationMs: null, turns: null, effects: [], ...more });

test("qa: hitRefused checks the actor before the aim (D7 order); the reason list is frozen", () => {
  const w = createWorld({ ...input("stage-fixed"), rules: S });
  w.units.remove("wolf#3");
  const tile = { target: { pipe: "tile" as const, at: { c: 3, r: 0 } } };
  for (const a of [hit("c1", "ghost#9", tile), hit("c2", "wolf#3", tile), hit("c3", "wolf#3", { target: null }), hit("c4", "wolf#3", { target: { pipe: "unit", unitId: "ghost#9" } }), hit("c5", "wolf#3", { target: { pipe: "unit", unitId: "wolf#3" } })]) submit(w, a);
  assert.deepEqual(w.notices.map((n) => (n as { reason?: string }).reason), ["unknownActor", "deadActor", "deadActor", "deadActor", "deadActor"]);
  assert.equal(Object.isFrozen(HIT_REFUSED_REASONS), true);
});
