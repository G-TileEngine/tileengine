import type { SideId, Sq } from "../../types/core-types.ts";
import { DIRS } from "../../core/grid/index.ts";
import type { Grid } from "../../core/grid/index.ts";
import type { Units } from "../../core/unit/index.ts";
import { aimUnit, resolveAim } from "../../core/targeting/index.ts";

export type TapTarget = { readonly id: string; readonly unitId: string; readonly side: SideId; readonly at: Sq };

export function targetsFor(grid: Grid, units: Units, id: string): TapTarget[] {
  const self = units.get(id);
  if (self === undefined || !self.alive) return [];
  const found: TapTarget[] = [];
  for (const dir of DIRS) {
    const next = grid.step(self.at, dir);
    if (next === null) continue;
    for (const oid of units.occupantsAt(next)) {
      if (oid === id) continue;
      const hit = resolveAim(aimUnit(oid), units, grid);
      if (!hit.hit) continue;
      const body = units.get(hit.unitId);
      if (body === undefined || !body.alive) continue;
      found.push({ id: body.id, unitId: body.unitId, side: body.side, at: body.at });
    }
  }
  return found.sort((a, b) => a.at.r - b.at.r || a.at.c - b.at.c);
}
