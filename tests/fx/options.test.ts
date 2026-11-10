import assert from "node:assert/strict";
import { test } from "node:test";
import { BTF_FX_PRESET } from "../../src/btf-adapters/src/index.ts";
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
