# Rebuild baseline: the engine before step 0

Read this first. The maker steps didn't start from an empty repo: the engine already had about 7,300 lines of engine code in `src/` (plus tools, tests and scripts) from earlier build steps. A rebuild starts from that exact commit, not from scratch. Then follow `step-00.md`, `step-01a.md` and `step-01b.md` in order.

## (a) The starting commit

| | Value |
|---|---|
| Commit | `1b834c3162c33e698a6c389a286c63fc8dc994f4` |
| What it is | The first parent of PR #76's merge `9a9ca90e` on main, and PR #76's recorded base (`baseRefOid`). Its message: "docs: add Step 0 (touch play) to maker step guide, copied unchanged from handoff/steps/s0-play-input.md", 2026-11-18 16:31 (UK time) |
| Tree | `12f833ed16245c1ca1caeb3b01bfa7a9f82f8b87` |
| Relation to the brief's base | The S0 brief names `501057027cc27321b631c40ed3ef7d5552ac792a` (P1-9, PR #75). `1b834c31` is four commits later (`15f73fb`, `f2df5c4`, `16ea963`, `1b834c3`) that touch only docs, data, ux and the `ui-shell/` prototypes; `src/` and `tools/play-stage/` are identical between them (`handback/s0-play-input/r1/HANDBACK.md:49`). `15f73fb` also added the ui-shell Effect Designer v3 mock that causes the lint errors in (d) |
| Tests | **1014 pass / 0 fail** with `npm test` |

Check it out:

```
git clone https://github.com/G-TileEngine/tileengine.git && cd tileengine
git checkout --detach 1b834c3162c33e698a6c389a286c63fc8dc994f4
git rev-parse HEAD^{tree}      # 12f833ed16245c1ca1caeb3b01bfa7a9f82f8b87
```

Stack at this commit: Node `.nvmrc` 24 (`engines.node >=22.18.0`), no runtime `dependencies` in `package.json`. devDependencies only: `@types/node` 24.19.2, `dependency-cruiser` 18.7.2, `eslint` 10.14.0, `typescript` 6.0.3, `typescript-eslint` 8.72.2. Scripts: `test` = `node --test "tests/**/*.test.ts"`; `green` = test + typecheck + lint + deps + `check:state` + `check:law`.

## (b) Inventory of engine and test code

All `.ts`, `.mjs`, `.js`, `.cjs` and `.sh` files under `src/`, `tools/`, `tests/` and `scripts/` at `1b834c31`. Line counts are newline counts (`git show 1b834c31:<path> | wc -l`). "What it does" is taken from each file's own first doc comment, or its first test title, or its exports, with a few hand-written where the file has none. It's a map, not a spec: read the file for detail.

| Area | Files | Lines |
|---|---|---|
| `src/` (the engine) | 148 | 7281 |
| `tools/` (play stage, APK, designers, device pages) | 31 | 1460 |
| `tests/` | 184 | 10538 |
| `scripts/` | 3 | 99 |
| **Total** | **366** | **19378** |

Not counted above, but present: `handoff/steps/tests/` (127 frozen step-kit test files, 7,834 lines; not in the `npm test` glob), `ui-shell/` prototypes (3 code files, 1,752 lines; record of behaviour only, never copy), and config: `package.json` (27 lines), `package-lock.json` (1,827), `tsconfig.json` (23), `eslint.config.mjs` (54), `.dependency-cruiser.cjs` (24), `.nvmrc` (1). Docs live in `docs/`, `handoff/`, `handback/` and `ux/`.

By folder:

| Folder | Files | Lines |
|---|---|---|
| `scripts/` | 3 | 99 |
| `src/` | 1 | 3 |
| `src/btf-adapters/src/` | 11 | 104 |
| `src/core/` | 3 | 77 |
| `src/core/clock/` | 3 | 195 |
| `src/core/events/` | 3 | 110 |
| `src/core/grid/` | 3 | 161 |
| `src/core/log/` | 3 | 136 |
| `src/core/rng/` | 2 | 65 |
| `src/core/targeting/` | 3 | 72 |
| `src/core/unit/` | 4 | 181 |
| `src/editor/effect/` | 7 | 452 |
| `src/fx/order/` | 8 | 551 |
| `src/paint/recipe/` | 5 | 228 |
| `src/project/read/` | 10 | 429 |
| `src/rules/battle/` | 11 | 228 |
| `src/rules/behaviours/` | 6 | 206 |
| `src/rules/levels/` | 3 | 117 |
| `src/rules/move/` | 4 | 84 |
| `src/rules/turns/` | 3 | 143 |
| `src/runtime/canvas/` | 1 | 151 |
| `src/runtime/host/` | 1 | 103 |
| `src/runtime/input/` | 3 | 79 |
| `src/runtime/render/` | 23 | 1318 |
| `src/runtime/scene/` | 3 | 296 |
| `src/sim/` | 16 | 1219 |
| `src/sim/migrations/` | 1 | 14 |
| `src/state/` | 6 | 154 |
| `src/types/` | 1 | 405 |
| `tests/` | 2 | 66 |
| `tests/btf-adapters/` | 1 | 16 |
| `tests/core/` | 14 | 1181 |
| `tests/editor/` | 22 | 833 |
| `tests/fixtures/law-bad/` | 3 | 8 |
| `tests/fixtures/law-good/` | 1 | 2 |
| `tests/fixtures/state-bad/` | 1 | 5 |
| `tests/fixtures/state-good/` | 1 | 4 |
| `tests/fx/` | 6 | 397 |
| `tests/paint/` | 3 | 128 |
| `tests/parity/` | 5 | 126 |
| `tests/perf/` | 3 | 110 |
| `tests/project/` | 8 | 283 |
| `tests/rules/` | 19 | 1274 |
| `tests/runtime/` | 2 | 118 |
| `tests/runtime/canvas/` | 3 | 211 |
| `tests/runtime/host/` | 1 | 186 |
| `tests/runtime/input/` | 1 | 50 |
| `tests/runtime/render/` | 18 | 943 |
| `tests/runtime/scene/` | 21 | 1376 |
| `tests/sim/` | 29 | 2113 |
| `tests/state/` | 7 | 264 |
| `tests/tools/` | 13 | 844 |
| `tools/` | 1 | 34 |
| `tools/apk/` | 1 | 94 |
| `tools/device-page/` | 6 | 332 |
| `tools/effect-designer/` | 7 | 220 |
| `tools/host-example/` | 2 | 70 |
| `tools/pixel-suite/` | 4 | 118 |
| `tools/play-stage/` | 10 | 592 |

### File by file

#### `scripts/` (3 files, 99 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `scripts/check-law.sh` | 41 | Build-law greps (BUILD_GUIDE §2; QA checklist §3), run by `npm run check:law`; independent of ESLint |  |
| `scripts/check-state.sh` | 23 | QA gate G3 (docs/qa/handback-checklist.md §1): no direct phase writes. Pattern copied verbatim; do not edit. |  |
| `scripts/sim.ts` | 35 | `npm run sim`: runs a seeded match through `src/sim` with the test bot and input |  |

#### `src/` (1 files, 3 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/index.ts` | 3 | TileEngine engine root. Version is logged in every command-log header (STATES/BUILD_GUIDE). |  |

#### `src/btf-adapters/src/` (11 files, 104 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/btf-adapters/src/btf-defaults/battle.ts` | 15 | Proven BTF battle numbers. towerChess.ts:92 HP; towerChess.ts:926-937 opening ad; towerStrike.ts:33-35 class damage, :214-219 cleric 1; towerStrike.ts:515 Math.max(0, hp - dmg),… |  |
| `src/btf-adapters/src/btf-defaults/move.ts` | 6 | Proven BTF move numbers. towerChess.ts:399-407 empty(), :415-509 moveSquares, :424 ray(). |  |
| `src/btf-adapters/src/btf-defaults/spells.ts` | 6 | Fireball. towerChessSpells.ts:215-221 spellReach; towerChessSpells.ts:95 and towerContest.ts:42 damage 2; towerChessHand.ts:30 SPELL_COST = 2 (read, ignored until Phase 4). |  |
| `src/btf-adapters/src/btf-defaults/turns.ts` | 4 | BTF CHESS_MOVES. towerChess.ts:92. |  |
| `src/btf-adapters/src/fx-preset.ts` | 31 | The BTF preset: how BTF currently plays (CEO and CoS rulings 2026-11-09). Plain data the caller passes to src/fx. |  |
| `src/btf-adapters/src/index.ts` | 10 | exports `BTF_FX_FLIGHT`, `BTF_FX_LOOK`, `BTF_FX_PRESET`, `BTF_FX_READ_LIMITS`, `laneIdToSq`, `sqToLaneId` … |  |
| `src/btf-adapters/src/lane-labels.ts` | 14 | exports `laneIdToSq`, `sqToLaneId` |  |
| `src/btf-adapters/src/levels.ts` | 6 | BTF's tested levelling (CEO 2026-11-10/12): one bar per side, towerXp.ts XP_AT and LEVEL_CAP 9, a move is 1 XP,  ability offers at levels 1, 3, 4, 6, 7 and 9 (2, 5 and 8 give no… |  |
| `src/btf-adapters/src/match-limits.ts` | 4 | BTF's own object, equal to the engine defaults today, so BTF can change its numbers without core. |  |
| `src/btf-adapters/src/sprite-recipe-limits.ts` | 4 | BTF sprite recipe caps (CEO 2026-11-12, docs/sprite-recipe-architecture.md §1.1): what one BTF recipe may hold before the excess is warned and not drawn. |  |
| `src/btf-adapters/src/stage-limits.ts` | 4 | BTF stage caps (CEO-approved 2026-11-12: 144 entries per pool or wave, 1,024 stages). |  |

#### `src/core/` (3 files, 77 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/core/limits.ts` | 28 | exports `MatchLimits`, `MATCH_CEILINGS`, `DEFAULT_MATCH_LIMITS`, `SEED_MAX`, `PLAIN_NODES`, `TEXT_BYTES` … |  |
| `src/core/notice.ts` | 4 | A warning, never an exception (BUILD_GUIDE §2 law 10). `code` is stable; `message` is for people. |  |
| `src/core/plain.ts` | 45 | exports `NOT_PLAIN`, `isRecord`, `plainCopy`, `cellOf` |  |

#### `src/core/clock/` (3 files, 195 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/core/clock/clock.ts` | 157 | exports `createClock` |  |
| `src/core/clock/index.ts` | 2 | exports `Clock`, `ClockOptions`, `RenderInfo`, `SimTimer`, `SkipResult`, `TickInfo` … |  |
| `src/core/clock/types.ts` | 36 | The one engine clock (BUILD_GUIDE §2 law 1, MODES-v1 M1, CN-001). Sim time is integer ms: ticks × stepMs. |  |

#### `src/core/events/` (3 files, 110 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/core/events/bus.ts` | 77 | Engine default (step 17): about 5x the longest BTF match measured (187 records), small enough for a phone. Makers pass their own. |  |
| `src/core/events/index.ts` | 3 | exports `ENGINE_EVENT_TYPES`, `DEFAULT_BUS_LIMITS`, `createBus`, `logEvents`, `unitEvents` |  |
| `src/core/events/types.ts` | 30 | Core events = DSK's CoreEventMap (landedOn, pushBlocked, enteredLane, actionLogged; MAY-MOVE). Step 07 adds none of its own. |  |

#### `src/core/grid/` (3 files, 161 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/core/grid/grid.ts` | 131 | exports `createGrid` |  |
| `src/core/grid/index.ts` | 3 | exports `Dir`, `ForceBlock`, `ForceCheck`, `Grid`, `GridOptions`, `DIRS` … |  |
| `src/core/grid/types.ts` | 27 | exports `Dir`, `DIRS`, `GridOptions`, `ForceBlock`, `ForceCheck`, `Grid` |  |

#### `src/core/log/` (3 files, 136 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/core/log/index.ts` | 3 | exports `LOG_FORMAT_VERSION`, `createLog`, `parseLog`, `readAction` | imported by 1b, S0 |
| `src/core/log/log.ts` | 97 | exports `readAction`, `createLog`, `parseLog` |  |
| `src/core/log/types.ts` | 36 | M4: an action is data with a duration. The log stores it; core never executes it.  `target: null` = no target: no pipe; the resolve context gets the caster (actor) only. |  |

#### `src/core/rng/` (2 files, 65 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/core/rng/index.ts` | 1 | re-exports `./rng.ts` (seeded random numbers) |  |
| `src/core/rng/rng.ts` | 64 | exports `RngState`, `Rng`, `restoreRng`, `createRng`, `streamSeed` |  |

#### `src/core/targeting/` (3 files, 72 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/core/targeting/index.ts` | 2 | exports `aimTile`, `aimUnit`, `resolveAim`, `resolveContext`, `roster`, `toCell` |  |
| `src/core/targeting/pipes.ts` | 52 | exports `aimUnit`, `aimTile`, `resolveAim`, `resolveContext`, `roster`, `toCell` |  |
| `src/core/targeting/types.ts` | 18 | UNIT pipe: follows a living body. `fallbackAt` (Gale-style) is still UNIT: used only when the id is dead. |  |

#### `src/core/unit/` (4 files, 181 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/core/unit/index.ts` | 3 | exports `LandCause`, `MoveFail`, `MoveResult`, `OccupancyRule`, `Offset`, `PassThrough` … |  |
| `src/core/unit/reach.ts` | 24 | exports `reach` |  |
| `src/core/unit/types.ts` | 66 | Sub-cell draw offset in tile fractions (M3). Never changes occupancy. |  |
| `src/core/unit/units.ts` | 88 | exports `STRICT1`, `createUnits` |  |

#### `src/editor/effect/` (7 files, 452 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/editor/effect/dice.ts` | 53 | exports `DICE`, `Child`, `seedOf`, `rollValue`, `roll`, `pushRoll` … |  |
| `src/editor/effect/fit.ts` | 81 | exports `Side`, `FIT`, `countOf`, `lit`, `badCounts`, `beatOf` … |  |
| `src/editor/effect/house.ts` | 30 | exports `PixelScale`, `House`, `HOUSE`, `readHouse`, `blankDoc`, `addPart` |  |
| `src/editor/effect/merge.ts` | 69 | exports `AB`, `Pick`, `Gauge`, `Meter`, `Span`, `Marks` … |  |
| `src/editor/effect/parts.ts` | 55 | exports `PARTS`, `From`, `Part`, `partsOf`, `checkParts`, `Source` … |  |
| `src/editor/effect/save.ts` | 78 | exports `SAVE`, `Store`, `Docs`, `Entry`, `Move`, `Commit` … |  |
| `src/editor/effect/writer.ts` | 86 | exports `Row`, `Change`, `Op`, `WriteOpts`, `WRITER`, `canonStep` … |  |

#### `src/fx/order/` (8 files, 551 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/fx/order/effect.ts` | 72 | exports `planEffect` |  |
| `src/fx/order/index.ts` | 7 | exports `FxBody`, `FxCopy`, `FxCopySample`, `FxCue`, `FxEase`, `FxEffectPlan` … |  |
| `src/fx/order/landing.ts` | 17 | exports `pickLanding` |  |
| `src/fx/order/look.ts` | 117 | exports `easeAt`, `lookAt`, `copyAt`, `planLook` |  |
| `src/fx/order/options.ts` | 56 | Allowed values per option. Order is display order only; nothing here is a default. |  |
| `src/fx/order/read.ts` | 114 | Format limits and fill-ins the docs state, each cited. The only numbers in src/fx; the rest come in FxReadLimits. |  |
| `src/fx/order/timeline.ts` | 25 | exports `planFx`, `playFx` |  |
| `src/fx/order/types.ts` | 143 | One step (`frames[i]`, effect-order §A). `ms` is whole sim ms (integer-ms law); `kind` is passed through, or null when absent. |  |

#### `src/paint/recipe/` (5 files, 228 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/paint/recipe/fields.ts` | 103 | exports `readDoc` |  |
| `src/paint/recipe/index.ts` | 3 | exports `Anim`, `Facing`, `Frame`, `Outline`, `PartKind`, `Pose` … |  |
| `src/paint/recipe/limits.ts` | 19 | Caller-set caps on everything that drives paint work (SE-01; step-16 `StageLimits` pattern), no defaults. `side` caps `size.w` and `size.h`;  `points` and `runs` cap each list;… |  |
| `src/paint/recipe/read.ts` | 72 | exports `SPRITE_RECIPE_FORMAT`, `SPRITE_RASTER`, `readSpriteRecipe` |  |
| `src/paint/recipe/types.ts` | 31 | exports `PartKind`, `Run`, `Json`, `Outline`, `Shade`, `Slot` … |  |

#### `src/project/read/` (10 files, 429 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/project/read/effect.ts` | 36 | exports `EFFECT_ANSWERS`, `EffectDoc`, `readEffect` |  |
| `src/project/read/guard.ts` | 49 | Hard failures. needsMigration: an integer formatVersion that is not the current one (never patched here). | imported by 1a |
| `src/project/read/index.ts` | 11 | exports `ReadFail`, `ReadResult`, `MapSize`, `Picker`, `Placements`, `CURRENT_FORMAT_VERSIONS` … | imported by 1a |
| `src/project/read/limits.ts` | 36 | exports `DocLimits`, `DOC_CEILINGS`, `DEFAULT_DOC_LIMITS`, `INT32_MAX`, `docLimits`, `unfit` … |  |
| `src/project/read/manifest.ts` | 33 | exports `readManifest` |  |
| `src/project/read/map.ts` | 55 | exports `readMap` |  |
| `src/project/read/placements.ts` | 45 | Same shape as step 05's `Rng.weighted`: an index with a positive weight, or -1 when none is left. |  |
| `src/project/read/setups.ts` | 30 | exports `SetupRead`, `readSetup`, `StageOverrides`, `readStageOverrides` |  |
| `src/project/read/stage.ts` | 109 | Caller caps on loop-driving counts (step 16), no defaults: weighted `picks`, and the units one wave adds (its counts summed). |  |
| `src/project/read/unit.ts` | 25 | exports `UnitRead`, `readUnit` | 1a edits |

#### `src/rules/battle/` (11 files, 228 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/rules/battle/abilities.ts` | 29 | exports `AbilityRow`, `abilityTableFor` |  |
| `src/rules/battle/basic-attack.ts` | 10 | exports `BasicAttack`, `BASIC_ATTACK` |  |
| `src/rules/battle/battle.ts` | 74 | exports `BATTLE_EVENTS`, `ShotRow`, `BattleSetup`, `BattleState`, `HIT_REFUSED_REASONS`, `HIT_FILTER_REASONS` … | imported by 1b |
| `src/rules/battle/damage.ts` | 21 | exports `HIT_CLASSES`, `HitClass`, `DAMAGE_RESOLUTION_KNOBS`, `DamageRule`, `DAMAGE_RESOLUTION`, `DamageCtx` … |  |
| `src/rules/battle/index.ts` | 10 | exports `BATTLE_EVENTS`, `HIT_FILTER_REASONS`, `HIT_REFUSED_REASONS`, `createBattle`, `type Battle`, `type BattleSetup` … | imported by 1b, S0 |
| `src/rules/battle/interact.ts` | 5 | exports `INTERACT_REFUSED_REASONS`, `InteractRefusedReason`, `InteractRefused`, `interactRefused` |  |
| `src/rules/battle/line-shot.ts` | 15 | exports `LineShot`, `LINE_SHOT` |  |
| `src/rules/battle/range.ts` | 8 | exports `ReachTable`, `inOrthogonalReach`, `reachOf` |  |
| `src/rules/battle/roster.ts` | 15 | exports `UNIT_ROSTER_KNOBS`, `UnitStats`, `UNIT_ROSTER` |  |
| `src/rules/battle/targets.ts` | 12 | exports `BattleTarget`, `targetsFor` |  |
| `src/rules/battle/win.ts` | 29 | exports `WIN_CONDITION_KNOBS`, `WinRule`, `WIN_CONDITION`, `wipeRule` |  |

#### `src/rules/behaviours/` (6 files, 206 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/rules/behaviours/catalogue.ts` | 46 | The catalogue slice the engine carries (generated by EA's gen-catalogue.py; never hand-edited; regenerate from the Librarian's rev):  behaviours.json rev 26, sha256 ea8b3302…. `… |  |
| `src/rules/behaviours/index.ts` | 5 | exports `BehaviourDef`, `Installed`, `KnobReader`, `KnobSpec`, `KnobUnsupported`, `Layer` … | imported by 1b |
| `src/rules/behaviours/registry.ts` | 102 | exports `createRegistry`, `resolveKnob`, `installOne`, `installSetups`, `outOf` | imported by 1b, S0 |
| `src/rules/behaviours/terrain.ts` | 21 | exports `TerrainOut`, `TERRAIN` | imported by 1b |
| `src/rules/behaviours/types.ts` | 15 | exports `KnobType`, `Gate`, `KnobSpec`, `Layer`, `Resolved`, `SetupLayers` … |  |
| `src/rules/behaviours/xp-levels.ts` | 17 | exports `XP_LEVELS` |  |

#### `src/rules/levels/` (3 files, 117 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/rules/levels/index.ts` | 2 | exports `AbilityPools`, `LevelBar`, `LevelLimits`, `LevelRules`, `LevelSetup`, `Levels` … |  |
| `src/rules/levels/levels.ts` | 89 | exports `LEVEL_EVENTS`, `LEVEL_CEILINGS`, `createLevels` |  |
| `src/rules/levels/types.ts` | 26 | Levelling data (step 18), the maker's choice; no defaults. `bar`: who owns an XP bar (one per side, or one per unit). `thresholds[i]` is the XP  to go from level i to i + 1 (the… |  |

#### `src/rules/move/` (4 files, 84 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/rules/move/index.ts` | 3 | exports `STEP_PATTERN`, `STEP_PATTERN_KNOBS`, `type StepRule`, `reachCells`, `walkTo`, `walks` … |  |
| `src/rules/move/path.ts` | 35 | exports `walks`, `reachCells`, `walkTo` | imported by 1b, S0 |
| `src/rules/move/step-pattern.ts` | 20 | exports `STEP_PATTERN_KNOBS`, `StepRule`, `STEP_PATTERN` | imported by 1b, S0 |
| `src/rules/move/targets.ts` | 26 | exports `TapTarget`, `targetsFor` |  |

#### `src/rules/turns/` (3 files, 143 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/rules/turns/action-budget.ts` | 12 | Side actions per turn. towerChess.ts:92 CHESS_MOVES = 2. This step ships this knob only. | imported by 1b, S0 |
| `src/rules/turns/bot-ability-priority.ts` | 118 | Own keys only. A prototype-key unit id is not a spell row. | imported by 1b, S0 |
| `src/rules/turns/fuse.ts` | 13 | Turn fuse length in integer sim ms (CN-001), > 0. Any value is legal (user-adjustable, CEO);  30000 and 60000 are suggestions only. The BTF preset's 60000 default is preset/proj… |  |

#### `src/runtime/canvas/` (1 files, 151 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/runtime/canvas/canvas2d.ts` | 151 | exports `Ctx2D`, `CanvasLike`, `Canvas2DOptions`, `Canvas2D`, `canvas2d` |  |

#### `src/runtime/host/` (1 files, 103 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/runtime/host/raf-driver.ts` | 103 | exports `HostCanvas`, `HostEnv`, `View`, `DriverOptions`, `Driver`, `createDriver` | imported by 1b, S0 |

#### `src/runtime/input/` (3 files, 79 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/runtime/input/gestures.ts` | 48 | exports `createGestureMapper` | imported by 1b, S0 |
| `src/runtime/input/index.ts` | 2 | exports `GestureBoard`, `GestureMapper`, `GestureOptions`, `Intent`, `PointerSample`, `createGestureMapper` |  |
| `src/runtime/input/types.ts` | 29 | M7: what the player means, never raw DOM. Tap-tap and drag-to-target give the same intents. | imported by 1b, S0 |

#### `src/runtime/render/` (23 files, 1318 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/runtime/render/bakes.ts` | 76 | exports `Pixels`, `SWAY_LOOP`, `SWAY_EDGE_PX`, `cycleFrames`, `scrollFrames`, `swayFrames` … | imported by 1b, S0 |
| `src/runtime/render/camera.ts` | 27 | Half up, and `+ 0` kills a negative zero. |  |
| `src/runtime/render/canopy.ts` | 23 | exports `SEE_THROUGH_DEFAULT`, `createSeeThrough` |  |
| `src/runtime/render/chunk-plan.ts` | 38 | exports `CHUNK`, `chunkId`, `isStatic`, `chunkedList` |  |
| `src/runtime/render/dirty.ts` | 21 | exports `needsDraw`, `present` |  |
| `src/runtime/render/draw-list.ts` | 81 | exports `anchorPx`, `buildDrawList` |  |
| `src/runtime/render/feel.ts` | 68 | exports `FEEL`, `ShakeSetting`, `Hold`, `Kick`, `Shake`, `stopMs` … |  |
| `src/runtime/render/fit.ts` | 26 | exports `backingSize`, `fitView`, `scaleRange`, `snapScale` |  |
| `src/runtime/render/frames.ts` | 48 | exports `footAt`, `badMs`, `clipMs`, `frameAt`, `hash32`, `instanceOffset` |  |
| `src/runtime/render/fx-doc.ts` | 66 | exports `DocStep`, `FxDocValues`, `DocHost`, `DOC`, `stepsOf`, `Timing` … | imported by 1b |
| `src/runtime/render/fx-light.ts` | 56 | exports `FX_LIGHT`, `Ramps`, `LightMode`, `LitStep`, `lightMode`, `lightRadius` … |  |
| `src/runtime/render/fx-live.ts` | 126 | exports `LiveFx`, `LiveUnit`, `LiveEvent`, `LiveGrid`, `LiveOut`, `FxLive` … |  |
| `src/runtime/render/fx-look.ts` | 56 | exports `LOOK`, `lookBox`, `lookSize`, `turnTag`, `lookId`, `rgbOf` … |  |
| `src/runtime/render/fx-particles.ts` | 37 | exports `PARTICLES`, `SPREAD`, `FX_BUDGET`, `FX_GROUND_ORDER`, `ParticleRead`, `Dot` … |  |
| `src/runtime/render/fx-path.ts` | 54 | exports `PATH`, `PathKind`, `Hop`, `FxPath`, `PathBad`, `isTravel` … |  |
| `src/runtime/render/fx-player.ts` | 107 | exports `FX_PLAYER`, `FxNote`, `ClipEvent`, `Pt`, `Box`, `PointName` … |  |
| `src/runtime/render/index.ts` | 20 | exports `BANDS`, `type Anchor`, `type Band`, `type Cam`, `type Clip`, `type DrawCmd` … | imported by 1b, S0 |
| `src/runtime/render/light.ts` | 88 | exports `Light`, `FxLit`, `LightWorld`, `LightPlan`, `FillOp`, `BANDS_OF_LIGHT` … | imported by 1b |
| `src/runtime/render/motion.ts` | 78 | exports `Ramp`, `Motion`, `MotionCtx`, `MotionPart`, `MotionBake`, `MOTION_CAP` … |  |
| `src/runtime/render/types.ts` | 36 | Render core types (step 27). Pure data: the renderer reads these and never mutates engine state. | imported by 1b, S0 |
| `src/runtime/render/visibility.ts` | 78 | exports `Blockers`, `wallsFrom`, `openCell`, `visibleCells`, `createSight` |  |
| `src/runtime/render/water.ts` | 33 | exports `FOAM_PX`, `ShoreColours`, `ShoreOpts`, `SHORE_DEFAULTS`, `shoreDistance`, `shoreFrames` |  |
| `src/runtime/render/world-motion.ts` | 75 | exports `BAKE_BUDGET`, `FrameSource`, `WorldNote`, `ShoreMap`, `WorldMotion`, `createWorldMotion` | imported by 1b |

#### `src/runtime/scene/` (3 files, 296 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/runtime/scene/cast-fx.ts` | 96 | exports `CAST`, `CastCue`, `EffectValues`, `CastFxHost`, `CastFx`, `cueFromEntry` … |  |
| `src/runtime/scene/match-link.ts` | 68 | exports `MATCH`, `MatchArt`, `MatchScene`, `MatchLink`, `MatchPatch`, `sceneFromMatch` … |  |
| `src/runtime/scene/world-scene.ts` | 132 | exports `SceneAsset`, `SceneLayer`, `SceneUnit`, `SceneObject`, `SceneWorld`, `SceneClock` … | imported by 1b, S0 |

#### `src/sim/` (16 files, 1219 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/sim/actions.ts` | 34 | exports `submit` | imported by 1b, S0 |
| `src/sim/chaos-gen.ts` | 69 | exports `CHAOS_KINDS`, `gestureRecipes`, `chaosIntents`, `runChaosGen` |  |
| `src/sim/chaos.ts` | 129 | exports `SNAPSHOT_KEYS`, `divergentSnapshotKey`, `CHAOS_CHECKS`, `runChaos`, `replayChaos` |  |
| `src/sim/dispose.ts` | 16 | Ends a finished match or level (step 17): the clock drops its timers and subscribers and the bus drops its listeners and history. The log, units, grid, notices, phases and rng s… |  |
| `src/sim/driver-phase.ts` | 98 | exports `runMatch` |  |
| `src/sim/driver-tick.ts` | 34 | exports `runTicks` |  |
| `src/sim/exploit-docs.ts` | 82 | exports `tamperDoc`, `checkDoc`, `huntDocs` |  |
| `src/sim/exploit.ts` | 112 | exports `EXPLOIT_KINDS`, `protoNames`, `plainDeep`, `exploitWire`, `acceptedCheck`, `runExploit` … |  |
| `src/sim/index.ts` | 20 | exports `AiHook`, `Budget`, `ChaosCheck`, `ChaosFinding`, `ChaosGen`, `ChaosGenOptions` … | imported by 1b |
| `src/sim/intents.ts` | 28 | exports `intentEvent`, `feedIntent` |  |
| `src/sim/player.ts` | 96 | The door's shape guard (step 16): a fed value is read only after its shape is known; anything else is `malformed`. | imported by 1b, S0 |
| `src/sim/run.ts` | 135 | exports `replayTicks`, `advance`, `snapshot`, `replay`, `restore`, `SaveRefusal` … |  |
| `src/sim/shrink.ts` | 41 | exports `shrinkChaos` |  |
| `src/sim/turn.ts` | 57 | exports `TurnOptions`, `SaveMeta`, `Turn`, `createTurn` |  |
| `src/sim/types.ts` | 202 | Parsed JSON documents plus the host's choices. The sim never reads files, wall time or a random source. | imported by 1b, S0 |
| `src/sim/world.ts` | 66 | exports `note`, `createWorld` | imported by 1b, S0 |

#### `src/sim/migrations/` (1 files, 14 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/sim/migrations/save/index.ts` | 14 | exports `SaveStep`, `SaveChains`, `SAVE_FORMAT`, `SAVE_MIGRATIONS`, `migrateSave` |  |

#### `src/state/` (6 files, 154 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/state/index.ts` | 6 | exports `Event`, `EventType`, `Outcome`, `Phase`, `Row`, `Table` … | imported by 1b, S0 |
| `src/state/shared.table.ts` | 14 | exports `SHARED_TABLE` |  |
| `src/state/tactics.flow.table.ts` | 17 | exports `TACTICS_FLOW_TABLE` |  |
| `src/state/tactics.input.table.ts` | 15 | exports `TACTICS_INPUT_TABLE` |  |
| `src/state/types.ts` | 66 | src/state/types.ts |  |
| `src/state/xgo.ts` | 36 | exports `mergeTables`, `TABLES`, `xGo` |  |

#### `src/types/` (1 files, 405 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `src/types/core-types.ts` | 405 | Current formatVersion per document kind, post-migration (project-format r12 §12 "Kinds"). | imported by 1b, S0 |

#### `tests/` (2 files, 66 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/gates.test.ts` | 51 | 5 tests; first: "gates: check:state passes on src and on a clean fixture" |  |
| `tests/smoke.test.ts` | 15 | 2 tests; first: "smoke: engine root exports name and version" |  |

#### `tests/btf-adapters/` (1 files, 16 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/btf-adapters/lane-labels.test.ts` | 16 | 1 test; first: "lane ids 1–18 map to {c, r} and back, column-major (TILE.md): id 2 = (0,1), id 11 = (3,1)" |  |

#### `tests/core/` (14 files, 1181 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/core/bus.test.ts` | 76 | 5 tests; first: "events are ordered and stamped" |  |
| `tests/core/clock-skip.test.ts` | 65 | 7 tests; first: "G4 R1 skip cap: 8 h of sim per call by default; the remainder comes back with a skipCapped notice, an uncapped call has none" |  |
| `tests/core/clock.test.ts` | 167 | 11 tests; first: "same deltas give the same ticks" |  |
| `tests/core/dispose.test.ts` | 54 | 3 tests; first: "bus history cap (step 17): the newest records stay, seq keeps counting, and a bad limit throws" |  |
| `tests/core/edges.test.ts` | 67 | 5 tests; first: "a wall blocks both ways" |  |
| `tests/core/grid.test.ts` | 121 | 9 tests; first: "any size builds (M8)" |  |
| `tests/core/log.test.ts` | 86 | 8 tests; first: "header carries seed, formatVersion 1, engineVersion and projectHash" |  |
| `tests/core/pipes.test.ts` | 137 | 10 tests; first: "no third pipe exists" |  |
| `tests/core/push.test.ts` | 77 | 6 tests; first: "push stops before a wall-block" |  |
| `tests/core/reach.test.ts` | 40 | 2 tests; first: "reach respects walls, closed cells and maxSteps" |  |
| `tests/core/replay.test.ts` | 38 | 1 test; first: "replaying a log reproduces the event history" |  |
| `tests/core/rng.test.ts` | 103 | 10 tests; first: "golden next() vector for seed 0x5eed" |  |
| `tests/core/strict1.test.ts` | 45 | 4 tests; first: "G4 R9 strict1: a dead unit frees its cell the same tick for place, move, push and reach" |  |
| `tests/core/units.test.ts` | 105 | 7 tests; first: "place: ids, facing, side" |  |

#### `tests/editor/` (22 files, 833 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/editor/effect-e1-qa2.test.ts` | 35 | QA pins from the E1 kit review (QA plants the shipped E1 tests missed): seed 0 and NaN codes, the fold into every |  |
| `tests/editor/effect-e1-qa3.test.ts` | 34 | QA pins from the ED-E1 builds A/B (plants the shipped E1 tests missed): a shared acyclic source is not a cycle, a piece |  |
| `tests/editor/effect-e1.test.ts` | 62 | 6 tests; first: "E1 CN-020 checks: types invalidValue, unknown kind/beat outOfRange, nudge off the 30 ms grid offStep, > 6 overCap, a dangling step part unknownRef (kept); label… |  |
| `tests/editor/effect-e4-carries.test.ts` | 45 | 5 tests; first: "E4 carry (e): Fit pins connect_step to the hit step when it is absent, empty, not a string or names no step in the first 12, so a drop never moves the hit" |  |
| `tests/editor/effect-e4-qa.test.ts` | 35 | 4 tests; first: "E4 QA punch: the cap is > cap on every pick (150 stays, 151 caps); NaN never wins the max; a/b mean the card, not the base (Swap); squash both keeps the base's… |  |
| `tests/editor/effect-e4-qa2.test.ts` | 22 | 2 tests; first: "E4 QA2 S1: a base hit whose id can't name it (\" |  |
| `tests/editor/effect-e4-qa3.test.ts` | 11 | 1 test; first: "E4 QA3 S5/S4 edges: 48 and -0 are good counts (no line); 48.4 and 49 cap with the value as given; the meter names a capped step too" |  |
| `tests/editor/effect-e4-qa4.test.ts` | 26 | 3 tests; first: "E4 QA4 S6 (builds): Fit's own Bad count and Capped count lines skip steps 13+, which don't play" |  |
| `tests/editor/effect-e4-r2.test.ts` | 35 | 4 tests; first: "E4 r2 S1: the base hit is kept by its index, never its id: an id-less base hit survives a pick of the other side, gets a minted id and connect_step names it" |  |
| `tests/editor/effect-e4-r3.test.ts` | 19 | 2 tests; first: "E4 r3 S5: a count over the runtime's per-effect ceiling (PARTICLES.perEffect 48) counts 48 with a Capped count line; two Number.MAX_VALUE counts never give NaN… |  |
| `tests/editor/effect-e4.test.ts` | 71 | 9 tests; first: "E4 beats (carry d): one named beat wins; else a travel kind before the hit is travel, an at-hit step after it is hit unless it holds or fades (linger), the rest… |  |
| `tests/editor/effect-e5-qa.test.ts` | 34 | 3 tests; first: "E5 QA writer: inputs untouched, full M6 table, orphan copy, M4 held-before from before-states and orphans, pixel_scale aliases only 1-6" |  |
| `tests/editor/effect-e5-qa2.test.ts` | 14 | 1 test; first: "E5 QA Law 13: a stored history cap outside whole 1-200 reads as 200, so history stays bounded and baseSeq moves by the ops dropped" |  |
| `tests/editor/effect-e5-qa3.test.ts` | 27 | 2 tests; first: "E5 QA dice small whole numbers (Q5): exact keep/−1/+1 by u, reverse step at 0 or a bound; 4 is small, 5 and 2.5 use ±25%" |  |
| `tests/editor/effect-e5-qa4.test.ts` | 17 | 1 test; first: "E5 QA r3: a non-integer seq is dropped; redo skips prototype knobs; another live group inside a group refuses its undo; nulls drop before the first-3 cut" |  |
| `tests/editor/effect-e5-qa5.test.ts` | 15 | 1 test; first: "E5 QA builds: dice keeps negatives inside the format range; a default answer holding a value is not a value" |  |
| `tests/editor/effect-e5-writer.test.ts` | 65 | 7 tests; first: "E5 writer M6: aliases are written under canonical names (canonical wins), a boolean hold stays, the old list is kept as an orphan; seed 0 is absent, pixel_scale \" |  |
| `tests/editor/effect-e5.test.ts` | 80 | 8 tests; first: "E5 dice: same anchor + seed gives the same doc; each value stays within ±25% and its range, snapped; 0, absent and out-of-range values stay; only the layer's st… |  |
| `tests/editor/effect-e6-qa.test.ts` | 21 | 3 tests; first: "E6 QA (ruling 2, Law 13): a new effect's history is {cap: WRITER.cap (200), baseSeq: 0, ops: []}" |  |
| `tests/editor/effect-e6-qa2.test.ts` | 13 | 1 test; first: "E6 QA r3 (ruling 14): a full stored envelope loads: the owner a Save & use wrote, and one with every §8 field" |  |
| `tests/editor/effect-e6-save.test.ts` | 87 | 9 tests; first: "E6 writer no-op (QA E5 should-fix): another key order or an extra field writes nothing; a value object in another key order too; a real change still logs one op" |  |
| `tests/editor/effect-e7-carries.test.ts` | 65 | 7 tests; first: "E7 carries S3: the setup_<ULID> mint is DOM-free; 26 Crockford chars, time first so later sorts later, every random byte used, a bad clock reads 0" |  |

#### `tests/fixtures/law-bad/` (3 files, 8 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/fixtures/law-bad/core/bad.ts` | 4 | exports `hp` |  |
| `tests/fixtures/law-bad/rules/card-id.ts` | 2 | exports `CardId`, `DeckState` |  |
| `tests/fixtures/law-bad/rules/deck.ts` | 2 | exports `size` |  |

#### `tests/fixtures/law-good/` (1 files, 2 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/fixtures/law-good/rules/cardinal.ts` | 2 | exports `Cardinal`, `cardinalDir` |  |

#### `tests/fixtures/state-bad/` (1 files, 5 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/fixtures/state-bad/bad.ts` | 5 | deliberately bad fixture: direct phase writes that `check-state.sh` must catch |  |

#### `tests/fixtures/state-good/` (1 files, 4 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/fixtures/state-good/state/xgo.ts` | 4 | exports `xGo` |  |

#### `tests/fx/` (6 files, 397 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/fx/effect.test.ts` | 111 | 9 tests; first: "§A3 + §A8 SKILLRIG.md:77-84, :177, :179, :139-140 — spawn is chosen once, before any step; impact and trail only when set" |  |
| `tests/fx/landing.test.ts` | 29 | 3 tests; first: "holy-sword landing (CEO 2026-11-10): the free neighbour nearest the sword; 8 around by default, 4 sides as the option" |  |
| `tests/fx/look.test.ts` | 115 | 4 tests; first: "§A9 SKILLRIG.md:176, :110 — look channels ramp across the step with look.ease; a null channel holds the blade" |  |
| `tests/fx/options.test.ts` | 42 | 3 tests; first: "the BTF preset is current play (CEO/CoS 2026-11-09) and every preset value is an allowed value" |  |
| `tests/fx/read.test.ts` | 61 | 6 tests; first: "§A1 SKILLRIG.md:161, :163 — the JSON wins over the paragraph; the read is first { to last }" |  |
| `tests/fx/timeline.test.ts` | 39 | 2 tests; first: "§A4 + §A5 + §A6 SKILLRIG.md:176, :126, :178 — steps back to back; the hit lands at start(last) + connect × ms(last)" |  |

#### `tests/paint/` (3 files, 128 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/paint/recipe-fields.test.ts` | 18 | 3 tests; first: "recipe sample reads clean (SE-01) doc and stored match the sample" |  |
| `tests/paint/recipe-read.test.ts` | 68 | 7 tests; first: "recipe guard (SE-01) only an unreadable document fails" |  |
| `tests/paint/sample.ts` | 42 | exports `SAMPLE`, `copy`, `getPath`, `setPath`, `fieldPaths` |  |

#### `tests/parity/` (5 files, 126 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/parity/action-budget.parity.test.ts` | 11 | 1 test; first: "action-budget defaults to BTF CHESS_MOVES = 2; a bad value is unsupported" |  |
| `tests/parity/basic-attack.parity.test.ts` | 18 | 1 test; first: "defaults match BTF basicReach; inOrthogonalReach matches inBasicRange (orthogonal, not diagonal)" |  |
| `tests/parity/battle.parity.test.ts` | 26 | 1 test; first: "defaults match BTF battle numbers; per-class L3 stats install as BTF's; a 2-atk archer takes a 9-HP warrior down in 5 plain hits" |  |
| `tests/parity/line-shot.parity.test.ts` | 16 | 1 test; first: "defaults match BTF fireball spellReach / usual damage 2; inOrthogonalReach at 3 matches spellReach" |  |
| `tests/parity/step-pattern.parity.test.ts` | 55 | 1 test; first: "defaults match BTF move numbers, and default reach equals BTF straight-ray squares with bodies blocking" |  |

#### `tests/perf/` (3 files, 110 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/perf/fx-light-budget.ts` | 34 | Step 33b-2 budget (user ruling on QA M-C, option a): the suite checks the rig's counts and `judge`; the 4 ms p95 wall clock runs alone, never in `npm test`: `node tests/perf/fx-… |  |
| `tests/perf/fx-particles-budget.ts` | 27 | Step 33b-3 budget: 12 looping effects in view, each 48 particles (two steps of 30, cut to 48) plus 2 outlined, turned pieces (120 fx draws: the total budget), on a 128x128 map;… |  |
| `tests/perf/stress-budget.ts` | 49 | Step 34a stress: 200 units (20 walking), a river with shore, 100 effects (hit-stop, squash, hit-white, outline + turn, 12 particles) and a moving torch at res 4. One frame = sce… |  |

#### `tests/project/` (8 files, 283 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/project/door-guard.test.ts` | 42 | 4 tests; first: "B2: a wrong kind is object for any object or array, else the old String text, in all three readers" |  |
| `tests/project/guard.test.ts` | 39 | 4 tests; first: "current versions are accepted: map 5, stage 2, tile-project 6" |  |
| `tests/project/map.test.ts` | 32 | 2 tests; first: "the 6x9 and 12x12 fixtures load and build a grid (M8); unknown keys are dropped" |  |
| `tests/project/placements.test.ts` | 47 | 4 tests; first: "loadout fills playerSpawns in order; sides and facing; extras are not placed" |  |
| `tests/project/read-effect-qa-e7p.test.ts` | 17 | 1 test; first: "an own answers key __proto__ (JSON) does not become the values prototype or compile as steps" |  |
| `tests/project/read-effect.test.ts` | 33 | 3 tests; first: "E7p readEffect: happy path keeps id, rev and effective values; history, orphans, copiedFrom and parts stay out of values" |  |
| `tests/project/stage.test.ts` | 28 | 2 tests; first: "stage fixtures load; seed is returned as-is" |  |
| `tests/project/unit-setup.test.ts` | 45 | 2 tests; first: "readUnit: v2 subset sprite, setupIds, stats; a bad field is refused; core identity is kept" | 1a edits |

#### `tests/rules/` (19 files, 1274 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/rules/battle-p13.test.ts` | 167 | 11 tests; first: "basic-attack: default reach 1, L3 sets 2 for archer; a bad value is unsupported" |  |
| `tests/rules/battle-p14.test.ts` | 89 | 7 tests; first: "line-shot: defaults 3/2, L3 can raise them, a bad value is unsupported, mana_cost is read and ignored" |  |
| `tests/rules/battle-p16-heavy.test.ts` | 69 | 5 tests; first: "H1+H6: no ability row is noShotRow; a mid-line body does not block the aimed foe" |  |
| `tests/rules/battle-qa-build.test.ts` | 16 | QA P1-2 build pin: a unit document id that is an Object.prototype key ("constructor") still takes base HP and atk. |  |
| `tests/rules/battle-qa-p13-build.test.ts` | 36 | 2 tests; first: "qa: ChooseAction from actMenu uses selected after a move or cancel" |  |
| `tests/rules/battle-qa-p13.test.ts` | 27 | QA P1-3 pin: merchant is not interactable; no intervening-body block; HIT_FILTER_REASONS stays the frozen pair (G1 misses). |  |
| `tests/rules/battle-qa-p14.test.ts` | 24 | QA P1-4 pin, carried in P1-6 r2: a constructor/__proto__/toString document id must not throw. There is no ability row (own-key lookup), so the shot is hitRefused noShotRow — no… |  |
| `tests/rules/battle-qa-r2.test.ts` | 19 | QA P1-2 r2 pin (G1 misses d11-d13, d15): D7 precedence needs two faults at once; the reason list is frozen. |  |
| `tests/rules/battle-qa.test.ts` | 47 | 3 tests; first: "qa: a bad setup is refused, never skipped (step rule 4)" |  |
| `tests/rules/battle.test.ts` | 143 | 8 tests; first: "unit-roster: defaults 9/1, L3 sets a unit document's stats, L5 scales HP only; a bad value is unsupported" |  |
| `tests/rules/behaviours-qa.test.ts` | 33 | QA pin (B1 r3): misses Q1, Q3, Q5, Q6, Q8, Q9, Q11, Q12, Q14–Q17, Q23 of docs/qa/qa-runs/b1/r3/b1-qa-plants.py; r4: N8; r5: S5e, S5f; r7: N4b, L3, L4 (r4/, r5/, r7/ plant files). |  |
| `tests/rules/behaviours.test.ts` | 171 | 13 tests; first: "B1 registry: one id per behaviour and per knob, repeats throw; the catalogue slice is stamped rev 26" |  |
| `tests/rules/bot-p15.test.ts` | 120 | 7 tests; first: "bot-ability-priority: a spell already in reach is spent before a basic and before a step; the side gets 2 actions" |  |
| `tests/rules/bot-p16h.test.ts` | 24 | 1 test; first: "bot requires setup and ACTION_BUDGET actionsPerTurn; DEFAULT_STEP_REACH is the named step cap" |  |
| `tests/rules/bot-qa-p15.test.ts` | 39 | QA P1-5 pin: shotRow prototype keys must not crash the side; tie-breaks (path length, lowest HP, placement) were untested (G1). |  |
| `tests/rules/fuse.test.ts` | 67 | 4 tests; first: "a 30000 ms fuse fires once at 30000 sim ms" |  |
| `tests/rules/levels.test.ts` | 88 | 4 tests; first: "levels gain (step 18): bars, banking, a pick, and a pool-less climb to the top" |  |
| `tests/rules/move-qa.test.ts` | 17 | QA pin (P1-1 r5): a dead walker has no walks and no targets; an off-board aim never aliases an on-board cell. |  |
| `tests/rules/move.test.ts` | 78 | 6 tests; first: "straight walks n,e,s,w, start excluded: a teammate blocks like any body; an L cell is not in reach; sorted by row then column" |  |

#### `tests/runtime/` (2 files, 118 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/runtime/cast-fx.test.ts` | 72 | 3 tests; first: "E7p compile cache: five casts of one ref@rev compile once; a rev bump compiles again; a new sheetOf does not reuse the cache" |  |
| `tests/runtime/perf-34b.test.ts` | 46 | 4 tests; first: "light walk: the plan visits only each light's box and both op passes only the view's squares plus one margin, at the map's corners and middle, never the whole m… |  |

#### `tests/runtime/canvas/` (3 files, 211 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/runtime/canvas/canvas2d.test.ts` | 132 | 8 tests; first: "chunks draw the same pixels as per-tile drawing, from 1x 16x16-tile canvases (step 28)" |  |
| `tests/runtime/canvas/fake-canvas.ts` | 46 | exports `Raster`, `FakeCanvas` |  |
| `tests/runtime/canvas/light-canvas.test.ts` | 33 | 2 tests; first: "N-3: light fills are painted once per plan into one offscreen pair and blitted in two draws a frame, glow with lighter, inside the 300-draw budget (step 32)" |  |

#### `tests/runtime/host/` (1 files, 186 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/runtime/host/raf-driver.test.ts` | 186 | 16 tests; first: "idle: a static scene draws once after its sheets load, then 0 a second; one water tile draws 5 a second (step 29)" |  |

#### `tests/runtime/input/` (1 files, 50 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/runtime/input/gestures.test.ts` | 50 | 6 tests; first: "a tap on a unit selects it, a tap on an empty cell targets it, off the grid gives nothing" |  |

#### `tests/runtime/render/` (18 files, 943 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/runtime/render/animated-extras.test.ts` | 63 | 7 tests; first: "colour cycle bake: one frame per ramp step, ramp colours rotate, other and transparent pixels never change, a bad ramp bakes no cycle (step 32)" |  |
| `tests/runtime/render/effect-pieces.test.ts` | 69 | 6 tests; first: "item 10: pixel_scale null, absent and match-sprite play 1 quietly; '1'-'6' are aliases of 1-6; 'x' warns once and plays 1 (G2b)" |  |
| `tests/runtime/render/fake-renderer.ts` | 34 | Recording nearest-neighbour backend (step 27). |  |
| `tests/runtime/render/fx-doc.test.ts` | 33 | 3 tests; first: "E1 R1 timing: after-last chains on len + hold (a fade never delays it), with-last, at-time, at-hit after the hit; disabled steps keep their slot; the hit is con… |  |
| `tests/runtime/render/fx-path.test.ts` | 41 | 6 tests; first: "E2 readPath: only straight/swerve/bounce/orbit travel; defaults bend 0.8, linear, orbit 1.05 × 1 turn; at and ms are the step's start and len" |  |
| `tests/runtime/render/fx-player-qa.test.ts` | 35 | QA additions for step 33a (A/B pick, must-fix): the shipped test stays verbatim. |  |
| `tests/runtime/render/fx-player.test.ts` | 113 | 11 tests; first: "clip events: valid entries kept in stored order, bad entries skipped with clipEventInvalid, a non-list reads as absent, over 16 the first 16 fire (step 33a, CN… |  |
| `tests/runtime/render/fx-travel-qa.test.ts` | 26 | 3 tests; first: "E2 QA: the travel turn adds the step's own angle (ruling 8: (angle ?? 0) + deg)" |  |
| `tests/runtime/render/fx-travel-qa2.test.ts` | 18 | 3 tests; first: "E2 QA r3: ride resolves to the FIRST step with that id (ruling 10, CN-026 rule 1)" |  |
| `tests/runtime/render/fx-travel-qa3.test.ts` | 24 | plays frames `early` with the caster on column `c0`, then frame `t` with it on column 6; returns the travel piece's [x, y] |  |
| `tests/runtime/render/fx-travel.test.ts` | 49 | 5 tests; first: "E2 converter: travel steps get path {kind, at, ms = len (not hold), bend, ease}; other kinds get none; bad path values are noted per step; a disabled step is no… |  |
| `tests/runtime/render/light-walls-qa.test.ts` | 31 | QA P1 A/B (M1 follow-up): a wall bit on only ONE side of an edge stops light, on every axis and in every direction. |  |
| `tests/runtime/render/light-walls.test.ts` | 48 | P1 (G3): thin edge walls stop light. Bits per cell: n 1, e 2, s 4, w 8 (the grid's movement-wall bits). |  |
| `tests/runtime/render/light.test.ts` | 72 | 9 tests; first: "line of sight: shadowcasting stops at walls, lights the wall faces, shadows behind a pillar and moves a torch out of a wall (step 31)" |  |
| `tests/runtime/render/motion.test.ts` | 49 | 4 tests; first: "motion: a placement replaces the motion whole (null = none, absent = inherit); parts bake into one cycle × scroll × sway atlas, each with its own ms (step 32)" |  |
| `tests/runtime/render/render-core.test.ts` | 126 | 8 tests; first: "the backing store is device pixels and art pixels are s wide at DPR 1, 2, 2.625, 2.75 and 3 (step 27)" |  |
| `tests/runtime/render/render-tidy-qa.test.ts` | 19 | QA pin for G1 E4: a hinted motion message is `<name>: <hint>`, not the hint alone. |  |
| `tests/runtime/render/render-tidy.test.ts` | 93 | 9 tests; first: "item 4: the tile-foot maths lives only in footAt (frames.ts); px rounds the half tile (G1)" |  |

#### `tests/runtime/scene/` (21 files, 1376 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/runtime/scene/feel-shake-ab-qa.test.ts` | 46 | 2 tests; first: "QA 33b-1 A/B: shake_dir none, or a hit with no aim, is seeded noise from the first 30 ms step; touching holds stay apart; the far map edge is whole art px at an… |  |
| `tests/runtime/scene/feel-shake-qa.test.ts` | 33 | 2 tests; first: "QA 33b-1 (G1 r2): non-finite hit_stop_ms is no stop; only the victim squashes, also with a stop; no squash for sprites 2 px tall or less (step 33b-1)" |  |
| `tests/runtime/scene/feel-shake.test.ts` | 136 | 6 tests; first: "hit-stop: the effect, attacker and victim hold at hitAt for hit_stop_ms (view time only), then the effect plays on late; 0-150 on ticks, reduce motion 0, reduce… |  |
| `tests/runtime/scene/fx-light-qa-ab.test.ts` | 33 | QA G1 (step 33b-2 A/B, build B): the day path, the pass marks, the overlap walk, the cap, the shared empty set, plan colours, Rulings 1 and 4. |  |
| `tests/runtime/scene/fx-light-qa-r4.test.ts` | 33 | QA G1 (step 33b-2 r4 review): the self-lit pass order, depth against a unit in front, and raf-driver's day path. |  |
| `tests/runtime/scene/fx-light-qa.test.ts` | 48 | QA G1 (step 33b-2 r2 review): plants the shipped fx-light.test.ts let through. |  |
| `tests/runtime/scene/fx-light.test.ts` | 129 | 10 tests; first: "ramp colour: the step's ramp beats the effect's, a missing key is reported (fxRampMissing) and plays as absent, the light is the ramp's lightest step else #ffb… |  |
| `tests/runtime/scene/fx-particles-qa.test.ts` | 27 | QA G1 (step 33b-3 r1 review): plants Q8, Q11, Q19, Q20 and Q21 were missed by the shipped tests. |  |
| `tests/runtime/scene/fx-particles.test.ts` | 141 | 10 tests; first: "particles format: particle_motion burst/attract/spiral-in/rise (unknown plays as burst, outOfRange), particle_count 0-48 default 12, particle_life_ms 200-3000… |  |
| `tests/runtime/scene/host-hookup-qa.test.ts` | 34 | QA pins for step 33h (A/B must-fixes): attach memory per step, default attach, lap replay on the pose grid. |  |
| `tests/runtime/scene/host-hookup.test.ts` | 136 | 13 tests; first: "live canopy: seeThroughCanopy cuts the above layer at each unit's cell and the cell above it; absent or false keeps it; a still world keeps one scene object (s… |  |
| `tests/runtime/scene/match-link-qa.test.ts` | 33 | 4 tests; first: "E3 QA: rows skipped as off-map or sprite-less still claim their id; checks run invalid, repeated id, off-map, sprite; at is a fresh {c, r}; a rebuild draws the… |  |
| `tests/runtime/scene/match-link-qa2.test.ts` | 18 | 2 tests; first: "E3 QA: a non-finite matchPatch axis falls back on that axis only (3 cols or 2 rows, clamped to the map); the finite axis is kept (ruling 9)" |  |
| `tests/runtime/scene/match-link.test.ts` | 61 | 8 tests; first: "E3 sceneFromMatch (D3 shape): each unit maps to id, sprite by unitId, at, offset, facing, alive; move while offset is set, else idle; the map, objects, style an… |  |
| `tests/runtime/scene/match-patch.test.ts` | 49 | 4 tests; first: "E3 matchPatch (RISKY, M-B8): a window on the real map that holds the caster and the target when both fit, centred on the pair and clamped inside the map; its pi… |  |
| `tests/runtime/scene/motion-shore-live-qa.test.ts` | 23 | 2 tests; first: "tiles share one motion clock: sway and scroll tiles of one kind show the same pose in every column (ruling 1, QA 33i A/B)" |  |
| `tests/runtime/scene/motion-shore-live.test.ts` | 162 | 10 tests; first: "river scroll: a scroll tile draws its motion atlas 1 px per 0.2 s, every tile on the same pose, never baked into a chunk, and moonlit swaps carry it to the nig… |  |
| `tests/runtime/scene/perf-34a.test.ts` | 65 | 5 tests; first: "stress rig: draws per frame stay in budget, no notices, and the draw list hashes as on 1bd476bd, C as after G2b R5 (step 34a)" |  |
| `tests/runtime/scene/scene-fence-qa.test.ts` | 15 | 1 test; first: "E3 QA fence (ruling 13): no file in the scene folder uses a dynamic import, and match-link re-exports no value, so its only links are its type imports" |  |
| `tests/runtime/scene/scene-fence.test.ts` | 18 | 1 test; first: "the scene folder holds cast-fx, match-link and world-scene; world-scene imports only the render index and the notice type, match-link only types from world-scene… |  |
| `tests/runtime/scene/world-scene.test.ts` | 136 | Every frame pixel is unique: colour = sheet salt + frame + position, so a wrong frame, offset or flip shows. |  |

#### `tests/sim/` (29 files, 2113 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/sim/actions.test.ts` | 33 | 3 tests; first: "a move changes occupancy only at the end of its durationMs (M4)" |  |
| `tests/sim/ai.ts` | 46 | exports `forward`, `bot`, `reachFarRow`, `seedless` |  |
| `tests/sim/bot.test.ts` | 108 | 5 tests; first: "the test bot plays only through the player driver: no ai, the pinned 50-seed histories, no rejects, every logged move is a player step" |  |
| `tests/sim/chaos-gen.test.ts` | 96 | 6 tests; first: "the generator is a seeded IntentHook on its own named stream; runChaosGen records its settings; the run replays identically" |  |
| `tests/sim/chaos.test.ts` | 97 | 4 tests; first: "a clean run goes only through the player driver, checks every step and replays identically from its JSON" |  |
| `tests/sim/dispose.test.ts` | 44 | 2 tests; first: "disposeWorld (step 17): a second call does nothing; feed, submit and the drivers refuse; the log and units stay" |  |
| `tests/sim/doc-limits.test.ts` | 82 | 6 tests; first: "the door limits are read once (step 22)" |  |
| `tests/sim/door-gaps.test.ts` | 67 | P1 (G4b): post-34 QA rows 6, 7, 10, 11, 13 and 14. Each hostile input gets a named refusal: no throw, no hang, no log entry. |  |
| `tests/sim/door-guard.test.ts` | 37 | 3 tests; first: "the door's shape guard (B1): malformed is named, changes nothing, and a later tap still moves the selected unit" |  |
| `tests/sim/every-door.test.ts` | 153 | 11 tests; first: "the door copy (step 20) refuses a lying length, a hole and a poisoned prototype" |  |
| `tests/sim/exploit-docs.test.ts` | 66 | 3 tests; first: "tamperDoc: raw JSON keeps 1e400 and own __proto__; a bad path throws; the fixture is not written" |  |
| `tests/sim/exploit-levels.test.ts` | 107 | 5 tests; first: "hostile picks (step 19) cover every index text and leave a refused pick's levels alone" |  |
| `tests/sim/exploit.test.ts` | 89 | 6 tests; first: "the exploit hunter is a seeded hostile peer on its own stream: JSON text only, recorded, replayed identically; settings are the caller's" |  |
| `tests/sim/gc.test.ts` | 57 | 2 tests; first: "a finished, disposed world is collected while its clock and bus are kept; the same world without dispose is not" |  |
| `tests/sim/hard-limits.test.ts` | 108 | 9 tests; first: "the door budget (step 21) refuses a huge array at its length" |  |
| `tests/sim/input.ts` | 15 | exports `input`, `move` |  |
| `tests/sim/intents.test.ts` | 43 | 3 tests; first: "intents map to tactics events by phase (STATES §3.4); BoxSelect is a no-op that never throws" |  |
| `tests/sim/levels.test.ts` | 135 | 9 tests; first: "levelling is off unless the match opts in (step 18): no registry, no snapshot key, until it is asked for" |  |
| `tests/sim/match.test.ts` | 81 | 6 tests; first: "the phase driver gives every side the same events; the AI hook gets side and budget only (M6)" |  |
| `tests/sim/player.test.ts` | 120 | 5 tests; first: "the test AI as intents through the player driver gives the same 50-seed histories, byte for byte" |  |
| `tests/sim/recipe-caps.test.ts` | 71 | 6 tests; first: "recipe caps (step 23)" |  |
| `tests/sim/replay.test.ts` | 54 | 3 tests; first: "replaying a log reproduces the event history at non-zero ticks" |  |
| `tests/sim/save-continue-qa.test.ts` | 22 | QA pin for G4: a held fuse still lands when createTurn is given no onFuse. |  |
| `tests/sim/save-continue.test.ts` | 138 | 9 tests; first: "G4 R4 fuse during moving is held and lands at MOVE_DONE (straight to sideEnd); with no fuse MOVE_DONE goes to actMenu" |  |
| `tests/sim/script.test.ts` | 11 | 1 test; first: "the sim script's report is the 50-seed batch, byte for byte" |  |
| `tests/sim/seats.ts` | 18 | exports `asIntents`, `counter`, `seatAll` |  |
| `tests/sim/speed-memory.test.ts` | 84 | 8 tests; first: "text doors check size before the parse (step 25)" |  |
| `tests/sim/trusted-saves.test.ts` | 93 | 9 tests; first: "trusted saves (step 24)" |  |
| `tests/sim/world.test.ts` | 38 | 3 tests; first: "a world loads the step-08 fixtures and places every unit at tick 0" |  |

#### `tests/state/` (7 files, 264 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/state/flow-pins.test.ts` | 25 | 2 tests; first: "G4 R3 CLOSE from pause, from settings or saveLoad opened via pause, and from either opened directly lands in overlay.none (no back-stack)" |  |
| `tests/state/helpers.ts` | 25 | One valid Event per type. An omitted or unrecognised `next` uses the first legal pick. |  |
| `tests/state/tables.coverage.test.ts` | 59 | 3 tests; first: "ALL_PHASES and ALL_EVENT_TYPES are exhaustive" |  |
| `tests/state/tables.merge.test.ts` | 15 | 2 tests; first: "the three tables merge with no duplicate key" |  |
| `tests/state/tactics.script.test.ts` | 69 | 2 tests; first: "scripted battle reaches play.result" |  |
| `tests/state/xgo.accepts.test.ts` | 34 | 2 tests; first: "every row of every table is accepted" |  |
| `tests/state/xgo.rejected-noop.test.ts` | 37 | 2 tests; first: "no row → xGo returns from" |  |

#### `tests/tools/` (13 files, 844 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tests/tools/apk.test.ts` | 79 | 4 tests; first: "tools/apk has its own Capacitor 6 pins and the root package is unchanged" |  |
| `tests/tools/ed-e6.test.ts` | 40 | 5 tests; first: "E6 chips (UX v3 §1.1): seven intents in order; the ability kind pre-selects only when obvious; the grid filters on effect.tags (first 4 only); every intent has… |  |
| `tests/tools/ed-e7.test.ts` | 62 | 9 tests; first: "E7 page 2: layer chips (UX-L1): one per used layer in kind order with steps per beat; punch from its knobs alone; the A/B badge is the side that won the layer,… |  |
| `tests/tools/ed-s0-builds-qa.test.ts` | 19 | QA pin from the S0 builds A/B (Q8): an all-off visit (`?bold=`, `off`, `off,off`) with cap on and lite off is the |  |
| `tests/tools/ed-s0-qa.test.ts` | 32 | QA pins for S0 extras the shipped tests missed: exact budget line, no-?bold 60 s path, scored A/B needs lite off. |  |
| `tests/tools/ed-s0.test.ts` | 80 | 7 tests; first: "ED S0 flags: absent/empty/off are all off; exact tokens in engine order, trimmed, deduped; unknown fails closed with a notice; bad seed noticed and played as 0… |  |
| `tests/tools/phone-no-computer.test.ts` | 80 | Runs the real `node tools/serve.ts` until it prints a link (then stops it) or exits; preloads stand in for the phone's Node. |  |
| `tests/tools/play-stage-looks.test.ts` | 80 | Every picture the page's draw list names (chunks and plain fills aside) must load through the page's lookup. | 1b edits |
| `tests/tools/play-stage-p17.test.ts` | 86 | 6 tests; first: "camera pans, zooms, centres, follows and stays clamped" | 1b edits |
| `tests/tools/play-stage-p18.test.ts` | 85 | 4 tests; first: "refOf is exactly one effect; a constructor id does not throw; empty effects get the house default" | 1b edits |
| `tests/tools/play-stage-p19.test.ts` | 56 | 3 tests; first: "the board canvas sits between the HUD bands: row 0 is whole and below the top bar at 390 and 360 @3x; the banner is in the top band and click-through" | 1b edits |
| `tests/tools/play-stage.test.ts` | 109 | 6 tests; first: "boot seats a rules world on the bundled demo and ends in idle; docsToInput is the r73 hook" | 1b edits |
| `tests/tools/qa-35g5a.test.ts` | 36 | Runs the real CLI with git faked: HEAD is `HEAD`, and `status` prints `dirty` (a tracked edit the builder would otherwise ship). |  |

#### `tools/` (1 files, 34 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tools/serve.ts` | 34 | v22.18+ on the 22 line, v23.6+ on the 23 line, any v24+. A leading v is allowed. |  |

#### `tools/apk/` (1 files, 94 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tools/apk/build.ts` | 94 | exports `APP_ID`, `CAP`, `DEBUG_GLOBALS`, `listFiles`, `networkUrls`, `playOnly` … | imported by 1b |

#### `tools/device-page/` (6 files, 332 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tools/device-page/bold-stubs.ts` | 117 | exports `CAPS`, `BAKE`, `RAMPS`, `Ctx`, `particlesOf`, `lightsOf` … |  |
| `tools/device-page/bold-swatch.ts` | 14 | exports `SWATCH`, `panelRows` |  |
| `tools/device-page/bold.ts` | 66 | exports `Token`, `Hash`, `Flags`, `Block`, `Pool`, `Verdict` … |  |
| `tools/device-page/build.ts` | 41 | exports `ROOT`, `ENTRY`, `toHtml`, `sha`, `strip`, `ours` … |  |
| `tools/device-page/check.ts` | 33 | exports `check` |  |
| `tools/device-page/page.ts` | 61 | device test page entry: drives the renderer on the pixel-suite fixture |  |

#### `tools/effect-designer/` (7 files, 220 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tools/effect-designer/grid.ts` | 15 | exports `INTENTS`, `Intent`, `Preset`, `intentFor`, `tagsOf`, `rampChips` … |  |
| `tools/effect-designer/mixer.ts` | 40 | exports `PAGE2`, `Card`, `Chip`, `Mixer`, `chips`, `meterText` … |  |
| `tools/effect-designer/page.ts` | 104 | Effect Designer page entry (browser) |  |
| `tools/effect-designer/presets.ts` | 14 | exports `PRESETS` |  |
| `tools/effect-designer/store.ts` | 23 | exports `Dir`, `opfsStore`, `purgeTrash` |  |
| `tools/effect-designer/strip.ts` | 17 | exports `STRIP`, `View`, `VIEW0`, `turn`, `zoom`, `fitZoom` … |  |
| `tools/effect-designer/ulid.ts` | 7 | exports `B32`, `ulid`, `minter` |  |

#### `tools/host-example/` (2 files, 70 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tools/host-example/match-fx.ts` | 33 | Host guide: three scripted ability cues (stock, a saved effect, a missing ref). src never imports this. |  |
| `tools/host-example/match-picture.ts` | 37 | What the host owns and the match does not: the map's picture and one sprite per unit type. |  |

#### `tools/pixel-suite/` (4 files, 118 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tools/pixel-suite/fixture.ts` | 17 | Step 34b pixel fixture (L1 in Node, L2 in browsers): three fixed frames of one scene at s 1-3 with letterbox. Pure: no DOM, no wall time. |  |
| `tools/pixel-suite/l2.ts` | 13 | Step 34b L2: draws the fixture with the real canvas2d in this browser and hashes getImageData (sRGB) the same way L1 hashes the recording canvas. |  |
| `tools/pixel-suite/run.ts` | 52 | Step 34b pixel suite (QA L2 + L3; outside green, run before a release): node tools/pixel-suite/run.ts |  |
| `tools/pixel-suite/smoke.ts` | 36 | Step 35g5b real-clock smoke (outside green, like run.ts; run before a device run): node tools/pixel-suite/smoke.ts |  |

#### `tools/play-stage/` (10 files, 592 lines)

| File | Lines | What it does | Steps 0–1b |
|---|---|---|---|
| `tools/play-stage/board.ts` | 134 | exports `pixelsOf`, `MIN_CELL_CSS`, `HUD_TOP`, `boardBox`, `fit`, `spellRef` … | S0 edits; 1b edits; imported by 1b, S0 |
| `tools/play-stage/build.ts` | 50 | exports `ROOT`, `ENTRY`, `toHtml`, `sha`, `strip`, `ours` … | 1b edits; imported by 1b |
| `tools/play-stage/camera-touch.ts` | 24 | exports `PlayCam`, `floorS`, `createCam`, `pan`, `follow`, `seatCam` … | imported by 1b, S0 |
| `tools/play-stage/dev.ts` | 2 | Release builds set this false by deleting every dev-only line. | imported by 1b, S0 |
| `tools/play-stage/fx.ts` | 51 | exports `HOUSE_ATTACK`, `HOUSE_DOC`, `LINE_SHOT_DOC`, `FX_CLIP`, `refOf`, `fxPx` … | imported by 1b, S0 |
| `tools/play-stage/hud.ts` | 36 | exports `HudView`, `createHud` | S0 edits; imported by 1b, S0 |
| `tools/play-stage/load.ts` | 38 | exports `TILE`, `DEMO_SEED`, `TEAM`, `Recipe`, `RECIPES`, `recipeOf` … | 1b edits; imported by 1b, S0 |
| `tools/play-stage/looks.ts` | 59 | exports `WATER_RAMP`, `FLAME_RAMP`, `WASH`, `animId`, `frameOf`, `sourceOf` … | 1b edits; imported by 1b, S0 |
| `tools/play-stage/match.ts` | 119 | Orthogonal reach of the demo line-shot when a row omits reach. Not an engine rule. | S0 edits; 1b edits; imported by 1b, S0 |
| `tools/play-stage/page.ts` | 79 | play stage page entry: canvas, HUD, camera, pointer input and the rAF driver | S0 edits; 1b edits |

## (c) What steps 0, 1a and 1b change or depend on

Files from this baseline that a step edits (none is deleted):

| File | Lines | Change |
|---|---|---|
| `src/project/read/unit.ts` | 25 | 1a edits |
| `tests/project/unit-setup.test.ts` | 45 | 1a edits |
| `tests/tools/play-stage-looks.test.ts` | 80 | 1b edits |
| `tests/tools/play-stage-p17.test.ts` | 86 | 1b edits |
| `tests/tools/play-stage-p18.test.ts` | 85 | 1b edits |
| `tests/tools/play-stage-p19.test.ts` | 56 | 1b edits |
| `tests/tools/play-stage.test.ts` | 109 | 1b edits |
| `tools/play-stage/board.ts` | 134 | S0 edits, 1b edits |
| `tools/play-stage/build.ts` | 50 | 1b edits |
| `tools/play-stage/hud.ts` | 36 | S0 edits |
| `tools/play-stage/load.ts` | 38 | 1b edits |
| `tools/play-stage/looks.ts` | 59 | 1b edits |
| `tools/play-stage/match.ts` | 119 | S0 edits, 1b edits |
| `tools/play-stage/page.ts` | 79 | S0 edits, 1b edits |

Everything else in the baseline is untouched by steps 0–1b. In particular `src/` changes only in `src/project/read/unit.ts` (1a), and the rules tables and `src/runtime/input/gestures.ts` stay byte-identical (S0 brief Acceptance; `docs/qa/step-s0-handback-review.md:16`).

Baseline files imported directly (relative `import … from "./…"`) by the new or changed code of each step, but not edited. These must be present and unchanged for the steps to work:

| File | Lines | Imported by the new or changed code of |
|---|---|---|
| `src/core/log/index.ts` | 3 | 1b, S0 |
| `src/project/read/guard.ts` | 49 | 1a |
| `src/project/read/index.ts` | 11 | 1a |
| `src/rules/battle/battle.ts` | 74 | 1b |
| `src/rules/battle/index.ts` | 10 | 1b, S0 |
| `src/rules/behaviours/index.ts` | 5 | 1b |
| `src/rules/behaviours/registry.ts` | 102 | 1b, S0 |
| `src/rules/behaviours/terrain.ts` | 21 | 1b |
| `src/rules/move/path.ts` | 35 | 1b, S0 |
| `src/rules/move/step-pattern.ts` | 20 | 1b, S0 |
| `src/rules/turns/action-budget.ts` | 12 | 1b, S0 |
| `src/rules/turns/bot-ability-priority.ts` | 118 | 1b, S0 |
| `src/runtime/host/raf-driver.ts` | 103 | 1b, S0 |
| `src/runtime/input/gestures.ts` | 48 | 1b, S0 |
| `src/runtime/input/types.ts` | 29 | 1b, S0 |
| `src/runtime/render/bakes.ts` | 76 | 1b, S0 |
| `src/runtime/render/fx-doc.ts` | 66 | 1b |
| `src/runtime/render/index.ts` | 20 | 1b, S0 |
| `src/runtime/render/light.ts` | 88 | 1b |
| `src/runtime/render/types.ts` | 36 | 1b, S0 |
| `src/runtime/render/world-motion.ts` | 75 | 1b |
| `src/runtime/scene/world-scene.ts` | 132 | 1b, S0 |
| `src/sim/actions.ts` | 34 | 1b, S0 |
| `src/sim/index.ts` | 20 | 1b |
| `src/sim/player.ts` | 96 | 1b, S0 |
| `src/sim/types.ts` | 202 | 1b, S0 |
| `src/sim/world.ts` | 66 | 1b, S0 |
| `src/state/index.ts` | 6 | 1b, S0 |
| `src/types/core-types.ts` | 405 | 1b, S0 |
| `tools/apk/build.ts` | 94 | 1b |
| `tools/play-stage/camera-touch.ts` | 24 | 1b, S0 |
| `tools/play-stage/dev.ts` | 2 | 1b, S0 |
| `tools/play-stage/fx.ts` | 51 | 1b, S0 |

Step 1a also adds `fixtures/demo.tileproj/**` and new folders `src/project/load/` and `tools/project/`, which don't exist at the baseline.

## (d) Verify the baseline

```
git rev-parse HEAD                 # 1b834c3162c33e698a6c389a286c63fc8dc994f4
git rev-parse HEAD^{tree}          # 12f833ed16245c1ca1caeb3b01bfa7a9f82f8b87
git status --porcelain             # empty
npm ci                             # exit 0
npm test                           # tests 1014, pass 1014, fail 0
npm run lint                       # exit 1: 15 errors, all in ui-shell/mock-effects-v3/js/fx-render.js and fx-ui.js
```

Re-run on 2026-11-19 at this commit: `npm ci` exit 0, `npm test` 1014 pass / 0 fail, `npm run lint` 15 errors (exit 1).

The lint errors are expected at this commit and aren't the rebuild's fault (`handback/s0-play-input/r1/HANDBACK.md:17`, `docs/qa/step-s0-handback-review.md:19-24`). So at the baseline and through S0, `npm run green` stops at lint; judge it by `npm test`, typecheck, deps, `check:state` and `check:law`. Main fixed it later with a one-line eslint ignore for `ui-shell/**` in `8a737c5f`, which is before step 1a's base, so from step 1a on `npm run green` must exit 0.

Without devDependencies the count is different: 1007 tests, 1005 pass and 2 fail (`tests/gates.test.ts` and `tests/runtime/perf-34b.test.ts` need eslint and typescript) (S0 brief, `docs/maker/steps/step-00-play-input.md:17`). Always run `npm ci` first.
