# Step G2b builds A/B (effect pieces): QA pick

Base `cbb326ef`. The approved kit proto is r3 `6866e47a` (tree `3d32a8f7`). CoS named the kit landing `e58d5ce2` (step doc + handoff copies of the three shipped tests). Main is now `5d41f2fd` (a G4 merge-time doc update). Both builds sit on `cbb326ef`, which is expected. Inputs copied to `docs/qa/qa-runs/step-g2b/builds/` and `tileengine-repo/qa-runs/step-g2b/builds/`; outputs in `builds/out/`. Bundles fetched to new `refs/cmp/sg2bb-A-*` and `sg2bb-B-*` only. Nothing pushed. CoS's verifies said PASS; the figures below were re-run on this box.

Shipped tests are byte-identical to proto r3 `6866e47a` and to the kit copies under `handoff/steps/tests/step-g2b-effect-pieces/` on `e58d5ce2`: effect-pieces `64b3a0d5`, fx-particles-qa `89bf5711`, perf-34a `f828a3a5`. The kit landing does not place effect-pieces at `tests/`; `tests/runtime/scene/fx-particles-qa.test.ts` and `perf-34a.test.ts` on `e58d5ce2` are still the Base copies (`819bcd57`, `2531c26e`). The proto and the kit-path copies match the builds at both code and tip.

The only pin moves in the shipped qa / perf-34a files are the allowed Ruling 5 ones: rig C `da3c665e` → `b0e6cf14`, qa recolour `[true, true]`.

## Pick: **A** tip `refs/cmp/sg2bb-A-tip` = `9eb64806a09dd8779026d8ab1ed8ae7edc946d3a`, tree `c92f7ab50dd7b6b6d2b359aad74b585c4bced7ba`, parent code `8d1af4a16eedf8f6b43909940f359408d1142413` (tree `3bcb1855`), noreply

Why A: both builds are equally green (719/0, same sims, same 21 smoke pins, same stress counts, EA 17/17 and QA Q1–Q8 caught). A is smaller (116 vs 124) and its §0.6 helpers are complete. B is **rejected for the pick**: its required rulings helper was cancelled twice and returned no findings. B's HANDBACK says the rulings check is "the self-review of the committed diff, not a helper finding." Self-review is a separate required item, not a substitute for a helper. The paste asks for helpers for review, tests and cross-checks; B only completed the caps/pins/hashes helper. A missing §0.6 helper is REJECT. (The cancelled helper is missing, not merely thin.) B's product code itself is fine and is not a must-fix.

Merge-tree of the A tip onto main `5d41f2fd` is clean, tree `53d5a7567b764e20bf2fe87e2db4e37a0a72e727` (matches CoS). B tip merge-tree is also clean, `5ea5b72e0cd6ddda7d66c8ceb70e5ea0aa297db6` (matches CoS). No `refs/cmp/g2b-fix-*`.

## Must-fixes

None. Q7 (`k=2` light uses `mid()` for x only) is a no-op on both, as on the proto: the item-13 sheet is centred in x, so moving only x does not trip the pin. That is not a kit or build gap. Q1 is not pinned by the three shipped G2b files, but is caught by the older 33b-3 `pixel_scale` test (`scaled(9)` must stay 6), as in the kit review.

## litAt and centre vs proto `6866e47a`

- Proto: `k <= 1` returns `mid()` exactly; otherwise `anchor + (fw/2 − ax, fh/2 − ay) · k`. Particles stay on `mid()`.
- A: `k === 1` returns `mid()` exactly (A's rulings helper found a possible 1-ulp drift from the formula and fixed it before the commit). For `k > 1` the formula is algebraically equal to the proto (standing: `foot + offset + (fw/2 − ax) · k`; overlay: `p + ax + (fw/2 − ax) · k`). Particles stay on `mid()`.
- B: always uses the scale formula, including at `k = 1`. Algebraically equal to `mid()` at `k = 1`, but it does not go through `mid()` (a possible 1 ulp). Particles stay on `mid()`. Given `pixScale` never returns `k < 1`, A's `k === 1` and the proto's `k <= 1` agree in practice.

## Per build

| | A `9eb64806` (code `8d1af4a1`, 1 product commit) | B `0e2fac1d` (code `ddf12ab7`, 1 product commit) |
|---|---|---|
| Bundle | `e87257e3f52f8507d983100e5dd630c38720f670c2be44f2aa3783a8f8ed367c` | `b2c48380bbf36a7c6770f394c8ed4da392f4fa4be48b5683546bbe464ed8e7a2` |
| Diff | 9 files +95/−21 = 116 | 9 files +105/−19 = 124 |
| Caps (changed lines) | fx-live 9/24, fx-particles 20/30, fx-player 2/4, draw-list 2/8, types 2/4, world-scene 4/8 | fx-live 12/24, fx-particles 25/30, fx-player 2/4, draw-list 2/8, types 2/4, world-scene 4/8 |
| Identity | every commit noreply `G-TileEngine@users.noreply.github.com` | same |
| Green | 719/0 (0 cancelled, skipped or todo); tsc, lint, deps, state and law exit 0 | 719/0, same gates |
| Shipped tests = proto `6866e47a` | yes, at code and tip | yes |
| Protected paths vs `cbb326ef` | empty (`package.json`, lock, `BUILD_GUIDE.md`, `src/types`, `src/state`, `src/core`, `src/sim`, `tools`, `tests/perf`) | empty |
| Sims | = Base (48/2 `afc89d56`, 22/28 `b8007292`) | same |
| 21 smoke lines | identical to B, including heap +0.70 MiB; hashes and counts identical | same |
| Pixel smoke | `smoke: 0 failed` | same |
| Stress | counts = Base (A 27/0/0, B 113/0/0, C/E 181/0/0, L 27/373/0); L p95 1.16–1.17 ms under 2 ms | L p95 1.01–1.12 ms; same counts |
| Plants (EA `sg2b-plants-r3` adapted 17 + QA Q1–Q8/Q9 adapted) | EA 17/17. QA Q2–Q6, Q8, Q9 caught by the shipped files; Q1 caught by the older 33b-3 `pixel_scale` test; Q7 no-op as on the proto. | same |
| Build law | one clock / one rAF (no new loop or timer); UNIT/TILE untouched; only the 9 listed files; 116 inside 400 (under the usual 150); every file under its cap | same, 124 |
| HANDBACK §0.6 | present; 3 helpers (rulings vs code — found the `litAt` k=1 mid() pin; tests and probes; caps/hashes) plus a full self-review. Not thin. Committed sha256 `6e356a20` = the bundle HANDBACK. | **REJECT for the pick.** Section is present, but the rulings helper was cancelled twice with no findings, and there is no tests helper. Only "Check caps, pins, and hashes" completed. Self-review is not a substitute. Committed sha256 `7bc11307` = the bundle HANDBACK. |

## Nits and drift

- N1: B divides a spread byte by 256; proto and A divide by 255. The step did not choose 255 or 256; the shipped tests do not pin the divisor.
- N2: A's `particleAt` adds jitter without `fp()`; the proto floored it. Tests still pass.
- N3: A stress E lap 1 p95 was 2.33 ms once, B stress C lap 2 was 2.27 ms once; L (the budgeted path) stayed under 2 ms. Report-only.
- N4: `origin/main` is `5d41f2fd`. The merge of the A tip onto current main is clean (G2b product files have no overlap with later kits on this base).
