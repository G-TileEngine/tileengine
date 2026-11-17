import assert from "node:assert/strict";
import { test } from "node:test";
import { BTF_BATTLE_DEFAULTS } from "../../src/btf-adapters/src/index.ts";
import { installOne } from "../../src/rules/behaviours/index.ts";
import { BASIC_ATTACK, inOrthogonalReach, reachOf } from "../../src/rules/battle/index.ts";

test("defaults match BTF basicReach; inOrthogonalReach matches inBasicRange (orthogonal, not diagonal)", () => {
  assert.equal(installOne(BASIC_ATTACK, {}).out?.reach, BTF_BATTLE_DEFAULTS.basic_reach);
  assert.deepEqual(BTF_BATTLE_DEFAULTS.class_reach, { warrior: 1, archer: 2, mage: 2, cleric: 1 });
  const at = { c: 2, r: 2 };
  assert.equal(inOrthogonalReach(at, { c: 2, r: 3 }, 1), true);
  assert.equal(inOrthogonalReach(at, { c: 2, r: 4 }, 1), false);
  assert.equal(inOrthogonalReach(at, { c: 2, r: 4 }, 2), true);
  assert.equal(inOrthogonalReach(at, { c: 3, r: 3 }, 2), false);
  assert.equal(inOrthogonalReach(at, { c: 2, r: 3 }, 0), false);
  assert.equal(reachOf(undefined, "knight"), 1);
  assert.equal(reachOf({ knight: 0 }, "knight"), 1);
});
