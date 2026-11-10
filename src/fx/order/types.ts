import type { Notice } from "../../core/notice.ts";

/** One step (`frames[i]`, effect-order §A). `ms` is whole sim ms (integer-ms law); `kind` is passed through, or null when absent. */
export type FxStep = { readonly kind: string | null; readonly ms: number };

/** A read `fx-order` asset: the timing part of a SKILLRIG v1 block. Engine sequencing data, never game rules. */
export type FxOrder = {
  readonly steps: readonly FxStep[];          // the steps that play, in list order (at most six)
  readonly inactive: readonly FxStep[];       // steps past the cap: kept, never played (see FX_FORMAT)
  readonly connect: number;                   // fraction through the last step where the hit applies
  readonly damage: number | null;             // passed through untouched; null = no hit amount (effect-order §A)
  readonly raw: Readonly<Record<string, unknown>>;  // the parsed JSON, kept for later steps
};
export type FxRead = { readonly order: FxOrder | null; readonly notices: readonly Notice[] };

export type FxCue =
  | { readonly kind: "step"; readonly at: number; readonly index: number }
  | { readonly kind: "hit"; readonly at: number };
export type FxPlan = { readonly cues: readonly FxCue[]; readonly endMs: number };

/** Effect-order project options (one order everywhere). Every value comes from the caller (a project or a preset). */
export type FxOptions = {
  readonly hit_knock_order: "damage_then_knock_if_alive" | "knock_then_damage" | "damage_then_knock_always";
  readonly turn_start_order: "player_side" | "rival_side";
  readonly death_order: "reward_then_meter" | "basic_attack_path" | "sword_path";
  readonly pierce_hit_timing: "per_tile_on_pass" | "all_at_connect";
  readonly chain_order: "hit_then_pull_per_body";
  readonly reel_knock: "pull_only" | "pull_then_knock1";
  readonly landing_order: "hit_knock_trap_landing";
  readonly simultaneous_wipe: "draw" | "attacker_wins" | "defender_wins";
  readonly seam_object_vs_immaculate_ray: "blocks" | "passes";  // objects on tile seams/edges: huge, though drawn thin
  readonly obstacles_block_leap: boolean;
};
export type FxOptionsRead = { readonly options: FxOptions; readonly notices: readonly Notice[] };

/** Read limits are the caller's input; their values live in presets, never in src/fx. Whole ms. */
export type FxReadLimits = {
  readonly minStepMs: number;   // shortest step; longer clamps come from FX_FORMAT
  readonly fillStepMs: number;  // a step with no seconds
  readonly minConnect: number;
  readonly maxConnect: number;
};
