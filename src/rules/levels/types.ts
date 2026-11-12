import type { RngState } from "../../core/rng/index.ts";

/** Levelling data (step 18), the maker's choice; no defaults. `bar`: who owns an XP bar (one per side, or one per unit). `thresholds[i]` is the XP
 *  to go from level i to i + 1 (the top level is `thresholds.length`); `offerLevels` open an offer of up to `offerSize` abilities; `xp.move` is paid when a move lands. */
export type LevelRules = { readonly bar: "side" | "unit"; readonly thresholds: readonly number[]; readonly offerLevels: readonly number[]; readonly offerSize: number; readonly xp: { readonly move: number } };
/** The abilities a bar may unlock, in the maker's order: by side id when `bar` is "side", by unit document id (`UnitState.unitId`) when "unit". */
export type AbilityPools = Readonly<Record<string, readonly string[]>>;
export type LevelLimits = { readonly levels: number; readonly pool: number; readonly offer: number; readonly pools: number };
export type LevelSetup = { readonly rules: LevelRules; readonly pools: AbilityPools; readonly limits?: LevelLimits };
/** One bar (`id`: the side id or the unit instance id); `offer` is the pending pick (null = none), `banked` the XP held while it waits. */
export type LevelBar = { readonly id: string; readonly xp: number; readonly level: number; readonly banked: number; readonly offer: readonly string[] | null; readonly abilities: readonly string[] };
export type LevelsState = { readonly rngState: RngState; readonly bars: readonly LevelBar[] };
export interface Levels {
  readonly rules: LevelRules;
  barOf(unit: { readonly id: string; readonly unitId: string; readonly side: string }): { readonly id: string; readonly pool: string };
  gain(id: string, pool: string, amount: number): void;
  offer(id: string): readonly string[] | null;
  choose(id: string, ability: string): boolean;
  state(): LevelsState;
}
declare module "../../types/core-types.ts" {
  interface ModeEventMap {
    readonly "level.reached": { readonly unit: string; readonly level: number; readonly offer: readonly string[] };
    readonly "level.unlocked": { readonly unit: string; readonly ability: string };
  }
}
