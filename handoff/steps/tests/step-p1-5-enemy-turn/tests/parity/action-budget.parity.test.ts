import assert from "node:assert/strict";
import { test } from "node:test";
import { BTF_TURN_DEFAULTS } from "../../src/btf-adapters/src/index.ts";
import { installOne } from "../../src/rules/behaviours/index.ts";
import { ACTION_BUDGET } from "../../src/rules/turns/action-budget.ts";

test("action-budget defaults to BTF CHESS_MOVES = 2; a bad value is unsupported", () => {
  assert.deepEqual(installOne(ACTION_BUDGET, {}).out, { actionsPerTurn: BTF_TURN_DEFAULTS.actions_per_turn });
  assert.equal(BTF_TURN_DEFAULTS.actions_per_turn, 2);
  assert.equal(installOne(ACTION_BUDGET, { answers: { actions_per_turn: { source: "user", value: 0, rev: 1 } } }).out, null);
});
