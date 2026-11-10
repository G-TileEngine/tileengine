import type { CoreEventMap, CoreTerrainKnobs, Facing, OccupancyPolicy, ResolvedPlacement, SideId, Sq, UnitId } from "../../types/core-types.ts";
import type { Dir } from "../grid/types.ts";
import type { Notice } from "../notice.ts";

/** Sub-cell draw offset in tile fractions (M3). Never changes occupancy. */
export type Offset = { readonly dx: number; readonly dy: number };

export type UnitState = {
  readonly id: string;          // instance id: `${unitId}#${n}`, n = 1, 2, … in placement order
  readonly unitId: UnitId;     // DSK's unit document id (units/<id>.json)
  readonly side: SideId;
  readonly at: Sq;
  readonly offset: Offset | null;
  readonly facing: Facing | null;
  readonly alive: boolean;
};

/** From DSK's CoreEventMap (core-types.ts); never redefined here. */
export type LandCause = CoreEventMap["landedOn"]["cause"];
export type PushBlocker = CoreEventMap["pushBlocked"]["blocker"];

export type UnitHooks = {
  readonly landed?: (unit: string, cell: Sq, cause: LandCause) => void;
  readonly pushBlocked?: (unit: string, blocker: PushBlocker, cellsRemaining: number) => void;
};

export type PlaceResult = { readonly ok: true; readonly id: string } | { readonly ok: false; readonly notice: Notice };
export type MoveFail = "unknownUnit" | "notAlive" | "outOfBounds" | "closed" | "occupied";
export type MoveResult = { readonly ok: true; readonly at: Sq } | { readonly ok: false; readonly reason: MoveFail };
export type PushResult = {
  readonly moved: number;
  readonly at: Sq;
  readonly blocker: PushBlocker | null;
  readonly cellsRemaining: number;
};

/** How an occupancy policy (core-types `OccupancyPolicy`, MODES-v2 B3) decides who may share a cell.
 *  v1 implements strict1 only. Independent of any rule, no unit ever stands on a cell that is not open. */
export interface OccupancyRule {
  readonly id: OccupancyPolicy;
  canHold(unit: UnitState, occupants: readonly UnitState[]): boolean;
}

export type UnitsOptions = {
  readonly hooks?: UnitHooks;
  readonly occupancy?: OccupancyPolicy;                                   // default "strict1"
  readonly terrain?: Pick<CoreTerrainKnobs, "push_into_walls">;          // default { push_into_walls: false }
};

export interface Units {
  readonly occupancy: OccupancyPolicy;
  readonly notices: readonly Notice[];
  place(p: ResolvedPlacement): PlaceResult;
  get(id: string): UnitState | undefined;
  all(): readonly UnitState[];
  occupantAt(at: Sq): string | undefined;
  occupantsAt(at: Sq): readonly string[];
  moveTo(id: string, to: Sq, cause?: "move" | "warp"): MoveResult;
  push(id: string, dir: Dir, cells: number): PushResult;
  setOffset(id: string, offset: Offset | null): boolean;
  setFacing(id: string, facing: Facing | null): boolean;
  remove(id: string): boolean;
}

/** Who a moving unit may pass through. It may never END on an occupied cell. */
export type PassThrough = "none" | "allies" | "all";
