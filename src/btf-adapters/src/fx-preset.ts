import type { FxFlight, FxOptions, FxReadLimits } from "../../fx/order/index.ts";

/** The BTF preset: how BTF currently plays (CEO and CoS rulings 2026-11-09). Plain data the caller passes to src/fx. */
export const BTF_FX_PRESET: FxOptions = {
  hit_knock_order: "damage_then_knock_if_alive", turn_start_order: "player_side", death_order: "reward_then_meter",
  pierce_hit_timing: "per_tile_on_pass", chain_order: "hit_then_pull_per_body", reel_knock: "pull_only",
  landing_order: "hit_knock_trap_landing", simultaneous_wipe: "draw", seam_object_vs_immaculate_ray: "blocks",
  obstacles_block_leap: false,
  landing_neighbours: "eight", landing_across_seam: "blocked",  // CEO-ruled 2026-11-10 (the seam rule via CoS), not PROPOSED
  // PROPOSED (effect-order-from-docs.md silent spots 2, 4, 6, 8, 12, 14, 17-20: what BTF code does), until the user decides
  multi_hit_order: "near_to_far", rehit_same_body: "never", simultaneous_hits: "sequential_list_order",
  crossing_order: "by_due_time_then_seq", trap_trigger: "any_move_end", modifier_stacking: "additive_before_mitigation",
  turn_end_effects: "at_next_side_start", stun_count: "victim_turn_start", last_stand_release: "before_held_deaths_and_ticks",
  fuse_pause_during: "spells",
  pierce_flight: "fixed_total", impact_burst: "per_body",  // CEO-ruled 2026-11-10 (via CoS), not PROPOSED
};

/** BTF pierce flight: the whole flight takes 0.40 s, split evenly over the tiles it passes (CEO 2026-11-10). No BTF per-tile speed. */
export const BTF_FX_FLIGHT: FxFlight = { totalMs: 400, msPerTile: null };

/** BTF read limits: min step 0.20 s is PROVISIONAL pending CEO (SKILLRIG.md:86; the catalogue slider allows 0.15 s);
 *  fill-in 0.48 s and connect 0.02–1 are CEO-approved (2026-11-10; catalogue effect.steps default, effect.connect). */
export const BTF_FX_READ_LIMITS: FxReadLimits = { minStepMs: 200, fillStepMs: 480, minConnect: 0.02, maxConnect: 1 };
