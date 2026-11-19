# s0-play-input: S0 play-stage touch input, selection state and Talk panel (CEO go via Chief Of Staff, 2026-11-18; UX MS-00)

Step id: s0-play-input          Revision: r1          Header r5, 2026-11-18, Editor & UX Designer (CoS step-guide audit: Read-first path, shipped status, standing lines). The kit r4 paste body from `## Goal` on is unchanged.
Kit: r4, 2026-11-18, Engine Architect (QA kit reviews `docs/qa/step-s0-kit-review.md` sha256 `644ac2c5…`: must-fix 1 browser gate, test 5 flag, TP-4 carry; `docs/qa/step-s0-kit-r2-review.md`: the browser gate runs the full play sequence; CoS r4 ruling: the smoke counts outside the 400 with its own 130-line cap). Spec kit, so there is no proto branch. The test titles and assertions below are fixed by this file. The builder writes the code and tests, and QA reviews them against this file.
Read first: `docs/maker/maker-spec/MS-00-play-input-and-talk.md` (UX, sha256 `e4e59a7a4f41b0cb9e30d456786d9c53571f9c557e5d86e0fd5c0795d3b5c2a2`), `docs/maker/style-spec.md`, BUILD_GUIDE §6–§7, `handoff/HAND-BACK.md`.
Status: **SHIPPED.** Merged as PR #76, merge commit `9a9ca90`. The floor after merge was **1023** tests. **Do not re-run this go-line on current main.** Steps 1a and 1b have since rewritten the play-stage files next to this step (`page.ts`, `match.ts`, `board.ts`, `load.ts`, and the new `project.ts`), and this kit forbids touching some of them. The file is kept as a record, and its Delivery section is the model for the later step guides. Its base, floor and branch are history, not current values.
Copies: this file and `handoff/steps/s0-play-input.md` must stay byte-identical. Patch both or neither.
Standing lines for every maker step: no new framework, starter template or app scaffold (for example TanStack Start, a sandbox preview server, borrowed visual themes); build only inside the repo's existing stack, files and test gates; no other theme or visual system. Slices are 400 lines or fewer with the gates on (`npm test` at floor + N, `scripts/check-law.sh`, `scripts/check-state.sh`; here `npm run green`). Offline, no new dependencies, 48 px targets, AA contrast.
Paste: everything from `## Goal` to the end of this file is the paste body. Chief Of Staff sends it byte-identical.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete).

## Goal
On the CEO's P1-9 phone test the play stage didn't work for player input. Enemies couldn't be targeted, Attack and Talk did nothing, a second move or action sometimes failed, nothing could be selected after a camera pan, and End Turn then failed. Only the wolf bot played. After this step, every player action on the bundled demo works by touch: select, move, attack, spell, talk (in a panel), switch units, pan, pinch, recentre and End Turn. Each tap is hit-tested through the camera the renderer draws with. All fixes live in `tools/play-stage`. No game rule changes, and nothing in `src/` changes.

Repo: https://github.com/G-TileEngine/tileengine
Base commit: main `501057027cc27321b631c40ed3ef7d5552ac792a` (P1-9 merged, PR #75; QA OK TO MERGE). Count on that base with `npm ci && node --test "tests/**/*.test.ts"`: **1014 pass / 0 fail**. Without devDeps you get 1007 (1005 pass, 2 fail): `tests/gates.test.ts` and `tests/runtime/perf-34b.test.ts` need eslint and typescript installed.
Branch: `step/s0-play-input-r1-chatA`, from the base. Never commit to main.

## Source: UX MS-00 §2 (quoted, sha256 e4e59a7a4f41…)
> | F1 | `board.ts` L101–106: a TargetCell needs **two taps on the same cell** (1st = preview, 2nd = confirm). | Every move/attack/talk needs a double tap... |
> | F2 | `page.ts` L73: a 2nd tap within **280 ms** goes to `centre()` and is **never sent** as `up`. | ...and a quick 2nd tap is eaten, so attack/talk "do nothing" and the 2nd action "sometimes fails". |
> | F3 | `page.ts` L51: tap → board coords use `box.s` and `padX/padY` only, **not `cam.x/cam.y/cam.s`**. | After a pan or zoom, taps land on the wrong cell, so a unit can't be selected. |
> | F4 | `page.ts` L60/L74: 2nd finger down sends no `cancel`; `pointercancel` doesn't reset `drag`; no `setPointerCapture`. | After a pinch or a drag off-canvas, the gesture mapper can stay "pressed" and ignore the next tap. |
> | F5 | `match.ts` L99: `endTurn()` only clears state when phase is `actMenu`; in `unitSelected` or `targeting` it skips straight on. | With a unit selected or a target mode open, End Turn fails or leaves stale state. |

## Fix list (one list; EA causes C1–C5 merged with UX F1–F5; file:line on the base)
| # | Ids | Evidence (base) | Fix |
|---|---|---|---|
| X1 | C1 | `src/runtime/input/gestures.ts:20-22` turns a tap on an occupied cell into `SelectUnit`. `src/sim/intents.ts:10` maps that to `SELECT_UNIT`, which `src/state/tactics.input.table.ts:6` allows only from idle and unitSelected, so it is rejected. `tools/play-stage/board.ts:96-97` then clears the selection, and the phase stays `targeting` | In targeting, a tap (SelectUnit or TargetCell) on a cell in `aims` becomes `TargetCell` at that cell (match layer, R3). |
| X2 | C2 | `board.ts:124` `pointer()` calls the closure `intend`, not the match override at `tools/play-stage/match.ts:78-89`. Touch never runs the talk-line pick or `settle()`, so a confirm stays in `resolving` | `pointer()` routes every gesture intent through the object's `feed` (default = its own `intend`). `createMatch` sets `feed` to its router (R3). |
| X3 | F2, C3 | `tools/play-stage/page.ts:60` always sends `down`. `page.ts:73` sends a second tap within 280 ms to `centre()` and never sends `up`, so `gestures.ts:32-37` keeps the press open. Touch gives every contact a new `pointerId`, so all later taps are ignored until reload | Remove double-tap-to-centre (`lastTap`, `centre()`). Every tap is one `down` + `up` pair. Add a Recentre button (R6). |
| X4 | F3, C4 | `page.ts:51` and `page.ts:56` leave out `cam.x` and `cam.y`, but the renderer draws with them (`page.ts:45` → `src/runtime/host/raf-driver.ts:81`). `page.ts:37` takes the pad from the fit scale, not `cam.s` (renderer: `src/runtime/render/fit.ts:12`). `page.ts:19` and `page.ts:49` use `devicePixelRatio`, while the driver's backing store is `backingSize(...)` (`raf-driver.ts:80`) and can differ (the P1-9 smoke already requires `canvas.width / clientWidth`). `page.ts:71` pans in CSS px, not art px. `tools/play-stage/camera-touch.ts:9` doesn't clamp | Use the backing-store scale: `kx = canvas.width / rect.width`, `ky = canvas.height / rect.height`, `devW = canvas.width`, `devH = canvas.height` (`band()` falls back to clientWidth·dpr only before the first frame). One hit test, `hit(offsetX, offsetY)`: `f = fitView(devW, devH, cam.s, TILE, TILE)`, `x = (offsetX*kx − f.padX)/f.s + cam.x`, and likewise for y. Pan is `pan(cam, −dx*kx/cam.s, −dy*ky/cam.s)` then `clamp(...)` (`camera-touch.ts:18`), so the map follows the finger 1:1. |
| X5 | F4 | `page.ts:60` sends no cancel when a second finger goes down. `page.ts:74` doesn't reset `drag`. There is no pointer capture, and after a pinch the first finger's `up` fires a stray tap (`page.ts:73`) | Call `setPointerCapture` on down. A second pointer sends `cancel` for the first pointer's id and starts a pinch. No tap fires until every pointer has lifted. `pointercancel` and `lostpointercapture` reset pointers, drag and pinch, and send `cancel`. The drag threshold is 10 CSS px (MS-00 §3). |
| X6 | F1 | `board.ts:101-106`: a move or target needs two taps on the same cell | One tap commits (R1). |
| X7 | C5 | `match.ts:20` creates the play with auto-wait off, so `board.ts:85` sends MOVE_DONE to `actMenu`. A tap on a second unit there is SELECT_UNIT from actMenu, which is illegal (X1 chain), so the unit is deselected and only Wait recovers | Implicit Wait (R2). |
| X8 | C5 | `match.ts:94-96`: `choose()` enters `targeting` even when the target list is empty, and no gesture ever sends Cancel (`gestures.ts:24-47`) | `choose()` works out the targets first. If there are none it returns `"noTarget"` and the phase doesn't change. In targeting, a tap off the target list cancels (R1). |
| X9 | F5 | `match.ts:38` (`finish()` needs idle or unitSelected) and `match.ts:98-99` (only actMenu is cleared). From targeting or resolving, End Turn does nothing | `endTurn()` clears first through legal edges (R4), then ends the side. It is ignored while a walk runs, on the wolves' side, or after the outcome. |
| X10 | Talk | `match.ts:84-86` sets `talk` and actMenu but never clears it. `tools/play-stage/hud.ts:29` shows a passive bubble | Talk panel with Close (R5). |

## Rulings
- **R1. One tap commits, at the pointer layer** (MS-00 §4: "Move is direct… No 2nd confirm tap"; "One tap on a highlighted target acts"). Reason: phone players tap once, and a second confirm tap was what invited the swallowed double tap. Details:
  - The router sends a tap on a highlighted legal cell (a reach cell in unitSelected, or an `aims` cell in targeting) as `intend(TargetCell)` twice back to back: preview, then commit. The path overlay shows from the tap until the walk lands.
  - `intend()` keeps its two-call contract, so no shipped test changes.
  - In targeting, a tap on anything else cancels back to Selected. A tap on an empty non-reach cell in unitSelected sends Cancel and goes to idle.
  - MS-00 specifies no Undo, so there is none. The `UNDO_MOVE` edge is used only as the phase walk-back in R4.
- **R2. Implicit Wait when switching units; the explicit Wait button stays** (MS-00 §4: "Tap another own unit: switch to it"). Reason: auto-wait would hide Attack and Talk after a move, while implicit Wait keeps them and still allows a direct switch. Details:
  - Auto-wait stays off.
  - In actMenu, a tap on another ready own unit sends `WAIT`, `UNIT_DONE {next:"idle"}`, marks the current unit done, then sends `SelectUnit`.
  - In targeting (with the tap not on an aim), a tap on another ready own unit cancels per R4. If the unit had moved it also gets implicit Wait, then the switch happens.
  - Done units are a `Set<string>` in `match.ts`, cleared when the side returns to the player. A tap on a done unit, a foreign unit, or the dead is ignored and the selection is kept.
- **R3. Router: `match.feed(intent)`.** In order:
  1. Ignore the tap while the Talk panel is open, while `walk !== null`, when `side !== "player"`, or when `outcome !== null`.
  2. Apply R1, R2 and X1 by phase.
  3. Otherwise call `api.intend`.
  Unit ids are looked up only through `world.units.get` and `Set`/`Map` (never a plain-object key), so `"constructor"` and `"__proto__"` are inert.
- **R4. Walk-back edges** (rules table unchanged). Details:
  - From targeting: `player.feed({type:"Cancel"})` takes it to actMenu. If targeting was entered from unitSelected (recorded in `choose()`), `UNDO_MOVE` then takes it back to unitSelected. This is a phase change only, and no unit moves.
  - From actMenu: `WAIT`, then `UNIT_DONE idle`.
  - From unitSelected: Cancel, which goes to idle.
  - In every case `aims = []`, the Talk panel closes, `focus(null)` runs and `followId = null`.
  - `src/state/*` and `src/runtime/input/gestures.ts` are not changed: every fix can be reached with existing edges and gesture output.
- **R5. Talk panel** (MS-00 §7, the minimum version). Details:
  - It replaces `#bubble` and opens through the match layer (X2) when an interact lands.
  - It's a bottom sheet above the HUD row, no taller than 35% of the screen, with `pointer-events:auto`. It shows the name in bold and the text at 16 px, or "…" when the text is empty, plus a 48 px **Close** button.
  - Close calls `match.closeTalk()`, which sets `talk = null`. In actMenu it then sends `WAIT` + `UNIT_DONE idle` and marks the unit done ("Talk spends the action").
  - The board ignores taps while the panel is open. Pan and pinch still work.
- **R6. Recentre.** A 48 px button in `#top` calls `centreOn` on the selected unit, or else on the first alive own unit, then `clamp`. It replaces double-tap-to-centre (MS-00 §1).
- **R7. Deferred** (MS-00 parts that aren't bug fixes, to keep the slice at 400 lines or fewer): the typewriter at 30 chars/s, the one-target chip, reason text on disabled buttons, the "2 units can still act" End Turn chip, the 8 px or 24 px nearest-unit slop, follow-only-while-animating, and the 1.5 s animation fallback (settle is synchronous today).

## Files to create or change (and nothing else)
| File | Change | Cap (changed lines) |
|---|---|---|
| `tools/play-stage/touch.ts` | new: `createTouch` (pointers, tap/pan/pinch, `hit`, capture/cancel resets) with no DOM globals | 75 |
| `tools/play-stage/page.ts` | wire the listeners to `createTouch`, drop `send`, `centre` and `lastTap`, use the backing-store box (X4), add Recentre and Close wiring | 35 |
| `tools/play-stage/board.ts` | `pointer()` → `self.feed`, plus a settable `feed` | 8 |
| `tools/play-stage/match.ts` | `feed` router, done set, `choose()` guard, `endTurn` clear, `closeTalk`, R4 helpers | 85 |
| `tools/play-stage/hud.ts` | Talk panel + Close, Recentre button (`#recentre`), `Act.recentre` and `Act.closeTalk` | 25 |
| `tests/tools/touch-play.test.ts` | new: the 9 unit tests below | 100 |
| `handoff/steps/tests/s0-play-input/touch-smoke.mjs` | new: the browser gate below (P1-9 smoke pattern, outside `npm test`) | 130 (own cap, outside the 400) |
Caps for the five tool files shrink by 22 in total to make room for the gate: `touch.ts` 75, `page.ts` 35, `board.ts` 8, `match.ts` 85, `hud.ts` 25. Total cap 400 for the six repo files, with `touch-smoke.mjs` counted outside it under its own 130-line cap, as with the P1-9 kit-run smoke (expect about 355). The release rule still holds: `DEV` appears only on `// dev-only` lines, and `touch.ts` doesn't use `DEV`.

## Interfaces to match
```ts
// tools/play-stage/touch.ts
export type TouchEv = { readonly id: number; readonly offsetX: number; readonly offsetY: number; readonly clientX: number; readonly clientY: number; readonly timeStamp: number; readonly pointerType: string };
export type TouchBox = { readonly devW: number; readonly devH: number; readonly kx: number; readonly ky: number; readonly cols: number; readonly rows: number }; // devW/devH = canvas.width/height; kx/ky = backing-store scale
export function createTouch(o: { match: { pointer(s: PointerSample): void }; cam: PlayCam; box: () => TouchBox }): {
  down(e: TouchEv): void; move(e: TouchEv): void; up(e: TouchEv): void; cancel(e: TouchEv): void; hit(offsetX: number, offsetY: number): { x: number; y: number };
};
// match.ts additions on the returned api
feed(intent: DoorIntent): unknown; closeTalk(): void; recentreTarget(): Sq | null; readonly done: ReadonlySet<string>;
// choose(kind) also returns "noTarget"
```

## Tests that prove it is done (N = 9 new unit tests in `tests/tools/touch-play.test.ts`, plus the browser gate)
The unit tests drive `createTouch` with scripted `TouchEv`s into a real `createMatch()` and a real `PlayCam`, on a box of 1170×1992 dev px with kx = ky = 3. They never call `intend` directly. The helper `screenOf(cell)` uses the renderer's own maths (`fitView` + cam, as in `raf-driver.ts:81`): `offsetX = (((c+0.5)*16 − cam.x)*f.s + f.padX)/kx`. Every touch gets a fresh pointer id.
1. "touch: one tap selects the knight and one tap on a reach cell walks". Assert `selected === knight`, phase `moving`, then after `advance` + `sync` phase `actMenu` with the knight on the cell.
2. "touch: Attack then one tap on the wolf hits it". Set up with the knight moved next to a wolf, then `choose("basic") === null` and a tap on the wolf. Assert wolf hp below max, phase `idle`, `done` has the knight, and exactly one `ability` entry in `world.log`.
3. "touch: Talk opens the panel through the match layer; Close spends the action". The villager is next to the knight. Assert `talk` = `{name:"Villager", text:"Hello, traveler."}`. A tap on the archer while the panel is open changes nothing. After `closeTalk()`: talk null, phase `idle`, knight in `done`.
4. "touch: after a move, tapping the archer switches with an implicit Wait". Assert the archer is selected, phase `unitSelected`, the knight is in `done`, and a later tap on the knight leaves the archer selected.
5. "touch: pan then tap selects the unit under the finger". The direction must be one the clamp allows (`clampCamera` axis: `min(map − art, max(0, v))`, `src/runtime/render/camera.ts:7`, applied by X4's `clamp`, `camera-touch.ts:18`).
   - Pinch out about 2× centred near the board's bottom-left corner. Assert `cam.s === 18`: zoomAt's cap `ceil(6·dpr)` (`camera-touch.ts:13`) against fit 12, giving art 65×110 inside the 96×144 map. Assert `cam.x ≤ 2` (near its 0 floor) and `cam.y === 34`, which is clamped to its maximum `mapH − artH`.
   - Drag one finger 120 CSS px to the **left**. From cam.x near 0 the clamp allows only an increase (maximum 31); the vertical axis is at its maximum and stays put.
   - Assert `cam.x` grew by exactly `120·3/18 = 20` (±0.01) and `cam.y` is still 34.
   - A tap at `screenOf(archer)` (archer at (1,8), on screen after the pan) selects the archer, `hit()` returns cell (1,8), and the old maths (`(offset·3 − pad)/s`, no cam) gives a different cell.
6. "touch: pinch sends cancel, fires no tap, and the next tap works". Two pointers spread out. Assert `cam.s` grew, the selection is unchanged, and lifting both selects nothing. The next single tap selects the knight.
7. "touch: a quick double tap never wedges input". Tap the knight twice 60 ms apart, then tap a reach cell: it walks. Then, in Attack mode, a double tap on the wolf 60 ms apart gives exactly one `ability` log entry.
8. "touch: End Turn clears targeting, actMenu and unitSelected, runs the wolves and returns". For each of the three start phases, call `endTurn()`, then loop `advance(40)` + `sync` until `side === "player"`. Assert phase `idle`, `done.size === 0`, `aims` empty and talk null, and that a new tap selects a unit.
9. "touch: no targets means no target mode; an off-target tap cancels back to Selected; unit keys are safe".
   - Assert `choose("basic") === "noTarget"` with phase `unitSelected`.
   - With targets, a tap on an empty cell goes back to `unitSelected` (unmoved) or `actMenu` (moved), with `aims` empty.
   - `feed({type:"SelectUnit",unitId:"constructor"})` and `"__proto__"` don't throw or change state.

### Browser gate: `handoff/steps/tests/s0-play-input/touch-smoke.mjs` (replaces the old test 10 source grep)
- **DOM environment.** The root devDeps have no jsdom or happy-dom (`package.json`). Adding one would move the root pins, and jsdom has no layout, no driver backing store and no real `offsetX`, so it can't test the `canvas.width / rect.width` mapping. The gate therefore uses the P1-9 smoke setup: `playwright-core@1.59.1` (given by `PLAYWRIGHT_CORE`, already on the box) plus `CHROME` (`/usr/bin/google-chrome`). It adds 0 dependencies, costs about 72 lines (dense lines, as in the P1-9 smoke), and runs outside `npm test`.
- **Run.** From the repo root: `PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797`. It builds the dev www with `buildWeb(tmp, "0"×40, root, true)` (`tools/apk/build.ts`), serves it statically on 127.0.0.1, and prints one `ok` or `FAIL` line per check, then `TOUCH SMOKE PASS`.
- **Who runs it.** It is required in HANDBACK.md § Smoke (all lines pasted). Chief Of Staff and QA rerun it at verify. A FAIL, a timeout, or no runnable Chrome is a stop.
- **Real events.** Taps use `page.touchscreen.tap`. Pinch and pan use a CDP `Input.dispatchTouchEvent` sequence (touchStart, 6× touchMove, touchEnd). A capture-phase probe on `#board` records each `pointerdown` and `pointerup` (`isTrusted`, `pointerId`, `offsetX`, `offsetY`). Every assertion requires `isTrusted === true`, so the events go through `page.ts`'s own registered handlers. Dev hooks (`__play`, `__cam`) are used only to read state and to place units, never to send input.
- **Mapping.** Read once per check: `k = canvas.width / rect.width` (and `ky` from the heights) plus `f = fitView(canvas.width, canvas.height, cam.s, 16, 16)`. `screenOf(c,r)`: `clientX = rect.left + (f.padX + ((c+0.5)*16 − cam.x)*cam.s)/k`, and likewise for y. `tileOf(offsetX, offsetY)` is the inverse. Never `devicePixelRatio`.
- **Each width.** Run at viewport **390×844** and **360×844** (deviceScaleFactor 3, isMobile, hasTouch). Hide the banner with `__hud.hideBanner()` and set the cam to `{x:0, y:0}` as the P1-9 smoke does.
  Every step below runs in one turn, in this order, at each width. Each step prints its own ok/FAIL line, and any timeout (5 s per step, 10 s for step 6) is a FAIL. Dev hooks only read state and place units. All input is trusted touch, and every board tap asserts that the probe's `tileOf(pointerup) ===` the intended cell.
  1. **Select.** Tap `screenOf(knight)`. Assert `__play.selected === knight id`.
  2. **Real walk.** Read a reach cell from `__play.reach` and tap `screenOf(cell)` once. Within 5 s, `__play.walk === null`, the knight's `at` equals that cell (the new position; it differs from its start), and the phase is `actMenu`.
  3. **Attack.** Place a wolf on an open neighbour of the knight. Tap `#attack`, then `screenOf(wolf)`. Assert wolf hp is below its max, there is exactly one new `ability` log entry, the phase is `idle`, and the knight is in `__play.done`.
  4. **Pan then select.**
     - Pinch out centred near the board's bottom-left, and assert `cam.s` grew.
     - Drag one finger 120 CSS px **left** (clamp-allowed from cam.x near 0, as in test 5). Assert `cam.x` grew by `120·k/cam.s` (±0.5) and `cam.x > 0`.
     - Place the archer on an open on-screen floor cell (at least 1 cell from every edge of the view), with the villager on an open on-screen neighbour.
     - Tap `screenOf(archer)`. Assert the tapped tile is the archer cell and `__play.selected === archer id`. Also log, and assert different, the cell the base maths gives (`offset·devicePixelRatio`, no cam), so the pan is not vacuous.
  5. **Talk, as the second action in the same turn.**
     - Assert `side` is still `"player"` and `turns` hasn't changed since step 1.
     - Tap `#talk`, then `screenOf(villager)`. Assert a visible Talk panel (display not `none`, rect > 0) holds "Villager" and "Hello, traveler.", and that it's at most 35% of the viewport height.
     - Tap its Close button (at least 44×44). Assert the panel is hidden, the phase is `idle`, and both the knight and the archer are in `done`.
  6. **End Turn round trip.** Tap `#end`. Within 10 s, `side` goes to `"wolves"` and back to `"player"`, the phase is `idle`, `turns` is +1, and `done.size === 0`. Then a trusted tap on `screenOf(knight)` selects it again.
  7. Every visible button, including `#recentre`, is at least 44×44 CSS px, and there are no page errors and no non-localhost requests.
Existing tests changed by ruling: **None**. All shipped tests must pass unchanged.

## Floor
Floor = 1014 (base) + 9 = **1023**, with `npm ci && npm run green` exiting 0, plus `TOUCH SMOKE PASS` at 390 and 360. The smoke is outside `npm test` and not counted.

## How a planted bug is caught (for QA)
- Delete `+ cam.x` in `hit`: test 5 fails.
- Restore the 280 ms double tap: test 7 fails.
- Make `pointer()` call the closure `intend` again: tests 2 and 3 fail.
- Remove the implicit Wait: test 4 fails.
- Remove the `endTurn` clear: test 8 fails.
- Remove the `choose()` guard: test 9 fails.
- Use `devicePixelRatio` instead of `canvas.width / rect.width` in `page.ts`, or drop `cam` from the page's box: the browser gate fails (step 4) at 390 and 360.

## Out of scope / carries (after the CEO's APK retest)
- R7's deferred MS-00 parts.
- After-APK carries: `release()` throwing on a multi-line `if (DEV) {`; `debugGlobals()` catching any `window.__*`; tests for the resize-listener drop and the second rAF; `GROUND_OF ?? 0`; the page-level seatCam test; the E7p cue and `rev` integer checks; the tools tsc null error.
- Stage 1 data work: the talk line falling back to `talk-villager` for any unit (`match.ts:84`), the `DEMO_*` constants, `SIDES`, `DEFAULT_SPELL_REACH`, and `"line-shot"` in `src/rules`.
- **TP-4 "only wolves act" is the next slice, S0b.** The hardcode is `SIDES = ["player","wolves"]` at `match.ts:14`, with the `side === "wolves"` bot pumps at `match.ts:65,77,99`. All of this is in `tools/play-stage`, so no `src/` change is needed. Also in S0b: the side-wide `actionsPerTurn = 2` budget let one wolf take both actions.

## Do not touch
`src/**`, all existing `tests/**`, `tools/apk/**`, `tools/play-stage/{load,looks,fx,build,dev,camera-touch}.ts`, `ui-shell`, `painter-proto`, and BUILD_GUIDE §7's never-edit list.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least 1023 tests passing.
- [ ] `touch-smoke.mjs` prints `TOUCH SMOKE PASS`, with every step's ok line at 390 and at 360, pasted in HANDBACK.md § Smoke.
- [ ] Only the seven files above change, each within its cap, with 400 changed lines or fewer in total outside `touch-smoke.mjs` (own cap 130).
- [ ] No change under `src/`. The rules tables and `gestures.ts` are byte-identical to the base.
- [ ] The release build (`tools/play-stage/build.ts`) passes, with no `DEV` outside `// dev-only` lines.
- [ ] Unit-id lookups use `world.units.get`, `Set` or `Map` only, with no plain-object key lookups.
- [ ] HANDBACK.md is complete per `handoff/HAND-BACK.md`, quotes this file's sha256 in full, and lists the Decisions (thresholds 10 CSS px and 500 ms hold, the done-set lifetime, the R4 order).

## Delivery
- One builder chat (ChatA), one QA review, and one rework round on must-fixes (CN-028).
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds `handback/s0-play-input/r1/HANDBACK.md` (with § Smoke).
- Push once, that branch only, through the one-shot credential helper using the box env `GH_BUILDER_TOKEN` (keep the single quotes): `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/s0-play-input-r1-chatA`.
- Never push main or a tag. No force-push, no branch delete, no PR actions.
- Never print, echo, log, commit or store the token (including in `.git/config`).
- Chief Of Staff opens the PR. The hand-back message quotes the branch, the full tip sha, the base sha `501057027cc27321b631c40ed3ef7d5552ac792a` and the test counts.
