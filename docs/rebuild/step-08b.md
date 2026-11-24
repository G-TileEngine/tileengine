# Rebuild record: step 8b, the stair phone check and no silent party drop

Original brief: [`docs/maker/steps/step-08b-stair-baseline.md`](../maker/steps/step-08b-stair-baseline.md) on the merge (r2, blob `bb77c2a8`, sha256 `6bd10c7543f03c6037f4b727fa64d74dacdb2bb2fd66be633701a8d06528dfb2`, 112 lines). Delivery L12; Goal L19; Read first L26; Rules L41; Build L55; Named tests L71; Smoke L79; Must NOT L84; Done when L89. Count command L67; hard per-file caps L55–69; caps sum 106 at L68. This file replaces the 8b rows of the step 8 guide r4 for the builder (guide L3, L27). There is no new smoke; s8 is reused unedited, with its own cap already on main, outside this step's 400 (guide L10, L79–80). The guide is unchanged from the product base through the merge; current main adds only the two QA reviews of the product.

Sources: PR #98 and branches `step/step-08b-stair-baseline-r1-chatA` (r1 tip `dca1d1e6`, r1 code head `6562653a`) and `step/step-08b-stair-baseline-r2-chatA` (r2 tip `5b6e7b52`, r2 code head `38ee278c`); `handback/step-08b-stair-baseline/r1/HANDBACK.md` at `dca1d1e6` and on the merge (HB1, blob `266c8a50`, 111 lines, sha256 `b2d7c8f4cf30895437a7a99c428949045a71ee4e2c05490847ebda0b46288861`); `handback/step-08b-stair-baseline/r2/HANDBACK.md` at `5b6e7b52` and on the merge (HB2, blob `6d1b5313`, 97 lines, sha256 `26dd19f2ec608a2cbd34e04850eb584fb6d3c44c6eed3bc134367ba2d8a8fd82`); CoS verify reports `/workspace/share/step-08b-r1-verify/report.md` (V1, 48 lines, sha256 `6ea0d93f5b7b0f1dfdc1eae9add1fcb53552f08faf8ac3fe16c5dd28f848b157`, hash-object `4637702f282701835001f00bb06348f7868be3e8`) and `/workspace/share/step-08b-r2-verify/report.md` (V2, 42 lines, sha256 `f2c001113e2807692d9a8244002585bfd12ddc7e21c08575d613d73b1990d3e3`, hash-object `19c6991eefd58489e88ba978ce8fa99fd3eb2079`). `docs/qa/step-08b-r1-review.md` on main `5d2b30c9` and at the merge (QA1, blob `54a0581f`, 29 lines, sha256 `4a4dc5aa597a513385c0a0c6fc356c88ca94017ec5cffc65853d928a76fd8078`): **NOT OK**, one must-fix, one rework round. `docs/qa/step-08b-r2-recheck.md` on main `cb223720` (QA2, blob `fcb6c4f7`, 15 lines, sha256 `b6f844c53b3ed728153ae302e2222bfc6fa1a3a0b32ef7441193b131e4a5e599`): **OK TO MERGE**. Line cites use HB1, HB2, V1, V2, QA1 and QA2. Product line cites are at merge `42cc84b4` (tree `aacaa18e`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `ecd22d8052d55e2367ccb9bb527e203e73cc11fe`, 2026-11-24 09:05 (UK time). Floor **1122** tests (guide L8 / L90: 8a's final count + N=3). After this merge the floor is **1125**. The base is the 8b guide r2 and its QA recheck, docs-only on the 8a merge `a0c1dad2` (and the 8a r2 review `10ca0b0a` and the 8a rebuild record `140510f`). Guide L7 named `10ca0b0a` and said to use a later main if CoS named one; the go-line named this base |
| r1 commits | on `step/step-08b-stair-baseline-r1-chatA`: `6562653a3cc823a6bb1516ed95250f89c0cb9b8c` feat(play): spill a party across the map and time the shop stairs (code head, tree `04bcf371553bacbaeeb5e47bec909afba41bd4fe`, 2026-11-24 14:55 UK time), `dca1d1e6d04f9b6db8b1056cd025d92954d47181` docs(handback): step 8b stair baseline r1 (tree `9ae41c45c604a1af6b35a3bf301df1089bf44261`, 2026-11-24 14:56 UK time). Linear, two commits, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Tip vs code is the r1 hand-back folder only: `HANDBACK.md` (111 lines). The four s8 shots were produced and deleted before the tip; they are not in the tree (HB1:82, V1, QA1:15). 8a's four shots stay on main |
| r1 verdict | Product green was 1125/0 and the official count was 94, with every cap kept (HB1:41, V1, QA1:8–10). CoS verify of r1 was PASS (V1). QA **NOT OK, one must-fix (r2)** (QA1:3). `tools/baseline/page.ts` L19 `travel` pushed the swap and removed `#board` and `#hud` before `arriveIn`, and on `got.docs === null` did nothing, so a failed stage change left a blank page and dropped `got.error` (Law 12, QA1:18–19). Fold into r2, non-blocking: the same file had lost its trailing newline (QA1:21–22, V1). PR #97 "Step 8b: stair baseline + party spill (r1, ChatA)" was opened from the r1 branch and later **closed unmerged** (2026-11-24 17:05 UK time) when the r2 PR opened. The r1 QA review is on main `5d2b30c9b587e3b0240efe3ac9fb6a64e7042d7a` (2026-11-24 16:25 UK time) |
| r2 commits | on `step/step-08b-stair-baseline-r2-chatA`, cut from the r1 tip `dca1d1e6` (allowed): `38ee278c0d01b6a839b7888e61854a9d555e56f1` fix(baseline): report a failed stair change instead of blanking the page (code head, tree `1e1bc50edbecb057219e64081932b17b1c0058ef`, 2026-11-24 16:47 UK time), `5b6e7b52189eda02e3ce5b3d65e5f2c051631f17` docs(handback): step 8b stair baseline r2 (tree `990d24d46c6d8faacf1ae090f4458883e5a97a62`, 2026-11-24 16:47 UK time). Linear, no merges. Same noreply identity. The product fix `6562653a..38ee278c` excluding `handback/**` is only `tools/baseline/page.ts` (`4 ++--`: the `travel` line, plus the restored trailing newline). No test was edited in r2. Tip vs code is `handback/step-08b-stair-baseline/r2/HANDBACK.md` only (97 lines). The r1 hand-back stays in history |
| r2 verdict | QA **OK TO MERGE** (QA2:3). The must-fix is closed, the trailing newline is restored, and the floor holds (QA2:7–13, V2). Green 1125/0; official count **92/400**; s8 16 ok and `SMOKE PASS`; S0 14 ok and `TOUCH SMOKE PASS`; export audit PASS. Predicted merge tree onto main `5d2b30c9` was `aacaa18e` (V2, QA2:3, QA2:13) |
| Merge | PR #98 "Step 8b: stair baseline + party spill (r2, ChatA)", merge commit `42cc84b41f17c477495284dac061084ddd6920a9`, 2026-11-24 17:07 (UK time). Tree `aacaa18e2d0e8e3b3d05f6764c74a34bae68702d` (the same tree CoS and QA predicted against main `5d2b30c9`; V2, QA2:3, QA2:13). First parent `5d2b30c9b587e3b0240efe3ac9fb6a64e7042d7a` (the r1 QA review, docs-only on the product base), second parent `5b6e7b52`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Diff vs the r2 tip is only `docs/qa/step-08b-r1-review.md` (blob `54a0581f`, the same as on `5d2b30c9`) |
| After the merge | main is `cb2237209e8bbabf4b2d5f261b06139560c64a4c`, 2026-11-24 17:07 (UK time), tree `ef75790409bc29019336ec70f4c1ad9c1b8e143a`, which adds only `docs/qa/step-08b-r2-recheck.md` (15 insertions, sha256 `b6f844c5`, hash-object `fcb6c4f7`). Both QA reviews are on main. The floor is now 1125. The stair phone check (guide L93) is CoS's after merge, not the builder's gate |
| Tests | 1122 + N=3 (named tests 6, 10 and 11 in `tests/tools/autosave-links.test.ts`) = **1125 pass / 0 fail**. Floor after this merge is **1125** (HB2:16–23, V2, QA2:10) |

## (b) Files

From `git diff --name-status ecd22d80..38ee278c -- . ':!handback/**'`. Line counts are `git diff --numstat` insertions and deletions against the product base, at the r2 code head (the accepted 8b measure). The same product files are on the merge tree `aacaa18e`. The 8b guide docs on the merge are from first parent `5d2b30c9`, not from this branch. The r1 review doc landed on the merge from that first parent and is **not** in the official 400. There is no new smoke to exclude; s8 is unedited and already on main.

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `src/rules/session/links.ts` | M | 3 / 3 | 8 (L58) | yes. 6 |
| `tools/play-stage/project.ts` | M | 2 / 2 | 5 (L59) | yes. 4 |
| `tools/play-stage/load.ts` | M | 1 / 1 | 2 (L60) | yes. sits on the cap |
| `tools/play-stage/match.ts` | M | 2 / 2 | 8 (L61) | yes. 4 |
| `tools/play-stage/hud.ts` | M | 4 / 4 | 9 (L62) | yes. 8 |
| `tools/baseline/page.ts` | M | 7 / 5 | 18 (L63) | yes. 12. r1 was 8 / 6 = 14; restoring the trailing newline drops the closing `}` from the diff against the base (HB2:30, HB2:93) |
| `tools/baseline/readout.ts` | M | 3 / 3 | 6 (L64) | yes. sits on the cap |
| `tests/tools/autosave-links.test.ts` | M | 43 / 7 | 50 (L65) | yes. sits on the cap (the L1–7 import split, `nook`, and tests 6, 10 and 11). Unchanged in r2 |

No diff under `src/core`, `src/sim`, `src/types`, `data/`, `fixtures/`, `behaviour-library/`, `tools/maker/`, `tools/painter-proto/` or `tools/ui-shell/`. `one-parser.test.ts`, `baseline-page.test.ts` and `play-stage-p19.test.ts` have zero diff (HB1:19, V1, V2, QA1:8). 8a's eight named tests and step 7's six, including test 2's expected cells, are unedited (the eight pre-existing test bodies are byte-identical; `nook` and tests 6, 10 and 11 were appended after them). s8 (`0de37442…`) and S0 (`d528795e…`) are unedited. Official G7 at the r2 code head or r2 tip against `ecd22d80`, and at the merge against first parent `5d2b30c9`, is **8 files changed, 65 insertions(+), 27 deletions(-)** = 92 ≤ 400 (r1 was 66+28 = 94). Every per-file cap is kept. Caps sum 106 (guide L68) is not a second gate. No file is near 500. No new dependency. Lockfile blob `85b42f99` is unchanged vs the product base.

## (c) Key code and git commands

Step 8b does two jobs (guide L19–22, Rules 1–3). The baseline page gets a second scene, `?scene=shop`, with two more readout rows for the stair phone check. A party member that does not fit at a link is spilled to the nearest free walkable cell, or benched only when the stage has no free walkable cell, and even then stays in `match.party()` and the next autosave (EA ruling on QA's 8a carry, repro B). It also splits the joined imports in `tests/tools/autosave-links.test.ts` L1–7 (QA 8a r2 nit). There is no pre-warming, no in-stage way to bring a benched member back on, and no save-shape change (guide L24).

**Spill and bench (Rules 2).** `arrival` gains a sixth argument `inside`, defaulting to `free` (`src/rules/session/links.ts:9`). The fill walks every cell `inside` accepts, N E S W, and takes the ones `free` accepts; the 512 Manhattan bound stays (`:15`). With no `inside` it is 8a's function, so test 2's expected cells stay `(2,2) (3,2) (2,3)` and a closed stair at `(2,1)` still falls through to the spawn (HB1:101, V1). `arriveIn` (`tools/play-stage/project.ts:96-107`) passes `inside = (sq) => grid !== null && grid.inBounds(sq)` (`:104`), so the flood is bounded by the map (a null grid floods nothing) and can cross a wall to a free cell. `bench = party.members.slice(next.length)`: the members still without a cell, which only happens when the stage has no free walkable cell left. `chosen` stays every member, so `resolvePlacements` raises the existing `notPlaced` notice for them. The docs carry `bench` only when it is not empty (`:107`). `PlayDocs.bench?: readonly {unitId, hp}[]` is play-stage docs only, not a file format (`tools/play-stage/load.ts:23`).

`match.party()` (`match.ts:122`) takes the on-board party from `partyOf`, then appends each `bench` member not already in it, in order, with its carried hp, without mutating the `partyOf` array. So `match.party()` and the autosave keep the member. `view().note` (`:141`) is `Not placed: N of your team had no free cell. They stay with the party.` when `bench` is non-empty, else `null`. N is `bench.length`. **No new notice code, no new report code, no save-shape change.** `notPlaced` is reused (test 11). The link is never refused.

**The note row.** `HudView.note: string | null` (`hud.ts:6`). One `<div id="note" role="status">` sits immediately after `#top` (`:13`). Its CSS is appended at the end of `css`, after `#hud #banner{pointer-events:none}`, not inside the `#top` rule (which is unchanged, so `play-stage-p19.test.ts` still matches). It is `position:absolute`, `top` at `HUD_TOP`, `display:none` until `render` shows it (`:11,37`). The existing `setTimeout(hideBanner, 1260)` stays on `:25`. No new timer. The note has no close button and stays for the stage (guide L109).

**`?scene=shop` and the two readout rows (Rules 1).** `tools/baseline/page.ts:8` reads `?scene=`; `scene === "shop"` opens `openShop()`, otherwise `openCheckpoint()`. The host-rAF wrapper is untouched: still exactly two `requestAnimationFrame` hits (`:11,18`). On the shop scene, `startMatch` is given a `travel` callback (`:19-20`). After r2, `travel` calls `arriveIn(shopFiles(), from, to, party)` first; if `got.docs === null` it sets `read.textContent = got.error` and returns, so the board stays and the error is shown; only then it pushes `swaps.push(gaps.length)`, removes `#board` and `#hud`, prepends a new canvas, and calls `startMatch(got.docs, …, travel)`. The default scene still calls `startMatch(opened.docs)` and does not pass `swaps`. `swaps.push` at `gaps.length` after a successful `arriveIn` is the first post-swap gap and includes the synchronous rebuild (HB1:105, HB2:91, helper `f3183b95…`).

`readout.ts` accepts optional `swaps` and `scene`. With `swaps`, two rows follow the GC line: `stage changes N` and `worst ms in 3 frames after a swap X` (the max of the three gaps from each swap index). The shop title is `baseline 06c · Shop stairs (?scene=shop)`. Without `swaps` the skirmish string is unchanged, and the post-swap gaps stay in the p50/p95/max/dropped/over-50 counts. Test 6, on swaps `[2, 5]` over `[16, 16, 40, 61, 16, 16, 30]`, ends `stage changes 2` / `worst ms in 3 frames after a swap 61.0` and still counts the 61 in `over 50 ms 1 of 7` (`autosave-links.test.ts:109-115`, HB1:35-39, V1).

**House style (Rules 3).** The r1 joined imports at `tests/tools/autosave-links.test.ts` L1–7 become one import per line (L1–19, including `openShop` and `readout`). No line was joined to fit a cap. The file sits on cap 50.

The three new named tests, closed on their last line, all in `tests/tools/autosave-links.test.ts` (V1, V2, QA1:13, guide L71–75):

```ts
test("step 8 baseline ?scene=shop: two floors joined by stairs, and the readout adds stage changes and the worst post-swap frame", () => {
```

```ts
test("step 8b spill: 2 chosen and 1 free spawn, so the second member spills to the nearest free walkable cell (BFS from the arrival cell) and survives an autosave round-trip", async () => {
```

```ts
test("step 8b no room: with no free walkable cell on the stage, the member stays off the board but in the party, with the notPlaced notice and one notice row", async () => {
```

They run at `:109-115`, `:117-120` and `:122-126`. `nook(open)` (`:104-107`) opens the shop 6×6 map only at the listed cell indices (index = r × 6 + c) and plants a fixed raider on S2's stairs 1,4. Test 10 uses `nook([24, 25, 29])` (0,4, 1,4 and a walled-off 5,4): H on 0,4, R on **5,4** (8a's flood never reached it), `view().note` is null, and an autosave round-trip keeps both members. Test 11 uses `nook([24, 25])`: R is not on the board, `docs.bench` is `[{R, 2}]`, `match.party()` still has R with hp 2, `world.notices` has `notPlaced`, `view().note` starts `Not placed: 1 of your team had no free cell`, and the autosave keeps R.

s8 (`handoff/steps/tests/s8-autosave-links/smoke.mjs`, sha256 `0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696`, unedited, port 8810) is rerun as `smoke.mjs . 8810 r<N> step-08b-stair-baseline`: 16 ok lines and `SMOKE PASS` (HB2:32-52, V2, QA2: — the r2 recheck did not rerun smokes; CoS and the r1 review did). Shots go to the 8b hand-back folder and must not be committed. S0 stays `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, identical on the base, both code heads, both tips and the merge (V1, V2, QA1:14). Play-stage HUD files change, so S0 on 8797 is required: 14 ok lines and `TOUCH SMOKE PASS`.

Export audit on the clean code head, counted on the play-stage tree, the baseline tree, and the maker build's `play-stage/` directory directly: **131 / 145 / 131**, empty hit list, `AUDIT PASS` (V1, V2, HB2:74-81). No audit script was committed.

`npx tsc --noEmit -p tools/tsconfig.json` still exits 2 with the three errors already on the base (`tools/effect-designer/page.ts:101`, `tools/maker/home.ts:85` twice). No new error (HB2:29, V2, QA2:10). Leave them.

The official count command (guide L67):

```
# Product gate. The first parent of the merge is 5d2b30c9, the r1 QA
# review, not the product base ecd22d80. Official command at the r2
# code head or r2 tip against ecd22d80, or at the merge against
# 5d2b30c9:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**'
#   8 files changed, 65 insertions(+), 27 deletions(-)
#
# The same 92 at the merge against 5d2b30c9. At the merge against
# ecd22d80, the official command also counts docs/qa/step-08b-r1-review.md
# (9 files, 94 insertions, 27 deletions). That file is not this step.
# Adding ':!docs/**' at the merge against ecd22d80 gives the official 92.
# At cb223720 (current main, which also adds the r2 recheck) against
# ecd22d80, the official command without ':!docs/**' is 10 files, 109
# insertions, 27 deletions. Adding ':!docs/**' again gives 92.
#
# r1 was 8 files, 66 insertions, 28 deletions = 94, against ecd22d80.
#
# S0 handoff/steps/tests/s0-play-input/touch-smoke.mjs sha256
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941
#
# s8 handoff/steps/tests/s8-autosave-links/smoke.mjs sha256
#   0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696
#   (unedited; 44 lines; already on main)
#
# Named tests (npm test 1125/0, floor 1122 + N=3):
#   ✔ step 8 baseline ?scene=shop: two floors joined by stairs, and the readout adds stage changes and the worst post-swap frame
#   ✔ step 8b spill: 2 chosen and 1 free spawn, so the second member spills to the nearest free walkable cell (BFS from the arrival cell) and survives an autosave round-trip
#   ✔ step 8b no room: with no free walkable cell on the stage, the member stays off the board but in the party, with the notPlaced notice and one notice row
#
# Smokes under google-chrome, at 390 and 360 CSS px:
#   s8 (8810 r2 step-08b-stair-baseline):
#     8 ok lines @390 and @360, then SMOKE PASS
#   S0 (8797):
#     ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
#
# Export audit as above; direct counts 131 / 145 / 131, empty hit list.
```

## (d) What went wrong, in order, and the fix

**r1.** The spill, the bench, the shop scene and the import split shipped in one feat commit and green was 1125/0. The official gate was 94, with every per-file cap kept (load 2/2, readout 6/6 and the test file 50/50 sit on their caps; page.ts was 14/18). s8 passed 16 ok and S0 passed 14 ok. The export audit was clean on a direct count. The tip holds only `HANDBACK.md`. CoS verify of r1 was PASS (V1). The predicted r1 merge tree against then-main (still the product base `ecd22d80`) was the tip tree `9ae41c45`.

QA **NOT OK** (QA1:3), one must-fix:

1. **`page.ts` travel blanked the page (Law 12).** r1 L19 pushed the swap, removed `#board` and `#hud`, then called `arriveIn`, and on `got.docs === null` did nothing. A failed stage change left a blank page and dropped `got.error` (QA1:18–19). Repro: make `arriveIn(shopFiles(), …)` return `docs: null` and walk the stairs on `?scene=shop`. **Fix, r2:** call `arriveIn` first; if `got.docs === null`, set `read.textContent = got.error` and return; only then push the swap and swap the board and HUD (QA2:8, V2, HB2:86). No line-count change: the file stays 21 lines, one `travel` callback. The trailing newline, which r1 had lost, was restored in the same commit (QA1:21–22, QA2:9). The error text is `got.error` alone, as QA specified (HB2:90). A failed open does not push a swap index.

r2 was built on the r1 tip, so history also contains the r1 hand-back folder; the product fix itself is only `page.ts` (V2, QA2:7). Shots were not retaken or committed. QA **OK TO MERGE** (QA2:3). The merge tree is `aacaa18e`, as predicted (QA2:3, QA2:13, V2). PR #97 was closed unmerged; PR #98 merged r2.

HB1:3 and HB2:4 said `PR: none yet from the branch.`, which was true at each hand-back and at each CoS verify (V1, V2). No PR existed until after the r1 hand-back. PR #97 and then PR #98 were opened later.

## (e) Do it right first time

- Start from the product base `ecd22d80`. Do not start from `5d2b30c9`, `42cc84b4` or `cb223720`, because the first already has the r1 review and the last two already contain the 8b merge. The floor at the start of 8b was 1122 + N; this merge leaves the floor at 1125.
- Do not edit `src/core`, `src/sim`, `src/types`, `data/`, `fixtures/`, `behaviour-library/`, `tools/maker/`, `tools/painter-proto/` or `tools/ui-shell/`. Do not edit `one-parser.test.ts`, `baseline-page.test.ts`, `play-stage-p19.test.ts`, or 8a's eight named tests (including test 2's expected cells). The only allowed edits to an existing test are the import lines of `tests/tools/autosave-links.test.ts`, plus the new tests 6, 10 and 11 and their `nook` helper. Leave s8 and S0 unedited.
- Flood arrival through `inside` (default `free`); `arriveIn` passes `grid.inBounds`. Bench only the members still without a cell, and only when the stage has no free walkable cell. `chosen` stays every member. Keep the member in `match.party()` and the autosave, with its hp. Reuse `notPlaced`. One note row, no new notice or report code, no formatVersion bump, no save-shape change. Never refuse the link. Never drop a member silently.
- Do not put `#note` inside the `#top` CSS rule. Do not add a second rAF, timer or loop. The default baseline scene must not change its readout string. Don't join lines to fit a cap (guide L69).
- `travel` must call `arriveIn` first. On `got.docs === null`, set `read.textContent = got.error` and return before pushing the swap or removing `#board` and `#hud`. Keep the trailing newline on `page.ts`.
- Play-stage HUD files change, so run S0 on 8797 and keep sha256 `d528795e…`, and rerun s8 as `smoke.mjs . 8810 r<N> step-08b-stair-baseline` (16 ok). Run the export audit on the direct play-stage / baseline / maker `play-stage/` counts (131 / 145 / 131). Do not commit the shots or the audit script. The builder never publishes the baseline page.
- Paste the ok lines and `SMOKE PASS` / `TOUCH SMOKE PASS` from one solo run in § Smoke. Label the code head and the tip. The PR line should match whether a PR exists at hand-back time.
- Measure with the count command (guide L67): `git diff --shortstat <base>..HEAD -- . ':!handback/**'`. Count insertions plus deletions (checklist L26, BUILD_GUIDE.md L123). **92** is the accepted number for this step (r1 was 94). On a merge whose first parent is not the product base, measure against that first parent (or at the code head against `ecd22d80`), and do not treat first-parent or later QA docs as 8b lines.
- The stair phone check (guide L93, `docs/qa/baseline-06c-phones.md` L31) is CoS's after merge, not the builder's gate. Do not pre-warm from this step unless that check misses.
- Do not treat the open 8a carries (QA1:26, guide L105) as 8b fixes.

## (f) Rebuild check

From a clean tree at `ecd22d8052d55e2367ccb9bb527e203e73cc11fe` (the product base; the merge's first parent is `5d2b30c9`, which already has the r1 review), write the product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit. Then measure. Without the commit, `git diff` misses the uncommitted new files. There is no CN on this step.

```
# Product equality vs the merge (current main adds only the r2 QA recheck;
# the r1 review is already on the merge from the first parent):
#   git diff 42cc84b4 HEAD -- src/rules/session/links.ts \
#     tools/play-stage/project.ts tools/play-stage/load.ts \
#     tools/play-stage/match.ts tools/play-stage/hud.ts \
#     tools/baseline/page.ts tools/baseline/readout.ts \
#     tests/tools/autosave-links.test.ts
#   (empty)

# Product gate. Official command at the r2 code head or r2 tip against
# ecd22d80, or at the merge against first parent 5d2b30c9:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**'
#   8 files changed, 65 insertions(+), 27 deletions(-)
#
# The same 92 at the merge against 5d2b30c9. At the merge against
# ecd22d80, the official command also counts docs/qa/step-08b-r1-review.md
# (9 files, 94 insertions, 27 deletions). That file is not this step.
# Adding ':!docs/**' at the merge against ecd22d80 gives the official 92.
# At cb223720 (current main, which also adds the r2 recheck) against
# ecd22d80 without ':!docs/**': 10 files, 109 insertions, 27 deletions.
# Adding ':!docs/**' again gives 92.
#
# S0 handoff/steps/tests/s0-play-input/touch-smoke.mjs sha256
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941
#
# s8 handoff/steps/tests/s8-autosave-links/smoke.mjs sha256
#   0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696
#
# Named tests (npm test 1125/0, floor 1122 + N=3):
#   ✔ step 8 baseline ?scene=shop: two floors joined by stairs, and the readout adds stage changes and the worst post-swap frame
#   ✔ step 8b spill: 2 chosen and 1 free spawn, so the second member spills to the nearest free walkable cell (BFS from the arrival cell) and survives an autosave round-trip
#   ✔ step 8b no room: with no free walkable cell on the stage, the member stays off the board but in the party, with the notPlaced notice and one notice row
#
# Smokes under google-chrome, at 390 and 360 CSS px:
#   s8 (8810 r2 step-08b-stair-baseline):
#     8 ok lines @390 and @360, then SMOKE PASS
#   S0 (8797):
#     ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
#
# Export audit as above; direct counts 131 / 145 / 131, empty hit list.
```

## QA non-blockers carried forward

- **A benched member rejoins the board only at the next link with room.** There is no in-stage way to bring it on (guide L107). Do not add one as part of an 8b rebuild.
- **`notPlaced` is a code in `src/project/read/placements.ts` only and is not listed in `project-format.md`.** 8b reuses it unchanged. DSK may list it when the notice table is next edited; no action in 8b (guide L108).
- **The note row has no close button; it stays for the stage** (guide L109).
- **Still open from 8a r2, not 8b scope** (QA1:26, guide L105): `levels.ts` L64 narrowing; `project.ts` L102 null grid; the double slot read in `writeAutosave`; resume notes at `openId`'s rev; overlapping autosaves (the maker's `gate` would serialize them).
- **The walled-off-pocket spill case stays for the phone check after merge** (QA1:27). Test 10 already covers a walled-off free cell at 5,4 on the box.
- **The stair phone check** (guide L93) is CoS's after merge, on the S21 Ultra and the Red Magic 9 Pro, judged by `docs/qa/baseline-06c-phones.md` L31: p95 at or under 16.7 ms, no dropped frame, no frame over 50 ms counting every frame after a swap (`worst ms in 3 frames after a swap` ≤ 50 and `stage changes` ≥ 10), and no unexplained heap growth. If it misses, pre-warm per roadmap L83 in a follow-up. Do not pre-warm from this record.
- **Shipped count 92 vs the guide trial 89** (r1 was 94 vs 89). Every cap is kept (QA1:25). The test file sits on 50/50 because of the split imports plus tests 6, 10 and 11.
- **HB1:3 and HB2:4 PR lines** were true at each hand-back; PR #97 and PR #98 were opened later. PR #97 was closed unmerged.

## Blob check

Each file must have exactly this git blob id at `42cc84b4`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `src/rules/session/links.ts` | `d72ab53a98162a6a0d07f1bf3f44d8efdd970397` | 19 |
| `tools/play-stage/project.ts` | `aa98621a980b9684269c3372fbcf7117845a90fc` | 108 |
| `tools/play-stage/load.ts` | `0290107d18b47f897345705dfdb1a4fbe57362c0` | 28 |
| `tools/play-stage/match.ts` | `505555b562be87c522372e91ff9cb6df293dca0e` | 178 |
| `tools/play-stage/hud.ts` | `c2af22b444b0c1333260307fba0d7c988aac5f93` | 40 |
| `tools/baseline/page.ts` | `3aeb69b0408c834cbcecf7f2a12ae7bf38f8db1c` | 21 |
| `tools/baseline/readout.ts` | `fd671fc18a10bced006756151319c65aeb7aa379` | 18 |
| `tests/tools/autosave-links.test.ts` | `2ded7f966475cbd2a4eb15e1e13b3ea32c5e356b` | 127 |


## Appendix: full code as merged (step 8b, PR #98)

There are no new files. Edited files are `git diff ecd22d80 42cc84b4 -- <path>`.

### `src/rules/session/links.ts` (edited)

```diff
diff --git a/src/rules/session/links.ts b/src/rules/session/links.ts
index dbd0af9..d72ab53 100644
--- a/src/rules/session/links.ts
+++ b/src/rules/session/links.ts
@@ -4,15 +4,15 @@ export type LinkEvent = { readonly type: "link"; readonly linkType: LinkType; re
 export function linkAt(links: readonly CoreLink[], at: Sq): CoreLink | null {
   return links.find((link) => link.at.c === at.c && link.at.r === at.r) ?? null;
 }
-/** `back` is the target's first link in array order whose `to` is the source stage. */
+/** `back` is the target's first link in array order whose `to` is the source stage. The fill walks every cell `inside` accepts (it defaults to `free`) and keeps the cells `free` accepts, so a walled-off free cell stays out until a caller widens `inside`. */
 const key = (sq: Sq): string => `${sq.c},${sq.r}`;
-export function arrival(targetLinks: readonly CoreLink[], fromStageId: string, spawns: readonly Sq[], size = 0, free: (sq: Sq) => boolean = () => true): readonly Sq[] {
+export function arrival(targetLinks: readonly CoreLink[], fromStageId: string, spawns: readonly Sq[], size = 0, free: (sq: Sq) => boolean = () => true, inside: (sq: Sq) => boolean = free): readonly Sq[] {
   const back = targetLinks.find((link) => link.to === fromStageId);
   const base = back === undefined ? [...spawns] : [back.at, ...spawns.filter((sq) => sq.c !== back.at.c || sq.r !== back.at.r)];
   const got = base.filter((sq) => free(sq)); if (size < 1 || got.length >= size) return size < 1 ? got : got.slice(0, size);
   const origin = base[0]; if (origin === undefined) return got;
   const seen = new Set(got.map(key)), been = new Set<string>([key(origin)]), q: Sq[] = [origin];
-  while (q.length > 0 && got.length < size) { const cur = q.shift(); if (cur === undefined) break; for (const [dc, dr] of [[0, -1], [1, 0], [0, 1], [-1, 0]] as const) { const n = { c: cur.c + dc, r: cur.r + dr }, id = key(n); if (been.has(id) || Math.abs(n.c - origin.c) + Math.abs(n.r - origin.r) > 512 || !free(n)) continue; been.add(id); q.push(n); if (!seen.has(id)) { seen.add(id); got.push(n); if (got.length >= size) break; } } }
+  while (q.length > 0 && got.length < size) { const cur = q.shift(); if (cur === undefined) break; for (const [dc, dr] of [[0, -1], [1, 0], [0, 1], [-1, 0]] as const) { const n = { c: cur.c + dc, r: cur.r + dr }, id = key(n); if (been.has(id) || Math.abs(n.c - origin.c) + Math.abs(n.r - origin.r) > 512 || !inside(n)) continue; been.add(id); q.push(n); if (free(n) && !seen.has(id)) { seen.add(id); got.push(n); if (got.length >= size) break; } } }
   return got;
 }
 export function autosaves(link: CoreLink, contest: boolean): boolean { return link.autosave === true && !contest; }
```

### `tools/play-stage/project.ts` (edited)

```diff
diff --git a/tools/play-stage/project.ts b/tools/play-stage/project.ts
index 688f175..aa98621 100644
--- a/tools/play-stage/project.ts
+++ b/tools/play-stage/project.ts
@@ -101,8 +101,8 @@ export function arriveIn(files: ProjectFiles, fromId: string | null, toId: strin
   let mapDoc: unknown; for (const [key, doc] of Object.entries(files)) if (key.startsWith("maps/") && isObj(doc) && doc["id"] === read.doc.mapRef) mapDoc = doc;
   const map = mapDoc === undefined ? null : readMap(mapDoc), tiles = installOne(TERRAIN, {}).out?.tiles, grid = map !== null && map.ok && tiles !== undefined ? createGrid(map.doc, tiles) : null;
   const taken = new Set<string>(); for (const n of read.doc.neutrals) taken.add(`${n.at.c},${n.at.r}`); const pool = read.doc.enemyPool; if (pool.mode === "fixed") for (const e of pool.entries) taken.add(`${e.at.c},${e.at.r}`); else for (const s of pool.spawns) taken.add(`${s.c},${s.r}`);
-  const free = (sq: { c: number; r: number }): boolean => !taken.has(`${sq.c},${sq.r}`) && grid !== null && grid.isOpen(sq), spots = read.doc.playerSpawns, next = arrival(read.doc.links ?? [], fromId ?? "\u0000", spots, party.members.length, free);
+  const free = (sq: { c: number; r: number }): boolean => !taken.has(`${sq.c},${sq.r}`) && grid !== null && grid.isOpen(sq), inside = (sq: { c: number; r: number }): boolean => grid !== null && grid.inBounds(sq), spots = read.doc.playerSpawns, next = arrival(read.doc.links ?? [], fromId ?? "\u0000", spots, party.members.length, free, inside);
   const playerSpawns = next.map((sq) => { const hit = spots.find((s) => s.c === sq.c && s.r === sq.r); return hit !== undefined && hit.facing !== undefined ? { c: sq.c, r: sq.r, facing: hit.facing } : { c: sq.c, r: sq.r }; });
   const opened = openProject({ ...files, [path]: { ...(isObj(stage) ? stage : {}), playerSpawns } }, toId); if (opened.docs === null) return opened;
-  const side = read.doc.sides?.loadout ?? party.side, carried = carryInto(party, side), rules = { ...opened.docs.rules, carry: carried.carry }, levels = opened.docs.levels === undefined || carried.start === undefined ? opened.docs.levels : { ...opened.docs.levels, start: carried.start }; return { docs: { ...opened.docs, chosen: party.members.map((m) => m.unitId), rules, ...(levels === undefined ? {} : { levels }) }, error: opened.error };
+  const side = read.doc.sides?.loadout ?? party.side, carried = carryInto(party, side), rules = { ...opened.docs.rules, carry: carried.carry }, levels = opened.docs.levels === undefined || carried.start === undefined ? opened.docs.levels : { ...opened.docs.levels, start: carried.start }, bench = party.members.slice(next.length); return { docs: { ...opened.docs, chosen: party.members.map((m) => m.unitId), rules, ...(levels === undefined ? {} : { levels }), ...(bench.length === 0 ? {} : { bench }) }, error: opened.error };
 }
```

### `tools/play-stage/load.ts` (edited)

```diff
diff --git a/tools/play-stage/load.ts b/tools/play-stage/load.ts
index 3d55dc4..0290107 100644
--- a/tools/play-stage/load.ts
+++ b/tools/play-stage/load.ts
@@ -20,7 +20,7 @@ export const RECIPES: Readonly<Record<string, Recipe>> = Object.freeze({
 export const recipeIn = (map: Readonly<Record<string, Recipe>>, id: string): Recipe => (Object.hasOwn(map, id) ? map[id] ?? fallback(id) : fallback(id));
 export const recipeOf = (id: string): Recipe => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
 export type Looks = { readonly canopy: readonly (readonly [number, number])[]; readonly braziers: readonly (readonly [number, number])[] };
-export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly links?: readonly CoreLink[]; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>>; readonly win?: WinRule; readonly levels?: LevelSetup };
+export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly links?: readonly CoreLink[]; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly bench?: readonly { readonly unitId: string; readonly hp: number }[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>>; readonly win?: WinRule; readonly levels?: LevelSetup };
 export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>>; readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[] }): { input: SimInput; talk: Readonly<Record<string, string>> } {
   const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
   if (hostSeed === undefined) throw new Error("play: seed");
```

### `tools/play-stage/match.ts` (edited)

```diff
diff --git a/tools/play-stage/match.ts b/tools/play-stage/match.ts
index 00bb726..505555b 100644
--- a/tools/play-stage/match.ts
+++ b/tools/play-stage/match.ts
@@ -119,7 +119,7 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
     },
     closeTalk() { talk = null; if (play.world.phases.battle === "actMenu") spend(); play.focus(null); },
     onLink(fn: (link: LinkEvent) => void): void { tell = fn; },
-    party() { const rules = play.world.rules; if (rules === null) throw new Error("play: party needs rules"); const hp: Record<string, number> = Object.create(null); for (const row of rules.state().units) { const u = play.world.units.get(row.id); if (u !== undefined && u.alive && u.side === me && !Object.hasOwn(hp, u.unitId)) hp[u.unitId] = row.hp; } const levels = play.world.levels; return partyOf(play.world.units.all(), hp, me, levels === null ? null : levels.state().bars); },
+    party() { const rules = play.world.rules; if (rules === null) throw new Error("play: party needs rules"); const hp: Record<string, number> = Object.create(null); for (const row of rules.state().units) { const u = play.world.units.get(row.id); if (u !== undefined && u.alive && u.side === me && !Object.hasOwn(hp, u.unitId)) hp[u.unitId] = row.hp; } const levels = play.world.levels, got = partyOf(play.world.units.all(), hp, me, levels === null ? null : levels.state().bars), extra = (body.bench ?? []).filter((m) => !got.members.some((row) => row.unitId === m.unitId)); return extra.length === 0 ? got : { ...got, members: [...got.members, ...extra] }; },
     recentreTarget(): Sq | null {
       const cur = play.selected === null ? undefined : play.world.units.get(play.selected);
       if (cur !== undefined && cur.alive) return { c: cur.at.c, r: cur.at.r };
@@ -138,7 +138,7 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
       const levels = play.world.levels, bars = levels === null ? null : levels.state().bars, bar = bars?.find((row) => row.id === me), at = levels === null ? undefined : levels.rules.thresholds[bar?.level ?? 0];
       const xp = levels === null ? null : { level: bar?.level ?? 0, now: bar?.xp ?? 0, need: typeof at === "number" ? at : 0, top: bar !== undefined && bar.level >= levels.rules.thresholds.length || typeof at !== "number" };
       return {
-        turn: side === me ? "YOUR TURN" : "ENEMY TURN", side, mine: side === me, name: on ? names[unit.unitId] ?? recipeIn(body.recipes, unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk, xp,
+        turn: side === me ? "YOUR TURN" : "ENEMY TURN", side, mine: side === me, name: on ? names[unit.unitId] ?? recipeIn(body.recipes, unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk, xp, note: body.bench === undefined || body.bench.length === 0 ? null : `Not placed: ${body.bench.length} of your team had no free cell. They stay with the party.`,
         actions: { basic: btn(menu, basic.length > 0), spell: btn(menu && spellOn, spells.length > 0), talk: btn(on && interact.length > 0, interact.length > 0), wait: btn(phase === "actMenu", phase === "actMenu"), end: btn(true, true) },
       };
     },
```

### `tools/play-stage/hud.ts` (edited)

```diff
diff --git a/tools/play-stage/hud.ts b/tools/play-stage/hud.ts
index 1f83505..c2af22b 100644
--- a/tools/play-stage/hud.ts
+++ b/tools/play-stage/hud.ts
@@ -3,14 +3,14 @@ export const XP_H = 28;
 export type HudView = {
   readonly turn: string; readonly side: string; readonly mine: boolean; readonly name: string; readonly hp: number; readonly max: number; readonly selected: boolean;
   readonly outcome: "win" | "lose" | "draw" | null; readonly turns: number; readonly talk: { readonly name: string; readonly text: string } | null;
-  readonly xp: { readonly level: number; readonly now: number; readonly need: number; readonly top: boolean } | null;
+  readonly xp: { readonly level: number; readonly now: number; readonly need: number; readonly top: boolean } | null; readonly note: string | null;
   readonly actions: { readonly basic: Btn; readonly spell: Btn; readonly talk: Btn; readonly wait: Btn; readonly end: Btn };
 };
 type Btn = { readonly show: boolean; readonly on: boolean };
 type Act = { choose(kind: "basic" | "spell" | "talk"): void; wait(): void; endTurn(): void; restart(): void; menu(): void; recentre(): void; closeTalk(): void };
-const css = `html,body{margin:0}#hud{position:fixed;inset:0;pointer-events:none;font:16px sans-serif;color:#f4efe2}#hud button{pointer-events:auto;min-width:48px;min-height:48px;border:0;border-radius:8px;background:#1c2838;color:#f4efe2}#top{position:absolute;left:0;right:0;top:0;height:${HUD_TOP}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#menu{width:48px;height:48px;margin-left:auto}#recentre{width:48px;height:48px;flex:none}#banner{position:absolute;left:0;right:64px;top:0;height:${HUD_TOP}px;box-sizing:border-box;background:#14213d;color:#e8c872;border-top:2px solid #e8c872;border-bottom:2px solid #e8c872}#plate{position:absolute;left:0;right:0;bottom:${ROW_FOOT}px;height:${PLATE_H}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#xp{position:absolute;left:0;right:0;bottom:${ROW_FOOT + PLATE_H}px;height:${XP_H}px;display:none;align-items:center;padding:0 8px;background:#101826;color:#f4efe2;pointer-events:none;z-index:2}#face{width:32px;height:32px;background:#2f6fad}#hp{width:120px;height:10px;background:#243044}#hp i{display:block;height:10px;background:#3dd68c}#row{position:absolute;left:0;right:0;bottom:24px;height:64px;display:flex;align-items:center;gap:8px;padding:0 8px}#end{margin-left:auto;margin-right:12px;outline:2px solid #2f6fad}#sheet{position:absolute;left:8px;right:8px;bottom:${ROW_FOOT + PLATE_H}px;max-height:35%;box-sizing:border-box;display:none;overflow:auto;background:#f4efe2;color:#1c140c;padding:8px;border-radius:8px;pointer-events:auto;font-size:16px}#sheet b{display:block}#sheet button{width:48px;height:48px}#veil{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(8,10,16,.72);pointer-events:auto}#card{background:#101826;padding:16px;border:2px solid #e8c872;text-align:center}#card button{margin:8px}#hud #banner{pointer-events:none}`;
+const css = `html,body{margin:0}#hud{position:fixed;inset:0;pointer-events:none;font:16px sans-serif;color:#f4efe2}#hud button{pointer-events:auto;min-width:48px;min-height:48px;border:0;border-radius:8px;background:#1c2838;color:#f4efe2}#top{position:absolute;left:0;right:0;top:0;height:${HUD_TOP}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#menu{width:48px;height:48px;margin-left:auto}#recentre{width:48px;height:48px;flex:none}#banner{position:absolute;left:0;right:64px;top:0;height:${HUD_TOP}px;box-sizing:border-box;background:#14213d;color:#e8c872;border-top:2px solid #e8c872;border-bottom:2px solid #e8c872}#plate{position:absolute;left:0;right:0;bottom:${ROW_FOOT}px;height:${PLATE_H}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#xp{position:absolute;left:0;right:0;bottom:${ROW_FOOT + PLATE_H}px;height:${XP_H}px;display:none;align-items:center;padding:0 8px;background:#101826;color:#f4efe2;pointer-events:none;z-index:2}#face{width:32px;height:32px;background:#2f6fad}#hp{width:120px;height:10px;background:#243044}#hp i{display:block;height:10px;background:#3dd68c}#row{position:absolute;left:0;right:0;bottom:24px;height:64px;display:flex;align-items:center;gap:8px;padding:0 8px}#end{margin-left:auto;margin-right:12px;outline:2px solid #2f6fad}#sheet{position:absolute;left:8px;right:8px;bottom:${ROW_FOOT + PLATE_H}px;max-height:35%;box-sizing:border-box;display:none;overflow:auto;background:#f4efe2;color:#1c140c;padding:8px;border-radius:8px;pointer-events:auto;font-size:16px}#sheet b{display:block}#sheet button{width:48px;height:48px}#veil{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(8,10,16,.72);pointer-events:auto}#card{background:#101826;padding:16px;border:2px solid #e8c872;text-align:center}#card button{margin:8px}#hud #banner{pointer-events:none}#note{position:absolute;left:8px;right:8px;top:${HUD_TOP}px;display:none;padding:4px 8px;background:#14213d;color:#e8c872;pointer-events:none}`;
 export function createHud(act: Act): { hideBanner(): void; render(view: HudView): void } {
-  const root = document.createElement("div"); root.id = "hud"; root.innerHTML = `<style>${css}</style><div id="top"><span id="pill"></span><button id="recentre" type="button">Recentre</button><button id="menu" type="button">Menu</button></div><button id="banner" type="button">YOUR TURN</button><div id="plate"><i id="face"></i><span id="who"></span><span id="hp"><i></i></span><span id="hpText"></span></div><div id="xp" aria-live="polite"></div><div id="row"><button id="attack" type="button">Attack</button><button id="spell" type="button">Spell</button><button id="talk" type="button">Talk</button><button id="wait" type="button">Wait</button><button id="end" type="button">End turn</button></div><div id="sheet"><b></b><span></span><button id="close" type="button">Close</button></div><div id="veil"><div id="card"><h2></h2><p></p><p id="turns"></p><button id="restart" type="button">Restart</button><button id="back" type="button">Back</button></div></div>`;
+  const root = document.createElement("div"); root.id = "hud"; root.innerHTML = `<style>${css}</style><div id="top"><span id="pill"></span><button id="recentre" type="button">Recentre</button><button id="menu" type="button">Menu</button></div><div id="note" role="status"></div><button id="banner" type="button">YOUR TURN</button><div id="plate"><i id="face"></i><span id="who"></span><span id="hp"><i></i></span><span id="hpText"></span></div><div id="xp" aria-live="polite"></div><div id="row"><button id="attack" type="button">Attack</button><button id="spell" type="button">Spell</button><button id="talk" type="button">Talk</button><button id="wait" type="button">Wait</button><button id="end" type="button">End turn</button></div><div id="sheet"><b></b><span></span><button id="close" type="button">Close</button></div><div id="veil"><div id="card"><h2></h2><p></p><p id="turns"></p><button id="restart" type="button">Restart</button><button id="back" type="button">Back</button></div></div>`;
   document.body.append(root);
   const q = (id: string): HTMLElement => { const n = root.querySelector(`#${id}`); if (!(n instanceof HTMLElement)) throw new Error(id); return n; };
   const banner = q("banner"), veil = q("veil"), sheet = q("sheet");
@@ -34,7 +34,7 @@ export function createHud(act: Act): { hideBanner(): void; render(view: HudView)
     const xp = q("xp"), row = view.xp; xp.style.display = row === null ? "none" : "flex"; xp.textContent = row === null ? "" : row.top ? `Level ${row.level} · Top level` : `Level ${row.level} · ${row.now}/${row.need} XP`;
     const title = q("card").querySelector("h2"), blurb = q("card").querySelector("p");
     if (over && title !== null && blurb !== null) { title.textContent = view.outcome === "win" ? "Victory" : view.outcome === "lose" ? "Defeat" : "Draw"; blurb.textContent = view.outcome === "lose" ? "Your units fell" : "All enemies defeated"; q("turns").textContent = `${view.turns} turns`; }
-    if (!held) banner.style.display = "none";
+    if (!held) banner.style.display = "none"; const note = q("note"); note.textContent = view.note ?? ""; note.style.display = view.note === null ? "none" : "block";
   };
   return { hideBanner, render };
 }
```

### `tools/baseline/page.ts` (edited)

```diff
diff --git a/tools/baseline/page.ts b/tools/baseline/page.ts
index 5c799ce..3aeb69b 100644
--- a/tools/baseline/page.ts
+++ b/tools/baseline/page.ts
@@ -1,19 +1,21 @@
 import { startMatch } from "../play-stage/page.ts";
-import { openCheckpoint } from "./checkpoint.ts";
+import { openCheckpoint, openShop, shopFiles } from "./checkpoint.ts";
+import { arriveIn } from "../play-stage/project.ts";
 import { canvasMbOf, heapPeakOf, readout, RUN_MS } from "./readout.ts";
 const read = document.querySelector("#read");
 if (!(read instanceof HTMLElement)) throw new Error("baseline: #read");
 const board = document.createElement("canvas"); board.id = "board"; document.body.prepend(board);
-const opened = openCheckpoint();
+const scene = new URLSearchParams(location.search).get("scene"), opened = scene === "shop" ? openShop() : openCheckpoint();
 if (opened.docs === null) read.textContent = `baseline: the checkpoint did not open\n${opened.error}`;
 else {
-  const host = window.requestAnimationFrame.bind(window); let t0 = 0, prev = -1, peak: number | null = null, lock = false; const gaps: number[] = [];
+  const host = window.requestAnimationFrame.bind(window); let t0 = 0, prev = -1, peak: number | null = null, lock = false; const gaps: number[] = [], swaps: number[] = [];
   const note = (ts: number): void => {
     if (lock) return; if (t0 === 0) t0 = ts; if (prev >= 0 && ts - t0 < RUN_MS) gaps.push(ts - prev); prev = ts;
     peak = heapPeakOf(peak, (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize);
-    read.textContent = readout({ gaps, elapsedMs: ts - t0, canvasMb: canvasMbOf([...document.querySelectorAll("canvas")].map((el) => ({ width: el.width, height: el.height }))), heapMb: peak, dpr: devicePixelRatio || 1 });
+    read.textContent = readout({ gaps, elapsedMs: ts - t0, canvasMb: canvasMbOf([...document.querySelectorAll("canvas")].map((el) => ({ width: el.width, height: el.height }))), heapMb: peak, dpr: devicePixelRatio || 1, ...(scene === "shop" ? { swaps, scene: "shop" } : {}) });
     if (read.textContent.startsWith("DONE")) lock = true;
   };
   window.requestAnimationFrame = (cb) => host((ts) => { note(ts); cb(ts); });
-  startMatch(opened.docs);
+  const travel: Parameters<typeof startMatch>[3] = (link, party) => { const got = arriveIn(shopFiles(), link.from, link.to, party); if (got.docs === null) { read.textContent = got.error; return; } swaps.push(gaps.length); document.querySelector("#board")?.remove(); document.querySelector("#hud")?.remove(); const next = document.createElement("canvas"); next.id = "board"; document.body.prepend(next); startMatch(got.docs, undefined, undefined, travel); };
+  if (scene === "shop") startMatch(opened.docs, undefined, undefined, travel); else startMatch(opened.docs);
 }
```

### `tools/baseline/readout.ts` (edited)

```diff
diff --git a/tools/baseline/readout.ts b/tools/baseline/readout.ts
index 191c6e3..fd671fc 100644
--- a/tools/baseline/readout.ts
+++ b/tools/baseline/readout.ts
@@ -12,7 +12,7 @@ export function canvasMbOf(sizes: readonly { readonly width: number; readonly he
 export function heapPeakOf(peak: number | null, used: number | undefined): number | null {
   return typeof used === "number" && Number.isFinite(used) ? Math.max(peak ?? 0, used / 1_048_576) : peak;
 }
-export function readout(input: { readonly gaps: readonly number[]; readonly elapsedMs: number; readonly canvasMb: number; readonly heapMb: number | null; readonly dpr: number }): string {
-  const f = framesOf(input.gaps), heap = input.heapMb === null ? "n/a" : input.heapMb.toFixed(1), head = input.elapsedMs >= RUN_MS ? "DONE\n" : "";
-  return `${head}baseline 06c · Skirmish (checkpoint.tileproj)\nframe ms p50 ${f.p50.toFixed(1)} p95 ${f.p95.toFixed(1)} max ${f.max.toFixed(1)}\ndropped (>25 ms) ${f.dropped} over 50 ms ${f.over50} of ${f.n}\ncanvas MB ${input.canvasMb.toFixed(1)} · dpr ${input.dpr.toFixed(1)}\nheap MB peak ${heap}\n${GC_LINE}`;
+export function readout(input: { readonly gaps: readonly number[]; readonly elapsedMs: number; readonly canvasMb: number; readonly heapMb: number | null; readonly dpr: number; readonly swaps?: readonly number[]; readonly scene?: string }): string {
+  const f = framesOf(input.gaps), heap = input.heapMb === null ? "n/a" : input.heapMb.toFixed(1), head = input.elapsedMs >= RUN_MS ? "DONE\n" : "", worst = (input.swaps ?? []).reduce((m, i) => Math.max(m, input.gaps[i] ?? 0, input.gaps[i + 1] ?? 0, input.gaps[i + 2] ?? 0), 0);
+  return `${head}${input.scene === "shop" ? "baseline 06c · Shop stairs (?scene=shop)" : "baseline 06c · Skirmish (checkpoint.tileproj)"}\nframe ms p50 ${f.p50.toFixed(1)} p95 ${f.p95.toFixed(1)} max ${f.max.toFixed(1)}\ndropped (>25 ms) ${f.dropped} over 50 ms ${f.over50} of ${f.n}\ncanvas MB ${input.canvasMb.toFixed(1)} · dpr ${input.dpr.toFixed(1)}\nheap MB peak ${heap}\n${GC_LINE}${input.swaps === undefined ? "" : `\nstage changes ${input.swaps.length}\nworst ms in 3 frames after a swap ${worst.toFixed(1)}`}`;
 }
```

### `tests/tools/autosave-links.test.ts` (edited)

```diff
diff --git a/tests/tools/autosave-links.test.ts b/tests/tools/autosave-links.test.ts
index a3c11db..2ded7f9 100644
--- a/tests/tools/autosave-links.test.ts
+++ b/tests/tools/autosave-links.test.ts
@@ -1,10 +1,22 @@
-import assert from "node:assert/strict"; import { test } from "node:test";
-import { createRng } from "../../src/core/rng/index.ts"; import { setAutosave } from "../../src/editor/stage/links.ts"; import { deleteStage, setStart } from "../../src/editor/stage/rooms.ts";
-import { readProject, type ProjectFiles } from "../../src/project/load/index.ts"; import { readManifest, readStage } from "../../src/project/read/index.ts"; import { readSession, sessionSave, settleSession } from "../../src/project/read/session.ts";
-import { createLevels } from "../../src/rules/levels/index.ts"; import { arrival, autosaves } from "../../src/rules/session/links.ts"; import { partyOf } from "../../src/rules/session/party.ts";
-import { SAVE_MIGRATIONS, type SaveChains } from "../../src/sim/migrations/save/index.ts"; import type { SaveHeader, SessionParty } from "../../src/types/core-types.ts";
-import { shopFiles } from "../../tools/baseline/checkpoint.ts"; import { readAutosave, slotOf, writeAutosave } from "../../tools/maker/session.ts"; import { memoryStore, type MakerStore } from "../../tools/maker/store.ts";
-import { createMatch } from "../../tools/play-stage/match.ts"; import { arriveIn, openProject } from "../../tools/play-stage/project.ts";
+import assert from "node:assert/strict";
+import { test } from "node:test";
+import { createRng } from "../../src/core/rng/index.ts";
+import { setAutosave } from "../../src/editor/stage/links.ts";
+import { deleteStage, setStart } from "../../src/editor/stage/rooms.ts";
+import { readProject, type ProjectFiles } from "../../src/project/load/index.ts";
+import { readManifest, readStage } from "../../src/project/read/index.ts";
+import { readSession, sessionSave, settleSession } from "../../src/project/read/session.ts";
+import { createLevels } from "../../src/rules/levels/index.ts";
+import { arrival, autosaves } from "../../src/rules/session/links.ts";
+import { partyOf } from "../../src/rules/session/party.ts";
+import { SAVE_MIGRATIONS, type SaveChains } from "../../src/sim/migrations/save/index.ts";
+import type { SaveHeader, SessionParty } from "../../src/types/core-types.ts";
+import { openShop, shopFiles } from "../../tools/baseline/checkpoint.ts";
+import { readout } from "../../tools/baseline/readout.ts";
+import { readAutosave, slotOf, writeAutosave } from "../../tools/maker/session.ts";
+import { memoryStore, type MakerStore } from "../../tools/maker/store.ts";
+import { createMatch } from "../../tools/play-stage/match.ts";
+import { arriveIn, openProject } from "../../tools/play-stage/project.ts";
 const S1 = "stage_01JDES00000000000000000001", S2 = "stage_01JDES00000000000000000002", H = "unit_01M81X2BX5ANZS5PWVAFHNCASA", R = "unit_01M81X2PKRZ2NQKAHDV247ZRX3", ID = "project_01M81X22DNRFYKC2MHE6JECEM3";
 type Obj = Record<string, unknown>; type Match = ReturnType<typeof createMatch>;
 const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v), bad = (e: unknown, message: string): boolean => e instanceof Error && e.message === message;
@@ -89,3 +101,27 @@ test("step 8 session save (D28): v1 only, migrated first by migrateSave, mismatc
   assert.equal(settled.to, S2); assert.equal(settled.from, null); assert.deepEqual(settled.party.members, [{ unitId: H, hp: 2 }]); assert.equal(settled.notes.length === 3 && settled.notes.every((n) => n.code === "saveRefDropped"), true);
   assert.deepEqual(atOf(createMatch(open(shopFiles(), settled.from, settled.to, settled.party), 200), H, "player"), [{ c: 0, r: 4 }]);
 });
+const nook = (open: readonly number[]): ProjectFiles => {
+  const files = shopFiles(), mapPath = "maps/map_01JDEM00000000000000000002.json", map = files[mapPath], stagePath = `stages/${S2}.json`, stage = files[stagePath], logic = isObj(map) ? map["logic"] : undefined, cells = isObj(logic) && Array.isArray(logic["terrain"]) ? logic["terrain"] : null;
+  if (cells === null || !isObj(map) || !isObj(logic) || !isObj(stage)) throw new Error("nook");
+  return { ...files, [mapPath]: { ...map, logic: { ...logic, terrain: cells.map((_, i) => open.includes(i) ? 0 : 1) } }, [stagePath]: { ...stage, enemyPool: { mode: "fixed", entries: [{ unitId: R, at: { c: 1, r: 4 } }] } } };
+};
+test("step 8 baseline ?scene=shop: two floors joined by stairs, and the readout adds stage changes and the worst post-swap frame", () => {
+  const opened = openShop(); assert.equal(opened.error, ""); if (opened.docs === null) throw new Error(opened.error); assert.equal(createMatch(opened.docs, 0).sides.contest, false);
+  const down = shopFiles()[`stages/${S1}.json`], up = shopFiles()[`stages/${S2}.json`]; if (!isObj(down) || !isObj(up) || !Array.isArray(down["links"]) || !Array.isArray(up["links"])) throw new Error("stairs");
+  const a = down["links"][0], b = up["links"][0]; assert.equal(isObj(a) && a["to"], S2); assert.equal(isObj(b) && b["to"], S1);
+  const gaps = [16, 16, 40, 61, 16, 16, 30], row = readout({ gaps, elapsedMs: 1000, canvasMb: 1, heapMb: null, dpr: 1, swaps: [2, 5], scene: "shop" });
+  assert.equal(row.endsWith("stage changes 2\nworst ms in 3 frames after a swap 61.0"), true); assert.equal(row.includes("over 50 ms 1 of 7"), true); assert.equal(row.startsWith("baseline 06c · Shop stairs (?scene=shop)\n"), true);
+  const plain = readout({ gaps, elapsedMs: 1000, canvasMb: 1, heapMb: null, dpr: 1 }); assert.equal(plain.includes("stage changes"), false); assert.equal(plain.includes("after a swap"), false); assert.equal(plain.startsWith("baseline 06c · Skirmish (checkpoint.tileproj)\n"), true);
+});
+test("step 8b spill: 2 chosen and 1 free spawn, so the second member spills to the nearest free walkable cell (BFS from the arrival cell) and survives an autosave round-trip", async () => {
+  const carried = party(20, [{ unitId: H, hp: 20 }, { unitId: R, hp: 2 }]), docs = open(nook([24, 25, 29]), S1, S2, carried), m = createMatch(docs, 200);
+  assert.deepEqual(atOf(m, H, m.sides.me), [{ c: 0, r: 4 }]); assert.deepEqual(atOf(m, R, m.sides.me), [{ c: 5, r: 4 }]); assert.deepEqual(m.party().members, carried.members); assert.equal(m.view().note, null);
+  const store = memoryStore(), wrote = await writeAutosave(store, header, S1, S2, m.party()), back = await readAutosave(store, want); assert.equal(wrote.ok, true); assert.equal(back?.ok, true); if (back !== null && back.ok) assert.deepEqual(back.save.party.members, carried.members);
+});
+test("step 8b no room: with no free walkable cell on the stage, the member stays off the board but in the party, with the notPlaced notice and one notice row", async () => {
+  const carried = party(20, [{ unitId: H, hp: 20 }, { unitId: R, hp: 2 }]), docs = open(nook([24, 25]), S1, S2, carried), m = createMatch(docs, 200);
+  assert.deepEqual(atOf(m, R, m.sides.me), []); assert.deepEqual(docs.bench, [{ unitId: R, hp: 2 }]); assert.deepEqual(m.party().members, carried.members);
+  assert.equal(m.world.notices.some((n) => n.code === "notPlaced"), true); assert.equal(m.view().note?.startsWith("Not placed: 1 of your team had no free cell"), true);
+  const store = memoryStore(); assert.equal((await writeAutosave(store, header, S1, S2, m.party())).ok, true); const kept = await readAutosave(store, want); assert.equal(kept?.ok, true); if (kept !== null && kept.ok) assert.deepEqual(kept.save.party.members, carried.members);
+});
```

