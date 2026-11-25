# Step 10a: carries before the engine effect path (D22, s4c, small fixes)

r2, 2026-11-25, Engine Architect (r1 + QA wording edits 05:10) (state per CoS 2026-11-25 04:47; must-carries from the health check of 2026-11-25). One builder run (ChatA) and one QA review, with gates on. This is a **carries-only step**. It is not roadmap step 10 (the engine effect path); that row stays as it is for a later go-line (see Why 10a). Every number below comes from a trial run on `ea3b08f4` (see Measured). In this guide, rulings from the CoS chat are labelled **EA ruling**, not CEO rulings.

Step id: `step-10a-carries`. Guide revision r1; the build is r1, then r2 … for rework.
Repo: https://github.com/G-TileEngine/tileengine
**Base commit:** main at `ea3b08f423942458ce3377269a957223bb473901` (`ea3b08f docs(rebuild): step 9c record + README row 25 + QA rebuild review`). It holds 9b (merge `a1d01698`, PR #101) and 9c (merge `9088feb2`, PR #102). Checked in a fresh `/tmp` clone of `origin/main`: `npm run green` exits 0 at **1142 pass, 0 fail**. If CoS names a later main in the go-line, use that main and its count.
**Authority:** DSK D22 in `handoff/dsk-rulings/2026-11-17-phase1.md` L69 (sha256 `90df966c864568074981d4efedf7233c394aae5c0bd6a03ade0a666e53fdb9d8`, 77 lines). Format: `docs/maker/data/project-format.md` §6.7 L1145 and `setup-format.md` §2.10 L453 (`effect_<ULID>`). Health check: `/workspace/share/health-check-2026-11-25/report.md` (Real problems 1–3, §9). s4c triage: `docs/qa/health-2026-11-25-s4c-triage.md` (sha256 `18130b16…`, 15 lines; QA's, not yet on main).
**Test floor:** **1142 + 4 = 1146.** N = 4 (named tests 1–4, one new file). D22 re-pins three existing effect tests and the title fix re-pins two existing baseline tests; the count doesn't change for those.
**Needs:** 9c (merged). **Blocks:** step 10 (the engine effect path writes and reads `effect_` ids).
**Smoke:** no new smoke. The s4c smoke is fixed in place (port **8801**, test-only, Rule 1). It is counted in the 400.

## Why 10a, not step 10
- **Step 10's scope is clear** (roadmap L85, MS-07, "Engine effect path"): `readProject` learns `effects/` (D22b: the slot, the `legacyEffectId` and `badEffectId` rows, `.deleted/` skipped); `playDocsOf` stops hard-coding `effectRef: "line-shot"` and passes the project's effects to the board; and the Behaviour panel gets an **Effect** row per ability (none, a built-in or a saved effect, plus the basic knobs). Export and the APK aren't in it (the CEO's 2026-11-24 ruling folds those into step 11).
- **It doesn't fit with the carries.** 9b's editor alone used 304 lines. Step 10 has both a data/rule half (reader, rows, play docs, board) and an editor half (picker, knobs, smoke), each with tests. The roadmap's own rule splits a row like this into "a: data + rule" and "b: editor" (roadmap L70). With the carries (102 lines in the trial) on top, it would go well past 400.
- **It isn't ready to go.** Row 10 is still PROPOSED ("Don't build a PROPOSED row; ask CoS", roadmap L9 and L72), and the format doesn't have D22b's slot and codes yet (DSK: "r41 gets the slot, the two codes and the trash rule"; the format is r40).
- So this step clears the due carries, D22's write side above all, and step 10 starts from a green tree with `effect_` ids. When CoS gives the go, step 10 itself becomes 10b (data + rule) and 10c (editor).

## Delivery
Same as the step 7 Delivery (`step-07-stage-links.md` L14–19), with this step id.
- Branch **`step/step-10a-carries-r1-chatA`** from the base (r<N> for rework). Never commit to main.
- Commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The last commit adds **`handback/step-10a-carries/r1/HANDBACK.md`** with the sections in `handoff/HAND-BACK.md`, plus § Green (test counts), § Smoke (all 18 smokes) and § Export audit. Label the **Code head** apart from the docs-only **tip**, and give both shas. Don't commit a raw test log or smoke shots.
- Gate: `npm ci && npm run green` exits 0 at the floor.
- Push once, that branch only, through the one-shot helper in `handoff/HAND-BACK.md`. Never print, echo, log, commit or store `GH_BUILDER_TOKEN`, and keep it out of `.git/config`. Never push main, a tag or gh-pages. No force-push, no PR actions. CoS opens the PR. Nothing public without CEO SEND via CoS.

## Goal
In plain words:
- **The s4c smoke is green again.** Since 6a, Test on a stage with no units says "Place a unit on this stage to test it." and stays in the maker (intended). s4c step 5 still expected the play page. The smoke now checks that sentence first, then places a team start and tests.
- **New effects get `effect_<ULID>` ids** (D22). Effects already saved as `setup_<ULID>` keep working for ever, under their own id and file. Nothing is re-id'd or written back.
- **Small fixes:** the link-marker lookup only serves its own shapes; a failed picture write aborts the file; a refused upload reads only the first 64 KiB; the level-start copy loses unreachable checks; a link into a stage whose map is missing stops before the spawn search; the baseline page and readout stop saying "baseline 06c".

**Not in 10a:** anything from roadmap step 10 (the `effects/` slot in `readProject`, the `legacyEffectId` and `badEffectId` rows, effect pickers, `effectRef` from data); export or APK (step 11); format-doc edits (DSK's); the "Stairs to <stage name>" info row; markers in the maker; the baseline-08b republish itself.

## Read first (lines checked on `ea3b08f4`)
1. D22 (L69): `SAVE.id` = `/^effect_[0-9A-HJKMNP-TV-Z]{26}$/`, mint `effect_`, test 39 re-pinned; Duplicate mints `effect_` too; `setup_<ULID>` docs in `effects/` are "accepted for ever and never re-id'd"; refs resolve by exact id; the reader rows come with the `effects/` slot (D22b, step 10).
2. `src/editor/effect/save.ts` L3 (`SAVE.id`) and L34–35 (`fresh` and its message); `tools/effect-designer/page.ts` L82 (`mint("setup_")`); `tools/effect-designer/store.ts` L2 (`FileHandle`). No effect Duplicate exists on main yet (`src/editor/effect`, `tools/effect-designer`), so D22's Duplicate line has no code to change. When one is built, it mints `effect_`.
3. Tests that carry `setup_` for a **new** effect: `tests/editor/effect-e6-save.test.ts` L9 (`ID`), L39–42 (test 39); `tests/editor/effect-e6-qa2.test.ts` L5 (`ID`); `tests/editor/effect-e7-carries.test.ts` L10 (`ID`), L14–18 (S3). Owner ids such as `setup_O` are setups, not effects, so they stay. `tests/tools/play-stage-p18.test.ts` L10 (`SAVED_ID = "setup_…"`, F17) already shows a saved `setup_` effect driving a match by exact id. It stays unedited and is the read fallback's proof.
4. s4c: `handoff/steps/tests/s4c-stages-maps/smoke.mjs` L52–57 (step 5); the 6a guard `tools/maker/test-launch.ts` L35; the team-start tap flow in `handoff/steps/tests/s6c-checkpoint/smoke.mjs` L74 (`s:cell:0,0` → "Add here" → `s:place:spawn`).
5. Small fixes: `tools/play-stage/board.ts` L45 (`SHAPE[kind]`); `tools/maker/store.ts` L13 (`makerStore.writeBytes`); `tools/maker/home.ts` L169 (`file.arrayBuffer()`); `tools/maker/art.ts` L26 (`addPicture`); `src/rules/levels/levels.ts` L41 (the start loop after the L37–38 `badStart` guard; this is the "levels.ts L64" carry from the 8a review, where the health check pointed at `tools/maker/levels.ts` L64 by mistake); `tools/play-stage/project.ts` L103–105 (`grid`, `free`, `inside`); `tools/baseline/index.html` L3 and `tools/baseline/readout.ts` L17; `tests/tools/baseline-page.test.ts` L27 and `tests/tools/autosave-links.test.ts` L114–115 (the readout text).

## Rules
1. **s4c step 5 (test-only, one file).** After the existing `s:test` tap on the empty 1×1 Upstairs board: wait for "Place a unit on this stage to test it." and assert `window.__play` is undefined and `from=stage` is still in the URL. Then tap `s:cell:0,0`, wait for "Your team start", tap `s:place:spawn`, wait for the cell's label to include "You", and tap `s:test` again. Keep the existing wait (`?stage=<id>`, `window.__play`, 1×1 grid) and the rest of the step as is. Two added lines; no other smoke is edited.
2. **D22 write side.** `SAVE.id` becomes `effect_`; the fresh-id message says "a fresh effect_<ULID> at effects/<id>.json"; the effect designer mints `effect_`. `saveAndUse` already checks the id only when `effect.doc === null` (a new doc), so saving an existing `setup_` doc again works unchanged: same id, same file, the owner's `effect` answer unchanged. **No migration, no re-id, nothing written back** (D22). The format already says `effect_` (§6.7, §2.10), so no EA fallback ruling is needed.
3. **D22 tests.** Re-pin the new-effect ids in the three tests above to `effect_`. Test 39 also lists a well-formed `setup_<ULID>` as an invalid **new** id. Keep every other assertion.
4. **linkPx.** `Object.hasOwn(SHAPE, kind) ? SHAPE[kind] : undefined`, so `play:link-constructor` is `undefined`.
5. **writeBytes.** Write and close inside `try`; on a throw, `await w.abort?.()` and rethrow. `FileHandle`'s writable type gets `abort?(): Promise<void>`. `commitWrites` still removes the tmp files and names the failure.
6. **Upload read.** New `uploadBytes(file)` in `art.ts`: read `file.slice(0, 65536)`, then `readPicture` it. Return only those bytes when the file is no bigger, when the header is over 4096 px a side, or when it isn't a picture (`sniffed` not `damaged …`). Otherwise read the whole file (a JPG whose size marker is past 64 KiB reads as `damaged jpg` in the header). `home.ts` calls it in place of `file.arrayBuffer()`. `addPicture` is unchanged and gives the same refusal lines from the header bytes. Nothing is decoded, hashed or written before its checks.
7. **Level start (src/rules, game-agnostic).** After the `badStart` guard, the loop reads `start as readonly LevelStart[]` and copies `offer` and `abilities` with a spread. The unreachable `continue`, `: null` and `: []` go. Same behaviour.
8. **Null grid.** In `arriveIn`, `if (grid === null) return openProject(files, toId);` straight after `grid`, and `free`/`inside` drop their `grid !== null &&`. A link into a stage with no map or terrain returns `openProject`'s own error without walking the arrival diamond.
9. **Baseline title.** `<title>baseline</title>` and the readout's first line "baseline · Shop stairs (?scene=shop)" / "baseline · Skirmish (checkpoint.tileproj)". There's no step tag, so it can't go stale again. The page's commit is in `build.json`. Re-pin the two tests that read that line.
10. **Layers.** Nothing game-specific in `src/core` or `src/sim` (untouched). `tools/play-stage` never imports `tools/maker`. No format-doc edits, no new codes, no new rAF, timer or loop.

## Build table (caps; trial in brackets)
| File | Change | Cap |
|---|---|---|
| `handoff/steps/tests/s4c-stages-maps/smoke.mjs` | step 5: the empty-board guard, then a team start (Rule 1) | 4 [2] |
| `src/editor/effect/save.ts` | `SAVE.id` and its message to `effect_` (Rule 2) | 4 [2+ 2−] |
| `tools/effect-designer/page.ts` | `mint("effect_")` (Rule 2) | 2 [1+ 1−] |
| `tools/effect-designer/store.ts` | `abort?` on the writable type (Rule 5) | 2 [1+ 1−] |
| `tests/editor/effect-e6-save.test.ts` | `ID`, test 39 re-pinned (Rule 3) | 10 [4+ 4−] |
| `tests/editor/effect-e6-qa2.test.ts` | `ID` re-pinned (Rule 3) | 2 [1+ 1−] |
| `tests/editor/effect-e7-carries.test.ts` | `ID`, S3 re-pinned (Rule 3) | 10 [4+ 4−] |
| `tools/play-stage/board.ts` | `Object.hasOwn` (Rule 4) | 2 [1+ 1−] |
| `tools/maker/store.ts` | abort on a throw (Rule 5) | 2 [1+ 1−] |
| `tools/maker/art.ts` | `uploadBytes` (Rule 6) | 8 [5] |
| `tools/maker/home.ts` | import and call `uploadBytes` (Rule 6) | 4 [2+ 2−] |
| `src/rules/levels/levels.ts` | the start loop; `LevelStart` import (Rule 7) | 4 [2+ 2−] |
| `tools/play-stage/project.ts` | null grid early return (Rule 8) | 4 [2+ 1−] |
| `tools/baseline/index.html`, `tools/baseline/readout.ts` | title and readout line (Rule 9) | 4 [2+ 2−] |
| `tests/tools/baseline-page.test.ts`, `tests/tools/autosave-links.test.ts` | readout text re-pinned (Rule 9) | 6 [3+ 3−] |
| `tests/editor/carries-10a.test.ts` | new, named tests 1–4 (one import per line) | 60 [44] |
| **Total** | caps sum to 128 | **400 hard gate [102]** |

Count: `git add -N . && git diff --shortstat <base> -- . ':!handback/**' ':!node_modules'`. Over any cap = stop and report. Don't wrap, split or join lines to dodge or fit a cap.

## Named tests (`tests/editor/carries-10a.test.ts`)
1. `10a D22 effect ids: a new effect is effect_<ULID> only; a saved setup_<ULID> effect is accepted for ever, saved again under its own id and file, never re-id'd`: `SAVE.id` takes `effect_`, not `setup_`; a new doc with a `setup_` id gives the exact `invalidValue` message; an existing `setup_` doc saves under `effects/<setup id>.json` with its id and the owner's `effect` answer unchanged.
2. `10a upload read: …`: a 5000×10 PNG header plus 300 kB reads 65536 bytes; a GIF plus 300 kB reads 65536; a 96×144 PNG plus 300 kB and a JPG with no size marker in its head read the whole file; a small file reads whole.
3. `10a writeBytes: a write that throws aborts the writable and rethrows; a good write closes it` (a fake `Dir`).
4. `10a tidies: linkPx serves only its own shapes (play:link-constructor is undefined), and a link into a stage whose map is missing returns openProject's error` (`shopFiles()` minus stage 2's map).

## Smoke
No new smoke. Run every smoke, solo, unedited apart from s4c: S0 `touch-smoke.mjs` 8797 (14 ok), s3 `touch-smoke.mjs` 8798 (18), s4a 8799 (16), s4b 8800 (16), **s4c 8801 (16)**, s5a 8802 (16), s5b 8803 (16), s5c 8804 (16), s6a 8805 (18), s6b 8806 (16), s6c 8807 (18), s6d 8808 (14), s7 8809 (20), s8 8810 r1 (16), s9 8811 r1 (12), s8c 8812 r1 (8), s9b 8813 r1 (14), s9c 8814 r1 (6). All print SMOKE PASS. **Restore tracked files after each run** (`git checkout -- handback` and remove untracked shots). s6c rewrites the 6c checkpoint fixture, and s6d, s8c and s9c read it.
If s3 step 9 misses (sheet text ''), re-run it solo once; it was flaky before this step. Don't edit s3 in 10a.

## Must NOT
- No edits outside the Build table. Nothing in `src/core`, `src/sim`, data, fixtures, the format docs, behaviour-library, painter-proto or ui-shell. No edit to any other test or smoke.
- No re-id, migration or write-back of `setup_` effect docs; no new codes; no `effects/` slot in `readProject` (step 10); no export or APK work; no gh-pages push or publish.

## Done when
- Green exits 0 at **1146** or more. `npx tsc --noEmit -p tools/tsconfig.json` shows only the 3 base errors (effect-designer `page.ts` L101, maker `home.ts` ×2 at L88).
- All 18 smokes PASS with the counts above; **s4c 16 ok at 390 and 360**. `node /workspace/share/s8/s8-audit.mjs <worktree>` → AUDIT PASS.
- HANDBACK § Smoke records the s4c mutation: with the placement line removed, step 5 fails at both widths.

## Measured (trial run, 2026-11-25, a `/tmp` clone at `ea3b08f4`, never committed or pushed)
- Base: green exit 0, **1142 pass, 0 fail**; s4c 14 ok / 2 fail (step 5 at both widths), as the health check found.
- Trial: green exit 0, **1146 pass, 0 fail** (eslint, depcruise, check:state and check:law clean); tools tsc shows only the 3 base errors.
- Count: 18 files, **77+ 25− (102)**, per the table.
- Smokes: all 18 PASS (S0 14, s3 18, s4a 16, s4b 16, **s4c 16**, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12, s8c 8, s9b 14, s9c 6); AUDIT PASS (133 / 147 / 146).
- **s4c mutation:** without the placement line (the second `s:test` kept), step 5 fails at 390 and 360 (`waitForFunction` timeout), SMOKE FAIL.
- Code mutations: going back to the base `save.ts`, `art.ts` (a whole-file read), `maker/store.ts` or `board.ts` fails named test 1, 2, 3 or 4 in turn. The null-grid return (Rule 8) and the level-start tidy (Rule 7) keep the same behaviour, so no test can tell them from the base. Test 4's second half and the existing 8a level-start tests pin that behaviour.
- Trial patch: `/workspace/share/s10/s10a-trial.patch` (sha256 `609769ef0ae3cf8d005074e210bceaaa52ce1d87b78f0ab4ba0a6d3c53afefaf`, 324 lines, 18 files; it excludes `handback/`). It applies cleanly to a fresh `ea3b08f4` worktree, where green gives 1146/0 and s4c gives 16 ok.

## Baseline republish (baseline-08b)
- 10a changes the baseline only in its title and readout line. The live page (`build.json` source `dde07b67`) also predates the 9c markers. One rebuild of the existing page after 10a merges carries both. No new page.
- Needs: CoS asks the CEO; publish only on the CEO's own typed OK in QA's chat, naming the commit; CoS verifies it there (the builder never publishes or pushes gh-pages). Then QA's post-publish walk check. It runs **headless, at device scale 1** (360 and 390 wide), and checks that the stairs marker shows before the hero moves, the walk downstairs works and the readout says "baseline · …". **Only the CEO's phones are real devices.** A real-phone check is his, if he wants one. (This corrects the 9c guide's "on a phone" wording, `step-09c-link-markers.md` L80.)

## Carries
**Closed here:** the stale s4c smoke; D22 write side (`effect_` ids; `setup_` accepted for ever by exact id); `linkPx` `Object.hasOwn`; `writeBytes` abort; the upload read before the size check; levels start narrowing (the "levels.ts L64" carry); `project.ts` null grid; the "baseline 06c" title.
**Still open, not 10a scope:**
- Step 10 (engine effect path, roadmap L85), as 10b (data + rule: D22b `effects/` slot, the `legacyEffectId` / `badEffectId` rows, `playDocsOf` passing effects and `effectRef`) and 10c (the Effect row editor). Needs CoS's go (row PROPOSED).
- **DSK:** `notPlaced` (emitted at `src/project/read/placements.ts` L15 and L25) is missing from `project-format.md`; the format's r41 still needs D22b's `effects/` slot, the two codes and the `.deleted/` rule. Don't edit format docs here.
- D22's "Duplicate mints `effect_`": no effect Duplicate exists yet. Whichever step builds one mints `effect_`.
- Records: `match.ts:80` `landed('')` is resolved in code since 8a (`3d3d2539`), but the docs still list it. The next rebuild record should close it.
- From 9b/9c: the "Stairs to <stage name>" info row; starter-frame link art; markers in the maker; K6, K14, exact-size check, Scroll speed/Repeat, Cover/Stretch, 8192 toggle and `settings.maxImageSide`, memory meter, export shipping assets (step 11); the raf-driver dpr guard; the baseline-08b republish (the CEO's own typed OK in QA's chat, naming the commit; CoS verifies it there).
- s3 flake: `touch-smoke.mjs` L119 `waitForTimeout(80)` and L121 read the sheet with no wait after Test; fix later with a `waitForFunction`.
- DSK r41 (edcc98f6) names `uploadTooLarge` `{fileName, w, h, max: 4096}`; a later step replaces 9b's plain over-size message with it. The upload has no byte cap (a PNG whose header fits still reads whole): DSK/UX carry.
- The DSK items above are covered by r41 (edcc98f6).
- Toolchain: `npm audit` 9 moderate in the ESLint chain (no product change).
