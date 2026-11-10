import assert from "node:assert/strict";
import { test } from "node:test";
import { BTF_FX_PRESET } from "../../src/btf-adapters/src/index.ts";
import { BTF_FX_FLIGHT } from "../../src/btf-adapters/src/index.ts";
import { FX_OPTION_VALUES, readFxOptions, type FxOptions } from "../../src/fx/order/index.ts";

test("the BTF preset is current play (CEO/CoS 2026-11-09) and every preset value is an allowed value", () => {
  assert.equal(BTF_FX_PRESET.turn_start_order, "player_side"); assert.equal(BTF_FX_PRESET.death_order, "reward_then_meter");
  assert.equal(BTF_FX_PRESET.pierce_hit_timing, "per_tile_on_pass"); assert.equal(BTF_FX_PRESET.chain_order, "hit_then_pull_per_body");
  assert.equal(BTF_FX_PRESET.reel_knock, "pull_only"); assert.equal(BTF_FX_PRESET.seam_object_vs_immaculate_ray, "blocks");
  assert.equal(BTF_FX_PRESET.obstacles_block_leap, false);
  const keys = Object.keys(FX_OPTION_VALUES) as (keyof FxOptions)[];
  assert.deepEqual(Object.keys(BTF_FX_PRESET).sort(), [...keys].sort());
  for (const key of keys) assert.equal(FX_OPTION_VALUES[key].some((value) => value === BTF_FX_PRESET[key]), true);
});
test("every option is the user's: answers override the base; doc-differs, unknown and bad values warn and never block", () => {
  const got = readFxOptions({
    reel_knock: "pull_then_knock1", seam_object_vs_immaculate_ray: "passes", obstacles_block_leap: true, chain_order: "far_to_near", spin: 1,
  }, BTF_FX_PRESET);
  assert.deepEqual(got.options, { ...BTF_FX_PRESET, reel_knock: "pull_then_knock1", seam_object_vs_immaculate_ray: "passes", obstacles_block_leap: true });
  assert.deepEqual(got.notices.map((n) => n.code), ["fxDocDiffers", "fxOptionInvalid", "fxOptionUnknown"]);
  assert.equal(BTF_FX_PRESET.reel_knock, "pull_only");
  const empty = readFxOptions([], BTF_FX_PRESET);
  assert.equal(empty.options, BTF_FX_PRESET);
  assert.deepEqual(empty.notices, [{ code: "fxOptionsNotObject", message: "Effect-order options are not an object; the base is used." }]);
  assert.equal(readFxOptions({ turn_start_order: "rival_side" }, BTF_FX_PRESET).options.turn_start_order, "rival_side");
});
test("10b options: holy-sword landing checks all 8 around by default (CEO 2026-11-10); PROPOSED silent-spot defaults are the user's", () => {
  assert.equal(BTF_FX_PRESET.landing_neighbours, "eight"); assert.equal(BTF_FX_PRESET.landing_across_seam, "blocked");
  assert.equal(BTF_FX_PRESET.pierce_flight, "fixed_total"); assert.equal(BTF_FX_PRESET.impact_burst, "per_body");
  assert.deepEqual(BTF_FX_FLIGHT, { totalMs: 400, msPerTile: null });
  assert.deepEqual(FX_OPTION_VALUES.pierce_flight, ["fixed_total", "per_tile"]);
  assert.deepEqual(FX_OPTION_VALUES.impact_burst, ["per_body", "once_at_contact"]);
  assert.equal(BTF_FX_PRESET.multi_hit_order, "near_to_far"); assert.equal(BTF_FX_PRESET.rehit_same_body, "never");
  assert.equal(BTF_FX_PRESET.trap_trigger, "any_move_end"); assert.equal(BTF_FX_PRESET.turn_end_effects, "at_next_side_start");
  assert.equal(BTF_FX_PRESET.fuse_pause_during, "spells");
  const got = readFxOptions({ landing_neighbours: "four", landing_across_seam: "allowed", trap_trigger: "voluntary_steps_only", fuse_pause_during: "all_resolution", stun_count: "never" }, BTF_FX_PRESET);
  assert.deepEqual(got.options, { ...BTF_FX_PRESET, landing_neighbours: "four", landing_across_seam: "allowed", trap_trigger: "voluntary_steps_only", fuse_pause_during: "all_resolution" });
  assert.deepEqual(got.notices.map((n) => n.code), ["fxOptionInvalid"]);
  const taken = readFxOptions({ pierce_flight: "per_tile", impact_burst: "once_at_contact" }, BTF_FX_PRESET);
  assert.equal(taken.options.pierce_flight, "per_tile"); assert.equal(taken.options.impact_burst, "once_at_contact"); assert.deepEqual(taken.notices, []);
});
