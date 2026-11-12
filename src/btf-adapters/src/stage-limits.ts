import { DEFAULT_DOC_LIMITS, type StageLimits } from "../../project/read/index.ts";

/** BTF stage caps (CEO-approved 2026-11-12: 144 entries per pool or wave, 1,024 stages). */
export const BTF_STAGE_LIMITS: StageLimits = Object.freeze({ picks: 144, waveUnits: 144, side: 64, objects: 1024, edges: 16384, footprint: 8, spots: 144, waves: 256, turn0: 144, text: 128, notices: 256, stages: DEFAULT_DOC_LIMITS.stages });
