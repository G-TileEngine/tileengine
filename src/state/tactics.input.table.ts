import type { Table } from "./types.ts";

export const TACTICS_INPUT_TABLE = {
  id: "tactics.input",
  rows: [
    { from: ["idle", "unitSelected"], event: "SELECT_UNIT", to: "unitSelected", sets: ["sel", "moveCells"] },
    { from: ["unitSelected"], event: "CANCEL", to: "idle", sets: ["sel"] },
    { from: ["unitSelected"], event: "TAP_MOVE_CELL", to: "moving", sets: ["path"] },
    { from: ["moving"], event: "MOVE_DONE", to: "actMenu" },
    { from: ["actMenu"], event: "UNDO_MOVE", to: "unitSelected", sets: ["cell"] },
    { from: ["actMenu"], event: "CHOOSE_ACTION", to: ["targeting", "resolving"], sets: ["action"] },
    { from: ["targeting"], event: "CANCEL", to: "actMenu" },
    { from: ["actMenu"], event: "WAIT", to: "unitDone" },
  ],
} as const satisfies Table;
