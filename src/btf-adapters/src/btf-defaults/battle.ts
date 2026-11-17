/** Proven BTF battle numbers. towerChess.ts:92 HP; towerChess.ts:926-937 opening ad; towerStrike.ts:33-35 class damage, :214-219 cleric 1; towerStrike.ts:515 Math.max(0, hp - dmg), :518 death at hp <= 0; towerChess.ts:1745-1752 judgeBoard(). */
export const BTF_BATTLE_DEFAULTS = Object.freeze({
  unit_hp: 9 as const,
  unit_atk: 1 as const,
  classes: Object.freeze({
    warrior: Object.freeze({ hp: 9 as const, atk: 1 as const }),
    archer: Object.freeze({ hp: 6 as const, atk: 2 as const }),
    mage: Object.freeze({ hp: 6 as const, atk: 2 as const }),
    cleric: Object.freeze({ hp: 5 as const, atk: 1 as const }),
  }),
  wipe_wins: true as const,
  mutual_wipe: "draw" as const,
});
