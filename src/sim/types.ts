import type { CoreTileType, CoreTerrainKnobs, SideId, Sq, UnitId } from "../types/core-types.ts";
import type { Clock } from "../core/clock/index.ts";
import type { Grid } from "../core/grid/index.ts";
import type { Units, UnitState } from "../core/unit/index.ts";
import type { BusLimits, EventBus } from "../core/events/index.ts";
import type { MatchLimits } from "../core/limits.ts";
import type { Action, CommandLog } from "../core/log/index.ts";
import type { Rng, RngState } from "../core/rng/index.ts";
import type { Notice } from "../core/notice.ts";
import type { Event, Outcome, Phase } from "../state/index.ts";
import type { FuseSetting } from "../rules/turns/fuse.ts";
import type { GestureOptions, Intent } from "../runtime/input/index.ts";
import type { StageLimits } from "../project/read/index.ts";
import type { LevelSetup, Levels, LevelsState } from "../rules/levels/index.ts";

/** Parsed JSON documents plus the host's choices. The sim never reads files, wall time or a random source. */
export type SimInput = {
  readonly manifest: unknown;
  readonly map: unknown;
  readonly stage: unknown;
  readonly tiles: readonly CoreTileType[];
  readonly terrain?: Pick<CoreTerrainKnobs, "push_into_walls">;
  readonly chosen: readonly UnitId[];
  /** The stage reader's caps (step 16), the host's choice; no defaults. */
  readonly stageLimits: StageLimits;
  /** The bus's rolling history size (step 17); absent = core's `DEFAULT_BUS_LIMITS`. */
  readonly busLimits?: BusLimits;
  /** Match caps (step 21). Absent = `DEFAULT_MATCH_LIMITS`. */
  readonly limits?: MatchLimits;
  /** Levelling with a pick of abilities (step 18): absent = off (no XP, no offers, no draws, snapshots as before). */
  readonly levels?: LevelSetup;
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
  readonly limits: MatchLimits;
  readonly levels: Levels | null;
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
  readonly levels?: LevelsState;
};

/** M6: the AI is a hook with no phase parameter; it returns the same actions a player would submit. */
export type Budget = { readonly kind: "side" | "unit"; readonly units: readonly string[] };
export type AiHook = (world: SimWorld, side: SideId, budget: Budget) => readonly Action[];
/** Pluggable end rule (the sim holds no game rules): `Outcome` is from `sides[0]`'s view; null = play on. */
export type VictoryRule = (world: SimWorld, at: { readonly round: number; readonly side: SideId }) => Outcome | null;

export type MatchOptions = {
  readonly sides: readonly SideId[];
  /** @deprecated Step 14: the M6 action hook, kept only for unseated sides (the step-09b tests and the parity test) until a ruling retires it. Bots send intents through `seats`. Required unless every side is seated. */
  readonly ai?: AiHook;
  readonly victory: VictoryRule;
  readonly fuse: FuseSetting;
  readonly maxRounds: number;
  readonly maxSimMs: number;
  /** Sides played through the player driver (intents in, submit out); `ai` is not asked for a seated side. */
  readonly seats?: readonly Seat[];
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
/** Step 18: the level pick, fed through the same door; `index` points into the bar's pending offer. `unitId` names the bar under
 *  `bar: "unit"`; under "side" the bar is the seat's own side and `unitId` is not read. */
export type ChooseAbility = { readonly type: "ChooseAbility"; readonly index: number; readonly unitId?: string }; export type DoorIntent = Intent | ChooseAbility;
/** The one door: every move arrives as an intent (touch, bot, chaos player, a later online peer). */
export type IntentInput = { readonly intent: DoorIntent; readonly aim?: Sq | null };
export type IntentHook = (world: SimWorld, side: SideId, budget: Budget) => readonly IntentInput[];
/** Caller inputs, no defaults: the seated side, the move duration (null = instant) and the action id source. */
export type PlayerOptions = { readonly side: SideId; readonly moveMs: number | null; readonly nextId: () => string };
export type PlayerReject = "noEvent" | "illegal" | "noUnit" | "notOwn" | "offGrid" | "noAction" | "malformed" | "disposed" | "noOffer" | "badPick";
export type PlayerStep = {
  readonly intent: DoorIntent;
  readonly aim: Sq | null;
  readonly tick: number;
  readonly from: Phase;
  readonly event: Event | null;
  readonly action: Action | null;
  readonly reject: PlayerReject | null;
};
export type Player = {
  readonly side: SideId;
  feed(intent: DoorIntent, aim?: Sq | null): PlayerStep;
  history(): readonly PlayerStep[];
};
export type Seat = {
  readonly player: Player;
  readonly intents: IntentHook;
  /** Called after each input is fed and, for a move, landed: invariant checks and per-step snapshot hashes hang here. */
  readonly onStep?: (step: PlayerStep, world: SimWorld) => void;
};
/** Chaos harness (step 12): the eight snapshot keys, one recorded input, and a promise checked after every step. */
export type SnapshotKey = keyof SimSnapshot;
export type ChaosMove = { readonly call: number; readonly side: SideId; readonly tick: number; readonly intent: DoorIntent; readonly aim: Sq | null };
/** `prev` = after the last step; `before` / `fed` = just before / after the feed; `after` = after landing. */
export type ChaosView = { readonly step: PlayerStep; readonly prev: SimSnapshot; readonly before: SimSnapshot; readonly fed: SimSnapshot; readonly after: SimSnapshot; readonly world: SimWorld };
export type ChaosFinding = { readonly key: SnapshotKey; readonly expected: unknown; readonly actual: unknown };
export type ChaosCheck = { readonly id: string; readonly run: (view: ChaosView) => ChaosFinding | null };
/** Caller inputs, no defaults: the end rule, the promises, the hash (sha256 is the caller's), the build. */
export type ChaosTools = { readonly victory: VictoryRule; readonly checks: readonly ChaosCheck[]; readonly hash: (text: string) => string; readonly engineSha: string; readonly node: string };
export type ChaosSettings = {
  readonly sides: readonly SideId[];
  readonly fuse: FuseSetting;
  readonly maxRounds: number;
  readonly maxSimMs: number;
  readonly moveMs: number | null;
  readonly idPrefix: string;
  /** The caller's JSON settings for the run (e.g. the BTF FxOptions preset), copied into the record as-is. */
  readonly presets: Readonly<Record<string, unknown>>;
};
export type ChaosOptions = ChaosTools & ChaosSettings & { readonly ruleset: string | null; readonly intents: IntentHook };
/** Plain JSON: enough to replay the run without the original process (outline §4). */
export type ChaosRun = {
  readonly seed: number;
  readonly ruleset: string | null;
  readonly options: ChaosSettings & { readonly checks: readonly string[] };
  readonly moves: readonly ChaosMove[];
  readonly engineSha: string;
  readonly node: string;
  readonly engineVersion: string;
  readonly projectHash: string;
};
export type ChaosRecord = ChaosRun & {
  readonly stepIndex: number;
  readonly invariant: string;
  readonly firstDivergentSnapshotKey: SnapshotKey;
  readonly expected: unknown;
  readonly actual: unknown;
  readonly tick: number;
  readonly clockMs: number;
  readonly snapshotHash: string;
};
export type ChaosResult = { readonly outcome: MatchResult["outcome"] | "failed"; readonly run: ChaosRun; readonly failure: ChaosRecord | null; readonly hashes: readonly string[]; readonly rejects: readonly number[] };
/** Chaos generators (step 13): the input kinds, their weights (no defaults), the generator's JSON settings, and a shrink result. */
export type ChaosKind = "legal" | "stall" | "offGrid" | "foreign" | "taken" | "cancel" | "confirm" | "box" | "gesture";
export type ChaosMix = Readonly<Record<ChaosKind, number>>;
/** `stream`: the generator's own `streamSeed(world.seed, stream)`; `burst`: most repeats in a spam batch; `gestures`: null = no gesture kind. */
export type ChaosGen = { readonly stream: string; readonly mix: ChaosMix; readonly burst: number; readonly gestures: GestureOptions | null };
export type ChaosGenOptions = Omit<ChaosOptions, "intents"> & { readonly gen: ChaosGen; readonly legal: IntentHook };
export type ChaosShrink = { readonly record: ChaosRecord; readonly tries: number };

/** Hostile wires through the one door (step 15), plus `pick` last (step 19). Report-only. */
export type ExploitKind = "legal" | "foreign" | "ghost" | "smuggle" | "cell" | "phase" | "replay" | "junk" | "shape" | "pick";
export type ExploitGen = { readonly stream: string; readonly mix: Readonly<Record<ExploitKind, number>> };
export type ExploitOptions = Omit<ChaosOptions, "intents"> & { readonly gen: ExploitGen; readonly legal: IntentHook };
export type ExploitWire = { readonly call: number; readonly side: SideId; readonly wire: readonly string[] };
export type ExploitRun = { readonly seed: number; readonly gen: ExploitGen; readonly options: ChaosSettings; readonly wires: readonly ExploitWire[]; readonly engineSha: string; readonly node: string; readonly checks: readonly string[] };
export type ExploitFailure = { readonly invariant: string; readonly detail: string };
export type ExploitResult = { readonly outcome: ChaosResult["outcome"]; readonly run: ExploitRun; readonly steps: number; readonly rejects: number; readonly hashes: readonly string[]; readonly failure: ExploitFailure | null };
export type DocKind = "manifest" | "map" | "stage";
/** `value`: JSON text set at `path` (null = delete the key). */
export type DocMutation = { readonly doc: DocKind; readonly path: readonly (string | number)[]; readonly value: string | null };
/** Caller inputs, no defaults: loop-driving keys and their cap, the deep-value depth, the map size and roster for placements. */
export type DocCaps = { readonly countKeys: readonly string[]; readonly maxCount: number; readonly depth: number; readonly map: { readonly cols: number; readonly rows: number }; readonly chosen: readonly string[]; readonly limits: StageLimits };
export type DocFinding = DocMutation & ExploitFailure & { readonly seed: number };
export type DocReport = { readonly tries: number; readonly accepted: number; readonly refused: number; readonly findings: readonly DocFinding[] };

