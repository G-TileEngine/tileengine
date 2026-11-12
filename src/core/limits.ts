export type MatchLimits = { readonly entries: number; readonly ticks: number; readonly durationMs: number; readonly text: number; readonly notices: number; readonly bytes?: number };

export const MATCH_CEILINGS: MatchLimits = Object.freeze({ entries: 1048576, ticks: 2147483647, durationMs: 2147483647, text: 1024, notices: 2147483647 });
export const DEFAULT_MATCH_LIMITS: MatchLimits = Object.freeze({ entries: 2048, ticks: 131072, durationMs: 16384, text: 128, notices: 2048 });
export const SEED_MAX = 4294967295, INT_MAX = 2147483647;
export const PLAIN_NODES = 1048576, PLAIN_DEPTH = 32;
export const TEXT_BYTES = 2097152, TEXT_BYTES_MAX = 16777216;
export const textBytes = (limits: { readonly bytes?: number }): number => limits.bytes ?? TEXT_BYTES;

const KEYS = ["entries", "ticks", "durationMs", "text", "notices"] as const;

export function withinCeilings(limits: unknown): limits is MatchLimits {
  if (typeof limits !== "object" || limits === null) return false;
  const row = limits as Record<string, unknown>, bytes = row.bytes;
  const sized = bytes === undefined || (typeof bytes === "number" && Number.isInteger(bytes) && bytes >= 1 && bytes <= TEXT_BYTES_MAX);
  return sized && KEYS.every((key) => { const v = row[key]; return typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= MATCH_CEILINGS[key]; });
}
export function textOver(text: string, bytes: number, depth = PLAIN_DEPTH): "bytes" | "depth" | null {
  if (text.length > bytes) return "bytes";
  let n = 0, str = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (str) { if (c === "\\") i += 1; else if (c === "\"") str = false; continue; }
    if (c === "\"") { str = true; continue; }
    if (c === "{" || c === "[") { n += 1; if (n > depth) return "depth"; }
    else if ((c === "}" || c === "]") && n > 0) n -= 1;
  }
  return null;
}