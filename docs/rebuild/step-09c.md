# Rebuild record: step 9c, link markers on the play board

Original brief: [`docs/maker/steps/step-09c-link-markers.md`](../maker/steps/step-09c-link-markers.md) on the merge (r1, blob `c7eddfc6`, sha256 `b38c88c92d5f21395d80adb536eba4f9de95e56454d17323dae7a1185ab7a0af`, 90 lines). Delivery L13; Goal L20; Read first L28; Rules L36; Build L42; Named test L52; Smoke L55; Must NOT L62; Done when L66; Measured L70; Baseline republish L78; Carries L82; EA ruling L89. Count command L50; hard per-file caps L45–47; hard gate 400 at L48 (caps sum 95; trial 62; target under 120). This is **9c**, a small render-only follow-on after 9b (upload editor, merged as `a1d01698`): the play-stage board draws a marker on every stage link cell, so a player can see where a link is before a unit lands on it. The guide is unchanged from the product base through the merge; current main adds only the 9c r1 QA review. Rulings from the CoS chat are labelled **EA ruling**.

Sources: PR #102 and branch `step/step-09c-link-markers-r1-chatA` (r1 tip `a1bc6883`, r1 code head `838a17bd`); `handback/step-09c-link-markers/r1/HANDBACK.md` at `a1bc6883` and on the merge (HB, blob `246e5ffa`, 74 lines, sha256 `9d7ea2cf54d900397f295243e16504aa780e7649675838258fcd0fb4be28ab35`); CoS verify report `/workspace/share/step-09c-r1-verify/report.md` (V, 48 lines, sha256 `33f52d30bab896bce1615273c0377a5504efc3475baf0b6b0e5727506178fb2b`, hash-object `3bd9d76098109d46ce04aa56fddf599df1935fb8`). `docs/qa/step-09c-r1-review.md` on main `eda7fae2` (QA, blob `4a61fd3c`, 19 lines, sha256 `db2180eef382a36444da5e2fd4d88605a29eec5a5fc2ab6214e3f0f1ee71e7ee`): **OK TO MERGE**, no must-fix, no rework round. Line cites use HB, V and QA. Product line cites are at merge `9088feb2` (tree `8669ef89`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `2176307096c22c0dd94980bfc38a32646e7b9897`, 2026-11-25 02:03 (UK time). Floor **1142** tests (guide L9: 9b floor 1141 + N=1). After this merge the floor is **1142**. The guide was trialled on `0436fd50` + the 9b r2 trial patch; the go-line named this later main (the 9b merge plus the r1 QA review). The product count against `0436fd50` is not the official 9c number, because that range also includes 9b and later docs |
| Main at merge | `df771fef4109bc5ef2500c9c2fe923a05701c62e`, 2026-11-25 02:09 (UK time), tree `b9d29e06`, the 9b rebuild record + README row 24 + QA rebuild review, docs-only on `21763070`. This is the merge's first parent. Official 9c product against this parent is the same 87 as against the go-line base |
| r1 commits | on `step/step-09c-link-markers-r1-chatA`: `838a17bdb01afb7bfd1dd0691f5dc069e3d59a70` Step 9c: draw a marker on every stage link cell (code head, tree `0278a961b783701eb1ed99e7838ffe55f79e6069`, 2026-11-25 02:28 UK time), `a1bc6883b78508e79c0aad9d9463830f8090a373` docs(handback): step 9c link markers r1 (tree `74ec909f964ead53ce65d38d79b31ad02de55952`, 2026-11-25 02:31 UK time). Linear, two commits, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Tip vs code is the r1 hand-back folder only: `HANDBACK.md` (74 lines). The s9c (and sibling) shots were produced and not committed; the tip folder holds `HANDBACK.md` only (HB, V, QA) |
| r1 verdict | Product green was 1142/0/0/0 and the official count was 87, with every cap kept (`board.ts` 20/20) (HB:13–27, V, QA). CoS verify of r1 was PASS (V). QA **OK TO MERGE**, no must-fix (QA). Predicted merge tree onto then-main `df771fef` was `8669ef89` (V, QA; QA reproduced it with `git merge-tree`). That tree **differs from the tip tree** `74ec909f`, because main had moved by the 9b rebuild docs. PR #102 "step 09c: link markers (r1, ChatA)" was opened from the branch after the hand-back (the HANDBACK PR line was already written as if it existed; QA, V, HB:3) |
| Merge | PR #102, merge commit `9088feb2a5ee44c002023cf2d5783991b4471771`, 2026-11-25 04:24 (UK time). Tree `8669ef89cfa32475923ce22d67593b0089ae4c05` (the same tree CoS and QA predicted against main `df771fef`; V, QA). First parent `df771fef4109bc5ef2500c9c2fe923a05701c62e`, second parent `a1bc6883`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. `npm test` on the merge was **1142 pass / 0 fail** |
| After the merge | main is `eda7fae21730a76cab017f24c19cdb02f6958035`, 2026-11-25 04:25 (UK time), tree `217b04487ac724d145d0628f79d4c6d3e6df4a24`, which adds only `docs/qa/step-09c-r1-review.md` (19 insertions, sha256 `db2180ee`, hash-object `4a61fd3c`) |
| Tests | 1141 + N=1 (named test 1 in `tests/tools/link-markers.test.ts`) = **1142 pass / 0 fail**. Floor after this merge is **1142** (HB:17–25, V, QA) |

## (b) Files

From `git diff --name-status 21763070..838a17bd -- . ':!handback/**' ':!node_modules'`. Line counts are `git diff --numstat` insertions and deletions against the product base, at the r1 code head (the accepted 9c measure). The same product files are on the merge tree `8669ef89`. The r1 review doc landed on main `eda7fae2` after the merge and is **not** in the official 400. The new s9c smoke is counted in the 400 (guide L11, L47).

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `tools/play-stage/board.ts` | M | 19 / 1 | 20 (L45) | yes. **20** (sha256 `22dca4194b11929c0ad7ac44573360509073db241c33f549b8db14e647ba5031`) |
| `tests/tools/link-markers.test.ts` | A | 26 / 0 | 30 (L46) | yes. **26** (sha256 `a844a5723c5ea6fc3e44a54dc106ba0e47d10550ec0b867d9ea8bcfdd4c8fb85`) |
| `handoff/steps/tests/s9c-link-markers/smoke.mjs` | A | 41 / 0 | 45 (L47) | yes. **41** (sha256 `fbd9185903411842914c403ef0a225bedfa7ed85942c9a880ae68fbcb1d5ec73`) |

No diff under `src/**`, `data/`, `fixtures/`, the format, `behaviour-library/`, `tools/painter-proto/`, `tools/ui-shell/`, `tools/play-stage/match.ts`, `tools/maker/levels.ts`, `tools/play-stage/hud.ts`, `tools/play-stage/page.ts` or `tools/maker/**`. The play stage still has no `tools/maker` import. No existing test or smoke was edited (the only test/smoke paths in the diff are the two new files). s9b (`82bfe5ea…`, 67 lines), s9 (`7f8c6b19…`), s8 (`0de37442…`, 44 lines), s8c (`5c6071b3…`), s6d (`e371ec7b…`) and S0 (`d528795e…`) are unedited. Official G7 at the r1 code head or r1 tip against `21763070`, and at the merge against first parent `df771fef`, is **3 files changed, 86 insertions(+), 1 deletion(-)** = 87 ≤ 400. Every per-file cap is kept (tightest: `board.ts` 20/20, tests 26/30, smoke 41/45). Caps sum 95 (guide L48) is not a second gate; the target under 120 also holds. The trial on `0436fd50` + 9b r2 was 3 files, 61+/1− = 62. Shipped 87 is above that trial (the test is 26 vs the trial 19; the smoke is 41 vs 32; `board.ts` is 20 vs 11). No file is near 500. No new dependency. Lockfile blob `85b42f99` is unchanged vs the product base. No gh-pages. No new rAF, timer or loop.

## (c) Key code and git commands

Step 9c is render only (guide L20–26, Rules 1–4, EA ruling L89). On the play board, every cell that holds a stage link shows a small 16×16 marker, read from the stage's own link data (`body.links`). Stairs look like steps, a door like a door, a gate like bars; any other kind gets a plain diamond. The marker sits **above** the floor, the backgrounds and the blue reach squares, and **below** the units, and it is readable at 360 px wide. No rule change, no new format fields, nothing in `src/core` or `src/sim`, and the play stage still never imports `tools/maker`. The optional "Stairs to <stage name>" info row is left out. No auto-slice, starter-frame art, or markers in the maker's stage editor. No new rAF, timer or loop. Only the three Build-table files change.

**Marker sheets (Rule 1).** `SHAPE` (`board.ts:38-43`) holds one 16-row mask per kind (`stairs`, `door`, `gate`, and `link` for the generic diamond). `linkPx` (`:44-53`) paints cream (248, 244, 230) on lit pixels, a dark edge (16, 20, 28) on any pixel that touches a lit neighbour, and leaves the rest transparent so the floor shows through. Bit 0 is the left column. The picture is stored in the existing bake cache, one entry per kind that was asked for. `pixelsOf` (`:54-55`) starts with `if (id.startsWith("play:link-")) return linkPx(id.slice(10));`, so an unknown `play:link-*` id gives `undefined` and is not cached. Stairs are three treads (72 cream pixels, 134 opaque). The door is a slab with a window (80 cream). The gate is four bars with a top and a bottom rail (52). `link` is a filled diamond centred on (7, 7) (41) (HB:65–66).

**One marker per link (Rule 2).** After `let looks = dress(…)` (`:96`), `marks` (`:97`) is one `fxGround` overlay per entry in `body.links`, sheet `play:link-<type>` when `SHAPE` has that type (`Object.hasOwn`), else `play:link-link`, at `x = c * TILE, y = r * TILE`. It is built once per match (a stage change starts a new match, so it is never stale). The sheet is 16×16; `TILE` is 16, so the marker fills the cell.

**Above the squares, below the units (Rule 3).** The `overlays` line (`:153`) returns that same `marks` array when nothing is selected and the phase is not `targeting`, so the world-scene memo holds. Otherwise the overlays are reach and path (only while a unit is selected), then the aim squares, then `marks`. The marker is last in the `fxGround` band, so it draws on top of those squares and under every unit. Targeting with nothing selected still shows the aim squares (base behaviour kept), with marks on top (QA). `fxGround` already paints after the floor and the backdrop and before units; nothing in `src/` changes.

**linkPx lookup (QA carry).** `marks` uses `Object.hasOwn(SHAPE, link.type)`, so an unknown link type draws the generic diamond and is not a silent miss (QA). `linkPx` itself indexes `SHAPE` with a plain lookup (`:45`). `pixelsOf("play:link-constructor")` therefore returns an empty 16×16 instead of `undefined`. That path is not reachable from data. Use `Object.hasOwn` in `linkPx` on the next touch (QA).

The one new named test, in `tests/tools/link-markers.test.ts`, one import per line, at `:11` (guide L52–53, V, QA):

```ts
test("step 9c link markers: the shop's stairs at c1,r4 draw a marker above the floor and below the units, and it stays on while a unit is selected", () => {
```

It opens the shop, builds a scene link, and asserts exactly one `play:link-stairs` cmd on `fxGround` at c1,r4; the idle `overlays` array is reused; after `SelectUnit` on the hero (reach not empty) the last overlay is still the marker and the draw list still has it; `pixelsOf` gives a picture with more than 20 and fewer than 256 opaque pixels for `stairs`, and opaque pixels for `door`, `gate` and `link`; `play:link-nope` is `undefined`.

QA mutations, each fails that test: a 9b-only `board.ts`; marks drawn under reach (first instead of last); a new idle `overlays` array every frame (memo break) (QA).

s9c (`handoff/steps/tests/s9c-link-markers/smoke.mjs`, sha256 `fbd9185903411842914c403ef0a225bedfa7ed85942c9a880ae68fbcb1d5ec73`, 41 lines, port 8814) is `smoke.mjs . 8814 r1`: 6 ok lines and `SMOKE PASS` (HB:29–38, V, QA). It uses `waitForFunction` only, with no `waitForTimeout`, and taps by touchscreen at 390 and 360. At 390 the hero blob is 4096 px and the stairs cell has 1152 light pixels (floor cell 0). At 360 the blob is 2304 px and the stairs cell has 648 (floor 0). After the tap the plate is `Hero 20/20` and the stairs cell is unchanged. Those light-pixel counts are below the trial (1440 / 810) because the shipped stairs shape has 72 cream pixels (72 × 16 device px at 64 px cells = 1152; × 9 at 48 px cells = 648). The gate is still `stairs > 20` and `floor === 0` (V, QA). Shots go to `handback/step-09c-link-markers/r1/` and must not be committed. s9b stays `82bfe5ea64dc4c222630ca29eaaff58d7b4a9c8297146ef8eaaff63b9aa99169`, unedited, rerun as `smoke.mjs . 8813 r1`: 14 ok and `SMOKE PASS`. s9 stays `7f8c6b199b69de7855f70f6a6b7fbe1a9bd237205341a79d9893bfe654c65b9d`, unedited: 12 ok and `SMOKE PASS`. s8 stays `0de374426b21b2bd61036b23cc3854e961768fa3754d0aafc2dd9d056657c696`, unedited: 16 ok and `SMOKE PASS`. s8c stays `5c6071b34e442287abfc91fddafec46a01f91dfb60a12d627314fa24a06c2967`, unedited: 8 ok and `SMOKE PASS` (stage changes 1). s6d stays `e371ec7b3bc89997ceab016c14d9fab0d26598d41c19e6dce9245efcfec2f05d`, unedited: 14 ok and `SMOKE PASS`. S0 stays `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, identical on the base, the code head, the tip and the merge (V): 14 ok and `TOUCH SMOKE PASS`. The HANDBACK notes that an s8c run beside the other smokes once missed the 390 hero blob (the blue box is not square while a water frame matches the same test). Alone, and in the CoS and QA solo reruns, it passed 8 ok. The file was not edited (HB:71, V, QA).

Export audit on the clean code head, counted on the play-stage tree, the baseline tree, and the maker build's `play-stage/` directory directly: **133 / 147 / 133**, empty hit list, no `window.__play` in the play-stage or baseline release, `AUDIT PASS` (V). `s8-audit.mjs` also reports `AUDIT PASS`; its loose maker-play count is 146 (the same known filter as 8a–9b). No audit script was committed. No new built file, so the counts stay at the 9b figures. HANDBACK L44 and L70 say `/workspace/share/s8/s8-audit.mjs` was not on the builder's sandbox disk; it is on the shared box (V).

`npx tsc --noEmit -p tools/tsconfig.json` still exits 2 with the three errors already on the base, at `tools/effect-designer/page.ts:101` and `tools/maker/home.ts:88` twice. No new error (HB:27, V, QA). Leave them.

The official count command (guide L50, on a committed tree the `git add -N` is unnecessary):

```
# Product gate. The first parent of the merge is df771fef
# (docs-only on the go-line base 21763070). Official command at
# the r1 code head or r1 tip against 21763070, or at the merge
# against first parent df771fef:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   3 files changed, 86 insertions(+), 1 deletion(-)
#
# The same 87 at the merge against df771fef. At eda7fae2 (current
# main, which also adds the r1 review) against df771fef, the official
# command without ':!docs/**' is 4 files, 105 insertions, 1
# deletion. Adding ':!docs/**' again gives 87.
#
# Trial on 0436fd50 + 9b r2 was 3 files, 61 insertions, 1 deletion = 62.
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
# s9b handoff/steps/tests/s9b-art-upload/smoke.mjs sha256
#   82bfe5ea64dc4c222630ca29eaaff58d7b4a9c8297146ef8eaaff63b9aa99169
#
# s6d handoff/steps/tests/s6d-baseline/smoke.mjs sha256
#   e371ec7b3bc89997ceab016c14d9fab0d26598d41c19e6dce9245efcfec2f05d
#
# s9c handoff/steps/tests/s9c-link-markers/smoke.mjs sha256
#   fbd9185903411842914c403ef0a225bedfa7ed85942c9a880ae68fbcb1d5ec73
#
# Named test (npm test 1142/0, floor 1141 + N=1):
#   ✔ step 9c link markers: the shop's stairs at c1,r4 draw a marker above the floor and below the units, and it stays on while a unit is selected
#
# Smokes under google-chrome, at 390 and 360 CSS px:
#   s9c (8814 r1):
#     3 ok lines @390 and @360, then SMOKE PASS
#     390: hero 4096 px, stairs 1152 light px, floor 0; after tap, Hero 20/20, stairs 1152
#     360: hero 2304 px, stairs 648 light px, floor 0; after tap, Hero 20/20, stairs 648
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

**r1.** The marker sheets, the once-per-match `marks` list, the overlays line and the named test shipped in one feat commit and green was 1142/0. The official gate was 87, with every per-file cap kept (`board.ts` 20/20 is the tight one). s9c passed 6 ok, s9b 14, s9 12, s8 16, s8c 8, s6d 14 and S0 14. The export audit was clean on a direct count (no new built file). The tip holds only `HANDBACK.md`. CoS verify of r1 was PASS (V). The predicted merge tree against then-main `df771fef` was `8669ef89`, which differs from the tip tree because of the 9b rebuild docs.

No must-fix. Helper `d9523868` reviewed the s9c smoke against the step and the s8c smoke → SMOKE LOOKS SOUND (the hero box is the successful poll, so a later water frame cannot null it; steps 2 and 3 keep that pre-select box so reach squares cannot widen the blob) (HB:60, V). Helper `22045d3d` was still running when the HANDBACK was written; no change came from it. CoS read the board diff against Rules 1–4 and it matches (HB:61, V). QA's mutations closed a missing marker, marks under reach, and a broken idle-overlays memo (QA).

QA **OK TO MERGE**, no must-fix, no rework round (QA).

HB:3 said `PR: opened by Chief Of Staff from the branch.`, which was not yet true at hand-back or at CoS verify (V, QA, HB:3). PR #102 was opened later, then merged.

## (e) Do it right first time

- The work is only in `tools/play-stage/board.ts`, `tests/tools/link-markers.test.ts` and `handoff/steps/tests/s9c-link-markers/smoke.mjs`. Do not edit `src/**`, data, fixtures, the format, behaviour-library, painter-proto, ui-shell, `match.ts`, `levels.ts`, `hud.ts`, `page.ts` or `tools/maker/**`. The play stage still never imports `tools/maker`. Do not edit an existing test or smoke. Leave s9b, s9, s8, s8c, s6d and S0 unedited. The only new test is `tests/tools/link-markers.test.ts`; the only new smoke is s9c.
- Render only. No rule change, no new format field, no new rAF, timer or loop. `marks` is built once from `body.links`. `pixelsOf` must return `undefined` for an unknown `play:link-*` id. Prefer `Object.hasOwn` over a plain `SHAPE[kind]` lookup (see the `constructor` carry). When nothing is selected and there is no aim, `scene()` must return the same `marks` array every frame. Otherwise reach + path (when selected), then aim, then `marks`, so the marker sits above the squares and below the units.
- Do not add the optional "Stairs to <stage name>" row, starter-frame art, or markers in the maker's stage editor, in this step. The builder never publishes gh-pages. A baseline-08b republish that shows these markers needs the CEO's typed OK via CoS.
- Measure with the count command (guide L50): `git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'`. Count insertions plus deletions. **87** is the accepted number for this step (the trial was 62). The s9c smoke is inside that count (cap 45). On a merge whose first parent is `df771fef`, measure against that parent (or at the code head against `21763070`), and do not treat later QA docs as 9c lines.
- Paste the ok lines and `SMOKE PASS` / `TOUCH SMOKE PASS` from one solo run in § Smoke. Label the code head and the tip. The PR line should match whether a PR exists at hand-back time. Do not commit smoke shots. Running s6d or s8 rewrites tracked handback pngs locally; restore them, do not commit them. Run s8c solo: a parallel run can miss the 390 hero blob when a water frame makes the blue box non-square.
- Do not treat the open 9c carries, or the 9b leftovers, as 9c fixes.

## (f) Rebuild check

From a clean tree at `df771fef4109bc5ef2500c9c2fe923a05701c62e` (the merge's first parent; current main adds only the r1 QA review), write the product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit. Then measure. Without the commit, `git diff` misses the uncommitted new files. There is no CN on this step. A rebuild started at the go-line base `21763070` must also carry the 9b rebuild docs that already sat on `df771fef`; the three 9c product files still have to match the blob table.

```
# Product equality vs the merge (current main adds only the r1 QA review):
#   git diff 9088feb2 HEAD -- tools/play-stage/board.ts \
#     tests/tools/link-markers.test.ts \
#     handoff/steps/tests/s9c-link-markers/smoke.mjs
#   (empty)

# Product gate. Official command at the r1 code head or r1 tip against
# 21763070, or at the merge against first parent df771fef:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   3 files changed, 86 insertions(+), 1 deletion(-)
#
# The same 87 at the merge against df771fef. At eda7fae2 (current
# main, which also adds the r1 review) against df771fef without
# ':!docs/**': 4 files, 105 insertions, 1 deletion. Adding
# ':!docs/**' again gives 87.
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
# s9b handoff/steps/tests/s9b-art-upload/smoke.mjs sha256
#   82bfe5ea64dc4c222630ca29eaaff58d7b4a9c8297146ef8eaaff63b9aa99169
#
# s6d handoff/steps/tests/s6d-baseline/smoke.mjs sha256
#   e371ec7b3bc89997ceab016c14d9fab0d26598d41c19e6dce9245efcfec2f05d
#
# s9c handoff/steps/tests/s9c-link-markers/smoke.mjs sha256
#   fbd9185903411842914c403ef0a225bedfa7ed85942c9a880ae68fbcb1d5ec73
#
# Named test (npm test 1142/0, floor 1141 + N=1):
#   ✔ step 9c link markers: the shop's stairs at c1,r4 draw a marker above the floor and below the units, and it stays on while a unit is selected
#
# Smokes under google-chrome, at 390 and 360 CSS px:
#   s9c (8814 r1):
#     3 ok lines @390 and @360, then SMOKE PASS
#     390: hero 4096 px, stairs 1152 light px, floor 0; after tap, Hero 20/20, stairs 1152
#     360: hero 2304 px, stairs 648 light px, floor 0; after tap, Hero 20/20, stairs 648
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

- **`linkPx` indexes `SHAPE` with a plain lookup**, so `pixelsOf("play:link-constructor")` returns an empty 16×16 instead of `undefined`. Not reachable from data (`marks` uses `Object.hasOwn`). Use `Object.hasOwn` in `linkPx` on the next touch (QA).
- **The HANDBACK PR line** ("opened by Chief Of Staff from the branch") was written before PR #102 existed (QA, V, HB:3). Helper `22045d3d` was still running at hand-back (V, QA).
- Tight cap, for a rebuild to watch: `board.ts` 20/20. Shipped 87 is above the trial 62 (still ≤ 400, under the caps sum 95, and under 120).
- Shipped s9c light-pixel counts (1152 at 390, 648 at 360) are below the trial (1440 / 810) because the shipped stairs shape has 72 cream pixels. The gate (`stairs > 20`, `floor === 0`) holds (V, QA).
- HANDBACK L44 and L70 say `/workspace/share/s8/s8-audit.mjs` was not on the builder's sandbox disk. It is on the shared box. CoS ran it: AUDIT PASS (V).
- An s8c run beside the other smokes once missed the 390 hero blob. Solo reruns (builder, CoS, QA) passed 8 ok. The file was not edited (HB:71, V, QA).
- Running s6d or s8 rewrites tracked handback pngs locally. Restore them after a local run; do not commit them.
- **Still open, not 9c scope** (guide L84–87, QA): the optional "Stairs to <stage name>" info row; starter-frame art for markers; markers in the maker's stage editor; from 9b, `levels.ts` L64 unreachable narrowing, `match.ts:80` `landed('')`, `makerStore.writeBytes` not aborting the writable if the write throws, the upload handler reading the whole file into memory before the size check, and the raf-driver dpr guard. A baseline-08b republish that shows these markers needs the CEO's typed OK via CoS; the builder never publishes.
- **Closed here:** the link-visibility finding (CEO phone runs, via QA/CoS) (guide L83).

## Blob check

Each file must have exactly this git blob id at `9088feb2`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `tools/play-stage/board.ts` | `1348b69960ff71527807f002b062d2d05fa2b772` | 160 |
| `tests/tools/link-markers.test.ts` | `0dba863b7ec4924344f29b7dbcfbae2655ee202e` | 26 |
| `handoff/steps/tests/s9c-link-markers/smoke.mjs` | `1ba22e4c39bb9340b69671521d5afb90f6605d0d` | 41 |

## Appendix: full code as merged (step 9c, PR #102)

New files are `git show 9088feb2:<path>` in full. Edited files are `git diff df771fef 9088feb2 -- <path>`. (The product diff against the go-line base `21763070` is the same for these three files.)

### `tools/play-stage/board.ts` (edited)

```diff
diff --git a/tools/play-stage/board.ts b/tools/play-stage/board.ts
index 0afc63d..1348b69 100644
--- a/tools/play-stage/board.ts
+++ b/tools/play-stage/board.ts
@@ -35,7 +35,24 @@ function bake(id: string, rgb: number, letter: string): Pixels {
   if (rows !== undefined) for (let y = 0; y < rows.length; y += 1) { const bits = rows[y] ?? 0; for (let x = 0; x < 5; x += 1) if ((bits & (1 << (4 - x))) !== 0) { const o = ((y + 4) * TILE + (x + 5)) * 4; data[o] = 248; data[o + 1] = 244; data[o + 2] = 230; data[o + 3] = 255; } }
   const px = { w: TILE, h: TILE, data }; cache.set(id, px); return px;
 }
+const SHAPE: Readonly<Record<string, readonly number[]>> = {
+  stairs: [0, 0, 0, 15360, 15360, 15360, 0, 16320, 16320, 16320, 0, 16380, 16380, 16380, 0, 0],
+  door: [0, 0, 4080, 4080, 3120, 3120, 3120, 3120, 4080, 4080, 4080, 4080, 4080, 4080, 0, 0],
+  gate: [0, 0, 0, 8184, 4680, 4680, 4680, 4680, 4680, 4680, 4680, 4680, 8184, 0, 0, 0],
+  link: [0, 0, 0, 128, 448, 992, 2032, 4088, 2032, 992, 448, 128, 0, 0, 0, 0],
+};
+function linkPx(kind: string): Pixels | undefined {
+  const rows = SHAPE[kind]; if (rows === undefined) return undefined;
+  const id = `play:link-${kind}`, hit = cache.get(id); if (hit !== undefined) return hit;
+  const data = new Uint8ClampedArray(16 * 16 * 4), bit = (x: number, y: number): boolean => x >= 0 && y >= 0 && x < 16 && y < 16 && ((rows[y] ?? 0) & (1 << x)) !== 0;
+  for (let y = 0; y < 16; y += 1) for (let x = 0; x < 16; x += 1) {
+    const lit = bit(x, y); let edge = false; if (!lit) for (let dy = -1; dy <= 1 && !edge; dy += 1) for (let dx = -1; dx <= 1; dx += 1) if ((dx !== 0 || dy !== 0) && bit(x + dx, y + dy)) edge = true;
+    if (!lit && !edge) continue; const o = (y * 16 + x) * 4; data[o] = lit ? 248 : 16; data[o + 1] = lit ? 244 : 20; data[o + 2] = lit ? 230 : 28; data[o + 3] = 255;
+  }
+  const px = { w: 16, h: 16, data }; cache.set(id, px); return px;
+}
 export function pixelsOf(id: string): Pixels | undefined {
+  if (id.startsWith("play:link-")) return linkPx(id.slice(10));
   const dressed = dressPx(id); if (dressed !== undefined) return dressed;
   const sparked = fxPx(id); if (sparked !== undefined) return sparked;
   if (id === "play:floor") return bake(id, 0x243044, "");
@@ -77,6 +94,7 @@ export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
   const gestures = createGestureMapper({ cellPx: TILE, tapMaxPx: 12, holdMs: 500 }, { cols: world.grid.cols, rows: world.grid.rows, unitAt: (at) => world.units.occupantAt(at) });
   const fx = createPlayFx(body.effects), paint = new Map<string, { readonly sprite: string; readonly asset: SceneAsset }>(), seen = new Map<string, string>();
   let looks = dress(world.grid, body.looks), artBox: Record<string, SceneAsset> | null = null, artKey = "";
+  const marks = (body.links ?? []).map((link) => ({ band: "fxGround" as const, sheet: { id: `play:link-${Object.hasOwn(SHAPE, link.type) ? link.type : "link"}`, columns: 1, fw: 16, fh: 16 }, x: link.at.c * TILE, y: link.at.r * TILE }));
   for (const u of world.units.all()) { const recipeId = recipeIn(body.recipes, u.unitId).id, tone = paintOf(u.side, sides.me), prior = seen.get(recipeId); if (prior === undefined) seen.set(recipeId, tone); paint.set(u.id, { sprite: prior === undefined || prior === tone ? recipeId : `${recipeId}@${tone}`, asset: unitAsset(`${recipeId}@${tone}`) }); }
   let selected: string | null = null, pending: Sq | null = null, reach: Sq[] = [], preview: Sq[] = [], walk: Walk | null = null, aims: Sq[] = [], aimKind: "basic" | "spell" = "basic", followId: string | null = null, onLand: (() => void) | null = null;
   let route: (intent: DoorIntent) => unknown = (intent) => intend(intent);
@@ -132,7 +150,7 @@ export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
     scene() {
       sync();
       const aimSheet = aimKind === "spell" ? AIM_S : AIM_A, aimOver = world.phases.battle === "targeting" ? aims.map((c) => ({ band: "fxGround" as const, sheet: aimSheet, x: c.c * TILE, y: c.r * TILE })) : [];
-      const overlays = selected === null ? aimOver : [...reach.map((c) => ({ band: "fxGround" as const, sheet: REACH, x: c.c * TILE, y: c.r * TILE })), ...preview.map((c) => ({ band: "fxGround" as const, sheet: PATH, x: c.c * TILE, y: c.r * TILE })), ...aimOver];
+      const overlays = selected === null && world.phases.battle !== "targeting" ? marks : [...(selected === null ? [] : reach.map((c) => ({ band: "fxGround" as const, sheet: REACH, x: c.c * TILE, y: c.r * TILE }))), ...(selected === null ? [] : preview.map((c) => ({ band: "fxGround" as const, sheet: PATH, x: c.c * TILE, y: c.r * TILE }))), ...aimOver, ...marks];
       const key = world.units.all().map((u) => paint.get(u.id)?.sprite ?? "").join("\0"); if (artBox === null || artKey !== key) { artKey = key; artBox = { ...looks.assets, "play:fx": { sheet: { id: "play:fx", columns: 4, fw: TILE, fh: TILE } } }; }
       const assets = artBox;
       const units = world.units.all().map((u) => { const row = paint.get(u.id); if (row === undefined) throw new Error("play: paint"); assets[row.sprite] = row.asset; return { id: u.id, sprite: row.sprite, at: { c: u.at.c, r: u.at.r }, offset: u.offset, facing: u.facing, alive: u.alive }; });
```

### `tests/tools/link-markers.test.ts` (new)

```
import assert from "node:assert/strict";
import { test } from "node:test";
import { toDevice } from "../../src/runtime/render/camera.ts";
import { chunkedList, fitView, snapCamera } from "../../src/runtime/render/index.ts";
import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
import { openShop } from "../../tools/baseline/checkpoint.ts";
import { pixelsOf, TILE } from "../../tools/play-stage/board.ts";
import { sourceOf } from "../../tools/play-stage/looks.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
const opaque = (id: string): number => { const px = pixelsOf(id); if (px === undefined) return -1; let n = 0; for (let i = 3; i < px.data.length; i += 4) if ((px.data[i] ?? 0) > 0) n += 1; return n; };
test("step 9c link markers: the shop's stairs at c1,r4 draw a marker above the floor and below the units, and it stays on while a unit is selected", () => {
  const opened = openShop(); assert.equal(opened.error, ""); assert.notEqual(opened.docs, null); if (opened.docs === null) return;
  const m = createMatch(opened.docs), fit = fitView(390 * 3, 600 * 3, m.world.grid.cols, TILE, TILE), cam = snapCamera(0, 0, fit.s);
  const link = createSceneLink(sourceOf((id) => m.pixels(id))), at = toDevice(TILE, 4 * TILE, cam, fit);
  const draw = (): ReturnType<typeof chunkedList>["cmds"] => chunkedList(link.scene(m.scene(), { tMs: 0, stepMs: 10 }), fit, cam, 0, 10).cmds;
  const marker = (cmds: ReturnType<typeof draw>): typeof cmds => cmds.filter((c) => c.sheet === "play:link-stairs" && c.band === "fxGround" && c.dx === at.x && c.dy === at.y);
  const idle = m.scene(); assert.equal(idle.overlays, m.scene().overlays); assert.equal(marker(draw()).length, 1);
  const hero = m.world.units.all().find((u) => u.alive && u.at.c === 0 && u.at.r === 4); assert.notEqual(hero, undefined); if (hero === undefined) return;
  m.intend({ type: "SelectUnit", unitId: hero.id }); assert.ok(m.reach.length > 0);
  const over = m.scene().overlays, last = over[over.length - 1];
  assert.equal(last?.sheet.id, "play:link-stairs"); assert.equal(last?.band, "fxGround"); assert.equal(last?.x, TILE); assert.equal(last?.y, 4 * TILE);
  assert.equal(marker(draw()).length, 1);
  const stairs = opaque("play:link-stairs"); assert.ok(stairs > 20 && stairs < 256);
  assert.ok(opaque("play:link-door") > 0 && opaque("play:link-gate") > 0 && opaque("play:link-link") > 0);
  assert.equal(pixelsOf("play:link-nope"), undefined);
});
```

### `handoff/steps/tests/s9c-link-markers/smoke.mjs` (new)

```
// Step 09c link markers. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s9c-link-markers/smoke.mjs . 8814 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8814", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/baseline/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s9c-smoke-")); build(www, "0".repeat(40), root);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path.endsWith("/")) path += "index.html"; const file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
const out = join(root, `handback/step-09c-link-markers/${REV}`); mkdirSync(out, { recursive: true });
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const see = () => { const canvas = document.querySelector("#board"); if (!(canvas instanceof HTMLCanvasElement)) return null; const g = canvas.getContext("2d"); if (g === null) return null; const w = canvas.width, h = canvas.height, data = g.getImageData(0, 0, w, h).data; let n = 0, x0 = w, y0 = h, x1 = -1, y1 = -1; for (let y = 0, i = 0; y < h; y += 1) for (let x = 0; x < w; x += 1, i += 4) { const r = data[i] ?? 0, gr = data[i + 1] ?? 0, b = data[i + 2] ?? 0; if (b > r + 40 && b > gr + 20 && gr > r + 20 && b > 100 && r < 80) { n += 1; if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; } } if (n === 0 || x1 - x0 !== y1 - y0) return null; const bw = x1 - x0 + 1, rect = canvas.getBoundingClientRect(), sx = rect.width / w, sy = rect.height / h; return { n, x0, y0, bw, w, cx: rect.left + (x0 + bw / 2) * sx, cy: rect.top + (y0 + bw / 2) * sy }; };
const lights = (box) => { const canvas = document.querySelector("#board"); if (!(canvas instanceof HTMLCanvasElement)) return null; const g = canvas.getContext("2d"); if (g === null) return null; const data = g.getImageData(0, 0, canvas.width, canvas.height).data, cell = (cells) => { let c = 0; const xa = box.x0 + cells * box.bw, ya = box.y0; for (let y = ya; y < ya + box.bw; y += 1) for (let x = xa; x < xa + box.bw; x += 1) { const k = (y * box.w + x) * 4, r = data[k] ?? 0, gr = data[k + 1] ?? 0, b = data[k + 2] ?? 0; if (r > 120 && gr > 120 && b > 120) c += 1; } return c; }; return { stairs: cell(1), floor: cell(3) }; };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    const shot = async (name) => { if (width === 390) await page.screenshot({ path: join(out, name) }); };
    const quiet = () => errs.join(" | ") || "ok";
    await page.goto(`${origin}/?scene=shop`, { waitUntil: "load" });
    const hero = await page.waitForFunction(see, null, { timeout: 15000 }).then((h) => h.jsonValue());
    check(`1 hero @${width}`, hero !== null && hero.n > 0 && errs.length === 0, hero === null ? quiet() : `${hero.n}px ${quiet()}`);
    await shot("01-hero.png");
    const lit = hero === null ? null : await page.evaluate(lights, hero);
    check(`2 stairs @${width}`, lit !== null && lit.stairs > 20 && lit.floor === 0, lit === null ? "no hero" : `stairs ${lit.stairs} floor ${lit.floor}`);
    await shot("02-stairs.png");
    if (hero !== null) {
      await page.touchscreen.tap(hero.cx, hero.cy);
      const plate = await page.waitForFunction(() => document.querySelector("#who")?.textContent === "Hero" && document.querySelector("#hpText")?.textContent === "20/20", null, { timeout: 8000 }).then(() => page.evaluate(() => `${document.querySelector("#who")?.textContent ?? ""} ${document.querySelector("#hpText")?.textContent ?? ""}`)).catch((e) => String(e && e.message ? e.message : e));
      const still = await page.evaluate(lights, hero);
      check(`3 selected @${width}`, plate === "Hero 20/20" && still !== null && still.stairs > 20 && errs.length === 0, `${plate} stairs ${still === null ? "none" : still.stairs} ${quiet()}`);
      await shot("03-selected.png");
    } else check(`3 selected @${width}`, false, "no hero");
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
```

