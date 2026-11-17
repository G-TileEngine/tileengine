import assert from "node:assert/strict";
import { test } from "node:test";
import { reachOf, type BattleSetup } from "../../src/rules/battle/index.ts";
import { createPlayer, createWorld } from "../../src/sim/index.ts";
import { xGo } from "../../src/state/index.ts";
import { input } from "../sim/input.ts";

const S: BattleSetup = { base: { hp: 9, atk: 1 }, stats: { wolf: { hp: 4, atk: 1 }, knight: { hp: 9, atk: 1 } }, hitClass: "basic" };
const door = (w: ReturnType<typeof createWorld>) => createPlayer(w, { side: "player", moveMs: null, nextId: (() => { let n = 0; return () => `p${++n}`; })() });

test("qa: ChooseAction from actMenu uses selected after a move or cancel", () => {
  const w = createWorld({ ...input("stage-fixed"), rules: S }), at = w.units.get("knight#1")!.at, p = door(w);
  w.phases = { ...w.phases, battle: "unitSelected" };
  assert.equal(p.feed({ type: "SelectUnit", unitId: "knight#1" }).reject, null);
  assert.equal(p.feed({ type: "TargetCell", at: { c: at.c, r: at.r - 1 } }).reject, null);
  w.phases = { ...w.phases, battle: xGo("moving", { type: "MOVE_DONE" }) };
  assert.equal(w.phases.battle, "actMenu");
  assert.equal(p.feed({ type: "ChooseAction", actionId: "basic" }).reject, null);
  assert.equal(w.phases.battle, "targeting");
  assert.equal(p.feed({ type: "Cancel" }).reject, null);
  assert.equal(w.phases.battle, "actMenu");
  assert.equal(p.feed({ type: "ChooseAction", actionId: "interact" }).reject, null);
  assert.equal(w.phases.battle, "targeting");
});

test("qa: reachOf ignores inherited constructor/__proto__ and honors an own constructor key", () => {
  const proto = Object.create(null);
  for (const [k, v] of [["constructor", 9], ["__proto__", 8]] as const) Object.defineProperty(proto, k, { value: v, enumerable: true });
  const table = Object.create(proto) as Record<string, number>;
  table.knight = 2;
  assert.equal(reachOf(table, "knight"), 2);
  assert.equal(reachOf(table, "constructor"), 1);
  assert.equal(reachOf(table, "__proto__"), 1);
  assert.equal(reachOf({ constructor: 3 }, "constructor"), 3);
});
