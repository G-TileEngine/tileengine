import type { Sq } from "../../types/core-types.ts";
import type { FxOptions } from "./types.ts";

const sweep = [-1, 0, 1];
export function pickLanding(target: Sq, from: Sq, neighbours: FxOptions["landing_neighbours"], canLand: (at: Sq) => boolean): Sq | null {
  let best: Sq | null = null;
  let bestSteps = 0;
  for (const dc of sweep) for (const dr of sweep) {
    if (dc === 0 && dr === 0) continue;
    if (neighbours === "four" && dc !== 0 && dr !== 0) continue;
    const at = { c: target.c + dc, r: target.r + dr };
    if (!canLand(at)) continue;
    const steps = Math.abs(at.c - from.c) + Math.abs(at.r - from.r);
    if (best === null || steps < bestSteps) { best = at; bestSteps = steps; }
  }
  return best;
}
