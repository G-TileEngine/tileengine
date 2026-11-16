# ED-E4 r3: **NOT OK TO SEND**, 1 small must-fix (QA 2026-11-16 19:58 London)

Head `9b3fc8d4` (`9b3fc8d4d61d1e35181314f4fa1ce55a17aee309`, tree `e2158f9f`), 5 commits on main `5d4c00fb`, all G-TileEngine noreply. My `84a5f159` (r2 fix-a) is an ancestor, unchanged. Bundle `/workspace/share/step-ed-e4-proto-r3.bundle` = `4a812ecf…` (matches EA), `git bundle verify` okay, needs `5d4c00fb`. Inputs copied to `qa-runs/effect-designer/e4/r3/in/`; logs in `…/r3/out/`, probes in `…/r3/probes/`. New refs (only these): `refs/cmp/ede4-qa-proto-r3` = `9b3fc8d4`, `ede4-qa-r3-fix-a` = `ea207da1`.

r2's M1 is closed, and S5 and S6 are fixed as ruled; the doc items are done. Gates are green, and all 108 tabled plants are real catches. One thing blocks OK TO SEND: **4 of my 8 new plants against S5/S6 are missed (G1)**. They are edge lines: 48 and −0 must give no line, the `Capped` value must be printed as given, and the meter must name a capped step. The fix is a test-only pin (11 lines, no src change). With it adopted as G6, the kit is **OK TO SEND**.

```
refs/cmp/ede4-qa-r3-fix-a     ea207da1b4855003c0e4848029839caccca7966f  (parent 9b3fc8d4; G-TileEngine noreply author+committer), tree 813d788d
file                          tests/editor/effect-e4-qa3.test.ts  11 lines (cap 37)  sha256 9d8a3058564c3add1f0dc97cbf3a5c15347961ef0618f406683cfc546202eb15
green                         832/0 (831 + 1); typecheck, lint, deps 113/363, state, law exit 0; smoke 0 failed; sim/stress SAME (r3/out/gates-ede4-qa-r3-fix-a.log)
merge onto main 5d4c00fb      main is still the Base (fetched 19:55), so the merge tree = the ref's tree 813d788d (r3 proto alone: e2158f9f)
bundle                        /workspace/share/ede4-qa-r3-fix-a.bundle  9b3fc8d4..refs/cmp/ede4-qa-r3-fix-a  sha256 3074aa7d7f2aa5f4590899e2b11c6c746e176281ef00bccb162519b14275590d  (verify okay)
size                          337 + 11 = 348 changed lines (150–400 band)
```

## r4: OK TO SEND (2026-11-16 20:02 London)
- Head `ea207da1` (tree `813d788d`, parent `9b3fc8d4`) is QA's own `refs/cmp/ede4-qa-r3-fix-a`, fast-forwarded with no other change. It was already gated PASS at 832/0 in r3.
- Bundle `/workspace/share/step-ed-e4-proto-r4.bundle` `8bcaa2ff` verifies; it needs `5d4c00fb`, and its one head is `proto/ede4-r4` = `ea207da1`.
- Kit list `aeacc267` passes 9/9. All 7 kit tests are byte-identical to the head (qa `03323745`, qa2 `e2385ec7`, qa3 `9d8a3058`).
- Doc `ab04fa80` (335 lines) has floor 832, ruling 16 recording the third G6, and a 116-row plants table. Paste `4b24f30a` (325 lines) equals the doc from `## Goal`.
- Main is still `5d4c00fb` (checked 20:01 London), so the merge tree is `813d788d`.

## r3 must-fix
- **M1 (G1): 4 S5/S6 edge plants are missed by all 6 shipped files** (`r3/out/classify-qa-r3new-shipped.log`). With `effect-e4-qa3`, 8/8 fail by assertion (`…-pin.log`); EA's 77 still all ASSERT with it present.

| # | Plant (QA, on the r3 code) | 6 shipped files | + qa3 |
|---|---|---|---|
| Q34 | S5: exactly 48 gets a `Capped count 48 → 48` line (`>=`) | **missed** | ASSERT |
| Q35 | S5: ceiling off by one (49 counts 49) | ASSERT | ASSERT |
| Q36 | S5: `Capped` value printed rounded (48.4 → "48"; the line format says `String(v)`) | **missed** | ASSERT |
| Q37 | S5: the meter shows no `Capped count` line (ruling 9 says it does) | **missed** | ASSERT |
| Q38 | S4: −0 counted bad (`Bad count 0 → 0`) | **missed** | ASSERT |
| Q39 | S6: Fit's lines read post-Fit counts (`Capped` lines lost) | ASSERT | ASSERT |
| Q40 | S6: Fit names disabled steps | ASSERT | ASSERT |
| Q41 | S5: the capped rewrite only when Fit scales | ASSERT | ASSERT |

  - **r4:** adopt `refs/cmp/ede4-qa-r3-fix-a` as G6, floor 831 → **832**, add the file to § Files (11, cap 37) and § Tests (test 27), and add Q34–Q41 to the plants table. That's 116 rows.

## r3 checks
| Item | Result |
|---|---|
| History | ✓ `04a02e1c` → `00f0bf75` → `67a44a99` → my `84a5f159` → `9b3fc8d4`. The M1 line is in `merge.ts` at the head. `effect-e4-qa` `03323745` and `effect-e4-qa2` `e2385ec7` are byte-identical. The r3 commit touches only `fit.ts` (+6/−3 vs r2), `merge.ts` (1 line), test 22 (1 line) and the new `effect-e4-r3` |
| Kit list `5f7b93ef` 8/8 | ✓ doc `14ef63fe` 322 lines, paste `1cf54fc9` 312, tests `a4b80528` `9d350f3c` `03323745` `367d2519` `e2385ec7` `077aafe5` (19 lines). All 6 are byte-identical to the proto |
| Paste body = doc | ✓ identical from `## Goal` (303 lines); the header names r3 and the doc sha |
| Gates at floor 831 (`r3/out/gates-ede4-qa-proto-r3.log`) | ✓ 831/0, typecheck/lint/state/law PASS, deps 113/363 (unchanged), smoke 0 failed, sim SAME. Stress read **DIFF** only because the gate's *main* run hit a timing flake: `stress-budget.ts` assert "E: p95 over 4 ms" while 4 gate runs were sharing the box (`r3/out/main.stress.log`). The ref has all 5 counts as the doc states. Two quiet re-runs of main both give 27/0/0 113/0/0 181/0/0 181/0/0 27/373/0 (`main-stress-rerun.log`); EA's proto-check also matches |
| Size 337 | ✓ +327/−10, per-file caps OK (EA proto-check, 8 files). No pin, runtime, sim, core, fx, tools or `parts.ts` change; the law grep is empty |
| S5 ceiling | ✓ `Math.min(PARTICLES.perEffect, …)`, **imported** from `fx-particles.ts`; there's no literal `48` in the src diff. That is the runtime's ceiling: `particleRead` does `clamp(particle_count, 0, PARTICLES.perEffect, PARTICLES.count)`. Two `Number.MAX_VALUE` → 48 + 48 → `Scaled 96 → 48`, counts 24/24; 1e308 and 49 cap; no NaN or Infinity anywhere (`r3/out/r3-probe.log`) |
| S6 | ✓ the lines come after the trims, use the what-plays filter and post-trim numbers, are in step order, and are unshifted before Fit's other lines. A capped step that a trim moves from 13 to 12 is named "step 12"; a disabled or 13+ step is not named. In a blend, the meter repeats nothing (Fit has already written 48, so the meter adds no second `Capped` line; `Bad` lines dedupe on equal numbers) |
| Test 22 `da5ab599` → `367d2519` | ✓ the one change is `Bad count` lines 3 → 2. The dropped line is exactly step 5 (`Infinity`, `enabled: false`), which S6's what-plays filter excludes. The meter-line and count assertions are unchanged, so nothing is weakened (plant 71 still ASSERT) |
| Doc | ✓ ruling 4 reworded (`""`, non-string, repeated ids); ruling 7 "never `NaN` or `Infinity`"; the report-only items ruled as they stand (2.5 stays 2.5; a string or `null` → 12); rev 25 "in the Librarian's behaviour library" at lines 17, 49 and 312; the plants table has 108 rows (EA 77 + QA 31); open questions resolved; Mix cites only the CEO's own answer, 19:09 London; CN-020 `a60aec99` on main |
| Plants | ✓ EA `ede4-plants-r3.py` (77 rows) **77/77 ASSERT** (`classify-ea-r3.log`). My r1 19/19 and r2 12/12 ASSERT. **EA's re-pointed Q30/Q31 are the same mutations:** Q30 still reverses Fit's count lines; Q31 drops the first-12 filter, now in the shared `badCounts`, so it hits the meter and Fit alike. Q31 is now the same mutation as EA 77. My r2 file is untouched |
| Report-only | (1) The editor counts a NaN or ±Infinity count as **0**, but the runtime reads it as **12** (`clamp` falls back to the default), and rounds 2.5 to 3, so the meter's "demand" differs from what plays on bad data. That's as ruled in r2/r3, and the `Bad count … → 0` line flags it. (2) Fit silently writes 48 into a disabled or 13+ step over the ceiling, and E1's scaling still counts disabled steps in the sum. Both are pre-existing, and no line is needed |

## r3 repro
```
cd /workspace/tileengine-repo; R=/workspace/tileengine/docs/qa/qa-runs/effect-designer/e4/r3
TMPDIR=/tmp/q6 /workspace/cos-tools/qa-gates.sh refs/cmp/ede4-qa-proto-r3 --floor 831
TMPDIR=/tmp/q6f /workspace/cos-tools/qa-gates.sh refs/cmp/ede4-qa-r3-fix-a --floor 832
T="tests/editor/effect-e4.test.ts tests/editor/effect-e4-carries.test.ts tests/editor/effect-e4-qa.test.ts tests/editor/effect-e4-r2.test.ts tests/editor/effect-e4-qa2.test.ts tests/editor/effect-e4-r3.test.ts"
(cd $R/wtP && python3 ../probes/plant-classify.py . ../in/ede4-plants-r3.py $T)          # 77 ASSERT
(cd $R/wtP && python3 ../probes/plant-classify.py . ../in/ea/ede4-qa-plants-r2.py $T)    # 19 ASSERT
(cd $R/wtP && python3 ../probes/plant-classify.py . ../in/ede4-qa2-plants-r3.py $T)      # 12 ASSERT
(cd $R/wtP && python3 ../probes/plant-classify.py . ../probes/qa-ede4-r3-plants.py $T)   # 4 PASS (missed), 4 ASSERT; + tests/editor/effect-e4-qa3.test.ts → 8 ASSERT
mkdir -p $R/wtP/tests/qa && cp $R/probes/r3-probe.ts $R/wtP/tests/qa/ && (cd $R/wtP && node tests/qa/r3-probe.ts)
```

---

## r2 review: **NOT OK TO SEND**, 1 must-fix (QA 2026-11-16 19:45 London)

Head `67a44a99` (`67a44a993660bb63ac9d8026442b9b3136bb6836`, tree `dfe7f3ed`), 3 commits on main `5d4c00fb`: r1 rebased `04a02e1c`, my pin `00f0bf75`, then the r2 fixes. All three are G-TileEngine noreply. Bundle `/workspace/share/step-ed-e4-proto-r2.bundle` = `e2c432a2…` (matches EA), `git bundle verify` okay, needs `5d4c00fb`. Inputs copied to `qa-runs/effect-designer/e4/r2/in/`; logs in `…/r2/out/`, probes in `…/r2/probes/`. New refs (only these): `refs/cmp/ede4-qa-proto-r2` = `67a44a99`, `ede4-qa-r2-fix-a` = `84a5f159`.

r1's M1 is closed, and S2, S3 and S4 are fixed as ruled. Gates are green. EA's 71 plants and my 19 r1 plants are all real catches. One thing blocks OK TO SEND: **S1's fix still loses the base hit moment when the hit's id is `""` or repeats an earlier step's id**, so rule 1 still fails. Five of my 10 live plants against the fixes are also missed. My ref fixes the bug and pins both (1 src line + 22 test lines). With it adopted, the kit is **OK TO SEND**.

```
refs/cmp/ede4-qa-r2-fix-a     84a5f159d76e61387c20ef108f1acacd4496001d  (parent 67a44a99; G-TileEngine noreply author+committer), tree 7fd9979b
files                         src/editor/effect/merge.ts  1 line (S1 condition; file sha256 cfb5bca6…, 77 lines, cap 81)
                              tests/editor/effect-e4-qa2.test.ts  22 lines (cap 37)  sha256 e2385ec763b8e18e31fc7238c0333f8a31572ffae3ac9ba3c0e18db6040fc29c
green                         829/0 (827 + 2); typecheck, lint, deps 113/363, state, law exit 0; smoke 0 failed; sim/stress SAME (r2/out/gates-ede4-qa-r2-fix-a.log)
merge onto main 5d4c00fb      main is still the Base, so the merge tree = the ref's tree 7fd9979b (r2 proto alone: dfe7f3ed)
bundle                        /workspace/share/ede4-qa-r2-fix-a.bundle  67a44a99..refs/cmp/ede4-qa-r2-fix-a  sha256 e38de80ad2ca9de80e65d8ce20f84f9947408a69c96089bf9320fcce67a3605a  (verify okay)
size                          293 + 23 = 316 changed lines (150–400 band)
```

## r2 must-fix
- **M1 (rule 1 / S1): an id that can't name the base hit still moves the hit.** S1 mints only when the hit's id is not a string (`typeof hs["id"] !== "string"`).
  - **id `""`:** `join` writes `connect_step: ""`, which `stepTimes` ignores, so the hit becomes the last of the first 12 joined steps: B's step. Base `[c 0.6 s, "" 0.3 s]` + B, pick `shape:hit: "b"`: hit 1318 ms instead of the base's 876 (`r2/out/ids-probe-proto.log`).
  - **A repeated id `x`:** `connect_step: "x"` resolves to the first `x`, so the hit moves to step 0 (552 instead of 876).
  - In both cases the step is still kept (by index), but the effect's one hit moment is no longer the base hit. Doc ruling 4 says "an id shared with another step can't lose it … the blended doc's hit is the base hit": that is drift. `""` ids are real data (E2 ruling 11, test 12).
  - **Fix (on my ref):** mint when the id is not a string, **or is `""`, or isn't the first step with that id**: `(typeof hs["id"] !== "string" || hs["id"] === "" || steps.findIndex((s) => s["id"] === hs["id"]) !== bh)`. Pinned by `effect-e4-qa2` test 1 (ids `""`, `7`, `"x"`); it fails on the proto for `""` and `"x"`.
- **G1, the same pin (test 2):** 5 of my 10 live plants against the fixes are missed by all 4 shipped files (`r2/out/classify-qa-r2new-shipped.log`). With `effect-e4-qa2`, 12/12 fail by assertion on the fixed tree (`…-fixa-pin.log`):

| # | Plant (QA, on the r2 code) | 4 shipped files | + qa2 |
|---|---|---|---|
| Q21 | S1: only an `undefined` id minted (a numeric id is not) | **missed** | ASSERT |
| Q22 | S1: minted id not named by `connect_step` | ASSERT | ASSERT |
| Q23 | S2: `Infinity` read as 100 (r1) | ASSERT | ASSERT |
| Q24 | S2: non-finite mix read as 0 | ASSERT | ASSERT |
| Q26 | S3: default grid 30 ms, not 1 | ASSERT | ASSERT |
| Q27 | S4: a zero count is bad (bogus `Bad count 0` line) | **missed** | ASSERT |
| Q28 | S4: a non-number count is bad (absent counts 0) | ASSERT | ASSERT |
| Q29 | S4: meter repeats Fit's `Bad count` lines (no dedupe) | **missed** | ASSERT |
| Q30 | S4: Fit's `Bad count` lines out of step order | **missed** | ASSERT |
| Q31 | S4: meter names steps 13+ | **missed** | ASSERT |
| Q32 / Q33 | S1: `""` / repeated hit id not minted (the M1 bug, on the fixed tree) | n/a | ASSERT |

  - Q25 (dropping the S2 clamp's 0 floor) is retired as equivalent, because `snapMix` already floors finite values at 0. So test 20's `-30` case pins nothing that `snapMix` doesn't.
  - **r3:** adopt `refs/cmp/ede4-qa-r2-fix-a` as G6 (or re-do the one line), floor 827 → **829**, and add the file to § Files (22, cap 37) and § Tests (23, 24). Re-word ruling 4 to name `""` and repeated ids, and add Q21–Q33 to the plants table.
  - **EA plant 61's needle must move:** on my ref it reads NEEDLE. Re-needled to the new condition (`r2/probes/ea61-fixa-needle.py`), it is ASSERT.

## r2 should-fix
- **S5: Fit's total can still be `NaN`.** Ruling 7 says "the total is never `NaN`", but two finite counts of `Number.MAX_VALUE` sum to `Infinity`. The result is `Scaled sparks Infinity → NaN to fit 48`, and `NaN` counts are written. It's absurd input, but the claim is absolute. Fix: treat a count above a ceiling (for example > 10⁶) as bad, or clamp each count before summing; or soften the wording.
- **S6: Fit's `Bad count` lines don't use the meter's "what plays" filter.** Fit names disabled steps and steps 13+, and numbers steps before its trims. In `blend` those lines go straight into the meter line:
  - a disabled bad step is named, which plant 71 forbids for the meter's own lines;
  - one probe named "step 14", a step that Fit then trimmed (bad steps weigh 0, so they're trimmed first; `r2/out/r2-probe.log`).
  - Fix: Fit reports only the bad steps it actually keeps, using "what plays" and post-trim numbers. Or rule that Fit names every stored step.

## r2 checks
| Item | Result |
|---|---|
| Main and base | ✓ main is still `5d4c00fb` (fetched 19:40). It's docs only on `3a7a1bb6`: CN-020 `7b1970d2`, CN-026 `433cb84`, the ED-E3 QA docs. CN-020 on main is `a60aec99`, ACCEPTED |
| Rebase is faithful | ✓ patch-id `04a02e1c` = r1 `2013db05` (`db81eac6`); `00f0bf75` = my `8e5c8341` (`3cf1e093`); `effect-e4-qa` byte-identical `03323745` at both commits |
| Kit list `10987138` 6/6 | ✓ doc `db2c5352` 292 lines, `effect-e4` `a4b80528`, carries `9d350f3c`, `effect-e4-qa` `03323745`, `effect-e4-r2` `da5ab599` (35), paste `01abedfe` 282; the 4 tests are byte-identical to the proto. **The list does not include the catalogue.** "6 new files incl. catalogue rev 25" isn't right; see the catalogue row |
| Paste body = doc | ✓ identical from `## Goal` on (273 lines); the header names r2, the Base `5d4c00fb` and the doc sha |
| Gates at floor 827 (`r2/out/gates-ede4-qa-proto-r2.log`) | ✓ 827/0, typecheck/lint/state/law PASS, deps **113 modules / 363**, smoke 0 failed, sim/stress SAME |
| Size 293 | ✓ +283/−10 (src 107: merge 77/81, fit 30/34; tests 186). Band 150–400 |
| S3 build law / export audit | ✓ exactly 2 new edges, `merge.ts → runtime/render/feel.ts` and `→ fx-light.ts`. Both modules were already in the graph (113 modules unchanged); `feel.ts` imports `frames`/types, `fx-light.ts` types only. No `.dependency-cruiser.cjs`, pin or `src/runtime` change; nothing in `src/runtime|sim|core|fx` imports `src/editor` (rg empty), so no editor code reaches the runtime. The law grep on the src diff is empty |
| S1 | ✗ see M1. An id-less hit is fixed: minted after `join`'s ids, input not mutated, Swap works |
| S2 | ✓ NaN/±Infinity → 50; finite clamped. Snap boundaries 12.4 → 0, 12.5 → 25, 37.5 → 50, 87.5 → 100, −0 → 0, ±1e308 → 100/0. `join` and the seed get the same `m` (blend(150) and flatten(150) give the same seed). Infinity was 100 in r1 and is now 50, as ruled |
| S3 | ✓ `stop` = runtime `stopMs` (grid default 1, flashes 50, reduce none, stepMs 0/NaN/−30 → 1), `white` = runtime `hitWhiteMs` (40 floor, 200 max). A string, 0, −0 or Infinity gives null. The white end can be fractional (150.1 → +150.1), as the runtime plays it |
| S4 | ✓ meter and Fit as ruled for NaN/±Infinity/negative (incl. −1e-9); −0 and 0 are good. Edges in S5/S6. Report-only: 2.5 counts 2.5; a string `"10"` or `null` counts 12 silently (E1's "absent" rule) |
| Ruling 15 | ✓ "≤ 5 beat spans: the 4 named beats plus an unknown one". Strictly it's one span per distinct unknown beat, but each one needs its own one-beat part, so it stays bounded by the input |
| Catalogue rev 25 | ✓ sane: `lib-catalogue-pass.sh` on a /tmp copy gives rev 25, 63 behaviours, 565 knobs, validate 0 errors/0 warnings, dry rebuild byte-identical (json, CATALOGUE, README), breaktest25 0 failures, knobs at rev 25 `effect.steps/parts/variant_seed`, `behaviours.json` `87836060`; SCHEMA "Rev 25" and gaps §31 present. It lives in `/workspace/tileengine/behaviour-library` (not in the repo or the kit). Doc line 17 "stays in the kit" should say "in the Librarian's library on the box" |
| Open questions / CEO cite | ✓ Q1 reads "the CEO's own answer in Chief Of Staff's chat, 19:09 London"; no agent relay is cited as approval; Q2 and Q3 are resolved. CoS's transcript records "CEO answer (19:09 London, in my chat): 'Yes, keep blend in E4'", right after its question to him; his message itself isn't readable to me (likely a card answer). It's a scope call, not a publish OK, so that's enough |
| Plants: EA 71 (`ede4-plants-r2.py` `fc9b30fe`) | ✓ plant-classify **71/71 ASSERT** with the 4 shipped files (`r2/out/classify-ea-r2.log`). The re-pointed needles 23/24/31/34 are the same mutations; 27 is re-defined (now "white not the runtime's") and 28 "white from stop", both fair. On my ref: 70 + 61 NEEDLE → ASSERT re-needled |
| Plants: QA r1 19 (EA's re-needled `65908dde`) | ✓ 19/19 ASSERT, and 19/19 with `effect-e4-qa` alone. **Re-pointed Q16–Q18 are the same mutations:** Q16 `ms >= 0` = a window at 0 ms; Q17 Infinity → 150 on `stop` (my pin reads `.stop` only); Q18 truncates before `stopMs` (50.6 → 50, so the pin's `[276, 327]` fails). Only the header and those 3 rows differ from my file |
| §0.6 HANDBACK helpers | ✓ Working style line 13 (REQUIRED) and the Acceptance line |

## What r3 needs
1. M1: the S1 condition (1 line) plus `effect-e4-qa2` as G6, floor 829, § Files/§ Tests, ruling 4 wording, Q21–Q33 and EA 61's new needle.
2. S5 and S6: fix or rule.
3. Doc: line 17 catalogue location; the kit-list wording.

No open questions for the CEO. For EA: S5's ceiling, and S6's choice.

## r2 repro
```
cd /workspace/tileengine-repo; R=/workspace/tileengine/docs/qa/qa-runs/effect-designer/e4/r2
TMPDIR=/tmp/q5 /workspace/cos-tools/qa-gates.sh refs/cmp/ede4-qa-proto-r2 --floor 827
TMPDIR=/tmp/q5f /workspace/cos-tools/qa-gates.sh refs/cmp/ede4-qa-r2-fix-a --floor 829
T="tests/editor/effect-e4.test.ts tests/editor/effect-e4-carries.test.ts tests/editor/effect-e4-qa.test.ts tests/editor/effect-e4-r2.test.ts"
(cd $R/wtP && python3 ../probes/plant-classify.py . ../in/ea/ede4-plants-r2.py $T)              # 71 ASSERT
(cd $R/wtP && python3 ../probes/plant-classify.py . ../in/ea/ede4-qa-plants-r2.py $T)           # 19 ASSERT
(cd $R/wtP && python3 ../probes/plant-classify.py . ../probes/qa-ede4-r2-plants.py $T)          # 5 PASS (missed), 5 ASSERT
(cd $R/wtF && python3 ../probes/plant-classify.py . ../probes/qa-ede4-r2-plants-fixa.py $T tests/editor/effect-e4-qa2.test.ts)   # 12 ASSERT
mkdir -p $R/wtP/tests/qa && cp $R/probes/r2-probe.ts $R/wtP/tests/qa/ && (cd $R/wtP && node tests/qa/r2-probe.ts)
TMPDIR=/tmp/q5c /workspace/cos-tools/lib-catalogue-pass.sh --lib /workspace/tileengine/behaviour-library   # dry, RESULT PASS rev 25
```

---

## r1 review (blend core): **NOT OK TO SEND**, 1 must-fix (QA 2026-11-16 19:25 London)

Proto head `2013db05` (`2013db056f3754efd60f428a66741c80ee3c3ef3`, tree `8c378a86`), 1 commit on `3a7a1bb6`, G-TileEngine noreply author and committer. Bundle `/workspace/share/step-ed-e4-proto-r1.bundle` = `1b815281…` (matches EA), `git bundle verify` okay, one head `refs/heads/proto/ede4-r1` = the claimed tip. Inputs copied to `qa-runs/effect-designer/e4/in/`; logs in `…/e4/out/`, probes in `…/e4/probes/`. New refs (only these): `refs/cmp/ede4-qa-proto` = `2013db05`, `ede4-qa-fix-a` = `8e5c8341`, `ede4-qa-merge-fix-a` = `4c7fff07`.

The code is sound and matches the rulings: gates are green, EA's 59 plants are all real catches, the example numbers reproduce, and nothing outside `src/editor/effect/` moved. One thing blocks OK TO SEND. **19 of my 19 live QA plants are missed by the shipped tests (and by the whole 115-file suite).** The fix is my pin (test only, no src change). With it adopted as G6 in r2, plus the doc refresh below, the kit is **OK TO SEND**.

```
refs/cmp/ede4-qa-fix-a        8e5c8341f3b71eedb2d1b708f9c636a1e0c2a64a  (parent 2013db05; G-TileEngine noreply author+committer), tree 84aa16f5
file                          tests/editor/effect-e4-qa.test.ts  35 lines (cap 37)  sha256 03323745d9eca7669f1df3128b04abda3f0d9f8ec410d8729db6c7aefebbfad3
green                         823/0 (819 + 4); typecheck, lint, deps 113/361, state, law exit 0; smoke 0 failed; sim/stress SAME (out/gates-ede4-qa-fix-a.log)
merge onto main 7b1970d2      tree ec02d175 (clean); probe commit refs/cmp/ede4-qa-merge-fix-a 4c7fff07: same gates, 823/0, all PASS
bundle                        /workspace/share/ede4-qa-fix-a.bundle  2013db05..refs/cmp/ede4-qa-fix-a  sha256 64eac7ddea41ea9862535b58b0f3aee2c35faf1e02401c88085f49dfeead31d0  (verify okay)
size                          213 + 35 = 248 changed lines (150–400 band)
```

## Must-fix
- **M1 (G1): 19 QA plants are missed. The fix is my pin `effect-e4-qa` (35 lines, 4 tests, test only).** Each plant below passes `effect-e4` + `effect-e4-carries` (`out/classify-qa-shipped.log`) and the full suite minus the two node_modules-only files (`out/classify-qa-fullsuite.log`, 113 files: 19/19 PASS). With the pin, all 19 fail by assertion (`out/classify-qa-pin.log`, 19/19 ASSERT); EA's 59 still all ASSERT with the pin present (`out/classify-ea-pin.log`).
  - **r2:** adopt it as G6, floor 819 → **823**, add the file to § Files (35, cap 37) and § Tests (tests 15–18), and add Q1–Q19 to the plants table. EA may fold the checks into the shipped files instead, but then the shipped shas move.

| # | Plant (QA, needle on the proto) | Why it matters | Pin test |
|---|---|---|---|
| Q1 | punch cap fires at exactly the cap (`>=`) | 150/200/3 would print a bogus `Capped … 150 → 150` | 15 |
| Q2 | cap off by one (`> cap + 1`) | 151 ms hit-stop ships uncapped | 15 |
| Q3 | `a`/`b`/`mix` picks skip the cap | ruling 7 caps every pick; only `both` is tested | 15 |
| Q4 | `both` max with `NaN` (`typeof` only) | `NaN` would win `Math.max` and wipe the knob | 15 |
| Q5 | Swap reads `a`/`b` as base/other (knobs) | `"a"` must mean card A even when `base: "b"` | 15 |
| Q6 | Swap reads `a`/`b` as base/other (`squash`) | same, for `squash` | 15 |
| Q7 | `both` squash with no `true` drops the base's `false` | ruling 7: "else the base's" | 15 |
| Q8 | Mix: `hold_ms`/`fade_out_ms` not rounded | ruling 6: every `*_ms` whole | 16 |
| Q9 | Mix: one-sided scale value lerped (writes `NaN`) | ruling 6: only values both sides have | 16 |
| Q10 | Mix moves the base hit, other side not re-anchored | ruling 4: "picks **or Mix** move the base hit" | 16 |
| Q11 | `shiftOther` loses the 20000 clamp | ruling 4: clamped 0…20000; only 0 is tested | 16 |
| Q12 | blend drops a base part with no step | ruling 5: "the base's own parts are all kept" | 17 |
| Q13 | blend's meter ignores `preset` | meter cap must be 32 for a preset | 17 |
| Q14 | meter draws count disabled non-particle steps | ruling 9: "what plays" | 17 |
| Q15 | meter lights count disabled steps | same | 17 |
| Q16 | marks: `0` ms gives a `[hit, hit]` window | ruling 10: "> 0, else null" | 18 |
| Q17 | marks: `Infinity` gives a capped window | ruling 10: "finite"; the runtime plays none (`stopMs`/`hitWhiteMs` → 0) | 18 |
| Q18 | marks: fractional ms truncated | ruling 10: `round(v)` | 18 |
| Q19 | marks: steps 13+ spanned | ruling 10: "among the first 12" | 18 |

Q20 (base hit kept only when its key is not `mix`) is retired as equivalent: a `mix` key keeps every base-side step anyway.

## Should-fix (r2, or a ruling)
- **S1: the base hit step is dropped by a pick when it has no string id.** Rule 1 says "never dropped by a pick", but `keep` tests `s["id"] === hitId`, and `join` only sets `connect_step` when the hit has a string id. Probe (`out/risky-probe.log`): base `[c, (no id)]`, pick `shape:hit: "b"` → `["c","s-1","s-2"]`; the base's hit step is gone. The kit's own meter and marks tests use id-less steps, so they're legal data. Fix: keep by index (`i === stepTimes(base.doc).hitIndex`), or rule that the editor always gives steps ids.
- **S2: a non-finite `mix` writes `NaN`.** `snapMix(NaN)` is `NaN`, so `t` is `NaN`: in a `mix` key `particle_count` and `particle_life_ms` become `NaN`, and `punch:hit: "mix"` writes `hit_stop_ms: NaN` (JSON saves `null`). `Infinity` and `-10` snap fine. Fix in `blend` (`parts.ts` is do-not-touch): a non-finite `mix` → 50 (or 0), stated in ruling 6.
- **S3: the hit-white window doesn't use the converter's timing (doc/code drift, ruling 10 and Goal 4).** The runtime plays `hitWhiteMs` = clamp(v, **40**, 200); the marks use min(200, round(v)). `hit_white_ms: 10` → marks `[276, 286]`, runtime 40 ms; 39 → 39 vs 40. The hit-stop window is also only the knob (the runtime snaps it to `stepMs` and caps at 50 with flashes on). Either import `hitWhiteMs` (one more render value import, deps 361 → 362) or reword ruling 10: "the knob clamped to its cap; the host applies the runtime's floor and grid".
- **S4: the meter shows a non-finite or negative `particle_count` as is.** `meter` gives `NaN`, `Infinity`, `-4` or `2.5` sparks/draws. E1's Fit has the same hole (a `NaN` sum skips scaling; an `Infinity` sum writes `NaN` counts). `countOf` is "unchanged body" by ruling 1, so either guard it (non-finite → 12, floor, ≥ 0) and re-rule, or carry it to E5's writer with a note.

## Report only
- **Picks `a`/`b` pass any value through.** `Infinity`, `NaN`, `"200"` and `-5` are written raw and uncapped. This matches ruling 7 ("that card's value exactly"; "a finite value over its cap"). The runtime already handles them (`stopMs` → 0, `shakePx` notes `outOfRange`). `both` with both sides `Infinity` keeps the base's `Infinity`. It's fine as ruled, but the CEO never sees a `Capped` line for these.
- **Unknown part beats leak into keys and marks.** A part with `beats: ["boom"]` (kept per CN-020 rule 4) gives the key `sparks:boom` and a fifth `beats.boom` span. Ruling 15 says "≤ 4 beat spans"; the real bound is the part count. Suggest rewording that, or mapping unknown beats to `pos`.
- **Perf.** `rank`/`mate` are O(n²) per step. A 40 + 12 step blend with 3 mix keys takes 1.13 ms on the box. That's editor-only and once per edit, so it's fine (EA's 12-step p95 0.32 ms).
- **Plant 35, judged: retired as equivalent, accepted.** It would need a moved step with the base hit's id, but `join` mints every moved id, and CN-020's accepted note now says reusing an id is a writer bug.

## Doc vs code drift
- **D1: § Prerequisites, § CN questions and Open Q2 are stale.** CN-020 is now **ACCEPTED on main** `7b1970d2` ("docs: CN-020 effect parts format + RESERVED (CEO SEND)", 19:12 London). That file is `a60aec99`; rules 1–7 are unchanged from `9a73b99c`, and both of EA's notes are folded in. That merge blocker is cleared. Base `3a7a1bb6` can stay: the proto merges onto `7b1970d2` clean (tree `c3a68da2`).
- **D2:** S3 (ruling 10 "same timing the converter uses").
- **D3:** "≤ 4 beat spans" (report-only item above).
- Everything else checked matches: the example (meter 47/48, 52/60, 0/2, 7/12 and the line; Mix 75 → `a3` 33 sparks, life 900, 0.52 s, `ice`, parts `pa ps`; `out/example-probe.log`), the deps 113/361, src 97 / tests 116, and the per-file lines.

## Merge blockers (not builder blockers)
- CN-020 ACCEPTED: **done** (see D1).
- **Librarian catalogue rev 25 (L50, L51, L52): still missing.** `behaviours.json` is `catalogue_rev` 24 and only `_src/staging/L52-ride.json` is staged.
- **The CEO question on keeping `mix` (Open Q1) is pending via CoS.** If the answer is no, drop the `mix` pick, rows 31–43/57 and Q8–Q10, and re-gate.

## Checklist
| Item | Result |
|---|---|
| Bundle `1b815281`, head/tree/parent, noreply | ✓ all match; 1 commit; `3a7a1bb6` = main's ED-E3 merge-time doc on `b28192c7` (descends from it). Main has since moved to `7b1970d2` (docs only) |
| Kit list `804c0601` 4/4 | ✓ `sha256sum -c` OK in `/workspace/share/step-ed-e4/tree`; EA's scratch list is byte-identical. Doc `efd8af73` 240 lines, paste `ff46a614` 231, `effect-e4` `a4b80528` 71, `effect-e4-carries` `9d350f3c` 45 |
| Shipped tests byte-identical to the proto | ✓ both shas match `git show` on `2013db05`. None of the 4 kit paths exist on main |
| Paste body equals doc | ✓ from `## Goal` on, identical (222 lines); the header carries Base, Delivery, Working style, shipped files, floor |
| Gates at floor 819 (`out/gates-ede4-qa-proto.log`) | ✓ 819/0, typecheck/lint/deps 113/361/state/law PASS, smoke 0 failed, sim `afc89d56`/`b8007292` SAME, stress SAME |
| Size 213 (4 files) | ✓ +204/−9: merge.ts 71/75, fit.ts 26/30, effect-e4 71/71, carries 45/45. Band 150–400 |
| Pins and do-not-touch | ✓ empty diff for the 5 pins, `src/runtime`, `src/sim`, `src/core`, `src/fx`, `src/types`, `parts.ts`, `tools/`, `scripts/` |
| Build law | ✓ the src diff law grep is empty (no Math.random/Date/timers/rAF/performance/Card/Deck/hp/mana/cost/chess). One clock: nothing reads time; marks are data. UNIT/TILE pipes untouched (editor only). No new entry or pack, no deps rule change. Law 13: `blend` ≤ base + 12 moved steps, one badge per key, fixed-size meter/marks records, no cache. No scope creep (no UI, no format, no runtime) |
| §0.6 HANDBACK helpers | ✓ Working style (line 13, REQUIRED, REJECT if missing) and Acceptance line 206. Suggest naming punch caps on every pick and Mix re-anchor as helper focus, since my plants landed there |
| EA plants 59/59 (`ede4-plants.py` `4372c042`) | ✓ `qa-plants.sh --plants-file` and plant-classify **59/59 ASSERT**, no LOAD/ERROR (`out/classify-ea.log`) |
| QA plants (`probes/qa-ede4-plants.py` `d61370b1`) | ✗ 19/19 missed by the shipped tests → M1; 19/19 ASSERT with the pin |
| E2 carry: flatten `""` delete pin | ✓ present (test 12, ruling 12); plant 58 (the E2 r4 bug, two needles) ASSERT |
| connect_step pin (carry e) | ✓ test 10; plants 9, 10 ASSERT |
| Fit keeps one hit moment (ruling 7) | ✓ test 11; plants 11–14 ASSERT. Blend's own re-anchor after Mix had no test → Q10 |

## What r2 needs
1. M1: adopt `effect-e4-qa` (G6), floor 823, § Files / § Tests / plants table Q1–Q19.
2. S1–S4: fix or rule each (S1 and S2 are a line each in `merge.ts`).
3. D1: refresh § Prerequisites, § CN questions and Open Q2 for CN-020 ACCEPTED on `7b1970d2` (`a60aec99`). D3 wording.

## Open questions
- **CEO (pending via CoS):** keep the `mix` pick in E4? Nothing in this review depends on the answer, apart from the scope cut above.
- **EA:** for S3, import `hitWhiteMs` or reword? For S1, are id-less steps possible in editor docs? For S4, guard now or carry to E5?

## Repro
```
cd /workspace/tileengine-repo; E=/workspace/tileengine/docs/qa/qa-runs/effect-designer/e4
TMPDIR=/tmp/q4 /workspace/cos-tools/qa-gates.sh refs/cmp/ede4-qa-proto --floor 819
TMPDIR=/tmp/q4f /workspace/cos-tools/qa-gates.sh refs/cmp/ede4-qa-fix-a --floor 823          # and refs/cmp/ede4-qa-merge-fix-a
TMPDIR=/tmp/q4p /workspace/cos-tools/qa-plants.sh refs/cmp/ede4-qa-proto --plants-file $E/in/ea/ede4-plants.py --plants-tests "tests/editor/effect-e4.test.ts tests/editor/effect-e4-carries.test.ts"
T="tests/editor/effect-e4.test.ts tests/editor/effect-e4-carries.test.ts"
(cd $E/wtP && python3 ../probes/plant-classify.py . ../in/ea/ede4-plants.py $T)                 # 59 ASSERT
(cd $E/wtP && python3 ../probes/plant-classify.py . ../probes/qa-ede4-plants.py $T)             # 19 PASS (missed)
cp $E/probes/qa-test/tests/editor/effect-e4-qa.test.ts $E/wtP/tests/editor/ && (cd $E/wtP && python3 ../probes/plant-classify.py . ../probes/qa-ede4-plants.py $T tests/editor/effect-e4-qa.test.ts)   # 19 ASSERT
mkdir -p $E/wtP/tests/qa && cp $E/probes/risky-probe.ts $E/wtP/tests/qa/ && (cd $E/wtP && node tests/qa/risky-probe.ts)
```
