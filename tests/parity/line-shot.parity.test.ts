import assert from "node:assert/strict";
import { test } from "node:test";
import { BTF_SPELL_DEFAULTS } from "../../src/btf-adapters/src/index.ts";
import { installOne } from "../../src/rules/behaviours/index.ts";
import { LINE_SHOT, inOrthogonalReach } from "../../src/rules/battle/index.ts";

test("defaults match BTF fireball spellReach / usual damage 2; inOrthogonalReach at 3 matches spellReach", () => {
  const out = installOne(LINE_SHOT, {}).out;
  assert.equal(out?.reach, BTF_SPELL_DEFAULTS.line_shot_reach);
  assert.equal(out?.damage, BTF_SPELL_DEFAULTS.line_shot_damage);
  assert.equal(BTF_SPELL_DEFAULTS.mana_cost, 2);
  const at = { c: 2, r: 2 };
  assert.equal(inOrthogonalReach(at, { c: 2, r: 5 }, 3), true);
  assert.equal(inOrthogonalReach(at, { c: 2, r: 6 }, 3), false);
  assert.equal(inOrthogonalReach(at, { c: 3, r: 3 }, 3), false);
});
