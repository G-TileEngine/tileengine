# step-p1-light-walls-door-gaps: thin walls stop light, and six door gaps get named refusals (post-34 polish plan, slices G3 + G4b as one build slice P1; no CN; no format change)

Step id: step-p1-light-walls-door-gaps          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`d867161c`** (`d867161c9e5e0ae3829cba172e8a8bb4ac6d432a`, tree `a775a78f`, main; on `d82f7044` and touching only `tools/` and `docs/qa/device-runs/TEMPLATE.md`, no overlap with this step). Branch: `step/step-p1-light-walls-door-gaps-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`. The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-p1-light-walls-door-gaps-r<N>.bundle d867161c..step/step-p1-light-walls-door-gaps-r<N>`, then `git bundle verify`. Upload the bundle plus a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete a file you did not upload in this chat; if a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-p1-light-walls-door-gaps/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 in full in it.
Depends on: step 35g5a, merged (main `d867161c`). No format change, no CN, no import line moves outside the files below.
Read first: BUILD_GUIDE.md §0 (§0.6 helpers: the helper rule; HANDBACK needs § Helpers & self-review), §6 (green), §7; this file (it carries everything needed from EA's plan and brief).
Kit: kit-1 r2 (guide-3), 2026-11-15. Engine Architect. Proto `/tmp/p1r` branch `p1-r`, head `a61498ee` (`a61498eebf8fd1ba2b27f11bd6ecde8fd529149d`, tree `afeeb6fe`; r1 `8e9b17b8` tree `2fa26097` + QA's M1 test fix; r1 parent `d867161c`, G-TileEngine noreply; the same change first built as `7cc231f9` on `d82f7044` and cherry-picked clean): 8 files, +179/−22 = 201 changed lines; green 702/0 (692 + 10); EA plants 21/21; on the Base the light-walls file fails to load (no `wallsFrom`) and all 6 door-gaps tests fail. Bundle backup `/workspace/scratch-ea/kit-backup-p1/`.
Carries: none filed. `package.json` (`1e5dd82c…`), the lock (`d7f64a09…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and `src/types/core-types.ts` (`d6d08696…`) unchanged.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
Two small, separate fixes in one slice (the files do not overlap). **G3 (plan item 3):** today light only stops at blocking cells, so a torch beside a thin edge wall (a door frame, a fence) lights the room behind it. After this step `Blockers` has an optional `lightWalls` list (per-cell edge bits), the light mask honours it, and `wallsFrom(grid)` gives the default: the grid's movement walls. **G4b (plan item 37, QA's post-34 rows 6, 7, 10, 11, 13, 14):** six hostile inputs that today throw, hang, eat memory or slip into the log each get a named refusal instead.

## Rulings
All rulings are EA (this kit) on the post-34 plan v2 (every teammate agreed) and EA's polish-1 brief (17:05 London). Every one is pinned.
1. **Light walls** (G3): `Blockers.lightWalls?: ArrayLike<number>` holds per-cell bits n 1, e 2, s 4, w 8, the same bits `core/grid` builds for movement walls. A cell stays in the light mask only if the straight line from the light's cell centre to its centre crosses no walled edge; an edge counts as walled if either cell has the bit (one-sided lists work). Pinned by: "a torch beside a thin wall lights none of the far side (P1 G3)".
2. **Short walls and corners** (G3): a short wall shadows only what is behind it; light goes round its ends. A line through an exact corner is blocked only if both ways round are walled. Pinned by: "a short thin wall shadows only what is behind it; light goes round its ends (P1 G3)".
3. **No walls, no change** (G3): without `lightWalls` (or with an all-zero list) masks and plans are byte-equal to the Base; the perf-34b walk counters and stress L do not move. Pinned by: "no light walls: masks and plans are byte-equal to before, and an all-zero wall list changes nothing (P1 G3)" and the unchanged `tests/runtime/perf-34b.test.ts`.
4. **The default and the cache** (G3): `wallsFrom(grid)` copies the grid's movement walls (any object with `cols`, `rows`, `hasWall(at, dir)`; render imports nothing from core). The host passes `lightWalls: wallsFrom(grid)` unless it wants different light walls (the D3 host guide says so). `createSight()` keys its cache on the light-walls list as well as the blocks. Pinned by: "the sight cache keys on the light walls too, and wallsFrom copies the grid's movement walls (P1 G3)".
5. **Row 6, effects cap**: an action with more `effects` than `limits.text` (default 128) is not an action: `readAction` returns null, `submit` notes `actionRefused` and logs nothing, and `parseLog` refuses such an entry. The cap is in `core/log/log.ts` `tooLong` (one token) so the log reader and `submit` agree. Pinned by: "row 6: an action with more effects than the text limit is refused as actionRefused and never logged (P1 G4b)".
6. **Row 7, dispose mid-copy**: `submit` checks `isDisposed(world)` again after copying the action (a getter may dispose the world); a disposed world logs nothing and nothing throws. Pinned by: "row 7: a getter that disposes the world mid-submit leaves no log entry (P1 G4b)".
7. **Row 10, after() bound**: `after(ms)` with `ms > 2147483647` (`INT_MAX` from `core/limits.ts`) is reported like other bad values: the same RangeError message through `onError`, the inert timer `{ id: 0, dueMs: -1 }`. `INT_MAX` itself is allowed. Pinned by: "row 10: after() with ms over 2147483647 is reported like other bad values and never armed (P1 G4b)".
8. **Row 11, ticking guard**: while a tick runs (timers then tick subscribers, in `step`, `advance` or `skip`), a call to `step`, `advance` or `skip` reports `RangeError("<name>: called inside a tick; ignored")` through `onError` and returns. The guard is set in `try`/`finally`, so a throwing callback cannot leave it on. Pinned by: "row 11: step, advance and skip called inside a tick are reported and ignored (P1 G4b)".
9. **Row 13, phases**: `restore` refuses a snapshot whose `phases` keys differ from the replayed world's or whose values are not in `ALL_PHASES`, with `Error("restore: snapshot phases are not this world's")`; `loadSave` returns `{ ok: false, code: "saveSnapshotPhasesInvalid", needsMigration: false }` for it. Pinned by: "row 13: restore and loadSave refuse phases whose keys or values are not this world's (P1 G4b)".
10. **Row 14, the log copy**: `restore` reads `log.entries()` once, refuses a length that is not an integer in 0..`MATCH_CEILINGS.entries` or any entry that is not a record with an integer `tick` and a record `action`, and replays that copy (`replay` keeps its signature). Any throw while reading becomes `Error("restore: the log is not plain data")`. Pinned by: "row 14: restore reads the log's entries once, bounded, and refuses a lying or throwing log by name (P1 G4b)".

## Files to create or change (and nothing else)
Size: 150–400 changed lines in total. The proto changes 201 lines (+179/−22) in 8 files:

| File | Base → proto / cap (changed lines) | Rulings |
|---|---|---|
| `src/runtime/render/visibility.ts` | 51 → 74 / 40 | 1–4 |
| `src/runtime/render/index.ts` | export `wallsFrom` / 2 | 4 |
| `src/runtime/render/light.ts` | unchanged (`LightWorld = Blockers & …` carries the field) / 10 | — |
| `src/core/clock/clock.ts` | 139 → 146 / 40 | 7, 8 |
| `src/core/log/log.ts` | one token in `tooLong` / 4 | 5 |
| `src/sim/actions.ts` | 32 → 33 / 6 | 6 |
| `src/sim/run.ts` | 114 → 125 / 40 | 9, 10 |
| `tests/runtime/render/light-walls.test.ts` | 0 → 48 (shipped) | 1–4 |
| `tests/sim/door-gaps.test.ts` | 0 → 67 (shipped) | 5–10 |

`core/log/log.ts` is outside the plan's G4b file list (`sim/{run,actions}.ts`, `core/clock/clock.ts`): the effects cap belongs in the reader so `parseLog` and `submit` agree. Do not touch `core-types`; `SaveRefusal` lives in `sim/run.ts`.

## Interfaces to match (quoted exactly; bodies elided as `…`)
```ts
// src/runtime/render/visibility.ts
export type Blockers = { readonly cols: number; readonly rows: number; readonly blocks: ArrayLike<number | boolean>; readonly lightWalls?: ArrayLike<number> };
export function wallsFrom(grid: { readonly cols: number; readonly rows: number; hasWall(at: { c: number; r: number }, dir: "n" | "e" | "s" | "w"): boolean }): Uint8Array { … }
// openCell, visibleCells, createSight: signatures unchanged

// src/sim/run.ts
export type SaveRefusal = { readonly ok: false; readonly code: … | "saveSnapshotTickInvalid" | "saveSnapshotPhasesInvalid"; readonly needsMigration: boolean };
// replay, restore, loadSave: signatures unchanged

// src/core/clock/clock.ts, src/sim/actions.ts, src/core/log/log.ts: no export changes
```
Refusal texts (exact): `restore: snapshot phases are not this world's`; `restore: the log is not plain data`; `step: called inside a tick; ignored` (also `advance:`, `skip:`). The `after()` message is the Base's, unchanged (an existing test pins it).

## Smoke lines
None move. Sims (stage-fixed 48/2, stage-weighted 22/28) identical; the 21 smoke lines match the Base except the report-only heap line (proto: delta +0.70 MiB vs +0.69 MiB, never asserted).

## Existing tests changed by ruling (and only these)
None.

## Tests that prove it is done
Shipped files (copy verbatim from `origin/main`; never weaken, rename, skip or delete; a failing one is a must-fix):
| Shipped file (under `handoff/steps/tests/step-p1-light-walls-door-gaps/`) | Copy to | sha256 |
|---|---|---|
| `tests/runtime/render/light-walls.test.ts` | `tests/runtime/render/light-walls.test.ts` | `7fc41d977f7b95a07b847fe1122db6d88c61d855475a0b83575d5d20529c7b6f` |
| `tests/sim/door-gaps.test.ts` | `tests/sim/door-gaps.test.ts` | `6f23cb22440d0b50bfb5e146d001b033c6c5382c4c5965e5817ceaf8bc2147ce` |

Titles (exact):
- `light-walls` — "a torch beside a thin wall lights none of the far side (P1 G3)": a 12×12 room, a full-height east wall beside the torch's cell; no lit square right of it, the near side lit; a one-sided wall list also stops light.
- "a short thin wall shadows only what is behind it; light goes round its ends (P1 G3)": one walled edge east and one north of the light's cell.
- "no light walls: masks and plans are byte-equal to before, and an all-zero wall list changes nothing (P1 G3)".
- "the sight cache keys on the light walls too, and wallsFrom copies the grid's movement walls (P1 G3)".
- `door-gaps` — "row 6: an action with more effects than the text limit is refused as actionRefused and never logged (P1 G4b)": 129 effects refused, 128 kept, a 300-effect log entry refused by `parseLog`.
- "row 7: a getter that disposes the world mid-submit leaves no log entry (P1 G4b)".
- "row 10: after() with ms over 2147483647 is reported like other bad values and never armed (P1 G4b)": 2^31, 2^53 + 2 and 1e300.
- "row 11: step, advance and skip called inside a tick are reported and ignored (P1 G4b)": from a tick subscriber and from a timer callback; the guard clears after the tick.
- "row 13: restore and loadSave refuse phases whose keys or values are not this world's (P1 G4b)": an extra key, `{}`, `"zzz"`, `5`, through `restore` and through a save text.
- "row 14: restore reads the log's entries once, bounded, and refuses a lying or throwing log by name (P1 G4b)": one read; a `length` of 1e9 refused in under 1 s; a throwing `entries()`, an `undefined` entry and a `NaN` tick each refused by name.
(You may add tests. The hand-back lists the two shipped files' sha256, unchanged.)

## How a planted bug is caught (for QA)
`/workspace/scratch-ea/sp1-plants.py <clone> <base clone>` (result `kit-backup-p1/sp1-plants-result.txt`) runs the whole `node --test` suite per plant and matches **full test titles**:
- G1–G7 light: walls ignored; only the cell's own bit read; a corner blocked if either way round is walled; north/south bits swapped; the cache ignoring the walls; `wallsFrom` dropping the west bit; absent walls read as walled everywhere.
- D1–D14 doors: no effects cap; no dispose re-check; no `INT_MAX` bound; `step`, `advance` or `skip` running inside a tick (one plant each); the guard covering timers but not tick subscribers; the guard silent; phases keys unchecked; phase values unchecked; `loadSave` letting the phases refusal throw; `restore` replaying `log.entries()` again; bad entries let through; a throwing log escaping unnamed.
Expected: **21/21 caught; on the Base the light-walls file fails to load (no `wallsFrom` export) and 6/6 door-gaps tests fail.** (A first D7, the guard never clearing, sent a suite loop into a hang and was replaced.) Not planted: dropping the length bound (the 1e9 liar then hangs for minutes and eats memory; the row-14 test's 1 s check is the pin).

## Example
QA's probes on the proto (`kit-backup-p1/probes-proto.txt`; Base in `probes-base.txt`): X1 log 1 → 0; S4 1e6 effects logged → `actionRefused`; X7 400k effects logged then `saveTooLarge` on reload → refused, reload ok; C1 `after(1e300)` armed → RangeError, id 0; C5 re-entrant `step()` in a timer → reported, tick 2 not 3; C6 `step()` in a tick subscriber ran 2920 ticks → 1; X4/R2 bogus phases accepted → `restore: snapshot phases are not this world's`; X5/X8 → `saveSnapshotPhasesInvalid`; R4 liar log threw after 68.6 s → `restore: the log is not plain data` at once; X6 TypeError → the same named error. 
Light (proto, res 8, a 12×12 room of 16 px tiles, torch at (88, 88) radius 64):
- no `lightWalls`: 208 lit squares, 88 of them right of the wall line;
- a full-height wall on the torch cell's east edge: 120 lit squares, 0 right of it;
- an all-zero list: the plan equals the no-walls plan byte for byte.

## Decisions note: what to name
- Why the line test runs after the shadowcast (only cells the cast already marked are re-checked, inside the radius box), so a scene without `lightWalls` takes no new path.
- The exact-corner rule (blocked only if both ways round are walled) and why light goes round a single wall's end.
- Why `wallsFrom` takes a structural grid (render may not import core) and why the default is a host call, not a guess inside the renderer.
- Why the effects cap reuses `limits.text` (no new limit field, no format word) and lives in the reader.
- Why a disposed world refuses silently (there is no world left to note on), as the Base's first `isDisposed` line does.
- Why `restore` copies the entries and `replay` keeps its signature (an internal `replayList`).
- Why the phases check compares with the replayed world (keys) and `ALL_PHASES` (values), not with a fixed list of keys.
- Why `loadSave` maps only the phases refusal to a code (the other restore refusals keep throwing, as on the Base).
- Why the ticking guard reports through `onError` rather than throwing (a tick subscriber's throw is already caught and reported).

## Do not touch
`src/types/core-types.ts`; `src/state/**`; `package.json`; the lock; `.dependency-cruiser.cjs`; `scripts/check-law.sh`; `tsconfig.json`; `eslint.config.*`; `BUILD_GUIDE.md`; `STATES.md`; `scripts/check-state.sh`; `tools/**`; every existing test file; `locked/`; `data/*.md`; plus BUILD_GUIDE §7's never-edit list.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least 702 tests passing (692 + the 10 shipped) and none failing, cancelled, skipped or todo; typecheck, lint, deps, check:law and check:state each exit 0.
- [ ] The two shipped files are byte-identical to the sha256s above.
- [ ] Sims, the 21 smoke lines (heap line report-only) and every pin unchanged; `git diff d867161c --stat -- package.json package-lock.json BUILD_GUIDE.md src/types src/state tools` is empty.
- [ ] Each file within its cap; 150–400 changed lines in total (the proto is 201).
- [ ] `tests/runtime/perf-34b.test.ts` passes unchanged; `node tests/perf/stress-budget.ts` prints stress L p95 under 2 ms in every lap (paste the line; proto p95 1.08–1.16 ms).
- [ ] (QA verifies, not the builder) QA's post-34 probes show a named refusal for rows 6, 7, 10, 11, 13, 14, no throw other than the named restore errors, no hang, no log entry.
- [ ] Every Ruling's pinning test passes.
- [ ] Hand-back complete per `handoff/HAND-BACK.md` at the hand-back location, with § Helpers & self-review.

## Not in this step (carries, with their target step)
- **D3 host guide**: tell hosts to pass `lightWalls: wallsFrom(grid)`; the door-policy table.
- **Row 14 deeper**: a log whose single entries lie on every read (getters on `tick`/`action`) is copied once but not deep-copied; D3 notes it.
- QA's other S-rows (a getter that submits again or steps the clock during `submit`): not rows of this slice.
- Lights that pass through windows (light walls that let light through but block movement, or the reverse) beyond what a custom `lightWalls` list already gives.

## Out of scope
Game rules. Format changes. New limit fields. Movement walls. Any change in `light.ts`'s plan or op walks.

## Kit files to push
All under `/workspace/tileengine`, full sha256 in `/workspace/share/polish-1/push-sha256.txt` (3 files):
- `handoff/steps/step-p1-light-walls-door-gaps.md` (this file)
- the two shipped files under `handoff/steps/tests/step-p1-light-walls-door-gaps/` (table above)

## Rulings (no open questions)
- Carry (QA N1): an oversized action costs ~93 MB of temporary heap because the plain copy runs before the effects cap; not fixed here.
- QA r1 (cf2097b5) M1 adopted: the one-sided wall test checks both sides of the edge (QA's q2-fix c8cea818).
- EA ruling (light-walls default): the host passes `lightWalls: wallsFrom(grid)` (D3 says so); absent stays no walls, byte-equal. A later scene builder may fill it in; no code for that now.
- EA ruling: `saveSnapshotPhasesInvalid` needs no format word; `SaveRefusal` codes are runtime results, never saved data.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 702 passing and 0 failing**. Paste the summary line into HANDBACK.md.
- The two shipped files are **byte-identical** to the sha256s above; list each in HANDBACK.md, and paste the stress L line.
- The bundle is `<Base d867161c>..step/step-p1-light-walls-door-gaps-r<N>` and passes `git bundle verify`. Each file stays within its cap, and the total (insertions + deletions) is 150–400 changed lines (the proto is 201). Every pin unchanged.

## Delivery
On branch `step/step-p1-light-walls-door-gaps-r<N>` (base `d867161c`), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), run `git bundle create step-p1-light-walls-door-gaps-r<N>.bundle d867161c..step/step-p1-light-walls-door-gaps-r<N>` and then `git bundle verify`. Upload the bundle and a HAND-BACK-step-p1-light-walls-door-gaps-r<N>.md to Google Drive (chatB adds `-chatB` to both names, chatB2 adds `-chatB2`, and either chat adds `-2` if a name already exists). On Drive, never move, rename, overwrite or delete a file you did not upload in this chat. The committed HANDBACK (`handback/step-p1-light-walls-door-gaps/r<N>/HANDBACK.md`, shape `handoff/HAND-BACK.md`, the branch's last commit) must quote this step file's sha256 in full, its § Helpers & self-review must list each helper and what it reviewed plus your self-review, and its PR line must read `PR: opened by Chief Of Staff from the bundle`. Don't push and don't commit to main.
