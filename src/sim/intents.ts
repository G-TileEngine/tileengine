import type { Sq } from "../types/core-types.ts";
import { NOT_PLAIN, cellOf, isRecord, plainCopy } from "../core/plain.ts";
import type { Intent } from "../runtime/input/index.ts";
import { xGo, type Event, type Phase } from "../state/index.ts";
import type { SimWorld } from "./types.ts";

const tile = (at: Sq): Event => ({ type: "CONFIRM_TARGET", target: { pipe: "tile", at: { c: at.c, r: at.r } } });

export function intentEvent(phase: Phase, intent: Intent, aim: Sq | null): Event | null {
  if (intent.type === "SelectUnit") return { type: "SELECT_UNIT", unitId: intent.unitId };
  if (intent.type === "Cancel") return { type: "CANCEL" };
  if (intent.type === "BoxSelect") return null;
  if (intent.type === "TargetCell") {
    if (phase === "unitSelected") return { type: "TAP_MOVE_CELL", at: { c: intent.at.c, r: intent.at.r } };
    return phase === "targeting" ? tile(intent.at) : null;
  }
  return phase === "targeting" && aim !== null ? tile(aim) : null;
}

export function feedIntent(world: SimWorld, intent: Intent, aim?: Sq | null): Event | null {
  const battle = world.phases.battle;
  if (battle === undefined) throw new Error("feedIntent: battle phase missing");
  const copy = plainCopy(intent, 3);
  if (copy === NOT_PLAIN || !isRecord(copy)) return null;
  const event = intentEvent(battle, copy as Intent, aim == null ? null : cellOf(aim));
  if (event !== null) world.phases = { ...world.phases, battle: xGo(battle, event) };
  return event;
}
