import type { Sq } from "../../types/core-types.ts";
import type { Grid } from "../grid/types.ts";
import type { PassThrough, Units } from "./types.ts";

export function reach(grid: Grid, units: Units, id: string, maxSteps: number, pass: PassThrough = "allies"): readonly Sq[] {
  const self = units.get(id);
  if (!self?.alive) return [];
  const blocked = (at: Sq): boolean => {
    if (pass === "all") return false;
    for (const oid of units.occupantsAt(at)) {
      if (oid === id) continue;
      const other = units.get(oid);
      if (other?.alive && (pass === "none" || other.side !== self.side)) return true;
    }
    return false;
  };
  const out: Sq[] = [];
  for (const index of grid.reachable(self.at, maxSteps, blocked).keys()) {
    const at = grid.sqAt(index);
    const taken = units.occupantsAt(at).some((oid) => oid !== id && units.get(oid)?.alive === true);
    if (!taken) out.push(at);
  }
  return out;
}
