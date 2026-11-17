import type { LevelRules } from "../levels/index.ts";
import { XP_LEVELS_KNOBS } from "./catalogue.ts";
import type { BehaviourDef, KnobReader } from "./types.ts";

const nums = (value: unknown): number[] => typeof value === "string" ? value.split(",").map(Number) : [];
function install(k: KnobReader): LevelRules | null {
  const rule = k.get("level_rule");
  if (rule !== "xp_table") { k.unsupported("level_rule", `${String(rule)} levelling`); return null; }
  const table = nums(k.get("thresholds")), levels = k.get("levels"), n = table.length;
  if (typeof levels !== "number" || !Number.isInteger(levels) || levels < 1 || levels > n) { k.unsupported("levels", `${String(levels)} needs 1–${n}`); return null; }
  const move = k.get("xp_move");
  if (typeof move !== "number" || !Number.isInteger(move) || move < 0) { k.unsupported("xp_move", `${String(move)} is not a whole number ≥ 0`); return null; }
  const unlocks = k.get("ability_unlock_levels"), pick = k.get("unlock_pick_count");
  if (pick !== undefined && (typeof pick !== "number" || !Number.isInteger(pick) || pick < 1)) { k.unsupported("unlock_pick_count", `${String(pick)} is not a whole number ≥ 1`); return null; }
  return { bar: "side", thresholds: table.slice(0, levels), offerLevels: typeof unlocks === "string" ? nums(unlocks).filter((level) => level <= levels) : [], offerSize: typeof pick === "number" ? pick : 1, xp: { move } };
}
export const XP_LEVELS: BehaviourDef<LevelRules | null> = Object.freeze({ id: "xp-levels", knobs: XP_LEVELS_KNOBS, install });
