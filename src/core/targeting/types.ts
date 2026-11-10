import type { Sq } from "../../types/core-types.ts";

/** UNIT pipe: follows a living body. `fallbackAt` (Gale-style) is still UNIT: used only when the id is dead. */
export type UnitAim = { readonly pipe: "unit"; readonly unitId: string; readonly fallbackAt?: Sq };
/** Edge of a cell for edge targets (ruling 2026-11-09): N = r-1, E = c+1, S = r+1, W = c-1 (CoreEdge's n/e/s/w). */
export type EdgeSide = "N" | "E" | "S" | "W";
/** TILE pipe: a cell fixed at cast, optionally one of its edges. Never retargets. */
export type TileAim = { readonly pipe: "tile"; readonly at: Sq; readonly edge?: EdgeSide };
export type Aim = UnitAim | TileAim;

export type Resolution =
  | { readonly hit: true; readonly unitId: string; readonly at: Sq }
  | { readonly hit: false; readonly reason: "dead" | "empty" | "offMap" };

export type RosterEntry = { readonly id: string; readonly at: Sq };

/** What a resolve step gets. No target = no pipe: `aim` and `resolution` are null and only the caster is passed. */
export type ResolveContext = { readonly caster: string; readonly aim: Aim | null; readonly resolution: Resolution | null };
