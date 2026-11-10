import type { Sq } from "../../types/core-types.ts";

const cols = 6;
const rows = 3;
const lanes = cols * rows;
export function laneIdToSq(id: number): Sq | null {
  if (!Number.isInteger(id) || id < 1 || id > lanes) return null;
  const n = id - 1;
  return { c: Math.floor(n / rows), r: n % rows };
}
export function sqToLaneId(at: Sq): number | null {
  if (!Number.isInteger(at.c) || !Number.isInteger(at.r) || at.c < 0 || at.r < 0 || at.c >= cols || at.r >= rows) return null;
  return at.c * rows + at.r + 1;
}
