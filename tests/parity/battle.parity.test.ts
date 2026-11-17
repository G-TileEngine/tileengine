import assert from "node:assert/strict";
import { test } from "node:test";
import { BTF_BATTLE_DEFAULTS } from "../../src/btf-adapters/src/btf-defaults/battle.ts";
import { installOne } from "../../src/rules/behaviours/index.ts";
import { UNIT_ROSTER, UNIT_ROSTER_KNOBS, WIN_CONDITION_KNOBS } from "../../src/rules/battle/index.ts";
import { createWorld, snapshot, submit } from "../../src/sim/index.ts";
import { input } from "../sim/input.ts";

const dflt = (knobs: typeof UNIT_ROSTER_KNOBS, id: string): unknown => knobs.find((k) => k.id === id)?.default;

test("defaults match BTF battle numbers; per-class L3 stats install as BTF's; a 2-atk archer takes a 9-HP warrior down in 5 plain hits", () => {
  assert.deepEqual([dflt(UNIT_ROSTER_KNOBS, "unit_hp"), dflt(UNIT_ROSTER_KNOBS, "unit_atk")], [BTF_BATTLE_DEFAULTS.unit_hp, BTF_BATTLE_DEFAULTS.unit_atk]);
  assert.deepEqual([dflt(WIN_CONDITION_KNOBS, "wipe_wins"), dflt(WIN_CONDITION_KNOBS, "mutual_wipe")], [BTF_BATTLE_DEFAULTS.wipe_wins, BTF_BATTLE_DEFAULTS.mutual_wipe]);
  assert.deepEqual(BTF_BATTLE_DEFAULTS.classes.warrior, { hp: BTF_BATTLE_DEFAULTS.unit_hp, atk: BTF_BATTLE_DEFAULTS.unit_atk });
  for (const [name, s] of Object.entries(BTF_BATTLE_DEFAULTS.classes)) {
    const got = installOne(UNIT_ROSTER, { unit: { unit_hp: { value: s.hp }, unit_atk: { value: s.atk } } });
    assert.deepEqual([name, got.out, got.notes], [name, s, []]);
  }
  const { warrior, archer } = BTF_BATTLE_DEFAULTS.classes;
  const w = createWorld({ ...input("stage-fixed"), rules: { base: warrior, stats: { archer }, hitClass: "basic" } }), trail: number[] = [];
  for (let i = 1; i <= 5; i += 1) { submit(w, { id: `h${i}`, kind: "ability", actor: "archer#2", target: { pipe: "unit", unitId: "knight#1" }, durationMs: null, turns: null, effects: [] }); trail.push(snapshot(w).rules?.units[0]?.hp ?? -1); }
  assert.deepEqual([trail, w.units.get("knight#1")?.alive], [[7, 5, 3, 1, 0], false]);
});
