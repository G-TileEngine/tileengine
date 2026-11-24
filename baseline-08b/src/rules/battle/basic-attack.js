                                                                                 
const reach           = { id: "reach", type: "slider", default: 1, min: 1, max: 99, step: 1, perUnit: true };
                                                     
const whole = (n         )              => typeof n === "number" && Number.isInteger(n) && n >= 1;
function install(k            )                     {
  const n = k.get("reach");
  if (!whole(n)) { k.unsupported("reach", `${String(n)} is not a whole number ≥ 1`); return null; }
  return Object.freeze({ reach: n });
}
export const BASIC_ATTACK                                   = Object.freeze({ id: "basic-attack", knobs: Object.freeze([Object.freeze(reach)]), install });
