import assert from "node:assert/strict";
import { test } from "node:test";
import type { Action } from "../../src/core/log/index.ts";
import type { BattleSetup } from "../../src/rules/battle/index.ts";
import { botAbilityPriority } from "../../src/rules/turns/bot-ability-priority.ts";
import { createWorld } from "../../src/sim/index.ts";
import { input } from "../sim/input.ts";

// QA P1-5 pin: shotRow prototype keys must not crash the side; tie-breaks (path length, lowest HP, placement) were untested (G1).
const S: BattleSetup = { base: { hp: 9, atk: 1 }, stats: { wolf: { hp: 4, atk: 1 }, archer: { hp: 6, atk: 2 }, cub: { hp: 1, atk: 1 } }, hitClass: "basic", abilities: { archer: [{ reach: 3, damage: 2, effectRef: "line-shot" }] } };
const targetOf = (a: Action | undefined): string => a?.target && a.target.pipe === "unit" ? a.target.unitId : "";
const bot = (setup: BattleSetup = S) => botAbilityPriority({ setup });
const withCub = (setup: BattleSetup, at: { c: number; r: number }) => {
  const src = input("stage-fixed"), stage = structuredClone(src.stage) as { enemyPool: { entries: unknown[] } };
  return (stage.enemyPool.entries.push({ unitId: "cub", at }), createWorld({ ...src, stage, rules: setup }));
};
test("qa: a constructor document id does not crash the bot; ties are path length, then lowest HP, then placement", () => {
  const w = createWorld({ ...input("stage-fixed"), rules: S });
  w.units.place({ unitId: "constructor", side: "player", at: { c: 5, r: 8 }, facing: null });
  w.units.moveTo("archer#2", { c: 2, r: 3 }, "move");
  const acts = bot()(w, "player");
  assert.equal(acts[0]?.actor, "archer#2");
  assert.deepEqual(acts[0]?.effects, ["line-shot"]);
  const hp = withCub(S, { c: 5, r: 3 });
  hp.units.moveTo("archer#2", { c: 2, r: 3 }, "move");
  const cub = hp.units.all().find((u) => u.unitId === "cub");
  assert.equal(targetOf(bot()(hp, "player")[0]), cub?.id);
  const near = withCub(S, { c: 5, r: 2 });
  near.units.moveTo("archer#2", { c: 2, r: 2 }, "move");
  assert.equal(targetOf(bot()(near, "player")[0]), "wolf#3");
  const even: BattleSetup = { ...S, stats: { ...S.stats, cub: { hp: 4, atk: 1 } } };
  const pl = withCub(even, { c: 5, r: 3 });
  pl.units.moveTo("archer#2", { c: 2, r: 3 }, "move");
  assert.equal(targetOf(bot(even)(pl, "player")[0]), "wolf#3");
});
