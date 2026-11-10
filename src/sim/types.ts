import type { CoreTileType, CoreTerrainKnobs, SideId, UnitId } from "../types/core-types.ts";
import type { Clock } from "../core/clock/index.ts";
import type { Grid } from "../core/grid/index.ts";
import type { Units, UnitState } from "../core/unit/index.ts";
import type { EventBus } from "../core/events/index.ts";
import type { Action, CommandLog } from "../core/log/index.ts";
import type { Rng, RngState } from "../core/rng/index.ts";
import type { Notice } from "../core/notice.ts";
import type { Event, Outcome, Phase } from "../state/index.ts";
import type { FuseSetting } from "../rules/turns/fuse.ts";

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
  /** Driver state, replaced whole (never written per key): `{ battle }` from step 09b. Not in the log. */
  phases: Readonly<Record<string, Phase>>;
};

/** Plain JSON. In-flight actions (pending clock timers) are not in it: restore() replays the log to rebuild them. */
export type SimSnapshot = {
  readonly tick: number;
  readonly clockMs: number;
  readonly rngState: RngState;
  readonly units: readonly UnitState[];
  readonly occupancy: readonly (readonly [number, readonly string[]])[];
  readonly phases: Readonly<Record<string, Phase>>;
  readonly logSeq: number;
};

/** M6: the AI is a hook with no phase parameter; it returns the same actions a player would submit. */
export type Budget = { readonly kind: "side" | "unit"; readonly units: readonly string[] };
export type AiHook = (world: SimWorld, side: SideId, budget: Budget) => readonly Action[];
/** Pluggable end rule (the sim holds no game rules): `Outcome` is from `sides[0]`'s view; null = play on. */
export type VictoryRule = (world: SimWorld, at: { readonly round: number; readonly side: SideId }) => Outcome | null;

export type MatchOptions = {
  readonly sides: readonly SideId[];
  readonly ai: AiHook;
  readonly victory: VictoryRule;
  readonly fuse: FuseSetting;
  readonly maxRounds: number;
  readonly maxSimMs: number;
};
/** Tick driver: the AI is asked every `everyMs` (a whole number of steps; e.g. 100) for its idle units. */
export type TickOptions = {
  readonly sides: readonly SideId[];
  readonly ai: AiHook;
  readonly victory: VictoryRule;
  readonly everyMs: number;
  readonly maxSimMs: number;
};
export type MatchResult = {
  readonly outcome: Outcome | "timeout";
  readonly rounds: number;
  readonly events: readonly Event[];
};
