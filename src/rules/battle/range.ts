import type { Sq } from "../../types/core-types.ts";

export type ReachTable = Readonly<Record<string, number>>;
/** Orthogonal only, Manhattan 1..reach. towerStrike.ts:103-109 (`diagonal = false`). */
export function inOrthogonalReach(from: Sq, to: Sq, reach: number): boolean {
  const dc = Math.abs(from.c - to.c), dr = Math.abs(from.r - to.r);
  if (dc !== 0 && dr !== 0) return false;
  const d = dc + dr;
  return d >= 1 && d <= reach;
}
/** Own keys only. Missing table, a foreign key, or a value that is not an integer ≥ 1 → 1. */
export function reachOf(table: ReachTable | undefined, id: string): number {
  if (table === undefined || !Object.hasOwn(table, id)) return 1;
  const n = table[id];
  return typeof n === "number" && Number.isInteger(n) && n >= 1 ? n : 1;
}
