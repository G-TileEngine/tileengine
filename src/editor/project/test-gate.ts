import type { ReportRow } from "../../project/load/types.ts";

/** Hard codes from S1 §8, one sentence each. Warnings are not in this table. */
const SAY: Readonly<Record<string, string>> = {
  brokenRef: "Stage 1 points at a map that's missing",
  invalidValue: "One value is the wrong kind of data",
  terrainLength: "The terrain list is a different length than the map",
  formatNewer: "Made with a newer TileEngine. Open only.",
  formatOlder: "This file is from an older TileEngine and can't be played.",
  notAProject: "Can't open: project.json missing",
};
export const sentence = (row: ReportRow): string => SAY[row.code] ?? `Can't play: ${row.code}`;
export type TestGate = { readonly allowed: true } | { readonly allowed: false; readonly lines: readonly string[] };
/** Hard rows block. Warnings do not. A read-only load blocks even when the report is empty. */
export function testGate(report: readonly ReportRow[], readOnly: boolean): TestGate {
  const lines = report.filter((row) => row.severity === "hard").map(sentence);
  if (!readOnly && lines.length === 0) return { allowed: true };
  return { allowed: false, lines: lines.length > 0 ? lines : [SAY["formatNewer"] ?? "Made with a newer TileEngine. Open only."] };
}
