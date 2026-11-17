import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { installOne } from "../../src/rules/behaviours/index.ts";
import type { BattleSetup } from "../../src/rules/battle/index.ts";
import { ACTION_BUDGET } from "../../src/rules/turns/action-budget.ts";
import { botAbilityPriority, DEFAULT_STEP_REACH } from "../../src/rules/turns/bot-ability-priority.ts";

const SETUP: BattleSetup = { base: { hp: 9, atk: 1 }, stats: {}, hitClass: "basic" };
const src = readFileSync(fileURLToPath(new URL("../../src/rules/turns/bot-ability-priority.ts", import.meta.url)), "utf8");

test("bot requires setup and ACTION_BUDGET actionsPerTurn; DEFAULT_STEP_REACH is the named step cap", () => {
  const budget = installOne(ACTION_BUDGET, {}).out;
  assert.ok(budget !== null);
  assert.equal(budget.actionsPerTurn, 2);
  assert.equal(DEFAULT_STEP_REACH, 2);
  assert.match(src, /export const DEFAULT_STEP_REACH = 2/);
  assert.doesNotThrow(() => botAbilityPriority({ setup: SETUP, actionsPerTurn: budget.actionsPerTurn }));
  assert.throws(() => botAbilityPriority({ setup: SETUP, actionsPerTurn: 0 }), /setup and actionsPerTurn required/);
  assert.throws(() => botAbilityPriority({ actionsPerTurn: 2 } as never), /setup and actionsPerTurn required/);
  assert.doesNotMatch(src, /hp: 1, atk: 1/);
  assert.doesNotMatch(src, /actionsPerTurn \?\? 2/);
});
