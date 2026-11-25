# Rebuild record: step 10a, carries before the engine effect path

Original brief: [`docs/maker/steps/step-10a-carries.md`](../maker/steps/step-10a-carries.md) on the merge (r2, blob `35bebede`, sha256 `40ef961fab84cc129d2efa01f70f25a53cb857ce160c014ed5e651ce03b0eb7d`, 119 lines). Delivery L19; Why 10a L13; Goal L26; Read first L34; Rules L41; Build L53; Named tests L76; Smoke L82; Must NOT L86; Done when L90; Measured L95; Baseline republish L104; Carries L108. Count command L74; hard per-file caps L56–71; hard gate 400 at L72 (caps sum 128; trial 102). This is **10a**, a carries-only step after 9c (link markers, merged as `9088feb2`). It is not roadmap step 10 (the engine effect path). It clears the due carries so that path can start from a green tree with `effect_` ids: the stale s4c smoke, D22's write side (`effect_<ULID>` for new effects; existing `setup_` docs accepted for ever), `linkPx` `Object.hasOwn`, `writeBytes` abort, the upload read before the size check, the levels start loop, a null-grid early return, and the "baseline 06c" title. The guide is unchanged from the product base through the merge; current main adds only the 10a r1 QA review. Rulings from the CoS chat are labelled **EA ruling**.

Sources: PR #103 and branch `step/step-10a-carries-r1-chatA` (r1 tip `8ed982f4`, r1 code head `ffe56f93`); `handback/step-10a-carries/r1/HANDBACK.md` at `8ed982f4` and on the merge (HB, blob `789d716b`, 102 lines, sha256 `981877ddd94510ae2e225bb8b48790e181cf0293660b67598e6070a3ce6cb8a8`); CoS verify report `/workspace/share/step-10a-r1-verify/report.md` (V, 41 lines, sha256 `237ea9718a6973f4de39af086d4958b896f1fd3b8aa2e8eec3b73412a0ca8d6b`, hash-object `5d436b185ee6d419f77ff6733e91917eacf6b29d`). `docs/qa/step-10a-r1-review.md` on main `0673be7e` (QA, blob `db3f09ad`, 30 lines, sha256 `4a4e6953caf93b1e3bc6774691cd9343a837e4f9701d03830f463c5465c9b5aa`): **OK TO MERGE**, no must-fix, no rework round. QA postmerge on `c3e056ff` **PASSED** (tree `4f29428c`, parent 2 `8ed982f4`, 1146/0, pins 5/5, smoke 0 fail). Line cites use HB, V and QA. Product line cites are at merge `c3e056ff` (tree `4f29428c`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `31f4c0c4fb8d551464ae1aba41b8f4917141b42b`, 2026-11-25 05:15 (UK time), tree `49296921`. Floor **1146** tests (guide L10: 1142 + N=4). After this merge the floor is **1146**. The guide was trialled on `ea3b08f4`; the go-line named this later main (project-format r41, the 10a r2 guide and the QA reviews of that guide and of r41, docs-only on `ea3b08f4`). The product count against `ea3b08f4` is not the official 10a number, because that range also includes those docs |
| Main at merge | `751994a7af5b5353e523f19b3b87fb99621f507f`, 2026-11-25 13:29 (UK time), tree `f0646a01`, the baseline-08b publish-check, the 10b r1 guide and paste, the roadmap row 10 AGREED edit, and the 10b QA review, docs-only on `31f4c0c4`. This is the merge's first parent. Official 10a product against this parent is the same 107 as against the go-line base |
| r1 commits | on `step/step-10a-carries-r1-chatA`: `ffe56f93a9f415cf802f2ac734c12459eeae77f8` Step 10a: effect_ ids and the carries before the engine path (code head, tree `3e5521a212a6fc0811fde520cacf0aedd32f22de`, 2026-11-25 13:27 UK time), `8ed982f495272882eecb12bedaaaaa904ac90171` docs(handback): step 10a carries r1 (tree `9dc243dbac6d18a15a685829d46056a6ca17b4cd`, 2026-11-25 13:28 UK time). Linear, two commits, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Tip vs code is the r1 hand-back folder only: `HANDBACK.md` (102 lines). Smoke shots were produced and not committed; the tip folder holds `HANDBACK.md` only (HB, V, QA) |
| r1 verdict | Product green was 1146/0/0/0 and the official count was 107, with every cap kept (HB:28–39, V, QA). CoS verify of r1 was PASS (V). QA **OK TO MERGE**, no must-fix (QA). Predicted merge tree onto then-main `751994a7` was `4f29428c` (V, QA; QA reproduced it with `git merge-tree`). That tree **differs from the tip tree** `9dc243db`, because main had moved by the 10b and publish-check docs. PR #103 "step 10a: carries (r1, ChatA)" was opened from the branch after the hand-back (the HANDBACK PR line was already written as if it existed; QA, V, HB:3) |
| Merge | PR #103, merge commit `c3e056ff886f3dff28b555f47286f87bb6f99adf`, 2026-11-25 13:53 (UK time). Tree `4f29428cf0ba674881c306fdbce4977c31b30909` (the same tree CoS and QA predicted against main `751994a7`; V, QA). First parent `751994a7af5b5353e523f19b3b87fb99621f507f`, second parent `8ed982f4`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. `npm test` on the merge was **1146 pass / 0 fail**. A full `npm run green` on the merge was also **1146/0** (typecheck, lint, depcruise, check:state, check:law clean) |
| After the merge | main is `0673be7eb7e7ea6cfb8a59a10ff620ed19397abe`, 2026-11-25 13:56 (UK time), tree `be16680c89e37882914727b7a6329badb06bc63a`, which adds only `docs/qa/step-10a-r1-review.md` (30 insertions, sha256 `4a4e6953`, hash-object `db3f09ad`). QA postmerge on `c3e056ff` **PASSED** (tree `4f29428c`, parent 2 `8ed982f4`, 1146/0, pins 5/5, smoke 0 fail) |
| Tests | 1142 + N=4 (named tests 1–4 in `tests/editor/carries-10a.test.ts`) = **1146 pass / 0 fail**. Floor after this merge is **1146** (HB:32–39, V, QA) |

## (b) Files

From `git diff --name-status 31f4c0c4..ffe56f93 -- . ':!handback/**' ':!node_modules'`. Line counts are `git diff --numstat` insertions and deletions against the product base, at the r1 code head (the accepted 10a measure). The same product files are on the merge tree `4f29428c`. The r1 review doc landed on main `0673be7e` after the merge and is **not** in the official 400. The s4c smoke edit is counted in the 400 (guide L11, L56). Combined caps are noted where the Build table shares one cap across two files.

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `handoff/steps/tests/s4c-stages-maps/smoke.mjs` | M | 2 / 0 | 4 (L56) | yes. **2** (sha256 `405f9844062e4d0fc3b6323cb37cb276d60d532fe45d4765a93ccdfb97ddaaf7`) |
| `src/editor/effect/save.ts` | M | 2 / 2 | 4 (L57) | yes. **4** (sha256 `3794ce0f586870fbf8641b6158424331921a76a0180ead673b587402640d2710`) |
| `tools/effect-designer/page.ts` | M | 1 / 1 | 2 (L58) | yes. **2** (sha256 `cff26b4e4d5690a251f9460ba70336f34138d74699b41145d3c71faf7ca78cfa`) |
| `tools/effect-designer/store.ts` | M | 1 / 1 | 2 (L59) | yes. **2** (sha256 `883288e80e36927293e37a62377b73bd9ee0e090984e77a5eaf81d76aacbb325`) |
| `tests/editor/effect-e6-save.test.ts` | M | 4 / 4 | 10 (L60) | yes. **8** (sha256 `ffaf9119222aeba16cb155319d785805af0056b5e706ef099f1128359a379553`) |
| `tests/editor/effect-e6-qa2.test.ts` | M | 1 / 1 | 2 (L61) | yes. **2** (sha256 `95e2d0eb0bc70b3e1b3314015d3892a395eb4d842f583d773fa1abe91f8bd0c2`) |
| `tests/editor/effect-e7-carries.test.ts` | M | 4 / 4 | 10 (L62) | yes. **8** (sha256 `7b9dbafbeb19881ea768e86f71ad27a1717515d79cba2ef19685995899633344`) |
| `tools/play-stage/board.ts` | M | 1 / 1 | 2 (L63) | yes. **2** (sha256 `9607e73fc406167bf1260347ed5ee6a5473521ca96b1caf174d037f4c1d564ef`) |
| `tools/maker/store.ts` | M | 1 / 1 | 2 (L64) | yes. **2** (sha256 `da96210c6098dad77055db772551fa481036dff007750d346d6bdd014ec2400a`) |
| `tools/maker/art.ts` | M | 5 / 0 | 8 (L65) | yes. **5** (sha256 `0f6cb65a40364adfa8f0636b072d6036edad4a838758cd21f68e62274fe8bb12`) |
| `tools/maker/home.ts` | M | 2 / 2 | 4 (L66) | yes. **4** (sha256 `a203db0ed577f5879325753a762fb2e3d6d3e502d0cd8bc31f59d35514f7007b`) |
| `src/rules/levels/levels.ts` | M | 2 / 2 | 4 (L67) | yes. **4** (sha256 `dd234fa347740decf1d6c395fd02937eac2ab3564d53666006bbcc6a7974f449`) |
| `tools/play-stage/project.ts` | M | 2 / 1 | 4 (L68) | yes. **3** (sha256 `526a98d0a02b4c74a95fab14e041babc8680bd3d86e16776adcb2bde0ea6792e`) |
| `tools/baseline/index.html` | M | 1 / 1 | 4 shared (L69) | yes. with `readout.ts`, **4** (sha256 `2a56d1d70aa617ee6818536fb277a81758ae82b20f8351c145e078cdb2689427`) |
| `tools/baseline/readout.ts` | M | 1 / 1 | 4 shared (L69) | yes. with `index.html`, **4** (sha256 `3129de126830c02dcb80718c44799bcc41eccc0147edacac87bbbba2c2893629`) |
| `tests/tools/baseline-page.test.ts` | M | 1 / 1 | 6 shared (L70) | yes. with `autosave-links.test.ts`, **6** (sha256 `a9507f8e64ca6e5508757f660582be64ef02507d3553f61bd317b03fcb3838b2`) |
| `tests/tools/autosave-links.test.ts` | M | 2 / 2 | 6 shared (L70) | yes. with `baseline-page.test.ts`, **6** (sha256 `97e2ddda40afc16631d30e325464bb07076b2530936da846afe60d7cc43fb524`) |
| `tests/editor/carries-10a.test.ts` | A | 49 / 0 | 60 (L71) | yes. **49** (sha256 `8c75b5211aaf9acf9ec9275152cd5412ba2996824ca9076b49a570c4693fb2e1`) |

No diff under `src/core/`, `src/sim/`, `data/`, `fixtures/`, the format docs, `behaviour-library/`, `tools/painter-proto/` or `ui-shell/`. The play stage still has no `tools/maker` import. The only smoke path in the diff is s4c (+2, Rule 1); no other smoke or test outside the table is edited. Official G7 at the r1 code head or r1 tip against `31f4c0c4`, and at the merge against first parent `751994a7`, is **18 files changed, 82 insertions(+), 25 deletions(-)** = 107 ≤ 400. Every per-file cap is kept (several sit on their cap: `save.ts`, both effect-designer files, `effect-e6-qa2.test.ts`, `board.ts`, `maker/store.ts`, `home.ts`, `levels.ts`, the baseline pair, the two readout tests). Caps sum 128 (guide L72) is not a second gate. The trial on `ea3b08f4` was 18 files, 77+/25− = 102. Shipped 107 is 5 above that trial (the new test is 49 vs the trial 44). No file is near 500. No new dependency. Lockfile blob `85b42f99` is unchanged vs the product base. No gh-pages. No new rAF, timer or loop.

## (c) Key code and git commands

Step 10a is carries only (guide L3, L13–18, Rules 1–10). It does not add the `effects/` slot in `readProject`, the `legacyEffectId` / `badEffectId` rows, an Effect picker, or `effectRef` from data (those are step 10, as 10b/10c). No format-doc edits, no export or APK work, no gh-pages. Nothing game-specific in `src/core` or `src/sim`. The play stage still never imports `tools/maker`. No new rAF, timer or loop. Only the Build-table files change.

**s4c step 5 (Rule 1).** Since 6a, Test on a stage with no units says "Place a unit on this stage to test it." and stays in the maker. s4c still expected the play page, so the health-check run failed at both widths. The shipped smoke (`handoff/steps/tests/s4c-stages-maps/smoke.mjs:52–58`) now, after the existing `s:test` on the empty 1×1 Upstairs board, waits for that sentence and asserts `window.__play` is undefined and `from=stage` is still in the URL (`:54`). It then taps `s:cell:0,0`, waits for "Your team start", taps `s:place:spawn`, waits for the cell label to include "You", and taps `s:test` again (`:55`). The existing wait (`?stage=<id>`, `window.__play`, 1×1 grid) and the rest of the step stay. Two added lines; no other smoke is edited.

**D22 write side (Rules 2–3).** `SAVE.id` is `/^effect_[0-9A-HJKMNP-TV-Z]{26}$/` (`src/editor/effect/save.ts:3`). The fresh-id message is "a new effect needs a fresh effect_<ULID> at effects/<id>.json" (`:35`). The effect designer mints `effect_` (`tools/effect-designer/page.ts:82`). `saveAndUse` already checks the id only when `effect.doc === null`, so saving an existing `setup_` doc again keeps the same id, the same file, and the owner's `effect` answer. No migration, no re-id, nothing written back. The three new-effect tests (`effect-e6-save.test.ts`, `effect-e6-qa2.test.ts`, `effect-e7-carries.test.ts`) are re-pinned to `effect_`; test 39 also lists a well-formed `setup_<ULID>` as an invalid **new** id. Owner ids such as `setup_O` stay. `tests/tools/play-stage-p18.test.ts` (F17, a saved `setup_` effect driving a match by exact id) is unedited and is the read-fallback proof.

**linkPx (Rule 4).** `linkPx` (`tools/play-stage/board.ts:44–45`) is now `Object.hasOwn(SHAPE, kind) ? SHAPE[kind] : undefined`, so `pixelsOf("play:link-constructor")` is `undefined` instead of an empty 16×16. This closes the 9c QA carry.

**writeBytes (Rule 5).** `makerStore.writeBytes` (`tools/maker/store.ts:13`) writes and closes inside `try`; on a throw, `await w.abort?.()` and rethrow. `FileHandle`'s writable type in `tools/effect-designer/store.ts:2` gets `abort?(): Promise<void>`. `commitWrites` still removes the tmp files and names the failure.

**Upload read (Rule 6).** New `uploadBytes` (`tools/maker/art.ts:26–29`) reads `file.slice(0, 65536)`, then `readPicture`s that head. It returns only those bytes when the file is no bigger, when the header is over 4096 px a side, or when it isn't a picture (`sniffed` not `damaged …`). Otherwise it reads the whole file. `home.ts:169` calls it in place of `file.arrayBuffer()`. `addPicture` is unchanged and still gives the same refusal lines from the header bytes. Nothing is decoded, hashed or written before those checks. The upload still has no byte cap (a PNG whose header fits still reads whole); that remains a DSK/UX carry (QA, guide L116).

**Level start (Rule 7).** After the `badStart` guard (`src/rules/levels/levels.ts:37–38`), the loop reads `start as readonly LevelStart[]` and copies `offer` and `abilities` with a spread (`:41`). The unreachable `continue`, `: null` and `: []` go. Same behaviour. This is the "levels.ts L64" carry (the health check had pointed at `tools/maker/levels.ts` L64 by mistake). QA: the `as` is safe because `badStart` already validates every field of every row and throws first.

**Null grid (Rule 8).** In `arriveIn` (`tools/play-stage/project.ts:104`), `if (grid === null) return openProject(files, toId);` sits straight after `grid` is computed, and `free` / `inside` (`:106`) drop their `grid !== null &&`. A link into a stage with no map or terrain returns `openProject`'s own error without walking the arrival diamond.

**Baseline title (Rule 9).** `<title>baseline</title>` (`tools/baseline/index.html:3`) and the readout's first line "baseline · Shop stairs (?scene=shop)" / "baseline · Skirmish (checkpoint.tileproj)" (`tools/baseline/readout.ts:17`). There is no step tag, so the title cannot go stale again. The page's commit stays in `build.json`. The two tests that read that line are re-pinned.

The four new named tests, in `tests/editor/carries-10a.test.ts`, one import per line, at `:16`, `:26`, `:34` and `:44` (guide L76–80, V, QA):

```ts
test("10a D22 effect ids: a new effect is effect_<ULID> only; a saved setup_<ULID> effect is accepted for ever, saved again under its own id and file, never re-id'd", () => {
test("10a upload read: a 5000×10 PNG header plus 300 kB reads 65536 bytes; a GIF plus 300 kB reads 65536; a 96×144 PNG plus 300 kB and a JPG with no size marker in its head read the whole file; a small file reads whole", async () => {
test("10a writeBytes: a write that throws aborts the writable and rethrows; a good write closes it", async () => {
test("10a tidies: linkPx serves only its own shapes (play:link-constructor is undefined), and a link into a stage whose map is missing returns openProject's error", () => {
```

QA mutations, each fails the named test or the whole file, then the base file is restored: going back to the base `save.ts` fails test 1; base `art.ts` (no `uploadBytes`) makes the whole file fail; base `store.ts` fails test 3; base `board.ts` or `project.ts` fails test 4 (QA). The null-grid return and the level-start tidy keep the same behaviour as the base, so no test can tell them from the base on their own; test 4's second half and the existing 8a level-start tests pin that behaviour (guide L100).

s4c (`handoff/steps/tests/s4c-stages-maps/smoke.mjs`, sha256 `405f9844062e4d0fc3b6323cb37cb276d60d532fe45d4765a93ccdfb97ddaaf7`, 75 lines, port 8801) is `smoke.mjs . 8801`: 16 ok lines and `SMOKE PASS` at 390 and 360 (8 ok at each width, including step 5) (HB:44–64, V, QA). It uses `waitForFunction` / `waitText` only in the added lines, and taps by touchscreen. **s4c mutation** (builder, then CoS and QA reruns): the placement line removed and the second `s:test` kept, step 5 failed at both widths (`waitForFunction` timeout), `SMOKE FAIL` (14 ok / 2 fail). The committed smoke still places the team start (HB:64, V, QA). No other smoke is edited. All 18 smokes were rerun solo at the guide counts and passed: S0 14, s3 18 (first run, no flake), s4a 16, s4b 16, s4c 16, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6 (V, QA). Shots go to `handback/` and must not be committed. If s3 step 9 misses (sheet text ''), re-run it solo once; do not edit s3 in 10a (guide L84).

Export audit on the clean code head: `s8-audit.mjs` reports play-stage release **133**, baseline **147**, maker play tree **146** (the known loose `play-stage` filter), empty hit list, `AUDIT PASS` (V, QA, HB:71–78). HANDBACK also states the tight maker `play-stage/` count 133, and that `window.__play` is absent from the release trees. No audit script was committed. No new built file.

`npx tsc --noEmit -p tools/tsconfig.json` still exits 2 with the three errors already on the base, at `tools/effect-designer/page.ts:101` and `tools/maker/home.ts:88` twice. No new error (HB, V, QA). Leave them. Root `tsc --noEmit -p tsconfig.json` exits 0.

The official count command (guide L74, on a committed tree the `git add -N` is unnecessary):

```
# Product gate. The first parent of the merge is 751994a7
# (docs-only on the go-line base 31f4c0c4). Official command at
# the r1 code head or r1 tip against 31f4c0c4, or at the merge
# against first parent 751994a7:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   18 files changed, 82 insertions(+), 25 deletions(-)
#
# At ffe56f93 against 31f4c0c4: 18 files, 82 insertions, 25 deletions = 107.
# The same 107 at c3e056ff against 751994a7. At 0673be7e (current
# main, which also adds the r1 review) against 751994a7, the official
# command without ':!docs/**' is 19 files, 112 insertions, 25
# deletions. Adding ':!docs/**' again gives 107.
#
# Trial on ea3b08f4 was 18 files, 77 insertions, 25 deletions = 102.
#
# Named tests (npm test 1146/0, floor 1142 + N=4):
#   ✔ 10a D22 effect ids: a new effect is effect_<ULID> only; a saved setup_<ULID> effect is accepted for ever, saved again under its own id and file, never re-id'd
#   ✔ 10a upload read: a 5000×10 PNG header plus 300 kB reads 65536 bytes; a GIF plus 300 kB reads 65536; a 96×144 PNG plus 300 kB and a JPG with no size marker in its head read the whole file; a small file reads whole
#   ✔ 10a writeBytes: a write that throws aborts the writable and rethrows; a good write closes it
#   ✔ 10a tidies: linkPx serves only its own shapes (play:link-constructor is undefined), and a link into a stage whose map is missing returns openProject's error
#
# Smokes under google-chrome, at 390 and 360 CSS px, all solo:
#   S0 (8797) 14 ok, TOUCH SMOKE PASS
#   s3 (8798) 18 ok, TOUCH SMOKE PASS
#   s4a (8799) 16 ok, SMOKE PASS
#   s4b (8800) 16 ok, SMOKE PASS
#   s4c (8801) 16 ok (8 @390 including step 5, 8 @360 including step 5), SMOKE PASS
#   s5a (8802) 16 ok, SMOKE PASS
#   s5b (8803) 16 ok, SMOKE PASS
#   s5c (8804) 16 ok, SMOKE PASS
#   s6a (8805) 18 ok, SMOKE PASS
#   s6b (8806) 16 ok, SMOKE PASS
#   s6c (8807) 18 ok, SMOKE PASS
#   s6d (8808) 14 ok, SMOKE PASS
#   s7 (8809) 20 ok, SMOKE PASS
#   s8 (8810 r1) 16 ok, SMOKE PASS
#   s9 (8811 r1) 12 ok, SMOKE PASS
#   s8c (8812 r1) 8 ok, SMOKE PASS
#   s9b (8813 r1) 14 ok, SMOKE PASS
#   s9c (8814 r1) 6 ok, SMOKE PASS
#
# s4c mutation (placement line removed, second s:test kept):
#   FAIL 5 test @390 and @360 (waitForFunction timeout), SMOKE FAIL; smoke restored.
#
# Export audit as above; s8-audit.mjs 133 / 147 / 146, empty hit list, AUDIT PASS.
```

## (d) What went wrong, in order, and the fix

**r1.** The eight carries, the s4c smoke fix, the four named tests and the three re-pinned effect tests shipped in one feat commit and green was 1146/0. The official gate was 107, with every per-file cap kept. All 18 smokes passed at the guide counts, including s4c 16 ok at 390 and 360. The s4c mutation (placement line removed, second `s:test` kept) failed step 5 at both widths, then the committed smoke was restored. The export audit was clean. The tip holds only `HANDBACK.md`. CoS verify of r1 was PASS (V). The predicted merge tree against then-main `751994a7` was `4f29428c`, which differs from the tip tree because of the 10b and publish-check docs.

No must-fix. QA's mutations closed a missing `effect_` id rule, a whole-file read (`uploadBytes` removed), a `writeBytes` that does not abort, and a `linkPx` / missing-map tidy (QA). CoS and QA both reproduced the s4c mutation (V, QA, HB:64).

QA **OK TO MERGE**, no must-fix, no rework round (QA). QA postmerge on `c3e056ff` **PASSED** (tree `4f29428c`, parent 2 `8ed982f4`, 1146/0, pins 5/5, smoke 0 fail).

HB:3 said `PR: opened by Chief Of Staff from the branch.`, which was not yet true at hand-back or at CoS verify (V, QA, HB:3). PR #103 was opened later, then merged.

## (e) Do it right first time

- The work is only in the 18 Build-table files. Do not edit `src/core`, `src/sim`, data, fixtures, the format docs, behaviour-library, painter-proto or ui-shell. The play stage still never imports `tools/maker`. Do not edit any other test or smoke. Leave every smoke except s4c unedited. The only new test is `tests/editor/carries-10a.test.ts`.
- Carries only. No `effects/` slot in `readProject`, no new codes, no effect picker, no `effectRef` from data, no re-id or write-back of `setup_` effect docs, no export or APK, no new rAF, timer or loop. New effects mint `effect_<ULID>`; existing `setup_` docs keep their id and file. `linkPx` must use `Object.hasOwn`. `writeBytes` must abort the writable on a throw. The upload must read at most 64 KiB before the size and type checks. A link into a stage whose map is missing must return `openProject`'s error. The baseline title and readout say `baseline`, with no step tag.
- Do not add the Effect row, Duplicate, or a baseline-08b republish, in this step. The builder never publishes gh-pages. A republish after 10a (new title, plus the 9c markers already in the source) needs the CEO's own typed OK in QA's chat, naming the commit; CoS verifies it there.
- Measure with the count command (guide L74): `git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'`. Count insertions plus deletions. **107** is the accepted number for this step (the trial was 102). The s4c smoke edit is inside that count (cap 4). On a merge whose first parent is `751994a7`, measure against that parent (or at the code head against `31f4c0c4`), and do not treat later QA docs as 10a lines. Official wording: at `ffe56f93` against `31f4c0c4`, and at `c3e056ff` against `751994a7`.
- Paste the ok lines and `SMOKE PASS` / `TOUCH SMOKE PASS` from one solo run of every smoke in § Smoke. Record the s4c mutation (placement line removed, second `s:test` kept, step 5 fails at both widths). Label the code head and the tip. The PR line should match whether a PR exists at hand-back time. Do not commit smoke shots. Running s6c rewrites the 6c checkpoint fixture, and later smokes can write untracked shots under `handback/`; restore tracked files, do not commit the shots. If s3 step 9 misses, re-run it solo once; do not edit s3.
- Do not treat the open 10a carries, or the 10b/10c engine path, as 10a fixes.

## (f) Rebuild check

From a clean tree at `751994a7af5b5353e523f19b3b87fb99621f507f` (the merge's first parent; current main adds only the r1 QA review), write the product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit. Then measure. Without the commit, `git diff` misses the uncommitted new files. There is no CN on this step. A rebuild started at the go-line base `31f4c0c4` must also carry the 10b and publish-check docs that already sat on `751994a7`; the 18 10a product files still have to match the blob table.

```
# Product equality vs the merge (current main adds only the r1 QA review):
#   git diff c3e056ff HEAD -- \
#     handoff/steps/tests/s4c-stages-maps/smoke.mjs \
#     src/editor/effect/save.ts \
#     tools/effect-designer/page.ts tools/effect-designer/store.ts \
#     tests/editor/effect-e6-save.test.ts tests/editor/effect-e6-qa2.test.ts \
#     tests/editor/effect-e7-carries.test.ts tests/editor/carries-10a.test.ts \
#     tools/play-stage/board.ts tools/play-stage/project.ts \
#     tools/maker/store.ts tools/maker/art.ts tools/maker/home.ts \
#     src/rules/levels/levels.ts \
#     tools/baseline/index.html tools/baseline/readout.ts \
#     tests/tools/baseline-page.test.ts tests/tools/autosave-links.test.ts
#   (empty)

# Product gate. Official command at the r1 code head or r1 tip against
# 31f4c0c4, or at the merge against first parent 751994a7:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   18 files changed, 82 insertions(+), 25 deletions(-)
#
# At ffe56f93 against 31f4c0c4: 18 files, 82 insertions, 25 deletions = 107.
# The same 107 at c3e056ff against 751994a7. At 0673be7e (current
# main, which also adds the r1 review) against 751994a7 without
# ':!docs/**': 19 files, 112 insertions, 25 deletions. Adding
# ':!docs/**' again gives 107.
#
# Named tests (npm test 1146/0, floor 1142 + N=4):
#   ✔ 10a D22 effect ids: …
#   ✔ 10a upload read: …
#   ✔ 10a writeBytes: …
#   ✔ 10a tidies: …
#
# Smokes under google-chrome, at 390 and 360 CSS px, all solo, at
# the guide counts (S0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16,
# s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16,
# s9 12, s8c 8, s9b 14, s9c 6). s4c mutation as above.
#
# Export audit as above; s8-audit.mjs 133 / 147 / 146, empty hit list.
```

## QA non-blockers carried forward

- **The HANDBACK PR line** ("opened by Chief Of Staff from the branch") was written before PR #103 existed (QA, V, HB:3).
- Several files sit on their cap (`save.ts`, both effect-designer files, `effect-e6-qa2.test.ts`, `board.ts`, `maker/store.ts`, `home.ts`, `levels.ts`, the baseline pair, the two readout tests). Shipped 107 is 5 above the trial 102 (still ≤ 400 and under the caps sum 128); the new test is 49 vs the trial 44, which accounts for the rise (V).
- The audit script's maker-play figure is 146, the known loose filter (same as 8a–9c). HANDBACK also states the tight `play-stage/` count 133 (V, HB:71–78).
- Running s6c rewrites the 6c checkpoint fixture, and later smokes can write untracked shots under `handback/`. Restore tracked files after a local run; do not commit the shots.
- The upload still has no byte cap (a PNG whose header fits still reads whole). r41 names `uploadTooLarge` `{fileName, w, h, max: 4096}`; 9b's plain over-size message is still what the code shows. Both stay as later-step carries (QA, guide L116).
- **Still open, not 10a scope** (guide L110–117, QA): step 10 as 10b (data + rule: D22b `effects/` slot, the `legacyEffectId` / `badEffectId` rows, `playDocsOf` passing effects and `effectRef`) and 10c (the Effect row editor); D22's "Duplicate mints `effect_`" (no Duplicate exists yet); the `match.ts:80` `landed('')` record close (resolved in code since 8a, the docs still list it); from 9b/9c, the "Stairs to <stage name>" info row, starter-frame link art, markers in the maker, and the other listed UI/art carries; s3 `waitForTimeout` flake; the raf-driver dpr guard; npm audit 9 moderate in the ESLint chain. A baseline-08b republish after 10a (new title, plus the 9c markers) needs the CEO's own typed OK in QA's chat, naming the commit; CoS verifies it there; the builder never publishes. project-format r41 is already on this step's starting main (`31f4c0c4`); 10a did not edit format docs.
- **Closed here:** the stale s4c smoke; D22 write side (`effect_` ids; `setup_` accepted for ever by exact id); `linkPx` `Object.hasOwn`; `writeBytes` abort; the upload read before the size check; the levels start narrowing (the "levels.ts L64" carry); `project.ts` null grid; the "baseline 06c" title (guide L109).

## Blob check

Each file must have exactly this git blob id at `c3e056ff`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `handoff/steps/tests/s4c-stages-maps/smoke.mjs` | `86a1c23c4a80c6230d2519fd809158d940b5aac0` | 75 |
| `src/editor/effect/save.ts` | `2efbdab57d8f552a776406683ed1515fa5e2e81b` | 78 |
| `tools/effect-designer/page.ts` | `806ba4436f52b2b7aacd586c5b3c0a6709309308` | 104 |
| `tools/effect-designer/store.ts` | `9d01a2f52524f20576b637aa3cacf8de6022da88` | 23 |
| `tests/editor/effect-e6-save.test.ts` | `153ca6ee7435b8c60e32db81cba260ae80b59d05` | 87 |
| `tests/editor/effect-e6-qa2.test.ts` | `e1cbfc2b4a02d5d5c6aa8d65a4e76a4f9a91f4b9` | 13 |
| `tests/editor/effect-e7-carries.test.ts` | `5d1c8f79290e18a985a125628c46e02193aa1351` | 65 |
| `tools/play-stage/board.ts` | `2f279fc638bbae8a6337a9f276568ad041b3f1b2` | 160 |
| `tools/maker/store.ts` | `5be1b37fe3de13d7f9deb717cdcb1a7c4cba1e60` | 35 |
| `tools/maker/art.ts` | `fa48a1d67e8fb71df8a9c2e288c2aa51de164c42` | 75 |
| `tools/maker/home.ts` | `346cf57e55e3b09dd9be4341b7b176e364b32684` | 172 |
| `src/rules/levels/levels.ts` | `b15b9ebd53dfe280613740b50e5a9c21226c8b9c` | 93 |
| `tools/play-stage/project.ts` | `983db4c0e3d824200d4527053ce025de7841911e` | 110 |
| `tools/baseline/index.html` | `06eccd901fcf6243c6a83209b93010dfac5f9595` | 7 |
| `tools/baseline/readout.ts` | `5a7259e288793f84239b01a54af20482e3607615` | 18 |
| `tests/tools/baseline-page.test.ts` | `63db06f86713ff09126bb4e790cad37d05601465` | 38 |
| `tests/tools/autosave-links.test.ts` | `58e095bbf498aa2401cf89ec9a853dcd0ff12312` | 127 |
| `tests/editor/carries-10a.test.ts` | `c64e08d9f2cb77468797fa3cbc7df95b2c8f9b4d` | 49 |

## Appendix: full code as merged (step 10a, PR #103)

New files are `git show c3e056ff:<path>` in full. Edited files are `git diff 751994a7 c3e056ff -- <path>`. (The product diff against the go-line base `31f4c0c4` is the same for these 18 files.)

### `handoff/steps/tests/s4c-stages-maps/smoke.mjs` (edited)

```diff
diff --git a/handoff/steps/tests/s4c-stages-maps/smoke.mjs b/handoff/steps/tests/s4c-stages-maps/smoke.mjs
index 70f45c0..86a1c23 100644
--- a/handoff/steps/tests/s4c-stages-maps/smoke.mjs
+++ b/handoff/steps/tests/s4c-stages-maps/smoke.mjs
@@ -51,6 +51,8 @@ try {
     await step("4 refuse map", async () => { await open(`r:menu:map:${MAP}`, "r:delete"); await tap(page, "r:delete"); await waitText(page, "Used by: Demo stage"); await shot("05-refuse"); await tap(page, "r:close"); });
     await step("5 test", async () => {
       await press(page, "Upstairs"); await page.waitForFunction(() => document.querySelectorAll(".cell").length === 1, null, { timeout: 15000 }); await tap(page, "s:test");
+      await waitText(page, "Place a unit on this stage to test it."); const held = await page.evaluate(() => ({ play: window.__play, from: new URLSearchParams(location.search).get("from"), stage: new URLSearchParams(location.search).get("stage") })); if (held.play !== undefined || held.from !== "stage" || held.stage !== id) throw new Error(JSON.stringify(held));
+      await tap(page, "s:cell:0,0"); await waitText(page, "Your team start"); await tap(page, "s:place:spawn"); await page.waitForFunction(() => (document.querySelector('[data-act="s:cell:0,0"]')?.getAttribute("aria-label") ?? "").includes("You"), null, { timeout: 15000 }); await tap(page, "s:test");
       await page.waitForFunction((id) => new URLSearchParams(location.search).get("stage") === id && window.__play !== undefined && window.__play.world.grid.cols === 1 && window.__play.world.grid.rows === 1, id, { timeout: 15000 });
       await page.evaluate(() => window.__hud.hideBanner()); await shot("06-play"); await press(page, "Back to maker");
       await page.waitForFunction(() => document.querySelectorAll(".cell").length === 1, null, { timeout: 15000 });
```

### `src/editor/effect/save.ts` (edited)

```diff
diff --git a/src/editor/effect/save.ts b/src/editor/effect/save.ts
index fa44578..2efbdab 100644
--- a/src/editor/effect/save.ts
+++ b/src/editor/effect/save.ts
@@ -1,6 +1,6 @@
 import type { Notice } from "../../core/notice.ts";
 import { redo, undo, write, WRITER, type Row } from "./writer.ts";
-export const SAVE = { knob: "effect", dir: "effects/", trash: "effects/.deleted/", id: /^setup_[0-9A-HJKMNP-TV-Z]{26}$/, refused: "changed since; undo there first", bad: ["__proto__", "constructor", "prototype"] } as const;
+export const SAVE = { knob: "effect", dir: "effects/", trash: "effects/.deleted/", id: /^effect_[0-9A-HJKMNP-TV-Z]{26}$/, refused: "changed since; undo there first", bad: ["__proto__", "constructor", "prototype"] } as const;
 export type Store = { read(name: string): Promise<string | null>; write(name: string, text: string): Promise<void>; remove(name: string): Promise<void> };
 export type Docs = Readonly<Record<string, Row>>;
 export type Entry = { readonly group: string; readonly docs: readonly string[]; readonly created: readonly string[] };
@@ -32,7 +32,7 @@ export function ownerOf(name: string, text: string | null): { doc: Row | null }
 }
 export function saveAndUse(effect: { name: string; doc: Row | null; values: Readonly<Record<string, unknown>> }, owner: { name: string; doc: Row }, o: { at: string; mint: (prefix: string) => string; id: string; label: string; catalogueRev: number; taken?: readonly string[] }): { docs: Record<string, Row>; entry: Entry; absent: string[]; notes: Notice[] } | { error: "invalidValue"; message: string } {
   const fresh = effect.doc === null;
-  if (fresh && !(SAVE.id.test(o.id) && !(o.taken ?? []).includes(o.id) && effect.name === `${SAVE.dir}${o.id}.json`)) return { error: "invalidValue", message: "a new effect needs a fresh setup_<ULID> at effects/<id>.json" };
+  if (fresh && !(SAVE.id.test(o.id) && !(o.taken ?? []).includes(o.id) && effect.name === `${SAVE.dir}${o.id}.json`)) return { error: "invalidValue", message: "a new effect needs a fresh effect_<ULID> at effects/<id>.json" };
   const group = o.mint("grp_"), base = fresh ? blankEffect(o.id, o.label, o.at, o.catalogueRev) : effect.doc ?? blankEffect(o.id, o.label, o.at, o.catalogueRev), notes = notesOf(base, effect.values);
   const nextE = write(base, effect.values, { at: o.at, mint: o.mint, group }), nextO = write(owner.doc, { [SAVE.knob]: o.id }, { at: o.at, mint: o.mint, group }), docs: Record<string, Row> = { [effect.name]: nextE, [owner.name]: nextO }, names: string[] = [];
   if (fresh || nextE !== base) names.push(effect.name);
```

### `tools/effect-designer/page.ts` (edited)

```diff
diff --git a/tools/effect-designer/page.ts b/tools/effect-designer/page.ts
index 6989bad..806ba44 100644
--- a/tools/effect-designer/page.ts
+++ b/tools/effect-designer/page.ts
@@ -79,7 +79,7 @@ const at = (): string => new Date().toISOString();
 const save = async (): Promise<void> => { const work = live(); if (work === null) return; try {
   const read = ownerOf(ownerFile, await store.read(ownerFile)); if ("error" in read) { say(read.message); return; }
   revs[ownerFile] = read.doc === null ? null : Number(read.doc["rev"]);
-  const id = mint("setup_"), label = work.label, owner = read.doc ?? { kind: "behaviour-setup", formatVersion: 3, id: who, name: who, rev: 0, behaviourId: who, catalogue: { rev: 28 }, createdAt: at(), updatedAt: at(), copiedFrom: null, answers: {}, orphans: {}, history: { cap: 200, baseSeq: 0, ops: [] } };
+  const id = mint("effect_"), label = work.label, owner = read.doc ?? { kind: "behaviour-setup", formatVersion: 3, id: who, name: who, rev: 0, behaviourId: who, catalogue: { rev: 28 }, createdAt: at(), updatedAt: at(), copiedFrom: null, answers: {}, orphans: {}, history: { cap: 200, baseSeq: 0, ops: [] } };
   const out = saveAndUse({ name: `effects/${id}.json`, doc: null, values: work.doc }, { name: ownerFile, doc: owner }, { at: at(), mint, id, label, catalogueRev: 28, taken: [...taken] });
   if ("error" in out) { say(out.message); return; }
   const done = await commit(store, out.docs, revs, { absent: out.absent }); if ("error" in done) { say(`Not saved: ${done.name} changed. Nothing was changed.`); return; }
```

### `tools/effect-designer/store.ts` (edited)

```diff
diff --git a/tools/effect-designer/store.ts b/tools/effect-designer/store.ts
index ee7110c..9d01a2f 100644
--- a/tools/effect-designer/store.ts
+++ b/tools/effect-designer/store.ts
@@ -1,5 +1,5 @@
 import { SAVE, type Store } from "../../src/editor/effect/save.ts";
-type FileHandle = { getFile(): Promise<{ text(): Promise<string> }>; createWritable(): Promise<{ write(text: string): Promise<void>; close(): Promise<void> }> };
+type FileHandle = { getFile(): Promise<{ text(): Promise<string> }>; createWritable(): Promise<{ write(text: string): Promise<void>; close(): Promise<void>; abort?(): Promise<void> }> };
 export type Dir = { getDirectoryHandle(name: string, o?: { create?: boolean }): Promise<Dir>; getFileHandle(name: string, o?: { create?: boolean }): Promise<FileHandle>; removeEntry(name: string): Promise<void>; keys?(): AsyncIterable<string> };
 const miss = (e: unknown): boolean => e instanceof Error && e.name === "NotFoundError";
 const JSON_NAME = /^[^/]+\.json$/;
```

### `tests/editor/effect-e6-save.test.ts` (edited)

```diff
diff --git a/tests/editor/effect-e6-save.test.ts b/tests/editor/effect-e6-save.test.ts
index 6643beb..153ca6e 100644
--- a/tests/editor/effect-e6-save.test.ts
+++ b/tests/editor/effect-e6-save.test.ts
@@ -6,7 +6,7 @@ let n = 0; const mint = (p: string): string => `${p}${String((n += 1)).padStart(
 const ops = (d: Row): Row[] => (d["history"] as { ops: Row[] }).ops;
 const doc0 = (): Row => blankEffect("setup_E", "Fire", at, 28);
 const owner0 = (): Row => ({ kind: "behaviour-setup", formatVersion: 3, id: "setup_O", rev: 4, behaviourId: "basic-attack", answers: { range: { source: "user", value: 1, rev: 1 } }, orphans: {}, history: { cap: 200, baseSeq: 3, ops: [] } });
-const ID = (k: number): string => `setup_01JD${String(k).padStart(22, "0")}`, FILE = (k: number): string => `effects/${ID(k)}.json`, E = FILE(1);
+const ID = (k: number): string => `effect_01JD${String(k).padStart(22, "0")}`, FILE = (k: number): string => `effects/${ID(k)}.json`, E = FILE(1);
 const use = (values: Row, doc: Row | null = null, owner: Row = owner0(), k = 1): Exclude<ReturnType<typeof saveAndUse>, { error: string }> => { const out = saveAndUse({ name: FILE(k), doc, values }, { name: "o", doc: owner }, { at, mint, id: ID(k), label: "Fire", catalogueRev: 28 }); if ("error" in out) throw new Error(out.message); return out; };
 const mem = (): Store & { files: Map<string, string> } => { const files = new Map<string, string>(); return { files, read: (k) => Promise.resolve(files.get(k) ?? null), write: (k, t) => { files.set(k, t); return Promise.resolve(); }, remove: (k) => { files.delete(k); return Promise.resolve(); } }; };
 test("E6 writer no-op (QA E5 should-fix): another key order or an extra field writes nothing; a value object in another key order too; a real change still logs one op", () => {
@@ -36,10 +36,10 @@ test("E6 Save & use (K-5, setup §4 rule 10): a new effect doc and the owner's e
   const again = use(valuesOf(e), e, o); assert.deepEqual(again.entry.docs, [], "nothing changed: no doc in the entry"); assert.deepEqual(again.entry.created, []); assert.deepEqual(again.absent, []);
   assert.deepEqual(use(JSON.parse('{"__proto__": 1, "shake": 1}') as Row).notes.map((x) => x.message), ['knob "__proto__" skipped'], "Save & use returns the notes");
 });
-test("E6 D6.1 (DSK ed2e705f): a new effect's id is a fresh setup_<ULID>, never reused, at effects/<id>.json; anything else is invalidValue and writes nothing", () => {
+test("E6 D6.1 (DSK ed2e705f): a new effect's id is a fresh effect_<ULID>, never reused, at effects/<id>.json; anything else is invalidValue and writes nothing", () => {
   const ask = (id: string, name: string, taken?: string[]): ReturnType<typeof saveAndUse> => saveAndUse({ name, doc: null, values: { shake: 1 } }, { name: "o", doc: owner0() }, { at, mint, id, label: "F", catalogueRev: 28, ...(taken === undefined ? {} : { taken }) });
-  for (const [id, name] of [["setup_E", "effects/setup_E.json"], [`setup_01JD${"0".repeat(21)}`, "x"], [`setup_01JD${"0".repeat(21)}I`, "x"], [`setup_01jd${"0".repeat(22)}`, "x"], [`grp_01JD${"0".repeat(22)}`, "x"], [ID(2), `effects/${ID(3)}.json`], [ID(2), `${ID(2)}.json`], [ID(2), `effects/.deleted/${ID(2)}.json`]]) assert.equal((ask(id ?? "", name === "x" ? `effects/${id ?? ""}.json` : name ?? "") as { error?: string }).error, "invalidValue", `${id ?? ""} ${name ?? ""}`);
-  assert.match((ask(ID(2), FILE(2), [ID(2)]) as { message: string }).message, /fresh setup_<ULID> at effects\/<id>\.json/); assert.ok(!("error" in ask(ID(2), FILE(2), [ID(1)]))); assert.ok(!("error" in ask(`setup_7ZZZZZZZZZ${"Z".repeat(16)}`, `effects/setup_7ZZZZZZZZZ${"Z".repeat(16)}.json`)));
+  for (const [id, name] of [["setup_E", "effects/setup_E.json"], [`setup_7ZZZZZZZZZ${"Z".repeat(16)}`, "x"], [`setup_01JD${"0".repeat(21)}`, "x"], [`setup_01JD${"0".repeat(21)}I`, "x"], [`setup_01jd${"0".repeat(22)}`, "x"], [`grp_01JD${"0".repeat(22)}`, "x"], [ID(2), `effects/${ID(3)}.json`], [ID(2), `${ID(2)}.json`], [ID(2), `effects/.deleted/${ID(2)}.json`]]) assert.equal((ask(id ?? "", name === "x" ? `effects/${id ?? ""}.json` : name ?? "") as { error?: string }).error, "invalidValue", `${id ?? ""} ${name ?? ""}`);
+  assert.match((ask(ID(2), FILE(2), [ID(2)]) as { message: string }).message, /fresh effect_<ULID> at effects\/<id>\.json/); assert.ok(!("error" in ask(ID(2), FILE(2), [ID(1)]))); assert.ok(!("error" in ask(`effect_7ZZZZZZZZZ${"Z".repeat(16)}`, `effects/effect_7ZZZZZZZZZ${"Z".repeat(16)}.json`)));
   assert.ok(!("error" in saveAndUse({ name: "anything", doc: blankEffect(ID(4), "F", at, 28), values: { shake: 1 } }, { name: "o", doc: owner0() }, { at, mint, id: ID(4), label: "F", catalogueRev: 28, taken: [ID(4)] })), "an existing doc is not re-minted");
   assert.equal(trashOf(E), `effects/.deleted/${ID(1)}.json`); assert.equal(trashOf("x.json"), "effects/.deleted/x.json");
 });
```

### `tests/editor/effect-e6-qa2.test.ts` (edited)

```diff
diff --git a/tests/editor/effect-e6-qa2.test.ts b/tests/editor/effect-e6-qa2.test.ts
index e347757..e1cbfc2 100644
--- a/tests/editor/effect-e6-qa2.test.ts
+++ b/tests/editor/effect-e6-qa2.test.ts
@@ -2,7 +2,7 @@ import assert from "node:assert/strict";
 import { test } from "node:test";
 import { blankEffect, commit, ownerOf, saveAndUse, type Store } from "../../src/editor/effect/save.ts";
 type Row = Record<string, unknown>;
-const at = "2026-11-17T03:00:00.000Z", F = "setups/basic-attack.json", ID = `setup_01JD${"0".repeat(21)}1`;
+const at = "2026-11-17T03:00:00.000Z", F = "setups/basic-attack.json", ID = `effect_01JD${"0".repeat(21)}1`;
 test("E6 QA r3 (ruling 14): a full stored envelope loads: the owner a Save & use wrote, and one with every §8 field", async () => {
   const files = new Map<string, string>(), s: Store = { read: async (k) => files.get(k) ?? null, write: async (k, t) => { files.set(k, t); }, remove: async (k) => { files.delete(k); } };
   const owner: Row = { kind: "behaviour-setup", formatVersion: 3, id: "setup_O", rev: 0, behaviourId: "basic-attack", answers: {}, orphans: {}, history: { cap: 200, baseSeq: 0, ops: [] } }; let n = 0;
```

### `tests/editor/effect-e7-carries.test.ts` (edited)

```diff
diff --git a/tests/editor/effect-e7-carries.test.ts b/tests/editor/effect-e7-carries.test.ts
index 8f2e8ef..5d1c8f7 100644
--- a/tests/editor/effect-e7-carries.test.ts
+++ b/tests/editor/effect-e7-carries.test.ts
@@ -7,15 +7,15 @@ import { canonStep, valuesOf, write, type Row } from "../../src/editor/effect/wr
 import { opfsStore, purgeTrash, type Dir } from "../../tools/effect-designer/store.ts";
 import { B32, minter, ulid } from "../../tools/effect-designer/ulid.ts";
 let n = 0; const mint = (p: string): string => `${p}${String((n += 1)).padStart(4, "0")}`, at = "2026-11-17T02:00:00.000Z";
-const ID = "setup_01JD0000000000000000000001", E = `effects/${ID}.json`, ops = (d: Row | undefined): Row[] => ((d?.["history"] as { ops: Row[] } | undefined)?.ops ?? []);
+const ID = "effect_01JD0000000000000000000001", E = `effects/${ID}.json`, ops = (d: Row | undefined): Row[] => ((d?.["history"] as { ops: Row[] } | undefined)?.ops ?? []);
 const owner0 = (): Row => ({ kind: "behaviour-setup", formatVersion: 3, id: "setup_O", rev: 4, behaviourId: "basic-attack", answers: {}, orphans: {}, history: { cap: 200, baseSeq: 3, ops: [] } });
 const mem = (): Store & { files: Map<string, string> } => { const files = new Map<string, string>(); return { files, read: (k) => Promise.resolve(files.get(k) ?? null), write: (k, t) => { files.set(k, t); return Promise.resolve(); }, remove: (k) => { files.delete(k); return Promise.resolve(); } }; };
 const saved = (): Exclude<ReturnType<typeof saveAndUse>, { error: string }> => { const out = saveAndUse({ name: E, doc: null, values: { shake: 2 } }, { name: "o", doc: owner0() }, { at, mint, id: ID, label: "Fire", catalogueRev: 28 }); if ("error" in out) throw new Error(out.message); return out; };
-test("E7 carries S3: the setup_<ULID> mint is DOM-free; 26 Crockford chars, time first so later sorts later, every random byte used, a bad clock reads 0", () => {
+test("E7 carries S3: the effect_<ULID> mint is DOM-free; 26 Crockford chars, time first so later sorts later, every random byte used, a bad clock reads 0", () => {
   assert.equal(B32, "0123456789ABCDEFGHJKMNPQRSTVWXYZ"); const bytes = Uint8Array.from({ length: 16 }, (_, i) => i * 7 + 1), a = ulid(1_763_340_000_000, bytes);
-  assert.match(`setup_${a}`, SAVE.id); assert.ok(ulid(1_763_340_000_001, bytes) > a); assert.equal(ulid(Number.NaN, new Uint8Array(16)), "0".repeat(26)); assert.equal(ulid(-5, new Uint8Array(16)), "0".repeat(26)); assert.equal(ulid(33.7, new Uint8Array(16)), ulid(33, new Uint8Array(16))); assert.equal(ulid(33.7, new Uint8Array(16)).slice(8, 10), "11");
+  assert.match(`effect_${a}`, SAVE.id); assert.ok(ulid(1_763_340_000_001, bytes) > a); assert.equal(ulid(Number.NaN, new Uint8Array(16)), "0".repeat(26)); assert.equal(ulid(-5, new Uint8Array(16)), "0".repeat(26)); assert.equal(ulid(33.7, new Uint8Array(16)), ulid(33, new Uint8Array(16))); assert.equal(ulid(33.7, new Uint8Array(16)).slice(8, 10), "11");
   for (let i = 0; i < 16; i += 1) { const b = Uint8Array.from(bytes); b[i] = (b[i] ?? 0) + 1; assert.notEqual(ulid(1_763_340_000_000, b), a, `byte ${i} is used`); }
-  const asked: number[] = [], m = minter(() => 32, (k) => { asked.push(k); return new Uint8Array(k).fill(31); }); assert.equal(m("setup_"), `setup_${"0".repeat(8)}10${"Z".repeat(16)}`); assert.deepEqual(asked, [16]);
+  const asked: number[] = [], m = minter(() => 32, (k) => { asked.push(k); return new Uint8Array(k).fill(31); }); assert.equal(m("effect_"), `effect_${"0".repeat(8)}10${"Z".repeat(16)}`); assert.deepEqual(asked, [16]);
 });
 test("E7 carries S2: opfsStore lists a dir's file names sorted (OPFS keys()); a missing dir lists none; another error is thrown", async () => {
   const nf = (): Error => Object.assign(new Error("nf"), { name: "NotFoundError" }), tree: Record<string, string[]> = { "effects/": [".deleted"], "effects/.deleted/": ["b.json", "a.json"] };
```

### `tools/play-stage/board.ts` (edited)

```diff
diff --git a/tools/play-stage/board.ts b/tools/play-stage/board.ts
index 1348b69..2f279fc 100644
--- a/tools/play-stage/board.ts
+++ b/tools/play-stage/board.ts
@@ -42,7 +42,7 @@ const SHAPE: Readonly<Record<string, readonly number[]>> = {
   link: [0, 0, 0, 128, 448, 992, 2032, 4088, 2032, 992, 448, 128, 0, 0, 0, 0],
 };
 function linkPx(kind: string): Pixels | undefined {
-  const rows = SHAPE[kind]; if (rows === undefined) return undefined;
+  const rows = Object.hasOwn(SHAPE, kind) ? SHAPE[kind] : undefined; if (rows === undefined) return undefined;
   const id = `play:link-${kind}`, hit = cache.get(id); if (hit !== undefined) return hit;
   const data = new Uint8ClampedArray(16 * 16 * 4), bit = (x: number, y: number): boolean => x >= 0 && y >= 0 && x < 16 && y < 16 && ((rows[y] ?? 0) & (1 << x)) !== 0;
   for (let y = 0; y < 16; y += 1) for (let x = 0; x < 16; x += 1) {
```

### `tools/maker/store.ts` (edited)

```diff
diff --git a/tools/maker/store.ts b/tools/maker/store.ts
index d98e18f..5be1b37 100644
--- a/tools/maker/store.ts
+++ b/tools/maker/store.ts
@@ -10,7 +10,7 @@ export function memoryStore(): MakerStore & { readonly files: Map<string, string
 }
 export function makerStore(root: Dir): MakerStore {
   const base = opfsStore(root);
-  return { read: (path) => base.read(path), async readBlob(path) { try { const parts = path.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, {}); const got = await (await dir.getFileHandle(leaf)).getFile(); return got instanceof Blob ? got : null; } catch (e) { if (e instanceof Error && (e.name === "NotFoundError" || e.name === "TypeMismatchError")) return null; throw e; } }, write: (path, text) => base.write(path, text), async writeBytes(path, bytes) { const parts = path.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true }); const w = await (await dir.getFileHandle(leaf, { create: true })).createWritable(); await (w.write as unknown as (data: Uint8Array) => Promise<void>)(bytes); await w.close(); }, remove: (path) => base.remove(path), list: (dir) => base.list(dir), async rename(from, to) { const parts = from.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, {}); const handle = await dir.getFileHandle(leaf) as Handle, destParts = to.split("/"), destLeaf = destParts.pop() ?? ""; let dest = root; for (const part of destParts) dest = await dest.getDirectoryHandle(part, { create: true }); if (handle.move !== undefined) { await handle.move(dest, destLeaf); return; } const file = await (await dir.getFileHandle(leaf)).getFile() as unknown as Blob; if (!(file instanceof Blob)) throw new Error(`missing ${from}`); const w = await (await dest.getFileHandle(destLeaf, { create: true })).createWritable(); await (w.write as unknown as (data: Uint8Array) => Promise<void>)(new Uint8Array(await file.arrayBuffer())); await w.close(); await base.remove(from); } };
+  return { read: (path) => base.read(path), async readBlob(path) { try { const parts = path.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, {}); const got = await (await dir.getFileHandle(leaf)).getFile(); return got instanceof Blob ? got : null; } catch (e) { if (e instanceof Error && (e.name === "NotFoundError" || e.name === "TypeMismatchError")) return null; throw e; } }, write: (path, text) => base.write(path, text), async writeBytes(path, bytes) { const parts = path.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true }); const w = await (await dir.getFileHandle(leaf, { create: true })).createWritable(); try { await (w.write as unknown as (data: Uint8Array) => Promise<void>)(bytes); await w.close(); } catch (e) { await w.abort?.(); throw e; } }, remove: (path) => base.remove(path), list: (dir) => base.list(dir), async rename(from, to) { const parts = from.split("/"), leaf = parts.pop() ?? ""; let dir = root; for (const part of parts) dir = await dir.getDirectoryHandle(part, {}); const handle = await dir.getFileHandle(leaf) as Handle, destParts = to.split("/"), destLeaf = destParts.pop() ?? ""; let dest = root; for (const part of destParts) dest = await dest.getDirectoryHandle(part, { create: true }); if (handle.move !== undefined) { await handle.move(dest, destLeaf); return; } const file = await (await dir.getFileHandle(leaf)).getFile() as unknown as Blob; if (!(file instanceof Blob)) throw new Error(`missing ${from}`); const w = await (await dest.getFileHandle(destLeaf, { create: true })).createWritable(); await (w.write as unknown as (data: Uint8Array) => Promise<void>)(new Uint8Array(await file.arrayBuffer())); await w.close(); await base.remove(from); } };
 }
 export async function readTree(store: MakerStore, folder: string): Promise<Record<string, string>> {
   const out: Record<string, string> = {}, pre = folder.endsWith("/") ? folder : `${folder}/`;
```

### `tools/maker/art.ts` (edited)

```diff
diff --git a/tools/maker/art.ts b/tools/maker/art.ts
index fdca94f..fa48a1d 100644
--- a/tools/maker/art.ts
+++ b/tools/maker/art.ts
@@ -23,6 +23,11 @@ function locate(files: ProjectFiles, stageId: string): { mapPath: string; map: R
 const layersOf = (map: Record<string, unknown>): Record<string, unknown>[] => { const bg = isObj(map["background"]) ? map["background"] : {}; return (Array.isArray(bg["layers"]) ? bg["layers"] : []).filter(isObj); }, hex = (buf: ArrayBuffer): string => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
 const typeLine = (fileName: string, sniffed: string): string => sniffed === "unknown" ? `Can't use ${fileName}: it's not a picture. Use a PNG, JPG or WebP picture.` : `Can't use ${fileName}: it's a ${sniffed} file. Use a PNG, JPG or WebP picture.`;
 const saved = (files: DocText, rev: number, writes: readonly { readonly path: string; readonly text: string }[]): ArtResult => { let out: DocText = files; for (const w of writes) out = { ...out, [w.path]: w.text }; return { ok: true, files: out, rev: writes.length > 0 ? rev + 1 : rev }; };
+export async function uploadBytes(file: Blob): Promise<Uint8Array> {
+  const head = new Uint8Array(await file.slice(0, 65536).arrayBuffer()), pic = readPicture(head);
+  if (file.size <= head.length || (pic.ok ? !fits(pic.w, pic.h) : !pic.sniffed.startsWith("damaged"))) return head;
+  return new Uint8Array(await file.arrayBuffer());
+}
 export async function addPicture(store: MakerStore, id: string, files: DocText, rev: number, stageId: string, now: string, fileName: string, bytes: Uint8Array): Promise<ArtResult> {
   const pic = readPicture(bytes);
   if (!pic.ok) return { ok: false, line: typeLine(fileName, pic.sniffed), row: { code: "uploadTypeUnsupported", severity: "hard", path: fileName, detail: pic.sniffed } };
```

### `tools/maker/home.ts` (edited)

```diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index 2c06a4c..346cf57 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -14,7 +14,7 @@ import { commitWrites, makerStore, movePrefix, readTree, type MakerStore } from
 import { backScreen, launchTest, openSaved, type AimAt, type Next, type PlayReady } from "./test-launch.ts";
 import { startMatch } from "../play-stage/page.ts";
 import { ENGINE_VERSION } from "../../src/index.ts";
-import { addPicture, artLines, artSheet, dropLayer, hideArt, setArtLines, setArtNote, showArt } from "./art.ts";
+import { addPicture, artLines, artSheet, dropLayer, hideArt, setArtLines, setArtNote, showArt, uploadBytes } from "./art.ts";
 import type { SessionParty, SessionSave } from "../../src/types/core-types.ts";
 import type { LinkEvent } from "../../src/rules/session/links.ts";
 import { keptLine, readAutosave, writeAutosave } from "./session.ts";
@@ -166,7 +166,7 @@ let held: { act: string; t: number } | null = null;
 document.addEventListener("pointerdown", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; held = act.startsWith("s:cell:") ? { act, t: ev.timeStamp } : null; });
 document.addEventListener("pointerup", (ev) => { const node = ev.target instanceof Element ? ev.target.closest("[data-act]") : null; const act = node?.getAttribute("data-act") ?? ""; if (held !== null && held.act === act && ev.timeStamp - held.t >= 500) go(act); held = null; });
 document.addEventListener("input", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement)) return; if (node.hasAttribute("data-lvl")) { go(`l:set:${node.getAttribute("data-lvl") ?? ""}:${node.value}`); return; } if (node.hasAttribute("data-find")) { addFind(node.value); const q = node.value.toLowerCase(); for (const el of document.querySelectorAll("[data-add]")) if (el instanceof HTMLElement) el.hidden = q !== "" && !(el.getAttribute("data-add") ?? "").toLowerCase().includes(q); return; } if (node.hasAttribute("data-name")) state.name = node.value; if (node.hasAttribute("data-room")) roomLine(node.value); if (node.hasAttribute("data-unit")) unitLine(node.value); if (node.hasAttribute("data-knob")) { const key = node.getAttribute("data-knob") ?? ""; go(key === "unit_hp" || key === "unit_atk" ? `u:stat:${key}:${node.value}` : `a:set:${key}:${node.value}`); } if (node.hasAttribute("data-talk")) { const max = Number(node.getAttribute("data-max")), next = stageLine(node.value, max); if (node.value !== next) node.value = next; } });
-document.addEventListener("change", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement) || !node.hasAttribute("data-art")) return; const file = node.files?.[0]; node.value = ""; if (file === undefined) return; gate = gate.then(async () => { if (store === null || state.current === null || state.stageId === null || state.screen !== "stage" || state.readOnly) return; if (!await saveStage()) { setArtNote(state.banner ?? "Couldn't save."); paint(); return; } let raw: Uint8Array; try { raw = new Uint8Array(await file.arrayBuffer()); } catch (e) { setArtNote(`Couldn't add ${file.name}: ${e instanceof Error ? e.message : "read failed"}`); paint(); return; } const got = await addPicture(store, state.current, state.files, state.rev, state.stageId, nowIso(), file.name, raw); if (!got.ok) { setArtNote(got.line); paint(); return; } state.files = got.files; state.rev = got.rev; state.dirty = false; state.banner = null; setArtNote(null); dropUndo(); setArtLines(await artLines(store, state.current, state.files, state.stageId)); paint(); }).catch(fail); });
+document.addEventListener("change", (ev) => { const node = ev.target; if (!(node instanceof HTMLInputElement) || !node.hasAttribute("data-art")) return; const file = node.files?.[0]; node.value = ""; if (file === undefined) return; gate = gate.then(async () => { if (store === null || state.current === null || state.stageId === null || state.screen !== "stage" || state.readOnly) return; if (!await saveStage()) { setArtNote(state.banner ?? "Couldn't save."); paint(); return; } let raw: Uint8Array; try { raw = await uploadBytes(file); } catch (e) { setArtNote(`Couldn't add ${file.name}: ${e instanceof Error ? e.message : "read failed"}`); paint(); return; } const got = await addPicture(store, state.current, state.files, state.rev, state.stageId, nowIso(), file.name, raw); if (!got.ok) { setArtNote(got.line); paint(); return; } state.files = got.files; state.rev = got.rev; state.dirty = false; state.banner = null; setArtNote(null); dropUndo(); setArtLines(await artLines(store, state.current, state.files, state.stageId)); paint(); }).catch(fail); });
 document.addEventListener("visibilitychange", () => { if (document.visibilityState !== "hidden") return; if (state.screen === "project") void saveCurrent(); if (state.screen === "stage") void saveStage().then(() => { if (state.screen === "stage") paint(); }); });
 if (DEV) Object.assign(window, { __read: () => ({ ...state.files }), __write: (path: string, text: string) => { state.files = { ...state.files, [path]: text }; paint(); } }); // dev-only
 void boot();
```

### `src/rules/levels/levels.ts` (edited)

```diff
diff --git a/src/rules/levels/levels.ts b/src/rules/levels/levels.ts
index 18ed2f3..b15b9eb 100644
--- a/src/rules/levels/levels.ts
+++ b/src/rules/levels/levels.ts
@@ -1,7 +1,7 @@
 import type { BusEvent, EventRegistry, NoModeEvents } from "../../core/events/index.ts";
 import { NOT_PLAIN, isRecord, plainCopy } from "../../core/plain.ts";
 import type { Rng } from "../../core/rng/index.ts";
-import type { AbilityPools, LevelLimits, LevelRules, LevelSetup, Levels } from "./types.ts";
+import type { AbilityPools, LevelLimits, LevelRules, LevelSetup, LevelStart, Levels } from "./types.ts";
 
 export const LEVEL_EVENTS: EventRegistry<NoModeEvents> = { mode: "levels", types: ["level.reached", "level.unlocked"] };
 export const LEVEL_CEILINGS: LevelLimits = Object.freeze({ levels: 1024, pool: 4096, offer: 64, pools: 4096 }), DEFAULT_LEVEL_LIMITS: LevelLimits = Object.freeze({ levels: 64, pool: 128, offer: 8, pools: 256 });
@@ -38,7 +38,7 @@ export function createLevels(setup: LevelSetup, rng: Rng, emit: (event: BusEvent
   if (badStart) throw new RangeError("createLevels: bad start");
   const lim = levelLimits(limits); if (lim === null) throw new RangeError("createLevels: limits must be whole numbers from 1 to their ceilings"); if (over(rules, pools, lim)) throw new RangeError("createLevels: over the level caps");
   const bars = new Map<string, Live>();
-  if (Array.isArray(start)) for (const row of start) { if (!isRecord(row) || typeof row.id !== "string" || typeof row.xp !== "number" || typeof row.level !== "number" || typeof row.banked !== "number") continue; const offer = row.offer === null ? null : Array.isArray(row.offer) ? row.offer.filter((a): a is string => typeof a === "string") : null; const abilities = Array.isArray(row.abilities) ? row.abilities.filter((a): a is string => typeof a === "string") : []; bars.set(row.id, { id: row.id, pool: row.id, xp: row.xp, level: row.level, banked: row.banked, offer, abilities }); }
+  if (Array.isArray(start)) for (const row of start as readonly LevelStart[]) { const offer = row.offer === null ? null : [...row.offer]; const abilities = [...row.abilities]; bars.set(row.id, { id: row.id, pool: row.id, xp: row.xp, level: row.level, banked: row.banked, offer, abilities }); }
   const poolOf = (key: string): readonly string[] => (Object.hasOwn(pools, key) ? pools[key] : undefined) ?? [];
   const draw = (have: readonly string[], key: string): string[] => {
     const cands: string[] = [], seen = new Set<string>(have);
```

### `tools/play-stage/project.ts` (edited)

```diff
diff --git a/tools/play-stage/project.ts b/tools/play-stage/project.ts
index 0f1b5da..983db4c 100644
--- a/tools/play-stage/project.ts
+++ b/tools/play-stage/project.ts
@@ -101,8 +101,9 @@ export function arriveIn(files: ProjectFiles, fromId: string | null, toId: strin
   if (read === null || !read.ok) return openProject(files, toId);
   let mapDoc: unknown; for (const [key, doc] of Object.entries(files)) if (key.startsWith("maps/") && isObj(doc) && doc["id"] === read.doc.mapRef) mapDoc = doc;
   const map = mapDoc === undefined ? null : readMap(mapDoc), tiles = installOne(TERRAIN, {}).out?.tiles, grid = map !== null && map.ok && tiles !== undefined ? createGrid(map.doc, tiles) : null;
+  if (grid === null) return openProject(files, toId);
   const taken = new Set<string>(); for (const n of read.doc.neutrals) taken.add(`${n.at.c},${n.at.r}`); const pool = read.doc.enemyPool; if (pool.mode === "fixed") for (const e of pool.entries) taken.add(`${e.at.c},${e.at.r}`); else for (const s of pool.spawns) taken.add(`${s.c},${s.r}`);
-  const free = (sq: { c: number; r: number }): boolean => !taken.has(`${sq.c},${sq.r}`) && grid !== null && grid.isOpen(sq), inside = (sq: { c: number; r: number }): boolean => grid !== null && grid.inBounds(sq), spots = read.doc.playerSpawns, next = arrival(read.doc.links ?? [], fromId ?? "\u0000", spots, party.members.length, free, inside);
+  const free = (sq: { c: number; r: number }): boolean => !taken.has(`${sq.c},${sq.r}`) && grid.isOpen(sq), inside = (sq: { c: number; r: number }): boolean => grid.inBounds(sq), spots = read.doc.playerSpawns, next = arrival(read.doc.links ?? [], fromId ?? "\u0000", spots, party.members.length, free, inside);
   const playerSpawns = next.map((sq) => { const hit = spots.find((s) => s.c === sq.c && s.r === sq.r); return hit !== undefined && hit.facing !== undefined ? { c: sq.c, r: sq.r, facing: hit.facing } : { c: sq.c, r: sq.r }; });
   const opened = openProject({ ...files, [path]: { ...(isObj(stage) ? stage : {}), playerSpawns } }, toId); if (opened.docs === null) return opened;
   const side = read.doc.sides?.loadout ?? party.side, carried = carryInto(party, side), rules = { ...opened.docs.rules, carry: carried.carry }, levels = opened.docs.levels === undefined || carried.start === undefined ? opened.docs.levels : { ...opened.docs.levels, start: carried.start }, bench = party.members.slice(next.length); return { docs: { ...opened.docs, chosen: party.members.map((m) => m.unitId), rules, ...(levels === undefined ? {} : { levels }), ...(bench.length === 0 ? {} : { bench }) }, error: opened.error };
```

### `tools/baseline/index.html` (edited)

```diff
diff --git a/tools/baseline/index.html b/tools/baseline/index.html
index 4328f0a..06eccd9 100644
--- a/tools/baseline/index.html
+++ b/tools/baseline/index.html
@@ -1,6 +1,6 @@
 <!doctype html>
 <html lang="en">
-<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>baseline 06c</title>
+<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>baseline</title>
 <style>#read{position:fixed;top:48px;left:0;right:0;width:100%;margin:0;padding:4px 8px;box-sizing:border-box;pointer-events:none;background:rgba(8,10,16,.72);color:#f4efe2;font:13px monospace;z-index:5}</style>
 </head>
 <body><pre id="read"></pre><script type="module" src="./page.ts"></script></body>
```

### `tools/baseline/readout.ts` (edited)

```diff
diff --git a/tools/baseline/readout.ts b/tools/baseline/readout.ts
index fd671fc..5a7259e 100644
--- a/tools/baseline/readout.ts
+++ b/tools/baseline/readout.ts
@@ -14,5 +14,5 @@ export function heapPeakOf(peak: number | null, used: number | undefined): numbe
 }
 export function readout(input: { readonly gaps: readonly number[]; readonly elapsedMs: number; readonly canvasMb: number; readonly heapMb: number | null; readonly dpr: number; readonly swaps?: readonly number[]; readonly scene?: string }): string {
   const f = framesOf(input.gaps), heap = input.heapMb === null ? "n/a" : input.heapMb.toFixed(1), head = input.elapsedMs >= RUN_MS ? "DONE\n" : "", worst = (input.swaps ?? []).reduce((m, i) => Math.max(m, input.gaps[i] ?? 0, input.gaps[i + 1] ?? 0, input.gaps[i + 2] ?? 0), 0);
-  return `${head}${input.scene === "shop" ? "baseline 06c · Shop stairs (?scene=shop)" : "baseline 06c · Skirmish (checkpoint.tileproj)"}\nframe ms p50 ${f.p50.toFixed(1)} p95 ${f.p95.toFixed(1)} max ${f.max.toFixed(1)}\ndropped (>25 ms) ${f.dropped} over 50 ms ${f.over50} of ${f.n}\ncanvas MB ${input.canvasMb.toFixed(1)} · dpr ${input.dpr.toFixed(1)}\nheap MB peak ${heap}\n${GC_LINE}${input.swaps === undefined ? "" : `\nstage changes ${input.swaps.length}\nworst ms in 3 frames after a swap ${worst.toFixed(1)}`}`;
+  return `${head}${input.scene === "shop" ? "baseline · Shop stairs (?scene=shop)" : "baseline · Skirmish (checkpoint.tileproj)"}\nframe ms p50 ${f.p50.toFixed(1)} p95 ${f.p95.toFixed(1)} max ${f.max.toFixed(1)}\ndropped (>25 ms) ${f.dropped} over 50 ms ${f.over50} of ${f.n}\ncanvas MB ${input.canvasMb.toFixed(1)} · dpr ${input.dpr.toFixed(1)}\nheap MB peak ${heap}\n${GC_LINE}${input.swaps === undefined ? "" : `\nstage changes ${input.swaps.length}\nworst ms in 3 frames after a swap ${worst.toFixed(1)}`}`;
 }
```

### `tests/tools/baseline-page.test.ts` (edited)

```diff
diff --git a/tests/tools/baseline-page.test.ts b/tests/tools/baseline-page.test.ts
index ce800c2..63db06f 100644
--- a/tests/tools/baseline-page.test.ts
+++ b/tests/tools/baseline-page.test.ts
@@ -24,7 +24,7 @@ test("baseline readout maths on a fixed frame list", () => {
   const bytes = 1170 * 1536 * 4 + 512 * 512 * 4; assert.equal(canvasMbOf([{ width: 1170, height: 1536 }, { width: 512, height: 512 }]), bytes / 1_048_576);
   assert.equal(heapPeakOf(null, undefined), null); assert.equal(heapPeakOf(null, 8 * 1_048_576), 8); assert.equal(heapPeakOf(12, 8 * 1_048_576), 12);
   const early = readout({ gaps: GAPS, elapsedMs: 1000, canvasMb: 1, heapMb: null, dpr: 2 }); assert.equal(early.startsWith("DONE"), false);
-  assert.equal(early, "baseline 06c · Skirmish (checkpoint.tileproj)\nframe ms p50 16.0 p95 55.0 max 55.0\ndropped (>25 ms) 2 over 50 ms 1 of 20\ncanvas MB 1.0 · dpr 2.0\nheap MB peak n/a\nGC: n/a (browsers don't expose it)");
+  assert.equal(early, "baseline · Skirmish (checkpoint.tileproj)\nframe ms p50 16.0 p95 55.0 max 55.0\ndropped (>25 ms) 2 over 50 ms 1 of 20\ncanvas MB 1.0 · dpr 2.0\nheap MB peak n/a\nGC: n/a (browsers don't expose it)");
   const done = readout({ gaps: GAPS, elapsedMs: 60_000, canvasMb: 1, heapMb: 9.25, dpr: 2 }); assert.equal(done.startsWith("DONE\n"), true); assert.equal(done.includes("heap MB peak 9.3"), true);
 });
 test("baseline build ships the checkpoint and no maker or editor code", () => {
```

### `tests/tools/autosave-links.test.ts` (edited)

```diff
diff --git a/tests/tools/autosave-links.test.ts b/tests/tools/autosave-links.test.ts
index 2ded7f9..58e095b 100644
--- a/tests/tools/autosave-links.test.ts
+++ b/tests/tools/autosave-links.test.ts
@@ -111,8 +111,8 @@ test("step 8 baseline ?scene=shop: two floors joined by stairs, and the readout
   const down = shopFiles()[`stages/${S1}.json`], up = shopFiles()[`stages/${S2}.json`]; if (!isObj(down) || !isObj(up) || !Array.isArray(down["links"]) || !Array.isArray(up["links"])) throw new Error("stairs");
   const a = down["links"][0], b = up["links"][0]; assert.equal(isObj(a) && a["to"], S2); assert.equal(isObj(b) && b["to"], S1);
   const gaps = [16, 16, 40, 61, 16, 16, 30], row = readout({ gaps, elapsedMs: 1000, canvasMb: 1, heapMb: null, dpr: 1, swaps: [2, 5], scene: "shop" });
-  assert.equal(row.endsWith("stage changes 2\nworst ms in 3 frames after a swap 61.0"), true); assert.equal(row.includes("over 50 ms 1 of 7"), true); assert.equal(row.startsWith("baseline 06c · Shop stairs (?scene=shop)\n"), true);
-  const plain = readout({ gaps, elapsedMs: 1000, canvasMb: 1, heapMb: null, dpr: 1 }); assert.equal(plain.includes("stage changes"), false); assert.equal(plain.includes("after a swap"), false); assert.equal(plain.startsWith("baseline 06c · Skirmish (checkpoint.tileproj)\n"), true);
+  assert.equal(row.endsWith("stage changes 2\nworst ms in 3 frames after a swap 61.0"), true); assert.equal(row.includes("over 50 ms 1 of 7"), true); assert.equal(row.startsWith("baseline · Shop stairs (?scene=shop)\n"), true);
+  const plain = readout({ gaps, elapsedMs: 1000, canvasMb: 1, heapMb: null, dpr: 1 }); assert.equal(plain.includes("stage changes"), false); assert.equal(plain.includes("after a swap"), false); assert.equal(plain.startsWith("baseline · Skirmish (checkpoint.tileproj)\n"), true);
 });
 test("step 8b spill: 2 chosen and 1 free spawn, so the second member spills to the nearest free walkable cell (BFS from the arrival cell) and survives an autosave round-trip", async () => {
   const carried = party(20, [{ unitId: H, hp: 20 }, { unitId: R, hp: 2 }]), docs = open(nook([24, 25, 29]), S1, S2, carried), m = createMatch(docs, 200);
```

### `tests/editor/carries-10a.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { blankEffect, SAVE, saveAndUse } from "../../src/editor/effect/save.ts";
import { valuesOf, type Row } from "../../src/editor/effect/writer.ts";
import { shopFiles } from "../../tools/baseline/checkpoint.ts";
import type { Dir } from "../../tools/effect-designer/store.ts";
import { uploadBytes } from "../../tools/maker/art.ts";
import { makerStore } from "../../tools/maker/store.ts";
import { pixelsOf } from "../../tools/play-stage/board.ts";
import { arriveIn, openProject } from "../../tools/play-stage/project.ts";
const at = "2026-11-25T00:00:00.000Z", mint = (p: string): string => `${p}0001`, extra = 300 * 1024;
const owner = (): Row => ({ kind: "behaviour-setup", formatVersion: 3, id: "setup_O", rev: 0, behaviourId: "basic-attack", answers: { effect: { source: "user", value: "setup_01JD0000000000000000000001", rev: 1 } }, orphans: {}, history: { cap: 200, baseSeq: 0, ops: [] } });
const be = (n: number): number[] => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
const png = (w: number, h: number): Uint8Array => new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, ...be(w), ...be(h)]);
const blob = (head: Uint8Array, n: number): Blob => { const all = new Uint8Array(head.length + n); all.set(head); return new Blob([all]); };
test("10a D22 effect ids: a new effect is effect_<ULID> only; a saved setup_<ULID> effect is accepted for ever, saved again under its own id and file, never re-id'd", () => {
  const id = "setup_01JD0000000000000000000001", file = `effects/${id}.json`, fresh = `effect_${"0".repeat(26)}`;
  assert.equal(SAVE.id.test(fresh), true); assert.equal(SAVE.id.test(id), false);
  const bad = saveAndUse({ name: file, doc: null, values: { shake: 1 } }, { name: "o", doc: owner() }, { at, mint, id, label: "Fire", catalogueRev: 28 });
  assert.deepEqual(bad, { error: "invalidValue", message: "a new effect needs a fresh effect_<ULID> at effects/<id>.json" });
  const doc = blankEffect(id, "Fire", at, 28), out = saveAndUse({ name: file, doc, values: { shake: 1 } }, { name: "o", doc: owner() }, { at, mint, id, label: "Fire", catalogueRev: 28 });
  if ("error" in out) throw new Error(out.message);
  assert.equal(Object.keys(out.docs).includes(file), true); assert.equal(out.docs[file]?.["id"], id); assert.equal(valuesOf(out.docs["o"] ?? {})["effect"], id);
  assert.equal(Object.keys(out.docs).some((key) => key.includes("effect_")), false);
});
test("10a upload read: a 5000×10 PNG header plus 300 kB reads 65536 bytes; a GIF plus 300 kB reads 65536; a 96×144 PNG plus 300 kB and a JPG with no size marker in its head read the whole file; a small file reads whole", async () => {
  const wide = png(5000, 10), gif = new TextEncoder().encode("GIF89a"), fit = png(96, 144), jpg = new Uint8Array([255, 216, 255]), small = png(8, 8);
  assert.equal((await uploadBytes(blob(wide, extra))).length, 65536);
  assert.equal((await uploadBytes(blob(gif, extra))).length, 65536);
  assert.equal((await uploadBytes(blob(fit, extra))).length, fit.length + extra);
  assert.equal((await uploadBytes(blob(jpg, extra))).length, jpg.length + extra);
  assert.equal((await uploadBytes(new Blob([small]))).length, small.length);
});
test("10a writeBytes: a write that throws aborts the writable and rethrows; a good write closes it", async () => {
  const fake = (fail: boolean): { root: Dir; n: { abort: number; close: number } } => {
    const n = { abort: 0, close: 0 }, writable = { write: async () => { if (fail) throw new Error("full"); }, close: async () => { n.close += 1; }, abort: async () => { n.abort += 1; } };
    const handle = { getFile: async () => ({ text: async () => "" }), createWritable: async () => writable };
    const root: Dir = { getDirectoryHandle: () => Promise.resolve(root), getFileHandle: () => Promise.resolve(handle), removeEntry: () => Promise.resolve() };
    return { root, n };
  };
  const bad = fake(true); await assert.rejects(makerStore(bad.root).writeBytes("a/b.bin", new Uint8Array([1])), /full/); assert.deepEqual(bad.n, { abort: 1, close: 0 });
  const good = fake(false); await makerStore(good.root).writeBytes("a/b.bin", new Uint8Array([1])); assert.deepEqual(good.n, { abort: 0, close: 1 });
});
test("10a tidies: linkPx serves only its own shapes (play:link-constructor is undefined), and a link into a stage whose map is missing returns openProject's error", () => {
  assert.equal(pixelsOf("play:link-constructor"), undefined); assert.notEqual(pixelsOf("play:link-stairs"), undefined); assert.equal(pixelsOf("play:link-nope"), undefined);
  const files = { ...shopFiles() }, to = "stage_01JDES00000000000000000002"; delete files["maps/map_01JDEM00000000000000000002.json"];
  const party = { side: "player" as const, members: [{ unitId: "unit_01M81X2BX5ANZS5PWVAFHNCASA", hp: 20 }], bar: null }, got = arriveIn(files, "stage_01JDES00000000000000000001", to, party), plain = openProject(files, to);
  assert.equal(got.error, plain.error); assert.equal(got.docs === null, plain.docs === null); assert.notEqual(plain.error, "");
});
```
