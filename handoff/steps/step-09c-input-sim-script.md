# step-09c-input-sim-script: input intents and touch-first gesture mappers (M7), intents → tactics events, the `sim` script

Step id: step-09c-input-sim-script          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `7944f79` on `main` (step-09b-match-drivers r1 merged, PR #11); the diff is always `7944f79..<head>`
Branch: `step/step-09c-input-sim-script-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-09c-input-sim-script-r<N>.bundle 7944f79..step/step-09c-input-sim-script-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-09c-input-sim-script/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-01-state-tables (`xGo`, `Phase`, `Event`), step-09-sim-harness, step-09b-match-drivers (`runMatch`, the test AI and rule in `tests/sim/ai.ts`)
Read first: BUILD_GUIDE.md §2 laws 1, 4, 8, 12, M7, M8; §3 (the `src/runtime/input/`, `src/sim/` and `scripts/` rows, CN-006); §5; `docs/STATES.md` §3.3, §3.4; `handoff/change-notices/CN-006-input-layer-sim-script.md` (attached; binding)
Kit: kit-2, 2026-11-10. Engine Architect. The interfaces below were prototyped and run green (`npm run green`, 132/0) on Node 24.22.1 on top of `main` `7944f79`, against `src/types/core-types.ts` sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (CN-004): every type quoted here is unchanged. `main` `7944f79` is green with it (Architect check, 123/0).
Carries: CN-006 (attached; `change-notices/CN-006-input-layer-sim-script.md`): one line in `.dependency-cruiser.cjs`, one line in `package.json`, the new `scripts/sim.ts`, and three BUILD_GUIDE §3 lines (Chief Of Staff publishes the GUIDE; you do not edit it). The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Give the player a way in. `src/runtime/input` is a new pure layer: the five M7 intents (`SelectUnit`, `TargetCell`, `Confirm`, `Cancel`, `BoxSelect`) and `createGestureMapper`, which turns plain pointer samples (touch first; pen and mouse the same) into intents, so that tap-tap and drag-to-target give **identical** intents and a hold-then-drag gives a `BoxSelect`. `src/sim/intents.ts` maps an intent to the tactics `Event` it means in the current phase (STATES §3.4) and moves `world.phases` with `xGo`. `npm run sim` prints the 50-seed batch report (outcome counts and a history hash per fixture). This step also makes a missing battle phase a hard error in `runMatch` (port from step 09b's other build).

Rulings in this step (2026-11-10):
- **Layer (CN-006):** `src/runtime/input/**` may import `src/types/**` and `src/core/**` only (in practice it needs only `Sq`). It has no DOM, no `Date`, no timers, no `node:` modules: the host passes plain numbers. `src/sim` may import it; `src/core`, `src/state`, `src/project` and `src/rules` may not. Nothing imports `src/sim`, so the intent → event mapping (which needs `Phase` / `Event` from `src/state`) lives in `src/sim/intents.ts` for now.
- **Thresholds are options (CEO: user-pickable, no hardcoded rules):** `cellPx` (M8: tile px is a setting), `tapMaxPx` and `holdMs` come only from `GestureOptions`, with no defaults anywhere in `src/` (law 12). Test values live in tests only. No numeric literal other than `0`, `1`, `2` appears in `src/runtime/input` (comments included).
- **Time:** `PointerSample.ms` is integer host ms supplied by the caller and never goes back; the mapper never reads a clock. The one sim clock is untouched (input is not sim time).
- **Mobile first:** one gesture at a time, owned by the first pointer down; a second finger is ignored until it ends (pinch/pan are the camera's, later). `cancel` drops the gesture with no intent.
- **No game rules:** intents carry ids and cells only; `BoxSelect` is a no-op in tactics (reserved for RTS) and never throws. The `sim` script uses step 09b's test AI and test rule (`tests/sim/ai.ts`); nothing game-like moves into `src/`.
- **Hard error on a missing battle phase (port):** `runMatch` and `feedIntent` throw `Error("<fn>: battle phase missing")` when `world.phases.battle` is absent, instead of falling back to `"play.loading"`.

## Files to create or change
- change `.dependency-cruiser.cjs`: the one CN-006 line, exactly as in the CN (1 insertion)
- change `package.json`: the one CN-006 `sim` script line (1 insertion)
- create `scripts/sim.ts`: `report(n, fuse)` and the run-when-executed entry (≤ 34 lines)
- create `src/runtime/input/types.ts`: exactly the quoted file (≤ 34 lines)
- create `src/runtime/input/gestures.ts`: `createGestureMapper` (≤ 50 lines)
- create `src/runtime/input/index.ts`: re-exports (≤ 6 lines)
- create `src/sim/intents.ts`: `intentEvent`, `feedIntent` (≤ 32 lines)
- change `src/sim/index.ts`: export `feedIntent`, `intentEvent` (≤ 5 changed lines)
- change `src/sim/driver-phase.ts`: the missing-phase throw (≤ 7 changed lines)
- create `tests/runtime/input/gestures.test.ts` (≤ 54 lines), `tests/sim/intents.test.ts` (≤ 50 lines), `tests/sim/script.test.ts` (≤ 16 lines)

Size: ≤ 300 changed lines in total, counting insertions + deletions; the per-file caps above (with the two CN lines) add up to 290 (prototype: 233). No new fixtures. If you pass ~280, say so in Decisions.

## Interfaces to match (quoted exactly)
From core-types: `Sq`. From step 01: `Phase`, `Event`, `xGo`. From step 09/09b: `SimWorld`, `createWorld`, `runMatch`; `tests/sim/ai.ts` (`forward`, `reachFarRow`, `seedless`) and `tests/sim/input.ts` (`input`). Import these; never retype them.
```ts
// src/runtime/input/types.ts — the whole file
import type { Sq } from "../../types/core-types.ts";

/** M7: what the player means, never raw DOM. Tap-tap and drag-to-target give the same intents. */
export type Intent =
  | { readonly type: "SelectUnit"; readonly unitId: string }
  | { readonly type: "TargetCell"; readonly at: Sq }
  | { readonly type: "Confirm" }
  | { readonly type: "Cancel" }
  | { readonly type: "BoxSelect"; readonly from: Sq; readonly to: Sq };

/** Plain pointer data from the host (touch first). x, y: px from the grid's top-left; ms: integer host ms. */
export type PointerSample = {
  readonly kind: "down" | "move" | "up" | "cancel";
  readonly id: number;
  readonly pointer: "touch" | "pen" | "mouse";
  readonly x: number;
  readonly y: number;
  readonly ms: number;
};

/** Every threshold is the caller's (project or user setting); src has no defaults. */
export type GestureOptions = {
  readonly cellPx: number;
  readonly tapMaxPx: number;
  readonly holdMs: number;
};

export type GestureBoard = { readonly cols: number; readonly rows: number; unitAt(at: Sq): string | undefined };
export type GestureMapper = (sample: PointerSample) => readonly Intent[];
```
```ts
// src/runtime/input/gestures.ts, src/sim/intents.ts, scripts/sim.ts — exported declarations
export function createGestureMapper(opts: GestureOptions, board: GestureBoard): GestureMapper;
export function intentEvent(phase: Phase, intent: Intent, aim: Sq | null): Event | null;
export function feedIntent(world: SimWorld, intent: Intent, aim?: Sq | null): Event | null;  // aim defaults to null
export function report(n: number, fuse: number): string[];
```
`src/runtime/input/index.ts` re-exports the five types and the one value `createGestureMapper`. `src/sim/index.ts` adds exactly the values `feedIntent` and `intentEvent` to its step-09b exports.

Behaviour (exact; each line has a test):
1. **Options:** `createGestureMapper` throws `RangeError` unless `cellPx > 0`, `tapMaxPx >= 0` and `holdMs` is an integer > 0. Every sample's `ms` must be an integer ≥ the previous sample's (the first may be any integer ≥ 0), else `RangeError`.
2. **Cells:** `{ c: floor(x / cellPx), r: floor(y / cellPx) }`; a cell outside `0 ≤ c < cols`, `0 ≤ r < rows` is `null` (no intent). The host gives grid-local px (camera transforms are the host's, M5).
3. **Ownership:** `down` starts a gesture only when none is open; samples of any other `id` are ignored (`[]`). `move` never emits. `cancel` (of the owner) ends the gesture with `[]`.
4. **Mode:** while the gesture is still a press, each later sample of the owner checks `far` = squared distance from the down point `> tapMaxPx²` and `held` = `ms − downMs ≥ holdMs`; if either is true the mode becomes `box` when `held`, else `drag` (decided once).
5. **On `up`:** `press` (a tap) → the start cell's unit id as `SelectUnit`, else `TargetCell` at the start cell. `drag` → `[SelectUnit(start unit), then the end cell's SelectUnit/TargetCell]`, or `[]` if the start cell has no unit or the end cell is `null`. `box` → `[{ BoxSelect, from: start cell, to: end cell }]` (a hold with no movement gives `from` = `to`), or `[]` if either cell is `null`. Pointer kind (`touch` / `pen` / `mouse`) never changes the result.
6. **intentEvent (STATES §3.4):** `SelectUnit` → `SELECT_UNIT`; `Cancel` → `CANCEL`; `BoxSelect` → `null`; `TargetCell` → `TAP_MOVE_CELL` in `unitSelected`, `CONFIRM_TARGET { pipe: "tile", at }` in `targeting`, else `null`; `Confirm` → `CONFIRM_TARGET { pipe: "tile", at: aim }` in `targeting` when `aim` is not null, else `null`. Cells in events are fresh `{ c, r }` objects.
7. **feedIntent:** reads `world.phases.battle` (missing → `Error("feedIntent: battle phase missing")`), maps with `intentEvent`, and if the event is not null sets `world.phases = { ...world.phases, battle: xGo(battle, event) }`; returns the event. It submits no action (a player driver that turns `TAP_MOVE_CELL` into a move is later).
8. **runMatch port:** when `world.phases.battle` is absent at any event, throw `Error("runMatch: battle phase missing")` (step 09b fell back to `"play.loading"`).
9. **scripts/sim.ts:** `report(n, fuse)` throws `RangeError` unless `n` is an integer ≥ 1. For `stage-fixed` (sides `player, wolves`) then `stage-weighted` (sides `player, rival`), for seeds 1..n: `createWorld(seedless(input(stage, seed)))`, `runMatch` with `ai: forward(seed)`, `victory: reachFarRow`, the given `fuse`, `maxRounds: 40`, `maxSimMs: 600000`; count outcomes and collect `world.bus.history()`. Each line is `` `${stage} seeds 1-${n}: win ${w} lose ${l} draw ${d} timeout ${t} history ${sha256hex(JSON.stringify(histories))}` ``. Run as a program (`process.argv[1]` is this file), it prints `report(Number(argv[2] ?? "50"), 60000)` one line per stage (60000 = the BTF preset turn timer, named in the script).

## Tests that prove it is done
Run: `npm test`, or `node --test tests/runtime/input/*.test.ts tests/sim/*.test.ts`. Gesture tests use `{ cellPx: 64, tapMaxPx: 10, holdMs: 500 }` (test values only), a 6×9 board with `knight#1` at (0,8), and pointers at cell centres (`cell * 64 + 32`) unless stated.
- `tests/runtime/input/gestures.test.ts`
  - "a tap on a unit selects it, a tap on an empty cell targets it, off the grid gives nothing": (0,8) → `[SelectUnit knight#1]`; (2,3) → `[TargetCell (2,3)]`; (6,0) → `[]`.
  - "tap-tap and drag-to-target give identical intents (M7)": tap (0,8) at 0–90 ms, tap (0,7) at 400–480 ms; drag from (0,8) with moves at 40, 80 (30 px up) and 160 ms, up on (0,7) at 200 ms; the same drag with `pointer: "mouse"`. All three give exactly `[SelectUnit knight#1, TargetCell (0,7)]`.
  - "hold then drag is a BoxSelect; a hold without moving boxes one cell; a long drag stays a drag; an empty-start drag is nothing": down (1,1) at 0, move at 500, up on (3,2) → `BoxSelect (1,1)→(3,2)`; down/up on (1,1) at 0/500 → `BoxSelect (1,1)→(1,1)`; down (0,8) at 0, up on (0,7) at 100 (no move sample) → the drag intents; down (0,8) at 0, a far move at 100, up on (0,7) at 600 → the same drag intents (mode is decided once); down (2,3) at 0, up on (3,3) at 200 (no move sample, start empty) → `[]`.
  - "only the first touch owns a gesture; a second finger and a cancel give nothing": down id 1 on (0,8), down/up id 2 on (2,2), up id 1 → `[SelectUnit knight#1]` only; down, move, `cancel` → `[]`.
  - "thresholds are the caller's: a wider tapMaxPx turns the drag into a tap; bad options and time going back throw": up 30 px from the down point with `tapMaxPx: 40` → `[SelectUnit knight#1]`; `cellPx: 0`, `tapMaxPx: -1`, `holdMs: 1.5` → `RangeError`; `ms` 100 then 50, and `ms` 0.5 → `RangeError`.
- `tests/sim/intents.test.ts`
  - "intents map to tactics events by phase (STATES §3.4); BoxSelect is a no-op that never throws": the eight `intentEvent` cases of Behaviour 6 (including `Confirm` with and without `aim`, and `TargetCell` in `idle` → `null`); `feedIntent` of a `BoxSelect` on a world in `idle` returns `null` and leaves `phases` `{ battle: "idle" }`.
  - "tap-tap and drag give identical events and phases through feedIntent": a stage-fixed world set to `{ battle: "idle" }`, a mapper on `w.grid.cols/rows` and `w.units.occupantAt`; tap-tap (0,8) then (0,7), and a drag (0,8) → (0,7), each give events exactly `[SELECT_UNIT knight#1, TAP_MOVE_CELL (0,7)]` and phases `{ battle: "moving" }`.
  - "a missing battle phase throws in feedIntent and runMatch (no silent fallback)": `w.phases = {}` → both throw the exact messages of Behaviour 7 and 8.
- `tests/sim/script.test.ts`
  - "the sim script's report is the 50-seed batch, byte for byte": `report(50, 60000)` deep-equals exactly:
    - `stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`
    - `stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`
    and `report(0, 60000)` throws `RangeError`. (The counts match step 09b's 50-seed test; the hashes prove the histories are byte-stable.)

## Example
```ts
const feed = createGestureMapper(settings.gestures, { cols: grid.cols, rows: grid.rows, unitAt: (at) => units.occupantAt(at) });
for (const sample of hostPointerSamples) {            // touch first; the host converts to grid-local px + integer ms
  for (const intent of feed(sample)) feedIntent(world, intent);  // SelectUnit → SELECT_UNIT, TargetCell → TAP_MOVE_CELL …
}
// $ npm run sim            → two report lines (50 seeds each)
// $ npm run sim -- 10      → seeds 1-10
```

## How later steps use this (context only; do not build)
- A player driver turns `TAP_MOVE_CELL` / `CONFIRM_TARGET` into `submit`ted actions alongside the AI (same events, STATES rule 8).
- The runtime host (`src/runtime/host/`) feeds real pointer events as `PointerSample`s and applies the camera (M5); the intent → event mapper moves out of `src/sim` when a runtime layer that may import `src/state` exists (a later Change Notice).
- RTS gives `BoxSelect` a meaning through its own tables.

## Decisions note: what to name
- The exact `RangeError` messages.
- How you hold the open gesture (fields) and decide the mode once.
- Anything you chose that the file doesn't state (law 12).

## BTF intent (read-only)
None (rewrite). Intent only: `scripts/sim-50.mjs:1-30` (batch report over many seeds). Not repeated: BTF's mouse-only, DOM-bound input handlers; any wall-clock long-press timer.

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/STATES.md`, `scripts/check-state.sh`, `scripts/check-law.sh`, `eslint.config.mjs`, `tsconfig.json` (change only by Change Notice).
- `.dependency-cruiser.cjs` and `package.json`, **except** the one CN-006 line in each; every other line stays byte-identical. `package-lock.json` unchanged.
- `tests/smoke.test.ts`, `tests/gates.test.ts`, `tests/fixtures/**`, `tests/sim/ai.ts`, `tests/sim/input.ts`, and every existing test.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.
- Every earlier step's files except `src/sim/index.ts` and `src/sim/driver-phase.ts`: `src/core/**`, `src/state/**`, `src/rules/**`, `src/project/**`, `src/index.ts`, `src/sim/{types,world,actions,run,driver-tick}.ts`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit (green = BUILD_GUIDE §6).
- [ ] `npm test` summary: fail 0, skipped 0, todo 0; pass ≥ 131. No `.only`, `.skip` or `.todo` (`rg -n '\.(only|skip|todo)\(' tests` prints nothing).
- [ ] `npm run check:state` prints `check:state OK (src)` and `npm run check:law` prints `check:law OK (src)`; both exit 0.
- [ ] CN-006: `sha256sum .dependency-cruiser.cjs package.json` prints `de9c429f7acf914244e9b2417e39756e18f9f73d96761fc06129b21cadea0a50` and `1e5dd82cb52db7ffbff747b020ec550b383b9c7a1164f182a8b0e793a60088c5`; `git diff --stat <base>..<head> -- .dependency-cruiser.cjs package.json` shows 1 insertion each and no deletion; `npm run deps` reports no violations.
- [ ] `npm run sim` exits 0 and prints exactly the two lines quoted in the script test.
- [ ] `rg -n --pcre2 '\bMath\.random\b|\bDate\b|\bperformance\.now\b|\b(setTimeout|setInterval|queueMicrotask|requestAnimationFrame)\b' src/runtime/input src/sim` prints nothing.
- [ ] `rg -n --pcre2 '\b(document|window|navigator|HTMLElement|PointerEvent|TouchEvent|MouseEvent|addEventListener)\b' src/runtime/input` prints nothing (no DOM).
- [ ] `rg -n --pcre2 '(?<![\w.])(?!0\b|1\b|2\b)\d+(\.\d+)?\b' src/runtime/input` prints nothing (no hardcoded threshold or default; comments included).
- [ ] `rg -n --pcre2 "from ['\"](?!\./|\.\./\.\./(types|core)/)" src/runtime/input` prints nothing (the layer imports only its own files, types and core; no `node:`).
- [ ] `rg -n --pcre2 "from ['\"][^'\"]*/(runtime|sim)/" src/core src/state src/project src/rules src/runtime` prints nothing.
- [ ] `rg -n -i --pcre2 '\b(hp|maxhp|mana|cost|damage|deck|cards?|stats?)\b' src/runtime/input src/sim` prints nothing.
- [ ] `rg -n --pcre2 '\bcreateClock\b|clock\.advance\(' src/sim src/runtime` prints exactly two lines, both in `src/sim/world.ts`.
- [ ] `rg -n --pcre2 "from ['\"]node:|\bfetch\b|readFile|writeFile" src/sim src/runtime` prints nothing (`node:crypto` stays in `scripts/sim.ts`).
- [ ] `rg -n --pcre2 'phases(\.\w+|\[[^\]]*\])\s*=(?!=)|phases\.battle\s*\?\?' src` prints nothing (phases replaced whole; no fallback for a missing battle phase).
- [ ] `git diff --name-only <base>..<head> -- src/core src/types src/state src/rules src/project src/index.ts src/sim/types.ts src/sim/world.ts src/sim/actions.ts src/sim/run.ts src/sim/driver-tick.ts tests/sim/ai.ts tests/sim/input.ts tests/fixtures package-lock.json` prints nothing.
- [ ] `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback'` shows ≤ 300 changed lines (insertions + deletions); each file within its limit above.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the twelve files in "Files to create or change" (`A` for the seven created, `M` for `.dependency-cruiser.cjs`, `package.json`, `src/sim/index.ts`, `src/sim/driver-phase.ts`; anything extra is named and justified in the Decisions note).
- [ ] Hand-back `handback/step-09c-input-sim-script/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Out of scope
- A player driver that submits moves from intents; the action menu (`CHOOSE_ACTION`, M9); overlays; camera, pinch and pan (M5).
- Real DOM / pointer-event wiring (`src/runtime/host/`), haptics, double-tap, multi-unit `BoxSelect` meaning (RTS).
- Moving the intent → event mapper out of `src/sim`; `estimated: true`; saves; networking.
