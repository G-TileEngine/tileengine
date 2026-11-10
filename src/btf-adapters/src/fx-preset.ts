import type { FxOptions, FxReadLimits } from "../../fx/order/index.ts";

/** The BTF preset: how BTF currently plays (CEO and CoS rulings 2026-11-09). Plain data the caller passes to src/fx. */
export const BTF_FX_PRESET: FxOptions = {
  hit_knock_order: "damage_then_knock_if_alive", turn_start_order: "player_side", death_order: "reward_then_meter",
  pierce_hit_timing: "per_tile_on_pass", chain_order: "hit_then_pull_per_body", reel_knock: "pull_only",
  landing_order: "hit_knock_trap_landing", simultaneous_wipe: "draw", seam_object_vs_immaculate_ray: "blocks",
  obstacles_block_leap: false,
};

/** BTF read limits: min step 0.20 s is PROVISIONAL pending CEO (SKILLRIG.md:86; the catalogue slider allows 0.15 s);
 *  fill-in 0.48 s and connect 0.02–1 are CEO-approved (2026-11-10; catalogue effect.steps default, effect.connect). */
export const BTF_FX_READ_LIMITS: FxReadLimits = { minStepMs: 200, fillStepMs: 480, minConnect: 0.02, maxConnect: 1 };
