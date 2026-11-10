import type { CoreTileType, CoreTerrainKnobs, UnitId } from "../types/core-types.ts";
import type { Clock } from "../core/clock/index.ts";
import type { Grid } from "../core/grid/index.ts";
import type { Units, UnitState } from "../core/unit/index.ts";
import type { EventBus } from "../core/events/index.ts";
import type { CommandLog } from "../core/log/index.ts";
import type { Rng, RngState } from "../core/rng/index.ts";
import type { Notice } from "../core/notice.ts";

/** Parsed JSON documents plus the host's choices. The sim never reads files, wall time or a random source. */
export type SimInput = {
  readonly manifest: unknown;
  readonly map: unknown;
  readonly stage: unknown;
  readonly tiles: readonly CoreTileType[];
  readonly terrain?: Pick<CoreTerrainKnobs, "push_into_walls">;
  readonly chosen: readonly UnitId[];
  readonly hostSeed: number;
  readonly engineVersion: string;
  readonly projectHash: string;
};

export type SimWorld = {
  readonly seed: number;
  readonly clock: Clock;
  readonly grid: Grid;
  readonly units: Units;
  readonly bus: EventBus;
  readonly log: CommandLog;
  readonly rng: Rng;
  readonly notices: Notice[];
};

/** Plain JSON. In-flight actions (pending clock timers) are not in it: restore() replays the log to rebuild them. */
export type SimSnapshot = {
  readonly tick: number;
  readonly clockMs: number;
  readonly rngState: RngState;
  readonly units: readonly UnitState[];
  readonly occupancy: readonly (readonly [number, readonly string[]])[];
  readonly logSeq: number;
};
