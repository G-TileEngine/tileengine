# Step 10b guide review (effect data), r1

Guide /workspace/share/s10b/step-10b-effect-data.md r1, sha256 b38b56cc… (110 lines). Paste: ff2a294b. Trial patch: 4f7b6b87. Roadmap patch: ea0bec8d. I checked all four hashes.

**Verdict: OK TO SEND**, with two non-blocking nits.

## Re-run (QA, 2026-11-25)
Worktree: 31f4c0c4 + s10a-trial.patch (609769ef), committed, then s10b-trial.patch applied cleanly.
- Count: 11 files, 107 lines added and 18 removed (125 of 400). Every file is within its Build-table cap.
- Green exits 0 with **1150 pass, 0 fail**.
- tsc on tools shows the 3 base errors.
- s10b on port 8815 gives SMOKE PASS: 8 ok at 390 and 360.
- The s8 audit passes (133 / 147 / 146).
- Mutations (base file restored):
  - read-project.ts makes tests 1–3 fail.
  - fx.ts makes test 3 fail.
  - asset-check.ts makes test 4 fail.
  - These match the guide's Measured section.
- Smoke waits use waitForFunction. There is no waitForTimeout.

## Law and scope
- Nothing in src/core, src/sim or src/rules changes. effectRef stays "line-shot".
- The swap happens only in the play stage, by exact id. No new rAF, timer or loop.
- Law 12 carries closed:
  - The uploadTooLarge row is in, and art-upload test 3 is re-pinned.
  - asset-check no longer swallows a failed migration. It returns a hard invalidValue row.
- Data safety: effect docs move out of unknownFiles into store.effects. I checked for any writer that rebuilds files from unknownFiles and found none, so this doesn't lose data.
- Layers: play-stage imports HOUSE_ATTACK from its own fx.ts, and nothing from tools/maker or src/editor.

## Nits (fix in the guide or in the handback, not must-fix)
1. Carries L104 still lists "baseline-08b republish" as open. It was republished today as gh-pages 6d8b21b4, and QA passed it (publish-2026-11-25-baseline-08b-check.md).
2. s10b step 4 is named "a missing effect is a warning", but it asserts only that no saved effect is picked (the stock drawing). The unknownRef row is covered by named test 2. Either rename the step or assert the row.

## Review of the handback
- Rerun all 19 smokes.
- Rerun the mutations above, plus types.ts (tests 1–3), project.ts (test 3), and art.ts (art-upload test 3).
- Check the floor at the 10a merge count + 4.
- Run the export audit, then the postmerge.
