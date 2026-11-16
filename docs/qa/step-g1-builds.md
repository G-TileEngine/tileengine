# Step G1 builds A/B (render tidy): QA pick

Base `e9b8056b`. The G1 kit `baeccfa8` (shipped render-tidy `151e87ef`, fx-particles `9b934bc9`, host-hookup `28657f7a`) is on main. Main is now `30a664c6` (the G4 kit, tests and docs only). Both builds sit on `e9b8056b`, which is expected. Inputs copied to `docs/qa/qa-runs/step-g1/ab/`; outputs in `ab/out/`. Nothing pushed. CoS's verifies (`8b77a519`, `cec0764d`) said PASS; the figures below were re-run on this box.

Both builds used the r2 kit tests, not r1: `tests/runtime/render/render-tidy.test.ts` is `151e87ef` (the qfix) and `tests/runtime/scene/fx-particles.test.ts` is `9b934bc9` (assert restored), byte-equal to `baeccfa8`'s shipped copies. The r1 proto files were `ed0c56d4` / `b8bd8af2`.

## Pick: **A** tip `refs/cmp/g1-chatA` = `b838d79c377af88a2c5efb5c34e0b4b281aeb327`, tree `1aa3dddab24338e4048441587f99f5029b285764`, parent code `926ab593` (tree `ac953be5`), noreply

Why A: both builds are equally green (712/0, same sims, same L2 hashes, same stress counts, same plant catch once Q7 is adapted). A is slightly smaller (212 vs 216) and its second product commit fixes a real cache hole B still has: a rewind or a clockless call can keep a stale future `dueMs` (e.g. a light-gate 1200 after that gate has already cleared). A rebuilds unless the wake just computed equals the cached one, as well as when `dueMs <= clock`. Helpers on both are present and specific; A's helper is the one that found that bug.

## Fix: `refs/cmp/g1-fix-a` = `cdb626a48f418b3c723560e0c1aace16eb4eaf50`, tree `b85cc22ae1ac56b19358532a5d6e61b7aa50b368`, parent `b838d79c`, noreply, message `QA G1: pin hinted motion message (E4).`

One new QA file, no EA shipped file touched: `tests/runtime/render/render-tidy-qa.test.ts`, 19 lines, blob `f79d51dbda806776d31e6f7439d595d2aaeb5900`. It builds a tile that already plays a clip and has motion, and pins `motionInvalid:grass#2: ${ANIM_HINT}` (the `<name>: <hint>` form). It does not edit item 8.

- Clean A: pass. Clean B (file copied, not committed): pass.
- EA E4 planted on A (`n.hint` without the owner prefix): caught (actual `motionInvalid:${ANIM_HINT}`).
- EA E4 planted on B (`hint` without the owner prefix): caught the same way.
- Green on the fix: 713/0 (0 cancelled, skipped or todo); tsc, lint, deps, state and law exit 0.

Merge-tree of `refs/cmp/g1-fix-a` onto main `30a664c6` is clean, tree `f03be8540f266755463370c8d5d508c9b3e10c70`. (The pre-fix A tip merge-tree was `098ee3ee63bb3a6ee0682cc105eabf8ae545d0d2`.)

## Must-fixes

None. The shared kit gap (EA plant E4 was a no-op: item 8 only pinned the no-hint form `motionInvalid:<asset>`) is closed by the QA test above. With it, EA plants are 21/21 on A and on B.

## Per build

| | A `b838d79c` (code `926ab593`, 2 product commits) | B `d3773eb9` (code `a40d6722`, 1 commit) |
|---|---|---|
| Diff | 12 files +158/−54 = 212 | 12 files +161/−55 = 216 |
| Caps (changed lines) | frames 2/8, draw-list 23/40, fx-player 5/8, fx-live 21/30, fx-look 8/20, types 2/4, index 6/8, world-motion 13/14, world-scene 33/50, fx-particles 0 | frames 2, draw-list 26, fx-player 5, fx-live 17, fx-look 14, types 2, index 6, world-motion 12, world-scene 33 |
| Green | 712/0 (0 cancelled, skipped or todo); tsc, lint, deps, state and law exit 0. With `g1-fix-a`: 713/0, same gates. | 712/0, same gates |
| Kit tests byte-equal | 151e87ef / 9b934bc9 / 28657f7a yes | yes |
| Sims | = Base (48/2 `afc89d56`, 22/28 `b8007292`) | same |
| Smoke 21 lines | only heap +0.71 vs Base +0.66 MiB | heap +0.70 MiB |
| Pixel smoke / suite | 0 failed; L2 `1:150x98:04b5748d`, `2:150x98:6865666d`, `3:150x98:846e2223` = Base | same |
| Stress | counts = Base (A 27/0/0, B 113/0/0, C/E 181/0/0, L 27/373/0); L p95 1.43–1.57 ms under 2 ms | L p95 1.05–1.17 ms; same counts |
| Plants (EA `sg1` adapted + QA Q1–Q14 adapted) | Before the fix: EA 20/21 (E4 miss, shared); QA 14/14 once Q7 is adapted to A's `dueMs === wake` guard. After `g1-fix-a`: EA 21/21, QA 14/14. | Before: EA 20/21 (E4 miss); QA 14/14. The same QA file, copied onto B, catches E4 there too. |
| Rulings | 33h `'bad (sheet bad-sheet)'` holds. 33b-3 `[132, 36, 97, 2]` is only the edge cull: reverting just that `hit()` test restores `[131, 36, 96, 2]` and fails only the seam-33 pin and this count pin (30/32 pass in the three shipped files). Device-page carry pin holds; `build.ts` is unchanged. | same revert proof, same pins |
| Cache (ruling 6) | rebuilds when `dueMs <= clock` **and** when the wake just computed is not the cached one | rebuilds only when `dueMs <= clock` |
| Build law | one clock / one rAF (no new loop); UNIT/TILE untouched; only the 12 listed files; 212 inside 150–400; every file under its cap. The fix adds one QA test file only. | same, 216 |
| HANDBACK §0.6 | present; 2 helpers (one found and fixed the cache hole) plus a full self-review against Acceptance and G1–G10 | present; 3 helpers plus a full self-review. Not thin. |

## Nits and drift

- N1: closed — E4 / hinted `name: hint` is pinned by `render-tidy-qa.test.ts`.
- N2: the step table says frames `46 → 49`; both builds are `46 → 48` (2 changed lines, under cap 8).
- N3: `origin/main` is `30a664c6`, not the `e9b8056b` named in the paste. The merge of `g1-fix-a` onto current main is clean (G1 has no overlap with the G4 kit commit).
- Both HANDBACKs say `sg1-plants.py` was not run because `/workspace/scratch-ea` is absent on the builder. Expected.
