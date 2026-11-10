import type { CoreTileType, Sq } from "../../types/core-types.ts";
import type { Notice } from "../notice.ts";

export type Dir = "n" | "e" | "s" | "w";
export const DIRS: readonly Dir[] = ["n", "e", "s", "w"];
export type GridOptions = { readonly wrapEdges?: boolean };

/** Why forced movement can't enter the next cell. 'edge' = an edge wall or the map border. */
export type ForceBlock = "edge" | "wall-block";
export type ForceCheck = { readonly ok: true } | { readonly ok: false; readonly blocker: ForceBlock };

export interface Grid {
  readonly cols: number;
  readonly rows: number;
  readonly notices: readonly Notice[];
  inBounds(at: Sq): boolean;
  index(at: Sq): number;
  sqAt(index: number): Sq;
  tileTypeAt(at: Sq): CoreTileType;
  isOpen(at: Sq): boolean;
  hasWall(at: Sq, dir: Dir): boolean;
  step(at: Sq, dir: Dir): Sq | null;
  canStep(at: Sq, dir: Dir): boolean;
  canForceInto(at: Sq, dir: Dir): ForceCheck;
  neighbours(at: Sq): readonly Sq[];
  reachable(from: Sq, maxSteps: number, isBlocked?: (at: Sq) => boolean): ReadonlyMap<number, number>;
}
