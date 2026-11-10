import type { Notice } from "../../core/notice.ts";
import type { FxOptions, FxOptionsRead } from "./types.ts";

/** Allowed values per option. Order is display order only; nothing here is a default. */
export const FX_OPTION_VALUES: { readonly [K in keyof FxOptions]: readonly FxOptions[K][] } = {
  hit_knock_order: ["damage_then_knock_if_alive", "knock_then_damage", "damage_then_knock_always"],
  turn_start_order: ["player_side", "rival_side"],
  death_order: ["reward_then_meter", "basic_attack_path", "sword_path"],
  pierce_hit_timing: ["per_tile_on_pass", "all_at_connect"],
  chain_order: ["hit_then_pull_per_body"],
  reel_knock: ["pull_only", "pull_then_knock1"],
  landing_order: ["hit_knock_trap_landing"],
  simultaneous_wipe: ["draw", "attacker_wins", "defender_wins"],
  seam_object_vs_immaculate_ray: ["blocks", "passes"],
  obstacles_block_leap: [false, true],
};

/** Values that follow a design doc, not current play (effect-order-from-docs.md, silent spots: reel and knock). */
export const FX_DOC_DIFFERS: readonly string[] = ["reel_knock.pull_then_knock1"];

type MutableOptions = { -readonly [K in keyof FxOptions]: FxOptions[K] };

function known(key: string): key is keyof FxOptions {
  return Object.hasOwn(FX_OPTION_VALUES, key);
}
function take<K extends keyof FxOptions>(options: MutableOptions, key: K, value: unknown): boolean {
  for (const item of FX_OPTION_VALUES[key]) if (item === value) { options[key] = item; return true; }
  return false;
}
export function readFxOptions(json: unknown, base: FxOptions): FxOptionsRead {
  if (typeof json !== "object" || json === null || Array.isArray(json)) {
    return { options: base, notices: [{ code: "fxOptionsNotObject", message: "Effect-order options are not an object; the base is used." }] };
  }
  const options: MutableOptions = { ...base };
  const notices: Notice[] = [];
  for (const [key, value] of Object.entries(json)) {
    if (!known(key)) { notices.push({ code: "fxOptionUnknown", message: "Unknown effect-order option." }); continue; }
    if (!take(options, key, value)) { notices.push({ code: "fxOptionInvalid", message: "Effect-order option value is not allowed." }); continue; }
    if (FX_DOC_DIFFERS.includes(`${key}.${String(value)}`)) notices.push({ code: "fxDocDiffers", message: "This value follows a design doc, not current play." });
  }
  return { options, notices };
}
