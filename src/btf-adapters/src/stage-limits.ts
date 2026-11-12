import type { StageLimits } from "../../project/read/index.ts";

/** BTF stage caps (PROPOSED, pending CEO): a 12x12 board has 144 cells, so no BTF stage can place more units than that. */
export const BTF_STAGE_LIMITS: StageLimits = { picks: 144, waveUnits: 144, side: 64, objects: 1024, edges: 16384, footprint: 8, spots: 144, waves: 256, turn0: 144, text: 128, notices: 256 };
