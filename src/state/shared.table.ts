import type { Table } from "./types.ts";

export const SHARED_TABLE = {
  id: "shared",
  rows: [
    { from: ["targeting"], event: "CONFIRM_TARGET", to: "resolving", sets: ["target"] },
    { from: ["resolving"], event: "RESOLVE_DONE", to: "victoryCheck" },
    { from: ["victoryCheck"], event: "CHECK_END", to: "play.result", sets: ["outcome"] },
    { from: ["overlay.none"], event: "OPEN_PAUSE", to: "overlay.pause" },
    { from: ["overlay.none", "overlay.pause"], event: "OPEN_SETTINGS", to: "overlay.settings" },
    { from: ["overlay.none", "overlay.pause"], event: "OPEN_SAVELOAD", to: "overlay.saveLoad" },
    { from: ["overlay.pause", "overlay.settings", "overlay.saveLoad"], event: "CLOSE", to: "overlay.none" },
  ],
} as const satisfies Table;
