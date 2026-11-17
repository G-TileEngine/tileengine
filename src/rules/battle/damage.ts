import type { Notice } from "../../core/notice.ts";
import { installOne } from "../behaviours/index.ts";
import type { BehaviourDef, InstallCtx, Installed, KnobReader, KnobSpec, SetupLayers } from "../behaviours/types.ts";

export const HIT_CLASSES = Object.freeze(["basic", "spell", "arrow"] as const);
export type HitClass = (typeof HIT_CLASSES)[number];
const hitClass: KnobSpec = { id: "hit_class", type: "picker", default: "basic", options: HIT_CLASSES };
export const DAMAGE_RESOLUTION_KNOBS: readonly KnobSpec[] = Object.freeze([Object.freeze(hitClass)]);
export type DamageRule = { readonly hitClass: HitClass };
function install(k: KnobReader): DamageRule { return Object.freeze({ hitClass: k.get("hit_class") as HitClass }); }
export const DAMAGE_RESOLUTION: BehaviourDef<DamageRule> = Object.freeze({ id: "damage-resolution", knobs: DAMAGE_RESOLUTION_KNOBS, install });
export type DamageCtx = InstallCtx & { readonly difficulty?: { readonly hp: number; readonly damage?: number } };
const WARN: Notice = Object.freeze({ code: "layerNotApplied", message: "L5 difficulty.damage" });
export function installDamage(layers: SetupLayers, ctx?: DamageCtx): Installed<DamageRule> {
  const got = installOne(DAMAGE_RESOLUTION, layers, ctx), d = ctx?.difficulty;
  if (d === undefined || !Object.hasOwn(d, "damage") || d.damage === 1) return got;
  return Object.freeze({ ...got, notes: Object.freeze([...got.notes, WARN]) });
}
