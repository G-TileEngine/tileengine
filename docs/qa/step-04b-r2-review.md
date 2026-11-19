# QA review: Step 4b r2 (rework round)

**Verdict: OK TO OPEN PR.** Both must-fixes from `step-04b-review.md` pass. The product code is unchanged from r1.

Branch `step/step-04b-stage-place-r2-chatA`, tip `82e8ab1c` (tree `1e80d27e`), code head `d27a0d24` (tree `025b6cae`), parent r1 tip `429ad97b`, base `d62f87bc`.

## Scope
- r1 code head..r2 code head (`516cbfbe..d27a0d24`, which also brings in the r1 handback folder) changes only 3 code files: `smoke.mjs` +10/-10 net, `maker-law.test.ts` 2/2, and `stage-place.test.ts` 4/2. No file under `src/`, `tools/` or `data/` changed. The code-head..tip delta is only `handback/step-04b-stage-place/r2/HANDBACK.md`.

## Must-fix 1: smoke waits (PASS)
- `tap()` (smoke L16) no longer has the 120 ms pause. The only `waitForTimeout` left in the r1..r2 diff is the removed line.
- New helpers `waitLabel` (L19) and `waitText` (L20) wait on the expected state after each save in checks 3, 4, 5, 7 and 8. Each one throws on its 15 s timeout, so the asserts still run and a timeout cannot hide a failure.
- Check 6 now calls `window.__hud.hideBanner()`. `__hud` is an existing DEV global (`tools/play-stage/page.ts:55`), so this needs no product change.
- Runs (`/usr/bin/google-chrome`):
  - s4b solo: 2/2 SMOKE PASS, 16 ok each (390 and 360).
  - s4b under 8 CPU-burn loops: **4/4 pass**, 16 ok each. r1 failed 3/3 under the same load.
  - s4a: solo 16 ok; under load 16 ok.
- The smoke is 51 lines, within the 130 cap.

## Must-fix 2: kind regex (PASS)
- `maker-law.test.ts:16` now uses `/["']?\bkind["']?\s*:/`, and the `unquoted.ts` plant is in the L34 plant list. Planting `{ kind: "behaviour-setup" }`, `{ "kind": ... }` or `{ 'kind': ... }` in `src/editor/stage/` makes maker-law fail 1/1 in each case.
- `stage-place.test.ts` (L50-53) uses the same regex in a per-line scan of the 5 stage files.

## Allow-list ruling: acceptable, fail-closed (non-blocker)
- The allow-list is an exact `deepEqual` against one entry: `tools/maker/stage.ts:31: function docAt(files: ProjectFiles, kind: string, id: string): ...`. Line 31 holds that text at the tip.
- Plant results:
  - Extra `kind:` line in `place.ts`: stage-place FAIL (maker-law FAIL too).
  - New `kind:` line in `stage.ts`: stage-place FAIL.
  - Changed text at `stage.ts:31`: FAIL.
  - Line shift in `stage.ts`: FAIL.
- It is not a broad skip. The line-number pin is brittle, because any unrelated edit above L31 forces a pin update. It fails closed, though, so it is fine. Note for 4c: whoever edits `stage.ts` updates the pin.
- Scope: maker-law's doc rule only covers paths with a `/stage/` directory, which is `src/editor/stage/**` as guide L226 intends. `tools/maker/stage.ts` is not in that scope; a `kind:` added there passes maker-law and is caught only by the stage-place scan. So the `docAt` param never touches the plant's scope. The allow-list exists only because the stage-place scan reaches further than the guide asks.

## Gates
- `npm ci && npm run green` exits 0: 1063 tests, 1063 pass, 0 fail, 0 skipped, N=3. The named tests and parity seed 24301 pass.
- G7 (guide L251 command plus `':!handback/**'`): 8 files, **308+34=342** at both the code head and the tip. This matches HB:22.
- S0 `d528795e` is unedited and passes 14/14. There is no diff in `tools/play-stage/`, golden `90dde42a` or `fixtures/`.
- Merge tree onto `origin/main` `4867f363` is clean and gives **`e82c28d0`**, as predicted. It differs from the branch tree only by main's 4 docs (the 00b QA docs, the 00b rebuild record, and `docs/qa/step-04b-review.md`).
- The r1 non-blockers still stand: the fixed `createdAt` in `setup.talk.json`, `stage.ts` at 255 lines, the 4a carries, and the banner in shot 09.
