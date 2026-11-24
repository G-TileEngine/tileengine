# Rebuild record: step 9a, map backgrounds from project data

Original brief: [`docs/maker/steps/step-09-art-backgrounds.md`](../maker/steps/step-09-art-backgrounds.md) on the merge (r2, blob `d65f7aa4`, sha256 `0de2c56f5ca87046b9938f74c87289e9d82f61282abb2303e92574aeb9ac5a03`, 145 lines). Delivery L13; Goal L20; Read first L31; Rules L46; Build L60; Named tests L82; Smoke L96; Must NOT L109; Done when L116. Count command L78; hard per-file caps L60–76; hard gate 400 and caps sum 396 at L79 (trial 335). This is 9a (data + rule). The upload editor is 9b, the next go-line after this merge (guide L3, L10). Code authority is DSK D29, `handoff/dsk-rulings/2026-11-17-phase1.md` L77 at `8ab22996` (file sha256 `90df966c864568074981d4efedf7233c394aae5c0bd6a03ade0a666e53fdb9d8`, 77 lines). The guide is unchanged from the product base through the merge; current main adds the 8c docs already on the merge's first parent, plus the 9a r1 QA review.

Sources: PR #99 and branch `step/step-09-art-backgrounds-r1-chatA` (r1 tip `f58bae6b`, r1 code head `f1fe4d14`); `handback/step-09-art-backgrounds/r1/HANDBACK.md` at `f58bae6b` and on the merge (HB, blob `79427c26`, 142 lines, sha256 `42d782d5ddac528ac1adc30644a6eb83d58d5075c48466a5b9979309dd64ad34`); CoS verify report `/workspace/share/step-09a-r1-verify/report.md` (V, 48 lines, sha256 `a6ef3e766eea7e0b12485c71f5bfe8b101b409f441368a4e9393f2e0bc0a73eb`, hash-object `ab924c119ea193adfd2119af2a285c9563aa07e7`). `docs/qa/step-09a-r1-review.md` on main `02a0a9c5` (QA, blob `e1e88989`, 46 lines, sha256 `429c01e20f3005bf3d8f604efc056d118c31d12b94c758d664084f77663a13a4`): **OK TO MERGE**, no must-fix, no rework round. Line cites use HB, V and QA. Product line cites are at merge `ab64d4fb` (tree `1fadf9ee`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `6e9d624fe560558a98a38195bbd5e8260619f973`, 2026-11-24 17:58 (UK time). Floor **1125** tests (guide L9: 8b's final count + N=9). After this merge the floor is **1134**. The guide's own base was `8ab22996` (D29, docs-only over `053817f9`); guide L7 said to use a later main if CoS named one. The go-line named this later main (the 9a guide r2, roadmap r15b, and the 08b phone reviews, all docs-only on D29). The product count against `8ab22996` is not the official 9a number, because that range also includes those docs |
| r1 commits | on `step/step-09-art-backgrounds-r1-chatA`: `f1fe4d14866ea79200c37d7b00f1fdcbb5ff4af5` Step 9a: draw a map background from the project's pictures (code head, tree `9842ca58a62003a1e9d7b3d2fe1880c9f887fe51`, 2026-11-24 20:50 UK time), `f58bae6bc3c27e27f54f4144d56b7e9d3b9d581e` docs(handback): step 9a art backgrounds r1 (tree `8925d80b57ca63ef82e86b76ad71047e99017c1c`, 2026-11-24 20:50 UK time). Linear, two commits, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Tip vs code is the r1 hand-back folder only: `HANDBACK.md` (142 lines). The s9 (and s8) shots were produced and not committed; the tip folder holds `HANDBACK.md` only (HB:109, V, QA:5) |
| r1 verdict | Product green was 1134/0 and the official count was 289, with every cap kept (HB:32–52, V, QA:12–13). CoS verify of r1 was PASS (V). QA **OK TO MERGE**, no must-fix (QA:3). Predicted merge tree onto main `acdbf3f1` was `1fadf9ee` (V, QA:3, QA:19). PR #99 "Step 9a: art backgrounds (r1, ChatA)" was opened from the branch after the hand-back (the HANDBACK PR line was already written as if it existed; QA:37, V) |
| Merge | PR #99, merge commit `ab64d4fbee07fd5a58714bbdac9e3ee598b74987`, 2026-11-24 21:20 (UK time). Tree `1fadf9ee3976565a4405abf1d0762b78181610fb` (the same tree CoS and QA predicted against main `acdbf3f1`; V, QA:3, QA:19). First parent `acdbf3f13c05cefbadc1106fe260ce2fea2ff05e` (the 8c guide and its QA review, docs-only on the product base), second parent `f58bae6b`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Diff vs the r1 tip is only the three 8c docs already on that first parent. `npm test` on the merge was **1134 pass / 0 fail** |
| After the merge | main is `02a0a9c560366777549f395cf97003500d238b1d`, 2026-11-24 21:21 (UK time), tree `97aab4fdd87b3fdc7e62d039b0a386de8b871c05`, which adds only `docs/qa/step-09a-r1-review.md` (46 insertions, sha256 `429c01e2`, hash-object `e1e88989`). QA postmerge on `ab64d4fb` (tree `1fadf9ee`) **PASSED** (pins 5/5, 1134/0). The 8c go-line was sent 21:22 UK time on base `02a0a9c5`, floor **1135** (1134 + 1). The 9a floor stays 1134 until 8c lands |
| Tests | 1125 + N=9 (named tests 1–9 in `tests/editor/art-backgrounds.test.ts`) = **1134 pass / 0 fail**. Floor after this merge is **1134** (HB:35–39, V, QA:13) |

## (b) Files

From `git diff --name-status 6e9d624f..f1fe4d14 -- . ':!handback/**'`. Line counts are `git diff --numstat` insertions and deletions against the product base, at the r1 code head (the accepted 9a measure). The same product files are on the merge tree `1fadf9ee`. The 8c docs on the merge are from first parent `acdbf3f1`, not from this branch. The r1 review doc landed on main `02a0a9c5` after the merge and is **not** in the official 400.

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `src/project/load/read-project.ts` | M | 7 / 2 | 10 (L63) | yes. 9 |
| `src/editor/project/test-gate.ts` | M | 3 / 1 | 5 (L64) | yes. 4 |
| `src/runtime/render/types.ts` | M | 3 / 1 | 8 with `index.ts` (L65) | yes. group 6 |
| `src/runtime/render/index.ts` | M | 1 / 1 | 8 with `types.ts` (L65) | yes. group 6 |
| `src/runtime/render/draw-list.ts` | M | 6 / 0 | 9 (L66) | yes. 6 |
| `src/runtime/render/chunk-plan.ts` | M | 5 / 3 | 10 (L67) | yes. 8 |
| `tools/play-stage/backdrop.ts` | A | 14 / 0 | 22 (L68) | yes. 14 |
| `tools/play-stage/load.ts` | M | 1 / 1 | 10 with `project.ts` (L69) | yes. group 7 |
| `tools/play-stage/project.ts` | M | 3 / 2 | 10 with `load.ts` (L69) | yes. group 7 |
| `tools/play-stage/page.ts` | M | 14 / 2 | 17 (L70) | yes. 16 |
| `tools/play-stage/looks.ts` | M | 3 / 3 | 15 with `board.ts` (L71) | yes. group 10 |
| `tools/play-stage/board.ts` | M | 3 / 1 | 15 with `looks.ts` (L71) | yes. group 10 |
| `tools/maker/store.ts` | M | 7 / 5 | 21 with `test-launch.ts` (L72) | yes. group 20 |
| `tools/maker/test-launch.ts` | M | 5 / 3 | 21 with `store.ts` (L72) | yes. group 20 |
| `tools/maker/asset-check.ts` | A | 25 / 0 | 30 (L73) | yes. 25 |
| `tools/maker/session.ts` | M | 5 / 3 | 14 (L74) | yes. 8 |
| `tests/editor/art-backgrounds.test.ts` | A | 109 / 0 | 155 (L75) | yes. 109 (sha256 `152d933341ede8e55c0368646f592b922340cc74414885cf926af98fb823d135`) |
| `handoff/steps/tests/s9-art-backgrounds/smoke.mjs` | A | 47 / 0 | 70 (L76) | yes. 47 (sha256 `7f8c6b199b69de7855f70f6a6b7fbe1a9bd237205341a79d9893bfe654c65b9d`) |

No diff under `src/core`, `src/sim`, `src/types`, `src/rules`, `data/`, `fixtures/`, `behaviour-library/`, `tools/painter-proto/` or `tools/ui-shell/`. No existing test or smoke was edited (the only test/smoke paths in the diff are the two new files). s8 (`0de37442…`, 44 lines) and S0 (`d528795e…`) are unedited. Official G7 at the r1 code head or r1 tip against `6e9d624f`, and at the merge against first parent `acdbf3f1`, is **18 files changed, 261 insertions(+), 28 deletions(-)** = 289 ≤ 400. Every per-file cap is kept (tightest: page.ts 16/17, store+test-launch 20/21, read-project 9/10). Caps sum 396 (guide L79) is not a second gate. The trial on `8ab22996` was the same 18 files, 309+/26− = 335. No file is near 500. No new dependency. Lockfile blob `85b42f99` is unchanged vs the product base.

## (c) Key code and git commands

Step 9a does the data + rule half of roadmap row 9 (guide L3, L20–27, Rules 1–8). A map can list background pictures in `background.layers`. They are checked (missing asset, over-cap, out-of-range depth, D29 file/hash and `advancedRenderInactive`), turned into `PlayDocs.backdrop` / `art`, and drawn under the board at whole art pixels, by depth and repeat, once in a chunked list. A layer that does not draw is named in the HUD note and counted in `stats.failed` (Law 12). The plain floor goes bare only when at least one layer drew. There is no upload UI and no byte writer (9b). No new rAF, timer or loop; the backdrop rides the existing driver frame. Only D29's new codes (`advancedRenderInactive`, `assetFileMissing`, `assetHashMismatch`) and existing ones are used.

**Read and look data (Rules 1–2).** `read-project.ts:41` reports `brokenRef` (hard) for a background layer whose `assetId` is not in `project.assets`. ` :76–77` warn `overCap` when a map has more than three layers, and `outOfRange` when a stored depth is outside 0..1. While `advancedRender` is off, each stored `fit: cover`/`stretch` and a `camera.pixelPerfect: false` is one `advancedRenderInactive` info row; nothing is rewritten (`:51,77`, test 9). `backdropOf` (`tools/play-stage/backdrop.ts:4-13`) keeps file order, skips a layer with no asset/`ext`, clamps depth to 0..1 (absent or not finite = 1), and treats a bad `repeat` as `none`. `fit` is ignored (doc comment, HB:139). `PlayDocs` gains optional `backdrop?` and `art?` (`load.ts:23`). `playDocsOf` (`project.ts:79-80`) includes `backdrop` only when it is not empty. `test-launch.ts:36-37` attaches `art = (file) => store.readBlob(prefix + file)` to the started docs and to the next stage after `arriveIn`.

**Draw (Rules 3).** `Backdrop` is `{ sheet, depth, repeat }` (`src/runtime/render/types.ts:25-27`); `RenderScene.backdrop?` is that list. `draw-list.ts:48-52` walks the layers first, before the ground: origin `floor(view * (1 - depth))`, native `fw` × `fh`, integer dx/dy, `imageSmoothing` stays off on the copy (page.ts:64). Zero-size sheets are skipped. Repeat tiles x and/or y. `chunk-plan.ts:14,34` strips the rest of the scene and draws the backdrop list once, first, then the ground chunks.

**Decode and Law 12 (Rules 4–5).** `page.ts:60-66` decodes every `docs.backdrop` layer through `docs.art`. A null blob pushes `Background picture missing: <file>` and adds 1 to `driver.stats.failed`. A `createImageBitmap` or context failure (the `catch` wraps the read as well, so a throw cannot drop a sibling; HB:129) pushes `Background picture <file> couldn't be opened` and adds 1. Notes join the HUD note row (`:55`). `bmp` is copied onto an `OffscreenCanvas` with `imageSmoothingEnabled = false`; `bmp.close()` is never called (QA:38). When at least one layer drew, `match.bare()` (`board.ts:122`) re-dresses the floor through `dress(..., true)` so tile 0 becomes `null` (`looks.ts:45-47`). The merged scene is memoised on the link-scene identity (`page.ts:24,56`). `board.scene()` (`:132-138`) still allocates a new `assets` object every call, so that identity changes every frame; this predates 9a and was left (looks+board 10/15; HB:129, QA:40).

**Store, Test gate, autosave (Rules 6–8).** `store.ts:12` `readBlob` returns null only on `NotFoundError` / `TypeMismatchError` and rethrows the rest. `readTree` (`:14-17`) skips the top-level `assets/` folder. `movePrefix` (`:26-28`) renames `assets/` first. `assetRows` (`asset-check.ts:14-24`) emits `assetFileMissing` or `assetHashMismatch`, **hard** when a selected (not excluded) stage's map uses the asset, else a warning; the index entry is kept. `test-gate.ts:13-16` names the file in the sentence (`A picture this project uses is missing: <path>`). Hard rows refuse Test; warnings do not (`:23-25`). s9 step 5 covers that gate. The in-play "missing" branch is a second line of defence with no test of its own (QA:26; smoke step 6 covers won't-open). `writeAutosave` is one at a time: a `lane` queue (`session.ts:16-17,25`) and `writeOne` reads the slot once (`:21`). Test 7 closes the 8a/8b double-slot and overlapping-autosave carry (QA:24).

The nine new named tests, all in `tests/editor/art-backgrounds.test.ts`, one import per line, DOM-free (V, QA:13, guide L82–94):

```ts
test("background refs: a missing asset is brokenRef, out-of-range depth and over 3 layers warn", () => {
```

```ts
test("backdropOf keeps file order, clamps depth, defaults repeat, and skips a layer with no asset", () => {
```

```ts
test("draw list: the backdrop draws first, at whole art px, by depth", () => {
```

```ts
test("chunked list draws the backdrop once, before the ground chunks", () => {
```

```ts
test("store: readTree skips assets, readBlob reads bytes, trash moves assets", async () => {
```

```ts
test("test launch hands the stage its background and an art reader", async () => {
```

```ts
test("autosave: two links in a row write in order, and each write reads the slot once", async () => {
```

```ts
test("asset files (D29): a missing or changed file is H4 when a selected stage uses it, a warning when unused, and Test is refused naming the file", async () => {
```

```ts
test("advancedRenderInactive (D29): one info row per stored field while advanced render is off, and nothing is rewritten", () => {
```

They run at `:45`, `:52`, `:60`, `:68`, `:73`, `:81`, `:86`, `:91` and `:103`.

s9 (`handoff/steps/tests/s9-art-backgrounds/smoke.mjs`, sha256 `7f8c6b199b69de7855f70f6a6b7fbe1a9bd237205341a79d9893bfe654c65b9d`, 47 lines, port 8811) is `smoke.mjs . 8811 r1`: 12 ok lines and `SMOKE PASS` (HB:54–69, V, QA:15). Shots go to `handback/step-09-art-backgrounds/r1/` and must not be committed. s8 stays `0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696`, unedited, rerun as `smoke.mjs . 8810 r1 step-09-art-backgrounds`: 16 ok and `SMOKE PASS`. S0 stays `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, identical on the base, the code head, the tip and the merge (V, QA:16–17): 14 ok and `TOUCH SMOKE PASS`.

Export audit on the clean code head, counted on the play-stage tree, the baseline tree, and the maker build's `play-stage/` directory directly: **132 / 146 / 132**, empty hit list, `AUDIT PASS` (V, QA:18). `s8-audit.mjs` also reports `AUDIT PASS`; its loose maker-play count is 144 (the same known filter as 8a/8b). No audit script was committed.

`npx tsc --noEmit -p tools/tsconfig.json` still exits 2 with the three errors already on the base (`tools/effect-designer/page.ts:101`, `tools/maker/home.ts:85` twice). No new error (HB:52, V, QA:14). Leave them.

The official count command (guide L78, on a committed tree the `git add -N` is unnecessary):

```
# Product gate. The first parent of the merge is acdbf3f1, the 8c
# guide and its QA review, not the product base 6e9d624f. Official
# command at the r1 code head or r1 tip against 6e9d624f, or at the
# merge against acdbf3f1:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**'
#   18 files changed, 261 insertions(+), 28 deletions(-)
#
# The same 289 at the merge against acdbf3f1. At the merge against
# 6e9d624f, the official command also counts the three 8c docs
# already on the first parent (21 files, 378 insertions, 28
# deletions). Those files are not this step. Adding ':!docs/**' at
# the merge against 6e9d624f gives the official 289.
# At 02a0a9c5 (current main, which also adds the r1 review) against
# 6e9d624f, the official command without ':!docs/**' is 22 files,
# 424 insertions, 28 deletions. Adding ':!docs/**' again gives 289.
#
# Trial on 8ab22996 was 18 files, 309 insertions, 26 deletions = 335.
#
# S0 handoff/steps/tests/s0-play-input/touch-smoke.mjs sha256
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941
#
# s8 handoff/steps/tests/s8-autosave-links/smoke.mjs sha256
#   0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696
#   (unedited; 44 lines; already on main)
#
# s9 handoff/steps/tests/s9-art-backgrounds/smoke.mjs sha256
#   7f8c6b199b69de7855f70f6a6b7fbe1a9bd237205341a79d9893bfe654c65b9d
#
# Named tests (npm test 1134/0, floor 1125 + N=9):
#   ✔ background refs: a missing asset is brokenRef, out-of-range depth and over 3 layers warn
#   ✔ backdropOf keeps file order, clamps depth, defaults repeat, and skips a layer with no asset
#   ✔ draw list: the backdrop draws first, at whole art px, by depth
#   ✔ chunked list draws the backdrop once, before the ground chunks
#   ✔ store: readTree skips assets, readBlob reads bytes, trash moves assets
#   ✔ test launch hands the stage its background and an art reader
#   ✔ autosave: two links in a row write in order, and each write reads the slot once
#   ✔ asset files (D29): a missing or changed file is H4 when a selected stage uses it, a warning when unused, and Test is refused naming the file
#   ✔ advancedRenderInactive (D29): one info row per stored field while advanced render is off, and nothing is rewritten
#
# Smokes under google-chrome, at 390 and 360 CSS px:
#   s9 (8811 r1):
#     6 ok lines @390 and @360, then SMOKE PASS
#   s8 (8810 r1 step-09-art-backgrounds):
#     8 ok lines @390 and @360, then SMOKE PASS
#   S0 (8797):
#     ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
#
# Export audit as above; direct counts 132 / 146 / 132, empty hit list.
```

## (d) What went wrong, in order, and the fix

**r1.** The read, the look data, the draw, the Test gate, the store and the autosave queue shipped in one feat commit and green was 1134/0. The official gate was 289, with every per-file cap kept (page.ts 16/17, store+test-launch 20/21 and read-project 9/10 are the tight ones). s9 passed 12 ok, s8 passed 16 ok and S0 passed 14 ok. The export audit was clean on a direct count. The tip holds only `HANDBACK.md`. CoS verify of r1 was PASS (V). The predicted merge tree against then-main `acdbf3f1` was `1fadf9ee`.

QA **OK TO MERGE**, no must-fix, no rework round (QA:3). Mutation checks closed the writeAutosave queue (test 7) and the Law 12 won't-open path (s9 step 6); skipping the in-play missing note still lets s9 pass, because step 5 is the Test-gate hard block (QA:24–26).

One helper finding was fixed in the code head before the hand-back, and is not a QA must-fix: an `art()` throw used to reject `Promise.all` and drop a sibling that had already decoded. The read now sits in the same `try` (HB:129, page.ts:60-65).

HB:3 said `PR: opened by Chief Of Staff from the branch.`, which was not yet true at hand-back or at CoS verify (V). PR #99 was opened later, then merged.

## (e) Do it right first time

- Start from the product base `6e9d624f`. Do not start from `acdbf3f1`, `ab64d4fb` or `02a0a9c5`, because the first already has the 8c docs and the last two already contain the 9a merge. The floor at the start of 9a was 1125 + N; this merge leaves the floor at 1134. The 8c go-line (21:22 UK time, floor 1135) is the next step, on base `02a0a9c5`.
- Do not edit `src/core`, `src/sim`, `src/types`, `src/rules`, `data/`, `fixtures/`, `behaviour-library/`, `tools/painter-proto/` or `tools/ui-shell/`. Do not edit an existing test or smoke. Leave s8 and S0 unedited. The only new test is `tests/editor/art-backgrounds.test.ts`; the only new smoke is s9.
- Only D29's codes and existing ones. No formatVersion bump, no field the format does not define, no new notice code. If a new code looks necessary, stop and report to EA.
- Flood nothing and stretch nothing: integer origin, native art pixels, `imageSmoothingEnabled` stays false, `fit` cover/stretch is read as none. Never leave the floor bare unless a layer drew. Every layer that does not draw is in the note row and in `stats.failed`. Call `arriveIn` (and attach `art`) for the next stage the same way Test starts the first one.
- `writeAutosave` must be one at a time, one slot read. `readTree` must skip `assets/`; `readBlob` must not swallow unexpected errors.
- Do not add a second rAF, timer or loop. Do not add an upload UI or a byte writer (9b). The builder never publishes gh-pages.
- Paste the ok lines and `SMOKE PASS` / `TOUCH SMOKE PASS` from one solo run in § Smoke. Label the code head and the tip. The PR line should match whether a PR exists at hand-back time.
- Measure with the count command (guide L78): `git diff --shortstat <base>..HEAD -- . ':!handback/**'`. Count insertions plus deletions. **289** is the accepted number for this step (the trial was 335). On a merge whose first parent is not the product base, measure against that first parent (or at the code head against `6e9d624f`), and do not treat first-parent or later QA docs as 9a lines.
- Do not treat the open 8b carries, or the 9b upload work, as 9a fixes.

## (f) Rebuild check

From a clean tree at `6e9d624fe560558a98a38195bbd5e8260619f973` (the product base; the merge's first parent is `acdbf3f1`, which already has the 8c docs), write the product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit. Then measure. Without the commit, `git diff` misses the uncommitted new files. There is no CN on this step.

```
# Product equality vs the merge (current main adds only the r1 QA review;
# the 8c docs are already on the merge from the first parent):
#   git diff ab64d4fb HEAD -- src/project/load/read-project.ts \
#     src/editor/project/test-gate.ts \
#     src/runtime/render/types.ts src/runtime/render/index.ts \
#     src/runtime/render/draw-list.ts src/runtime/render/chunk-plan.ts \
#     tools/play-stage/backdrop.ts tools/play-stage/load.ts \
#     tools/play-stage/project.ts tools/play-stage/page.ts \
#     tools/play-stage/looks.ts tools/play-stage/board.ts \
#     tools/maker/store.ts tools/maker/test-launch.ts \
#     tools/maker/asset-check.ts tools/maker/session.ts \
#     tests/editor/art-backgrounds.test.ts \
#     handoff/steps/tests/s9-art-backgrounds/smoke.mjs
#   (empty)

# Product gate. Official command at the r1 code head or r1 tip against
# 6e9d624f, or at the merge against first parent acdbf3f1:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**'
#   18 files changed, 261 insertions(+), 28 deletions(-)
#
# The same 289 at the merge against acdbf3f1. At the merge against
# 6e9d624f, the official command also counts the three 8c docs
# (21 files, 378 insertions, 28 deletions). Those files are not this
# step. Adding ':!docs/**' at the merge against 6e9d624f gives 289.
# At 02a0a9c5 (current main, which also adds the r1 review) against
# 6e9d624f without ':!docs/**': 22 files, 424 insertions, 28 deletions.
# Adding ':!docs/**' again gives 289.
#
# S0 handoff/steps/tests/s0-play-input/touch-smoke.mjs sha256
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941
#
# s8 handoff/steps/tests/s8-autosave-links/smoke.mjs sha256
#   0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696
#
# s9 handoff/steps/tests/s9-art-backgrounds/smoke.mjs sha256
#   7f8c6b199b69de7855f70f6a6b7fbe1a9bd237205341a79d9893bfe654c65b9d
#
# Named tests (npm test 1134/0, floor 1125 + N=9):
#   ✔ background refs: a missing asset is brokenRef, out-of-range depth and over 3 layers warn
#   ✔ backdropOf keeps file order, clamps depth, defaults repeat, and skips a layer with no asset
#   ✔ draw list: the backdrop draws first, at whole art px, by depth
#   ✔ chunked list draws the backdrop once, before the ground chunks
#   ✔ store: readTree skips assets, readBlob reads bytes, trash moves assets
#   ✔ test launch hands the stage its background and an art reader
#   ✔ autosave: two links in a row write in order, and each write reads the slot once
#   ✔ asset files (D29): a missing or changed file is H4 when a selected stage uses it, a warning when unused, and Test is refused naming the file
#   ✔ advancedRenderInactive (D29): one info row per stored field while advanced render is off, and nothing is rewritten
#
# Smokes under google-chrome, at 390 and 360 CSS px:
#   s9 (8811 r1):
#     6 ok lines @390 and @360, then SMOKE PASS
#   s8 (8810 r1 step-09-art-backgrounds):
#     8 ok lines @390 and @360, then SMOKE PASS
#   S0 (8797):
#     ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
#
# Export audit as above; direct counts 132 / 146 / 132, empty hit list.
```

## QA non-blockers carried forward

- **The HANDBACK PR line** ("opened by Chief Of Staff from the branch") was written before PR #99 existed (QA:37, V).
- **`page.ts` never calls `bmp.close()`** after copying to the OffscreenCanvas; the bitmap waits for GC. Small, per layer, once (QA:38).
- **The in-play "missing" branch has no test of its own.** s9 step 5 proves the Test-gate hard block (`assetFileMissing`) before play starts; step 6 covers won't-open. The in-play missing note is a second line of defence (QA:26; same note as at guide r2).
- **`board.scene()` identity predates 9a.** Helper `7a88f154` finding 2: each call allocates a new `assets` object, so the memo key changes every frame. Left unchanged (looks+board 10/15; HB:129, QA:40).
- Tight caps, for a rebuild to watch: page.ts 16/17, store+test-launch 20/21, read-project 9/10 (QA:39). The name `shown` shadowing in `page.ts` was noted at guide r2 (QA:41).
- **Still open, not 9a scope** (QA:42, guide L131, L136): a benched member rejoins only at the next link with room; the walled-off-pocket spill; `project.ts` L102 null grid; the 9b upload work (upload UI, Shrink to fit, Depth slider, Duplicate copying pictures). The background `colour`, `fit` cover/stretch and `advancedRender` stay unread as built (HB:139, guide L142).
- **Closed here:** the double slot read and overlapping autosaves (Rules 7, test 7, QA:24); Law 12 won't-open (s9 step 6, QA:25).

## Blob check

Each file must have exactly this git blob id at `ab64d4fb`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `src/project/load/read-project.ts` | `72d2cf7a822193b880955028396ee92a94814e4d` | 119 |
| `src/editor/project/test-gate.ts` | `ec7611334e74c75a1a1f2c6a80eaabc34aa4ce32` | 28 |
| `src/runtime/render/types.ts` | `8709df09aaf23970d9cd413f342047306ac09bd3` | 38 |
| `src/runtime/render/index.ts` | `cd8cf29641b768afeae67719f6708c73f3b63105` | 20 |
| `src/runtime/render/draw-list.ts` | `b2934b4fcf35a8c39e842d24eabb0ca0bb05c36a` | 87 |
| `src/runtime/render/chunk-plan.ts` | `cac4c1785869ff3a4758ad39e03d77228e63a046` | 40 |
| `tools/play-stage/backdrop.ts` | `5c4f3239d9509f8a660bfad2ddd57deebd5562ee` | 14 |
| `tools/play-stage/load.ts` | `7a1491b8ff1167132c586c6fc872d68c5de0a47b` | 28 |
| `tools/play-stage/project.ts` | `0f1b5da71169149b0c4387b8b6f9f618e6a61eb9` | 109 |
| `tools/play-stage/page.ts` | `8d63934c38e4ae474c9b5c31a7824250b7dd49f1` | 99 |
| `tools/play-stage/looks.ts` | `096d5aa18358a1bc4ab00a63aca463b190a24d32` | 62 |
| `tools/play-stage/board.ts` | `5a58f29f9e9e28b027bfbce55a49d6457f5e4abb` | 141 |
| `tools/maker/store.ts` | `e71f8e150c31238fda934dacf8734aec23ae32a3` | 34 |
| `tools/maker/test-launch.ts` | `01b478a628f2e559f5c0914de02c290933e27d87` | 54 |
| `tools/maker/asset-check.ts` | `20d5434a70ad094472c4ab967c41588cc629bfe6` | 25 |
| `tools/maker/session.ts` | `1ed6eecf01f4403a3da5e80c3516a31341ea1b38` | 25 |
| `tests/editor/art-backgrounds.test.ts` | `7875565eae404c99f96d6d959822e05173343d82` | 109 |
| `handoff/steps/tests/s9-art-backgrounds/smoke.mjs` | `4d63f78370e1f0f33005fda1c6b15a672a8180cf` | 47 |

## Appendix: full code as merged (step 9a, PR #99)

New files are `git show ab64d4fb:<path>` in full. Edited files are `git diff 6e9d624f ab64d4fb -- <path>`.

### `src/project/load/read-project.ts` (edited)

```diff
diff --git a/src/project/load/read-project.ts b/src/project/load/read-project.ts
index 9bad62f..72d2cf7 100644
--- a/src/project/load/read-project.ts
+++ b/src/project/load/read-project.ts
@@ -38,6 +38,7 @@ function refs(manifest: Obj, at: Readonly<Record<string, string>>, maps: Readonl
     list(stage["links"]).forEach((l, i) => { if (!isObj(l)) return; const where = `${path}#/links/${i}/to`; if (l["to"] === id) rows.push(row("brokenRef", "hard", where, id)); else has(stages, l["to"], where, rows); });
   }
   for (const [id, unit] of Object.entries(units)) list(unit["setupIds"]).forEach((sid, i) => has(setups, sid, `units/${id}.json#/setupIds/${i}`, rows));
+  const assets = isObj(project["assets"]) ? project["assets"] : {}; for (const [id, map] of Object.entries(maps)) list(isObj(map["background"]) ? map["background"]["layers"] : undefined).forEach((layer, i) => { if (isObj(layer)) has(assets, layer["assetId"], `maps/${id}.json#/background/layers/${i}/assetId`, rows); });
 }
 
 function knobAt(slice: Obj, behaviourId: unknown, key: string): Obj | null {
@@ -45,7 +46,9 @@ function knobAt(slice: Obj, behaviourId: unknown, key: string): Obj | null {
   for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === behaviourId) for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === key) return knob;
   return null;
 }
-function warns(slice: Obj, projectRev: unknown, maps: Readonly<Record<string, Doc>>, setups: Readonly<Record<string, Doc>>, rows: ReportRow[]): void {
+function warns(slice: Obj, project: Obj, maps: Readonly<Record<string, Doc>>, setups: Readonly<Record<string, Doc>>, rows: ReportRow[]): void {
+  const projectRev = project["catalogueRev"], settings = isObj(project["settings"]) ? project["settings"] : {}, advanced = settings["advancedRender"] === true, camera = isObj(settings["camera"]) ? settings["camera"] : {};
+  if (!advanced && camera["pixelPerfect"] === false) rows.push(row("advancedRenderInactive", "info", "project.json#/project/settings/camera/pixelPerfect", "pixelPerfect"));
   const known = new Set(list(slice["behaviours"]).filter(isObj).map((b) => b["id"]));
   const tiles = new Set<string>();
   for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === "terrain") for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === "tile_types") for (const item of list(knob["default"])) if (isObj(item) && typeof item["id"] === "string") tiles.add(item["id"]);
@@ -70,6 +73,8 @@ function warns(slice: Obj, projectRev: unknown, maps: Readonly<Record<string, Do
   for (const [id, map] of Object.entries(maps)) {
     const palette = isObj(map["logic"]) && isObj(map["logic"]["palette"]) ? map["logic"]["palette"] : {};
     for (const key of Object.keys(palette)) { const name = palette[key]; if (tiles.size > 0 && typeof name === "string" && !tiles.has(name)) rows.push(row("unknownRef", "warning", `maps/${id}.json#/logic/palette/${key}`, name)); }
+    const layers = list(isObj(map["background"]) ? map["background"]["layers"] : undefined); if (layers.length > 3) rows.push(row("overCap", "warning", `maps/${id}.json#/background/layers`, String(layers.length)));
+    layers.forEach((layer, i) => { if (!isObj(layer)) return; const depth = layer["depth"]; if (typeof depth === "number" && (depth < 0 || depth > 1)) rows.push(row("outOfRange", "warning", `maps/${id}.json#/background/layers/${i}/depth`)); if (!advanced && (layer["fit"] === "cover" || layer["fit"] === "stretch")) rows.push(row("advancedRenderInactive", "info", `maps/${id}.json#/background/layers/${i}/fit`, "fit")); });
   }
 }
 
@@ -106,7 +111,7 @@ export function readProject(files: ProjectFiles): ProjectLoad {
   const manifestDoc = docs["project.json"];
   const project = isObj(manifestDoc) && isObj(manifestDoc["project"]) ? manifestDoc["project"] : {};
   refs(isObj(manifestDoc) ? manifestDoc : {}, stageAt, maps, stages, units, setups, rows);
-  warns(slice, project["catalogueRev"], maps, setups, rows);
+  warns(slice, project, maps, setups, rows);
   rows.push(...placementDrops(stages, stageAt, maps, slice), ...mapEntryDrops(maps, mapAt));
   const hard = rows.some((r) => r.severity === "hard");
   const store: ProjectStore = { manifest, slice, maps, stages, units, setups, unknownFiles };
```

### `src/editor/project/test-gate.ts` (edited)

```diff
diff --git a/src/editor/project/test-gate.ts b/src/editor/project/test-gate.ts
index 1a60ea7..ec76113 100644
--- a/src/editor/project/test-gate.ts
+++ b/src/editor/project/test-gate.ts
@@ -10,8 +10,10 @@ const SAY: Readonly<Record<string, string>> = {
   notAProject: "Can't open: project.json missing",
   "play: seed": "Stage 1 has no seed yet, so it can't be played",
   "play: army": "This project has no unit roster yet, so it can't be played",
+  assetFileMissing: "A picture this project uses is missing",
+  assetHashMismatch: "A picture this project uses doesn't match its file",
 };
-export const sentence = (row: ReportRow): string => SAY[row.code] ?? `Can't play: ${row.code}`;
+export const sentence = (row: ReportRow): string => { const line = SAY[row.code] ?? `Can't play: ${row.code}`; return row.code.startsWith("asset") ? `${line}: ${row.path}` : line; };
 /** Map a play-stage throw (`play: seed`, `play: army`) onto the sheet sentence. Other text stays as written. */
 export const playLine = (error: string): string => { const line = SAY[error]; if (line !== undefined) return line; return error === "" ? "Can't play this project" : error; };
 const placed = (v: unknown): number => (Array.isArray(v) ? v.filter((row) => typeof row === "object" && row !== null && !Array.isArray(row)).length : 0);
```

### `src/runtime/render/types.ts` (edited)

```diff
diff --git a/src/runtime/render/types.ts b/src/runtime/render/types.ts
index f698eed..8709df0 100644
--- a/src/runtime/render/types.ts
+++ b/src/runtime/render/types.ts
@@ -22,7 +22,9 @@ export type Standing = { readonly kind: "object" | "unit" | "fxBehind" | "fxFron
 /** Anything drawn above the world: wash, effect air, glow or UI. `x`/`y` are top-left in world art px. */
 export type Overlay = { readonly band: Exclude<Band, "base">; readonly sheet: Sheet; readonly x: number; readonly y: number; readonly frame?: number; readonly clip?: Clip; readonly startMs?: number; readonly op?: DrawOp; readonly selfLit?: boolean; readonly look?: string; readonly scale?: number };
 export type SceneDot = { readonly band: Exclude<Band, "base" | "ui">; readonly x: number; readonly y: number; readonly size: number; readonly colour: string; readonly alpha: number };
-export type RenderScene = { readonly cols: number; readonly rows: number; readonly tileW: number; readonly tileH: number; readonly mapSeed: number; readonly ground: readonly TileLayer[]; readonly above: readonly TileLayer[]; readonly standing: readonly Standing[]; readonly overlays: readonly Overlay[]; readonly dots?: readonly SceneDot[]; readonly dueMs?: number };
+/** A map background picture. `depth` 1 scrolls with the map; 0 stays on screen. Drawn at native size, never scaled. */
+export type Backdrop = { readonly sheet: Sheet; readonly depth: number; readonly repeat: "none" | "x" | "y" | "both" };
+export type RenderScene = { readonly cols: number; readonly rows: number; readonly tileW: number; readonly tileH: number; readonly mapSeed: number; readonly ground: readonly TileLayer[]; readonly above: readonly TileLayer[]; readonly standing: readonly Standing[]; readonly overlays: readonly Overlay[]; readonly dots?: readonly SceneDot[]; readonly dueMs?: number; readonly backdrop?: readonly Backdrop[] };
 export type DrawList = { readonly cmds: readonly DrawCmd[]; readonly dueMs: number };
 /** The draw adapter (ARCH §12.4). Canvas2D (step 28) and WebGL2 (later) implement it; the test backend lives in tests/. */
 export interface Renderer {
```

### `src/runtime/render/index.ts` (edited)

```diff
diff --git a/src/runtime/render/index.ts b/src/runtime/render/index.ts
index f91a739..cd8cf29 100644
--- a/src/runtime/render/index.ts
+++ b/src/runtime/render/index.ts
@@ -1,4 +1,4 @@
-export { BANDS, type Anchor, type Band, type Cam, type Clip, type DrawCmd, type DrawList, type DrawOp, type Fit, type FrameStamp, type Overlay, type RenderScene, type Renderer, type SceneDot, type Sheet, type Standing, type TileLayer, type TileMotion } from "./types.ts";
+export { BANDS, type Anchor, type Backdrop, type Band, type Cam, type Clip, type DrawCmd, type DrawList, type DrawOp, type Fit, type FrameStamp, type Overlay, type RenderScene, type Renderer, type SceneDot, type Sheet, type Standing, type TileLayer, type TileMotion } from "./types.ts";
 export { backingSize, fitView, scaleRange, snapScale } from "./fit.ts";
 export { clampCamera, easeCamera, px, snapCamera, toDevice } from "./camera.ts";
 export { badMs, clipMs, footAt, frameAt, hash32, instanceOffset } from "./frames.ts";
```

### `src/runtime/render/draw-list.ts` (edited)

```diff
diff --git a/src/runtime/render/draw-list.ts b/src/runtime/render/draw-list.ts
index 3745ad7..b2934b4 100644
--- a/src/runtime/render/draw-list.ts
+++ b/src/runtime/render/draw-list.ts
@@ -45,6 +45,12 @@ export function buildDrawList(scene: RenderScene, fit: Fit, cam: Cam, tMs: numbe
       }
     }
   };
+  for (const layer of scene.backdrop ?? []) {
+    const sh = layer.sheet; if (!(sh.fw > 0) || !(sh.fh > 0)) continue;
+    const ox = Math.floor(viewX0 * (1 - layer.depth)), oy = Math.floor(viewY0 * (1 - layer.depth)), rx = layer.repeat === "x" || layer.repeat === "both", ry = layer.repeat === "y" || layer.repeat === "both";
+    const xStart = rx ? ox + Math.floor((viewX0 - ox) / sh.fw) * sh.fw - sh.fw : ox, yStart = ry ? oy + Math.floor((viewY0 - oy) / sh.fh) * sh.fh - sh.fh : oy, xEnd = rx ? viewX1 + sh.fw : ox + 1, yEnd = ry ? viewY1 + sh.fh : oy + 1;
+    for (let y = yStart; y < yEnd; y += sh.fh) for (let x = xStart; x < xEnd; x += sh.fw) push("base", sh, () => ({ frame: 0, nextMs: Infinity }), x, y, "normal", false);
+  }
   cells(scene.ground);
   const paint = (list: readonly Overlay[]): void => {
     for (const { o } of list.map((o, i) => ({ o, i })).sort((a, b) => BANDS.indexOf(a.o.band) - BANDS.indexOf(b.o.band) || a.i - b.i)) {
```

### `src/runtime/render/chunk-plan.ts` (edited)

```diff
diff --git a/src/runtime/render/chunk-plan.ts b/src/runtime/render/chunk-plan.ts
index 3e2eb4a..cac4c17 100644
--- a/src/runtime/render/chunk-plan.ts
+++ b/src/runtime/render/chunk-plan.ts
@@ -11,7 +11,8 @@ export function chunkedList(scene: RenderScene, fit: Fit, cam: Cam, tMs: number,
   let dueMs = Infinity;
   const add = (list: DrawList): void => { for (const cmd of list.cmds) cmds.push(cmd); if (list.dueMs < dueMs) dueMs = list.dueMs; };
   const x0 = Math.floor(cam.devX / fit.s), y0 = Math.floor(cam.devY / fit.s), x1 = x0 + fit.artW + 1, y1 = y0 + fit.artH + 1;
-  const one = (layer: TileLayer, above: boolean): DrawList => buildDrawList({ ...scene, ground: above ? [] : [layer], above: above ? [layer] : [], standing: [], overlays: [], dots: [] }, fit, cam, tMs, stepMs);
+  const { backdrop, ...quiet } = scene;
+  const one = (layer: TileLayer, above: boolean): DrawList => buildDrawList({ ...quiet, ground: above ? [] : [layer], above: above ? [layer] : [], standing: [], overlays: [], dots: [] }, fit, cam, tMs, stepMs);
   const paint = (rows: readonly TileLayer[], above: boolean): void => {
     for (let li = 0; li < rows.length; li += 1) {
       const layer = rows[li];
@@ -30,9 +31,10 @@ export function chunkedList(scene: RenderScene, fit: Fit, cam: Cam, tMs: number,
       add(one({ ...layer, tiles: anim }, above));
     }
   };
+  if (backdrop !== undefined && backdrop.length > 0) add(buildDrawList({ ...scene, ground: [], above: [], standing: [], overlays: [], dots: [] }, fit, cam, tMs, stepMs));
   paint(scene.ground, false);
-  add(buildDrawList({ ...scene, ground: [], above: [], overlays: [], dots: [] }, fit, cam, tMs, stepMs));
+  add(buildDrawList({ ...quiet, ground: [], above: [], overlays: [], dots: [] }, fit, cam, tMs, stepMs));
   paint(scene.above, true);
-  add(buildDrawList({ ...scene, ground: [], above: [], standing: [] }, fit, cam, tMs, stepMs));
+  add(buildDrawList({ ...quiet, ground: [], above: [], standing: [] }, fit, cam, tMs, stepMs));
   return { cmds, dueMs };
 }
```

### `tools/play-stage/backdrop.ts` (new)

```
export type BackLayer = { readonly assetId: string; readonly file: string; readonly depth: number; readonly repeat: "none" | "x" | "y" | "both" };
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
/** Look data only. `fit` is ignored (cover/stretch read as none). No ext skips the layer. Depth clamps to 0..1; absent or not finite is 1. */
export function backdropOf(project: unknown, map: unknown): BackLayer[] {
  const root = isObj(project) ? project : {}, inner = isObj(root["project"]) ? root["project"] : root, assets = isObj(inner["assets"]) ? inner["assets"] : isObj(root["assets"]) ? root["assets"] : {};
  const bg = isObj(map) && isObj(map["background"]) ? map["background"] : {}, layers = Array.isArray(bg["layers"]) ? bg["layers"] : [], out: BackLayer[] = [];
  for (const layer of layers) {
    if (!isObj(layer) || typeof layer["assetId"] !== "string") continue;
    const meta = assets[layer["assetId"]]; if (!isObj(meta) || typeof meta["ext"] !== "string") continue;
    const raw = layer["depth"], depth = typeof raw === "number" && Number.isFinite(raw) ? Math.min(1, Math.max(0, raw)) : 1, rep = layer["repeat"];
    out.push({ assetId: layer["assetId"], file: `assets/${layer["assetId"]}.${meta["ext"]}`, depth, repeat: rep === "x" || rep === "y" || rep === "both" || rep === "none" ? rep : "none" });
  }
  return out;
}
```

### `tools/play-stage/load.ts` (edited)

```diff
diff --git a/tools/play-stage/load.ts b/tools/play-stage/load.ts
index 0290107..7a1491b 100644
--- a/tools/play-stage/load.ts
+++ b/tools/play-stage/load.ts
@@ -20,7 +20,7 @@ export const RECIPES: Readonly<Record<string, Recipe>> = Object.freeze({
 export const recipeIn = (map: Readonly<Record<string, Recipe>>, id: string): Recipe => (Object.hasOwn(map, id) ? map[id] ?? fallback(id) : fallback(id));
 export const recipeOf = (id: string): Recipe => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
 export type Looks = { readonly canopy: readonly (readonly [number, number])[]; readonly braziers: readonly (readonly [number, number])[] };
-export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly links?: readonly CoreLink[]; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly bench?: readonly { readonly unitId: string; readonly hp: number }[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>>; readonly win?: WinRule; readonly levels?: LevelSetup };
+export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly links?: readonly CoreLink[]; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly bench?: readonly { readonly unitId: string; readonly hp: number }[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>>; readonly win?: WinRule; readonly levels?: LevelSetup; readonly backdrop?: readonly { readonly assetId: string; readonly file: string; readonly depth: number; readonly repeat: "none" | "x" | "y" | "both" }[]; readonly art?: (file: string) => Promise<Blob | null> };
 export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>>; readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[] }): { input: SimInput; talk: Readonly<Record<string, string>> } {
   const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
   if (hostSeed === undefined) throw new Error("play: seed");
```

### `tools/play-stage/project.ts` (edited)

```diff
diff --git a/tools/play-stage/project.ts b/tools/play-stage/project.ts
index aa98621..0f1b5da 100644
--- a/tools/play-stage/project.ts
+++ b/tools/play-stage/project.ts
@@ -12,6 +12,7 @@ import { TERRAIN } from "../../src/rules/behaviours/terrain.ts";
 import { STEP_PATTERN } from "../../src/rules/move/step-pattern.ts";
 import type { CoreTileType } from "../../src/types/core-types.ts";
 import { docsToInput, RECIPES, type Looks, type PlayDocs, type Recipe } from "./load.ts";
+import { backdropOf } from "./backdrop.ts";
 import { DEMO_LOOKS } from "./looks.ts";
 import project from "../../fixtures/demo.tileproj/project.json" with { type: "json" }; import slice from "../../fixtures/demo.tileproj/catalogue/slice.json" with { type: "json" }; import mapFile from "../../fixtures/demo.tileproj/maps/map_01JDAM00000000000000000001.json" with { type: "json" }; import stageFile from "../../fixtures/demo.tileproj/stages/stage_01JDAS00000000000000000001.json" with { type: "json" };
 import u1 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000001.json" with { type: "json" }; import u2 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000002.json" with { type: "json" }; import u3 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000003.json" with { type: "json" }; import u4 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000004.json" with { type: "json" };
@@ -75,8 +76,8 @@ export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
   }
   const tiles = installOne(TERRAIN, {}).out?.tiles; if (tiles === undefined) throw new Error("play: terrain");
   const recipes: Record<string, Recipe> = { ...RECIPES }; for (const [id, name] of Object.entries(names)) { const hit = Object.values(RECIPES).find((r) => r.name === name); if (hit !== undefined) recipes[id] = hit; }
-  const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length), win = winOf(store, stage), levels = levelsOf(store, stage);
-  return { manifest: store.manifest, map, stage, links: core.doc.links ?? [], rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes, ...(win === undefined ? {} : { win }), ...(levels === undefined ? {} : { levels }) };
+  const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length), win = winOf(store, stage), levels = levelsOf(store, stage), backdrop = backdropOf(root, map);
+  return { manifest: store.manifest, map, stage, links: core.doc.links ?? [], rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes, ...(win === undefined ? {} : { win }), ...(levels === undefined ? {} : { levels }), ...(backdrop.length === 0 ? {} : { backdrop }) };
 }
 export function openProject(files: ProjectFiles, stageId?: string): { docs: (PlayOut & { readonly looks: Looks }) | null; error: string } {
   try {
```

### `tools/play-stage/page.ts` (edited)

```diff
diff --git a/tools/play-stage/page.ts b/tools/play-stage/page.ts
index 0047c0d..8d63934 100644
--- a/tools/play-stage/page.ts
+++ b/tools/play-stage/page.ts
@@ -19,6 +19,9 @@ const canvas = document.querySelector("#board");
 if (!(canvas instanceof HTMLCanvasElement)) throw new Error("play: #board");
 const match = createMatch(docs);
 const link = createSceneLink(sourceOf((id) => match.pixels(id))), lighting = createLighting(), pixels = picturesOf((id) => match.pixels(id), link);
+const sheets = new Map<string, OffscreenCanvas>(), misses: string[] = [];
+type BackSheet = { readonly sheet: { readonly id: string; readonly columns: number; readonly fw: number; readonly fh: number }; readonly depth: number; readonly repeat: "none" | "x" | "y" | "both" };
+let painted: BackSheet[] | null = null, held: { src: object; list: BackSheet[] | null; scene: ReturnType<typeof link.scene> } | null = null;
 const cam: PlayCam = createCam(1);
 let seated = false;
 const dpr = (): number => devicePixelRatio || 1;
@@ -29,6 +32,7 @@ const band = (): { s: number; padX: number; padY: number; devW: number; devH: nu
 const seat = (): void => { const box = band(); if (canvas.clientWidth > 0) { seatCam(cam, box.s, dpr()); seated = true; } };
 const env = { requestAnimationFrame: (cb: (ts: number) => void) => requestAnimationFrame(cb), cancelAnimationFrame: (id: number) => cancelAnimationFrame(id), document, OffscreenCanvas, ResizeObserver, get devicePixelRatio() { return devicePixelRatio; } } as HostEnv;
 const load = (id: string): Promise<OffscreenCanvas> => {
+  const ready = sheets.get(id); if (ready !== undefined) return Promise.resolve(ready);
   const px = pixels(id);
   if (px === undefined) return Promise.reject(new Error(id));
   const baked = new OffscreenCanvas(px.w, px.h), g = baked.getContext("2d");
@@ -48,10 +52,18 @@ const driver = createDriver({
     if (!seated) seat();
     const box = band(), shown = fitView(box.devW, box.devH, cam.s, TILE, TILE);
     if (match.followId !== null) { const u = match.world.units.get(match.followId); if (u !== undefined) tickCam(cam, 16, u.at, shown); }
-    hud.render(match.view());
-    return { scene: link.scene(match.scene(), { tMs: match.world.clock.now(), stepMs: match.world.clock.stepMs }), lights: litPlan(lighting, match.looks, link.lit), shake: link.shake, x: cam.x, y: cam.y, s: cam.s };
+    const seen = match.view(), note = misses.length === 0 ? seen.note : seen.note === null ? misses.join("\n") : `${seen.note}\n${misses.join("\n")}`; hud.render({ ...seen, note });
+    const base = link.scene(match.scene(), { tMs: match.world.clock.now(), stepMs: match.world.clock.stepMs }), scene = painted === null || painted.length === 0 ? base : held !== null && held.src === base && held.list === painted ? held.scene : (held = { src: base, list: painted, scene: { ...base, backdrop: painted } }).scene;
+    return { scene, lights: litPlan(lighting, match.looks, link.lit), shake: link.shake, x: cam.x, y: cam.y, s: cam.s };
   },
 });
+void Promise.all((docs.backdrop ?? []).map(async (layer) => {
+  try {
+    const blob = docs.art === undefined ? null : await docs.art(layer.file);
+    if (blob === null) { misses.push(`Background picture missing: ${layer.file}`); driver.stats.failed += 1; return null; }
+    const bmp = await createImageBitmap(blob), canvas = new OffscreenCanvas(bmp.width, bmp.height), g = canvas.getContext("2d"); if (g === null) throw new Error(layer.file); g.imageSmoothingEnabled = false; g.drawImage(bmp, 0, 0); sheets.set(layer.assetId, canvas); return { sheet: { id: layer.assetId, columns: 1, fw: bmp.width, fh: bmp.height }, depth: layer.depth, repeat: layer.repeat };
+  } catch { misses.push(`Background picture ${layer.file} couldn't be opened`); driver.stats.failed += 1; return null; }
+})).then((rows) => { const list = rows.flatMap((row) => row === null ? [] : [row]); painted = list; held = null; if (list.length > 0) match.bare(); });
 const touch = createTouch({ match, cam, box: () => { const ratio = dpr(), rect = canvas.getBoundingClientRect(), raw = canvas.width === 300 && canvas.height === 150, devW = !raw && canvas.width > 0 ? canvas.width : canvas.clientWidth * ratio, devH = !raw && canvas.height > 0 ? canvas.height : canvas.clientHeight * ratio; return { devW, devH, kx: rect.width > 0 && !raw && canvas.width > 0 ? canvas.width / rect.width : ratio, ky: rect.height > 0 && !raw && canvas.height > 0 ? canvas.height / rect.height : ratio, cols: match.world.grid.cols, rows: match.world.grid.rows }; } });
 for (const k of ["pointerdown", "pointermove", "pointerup", "pointercancel", "lostpointercapture"] as const) canvas.addEventListener(k, (e) => { const p = { id: e.pointerId, offsetX: e.offsetX, offsetY: e.offsetY, clientX: e.clientX, clientY: e.clientY, timeStamp: e.timeStamp, pointerType: e.pointerType }; if (k === "pointerdown") { canvas.setPointerCapture(e.pointerId); touch.down(p); } else if (k === "pointermove") touch.move(p); else if (k === "pointerup") touch.up(p); else touch.cancel(p); });
 const place = (): void => { const box = boardBox(innerHeight - (match.view().xp === null ? 0 : XP_H)); Object.assign(canvas.style, { position: "fixed", left: "0", right: "0", width: "100%", top: `${box.top}px`, height: `${box.height}px`, touchAction: "none" }); };
```

### `tools/play-stage/looks.ts` (edited)

```diff
diff --git a/tools/play-stage/looks.ts b/tools/play-stage/looks.ts
index dc402a5..096d5aa 100644
--- a/tools/play-stage/looks.ts
+++ b/tools/play-stage/looks.ts
@@ -42,9 +42,9 @@ export function dressPx(id: string): Pixels | undefined {
 }
 type Grid = { readonly cols: number; readonly rows: number; tileTypeAt(at: { readonly c: number; readonly r: number }): { readonly id: string } };
 const cycle = (name: string, n: number) => ({ cycle: { ramp: { name, steps: Array.from({ length: n }, (_, i) => i) } } });
-export function dress(grid: Grid, looks?: Looks) {
-  const n = grid.cols * grid.rows, tiles: number[] = [], blocks = new Uint8Array(n);
-  for (let i = 0; i < n; i += 1) { const id = grid.tileTypeAt({ c: i % grid.cols, r: (i / grid.cols) | 0 }).id, tile = id === "water" ? 1 : id === "wall-block" ? 2 : 0; tiles.push(tile); if (tile === 2) blocks[i] = 1; }
+export function dress(grid: Grid, looks?: Looks, bare = false) {
+  const n = grid.cols * grid.rows, tiles: (number | null)[] = [], blocks = new Uint8Array(n);
+  for (let i = 0; i < n; i += 1) { const id = grid.tileTypeAt({ c: i % grid.cols, r: (i / grid.cols) | 0 }).id, tile = id === "water" ? 1 : id === "wall-block" ? 2 : bare ? null : 0; tiles.push(tile); if (tile === 2) blocks[i] = 1; }
   const canopy = looks === undefined ? undefined : Array.from({ length: n }, () => null as number | null);
   if (looks !== undefined && canopy !== undefined) for (const [c, r] of looks.canopy) canopy[r * grid.cols + c] = 0;
   const assets: Record<string, SceneAsset> = { "play:ground": { sheet: { id: "play:ground", columns: 3, fw: TILE, fh: TILE }, styled: true, tileProps: { "1": { motion: cycle("water", 3) } } } };
```

### `tools/play-stage/board.ts` (edited)

```diff
diff --git a/tools/play-stage/board.ts b/tools/play-stage/board.ts
index f9ea85d..5a58f29 100644
--- a/tools/play-stage/board.ts
+++ b/tools/play-stage/board.ts
@@ -75,7 +75,8 @@ export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
   const player = createPlayer(world, { side: sides.me, moveMs, nextId: () => `p${n += 1}`, step, spellOf: (id) => { const u = world.units.get(id); return u === undefined ? undefined : spellRef(body.rules, u.unitId); } });
   const bot = botAbilityPriority({ setup: body.rules, stepReach: step.reach, actionsPerTurn: budget.actionsPerTurn });
   const gestures = createGestureMapper({ cellPx: TILE, tapMaxPx: 12, holdMs: 500 }, { cols: world.grid.cols, rows: world.grid.rows, unitAt: (at) => world.units.occupantAt(at) });
-  const fx = createPlayFx(body.effects), looks = dress(world.grid, body.looks), paint = new Map<string, { readonly sprite: string; readonly asset: SceneAsset }>(), seen = new Map<string, string>();
+  const fx = createPlayFx(body.effects), paint = new Map<string, { readonly sprite: string; readonly asset: SceneAsset }>(), seen = new Map<string, string>();
+  let looks = dress(world.grid, body.looks);
   for (const u of world.units.all()) { const recipeId = recipeIn(body.recipes, u.unitId).id, tone = paintOf(u.side, sides.me), prior = seen.get(recipeId); if (prior === undefined) seen.set(recipeId, tone); paint.set(u.id, { sprite: prior === undefined || prior === tone ? recipeId : `${recipeId}@${tone}`, asset: unitAsset(`${recipeId}@${tone}`) }); }
   let selected: string | null = null, pending: Sq | null = null, reach: Sq[] = [], preview: Sq[] = [], walk: Walk | null = null, aims: Sq[] = [], aimKind: "basic" | "spell" = "basic", followId: string | null = null, onLand: (() => void) | null = null;
   let route: (intent: DoorIntent) => unknown = (intent) => intend(intent);
@@ -118,6 +119,7 @@ export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
   };
   return {
     world, step, intend, sync, bot, pixels: pixelsOf, autoWait, go, fx, looks, sides,
+    bare(): void { looks = dress(world.grid, body.looks, true); },
     focus(id: string | null): void { selected = id; pending = null; preview = []; mark(); },
     arm(next: Walk): void { walk = next; sync(); },
     landed(fn: (() => void) | null): void { onLand = fn; },
```

### `tools/maker/store.ts` (edited)

```diff
diff --git a/tools/maker/store.ts b/tools/maker/store.ts
index ad28718..e71f8e1 100644
--- a/tools/maker/store.ts
+++ b/tools/maker/store.ts
@@ -1,19 +1,19 @@
 import { opfsStore, type Dir } from "../effect-designer/store.ts";
-export type MakerStore = { read(path: string): Promise<string | null>; write(path: string, text: string): Promise<void>; remove(path: string): Promise<void>; list(dir: string): Promise<string[]>; rename(from: string, to: string): Promise<void> };
+export type MakerStore = { read(path: string): Promise<string | null>; readBlob(path: string): Promise<Blob | null>; write(path: string, text: string): Promise<void>; remove(path: string): Promise<void>; list(dir: string): Promise<string[]>; rename(from: string, to: string): Promise<void> };
 export type WriteResult = { readonly ok: true } | { readonly ok: false; readonly error: "writeFailed"; readonly path: string; readonly message: string; readonly rows: readonly { readonly code: "writeFailed"; readonly severity: "hard"; readonly path: string; readonly detail: string }[] };
 type Handle = { move?: (dir: Dir, name: string) => Promise<void> };
 const failed = (path: string): WriteResult => { const message = `Couldn't save ${path}. Your phone may be full. Your last save is safe.`; return { ok: false, error: "writeFailed", path, message, rows: [{ code: "writeFailed", severity: "hard", path, detail: message }] }; };
 export function memoryStore(): MakerStore & { readonly files: Map<string, string>; failOn(path: string): void } {
   const files = new Map<string, string>(); let fail = "";
-  return { files, failOn(path) { fail = path; }, async read(path) { return files.has(path) ? files.get(path) ?? "" : null; }, async write(path, text) { if (fail !== "" && path === fail) throw new Error("full"); files.set(path, text); }, async remove(path) { files.delete(path); }, async rename(from, to) { if (fail !== "" && to === fail) throw new Error("full"); const text = files.get(from); if (text === undefined) throw new Error(`missing ${from}`); files.set(to, text); files.delete(from); }, async list(dir) { const pre = dir.endsWith("/") ? dir : `${dir}/`, names = new Set<string>(); for (const key of files.keys()) if (key.startsWith(pre)) { const rest = key.slice(pre.length), cut = rest.indexOf("/"); if (rest !== "") names.add(cut === -1 ? rest : rest.slice(0, cut)); } return [...names].sort(); } };
+  return { files, failOn(path) { fail = path; }, async read(path) { return files.has(path) ? files.get(path) ?? "" : null; }, async readBlob(path) { const text = files.get(path); return text === undefined ? null : new Blob([text]); }, async write(path, text) { if (fail !== "" && path === fail) throw new Error("full"); files.set(path, text); }, async remove(path) { files.delete(path); }, async rename(from, to) { if (fail !== "" && to === fail) throw new Error("full"); const text = files.get(from); if (text === undefined) throw new Error(`missing ${from}`); files.set(to, text); files.delete(from); }, async list(dir) { const pre = dir.endsWith("/") ? dir : `${dir}/`, names = new Set<string>(); for (const key of files.keys()) if (key.startsWith(pre)) { const rest = key.slice(pre.length), cut = rest.indexOf("/"); if (rest !== "") names.add(cut === -1 ? rest : rest.slice(0, cut)); } return [...names].sort(); } };
 }
 export function makerStore(root: Dir): MakerStore {
   const base = opfsStore(root);
-  return { read: (path) => base.read(path), write: (path, text) => base.write(path, text), remove: (path) => base.remove(path), list: (dir) => base.list(dir), async rename(from, to) { const parts = from.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, {}); const handle = await dir.getFileHandle(leaf) as Handle, destParts = to.split("/"), destLeaf = destParts.pop() ?? ""; let dest = root; for (const part of destParts) dest = await dest.getDirectoryHandle(part, { create: true }); if (handle.move !== undefined) { await handle.move(dest, destLeaf); return; } const text = await base.read(from); if (text === null) throw new Error(`missing ${from}`); await base.write(to, text); await base.remove(from); } };
+  return { read: (path) => base.read(path), async readBlob(path) { try { const parts = path.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, {}); const got = await (await dir.getFileHandle(leaf)).getFile(); return got instanceof Blob ? got : null; } catch (e) { if (e instanceof Error && (e.name === "NotFoundError" || e.name === "TypeMismatchError")) return null; throw e; } }, write: (path, text) => base.write(path, text), remove: (path) => base.remove(path), list: (dir) => base.list(dir), async rename(from, to) { const parts = from.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, {}); const handle = await dir.getFileHandle(leaf) as Handle, destParts = to.split("/"), destLeaf = destParts.pop() ?? ""; let dest = root; for (const part of destParts) dest = await dest.getDirectoryHandle(part, { create: true }); if (handle.move !== undefined) { await handle.move(dest, destLeaf); return; } const text = await base.read(from); if (text === null) throw new Error(`missing ${from}`); await base.write(to, text); await base.remove(from); } };
 }
 export async function readTree(store: MakerStore, folder: string): Promise<Record<string, string>> {
   const out: Record<string, string> = {}, pre = folder.endsWith("/") ? folder : `${folder}/`;
-  const walk = async (dir: string, rel: string): Promise<void> => { for (const name of await store.list(dir)) { const child = `${dir}${name}`, next = rel === "" ? name : `${rel}/${name}`; let text: string | null = null, dirChild = false; try { text = await store.read(child); } catch (e) { if (e instanceof Error && e.name === "TypeMismatchError") dirChild = true; else throw e; } if (dirChild || (text === null && (await store.list(`${child}/`)).length > 0)) await walk(`${child}/`, next); else if (text !== null) out[next] = text; else throw new Error(`missing ${child}`); } };
+  const walk = async (dir: string, rel: string): Promise<void> => { for (const name of await store.list(dir)) { if (rel === "" && name === "assets") continue; const child = `${dir}${name}`, next = rel === "" ? name : `${rel}/${name}`; let text: string | null = null, dirChild = false; try { text = await store.read(child); } catch (e) { if (e instanceof Error && e.name === "TypeMismatchError") dirChild = true; else throw e; } if (dirChild || (text === null && (await store.list(`${child}/`)).length > 0)) await walk(`${child}/`, next); else if (text !== null) out[next] = text; else throw new Error(`missing ${child}`); } };
   await walk(pre, ""); return out;
 }
 export async function commitWrites(store: MakerStore, folder: string, writes: readonly { readonly path: string; readonly text: string }[]): Promise<WriteResult> {
@@ -24,7 +24,9 @@ export async function commitWrites(store: MakerStore, folder: string, writes: re
   return { ok: true };
 }
 export async function movePrefix(store: MakerStore, from: string, to: string): Promise<void> {
-  const files = await readTree(store, from), src = from.endsWith("/") ? from : `${from}/`, dest = to.endsWith("/") ? to : `${to}/`, wrote: string[] = [];
+  const src = from.endsWith("/") ? from : `${from}/`, dest = to.endsWith("/") ? to : `${to}/`;
+  for (const name of await store.list(`${src}assets/`)) await store.rename(`${src}assets/${name}`, `${dest}assets/${name}`);
+  const files = await readTree(store, from), wrote: string[] = [];
   for (const [rel, text] of Object.entries(files)) { try { await store.write(`${dest}${rel}`, text); wrote.push(rel); } catch (e) { for (const relDone of wrote) await store.remove(`${dest}${relDone}`); throw e; } }
   for (const rel of Object.keys(files)) await store.remove(`${src}${rel}`);
   const drop = async (dir: string): Promise<void> => { const pre = dir.endsWith("/") ? dir : `${dir}/`; for (const name of await store.list(pre)) await drop(`${pre}${name}`); await store.remove(pre.slice(0, -1)); };
```

### `tools/maker/test-launch.ts` (edited)

```diff
diff --git a/tools/maker/test-launch.ts b/tools/maker/test-launch.ts
index a8a17fa..01b478a 100644
--- a/tools/maker/test-launch.ts
+++ b/tools/maker/test-launch.ts
@@ -11,6 +11,7 @@ import { openProject, arriveIn, type PlayOut } from "../play-stage/project.ts";
 import type { LinkEvent } from "../../src/rules/session/links.ts";
 import { parseProject } from "./project-files.ts";
 import { commitWrites, readTree, type MakerStore } from "./store.ts";
+import { assetRows } from "./asset-check.ts";
 export type PlayReady = PlayOut & { readonly looks: Looks };
 export type AimAt = { readonly unitId?: string; readonly abilityId?: string; readonly aim?: "basic" | "spell" };
 export type Next = (from: PlayReady, link: LinkEvent, party: SessionParty) => { readonly docs: PlayReady | null; readonly error: string };
@@ -24,15 +25,16 @@ const showUrl = (id: string, stage: string, from: string, aim?: AimAt): void =>
 function resumed(files: Parameters<typeof openProject>[0], save: SessionSave): { readonly docs: (PlayOut & { readonly looks: Looks }) | null; readonly error: string; readonly notes: readonly Notice[] } {
   const root = files["project.json"], rec = (v: unknown): Record<string, unknown> | null => (typeof v === "object" && v !== null && !Array.isArray(v) ? v as Record<string, unknown> : null), project = rec(rec(root)?.["project"]), list = project?.["stages"], stages = Array.isArray(list) ? list.filter((id): id is string => typeof id === "string") : [], units: string[] = [], bag: Record<string, Record<string, unknown>> = {}; for (const [path, doc] of Object.entries(files)) { const row = rec(doc); if (row !== null) { bag[path] = row; if (path.startsWith("units/") && typeof row["id"] === "string") units.push(row["id"]); } } const kept = settleSession(save, stages, units, startOf(bag) ?? stages[0] ?? ""); const got = arriveIn(files, kept.from, kept.to, kept.party); return { docs: got.docs, error: got.error, notes: kept.notes };
 }
-function play(input: LaunchBag, text: DocText): Launch {
+async function play(input: LaunchBag, text: DocText): Promise<Launch> {
   const parsed = parseProject(text);
   if (!parsed.ok) return fail([parsed.message], text, 0);
-  const load = readProject(parsed.files), gate = testGate(load.report, load.readOnly), rev = storedRev(parsed.files);
+  const load = readProject(parsed.files), rows = await assetRows(input.store, prefix(input.id), parsed.files), gate = testGate([...load.report, ...rows], load.readOnly), rev = storedRev(parsed.files);
   if (!gate.allowed) return fail(gate.lines, text, rev);
   const opened = input.resume === undefined ? (input.stageId === undefined ? openProject(parsed.files) : openProject(parsed.files, input.stageId)) : resumed(parsed.files, input.resume);
   if (opened.docs === null) return fail([playLine(opened.error)], text, rev);
   if (emptyBoard(opened.docs)) return fail(["Place a unit on this stage to test it."], text, rev);
-  try { input.start(opened.docs, input.aim, (from, link, party) => arriveIn(parsed.files, stageOf(from), link.to, party)); } catch (e) { if (!(e instanceof Error)) throw e; return fail([playLine(e.message)], text, rev); }
+  const art = (file: string): Promise<Blob | null> => input.store.readBlob(`${prefix(input.id)}${file}`);
+  try { input.start({ ...opened.docs, art }, input.aim, (from, link, party) => { const got = arriveIn(parsed.files, stageOf(from), link.to, party); return got.docs === null ? got : { docs: { ...got.docs, art }, error: got.error }; }); } catch (e) { if (!(e instanceof Error)) throw e; return fail([playLine(e.message)], text, rev); }
   showUrl(input.id, stageOf(opened.docs), input.from, input.aim); const notes = "notes" in opened ? opened.notes : []; return notes.length > 0 ? { ok: true, files: text, rev, notes } : { ok: true, files: text, rev };
 }
 /** Read a saved folder and start its stage. No demo fallback. */
```

### `tools/maker/asset-check.ts` (new)

```
import { migrateProject } from "../../src/project/load/migrate.ts";
import type { ReportRow } from "../../src/project/load/types.ts";
import type { MakerStore } from "./store.ts";
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const hex = (buf: ArrayBuffer): string => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
function usedIds(project: Record<string, unknown>, files: Readonly<Record<string, unknown>>): Set<string> {
  const render = isObj(project["render"]) ? project["render"] : {}, excluded = new Set(Array.isArray(render["excludedStages"]) ? render["excludedStages"].filter((id): id is string => typeof id === "string") : []);
  const stages = new Set((Array.isArray(project["stages"]) ? project["stages"] : []).filter((id): id is string => typeof id === "string" && !excluded.has(id))), maps = new Set<string>(), used = new Set<string>();
  for (const doc of Object.values(files)) if (isObj(doc) && typeof doc["id"] === "string" && stages.has(doc["id"]) && typeof doc["mapRef"] === "string") maps.add(doc["mapRef"]);
  for (const doc of Object.values(files)) if (isObj(doc) && typeof doc["id"] === "string" && maps.has(doc["id"])) { const layers = isObj(doc["background"]) && Array.isArray(doc["background"]["layers"]) ? doc["background"]["layers"] : []; for (const layer of layers) if (isObj(layer) && typeof layer["assetId"] === "string") used.add(layer["assetId"]); }
  return used;
}
/** H4 at Test only. Hard when a selected stage's map names the asset, else a warning. The index entry is kept. */
export async function assetRows(store: MakerStore, folder: string, files: Readonly<Record<string, unknown>>): Promise<ReportRow[]> {
  let docs = files; try { docs = migrateProject(files).files; } catch { docs = files; }
  const root = docs["project.json"], project = isObj(root) && isObj(root["project"]) ? root["project"] : {}, assets = isObj(project["assets"]) ? project["assets"] : {}, used = usedIds(project, docs), pre = folder.endsWith("/") ? folder : `${folder}/`, rows: ReportRow[] = [];
  for (const [id, meta] of Object.entries(assets)) {
    if (!isObj(meta) || typeof meta["ext"] !== "string") continue;
    const path = `assets/${id}.${meta["ext"]}`, blob = await store.readBlob(`${pre}${path}`), severity: ReportRow["severity"] = used.has(id) ? "hard" : "warning";
    if (blob === null) { rows.push({ code: "assetFileMissing", severity, path, detail: id }); continue; }
    const digest = await crypto.subtle.digest("SHA-256", await blob.arrayBuffer());
    if (`asset_${hex(digest).slice(0, 16)}` !== id) rows.push({ code: "assetHashMismatch", severity, path, detail: id });
  }
  return rows;
}
```

### `tools/maker/session.ts` (edited)

```diff
diff --git a/tools/maker/session.ts b/tools/maker/session.ts
index 0aef781..1ed6eec 100644
--- a/tools/maker/session.ts
+++ b/tools/maker/session.ts
@@ -13,11 +13,13 @@ export async function readAutosave(store: MakerStore, want: { readonly projectId
   if (fv < SESSION_FORMAT) { let migrated: Readonly<Record<string, unknown>> | null; try { migrated = migrateSave("session-save", doc, fv, SESSION_FORMAT, chains); } catch { return { ok: false, code: "saveMigrationFailed", needsMigration: true }; } if (migrated === null) return { ok: false, code: "saveFormatOlder", needsMigration: true }; const read = readSession(migrated, want); return !read.ok && read.detail !== "projectId" ? { ok: false, code: "saveMigrationFailed", needsMigration: true } : read; }
   return readSession(doc, want);
 }
-export async function writeAutosave(store: MakerStore, header: SaveHeader, from: string, to: string, party: SessionParty): Promise<{ readonly ok: true; readonly save: SessionSave } | { readonly ok: false; readonly message: string }> {
+let queue: Promise<unknown> = Promise.resolve();
+const lane = <T>(job: () => Promise<T>): Promise<T> => { const run = queue.then(job); queue = run.catch(() => undefined); return run; };
+async function writeOne(store: MakerStore, header: SaveHeader, from: string, to: string, party: SessionParty): Promise<{ readonly ok: true; readonly save: SessionSave } | { readonly ok: false; readonly message: string }> {
   const save = sessionSave(header, from, to, party), check = readSession(save, { projectId: header.projectId, projectHash: header.projectHash, engineVersion: header.engineVersion });
   if (!check.ok) return { ok: false, message: `Autosave skipped: this game can't be saved (${check.detail === undefined ? check.code : `${check.code} ${check.detail}`}).` };
-  const slot = slotOf(header.projectId), prior = await store.read(slot);
-  if (prior !== null) { const got = await readAutosave(store, { projectId: header.projectId, projectHash: header.projectHash, engineVersion: header.engineVersion }); if (got !== null && !got.ok) return { ok: false, message: `Autosave skipped: ${keptLine(got.code)}` }; }
+  const got = await readAutosave(store, { projectId: header.projectId, projectHash: header.projectHash, engineVersion: header.engineVersion }); if (got !== null && !got.ok) return { ok: false, message: `Autosave skipped: ${keptLine(got.code)}` };
   const wrote = await commitWrites(store, `tileengine/saves/${header.projectId}`, [{ path: "autosave.json", text: JSON.stringify(save) }]);
   return wrote.ok ? { ok: true, save } : { ok: false, message: wrote.message };
 }
+export const writeAutosave: typeof writeOne = (store, header, from, to, party) => lane(() => writeOne(store, header, from, to, party));
```

### `tests/editor/art-backgrounds.test.ts` (new)

```
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { prefix } from "../../src/editor/project/home.ts";
import { readProject } from "../../src/project/load/index.ts";
import { buildDrawList, chunkedList, fitView, snapCamera, type RenderScene } from "../../src/runtime/render/index.ts";
import type { SaveHeader, SessionParty } from "../../src/types/core-types.ts";
import { assetRows } from "../../tools/maker/asset-check.ts";
import { slotOf, writeAutosave } from "../../tools/maker/session.ts";
import { memoryStore, movePrefix, readTree } from "../../tools/maker/store.ts";
import { openSaved } from "../../tools/maker/test-launch.ts";
import { backdropOf } from "../../tools/play-stage/backdrop.ts";
import { dress } from "../../tools/play-stage/looks.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
const root = join(dirname(fileURLToPath(import.meta.url)), "../../fixtures/demo.tileproj");
const MAP = "maps/map_01JDAM00000000000000000001.json", PID = "project_01JDAP00000000000000000001", PNG = "asset_00112233445566aa";
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
function textOf(dir: string, base = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const ent of readdirSync(dir, { withFileTypes: true })) { const rel = base === "" ? ent.name : `${base}/${ent.name}`; if (ent.isDirectory()) Object.assign(out, textOf(join(dir, ent.name), rel)); else out[rel] = readFileSync(join(dir, ent.name), "utf8"); }
  return out;
}
const parse = (text: Record<string, string>): Record<string, unknown> => { const out: Record<string, unknown> = {}; for (const [k, v] of Object.entries(text)) out[k] = JSON.parse(v) as unknown; return out; };
const meta = (ext: string) => ({ name: "pic", ext, origin: { kind: "upload", fileName: `pic.${ext}` }, kind: "background" });
async function idOf(bytes: string): Promise<string> { const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(bytes)); return `asset_${[...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16)}`; }
function withArt(id: string, layers: unknown[], assets: Record<string, unknown> = {}, settings?: Record<string, unknown>): Record<string, string> {
  const files = textOf(root), project = JSON.parse(files["project.json"] ?? "{}") as Record<string, unknown>, body = isObj(project["project"]) ? { ...project["project"] } : {};
  body["assets"] = { ...(isObj(body["assets"]) ? body["assets"] : {}), [id]: meta("png"), ...assets }; if (settings !== undefined) body["settings"] = { ...(isObj(body["settings"]) ? body["settings"] : {}), ...settings }; project["project"] = body; files["project.json"] = JSON.stringify(project);
  const map = JSON.parse(files[MAP] ?? "{}") as Record<string, unknown>; map["background"] = { layers }; files[MAP] = JSON.stringify(map); return files;
}
const fit = fitView(160, 96, 1, 16, 16), cam = snapCamera(40, 20, 1), ground = { sheet: { id: "ground", columns: 1, fw: 16, fh: 16 }, tiles: Array.from({ length: 20 * 12 }, () => 1) };
const scene = (backdrop: NonNullable<RenderScene["backdrop"]>): RenderScene => ({ cols: 20, rows: 12, tileW: 16, tileH: 16, mapSeed: 1, ground: [ground], above: [], standing: [], overlays: [], backdrop });
const draw = (backdrop: NonNullable<RenderScene["backdrop"]>) => buildDrawList(scene(backdrop), fit, cam, 0, 16).cmds;
const sky = (depth: number, repeat: "none" | "x" | "y" | "both", fw: number) => ({ sheet: { id: "art", columns: 1, fw, fh: fw }, depth, repeat });
const party: SessionParty = { side: "player", members: [{ unitId: "unit_01JDAN00000000000000000001", hp: 2 }], bar: null };
const header: SaveHeader = { projectHash: "rev:12", engineVersion: "0.0.0", projectId: PID, savedAt: "2026-11-24T00:00:00.000Z" };
async function saved(id: string, file: string | null, assets: Record<string, unknown> = {}, layers?: unknown[]): Promise<ReturnType<typeof memoryStore>> {
  const text = withArt(id, layers ?? [{ assetId: id, depth: 1, repeat: "none" }], assets), store = memoryStore();
  for (const [path, body] of Object.entries(text)) await store.write(`${prefix(PID)}${path}`, body);
  if (file !== null) await store.write(`${prefix(PID)}assets/${id}.png`, file);
  return store;
}
test("background refs: a missing asset is brokenRef, out-of-range depth and over 3 layers warn", () => {
  const good = readProject(parse(withArt(PNG, [{ assetId: PNG, depth: 1, repeat: "none" }]))); assert.equal(good.ok, true); assert.deepEqual([...good.report], []);
  const bad = readProject(parse(withArt(PNG, [{ assetId: "asset_unknownunknown1", depth: 1, repeat: "none" }]))); assert.equal(bad.ok, false); assert.equal(bad.report.length, 1);
  assert.deepEqual(bad.report[0], { code: "brokenRef", severity: "hard", path: `${MAP}#/background/layers/0/assetId`, detail: "asset_unknownunknown1" });
  const four = readProject(parse(withArt(PNG, [{ assetId: PNG, depth: 1.5, repeat: "none" }, { assetId: PNG, depth: -0.25, repeat: "none" }, { assetId: PNG, depth: 1, repeat: "none" }, { assetId: PNG, depth: 1, repeat: "none" }])));
  assert.equal(four.ok, true); assert.deepEqual(four.report.map((r) => [r.code, r.path, r.detail]), [["overCap", `${MAP}#/background/layers`, "4"], ["outOfRange", `${MAP}#/background/layers/0/depth`, undefined], ["outOfRange", `${MAP}#/background/layers/1/depth`, undefined]]);
});
test("backdropOf keeps file order, clamps depth, defaults repeat, and skips a layer with no asset", () => {
  const jpg = "asset_jpg00000000000", layers = backdropOf({ assets: { [PNG]: meta("png"), [jpg]: meta("jpg") } }, { background: { layers: [{ assetId: PNG, depth: 2, repeat: "x" }, { assetId: "asset_missing000000", depth: 1, repeat: "none" }, { assetId: jpg, fit: "stretch" }] } });
  assert.deepEqual(layers.map((row) => [row.depth, row.repeat, row.file]), [[1, "x", `assets/${PNG}.png`], [1, "none", `assets/${jpg}.jpg`]]);
  const plain = readProject(parse(textOf(root))); assert.equal(plain.project !== null && playDocsOf(plain.project).backdrop, undefined);
  const art = readProject(parse(withArt(PNG, [{ assetId: PNG, depth: 0.2, repeat: "y" }]))); assert.equal(art.project !== null && playDocsOf(art.project).backdrop?.[0]?.file, `assets/${PNG}.png`);
  const grid = { cols: 2, rows: 2, tileTypeAt(at: { c: number; r: number }) { return { id: ["floor", "water", "wall-block", "floor"][at.r * 2 + at.c] ?? "floor" }; } };
  assert.deepEqual(dress(grid).layers[0]?.tiles, [0, 1, 2, 0]); assert.deepEqual(dress(grid, undefined, true).layers[0]?.tiles, [null, 1, 2, null]);
});
test("draw list: the backdrop draws first, at whole art px, by depth", () => {
  const at = (depth: number, repeat: "none" | "x" | "y" | "both" = "none", fw = 64) => draw([sky(depth, repeat, fw)]).filter((c) => c.sheet === "art");
  const first = draw([sky(1, "none", 64)]); assert.equal(first[0]?.sheet, "art"); assert.ok(first.some((c) => c.sheet === "ground")); assert.equal(first.findIndex((c) => c.sheet === "art") < first.findIndex((c) => c.sheet === "ground"), true);
  assert.deepEqual(at(1).map((c) => [c.dx, c.dy, c.dw, c.dh]), [[-40, -20, 64, 64]]); assert.deepEqual(at(0).map((c) => [c.dx, c.dy]), [[0, 0]]); assert.deepEqual(at(0.5).map((c) => [c.dx, c.dy]), [[-20, -10]]);
  assert.deepEqual(at(1, "none", 16), []); assert.deepEqual(at(1, "x").map((c) => c.dx), [-40, 24, 88, 152]); assert.equal(at(1, "both").length, 8);
  assert.equal(draw([{ sheet: { id: "art", columns: 1, fw: 0, fh: 0 }, depth: 1, repeat: "both" }]).some((c) => c.sheet === "art"), false);
  assert.ok(at(0.37, "both").every((c) => Number.isInteger(c.dx) && Number.isInteger(c.dy)));
});
test("chunked list draws the backdrop once, before the ground chunks", () => {
  const cmds = chunkedList(scene([{ sheet: { id: "sky", columns: 1, fw: 64, fh: 64 }, depth: 1, repeat: "none" }]), fit, cam, 0, 16).cmds;
  assert.equal(cmds.filter((c) => c.sheet === "sky").length, 1); assert.equal(cmds[0]?.sheet, "sky"); assert.equal(cmds[1]?.sheet.startsWith("chunk:"), true);
  assert.equal(chunkedList(scene([]), fit, cam, 0, 16).cmds.some((c) => c.sheet === "sky"), false);
});
test("store: readTree skips assets, readBlob reads bytes, trash moves assets", async () => {
  const store = memoryStore(), live = prefix(PID), trash = prefix(PID, true);
  await store.write(`${live}project.json`, "{}"); await store.write(`${live}assets/${PNG}.png`, "BYTES");
  const tree = await readTree(store, live); assert.equal(Object.keys(tree).some((key) => key.startsWith("assets/")), false);
  const blob = await store.readBlob(`${live}assets/${PNG}.png`); assert.equal(blob === null ? null : await blob.text(), "BYTES"); assert.equal(await store.readBlob(`${live}assets/missing.png`), null);
  await movePrefix(store, live, trash); const moved = await store.readBlob(`${trash}assets/${PNG}.png`);
  assert.equal(moved === null ? null : await moved.text(), "BYTES"); assert.equal([...store.files.keys()].some((key) => key.startsWith(live)), false);
});
test("test launch hands the stage its background and an art reader", async () => {
  const bytes = "PNGBYTES", id = await idOf(bytes), store = await saved(id, bytes); let file = "", body: Promise<string | null> = Promise.resolve(null);
  const got = await openSaved({ store, id: PID, from: "project", start(next) { file = next.backdrop?.[0]?.file ?? ""; const art = next.art; if (art !== undefined) body = art(`assets/${id}.png`).then((blob) => (blob === null ? null : blob.text())); } });
  assert.equal(got.ok, true); assert.equal(file, `assets/${id}.png`); assert.equal(await body, bytes);
});
test("autosave: two links in a row write in order, and each write reads the slot once", async () => {
  const store = memoryStore(); let reads = 0; const read = store.read.bind(store); store.read = async (path) => { reads += 1; return read(path); };
  const [a, b] = await Promise.all([writeAutosave(store, header, "stage_A", "stage_B", party), writeAutosave(store, header, "stage_B", "stage_C", party)]);
  assert.equal(a.ok && b.ok, true); assert.equal(JSON.parse(store.files.get(slotOf(PID)) ?? "{}").to, "stage_C"); assert.equal(reads, 2); assert.equal([...store.files.keys()].some((key) => key.endsWith(".tmp")), false);
});
test("asset files (D29): a missing or changed file is H4 when a selected stage uses it, a warning when unused, and Test is refused naming the file", async () => {
  const id = await idOf("PNGBYTES"), spare = "asset_spare0000000000", missing = await openSaved({ store: await saved(id, null), id: PID, from: "project", start() { /* refused */ } });
  assert.equal(missing.ok, false); if (!missing.ok) assert.deepEqual([...missing.lines], [`A picture this project uses is missing: assets/${id}.png`]);
  const changed = await openSaved({ store: await saved(id, "OTHER"), id: PID, from: "project", start() { /* refused */ } });
  assert.equal(changed.ok, false); if (!changed.ok) assert.deepEqual([...changed.lines], [`A picture this project uses doesn't match its file: assets/${id}.png`]);
  const text = withArt(id, [{ assetId: id, depth: 1, repeat: "none" }], { [spare]: meta("png") }), store = memoryStore();
  for (const [path, body] of Object.entries(text)) await store.write(`${prefix(PID)}${path}`, body); await store.write(`${prefix(PID)}assets/${id}.png`, "PNGBYTES");
  const rows = await assetRows(store, prefix(PID), parse(text)); assert.deepEqual(rows, [{ code: "assetFileMissing", severity: "warning", path: `assets/${spare}.png`, detail: spare }]);
  const v4 = parse(text); const oldMap = v4[MAP]; if (isObj(oldMap)) { oldMap["formatVersion"] = 4; oldMap["background"] = { mode: "image", assetId: spare }; }
  const aged = await assetRows(store, prefix(PID), v4); assert.deepEqual(aged.filter((r) => r.detail === spare), [{ code: "assetFileMissing", severity: "hard", path: `assets/${spare}.png`, detail: spare }]);
  const opened = await openSaved({ store, id: PID, from: "project", start() { /* opens */ } }); assert.equal(opened.ok, true); assert.equal(store.files.get(`${prefix(PID)}project.json`)?.includes(spare), true);
});
test("advancedRenderInactive (D29): one info row per stored field while advanced render is off, and nothing is rewritten", () => {
  const offText = withArt(PNG, [{ assetId: PNG, depth: 1, repeat: "none", fit: "cover" }], {}, { advancedRender: false, camera: { pixelPerfect: false } }), offCopy = { ...offText }, offFiles = parse(offText), offClone = structuredClone(offFiles), off = readProject(offFiles);
  assert.equal(off.ok, true); assert.deepEqual(offFiles, offClone); assert.deepEqual(offText, offCopy);
  assert.deepEqual(off.report.map((r) => [r.code, r.severity, r.path, r.detail]), [["advancedRenderInactive", "info", `${MAP}#/background/layers/0/fit`, "fit"], ["advancedRenderInactive", "info", "project.json#/project/settings/camera/pixelPerfect", "pixelPerfect"]]);
  const onText = withArt(PNG, [{ assetId: PNG, depth: 1, repeat: "none", fit: "cover" }], {}, { advancedRender: true, camera: { pixelPerfect: false } }), onFiles = parse(onText), onClone = structuredClone(onFiles), on = readProject(onFiles);
  assert.equal(on.ok, true); assert.deepEqual([...on.report], []); assert.deepEqual(onFiles, onClone); assert.equal(onText["project.json"], JSON.stringify(JSON.parse(onText["project.json"] ?? "{}")));
});
```

### `handoff/steps/tests/s9-art-backgrounds/smoke.mjs` (new)

```
// Step 09 art backgrounds. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s9-art-backgrounds/smoke.mjs . 8811 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8811", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s9-smoke-")); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const out = join(root, `handback/step-09-art-backgrounds/${REV}`); mkdirSync(out, { recursive: true });
const STAGE = "stage_01JDAS00000000000000000001", MAP = "maps/map_01JDAM00000000000000000001.json";
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const node = page.locator(`[data-act="${act}"]`).last(); await node.waitFor({ timeout: 15000 }); await node.scrollIntoViewIfNeeded(); const box = await node.boundingBox(); if (box === null) throw new Error(`no ${act}`); await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); };
const sheet = (page, title) => page.waitForFunction((t) => [...document.querySelectorAll(".sheet h2")].some((h) => h.textContent === t), title, { timeout: 15000 });
const open = (page, id) => page.goto(`${origin}/maker/?project=${encodeURIComponent(id)}&stage=${encodeURIComponent(STAGE)}&from=project`, { waitUntil: "load" });
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(out, `${name}.png`) }); };
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { const text = await page.evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(0, 280)).catch(() => ""); check(`${name} @${width}`, false, `${String(e && e.message ? e.message : e).replace(/\s+/g, " ").slice(0, 180)} || ${text}`); } };
    const pixels = () => page.evaluate(() => { const canvas = document.querySelector("#board"); if (!(canvas instanceof HTMLCanvasElement)) return null; const ctx = canvas.getContext("2d"); if (ctx === null) return null; const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data; let mag = 0, cyan = 0, blend = 0; for (let i = 0; i < data.length; i += 4) { const r = data[i] ?? 0, g = data[i + 1] ?? 0, b = data[i + 2] ?? 0; if (r >= 160 && g <= 30 && b >= 160) mag += 1; else if (r <= 30 && g >= 160 && b >= 160) cyan += 1; else if (b > 180 && r > 40 && g > 40 && r < 180 && g < 180 && b > r + 20 && b > g + 20) blend += 1; } return { mag, cyan, blend, failed: window.__driver?.stats?.failed ?? -1 }; });
    const idOf = () => page.evaluate(async () => { const root = await navigator.storage.getDirectory(), projects = await (await root.getDirectoryHandle("tileengine")).getDirectoryHandle("projects"), ids = []; for await (const name of projects.keys()) if (name.startsWith("project_")) ids.push(name); if (ids.length !== 1) throw new Error(ids.join(",")); return ids[0]; });
    let id = "";
    await page.goto(`${origin}/maker/`, { waitUntil: "load" });
    await step("1 new", async () => { await tap(page, "new"); await sheet(page, "Pick a start"); await tap(page, "toname"); await sheet(page, "Name it"); await tap(page, "create"); await page.waitForFunction(() => document.body.innerText.includes("Demo stage"), null, { timeout: 15000 }); id = await idOf(); if (id === "") throw new Error("id"); });
    await step("2 no background", async () => { await tap(page, "test"); await page.waitForFunction(() => window.__play !== undefined && document.querySelector("#board") instanceof HTMLCanvasElement && document.querySelector("#board").width > 0, null, { timeout: 15000 }); const px = await pixels(); if (px === null || px.mag !== 0 || px.cyan !== 0) throw new Error(JSON.stringify(px)); await shot("01-plain"); });
    await step("3 painted", async () => {
      const art = await page.evaluate(async ({ id, map }) => { const c = new OffscreenCanvas(96, 144), g = c.getContext("2d"); if (g === null) throw new Error("2d"); g.fillStyle = "#ff00ff"; g.fillRect(0, 0, 48, 144); g.fillStyle = "#00ffff"; g.fillRect(48, 0, 48, 144); const bytes = new Uint8Array(await (await c.convertToBlob({ type: "image/png" })).arrayBuffer()); const hex = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16); const asset = `asset_${hex}`; const root = await navigator.storage.getDirectory(); const put = async (path, data) => { const parts = path.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true }); const w = await (await dir.getFileHandle(leaf, { create: true })).createWritable(); await w.write(data); await w.close(); }; const read = async (path) => { const parts = path.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part); return await (await (await dir.getFileHandle(leaf)).getFile()).text(); }; const pre = `tileengine/projects/${id}/`; const project = JSON.parse(await read(`${pre}project.json`)), doc = JSON.parse(await read(`${pre}${map}`)); project.project.assets[asset] = { name: "Split", ext: "png", origin: { kind: "upload", fileName: "split.png" }, kind: "background" }; doc.background = { layers: [{ assetId: asset, depth: 1, repeat: "none" }] }; await put(`${pre}project.json`, JSON.stringify(project)); await put(`${pre}${map}`, JSON.stringify(doc)); await put(`${pre}assets/${asset}.png`, bytes); return asset; }, { id, map: MAP });
      await open(page, id); await page.waitForFunction(() => { const tiles = window.__play?.scene?.().layers?.[0]?.tiles; return Array.isArray(tiles) && tiles.some((t) => t === null); }, null, { timeout: 15000 }); await page.waitForFunction(() => { window.__n = (window.__n ?? 0) + 1; return window.__n > 3; }, null, { timeout: 15000 });
      const px = await pixels(); if (px === null || px.mag < 500 || px.cyan < 500 || px.blend !== 0 || px.failed !== 0) throw new Error(JSON.stringify(px)); await shot("02-painted"); if (art === "") throw new Error("art");
    });
    await step("4 assets", async () => { const names = await page.evaluate(async (id) => { const root = await navigator.storage.getDirectory(); let dir = root; for (const part of `tileengine/projects/${id}/assets`.split("/")) dir = await dir.getDirectoryHandle(part); const got = []; for await (const name of dir.keys()) got.push(name); return got; }, id); if (names.length !== 1 || !/^asset_[0-9a-f]{16}\.png$/.test(names[0] ?? "")) throw new Error(names.join(",")); });
    await step("5 missing", async () => { const line = await page.evaluate(async (id) => { const root = await navigator.storage.getDirectory(); let dir = root; for (const part of `tileengine/projects/${id}/assets`.split("/")) dir = await dir.getDirectoryHandle(part); const names = []; for await (const name of dir.keys()) names.push(name); const file = names[0] ?? ""; await dir.removeEntry(file); return `A picture this project uses is missing: assets/${file}`; }, id); await open(page, id); await page.waitForFunction((line) => document.body.innerText.includes(line) && window.__play === undefined, line, { timeout: 15000 }); });
    await step("6 won't open", async () => {
      const file = await page.evaluate(async ({ id, map }) => { const bytes = new TextEncoder().encode("not-a-picture"); const hex = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16); const asset = `asset_${hex}`; const root = await navigator.storage.getDirectory(); const put = async (path, data) => { const parts = path.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true }); const w = await (await dir.getFileHandle(leaf, { create: true })).createWritable(); await w.write(data); await w.close(); }; const read = async (path) => { const parts = path.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part); return await (await (await dir.getFileHandle(leaf)).getFile()).text(); }; const pre = `tileengine/projects/${id}/`; const project = JSON.parse(await read(`${pre}project.json`)), doc = JSON.parse(await read(`${pre}${map}`)); project.project.assets[asset] = { name: "Bad", ext: "png", origin: { kind: "upload", fileName: "bad.png" }, kind: "background" }; doc.background = { layers: [{ assetId: asset, depth: 1, repeat: "none" }] }; await put(`${pre}project.json`, JSON.stringify(project)); await put(`${pre}${map}`, JSON.stringify(doc)); await put(`${pre}assets/${asset}.png`, bytes); return `assets/${asset}.png`; }, { id, map: MAP });
      await open(page, id); await page.waitForFunction((file) => document.querySelector("#note")?.textContent === `Background picture ${file} couldn't be opened` && (window.__driver?.stats?.failed ?? 0) >= 1, file, { timeout: 15000 });
      const floor = await page.evaluate(() => { const tiles = window.__play.scene().layers[0].tiles; return tiles.filter((t) => t === 0).length; }); const px = await pixels(); if (!(floor > 0) || px === null || px.mag !== 0 || px.cyan !== 0) throw new Error(`${floor} ${JSON.stringify(px)}`); await shot("03-wont-open");
    });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```

