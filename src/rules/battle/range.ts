import type { Sq } from "../../types/core-types.ts";
export type ReachTable = Readonly<Record<string, number>>;
/** Orthogonal only, Manhattan 1..reach. towerStrike.ts:103-109 (`diagonal = false`). Own-key reach; missing, foreign, or not an integer ≥ 1 → 1. */
export function inOrthogonalReach(from: Sq, to: Sq, reach: number): boolean {
  const dc = Math.abs(from.c - to.c), dr = Math.abs(from.r - to.r), d = dc + dr;
  return (dc === 0 || dr === 0) && d >= 1 && d <= reach;
}
export function reachOf(table: ReachTable | undefined, id: string): number { const n = table !== undefined && Object.hasOwn(table, id) ? table[id] : 1; return typeof n === "number" && Number.isInteger(n) && n >= 1 ? n : 1; }
