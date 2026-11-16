# Step P1 builds A/B (G3 light walls + G4b door gaps): QA pick

Base `d867161c`. Kit `24b014fa` (step `d65a5522`, shipped light-walls `7fc41d97`, door-gaps `6f23cb22`) is on main. Main has since moved to `fb0f6620` (D3, which touches only docs, tools/host-example, tsconfig and BUILD_GUIDE). Both builds sit on `d867161c`, not on `24b014fa`; that is expected, since the kit commit only adds handoff files.
Inputs copied to `docs/qa/qa-runs/step-p1/ab/s-p1/`; outputs are in `ab/out/`. Nothing pushed. CoS's verifies (`ada3eb67`, `d90a816b`) only checked shas, `npm test` and the diff stat: no gates, plants, probes, smoke or helpers.

## Pick: **B + `refs/cmp/p1-fix-b`** = `c18d39106e2f1d5ed8a4371a70b0d63a4f85e0f7`, tree `b69705122f2d55f8d1092f62b99e4f34467a7a8c`, parent B tip `4ea8ad2b`, noreply
Merge-tree onto main `fb0f6620` is clean, tree `c6b96f8bdebe6b4cdaddda0cadc5e62b3df7b4dc`.
Why B: A and B are equally correct (same gates, same probe output, same plant catch). B is smaller (215 vs 236 changed lines) with more cap headroom: clock 32/40 vs A's 40/40, visibility 31/40 vs 38/40, run 32/40 vs 38/40. B's ray walk (`rayOpen`) is the proto's simple step walk, where A's `shaded` is longer and harder to read. B's HANDBACK helpers are fuller.

## Must-fix (kit gap, both builds): **M2, a one-sided n/s wall leaks and no shipped test sees it**
Repro on B: in `visibility.ts` `hEdge`, drop `on(x, y, sy > 0 ? 4 : 1) || ` (only the neighbour's bit counts), or drop ` || on(x, y + sy, sy > 0 ? 1 : 4)` (only the cell's own bit). All 702 still pass. A behaves the same with the matching edits to its `cuts` "s" branch.
Cause: the shipped one-sided check covers only e/w, looking east (the M1 fix). The north wall in "a short thin wall…" sets both bits.
Fix in `p1-fix-b`: a new QA test, `tests/runtime/render/light-walls-qa.test.ts` (31 lines, cap 37, sha256 `322e3c025447a4376e39fafe3f305c9c5f974630e7ec38d32d46dca98199ff90`). It covers a one-sided bit, own and neighbour, for n/s/e/w.
- It catches all 4 one-sided plants on B and both n/s plants on A. It passes on clean A and B, and fails on the base.
- `p1-fix-b` green: **703/0**, with typecheck, lint, deps, state and law all exit 0.
- **EA must adopt it as a shipped file (G6):** add it to the step's file list with its sha, and raise the floor to 703. The builders could not have known about it.

## Per build
| | A `4ee019bc` (code `673c37cd`) | B `4ea8ad2b` (code `591e5d33`) |
|---|---|---|
| Diff | 8 files +211/−25 = 236 | 8 files +193/−22 = 215, light.ts unchanged |
| Caps (changed lines) | clock 40/40, visibility 38/40, run 38/40, log 2/4, actions 1/6, index 2/2 | clock 32, visibility 31, run 32, log 2, actions 1, index 2 |
| Green | 702/0 (0 cancelled, skipped or todo); tsc, lint, deps, state and law exit 0 | same |
| Kit tests byte-equal | 7fc41d97 / 6f23cb22 yes | yes |
| Sims | = proto (48/2, 22/28) | = proto |
| Smoke 21 lines | only heap +0.69 → +0.70 MiB | same |
| Probes (hostile, extra a/b, x7, x8) | 5/5 exit 0; output = proto. Rows 6, 7, 10, 11, 13 and 14 closed | same |
| liar14 (lying getters, carry D3) | -5 → raw `replayTicks` RangeError; NaN, 1e15, null → "does not match" | same |
| N1 (X3 1e6-effect heap) | +93 MB, not fixed (carry) | same |
| Plants (`plants-ab.py`: EA G1–G7/D1–D14 adapted, plus QA Q1, Q3–Q10, M1, M1v, G2v) | 31/33; misses M1v and G2v (M2) | 31/33; same misses |
| Build law | no clock or rAF lines added; no UNIT/TILE pipe change; 8 listed files only | same |
| HANDBACK §0.6 | present; 2 helpers, light helper "PASS. No change." → **thin (flag)** | present; 3 helpers, specific |

On both, Q7 (loadSave maps every restore error to PhasesInvalid) is caught only by the older `tamper reach (step 24)` test, which is fine. Every other plant is caught by the kit tests.

## Nits and drift
- The step (`d65a5522`) says the shipped one-sided check means "a wall bit on either side of the edge stops light". That holds only for e/w until the QA file above is shipped.
- B HANDBACK notes a perf-34b L-lap flake (p95 2.50 ms) while helpers were running on its 2-vCPU box; the quiet run passed. Watch for it, nothing more.
- Both HANDBACKs say `sp1-plants.py` was not run because scratch-ea isn't on builder machines. That is expected now that the step marks plants and probes "QA verifies".
- A: guard wrappers `nest`/`during`; B: `busy` plus an inline try/finally. Both clear the guard in `finally`.
- Carries are unchanged: N1 heap, the C7 timer count, skip(MAX_SAFE), and lying getters for D3.
