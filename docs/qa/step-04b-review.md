# QA review: Step 4b r1 (stage place)

**Verdict: NOT OK. 2 must-fixes, both in test/harness files. No product code needs to change.**

Branch `step/step-04b-stage-place-r1-chatA`, tip `429ad97b` (tree `4d1a434c`), code head `516cbfbe` (tree `a4b44f5d`), base `d62f87bc`. Guide: `docs/maker/steps/step-04-stage-editor.md` r6 (the same on main and the branch), 4b at L189-266. CoS report `c22cb050` was used as a pointer only.

## Must-fix
1. **The s4b smoke uses fixed sleeps where it needs waits.** In `handoff/steps/tests/s4b-stage-place/smoke.mjs`, `tap()` (L16) ends with `waitForTimeout(120)`. Checks 4, 5, 7 and 8 then read `aria-label` or `innerText` straight away (L37, L39, L43), before the async save and re-render finish. Repro: run the smoke with 8 busy-loop CPU hogs on this 8-core box. It failed 3/3 runs: checks 7-8 failed in run 1, and checks 4-8 cascaded in runs 2 and 3. I ran the same file again under the same load with the sleep raised to 1500 ms, and it passed 2/2. The s4a smoke under the same load passed 1/1. So this is smoke timing, not a product race, and CoS's checks 7-8 failure was the same thing. Fix: after each tap that saves, wait for the expected state (for example `page.waitForFunction` on the cell's `aria-label`, or on the free-roam text) instead of a fixed pause. This matters because the smoke becomes a pin after merge. Keep it within the 130-line own cap (it is 49 lines now).
2. **The maker-law plant misses an unquoted `kind`.** At `tests/editor/maker-law.test.ts:16` the check is `/"kind"\s*:/`. A planted `src/editor/stage/zz.ts` holding `export const d = { kind: "behaviour-setup" };` passes maker-law (1 pass, 0 fail). The same file with `"kind":` fails, as it should. The guide's plant (L226) is "no `kind` or `formatVersion` literal for a new document in `src/editor/stage/**`", and in TS the unquoted key is the likely way to write one. Fix: match `["']?\bkind["']?\s*:` and add an unquoted plant to the L34 plant list. The source scan in `tests/editor/stage-place.test.ts` (`/\bformatVersion\b|"kind"\s*:/`) has the same gap, so widen it too. Today `src/editor/stage` has no `kind`, so nothing else changes.

## Numbers (my own runs on a fresh worktree at the tip)
- `npm ci && npm run green` exits 0, with 1063 tests, 1063 pass, 0 fail, 0 skipped. N=3 (floor 1060+3). The named tests `talk skeleton loads` and `talk limit: slice matches format` both pass. Mutation: with `delete copy["setupIds"]` removed from `standHere`, stage-place fails. With the `no_default_reason` guard removed, it still passes, because the guard is redundant when a knob has no `default` (note only).
- G7, the guide L251 command with `':!handback/**'`: 8 files, 306 insertions + 34 deletions = **340**, the same at the code head and at HEAD. The code-head..tip delta is only `HANDBACK.md` and 9 shots. The smoke is 49 lines.
- Smokes run solo with /usr/bin/google-chrome: s4b SMOKE PASS 4/4 (16 ok, at 390 and 360). s4a passed 2/2 (16 ok). S0 `d528795e` (sha256 unchanged) passed 14/14. s3 passed 18 ok.
- No diff under `tools/play-stage/`, `fixtures/`, `src/project/`, the golden files, `host-example` or the s0/s3/s4a smokes. Parity seed 24301 passes in green.
- `node tools/maker/build.ts` exits 0 with stamp `cb00d1cf815f`, which matches HB:37. The export audit is clean: the play-stage output has no editor or dev paths.
- Merge tree onto `origin/main` `f3c91fad` is clean and gives **`e9e8f410`**, as CoS predicted. Its only difference from the branch tree is main's three docs (the 00b QA docs and the 00b rebuild record).

## Checked OK
- Done-when (L250-266): the model test covers each bullet (adds, byte-equal rest including `history`, refuse reasons, move writes only `at`, delete, Start new, setup id/answers/no-value default, readProject `ok` with an empty report, `playDocsOf` gives the talk line, stand-here keeps the file, limit = `max_len`, Enemy row absent when the pool isn't fixed).
- Must NOT (L242-248): no `side`, `facing` or `kind` written on a placement. No talk-length number in code (`talkLimit` reads the slice). The skeleton is the only `kind`/`formatVersion`. No setup is deleted. No play-stage change.
- Laws: no empty catch or new rAF/interval in the 4b files. The errors I checked show worded banners ("Can't open: setup.talk.json", "Can't open: catalogue/slice.json"), not silent defaults. Place, Move, Delete and the sheets are `.btn` (48px; the smoke's check 1 asserts >=48 at both widths). Path and Dirt are hidden, not greyed (HB:56). No dead buttons.
- `place.ts:34` "No player side: Test never reaches an outcome." exists, and HB:62 marks it as an extra rule (it follows the S0b non-blocker). The sheets were split into `stage-sheets.ts` as guide L223 allows. It holds the render-only sheet builders, so it is not a pass-through.
- HANDBACK: the cites and numbers match the code (HB:28 340, HB:33 S0 sha, HB:56-66). The 9 shots show the screens the guide lists.

## Non-blockers
- `data/templates/setup.talk.json` has a fixed `createdAt` of `2026-11-19T00:00:00Z`, and `fillTalk` doesn't set it (`planSave` sets only `rev` and `updatedAt`), so every new talk setup gets that date. Guide L204 doesn't list `createdAt`, so this is a carry for 4c or a guide note.
- `stage.ts` grew +122/-28 against a guidance cap of 85, and is now 255 lines. The total stays within 400, and caps are guidance only (L230).
- The 4a carries (`chosen()` dup, uncapped undo, `stage.ts` size, plant without `try/finally`) are still open. The 4b guide doesn't make any of them a must-fix.
- `09-play.png` was taken with the YOUR TURN banner still up (HB:49). The top bar and units are visible, so it's acceptable.
- HB:34 uses `/usr/local/bin/google-chrome`. I re-ran everything with `/usr/bin/google-chrome`.
