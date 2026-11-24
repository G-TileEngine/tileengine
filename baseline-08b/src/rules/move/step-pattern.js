                                                   
                                                                                 

const OPTIONS = Object.freeze(["orthogonal-1", "orthogonal-2", "king-1", "forward2-back1-side2", "ns1-diag2", "ns2-ew1", "orth1-diag2", "king-2", "diag-2"]);
const PLAYED                                   = { "orthogonal-1": 1, "orthogonal-2": 2 };

const pattern           = { id: "pattern", type: "picker", default: "orthogonal-1", options: OPTIONS };
const maxStep           = { id: "max_step", type: "slider", default: 2, min: 1, max: 2, step: 1 };
export const STEP_PATTERN_KNOBS                      = Object.freeze([Object.freeze(pattern), Object.freeze(maxStep)]);
                                                                                     

function install(k            )                  {
  const chosen = k.get("pattern"), cap = k.get("max_step"), reach = typeof chosen === "string" ? PLAYED[chosen] : undefined;
  if (reach === undefined) { k.unsupported("pattern", String(chosen)); return null; }
  if (typeof cap !== "number" || !Number.isInteger(cap) || cap < 1) { k.unsupported("max_step", `${String(cap)} is not a whole number ≥ 1`); return null; }
  const notes           = reach > cap ? [Object.freeze({ code: "stepClamped", message: `step-pattern.pattern ${chosen} reaches ${reach}, max_step ${cap}` })] : [];
  return Object.freeze({ reach: Math.min(reach, cap), notes: Object.freeze(notes) });
}

export const STEP_PATTERN                                = Object.freeze({ id: "step-pattern", knobs: STEP_PATTERN_KNOBS, install });
