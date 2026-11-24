                                                                                 

/** Side actions per turn. towerChess.ts:92 CHESS_MOVES = 2. This step ships this knob only. */
const actions           = { id: "actions_per_turn", type: "slider", default: 2, min: 1, max: 99, step: 1 };
                                                               
const whole = (n         )              => typeof n === "number" && Number.isInteger(n) && n >= 1;
function install(k            )                      {
  const n = k.get("actions_per_turn");
  if (!whole(n)) { k.unsupported("actions_per_turn", `${String(n)} is not a whole number ≥ 1`); return null; }
  return Object.freeze({ actionsPerTurn: n });
}
export const ACTION_BUDGET                                    = Object.freeze({ id: "action-budget", knobs: Object.freeze([Object.freeze(actions)]), install });
