# Step G2b kit review (effect pieces finish) — QA

Base `ef6f2191` (G1 proto, tree `aa78e969`) · proto `refs/cmp/sg2b-proto` = `5f49fa47c88acfbba4784d3fe89f3ca026ed9721` (tree `5999a6aa`, parent `ef6f2191`, noreply) · step `adc40a60` · paste `5cd8370e` · push list `378d8001` · plan `f2795ca0` §2 G2b.
Inputs copied to `docs/qa/qa-runs/step-g2b/in/`; logs, plants and the test fix in `docs/qa/qa-runs/step-g2b/out/`. No pushes. Review date 2026-11-15, Europe/London. Current proto reviewed as stacked on G1; it will need a rebase after G1's test-only fix.

## Verdict: NOT OK — one must-fix (test gaps); the code itself is OK

**M1, four missed plants (Q2, Q3, Q6, Q8).** EA's 17 plants are all caught. Four QA plants, adapted to this code, fail to trip any test (kit or the full 718). The behaviour they break is in the rulings.

- **Q2.** In `pixScale`, accept `"3.0"` as 3 (`/^[1-6](?:\.0)?$/`). Ruling 1 says strings match `/^[1-6]$/` exactly, with no `"3.0"`. Item 10 lists `" 3"` but not `"3.0"`. The plant plays scale 3 with no notice.
- **Q3.** Set `Standing.op` only when the piece is not `fxBehind`. Item 11 pins `front-unit` only. A behind-unit `blend: "add"` piece then draws normal, against Ruling 2.
- **Q6.** Take the lite half from the raw count, before the 48 cap. Item 14 uses one piece of 5 or 48, so before/after the cap is the same. Ruling 4 says half comes *after* the caps. Two pieces of 48 should stay 48 / 24 dots (the second is cut to 0, then halved); the plant yields 48 under lite.
- **Q8.** Drop tint looks on a squashed unit, but keep `hw:white`. Item 15a and the moved 33b-3 pin both use default white, so tint-on-squash is unpinned, against Ruling 5.

Fix: +6 in the shipped `effect-pieces.test.ts` (63 → 69, sha `64b3a0d5`). Diff `docs/qa/qa-runs/step-g2b/out/qfix.diff` (`4b821928`). Item 10 adds `"3.0"` (warns, plays 1); item 11 pins behind-unit `op: "add"`; item 14 pins two 48-count pieces under lite as 24 dots; item 15a pins a tint look `~hw:#ffb048` on the squashed sheet. With the fix the file still passes 6/6, and all four plants fail it.

## Checks
1. `sha256sum -c` on the push list: OK on 4/4 from `/workspace/tileengine`. The three shipped tests are byte-equal to the proto tree (`4fbfcada`, `89bf5711`, `f828a3a5`). The step doc is kit-only and matches `adc40a60`.
2. Green 718/0 (0 cancelled, skipped or todo). tsc, lint, deps, state and law all exit 0. Sims are identical: fixed 48/2 `afc89d56`, weighted 22/28 `b8007292`. Pixel-suite smoke and `run.ts` match the Base byte for byte once the Node PID warning is ignored. Stress counts match (A 27/0/0, B 113/0/0, C/E 181/0/0, L 27/373/0); L p95 is 1.17–1.26 ms (under 2 ms). fx-particles budget counts `132/36/90/1` as on the Base, p95 0.36–0.75 ms (under 4 ms). The do-not-touch diff is empty, including `tools/**` and `tests/perf/**`.
3. `s34a-equal.ts` (400-frame hashes): A `4b420795`, B `2550c65e`, L `8cfa8394` and the light raster `dca58548` are byte-equal to the G1 proto. C and E both move to `e37916cf` (same hash; both rigs squash and hit-white). The 60-frame perf-34a pin for C is the listed `b0e6cf14` (L stays `18d97599`).
4. Plants:
   - EA `sg2b-plants.py`: **17/17** caught. On the Base, items 10, 11, 13, 14 and 15a fail; seam 33 passes (it pins reachable Base bands; F1 is the proof).
   - QA plants: **5/8** caught (Q1, number 7 no longer clamps, only by the older 33b-3 pixel_scale test). **Q2, Q3, Q6, Q8 are missed → M1.** A ninth plant that moved only the light's x at k = 2 was a no-op on this sheet (the anchor is centred in x).
5. Build law: no new clock or rAF; UNIT/TILE pipes untouched; no scope creep (`world-scene.ts` is in the step's list for Ruling 5). Size is 108 = +90/−18 in 9 files, within 400 (plan ~290). Each file is within its cap under the step's lines-touched count. The paste has the §0.6 helpers rule and § Helpers & self-review.
6. Drift: the paste matches the step on the step sha, rulings, file table, interfaces, acceptance and pin moves. Code matches the stated line counts.

## Rulings
- **1. pixel_scale:** agree, with M1 Q2. Null, absent and `"match-sprite"` play 1 quietly and stay distinct; `"1"`–`"6"` are aliases; other strings warn and play 1. Numbers still go through the Base's round/clamp/flag (Q1 is caught by the older test).
- **2. Standing.op:** agree, with M1 Q3. `blend: "add"` reaches a front-unit piece and the draw list; no blend keeps no `op` key. Behind-unit needs the extra pin.
- **3. Light centre × scale:** agree. k = 1 keeps `mid()`; k = 2 and 3 sit at the scaled command centre. Particles still use `mid()`.
- **4. Spreads and lite half:** agree, with M1 Q6. Seeded jitter / start_spread / size_spread are clamped and flagged; `particleRead({})` is unchanged; keys are absent at 0 (Q4); lite is `ceil` (5 → 3, 48 → 24); pool 96 / 48 unchanged. Half-after-caps needs the two-piece pin.
- **5. Hit-white on squashed sprites (15a):** agree after the revert proof, with M1 Q8. Reverting only the two `world-scene.ts` lines and the look ternary in `draw-list.ts` (keeping `st.op ?? "normal"`) brings the 33b-3 pin back to `[true, false]` and the perf-34a C hash back to `da3c665e…49a35`. `s34a-equal` then matches the Base on A, B, C, E, L and the light raster (so C and E differed only by 15a). In the kit + 33b-3 counts + G1 tidy set, only the 15a title and those two moved pins fail. Tint-on-squash still needs the extra pin. Swaying sprites still skip looks, as ruled.
- **6. Particles in the piece's band:** agree. Ground → `fxGround`, overlay → `flash`, air and unit layers → `fxAir`. The `ui` branch maps to `flash` and is not reached; F1 is the proof that overlay must not fall back to `fxAir`.

## UX look list (items 11 and 15a)
Concrete enough to judge on a device: additive front-unit is lighter never darker, day and night; behind-unit brightens only where it shows; no dark outline halo; non-additive looks unchanged; squash+white lasts the whole white window in the squashed shape with feet on the ground; tint uses the same shape; no one-frame unsquashed white pop at either edge; swaying scenery unchanged. Nit N2: there is no named scene, effect or fixture to load, so UX still has to pick one.

## Nits
- N1: number clamp/flag for `pixel_scale: 7` is pinned only by the older 33b-3 test, not by the new item-10 list.
- N2: the UX look list has no named fixture (above).
