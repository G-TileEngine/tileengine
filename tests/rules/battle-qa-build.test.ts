import assert from "node:assert/strict";
import { test } from "node:test";
import type { Action } from "../../src/core/log/index.ts";
import type { Grid } from "../../src/core/grid/index.ts";
import type { Units } from "../../src/core/unit/index.ts";
import { createBattle } from "../../src/rules/battle/index.ts";

// QA P1-2 build pin: a unit document id that is an Object.prototype key ("constructor") still takes base HP and atk.
test("qa: stats lookup is own-key only; a 'constructor' unit gets base 9/1", () => {
  const all = ["constructor", "wolf"].map((unitId) => ({ id: `${unitId}#1`, unitId, side: "player", alive: true, at: { c: 0, r: 0 } }));
  const units = { all: () => all, get: (id: string) => all.find((u) => u.id === id), remove: () => true } as unknown as Units, events: unknown[] = [];
  const b = createBattle({ base: { hp: 9, atk: 1 }, stats: { wolf: { hp: 2, atk: 1 } }, hitClass: "basic" }, units, { inBounds: () => true } as unknown as Grid, (e) => events.push(e));
  const hit = (actor: string, unitId: string): Action => ({ id: "x", kind: "ability", actor, target: { pipe: "unit", unitId }, durationMs: null, turns: null, effects: [] });
  assert.deepEqual([b.act(hit("constructor#1", "wolf#1")), b.state().units.map((u) => [u.id, u.hp])], [null, [["constructor#1", 9], ["wolf#1", 1]]]);
  assert.deepEqual(events, [{ type: "hit", unit: "wolf#1", by: "constructor#1", amount: 1, hp: 1, hitClass: "basic" }]);
});
