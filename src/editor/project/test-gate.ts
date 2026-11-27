import type { ReportRow } from "../../project/load/types.ts";
import { LIMITS, PLAY_LIMITS } from "../../project/load/index.ts";
import { readStage } from "../../project/read/index.ts";

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
export function budgetLine(budget: string, stage: string, used: number, limit: number, w?: number, h?: number): string {
  if (budget === "units") return `${stage}: ${used} units. The limit is ${limit}. Remove some units.`;
  if (budget === "activeAi") return `${stage}: ${used} units take AI turns. The limit is ${limit}. Remove some or put them on your team.`;
  if (budget === "effects") return `${stage}: ${used} effects. The limit is ${limit}. Remove some effects.`;
  if (budget === "stageTiles") return `${stage} is ${w} × ${h} tiles. The limit is ${limit} tiles. Make the map smaller.`;
  return `Can't play: budgetOver ${budget}`;
}
const OVER = /"budget":"([^"]+)","used":(\d+),"limit":(\d+)(?:,\"w\":(\d+),\"h\":(\d+))?/;
export function overLine(row: ReportRow, names: Readonly<Record<string, string>>): string {
  const found = /^stages\/([^/]+)\.json#$/.exec(row.path);
  const id = found?.[1] ?? "";
  const stage = names[id] ?? id;
  const hit = OVER.exec(row.detail ?? "");
  if (hit === null) return "Can't play: budgetOver";
  return budgetLine(hit[1] ?? "", stage, Number(hit[2]), Number(hit[3]), hit[4] === undefined ? undefined : Number(hit[4]), hit[5] === undefined ? undefined : Number(hit[5]));
}
export function stageNames(load: { readonly project: { readonly stages: Readonly<Record<string, Readonly<Record<string, unknown>>>> } | null }): Readonly<Record<string, string>> {
  const names: Record<string, string> = {};
  const stages = load.project === null ? undefined : load.project.stages;
  if (stages === undefined) return names;
  for (const [id, stage] of Object.entries(stages)) names[id] = typeof stage["name"] === "string" ? stage["name"] : id;
  return names;
}
export const poolLine = (stage: string): string => `${stage}: enemies picked at random or sent in waves can't be played yet. Use a fixed enemy list.`;
export function poolLines(load: { readonly project: { readonly stages: Readonly<Record<string, Readonly<Record<string, unknown>>>> } | null }): readonly string[] {
  const lines: string[] = [];
  const stages = load.project === null ? undefined : load.project.stages;
  if (stages === undefined) {
    return lines;
  }
  const names = stageNames(load);
  for (const [id, stage] of Object.entries(stages)) {
    const readerOk = readStage(stage, LIMITS).ok;
    const playOk = readStage(stage, PLAY_LIMITS).ok;
    if (readerOk && !playOk) {
      lines.push(poolLine(names[id] ?? id));
    }
  }
  return lines;
}
/** Hard rows block. Warnings do not. A read-only load blocks even when the report is empty. */
export function testGate(report: readonly ReportRow[], readOnly: boolean, names: Readonly<Record<string, string>> = {}, more: readonly string[] = []): TestGate {
  const lines = report.filter((row) => row.severity === "hard").map((row) => (row.code === "budgetOver" ? overLine(row, names) : sentence(row))).concat(more);
  if (!readOnly && lines.length === 0) return { allowed: true };
  return { allowed: false, lines: lines.length > 0 ? lines : [SAY["formatNewer"] ?? "Made with a newer TileEngine. Open only."] };
}
