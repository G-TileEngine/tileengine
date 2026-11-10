// src/state/types.ts
import type { Sq } from "../types/core-types.ts";

export type Phase =
  | "play.loading" | "play.result"
  | "targeting" | "resolving" | "victoryCheck"
  | "overlay.none" | "overlay.pause" | "overlay.settings" | "overlay.saveLoad"
  | "deploy" | "roundStart" | "sideStart" | "unitDone" | "sideEnd" | "roundEnd"
  | "idle" | "unitSelected" | "moving" | "actMenu";

export type Outcome = "win" | "lose" | "draw";

export type TargetRef =
  | { readonly pipe: "unit"; readonly unitId: string }
  | { readonly pipe: "tile"; readonly at: Sq };

export type Event =
  | { readonly type: "BATTLE_READY" }
  | { readonly type: "DEPLOY_DONE" }
  | { readonly type: "ROUND_BEGIN" }
  | { readonly type: "SIDE_BEGIN" }
  | { readonly type: "SELECT_UNIT"; readonly unitId: string }
  | { readonly type: "CANCEL" }
  | { readonly type: "TAP_MOVE_CELL"; readonly at: Sq }
  | { readonly type: "MOVE_DONE" }
  | { readonly type: "UNDO_MOVE" }
  | { readonly type: "CHOOSE_ACTION"; readonly actionId: string; readonly next: "targeting" | "resolving" }
  | { readonly type: "CONFIRM_TARGET"; readonly target: TargetRef }
  | { readonly type: "WAIT" }
  | { readonly type: "RESOLVE_DONE" }
  | { readonly type: "CHECK_NONE"; readonly next: "unitDone" | "sideStart" | "roundEnd" }
  | { readonly type: "CHECK_END"; readonly outcome: Outcome }
  | { readonly type: "UNIT_DONE"; readonly next: "idle" | "sideEnd" }
  | { readonly type: "END_TURN" }
  | { readonly type: "FUSE_EXPIRE" }
  | { readonly type: "SIDE_END" }
  | { readonly type: "ROUND_END" }
  | { readonly type: "OPEN_PAUSE" }
  | { readonly type: "OPEN_SETTINGS" }
  | { readonly type: "OPEN_SAVELOAD" }
  | { readonly type: "CLOSE" };

export type EventType = Event["type"];

export type Row = {
  readonly from: readonly Phase[];
  readonly event: EventType;
  readonly to: Phase | readonly Phase[];   // array = pick-list; the event's `next` must be in it
  readonly sets?: readonly string[];      // documentation tags for the driver; xGo ignores them
};

export type Table = { readonly id: string; readonly rows: readonly Row[] };

/** Every phase and every event type, once. tests/state/tables.coverage.test.ts proves both lists are exhaustive. */
export const ALL_PHASES = [
  "play.loading", "play.result", "targeting", "resolving", "victoryCheck",
  "overlay.none", "overlay.pause", "overlay.settings", "overlay.saveLoad",
  "deploy", "roundStart", "sideStart", "unitDone", "sideEnd", "roundEnd",
  "idle", "unitSelected", "moving", "actMenu",
] as const satisfies readonly Phase[];

export const ALL_EVENT_TYPES = [
  "BATTLE_READY", "DEPLOY_DONE", "ROUND_BEGIN", "SIDE_BEGIN", "SELECT_UNIT", "CANCEL", "TAP_MOVE_CELL", "MOVE_DONE",
  "UNDO_MOVE", "CHOOSE_ACTION", "CONFIRM_TARGET", "WAIT", "RESOLVE_DONE", "CHECK_NONE", "CHECK_END", "UNIT_DONE",
  "END_TURN", "FUSE_EXPIRE", "SIDE_END", "ROUND_END", "OPEN_PAUSE", "OPEN_SETTINGS", "OPEN_SAVELOAD", "CLOSE",
] as const satisfies readonly EventType[];
