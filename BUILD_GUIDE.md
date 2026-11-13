# BUILD_GUIDE.md — TileEngine engine (read this first, every session)

Owner: Engine Architect. Guide version: **guide-3 (2026-11-13, CN-016)**. This file sits at the repo root and is the only copy; `handoff/BUILD_GUIDE.md` is a one-line pointer to it. Re-read it every 5–7 steps. If a step file and this guide disagree, stop and say so in your Decisions note; the Architect answers with a Change Notice. Never resolve a conflict silently.

## 0. Working style
- Use all your available helper agents: in parallel for review, for tests and for cross-checks.
- Take your time. Never rush.
- Before every hand-back, review your own work against the step's **Acceptance** list and the QA checklist (`docs/qa/handback-checklist.md`).
- Token and usage cost is not a constraint. Prefer thoroughness over speed.
- The step size stays the same (§7), and 1–3 steps per session. Extra time goes into quality, not bigger steps.

## 1. Goal and priority
TileEngine is an engine and editor for making grid games. You are building the **engine**: the core spine (pure TypeScript that runs headless, no DOM; steps 00–26) and, since steps 27–29, the runtime on top of it (`src/runtime/render`, `canvas`, `host`, `scene`).
Priority order (CEO, 2026-11-09), never reordered: **1. grid tactics** (Fire Emblem-style) → **2. idle RPG** (auto-combat on clock ticks) → **3. tower defence** (paths and waves). Menu turn RPG and RTS are **parked**. Build only what the current step asks. Code for a later mode is scope creep (REJECT), but nothing you build may block a later mode (§4, M1–M9).

## 2. Engine laws (non-negotiable; every step; QA checks them)
1. **One clock.** All time comes from `src/core/clock`. **Sim time is integer milliseconds everywhere, never seconds or floats** (CN-001): `advance(dtMs)` takes an integer ≥ 0 and timers take integer ms. `setTimeout`, `setInterval`, `queueMicrotask`, `Date` (incl. `new Date`, `Date.now`) and `performance.now` are banned everywhere in `src/`. `requestAnimationFrame` / `cancelAnimationFrame` are banned in `src/` **except in the single file `src/runtime/host/raf-driver.ts`** (the host driver, built in step 29; owns the frame loop; ESLint and `check:law` carry the same one-file exception). Every timer — the turn fuse (`FUSE_EXPIRE`), tower defence's `BUILD_TIMER_EXPIRE`, any other — is a sim-time timer on the one clock, never wall time. **Game speed x1/x2/x3** is the clock's `timeScale`: it runs more fixed steps per host frame and never changes the step size. Offline catch-up (later) is host-supplied elapsed ms, capped by a project setting; core never reads wall time.
2. **One address: `{c, r}`.** `c` = column (0 = left, grows right), `r` = row (0 = top, **grows downward**). Stored cells are integers. Grids are row-major: `i = r * cols + c`. No other cell type in core (no `{lane, col}`, no `{col, rank}`); those are label adapters outside core.
3. **UNIT and TILE are the only targeting pipes.** UNIT follows a living body; a dead target is never hit at its old cell. TILE picks a cell at cast; on arrival a living occupant is hit, an empty cell misses. No third pipe, no "blink" flags, no extra target modes.
4. **No game rules in core.** `src/core` never names `hp`, `mana`, `cost`, `deck`, `damage`, `card` (lint + grep). Stats and resources are project data handled above core. So are game-rule values such as the turn fuse length (the BTF preset's 60000 ms) and the bot's opening formation (`unit-roster.opening_row`: `back` / `second` / `front`, DSK): presets and projects hold them; core takes them as inputs and has no defaults for them.
5. **Events, a command log and a seeded RNG.** Every player or AI action is a command written to the log; replay of the log with the logged seed reproduces the match exactly. Randomness only from `src/core/rng` (mulberry32). No `Math.random`.
6. **Layer rules** (§3) are enforced by dependency-cruiser, ESLint and `check:law`. A back-edge is a REJECT.
7. **Adapter rule.** Before The Fall (BTF) code is reused only through thin adapters in `src/btf-adapters/`. **There is no frozen copy of BTF's effect-order file** (`chess/skillrig/spec.ts`, CEO 2026-11-09): the effect order is rebuilt from the design docs (`docs/effect-order-from-docs.md` outside this repo) and its gaps are flagged to CoS. Any other vendored helper needs its own ruling and a provenance record. Never copy a BTF/chess tree or function into engine code. Nothing in this repo reads `/workspace/g-tile-engine` or `/workspace/towerchess*`.
8. **Offline-first.** No network calls outside `src/net/` and `src/platform/` (neither exists yet). No storage outside `src/platform/`.
9. **Presentation is a swappable module.** Menu vs cards lives outside core and rules. Core and rules never mention hand, deck or card.
10. **Maximum user freedom: warn, don't block.** Where the data allows an alternative, the engine accepts it and returns a warning (`notices`), not an exception. Throw only where the game truly can't run (a hard error) or on a programming error.
11. **Own entry and pack.** Engine code lives in this repo with its own entry (`src/index.ts`). No imports from game, editor or BTF code.
12. **No silent defaults.** Every constant, timeout, size or ordering you choose that the step didn't give is named in the Decisions note with its value and reason.
13. **Bounded runtime memory.** In `src/runtime/**` every cache or memo has a bound the step states (one slot, or an entry or byte cap), and nothing retained grows with frames or edits. Anything you replace or dispose is released: canvases shrunk to 0×0, buffers dropped, listeners removed. State the bound in the Decisions note. (Unbounded growth was a QA finding in s30 F-1, s31 F-2 and build A, and s32 F-1.)

### 2.1 Modes Designer constraints M1–M9 (MODES-v1; also engine law)
- **M1 Scheduler supports turns and ticks.** The one clock drives both: turn-based logic advances on events; tick-based logic subscribes to fixed sim ticks. Tactics never owns the clock.
- **M2 No phase logic in core.** `src/core/**` has no `phase` identifier and never imports `src/state` or rules. Phases live in the state tables (§5) and rules.
- **M3 Position = cell + optional offset.** A unit's logic position is one cell; an optional sub-cell `offset {dx, dy}` (fractions of a tile, draw/tween only) never changes occupancy. Occupancy is keyed by cell; there is one occupancy table.
- **M4 Actions are data with a duration.** `{ id, kind, actor, target, durationMs | turns, effects[] }`. Animations consume the duration on the one clock; a move updates occupancy at the end of its duration. The command log records the action object. No "instant only" assumption in core.
- **M5 The camera is a hook.** `worldToScreen` / `screenToWorld` / `setFocus`; tactics camera is swappable. (Runtime, later.)
- **M6 The AI is a hook with no turn assumption.** `proposeActions(world, side, budget)`; works from a phase driver and from a tick driver. The AI port has no `phase` parameter. The AI emits the same events/commands as a player.
- **M7 Input is intents: tap, drag or box-select.** The input layer emits `SelectUnit`, `TargetCell`, `Confirm`, `Cancel`, `BoxSelect` — never raw DOM to core. Tap-tap and drag produce identical intents. BoxSelect may no-op in tactics but must exist.
- **M8 Grid size and tile px are settings.** Core accepts any `cols × rows`; tile px default **64** is a setting, never a core constant. No `COLS = 6`.
- **MODES-v2 hooks (no idle/TD features in v1 steps):** `play.running` is the shared tick mode; map-level `paths[]` and a future `src/core/path` must not be precluded; occupancy is a policy (v1 implements `strict1` only; `softStack`, `laneSlots` later); the event bus takes a mode-registered typed event map; step 09 defines `SimSnapshot` and headless `replayTicks(n)` / `advance(ms)`.
- **M9 Presentation (menu vs cards) stays outside core.** Same ability via menu or cards gives an identical `submit` payload apart from `via`.

## 3. Folder layout and layers
One npm package for now (layers are folders; a later Change Notice may split them into workspace packages).
```
BUILD_GUIDE.md          this file (root; the only copy, `handoff/BUILD_GUIDE.md` points here)
docs/STATES.md          state tables (copied from the design repo; do not edit)
src/index.ts            engine entry: ENGINE_NAME, ENGINE_VERSION
src/types/core-types.ts Data & Save Keeper's core types — verbatim copy, never edited (sha256 pinned in tests/smoke.test.ts)
src/core/               clock, grid, unit, targeting, events, log, rng       → may import: src/types
src/state/              *.table.ts, types.ts, xgo.ts                          → may import: src/types
src/project/read/       read-only project reader (current-version docs only)  → may import: src/types, src/core/notice.ts (Notice type only; CN-005)
src/rules/              (later) turn drivers, stats by name                   → may import: core, state, fx, types
src/fx/                 effect-order reader, timeline and options (engine sequencing data, no game rules) → may import: src/types, src/core (CN-007)
src/paint/              sprite recipes: reader, guard and caps (later: rasteriser, bank); integer maths only → may import: src/types, src/core/notice.ts (Notice type only); imported only by runtime, editor and btf-adapters (CN-008)
src/runtime/input/      pure input intents + gesture mappers (plain pointer data, no DOM) → may import: src/types, src/core (CN-006)
src/runtime/render/     pure render core, flat files (step 27)           → imports only `./<file>.ts` in its own folder; no DOM, wall time or globals (CN-016)
src/runtime/canvas/     Canvas2D backend and chunk cache (step 28)       → imports only `../render/index.ts` and its own folder (CN-016)
src/runtime/host/       `raf-driver.ts` only, the one frame loop (step 29) → imports only `../../core/clock/index.ts`, `../canvas/canvas2d.ts`, `../render/index.ts` (CN-016)
src/runtime/scene/      world → scene link, `world-scene.ts` only (step 30) → imports only `../render/index.ts`, `../../core/notice.ts`; no game words (CN-016)
src/sim/                headless sim harness (tests and tools only)           → may import: core, state, project, rules, runtime/input, types; nothing imports sim
src/btf-adapters/       thin src/ wrappers (+ vendor/ only for a separately ruled helper, with PROVENANCE.md) → imported only by runtime/editor (later)
scripts/                check-state.sh, check-law.sh (+ the src/paint ban list, CN-008), sim.ts (`npm run sim`: tools only, may import src/sim and tests/; not part of green; CN-006)
tests/                  *.test.ts mirroring src/; tests/fixtures/ (excluded from tsc and lint)
handback/<step-id>/r<N>/ your hand-back for that step (`HANDBACK.md`; its shape is in `handoff/HAND-BACK.md`); ignored by lint, excluded from the size cap
handoff/steps/tests/<step-id>/ the step's shipped tests, laid out at their repo paths (§8); copy them, never edit them
README.md               owned by Chief Of Staff; never edit
```
The four runtime folders have **no dependency-cruiser rule of their own**; only its global rules apply (`no-circular`, `nothing-imports-sim`, `no-tests-in-src`, and paint and btf-adapters may be imported only from runtime or editor). Their import lines above are enforced by four fence tests: `tests/runtime/render/render-core.test.ts` ("the render core stays pure…"), `tests/runtime/canvas/canvas2d.test.ts` ("the canvas lives only in the backend and the host driver…"), `tests/runtime/host/raf-driver.test.ts` ("the host folder holds only the driver…") and `tests/runtime/scene/scene-fence.test.ts`. Changing a fence needs a CN.

Naming: files `kebab-case.ts`; state tables `src/state/<name>.table.ts`; tests `tests/<area>/<file>.test.ts` (step 00's root tests stay at `tests/*.test.ts`). Types and interfaces `PascalCase`, functions `camelCase`, event types `SCREAMING_SNAKE`. No default exports. Imports of local files use the `.ts` extension (`import { x } from "./x.ts"`), and type-only imports use `import type`. No `enum`, `namespace` or parameter properties (`erasableSyntaxOnly`).

## 4. Types: one source
- Format types, `OccupancyPolicy` and the core event maps (`CoreEventMap`: `landedOn`, `pushBlocked`, `enteredLane`, `actionLogged`; augmentable `ModeEventMap`; `EventUnion`), `ActionKind` and `LogSeq` (1-based; a save's `logSeq` 0 = none applied), and `UnitId` (the one unit-document-id alias; never declare your own). **`CoreDeck` is not for the core:** it belongs to the future card-hand presentation and the data loader. No code in steps 00–07 imports `CoreDeck` or any deck/card type (`check:law` gate `no-card-types`), because rules never depend on cards come only from `src/types/core-types.ts` (Data & Save Keeper). **Import them; never redefine them.** Respect the tags: `STABLE` fields may be relied on; `MAY-MOVE` fields must be read through one small accessor so a later change touches one place.
- **VersionGuard:** the reader accepts a document only when `formatVersion` equals `CurrentFormatVersions[kind]`. Anything else returns `needsMigration` and nothing else. The core never migrates or patches.
- Rulings already in the types: `facing` is optional on placements (`null` = no facing); sides are `player`, `rival` and the reserved `neutral`; `ResolvedPlacement` is a core runtime type; `stage.seed` is optional (absent = fresh seed at play start); `settings.wrapEdges` is ignored in v1 with warning `wrapEdgesIgnored`; footprints are 1×1 only (anything else warns and plays 1×1).
- The command-log header is `{ seed, formatVersion, engineVersion, projectHash }` (defined by the events/log step).

## 5. State rule (exact)
- Tables live only in `src/state/<name>.table.ts`. The only transition function is:
```ts
export function xGo(from: Phase, event: Event): Phase
```
  in `src/state/xgo.ts`, with `Phase` and `Event` from `src/state/types.ts` exactly as quoted in `docs/STATES.md` §4.
- A rejected edge returns `from` unchanged (no throw).
- **Never assign to a variable or property named `phase`** anywhere in `src/` (`let phase = …`, `x.phase = …`, `phase++`, `Object.assign(…phase…)` all fail `npm run check:state`). The sanctioned way to keep a result: `const next = xGo(s.phase, e)` then a new snapshot `{ ...s, phase: next }`. No `as Phase` casts. No second transition function.
- `Event` (state input) shadows the global DOM/Node `Event`; always import it explicitly. Core bus events are exactly DSK's `CoreEventMap` (`EngineEventMap`, union `EngineEvent`); modes add their own typed map (`ModeEventMap`) through the bus registry.

## 6. Commands and what "green" means
| Command | What it runs |
|---|---|
| `npm test` | `node --test "tests/**/*.test.ts"` (Node ≥ 22.18 type stripping; no build step) |
| `npm run typecheck` | `tsc --noEmit -p tsconfig.json` (strict, ES2022, no DOM lib) |
| `npm run lint` | `eslint --max-warnings 0 .` |
| `npm run deps` | `depcruise src --config .dependency-cruiser.cjs` |
| `npm run check:state` | `sh scripts/check-state.sh` — QA's xGo grep, verbatim |
| `npm run check:law` | `sh scripts/check-law.sh` — one clock, seeded RNG, offline, no storage, no eslint-disable, no BTF paths, core has no rules or phase words |
| `npm run green` | all six above, in that order |

**Green = every command above exits 0, `npm test` reports 0 failed, 0 skipped and 0 todo, and no test was added with `.only`/`.skip`/`.todo`.** Run `npm ci` first in a fresh checkout. `rg` (ripgrep) must be installed for the two check scripts.

Allowed dev dependencies (exact versions; anything else needs a Change Notice): `typescript 6.0.3`, `eslint 10.14.0`, `typescript-eslint 8.72.2`, `dependency-cruiser 18.7.2`, `@types/node 24.19.2`. No runtime dependencies.

## 7. Never do
- Never edit `src/types/core-types.ts`, `docs/STATES.md`, `BUILD_GUIDE.md`, `scripts/check-state.sh`, or a vendored file — they change only by Change Notice.
- Never loosen `tsconfig.json`, ESLint or dependency-cruiser rules; never add `// @ts-ignore`, `@ts-expect-error`, `any` casts, `eslint-disable` or `skipLibCheck`.
- Never touch files outside the step's "Files to create or change" list. Never revert, delete or "simplify" something the step doesn't name (BTF BUILD_LAW 1, 4).
- Inside a named file, follow the step's Interfaces and Rulings exactly. The step text wins over a contract you infer (for example "the host keeps identities stable"); name any difference in the Decisions note.
- **Extend, don't rewrite.** Change an existing file in place: add to it and edit the lines the step names. Don't rewrite or restructure it unless the step says so.
- Never treat a suggestion as a ticket. The optional "next step" in your hand-back is a proposal only.
- Never invent a type the core-types file or the step already defines.
- Never add a dependency, a network call, storage, a timer, a second clock, `Math.random`, or a game rule word in core.
- **Size and caps (the one rule).** A step is 150–400 changed lines (insertions plus deletions; `handback/` and the lockfile excluded; the shipped tests you copy in count). Up to 400 is normal; 400–500 needs a written reason (in Decisions); over 500 is rejected. Each file's cap is the proto's line count plus 4, written in the step's Files list. A re-based cap gives its reason in the step file. Never trim a test to fit.

## 8. How a step works (details in the step file and `handoff/HAND-BACK.md`)
- **Repo:** https://github.com/G-TileEngine/tileengine (visibility is the CEO's call). `main` changes only by merged PR; never push to `main`.
- **Base commit:** `main`'s SHA after the previous step was accepted (written in each step file; step 00's base is `main` @ the commit Chief Of Staff pushes with the kit).
- **Branch:** `step/<step-id>-r<N>` from the base (`r1` first; a rework after a REJECT is `r2`, `r3`…). **Delivery (CN-003):** you read the repo but do not push. Finish with `git bundle create <step-id>-r<N>.bundle <base>..step/<step-id>-r<N>`, check it with `git bundle verify`, and upload the bundle plus a copy of your `HANDBACK.md` to the CEO's Drive. Chief Of Staff pushes the branch and opens the PR to `main`.
- **Hand-back:** `HANDBACK.md` and its files go **in the repo** at `handback/<step-id>/r<N>/` on that branch, as the branch's last commit.
- **Shipped tests.** Each step ships the QA-reviewed proto test files verbatim under `handoff/steps/tests/<step-id>/`, at their repo paths (for example `handoff/steps/tests/step-33-x/tests/runtime/host/x.test.ts` → `tests/runtime/host/x.test.ts`), named with their sha256 in the step's Tests section. Take them from `origin/main` (the kit commit), copy them in unchanged, and make them pass. You may **add** tests, in new files or after the shipped ones. Never weaken, rename, skip or delete a shipped test or assertion. A weakened, renamed or deleted shipped test is a REJECT unless the step's 'Existing tests changed by ruling' names it; a failing shipped test is a must-fix. The hand-back lists each shipped file's sha256, unchanged.
- Each step file has the sections in `handoff/STEP-TEMPLATE.md`. Hand back: the changed-file list, raw `npm test` and `npm run typecheck` output, the other green commands' output, a 5–10 line **Decisions & deviations** note, the head commit, and an optional next step.

## 9. Design docs (pointers; you don't need to read them to do a step)
The step file quotes everything binding. For background only, in this repo: `docs/STATES.md`, `docs/core-spine-slices.md` (step plan) and `docs/qa/handback-checklist.md` (how QA judges a hand-back; QA owns it, this is a copy). Outside this repo, owned by other roles: `tileengine/docs/ARCHITECTURE-v0.md` (§0 laws, §1–2 layers, §2.3 clock, §7 BTF reuse, §12.8 walls, §12.10 effects), `tileengine/data/project-format.md` and `core-types.ts` (Data & Save Keeper), `tileengine-modes/MODES-v1.md` (M1–M9). ARCHITECTURE package paths (`packages/core/...`) map to `src/<layer>/` in this single package until a Change Notice splits packages; `src/runtime/host/` maps to the future platform package.
