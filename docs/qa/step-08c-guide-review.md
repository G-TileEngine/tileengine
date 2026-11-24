# QA guide review: step 08c baseline walk (EA kit r1)

Verdict: **OK. Go-line ready**, to be pasted after 9a merges, as the guide says (L7).

Kit: guide `step-08c-baseline-walk.md` (sha256 484f4546, 69 lines), paste `step-08c-paste.md` (89401a3c), trial `s8c-trial.patch` (93b04bcf). Base 67832b08.

## Trial, rerun by QA in a fresh worktree with `npm ci`
- On 67832b08 the patch applies cleanly. Green exit 0, **1126/0**. `tsc -p tools/tsconfig.json` shows only the 3 base errors.
- Count: looks.ts 1+/1-, the test 21, so **23 counted** against caps of 44. The smoke is 36, under its own cap of 60. Must NOT is clean: no src/, tools/baseline/, existing test or existing smoke is touched.
- Named test 1 **fails on base** (with the old looks.ts: 0 pass, 1 fail) and passes with the fix.
- The s8c smoke (8812, dsf 1, waitForFunction) passes **8 ok, SMOKE PASS**. At 390 the hero is 4096 px, at 360 it is 2304 px. A tap shows Hero 20/20. Walking onto (1,4) gives stage changes 1 with worst 16.7 ms. The skirmish hero is drawn and selectable. On base it gives 0 ok and SMOKE FAIL.
- Regressions: s6d SMOKE PASS, s8 SMOKE PASS, S0 TOUCH SMOKE PASS, s8-audit AUDIT PASS.
- Combined: 67832b08 + 8c + the 9a trial patch (c03df133) applies cleanly. Green **1135/0**, s8c SMOKE PASS, s9 SMOKE PASS.

## Root cause
It matches my finding. The unit was in the match but drawn with no pixels, because the `starter:unknown-<id>` sheet was rejected by `dressPx`. The fix dresses it in its team colour, which is visible, so this is not a silent failure.

## Q1 (EA ruling on my repro at device scale 3)
Accepted. My post-publish walk check will run at device scale 1. The two phones at their real scale decide. If a phone shows an oversized board, EA's raf-driver guard becomes its own step.
