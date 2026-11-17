# Host guide (D3): rules for the game that wires the engine

For whoever writes the host: the page, app or tool that runs a match and draws it. Each rule names the line it rests on (main `f128bc5a`, after P1). QA checks every rule against its line. Sources: `post34-diagnosis-plan.md` D3, `integration-seams.md`, QA `docs/qa/post34-answers.md` row 16, QA `docs/qa/step-p1-review.md` N1.

## Scene rules (seams)
1. **Water vs objects (seam 7).** Tiles draw at instance offset 0, so a river reads as one stream (`src/runtime/render/draw-list.ts:43`). Objects and standing pieces get a hash offset per asset and cell (`draw-list.ts:65`, `frames.ts:43`). Do not expect two copies of one object to animate in step.
2. **New tile animations (seam 8).** `isStatic` (`src/runtime/render/chunk-plan.ts:7`) is the only gate that keeps animated tiles out of the chunk bakes (`chunk-plan.ts:20,25`). Any new per-tile animation must extend it, or it freezes inside the chunk.
3. **One clock (seam 13).** The driver draws with `o.clock.now()` and `o.clock.stepMs` (`src/runtime/host/raf-driver.ts:83,86`). Pass the same time to `link.scene(world, { tMs, stepMs })` (`src/runtime/scene/world-scene.ts:14,16`). A different time desyncs effects from motion.
4. **Draw cut (seam 27).** The 300-piece cut (`FX_BUDGET.frame`, `src/runtime/render/fx-particles.ts:4`) applies to each draw-list build, not to a whole frame. Chunked base passes count separately.
5. **Unique unit ids (seam 35).** The effect actor index keeps the first unit with a given id (`world-scene.ts:110`). Duplicate ids are not legal. With duplicates, the second unit gets no effects.
6. **Effects are values (seam 37).** The effects cache keys on the identity of `world.effects` and its objects (`world-scene.ts:11,115`). To change an effect, replace both the array and the object. Pushing into the same array, or editing an object in place, is not seen.
7. **Light walls (step P1).** Pass `lightWalls: wallsFrom(grid)` in the light world (`Blockers.lightWalls`, `src/runtime/render/visibility.ts:1`; `wallsFrom` at `visibility.ts:5`), so thin walls (door frames, fences) stop light like the movement walls do. A wall bit on either side of an edge stops light, on all four sides. Without `lightWalls`, light goes through edge walls, as before P1.

## Frame timing
8. **p95 (P-34b-2).** p95 means nearest rank: sort the n frame times ascending and take index `ceil(0.95 × n) − 1`. The lite switch uses exactly this (`raf-driver.ts:39`). The phone page reads `s[floor(n × q)]` (`tools/device-page/page.ts:21`), one rank higher when 0.95 × n is a whole number (slightly stricter; tools only). Read the budgets in `docs/qa/device-runs/TEMPLATE.md:53` with this rule.

## Doors: how each entry point refuses (QA row 16)
No hostile value causes an uncaught raw throw at `submit` or `after`. The four doors refuse in four different shapes, kept as they are:

| Door | Refusal shape | Line |
|---|---|---|
| `submit(world, action)` | a notice (`logFull`, `timeLimit`, `actionRefused`, `unlockFailed`); no log entry, no throw | `src/sim/actions.ts:26-28` |
| `clock.after(ms, cb)` | `RangeError` through `onError`, plus an inert timer `{ id: 0, dueMs: -1 }` | `src/core/clock/clock.ts:120` |
| `log.append` / `restore` | a named throw (`append: log full`, `append: not an action`, `restore: snapshot …`) | `src/core/log/log.ts:62,64`; `src/sim/run.ts:59,62,65` |
| `loadSave` | a result code (`SaveRefusal`) or a named `load: …` throw | `run.ts:68,78-84` |

Hosts catch around `append`, `restore` and `loadSave`. They read notices after `submit` and listen on `onError` for the clock.

## Restore and log: known limits (not coded in P1)
9. **A getter in an action runs during `submit`.** `submit` copies the action first (`actions.ts:25`). A getter can step the clock during that copy, and the entry is then logged at the later tick. A getter can also call `submit` again, and both entries are logged. (QA probes "S7 re-entrant: getter steps clock" and "S7 re-entrant: getter submits again".) Hosts pass plain data only. Actions from a network or a file go through `JSON.parse` first.
10. **Lying log entries (row 14).** `restore` reads `log.entries()` once, caps its length and checks each entry, refusing a bad log as `restore: the log is not plain data` (`src/sim/run.ts:61-67`). The copy is shallow. An entry whose `tick` or `action` getters return a different value on each read is not deep-copied. Pass a log made by `createLog` or `parseLog`, never a hand-built object.
11. **Oversized actions cost heap first (QA P1 N1).** `plainCopy` runs before the effects cap (`actions.ts:25`, then `readAction`; the cap is `tooLong` at `src/core/log/log.ts:38-40`, refused as `actionRefused` at `actions.ts:29`). A 1e6-effect action costs about 93 MB of temporary heap before it is refused. Cap input size at the host edge (text length or message size).

## State table
12. **END_TURN in actMenu (Modes; doc only).** `END_TURN` is accepted only from `idle` and `unitSelected` (`src/state/tactics.flow.table.ts:11`). In `actMenu` (after a move, `tactics.input.table.ts:9`) no row takes it. The host finishes the action first (`CHOOSE_ACTION` or `WAIT`, `tactics.input.table.ts:11,13`) or sends `UNDO_MOVE` (`tactics.input.table.ts:10`). `FUSE_EXPIRE` still ends the side from `actMenu` (`tactics.flow.table.ts:12`).

## Match → picture recipe
`src/sim` and the scene link never import each other (`nothing-imports-sim`, `.dependency-cruiser.cjs:15`). `SceneUnit` (`world-scene.ts:6`) is its own shape. The host joins them in one function:

```ts
sceneFromMatch(snap: plain SimSnapshot data, art: MatchAssets) -> SceneWorld
// MatchAssets = the map's picture (cols, rows, tileW, tileH, mapSeed, layers, assets) + sprites: unitId -> asset id
```

- Take the snapshot as plain data: a `JSON.parse` of a save, a network message, or `snapshot(world)`.
- Map each unit to a `SceneUnit`: id, sprite from its `unitId`, `at`, `offset`, `facing` (the same N/E/S/W), `alive`.
- The action is `move` while `offset` is set, else `idle`. Skip units with no sprite.
- Take turn phases from the save itself, not from a replay: a replayed snapshot's phases can differ from the saved ones.
- Then `link.scene(world, clock)` and `buildDrawList` (or the driver), on one clock (rule 3).

`tools/host-example/match-picture.ts` is a working copy. It plays a `stage-fixed` match, keeps only the log, replays it fresh, snapshots, copies as JSON and draws the last frame. Run `node tools/host-example/match-picture.ts`; it prints `stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands`. It is tools only (src never imports it). `tsconfig.json` includes it, so tsc and lint cover it. The real link is `sceneFromMatch` in `src/runtime/scene/match-link.ts`.

## Playing ability effects
13. **Read the saved effect.** `readEffect` (`src/project/read/effect.ts`) turns a `behaviour-setup` v3 file with `behaviourId: "effect"` into `{id, rev, values}`. A `source:"default"` knob is copied only when that key is own on the host `defaults`; otherwise the runtime default stands (`DOC.connect` is 0.92).
14. **Cue, cast, hit.** `cueFromEntry(entry, stepMs, refOf)` reads the action (`refOf` is given the action, so one `effects` entry wins and `via.ref` never does). `createCastFx({sheetOf, values})` compiles each `ref@rev` once. Put `effects(nowMs)` on `world.effects` (replace the array only when the list changes, seam 37). `fx:hit` fires at `toTick(castMs + hitOffsetMs, stepMs)`. The sim does not wait.
15. **Misses.** `node tools/host-example/match-fx.ts` prints `match-fx: 3 cues, 2 live at 50ms, 2 hits, notes: unknownRef missing`. A missing ref is `unknownRef`. `"none"` adds no note and no picture.

