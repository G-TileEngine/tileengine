# QA review: P1-1 "Walk" ChatA r1 handback (one builder, one pass)

Reviewer: QA & Build Guard, 2026-11-17 ~03:00 (Europe/London). Evidence: `docs/qa/qa-runs/p1/p1-1/builds/`.
**Verdict: OK TO OPEN PR** on tip `3ecbcaed091bdde5646c24c12d95ede4b4207911` (code head `3134cc75`, tree `d37fc3a6`).
Expected merge tree onto `origin/main` `dc381e99` = **`14da73886b7d437ca3f97a477d7741aa04ab4d48`**. Floor for `qa-postmerge`: **882**.
No must-fixes. No QA pin.

## 1. Identity, chain, files
| Item | Expected | Found |
|---|---|---|
| Bundle `step-p1-1-walk-r1-chatA.bundle` | 5438fc12… | 5438fc1265937916d67958c50d2b8fcc44c523d70d2ef8308f295fc5b4faafa5, verify OK, needs 16fabf3d |
| Tip / code head | 3ecbcaed / 3134cc75 | 3ecbcaed (hand-back, tree ea2e7c95); 3134cc75 freeze stepClamped notice (parent 0a353878) |
| Base | 16fabf3d, not kit 531d58ad | 16fabf3d is the ancestor; kit is not (docs come in from main; no path overlap) |
| Identity | noreply | all 3 commits author+committer `G-TileEngine@users.noreply.github.com` |
| HANDBACK | 5e70766c | share copy = committed `handback/step-p1-1-walk/r1/HANDBACK.md`; quotes step sha 39a9bbac (kit r6) |
| Shipped tests | cc007722 / 82520ebc / 4d5c90e7 / 37b8584c | 4/4 byte-identical to the r6 kit and to proto head e121b9ae (incl. QA pin move-qa.test.ts) |
| File list | kit's 12 product files + handback/ | 8 src + 4 tests; 6 files under handback/; pins (package.json 1e5dd82c, lock d7f64a09, depcruise 45a3dbaa, check-law.sh 4d7bbf48, core-types d6d08696) unchanged; do-not-touch dirs empty |
| Size / caps | ≤ 300; per-file caps | **259** (+253/−6); path 35/35, targets 26/26, step-pattern 20/30, index 3/4, player 10/12, types 6/11, btf move 6/18, btf index 1/2, tests at their caps |

HANDBACK §0.6: present, not thin. Helper 1 (player hook, rulings 8–9) PASS; Helper 2 (walk rules, rulings 1–6) found the unfrozen `stepClamped` notice and it was frozen in 3134cc75. Self-review covers Acceptance and G1–G10.

## 2. Code vs r6 (tree 763b9fe6)
Same behaviour. The player hook is identical to r6 except import order. `walks` / `walkTo` / `targetsFor` / `STEP_PATTERN` match the quoted interfaces. Differences are wording, not rules: `bodyAt` + `path.slice()` (not `[...path]`), `inBounds` as an early return, `!self.alive` instead of `self?.alive !== true`, and `targetsFor` also skips a non-alive resolve. Comments have no `S2` / `P1 S1` (kit R1). `types.ts` imports `StepRule` from `step-pattern.ts` rather than the barrel (report-only). The notice object, notes array, StepRule and `STEP_PATTERN` are frozen. `BTF_MOVE_DEFAULTS` is numbers only (no copied chess tree).

## 3. Gates (sequential; `TMPDIR=/tmp/q qa-gates.sh`)
| Ref | Tests (floor) | deps | Other | sim / stress / smoke vs baseline |
|---|---|---|---|---|
| Tip 3ecbcaed (`--main` 16fabf3d) | **882/0 (882)** | 127 / 408 | typecheck, lint, state, law exit 0 | SAME (afc89d56, b8007292; 27/0/0 113/0/0 181/0/0 181/0/0 27/373/0). Smoke 0 failed SAME |
| Trial merge `refs/cmp/p1-1-trial-main` fb118a8e, tree **14da7388**, onto dc381e99 (clean) | **882/0 (882)** | 127 / 408 | all exit 0 | sim SAME. Run 1: ref stress complete and under budget; main hit the known "E: p95 over 4 ms" flake (stopped before L). Run 2 (one rerun): both sides "C: p95 over 4 ms" (box load), SAME incomplete counts. Tip run already showed a complete SAME stress. |

A P1-2 worker's gate overlapped the tip run briefly. Tip stress was complete SAME, p95 well under budget (C ≤ 2.36, E ≤ 2.71, L ≤ 1.69 ms), so it was not rerun.

## 4. Plants (adapted to ChatA wording; same mutations as r5/r6)
| Set | Tests | Result |
|---|---|---|
| EA `p1-1-plants-list.py` (26), adapted | move.test + tsc | **26/26**. "targets keep dead" is the proto's typecheck plant (TS2339 on `hit.unitId`); a looser runtime form is equivalent (e2) |
| QA 19 (q13, q17, q23 and the rest) | move + parity + bot + move-qa | **19/19**, including the three r5 misses the pin closed |
| Parity drift d1–d6 | parity alone | **6/6** |
| Equivalence e1–e3 (report-only) | move + parity + bot + move-qa | **0/3** MISSED, as expected |
| Depcruise: `step-pattern.ts` imports `btf-defaults/move.ts` | depcruise | blocked: `rules-below-runtime` + `adapters-only-from-runtime-editor`, exit 2 |

## 5. Law, size, carries, drift
- Build law: no clock, rAF, timers, `Math.random` or `Date`. `targetsFor` uses the UNIT pipe (`aimUnit`/`resolveAim`); moves stay on the TILE pipe. check:law OK. Law 13: one Map of ≤ 8 cells per `walks` call, dropped on return; `PlayerStep.path` ≤ 2 cells. No scope creep: only the listed files changed.
- Size 259, in the 150–400 band, under the 300 cap.
- Doc ↔ code: rulings 1–9, the interfaces and the player diff match. No leftover own-side pass-through wording.
- Carries unchanged: `exploit.ts:75` → P1-5; a 0-HP unit must be `remove`d in the same step → P1-2.
