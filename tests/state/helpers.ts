import type { Event, EventType } from "../../src/state/types.ts";

const at = { c: 0, r: 0 };

/** One valid Event per type. An omitted or unrecognised `next` uses the first legal pick. */
export function sample(type: EventType, next?: string): Event {
  switch (type) {
    case "SELECT_UNIT":
      return { type, unitId: "u" };
    case "TAP_MOVE_CELL":
      return { type, at };
    case "CHOOSE_ACTION":
      return { type, actionId: "rally", next: next === "resolving" ? "resolving" : "targeting" };
    case "CONFIRM_TARGET":
      return { type, target: { pipe: "tile", at } };
    case "CHECK_NONE":
      return { type, next: next === "sideStart" || next === "roundEnd" ? next : "unitDone" };
    case "CHECK_END":
      return { type, outcome: "win" };
    case "UNIT_DONE":
      return { type, next: next === "sideEnd" ? "sideEnd" : "idle" };
    default:
      return { type };
  }
}
