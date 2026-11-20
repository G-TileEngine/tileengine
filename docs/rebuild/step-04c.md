# Rebuild record: step 4c, stages and maps

Original brief: [`docs/maker/steps/step-04-stage-editor.md`](../maker/steps/step-04-stage-editor.md) r6, the 4c sections (L270-363) and the shared run rules (blob `35cc37db`, sha256 `d68a075a6ae2be61321afa3cf2e356e2d0b334e9cb448d759ab128ae209dab10`, 384 lines, the same on main, the base and at the merge). Do [`step-04b.md`](step-04b.md) first; this step starts on the 4b merge and needs 4b (guide L8, L18). This file records exactly what shipped.

Sources: PR #86 and branches `step/step-04c-stages-maps-r1-chatA` (r1 tip `4c2f4cb8`, r1 code head `73ac4720`) and `step/step-04c-stages-maps-r2-chatA` (r2 tip `43e146d9`, r2 code head `faa74a07`); `handback/step-04c-stages-maps/r1/HANDBACK.md` at `4c2f4cb8` (HB1, blob `f0f772bb`, 66 lines) and `handback/step-04c-stages-maps/r2/HANDBACK.md` at `43e146d9` (HB2, blob `0f477754`, 86 lines); Chief Of Staff verify reports `/workspace/share/step-04c-verify/report.md` (V1, sha256 `d3354f9d1f237028639415e86d80fde12548cccc2a78ae1f0dbc295bba9a0d3a`, 42 lines) and `/workspace/share/step-04c-r2-verify/report.md` (V2, sha256 `ace10fb6b4e324a76aaab8c457b33f38412328305ddd5036edd6ce33918231c3`, 34 lines). `docs/qa/step-04c-review.md` (QA1, git hash-object `85172115`, 41 lines, already on main `a98f1b79` and at the merge): **NOT OK**, three must-fixes, all in the HANDBACK and the smoke harness, no product change required (QA1:3). `docs/qa/step-04c-r2-review.md` (QA2, git hash-object `e73a04c3`, 33 lines, on main `a6538ee1`): **OK TO OPEN PR**, product and test code unchanged from r1 (QA2:3). Line numbers are at the commit named. Code line cites are at merge `9bbd115a` unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `a85ae665cbb4db53b958be6e29b2f68ec56c4d60`, the step 4b merge (PR #85). Floor **1063** tests (guide L17, L340: 4b's final count + N) |
| r1 commits | `73ac4720` maker: add, rename and resize stages and maps (code head, tree `cde99f9d`, HB1:3), `4c2f4cb8` hand-back (tree `0695ed7f`, V1). Linear, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>` |
| r1 verdict | Product behaviour passed. QA **NOT OK** (QA1:3). Three must-fixes, all in the HANDBACK and the smoke harness, no product change required (QA1:3, QA1:8-10): § Smoke summarised “Checks 1–7 were ok” instead of pasting the ok lines (guide L35); § Decisions named only `tools/maker/rooms.ts` over its cap, not `resize.ts` (63 vs 60) or `read-project.ts` (4+/4− vs 3) (guide L319 / L141); smoke check 8 ran `big()` only at the end of each `step()`, after every new 4c sheet had closed, and did not print a `8 targets` line (guide L329) |
| r2 commits | on `step/step-04c-stages-maps-r2-chatA`, built on the r1 tip: `faa74a07` test: measure each 4c sheet at 48px while it is open (code head, tree `d140607f`, HB2:3), `43e146d9` hand-back (tree `2f2af33c`, V2, QA2:5). No product or test file changed |
| r2 verdict | QA **OK TO OPEN PR** (QA2:3). All three must-fixes pass. § Smoke pastes the 16 ok lines (checks 1–7 and `8 targets` at 390 and 360) plus `SMOKE PASS` from one solo run, and keeps the 3-run / CPU-burn note (QA2:11). HB:82 names `resize.ts` and `read-project.ts` word for word (QA2:12). Check 8 measures each listed sheet while it is open and prints `8 targets @<width>` (QA2:13-16). Gate 382 + 12 = 394. Behaviour is unchanged |
| Merge | PR #86 "Step 4c: stages and maps (r2)", merge commit `9bbd115a625f840323d0d13413d9c41362892210`, 2026-11-20 02:48 (UK time). Tree `c72568ca0b5704e2b967b879ac3462c7034d9725` (the same tree CoS merged against `a98f1b79`; V2, QA2:29). First parent `a98f1b7905236437f76368c1852da65abece94a7` (the step-04b rebuild record and QA reviews, plus the 4c r1 QA review, all docs-only after `a85ae665`), second parent `43e146d9` |
| After the merge | main is `a6538ee18dfdf198a96c79634314d6683c7172b2`, which adds the r2 QA review. Both `docs/qa/step-04c-review.md` and `docs/qa/step-04c-r2-review.md` are on main. Postmerge (`cos-tools/qa-postmerge.sh 9bbd115a 43e146d9`): RESULT PASS, tree `c72568ca`, parent2 = tip, pins 5/5, green 1065/0, smoke 0 failed, 1 warning (main moved 1 docs commit). |
| Tests | 1063 + N=2 (`stages and maps`, `mapEntryDropped: warns, skips in memory, writes nothing back`) = **1065 pass / 0 fail** (HB2:20-27, V2, QA2:21) |
| Size | Accepted measure, `git diff --shortstat a85ae665..faa74a07 -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4c-stages-maps/**' ':!handback/**'`, is 9 files, **382 insertions + 12 deletions = 394** ≤ 400 (G7: `docs/qa/handback-checklist.md` L26 and `BUILD_GUIDE.md` L123, insertions plus deletions; guide L340 “as in 4a” L166, with the s4c smoke dir; `handback/**` is the accepted extra exclude; QA1:17, QA2:22, HB2:29). The same shortstat holds at the r2 tip `43e146d9` and, with `':!docs/**'` also excluded, at the merge. r1 at `73ac4720` was already 382 + 12 = 394; r2 only edited the excluded smoke (69 → 73). On the merge commit, also exclude `':!docs/**'` (or measure at the code head): main added five docs files after the base, 1392 insertions, which are not this step. Without that exclusion the merge shortstat is 14 files, 1774 insertions and 12 deletions. The s4c smoke is 73 lines, under its own cap of 130 (guide L317, L321; it was 69 in r1) |
| Stamp | `node tools/maker/build.ts` writes stamp `1a7f52d22e14` (QA1:23). The stamp is a content hash of the maker sources, so r2 did not change it |
| Smoke | No `tools/play-stage/` change, so S0 is not required (guide L36, L354). S0 sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941` (blob `1f50845a`) is unedited. The s4c smoke prints `SMOKE PASS` once, after checks 1–7 and `8 targets` at 390 and at 360, under google-chrome on port 8801; the s4a smoke does the same on port 8799, and the s4b smoke on port 8800 (guide L321, L354; HB2:35-57; V2; QA2:23-26) |

## (b) Files

From `git diff --name-status a85ae665..43e146d9 -- . ':!handback/**' ':!docs/**'`. Line counts are `git diff --numstat` insertions and deletions against the base (the r2 values, which is what merged). The same 10 product files are on the merge tree `c72568ca`.

| File | Change | Lines | Purpose |
|---|---|---|---|
| `src/editor/stage/rooms.ts` | new | 49 (cap 70) | Pure: add a stage with a new or existing map from the skeletons; rename; `refsTo(id)` refusals; the last-stage rule; delete a stage from `project.stages` (guide L308) |
| `src/editor/stage/resize.ts` | new | 63 (cap 60) | Pure: resize a map (4c Rule 7), list the placements and edges it would drop, crop lanes, apply the drops to every stage that uses the map, with one D17 or D21 row per entry (guide L309). Over the file cap; named in HB2:82 |
| `tools/maker/project.ts` | edited | 6 (3+/3−, cap 50) | Stage rows with a ⋯ menu, and a tail slot for the Maps section (guide L310). Most of the 4c UI moved to `rooms.ts` / `home.ts` (HB2:81) |
| `tools/maker/rooms.ts` | new | 136 (cap 60) | The Add stage question, Rename, Resize with its drop list, refusal rows, the Undo toast, and `roomClick` (guide L311). Over the file cap; named in HB1:62 and HB2:81 |
| `src/project/load/drops.ts` | edited | 14 (14+, cap 20) | D21 reader: `mapEntryDrops(maps, mapAt)` writes one `mapEntryDropped` warning per `logic.edges` entry outside `cols` × `rows` (guide L314) |
| `src/project/load/read-project.ts` | edited | 8 (4+/4−, cap 3) | Builds `mapAt` and calls `mapEntryDrops` next to `placementDrops` (guide L315). Over the file cap; named in HB2:82 |
| `tests/editor/stage-rooms.test.ts` | new | 77 (cap 80) | Named test `stages and maps` (guide L312, L341-349), including the kind / `formatVersion` scan of the 4c stage files |
| `tests/project/load/map-entry-dropped.test.ts` | new | 23 (cap 30) | Named test `mapEntryDropped: warns, skips in memory, writes nothing back` (guide L316, L350-353) |
| `handoff/steps/tests/s4c-stages-maps/smoke.mjs` | new | 73 (cap 130; 69 in r1) | Browser smoke, own cap, outside the 400 (guide L317, L321). r2 measures check 8 while each new sheet is open |
| `tools/maker/home.ts` | edited | 18 (13+/5−) | Extra, not in the guide table: the click router, the 6 s toast, and the open of the new stage (HB1:62, HB2:81) |

No other product file. Nothing under `tools/play-stage/`, `tests/tools/golden/`, `fixtures/`, `src/editor/stage/` outside the two new files, `tools/maker/stage.ts`, `tests/editor/stage-place.test.ts`, `tests/editor/maker-law.test.ts`, `package.json` or `package-lock.json`. Path and Dirt stay hidden; they are out of 4c (guide L372).

One-job rule (`docs/qa/handback-checklist.md` §3 I, L67): no touched code file is over about 500 lines. The largest new or edited files are `tools/maker/rooms.ts` at 136 lines and `src/project/load/read-project.ts` at 112. `tools/maker/stage.ts` is still 255 and was not touched.

## (c) Key code and git commands

`rooms.ts` is the pure rooms helper. `refsTo` (`src/editor/stage/rooms.ts:10-18`) is the 4c Rule 2 check, and the step 7 carry (guide L284, L362):

```ts
/** Live stages (project.stages) whose mapRef is this id. Step 7 adds link targets. */
export function refsTo(files: Record<string, Obj>, id: string): readonly string[] {
  const stages = docsIn(files, "stages");
  return list(inner(rootOf(files))["stages"]).flatMap((sid) => {
    if (typeof sid !== "string") return [];
    const doc = stages.find((item) => item.doc["id"] === sid)?.doc;
    return doc !== undefined && doc["mapRef"] === id ? [typeof doc["name"] === "string" ? doc["name"] : "Stage"] : [];
  });
}
```

It walks only the live `project.stages` list and compares `mapRef`. Orphan stage files are ignored (HB2:76). No link field is written (guide L334). `deleteMap` (`rooms.ts:47-49`) refuses with `usedBy` when `refsTo` is non-empty, and otherwise returns `{ ok: true }` without removing a file (4c Rule 8). `deleteStage` (`rooms.ts:40-46`) refuses the last stage with `"A game needs at least one stage"`, drops the id from `project.stages`, and filters `render.excludedStages` only when that array already exists.

`addStage` (`rooms.ts:28-36`) copies the Empty skeletons, sets a new id, name and `mapRef`, and does not write a `kind` or `formatVersion` literal. If the first listed stage has a numeric `seed`, that value is copied (`takenSeed` at `rooms.ts:19-27`, applied at L30). The demo therefore copies 24301 so Test can start. That deviation is a carried non-blocker (QA1:32). `renameDoc` (`rooms.ts:37-39`) writes only `name`.

`resizeMap` (`src/editor/stage/resize.ts:36-63`) keeps the top-left corner, crops `logic.terrain` and every `layers[].tiles` to `cols*rows` with Floor and `null` in new cells, crops `logic.lanes` with `0` and no row (L59), and writes one D17 `placementDropped` row per dropped placement and one D21 `mapEntryDropped` row per dropped edge (`field: "edges"`). Missing `cols` / `rows` on the existing map fall back to `0` (`resize.ts:37`), a format-invalid case only (QA1:36):

```ts
const oldC = typeof map["cols"] === "number" ? map["cols"] : 0, oldR = typeof map["rows"] === "number" ? map["rows"] : 0, mapId = typeof map["id"] === "string" ? map["id"] : "", drops: Drop[] = [];
```

`floorKey` (`resize.ts:14-19`) uses the smallest palette int whose value is `"floor"`, or the smallest unused non-negative int if floor is missing, and does not overwrite an existing key.

The D21 reader is `mapEntryDrops` at `src/project/load/drops.ts:38-51`. `path` is `<map file>#/logic/edges/<i>`, `detail` is `"outsideMap"`, severity is warning, and it reads only. The file path comes from `mapAt`, with an unreachable fallback:

```ts
const file = mapAt[id] ?? `maps/${id}.json`, cols = typeof map["cols"] === "number" ? map["cols"] : 0, rowsN = typeof map["rows"] === "number" ? map["rows"] : 0;
```

That `??` at `drops.ts:43` is never taken from `read-project.ts`, which always fills `mapAt` when it stores a map (QA1:35). `read-project.ts:2` imports `mapEntryDrops`; L82 declares `mapAt`; L92 sets `mapAt[id] = path`; L108 pushes `...mapEntryDrops(maps, mapAt)` next to `placementDrops`.

The drop-list and post-confirm wording is `say` at `tools/maker/rooms.ts:41-45`:

```ts
function say(row: Drop, ask: boolean): string {
  if (row.code === "mapEntryDropped") return ask ? `Edge ${row.index} will go` : `mapEntryDropped edges ${row.index} outsideMap`;
  const at = row.sq === null ? "" : ` at ${row.sq.c},${row.sq.r}`;
  return ask ? `${row.list} ${row.index}${at} will go` : `placementDropped ${row.list} ${row.index} outsideMap`;
}
```

So the resize sheet can say `playerSpawns 0 at 0,8 will go`, and after confirm the project screen can say `placementDropped playerSpawns 0 outsideMap` (HB2:80; QA1:33).

`tools/maker/home.ts` is the extra counted file. Project-screen `r:*` acts and the toast `undo` go through `roomClick` (`home.ts:77-78`). `tools/maker/project.ts:8` paints each stage row and its ⋯ menu (`r:menu:stage:<id>`). `roomTail` / `roomSheet` in `tools/maker/rooms.ts` hold + Add stage, the Maps rows, and the sheets. Every 4c `data-act` has a branch in `roomClick` (`rooms.ts:92-136`).

`tools/maker/stage.ts` was not edited, so the 4b allow-list pin still matches. `tools/maker/stage.ts:31` is still:

```ts
function docAt(files: ProjectFiles, kind: string, id: string): { readonly path: string; readonly doc: Obj } | null {
```

and `tests/editor/stage-place.test.ts:53` still deepEquals that exact line (HB2:83).

The two named tests are `tests/editor/stage-rooms.test.ts:19` (`stages and maps`) and `tests/project/load/map-entry-dropped.test.ts:11-23`. The latter loads the demo map with an extra `logic.edges` entry at 99,1, asserts one `mapEntryDropped` warning with path `…#/logic/edges/1` and `detail` `outsideMap`, an `edgeOffMap` notice at that cell, the in-map edge still blocking, and `files` deep-equal to a clone (guide L350-353). `stage-rooms.test.ts:20-21` scans `rooms.ts`, `resize.ts` and `tools/maker/rooms.ts` with `/["']?\bkind["']?\s*:/`. There is no `kind` or `formatVersion` literal in the 4c product files. `maker-law.test.ts` was not edited; `src/editor/stage/rooms.ts` and `resize.ts` already sit under the `/stage/` plant (guide L313).

The s4c smoke at the merge is the r2 file (`handoff/steps/tests/s4c-stages-maps/smoke.mjs`, 73 lines). `tap()` and `press()` (L15-16) return after the tap. `waitText` / `gone` (L17-18) are `page.waitForFunction` on body text, 15 s. There is no `waitForTimeout`. `open(act, mark)` (L26) waits until `[data-act=mark]` exists, then runs `big()`. `drop()` (L27) waits for `"will go"`, then `big()`. Check 8 collects those measurements in `sheetTiny` and prints `8 targets @${width}` (L68). The calls cover Add (`open("r:add", "r:new")`, L33), each `r:menu:*` (L39, L44, L47, L51, L59, L64, L66), Rename (`open("r:rename", "r:save-name")`, L39), the resize steppers and Apply (`open("r:resize", "r:apply")`, L44 and L47), and the drop list (`drop()`, L44 and L47).

## (d) What went wrong, in order, and the fix

**r1.** The product shipped and green was 1065/0. The official gate was 382 + 12 = 394. Solo and CPU-burn smokes passed, but check 8 was not a real measure of the new sheets. QA **NOT OK** (QA1:3) with three must-fixes, all in the HANDBACK and the smoke harness; "The product code needs no change" (QA1:3).

1. **§ Smoke did not paste the ok lines (QA1:8).** Guide L35: paste the ok lines in § Smoke. HB1:34 said "Checks 1–7 were ok at 390 and at 360 each time" instead. Fix: paste the s4c `ok` lines and `SMOKE PASS` from one solo run, then keep the 3-run and CPU-burn note. (The r1 wording asked for the 14 check 1–7 lines; r2 also prints `8 targets`, so the paste is 16 ok lines plus `SMOKE PASS`.)

2. **Not every over-cap file was named (QA1:9).** Guide L319 / L141: a file may go over its cap if the total stays within 400, and the hand-back says which file and why. HB1:53 and HB1:62 named only `tools/maker/rooms.ts` (136 vs 60). Also over: `src/editor/stage/resize.ts` 63 vs 60, and `src/project/load/read-project.ts` 8 vs 3 (4+/4−). Fix: add this line to § Decisions: "`src/editor/stage/resize.ts` is 63 lines against a 60 cap (crop, floor key and three placement lists in one pure pass). `src/project/load/read-project.ts` is 4+/4- against a 3 cap (the `mapAt` path map the D21 row needs). Total 394 ≤ 400."

3. **Smoke check 8 did not measure the new sheets (QA1:10).** Guide L329 is "Every target is at least 48 × 48 CSS px." The r1 smoke (at the r1 tip, L24-25) ran `big()` only at the end of each `step()`. By then the Add stage question, the ⋯ menus, Rename, the Resize steppers and Apply, and the drop list had all closed, and no `8 targets` line was printed. QA probed the product and found every visible button and input was 48 px or more, so this was a harness gap, not a product fail. Fix: call `big()` after each of those sheets opens, collect the result, and print `8 targets @<width>`. Stay within 130 lines.

**r2.** Built on the r1 tip. The only code change is `handoff/steps/tests/s4c-stages-maps/smoke.mjs` (+16/−12, 69 → 73). The r2 HANDBACK and six shots are the tip-vs-code delta. All nine product blobs and both test blobs are identical to r1 code head `73ac4720` (QA2:8, V2, HB2:5).

- `open()` and `drop()` measure the listed sheets while they are open (`smoke.mjs:26-27`, L33-66). Check 8 prints at L68. QA's bite test, shrinking `r:new` or `r:apply` to 30 px, failed at `8 targets` only; r1's end-of-step `big()` would have missed both (QA2:17). No `waitForTimeout`. The smoke is 73 lines.
- HB2:37-53 pastes the 16 ok lines plus `SMOKE PASS`, byte-identical to a solo run (QA2:11, V2). HB2:55 keeps the 3-run / 8 CPU-burn note. HB2:82 is the requested cap line, word for word (QA2:12). The r1 “PR: opened by Chief Of Staff” boilerplate is gone from HB2:3 (QA1:40).

QA **OK TO OPEN PR** (QA2:3). The merge tree is `c72568ca`, as predicted (QA2:29, V2).

## (e) Do it right first time

- Start from the 4b merge `a85ae665`. The floor is 1063 + 2 = 1065.
- Put add / rename / delete / `refsTo` in `rooms.ts` and resize / drop rows in `resize.ts`. Do not write a `kind` or `formatVersion` literal. Rename changes `name` only. Delete is not a hard delete. No link fields (step 7).
- `refsTo` covers `mapRef` of stages in `project.stages` only. Name the step 7 carry in the hand-back: step 7 extends `refsTo` with link targets (C3a/C3b).
- The Talk field and Path / Dirt are not this step. Path and Dirt stay hidden (guide L372).
- A file may go over its cap if the total stays within 400, but the hand-back must name **every** over-cap file and why (guide L319, L141). Here that is `tools/maker/rooms.ts` (136 vs 60), `resize.ts` (63 vs 60) and `read-project.ts` (4+/4− vs 3).
- A smoke that claims “every target is 48 px” must measure each new sheet **while it is open**, and must print a `8 targets @<width>` line at 390 and at 360. After a save, wait for the expected state with `waitForFunction`, not `waitForTimeout`.
- Paste the ok lines and `SMOKE PASS` from one solo run in § Smoke (guide L35). A 3-run or CPU-burn note can follow the paste.
- Measure with the 4a excludes, swapping in `':!handoff/steps/tests/s4c-stages-maps/**'`, and `':!handback/**'`. Count insertions plus deletions (checklist L26, `BUILD_GUIDE.md` L123). 394 is the accepted number. The smoke's own cap is 130. On a merge, also exclude `':!docs/**'`.

## (f) Rebuild check

From a clean tree at `a85ae665`, write the 10 product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit:

```bash
# Product gate. On the merge also exclude docs/**, because main added the
# step-04b record, the 4b QA reviews, and the 4c r1 QA review after
# a85ae665; those are not this step. The branch itself did not touch docs,
# so the same command without ':!docs/**' at the code head is the QA
# measure and is also 382 + 12 = 394.
git diff --shortstat a85ae665..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4c-stages-maps/**' ':!handback/**' ':!docs/**'
#   9 files changed, 382 insertions(+), 12 deletions(-)

git diff --shortstat a85ae665..HEAD -- . ':!data/templates/**' ':!fixtures/**' ':!tools/maker/tokens.css' ':!handoff/steps/tests/s4c-stages-maps/**' ':!handback/**'   # at the code head or r2 tip
#   9 files changed, 382 insertions(+), 12 deletions(-)

sha256sum tests/tools/golden/demo-parity.json
#   90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839
git diff --stat a85ae665..HEAD -- tests/tools/golden/   # empty

sha256sum handoff/steps/tests/s0-play-input/touch-smoke.mjs
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941

npm ci && npm run green   # 1065 pass, 0 fail. Includes:
#   ✔ (a) parity: seed 24301 bot versus bot equals the 1a golden
#   ✔ stages and maps
#   ✔ mapEntryDropped: warns, skips in memory, writes nothing back

# Smokes under google-chrome, at 390 and 360 CSS px:
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s4c-stages-maps/smoke.mjs . 8801
#   ok 1-7 and 8 targets @390, ok 1-7 and 8 targets @360, then SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799
#   ok 1-8 @390, ok 1-8 @360, then SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s4b-stage-place/smoke.mjs . 8800
#   ok 1-8 @390, ok 1-8 @360, then SMOKE PASS

# The s4c smoke should also pass while 8 CPU-burn loops are running.
# `wc -l handoff/steps/tests/s4c-stages-maps/smoke.mjs` is 73.
```

Against the merge tree: on your rebuild branch, `git diff 9bbd115a HEAD -- src/editor/stage/rooms.ts src/editor/stage/resize.ts src/project/load/drops.ts src/project/load/read-project.ts tools/maker/rooms.ts tools/maker/project.ts tools/maker/home.ts tests/editor/stage-rooms.test.ts tests/project/load/map-entry-dropped.test.ts handoff/steps/tests/s4c-stages-maps` must be empty. The blob table below lists the exact git blob id each file must have at `9bbd115a`; `git ls-tree -r HEAD -- <path>` on the rebuild must show the same id. The product and test blobs (everything except the smoke) must also match r1 code head `73ac4720`.

## QA non-blockers carried forward

From QA1:32-41. QA2:32 says they still stand. None of these blocked the PR.

1. A new stage copies the first listed stage's numeric `seed` when one exists (`takenSeed` / `addStage`, `src/editor/stage/rooms.ts:19-30`). The demo copies 24301 so Test can start (Done-when L355). Guide Rule 6 (L290) lists only the ids, `mapRef` and names; the Empty template has no seed. The deviation is documented (HB2:75). Needs a CoS/UX confirm, or Empty should ship a seed (QA1:32).
2. Raw format names in the UI at `tools/maker/rooms.ts:42-44`: the drop list says `playerSpawns 0 at 0,8 will go`, and after confirm the rows say `placementDropped playerSpawns 0 outsideMap`. These are format names, not words a user knows. A UX wording carry; the guide does not word it (QA1:33).
3. The `mapAt[id] ??` fallback to `maps/<id>.json` in `src/project/load/drops.ts:43` is unreachable from `read-project.ts`, which always sets `mapAt[id] = path` when it stores a map (QA1:35).
4. `resizeMap` (`src/editor/stage/resize.ts:37`) falls back to `cols` / `rows` 0 when they are missing. Format-invalid maps only (QA1:36).
5. (Was QA1 must-fix 2, fixed in r2.) File caps, guidance only (guide L319): `src/editor/stage/resize.ts` is 63 vs 60; `src/project/load/read-project.ts` is 4+/4− vs 3; `tools/maker/rooms.ts` is 136 vs 60. The total is 394 ≤ 400. r2 names all three (HB2:81-82).
6. Map delete is session-only: a deleted unused map is hidden for this session and comes back after a reload, because files stay (Rule 8) and the Maps list is one row per file (HB2:77; QA1:39).
7. The 4a/4b carries are still open: `chosen()` at `tools/maker/stage.ts:35-41`, uncapped stage undo (`src/editor/stage/undo.ts`), the maker-law plant dir with no `try/finally`, the talk skeleton `createdAt`, and the `stage.ts:31` allow-list pin (QA1:41, QA2:32). `stage.ts` was not edited in 4c, so the pin at `stage-place.test.ts:53` still matches. Path and Dirt stay hidden and are out of 4c (guide L372).

## Blob check

Each file must have exactly this git blob id at `9bbd115a`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `src/editor/stage/rooms.ts` | `7b178913bd5f0739d2e20c064d0caf8772bc9386` | 49 |
| `src/editor/stage/resize.ts` | `1a644daed67831b9bcb030e4831ad49e9bdc3cab` | 63 |
| `src/project/load/drops.ts` | `0289a99643bb61856121bb91d760d05211c029a3` | 51 |
| `src/project/load/read-project.ts` | `ff897fb1daf0c7daa8f32d7cf22285fd40475e40` | 112 |
| `tools/maker/rooms.ts` | `297675166a49ff0f216560d737ef602ac0847f1d` | 136 |
| `tools/maker/project.ts` | `0761158f3a83ee26013cc402d73b19caa00072fd` | 10 |
| `tools/maker/home.ts` | `0ad7ee846a2d30c7469f10d0d906c1c4350aea0f` | 106 |
| `tests/editor/stage-rooms.test.ts` | `d2236257f85503316b3a59582acc5e349befed84` | 77 |
| `tests/project/load/map-entry-dropped.test.ts` | `b92fbb9b6dd94286f2482984d8476a7c65802dbb` | 23 |
| `handoff/steps/tests/s4c-stages-maps/smoke.mjs` | `0eaf619117225fd99e6813df8aa98bb1ae51c74d` | 73 |

## Appendix: full code as merged (step 4c, PR #86)

New files are given in full. Edited files are given as the exact diff from `a85ae665` to `9bbd115a`, then in full as merged. Copy them byte for byte; the blob table checks you did. The smoke is the r2 version.

### `src/editor/stage/rooms.ts` (new)

```ts
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const clone = <T>(v: T): T => structuredClone(v);
const rootOf = (files: Record<string, Obj>): Obj => (isObj(files["project.json"]) ? files["project.json"] : {});
const inner = (doc: Obj): Obj => (isObj(doc["project"]) ? doc["project"] : {});
export function docsIn(files: Record<string, Obj>, folder: "stages" | "maps"): { readonly path: string; readonly doc: Obj }[] {
  return Object.entries(files).flatMap(([path, doc]) => (path.startsWith(`${folder}/`) && isObj(doc) && typeof doc["id"] === "string" ? [{ path, doc }] : []));
}
/** Live stages (project.stages) whose mapRef is this id. Step 7 adds link targets. */
export function refsTo(files: Record<string, Obj>, id: string): readonly string[] {
  const stages = docsIn(files, "stages");
  return list(inner(rootOf(files))["stages"]).flatMap((sid) => {
    if (typeof sid !== "string") return [];
    const doc = stages.find((item) => item.doc["id"] === sid)?.doc;
    return doc !== undefined && doc["mapRef"] === id ? [typeof doc["name"] === "string" ? doc["name"] : "Stage"] : [];
  });
}
function takenSeed(files: Record<string, Obj>): number | null {
  const stages = docsIn(files, "stages");
  for (const sid of list(inner(rootOf(files))["stages"])) {
    if (typeof sid !== "string") continue;
    const doc = stages.find((item) => item.doc["id"] === sid)?.doc;
    if (doc !== undefined && typeof doc["seed"] === "number") return doc["seed"];
  }
  return null;
}
export function addStage(files: Record<string, Obj>, stageSkel: Obj, mapSkel: Obj | null, stageId: string, mapId: string, stageName: string, mapName: string): Record<string, Obj> {
  const stage = clone(stageSkel); stage["id"] = stageId; stage["name"] = stageName; stage["mapRef"] = mapId;
  const seed = takenSeed(files); if (seed !== null) stage["seed"] = seed;
  const next: Record<string, Obj> = { ...files, [`stages/${stageId}.json`]: stage };
  if (mapSkel !== null) { const map = clone(mapSkel); map["id"] = mapId; map["name"] = mapName; next[`maps/${mapId}.json`] = map; }
  const root = clone(rootOf(files)), proj = { ...inner(root) };
  proj["stages"] = [...list(proj["stages"]).filter((id): id is string => typeof id === "string"), stageId];
  root["project"] = proj; next["project.json"] = root; return next;
}
export function renameDoc(files: Record<string, Obj>, path: string, name: string): Record<string, Obj> {
  const doc = files[path]; if (!isObj(doc)) return files; const next = clone(doc); next["name"] = name; return { ...files, [path]: next };
}
export function deleteStage(files: Record<string, Obj>, stageId: string): { readonly ok: true; readonly files: Record<string, Obj> } | { readonly ok: false; readonly reason: string } {
  const stages = list(inner(rootOf(files))["stages"]).filter((id): id is string => typeof id === "string");
  if (!stages.includes(stageId) || stages.length <= 1) return { ok: false, reason: "A game needs at least one stage" };
  const root = clone(rootOf(files)), proj = { ...inner(root) }; proj["stages"] = stages.filter((id) => id !== stageId);
  if (isObj(proj["render"]) && Array.isArray(proj["render"]["excludedStages"])) { const render = { ...proj["render"] }; render["excludedStages"] = list(render["excludedStages"]).filter((id) => id !== stageId); proj["render"] = render; }
  root["project"] = proj; return { ok: true, files: { ...files, "project.json": root } };
}
export function deleteMap(files: Record<string, Obj>, mapId: string): { readonly ok: true } | { readonly ok: false; readonly usedBy: readonly string[] } {
  const usedBy = refsTo(files, mapId); return usedBy.length > 0 ? { ok: false, usedBy } : { ok: true };
}
```

### `src/editor/stage/resize.ts` (new)

```ts
type Obj = Record<string, unknown>;
type Sq = { readonly c: number; readonly r: number };
export type PlaceDrop = { readonly code: "placementDropped"; readonly stageId: string; readonly list: "playerSpawns" | "neutrals" | "enemyPool"; readonly index: number; readonly reason: "outsideMap"; readonly path: string; readonly sq: Sq | null; readonly unitId?: string };
export type EdgeDrop = { readonly code: "mapEntryDropped"; readonly mapId: string; readonly field: "edges"; readonly index: number; readonly reason: "outsideMap"; readonly path: string };
export type Drop = PlaceDrop | EdgeDrop;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const clone = <T>(v: T): T => structuredClone(v);
const inside = (c: number, r: number, cols: number, rows: number): boolean => Number.isInteger(c) && Number.isInteger(r) && c >= 0 && r >= 0 && c < cols && r < rows;
function atOf(entry: Obj, direct: boolean): Sq | null {
  const box = direct ? entry : entry["at"];
  return isObj(box) && typeof box["c"] === "number" && typeof box["r"] === "number" ? { c: box["c"], r: box["r"] } : null;
}
function floorKey(palette: Obj): number {
  let best: number | null = null; const used = new Set<number>();
  for (const [k, v] of Object.entries(palette)) { const n = Number(k); if (!Number.isInteger(n) || n < 0 || String(n) !== k) continue; used.add(n); if (v === "floor" && (best === null || n < best)) best = n; }
  if (best !== null) return best;
  let n = 0; while (used.has(n)) n += 1; palette[String(n)] = "floor"; return n;
}
function crop<T>(src: readonly T[], oldC: number, oldR: number, nextC: number, nextR: number, fill: T): T[] {
  const out: T[] = [];
  for (let r = 0; r < nextR; r += 1) for (let c = 0; c < nextC; c += 1) { const value = c < oldC && r < oldR ? src[r * oldC + c] : undefined; out.push(value === undefined ? fill : value); }
  return out;
}
function trim(entries: readonly unknown[], direct: boolean, cols: number, rows: number, path: string, listName: PlaceDrop["list"], stageId: string): { readonly kept: unknown[]; readonly drops: PlaceDrop[]; readonly changed: boolean } {
  const kept: unknown[] = [], drops: PlaceDrop[] = []; let changed = false;
  entries.forEach((entry, i) => {
    if (!isObj(entry)) { kept.push(entry); return; }
    const at = atOf(entry, direct);
    if (at !== null && inside(at.c, at.r, cols, rows)) { kept.push(entry); return; }
    changed = true; const unitId = typeof entry["unitId"] === "string" ? entry["unitId"] : undefined;
    drops.push({ code: "placementDropped", stageId, list: listName, index: i, reason: "outsideMap", path: `${path}#/${listName === "enemyPool" ? "enemyPool/entries" : listName}/${i}`, sq: at, ...(unitId === undefined ? {} : { unitId }) });
  });
  return { kept, drops, changed };
}
export function resizeMap(mapPath: string, map: Obj, stages: readonly { readonly path: string; readonly doc: Obj }[], cols: number, rows: number): { readonly map: Obj; readonly stages: readonly { readonly path: string; readonly doc: Obj }[]; readonly rows: readonly Drop[] } {
  const oldC = typeof map["cols"] === "number" ? map["cols"] : 0, oldR = typeof map["rows"] === "number" ? map["rows"] : 0, mapId = typeof map["id"] === "string" ? map["id"] : "", drops: Drop[] = [];
  const nextStages = stages.map(({ path, doc }) => {
    if (doc["mapRef"] !== mapId) return { path, doc };
    const stageId = typeof doc["id"] === "string" ? doc["id"] : ""; let next: Obj | null = null;
    const put = (key: string, value: unknown): void => { next ??= clone(doc); next[key] = value; };
    const cut = (key: string, direct: boolean, pool: boolean): void => {
      const bag = pool && isObj(doc["enemyPool"]) ? doc["enemyPool"] : null;
      const entries = pool ? (bag !== null && bag["mode"] === "fixed" ? list(bag["entries"]) : []) : list(doc[key]);
      if (pool && (bag === null || bag["mode"] !== "fixed")) return;
      const got = trim(entries, direct, cols, rows, path, pool ? "enemyPool" : key === "neutrals" ? "neutrals" : "playerSpawns", stageId);
      drops.push(...got.drops); if (!got.changed) return;
      if (pool && bag !== null) put("enemyPool", { ...bag, entries: got.kept }); else put(key, got.kept);
    };
    cut("playerSpawns", true, false); cut("neutrals", false, false); cut("enemyPool", false, true); return { path, doc: next ?? doc };
  });
  const logic = isObj(map["logic"]) ? map["logic"] : {}, palette = isObj(logic["palette"]) ? { ...logic["palette"] } : {}, edges = list(logic["edges"]), keptEdges: unknown[] = [];
  edges.forEach((edge, i) => {
    if (isObj(edge) && typeof edge["c"] === "number" && typeof edge["r"] === "number" && inside(edge["c"], edge["r"], cols, rows)) keptEdges.push(edge);
    else drops.push({ code: "mapEntryDropped", mapId, field: "edges", index: i, reason: "outsideMap", path: `${mapPath}#/logic/edges/${i}` });
  });
  const floor = floorKey(palette);
  const nextLogic: Obj = { ...logic, terrain: crop(list(logic["terrain"]), oldC, oldR, cols, rows, floor), palette, edges: keptEdges };
  if (Array.isArray(logic["lanes"])) nextLogic["lanes"] = crop(logic["lanes"], oldC, oldR, cols, rows, 0);
  const next = clone(map); next["cols"] = cols; next["rows"] = rows; next["logic"] = nextLogic;
  if (Array.isArray(map["layers"])) next["layers"] = list(map["layers"]).map((layer) => (isObj(layer) && Array.isArray(layer["tiles"]) ? { ...layer, tiles: crop(layer["tiles"], oldC, oldR, cols, rows, null) } : layer));
  return { map: next, stages: nextStages, rows: drops };
}
```

### `tools/maker/rooms.ts` (new)

```ts
import { checkName, prefix, ulid, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { addStage, deleteMap, deleteStage, docsIn, refsTo, renameDoc } from "../../src/editor/stage/rooms.ts";
import { resizeMap, type Drop } from "../../src/editor/stage/resize.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, readTree, type MakerStore } from "./store.ts";
type Obj = Record<string, unknown>;
type Snap = { readonly files: DocText; readonly hidden: readonly string[] };
type Sess = { project: string; mode: "add" | "menu" | "rename" | "resize" | "ask" | "note" | null; which: "stage" | "map"; target: string; cols: number; rows: number; name: string; lines: string[]; hidden: string[]; stack: Snap[] };
export type RoomHit = { readonly files: DocText; readonly rev: number; readonly banner: string | null; readonly dirty: boolean; readonly stageId: string | null; readonly toast?: string | null };
export type RoomIo = { readonly store: MakerStore; readonly id: string; readonly now: string; readonly bytes: () => Uint8Array; readonly empty: DocText };
type Host = { readonly files: DocText; readonly rev: number; readonly readOnly: boolean; readonly dirty: boolean };
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const blank = (project: string): Sess => ({ project, mode: null, which: "stage", target: "", cols: 1, rows: 1, name: "", lines: [], hidden: [], stack: [] });
let sess: Sess = blank("");
export function bindRooms(id: string): void { if (sess.project !== id) sess = blank(id); }
export function roomLine(value: string): void { sess.name = value; }
function bagOf(files: DocText): Record<string, Obj> | null {
  const got = parseProject(files); if (!got.ok) return null; const bag: Record<string, Obj> = {};
  for (const [path, doc] of Object.entries(got.files)) if (isObj(doc)) bag[path] = doc; return bag;
}
function skels(empty: DocText): { readonly stage: Obj; readonly map: Obj } | null {
  const bag = bagOf(empty); if (bag === null) return null; const stage = docsIn(bag, "stages")[0]?.doc, map = docsIn(bag, "maps")[0]?.doc;
  return stage !== undefined && map !== undefined ? { stage, map } : null;
}
function pathOf(files: Record<string, Obj>, folder: "stages" | "maps", id: string): string | null {
  return docsIn(files, folder).find(({ doc }) => doc["id"] === id)?.path ?? null;
}
function texts(stored: DocText, before: Record<string, Obj>, after: Record<string, Obj>): DocText {
  const next: Record<string, string> = { ...stored }; for (const [path, doc] of Object.entries(after)) if (before[path] !== doc) next[path] = JSON.stringify(doc); return next;
}
async function commit(io: RoomIo, stored: DocText, rev: number, next: DocText): Promise<{ readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly message: string }> {
  const plan = planSave(stored, next, rev, io.now); if (!plan.ok) return { ok: false, message: plan.message };
  const wrote = await commitWrites(io.store, prefix(io.id), plan.writes); if (!wrote.ok) return { ok: false, message: wrote.message };
  return { ok: true, files: await readTree(io.store, prefix(io.id)), rev: plan.writes.length > 0 ? rev + 1 : rev };
}
const kept = (host: Host, banner: string | null): RoomHit => ({ files: host.files, rev: host.rev, banner, dirty: host.dirty, stageId: null });
function say(row: Drop, ask: boolean): string {
  if (row.code === "mapEntryDropped") return ask ? `Edge ${row.index} will go` : `mapEntryDropped edges ${row.index} outsideMap`;
  const at = row.sq === null ? "" : ` at ${row.sq.c},${row.sq.r}`;
  return ask ? `${row.list} ${row.index}${at} will go` : `placementDropped ${row.list} ${row.index} outsideMap`;
}
async function save(io: RoomIo, host: Host, before: Record<string, Obj>, after: Record<string, Obj>, toast: string): Promise<RoomHit> {
  const prev = sess.stack; sess.stack = [{ files: host.files, hidden: [...sess.hidden] }];
  const wrote = await commit(io, host.files, host.rev, texts(host.files, before, after));
  if (!wrote.ok) { sess.stack = prev; return { files: host.files, rev: host.rev, banner: wrote.message, dirty: true, stageId: null }; }
  sess.mode = null; return { files: wrote.files, rev: wrote.rev, banner: null, dirty: false, stageId: null, toast };
}
export function roomTail(files: DocText, readOnly: boolean): string {
  const bag = bagOf(files); if (bag === null) return "";
  const maps = docsIn(bag, "maps").filter(({ doc }) => !sess.hidden.includes(String(doc["id"]))).map(({ doc }) => {
    const id = String(doc["id"]), name = typeof doc["name"] === "string" ? doc["name"] : "Map", used = refsTo(bag, id).length;
    const menu = readOnly ? "" : `<button type="button" class="btn icon" data-act="r:menu:map:${esc(id)}" aria-label="Menu ${esc(name)}">⋯</button>`;
    return `<div class="card"><div class="grow"><span class="name">${esc(name)}</span><span class="sub">${esc(String(doc["cols"]))} × ${esc(String(doc["rows"]))} · Used by ${used} ${used === 1 ? "stage" : "stages"}</span></div>${menu}</div>`;
  }).join("");
  const add = readOnly ? "" : `<button type="button" class="card new" data-act="r:add"><span class="grow"><span class="name">+ Add stage</span></span></button>`;
  const lines = sess.mode === null ? sess.lines.map((line) => `<p class="sub">${esc(line)}</p>`).join("") : "";
  return `${add}<h2>Maps</h2>${maps}${lines}`;
}
export function roomSheet(files: DocText): string {
  if (sess.mode === null) return "";
  const close = `<button type="button" class="btn ghost" data-act="r:close">Close</button>`;
  const bag = bagOf(files);
  if (sess.mode === "note") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Can't delete</h2><p>${esc(sess.lines[0] ?? "")}</p>${close}</div></div>`;
  if (sess.mode === "add") {
    const maps = bag === null ? [] : docsIn(bag, "maps").filter(({ doc }) => !sess.hidden.includes(String(doc["id"])));
    const uses = maps.map(({ doc }) => `<button type="button" class="btn" data-act="r:use:${esc(String(doc["id"]))}">Use map: ${esc(typeof doc["name"] === "string" ? doc["name"] : "Map")}</button>`).join("");
    return `<div class="scrim"><div class="sheet" role="dialog"><h2>Add stage</h2><button type="button" class="btn" data-act="r:new">New map</button>${uses}${close}</div></div>`;
  }
  if (sess.mode === "menu") return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(sess.name || "Edit")}</h2><button type="button" class="btn" data-act="r:rename">Rename</button>${sess.which === "map" ? `<button type="button" class="btn" data-act="r:resize">Resize</button>` : ""}<button type="button" class="btn danger" data-act="r:delete">Delete</button>${close}</div></div>`;
  if (sess.mode === "rename") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Rename</h2><input class="name-field" data-room value="${esc(sess.name)}" aria-label="Name"><button type="button" class="btn" data-act="r:save-name">Save</button>${close}</div></div>`;
  if (sess.mode === "ask") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Resize</h2>${sess.lines.map((line) => `<p>${esc(line)}</p>`).join("")}<button type="button" class="btn danger" data-act="r:anyway">Resize anyway</button><button type="button" class="btn ghost" data-act="r:close">Cancel</button></div></div>`;
  const big = sess.cols > 256 || sess.rows > 256 ? `<p>Big maps may stutter on phones</p>` : "";
  return `<div class="scrim"><div class="sheet" role="dialog"><h2>Resize</h2><p>Columns ${sess.cols}</p><button type="button" class="btn" data-act="r:step:c:-1" aria-label="Fewer columns">−</button><button type="button" class="btn" data-act="r:step:c:1" aria-label="More columns">+</button><p>Rows ${sess.rows}</p><button type="button" class="btn" data-act="r:step:r:-1" aria-label="Fewer rows">−</button><button type="button" class="btn" data-act="r:step:r:1" aria-label="More rows">+</button>${big}<button type="button" class="btn" data-act="r:apply">Apply</button>${close}</div></div>`;
}
function titleOf(files: DocText): string {
  const bag = bagOf(files), path = bag === null ? null : pathOf(bag, sess.which === "map" ? "maps" : "stages", sess.target), doc = path === null || bag === null ? null : bag[path];
  return isObj(doc) && typeof doc["name"] === "string" ? doc["name"] : "Edit";
}
async function undo(io: RoomIo, host: Host): Promise<RoomHit> {
  const snap = sess.stack.pop(); if (snap === undefined) return { ...kept(host, null), toast: null };
  const next: DocText = { ...host.files }; for (const [path, text] of Object.entries(snap.files)) next[path] = text;
  const wrote = await commit(io, host.files, host.rev, next);
  if (!wrote.ok) { sess.stack = [snap]; return { files: host.files, rev: host.rev, banner: wrote.message, dirty: true, stageId: null }; }
  sess.hidden = [...snap.hidden]; for (const path of Object.keys(host.files)) if (snap.files[path] === undefined && path.startsWith("maps/") && path.endsWith(".json")) sess.hidden.push(path.slice("maps/".length, -".json".length));
  sess.lines = []; sess.mode = null;
  return { files: await readTree(io.store, prefix(io.id)), rev: wrote.rev, banner: null, dirty: false, stageId: null, toast: null };
}
export async function roomClick(act: string, host: Host, io: RoomIo): Promise<RoomHit> {
  if (act === "r:close") { sess.mode = null; sess.lines = []; return kept(host, null); }
  if (act === "r:undo") return undo(io, host);
  if (host.readOnly) return kept(host, "Made with a newer TileEngine. Open only.");
  if (act === "r:add") { sess.mode = "add"; sess.lines = []; return kept(host, null); }
  if (act.startsWith("r:menu:")) {
    const body = act.slice(7), which = body.startsWith("map:") ? "map" : "stage";
    sess.which = which; sess.target = body.slice(which.length + 1); sess.name = titleOf(host.files); sess.mode = "menu"; sess.lines = []; return kept(host, null);
  }
  if (act === "r:rename") { sess.name = titleOf(host.files); sess.mode = "rename"; return kept(host, null); }
  if (act === "r:resize") {
    const bag = bagOf(host.files), path = bag === null ? null : pathOf(bag, "maps", sess.target), doc = path === null || bag === null ? null : bag[path];
    sess.cols = isObj(doc) && typeof doc["cols"] === "number" ? doc["cols"] : 1; sess.rows = isObj(doc) && typeof doc["rows"] === "number" ? doc["rows"] : 1; sess.mode = "resize"; return kept(host, null);
  }
  if (act.startsWith("r:step:")) { const parts = act.split(":"), delta = Number(parts[3]); if (parts[2] === "c") sess.cols = Math.max(1, sess.cols + delta); else sess.rows = Math.max(1, sess.rows + delta); return kept(host, null); }
  const bag = bagOf(host.files); if (bag === null) return kept(host, "Can't open this project");
  if (act === "r:new" || act.startsWith("r:use:")) {
    const sk = skels(io.empty); if (sk === null) return kept(host, "Can't open: templates");
    const stageId = `stage_${ulid(Date.parse(io.now), io.bytes())}`, existing = act.startsWith("r:use:") ? act.slice(6) : null, mapId = existing ?? `map_${ulid(Date.parse(io.now), io.bytes())}`;
    const n = list(isObj(bag["project.json"]) && isObj(bag["project.json"]["project"]) ? bag["project.json"]["project"]["stages"] : []).length + 1;
    const after = addStage(bag, sk.stage, existing === null ? sk.map : null, stageId, mapId, `Stage ${n}`, `Stage ${n} map`);
    const hit = await save(io, host, bag, after, "Changed · Undo"); return hit.banner === null ? { ...hit, stageId } : hit;
  }
  if (act === "r:save-name") {
    const name = sess.name.trim(), err = checkName(name); if (err !== null) return kept(host, err);
    const path = pathOf(bag, sess.which === "map" ? "maps" : "stages", sess.target); if (path === null) return kept(host, "Can't open this");
    return save(io, host, bag, renameDoc(bag, path, name), "Changed · Undo");
  }
  if (act === "r:delete" && sess.which === "map") {
    const got = deleteMap(bag, sess.target); if (!got.ok) { sess.mode = "note"; sess.lines = [`Used by: ${got.usedBy.join(", ")}`]; return kept(host, null); }
    sess.stack = [{ files: host.files, hidden: [...sess.hidden] }]; sess.hidden = [...sess.hidden, sess.target]; sess.mode = null; sess.lines = []; return { ...kept(host, null), toast: "Deleted · Undo" };
  }
  if (act === "r:delete") {
    const got = deleteStage(bag, sess.target); if (!got.ok) { sess.mode = "note"; sess.lines = [got.reason]; return kept(host, null); }
    return save(io, host, bag, got.files, "Deleted · Undo");
  }
  if (act === "r:apply" || act === "r:anyway") {
    const mapPath = pathOf(bag, "maps", sess.target), map = mapPath === null ? null : bag[mapPath]; if (mapPath === null || !isObj(map)) return kept(host, "Can't open this map");
    const sized = resizeMap(mapPath, map, docsIn(bag, "stages"), sess.cols, sess.rows);
    if (act === "r:apply" && sized.rows.length > 0) { sess.mode = "ask"; sess.lines = sized.rows.map((row) => say(row, true)); return kept(host, null); }
    const after: Record<string, Obj> = { ...bag, [mapPath]: sized.map }; for (const stage of sized.stages) if (bag[stage.path] !== stage.doc) after[stage.path] = stage.doc;
    const hit = await save(io, host, bag, after, "Changed · Undo"); if (hit.banner === null) sess.lines = sized.rows.map((row) => say(row, false)); return hit;
  }
  return kept(host, null);
}
```

### `tests/editor/stage-rooms.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { addStage, deleteMap, deleteStage, docsIn, refsTo, renameDoc } from "../../src/editor/stage/rooms.ts";
import { resizeMap, type Drop } from "../../src/editor/stage/resize.ts";
import { readProject } from "../../src/project/load/index.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
const root = fileURLToPath(new URL("../..", import.meta.url));
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): Obj[] => (Array.isArray(v) ? v.filter(isObj) : []);
const readDir = (rel: string): Record<string, string> => { const out: Record<string, string> = {}, walk = (at: string, base: string): void => { for (const name of readdirSync(at)) { const path = join(at, name), next = base === "" ? name : `${base}/${name}`; if (statSync(path).isDirectory()) walk(path, next); else out[next] = readFileSync(path, "utf8"); } }; walk(join(root, rel), ""); return out; };
const bagOf = (rel: string): Record<string, Obj> => { const parsed = parseProject(readDir(rel)); if (!parsed.ok) throw new Error(parsed.message); const bag: Record<string, Obj> = {}; for (const [path, doc] of Object.entries(parsed.files)) if (isObj(doc)) bag[path] = doc; return bag; };
const rest = (doc: Obj, key: string): Obj => Object.fromEntries(Object.entries(doc).filter(([k]) => k !== key));
const proj = (files: Record<string, Obj>): Obj => { const rootDoc = files["project.json"]; if (!isObj(rootDoc) || !isObj(rootDoc["project"])) throw new Error("project"); return rootDoc["project"]; };
test("stages and maps", () => {
  const docRe = /\bformatVersion\b|["']?\bkind["']?\s*:/;
  const hits = ["src/editor/stage/rooms.ts", "src/editor/stage/resize.ts", "tools/maker/rooms.ts"].flatMap((rel) => readFileSync(join(root, rel), "utf8").split("\n").flatMap((line, i) => (docRe.test(line) ? [`${rel}:${i + 1}`] : [])));
  assert.deepEqual(hits, []);
  const empty = bagOf("data/templates/empty.tileproj"), skelS = docsIn(empty, "stages")[0], skelM = docsIn(empty, "maps")[0];
  if (skelS === undefined || skelM === undefined) throw new Error("skeleton");
  const added = addStage(empty, skelS.doc, skelM.doc, "stage_NEW", "map_NEW", "Stage 2", "Stage 2 map"), made = readProject(added);
  assert.equal(made.ok && made.report.length === 0, true);
  assert.deepEqual(proj(added)["stages"], ["stage_01JDEM00000000000000000003", "stage_NEW"]);
  const born = added["stages/stage_NEW.json"], bornMap = added["maps/map_NEW.json"];
  assert.ok(isObj(born) && isObj(bornMap)); if (!isObj(born) || !isObj(bornMap)) return;
  assert.equal(born["id"] === "stage_NEW" && born["name"] === "Stage 2" && born["mapRef"] === "map_NEW" && bornMap["id"] === "map_NEW" && bornMap["name"] === "Stage 2 map", true);
  const shared = addStage(empty, skelS.doc, null, "stage_OLD", String(skelM.doc["id"]), "Stage 2", "Stage 2 map"), sharedStage = shared["stages/stage_OLD.json"];
  assert.equal(shared["maps/map_NEW.json"], undefined); assert.ok(isObj(sharedStage) && sharedStage["mapRef"] === skelM.doc["id"]);
  const before = structuredClone(empty[skelS.path]); assert.ok(isObj(before)); if (!isObj(before)) return;
  const renamed = renameDoc(empty, skelS.path, "Upstairs")[skelS.path]; assert.ok(isObj(renamed)); if (!isObj(renamed)) return;
  assert.equal(renamed["name"], "Upstairs"); assert.deepEqual(rest(renamed, "name"), rest(before, "name")); assert.equal(renamed["id"], before["id"]); assert.equal(Object.keys(renamed).join(), Object.keys(before).join());
  const demo = bagOf("fixtures/demo.tileproj"), stage = docsIn(demo, "stages")[0], mapHit = docsIn(demo, "maps")[0];
  if (stage === undefined || mapHit === undefined || !isObj(mapHit.doc["logic"])) throw new Error("demo");
  const mapId = String(mapHit.doc["id"]); assert.deepEqual([...refsTo(demo, mapId)], ["Demo stage"]);
  const refusedMap = deleteMap(demo, mapId); assert.equal(refusedMap.ok, false); if (refusedMap.ok) return; assert.deepEqual([...refusedMap.usedBy], ["Demo stage"]);
  const refused = deleteStage(demo, String(stage.doc["id"])); assert.deepEqual(refused, { ok: false, reason: "A game needs at least one stage" });
  const seeded = addStage(demo, skelS.doc, skelM.doc, "stage_NEW", "map_NEW", "Stage 2", "Stage 2 map");
  assert.equal(isObj(seeded["stages/stage_NEW.json"]) && seeded["stages/stage_NEW.json"]["seed"], 24301);
  const rootDoc = structuredClone(seeded["project.json"]); assert.ok(isObj(rootDoc) && isObj(rootDoc["project"])); if (!isObj(rootDoc) || !isObj(rootDoc["project"])) return;
  rootDoc["project"]["render"] = { ...(isObj(rootDoc["project"]["render"]) ? rootDoc["project"]["render"] : {}), excludedStages: ["stage_NEW", "keep"] };
  const gone = deleteStage({ ...seeded, "project.json": rootDoc }, "stage_NEW"); assert.equal(gone.ok, true); if (!gone.ok) return;
  assert.ok(gone.files["stages/stage_NEW.json"] !== undefined); const left = proj(gone.files), render = left["render"];
  assert.equal(Array.isArray(left["stages"]) && left["stages"].includes("stage_NEW"), false);
  assert.ok(isObj(render) && Array.isArray(render["excludedStages"])); if (!isObj(render) || !Array.isArray(render["excludedStages"])) return;
  assert.deepEqual(render["excludedStages"], ["keep"]);
  const map = structuredClone(mapHit.doc), logic = map["logic"]; assert.ok(isObj(logic) && Array.isArray(logic["terrain"]) && Array.isArray(logic["edges"])); if (!isObj(logic) || !Array.isArray(logic["terrain"])) return;
  const oldN = logic["terrain"].length; logic["lanes"] = Array.from({ length: oldN }, (_, i) => (i === 0 ? 7 : 0)); logic["edges"] = [{ c: 0, r: 0, side: "e" }, { c: 5, r: 0, side: "n" }];
  const copy = structuredClone(stage.doc); copy["id"] = "stage_COPY"; copy["name"] = "Copy"; copy["playerSpawns"] = [{ c: 5, r: 0 }]; copy["neutrals"] = []; copy["enemyPool"] = { mode: "fixed", entries: [] };
  const listed = structuredClone(demo["project.json"]); assert.ok(isObj(listed) && isObj(listed["project"])); if (!isObj(listed) || !isObj(listed["project"])) return;
  listed["project"]["stages"] = [...(Array.isArray(listed["project"]["stages"]) ? listed["project"]["stages"] : []), "stage_COPY"];
  const files = { ...demo, "project.json": listed, [mapHit.path]: map, "stages/stage_COPY.json": copy }, snap = structuredClone(map);
  const sized = resizeMap(mapHit.path, map, docsIn(files, "stages"), 4, 10);
  assert.deepEqual(map, snap); assert.deepEqual([...refsTo(files, mapId)], ["Demo stage", "Copy"]);
  const terrain = (sized.map["logic"] as Obj)["terrain"], lanes = (sized.map["logic"] as Obj)["lanes"], tiles = ((sized.map["layers"] as Obj[])[0] ?? {})["tiles"];
  assert.equal(sized.map["cols"] === 4 && sized.map["rows"] === 10 && Array.isArray(terrain) && terrain.length === 40 && terrain[0] === logic["terrain"][0] && terrain[36] === 0, true);
  assert.equal(Array.isArray(lanes) && lanes.length === 40 && lanes[0] === 7 && lanes[36] === 0, true);
  assert.equal(Array.isArray(tiles) && tiles.length === 40 && tiles[0] === (list(mapHit.doc["layers"])[0]?.["tiles"] as unknown[] | undefined)?.[0] && tiles[36] === null, true);
  assert.equal(sized.rows.some((row) => JSON.stringify(row).includes("lanes")), false);
  const place = sized.rows.filter((row): row is Extract<Drop, { code: "placementDropped" }> => row.code === "placementDropped");
  assert.deepEqual(place.map((row) => [row.list, row.index, row.reason, row.sq, row.unitId ?? null, row.path.endsWith(`#/${row.list === "enemyPool" ? "enemyPool/entries" : row.list}/${row.index}`)]), [
    ["neutrals", 1, "outsideMap", { c: 4, r: 4 }, "unit_01JDAN00000000000000000007", true],
    ["neutrals", 2, "outsideMap", { c: 5, r: 4 }, "unit_01JDAN00000000000000000005", true],
    ["playerSpawns", 0, "outsideMap", { c: 5, r: 0 }, null, true],
  ]);
  assert.deepEqual(sized.rows.filter((row) => row.code === "mapEntryDropped"), [{ code: "mapEntryDropped", mapId, field: "edges", index: 1, reason: "outsideMap", path: `${mapHit.path}#/logic/edges/1` }]);
  const next: Record<string, Obj> = { ...files, [mapHit.path]: sized.map }; for (const item of sized.stages) next[item.path] = item.doc;
  const loaded = readProject(next); assert.equal(loaded.ok && loaded.project !== null && loaded.report.every((row) => row.severity !== "hard"), true); if (loaded.project === null) return;
  const played = playDocsOf(loaded.project).map as Obj; assert.equal(played["cols"] === 4 && played["rows"] === 10, true);
  const bare = { id: "m", cols: 1, rows: 1, logic: { terrain: [0], palette: { "0": "water" }, edges: [] }, layers: [{ tiles: ["keep"] }] };
  const grown = resizeMap("maps/m.json", bare, [], 2, 1), grownLogic = grown.map["logic"] as Obj;
  assert.deepEqual(grownLogic["terrain"], [0, 1]); assert.equal((grownLogic["palette"] as Obj)["0"], "water"); assert.equal((grownLogic["palette"] as Obj)["1"], "floor");
  assert.deepEqual(((grown.map["layers"] as Obj[])[0] ?? {})["tiles"], ["keep", null]); assert.deepEqual(bare.logic.terrain, [0]); assert.equal(grown.rows.length, 0);
});
```

### `tests/project/load/map-entry-dropped.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { readProject } from "../../../src/project/load/index.ts";
import { createWorld } from "../../../src/sim/world.ts";
import { docsToInput } from "../../../tools/play-stage/load.ts";
import { openProject } from "../../../tools/play-stage/project.ts";
import { loadFixture } from "../../tools/demo-fixture.ts";
const MAP = "maps/map_01JDAM00000000000000000001.json";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
test("mapEntryDropped: warns, skips in memory, writes nothing back", () => {
  const files = loadFixture(), map = files[MAP];
  if (!isObj(map) || !isObj(map["logic"]) || !Array.isArray(map["logic"]["edges"])) throw new Error("demo map");
  map["logic"]["edges"] = [{ c: 0, r: 0, side: "e" }, { c: 99, r: 1, side: "n" }];
  const before = structuredClone(files), got = readProject(files);
  assert.equal(got.ok, true); assert.equal(got.report.some((row) => row.severity === "hard"), false);
  assert.deepEqual(got.report.map((row) => [row.code, row.severity, row.path, row.detail]), [["mapEntryDropped", "warning", `${MAP}#/logic/edges/1`, "outsideMap"]]);
  const opened = openProject(files); assert.notEqual(opened.docs, null); if (opened.docs === null) return;
  const world = createWorld(docsToInput(opened.docs).input);
  assert.equal(world.notices.some((note) => note.code === "edgeOffMap" && note.at?.c === 99 && note.at.r === 1), true);
  assert.equal(world.grid.hasWall({ c: 0, r: 0 }, "e"), true);
  assert.deepEqual(files, before); assert.equal(Array.isArray(map["logic"]["edges"]) && map["logic"]["edges"].length, 2);
});
```

### `handoff/steps/tests/s4c-stages-maps/smoke.mjs` (new)

```js
// Step 4c stages and maps. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s4c-stages-maps/smoke.mjs . 8801
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8801"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s4c-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const shots = join(tmpdir(), "s4c-shots"); mkdirSync(shots, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/local/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).first(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
const gone = (page, s) => page.waitForFunction((s) => !document.body.innerText.includes(s), s, { timeout: 15000 });
const MAP = "map_01JDAM00000000000000000001", DEMO = "stage_01JDAS00000000000000000001";
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); let id = ""; const sheetTiny = [];
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(shots, `${name}.png`) }); };
    const big = async () => page.evaluate(() => [...document.querySelectorAll("button, input")].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.width < 48 || b.height < 48); }).map((el) => `${el.getAttribute("data-act") ?? el.getAttribute("aria-label") ?? ""} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
    const open = async (act, mark) => { await tap(page, act); await page.waitForFunction((m) => document.querySelector(`[data-act="${m}"]`) !== null, mark, { timeout: 15000 }); sheetTiny.push(...await big()); };
    const drop = async () => { await tap(page, "r:apply"); await waitText(page, "will go"); sheetTiny.push(...await big()); };
    const step = async (name, fn) => { try { await fn(); const tiny = await big(); check(`${name} @${width}`, errs.length === 0 && tiny.length === 0, errs.length === 0 && tiny.length === 0 ? "ok" : [...errs, ...tiny].join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    const nudge = async (axis, from, to) => { const dir = to < from ? -1 : 1, label = axis === "c" ? "Columns" : "Rows"; for (let n = from; n !== to; n += dir) { await tap(page, `r:step:${axis}:${dir}`); await waitText(page, `${label} ${n + dir}`); } };
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create"); await waitText(page, "Demo stage");
    await step("1 add", async () => {
      await shot("01-project"); await open("r:add", "r:new"); await shot("02-add"); await tap(page, "r:new");
      await page.waitForFunction(() => document.querySelectorAll(".cell").length === 1 && new URLSearchParams(location.search).get("stage") !== null, null, { timeout: 15000 });
      id = await page.evaluate(() => new URLSearchParams(location.search).get("stage") ?? "");
      const text = await page.evaluate(() => document.body.innerText); if (!text.includes("Stage 2") || id === "") throw new Error(text);
    });
    await step("2 rename", async () => {
      await tap(page, "s:back"); await waitText(page, "Maps"); await open(`r:menu:stage:${id}`, "r:rename"); await open("r:rename", "r:save-name"); await shot("03-rename");
      await page.locator("[data-room]").fill("Upstairs"); await tap(page, "r:save-name");
      await page.waitForFunction((id) => document.body.innerText.includes("Upstairs") && new URLSearchParams(location.search).get("stage") === id, id, { timeout: 15000 });
    });
    await step("3 resize", async () => {
      await open(`r:menu:map:${MAP}`, "r:resize"); await open("r:resize", "r:apply"); await waitText(page, "Columns 6"); await nudge("c", 6, 4); await nudge("r", 9, 4); await drop();
      await waitText(page, "0,8"); await shot("04-resize"); await tap(page, "r:close"); await gone(page, "Resize anyway"); await press(page, "Demo stage");
      await page.waitForFunction(() => document.querySelectorAll(".cell").length === 54, null, { timeout: 15000 }); await tap(page, "s:back"); await waitText(page, "Maps");
      await open(`r:menu:map:${MAP}`, "r:resize"); await open("r:resize", "r:apply"); await nudge("c", 6, 4); await nudge("r", 9, 4); await drop();
      await tap(page, "r:anyway"); await waitText(page, "placementDropped"); await press(page, "Demo stage");
      await page.waitForFunction(() => document.querySelectorAll(".cell").length === 16, null, { timeout: 15000 }); await tap(page, "s:back"); await waitText(page, "Maps");
    });
    await step("4 refuse map", async () => { await open(`r:menu:map:${MAP}`, "r:delete"); await tap(page, "r:delete"); await waitText(page, "Used by: Demo stage"); await shot("05-refuse"); await tap(page, "r:close"); });
    await step("5 test", async () => {
      await press(page, "Upstairs"); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 1, null, { timeout: 15000 }); await tap(page, "s:test");
      await page.waitForFunction((id) => new URLSearchParams(location.search).get("stage") === id && window.__play !== undefined && window.__play.world.grid.cols === 1 && window.__play.world.grid.rows === 1, id, { timeout: 15000 });
      await page.evaluate(() => window.__hud.hideBanner()); await shot("06-play"); await press(page, "Back to maker");
      await page.waitForFunction(() => document.querySelectorAll(".cell").length === 1, null, { timeout: 15000 });
    });
    await step("6 undo", async () => {
      await tap(page, "s:back"); await waitText(page, "Upstairs"); await open(`r:menu:stage:${id}`, "r:delete"); await tap(page, "r:delete");
      await page.waitForFunction((id) => document.body.innerText.includes("Deleted · Undo") && document.querySelector(`[data-act="stage:${id}"]`) === null, id, { timeout: 15000 });
      await tap(page, "undo"); await page.waitForFunction((id) => document.querySelector(`[data-act="stage:${id}"]`) !== null, id, { timeout: 15000 });
    });
    await step("7 last stage", async () => {
      await open(`r:menu:stage:${id}`, "r:delete"); await tap(page, "r:delete");
      await page.waitForFunction((id) => document.querySelector(`[data-act="stage:${id}"]`) === null, id, { timeout: 15000 });
      await open(`r:menu:stage:${DEMO}`, "r:delete"); await tap(page, "r:delete"); await waitText(page, "A game needs at least one stage");
    });
    check(`8 targets @${width}`, sheetTiny.length === 0, sheetTiny.length === 0 ? "ok" : [...new Set(sheetTiny)].join(" | "));
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```

### `src/project/load/drops.ts` (edited)

Diff `a85ae665` → `9bbd115a`:

```diff
diff --git a/src/project/load/drops.ts b/src/project/load/drops.ts
index d4d7571..0289a99 100644
--- a/src/project/load/drops.ts
+++ b/src/project/load/drops.ts
@@ -35,3 +35,17 @@ export function placementDrops(stages: Readonly<Record<string, Doc>>, stageAt: R
   }
   return rows;
 }
+/** One warning per logic.edges entry outside the map. Reads only. Lanes are not entries. */
+export function mapEntryDrops(maps: Readonly<Record<string, Doc>>, mapAt: Readonly<Record<string, string>>): ReportRow[] {
+  const rows: ReportRow[] = [];
+  for (const [id, map] of Object.entries(maps)) {
+    if (!isObj(map)) continue;
+    const file = mapAt[id] ?? `maps/${id}.json`, cols = typeof map["cols"] === "number" ? map["cols"] : 0, rowsN = typeof map["rows"] === "number" ? map["rows"] : 0;
+    const logic = isObj(map["logic"]) ? map["logic"] : {};
+    list(logic["edges"]).forEach((edge, i) => {
+      const c = isObj(edge) ? edge["c"] : undefined, r = isObj(edge) ? edge["r"] : undefined;
+      if (typeof c !== "number" || typeof r !== "number" || !Number.isInteger(c) || !Number.isInteger(r) || c < 0 || r < 0 || c >= cols || r >= rowsN) rows.push({ code: "mapEntryDropped", severity: "warning", path: `${file}#/logic/edges/${i}`, detail: "outsideMap" });
+    });
+  }
+  return rows;
+}
```

As merged:

```ts
import type { Doc, ReportRow } from "./types.ts";
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const warn = (path: string, detail: "closedCell" | "outsideMap"): ReportRow => ({ code: "placementDropped", severity: "warning", path, detail });
function closedIds(slice: Obj): ReadonlySet<string> {
  const out = new Set<string>();
  for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === "terrain") for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === "tile_types") for (const item of list(knob["default"])) if (isObj(item) && typeof item["id"] === "string" && item["open"] === false) out.add(item["id"]);
  return out;
}
function why(map: Obj | undefined, c: number, r: number, closed: ReadonlySet<string>): "closedCell" | "outsideMap" | null {
  if (map === undefined || typeof map["cols"] !== "number" || typeof map["rows"] !== "number" || !Number.isInteger(c) || !Number.isInteger(r) || c < 0 || r < 0 || c >= map["cols"] || r >= map["rows"]) return "outsideMap";
  const logic = isObj(map["logic"]) ? map["logic"] : {}, terrain = Array.isArray(logic["terrain"]) ? logic["terrain"] : [], palette = isObj(logic["palette"]) ? logic["palette"] : {}, value = terrain[r * map["cols"] + c], id = typeof value === "number" ? palette[String(value)] : "floor";
  return typeof id === "string" && closed.has(id) ? "closedCell" : null;
}
function atOf(entry: Obj, direct: boolean): { readonly c: number; readonly r: number } | null {
  const box = direct ? entry : entry["at"];
  return isObj(box) && typeof box["c"] === "number" && typeof box["r"] === "number" ? { c: box["c"], r: box["r"] } : null;
}
/** One warning per placement on a closed cell or off its map. Reads only. */
export function placementDrops(stages: Readonly<Record<string, Doc>>, stageAt: Readonly<Record<string, string>>, maps: Readonly<Record<string, Doc>>, slice: Doc): ReportRow[] {
  const closed = closedIds(isObj(slice) ? slice : {}), rows: ReportRow[] = [];
  for (const [id, stage] of Object.entries(stages)) {
    const file = stageAt[id] ?? `stages/${id}.json`, map = typeof stage["mapRef"] === "string" ? maps[stage["mapRef"]] : undefined;
    const lists: readonly [string, boolean, readonly unknown[]][] = [
      ["playerSpawns", true, list(stage["playerSpawns"])],
      ["neutrals", false, list(stage["neutrals"])],
      ["enemyPool/entries", false, isObj(stage["enemyPool"]) && stage["enemyPool"]["mode"] === "fixed" ? list(stage["enemyPool"]["entries"]) : []],
    ];
    for (const [name, direct, entries] of lists) for (let i = 0; i < entries.length; i += 1) {
      const entry = entries[i]; if (!isObj(entry)) continue;
      const at = atOf(entry, direct), drop = at === null ? "outsideMap" : why(map, at.c, at.r, closed);
      if (drop !== null) rows.push(warn(`${file}#/${name}/${i}`, drop));
    }
  }
  return rows;
}
/** One warning per logic.edges entry outside the map. Reads only. Lanes are not entries. */
export function mapEntryDrops(maps: Readonly<Record<string, Doc>>, mapAt: Readonly<Record<string, string>>): ReportRow[] {
  const rows: ReportRow[] = [];
  for (const [id, map] of Object.entries(maps)) {
    if (!isObj(map)) continue;
    const file = mapAt[id] ?? `maps/${id}.json`, cols = typeof map["cols"] === "number" ? map["cols"] : 0, rowsN = typeof map["rows"] === "number" ? map["rows"] : 0;
    const logic = isObj(map["logic"]) ? map["logic"] : {};
    list(logic["edges"]).forEach((edge, i) => {
      const c = isObj(edge) ? edge["c"] : undefined, r = isObj(edge) ? edge["r"] : undefined;
      if (typeof c !== "number" || typeof r !== "number" || !Number.isInteger(c) || !Number.isInteger(r) || c < 0 || r < 0 || c >= cols || r >= rowsN) rows.push({ code: "mapEntryDropped", severity: "warning", path: `${file}#/logic/edges/${i}`, detail: "outsideMap" });
    });
  }
  return rows;
}
```

### `src/project/load/read-project.ts` (edited)

Diff `a85ae665` → `9bbd115a`:

```diff
diff --git a/src/project/load/read-project.ts b/src/project/load/read-project.ts
index f80276c..ff897fb 100644
--- a/src/project/load/read-project.ts
+++ b/src/project/load/read-project.ts
@@ -1,5 +1,5 @@
 import { readManifest, readMap, readSetup, readStage, readUnit, type ReadResult } from "../read/index.ts";
-import { placementDrops } from "./drops.ts";
+import { mapEntryDrops, placementDrops } from "./drops.ts";
 import { migrateProject, versionRows } from "./migrate.ts";
 import { knownKind, type Doc, type ProjectFiles, type ProjectLoad, type ProjectStore, type ReportRow, type Severity } from "./types.ts";
 
@@ -79,7 +79,7 @@ export function readProject(files: ProjectFiles): ProjectLoad {
   let migrated: { files: ProjectFiles; report: readonly ReportRow[] };
   try { migrated = migrateProject(files); } catch { return { ok: false, readOnly: true, project: null, report: [row("invalidValue", "hard", "project.json", "unreadable")] }; }
   const docs = migrated.files, rows: ReportRow[] = [...migrated.report];
-  const maps: Record<string, Doc> = {}, stages: Record<string, Doc> = {}, units: Record<string, Doc> = {}, setups: Record<string, Doc> = {}, unknownFiles: Record<string, unknown> = {}, stageAt: Record<string, string> = {};
+  const maps: Record<string, Doc> = {}, stages: Record<string, Doc> = {}, units: Record<string, Doc> = {}, setups: Record<string, Doc> = {}, unknownFiles: Record<string, unknown> = {}, stageAt: Record<string, string> = {}, mapAt: Record<string, string> = {};
   let slice: Doc = {}, manifest: Doc = {};
   for (const path of Object.keys(docs)) {
     const doc = docs[path], slot = knownKind(path);
@@ -89,7 +89,7 @@ export function readProject(files: ProjectFiles): ProjectLoad {
     if (slot === "tile-project") { manifest = doc; if ("index" in doc) rows.push(row("indexIgnored", "info", `${path}#/index`)); note(readManifest(doc), path, rows); }
     else if (slot === "catalogue-slice") slice = doc;
     else if (slot === "map") {
-      if (id !== null) maps[id] = doc;
+      if (id !== null) { maps[id] = doc; mapAt[id] = path; }
       const n = typeof doc["cols"] === "number" && typeof doc["rows"] === "number" ? doc["cols"] * doc["rows"] : -1;
       const terrain = isObj(doc["logic"]) && Array.isArray(doc["logic"]["terrain"]) ? doc["logic"]["terrain"] : null;
       const badLen = terrain !== null && terrain.length !== n;
@@ -105,7 +105,7 @@ export function readProject(files: ProjectFiles): ProjectLoad {
   const project = isObj(manifestDoc) && isObj(manifestDoc["project"]) ? manifestDoc["project"] : {};
   refs(isObj(manifestDoc) ? manifestDoc : {}, stageAt, maps, stages, units, setups, rows);
   warns(slice, project["catalogueRev"], maps, setups, rows);
-  rows.push(...placementDrops(stages, stageAt, maps, slice));
+  rows.push(...placementDrops(stages, stageAt, maps, slice), ...mapEntryDrops(maps, mapAt));
   const hard = rows.some((r) => r.severity === "hard");
   const store: ProjectStore = { manifest, slice, maps, stages, units, setups, unknownFiles };
   return { ok: !hard, readOnly: false, project: store, report: sort(rows) };
```

As merged:

```ts
import { readManifest, readMap, readSetup, readStage, readUnit, type ReadResult } from "../read/index.ts";
import { mapEntryDrops, placementDrops } from "./drops.ts";
import { migrateProject, versionRows } from "./migrate.ts";
import { knownKind, type Doc, type ProjectFiles, type ProjectLoad, type ProjectStore, type ReportRow, type Severity } from "./types.ts";

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const LIMITS = { picks: 8, waveUnits: 16 } as const;
const row = (code: string, severity: Severity, path: string, detail?: string): ReportRow => (detail === undefined ? { code, severity, path } : { code, severity, path, detail });
const sort = (rows: readonly ReportRow[]): ReportRow[] => [...rows].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : a.code < b.code ? -1 : a.code > b.code ? 1 : 0));
const idOf = (doc: Obj): string | null => (typeof doc["id"] === "string" ? doc["id"] : null);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);

function note(res: ReadResult<unknown>, path: string, rows: ReportRow[]): void {
  if (res.ok) return;
  const stats = !res.needsMigration && res.error === "bad field stats";
  rows.push(row("invalidValue", "hard", stats ? `${path}#/stats` : path, res.needsMigration ? "needsMigration" : res.error));
}
function has(bag: Readonly<Record<string, unknown>>, id: unknown, path: string, rows: ReportRow[]): void {
  if (typeof id === "string" && !Object.hasOwn(bag, id)) rows.push(row("brokenRef", "hard", path, id));
}

function refs(manifest: Obj, at: Readonly<Record<string, string>>, maps: Readonly<Record<string, Doc>>, stages: Readonly<Record<string, Doc>>, units: Readonly<Record<string, Doc>>, setups: Readonly<Record<string, Doc>>, rows: ReportRow[]): void {
  const project = isObj(manifest["project"]) ? manifest["project"] : {};
  const gear = isObj(project["loadout"]) ? project["loadout"] : {};
  list(project["stages"]).forEach((id, i) => has(stages, id, `project.json#/project/stages/${i}`, rows));
  list(project["rules"]).forEach((id, i) => has(setups, id, `project.json#/project/rules/${i}`, rows));
  list(gear["roster"]).forEach((id, i) => has(units, id, `project.json#/project/loadout/roster/${i}`, rows));
  list(gear["required"]).forEach((id, i) => has(units, id, `project.json#/project/loadout/required/${i}`, rows));
  for (const [id, stage] of Object.entries(stages)) {
    const path = at[id] ?? `stages/${id}.json`;
    const pool = isObj(stage["enemyPool"]) ? stage["enemyPool"] : {};
    has(maps, stage["mapRef"], `${path}#/mapRef`, rows);
    list(stage["rules"]).forEach((sid, i) => has(setups, sid, `${path}#/rules/${i}`, rows));
    list(stage["neutrals"]).forEach((n, i) => { if (!isObj(n)) return; has(units, n["unitId"], `${path}#/neutrals/${i}/unitId`, rows); list(n["setupIds"]).forEach((sid, j) => has(setups, sid, `${path}#/neutrals/${i}/setupIds/${j}`, rows)); });
    list(pool["entries"]).forEach((e, i) => { if (isObj(e)) has(units, e["unitId"], `${path}#/enemyPool/entries/${i}/unitId`, rows); });
  }
  for (const [id, unit] of Object.entries(units)) list(unit["setupIds"]).forEach((sid, i) => has(setups, sid, `units/${id}.json#/setupIds/${i}`, rows));
}

function knobAt(slice: Obj, behaviourId: unknown, key: string): Obj | null {
  if (typeof behaviourId !== "string") return null;
  for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === behaviourId) for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === key) return knob;
  return null;
}
function warns(slice: Obj, projectRev: unknown, maps: Readonly<Record<string, Doc>>, setups: Readonly<Record<string, Doc>>, rows: ReportRow[]): void {
  const known = new Set(list(slice["behaviours"]).filter(isObj).map((b) => b["id"]));
  const tiles = new Set<string>();
  for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === "terrain") for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === "tile_types") for (const item of list(knob["default"])) if (isObj(item) && typeof item["id"] === "string") tiles.add(item["id"]);
  if (slice["catalogue_rev"] !== undefined && slice["catalogue_rev"] !== projectRev) rows.push(row("catalogueRevMismatch", "warning", "catalogue/slice.json#/catalogue_rev"));
  for (const [id, setup] of Object.entries(setups)) {
    const path = `setups/${id}.json`, answers = isObj(setup["answers"]) ? setup["answers"] : {};
    if (isObj(setup["catalogue"]) && setup["catalogue"]["rev"] !== projectRev) rows.push(row("catalogueRevMismatch", "warning", `${path}#/catalogue/rev`));
    if (known.size > 0 && typeof setup["behaviourId"] === "string" && !known.has(setup["behaviourId"])) rows.push(row("unknownRef", "warning", `${path}#/behaviourId`, setup["behaviourId"]));
    const ns = isObj(answers["custom_ns"]) ? answers["custom_ns"]["value"] : undefined, ew = isObj(answers["custom_ew"]) ? answers["custom_ew"]["value"] : undefined, mode = isObj(answers["reach_mode"]) ? answers["reach_mode"]["value"] : undefined;
    if (setup["behaviourId"] === "basic-attack" && mode === "custom-cross" && typeof ns === "number" && typeof ew === "number" && ns !== ew) rows.push(row("layerNotApplied", "warning", `${path}#/answers/custom_ns`, "min(ns,ew)"));
    if (setup["behaviourId"] === "basic-attack" && isObj(answers["damage"]) && answers["damage"]["source"] !== "default" && answers["damage"]["source"] !== undefined) rows.push(row("layerNotApplied", "warning", `${path}#/answers/damage`, "unit_atk"));
    for (const key of Object.keys(answers)) {
      const ans = answers[key]; if (!isObj(ans) || !Object.hasOwn(ans, "value")) continue;
      const knob = knobAt(slice, setup["behaviourId"], key); if (knob === null) continue;
      const value = ans["value"], type = knob["type"], where = `${path}#/answers/${key}/value`;
      const bad = type === "slider" ? typeof value !== "number" || !Number.isFinite(value) : type === "toggle" ? typeof value !== "boolean" : type === "text" || type === "ref" ? typeof value !== "string" : type === "picker" ? typeof value !== "string" || (Array.isArray(knob["options"]) && !knob["options"].some((opt) => (isObj(opt) && Object.hasOwn(opt, "value") ? opt["value"] : opt) === value)) : type === "list" ? !Array.isArray(value) || value.some((item) => !isObj(item) || typeof item["id"] !== "string" || typeof item["label"] !== "string") : false;
      if (bad) rows.push(row("invalidValue", "hard", where));
      if (type === "text" && typeof value === "string" && typeof knob["max_len"] === "number" && [...value].length > knob["max_len"]) rows.push(row("outOfRange", "warning", where));
      if (type === "slider" && typeof value === "number" && ((typeof knob["min"] === "number" && value < knob["min"]) || (typeof knob["max"] === "number" && value > knob["max"]))) rows.push(row("outOfRange", "warning", where));
    }
  }
  for (const [id, map] of Object.entries(maps)) {
    const palette = isObj(map["logic"]) && isObj(map["logic"]["palette"]) ? map["logic"]["palette"] : {};
    for (const key of Object.keys(palette)) { const name = palette[key]; if (tiles.size > 0 && typeof name === "string" && !tiles.has(name)) rows.push(row("unknownRef", "warning", `maps/${id}.json#/logic/palette/${key}`, name)); }
  }
}

/** Pure project read. Never throws, never writes, never mutates `files`. */
export function readProject(files: ProjectFiles): ProjectLoad {
  if (!isObj(files) || !isObj(files["project.json"])) return { ok: false, readOnly: true, project: null, report: [row("notAProject", "hard", "project.json", "missing project.json")] };
  const gate = versionRows(files);
  if (gate.length > 0) return { ok: false, readOnly: true, project: null, report: sort(gate) };
  let migrated: { files: ProjectFiles; report: readonly ReportRow[] };
  try { migrated = migrateProject(files); } catch { return { ok: false, readOnly: true, project: null, report: [row("invalidValue", "hard", "project.json", "unreadable")] }; }
  const docs = migrated.files, rows: ReportRow[] = [...migrated.report];
  const maps: Record<string, Doc> = {}, stages: Record<string, Doc> = {}, units: Record<string, Doc> = {}, setups: Record<string, Doc> = {}, unknownFiles: Record<string, unknown> = {}, stageAt: Record<string, string> = {}, mapAt: Record<string, string> = {};
  let slice: Doc = {}, manifest: Doc = {};
  for (const path of Object.keys(docs)) {
    const doc = docs[path], slot = knownKind(path);
    if (slot === null) { unknownFiles[path] = doc; rows.push(row("unknownFile", "warning", path)); continue; }
    if (!isObj(doc)) { rows.push(row("invalidValue", "hard", path, "not an object")); continue; }
    const id = idOf(doc);
    if (slot === "tile-project") { manifest = doc; if ("index" in doc) rows.push(row("indexIgnored", "info", `${path}#/index`)); note(readManifest(doc), path, rows); }
    else if (slot === "catalogue-slice") slice = doc;
    else if (slot === "map") {
      if (id !== null) { maps[id] = doc; mapAt[id] = path; }
      const n = typeof doc["cols"] === "number" && typeof doc["rows"] === "number" ? doc["cols"] * doc["rows"] : -1;
      const terrain = isObj(doc["logic"]) && Array.isArray(doc["logic"]["terrain"]) ? doc["logic"]["terrain"] : null;
      const badLen = terrain !== null && terrain.length !== n;
      if (badLen && terrain !== null) rows.push(row("terrainLength", "hard", `${path}#/logic/terrain`, `found ${terrain.length}`));
      if (list(doc["layers"]).some((layer) => isObj(layer) && Array.isArray(layer["tiles"]) && layer["tiles"].length !== n)) rows.push(row("terrainLength", "hard", `${path}#/layers`));
      if (!badLen) note(readMap(doc), path, rows);
    } else if (slot === "stage") { if (id !== null) { stages[id] = doc; stageAt[id] = path; } note(readStage(doc, LIMITS), path, rows); }
    else if (slot === "unit") { if (id !== null) units[id] = doc; note(readUnit(doc), path, rows); }
    else { if (id !== null) setups[id] = doc; note(readSetup(doc), path, rows); }
  }
  if (!Object.hasOwn(docs, "catalogue/slice.json")) rows.push(row("invalidValue", "hard", "catalogue/slice.json", "missing"));
  const manifestDoc = docs["project.json"];
  const project = isObj(manifestDoc) && isObj(manifestDoc["project"]) ? manifestDoc["project"] : {};
  refs(isObj(manifestDoc) ? manifestDoc : {}, stageAt, maps, stages, units, setups, rows);
  warns(slice, project["catalogueRev"], maps, setups, rows);
  rows.push(...placementDrops(stages, stageAt, maps, slice), ...mapEntryDrops(maps, mapAt));
  const hard = rows.some((r) => r.severity === "hard");
  const store: ProjectStore = { manifest, slice, maps, stages, units, setups, unknownFiles };
  return { ok: !hard, readOnly: false, project: store, report: sort(rows) };
}
```

### `tools/maker/project.ts` (edited)

Diff `a85ae665` → `9bbd115a`:

```diff
diff --git a/tools/maker/project.ts b/tools/maker/project.ts
index e6e5033..0761158 100644
--- a/tools/maker/project.ts
+++ b/tools/maker/project.ts
@@ -1,10 +1,10 @@
 const amp = String.fromCharCode(38);
 const esc = (text: string): string => text.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
-export function projectScreen(input: { readonly name: string; readonly stages: number; readonly rows?: readonly { readonly id: string; readonly name: string }[]; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null; readonly problems: readonly string[] }): string {
+export function projectScreen(input: { readonly name: string; readonly stages: number; readonly rows?: readonly { readonly id: string; readonly name: string }[]; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null; readonly problems: readonly string[]; readonly tail?: string }): string {
   const reason = "Made with a newer TileEngine. Open only.";
   const save = input.readOnly ? `<button type="button" class="btn ghost" disabled title="${esc(reason)}">Save</button>` : `<button type="button" class="btn ghost" data-act="save">Save${input.dirty ? `<span class="dot" aria-hidden="true"></span>` : ""}</button>`;
   const banner = input.banner === null ? "" : `<p class="banner bad" role="alert">${esc(input.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
   const blocked = input.problems.length === 0 ? "" : `<p class="banner" role="alert">Can't play yet <button type="button" class="btn ghost" data-act="fix">Fix</button></p><div class="sheet" role="dialog">${input.problems.map((line) => `<p>${esc(line)}</p>`).join("")}</div>`;
-  const rows = (input.rows ?? []).map((row) => `<button type="button" class="choice stage-row" data-act="stage:${esc(row.id)}">${esc(row.name)}</button>`).join("");
-  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}${blocked}<h2>${esc(input.name)}</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p>${rows}<div class="test-wrap"><button type="button" class="btn" data-act="test">Test</button></div></div>`;
+  const rows = (input.rows ?? []).map((row) => `<div class="card"><button type="button" class="grow card-hit" data-act="stage:${esc(row.id)}"><span class="name">${esc(row.name)}</span></button>${input.readOnly ? "" : `<button type="button" class="btn icon" data-act="r:menu:stage:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">⋯</button>`}</div>`).join("");
+  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}${blocked}<h2>${esc(input.name)}</h2><h2>Stages</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p>${rows}${input.tail ?? ""}<div class="test-wrap"><button type="button" class="btn" data-act="test">Test</button></div></div>`;
 }
```

As merged:

```ts
const amp = String.fromCharCode(38);
const esc = (text: string): string => text.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
export function projectScreen(input: { readonly name: string; readonly stages: number; readonly rows?: readonly { readonly id: string; readonly name: string }[]; readonly dirty: boolean; readonly readOnly: boolean; readonly banner: string | null; readonly problems: readonly string[]; readonly tail?: string }): string {
  const reason = "Made with a newer TileEngine. Open only.";
  const save = input.readOnly ? `<button type="button" class="btn ghost" disabled title="${esc(reason)}">Save</button>` : `<button type="button" class="btn ghost" data-act="save">Save${input.dirty ? `<span class="dot" aria-hidden="true"></span>` : ""}</button>`;
  const banner = input.banner === null ? "" : `<p class="banner bad" role="alert">${esc(input.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
  const blocked = input.problems.length === 0 ? "" : `<p class="banner" role="alert">Can't play yet <button type="button" class="btn ghost" data-act="fix">Fix</button></p><div class="sheet" role="dialog">${input.problems.map((line) => `<p>${esc(line)}</p>`).join("")}</div>`;
  const rows = (input.rows ?? []).map((row) => `<div class="card"><button type="button" class="grow card-hit" data-act="stage:${esc(row.id)}"><span class="name">${esc(row.name)}</span></button>${input.readOnly ? "" : `<button type="button" class="btn icon" data-act="r:menu:stage:${esc(row.id)}" aria-label="Menu ${esc(row.name)}">⋯</button>`}</div>`).join("");
  return `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>${esc(input.name)}</h1>${save}</header><div class="body project">${banner}${blocked}<h2>${esc(input.name)}</h2><h2>Stages</h2><p class="sub">${input.stages} ${input.stages === 1 ? "stage" : "stages"}</p>${rows}${input.tail ?? ""}<div class="test-wrap"><button type="button" class="btn" data-act="test">Test</button></div></div>`;
}
```

### `tools/maker/home.ts` (edited)

Diff `a85ae665` → `9bbd115a`:

```diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index 705d8c5..0ad7ee8 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -2,6 +2,7 @@ import { checkName, duplicate, LIVE, prefix, projectId, renameTo, restorePlan, r
 import { asWrites, planSave } from "../../src/editor/project/save.ts";
 import { parseProject } from "./project-files.ts";
 import { projectScreen } from "./project.ts";
+import { bindRooms, roomClick, roomLine, roomSheet, roomTail } from "./rooms.ts";
 import { bindStage, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
 import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
 import { backScreen, launchTest, openSaved, type PlayReady } from "./test-launch.ts";
@@ -27,14 +28,14 @@ function paint(): void {
   if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
   if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
   if (state.screen === "stage" && state.current !== null && state.stageId !== null) { root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }); return; }
-  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current); root.innerHTML = projectScreen({ name: row?.name ?? "Project", stages: row?.stages ?? 0, rows: stageRows(state.files), dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems }) + toast; return; }
+  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); root.innerHTML = projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: roomTail(state.files, state.readOnly) }) + roomSheet(state.files) + toast; return; }
   const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
   const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
   const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
   root.innerHTML = `${bar}<div class="body">${banner}${state.screen === "trash" ? "" : `<button type="button" class="card new" data-act="new"><span class="grow"><span class="name">New project</span><span class="sub">Demo or empty</span></span></button>`}${empty}${list}${link}</div>${sheet()}${toast}`;
 }
 async function refresh(): Promise<void> { const live = store; if (live === null) return; const load = async (dir: string): Promise<readonly Row[]> => { const rows: Row[] = []; for (const id of (await live.list(dir)).filter((name) => name !== ".deleted")) { const text = await readTree(live, `${dir}${id}/`); if (Object.keys(text).length === 0) continue; const parsed = parseProject(text); rows.push(parsed.ok ? rowFrom(id, parsed.files) : rowBlocked(id, parsed.message)); } return sortRows(rows); }; state.rows = await load(LIVE); state.trash = await load(TRASH); }
-async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; state.screen = "project"; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; paint(); }
+async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; state.screen = "project"; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; bindRooms(id); paint(); }
 async function saveCurrent(): Promise<void> { if (store === null || state.current === null || state.readOnly) return; const plan = planSave(state.files, state.files, state.rev, nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.current), plan.writes); if (!got.ok) { say(got.message); return; } for (const write of plan.writes) state.files = { ...state.files, [write.path]: write.text }; if (plan.writes.length > 0) state.rev += 1; state.dirty = false; state.banner = null; paint(); }
 async function create(): Promise<void> { if (store === null || templates === null) { say("Can't open: templates"); return; } const err = checkName(state.name); if (err !== null) { say(err); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(stampNew(templates[state.tpl], state.name, id, nowIso()))); if (!got.ok) { say(got.message); return; } state.banner = null; await refresh(); await openId(id); }
 async function rename(): Promise<void> { if (store === null || state.menu === null) return; const err = checkName(state.name); if (err !== null) { say(err); return; } const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } if (rowFrom(state.menu, parsed.files).readOnly) { say("Made with a newer TileEngine. Open only."); return; } const plan = planSave(text, renameTo(text, state.name), storedRev(parsed.files), nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.menu), plan.writes); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
@@ -70,10 +71,17 @@ async function fromUrl(): Promise<void> {
   const got = await openSaved({ store, id, from, ...(stage === null ? {} : { stageId: stage }), start: (docs) => enterPlay(docs, 0) });
   if (!got.ok) { state.screen = "missing"; state.banner = got.lines[0] ?? "Can't open this project"; state.problems = got.lines; paint(); return; }
   if (stage !== null) { state.stageId = stage; bindStage(stage, id); }
-  state.current = id; state.files = got.files; state.rev = got.rev; state.screen = from === "stage" ? "stage" : "project"; state.readOnly = false; state.dirty = false; state.problems = [];
+  state.current = id; state.files = got.files; state.rev = got.rev; state.screen = from === "stage" ? "stage" : "project"; state.readOnly = false; state.dirty = false; state.problems = []; bindRooms(id);
 }
 async function run(act: string): Promise<void> {
-  if (act.startsWith("stage:")) { state.stageId = act.slice(6); bindStage(state.stageId, state.current ?? ""); state.screen = "stage"; if (!state.readOnly) state.banner = null; paint(); return; }
+  if ((act.startsWith("r:") || (act === "undo" && state.screen === "project")) && state.screen === "project" && store !== null && state.current !== null && templates !== null) {
+    const hit = await roomClick(act === "undo" ? "r:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes, empty: templates.empty });
+    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
+    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; if (state.screen === "project") paint(); }, 6000); }
+    if (hit.stageId !== null) { state.stageId = hit.stageId; bindStage(hit.stageId, state.current); state.screen = "stage"; if (!state.readOnly) state.banner = null; history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(hit.stageId)}&from=stage`); }
+    paint(); return;
+  }
+  if (act.startsWith("stage:")) { state.stageId = act.slice(6); bindStage(state.stageId, state.current ?? ""); state.screen = "stage"; if (!state.readOnly) state.banner = null; if (state.current !== null) history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(state.stageId)}&from=stage`); paint(); return; }
   if (act.startsWith("s:") && state.screen === "stage" && state.stageId !== null && store !== null && state.current !== null) {
     const out = await stageClick(act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
     state.files = out.files; state.rev = out.rev; state.banner = out.banner; state.dirty = out.dirty; if (out.test) return beginTest(); if (out.leave) state.screen = "project"; paint(); return;
@@ -93,6 +101,6 @@ async function boot(): Promise<void> {
   } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
 }
 document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) void run(node.getAttribute("data-act") ?? "").catch((e: unknown) => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.")); });
-document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
+document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
 document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
 void boot();
```

As merged:

```ts
import { checkName, duplicate, LIVE, prefix, projectId, renameTo, restorePlan, rowBlocked, rowFrom, sortRows, stampNew, storedRev, subline, TRASH, type DocText, type Row } from "../../src/editor/project/home.ts";
import { asWrites, planSave } from "../../src/editor/project/save.ts";
import { parseProject } from "./project-files.ts";
import { projectScreen } from "./project.ts";
import { bindRooms, roomClick, roomLine, roomSheet, roomTail } from "./rooms.ts";
import { bindStage, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
import { backScreen, launchTest, openSaved, type PlayReady } from "./test-launch.ts";
import { startMatch } from "../play-stage/page.ts";
const OPFS = "This browser can't save projects here. Open the app from its web address.";
const amp = String.fromCharCode(38);
const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, tpl: "demo", name: "My game", menu: null, current: null, stageId: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "";
const app = (): HTMLElement => { const node = document.querySelector("#app"); if (!(node instanceof HTMLElement)) throw new Error("maker: #app"); return node; };
const nowIso = (): string => new Date().toISOString(), bytes = (): Uint8Array => crypto.getRandomValues(new Uint8Array(16)), say = (m: string): void => { state.banner = m; paint(); };
const rowHtml = (row: Row): string => { const open = row.error === null, tag = open ? "button" : "div"; return `<article class="card"><${tag} class="grow card-hit"${open ? ` type="button" data-act="open:${row.id}"` : ""}><span class="name">${esc(row.name)}</span><span class="sub">${esc(row.error ?? subline(row, Date.now()))}</span>${row.badge === null ? "" : `<span class="badge">${esc(row.badge)}</span>`}</${tag}><button type="button" class="btn icon" data-act="menu:${row.id}" aria-label="Project menu">⋯</button></article>`; };
function sheet(): string {
  if (state.screen === "pick") return `<div class="scrim"><div class="sheet" role="dialog"><h2>Pick a start</h2><button type="button" class="choice" data-act="tpl:demo" aria-pressed="${state.tpl === "demo" ? "true" : "false"}">Demo</button><button type="button" class="choice" data-act="tpl:empty" aria-pressed="${state.tpl === "empty" ? "true" : "false"}">Empty</button><button type="button" class="btn" data-act="toname">Continue</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
  if (state.screen === "menu") { const row = state.rows.find((item) => item.id === state.menu), ok = row?.error === null; return `<div class="scrim"><div class="sheet" role="dialog"><h2>${esc(row?.name ?? "Project")}</h2>${ok ? `<button type="button" class="btn ghost" data-act="askrename">Rename</button><button type="button" class="btn ghost" data-act="duplicate">Duplicate</button>` : ""}<button type="button" class="btn danger" data-act="delete">Delete</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`; }
  if (state.screen !== "name" && state.screen !== "rename") return "";
  return `<div class="scrim"><div class="sheet" role="dialog"><h2>${state.screen === "rename" ? "Rename" : "Name it"}</h2><input class="name-field" data-name value="${esc(state.name)}" aria-label="Game name"><p class="hint">${esc(state.banner ?? "1-40 characters")}</p><button type="button" class="btn" data-act="${state.screen === "rename" ? "dore" : "create"}">${state.screen === "rename" ? "Save name" : "Create"}</button><button type="button" class="btn ghost" data-act="back">Close</button></div></div>`;
}
function paint(): void {
  const root = app(), banner = state.banner === null ? "" : `<p class="banner bad" role="alert">${esc(state.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`, toast = state.toast === null ? "" : `<div class="toast" role="status"><span>${esc(state.toast)}</span><button type="button" class="btn" data-act="undo">Undo</button></div>`;
  if (state.screen === "fatal") { root.innerHTML = `<div class="body"><p class="banner bad" role="alert">${esc(OPFS)}</p></div>`; return; }
  if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
  if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
  if (state.screen === "stage" && state.current !== null && state.stageId !== null) { root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }); return; }
  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); root.innerHTML = projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: roomTail(state.files, state.readOnly) }) + roomSheet(state.files) + toast; return; }
  const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
  const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
  const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
  root.innerHTML = `${bar}<div class="body">${banner}${state.screen === "trash" ? "" : `<button type="button" class="card new" data-act="new"><span class="grow"><span class="name">New project</span><span class="sub">Demo or empty</span></span></button>`}${empty}${list}${link}</div>${sheet()}${toast}`;
}
async function refresh(): Promise<void> { const live = store; if (live === null) return; const load = async (dir: string): Promise<readonly Row[]> => { const rows: Row[] = []; for (const id of (await live.list(dir)).filter((name) => name !== ".deleted")) { const text = await readTree(live, `${dir}${id}/`); if (Object.keys(text).length === 0) continue; const parsed = parseProject(text); rows.push(parsed.ok ? rowFrom(id, parsed.files) : rowBlocked(id, parsed.message)); } return sortRows(rows); }; state.rows = await load(LIVE); state.trash = await load(TRASH); }
async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; state.screen = "project"; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; bindRooms(id); paint(); }
async function saveCurrent(): Promise<void> { if (store === null || state.current === null || state.readOnly) return; const plan = planSave(state.files, state.files, state.rev, nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.current), plan.writes); if (!got.ok) { say(got.message); return; } for (const write of plan.writes) state.files = { ...state.files, [write.path]: write.text }; if (plan.writes.length > 0) state.rev += 1; state.dirty = false; state.banner = null; paint(); }
async function create(): Promise<void> { if (store === null || templates === null) { say("Can't open: templates"); return; } const err = checkName(state.name); if (err !== null) { say(err); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(stampNew(templates[state.tpl], state.name, id, nowIso()))); if (!got.ok) { say(got.message); return; } state.banner = null; await refresh(); await openId(id); }
async function rename(): Promise<void> { if (store === null || state.menu === null) return; const err = checkName(state.name); if (err !== null) { say(err); return; } const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } if (rowFrom(state.menu, parsed.files).readOnly) { say("Made with a newer TileEngine. Open only."); return; } const plan = planSave(text, renameTo(text, state.name), storedRev(parsed.files), nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.menu), plan.writes); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
async function copy(): Promise<void> { if (store === null || state.menu === null) return; const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(duplicate(text, id, nowIso(), state.rows.map((row) => row.name)))); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
async function remove(): Promise<void> { if (store === null || state.menu === null) return; const id = state.menu; await movePrefix(store, prefix(id), prefix(id, true)); toastId = id; state.toast = "Deleted · Undo"; state.screen = "home"; window.clearTimeout(timer); timer = window.setTimeout(() => { state.toast = null; paint(); }, 6000); await refresh(); paint(); }
async function restore(id: string): Promise<void> { if (store === null || id === "") return; const taken = (await store.list(LIVE)).includes(id), text = await readTree(store, prefix(id, true)), plan = restorePlan(id, taken, text, projectId(Date.now(), bytes()), nowIso(), state.rows.map((row) => row.name)); if (taken) { const got = await commitWrites(store, prefix(plan.id), asWrites(plan.files)); if (!got.ok) { say(got.message); return; } for (const rel of Object.keys(text)) await store.remove(`${prefix(id, true)}${rel}`); } else await movePrefix(store, prefix(id, true), prefix(id)); window.clearTimeout(timer); state.toast = null; state.screen = "home"; state.banner = null; await refresh(); paint(); }
function enterPlay(docs: PlayReady, scroll: number): void {
  const root = app(), canvas = document.createElement("canvas"); canvas.id = "board"; document.body.append(canvas);
  try {
    startMatch(docs, () => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; state.screen = backScreen(new URLSearchParams(location.search).get("from")); state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; });
    root.hidden = true;
  } catch (e) { canvas.remove(); throw e; }
}
async function saveStage(): Promise<boolean> {
  if (store === null || state.current === null) return false;
  const out = await stageCommit({ store, id: state.current, now: nowIso() }, state.files, state.rev);
  state.files = out.files; state.rev = out.rev; state.dirty = out.dirty; if (!out.ok) state.banner = out.message; else if (!state.readOnly) state.banner = null; return out.ok;
}
async function beginTest(): Promise<void> {
  if (store === null || state.current === null) return;
  const stageId = state.screen === "stage" ? state.stageId : null;
  if (stageId !== null && !await saveStage()) { paint(); return; }
  const body = document.querySelector(".body"), scroll = body instanceof HTMLElement ? body.scrollTop : 0;
  const got = await launchTest({ store, id: state.current, stored: state.files, next: state.files, rev: state.rev, from: stageId !== null ? "stage" : "project", ...(stageId !== null ? { stageId } : {}), now: nowIso(), start: (docs) => enterPlay(docs, scroll) });
  state.files = got.files; state.rev = got.rev;
  if (!got.ok) { const line = got.lines[0] ?? ""; const save = line.startsWith("Couldn't save") || line.startsWith("This project changed") || line.startsWith("Can't open"); const onStage = state.screen === "stage"; state.banner = onStage ? (got.lines.join(" ") || null) : save ? line : null; state.problems = onStage || save ? [] : got.lines; paint(); return; }
  state.dirty = false; state.problems = [];
}
async function fromUrl(): Promise<void> {
  const params = new URLSearchParams(location.search), id = params.get("project");
  if (id === null || store === null) return;
  const stage = params.get("stage"), from = params.get("from") ?? "project";
  const got = await openSaved({ store, id, from, ...(stage === null ? {} : { stageId: stage }), start: (docs) => enterPlay(docs, 0) });
  if (!got.ok) { state.screen = "missing"; state.banner = got.lines[0] ?? "Can't open this project"; state.problems = got.lines; paint(); return; }
  if (stage !== null) { state.stageId = stage; bindStage(stage, id); }
  state.current = id; state.files = got.files; state.rev = got.rev; state.screen = from === "stage" ? "stage" : "project"; state.readOnly = false; state.dirty = false; state.problems = []; bindRooms(id);
}
async function run(act: string): Promise<void> {
  if ((act.startsWith("r:") || (act === "undo" && state.screen === "project")) && state.screen === "project" && store !== null && state.current !== null && templates !== null) {
    const hit = await roomClick(act === "undo" ? "r:undo" : act, { files: state.files, rev: state.rev, readOnly: state.readOnly, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes, empty: templates.empty });
    state.files = hit.files; state.rev = hit.rev; state.banner = hit.banner; state.dirty = hit.dirty;
    if ("toast" in hit) { window.clearTimeout(timer); state.toast = hit.toast ?? null; if (state.toast !== null) timer = window.setTimeout(() => { state.toast = null; if (state.screen === "project") paint(); }, 6000); }
    if (hit.stageId !== null) { state.stageId = hit.stageId; bindStage(hit.stageId, state.current); state.screen = "stage"; if (!state.readOnly) state.banner = null; history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(hit.stageId)}&from=stage`); }
    paint(); return;
  }
  if (act.startsWith("stage:")) { state.stageId = act.slice(6); bindStage(state.stageId, state.current ?? ""); state.screen = "stage"; if (!state.readOnly) state.banner = null; if (state.current !== null) history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(state.stageId)}&from=stage`); paint(); return; }
  if (act.startsWith("s:") && state.screen === "stage" && state.stageId !== null && store !== null && state.current !== null) {
    const out = await stageClick(act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
    state.files = out.files; state.rev = out.rev; state.banner = out.banner; state.dirty = out.dirty; if (out.test) return beginTest(); if (out.leave) state.screen = "project"; paint(); return;
  }
  if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
  if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; state.problems = []; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
  if (act.startsWith("open:")) return openId(act.slice(5)); if (act.startsWith("menu:")) { state.menu = act.slice(5); state.screen = "menu"; paint(); return; } if (act === "askrename") { state.name = state.rows.find((item) => item.id === state.menu)?.name ?? ""; state.screen = "rename"; state.banner = null; paint(); return; }
  if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveCurrent(); if (act === "test") return beginTest(); if (act === "fix") { state.problems = []; paint(); }
}
async function boot(): Promise<void> {
  paint();
  try { if (navigator.storage?.getDirectory === undefined) throw new Error(OPFS); store = makerStore(await navigator.storage.getDirectory()); } catch { state.screen = "fatal"; state.banner = OPFS; paint(); return; }
  try {
    const listed = await fetch(new URL("../../templates/files.json", import.meta.url)); if (!listed.ok) throw new Error("Can't open: templates/files.json"); const body = await listed.json() as { files?: unknown }; if (!Array.isArray(body.files)) throw new Error("Can't open: templates/files.json");
    const demo: Record<string, string> = {}, empty: Record<string, string> = {}; for (const path of body.files) { if (typeof path !== "string") throw new Error("Can't open: templates/files.json"); const got = await fetch(new URL(`../../${path}`, import.meta.url)); if (!got.ok) throw new Error(`Can't open: ${path}`); const text = await got.text(); if (path.endsWith("/setup.talk.json")) { const parsed = parseProject({ "setups/setup.talk.json": text }); if (!parsed.ok) throw new Error(parsed.message); rememberTalk(parsed.files["setups/setup.talk.json"]); continue; } (path.includes("/demo.tileproj/") ? demo : empty)[path.replace(/^templates\/(?:demo|empty)\.tileproj\//, "")] = text; }
    templates = { demo, empty }; await refresh(); state.screen = "home"; paint(); await fromUrl();
  } catch (e) { state.screen = "home"; say(e instanceof Error ? e.message : "Can't open: templates"); }
}
document.addEventListener("click", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; if (node !== null) void run(node.getAttribute("data-act") ?? "").catch((e: unknown) => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.")); });
document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
void boot();
```

