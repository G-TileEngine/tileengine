import assert from "node:assert/strict";
import { test } from "node:test";
import type { Action } from "../../src/core/log/index.ts";
import { HIT_FILTER_REASONS, type BattleSetup } from "../../src/rules/battle/index.ts";
import { createWorld, snapshot, submit, type SimWorld } from "../../src/sim/index.ts";
import { input } from "../sim/input.ts";

// QA P1-3 pin: merchant is not interactable; no intervening-body block; HIT_FILTER_REASONS stays the frozen pair (G1 misses).
const S: BattleSetup = { base: { hp: 9, atk: 1 }, stats: { wolf: { hp: 4, atk: 1 }, archer: { hp: 6, atk: 2 }, knight: { hp: 9, atk: 1 } }, hitClass: "basic", reach: { archer: 2 } };
const act = (id: string, kind: Action["kind"], actor: string, unitId: string): Action =>
  ({ id, kind, actor, target: { pipe: "unit", unitId }, durationMs: null, turns: null, effects: [] });
const reason = (w: SimWorld) => (w.notices.at(-1) as { reason?: string } | undefined)?.reason;

test("qa: HIT_FILTER_REASONS is frozen; merchant is foeTarget; a body in the ray does not block", () => {
  assert.equal(Object.isFrozen(HIT_FILTER_REASONS), true);
  assert.deepEqual([...HIT_FILTER_REASONS], ["outOfReach", "allyTarget"]);
  const talk = createWorld({ ...input("stage-fixed"), rules: S });
  talk.units.moveTo("knight#1", { c: 4, r: 5 }, "move");
  submit(talk, act("t1", "interact", "knight#1", "merchant#6"));
  assert.equal(reason(talk), "foeTarget");
  const ray = createWorld({ ...input("stage-fixed"), rules: S });
  ray.units.moveTo("archer#2", { c: 2, r: 2 }, "move");
  ray.units.moveTo("knight#1", { c: 2, r: 1 }, "move"); // between archer (2,2) and wolf#3 (2,0)
  submit(ray, act("a1", "ability", "archer#2", "wolf#3"));
  assert.deepEqual(ray.notices.map((n) => n.code), []);
  assert.equal(snapshot(ray).rules?.units.find((u) => u.id === "wolf#3")?.hp, 2);
});
