# QA review: step 8c r1 (baseline walk), PR #100

**Verdict: OK TO MERGE** with `--expect-tree 562b452f3285936524c1baf17d8236e13bf424d0` onto main `5aba5ef7`. No must-fix. QA, 2026-11-24 (UK time).

- Branch `step/step-08c-baseline-walk-r1-chatA`. Base `02a0a9c5`. Code head `96a50e04` (tree `af2f7524`). Tip `7149df90` (tree `6c96f3c4`). Tip vs code head is `handback/step-08c-baseline-walk/r1/HANDBACK.md` only (130 lines, with a "Code head" label).
- Guide `step-08c-baseline-walk.md` (484f4546). CoS verify report `622244a1`.

## My rerun (own worktree at 96a50e04, real `npm ci`)

| Check | Result |
|---|---|
| Count (excl. handback and the s8c smoke) | 2 files, +21/-1 = **22** (cap 44); looks.ts 2/4, test 20/40; smoke 45/60 |
| Product diff | the one-line `dressPx` guard at looks.ts L40 (the same logic as the kit, with the operands swapped), plus the new test and smoke. No src/**, tools/baseline/**, data or fixtures |
| `npm run green` | exit 0, **1135/0** (floor 1135) |
| tools tsc | only the 3 base errors |
| s8c `. 8812 qa` | 8 ok: hero 4096 px at 390 and 2304 px at 360, Hero 20/20, **stage changes 1**, worst 16.7 ms, skirmish ok; SMOKE PASS; no waitForTimeout |
| s6d, s8, S0 | SMOKE PASS, SMOKE PASS, TOUCH SMOKE PASS (all unedited) |
| Export audit | AUDIT PASS |
| Trial merge onto `5aba5ef7` | `562b452f`, clean |

## Mutation check

Revert looks.ts to the base: `tests/tools/baseline-walk.test.ts` fails (0/1) and s8c fails. Restored, both pass.

## Non-blockers

- The HANDBACK PR line was written before PR #100 existed.
- s6d rewrites the tracked `handback/step-06d-baseline-page/r1/01-baseline.png` when it runs. Restore it after a local run; don't commit it.
- The readout still says "baseline 06c" (known drift).

## Next

Run the postmerge with `qa-postmerge.sh <merge> 7149df90`. Then republish baseline-08b, which needs the CEO's typed OK in QA's chat naming the build. Then my post-publish walk check at device scale 1 (stage changes 1 or more), then the phone reruns.
