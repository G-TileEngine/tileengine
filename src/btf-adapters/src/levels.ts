import type { LevelRules } from "../../rules/levels/index.ts";

/** BTF's tested levelling (CEO 2026-11-10/12): one bar per side, towerXp.ts XP_AT and LEVEL_CAP 9, a move is 1 XP,
 *  ability offers at levels 1, 3, 4, 6, 7 and 9 (2, 5 and 8 give nothing for now), three per offer. */
export const BTF_LEVEL_RULES: LevelRules = { bar: "side", thresholds: [17, 11, 13, 11, 13, 14, 11, 11, 11], offerLevels: [1, 3, 4, 6, 7, 9], offerSize: 3, xp: { move: 1 } };
