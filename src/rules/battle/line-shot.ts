import type { BehaviourDef, KnobReader, KnobSpec } from "../behaviours/types.ts";

const reach: KnobSpec = { id: "reach", type: "slider", default: 3, min: 1, max: 99, step: 1, perUnit: true };
const damage: KnobSpec = { id: "damage", type: "slider", default: 2, min: 1, max: 99, step: 1, perUnit: true };
const mana: KnobSpec = { id: "mana_cost", type: "slider", default: 2, min: 0, max: 99, step: 1 };
export type LineShot = { readonly reach: number; readonly damage: number };
const whole = (n: unknown, min: number): n is number => typeof n === "number" && Number.isInteger(n) && n >= min;
function install(k: KnobReader): LineShot | null {
  const r = k.get("reach"), d = k.get("damage");
  k.get("mana_cost");
  if (!whole(r, 1)) { k.unsupported("reach", `${String(r)} is not a whole number ≥ 1`); return null; }
  if (!whole(d, 1)) { k.unsupported("damage", `${String(d)} is not a whole number ≥ 1`); return null; }
  return Object.freeze({ reach: r, damage: d });
}
export const LINE_SHOT: BehaviourDef<LineShot | null> = Object.freeze({ id: "line-shot", knobs: Object.freeze([Object.freeze(reach), Object.freeze(damage), Object.freeze(mana)]), install });
