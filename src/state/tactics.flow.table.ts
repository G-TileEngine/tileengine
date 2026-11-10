import type { Table } from "./types.ts";

export const TACTICS_FLOW_TABLE = {
  id: "tactics.flow",
  rows: [
    { from: ["play.loading"], event: "BATTLE_READY", to: "deploy", sets: ["side"] },
    { from: ["deploy"], event: "DEPLOY_DONE", to: "roundStart", sets: ["round"] },
    { from: ["roundStart"], event: "ROUND_BEGIN", to: "sideStart", sets: ["side"] },
    { from: ["sideStart"], event: "SIDE_BEGIN", to: "idle", sets: ["turnEffects", "fuse"] },
    { from: ["unitDone"], event: "UNIT_DONE", to: ["idle", "sideEnd"], sets: ["spent"] },
    { from: ["idle", "unitSelected"], event: "END_TURN", to: "sideEnd" },
    { from: ["idle", "unitSelected", "actMenu", "targeting"], event: "FUSE_EXPIRE", to: "sideEnd" },
    { from: ["sideEnd"], event: "SIDE_END", to: "victoryCheck", sets: ["turnEffects", "side"] },
    { from: ["victoryCheck"], event: "CHECK_NONE", to: ["unitDone", "sideStart", "roundEnd"] },
    { from: ["roundEnd"], event: "ROUND_END", to: "roundStart", sets: ["round"] },
  ],
} as const satisfies Table;
