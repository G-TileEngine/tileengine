import type { Notice } from "../../core/notice.ts";
import type { Sq } from "../../types/core-types.ts";

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
  | { readonly kind: "hit"; readonly at: number }
  | { readonly kind: "spawn"; readonly at: number; readonly spawn: FxSpawn; readonly trail: boolean }
  | { readonly kind: "layer"; readonly at: number; readonly index: number }
  | { readonly kind: "strike"; readonly at: number; readonly body: string | null; readonly react: FxReact }
  | { readonly kind: "impact"; readonly at: number; readonly body: string | null }   // the burst, hit number and hit sound hook
  | { readonly kind: "pull"; readonly at: number; readonly body: string; readonly toward: Sq; readonly all: boolean }
  | { readonly kind: "knock"; readonly at: number; readonly body: string };
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
  readonly landing_neighbours: "eight" | "four";       // the free tile a landing piece needs next to its target
  readonly landing_across_seam: "blocked" | "allowed"; // a free tile a seam object cuts off from the target; callers apply it in canLand
  readonly multi_hit_order: "near_to_far";
  readonly rehit_same_body: "never";
  readonly simultaneous_hits: "sequential_list_order";
  readonly crossing_order: "by_due_time_then_seq";
  readonly trap_trigger: "any_move_end" | "voluntary_steps_only";
  readonly modifier_stacking: "additive_before_mitigation";
  readonly turn_end_effects: "at_next_side_start" | "side_end";
  readonly stun_count: "victim_turn_start";
  readonly last_stand_release: "before_held_deaths_and_ticks";
  readonly fuse_pause_during: "spells" | "all_resolution";
  readonly pierce_flight: "fixed_total" | "per_tile";   // how per-tile pierce strikes are timed (lengths come in FxFlight)
  readonly impact_burst: "per_body" | "once_at_contact";
};
export type FxOptionsRead = { readonly options: FxOptions; readonly notices: readonly Notice[] };

/** Read limits are the caller's input; their values live in presets, never in src/fx. Whole ms. */
export type FxReadLimits = {
  readonly minStepMs: number;   // shortest step; longer clamps come from FX_FORMAT
  readonly fillStepMs: number;  // a step with no seconds
  readonly minConnect: number;
  readonly maxConnect: number;
};

/** One play of an effect, built by the caller (rules, or a later mapping from the effect document). TileEngine names; no game numbers. */
export type FxSpawn = "drop" | "from_caster" | "beside_caster" | "in_front";
export type FxReact = "none" | "nudge" | "knock1" | "split";
export type FxBody = { readonly id: string; readonly at: Sq };
export type FxShot = {
  readonly spawn: FxSpawn;                          // chosen once for the whole ability, before any step
  readonly path: "single" | "pierce" | "bounce" | "chain" | "yank";
  readonly flightTiles: number | null;              // pierce: how many tiles the flight passes (whole, at least one); null on every other path
  readonly from: Sq;                                // the caster: distances count from here; the first chain pull goes toward it
  readonly bodies: readonly FxBody[];               // single and yank: the first only; bounce: tap order; pierce and chain: any order
  readonly land: Sq | null;                         // yank: where the pull ends (the caller picks it); null on every other path
  readonly react: FxReact;
  readonly impact: boolean;                         // the burst is drawn only when present
  readonly trail: boolean;                          // the trail is drawn only when true
  readonly layerDelay: readonly (number | null)[];  // per step: the second motion starts this fraction in; null or absent = none
};
/** Pierce flight lengths are the caller's input (presets hold the values). Whole ms; null when that mode is not used. */
export type FxFlight = { readonly totalMs: number | null; readonly msPerTile: number | null };
export type FxEffectPlan = FxPlan & { readonly notices: readonly Notice[] };
