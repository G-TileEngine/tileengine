import type { BehaviourDef, KnobReader, KnobSpec } from "../behaviours/types.ts";

const reach: KnobSpec = { id: "reach", type: "slider", default: 1, min: 1, max: 99, step: 1, perUnit: true };
export type BasicAttack = { readonly reach: number };
const whole = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n) && n >= 1;
function install(k: KnobReader): BasicAttack | null {
  const n = k.get("reach");
  if (!whole(n)) { k.unsupported("reach", `${String(n)} is not a whole number ≥ 1`); return null; }
  return Object.freeze({ reach: n });
}
export const BASIC_ATTACK: BehaviourDef<BasicAttack | null> = Object.freeze({ id: "basic-attack", knobs: Object.freeze([Object.freeze(reach)]), install });
