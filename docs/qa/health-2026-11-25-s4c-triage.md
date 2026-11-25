# s4c-stages-maps smoke failure: triage (2026-11-25)

**Verdict: stale smoke, not a product regression.** Since step 6a, Test on a stage with no units shows "Place a unit on this stage to test it." and stays in the maker. That is the intended behaviour: step-06 guide L66, the UX ruling on the `play: army` carry. s4c step 5 makes the 1x1 "Upstairs" stage with no unit on it, taps Test, and still expects the play page with a 1x1 grid.

## Evidence
- Diagnostic run on ea3b08f, using a copy instrumented in my scratch worktree; the repo file is unchanged. At the timeout the URL is still `/maker/?...&from=stage`, `window.__play` is undefined, and the sheet reads "Place a unit on this stage to test it. … No enemies: free roam. No player side: …".
- s4c on first-parent merges: 5a2c8e7 (5c, PR #89) gives 16 ok, 0 fail. 23b5755 (6a, PR #90) gives 14 ok, 2 fail. Every later merge is the same 14 ok / 2 fail: 42cc84b (8b), ab64d4f (9a), cd48ebd (8c), a1d0169 (9b), 9088feb (9c), ea3b08f. 8c, 9a, 9b and 9c are not the cause.
- The 6a guide edited the s3 smoke for the new sentence (guide L118) but never listed s4c. My own 6a review didn't run s4c either, so this has been red since 2026-11-21. That's a QA miss.

## Fix (test-only, one file)
Edit `handoff/steps/tests/s4c-stages-maps/smoke.mjs` step 5 only. Before tapping Test, place one team unit on cell 0,0 of the 1x1 Upstairs stage, using the same tap flow the stage-place smoke uses. Keep the existing wait for `?stage=<id>`, `window.__play` and a 1x1 grid. As a second assert, tap Test once with the board empty first, and expect the "Place a unit on this stage to test it" line and no `__play`. That pins the 6a guard.
No product code changes. The floor stays at 1142. After the fix, s4c gives 16 ok at 390 and 360.
Owner: EA writes the one-line kit (a step file or a carry inside the next step's scope). A Grok Build or GrokHeavy builder does the edit. QA reviews: s4c 16 ok, the other smokes unedited and passing, and a mutation where removing the unit placement fails step 5.

The baseline-08b republish doesn't depend on this. s4c covers the maker's stage and map screens, not the play build that gets published.
