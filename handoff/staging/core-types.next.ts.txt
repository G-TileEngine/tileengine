// core-types.ts: minimal READ-ONLY types for the engine core steps
// (clock, grid + edges, unit + occupancy, events/command log, rng, state tables).
// Target location: packages/project/src/types (core subset). This file is the single source for these core types.
//
// Source of truth: project-format r14 and setup-format r14 (catalogue rev 17; MODES-v2 items PROPOSED) (/workspace/tileengine/data). Every field name here
// exists in those docs (project-format §16 TS sketch; setup-format §9 TS). Nothing is invented. Where the core needs
// something the format doesn't hold, it's listed as a GAP at the bottom, never added as a field.
//
// Excluded on purpose: rules fields (overrides, difficulty, stats, answers, presets), and all art and look fields
// (layers, background, tile, wallLook, Edge.look, assets, paint styles, objects' assetId/blocks_los/blocks_shots).
//
// Trailing tags: STABLE = fixed by the format; MAY-MOVE = defined but expected to change (pending a ruling or request).
//
// COORDINATES (project-format §6.4, setup-format §2.9.4 Sq):
//   c = column (0 = left), r = row, and r grows DOWNWARD (0 = top; paint.ts L788). Both are integers on every
//   stored cell. Grids are row-major: index i = r * cols + c, length cols * rows.
//
// VERSION RULE (project-format §12): the core reads ONLY the post-migration (current) shape. Migration is
// @te/project-write's job (openProject). A document whose formatVersion isn't the current one below must be
// rejected by the core's reader, never patched. Files newer than the app open read-only in the editor.

/** Current formatVersion per document kind, post-migration (project-format r12 §12 "Kinds"). */
export type CurrentFormatVersions = {
  readonly "tile-project": 6;      // STABLE
  readonly "map": 5;               // STABLE
  readonly "stage": 2;             // STABLE
  readonly "unit": 2;              // STABLE
  readonly "behaviour-setup": 3;   // STABLE (setup-format r12)
  readonly "deck": 1;              // MAY-MOVE: decks are PROPOSED pending the build (project-format r14 §6.8)
  readonly "audio": 1;             // MAY-MOVE (audio-format r1, PROPOSED)
};
export type CoreDocKind = keyof CurrentFormatVersions;
/** Version guard: a document is readable by the core only if its formatVersion equals the current one. */
export type VersionGuard<K extends CoreDocKind> = {
  readonly kind: K;                                   // STABLE
  readonly formatVersion: CurrentFormatVersions[K];   // STABLE
};

/** A unit document id (units/<id>.json). The one unit-id alias; every unit reference uses it. */
export type UnitId = string;   // STABLE

/** A cell. Integers only for stored cells. */
export type Sq = {
  readonly c: number;   // STABLE: column, 0-based, grows rightward
  readonly r: number;   // STABLE: row, 0-based, grows DOWNWARD
};

/** Side ids = `ability-presentation.team_colours` item ids (r13). Built-ins "player", "rival"; "neutral" is reserved
 *  (rev 13 built-in neutral #8a8f98). Users may add ids. Never inferred from facing or vice versa. */
export type SideId = "player" | "rival" | "neutral" | (string & {});   // STABLE (catalogue rev 13, L35 shipped: keyed_by "side")

/** Placement facing (project-format r13 §6.5). Absent or null = no facing → rotate_with_facing is the identity.
 *  The single mapping to clip suffixes: N = "up", E = "right", S = "down", W = "left". Only the letter is stored. */
export type Facing = "N" | "E" | "S" | "W";   // MAY-MOVE

/** A spawn cell: a plain Sq is still valid (existing Sq arrays are unchanged). */
export type SpawnSq = Sq & {
  readonly facing?: Facing | null;   // MAY-MOVE (r13)
};

// ---------------------------------------------------------------- map (maps/<id>.json, v5)

/** One wall on a tile edge (project-format §6.4 `logic.edges`).
 *  Core semantics: blocks movement, adjacency and ALL forced movement across that edge, both ways, for everyone.
 *  No knob lets anything cross an edge wall. `terrain.push_into_walls` (rev 14) only adds the pushBlocked event when a
 *  forced move meets one; the move still stops.
 *  Writer canonical form: `e` is stored as `w` of (c+1, r), and `s` as `n` of (c, r+1), when that neighbour is on the map,
 *  so only map-border walls keep e/s. The reader must accept any form; a duplicate counts once; an off-map edge is skipped. */
export type CoreEdge = {
  readonly c: number;                          // STABLE
  readonly r: number;                          // STABLE
  readonly side: "n" | "e" | "s" | "w";        // STABLE
};

/** A map object, core subset: occupancy only (project-format §6.4 `objects[]`). */
export type CoreMapObject = {
  readonly id: string;                                          // STABLE
  readonly at: Sq;                                              // STABLE (integer cell)
  readonly footprint?: { readonly w: number; readonly h: number };   // MAY-MOVE: reserved, v1 reads 1×1 always
  readonly blocks?: boolean;                                    // STABLE: default false; true = cell closed to movement,
                                                                //   adjacency and forced movement (core grid), like a not-open tile
};

export type CoreMapLogic = {
  readonly terrain: ReadonlyArray<number>;                      // STABLE: row-major, length cols*rows; small int → palette key
  readonly palette: Readonly<Record<string, string>>;           // STABLE: int (as JSON string key) → terrain.tile_types id;
                                                                //   missing key or unknown id = runs as "floor" (warning)
  readonly edges: ReadonlyArray<CoreEdge>;                      // STABLE
  readonly lanes?: ReadonlyArray<number>;                       // MAY-MOVE (r14): row-major, length cols*rows; 0 = no lane,
                                                                //   1..lane_count = lane id. Read only when lanes_enabled; absent =
                                                                //   derived bands from lane_axis/lane_count; bad value → 0, bad length → ignored
};

export type CoreMap = VersionGuard<"map"> & {
  readonly id: string;                                          // STABLE
  readonly rev: number;                                         // STABLE
  readonly cols: number;                                        // STABLE: int ≥ 1
  readonly rows: number;                                        // STABLE: int ≥ 1
  readonly logic: CoreMapLogic;                                 // STABLE: the only thing game logic reads
  readonly objects?: ReadonlyArray<CoreMapObject>;              // STABLE: absent = none
  readonly paths?: ReadonlyArray<{                              // MAY-MOVE (r14 PROPOSED): ordered routes (TD); not lanes (areas)
    readonly id: string;                                        //   unique in the map
    readonly cells: ReadonlyArray<Sq>;                          //   walk order; first = spawn end, last = exit end
    readonly contiguous?: boolean;                              //   default true: each step orthogonally adjacent (|dc|+|dr| = 1)
  }>;
};

// ---------------------------------------------------------------- tile types (terrain.tile_types answer)

/** The walkability subset of one `terrain.tile_types` list item (setup-format §2.9.1 / catalogue rev 13).
 *  Resolved per stage (stage override → project terrain setup → catalogue default); the core receives the resolved list.
 *  Reserved ids always exist: floor, fallen, flask, rising, tide, warp-mark, sword-mark, boss-cover, vines, trap,
 *  water, lava, wall-block. water/lava/wall-block are CONFIRMED (Engine Architect 2026-11-09, rev 10 + L34 values):
 *  water {open:false, push_can_enter:false}, lava {open:true, push_can_enter:true, kills_on_landing}, wall-block {open:false, push_can_enter:false}.
 *  CORE INVARIANT: no unit ever occupies a tile with open:false (placement skipped with a warning; no move ends there).
 *  kills_on_landing (rules side) fires at ANY move end (normal, forced, warp, summon), never mid-path; scope below. */
export type CoreTileType = {
  readonly id: string;                 // STABLE
  readonly open: boolean;              // STABLE: units may stand on / move through
  readonly push_can_enter: boolean;    // STABLE: forced movement may enter
};

/** The terrain knobs the core's forced-movement, landing and lane steps read (catalogue rev 10, L34; rev 14 L36, lanes). */
export type CoreTerrainKnobs = {
  readonly push_into_walls: boolean;   // STABLE: default false; "slams into walls" (rev 14). On: a forced move that meets a
                                       //   wall-block, an edge wall or a unit stops on the last open cell and the core emits
                                       //   pushBlocked (CoreEvent below). Off: it still stops short, with no event. Edge walls
                                       //   always stop the move. Damage (wall_slam_*) is push-behaviour rules, not core.
  readonly lethal_landing_scope: "any" | "forced_only";   // MAY-MOVE: shipped in catalogue rev 14 (L36, default PROPOSED);
                                       //   default "any". kills_on_landing resolves on landedOn, never on pass-overs
  readonly lanes_enabled: boolean;     // MAY-MOVE (rev 14, CoS): default false; lanes are an optional region tag
  readonly lane_axis: "row" | "column";   // MAY-MOVE (rev 14): default "row" (lanes run left to right)
  readonly lane_count: number;         // MAY-MOVE (rev 14): int 1–9, default 3; used to derive lanes when map.logic.lanes is absent
                                       //   centre lane(s): odd → (n+1)/2; even → n/2 and n/2+1; one centre needed → n/2 (EA r14)
};

// ---------------------------------------------------------------- units (units/<id>.json, v2)

export type CoreUnit = VersionGuard<"unit"> & {
  readonly id: string;                                                 // STABLE
  readonly rev: number;                                                // STABLE
  readonly footprint?: { readonly w: number; readonly h: number };     // MAY-MOVE: absent = 1×1; v1 plays 1×1 only
  // No `side` and no facing on the unit: both come from the stage (sides / placement entries), r13.
};

// ---------------------------------------------------------------- stage (stages/<id>.json, v2): placement + setup refs

export type CoreLoadout = {
  readonly roster: ReadonlyArray<UnitId>;     // STABLE: unit ids
  readonly size: number;                      // STABLE
  readonly required: ReadonlyArray<UnitId>;   // STABLE: unit ids
};

export type CoreEnemyPool =
  | { readonly mode: "fixed"; readonly entries: ReadonlyArray<{ readonly unitId: UnitId; readonly at: Sq;
      readonly facing?: Facing | null /* MAY-MOVE (r13) */ }> }                                                                   // STABLE
  | { readonly mode: "weighted"; readonly picks: number; readonly allowRepeats: boolean; readonly spawns: ReadonlyArray<SpawnSq>;
      readonly entries: ReadonlyArray<{ readonly unitId: UnitId; readonly weight: number }> }                                    // STABLE
  | { readonly mode: "waves"; readonly spawns: ReadonlyArray<SpawnSq>;
      readonly waves: ReadonlyArray<{ readonly turn: number; readonly entries: ReadonlyArray<{ readonly unitId: UnitId; readonly count: number }> }> };   // STABLE

export type CoreStage = VersionGuard<"stage"> & {
  readonly id: string;                                                          // STABLE: stage id
  readonly rev: number;                                                         // STABLE
  readonly mapRef: string;                                                      // STABLE: map id
  readonly playerSpawns: ReadonlyArray<SpawnSq>;                                // STABLE: chosen loadout units are placed here, in order;
                                                                                //   extra units (size > spawns) aren't placed
  readonly neutrals: ReadonlyArray<{
    readonly unitId: UnitId;                                                    // STABLE
    readonly at: Sq;                                                            // STABLE
    readonly facing?: Facing | null;                                            // MAY-MOVE (r13)
    readonly side?: SideId;                                                     // STABLE (r13): per-entry override of sides.neutrals
  }>;
  readonly seed?: number | null;                                                // MAY-MOVE (r13): integer; absent/null = fresh seed at play start
  readonly sides?: {                                                            // STABLE (r13): absent keys use the defaults
    readonly loadout?: SideId;                                                  //   default "player"
    readonly enemyPool?: SideId;                                                //   default "rival"
    readonly neutrals?: SideId;                                                 //   default "neutral"
  };
  readonly enemyPool: CoreEnemyPool;                                            // STABLE
  readonly loadout: CoreLoadout | null;                                         // STABLE: null = use project loadout
  readonly rules: ReadonlyArray<string>;                                        // STABLE: setup ids; replace project rules per behaviour
};

/** A setup reference, core subset: identity only. Values are read through the resolver, never from raw answers. */
export type CoreSetupRef = VersionGuard<"behaviour-setup"> & {
  readonly id: string;                                  // STABLE: setup id
  readonly behaviourId: string;                         // STABLE
  readonly catalogue: { readonly rev: number };         // STABLE: equals the project's catalogueRev inside a project
};

// ---------------------------------------------------------------- deck (decks/<id>.json, v1): MAY-MOVE (PROPOSED pending build)

/** A deck, post-migration only (project-format r14 §6.8). Read by the opening-formation step (opening_row = front). */
export type CoreDeck = VersionGuard<"deck"> & {
  readonly id: string;                                                         // MAY-MOVE: deck_<ULID>
  readonly rev: number;                                                        // MAY-MOVE
  readonly name: string;                                                       // MAY-MOVE
  readonly entries: ReadonlyArray<{
    readonly cardId: string;                                                   // MAY-MOVE: an ability-owner setup id (PROPOSED)
    readonly copies: number;                                                   // MAY-MOVE: int >= 0
  }>;
  readonly subclass?: string;                                                  // MAY-MOVE: free id; absent = any
  readonly openingFront?: ReadonlyArray<UnitId>;                               // MAY-MOVE: exactly 5, west to east (catalogue rev 17
                                                                               //   L44). No deck / missing / malformed → back + openingShapeMissing
                                                                               //   (once per deck, once in total with no deck); bad id → unknownRef,
                                                                               //   slot empty, other four placed; back/second ignore it
};

// ---------------------------------------------------------------- project (project.json, v6), core subset

/** Cell density model (MODES-v2 B3 names). strict1 = one unit per cell (tactics); softStack = path creeps may share
 *  (TD); laneSlots = formation slots per lane (idle). MAY-MOVE. */
export type OccupancyPolicy = "strict1" | "softStack" | "laneSlots";

export type CoreProject = {
  readonly id: string;                                  // STABLE
  readonly rev: number;                                 // STABLE
  readonly catalogueRev: number;                        // STABLE
  readonly settings: {
    readonly occupancy?: OccupancyPolicy;               // MAY-MOVE (r14 PROPOSED): THE single source of cell density (EA ruling;
                                                        //   unit-roster.one_unit_per_tile converts into it, L42). Absent = "strict1";
                                                        //   v1 core runs strict1 only, warns occupancyUnsupported on the others.
                                                        //   PROJECT-WIDE in v1. A per-stage override is FUTURE ONLY (not in v1; stage
                                                        //   values are kept inactive with occupancyStageValueIgnored)
    readonly wrapEdges: boolean;                        // MAY-MOVE: v1 core IGNORES it (warning wrapEdgesIgnored when true);
                                                        //   future: none | x | y | both, plus LOS and pathing across the seam
  };
  readonly stages: ReadonlyArray<string>;               // STABLE: stage ids, in order
  readonly rules: ReadonlyArray<string>;                // STABLE: project-wide setup ids (≤ 1 per behaviour)
  readonly loadout: CoreLoadout;                        // STABLE
};

export type CoreProjectManifest = VersionGuard<"tile-project"> & {
  readonly project: CoreProject;                        // STABLE
};

// ================================================================ CORE RUNTIME TYPES (not format; never stored)
// Built by the core from the format types above. Not part of any document; not written by any writer.

/** One unit as placed at match start, resolved from loadout + playerSpawns (in order), enemyPool (weighted/waves
 *  picks use the match RNG), and neutrals; side from stage.sides / neutrals[].side with the defaults
 *  player / rival / neutral. RUNTIME ONLY. */
export type ResolvedPlacement = {
  readonly unitId: UnitId;          // RUNTIME
  readonly side: SideId;            // RUNTIME
  readonly at: Sq;                  // RUNTIME: integer cell
  readonly facing: Facing | null;   // RUNTIME: null = no facing (never inferred from side)
};
/** Command kind, mirroring step-07's `Action.kind` (core-spine-slices step-07 outline): built-ins plus open strings. MAY-MOVE. */
export type ActionKind = "move" | "ability" | "wait" | (string & {});

/** Command-log sequence number: an integer >= 1, the 1-based position of an entry in the command log (append order).
 *  The save document's `logSeq` (project-format §6.9) is the LogSeq of the last applied entry, with 0 meaning none applied. */
export type LogSeq = number;

/** Minimal core events (Engine Architect, project-format r13 §6.4). RUNTIME ONLY, never stored. MAY-MOVE:
 *  the rest of the event union arrives with build step 07.
 *  Payloads of the core events, keyed by event type. Closed: only the core adds entries here (step 07 adds the rest). */
export interface CoreEventMap {
  readonly landedOn: { readonly unit: string; readonly cell: Sq;
                       readonly cause: "move" | "forced" | "warp" | "place" };              // MAY-MOVE: any move end; kills_on_landing resolves here
  readonly pushBlocked: { readonly unit: string; readonly blocker: "wall-block" | "edge" | "unit";
                          readonly cellsRemaining: number };                                // MAY-MOVE: emitted only with push_into_walls on
  readonly enteredLane: { readonly unit: string; readonly lane: number };                   // MAY-MOVE (rev 14): lanes_enabled, move ends in another lane
  readonly actionLogged: { readonly seq: LogSeq; readonly kind: ActionKind;
                           readonly durationMs: number | null };                           // PROPOSED, MAY-MOVE: once per command-log entry (step 07);
                                                                                           //   durationMs mirrors Action.durationMs (null = measured in turns)
}

/** Runtime key set for CoreEventMap; the compiler holds it equal to the interface (audio-format §8).
 *  Adding a core event without its key fails tsc; an extra key fails the excess-property check. */
export const CORE_EVENT_KEYS = { landedOn: true, pushBlocked: true, enteredLane: true, actionLogged: true } as const satisfies
  { readonly [K in keyof CoreEventMap]-?: true };   // MAY-MOVE

/** Mode events (idle, TD, …): AUGMENTABLE. A mode package adds its own entries by declaration merging, e.g.
 *    declare module "@te/project/core-types" { interface ModeEventMap { waveStart: { readonly wave: number } } }
 *  Keys must not collide with CoreEventMap keys; prefer prefixed names (idle.*, td.*). Empty in core. MAY-MOVE. */
export interface ModeEventMap {
  /** Reserved placeholder so the interface isn't empty. Optional `never`: it can never be set, and EventUnion drops it. */
  readonly "mode.none"?: never;
}

/** UI / host events (title screen, menus, buttons): AUGMENTABLE like ModeEventMap, prefixed "ui.*".
 *  NOT part of AnyEvent: UI events never enter the command log or the sim (audio-format §8). MAY-MOVE. */
export interface UiEventMap {
  /** Reserved placeholder so the interface isn't empty. Optional `never`: it can never be set, and EventUnion drops it. */
  readonly "ui.none"?: never;
  readonly "ui.click": { readonly control: string };   // PROPOSED (EA confirmed name + payload; CEO to rule)
}

/** Turns a payload map into a discriminated union { type: K } & payload. Optional/never entries drop out. */
export type EventUnion<M> = {
  [K in keyof M & string]-?: Exclude<M[K], undefined> extends never ? never : { readonly type: K } & Exclude<M[K], undefined>;
}[keyof M & string];

/** Core events only (closed union). MAY-MOVE. */
export type CoreEvent = EventUnion<CoreEventMap>;
/** Every event the log and bus may carry: core events plus whatever modes have augmented. MAY-MOVE. */
export type AnyEvent = CoreEvent | EventUnion<ModeEventMap>;

/** UI / host events only (augmentable union). NOT in AnyEvent. MAY-MOVE. */
export type UiEvent = EventUnion<UiEventMap>;
/** Runtime key set for UiEventMap; optional/never entries drop out (audio-format §8). */
export const UI_EVENT_KEYS = { "ui.click": true } as const satisfies
  { readonly [K in keyof UiEventMap as UiEventMap[K] extends undefined ? never : K]-?: true };   // MAY-MOVE

// The command-log header {seed, formatVersion, engineVersion, projectHash} is also a runtime shape, owned by the
// Engine Architect's events/command-log step. It's referenced here only (project-format r13 §6.5), not defined.

// ---------------------------------------------------------------- GAPs
// None. GAPs 1–6 resolved in project-format r13 (facing, seed, ResolvedPlacement, sides, wrapEdges ignored in v1,
// footprint 1×1 only); GAP 7 closed in place (r13, 22:0x: water/lava/wall-block CONFIRMED).
