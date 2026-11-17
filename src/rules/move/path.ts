import type { Sq } from "../../types/core-types.ts";
import { DIRS } from "../../core/grid/index.ts";
import type { Grid } from "../../core/grid/index.ts";
import type { Units } from "../../core/unit/index.ts";

const bodyAt = (units: Units, at: Sq, id: string): boolean => units.occupantsAt(at).some((oid) => oid !== id && units.get(oid)?.alive === true);

export function walks(grid: Grid, units: Units, id: string, reach: number): Map<number, Sq[]> {
  const out = new Map<number, Sq[]>(), self = units.get(id);
  if (self === undefined || !self.alive) return out;
  for (const dir of DIRS) {
    const path: Sq[] = [];
    let at = self.at;
    for (let step = 0; step < reach; step += 1) {
      if (!grid.canStep(at, dir)) break;
      const next = grid.step(at, dir);
      if (next === null || bodyAt(units, next, id)) break;
      path.push(next);
      out.set(grid.index(next), path.slice());
      at = next;
    }
  }
  return out;
}

export function reachCells(grid: Grid, units: Units, id: string, reach: number): Sq[] {
  const ends: Sq[] = [];
  for (const path of walks(grid, units, id, reach).values()) { const end = path.at(-1); if (end !== undefined) ends.push(end); }
  return ends.sort((a, b) => a.r - b.r || a.c - b.c);
}

export function walkTo(grid: Grid, units: Units, id: string, reach: number, to: Sq): Sq[] | null {
  if (!grid.inBounds(to)) return null;
  return walks(grid, units, id, reach).get(grid.index(to)) ?? null;
}
