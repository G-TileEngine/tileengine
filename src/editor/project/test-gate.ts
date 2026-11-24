import type { ReportRow } from "../../project/load/types.ts";

/** Hard codes from S1 §8, one sentence each. Warnings are not in this table. */
const SAY: Readonly<Record<string, string>> = {
  brokenRef: "Stage 1 points at a map that's missing",
  invalidValue: "One value is the wrong kind of data",
  terrainLength: "The terrain list is a different length than the map",
  formatNewer: "Made with a newer TileEngine. Open only.",
  formatOlder: "This file is from an older TileEngine and can't be played.",
  notAProject: "Can't open: project.json missing",
  "play: seed": "Stage 1 has no seed yet, so it can't be played",
  "play: army": "This project has no unit roster yet, so it can't be played",
  assetFileMissing: "A picture this project uses is missing",
  assetHashMismatch: "A picture this project uses doesn't match its file",
};
export const sentence = (row: ReportRow): string => { const line = SAY[row.code] ?? `Can't play: ${row.code}`; return row.code.startsWith("asset") ? `${line}: ${row.path}` : line; };
/** Map a play-stage throw (`play: seed`, `play: army`) onto the sheet sentence. Other text stays as written. */
export const playLine = (error: string): string => { const line = SAY[error]; if (line !== undefined) return line; return error === "" ? "Can't play this project" : error; };
const placed = (v: unknown): number => (Array.isArray(v) ? v.filter((row) => typeof row === "object" && row !== null && !Array.isArray(row)).length : 0);
/** No team unit on a start tile, no NPC and no enemy. One side only still plays. */
export const emptyBoard = (docs: { readonly stage: unknown; readonly chosen?: readonly string[] }): boolean => { const stage = docs.stage; if (typeof stage !== "object" || stage === null) return true; const doc = stage as Record<string, unknown>, pool = doc["enemyPool"]; return Math.min(docs.chosen?.length ?? 0, placed(doc["playerSpawns"])) === 0 && placed(doc["neutrals"]) === 0 && placed(typeof pool === "object" && pool !== null ? (pool as Record<string, unknown>)["entries"] : undefined) === 0; };
export type TestGate = { readonly allowed: true } | { readonly allowed: false; readonly lines: readonly string[] };
/** Hard rows block. Warnings do not. A read-only load blocks even when the report is empty. */
export function testGate(report: readonly ReportRow[], readOnly: boolean): TestGate {
  const lines = report.filter((row) => row.severity === "hard").map(sentence);
  if (!readOnly && lines.length === 0) return { allowed: true };
  return { allowed: false, lines: lines.length > 0 ? lines : [SAY["formatNewer"] ?? "Made with a newer TileEngine. Open only."] };
}
