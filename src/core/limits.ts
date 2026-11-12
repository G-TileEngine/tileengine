export type MatchLimits = { readonly entries: number; readonly ticks: number; readonly durationMs: number; readonly text: number; readonly notices: number };

export const MATCH_CEILINGS: MatchLimits = Object.freeze({ entries: 1048576, ticks: 2147483647, durationMs: 2147483647, text: 1024, notices: 2147483647 });
export const DEFAULT_MATCH_LIMITS: MatchLimits = Object.freeze({ entries: 2048, ticks: 131072, durationMs: 16384, text: 128, notices: 2048 });
export const SEED_MAX = 4294967295, INT_MAX = 2147483647;
export const PLAIN_NODES = 1048576, PLAIN_DEPTH = 32;

const KEYS = ["entries", "ticks", "durationMs", "text", "notices"] as const;

export function withinCeilings(limits: unknown): limits is MatchLimits {
  if (typeof limits !== "object" || limits === null) return false;
  const row = limits as Record<string, unknown>;
  return KEYS.every((key) => { const v = row[key]; return typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= MATCH_CEILINGS[key]; });
}
