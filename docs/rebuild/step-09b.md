# Rebuild record: step 9b, background upload editor

Original brief: [`docs/maker/steps/step-09b-art-upload.md`](../maker/steps/step-09b-art-upload.md) on the merge (r2, blob `263b66ff`, sha256 `1cd3ec431bdd4a4535a369fad7b957e52ff8dec19262cf8b9652e689d057a29c`, 120 lines; r1 + EA rulings Q1 and Q2). Delivery L13; Goal L20; Read first L32; Rules L40; Build L56; Named tests L74; Smoke L82; Must NOT L93; Done when L98; Measured L102; Carries L110; EA rulings L118. Count command L72; hard per-file caps L59–69; hard gate 400 at L70 (caps sum 391; trial 304). This is **9b**, the second half of roadmap row 9 (9a, data + rule, merged as `ab64d4fb`). The upload editor, four folded carries, and the Law 13 / `board.scene()` leftovers from 9a. The guide is unchanged from the product base through the merge; current main adds only the 9b r1 QA review. Code authority is DSK D29 (2) and (3), `handoff/dsk-rulings/2026-11-17-phase1.md` L77 (sha256 `90df966c864568074981d4efedf7233c394aae5c0bd6a03ade0a666e53fdb9d8`, 77 lines). Rulings from the CoS chat are labelled **EA ruling**.

Sources: PR #101 and branch `step/step-09b-art-upload-r1-chatA` (r1 tip `d0c537e5`, r1 code head `cd6c4e0c`); `handback/step-09b-art-upload/r1/HANDBACK.md` at `d0c537e5` and on the merge (HB, blob `a18c3350`, 96 lines, sha256 `e24523d03d500949642bf1e621907a570edccdfc40e0732d15fd8fae402e0cd7`); CoS verify report `/workspace/share/step-09b-r1-verify/report.md` (V, 45 lines, sha256 `778a96613964f4d60ff546c1039e17cd3de1d3c06bd588c566cfd3a2857f656b`, hash-object `6b4adf36a747388acb9fe7e66aeecccc0ce3948e`). `docs/qa/step-09b-r1-review.md` on main `21763070` (QA, blob `4884f918`, 48 lines, sha256 `4a24738b7acaf19b6ccb0712139a8ef26a52d6e27d2d396703ed33023cf36f75`): **OK TO MERGE**, no must-fix, no rework round. Line cites use HB, V and QA. Product line cites are at merge `a1d01698` (tree `15c69cc6`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `8572cd054cccb98761bd6e9a51d77933ed2bfcbd`, 2026-11-24 23:28 (UK time). Floor **1141** tests (guide L9: 8c's final count 1135 + N=6). After this merge the floor is **1141**. The guide was trialled on `0436fd50`; QA reran the trial on `2a6146ae`; the go-line named this later main (the 9b r2 and 9c r1 guides + QA review, docs-only on `2a6146ae`). The product count against `0436fd50` is not the official 9b number, because that range also includes those docs |
| r1 commits | on `step/step-09b-art-upload-r1-chatA`: `cd6c4e0c6b4a8abe189d94d0af0e6028dc17fb40` Step 9b: upload a background picture and refuse the rest (code head, tree `a17d3728d26df022458d78c3b02762c25e7d9563`, 2026-11-25 01:22 UK time), `d0c537e5264ced0ad4dcca1defc854ad35d4e69d` docs(handback): step 9b art upload r1 (tree `15c69cc62eb48e4bc897cc56da14b09ea8f8e667`, 2026-11-25 01:23 UK time). Linear, two commits, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Tip vs code is the r1 hand-back folder only: `HANDBACK.md` (96 lines). The s9b (and sibling) shots were produced and not committed; the tip folder holds `HANDBACK.md` only (HB, V, QA:7) |
| r1 verdict | Product green was 1141/0/0/0 and the official count was 354, with every cap kept (HB:25–29, V, QA:14–17). CoS verify of r1 was PASS (V). QA **OK TO MERGE**, no must-fix (QA:3). Predicted merge tree onto main `8572cd05` was `15c69cc6` (V, QA:3, QA:8; QA reproduced it). PR #101 "step 09b: art upload editor (r1, ChatA)" was opened from the branch after the hand-back (the HANDBACK PR line was already written as if it existed; QA:41, V, HB:3) |
| Merge | PR #101, merge commit `a1d0169878faa2a7df78e5672c3d6c1b918a9cd1`, 2026-11-25 02:02 (UK time). Tree `15c69cc62eb48e4bc897cc56da14b09ea8f8e667` (the same tree CoS and QA predicted against main `8572cd05`; V, QA:3, QA:8). First parent `8572cd054cccb98761bd6e9a51d77933ed2bfcbd` (the product base), second parent `d0c537e5`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Diff vs the r1 tip is empty. `npm test` on the merge was **1141 pass / 0 fail** |
| After the merge | main is `2176307096c22c0dd94980bfc38a32646e7b9897`, 2026-11-25 02:03 (UK time), tree `df5e2ee1cf2f1466884477f07516d215f69af06b`, which adds only `docs/qa/step-09b-r1-review.md` (48 insertions, sha256 `4a24738b`, hash-object `4884f918`). The 9c go-line is drafted on this main, floor **1142** (1141 + 1) |
| Tests | 1135 + N=6 (named tests 1–6 in `tests/editor/art-upload.test.ts`) = **1141 pass / 0 fail**. Floor after this merge is **1141** (HB:26, V, QA:14) |

## (b) Files

From `git diff --name-status 8572cd05..cd6c4e0c -- . ':!handback/**' ':!node_modules'`. Line counts are `git diff --numstat` insertions and deletions against the product base, at the r1 code head (the accepted 9b measure). The same product files are on the merge tree `15c69cc6`. The r1 review doc landed on main `21763070` after the merge and is **not** in the official 400. The new s9b smoke is counted in the 400 (guide L11, L69).

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `tools/play-stage/picture.ts` | A | 35 / 0 | 35 (L59) | yes. **35** (sha256 `36b81d3b328203b81bfe6468b672b7d36229d0f1eda74048246f86fe2bb417bb`) |
| `tools/play-stage/backdrop.ts` | M | 17 / 0 | 18 (L60) | yes. 17 |
| `tools/play-stage/page.ts` | M | 2 / 7 | 12 (L61) | yes. 9 |
| `tools/play-stage/board.ts` | M | 4 / 3 | 12 (L62) | yes. 7 |
| `tools/play-stage/hud.ts` | M | 5 / 4 | 12 (L63) | yes. 9 |
| `tools/maker/store.ts` | M | 7 / 6 | 24 (L64) | yes. 13 |
| `tools/maker/art.ts` | A | 70 / 0 | 70 (L65) | yes. **70** (sha256 `5ba20a0602af2cf53ba93bedb912b63876ddf6a3df36a0bde4ffe5c0c998194f`) |
| `tools/maker/home.ts` | M | 17 / 9 | 32 (L66) | yes. 26 |
| `tools/maker/stage.ts` | M | 2 / 1 | 6 (L67) | yes. 3 |
| `tests/editor/art-upload.test.ts` | A | 98 / 0 | 100 (L68) | yes. **98** (sha256 `bc30f46be563284c3bb644c8dcc073c64fd9d841c61f99fb7a86dbba15766bb5`) |
| `handoff/steps/tests/s9b-art-upload/smoke.mjs` | A | 67 / 0 | 70 (L69) | yes. **67** (sha256 `82bfe5ea64dc4c222630ca29eaaff58d7b4a9c8297146ef8eaaff63b9aa99169`) |

No diff under `src/**`, `data/`, `fixtures/`, `behaviour-library/`, `tools/painter-proto/`, `tools/ui-shell/`, `tools/maker/levels.ts` or `tools/play-stage/match.ts`. No existing test or smoke was edited (the only test/smoke paths in the diff are the two new files). s9 (`7f8c6b19…`), s8 (`0de37442…`, 44 lines), s8c (`5c6071b3…`), s6d (`e371ec7b…`) and S0 (`d528795e…`) are unedited. Official G7 at the r1 code head or r1 tip against `8572cd05`, and at the merge against first parent `8572cd05`, is **11 files changed, 324 insertions(+), 30 deletions(-)** = 354 ≤ 400. Every per-file cap is kept (tightest: `picture.ts` 35/35, `art.ts` 70/70, tests 98/100, smoke 67/70, `backdrop.ts` 17/18). Caps sum 391 (guide L70) is not a second gate. The trial on `0436fd50` was 11 files, 271+/33− = 304. Shipped 354 is above that trial (the test is 98 vs the trial 82; the smoke is 67 vs 57). No file is near 500. No new dependency. Lockfile blob `85b42f99` is unchanged vs the product base. No gh-pages.

## (c) Key code and git commands

Step 9b is the upload-editor half of roadmap row 9 (guide L3, L20–30, Rules 1–13, EA rulings Q1 and Q2). On a stage, **Background** opens a sheet. **Add picture** takes a PNG, JPG or WebP file, sniffed from the bytes (D29 3). A `.jpeg` name is stored as `jpg`. An animated PNG or WebP is accepted and drawn as frame 0. Anything else is refused with `uploadTypeUnsupported {fileName, sniffed}` before any write. A picture wider or taller than 4096 px is refused at upload with a plain line and no new code (Law 13; EA ruling Q1). The file, the index entry and the map layer go in one `commitWrites`. **Remove** takes the layer off and keeps the asset. The sheet lists this map's D29 asset rows and the background rows in words. **Duplicate** copies `assets/` too. **Adding or removing a layer clears the stage Undo** (EA ruling Q2). Folded in: the play-stage note row gets a close button; Continue re-reads the slot at the current rev; Test's loader closes each bitmap, the in-play missing path has its own test, and `board.scene()` keeps one `assets` object between frames. No auto-slice, Shrink to fit, depth slider or Repeat picker. No new rAF, timer or loop. Only D29's new code (`uploadTypeUnsupported`) and existing ones are used.

**Sniff and size (Rules 1–2, Q1).** `picture.ts:1-2` exports `MAX_SIDE = 4096` and `fits`. `readPicture` (`:30`) types a PNG, JPG or WebP from the bytes and returns `{ok, ext, w, h}`, or `{ok: false, sniffed}` (`gif`, `bmp`, `svg`, `heic`, `avif`, `unknown`, or `damaged <ext>`). `addPicture` (`art.ts:26-29`) calls `readPicture` and `fits` before the hash or any write. A refusal returns the exact line and writes nothing. A success writes `assets/<id>.<ext>` plus the plan's text writes in one `commitWrites` (`:40`). Over 4096 px a side is the plain line, no slicer (Q1).

**Sheet, Remove, Duplicate, Undo, Continue (Rules 3–8, 11, Q2).** `artLines` (`:55`) and `artSheet` (`:64`) show this map's D29 asset rows (hard when a played stage uses the asset) and the background rows in words, plus **Remove**. `dropLayer` (`:43`) takes the layer off and keeps the asset. `home.ts:55` `copy` lists `assets/`, reads each blob, and puts those bytes in the same `commitWrites` as the duplicated project. `saveStage()` runs before each background write; `dropUndo()` (`stage.ts:31`) runs after a successful add (`home.ts:169`) or remove (`:140`). Continue re-reads the slot at the current rev (Rule 11; QA:36).

**Store (Rule 5).** `MakerStore` gains `writeBytes` (`store.ts:2`). `memoryStore` (`:9`) keeps a `bins` map. `commitWrites` (`:20-23`) accepts text or bytes, writes tmp files, then renames; a failed write removes the tmps. `makerStore` is byte-safe on rename (QA:35). `makerStore.writeBytes` does not abort the writable if the write throws; `commitWrites` still removes the temp and names the failure (QA:42, a carry).

**Play-stage loader and note (Rules 10, 12).** `loadLayer` (`backdrop.ts:20-30`) keeps the 9a missing text for no `art` and for a null blob. The read, the sniff, the size check and the decode sit in one `try`. Over `MAX_SIDE` is named and `open()` is not called. Any throw, including `art()`, a bad header or `keep()`, is `Background picture <file> couldn't be opened`. `bmp.close()` runs in `finally`. Helper `930304a9` found `art()` awaited outside `try` and that was fixed in the code head before the hand-back; test 5 plants an `art()` throw (HB:80, V, QA:27, test L88). `page.ts:61` decodes every layer through `loadLayer` and adds 1 to `failed` per miss, in layer order (HB:88). `hud.ts:18,25,38`: `#noteX` closes the note and keeps it closed for the same text.

**Scene identity (Rule 13).** `board.scene()` (`board.ts:132-139`) keeps one `assets` object (`artBox`) while the units' sprite list is unchanged. `bare()` (`:122`) resets it. Test 6 closes this 9a carry (QA:28).

The six new named tests, all in `tests/editor/art-upload.test.ts`, one import per line, DOM-free (guide L74–80, V, QA:14):

```ts
test("upload type (D29 3): png, jpg and webp are typed from the bytes with their size, an animated png or webp keeps its type, and anything else is named", () => {
```

```ts
test("upload (D29 3): the file and its index entry go in one commit, a .jpeg name is stored as jpg, the map gets a layer, and the project still loads clean", async () => {
```

```ts
test("upload refusals write nothing: other types are uploadTypeUnsupported {fileName, sniffed}, and a picture over 4096 px a side is refused before any decode (Law 13)", async () => {
```

```ts
test("background sheet: lines show this map's D29 asset rows (hard when a played stage uses it), and Remove takes the layer off but keeps the asset", async () => {
```

```ts
test("play stage layer loader: missing, too big and undecodable files are each named and drawn as nothing, and a drawn layer's bitmap is closed", async () => {
```

```ts
test("scene identity: the scene keeps one assets object between frames, and a new one only after bare() changes the looks", () => {
```

They run at `:36`, `:42`, `:56`, `:65`, `:81` and `:94`.

s9b (`handoff/steps/tests/s9b-art-upload/smoke.mjs`, sha256 `82bfe5ea64dc4c222630ca29eaaff58d7b4a9c8297146ef8eaaff63b9aa99169`, 67 lines, port 8813) is `smoke.mjs . 8813 r1`: 14 ok lines and `SMOKE PASS` (HB:38–54, V, QA:18). Shots go to `handback/step-09b-art-upload/r1/` and must not be committed. s9 stays `7f8c6b199b69de7855f70f6a6b7fbe1a9bd237205341a79d9893bfe654c65b9d`, unedited, rerun as `smoke.mjs . 8811 r1`: 12 ok and `SMOKE PASS`. s8 stays `0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696`, unedited: 16 ok and `SMOKE PASS`. s8c stays `5c6071b34e442287abfc91fddafec46a01f91dfb60a12d627314fa24a06c2967`, unedited: 8 ok and `SMOKE PASS`. s6d stays `e371ec7b3bc89997ceab016c14d9fab0d26598d41c19e6dce9245efcfec2f05d`, unedited: 14 ok and `SMOKE PASS`. S0 stays `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, identical on the base, the code head, the tip and the merge (V, QA:19): 14 ok and `TOUCH SMOKE PASS`.

Export audit on the clean code head, counted on the play-stage tree, the baseline tree, and the maker build's `play-stage/` directory directly: **133 / 147 / 133**, empty hit list, no `window.__play` in the play-stage or baseline release, `AUDIT PASS` (V). `s8-audit.mjs` also reports `AUDIT PASS`; its loose maker-play count is 146 (the same known filter as 8a–9a; QA:20 cites 133 / 147 / 146). No audit script was committed. The +1 vs the 8c/9a direct counts (132 / 146 / 132) is `picture.ts`, which ships in the play-stage tree.

`npx tsc --noEmit -p tools/tsconfig.json` still exits 2 with the three errors already on the base, now at `tools/effect-designer/page.ts:101` and `tools/maker/home.ts:88` twice (the home.ts pair moved from L85). No new error (HB:83, V, QA:15). Leave them.

The official count command (guide L72, on a committed tree the `git add -N` is unnecessary):

```
# Product gate. The first parent of the merge is the product base
# 8572cd05. Official command at the r1 code head or r1 tip against
# 8572cd05, or at the merge against 8572cd05:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   11 files changed, 324 insertions(+), 30 deletions(-)
#
# The same 354 at the merge against 8572cd05. At 21763070 (current
# main, which also adds the r1 review) against 8572cd05, the official
# command without ':!docs/**' is 12 files, 372 insertions, 30
# deletions. Adding ':!docs/**' again gives 354.
#
# Trial on 0436fd50 was 11 files, 271 insertions, 33 deletions = 304.
#
# S0 handoff/steps/tests/s0-play-input/touch-smoke.mjs sha256
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941
#
# s8 handoff/steps/tests/s8-autosave-links/smoke.mjs sha256
#   0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696
#   (unedited; 44 lines; already on main)
#
# s8c handoff/steps/tests/s8c-baseline-walk/smoke.mjs sha256
#   5c6071b34e442287abfc91fddafec46a01f91dfb60a12d627314fa24a06c2967
#
# s9 handoff/steps/tests/s9-art-backgrounds/smoke.mjs sha256
#   7f8c6b199b69de7855f70f6a6b7fbe1a9bd237205341a79d9893bfe654c65b9d
#
# s6d handoff/steps/tests/s6d-baseline/smoke.mjs sha256
#   e371ec7b3bc89997ceab016c14d9fab0d26598d41c19e6dce9245efcfec2f05d
#
# s9b handoff/steps/tests/s9b-art-upload/smoke.mjs sha256
#   82bfe5ea64dc4c222630ca29eaaff58d7b4a9c8297146ef8eaaff63b9aa99169
#
# Named tests (npm test 1141/0, floor 1135 + N=6):
#   ✔ upload type (D29 3): png, jpg and webp are typed from the bytes with their size, an animated png or webp keeps its type, and anything else is named
#   ✔ upload (D29 3): the file and its index entry go in one commit, a .jpeg name is stored as jpg, the map gets a layer, and the project still loads clean
#   ✔ upload refusals write nothing: other types are uploadTypeUnsupported {fileName, sniffed}, and a picture over 4096 px a side is refused before any decode (Law 13)
#   ✔ background sheet: lines show this map's D29 asset rows (hard when a played stage uses it), and Remove takes the layer off but keeps the asset
#   ✔ play stage layer loader: missing, too big and undecodable files are each named and drawn as nothing, and a drawn layer's bitmap is closed
#   ✔ scene identity: the scene keeps one assets object between frames, and a new one only after bare() changes the looks
#
# Smokes under google-chrome, at 390 and 360 CSS px:
#   s9b (8813 r1):
#     7 ok lines @390 and @360, then SMOKE PASS
#   s9 (8811 r1):
#     6 ok lines @390 and @360, then SMOKE PASS
#   s8 (8810 r1):
#     8 ok lines @390 and @360, then SMOKE PASS
#   s8c (8812 r1):
#     4 ok lines @390 and @360, then SMOKE PASS
#   s6d (8808):
#     7 ok lines @390 and @360, then SMOKE PASS
#   S0 (8797):
#     ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
#
# Export audit as above; direct counts 133 / 147 / 133, empty hit list.
```

## (d) What went wrong, in order, and the fix

**r1.** The sniff, the upload, the sheet, the store, the folded carries and the play-stage loader shipped in one feat commit and green was 1141/0. The official gate was 354, with every per-file cap kept (`picture.ts` 35/35, `art.ts` 70/70, tests 98/100, smoke 67/70 and `backdrop.ts` 17/18 are the tight ones). s9b passed 14 ok, s9 12, s8 16, s8c 8, s6d 14 and S0 14. The export audit was clean on a direct count. The tip holds only `HANDBACK.md`. CoS verify of r1 was PASS (V). The predicted merge tree against then-main `8572cd05` was `15c69cc6`.

One helper finding was fixed in the code head before the hand-back, and is not a QA must-fix: `loadLayer` awaited `art()` outside `try`, so a throw rejected `Promise.all` and dropped every layer's note. The read, the sniff, the size check and the decode now sit in one `try`; `close()` stays in `finally`; test 5 plants an `art()` throw (HB:80, QA:27, V).

QA **OK TO MERGE**, no must-fix, no rework round (QA:3). Mutation checks closed `dropUndo` (s9b step 2), Duplicate's asset copy (step 6), Continue's fresh resume notes (step 7), the `art()` try (test 5) and `board.scene()` identity (test 6) (QA:23–28).

HB:3 said `PR: opened by Chief Of Staff from the branch.`, which was not yet true at hand-back or at CoS verify (V, QA:41). PR #101 was opened later, then merged.

## (e) Do it right first time

- The editor work is in `tools/maker/art.ts`, `home.ts`, `stage.ts` and `store.ts`. The shared sniff and the play-stage loader live in `tools/play-stage/` so Test can use them without importing `tools/maker`. Do not edit `src/**`, data, fixtures, behaviour-library, painter-proto, ui-shell, `levels.ts` or `match.ts`. Do not edit an existing test or smoke. Leave s9, s8, s8c, s6d and S0 unedited. The only new test is `tests/editor/art-upload.test.ts`; the only new smoke is s9b.
- Sniff, then size, then write. No decode, hash or write before the type and size checks. A refusal writes nothing. The file and its index entry (and the map layer) go in one `commitWrites`. Only D29's `uploadTypeUnsupported` and existing codes; if a new code looks necessary, stop and report to EA.
- A picture over 4096 px a side is refused at upload with the plain line and no slicer (Q1). In Test, a hand-placed file over that size is named and not decoded. `loadLayer` must await `art()` inside the same `try` as the sniff, the size check and the decode; `close()` belongs in `finally`.
- Adding or removing a layer clears the stage Undo (Q2). Duplicate copies `assets/` in the same commit. Continue re-reads the slot at the current rev. The note row has a close button. `board.scene()` keeps one `assets` object between frames.
- Do not add a second rAF, timer or loop. Do not add auto-slice, Shrink to fit, a depth slider or a Repeat picker. The builder never publishes gh-pages.
- Measure with the count command (guide L72): `git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'`. Count insertions plus deletions. **354** is the accepted number for this step (the trial was 304). The s9b smoke is inside that count (cap 70). On a merge whose first parent is the product base, measure against that parent (or at the code head against `8572cd05`), and do not treat later QA docs as 9b lines.
- Paste the ok lines and `SMOKE PASS` / `TOUCH SMOKE PASS` from one solo run in § Smoke. Label the code head and the tip. The PR line should match whether a PR exists at hand-back time. Do not commit smoke shots. Running s6d or s8 rewrites tracked handback pngs locally; restore them, do not commit them.
- Do not treat the open 9b carries, or the 9c link-marker work, as 9b fixes. 9c is the next go-line, based on the 9b merge, floor 1142.

## (f) Rebuild check

From a clean tree at `8572cd054cccb98761bd6e9a51d77933ed2bfcbd` (the product base and the merge's first parent), write the product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit. Then measure. Without the commit, `git diff` misses the uncommitted new files. There is no CN on this step.

```
# Product equality vs the merge (current main adds only the r1 QA review):
#   git diff a1d01698 HEAD -- tools/play-stage/picture.ts \
#     tools/play-stage/backdrop.ts tools/play-stage/page.ts \
#     tools/play-stage/board.ts tools/play-stage/hud.ts \
#     tools/maker/store.ts tools/maker/art.ts tools/maker/home.ts \
#     tools/maker/stage.ts tests/editor/art-upload.test.ts \
#     handoff/steps/tests/s9b-art-upload/smoke.mjs
#   (empty)

# Product gate. Official command at the r1 code head or r1 tip against
# 8572cd05, or at the merge against first parent 8572cd05:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   11 files changed, 324 insertions(+), 30 deletions(-)
#
# The same 354 at the merge against 8572cd05. At 21763070 (current
# main, which also adds the r1 review) against 8572cd05 without
# ':!docs/**': 12 files, 372 insertions, 30 deletions. Adding
# ':!docs/**' again gives 354.
#
# S0 handoff/steps/tests/s0-play-input/touch-smoke.mjs sha256
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941
#
# s8 handoff/steps/tests/s8-autosave-links/smoke.mjs sha256
#   0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696
#
# s8c handoff/steps/tests/s8c-baseline-walk/smoke.mjs sha256
#   5c6071b34e442287abfc91fddafec46a01f91dfb60a12d627314fa24a06c2967
#
# s9 handoff/steps/tests/s9-art-backgrounds/smoke.mjs sha256
#   7f8c6b199b69de7855f70f6a6b7fbe1a9bd237205341a79d9893bfe654c65b9d
#
# s6d handoff/steps/tests/s6d-baseline/smoke.mjs sha256
#   e371ec7b3bc89997ceab016c14d9fab0d26598d41c19e6dce9245efcfec2f05d
#
# s9b handoff/steps/tests/s9b-art-upload/smoke.mjs sha256
#   82bfe5ea64dc4c222630ca29eaaff58d7b4a9c8297146ef8eaaff63b9aa99169
#
# Named tests (npm test 1141/0, floor 1135 + N=6):
#   ✔ upload type (D29 3): png, jpg and webp are typed from the bytes with their size, an animated png or webp keeps its type, and anything else is named
#   ✔ upload (D29 3): the file and its index entry go in one commit, a .jpeg name is stored as jpg, the map gets a layer, and the project still loads clean
#   ✔ upload refusals write nothing: other types are uploadTypeUnsupported {fileName, sniffed}, and a picture over 4096 px a side is refused before any decode (Law 13)
#   ✔ background sheet: lines show this map's D29 asset rows (hard when a played stage uses it), and Remove takes the layer off but keeps the asset
#   ✔ play stage layer loader: missing, too big and undecodable files are each named and drawn as nothing, and a drawn layer's bitmap is closed
#   ✔ scene identity: the scene keeps one assets object between frames, and a new one only after bare() changes the looks
#
# Smokes under google-chrome, at 390 and 360 CSS px:
#   s9b (8813 r1):
#     7 ok lines @390 and @360, then SMOKE PASS
#   s9 (8811 r1):
#     6 ok lines @390 and @360, then SMOKE PASS
#   s8 (8810 r1):
#     8 ok lines @390 and @360, then SMOKE PASS
#   s8c (8812 r1):
#     4 ok lines @390 and @360, then SMOKE PASS
#   s6d (8808):
#     7 ok lines @390 and @360, then SMOKE PASS
#   S0 (8797):
#     ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
#
# Export audit as above; direct counts 133 / 147 / 133, empty hit list.
```

## QA non-blockers carried forward

- **The HANDBACK PR line** ("opened by Chief Of Staff from the branch") was written before PR #101 existed (QA:41, V, HB:3).
- Tight caps, for a rebuild to watch: `picture.ts` 35/35, `art.ts` 70/70, tests 98/100, smoke 67/70, `backdrop.ts` 17/18 (QA:17, QA:44). Shipped 354 is above the trial 304.
- HANDBACK L64 and L93 say `/workspace/share/s8/s8-audit.mjs` was not on the builder's sandbox disk. It is on the shared box. QA ran it: AUDIT PASS (QA:40).
- **`makerStore.writeBytes` doesn't abort the writable if the write throws.** `commitWrites` still removes the temp file and names the failure. A carry, not a fix now (QA:42).
- **The upload handler reads the whole file into memory (`arrayBuffer`) before the size check.** That is a read, not a decode, so the guide's "no decode, hash or write before the checks" holds. A carry for the phone memory budget if huge files ever matter (QA:43).
- Running s6d or s8 rewrites tracked handback pngs locally. Restore them after a local run; do not commit them.
- **Still open, not 9b scope** (guide L112–116, QA): `levels.ts` L64 unreachable narrowing; `match.ts:80` `landed('')`; K6 pages, K14 Shrink to fit, the exact-size check, Scroll speed and Repeat, Cover/Stretch, the 8192 toggle and `settings.maxImageSide`, the memory meter, export shipping assets (step 11). 9c (link markers) is the next step, floor 1142.
- **Closed here:** D29 (3) uploads; stage Undo vs background writes (Q2); Law 13 for backgrounds; Duplicate copies `assets/`; the 8b note-row close; 8a resume notes at `openId`'s rev; the 9a carries `bmp.close()`, the in-play missing test and `board.scene()` identity (guide L111, QA:23–28).

## Blob check

Each file must have exactly this git blob id at `a1d01698`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `tools/play-stage/picture.ts` | `50ede51cf71fb4d7b1e954eb8e853e3a3118188c` | 35 |
| `tools/play-stage/backdrop.ts` | `b1012e3f534b4726debf511877e839ce605f190d` | 31 |
| `tools/play-stage/page.ts` | `821cf37ed8d2891a0f41a50b4e061ccd9c9d3a3d` | 94 |
| `tools/play-stage/board.ts` | `0afc63d63f91ffc0daceb10fa187cdf5f9347da8` | 142 |
| `tools/play-stage/hud.ts` | `270df6390bb3012c2edc0ab104cad9f9850290b2` | 41 |
| `tools/maker/store.ts` | `d98e18fabca89646707bd5793d2f92dd64bde0a9` | 35 |
| `tools/maker/art.ts` | `fdca94f6b7601b15990fc27885987a8013839d98` | 70 |
| `tools/maker/home.ts` | `2c06a4cdb9f757239f22349640398587d7a2608a` | 172 |
| `tools/maker/stage.ts` | `e4347d339e707d73ce4c71c39a00268f81521b7b` | 272 |
| `tests/editor/art-upload.test.ts` | `848486f8ac25dc321e364ba9b7bc3043def1e71b` | 98 |
| `handoff/steps/tests/s9b-art-upload/smoke.mjs` | `c149d3c8c3045b6a121a3832db3fd1cf367917e9` | 67 |

## Appendix: full code as merged (step 9b, PR #101)

New files are `git show a1d01698:<path>` in full. Edited files are `git diff 8572cd05 a1d01698 -- <path>`.

### `tools/play-stage/picture.ts` (new)

```
export const MAX_SIDE = 4096;
export const fits = (w: number, h: number): boolean => w >= 1 && h >= 1 && w <= MAX_SIDE && h <= MAX_SIDE;
export type Picture = { readonly ok: true; readonly ext: "png" | "jpg" | "webp"; readonly w: number; readonly h: number } | { readonly ok: false; readonly sniffed: string };
const u16 = (b: Uint8Array, i: number): number => ((b[i] ?? 0) << 8) | (b[i + 1] ?? 0), u32 = (b: Uint8Array, i: number): number => ((u16(b, i) << 16) | u16(b, i + 2)) >>> 0, le = (b: Uint8Array, i: number): number => (b[i] ?? 0) | ((b[i + 1] ?? 0) << 8), text = (b: Uint8Array, i: number, n: number): string => String.fromCharCode(...b.subarray(i, i + n));
function jpg(b: Uint8Array): Picture {
  let i = 2;
  while (i + 1 < b.length) {
    if (b[i] !== 0xff) return { ok: false, sniffed: "damaged jpg" };
    while (i < b.length && b[i] === 0xff) i += 1;
    const m = b[i] ?? 0; i += 1; if (m === 0x01 || m === 0xd8 || m === 0xd9 || (m >= 0xd0 && m <= 0xd7)) continue;
    const len = i + 1 < b.length ? u16(b, i) : 0; if (len < 2 || i + len > b.length) return { ok: false, sniffed: "damaged jpg" };
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return len < 7 ? { ok: false, sniffed: "damaged jpg" } : { ok: true, ext: "jpg", h: u16(b, i + 3), w: u16(b, i + 5) };
    i += len;
  }
  return { ok: false, sniffed: "damaged jpg" };
}
function webp(b: Uint8Array): Picture {
  if (b.length < 30) return { ok: false, sniffed: "damaged webp" };
  const chunk = text(b, 12, 4), p = 20, b1 = b[p + 1] ?? 0, b2 = b[p + 2] ?? 0, b3 = b[p + 3] ?? 0, b4 = b[p + 4] ?? 0;
  if (chunk === "VP8 ") return { ok: true, ext: "webp", w: le(b, p + 6) & 0x3fff, h: le(b, p + 8) & 0x3fff };
  if (chunk === "VP8L") return b[p] === 0x2f ? { ok: true, ext: "webp", w: 1 + b1 + ((b2 & 0x3f) << 8), h: 1 + (b2 >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10) } : { ok: false, sniffed: "damaged webp" };
  if (chunk === "VP8X") return { ok: true, ext: "webp", w: 1 + (b[p + 4] ?? 0) + ((b[p + 5] ?? 0) << 8) + ((b[p + 6] ?? 0) << 16), h: 1 + (b[p + 7] ?? 0) + ((b[p + 8] ?? 0) << 8) + ((b[p + 9] ?? 0) << 16) };
  return { ok: false, sniffed: "damaged webp" };
}
function other(b: Uint8Array): string {
  const head = text(b, 0, Math.min(b.length, 256)), brand = b.length >= 12 && text(b, 4, 4) === "ftyp" ? text(b, 8, 4) : "";
  if (head.startsWith("GIF")) return "gif"; if (head.startsWith("BM")) return "bmp"; if (head.includes("<svg")) return "svg";
  if (brand.startsWith("hei") || brand === "mif1" || brand === "msf1") return "heic"; if (brand === "avif" || brand === "avis") return "avif"; return "unknown";
}
export function readPicture(bytes: Uint8Array): Picture {
  if (bytes.length >= 8 && u32(bytes, 0) === 0x89504e47 && u32(bytes, 4) === 0x0d0a1a0a) return bytes.length < 24 || text(bytes, 12, 4) !== "IHDR" ? { ok: false, sniffed: "damaged png" } : { ok: true, ext: "png", w: u32(bytes, 16), h: u32(bytes, 20) };
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return jpg(bytes);
  if (bytes.length >= 12 && text(bytes, 0, 4) === "RIFF" && text(bytes, 8, 4) === "WEBP") return webp(bytes);
  return { ok: false, sniffed: other(bytes) };
}
```

### `tools/play-stage/backdrop.ts` (edited)

```diff
diff --git a/tools/play-stage/backdrop.ts b/tools/play-stage/backdrop.ts
index 5c4f323..b1012e3 100644
--- a/tools/play-stage/backdrop.ts
+++ b/tools/play-stage/backdrop.ts
@@ -1,3 +1,4 @@
+import { fits, readPicture } from "./picture.ts";
 export type BackLayer = { readonly assetId: string; readonly file: string; readonly depth: number; readonly repeat: "none" | "x" | "y" | "both" };
 const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
 /** Look data only. `fit` is ignored (cover/stretch read as none). No ext skips the layer. Depth clamps to 0..1; absent or not finite is 1. */
@@ -12,3 +13,19 @@ export function backdropOf(project: unknown, map: unknown): BackLayer[] {
   }
   return out;
 }
+export type Bitmap = { readonly width: number; readonly height: number; close(): void };
+export type Loaded = { readonly miss: string | null; readonly row: { readonly sheet: { readonly id: string; readonly columns: number; readonly fw: number; readonly fh: number }; readonly depth: number; readonly repeat: BackLayer["repeat"] } | null };
+const missed = (file: string): Loaded => ({ miss: `Background picture missing: ${file}`, row: null });
+const bad = (file: string): Loaded => ({ miss: `Background picture ${file} couldn't be opened`, row: null });
+export async function loadLayer(layer: BackLayer, art: ((file: string) => Promise<Blob | null>) | undefined, open: (blob: Blob) => Promise<Bitmap>, keep: (bmp: Bitmap) => void): Promise<Loaded> {
+  const file = layer.file;
+  if (art === undefined) return missed(file);
+  let bmp: Bitmap | null = null;
+  try {
+    const blob = await art(file); if (blob === null) return missed(file);
+    const pic = readPicture(new Uint8Array(await blob.arrayBuffer())); if (!pic.ok) return bad(file);
+    if (!fits(pic.w, pic.h)) return { miss: `Background picture ${file} is too big to open (${pic.w} × ${pic.h} px)`, row: null };
+    bmp = await open(blob); const fw = bmp.width, fh = bmp.height; keep(bmp);
+    return { miss: null, row: { sheet: { id: layer.assetId, columns: 1, fw, fh }, depth: layer.depth, repeat: layer.repeat } };
+  } catch { return bad(file); } finally { bmp?.close(); }
+}
```

### `tools/play-stage/page.ts` (edited)

```diff
diff --git a/tools/play-stage/page.ts b/tools/play-stage/page.ts
index 8d63934..821cf37 100644
--- a/tools/play-stage/page.ts
+++ b/tools/play-stage/page.ts
@@ -4,6 +4,7 @@ import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
 import { inOrthogonalReach } from "../../src/rules/battle/range.ts";
 import type { LinkEvent } from "../../src/rules/session/links.ts";
 import type { SessionParty } from "../../src/types/core-types.ts";
+import { loadLayer } from "./backdrop.ts";
 import { boardBox, fit, TILE } from "./board.ts";
 import { centreOn, clamp, createCam, seatCam, tickCam, type PlayCam } from "./camera-touch.ts";
 import { createHud, XP_H } from "./hud.ts";
@@ -57,13 +58,7 @@ const driver = createDriver({
     return { scene, lights: litPlan(lighting, match.looks, link.lit), shake: link.shake, x: cam.x, y: cam.y, s: cam.s };
   },
 });
-void Promise.all((docs.backdrop ?? []).map(async (layer) => {
-  try {
-    const blob = docs.art === undefined ? null : await docs.art(layer.file);
-    if (blob === null) { misses.push(`Background picture missing: ${layer.file}`); driver.stats.failed += 1; return null; }
-    const bmp = await createImageBitmap(blob), canvas = new OffscreenCanvas(bmp.width, bmp.height), g = canvas.getContext("2d"); if (g === null) throw new Error(layer.file); g.imageSmoothingEnabled = false; g.drawImage(bmp, 0, 0); sheets.set(layer.assetId, canvas); return { sheet: { id: layer.assetId, columns: 1, fw: bmp.width, fh: bmp.height }, depth: layer.depth, repeat: layer.repeat };
-  } catch { misses.push(`Background picture ${layer.file} couldn't be opened`); driver.stats.failed += 1; return null; }
-})).then((rows) => { const list = rows.flatMap((row) => row === null ? [] : [row]); painted = list; held = null; if (list.length > 0) match.bare(); });
+void Promise.all((docs.backdrop ?? []).map((layer) => loadLayer(layer, docs.art, (blob) => createImageBitmap(blob), (bmp) => { const canvas = new OffscreenCanvas(bmp.width, bmp.height), g = canvas.getContext("2d"); if (g === null) throw new Error(layer.file); g.imageSmoothingEnabled = false; g.drawImage(bmp, 0, 0); sheets.set(layer.assetId, canvas); }))).then((rows) => { for (const row of rows) if (row.miss !== null) { misses.push(row.miss); driver.stats.failed += 1; } const list = rows.flatMap((row) => row.row === null ? [] : [row.row]); painted = list; held = null; if (list.length > 0) match.bare(); });
 const touch = createTouch({ match, cam, box: () => { const ratio = dpr(), rect = canvas.getBoundingClientRect(), raw = canvas.width === 300 && canvas.height === 150, devW = !raw && canvas.width > 0 ? canvas.width : canvas.clientWidth * ratio, devH = !raw && canvas.height > 0 ? canvas.height : canvas.clientHeight * ratio; return { devW, devH, kx: rect.width > 0 && !raw && canvas.width > 0 ? canvas.width / rect.width : ratio, ky: rect.height > 0 && !raw && canvas.height > 0 ? canvas.height / rect.height : ratio, cols: match.world.grid.cols, rows: match.world.grid.rows }; } });
 for (const k of ["pointerdown", "pointermove", "pointerup", "pointercancel", "lostpointercapture"] as const) canvas.addEventListener(k, (e) => { const p = { id: e.pointerId, offsetX: e.offsetX, offsetY: e.offsetY, clientX: e.clientX, clientY: e.clientY, timeStamp: e.timeStamp, pointerType: e.pointerType }; if (k === "pointerdown") { canvas.setPointerCapture(e.pointerId); touch.down(p); } else if (k === "pointermove") touch.move(p); else if (k === "pointerup") touch.up(p); else touch.cancel(p); });
 const place = (): void => { const box = boardBox(innerHeight - (match.view().xp === null ? 0 : XP_H)); Object.assign(canvas.style, { position: "fixed", left: "0", right: "0", width: "100%", top: `${box.top}px`, height: `${box.height}px`, touchAction: "none" }); };
```

### `tools/play-stage/board.ts` (edited)

```diff
diff --git a/tools/play-stage/board.ts b/tools/play-stage/board.ts
index 5a58f29..0afc63d 100644
--- a/tools/play-stage/board.ts
+++ b/tools/play-stage/board.ts
@@ -76,7 +76,7 @@ export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
   const bot = botAbilityPriority({ setup: body.rules, stepReach: step.reach, actionsPerTurn: budget.actionsPerTurn });
   const gestures = createGestureMapper({ cellPx: TILE, tapMaxPx: 12, holdMs: 500 }, { cols: world.grid.cols, rows: world.grid.rows, unitAt: (at) => world.units.occupantAt(at) });
   const fx = createPlayFx(body.effects), paint = new Map<string, { readonly sprite: string; readonly asset: SceneAsset }>(), seen = new Map<string, string>();
-  let looks = dress(world.grid, body.looks);
+  let looks = dress(world.grid, body.looks), artBox: Record<string, SceneAsset> | null = null, artKey = "";
   for (const u of world.units.all()) { const recipeId = recipeIn(body.recipes, u.unitId).id, tone = paintOf(u.side, sides.me), prior = seen.get(recipeId); if (prior === undefined) seen.set(recipeId, tone); paint.set(u.id, { sprite: prior === undefined || prior === tone ? recipeId : `${recipeId}@${tone}`, asset: unitAsset(`${recipeId}@${tone}`) }); }
   let selected: string | null = null, pending: Sq | null = null, reach: Sq[] = [], preview: Sq[] = [], walk: Walk | null = null, aims: Sq[] = [], aimKind: "basic" | "spell" = "basic", followId: string | null = null, onLand: (() => void) | null = null;
   let route: (intent: DoorIntent) => unknown = (intent) => intend(intent);
@@ -119,7 +119,7 @@ export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
   };
   return {
     world, step, intend, sync, bot, pixels: pixelsOf, autoWait, go, fx, looks, sides,
-    bare(): void { looks = dress(world.grid, body.looks, true); },
+    bare(): void { looks = dress(world.grid, body.looks, true); artBox = null; },
     focus(id: string | null): void { selected = id; pending = null; preview = []; mark(); },
     arm(next: Walk): void { walk = next; sync(); },
     landed(fn: (() => void) | null): void { onLand = fn; },
@@ -133,7 +133,8 @@ export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
       sync();
       const aimSheet = aimKind === "spell" ? AIM_S : AIM_A, aimOver = world.phases.battle === "targeting" ? aims.map((c) => ({ band: "fxGround" as const, sheet: aimSheet, x: c.c * TILE, y: c.r * TILE })) : [];
       const overlays = selected === null ? aimOver : [...reach.map((c) => ({ band: "fxGround" as const, sheet: REACH, x: c.c * TILE, y: c.r * TILE })), ...preview.map((c) => ({ band: "fxGround" as const, sheet: PATH, x: c.c * TILE, y: c.r * TILE })), ...aimOver];
-      const assets: Record<string, SceneAsset> = { ...looks.assets, "play:fx": { sheet: { id: "play:fx", columns: 4, fw: TILE, fh: TILE } } };
+      const key = world.units.all().map((u) => paint.get(u.id)?.sprite ?? "").join("\0"); if (artBox === null || artKey !== key) { artKey = key; artBox = { ...looks.assets, "play:fx": { sheet: { id: "play:fx", columns: 4, fw: TILE, fh: TILE } } }; }
+      const assets = artBox;
       const units = world.units.all().map((u) => { const row = paint.get(u.id); if (row === undefined) throw new Error("play: paint"); assets[row.sprite] = row.asset; return { id: u.id, sprite: row.sprite, at: { c: u.at.c, r: u.at.r }, offset: u.offset, facing: u.facing, alive: u.alive }; });
       return { cols: world.grid.cols, rows: world.grid.rows, tileW: TILE, tileH: TILE, mapSeed: world.seed, assets, layers: looks.layers, units, objects: looks.objects, overlays, effects: fx.ingest(world.log, world.clock.stepMs, world.clock.now()), style: looks.style, waterTiles: looks.waterTiles, seeThroughCanopy: true as const };
     },
```

### `tools/play-stage/hud.ts` (edited)

```diff
diff --git a/tools/play-stage/hud.ts b/tools/play-stage/hud.ts
index c2af22b..270df63 100644
--- a/tools/play-stage/hud.ts
+++ b/tools/play-stage/hud.ts
@@ -8,20 +8,21 @@ export type HudView = {
 };
 type Btn = { readonly show: boolean; readonly on: boolean };
 type Act = { choose(kind: "basic" | "spell" | "talk"): void; wait(): void; endTurn(): void; restart(): void; menu(): void; recentre(): void; closeTalk(): void };
-const css = `html,body{margin:0}#hud{position:fixed;inset:0;pointer-events:none;font:16px sans-serif;color:#f4efe2}#hud button{pointer-events:auto;min-width:48px;min-height:48px;border:0;border-radius:8px;background:#1c2838;color:#f4efe2}#top{position:absolute;left:0;right:0;top:0;height:${HUD_TOP}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#menu{width:48px;height:48px;margin-left:auto}#recentre{width:48px;height:48px;flex:none}#banner{position:absolute;left:0;right:64px;top:0;height:${HUD_TOP}px;box-sizing:border-box;background:#14213d;color:#e8c872;border-top:2px solid #e8c872;border-bottom:2px solid #e8c872}#plate{position:absolute;left:0;right:0;bottom:${ROW_FOOT}px;height:${PLATE_H}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#xp{position:absolute;left:0;right:0;bottom:${ROW_FOOT + PLATE_H}px;height:${XP_H}px;display:none;align-items:center;padding:0 8px;background:#101826;color:#f4efe2;pointer-events:none;z-index:2}#face{width:32px;height:32px;background:#2f6fad}#hp{width:120px;height:10px;background:#243044}#hp i{display:block;height:10px;background:#3dd68c}#row{position:absolute;left:0;right:0;bottom:24px;height:64px;display:flex;align-items:center;gap:8px;padding:0 8px}#end{margin-left:auto;margin-right:12px;outline:2px solid #2f6fad}#sheet{position:absolute;left:8px;right:8px;bottom:${ROW_FOOT + PLATE_H}px;max-height:35%;box-sizing:border-box;display:none;overflow:auto;background:#f4efe2;color:#1c140c;padding:8px;border-radius:8px;pointer-events:auto;font-size:16px}#sheet b{display:block}#sheet button{width:48px;height:48px}#veil{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(8,10,16,.72);pointer-events:auto}#card{background:#101826;padding:16px;border:2px solid #e8c872;text-align:center}#card button{margin:8px}#hud #banner{pointer-events:none}#note{position:absolute;left:8px;right:8px;top:${HUD_TOP}px;display:none;padding:4px 8px;background:#14213d;color:#e8c872;pointer-events:none}`;
+const css = `html,body{margin:0}#hud{position:fixed;inset:0;pointer-events:none;font:16px sans-serif;color:#f4efe2}#hud button{pointer-events:auto;min-width:48px;min-height:48px;border:0;border-radius:8px;background:#1c2838;color:#f4efe2}#top{position:absolute;left:0;right:0;top:0;height:${HUD_TOP}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#menu{width:48px;height:48px;margin-left:auto}#recentre{width:48px;height:48px;flex:none}#banner{position:absolute;left:0;right:64px;top:0;height:${HUD_TOP}px;box-sizing:border-box;background:#14213d;color:#e8c872;border-top:2px solid #e8c872;border-bottom:2px solid #e8c872}#plate{position:absolute;left:0;right:0;bottom:${ROW_FOOT}px;height:${PLATE_H}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#xp{position:absolute;left:0;right:0;bottom:${ROW_FOOT + PLATE_H}px;height:${XP_H}px;display:none;align-items:center;padding:0 8px;background:#101826;color:#f4efe2;pointer-events:none;z-index:2}#face{width:32px;height:32px;background:#2f6fad}#hp{width:120px;height:10px;background:#243044}#hp i{display:block;height:10px;background:#3dd68c}#row{position:absolute;left:0;right:0;bottom:24px;height:64px;display:flex;align-items:center;gap:8px;padding:0 8px}#end{margin-left:auto;margin-right:12px;outline:2px solid #2f6fad}#sheet{position:absolute;left:8px;right:8px;bottom:${ROW_FOOT + PLATE_H}px;max-height:35%;box-sizing:border-box;display:none;overflow:auto;background:#f4efe2;color:#1c140c;padding:8px;border-radius:8px;pointer-events:auto;font-size:16px}#sheet b{display:block}#sheet button{width:48px;height:48px}#veil{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(8,10,16,.72);pointer-events:auto}#card{background:#101826;padding:16px;border:2px solid #e8c872;text-align:center}#card button{margin:8px}#hud #banner{pointer-events:none}#note{position:absolute;left:8px;right:8px;top:${HUD_TOP}px;display:none;padding:4px 8px;background:#14213d;color:#e8c872;pointer-events:none}#noteX{min-width:44px;min-height:44px;pointer-events:auto}#noteX::before{content:"×"}`;
 export function createHud(act: Act): { hideBanner(): void; render(view: HudView): void } {
-  const root = document.createElement("div"); root.id = "hud"; root.innerHTML = `<style>${css}</style><div id="top"><span id="pill"></span><button id="recentre" type="button">Recentre</button><button id="menu" type="button">Menu</button></div><div id="note" role="status"></div><button id="banner" type="button">YOUR TURN</button><div id="plate"><i id="face"></i><span id="who"></span><span id="hp"><i></i></span><span id="hpText"></span></div><div id="xp" aria-live="polite"></div><div id="row"><button id="attack" type="button">Attack</button><button id="spell" type="button">Spell</button><button id="talk" type="button">Talk</button><button id="wait" type="button">Wait</button><button id="end" type="button">End turn</button></div><div id="sheet"><b></b><span></span><button id="close" type="button">Close</button></div><div id="veil"><div id="card"><h2></h2><p></p><p id="turns"></p><button id="restart" type="button">Restart</button><button id="back" type="button">Back</button></div></div>`;
+  const root = document.createElement("div"); root.id = "hud"; root.innerHTML = `<style>${css}</style><div id="top"><span id="pill"></span><button id="recentre" type="button">Recentre</button><button id="menu" type="button">Menu</button></div><div id="note" role="status"><span id="noteText"></span><button id="noteX" type="button" aria-label="Close note"></button></div><button id="banner" type="button">YOUR TURN</button><div id="plate"><i id="face"></i><span id="who"></span><span id="hp"><i></i></span><span id="hpText"></span></div><div id="xp" aria-live="polite"></div><div id="row"><button id="attack" type="button">Attack</button><button id="spell" type="button">Spell</button><button id="talk" type="button">Talk</button><button id="wait" type="button">Wait</button><button id="end" type="button">End turn</button></div><div id="sheet"><b></b><span></span><button id="close" type="button">Close</button></div><div id="veil"><div id="card"><h2></h2><p></p><p id="turns"></p><button id="restart" type="button">Restart</button><button id="back" type="button">Back</button></div></div>`;
   document.body.append(root);
   const q = (id: string): HTMLElement => { const n = root.querySelector(`#${id}`); if (!(n instanceof HTMLElement)) throw new Error(id); return n; };
   const banner = q("banner"), veil = q("veil"), sheet = q("sheet");
   const buttons: Record<"basic" | "spell" | "talk" | "wait" | "end", HTMLElement> = { basic: q("attack"), spell: q("spell"), talk: q("talk"), wait: q("wait"), end: q("end") };
-  let held = true;
+  let held = true, shut = "";
   const hideBanner = (): void => { held = false; banner.style.display = "none"; };
   banner.addEventListener("click", hideBanner); q("menu").addEventListener("click", () => act.menu());
   q("attack").addEventListener("click", () => act.choose("basic")); q("spell").addEventListener("click", () => act.choose("spell"));
   q("talk").addEventListener("click", () => act.choose("talk")); q("wait").addEventListener("click", () => act.wait()); q("end").addEventListener("click", () => act.endTurn());
   q("recentre").addEventListener("click", () => act.recentre()); q("close").addEventListener("click", () => act.closeTalk());
   q("restart").addEventListener("click", () => act.restart()); q("back").addEventListener("click", () => act.restart());
+  q("noteX").addEventListener("click", () => { shut = q("noteText").textContent ?? ""; q("note").style.display = "none"; });
   window.setTimeout(hideBanner, 1260);
   const render = (view: HudView): void => {
     q("pill").textContent = view.turn; banner.textContent = view.turn; banner.style.background = view.mine ? "#14213d" : "#6b1d2a";
@@ -34,7 +35,7 @@ export function createHud(act: Act): { hideBanner(): void; render(view: HudView)
     const xp = q("xp"), row = view.xp; xp.style.display = row === null ? "none" : "flex"; xp.textContent = row === null ? "" : row.top ? `Level ${row.level} · Top level` : `Level ${row.level} · ${row.now}/${row.need} XP`;
     const title = q("card").querySelector("h2"), blurb = q("card").querySelector("p");
     if (over && title !== null && blurb !== null) { title.textContent = view.outcome === "win" ? "Victory" : view.outcome === "lose" ? "Defeat" : "Draw"; blurb.textContent = view.outcome === "lose" ? "Your units fell" : "All enemies defeated"; q("turns").textContent = `${view.turns} turns`; }
-    if (!held) banner.style.display = "none"; const note = q("note"); note.textContent = view.note ?? ""; note.style.display = view.note === null ? "none" : "block";
+    if (!held) banner.style.display = "none"; const note = q("note"), body = view.note ?? ""; q("noteText").textContent = body; note.style.display = body !== "" && body !== shut ? "block" : "none";
   };
   return { hideBanner, render };
 }
```

### `tools/maker/store.ts` (edited)

```diff
diff --git a/tools/maker/store.ts b/tools/maker/store.ts
index e71f8e1..d98e18f 100644
--- a/tools/maker/store.ts
+++ b/tools/maker/store.ts
@@ -1,25 +1,26 @@
 import { opfsStore, type Dir } from "../effect-designer/store.ts";
-export type MakerStore = { read(path: string): Promise<string | null>; readBlob(path: string): Promise<Blob | null>; write(path: string, text: string): Promise<void>; remove(path: string): Promise<void>; list(dir: string): Promise<string[]>; rename(from: string, to: string): Promise<void> };
+export type MakerStore = { read(path: string): Promise<string | null>; readBlob(path: string): Promise<Blob | null>; write(path: string, text: string): Promise<void>; writeBytes(path: string, bytes: Uint8Array): Promise<void>; remove(path: string): Promise<void>; list(dir: string): Promise<string[]>; rename(from: string, to: string): Promise<void> };
 export type WriteResult = { readonly ok: true } | { readonly ok: false; readonly error: "writeFailed"; readonly path: string; readonly message: string; readonly rows: readonly { readonly code: "writeFailed"; readonly severity: "hard"; readonly path: string; readonly detail: string }[] };
+export type Write = { readonly path: string; readonly text: string } | { readonly path: string; readonly bytes: Uint8Array };
 type Handle = { move?: (dir: Dir, name: string) => Promise<void> };
 const failed = (path: string): WriteResult => { const message = `Couldn't save ${path}. Your phone may be full. Your last save is safe.`; return { ok: false, error: "writeFailed", path, message, rows: [{ code: "writeFailed", severity: "hard", path, detail: message }] }; };
 export function memoryStore(): MakerStore & { readonly files: Map<string, string>; failOn(path: string): void } {
-  const files = new Map<string, string>(); let fail = "";
-  return { files, failOn(path) { fail = path; }, async read(path) { return files.has(path) ? files.get(path) ?? "" : null; }, async readBlob(path) { const text = files.get(path); return text === undefined ? null : new Blob([text]); }, async write(path, text) { if (fail !== "" && path === fail) throw new Error("full"); files.set(path, text); }, async remove(path) { files.delete(path); }, async rename(from, to) { if (fail !== "" && to === fail) throw new Error("full"); const text = files.get(from); if (text === undefined) throw new Error(`missing ${from}`); files.set(to, text); files.delete(from); }, async list(dir) { const pre = dir.endsWith("/") ? dir : `${dir}/`, names = new Set<string>(); for (const key of files.keys()) if (key.startsWith(pre)) { const rest = key.slice(pre.length), cut = rest.indexOf("/"); if (rest !== "") names.add(cut === -1 ? rest : rest.slice(0, cut)); } return [...names].sort(); } };
+  const files = new Map<string, string>(), bins = new Map<string, Uint8Array>(); let fail = "";
+  return { files, failOn(path) { fail = path; }, async read(path) { return files.has(path) ? files.get(path) ?? "" : null; }, async readBlob(path) { const bin = bins.get(path); if (bin !== undefined) return new Blob([new Uint8Array(bin)]); const text = files.get(path); return text === undefined ? null : new Blob([text]); }, async write(path, text) { if (fail !== "" && path === fail) throw new Error("full"); bins.delete(path); files.set(path, text); }, async writeBytes(path, bytes) { if (fail !== "" && path === fail) throw new Error("full"); files.delete(path); bins.set(path, bytes); }, async remove(path) { files.delete(path); bins.delete(path); }, async rename(from, to) { if (fail !== "" && to === fail) throw new Error("full"); if (bins.has(from)) { const bin = bins.get(from); if (bin === undefined) throw new Error(`missing ${from}`); files.delete(to); bins.set(to, bin); bins.delete(from); return; } const text = files.get(from); if (text === undefined) throw new Error(`missing ${from}`); bins.delete(to); files.set(to, text); files.delete(from); }, async list(dir) { const pre = dir.endsWith("/") ? dir : `${dir}/`, names = new Set<string>(); for (const key of [...files.keys(), ...bins.keys()]) if (key.startsWith(pre)) { const rest = key.slice(pre.length), cut = rest.indexOf("/"); if (rest !== "") names.add(cut === -1 ? rest : rest.slice(0, cut)); } return [...names].sort(); } };
 }
 export function makerStore(root: Dir): MakerStore {
   const base = opfsStore(root);
-  return { read: (path) => base.read(path), async readBlob(path) { try { const parts = path.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, {}); const got = await (await dir.getFileHandle(leaf)).getFile(); return got instanceof Blob ? got : null; } catch (e) { if (e instanceof Error && (e.name === "NotFoundError" || e.name === "TypeMismatchError")) return null; throw e; } }, write: (path, text) => base.write(path, text), remove: (path) => base.remove(path), list: (dir) => base.list(dir), async rename(from, to) { const parts = from.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, {}); const handle = await dir.getFileHandle(leaf) as Handle, destParts = to.split("/"), destLeaf = destParts.pop() ?? ""; let dest = root; for (const part of destParts) dest = await dest.getDirectoryHandle(part, { create: true }); if (handle.move !== undefined) { await handle.move(dest, destLeaf); return; } const text = await base.read(from); if (text === null) throw new Error(`missing ${from}`); await base.write(to, text); await base.remove(from); } };
+  return { read: (path) => base.read(path), async readBlob(path) { try { const parts = path.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, {}); const got = await (await dir.getFileHandle(leaf)).getFile(); return got instanceof Blob ? got : null; } catch (e) { if (e instanceof Error && (e.name === "NotFoundError" || e.name === "TypeMismatchError")) return null; throw e; } }, write: (path, text) => base.write(path, text), async writeBytes(path, bytes) { const parts = path.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true }); const w = await (await dir.getFileHandle(leaf, { create: true })).createWritable(); await (w.write as unknown as (data: Uint8Array) => Promise<void>)(bytes); await w.close(); }, remove: (path) => base.remove(path), list: (dir) => base.list(dir), async rename(from, to) { const parts = from.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, {}); const handle = await dir.getFileHandle(leaf) as Handle, destParts = to.split("/"), destLeaf = destParts.pop() ?? ""; let dest = root; for (const part of destParts) dest = await dest.getDirectoryHandle(part, { create: true }); if (handle.move !== undefined) { await handle.move(dest, destLeaf); return; } const file = await (await dir.getFileHandle(leaf)).getFile() as unknown as Blob; if (!(file instanceof Blob)) throw new Error(`missing ${from}`); const w = await (await dest.getFileHandle(destLeaf, { create: true })).createWritable(); await (w.write as unknown as (data: Uint8Array) => Promise<void>)(new Uint8Array(await file.arrayBuffer())); await w.close(); await base.remove(from); } };
 }
 export async function readTree(store: MakerStore, folder: string): Promise<Record<string, string>> {
   const out: Record<string, string> = {}, pre = folder.endsWith("/") ? folder : `${folder}/`;
   const walk = async (dir: string, rel: string): Promise<void> => { for (const name of await store.list(dir)) { if (rel === "" && name === "assets") continue; const child = `${dir}${name}`, next = rel === "" ? name : `${rel}/${name}`; let text: string | null = null, dirChild = false; try { text = await store.read(child); } catch (e) { if (e instanceof Error && e.name === "TypeMismatchError") dirChild = true; else throw e; } if (dirChild || (text === null && (await store.list(`${child}/`)).length > 0)) await walk(`${child}/`, next); else if (text !== null) out[next] = text; else throw new Error(`missing ${child}`); } };
   await walk(pre, ""); return out;
 }
-export async function commitWrites(store: MakerStore, folder: string, writes: readonly { readonly path: string; readonly text: string }[]): Promise<WriteResult> {
+export async function commitWrites(store: MakerStore, folder: string, writes: readonly Write[]): Promise<WriteResult> {
   if (writes.length === 0) return { ok: true };
   const pre = folder.endsWith("/") ? folder : `${folder}/`, tmps: string[] = [];
-  for (const write of writes) { const tmp = `${pre}${write.path}.tmp`; try { await store.write(tmp, write.text); tmps.push(tmp); } catch (e) { const pending: string[] = []; for (const tmpPath of tmps) { try { await store.remove(tmpPath); } catch (c) { pending.push(`${tmpPath}: ${c instanceof Error ? c.message : "remove failed"}`); } } if (pending.length > 0) throw new Error(`${e instanceof Error ? e.message : "write failed"}; cleanup ${pending.join("; ")}`); return failed(write.path); } }
+  for (const write of writes) { const tmp = `${pre}${write.path}.tmp`; try { if ("bytes" in write) await store.writeBytes(tmp, write.bytes); else await store.write(tmp, write.text); tmps.push(tmp); } catch (e) { const pending: string[] = []; for (const tmpPath of tmps) { try { await store.remove(tmpPath); } catch (c) { pending.push(`${tmpPath}: ${c instanceof Error ? c.message : "remove failed"}`); } } if (pending.length > 0) throw new Error(`${e instanceof Error ? e.message : "write failed"}; cleanup ${pending.join("; ")}`); return failed(write.path); } }
   for (const write of writes) { try { await store.rename(`${pre}${write.path}.tmp`, `${pre}${write.path}`); } catch { return failed(write.path); } }
   return { ok: true };
 }
```

### `tools/maker/art.ts` (new)

```
import { prefix, type DocText } from "../../src/editor/project/home.ts";
import { planSave } from "../../src/editor/project/save.ts";
import { sentence } from "../../src/editor/project/test-gate.ts";
import { readProject } from "../../src/project/load/index.ts";
import type { ProjectFiles, ReportRow } from "../../src/project/load/types.ts";
import { assetRows } from "./asset-check.ts";
import { parseProject } from "./project-files.ts";
import { commitWrites, type MakerStore } from "./store.ts";
import { fits, readPicture } from "../play-stage/picture.ts";
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const amp = String.fromCharCode(38), esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? `${amp}amp;` : ch === "<" ? `${amp}lt;` : ch === ">" ? `${amp}gt;` : ch === '"' ? `${amp}quot;` : `${amp}#39;`);
export type ArtRow = { readonly code: "uploadTypeUnsupported"; readonly severity: "hard"; readonly path: string; readonly detail: string };
export type ArtResult = { readonly ok: true; readonly files: DocText; readonly rev: number } | { readonly ok: false; readonly line: string; readonly row?: ArtRow };
let shown = false, note: string | null = null, lines: readonly string[] = [];
export const showArt = (): void => { shown = true; note = null; }, hideArt = (): void => { shown = false; note = null; }, setArtNote = (line: string | null): void => { note = line; }, setArtLines = (next: readonly string[]): void => { lines = next; };
function locate(files: ProjectFiles, stageId: string): { mapPath: string; map: Record<string, unknown>; root: Record<string, unknown> } | null {
  let mapRef = "";
  for (const [path, doc] of Object.entries(files)) if (path.startsWith("stages/") && isObj(doc) && doc["id"] === stageId && typeof doc["mapRef"] === "string") mapRef = doc["mapRef"];
  const root = files["project.json"];
  for (const [path, doc] of Object.entries(files)) if (mapRef !== "" && path.startsWith("maps/") && isObj(doc) && doc["id"] === mapRef && isObj(root)) return { mapPath: path, map: doc, root };
  return null;
}
const layersOf = (map: Record<string, unknown>): Record<string, unknown>[] => { const bg = isObj(map["background"]) ? map["background"] : {}; return (Array.isArray(bg["layers"]) ? bg["layers"] : []).filter(isObj); }, hex = (buf: ArrayBuffer): string => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const typeLine = (fileName: string, sniffed: string): string => sniffed === "unknown" ? `Can't use ${fileName}: it's not a picture. Use a PNG, JPG or WebP picture.` : `Can't use ${fileName}: it's a ${sniffed} file. Use a PNG, JPG or WebP picture.`;
const saved = (files: DocText, rev: number, writes: readonly { readonly path: string; readonly text: string }[]): ArtResult => { let out: DocText = files; for (const w of writes) out = { ...out, [w.path]: w.text }; return { ok: true, files: out, rev: writes.length > 0 ? rev + 1 : rev }; };
export async function addPicture(store: MakerStore, id: string, files: DocText, rev: number, stageId: string, now: string, fileName: string, bytes: Uint8Array): Promise<ArtResult> {
  const pic = readPicture(bytes);
  if (!pic.ok) return { ok: false, line: typeLine(fileName, pic.sniffed), row: { code: "uploadTypeUnsupported", severity: "hard", path: fileName, detail: pic.sniffed } };
  if (!fits(pic.w, pic.h)) return { ok: false, line: `${fileName} is too big: ${pic.w} × ${pic.h} px. A picture can be at most 4096 px a side. Nothing was saved.` };
  const parsed = parseProject(files); if (!parsed.ok) return { ok: false, line: parsed.message };
  const found = locate(parsed.files, stageId); if (found === null) return { ok: false, line: "Can't open this map" };
  const assetId = `asset_${hex(await crypto.subtle.digest("SHA-256", new Uint8Array(bytes))).slice(0, 16)}`, stem = fileName.replace(/\.[^./\\]+$/, "").slice(0, 64), name = stem === "" ? "Picture" : stem;
  const root = structuredClone(found.root), map = structuredClone(found.map), project = isObj(root["project"]) ? root["project"] : null;
  if (project === null) return { ok: false, line: "Can't open: project.json" };
  const assets = isObj(project["assets"]) ? project["assets"] : {}, bg = isObj(map["background"]) ? map["background"] : {};
  project["assets"] = { ...assets, [assetId]: { name, ext: pic.ext, origin: { kind: "upload", fileName }, kind: "background" } };
  map["background"] = { ...bg, layers: [...(Array.isArray(bg["layers"]) ? bg["layers"] : []), { assetId, depth: 1, repeat: "none" }] };
  const next = { ...files, [found.mapPath]: JSON.stringify(map), "project.json": JSON.stringify(root) }, plan = planSave(files, next, rev, now);
  if (!plan.ok) return { ok: false, line: plan.message };
  const wrote = await commitWrites(store, prefix(id), [{ path: `assets/${assetId}.${pic.ext}`, bytes }, ...plan.writes]);
  return wrote.ok ? saved(files, rev, plan.writes) : { ok: false, line: wrote.message };
}
export async function dropLayer(store: MakerStore, id: string, files: DocText, rev: number, stageId: string, index: number, now: string): Promise<ArtResult> {
  const parsed = parseProject(files); if (!parsed.ok) return { ok: false, line: parsed.message };
  const found = locate(parsed.files, stageId); if (found === null) return { ok: false, line: "Can't open this map" };
  const map = structuredClone(found.map), bg = isObj(map["background"]) ? map["background"] : {}, layers = [...(Array.isArray(bg["layers"]) ? bg["layers"] : [])];
  if (!Number.isInteger(index) || index < 0 || index >= layers.length) return { ok: false, line: "That layer is already gone." };
  layers.splice(index, 1); map["background"] = { ...bg, layers };
  const next = { ...files, [found.mapPath]: JSON.stringify(map) }, plan = planSave(files, next, rev, now);
  if (!plan.ok) return { ok: false, line: plan.message };
  const wrote = await commitWrites(store, prefix(id), plan.writes);
  return wrote.ok ? saved(files, rev, plan.writes) : { ok: false, line: wrote.message };
}
const words = (row: ReportRow): string | null => row.code === "overCap" ? `${row.detail ?? ""} layers: more than 3. All of them still draw.` : row.code === "outOfRange" ? "A scroll speed is outside 0–1. It's drawn as the nearest end." : row.code === "advancedRenderInactive" ? "Cover and Stretch need Advanced render. It's drawn as is." : null;
export async function artLines(store: MakerStore, id: string, files: DocText, stageId: string): Promise<string[]> {
  const parsed = parseProject(files); if (!parsed.ok) return [parsed.message];
  const found = locate(parsed.files, stageId); if (found === null) return ["Can't open this map"];
  const ids = new Set(layersOf(found.map).map((layer) => layer["assetId"]).filter((v): v is string => typeof v === "string"));
  const asset = (await assetRows(store, prefix(id), parsed.files)).filter((row) => ids.has(row.detail ?? ""));
  const bg = readProject(parsed.files).report.filter((row) => row.path.startsWith(`${found.mapPath}#/background`));
  return [...asset.map((row) => `${sentence(row)}${row.severity === "hard" ? ". Test is blocked until it's fixed." : "."}`), ...bg.flatMap((row) => { const line = words(row); return line === null ? [] : [line]; })];
}
const layerName = (root: Record<string, unknown>, assetId: string): string => { const project = isObj(root["project"]) ? root["project"] : {}, assets = isObj(project["assets"]) ? project["assets"] : {}, meta = assets[assetId]; return isObj(meta) && typeof meta["name"] === "string" && meta["name"] !== "" ? meta["name"] : "Picture"; };
export function artSheet(files: DocText, stageId: string, readOnly: boolean): string {
  if (!shown) return "";
  const parsed = parseProject(files), found = parsed.ok ? locate(parsed.files, stageId) : null, layers = found === null ? [] : layersOf(found.map);
  const rows = layers.length === 0 ? `<p>No background yet.</p>` : layers.map((layer, i) => `<p>Layer ${i + 1} · ${esc(found === null || typeof layer["assetId"] !== "string" ? "Picture" : layerName(found.root, layer["assetId"]))}${readOnly ? "" : ` <button type="button" class="btn ghost" data-act="b:del:${i}">Remove</button>`}</p>`).join("");
  const add = readOnly ? "" : `<label class="btn">Add picture<input type="file" data-art accept="image/png,image/jpeg,image/webp"></label>`;
  return `<div class="scrim"><div class="sheet" role="dialog"><h2>Background</h2>${note === null ? "" : `<p>${esc(note)}</p>`}${rows}${lines.map((line) => `<p>${esc(line)}</p>`).join("")}${add}<button type="button" class="btn ghost" data-act="b:close">Close</button></div></div>`;
}
```

### `tools/maker/home.ts` (edited)

```diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index ef8ab14..2c06a4c 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -9,12 +9,12 @@ import { addFind, rememberAbility } from "./add-ability.ts";
 import { DEV } from "./dev.ts"; // dev-only
 import { rememberRule, rulesAct, rulesOpen, rulesShut } from "./rules-panel.ts";
 import { levelsAct, levelsOpen, levelsSection, levelsSheet, rememberLevels } from "./levels.ts";
-import { bindStage, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
+import { bindStage, dropUndo, rememberTalk, stageClick, stageCommit, stageLine, stageRows, stageScreen } from "./stage.ts";
 import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from "./store.ts";
 import { backScreen, launchTest, openSaved, type AimAt, type Next, type PlayReady } from "./test-launch.ts";
 import { startMatch } from "../play-stage/page.ts";
 import { ENGINE_VERSION } from "../../src/index.ts";
-import type { Notice } from "../../src/core/notice.ts";
+import { addPicture, artLines, artSheet, dropLayer, hideArt, setArtLines, setArtNote, showArt } from "./art.ts";
 import type { SessionParty, SessionSave } from "../../src/types/core-types.ts";
 import type { LinkEvent } from "../../src/rules/session/links.ts";
 import { keptLine, readAutosave, writeAutosave } from "./session.ts";
@@ -23,7 +23,7 @@ const amp = String.fromCharCode(38);
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
 type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | "rule" | "level" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
 const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, undo: null, tpl: "demo", name: "My game", menu: null, current: null, stageId: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
-let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "", gate: Promise<void> = Promise.resolve(), resume: SessionSave | null = null, resumeNotes: readonly Notice[] = [];
+let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "", gate: Promise<void> = Promise.resolve(), resume: SessionSave | null = null;
 const app = (): HTMLElement => { const node = document.querySelector("#app"); if (!(node instanceof HTMLElement)) throw new Error("maker: #app"); return node; };
 const nowIso = (): string => new Date().toISOString(), bytes = (): Uint8Array => crypto.getRandomValues(new Uint8Array(16)), say = (m: string): void => { state.banner = m; paint(); };
 const fail = (e: unknown): void => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.");
@@ -40,7 +40,7 @@ function paint(): void {
   if (state.screen === "fatal") { root.innerHTML = `<div class="body"><p class="banner bad" role="alert">${esc(OPFS)}</p></div>`; return; }
   if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
   if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
-  if (state.screen === "stage" && state.current !== null && state.stageId !== null) { const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : ""; root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + edit + toast; return; }
+  if (state.screen === "stage" && state.current !== null && state.stageId !== null) { const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : ""; root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + artSheet(state.files, state.stageId, state.readOnly) + edit + toast; return; }
   if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; const cont = resume === null ? "" : `<button type="button" class="btn" data-act="continue">Continue</button>`; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: `${roomTail(state.files, state.readOnly)}${cont}`, units: unitTail(state.files, state.readOnly), levels: levelsSection(state.files, state.readOnly) }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly)) + (unitEditing() ? "" : toast); return; }
   const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
   const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
@@ -48,14 +48,14 @@ function paint(): void {
   root.innerHTML = `${bar}<div class="body">${banner}${state.screen === "trash" ? "" : `<button type="button" class="card new" data-act="new"><span class="grow"><span class="name">New project</span><span class="sub">Demo or empty</span></span></button>`}${empty}${list}${link}</div>${sheet()}${toast}`;
 }
 async function refresh(): Promise<void> { const live = store; if (live === null) return; const load = async (dir: string): Promise<readonly Row[]> => { const rows: Row[] = []; for (const id of (await live.list(dir)).filter((name) => name !== ".deleted")) { const text = await readTree(live, `${dir}${id}/`); if (Object.keys(text).length === 0) continue; const parsed = parseProject(text); rows.push(parsed.ok ? rowFrom(id, parsed.files) : rowBlocked(id, parsed.message)); } return sortRows(rows); }; state.rows = await load(LIVE); state.trash = await load(TRASH); }
-async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; state.screen = "project"; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; resume = null; resumeNotes = []; bindRooms(id); bindUnits(id); paint(); const live = store, want = { projectId: id, projectHash: `rev:${state.rev}`, engineVersion: ENGINE_VERSION }; readAutosave(live, want).then((got) => { if (state.current !== id || got === null) return; if (!got.ok) { const line = keptLine(got.code); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); return; } resume = got.save; resumeNotes = got.notes; paint(); }).catch((e: unknown) => { if (state.current !== id) return; const line = keptLine(e instanceof Error ? e.message : "read failed"); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); }); }
+async function openId(id: string): Promise<void> { if (store === null) return; const text = await readTree(store, prefix(id)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const row = rowFrom(id, parsed.files); state.current = id; state.files = text; state.rev = storedRev(parsed.files); state.readOnly = row.readOnly; state.dirty = false; state.screen = "project"; state.banner = row.readOnly ? "Made with a newer TileEngine. Open only." : null; resume = null; bindRooms(id); bindUnits(id); paint(); const live = store, want = { projectId: id, projectHash: `rev:${state.rev}`, engineVersion: ENGINE_VERSION }; readAutosave(live, want).then((got) => { if (state.current !== id || got === null) return; if (!got.ok) { const line = keptLine(got.code); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); return; } resume = got.save; paint(); }).catch((e: unknown) => { if (state.current !== id) return; const line = keptLine(e instanceof Error ? e.message : "read failed"); state.banner = state.banner === null ? line : `${state.banner} ${line}`; paint(); }); }
 async function saveCurrent(): Promise<void> { if (store === null || state.current === null || state.readOnly) return; const plan = planSave(state.files, state.files, state.rev, nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.current), plan.writes); if (!got.ok) { say(got.message); return; } for (const write of plan.writes) state.files = { ...state.files, [write.path]: write.text }; if (plan.writes.length > 0) state.rev += 1; state.dirty = false; state.banner = null; paint(); }
 async function create(): Promise<void> { if (store === null || templates === null) { say("Can't open: templates"); return; } const err = checkName(state.name); if (err !== null) { say(err); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(stampNew(templates[state.tpl], state.name, id, nowIso()))); if (!got.ok) { say(got.message); return; } state.banner = null; await refresh(); await openId(id); }
 async function rename(): Promise<void> { if (store === null || state.menu === null) return; const err = checkName(state.name); if (err !== null) { say(err); return; } const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } if (rowFrom(state.menu, parsed.files).readOnly) { say("Made with a newer TileEngine. Open only."); return; } const plan = planSave(text, renameTo(text, state.name), storedRev(parsed.files), nowIso()); if (!plan.ok) { say(plan.message); return; } const got = await commitWrites(store, prefix(state.menu), plan.writes); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
-async function copy(): Promise<void> { if (store === null || state.menu === null) return; const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const id = projectId(Date.now(), bytes()), got = await commitWrites(store, prefix(id), asWrites(duplicate(text, id, nowIso(), state.rows.map((row) => row.name)))); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
+async function copy(): Promise<void> { if (store === null || state.menu === null) return; const text = await readTree(store, prefix(state.menu)), parsed = parseProject(text); if (!parsed.ok) { say(parsed.message); return; } const id = projectId(Date.now(), bytes()), from = prefix(state.menu), bins: { path: string; bytes: Uint8Array }[] = []; for (const name of await store.list(`${from}assets/`)) { const blob = await store.readBlob(`${from}assets/${name}`); if (blob !== null) bins.push({ path: `assets/${name}`, bytes: new Uint8Array(await blob.arrayBuffer()) }); } const got = await commitWrites(store, prefix(id), [...bins, ...asWrites(duplicate(text, id, nowIso(), state.rows.map((row) => row.name)))]); if (!got.ok) { say(got.message); return; } state.screen = "home"; state.banner = null; await refresh(); paint(); }
 async function remove(): Promise<void> { if (store === null || state.menu === null) return; const id = state.menu; await movePrefix(store, prefix(id), prefix(id, true)); toastId = id; state.toast = "Deleted · Undo"; state.screen = "home"; window.clearTimeout(timer); timer = window.setTimeout(() => { state.toast = null; paint(); }, 6000); await refresh(); paint(); }
 async function restore(id: string): Promise<void> { if (store === null || id === "") return; const taken = (await store.list(LIVE)).includes(id), text = await readTree(store, prefix(id, true)), plan = restorePlan(id, taken, text, projectId(Date.now(), bytes()), nowIso(), state.rows.map((row) => row.name)); if (taken) { const got = await commitWrites(store, prefix(plan.id), asWrites(plan.files)); if (!got.ok) { say(got.message); return; } for (const rel of Object.keys(text)) await store.remove(`${prefix(id, true)}${rel}`); } else await movePrefix(store, prefix(id, true), prefix(id)); window.clearTimeout(timer); state.toast = null; state.screen = "home"; state.banner = null; await refresh(); paint(); }
-function saveTrip(link: LinkEvent, party: SessionParty): void { if (store === null || state.current === null) return; const header = { projectHash: `rev:${state.rev}`, engineVersion: ENGINE_VERSION, projectId: state.current, savedAt: nowIso() }; writeAutosave(store, header, link.from, link.to, party).then((res) => { if (!res.ok) { state.banner = res.message; paint(); return; } resume = res.save; resumeNotes = []; }).catch((e: unknown) => { state.banner = `Autosave skipped (${e instanceof Error ? e.message : "error"}). The saved game is kept.`; paint(); }); }
+function saveTrip(link: LinkEvent, party: SessionParty): void { if (store === null || state.current === null) return; const header = { projectHash: `rev:${state.rev}`, engineVersion: ENGINE_VERSION, projectId: state.current, savedAt: nowIso() }; writeAutosave(store, header, link.from, link.to, party).then((res) => { if (!res.ok) { state.banner = res.message; paint(); return; } resume = res.save; }).catch((e: unknown) => { state.banner = `Autosave skipped (${e instanceof Error ? e.message : "error"}). The saved game is kept.`; paint(); }); }
 function enterPlay(docs: PlayReady, scroll: number, aim?: AimAt, next?: Next): void {
   const root = app(), canvas = document.createElement("canvas"); canvas.id = "board"; document.body.append(canvas);
   const out = (): void => { canvas.remove(); document.querySelector("#hud")?.remove(); root.hidden = false; state.screen = backScreen(new URLSearchParams(location.search).get("from")); state.problems = []; history.pushState(null, "", location.pathname); paint(); const body = document.querySelector(".body"); if (body instanceof HTMLElement) body.scrollTop = scroll; };
@@ -76,7 +76,10 @@ async function beginTest(aim?: AimAt & { readonly stageId?: string }, held?: Ses
   const got = await launchTest({ store, id: state.current, stored: state.files, next: state.files, rev: state.rev, from: stageId !== null && state.screen === "stage" ? "stage" : "project", ...(stageId !== null ? { stageId } : {}), ...(launched === undefined ? {} : { aim: launched }), ...(held === undefined ? {} : { resume: held }), now: nowIso(), start: (docs, at, next) => enterPlay(docs, scroll, at, next) });
   state.files = got.files; state.rev = got.rev;
   if (!got.ok) { const line = got.lines[0] ?? ""; const save = line.startsWith("Couldn't save") || line.startsWith("This project changed") || line.startsWith("Can't open"); const onStage = state.screen === "stage"; state.banner = onStage ? (got.lines.join(" ") || null) : save ? line : null; state.problems = onStage || save ? [] : got.lines; paint(); return; }
-  if (held !== undefined) { const parts: string[] = []; if (resumeNotes.some((n) => n.code === "saveProjectMismatch") || (got.notes ?? []).some((n) => n.code === "saveProjectMismatch")) parts.push("the project changed"); if (resumeNotes.some((n) => n.code === "saveEngineMismatch") || (got.notes ?? []).some((n) => n.code === "saveEngineMismatch")) parts.push("TileEngine changed"); for (const n of [...resumeNotes, ...(got.notes ?? [])]) if (n.code === "saveRefDropped") parts.push(n.message === held.to ? `dropped the stage it was going to ${n.message}` : n.message === held.from ? `dropped the stage it came from ${n.message}` : `dropped unitId ${n.message}`); if (parts.length > 0) state.banner = `Continued. Since the save: ${parts.join("; ")}`; }
+  if (held !== undefined) {
+    const fresh = store === null || state.current === null ? null : await readAutosave(store, { projectId: state.current, projectHash: `rev:${state.rev}`, engineVersion: ENGINE_VERSION }), resumeNotes = fresh !== null && fresh.ok ? fresh.notes : [];
+    const parts: string[] = []; if (resumeNotes.some((n) => n.code === "saveProjectMismatch") || (got.notes ?? []).some((n) => n.code === "saveProjectMismatch")) parts.push("the project changed"); if (resumeNotes.some((n) => n.code === "saveEngineMismatch") || (got.notes ?? []).some((n) => n.code === "saveEngineMismatch")) parts.push("TileEngine changed"); for (const n of [...resumeNotes, ...(got.notes ?? [])]) if (n.code === "saveRefDropped") parts.push(n.message === held.to ? `dropped the stage it was going to ${n.message}` : n.message === held.from ? `dropped the stage it came from ${n.message}` : `dropped unitId ${n.message}`); if (parts.length > 0) state.banner = `Continued. Since the save: ${parts.join("; ")}`; paint();
+  }
   state.dirty = false; state.problems = [];
 }
 function aimAt(text: DocText, unit: string, ability: string | null): AimAt {
@@ -133,12 +136,16 @@ async function run(act: string): Promise<void> {
     paint(); return;
   }
   if (act.startsWith("stage:")) { rulesShut(); state.stageId = act.slice(6); bindStage(state.stageId, state.current ?? ""); state.screen = "stage"; if (!state.readOnly) state.banner = null; if (state.current !== null) history.pushState(null, "", `?project=${encodeURIComponent(state.current)}&stage=${encodeURIComponent(state.stageId)}&from=stage`); paint(); return; }
+  if ((act === "b:open" || act === "b:close" || act.startsWith("b:del:")) && state.screen === "stage" && state.stageId !== null && store !== null && state.current !== null) {
+    if (act === "b:close") hideArt(); else if (act === "b:open") { showArt(); setArtLines(await artLines(store, state.current, state.files, state.stageId)); } else if (!state.readOnly) { if (!await saveStage()) setArtNote(state.banner ?? "Couldn't save."); else { const got = await dropLayer(store, state.current, state.files, state.rev, state.stageId, Number(act.slice(6)), nowIso()); if (!got.ok) setArtNote(got.line); else { state.files = got.files; state.rev = got.rev; state.dirty = false; state.banner = null; setArtNote(null); dropUndo(); setArtLines(await artLines(store, state.current, state.files, state.stageId)); } } }
+    paint(); return;
+  }
   if (act.startsWith("s:") && state.screen === "stage" && state.stageId !== null && store !== null && state.current !== null) {
     const out = await stageClick(act, state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }, { store, id: state.current, now: nowIso(), bytes });
     state.files = out.files; state.rev = out.rev; state.banner = out.banner; state.dirty = out.dirty;
     if (out.unitId !== undefined && !out.test) { openUnit(out.unitId); paint(); return; }
     if (out.test) return beginTest(out.unitId === undefined ? undefined : { unitId: out.unitId, ...(out.stageId === undefined ? {} : { stageId: out.stageId }) });
-    if (out.leave) { rulesShut(); state.screen = "project"; } paint(); return;
+    if (out.leave) { rulesShut(); hideArt(); state.screen = "project"; } paint(); return;
   }
   if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
   if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; state.problems = []; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
@@ -159,6 +166,7 @@ let held: { act: string; t: number } | null = null;
 document.addEventListener("pointerdown", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; held = act.startsWith("s:cell:") ? { act, t: ev.timeStamp } : null; });
 document.addEventListener("pointerup", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; if (held !== null && held.act === act && ev.timeStamp - held.t >= 500) go(act); held = null; });
 document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-lvl")) { go(`l:set:${node.getAttribute("data-lvl") ?? ""}:${node.value}`); return; } if (node.hasAttribute("data-find")) { addFind(node.value); const q = node.value.toLowerCase(); for (const el of document.querySelectorAll("[data-add]")) if (el instanceof HTMLElement) el.hidden = q !== "" && !(el.getAttribute("data-add") ?? "").toLowerCase().includes(q); return; } if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(key === "unit_hp" || key === "unit_atk" ? `u:stat:${key}:${node.value}` : `a:set:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
+document.addEventListener("change", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement) || !node.hasAttribute("data-art")) return; const file = node.files?.[0]; node.value = ""; if (file === undefined) return; gate = gate.then(async () => { if (store === null || state.current === null || state.stageId === null || state.screen !== "stage" || state.readOnly) return; if (!await saveStage()) { setArtNote(state.banner ?? "Couldn't save."); paint(); return; } let raw: Uint8Array; try { raw = new Uint8Array(await file.arrayBuffer()); } catch (e) { setArtNote(`Couldn't add ${file.name}: ${e instanceof Error ? e.message : "read failed"}`); paint(); return; } const got = await addPicture(store, state.current, state.files, state.rev, state.stageId, nowIso(), file.name, raw); if (!got.ok) { setArtNote(got.line); paint(); return; } state.files = got.files; state.rev = got.rev; state.dirty = false; state.banner = null; setArtNote(null); dropUndo(); setArtLines(await artLines(store, state.current, state.files, state.stageId)); paint(); }).catch(fail); });
 document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
 if (DEV) Object.assign(window, { __read: () => ({ ...state.files }), __write: (path: string, text: string) => { state.files = { ...state.files, [path]: text }; paint(); } }); // dev-only
 void boot();
```

### `tools/maker/stage.ts` (edited)

```diff
diff --git a/tools/maker/stage.ts b/tools/maker/stage.ts
index d4631d2..e4347d3 100644
--- a/tools/maker/stage.ts
+++ b/tools/maker/stage.ts
@@ -28,6 +28,7 @@ type Sess = { id: string; project: string; draft: Obj | null; path: string | nul
 const blank = (id: string, project: string): Sess => ({ id, project, draft: null, path: null, stagePath: null, painting: null, label: "", stack: [], gridOn: true, sheet: null, view: false, confirm: false, note: null, sel: null, moving: null, pick: null, ask: null, talking: false, line: "", link: null });
 let sess: Sess = blank("", ""), skeleton: Obj | null = null;
 export function bindStage(id: string, project: string): void { if (sess.id !== id || sess.project !== project) sess = blank(id, project); }
+export const dropUndo = (): void => { sess.stack = []; };
 export function rememberTalk(doc: unknown): void { if (isObj(doc)) skeleton = doc; }
 export function stageLine(value: string, max: number): string { const next = Number.isInteger(max) && max >= 0 ? [...value].slice(0, max).join("") : value; sess.line = next; return next; }
 function same(a: Cell, b: Cell): boolean { return a.c === b.c && a.r === b.r; }
@@ -144,7 +145,7 @@ export function stageScreen(stageId: string, host: Host): string {
   const banner = host.banner === null ? "" : `<p class="banner bad" role="alert"${code === "" ? "" : ` data-error="${code}"`}>${esc(host.banner)} <button type="button" class="btn ghost" data-act="dismiss">Dismiss</button></p>`;
   const dot = host.dirty || sess.draft !== null ? `<span class="dot" aria-label="Unsaved"></span>` : "";
   const start = host.readOnly ? "" : `<button type="button" class="btn ghost" data-act="s:fresh">Start new</button>`;
-  const bar = `<header class="topbar wrap"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>${esc(name)}${dot}</h1><button type="button" class="btn ghost" data-act="s:view">View</button><button type="button" class="btn ghost" data-act="r:open">Rules</button>${start}<button type="button" class="btn" data-act="s:test">Test</button></header>`;
+  const bar = `<header class="topbar wrap"><button type="button" class="btn ghost" data-act="s:back">Back</button><h1>${esc(name)}${dot}</h1><button type="button" class="btn ghost" data-act="s:view">View</button><button type="button" class="btn ghost" data-act="b:open">Background</button><button type="button" class="btn ghost" data-act="r:open">Rules</button>${start}<button type="button" class="btn" data-act="s:test">Test</button></header>`;
   const cell = sess.sheet, mark = cell === null ? null : placed.find((item) => same(item, cell)) ?? null;
   const names = stageRows(host.files), linked = mark === null && cell !== null ? linkOn(got.stage, cell.c, cell.r) : null, linkType = linked !== null && (linked["type"] === "stairs" || linked["type"] === "door" || linked["type"] === "gate") ? linked["type"] : null;
   const rows = sheetRows(got.slice, mark !== null);
```

### `tests/editor/art-upload.test.ts` (new)

```
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix } from "../../src/editor/project/home.ts";
import { readProject } from "../../src/project/load/index.ts";
import { openCheckpoint } from "../../tools/baseline/checkpoint.ts";
import { addPicture, artLines, artSheet, dropLayer, setArtLines, showArt } from "../../tools/maker/art.ts";
import { assetRows } from "../../tools/maker/asset-check.ts";
import { memoryStore } from "../../tools/maker/store.ts";
import { loadLayer, type Bitmap } from "../../tools/play-stage/backdrop.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { readPicture } from "../../tools/play-stage/picture.ts";
const root = join(dirname(fileURLToPath(import.meta.url)), "../../fixtures/demo.tileproj");
const MAP = "maps/map_01JDAM00000000000000000001.json", STAGE = "stage_01JDAS00000000000000000001", PID = "project_01JDAP00000000000000000001", NOW = "2026-11-25T00:00:00.000Z";
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
function textOf(dir: string, base = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const ent of readdirSync(dir, { withFileTypes: true })) { const rel = base === "" ? ent.name : `${base}/${ent.name}`; if (ent.isDirectory()) Object.assign(out, textOf(join(dir, ent.name), rel)); else out[rel] = readFileSync(join(dir, ent.name), "utf8"); }
  return out;
}
const be = (n: number): number[] => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
const png = (w: number, h: number): Uint8Array => new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, ...be(w), ...be(h)]);
const jpg = (w: number, h: number): Uint8Array => new Uint8Array([255, 216, 255, 192, 0, 7, 8, (h >> 8) & 255, h & 255, (w >> 8) & 255, w & 255]);
const webp = (kind: string, payload: number[]): Uint8Array => { const b = new Uint8Array(30); b.set([82, 73, 70, 70, 22, 0, 0, 0, 87, 69, 66, 80]); b.set([...kind].map((c) => c.charCodeAt(0)), 12); payload.forEach((n, i) => { b[20 + i] = n; }); return b; };
const ftyp = (brand: string): Uint8Array => { const b = new Uint8Array(12); b.set([0, 0, 0, 24]); b.set([102, 116, 121, 112], 4); b.set([...brand].map((c) => c.charCodeAt(0)), 8); return b; };
const sniff = (bytes: Uint8Array): string => { const got = readPicture(bytes); return got.ok ? `${got.ext} ${got.w}x${got.h}` : got.sniffed; };
const parse = (text: Record<string, string>): Record<string, unknown> => { const out: Record<string, unknown> = {}; for (const [k, v] of Object.entries(text)) out[k] = JSON.parse(v) as unknown; return out; };
async function loaded(): Promise<{ files: Record<string, string>; store: ReturnType<typeof memoryStore>; rev: number }> {
  const files = textOf(root), store = memoryStore(), body = JSON.parse(files["project.json"] ?? "{}") as { project?: { rev?: number } };
  for (const [path, text] of Object.entries(files)) await store.write(`${prefix(PID)}${path}`, text);
  return { files, store, rev: body.project?.rev ?? 0 };
}
const shot = (store: ReturnType<typeof memoryStore>): string => JSON.stringify([...store.files.entries()].sort(([a], [b]) => (a < b ? -1 : 1)));
test("upload type (D29 3): png, jpg and webp are typed from the bytes with their size, an animated png or webp keeps its type, and anything else is named", () => {
  const still = png(96, 144), anim = new Uint8Array(still.length + 4); anim.set(still); anim.set([97, 99, 84, 76], still.length);
  assert.equal(sniff(still), "png 96x144"); assert.equal(sniff(anim), "png 96x144"); assert.equal(sniff(jpg(640, 480)), "jpg 640x480");
  assert.equal(sniff(webp("VP8X", [2, 0, 0, 0, 99, 0, 0, 49, 0, 0])), "webp 100x50"); assert.equal(sniff(webp("VP8L", [47, 15, 192, 3, 0])), "webp 16x16"); assert.equal(sniff(webp("VP8 ", [0, 0, 0, 0, 0, 0, 20, 0, 10, 0])), "webp 20x10");
  assert.deepEqual([sniff(new TextEncoder().encode("GIF89a")), sniff(new TextEncoder().encode("BM")), sniff(new TextEncoder().encode("<svg xmlns='x'/>")), sniff(ftyp("heic")), sniff(ftyp("avif")), sniff(new TextEncoder().encode("hello")), sniff(still.subarray(0, 8)), sniff(new Uint8Array([255, 216, 255, 224, 0, 2]))], ["gif", "bmp", "svg", "heic", "avif", "unknown", "damaged png", "damaged jpg"]);
});
test("upload (D29 3): the file and its index entry go in one commit, a .jpeg name is stored as jpg, the map gets a layer, and the project still loads clean", async () => {
  const { files, store, rev } = await loaded(), bytes = jpg(640, 480), got = await addPicture(store, PID, files, rev, STAGE, NOW, "pic.jpeg", bytes);
  assert.equal(got.ok, true); if (!got.ok) return; assert.equal(got.rev, rev + 1);
  const project = JSON.parse(got.files["project.json"] ?? "{}") as { project: { assets: Record<string, unknown> } }, id = Object.keys(project.project.assets)[0] ?? "";
  assert.deepEqual(project.project.assets[id], { name: "pic", ext: "jpg", origin: { kind: "upload", fileName: "pic.jpeg" }, kind: "background" });
  const blob = await store.readBlob(`${prefix(PID)}assets/${id}.jpg`); assert.equal(blob !== null && Buffer.from(await blob.arrayBuffer()).equals(Buffer.from(bytes)), true);
  assert.deepEqual(await store.list(`${prefix(PID)}assets/`), [`${id}.jpg`]);
  const map = JSON.parse(got.files[MAP] ?? "{}") as { background: { layers: unknown[] } }; assert.deepEqual(map.background.layers, [{ assetId: id, depth: 1, repeat: "none" }]);
  const docs = parse(got.files), load = readProject(docs); assert.equal(load.report.some((row) => row.severity === "hard"), false); assert.deepEqual(await assetRows(store, prefix(PID), docs), []);
  const kept = store.files.get(`${prefix(PID)}project.json`); store.failOn(`${prefix(PID)}project.json.tmp`);
  const again = await addPicture(store, PID, got.files, got.rev, STAGE, NOW, "more.jpeg", jpg(8, 8));
  assert.equal(again.ok, false); if (again.ok) return; assert.equal(again.line.startsWith("Couldn't save "), true);
  assert.deepEqual(await store.list(`${prefix(PID)}assets/`), [`${id}.jpg`]); assert.equal(store.files.get(`${prefix(PID)}project.json`), kept); assert.equal([...store.files.keys(), ...(await store.list(prefix(PID)))].some((key) => key.endsWith(".tmp")), false);
});
test("upload refusals write nothing: other types are uploadTypeUnsupported {fileName, sniffed}, and a picture over 4096 px a side is refused before any decode (Law 13)", async () => {
  const { files, store, rev } = await loaded(), before = shot(store), gif = await addPicture(store, PID, files, rev, STAGE, NOW, "cat.png", new TextEncoder().encode("GIF89a"));
  assert.equal(gif.ok, false); if (gif.ok) return;
  assert.equal(gif.line, "Can't use cat.png: it's a gif file. Use a PNG, JPG or WebP picture.");
  assert.deepEqual(gif.row, { code: "uploadTypeUnsupported", severity: "hard", path: "cat.png", detail: "gif" });
  const wide = await addPicture(store, PID, files, rev, STAGE, NOW, "wide.png", png(5000, 10));
  assert.equal(wide.ok, false); if (wide.ok) return; assert.equal(wide.line, "wide.png is too big: 5000 × 10 px. A picture can be at most 4096 px a side. Nothing was saved."); assert.equal(wide.row, undefined);
  assert.equal(shot(store), before); assert.deepEqual(await store.list(`${prefix(PID)}assets/`), []); assert.equal(files["project.json"], textOf(root)["project.json"]);
});
test("background sheet: lines show this map's D29 asset rows (hard when a played stage uses it), and Remove takes the layer off but keeps the asset", async () => {
  const { files, store, rev } = await loaded(), id = "asset_00112233445566aa", project = JSON.parse(files["project.json"] ?? "{}") as Record<string, unknown>, map = JSON.parse(files[MAP] ?? "{}") as Record<string, unknown>;
  if (!isObj(project["project"])) return; const body = project["project"]; body["assets"] = { [id]: { name: "pic", ext: "png", origin: { kind: "upload", fileName: "pic.png" }, kind: "background" } }; map["background"] = { layers: [{ assetId: id, depth: 1, repeat: "none" }] };
  const next = { ...files, "project.json": JSON.stringify(project), [MAP]: JSON.stringify(map) }; for (const [path, text] of Object.entries(next)) await store.write(`${prefix(PID)}${path}`, text);
  const hard = `A picture this project uses is missing: assets/${id}.png. Test is blocked until it's fixed.`;
  assert.deepEqual(await artLines(store, PID, next, STAGE), [hard]); showArt(); setArtLines([hard]); const html = artSheet(next, STAGE, false);
  assert.equal(html.includes("Layer 1 · pic") && html.includes("Test is blocked") && html.includes("b:del:0"), true); assert.equal(artSheet(next, STAGE, true).includes("Add picture") || artSheet(next, STAGE, true).includes("Remove"), false);
  body["render"] = { ...(isObj(body["render"]) ? body["render"] : {}), excludedStages: [STAGE] }; const warned = { ...next, "project.json": JSON.stringify(project) };
  assert.deepEqual(await artLines(store, PID, warned, STAGE), [`A picture this project uses is missing: assets/${id}.png.`]);
  map["background"] = { layers: [0, 1, 2, 3].map(() => ({ assetId: id, depth: 1.5, repeat: "none", fit: "cover" })) };
  const busy = await artLines(store, PID, { ...warned, [MAP]: JSON.stringify(map) }, STAGE);
  assert.equal(busy.includes("4 layers: more than 3. All of them still draw.") && busy.includes("A scroll speed is outside 0–1. It's drawn as the nearest end.") && busy.includes("Cover and Stretch need Advanced render. It's drawn as is."), true);
  await store.writeBytes(`${prefix(PID)}assets/${id}.png`, png(8, 8)); const dropped = await dropLayer(store, PID, next, rev, STAGE, 0, NOW);
  assert.equal(dropped.ok, true); if (!dropped.ok) return; const after = JSON.parse(dropped.files[MAP] ?? "{}") as { background: { layers: unknown[] } }, kept = JSON.parse(dropped.files["project.json"] ?? "{}") as { project: { assets: Record<string, { ext: string }> } };
  assert.deepEqual(after.background.layers, []); assert.equal(kept.project.assets[id]?.ext, "png"); assert.notEqual(await store.readBlob(`${prefix(PID)}assets/${id}.png`), null); assert.equal(dropped.rev, rev + 1);
});
test("play stage layer loader: missing, too big and undecodable files are each named and drawn as nothing, and a drawn layer's bitmap is closed", async () => {
  let opened = 0, closed = 0; const open = async (): Promise<Bitmap> => { opened += 1; return { width: 4, height: 6, close() { closed += 1; } }; };
  const layer = { assetId: "asset_00112233445566aa", file: "assets/asset_00112233445566aa.png", depth: 1, repeat: "none" } as const, file = layer.file;
  assert.equal((await loadLayer(layer, undefined, open, () => undefined)).miss, `Background picture missing: ${file}`);
  assert.equal((await loadLayer(layer, async () => null, open, () => undefined)).miss, `Background picture missing: ${file}`);
  assert.equal((await loadLayer(layer, async () => new Blob([png(4097, 8)]), open, () => undefined)).miss, `Background picture ${file} is too big to open (4097 × 8 px)`);
  assert.equal((await loadLayer(layer, async () => new Blob(["nope"]), open, () => undefined)).miss, `Background picture ${file} couldn't be opened`);
  assert.equal((await loadLayer(layer, async () => { throw new Error("read"); }, open, () => undefined)).miss, `Background picture ${file} couldn't be opened`); assert.equal(opened, 0);
  const good = await loadLayer(layer, async () => new Blob([png(8, 8)]), open, () => undefined);
  assert.deepEqual(good.row, { sheet: { id: layer.assetId, columns: 1, fw: 4, fh: 6 }, depth: 1, repeat: "none" });
  assert.equal((await loadLayer(layer, async () => new Blob([png(8, 8)]), open, () => { throw new Error("keep"); })).miss, `Background picture ${file} couldn't be opened`);
  assert.deepEqual([opened, closed], [2, 2]);
});
test("scene identity: the scene keeps one assets object between frames, and a new one only after bare() changes the looks", () => {
  const opened = openCheckpoint(); assert.equal(opened.error, ""); assert.notEqual(opened.docs, null); if (opened.docs === null) return;
  const match = createMatch(opened.docs), first = match.scene(), second = match.scene();
  assert.equal(first.assets, second.assets); match.bare(); const third = match.scene(); assert.notEqual(third.assets, first.assets); assert.equal(third.assets, match.scene().assets);
});
```

### `handoff/steps/tests/s9b-art-upload/smoke.mjs` (new)

```
// Step 09b art upload. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s9b-art-upload/smoke.mjs . 8813 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8813", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s9b-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const out = join(root, `handback/step-09b-art-upload/${REV}`); mkdirSync(out, { recursive: true });
const STAGE = "stage_01JDAS00000000000000000001", MAP = "maps/map_01JDAM00000000000000000001.json", UNIT = "unit_01JDAN00000000000000000001";
const WIDE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0x13, 0x88, 0, 0, 0, 10]);
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).last(); let last = "no"; for (let i = 0; i < 4; i += 1) { try { await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) { last = "no box"; continue; } await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); return; } catch (e) { last = String(e && e.message ? e.message : e); } } throw new Error(`tap ${act}: ${last}`); };
const tapSel = async (page, sel) => { const node = page.locator(sel).last(); await node.waitFor({ timeout: 15000 }); const box = await node.boundingBox(); if (box === null) throw new Error(sel); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const waitText = (page, s) => page.waitForFunction((s) => document.body.innerText.includes(s), s, { timeout: 15000 });
const fsOf = () => `(async (id) => { const root = await navigator.storage.getDirectory(); const at = async (path, create) => { const parts = path.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, create ? { create: true } : {}); return { dir, leaf }; }; return { async text(path) { const { dir, leaf } = await at(path, false); return await (await (await dir.getFileHandle(leaf)).getFile()).text(); }, async put(path, data) { const { dir, leaf } = await at(path, true); const w = await (await dir.getFileHandle(leaf, { create: true })).createWritable(); await w.write(data); await w.close(); }, async names(path) { const { dir, leaf } = await at(path, false), folder = await dir.getDirectoryHandle(leaf), got = []; for await (const name of folder.keys()) got.push(name); return got.sort(); } }; })`;
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(out, `${name}.png`) }); };
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { const text = await page.evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(0, 400)).catch(() => ""); check(`${name} @${width}`, false, `${String(e && e.message ? e.message : e).replace(/\s+/g, " ").slice(0, 500)} || ${text}`); } };
    const undo = (on) => page.waitForFunction((on) => { const b = document.querySelector('[data-act="s:undo"]'); return b instanceof HTMLButtonElement && b.disabled !== on && b.textContent === (on ? "Undo" : "Nothing to undo"); }, on, { timeout: 15000 });
    let id = "";
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await step("1 new", async () => { await tap(page, "new"); await waitText(page, "Pick a start"); await tap(page, "toname"); await waitText(page, "Name it"); await tap(page, "create"); await waitText(page, "Demo stage"); id = await page.evaluate(async () => { const projects = await (await (await navigator.storage.getDirectory()).getDirectoryHandle("tileengine")).getDirectoryHandle("projects"), ids = []; for await (const name of projects.keys()) if (name.startsWith("project_")) ids.push(name); if (ids.length !== 1) throw new Error(ids.join(",")); return ids[0]; }); });
    await step("2 upload", async () => {
      await tap(page, `stage:${STAGE}`); await tap(page, "s:cell:0,0"); await tap(page, "s:type:water"); await tap(page, "s:done"); await undo(true); await tap(page, "b:open"); await waitText(page, "No background yet.");
      const buf = await page.evaluate(async () => { const c = new OffscreenCanvas(96, 144), g = c.getContext("2d"); if (g === null) throw new Error("2d"); g.fillStyle = "#ff00ff"; g.fillRect(0, 0, 48, 144); g.fillStyle = "#00ffff"; g.fillRect(48, 0, 48, 144); return [...new Uint8Array(await (await c.convertToBlob({ type: "image/png" })).arrayBuffer())]; });
      await page.locator("[data-art]").setInputFiles({ name: "split.png", mimeType: "image/png", buffer: Buffer.from(buf) }); await waitText(page, "Layer 1 · split");
      const info = await page.evaluate(async ({ id, map, fs }) => { const disk = await (eval(fs))(id), pre = `tileengine/projects/${id}/`, names = await disk.names(`${pre}assets`), project = JSON.parse(await disk.text(`${pre}project.json`)), doc = JSON.parse(await disk.text(`${pre}${map}`)); const asset = Object.keys(project.project.assets)[0]; return { names, asset, ext: project.project.assets[asset].ext, fileName: project.project.assets[asset].origin.fileName, layer: doc.background.layers[0].assetId }; }, { id, map: MAP, fs: fsOf() });
      if (info.names.length !== 1 || info.names[0] !== `${info.asset}.png` || !/^asset_[0-9a-f]{16}$/.test(info.asset) || info.ext !== "png" || info.fileName !== "split.png" || info.layer !== info.asset) throw new Error(JSON.stringify(info));
      await tap(page, "b:close"); await undo(false); await shot("02-upload"); });
    await step("3 refusals", async () => {
      const before = await page.evaluate(async ({ id, fs }) => (await (eval(fs))(id)).text(`tileengine/projects/${id}/project.json`), { id, fs: fsOf() });
      await tap(page, "b:open"); await page.locator("[data-art]").setInputFiles({ name: "cat.png", mimeType: "image/gif", buffer: Buffer.from("GIF89a") }); await waitText(page, "Can't use cat.png: it's a gif file. Use a PNG, JPG or WebP picture.");
      await page.locator("[data-art]").setInputFiles({ name: "wide.png", mimeType: "image/png", buffer: WIDE }); await waitText(page, "wide.png is too big: 5000 × 10 px. A picture can be at most 4096 px a side. Nothing was saved.");
      const after = await page.evaluate(async ({ id, fs }) => { const disk = await (eval(fs))(id), pre = `tileengine/projects/${id}/`; return { text: await disk.text(`${pre}project.json`), names: await disk.names(`${pre}assets`) }; }, { id, fs: fsOf() });
      if (after.text !== before || after.names.length !== 1) throw new Error(`${after.names.join(",")} ${after.text === before}`); await shot("03-refuse"); });
    await step("4 draws", async () => {
      await tap(page, "b:close"); await tap(page, "s:test");
      await page.waitForFunction(() => { const canvas = document.querySelector("#board"); if (!(canvas instanceof HTMLCanvasElement) || canvas.width === 0) return false; const tiles = window.__play?.scene?.().layers?.[0]?.tiles; if (!Array.isArray(tiles) || !tiles.some((t) => t === null)) return false; const ctx = canvas.getContext("2d"); if (ctx === null) return false; const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data; let mag = 0, cyan = 0; for (let i = 0; i < data.length; i += 4) { const r = data[i], g = data[i + 1], b = data[i + 2]; if (r >= 160 && g <= 30 && b >= 160) mag += 1; else if (r <= 30 && g >= 160 && b >= 160) cyan += 1; } window.__px = { mag, cyan, failed: window.__driver?.stats?.failed ?? -1 }; return mag >= 500 && cyan >= 500 && window.__px.failed === 0; }, null, { timeout: 15000 });
      await shot("04-draw"); });
    await step("5 too big", async () => {
      const line = await page.evaluate(async ({ id, map, fs, bytes }) => { const header = new Uint8Array(bytes), hex = [...new Uint8Array(await crypto.subtle.digest("SHA-256", header))].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16), asset = `asset_${hex}`, disk = await (eval(fs))(id), pre = `tileengine/projects/${id}/`, project = JSON.parse(await disk.text(`${pre}project.json`)), doc = JSON.parse(await disk.text(`${pre}${map}`)); project.project.assets[asset] = { name: "Wide", ext: "png", origin: { kind: "upload", fileName: "wide.png" }, kind: "background" }; doc.background.layers.push({ assetId: asset, depth: 1, repeat: "none" }); await disk.put(`${pre}project.json`, JSON.stringify(project)); await disk.put(`${pre}${map}`, JSON.stringify(doc)); await disk.put(`${pre}assets/${asset}.png`, header); return `Background picture assets/${asset}.png is too big to open (5000 \u00d7 10 px)`; }, { id, map: MAP, fs: fsOf(), bytes: [...WIDE] });
      await page.goto(`${origin}/maker/?project=${encodeURIComponent(id)}&from=project`, { waitUntil: "load" });
      await page.waitForFunction((line) => document.querySelector("#note")?.textContent === line && (window.__driver?.stats?.failed ?? 0) >= 1, line, { timeout: 15000 });
      const box = await page.locator("#noteX").boundingBox(); if (box === null || box.width < 44 || box.height < 44) throw new Error(JSON.stringify(box)); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
      for (let n = 0; n < 5; n += 1) await page.waitForFunction(() => { window.__h = (window.__h ?? 0) + 1; return window.__h > 5 && document.querySelector("#note")?.style.display === "none"; }, null, { timeout: 15000 }); await shot("05-note"); });
    await step("6 duplicate", async () => {
      await tapSel(page, "#back-maker"); await waitText(page, "Demo stage"); await tap(page, "back"); await waitText(page, "New project"); await tap(page, `menu:${id}`); await tap(page, "duplicate"); await page.waitForFunction(() => document.querySelectorAll("[data-act^='menu:']").length === 2, null, { timeout: 15000 });
      const same = await page.evaluate(async ({ id, fs }) => { const disk = await (eval(fs))(id), root = await navigator.storage.getDirectory(), projects = await (await root.getDirectoryHandle("tileengine")).getDirectoryHandle("projects"), ids = []; for await (const name of projects.keys()) if (name.startsWith("project_") && name !== id) ids.push(name); if (ids.length !== 1) throw new Error(ids.join(",")); const mine = (await disk.names(`tileengine/projects/${id}/assets`)).join(), copy = (await disk.names(`tileengine/projects/${ids[0]}/assets`)).join(); if (mine !== copy || mine.split(",").length !== 2) throw new Error(`${mine} != ${copy}`); return mine; }, { id, fs: fsOf() }); if (same === "") throw new Error("empty"); });
    await step("7 continue", async () => {
      await page.evaluate(async ({ id, stage, unit, fs }) => { const disk = await (eval(fs))(id), text = await disk.text(`tileengine/projects/${id}/project.json`), rev = JSON.parse(text).project.rev; const save = { kind: "session-save", formatVersion: 1, header: { projectHash: `rev:${rev}`, engineVersion: "0.0.0", projectId: id, savedAt: "2026-11-25T00:00:00.000Z" }, from: stage, to: stage, party: { side: "player", members: [{ unitId: unit, hp: 20 }], bar: null } }; await disk.put(`tileengine/saves/${id}/autosave.json`, JSON.stringify(save)); }, { id, stage: STAGE, unit: UNIT, fs: fsOf() });
      await tap(page, `open:${id}`); await page.waitForFunction(() => document.querySelector('[data-act="continue"]') !== null, null, { timeout: 15000 }); await tap(page, `stage:${STAGE}`); await tap(page, "b:open"); await waitText(page, "Layer 1");
      const rev = await page.evaluate(async ({ id, fs }) => JSON.parse(await (await (eval(fs))(id)).text(`tileengine/projects/${id}/project.json`)).project.rev, { id, fs: fsOf() });
      await tap(page, "b:del:0"); await page.waitForFunction(async ({ id, fs, rev }) => JSON.parse(await (await (eval(fs))(id)).text(`tileengine/projects/${id}/project.json`)).project.rev === rev + 1 && !document.body.innerText.includes("Layer 2"), { id, fs: fsOf(), rev }, { timeout: 15000 });
      await tap(page, "b:close"); await page.waitForFunction(() => document.querySelector('[data-act="b:close"]') === null, null, { timeout: 15000 }); await tap(page, "s:back"); await tap(page, "continue"); await page.waitForFunction(() => window.__play !== undefined, null, { timeout: 15000 }); await tapSel(page, "#back-maker"); await waitText(page, "Continued. Since the save: the project changed"); await shot("07-continue"); });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```

