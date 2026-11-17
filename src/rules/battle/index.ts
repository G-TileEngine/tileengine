export { BATTLE_EVENTS, HIT_FILTER_REASONS, HIT_REFUSED_REASONS, createBattle, type Battle, type BattleSetup, type BattleState, type HitFilterReason, type HitRefused, type HitRefusedReason } from "./battle.ts";
export { DAMAGE_RESOLUTION, DAMAGE_RESOLUTION_KNOBS, HIT_CLASSES, installDamage, type DamageCtx, type DamageRule, type HitClass } from "./damage.ts";
export { UNIT_ROSTER, UNIT_ROSTER_KNOBS, type UnitStats } from "./roster.ts";
export { WIN_CONDITION, WIN_CONDITION_KNOBS, wipeRule, type WinRule } from "./win.ts";
export { BASIC_ATTACK, type BasicAttack } from "./basic-attack.ts";
export { INTERACT_REFUSED_REASONS, interactRefused, type InteractRefused, type InteractRefusedReason } from "./interact.ts";
export { inOrthogonalReach, reachOf, type ReachTable } from "./range.ts";
export { targetsFor } from "./targets.ts";
