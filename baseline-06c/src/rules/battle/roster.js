                                                                                 

const unitHp           = { id: "unit_hp", type: "slider", default: 9, min: 1, max: 21, step: 1, perUnit: true, l5: "hp" };
const unitAtk           = { id: "unit_atk", type: "slider", default: 1, min: 0, max: 2, step: 1, perUnit: true };
export const UNIT_ROSTER_KNOBS                      = Object.freeze([Object.freeze(unitHp), Object.freeze(unitAtk)]);
                                                                      

const whole = (n         , min        )              => typeof n === "number" && Number.isInteger(n) && n >= min;
function install(k            )                   {
  const hp = k.get("unit_hp"), atk = k.get("unit_atk");
  if (!whole(hp, 1)) { k.unsupported("unit_hp", `${String(hp)} is not a whole number ≥ 1`); return null; }
  if (!whole(atk, 0)) { k.unsupported("unit_atk", `${String(atk)} is not a whole number ≥ 0`); return null; }
  return Object.freeze({ hp, atk });
}
export const UNIT_ROSTER                                 = Object.freeze({ id: "unit-roster", knobs: UNIT_ROSTER_KNOBS, install });
