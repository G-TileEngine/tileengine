                                                 
import { NOT_PLAIN, cellOf, isRecord, plainCopy } from "../core/plain.js";
                                                        
import { xGo,                        } from "../state/index.js";
                                           

const tile = (at    )        => ({ type: "CONFIRM_TARGET", target: { pipe: "tile", at: { c: at.c, r: at.r } } });

export function intentEvent(phase       , intent        , aim           )               {
  if (intent.type === "SelectUnit") return { type: "SELECT_UNIT", unitId: intent.unitId };
  if (intent.type === "Cancel") return { type: "CANCEL" };
  if (intent.type === "BoxSelect") return null;
  if (intent.type === "TargetCell") {
    if (phase === "unitSelected") return { type: "TAP_MOVE_CELL", at: { c: intent.at.c, r: intent.at.r } };
    return phase === "targeting" ? tile(intent.at) : null;
  }
  return phase === "targeting" && aim !== null ? tile(aim) : null;
}

export function feedIntent(world          , intent        , aim            )               {
  const battle = world.phases.battle;
  if (battle === undefined) throw new Error("feedIntent: battle phase missing");
  const copy = plainCopy(intent, 3);
  if (copy === NOT_PLAIN || !isRecord(copy)) return null;
  const event = intentEvent(battle, copy          , aim == null ? null : cellOf(aim));
  if (event !== null) world.phases = { ...world.phases, battle: xGo(battle, event) };
  return event;
}
