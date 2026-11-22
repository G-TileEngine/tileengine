import { isRecord } from "../../core/plain.js";

                                                                                                                                                                   
                                                                                                                                 
const SPEC = new Map              ([
  ["basic-attack", { group: "basic", effectRef: "basic", knobs: { reach: 1 } }],
  ["line-shot", { group: "spells", effectRef: "line-shot", knobs: { reach: 3, damage: 2 } }],
]);
const numOf = (slot         )                     => { const v = isRecord(slot) && Object.hasOwn(slot, "value") ? slot.value : slot; return typeof v === "number" && Number.isFinite(v) ? v : undefined; };
/** L0 catalogue → L1 answers → L2 stage overrides (by setup id) → L3 unit stats. Only knobs the behaviour has. */
export function abilityTableFor(unit                                                                                               , setups                                                                                                        , overrides                                    )               {
  const stats = unit.stats, out               = [];
  for (const key of unit.setupIds ?? []) {
    const setup = setups.get(key); if (setup === undefined) continue;
    const spec = SPEC.get(setup.behaviourId); if (spec === undefined) continue;
    const answers = setup.answers, over = overrides !== undefined && Object.hasOwn(overrides, setup.id) ? overrides[setup.id] : undefined;
    let reach = spec.knobs.reach ?? 0, damage = spec.knobs.damage ?? 0;
    for (const knob of ["reach", "damage"]         ) {
      if (!Object.hasOwn(spec.knobs, knob)) continue;
      let n = spec.knobs[knob] ?? 0;
      if (isRecord(answers) && Object.hasOwn(answers, knob)) { const v = numOf(answers[knob]); if (v !== undefined) n = v; }
      if (isRecord(over) && Object.hasOwn(over, knob)) { const v = numOf(over[knob]); if (v !== undefined) n = v; }
      if (stats !== undefined && Object.hasOwn(stats, knob)) { const v = numOf(stats[knob]); if (v !== undefined) n = v; }
      if (knob === "reach") reach = n; else damage = n;
    }
    out.push({ key, group: spec.group, reach, damage, effectRef: spec.effectRef });
  }
  return out;
}
