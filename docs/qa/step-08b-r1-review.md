# QA review: step 8b stair baseline r1 (PR #97)

Verdict: **NOT OK, one must-fix (r2).** Everything else passes.

Tip dca1d1e6 (tree 9ae41c45), code head 6562653a (tree 04bcf371), base main ecd22d80. Guide r2 6bd10c75. Fresh worktree, real `npm ci`.

## Checks (all pass)
- `npm run green` exit 0, **1125 pass / 0 fail** (floor 1125). one-parser, baseline-page and play-stage-p19 tests unedited.
- tsc: only the 3 base errors (effect-designer page.ts L101, maker home.ts L85 x2).
- Count `git diff --shortstat ecd22d80..6562653a -- . ':!handback/**'`: 8 files +66/-28 = 94 (gate 400). Caps: links 6/8, project 4/5, load 2/2, match 4/8, hud 8/9, baseline/page 14/18, readout 6/6, test 50/50. All kept.
- Must NOT paths untouched (src/core, src/sim, src/types, data, fixtures, tools/maker, painter-proto, ui-shell, handoff). Existing tests: only the L1-7 import split (7 removed lines).
- Rules: `arrival(..., free, inside = free)`, arriveIn passes `inside = grid.inBounds`; `bench = party.members.slice(next.length)`; `match.party()` appends bench members; note text matches; `#note` role=status, styled at the end of css, `#top` rule unchanged; notPlaced reused; readout rows "stage changes N" and "worst ms in 3 frames after a swap X". No new rAF, timer or loop.
- Tests 6, 10, 11 present and named as the guide says.
- s8 smoke (part step-08b-stair-baseline): 16 ok, SMOKE PASS. S0 touch smoke (d528795e): 14 ok. s8-audit: AUDIT PASS.
- HANDBACK has the Code head label; no raw log or shots committed.
- `git merge-tree --write-tree origin/main dca1d1e6` = 9ae41c45 (clean; base is still main).

## Must-fix (Law 12, no silent failure)
1. `tools/baseline/page.ts` L19 `travel`: it pushes the swap, removes `#board` and `#hud`, then calls `arriveIn`, and on `got.docs === null` does nothing. A failed stage change leaves a blank page and drops `got.error`. Repro: make `arriveIn(shopFiles(), ...)` return `docs: null` (for example a link `to` a stage id that is not in `shopFiles()`), walk the stairs on `?scene=shop`: the board and HUD vanish and no error text shows. Fix, as the trial patch (s8b-trial.patch, travel line) did: call `arriveIn` first; if `got.docs === null`, set `read.textContent = got.error` and return; only then push the swap and swap the board and HUD. No line-count change.

## Fold into r2 (non-blocking)
- `tools/baseline/page.ts` lost its trailing newline; restore it.

## Notes (no action)
- 94 shipped vs 89 trial, all inside caps.
- Still open from 8a r2 (not 8b scope): levels.ts L64 narrowing; project.ts L102 null grid; the double slot read in writeAutosave; resumeNotes at openId's rev.
- The walled-off-pocket spill case stays for the phone check after merge.

r2 recheck: I check only the page.ts travel line, the newline, green 1125/0, the count, and a fresh merge tree.
