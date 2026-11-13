# step-33h-host-hookup: effects and the see-through canopy on the live screen (renderer plan slice 33, host hookup; CEO 2026-11-13 21:06; no CN)

Step id: step-33h-host-hookup          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`49af2cb2fdd88d45f24662a1dca13cb1245de046`** (main after PR #41, the step 33a merge; tree `03abf07d`; verified PASS 601/0, `/workspace/scratch-ea/s33a-verify-report.txt`). Proto r1–r2 were built on the 33a proto `e3439c1f` and re-based onto this merge as r3 (clean; one test-shape fix, S-2). Branch: `step/step-33h-host-hookup-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`.
The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-33h-host-hookup-r<N>.bundle <Base>..step/step-33h-host-hookup-r<N>`, then `git bundle verify`. Upload the bundle plus a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete a file you did not upload in this chat. If a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-33h-host-hookup/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 prefix in it.
Depends on: step 33a, merged `49af2cb` (`src/runtime/render/fx-player.ts`: `placeStep`, `crossed`, `clipEvents`, `clipPoints`, `startMs`, `hitAt`, `viewHitMs`, `poseMs`, `nextChangeMs`, `stripNote`, `frameStart`; `Standing` fx kinds; `handoff/steps/step-33-effects-sync.md` "Not in this step"); step 32 (`canopy.ts` `createSeeThrough`; step-32 "Host shell (s33)" carries); step 30 (`src/runtime/scene/world-scene.ts`); step 27 (`frames.ts` `clipMs`, `instanceOffset`). Formats: CN-014 (`312323e4…`; clip `events` / `points`, effect step `anchor` default `"caster"` per setup-format r23 §2.10.3), CN-013 (`b4f812f6…`; map `seeThroughCanopy`). **No new CN; no import line moves.**
Read first: BUILD_GUIDE.md §3 (runtime import lines: scene imports only `../render/index.ts` and `../../core/notice.ts`; the host folder holds only `raf-driver.ts`), §7, law 13; `docs/qa/step-33-review.md` (`ba4c0e29…`; r1 section §2, behaviour notes N-1–N-4); `docs/qa/step-33h-review.md` (`8c2d60aa…`; r1: F-1, F-2, N-5–N-7, §6 answers; r3 addendum: M-1); step-33-effects-sync.md Rulings 1–17.
Kit: kit-1 r4 (guide-3), 2026-11-13: r3 plus QA's r3 must-fix M-1 (`docs/qa/step-33h-review.md` r3 addendum). Engine Architect. Prototyped on Node 24.22.1: branch `r33h` = **`582c7193f484cd5548f48a22d6916e82a21f5ffa`** (tree `41050cda`) on `49af2cb2`: r1 `abb1f10`, QA qfix `c2dcdb6`, r2 `58d6247` (cherry-picked unchanged from `e89e332e`, `900b9ae6`, `21d028f7`), r3 `ba64579` (test only: S-2 and the F-2 exact-count line), r4 = QA's `582c7193` (M-1: `lap` needs a finite `loopMs`, one fx-live line in place, plus one pin line; patch `s33h-r3-qfix.patch` `4b15a9cf…`). `npm ci && npm run green` exits 0 with `tests 614 pass 614 fail 0 skipped 0 todo 0` (601 + 13); `tsc` 0. Sims and all 20 smoke lines unchanged against the Base. Plants: `/workspace/scratch-ea/s33h-plants-r4.py` (`78e9808b…`), **52/52 caught, all 52 catching tests fail on the Base**, plus D1/D2 listed as equivalent on the merge (see below); QA's `qa33h-plants.py` (`6d49a3eb…`, Q22/Q23/Q27 re-anchored in `/workspace/scratch-ea/qa33h-plants-r2anchors.py`, `97700e5d…`) **40/40**, and QA's r3 set (`tools-qa33h-plants-r3.py` `dbde12b8…`) **44/44** rule plants (Q3/Q4 equivalent, Q6 caught by the step 30 tests, D1/D2 equivalent, as QA excluded them). QA's `probe-inf.ts` (Infinity, NaN, −1 and absent `loopMs` all play frames 0–3 and fire `fx:end`), `probe33h.ts hang` (93 ms) and `p2.ts` (85 ms) finish fast. Bundle copy: `/workspace/scratch-ea/r33h-r4.bundle` (`49af2cb..r33h`, verified, sha256 `ed411efc…`). Kit sha list: `/workspace/scratch-ea/kit-backup-r33h/r4-kit-sha256.txt`. (r3: `ba645792`, bundle `657910c8…`; r2: `21d028f7` on `e3439c1f`, bundle `05e3cd18…`; r1: `e89e332e`, bundle `144db89e…`.)
Carries: **no CN.** No core-types change (`61fad786…`); `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and the lock (`d7f64a09…`) unchanged. The four fence tests are unchanged and pass: render-core purity, canvas2d, raf-driver and scene-fence.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist (`docs/qa/handback-checklist.md`) before hand-back (see BUILD_GUIDE).

## Goal
After this step the world → scene link plays step 33a's effects on the live screen and applies step 32's see-through canopy. The game hands the link its playing effects and the sim clock. The link builds the anchor units from the scene (pose, mirror, facing, box), places every step with `placeStep` on the 30 ms pose grid, and fires the events by the crossing rule, at most one loop lap per call. It reports each effect's view-hit time and warns about bad clip `events` / `points` once per asset. QA's guards N-1 to N-4 are built here. The motion and shore pixel pipeline is split off to `step-33i-motion-shore-live` (see "Not in this step").

## Rulings
All rulings are EA (this kit) on CEO 21:06 scope unless a source is named. Every one is pinned.
1. **Live canopy** (CN-013; s32 carry): `SceneWorld.seeThroughCanopy: true` clears the above-layer tiles at each unit's cell and the cell above it (`createSeeThrough`); absent or `false` keeps them. A still world keeps one scene object, and a flag change rebuilds from the **uncut** layers. Pinned by: "live canopy: seeThroughCanopy cuts the above layer at each unit's cell and the cell above it; absent or false keeps it; a still world keeps one scene object (step 33h)".
2. **Loader warnings once per asset** (s32 carry "once per asset"; CN-014 codes): stored clip `events` / `points` are read when an asset is first seen; each warning code (`clipEventInvalid`, `clipEventsOverCap`, `clipPointsInvalid`) is pushed **once per asset**, message = the sheet id; absent fields never warn; a rebuilt world with the same assets repeats nothing. Pinned by: "loader: stored clip events and points warn once per asset per code, named by the sheet id; absent ones never warn; a rebuilt world does not repeat them (step 33h)".
3. **Effects in the scene**: `SceneWorld.effects` (`LiveFx[]`) with a `SceneClock` adds `placeStep`'s output: `fxBehind` / `fxFront` to `standing` (after the units), others to `overlays` (after the world's). The anchor unit is the drawn one: `pickClip`'s clip and mirror, `facesAway` = facing `"N"`, points from its clip. Pinned by: "effects on screen: a front-unit step sits at the caster's sort key with its hand offset, the draw list draws it after the unit, a mirrored caster mirrors the point, facing north swaps it behind (step 33h)".
4. **Pose grid on screen** (33a ruling 10): steps are placed at `poseMs(tMs, lite)` (30 ms, 60 in lite); the scene object changes only when the effect picture changes; `LiveOut.dueMs` = `nextChangeMs(tMs, lite)` while any effect plays, else `Infinity`. Pinned by: "pose grid on screen: steps pose on the 30 ms grid (60 in lite); inside one pose the scene object is kept, the next pose changes it, and an ended effect leaves nothing (step 33h)".
5. **Events on screen** (33a rulings 6–8): per call the link fires every event in `(last finite tMs, tMs]`, each tagged `fx: <effect id>`, sorted by time with ties in timeline order: `fx:start`, the caster clip's events (`clip:event{name}` at cast + frame start), `fx:release`, `fx:hit`, `fx:end` (start + length; none while looping); **an `fx:loop` at the same time as timeline events comes after all of them** (stable sort, laps appended last). `start_on` and `contact` come from the caster's current clip; `hitOffsetMs` counts from the effect start. Pinned by: "events on screen: each event fires once across frames by the crossing rule, tagged with its effect, in timeline order; start_on and hitAt come from the caster's clip (step 33h)"; the tie with `fx:loop` by: "F-2, N-5 and N-6: the one lap is computed directly (no hang on huge times), a loop ties after timeline events, a non-finite cast, step at or step ms draws and fires nothing, and a view is never NaN (step 33h r2)".
   Anchor points (s33a F-1 ruling, merged): `foot` is the sheet anchor and is **not** mirrored; the mirror applies only to `centre`, `head`, `hand` and `tip` (`x' = fw − 1 − x`). fx-live passes the drawn unit's `flipX` and lets 33a's `placeStep` apply this.
6. **N-2 and F-2, one lap per call** (QA N-2, F-2; law 13): **compute the last lap directly. Never count laps one by one.** The one `fx:loop` per call is the last lap `start + k·loopMs`, `k = floor((tMs − start)/loopMs) ≥ 1`, if it lies in `(t1, tMs]`; `crossed` is never asked for laps. So a resume after any gap, or any finite time (1e17, `Number.MAX_VALUE`, `loopMs` 1e-300), fires at most one `fx:loop` and returns at once; the rest of the window fires once; **an infinite or non-finite `loopMs` (and any `loopMs` ≤ 0) means no loop: the effect plays once and fires `fx:end`** (QA M-1: `lap = Number.isFinite(loopMs) && loopMs > 0 ? loopMs : 0`). A looping effect's steps replay each lap. Pinned by: "N-2: after a resume a looping effect fires at most one fx:loop per call; the rest of the window fires once (law 13) (step 33h)" and "F-2, N-5 and N-6: the one lap is computed directly (no hang on huge times), a loop ties after timeline events, a non-finite cast, step at or step ms draws and fires nothing, and a view is never NaN (step 33h r2)".
   F-3 (33a merge): core `crossed()` now has a 2^53 backstop (`k < 2 ** 53`), so it can no longer hang; fx-live still computes the last lap directly and never asks `crossed` for laps, so the one lap is kept even where the backstop would drop it (the r3 test asserts exactly one `fx:loop` for 1e17, −1e17, 1e-300 and `Number.MAX_VALUE`).
7. **N-1, finite clock** (QA N-1): a non-finite `tMs` draws no effect, fires nothing, reports no views and leaves the last time unchanged. **N-3** (QA N-3): the effect length is clamped to ≥ 0 before `viewHitMs`, so the view never shows a hit before the commit; `views[id]` exists only when `commitMs` is given. Pinned by: "N-1 and N-3: a non-finite clock draws no effect, fires nothing and keeps the last time; the view never shows a hit before the commit, even for a zero or negative length (step 33h)".
8. **N-4, empty clip** (QA N-4): `clipEvents` is called only with a whole frame count ≥ 1; a caster clip with no frames, or no clip, gives no clip events and starts and hits at cast. Pinned by: "N-4: a caster clip with no frames gives no clip events and starts at cast; a caster with no clip plays at cast too; every fired time is finite (step 33h)".
9. **Attach memory** (33a ruling 11; law 13): `spawn` uses the anchor unit as it was on the step's first live pose (per lap); `follow` + `detach: "hit"` uses it as it was on the first pose at or after `hitAt`; the store holds one entry per playing effect and drops an effect the frame it leaves the list. Pinned by: "attach on screen: spawn keeps the caster's place at step start, follow moves with it, follow + detach hit freezes at the hit place; the live store drops ended effects (law 13) (step 33h)".
10. **Anchors** (setup-format r23 `anchor` `"caster"` (default) | `"target"` | `"screen"`): `"target"` anchors to `LiveFx.target`'s unit, else to `LiveFx.at`; everything else to the caster (`"screen"` places at the caster's cell; the screen centre is 33b). The tile point is the cell's foot point `(c·tileW + round(tileW/2), (r+1)·tileH)`, the point units stand on. Pinned by: "anchors on screen: anchor target uses the target unit, else its cell; the caster is the default; tile points are the cell's foot point (step 33h)".
11. **Units for effects**: `FxActor.frame` = the clip frame index the draw list shows (same `instanceOffset` key `sheet#unitId`); a non-finite clock or a 1-frame clip shows index 0; a one-shot clip holds its last frame; `box` = `SceneAsset.box`, else the whole frame. Pinned by: "units for effects: the frame index matches the drawn pose (the draw list's unit offset), a 1-frame or non-finite clock shows frame 0, the box defaults to the frame, facing north faces away (step 33h)".
12. **Strips on screen** (33a ruling 17): a step whose strip has over 64 frames draws nothing and adds `fxTooManyFrames {subject: strip, …}` to the link's notices once per clip. Pinned by: "strips on screen: a step strip over 64 frames draws nothing and warns fxTooManyFrames once per clip (step 33h)".
   S-1 (33a merge): step strips animate via `frameAt(p.clip, tMs − stepStart)` inside `placeStep`; fx-live feeds pose time, so a strip advances on the 30 ms grid.
13. **N-5 and N-6, non-finite effect data** (QA N-5, N-6): an effect with a non-finite `castMs` is skipped (no draw, no events, no view); a step with a non-finite `at` or `ms` is skipped and left out of the effect length. `views[id]` is set only when the computed view is finite, so it is never NaN (a NaN `commitMs`, `hitOffsetMs` or cast omits it). Pinned by: "F-2, N-5 and N-6: the one lap is computed directly (no hang on huge times), a loop ties after timeline events, a non-finite cast, step at or step ms draws and fires nothing, and a view is never NaN (step 33h r2)".
   Since the 33a merge, `placeStep`'s window test (`tMs >= start && tMs < start + p.ms`) is false for NaN, so 33a draws nothing for these by itself; fx-live's skips stay (they also keep NaN out of events, views and the live store).
14. **One box per sheet** (QA §6.1, settled): `SceneAsset.box` is one opaque box per sheet, used for every frame; a per-frame list may be added later as an optional field. Pinned by: "units for effects: the frame index matches the drawn pose (the draw list's unit offset), a 1-frame or non-finite clock shows frame 0, the box defaults to the frame, facing north faces away (step 33h)".
15. **A target anchor with no target skips** (QA §6.2, settled): `anchor: "target"` with no target unit and no `at` draws nothing (no caster fallback, no notice per frame). Pinned by: "anchors on screen: anchor target uses the target unit, else its cell; the caster is the default; tile points are the cell's foot point (step 33h)".
16. **Pose-grid start lag is OK** (QA §6.3, settled; 33a ruling 10): a step starting between poses appears on the next pose, up to 29 ms late (59 in lite); events, hits and views use exact times. Pinned by: "pose grid on screen: steps pose on the 30 ms grid (60 in lite); inside one pose the scene object is kept, the next pose changes it, and an ended effect leaves nothing (step 33h)".

## Files to create or change
- create `src/runtime/render/fx-live.ts` (≤ 77; the per-frame effects wiring: `createFxLive`, `clipIndex`)
- change `src/runtime/scene/world-scene.ts` (≤ 105; `SceneWorld.effects` / `seeThroughCanopy`, `SceneAsset.box`, `SceneClock`, `SceneLink.fired` / `views`, loader warnings, canopy, effects; extend, don't rewrite)
- change `src/runtime/render/types.ts` (≤ 35; `Clip` += `events?`, `points?` as `unknown`, in place)
- change `src/runtime/render/index.ts` (≤ 19; one export line)
- create `tests/runtime/scene/host-hookup.test.ts` (shipped, verbatim)

Size: 150–400 changed lines. The proto changes **251 lines (+238/−13)** in 5 files against the Base `49af2cb` (r1 230, qfix 234, r2 250 on `e3439c1f`; r3 250; r4 251, the M-1 pin line):

| File | Base → proto / cap |
|---|---|
| `src/runtime/render/fx-live.ts` | new → 75/77 (r2: F-2 line in place, N-5/N-6 guards; cap unchanged) |
| `src/runtime/scene/world-scene.ts` | 88 → 101/105 |
| `src/runtime/render/types.ts` | 31 → 31/**35** (in place; cap re-based from 36: the merged `types.ts` is 31 lines, one less than the proto's 32, so proto 31 + 4) |
| `src/runtime/render/index.ts` | 14 → 15/19 |
| `tests/runtime/scene/host-hookup.test.ts` | new → 117 → 121 (QA qfix) → 135 → **136/139** (r4: QA's M-1 pin line; shipped; cap re-based from 121 to 135 + 4 because r2 adds one 14-line test pinning F-2, the loop tie order, N-5 and N-6; r3 changes two lines in place) |

(Base counts are at the 33a merge `49af2cb`; only `types.ts` differs from the proto base, re-based above.)

## Interfaces to match (quoted exactly)
```ts
// src/runtime/render/fx-live.ts
export type LiveFx = { readonly id: string; readonly castMs: number; readonly caster: string; readonly target?: string; readonly at?: { readonly c: number; readonly r: number }; readonly start_on?: string; readonly hitOffsetMs?: number; readonly lungePeakMs?: number; readonly loopMs?: number; readonly commitMs?: number; readonly pieces: readonly FxPiece[] };
export type LiveUnit = { readonly actor: FxActor; readonly clip?: Clip };
export type LiveEvent = FxEvent & { readonly fx: string };
export type LiveGrid = { readonly tileW: number; readonly tileH: number; readonly stepMs: number; readonly lite?: boolean; readonly mapSeed: number };
export type LiveOut = { readonly standing: Standing[]; readonly overlays: Overlay[]; readonly fired: LiveEvent[]; readonly views: Record<string, number>; readonly notes: FxNote[]; readonly dueMs: number };
export type FxLive = { frame(list: readonly LiveFx[], unitOf: (id: string) => LiveUnit | null, t1: number, t2: number, grid: LiveGrid): LiveOut; unit(st: Standing, facing: string | null, box: Box | undefined, tMs: number, grid: LiveGrid): LiveUnit; readonly held: () => number };
export function clipIndex(clip: Clip, tMs: number, stepMs: number, offsetMs: number): number;
export function createFxLive(): FxLive;
// src/runtime/scene/world-scene.ts (additions; the step 30 fields unchanged)
export type SceneAsset = { readonly sheet: Sheet; readonly clips?: readonly Clip[]; readonly tileProps?: Readonly<Record<string, { readonly anim?: string }>>; readonly noMirror?: boolean; readonly box?: Box };
// SceneWorld += readonly effects?: readonly LiveFx[]; readonly seeThroughCanopy?: boolean;
export type SceneClock = { readonly tMs: number; readonly stepMs: number; readonly lite?: boolean };
export type SceneLink = { scene(world: SceneWorld, at?: SceneClock): RenderScene; readonly notices: readonly Notice[]; readonly fired: readonly LiveEvent[]; readonly views: Readonly<Record<string, number>> };
// src/runtime/render/types.ts
export type Clip = { readonly name: string; readonly frames: readonly number[]; readonly fps?: number; readonly ms?: readonly number[]; readonly loop?: boolean; readonly events?: unknown; readonly points?: unknown };
```
No core-types import (local unions, as in 33a). `fired` and `views` are replaced on every `scene()` call (they hold only the last call's events and views). `scene(world)` with no clock behaves exactly as step 30, plus the canopy.

## Smoke lines
None move. Sims (stage-fixed 48/2 `afc89d56…`, stage-weighted 22/28 `b8007292…`) and all 20 smoke lines are byte-identical to the base.

## Existing tests changed by ruling (and only these)
None. All step 30 scene tests and the 33a tests (`fx-player.test.ts` `33ce473a…`, `fx-player-qa.test.ts`) pass unchanged.

Shipped-test changes in r3 (the shipped file is new in this step, so these re-base it; titles unchanged): **S-2** "effects on screen" expects the merged standing shape (`{ kind, sheet, c, r, frame, ox, oy }`; 33a's builds omit `dx: 0`, `dy: 0`, `faceSwap: false`), behaviour unchanged; **F-2** the extreme-time loop asserts exactly one `fx:loop` per case instead of at most one, since the merged backstop would otherwise let the r1 lap stepping pass silently (plant H1). r4 (QA's M-1 fix) adds one line to the same test: an Infinity `loopMs` draws at 1020 and 1250, fires `fx:end@1400` and never fires `fx:loop`.

## Tests that prove it is done
Shipped tests (copy verbatim; never weaken, rename, skip or delete; a weakened, renamed or deleted one is a REJECT unless "Existing tests changed by ruling" names it; a failing one is a must-fix):

| Shipped file (under `handoff/steps/tests/step-33h-host-hookup/`) | Copy to | sha256 |
|---|---|---|
| `tests/runtime/scene/host-hookup.test.ts` | `tests/runtime/scene/host-hookup.test.ts` | `e1dc7ffdda04067ac9d67a2d94d5491dcc3a7bfef6d549c44a6d69400b14f1d8` |

Titles they hold (exact):
- `tests/runtime/scene/host-hookup.test.ts` — "live canopy: seeThroughCanopy cuts the above layer at each unit's cell and the cell above it; absent or false keeps it; a still world keeps one scene object (step 33h)"
- `tests/runtime/scene/host-hookup.test.ts` — "loader: stored clip events and points warn once per asset per code, named by the sheet id; absent ones never warn; a rebuilt world does not repeat them (step 33h)"
- `tests/runtime/scene/host-hookup.test.ts` — "effects on screen: a front-unit step sits at the caster's sort key with its hand offset, the draw list draws it after the unit, a mirrored caster mirrors the point, facing north swaps it behind (step 33h)"
- `tests/runtime/scene/host-hookup.test.ts` — "pose grid on screen: steps pose on the 30 ms grid (60 in lite); inside one pose the scene object is kept, the next pose changes it, and an ended effect leaves nothing (step 33h)"
- `tests/runtime/scene/host-hookup.test.ts` — "events on screen: each event fires once across frames by the crossing rule, tagged with its effect, in timeline order; start_on and hitAt come from the caster's clip (step 33h)"
- `tests/runtime/scene/host-hookup.test.ts` — "N-2: after a resume a looping effect fires at most one fx:loop per call; the rest of the window fires once (law 13) (step 33h)"
- `tests/runtime/scene/host-hookup.test.ts` — "N-1 and N-3: a non-finite clock draws no effect, fires nothing and keeps the last time; the view never shows a hit before the commit, even for a zero or negative length (step 33h)"
- `tests/runtime/scene/host-hookup.test.ts` — "N-4: a caster clip with no frames gives no clip events and starts at cast; a caster with no clip plays at cast too; every fired time is finite (step 33h)"
- `tests/runtime/scene/host-hookup.test.ts` — "attach on screen: spawn keeps the caster's place at step start, follow moves with it, follow + detach hit freezes at the hit place; the live store drops ended effects (law 13) (step 33h)"
- `tests/runtime/scene/host-hookup.test.ts` — "anchors on screen: anchor target uses the target unit, else its cell; the caster is the default; tile points are the cell's foot point (step 33h)"
- `tests/runtime/scene/host-hookup.test.ts` — "units for effects: the frame index matches the drawn pose (the draw list's unit offset), a 1-frame or non-finite clock shows frame 0, the box defaults to the frame, facing north faces away (step 33h)"
- `tests/runtime/scene/host-hookup.test.ts` — "strips on screen: a step strip over 64 frames draws nothing and warns fxTooManyFrames once per clip (step 33h)"
- `tests/runtime/scene/host-hookup.test.ts` — "F-2, N-5 and N-6: the one lap is computed directly (no hang on huge times), a loop ties after timeline events, a non-finite cast, step at or step ms draws and fires nothing, and a view is never NaN (step 33h r2)"
(You may add tests.) The fence tests already cover the new code: `fx-live.ts` is a render-core file (pure, imports only `./x.ts`), and `world-scene.ts` stays the only scene file, importing only the render index and the notice type, with no game words.

## How a planted bug is caught (for QA)
`python3 /workspace/scratch-ea/s33h-plants-r4.py <your clone> <base clone at 49af2cb>` (`78e9808b…`): the r2 set plus **M1** (r4: the Infinity guard reverted, so an infinite `loopMs` draws nothing and never ends) (C1–C3 canopy, O1–O4 loader, F1–F4 effects, G1–G4 pose grid, E1–E8 events, L1–L4 and H1 laps and tie order, N1–N6 N-1/N-3/N-4, D1–D3 N-5, V1 N-6, A1–A4 attach and law 13, K1–K4 anchors, U1–U5 units, S1–S2 strips) on the merge. Each runs the shipped test plus world-scene, scene-fence and render-core with a 512 MB heap, then is reverted; a test file that crashes fails every test in it. **D1 and D2 are equivalent on the merge** (listed, not counted): 33a's `placeStep` now draws nothing for a NaN window itself. **H1** (laps stepped through `crossed`) no longer hangs on the merge (2^53 backstop) and is caught by the exact one-lap count. Expected: **52/52 caught; 52/52 catching tests fail on the Base** (the shipped file cannot load there). Result: `/workspace/scratch-ea/s33h-plants-r4-result.txt` (`c19bc0a0…`). QA's 43 (`qa33h-plants.py` `6d49a3eb…`; r2 anchors for Q22, Q23, Q27 in `qa33h-plants-r2anchors.py` `97700e5d…`): 40/40 counted caught (Q3/Q4 equivalent, Q6 caught by the step 30 tests), result `/workspace/scratch-ea/qa33h-plants-r4-result.txt` (`cf88932b…`); QA's r3 set (`tools-qa33h-plants-r3.py` `dbde12b8…`, 49 plants) 44/44 rule plants, D1/D2 equivalent, result `/workspace/scratch-ea/qa33h-plants-r3set-r4-result.txt` (`5f306922…`). Rulings → plants: 1: C1–C3; 2: O1–O4; 3: F1–F4; 4: G1–G4; 5: E1–E8, L4; 6: L1–L3, H1, M1; 7: N1–N4; 8: N5–N6; 9: A1–A4; 10: K1–K4; 11: U1–U5; 12: S1–S2; 13: D3, V1 (D1, D2 equivalent); 14: U4–U5; 15: K1 and QA Q35; 16: G1–G2.

## Example
A sword swing on the live screen:
- The game keeps `effects: [{id: "e1", castMs: 1000, caster: "a", start_on: "release", commitMs: 1000, pieces: [{at: 0, ms: 300, sheet: slash, anchor_point: "hand", draw_layer: "front-unit"}]}]` in its world.
- The driver's `view()` calls `link.scene(world, {tMs: clock.now(), stepMs: clock.stepMs})` each frame.
- Unit `a` plays `atk-right` with stored events release (frame 2) and contact (frame 3).
- At 1250 the scene has the slash just over `a` at its hand. `link.fired` holds `fx:start`, `clip:event release` and `fx:release`, all at 1200.
- At 1300 it holds `clip:event contact` and `fx:hit`, and `link.views.e1` is 1300: the time the game shows the hit.
- If `a` faces north, the slash draws just behind it. If `a` walks during a `follow` step, the slash goes with it.
- After a tab sleep, only one `fx:loop` would fire, computed directly. A NaN clock frame, or a NaN `castMs`, draws no slash and fires nothing; `views` never holds NaN.

## Decisions note: what to name
Name: the tile point formula; the event tie order (timeline order, `fx:loop` last at a tie); the direct last-lap formula (Ruling 6); the N-5/N-6 skips; the three settled answers (Rulings 14–16); the attach capture points (first live pose; first pose at or after hit) and that they are per lap; the live-store bound (one entry per playing effect, map of pieces); `fired` / `views` replaced per call; that `JSON.stringify` of the effect entries is the scene-change key (bounded per frame, not kept). Law 13 bounds to state: `createFxLive` keeps a `WeakMap<Clip, PointTable>`, a `WeakSet<Clip>` for strip warnings (both keyed by objects the world owns, so they shrink with edits) and the per-effect store above; the scene link keeps one previous scene. Reserved words: `self` (render purity, even in strings), `phase`; no game words in the scene file (`hp`, `mana`, `cost`, `deck`, `damage`, `cards`; also `Event` and `Node` as whole words).

## Do not touch
`locked/`; `src/types/core-types.ts`; `package.json`; the lock; `.dependency-cruiser.cjs`; `scripts/check-law.sh`; `data/*.md`; `src/runtime/render/fx-player.ts` (33a; call it, never change it); `draw-list.ts`; `canopy.ts`; `motion.ts`; `water.ts`; `bakes.ts`; `src/runtime/canvas/**`; `src/runtime/host/**`; `src/core/**`; `src/fx/**`; the sim; every existing test file; plus BUILD_GUIDE §7's never-edit list.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least 614 tests passing and none failing, skipped or todo.
- [ ] `tests/runtime/scene/host-hookup.test.ts` is byte-identical to sha256 `e1dc7ffd…`.
- [ ] Sims, all 20 smoke lines and every pin above unchanged; the four fence tests unchanged and passing.
- [ ] Each file within its cap; 150–400 changed lines in total (400–500 only with a written reason; over 500 is rejected).
- [ ] `scene(world)` with no clock and no canopy flag returns the same scenes as step 30 (all step 30 tests pass).
- [ ] No import line changes: `world-scene.ts` imports only `../render/index.ts` and `../../core/notice.ts`; `fx-live.ts` only `./frames.ts`, `./fx-player.ts`, `./types.ts`.
- [ ] Every Ruling's pinning test passes.
- [ ] Hand-back complete per `handoff/HAND-BACK.md` at the hand-back location above.

## Not in this step (carries, with their target step)
- **`step-33i-motion-shore-live` (next, before 33b):** the motion and shore pixel pipeline, which needs decoded pixels and image creation in the host, a draw-list motion hook and chunk-plan changes, so it does not fit here.
  - (a) the host loader for CN-012 motion (asset, `tileProps[i]`, `objects[]`; `pickMotion`, `bakeMotion` at load into the atlas, `ctx.animated`, `reduce_motion` and part offsets to `motionCell`, `Pixels` to images, `Canvas2D.lights` after `present`) and CN-013 shore (style `ramps`, `liquidEdge`, `shore` via `shoreSettings`);
  - (b) **motion warnings once per asset** (`motionInvalid`, `motionTooLarge`) and `shoreInvalid` per body or field;
  - (c) the **same `foamPx`** to `shoreDistance` and `shoreFrames`;
  - (d) a **chunked shore bake**, bounded per chunk with the neighbours' land within `SHORE_MAX` (no whole-map bake, about 268 MB on 256×256 tiles);
  - (e) a **finite clock for `motionCell`**;
  - (f) **validate the window before a dig re-bake** (`shoreDistance` throws on a wrong-length land array);
  - (g) the **live canopy cut** as an overlay. 33h wires the canopy through `createSeeThrough`, which costs one chunk rebuild per unit cell step under the canopy; QA called that fine.
  - (h) **strip warnings keyed by asset id plus clip name** (QA N-7): 33h keeps them once per clip object (a `WeakSet`), so a game that rebuilds clip objects every frame would push a strip warning every frame into the link's unbounded `notices`. 33i keys them by `sheet.id + clip.name` (and the same for the loader warnings it adds); until then the game keeps clip identity stable.
  33i may need a canvas-folder change (pixels to an image). If it needs any import line moved, that is CN-017, which is not needed here.
- **33b (CN-015):** as listed in step-33-effects-sync.md (particles, lights, Feel, shake, `pixel_scale`, tint ramps, RotSprite, budgets, the screen-centre anchor).
- **The game side:** keeping `effects` in the world (ids, cast times, commit times) and showing hits at `views[id]` belong to the game screen that calls `scene()`. Game rules stay out of the engine.

## Out of scope
Game rules. Format changes. core-types changes. Changes to the frame driver, the canvas backend or the draw list. Motion and shore pixels (33i).

## Open questions
1. CEO: the split. 33h is effects and canopy; motion and shore pixels go to `step-33i-motion-shore-live`, before 33b. Confirm the id and the order.

(r1's questions 1, 2 and 4 are settled by QA's review §6 and are now Rulings 14, 15 and 16, pending DSK/UX sight.)
