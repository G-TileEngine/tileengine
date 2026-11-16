# Step G1 kit review (render and scene tidy) — QA

Base `e9b8056b` (tree `26b0ff81`, equals `origin/main`) · proto `refs/cmp/sg1-proto` = `ef6f21913e417c9451177aa61efa4b8a68eeaf85` (tree `aa78e969`, parent `e9b8056b`, noreply) · step `dc766000` · paste `a94f77e3` · push list `9c6f1321` · plan `f2795ca0` §2 G1.
Inputs copied to `docs/qa/qa-runs/step-g1/in/`; logs, plants and the test fix in `docs/qa/qa-runs/step-g1/` and `out/`. No pushes. Review date 2026-11-15, Europe/London.

## Verdict: NOT OK — one must-fix (test gaps); the code itself is OK

**M1, four missed plants (Q6, Q12, Q13, Q14).** EA's 21 plants are all caught. Four QA plants, adapted to this code, fail to trip any test (kit or the full 712). The behaviour they break is in the rulings, but the shipped pins never look at it.

- **Q6.** In `world-scene.ts`, drop `hw > 0 &&` from the hit-white wake. An effect with `hit_white_ms: 0` then wakes the host at the hit pose (1320 in the item-9 scene). The item-9 pin only uses `hit_white_ms: 100`, so at t=1100 the clean scene has no `dueMs` and the planted one has 1320, and nothing checks.
- **Q14.** `hw = Math.round(hitWhiteMs(...).ms)`. Item 9 uses `hit_white_ms: 100`, so rounding is a no-op. With `110.1` (in the 40–200 clamp) the unrounded end snaps to dueMs 1440 and the look is still white at 1410; rounding gives dueMs 1410. Ruling 6 and QA's post-34 note both require the unrounded value.
- **Q12.** In `fx-player.ts` `placeStep`, `footAt(..., 0, unit.dy)` drops the unit's `dx`. That only moves an air (non-unit-layer) piece with `anchor_point` set. Overlay x should go 36 → 52 when `dx` is 16; the plant leaves it at 36. The item-4 fence still passes, because the expression lives only in `frames.ts`.
- **Q13.** In `fx-live.ts` `mid()`, drop `p.dy`. A front-unit light's y should go 44 → 60 when `dy` is 16; the plant leaves it at 44. Particles use the same `mid()`.

Fix: +9 in the shipped `render-tidy.test.ts` (84 → 93, sha `151e87ef`). Diff `docs/qa/qa-runs/step-g1/out/qfix.diff` (`e28813d4`). Item 4 pins the `placeStep` / `mid()` offsets; item 9 pins `hit_white_ms: 0` (no dueMs at 1100) and `110.1` (dueMs 1440, look still on at 1410). With the fix the proto still passes 9/9 in that file, and all four plants fail it. tsc-clean on the test alone (types already imported).

## Checks
1. `sha256sum -c` on the push list: OK on 4/4 from `/workspace/tileengine`. The three shipped tests are byte-equal to the proto tree (`ed0c56d4`, `28657f7a`, `b8bd8af2`). The step doc is kit-only (not in the proto commit) and matches `dc766000`.
2. Green 712/0 (0 cancelled, skipped or todo). tsc, lint, deps, state and law all exit 0. Sims are identical: fixed 48/2 `afc89d56`, weighted 22/28 `b8007292`. Pixel-suite smoke and `run.ts` match the Base byte for byte once the Node PID warning is ignored. `s34a-equal.ts` hashes and counts match (C/E `a9ccc146`, light raster `dca58548`). Stress counts match the Base (L `27/373/0`); wall-clock times move, L p95 0.90–0.94 ms (under 2 ms). The do-not-touch diff is empty, including `tools/**`.
3. QA rows: G1 does not claim the G4b numbered rows. It closes plan items 4–9, the seam-33 early cull, item 45 (depth pins, no code) and the G5a page-build pin.
4. Plants:
   - EA `sg1-plants.py`: **21/21** caught. On the Base the new file fails to load (`footAt`, `lookBox`, `rgbOf` missing).
   - QA plants: **10/14**. Q1–Q5, Q7–Q11 are caught by the shipped tests. **Q6, Q12, Q13, Q14 are missed → M1.**
5. Build law: no new clock or rAF; UNIT/TILE pipes untouched; no scope creep (`world-motion.ts` and `index.ts` are in the step's list for rulings 5 and 1–4; `fx-particles.ts` is unchanged as stated). Size is 206 = +149/−57 in 12 files, within 150–400 (plan ~255). Each file is within its cap under the step's lines-touched count. The paste has the §0.6 helpers rule and § Helpers & self-review.
6. Drift: the paste matches the step on the step sha, rulings, file table, interfaces, acceptance and pin moves. Code matches the stated line counts. One nit in the shipped 33b-3 pin, below.

## Rulings
- **(a) 33h host-hookup `'bad-sheet'` → `'bad (sheet bad-sheet)'`:** agree. Codes stay; the name is the asset id `bad` plus `(sheet bad-sheet)` because the sheet id differs. Listed old → new under the item-8 ruling. No 33i pin moves (`motion-shore-live.test.ts:71` still reads the code and `"anim: null"`). No other shipped pin moves except (b).
- **(b) 33b-3 `[131, 36, 96, 2]` → `[132, 36, 97, 2]`:** agree, after the revert proof. The only draw-list change that affects this pin is the dot box test in `draw-list.ts` (`fully inside` → the same `hit()` the sprites use). Reverting just that line on the proto brings `rig.counts()` back to `[131, 36, 96, 2]`, and the full particle-rig dump is byte-identical to the Base. In the kit + 33i + perf-34b set, only two tests fail (the new seam-33 pin and this count pin); the 33h pin, the 33i pins, L1 and the other G1 titles still pass. The Base vs proto pixel suite was already byte-equal (this rig is not in those fixtures). Extra proto dots sit only at device x=388 or 390, size 6, on the 390-wide view — the right edge. This is the seam-33 pin QA asked for; it is the one allowed extra pin move.
- **(c) device-page build may list `tools/pixel-suite/fixture.ts` and `l2.ts` by name:** agree. `page.ts` imports both. They are a 17-line pure scene fixture and a 13-line browser hash helper; no editor or dev code. `build.ts` (unchanged) only walks imports from `page.ts`, and the new carry test refuses any name outside `index.html`, `src/`, `tools/device-page/` and those two files.

## Nits
- N1: in `fx-particles.test.ts:140`, the comment that names the old counts sits in front of `assert.ok((rig.counts()[0] ?? Infinity) <= FX_BUDGET.frame)`, so that check no longer runs. The exact `[132, 36, 97, 2]` pin still implies 132 ≤ 300. Put the `assert.ok` on its own statement.
