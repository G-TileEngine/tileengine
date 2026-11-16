# Step G4 builds A/B (match loop): QA pick

Base `e9b8056b`. The G4 kit `30a664c6` is on main; main is now `e58d5ce2` (the G2b kit, tests and docs only). Both builds sit on `e9b8056b`, which is expected. Inputs copied to `docs/qa/qa-runs/step-g4/builds/` and `tileengine-repo/qa-runs/step-g4/builds/`; outputs in `builds/out/`. Bundles fetched to new `refs/cmp/sg4b-A-*` and `sg4b-B-*` only. Nothing pushed. CoS's verifies said PASS; the figures below were re-run on this box.

Shipped tests are byte-identical to the G4 kit proto `fe4d9b2e` and to the kit copies under `handoff/steps/tests/step-g4-match-loop/` on `30a664c6`: clock-skip `2ad0ca34`, save-continue `7ea68e6c`, flow-pins `612003ab`, strict1 `47e5d4b6`, raf-driver `bd68c9ed`. The kit commit itself does not place those files at `tests/` (only the handoff copies), so a `tests/` compare against `30a664c6` is the wrong tree; the proto and the kit-path copies match the builds at both code and tip.

## Pick: **A** tip `refs/cmp/sg4b-A-tip` = `1b3b668bfb224678ad681cfc515be0a87abbd8ec`, tree `a8e50fe0db44452ec47903b2021f686affa117ac`, parent code `fb0c9454c9347031dd6c2fcc7d38db497a4fbf80` (tree `b16539e0`), noreply

Why A: both builds are equally green (725/0, same sims, same 21 smoke pins, same stress counts, EA 45/45 and QA 7/7 plants all caught). A is smaller (379 vs 385) and has more room under the caps (turn 57/60 vs B's 60/60; run 7/8 vs 8/8; sim index 3/4 vs 4/4). A's `createTurn` already writes the phase and then calls `onFuse?.`; it does not skip `setPhase` when no listener is passed. B introduced that short-circuit in `cc9e63e2` (`opts.onFuse?.(setPhase(...))`) and fixed it in `20207622`. Helpers on both are present and specific; B's helper is the one that found B's own bug.

Merge-tree of the A tip onto main `e58d5ce2` is clean, tree `11e3d2a5d7c0ed23f938925e2abefb7910404f64`. (B tip merge-tree is also clean, `e5efeef10951315cbf0f28bb8bd894ddfb21ce56`.)

## Fix: `refs/cmp/g4-fix-a` = `e685dedd9bf17d94194a746584035ce8e7c8ab4b`, tree `47b5c32e8ae88793cc6c4cd3665fa5852952fd79`, parent `1b3b668b`, noreply, message `QA G4: pin held fuse landing when no onFuse is passed.`

One new QA file, no EA shipped file touched: `tests/sim/save-continue-qa.test.ts`, 22 lines (G6), blob `bfc10c4c9221a03455ea0b5c91a2f3297d084d1d`. It builds a 50 ms fuse, holds it through a 2000 ms move, and pins that `MOVE_DONE` writes `sideEnd` when `createTurn` is given no `onFuse`.

- Clean A: pass. Clean B (file copied, not committed): pass.
- B's first product commit `cc9e63e2`: the new test fails (`MOVE_DONE` stays `actMenu`); the nine shipped save-continue tests still pass 9/9. That is the kit gap.
- Green on the fix: 726/0 (0 cancelled, skipped or todo); tsc, lint, deps, state and law exit 0.

Merge-tree of `refs/cmp/g4-fix-a` onto main `e58d5ce2` is clean, tree `555638a91639f858e0548a612406859e87339fb1`.

## Must-fixes

None remaining. The shared kit gap (shipped tests always pass `onFuse`, so they miss `opts.onFuse?.(setPhase(...))`) is closed by the QA test above. A's product code did not have the bug; B already fixed it in its second commit.

## Per build

| | A `1b3b668b` (code `fb0c9454`, 1 product commit) | B `665abd8f` (code `20207622`, 2 product commits `cc9e63e2` then `20207622`) |
|---|---|---|
| Bundle | `0e4d4cba5b6a0a8bc6ee807f4048401c65e0c7460b478c739938fa958f4c648b` | `7e14cbd1543794d53f8613ca245dfc75b73be5a13d334e6438eba68f68b678dc` |
| Diff | 12 files +366/−13 = 379 | 12 files +372/−13 = 385 |
| Caps (changed lines) | clock 18/24, clock types 9/12, clock index 2/2, turn 57/60, run 7/8, sim types 6/8, sim index 3/4 | clock 19/24, types 9/12, index 2/2, turn 60/60, run 8/8, sim types 6/8, sim index 4/4 |
| Identity | every commit noreply `G-TileEngine@users.noreply.github.com` | same |
| Green | 725/0 (0 cancelled, skipped or todo); tsc, lint, deps, state and law exit 0. With `g4-fix-a`: 726/0, same gates. | 725/0, same gates |
| Shipped tests = proto `fe4d9b2e` | yes, at code and tip | yes |
| Protected paths vs `e9b8056b` | empty (`package.json`, lock, `BUILD_GUIDE.md`, `src/types`, `src/state`, `src/rules`, `src/runtime`, `tools`) | empty |
| Sims | = Base (48/2 `afc89d56`, 22/28 `b8007292`) | same |
| 21 smoke lines | = B except heap +0.71 vs +0.70 MiB (report-only); hashes and counts identical | heap +0.70 MiB |
| Pixel smoke | `smoke: 0 failed` | same |
| Stress | counts = Base (A 27/0/0, B 113/0/0, C/E 181/0/0, L 27/373/0); L p95 1.12–1.26 ms under 2 ms | L p95 1.05–1.09 ms; same counts |
| `skip(MAX_SAFE_INTEGER)` | no hang: 0 ms without a tick subscriber, 127 ms with one; `now` 28800000, remainder `9007199225940991`, `skipCapped` | 0 ms / 177 ms; same now/remainder |
| Plants (EA `sg4` adapted + QA Q1–Q7 adapted) | EA 45/45, QA 7/7 (52/52) | 45/45 and 7/7 (52/52) |
| onFuse with no listener | held `MOVE_DONE` writes `sideEnd` | same, after the `20207622` fix. On `cc9e63e2` it stays `actMenu` |
| Build law | one clock / one rAF (no new loop); UNIT/TILE untouched; only the 12 listed files; 379 inside 150–400; every file under its cap. The fix adds one QA test file only. | same, 385 |
| HANDBACK §0.6 | present; 3 helpers (clock cap, turn holder, caps/hashes) plus a full self-review against Acceptance. Not thin. Committed sha256 `a3def8f3` = the bundle HANDBACK. | present; 3 helpers plus a full self-review and a ten-point turn-holder review. The turn helper found and fixed the no-`onFuse` bug. Not thin. Committed sha256 `82678455` = the bundle HANDBACK. |

## Nits and drift

- N1: closed — no-`onFuse` phase write is pinned by `save-continue-qa.test.ts`.
- N2: the step table says clock types `31 → 37`; both builds are `31 → 36` (9 changed lines, under cap 12).
- N3: A stress E lap 3 p95 was 2.03 ms once; L (the budgeted path) stayed under 2 ms. Report-only.
- N4: `origin/main` is `e58d5ce2`, not the `e9b8056b` named as Base. The merge of `g4-fix-a` onto current main is clean (G4 product files have no overlap with G1 or G2b).
