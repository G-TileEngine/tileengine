# step-34a-perf-lite: measured perf fixes and the auto-lite safety net (renderer plan slice 34, part 34a; no CN; seams 35, 36, 37 logged)

Step id: step-34a-perf-lite          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`1bd476bd`** (main after PR #46, the step 33b-3 merge: chatB2 plus QA's pick `634e9219`; tree `144b13c0`; verified 672/0). Branch: `step/step-34a-perf-lite-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`. The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-34a-perf-lite-r<N>.bundle 1bd476bd..step/step-34a-perf-lite-r<N>`, then `git bundle verify`. Upload the bundle plus a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete a file you did not upload in this chat; if a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-34a-perf-lite/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 in full in it.
Depends on: step 33b-3, merged `1bd476bd` (`world-scene.ts` effects cache, `wm.shore`, the actor callback into `live.frame`; `light.ts` `createLighting().plan` and `lightOps`; `canvas2d.ts` `lights`; `raf-driver.ts` `images`, `capFps`, `needsDraw`). No format change, no CN, no import line moves.
Read first: BUILD_GUIDE.md §0 (helper rule), §3 (runtime import lines), §7, law 13; `/workspace/scratch-ea/s34-scope-proposal.md` (`64cdc230…`, the 34a rows a1–a7); `/workspace/scratch-ea/integration-seams.md` (`598bbb82…`) seams 35–37 (logged with this step); `tests/perf/fx-light-budget.ts` (`PERF`, `judge`).

Kit: kit-1 r2 (guide-3), 2026-11-15. Engine Architect. r2 folds in QA's r1 review (`docs/qa/step-34a-review.md` `6a5df869`): QA's test-only qfix `235fc860` (noreply; tree `950f313e`) extends both shipped test files (M1–M3; R-c accepted, so G6 is not needed), N3's comment names the effects array, R-a and R-b are written in, and the harness's light raster is QA's colour check (N1). Prototyped on Node 24: branch `r34a` on `1bd476bd`: EA proto r1 `696c530b` (tree `93d3ad97`), QA's qfix `235fc860`, then **proto r2 `fe235a9041c247c578faebeb22aefd828dea4160`** (tree `c1985173`; comment-only change in `world-scene.ts`). `npm ci && npm run green` exits 0 with `tests 681 pass 681 fail 0` (672 + 9); `tsc` 0; lint, deps (106 modules, 0 violations), check:state and check:law pass. Sims unchanged (stage-fixed 48/2, stage-weighted 22/28); the 21 smoke lines match the Base (the heap line is report-only). Every draw list is byte-equal to the Base: `/workspace/scratch-ea/s34a-equal.ts` (sha256 over the draw-list commands and light ops of 400 frames of each stress scenario A, B, C, E, L, plus QA's light-raster colour check, `lightraster dca58548…`) gives the same output on the Base and the proto. Plants: `/workspace/scratch-ea/s34a-plants.py` **42/42 caught; 7/8 of EA's new tests fail on the Base** (the stress-rig test pins the Base's draw-list hash and passes there by design); X1 listed, not counted (seam 35); QA's `qa-plants.py` **20/20 caught** (Q8 an equivalence probe, not counted). Bundle copy `/workspace/scratch-ea/kit-backup-r34a/r34a.bundle` (`1bd476bd..r34a`, verified); kit sha list `/workspace/scratch-ea/kit-backup-r34a/r2-kit-sha256.txt`.
Carries: none. `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`), the lock (`d7f64a09…`) and `src/types/core-types.ts` (`d6d08696…`) unchanged.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
After this step the measured slow spots are gone without changing a pixel: the light plan and its ops cost the view and each light's box, not the map (128² at res 4: p95 ≈ 4.2–5.2 → ≈ 1.0–1.4 ms); the shore is rebuilt only when the water changes; the effects cache key no longer stringifies every effect; the actor lookup is one index per call; the driver's image map is capped without ever dropping an image in use. A stress rig pins the counts and the draw-list hash in the suite and runs the 4 ms p95 alone. When a device stays too slow the driver turns on lite by itself (with hysteresis), the player or host can override it, and the frame rate stays uncapped by default with the 60 fps cap as a setting.

## Rulings
All rulings are EA (this kit) on the user's 34a brief (2026-11-14 23:08 London), the CEO's answers on auto lite (CEO 2026-11-14 23:24, via CoS) and the user's 34a rulings (2026-11-14 23:32) unless a source is named. Every one is pinned.
1. **Pixel-identical** (user brief): every draw list, light op and light-canvas raster is byte-equal to the Base for the same inputs while lite is off. Pinned by: "stress rig: draws per frame stay in budget, no notices, and the draw list hashes as on 1bd476bd (step 34a)" (C 60 frames `da3c665e…`, L 30 frames `18d97599…`).
2. **Stress rig, counts in the suite, wall clock alone** (a1; 33b-2 M-C (a)): `tests/perf/stress-budget.ts` exports `Stress`, `STRESS` (A 64² no water; B 64² water, 20 walking; C B + 100 effects; E C at 128²; L 128² torch at res 4) and `stressRig(o, hashing?)`. The suite checks most draws ≤ 300, no notices and the hash; `node tests/perf/stress-budget.ts`, run alone, asserts each lap's p95 ≤ 4 ms (`PERF`, `judge`). Not in `npm test`. Pinned by the Ruling 1 test.
3. **Light bounded to the view and the light boxes** (a2): `plan` fills `dark` once with the unlit value `Math.round((total * BANDS_OF_LIGHT) / BANDS_OF_LIGHT)` and recomputes only inside each light's box; `lightOps` walks squares from one before the view to one after it, clamped to the plan, and draws a square only if it is on screen (the Base's test). Canvas2D's light layers paint one `fillRect` per equal-colour run per row. A torch at any view edge lights exactly as on the Base. Pinned by: "light: ops read only the view's squares and match the plan square for square, a torch at either view edge included; the canvas paints one fill per run (step 34a)".
4. **Shore memo** (a3): the water grid and `wm.shore` run again only when the ground tiles array, the water ids array (identity), `style`, `cols`/`rows`/`tileW`/`tileH`/`mapSeed` or reduce change; otherwise the last foam overlays are reused. A dig must hand in a new tiles array. Pinned by: "shore: the water grid and foam are kept while tiles, water ids, style and size stay; a dig, a new style or a size change rebuilds (step 34a)".
5. **Effects are values** (a4; user ruling 3): the effects cache key carries a revision bumped when `world.effects` is a different array whose elements are not all the same objects in order; it never stringifies effects. To change an effect the host replaces the effects array and the object; pushing into the same array or editing an object in place is not seen (N3; low risk: the key still carries the pose, so an in-place edit shows at the next pose step while the clock runs). The doc comment on `SceneWorld.effects` says so (quoted below). A revision counter from the game is seam 37. Pinned by: "effects: the cache key never stringifies world.effects, an equal effects list keeps the cached scene, new effects at the same pose redraw (step 34a)".
6. **Actor index** (a5): the actor callback reads per-call maps (standing by key, unit by id), first match wins as `find` did. Duplicate-id first-wins is unpinned (seam 35, user ruling 1). Pinned by: "effects: the actor lookup indexes units once per call instead of a find per actor; a duplicate id still resolves to its first unit (step 34a)".
7. **Image cap** (a6): `DriverOptions.imagesMax` (default 256) bounds the loaded-or-asked ids, least recently asked first. Never evicted: an id asked this frame (the tick advances before `view()`, so the scene's pixel-source reads count) or a sheet the current scene names (ground, above, standing, overlays). Eviction drops the id from the map and the asked set, so it reloads when asked again; a load landing after its drop is not kept. Failed loads become evictable, so they retry. Pinned by: "the image map is capped: an old sheet drops and reloads when asked again, a sheet the scene still names never drops, a load landing after its drop is not kept (step 34a)".
8. **Auto lite** (a7; CEO 2026-11-14 23:24, via CoS: lite switches on automatically when the measured frame time stays too slow, with hysteresis): frame ms is the gap between rAF stamps (only in `raf-driver.ts`; gaps over 1 s are not frames). Lite turns on when the p95 of two back-to-back 60-frame windows is over **25 ms**; it turns off when a window's p95 is under **18 ms** and lite has held **10 s**, the hold doubling per release up to 5 min. Each switch restarts the window. Memory: two 60-entry arrays. The thresholds, 2 windows and the doubling hold are pinned for now and re-tuned after the 34b device run (user ruling 6). **R-b** (user ruling 2026-11-15 00:09): the hold never shrinks within a session in 34a (after 5 releases it stays at 5 min); whether it should decay is re-checked after the 34b device run. Pinned by: "lite: two slow 60-frame windows switch it on; 16 ms frames switch it off only after a 10 s hold that doubles; 20 ms frames and gaps never flip it either way; an override is never fought (step 34a)".
9. **The override is never fought** (CEO 2026-11-14 23:24, via CoS: the player or host can turn it off with an override the auto logic never fights): `driver.lite("on" | "off")` sets `stats.lite` and holds it; auto keeps measuring; `driver.lite("auto")` shows auto's current state. Pinned by the Ruling 8 test.
10. **A flip requests one draw** (user ruling 5): whenever `stats.lite` changes (auto or override) the driver clears its last frame stamp so the next rAF draws, and the host's next scene (built with `stats.lite` in its clock) shows without waiting. Setting the same mode again draws nothing. The driver never changes a draw list itself. Pinned by: "a lite flip, by override or by auto, requests one draw of an idle scene; setting the same mode again does not (step 34a)".
11. **Uncapped by default** (CEO 2026-11-14 23:24, via CoS): `capFps` stays optional and absent means uncapped; 60 is a setting. Pinned by the existing "a 120 Hz panning view draws 120 a second, 60 with capFps 60, and the clock keeps time either way (step 29)".
12. **Accepted remainders** (user ruling 2): the plan's per-call array allocation and one `dark.fill`, and Canvas2D's whole-plan repaint (per run, not view-bounded), stay for 34a: seam 36. **R-a** (user ruling 2026-11-15 00:09): the light-box-only dark recompute is perf-only (reverting it changes no output; stress L p95 about 1.0 → 1.9 ms) and is folded into seam 36; 34b's device run sets a tighter L budget.

## Files to create or change
- create `tests/perf/stress-budget.ts` (≤ 48; shipped rig and serial perf script, verbatim)
- create `tests/runtime/scene/perf-34a.test.ts` (≤ 68; shipped, verbatim; R-c)
- change `tests/runtime/host/raf-driver.test.ts` (≤ 190; shipped as the full file, verbatim: the rig's `max` option and four tests appended, one of them QA's; R-c)
- change `src/runtime/render/light.ts` (≤ 92; Ruling 3)
- change `src/runtime/canvas/canvas2d.ts` (≤ 155; the per-run light paint)
- change `src/runtime/scene/world-scene.ts` (≤ 133; Rulings 4–6 and the `effects` doc comment)
- change `src/runtime/host/raf-driver.ts` (≤ 105; Rulings 7–10)

Size (G7: insertions + deletions): the proto changes **203** lines (+181/−22) in 7 files: product code 58 (+46/−12) in 4 files (N3 is comment-only inside an existing line), tests and rig 145 (+135/−10). Inside the normal band (≤ 400). Each file's cap is its proto count + 4.

| File | Base → proto / cap | Changes |
|---|---|---|
| `src/runtime/render/light.ts` | 86 → 88/92 | +8/−6 |
| `src/runtime/canvas/canvas2d.ts` | 151 → 151/155 | +1/−1 |
| `src/runtime/scene/world-scene.ts` | 125 → 129/133 | +9/−5 |
| `src/runtime/host/raf-driver.ts` | 89 → 101/105 | +20/−8 |
| `tests/perf/stress-budget.ts` | 0 → 44/48 | +44 |
| `tests/runtime/scene/perf-34a.test.ts` | 0 → 64/68 | +64 |
| `tests/runtime/host/raf-driver.test.ts` | 153 → 186/190 | +35/−2 |

## Interfaces to match (quoted exactly; bodies elided as `…`)
```ts
// host/raf-driver.ts
export type DriverOptions = {
  …
  readonly imagesMax?: number; // a6 (s34): loaded or asked ids kept (default 256); never drops one drawn this frame or named by the scene
};
export type Driver = { start(): void; touch(): void; catchUp(ms: number): void; dispose(): void; lite(mode: "auto" | "on" | "off"): void; readonly backend: Canvas2D; readonly stats: { frames: number; draws: number; rev: number; failed: number; errors: number; lite: boolean } };
const LITE = { frames: 60, onMs: 25, offMs: 18, holdMs: 10_000, holdMaxMs: 300_000, gapMs: 1000 } as const; // not exported

// scene/world-scene.ts (SceneWorld; only the comment is new)
/** Effects are values: to change one, the host replaces the effects array and the object; pushing into the same array or editing an object in place is not seen (step 34a; seam 37). */ readonly effects?: readonly LiveFx[];

// tests/perf/stress-budget.ts (test file)
export type Stress = { readonly size: number; readonly water: boolean; readonly moving: number; readonly effects: number; readonly res?: number };
export const STRESS: Readonly<Record<string, Stress>> = { … };
export function stressRig(o: Stress, hashing = false): { frame: (f: number) => void; counts: () => number[]; hash: () => string } { … }
```
No other export is added or changed. New exported types: none in `src/` beyond `DriverOptions.imagesMax?`, `Driver.lite` and `stats.lite`; `Stress` lives in the test file.

## Smoke lines
None move. Sims (stage-fixed 48/2, stage-weighted 22/28) identical; the 21 smoke lines match the Base (the heap line is report-only).

## Existing tests changed by ruling (and only these)
- `tests/runtime/host/raf-driver.test.ts`: the rig gains `max?: number` (passed as `imagesMax`); four tests are appended (Rulings 7–10; the fourth is QA's). Everything else in the file is unchanged.

## Tests that prove it is done
Shipped tests (copy verbatim from `origin/main`; never weaken, rename, skip or delete; a failing one is a must-fix):
| Shipped file (under `handoff/steps/tests/step-34a-perf-lite/`) | Copy to | sha256 |
|---|---|---|
| `tests/perf/stress-budget.ts` (rig + perf script) | `tests/perf/stress-budget.ts` | `03412170f195afaadf47333147df1ba5b32bc7dcacdaf7bb63f6f7bcc096b576` |
| `tests/runtime/scene/perf-34a.test.ts` | `tests/runtime/scene/perf-34a.test.ts` | `d507c7523047bbc7256e1e7b10f327205d6e2b416c6da782b35b1fbc2e40d45e` |
| `tests/runtime/host/raf-driver.test.ts` (full file) | `tests/runtime/host/raf-driver.test.ts` | `c2288e9c9cbdff7ca90663736ccdfc67ffcfc0064ec3d63d96b74b488941a83c` |

Titles (exact), `perf-34a.test.ts`:
- "stress rig: draws per frame stay in budget, no notices, and the draw list hashes as on 1bd476bd (step 34a)"
- "light: ops read only the view's squares and match the plan square for square, a torch at either view edge included; the canvas paints one fill per run (step 34a)"
- "shore: the water grid and foam are kept while tiles, water ids, style and size stay; a dig, a new style or a size change rebuilds (step 34a)"
- "effects: the cache key never stringifies world.effects, an equal effects list keeps the cached scene, new effects at the same pose redraw (step 34a)"
- "effects: the actor lookup indexes units once per call instead of a find per actor; a duplicate id still resolves to its first unit (step 34a)"
Titles (exact), appended to `raf-driver.test.ts`:
- "the image map is capped: an old sheet drops and reloads when asked again, a sheet the scene still names never drops, a load landing after its drop is not kept (step 34a)"
- "lite: two slow 60-frame windows switch it on; 16 ms frames switch it off only after a 10 s hold that doubles; 20 ms frames and gaps never flip it either way; an override is never fought (step 34a)"
- "a lite flip, by override or by auto, requests one draw of an idle scene; setting the same mode again does not (step 34a)"
- "lite (QA 34a): only back-to-back slow windows switch it on; a window's p95 ignores three spikes; gaps never count toward the hold; the hold doubles up to its 5 min cap"
(You may add tests. The hand-back lists all three shipped files' sha256, unchanged. QA's qfix extends the two test files, R-c.)

Timings (`node tests/perf/stress-budget.ts`, run alone, p95 per lap in ms; Base → proto): A 0.61/0.32/0.35 → 0.62/0.38/0.37; B 0.65/0.45/0.42 → 0.80/0.49/0.50; C 2.82/1.60/1.96 → 2.43/1.35/1.42; E 2.23/2.05/2.05 → 2.34/1.73/2.13; **L 5.15/4.31/4.21 (fails 4 ms) → 1.42/1.06/1.12**. Counts unchanged (A 27, B 113, C 181, E 181 draws; L 381 light ops).

## How a planted bug is caught (for QA)
`/workspace/scratch-ea/s34a-plants.py <clone> <base clone>` (result `s34a-plants-result.txt`) runs 42 plants against the whole suite, matching **full test titles**:
- A1–A2 rig: the river pattern (hash), the draw count.
- L1–L8 light: each of the four view bounds one square tight, the whole-plan walk, the unlit fill, the box recompute skipped or only the first box.
- C1–C3 canvas: a run one square wide, per-square paint, the row's last run dropped.
- S1–S5 shore memo: style, tiles identity, size, memo off, reduce.
- F1–F4 effects key: never bumps, back to JSON, an equal list bumps, a same-length new list does not.
- X2–X3 actor index: last standing wins, back to `find`.
- I1–I8 image cap: scene sheets evicted, this frame's ids evicted, anything evicted, the asked mark kept, no eviction, a late load kept, the default off, the tick after the view.
- K1–K10 auto lite: the 25 / 18 thresholds, one window, no hold, no doubling, gaps counted, auto over the override, ms not from rAF, auto state forgotten, a flip without a draw.
Expected: **42/42 caught; 7/8 of EA's new tests fail on the Base** (the stress-rig test pins the Base's hash and passes there by design). Listed, not counted: X1 (the unit index last-wins), seam 35.

QA's set: `qa-plants.py <clone>` (from `qa-runs/step-34a-review/probes/`, with `plantlib.py`) runs 21 more plants (Q1–Q21) against the whole suite. Expected with the r2 proto: **20/20 caught** (Q8, the window restart on a switch, is an equivalence probe and not counted: switches happen only at window boundaries, N7). P1 (the whole-map dark loop) is perf-only (R-a, seam 36).

## Example
A 128² river map at night with a torch, 200 units (20 walking) and 100 looping effects: the torch's light costs its box plus the view's squares, the canvas paints one fill per colour run, the river's foam is built once, and the frame looks exactly as on the Base. On a phone where frames run at 40 ms for two 60-frame windows (120 frames, about 4.8 s), `stats.lite` turns true, the driver draws once, and the host's next scene plays at the lite grid; frames at 16 ms for 10 s turn it off again (20 s the next time). A player who picks "full quality" calls `driver.lite("off")` and auto never turns it back on.

## Decisions note: what to name
- The view margin (one square each side, clamped) and the run-length paint.
- The shore memo's key (tiles and ids by identity, style, size, seed, reduce) and that a dig hands in a new array.
- The effects revision rule (identity, element-wise) and the values contract.
- The image cap's "in use" (this frame's tick, the scene's sheets) and that failed loads retry after eviction.
- The lite thresholds, windows, hold, gap rule and the draw request on a flip.
- Law 13 bounds: the shore memo holds one entry; the actor maps live for one call; the image map ≤ `imagesMax` plus in-use ids; the lite windows are two fixed 60-entry arrays. No other new maps or memos.

## Do not touch
`locked/`; `package.json`; the lock; `.dependency-cruiser.cjs`; `scripts/check-law.sh`; `data/*.md`; `src/types/core-types.ts`; `src/core/**`; `src/fx/**`; every render file except `light.ts`; `needsDraw` in `dirty.ts`; the sim; every existing test file except `raf-driver.test.ts` (by the shipped copy); plus BUILD_GUIDE §7's never-edit list.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least 681 tests passing and none failing, cancelled, skipped or todo.
- [ ] The three shipped files are byte-identical to the sha256s above; `node tests/perf/stress-budget.ts`, run alone, exits 0 (every lap's p95 ≤ 4 ms for A, B, C, E and L).
- [ ] Sims and every pin unchanged; the smoke lines match the Base (heap delta excepted); `tests/perf/fx-light-budget.ts` and `fx-particles-budget.ts` still pass alone.
- [ ] Each file within its cap; changed lines (insertions + deletions) in total within 150–400 (the proto is 203).
- [ ] With lite off, every draw list is byte-equal to the Base (the stress-rig hash test; QA may run `s34a-equal.ts`).
- [ ] `requestAnimationFrame` appears only in `raf-driver.ts`; the host folder still holds only the driver and reads no wall time.
- [ ] Every Ruling's pinning test passes.
- [ ] Hand-back complete per `handoff/HAND-BACK.md` at the hand-back location, `handback/step-34a-perf-lite/r<N>/HANDBACK.md` (Delivery).

## Not in this step (carries, with their target step)
- **34b**: the pixel suite, the renderer self-test page and the device log; the device run re-tunes Ruling 8's thresholds, sets a tighter L budget for the stress rig (R-a), and re-checks whether the lite hold should decay within a session (R-b).
- **Seams 35–37** (logged with this step): duplicate-id first-wins unpinned (35); the plan's per-call allocation and fill, Canvas2D's whole-plan repaint and the perf-only light-box recompute (36); an effects revision from the game instead of identity (37).
- **The game side**: building the scene clock's `lite` from `stats.lite`, and a settings toggle for the override and the 60 fps cap.

## Out of scope
Game rules. Format changes. A WebGL path. Changing any draw list while lite is off.

## Kit files to push
All under `/workspace/tileengine`, full sha256 in `/workspace/scratch-ea/kit-backup-r34a/r1-kit-sha256.txt`:
- `handoff/steps/step-34a-perf-lite.md` (this file)
- `handoff/steps/tests/step-34a-perf-lite/tests/perf/stress-budget.ts` (`03412170…`)
- `handoff/steps/tests/step-34a-perf-lite/tests/runtime/scene/perf-34a.test.ts` (`d507c752…`)
- `handoff/steps/tests/step-34a-perf-lite/tests/runtime/host/raf-driver.test.ts` (`c2288e9c…`)
- `handoff/README.md`, `docs/core-spine-slices.md`

## Open questions
Ruled (user 2026-11-14 23:32): X1 unpinned (seam 35); light remainders accepted (seam 36); effects are values (seam 37); the image cap as built; a flip requests one draw; thresholds pinned until 34b. Ruled in r2 (user 2026-11-15 00:09): M1–M3 QA's qfix adopted; R-a perf-only, folded into seam 36; R-b the hold never shrinks in 34a; R-c both shipped files re-shipped with caps 190 and 68; N1 harness light raster by colour; N2 Example timing; N3 the array in the values contract; N5 spine wording; N4, N6, N7 no change. None open.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 681 passing and 0 failing**. Paste the summary line into HANDBACK.md.
- The three shipped files are **byte-identical** to the sha256s above; list each in HANDBACK.md, and paste the output of `node tests/perf/stress-budget.ts` run alone.
- The bundle is `<Base 1bd476bd>..step/step-34a-perf-lite-r<N>` and passes `git bundle verify`. Each file stays within its cap (proto count + 4), and the total (insertions + deletions) is 150–400 changed lines (the proto is 203). Every pin unchanged.

## Delivery
On branch `step/step-34a-perf-lite-r<N>` (base `1bd476bd`), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), run `git bundle create step-34a-perf-lite-r<N>.bundle 1bd476bd..step/step-34a-perf-lite-r<N>` and then `git bundle verify`. Upload the bundle and a HAND-BACK-step-34a-perf-lite-r<N>.md to Google Drive (chatB adds `-chatB` to both names, chatB2 adds `-chatB2`, and either chat adds `-2` if a name already exists). On Drive, never move, rename, overwrite or delete a file you did not upload in this chat. The committed HANDBACK (`handback/step-34a-perf-lite/r<N>/HANDBACK.md`, shape `handoff/HAND-BACK.md`, the branch's last commit) must quote this step file's sha256 in full, and its PR line must read `PR: opened by Chief Of Staff from the bundle`. Don't push and don't commit to main.
