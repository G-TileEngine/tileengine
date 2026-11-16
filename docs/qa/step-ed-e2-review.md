# ED-E2 r4: OK TO SEND (QA 2026-11-16 12:08 London)

Head cf4c1fda (tree a8941742, parent r3 9e6e5a08) = QA's refs/cmp/ede2-qa-r3-fix-a, which carries no code change beyond QA's. Bundle step-ed-e2-proto-r4.bundle 0e21cff3 has that head. List /workspace/share/ede2/push-sha256.txt 8b877347 hash-checks 6/6. Step doc 71fd3d15 (234 lines). Paste acc574b9 has a body identical to the doc. The 4 test files are byte-identical to the head: fx-path 429cb2ce, fx-travel fa049e53, fx-travel-qa c55dd3ec, fx-travel-qa2 dff0ae27 (G6). Gates on the head (QA r3 run): 784/0, all pass, EA plants 41/41, QA plants 25/25, 206 lines.

M1 fixed: CN-026 60e08878, both copies identical; L52 dff693a6; the "One difference" paragraph replaced. M2 and M3 are in. Should-fixes done: caps 53 and 12, the QA tally reworded.

Merge condition: DSK must confirm in its own message that the CN-026 ACCEPTED line (DSK 11:59) is its own. QA asked DSK at 12:08. MET: at 12:06 London DSK confirmed in its own message that it wrote the acceptance at 11:59 and accepts 60e08878 in its own name. It is keeping the r3 cite so the sha doesn't move.

Report-only: the CN cites the step doc at r3 63d8393d, while r4 is 71fd3d15; the rules match. Open question 1 (ship or drop ride) is the CEO's call, not a QA gate.

# Step ED-E2 kit review (Effect Designer E2: travel paths, ride)

QA & Build Guard · 2026-11-16 12:15 Europe/London (GMT). **r3 is the full pass** (proto `9e6e5a08`). The r1 findings are kept below. Inputs are copied to `qa-runs/effect-designer/e2/r3/in/`, logs are in `…/r3/out/`, and probes are in `…/r3/probes/`. New refs (only these): `refs/cmp/ede2-qa-proto-r3` = `9e6e5a08` and `refs/cmp/ede2-qa-r3-fix-a` = `cf4c1fda`. No GitHub writes and no EA file edited.

## r3 verdict: **NOT OK**, with 3 small must-fixes. Fix ref `refs/cmp/ede2-qa-r3-fix-a` = `cf4c1fda926491c5a28b530dc2caead23eb58659`

The product and tests are sound. Gates are green, EA's 41 plants are caught by real assertions, and QA catches 22 of 24 live plants. The three must-fixes are: (M1) the CN-026 and L52 pins in the doc are stale, and the CN's ACCEPTED line is not DSK's; (M2) an empty `ride` can bind to a step whose id is `""`, which breaks CN-026 rule 3; (M3) two QA plants are missed. M2 and M3 are fixed on the fix ref with a 1-line src change and an 18-line QA test, so r4 = the fix ref's 2 files + M1's doc edits. After that the kit is **OK TO SEND, on condition that DSK itself ACCEPTS CN-026** before merge.

```
refs/cmp/ede2-qa-r3-fix-a  cf4c1fda926491c5a28b530dc2caead23eb58659  (parent 9e6e5a08, noreply author+committer), tree a8941742
src                        src/runtime/render/fx-doc.ts  +1/-1  (typeof ride === "string" && ride !== "")
file                       tests/runtime/render/fx-travel-qa2.test.ts  18 lines (cap 37)  sha256 dff0ae27ce351075d1f7d6bb854a75a1ef531ac476eb5e19bd844fe906cb6083
green                      784/0 (781 + 3); every gate PASS; smoke/sim/stress SAME as main (out/gates-fix.log)
plants on the fix ref      EA 41/41, QA 25/25 (Q26 = the M2 guard), all by assertion
size                       188 + 18 = 206 changed lines (< 400); fx-doc stays 8 lines (cap 11)
```

## r3: EA's claims, checked
| Claim | Result |
|---|---|
| List `d6483d7f`, 5 files | ✓ `sha256sum -c` 5/5. Step doc `63d8393d` (225 lines), `fx-path` `429cb2ce` (41), `fx-travel` `fa049e53` (49), `fx-travel-qa` `c55dd3ec` (26), paste `a12ea46b` (220) |
| Bundle `53adb5ab`, head `9e6e5a08`, tree `5ffbae70`, parent `77552a38`, noreply | ✓ bundle and pack OK, 1 commit, noreply. merge-tree onto main is clean with the same tree. The 3 tests in the proto are byte-identical to the list (`out/headcheck.log`; its paste `FAIL` is the usual tool artefact, since the paste is not a proto file) |
| 188 lines / 400 | ✓ 8 files, +182/−6. src 72 (50, 8, 7, 3, 4), tests 116 (41, 49, 26) |
| Gates | ✓ 781 pass, 0 fail (floor 781). npm ci, typecheck, lint, deps (111 modules / 355 deps), state and law all exit 0. `smoke: 0 failed`; sims 48/2 `afc89d56` and 22/28 `b8007292`; stress 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0. All SAME as main. Pins have an empty diff (`out/gates-proto.log`) |
| EA plants 41/41 (`ede2-plants.py` `0169b6ed`) | ✓ 41/41 through `qa-plants.sh`, and **41/41 fail by assertion** (`out/plant-classify.log`) |
| Paste and names | ✓ the paste body from `## Goal` on equals the doc. The 14 test names match the 3 files in order (1–6, 7–11, 12–14) |
| Helpers and scope | ✓ the § Helpers & self-review block (line 13) and the Gates line (188) are present. There is no Travel beat, trails, lock, pierce, split, smear or UI. Law grep on the src diff: 0 hits. Do-not-touch paths are empty |

## r3 rulings, against code and CN-026 (current file `8ca33a8a`)
- **CN-026 rules 1–9 match ruling 10/11/15/16 and the code**, except M2. Checked: first id; enabled travel in the first 12; one hop (ruling 15; probe: C rides B → B's own path); only particles, stamp and circle flash read `ride`, a screen flash ignores it with no note, and other kinds ignore it with no note while the key is kept; non-string or `null` → H2 `invalidValue` (probe: `5` and `null` → `invalidValue`); empty, missing, self, non-travel, disabled or past-12 → `unknownRef`, the value is kept and the rider plays at its anchor (probe: past-12 → `unknownRef steps[11].ride`); a disabled rider plays nothing with no note; flatten re-points the ride or deletes the key (never `null`).
- **F4a fallback:** doc ruling 10, CN rule 3 and the code agree. A rider of a disabled travel step gets `unknownRef` and plays at its anchor (probe). It is pinned by test 8 (`hop.fx.pieces[3]`), EA plant 38 and QA Q17.
- **Straight self-ride "ignored, no note":** this is ruled in ruling 16 and CN rule 1b ("a travel step that names itself … keeps its own path"). It is pinned by test 13 and test 8's orbit, and caught by the new Q24. It is **consistent**: `unknownRef` is a rider-only note, and every non-rider kind ignores `ride` silently. Report only: an author gets no feedback for a ride on a non-rider (a CN design choice; the E7 UI can grey it out).
- **Q14 retired: confirmed.** `PATH.riders` ∩ `PATH.kinds` = ∅ (probe), so `paths[i]` is always null for a step whose ride is read. `paths[i] ?? …` is an equivalent mutant (PASS, not a miss). The doc already retires it with this reason (§ How a planted bug is caught).
- **Unchanged since r1:** absent = main byte-for-byte (the r1 probe rerun on r3). Hit unchanged: `hitOffsetMs` 442 and 868 = main; `fx:hit` 450 with and without `path`. Hold until 900 ms. 30 ms grid (60 ms in lite). Lite turn `n4`. Tile scale follows `tileW`/`tileH`. Law 13 caps: hops ≤ 8, dots 2…32 (`out/e2-behaviour-r3.log`).
- **Ruling 3 and the Example:** the hit wording is qualified, and the Example sets `connect_step: "a"`. F5 is closed.

## r3 must-fixes
**M1. The CN-026 and L52 pins are stale, and the ACCEPTED line is not DSK's.** The doc (header, § CN-026 / L52) and the plants file header pin CN-026 **`d9037136` PROPOSED** and L52 **`8def7ce5`**. On disk (both `handoff/change-notices/` and `data/staging/`) the CN is now **`8ca33a8a`**, modified 11:51:26, and its Status line reads `**ACCEPTED** (EA 2026-11-16 11:51, on 9d879255)`. L52 is now **`dff693a6`** (11:50:49). No file with sha `d9037136` exists anywhere under `/workspace/tileengine`, share or scratch-ea. `9d879255` matches no file and no git object. The only backup is `…T1145.bak.md` = `49e1a91b` (r2's PROPOSED). The CN's rules text matches r3. **But** the doc says "CN acceptance is DSK's", and an acceptance credited to "EA" does not meet the merge condition. L52 has also changed its Fit rule to `unknownRef` (citing CN-026 rule 5), so the doc's "**One difference with CN-026** … L52 says a Fit-dropped named step falls back silently" paragraph is now wrong. Repro: `sha256sum /workspace/tileengine/handoff/change-notices/CN-026-effect-step-ride.md /workspace/tileengine/behaviour-library/_src/staging/L52-ride.json`; `sed -n 3p` of the CN; `grep -n "One difference" handoff/steps/step-ed-e2-travel-paths.md`. **Fix:** re-pin both shas in the doc (and the plants header), drop or rewrite the "One difference" paragraph, and have DSK confirm the acceptance in its own name (or set the CN back to PROPOSED). The merge condition stays: **CN-026 ACCEPTED by DSK.**

**M2. An empty `ride` binds to a step whose id is `""`. This breaks CN-026 rule 3 and ruling 10 ("an empty string … gives `unknownRef`").** `k = typeof ride === "string" ? steps.findIndex((o) => o["id"] === ride) : -1` does not exclude `""`. The house rule for `connect_step` (`fx-doc.ts:31`) does: `named !== ""`. Repro (`probes/e2-behaviour-r3.ts`): `docToLiveFx({ steps: [{ id: "", kind: "straight", seconds: 0.6 }, { kind: "stamp", ride: "" }] }, host)` → the rider gets the straight path and `notes` is `[]`, where the rules say `unknownRef steps[1].ride` and the anchor. Test 8's `ride: ""` passes only because no step has id `""`. **Fix (1 line, on the fix ref):** `typeof ride === "string" && ride !== ""`. Pinned by the qa2 test 3 and caught as Q26.

**M3. Two QA plants are missed (G1), both fixed by the qa2 pin (G6, ≤ 37 lines).**
| # | Plant | Pin in `fx-travel-qa2.test.ts` |
|---|---|---|
| Q21 | `ride` resolves to the **last** step with the id (ruling 10 / CN rule 1: first) | duplicate id `a`: the first is a stamp → `unknownRef`; the first is a straight → its path, not the later orbit's |
| Q23 | a non-string `ride` on a non-rider kind gets `invalidValue` (ruling 16: ignored, no note) | `dim` with `7`, straight with `null`, screen flash with `5`, orbit with `{}` → `notes` `[]`, and travel steps keep their own path |

With the pin, the floor becomes **784** (781 + 3), and the kit list gains one shipped file. EA's G6 adoption is needed.

## r3 should-fix
- **S1, file caps:** `fx-travel.test.ts` has cap 49 = proto 49 (STEP-TEMPLATE: proto + 4 = 53). `fx-doc.ts` has cap 11 for proto 8 (12 by the rule).
- **S2, QA tally lines in the doc:** say "QA 19/19 live + Q14 retired (equivalent mutant)" rather than "19/20". At r4, cite QA's own r3 file `docs/qa/qa-runs/effect-designer/e2/r3/probes/qa-ede2-plants-r3-fix.py` (25 live plants, Q14 retired).

## r3 report only
- **Q19, my own tooling bug, confirmed.** My r1 needle (`… : Math.max(2` → `… PATH.dots : Math.max(2`) left a stray `: 2`, so the file failed to parse. On r1 it "caught" only by **LOAD** failure (`out/plant-classify-r1.log`). My r1 QA tally was really **12/20, not 13/20**. The r1 verdict is unaffected (no verdict was given; the r1 misses were listed). Fixed: QA's r3 file uses EA's well-formed needle (`Math.floor(n))) : 2` → `: PATH.dots`), which test 6 catches by assertion. New check `probes/plant-classify.py` applies each plant and labels the failure ASSERT / LOAD / ERROR / PASS / NEEDLE. On the r3 proto, **EA 41/41 ASSERT** and **QA 22/24 ASSERT + 2 PASS (Q21, Q23)**, with no LOAD or ERROR. On the fix ref, **EA 41/41 and QA 25/25 ASSERT**. EA's r1 32/32 were also all ASSERT on r1.
- **EA's re-expressions** of Q15 (a self-ride made silent), Q17 (the disabled check removed) and Q19 (the needle repaired) are faithful to the intent. I took them into QA's r3 file.
- **F1–F3 intent kept in the changed pin `c55dd3ec`:** Q13 (angle), Q15 (self-ride, now a stamp) and Q18 (tile scale) are all caught by assertion. The straight-self-ride half of test 13 is a valid extra pin of ruling 16.
- **Flatten and a non-string `ride`:** on a moved step, flatten deletes it (it names no step on its side, CN rule 6), so the source's H2 note disappears without a message. This is consistent with the CN. Note it for E7.
- **Lite 60 ms pose grid:** no E2 test pins it. It is existing `drawT` behaviour, and the probe confirms it.

---

## r1 findings (pre-r2), no verdict (kept for history)

QA & Build Guard · 2026-11-16 11:45 Europe/London (GMT). Kit r1 (Effect Designer E2, travel paths), proto `d2104e0c`. **No verdict.** EA is reissuing as r2 to match DSK's CN-026 (`ride`, PROPOSED, `49e1a91b`). The r2 changes are: a non-string `ride` gives H2 `invalidValue`, a new one-hop ruling, a changed test 8, a new test and plant, and new hashes, paste and list. This file records what r2 should not change. Inputs are copied to `qa-runs/effect-designer/e2/in/`, logs are in `…/e2/out/`, and probes are in `…/e2/probes/`. New refs (only these): `refs/cmp/ede2-qa-proto` = `d2104e0c` and `refs/cmp/ede2-qa-fix-a` = `e1f7428d`. No GitHub writes and no EA file edited.

## EA's claims, checked (r1)
| Claim | Result |
|---|---|
| List `9480a8c3`, 4 files; step doc `c6f8530f` (196 lines), `fx-path.test` `429cb2ce`, `fx-travel.test` `d435b58a`, paste `96dc6102` | ✓ `sha256sum -c` 4/4 in the tree. Doc is 196 lines; tests are 41 and 45 lines |
| Bundle `d064cd2a`, head `d2104e0c`, tree `c24fceaa`, parent `77552a38`, noreply | ✓ bundle and pack OK, 1 commit, noreply author and committer, merge-tree onto main `77552a38` is clean with the same tree (`out/headcheck.log`) |
| Proto = base + the claimed files | ✓ 7 files, +151/−6 = **157** (src 71, tests 86). Every file is within its cap (50/54, 7/11, 7/11, 3/7, 4/8, 41/45, 45/49). Both tests in the proto are byte-identical to the list |
| headcheck `FAIL` on the paste | Tool artefact, not a finding: the paste is a kit doc and was never meant to be in the proto |
| Paste = step doc | ✓ the bodies from `## Goal` to the end are identical (diff empty) |
| Test names | ✓ the doc's 11 names match the two files exactly, in order (1–6 `fx-path`, 7–11 `fx-travel`) |

## Gates on `d2104e0c` (`out/gates-proto.log`)
Tests 778 pass, 0 fail (floor 778; main 767). npm ci, typecheck, lint, deps (111 modules / 355 deps), check:state and check:law all exit 0. `smoke: 0 failed`, the same as main. Sims 48/2 `afc89d56` and 22/28 `b8007292` are the same as main. Stress 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0 is the same as main. The 5 pins have an empty diff.

## Law and scope
- **Law:** no `Math.random`, `Date`, timers, rAF, `Card`/`Deck` or hp/mana/cost in the src diff. `fx-path.ts` imports nothing and has no module state.
- **Law 13:** the caps are enforced and caught. More than 8 hops gives one `overCap` (plant 11, Q2, Q11). `pathDots` clamps to 2…32 and NaN gives 2 (plant 31, Q4, Q19). Paths exist only for the first 12 steps (`DOC.steps`).
- **Scope:** `src/editor` changes only in `flatten` (+3/−1). There is no Travel beat, trails, lock, pierce, split or smear, and no UI. `fx-look`, `placeStep`, core-types and sim are untouched.

## Behaviour probes (`probes/e2-behaviour.ts`, `out/e2-behaviour.log`)
- **Absent = today, and the hit doesn't move.** For a straight-plus-particles doc and a bounce/orbit/swerve doc, the proto's `docToLiveFx` output with `path` removed is byte-identical to main's, with the same notes and the same `hitOffsetMs` (442 and 868). Scene events with and without `path` are identical (`fx:start` 0, `fx:hit` 450, `fx:end` 900).
- **Hold:** the piece holds on the target to 900 ms (len 600 + hold 300). This is pinned by test 9 and plant 20.
- **Pose grid:** full mode gives one pose across 30–59 ms. Lite gives one pose across 60–119 ms and changes at 120, so lite uses the 60 ms grid. That lite timing is existing `drawT` behaviour and no E2 test pins it (report only).
- **Turning:** lite 90° gives `n4` (pinned by test 9). The bucket counts come from `turnTag` in `fx-look`, which is unchanged.
- **Ride of a ride: r1 is already one-hop.** Rider C on B takes B's **own** orbit path, never B's ride (A's straight). A rider of C, a stamp riding B, gets `unknownRef`. EA's r2 ruling only confirms this.
- **Non-string `ride`** (`5`, `null`) gives `unknownRef` in r1. Noted, not failed: CN-026 / r2 makes it `invalidValue`.
- **Tile size:** bend and orbit scale with `tileW`, and hops scale with `tileW`/`tileH`, as ruling 5 says (checked at 16×16, 32×32 and 32×16).

## Plants
- **EA's 32/32 caught** in my independent rerun of `ede2-plants.py` (`3c8a0823`) against the two shipped tests (`out/plants-ea.log`).
- **QA 13/20 on the proto** (corrected at r3: **12/20**; Q19 only "caught" because the file failed to parse, see r3 report only) (`probes/qa-ede2-plants.py`, `out/plants-qa.log`). All 7 misses are also missed by the **whole suite** (107 test files, 0/7, `out/plants-qa-missed-fullsuite.log`):

| # | Plant | Status |
|---|---|---|
| Q13 | the travel turn drops the step's own `angle` (ruling 8 says `(angle ?? 0) + deg`) | **F1, unpinned** |
| Q18 | orbit radius hard-coded to 16 px instead of `tileW` | **F2, unpinned** (every E2 test uses 16 px tiles; repo tests also use 1, 15 and 64 px tiles) |
| Q6 / Q7 | bend × `tileH`, or bounce `dr` × `tileW` | F2, unpinned. Report only, because every world in the repo uses square tiles |
| Q15 | a step riding itself is accepted (ruling 10 says `unknownRef`) | **F3, unpinned.** r2 rewrites test 8, so fold it in there |
| Q17 | riding a **disabled** travel step: r1 moves the rider along the disabled step's path | **F4, not ruled** in the doc |
| Q20 | a disabled rider with a dangling `ride`: r1 gives no note | F4, not ruled (r1 is consistent with ruling 7's "a disabled step is not noted") |

Caught: Q1 (hold_ms dropped), Q2 (cap 9), Q3 (lite ignored for the turn), Q4 (pathDots 1), Q5 (bounce peak), Q8 (flatten mint order), Q9 and Q10 (overlay offset), Q11 (overCap per point), Q12 (ease out), Q14 (own path wins over ride), Q16 (hold heading), Q19 (NaN n).

**QA pin, offered for G6 (≤ 37 lines):** `tests/runtime/render/fx-travel-qa.test.ts`, 26 lines, sha256 `24773813776906959bbaeeab044bbd998e2364b5e9f5d04d7e9a4743bb9564b5`, 3 tests: angle + heading, self-ride, and tile scale at 32 and 32×16. It is on `refs/cmp/ede2-qa-fix-a` = `e1f7428d` (tree `f404b329`, parent proto, noreply). There it gives green **781/0** with all gates PASS (`out/gates-fix.log`), **EA 32/32 and QA 18/20**; the remaining 2 misses are Q17 and Q20, which wait on an F4 ruling. The self-ride test depends on r2 keeping the `unknownRef` code for a string self-id. Rebase it onto r2.

## Step doc findings (r1)
- **F1–F3:** ruling 8 cites "tests 5, 9", ruling 5 "tests 3, 4" and ruling 10 "tests 8, 11", but none of those tests pins the angle offset, the tile scale or the self-ride case.
- **F4:** add a line to ruling 10 saying whether a ride onto a disabled travel step is allowed, and whether a disabled rider is noted.
- **F5, wording:** ruling 3 says the hit "fires just before arrival". That holds only when the travel step is the connect step. In the doc's own Example (fireball + `with-last` sparks, no `connect_step`), the hit falls back to the last step: 0.92 × 480 = 442 ms (`fx:hit` 450 on the 10 ms step), while the fireball lands at 600 ms. Either write `connect_step: "a"` into the Example or qualify the sentence.
- **F6, flatten:** a moved step's `ride` that names no step of its own side is kept, so if the base has that id, it now binds to a **base** step. In the source effect it was dangling. Test 11 shows this (`["s-3", "h"]`, where `h` is a base stamp). State whether that is intended (report only).
- **CN:** `ride` is marked RISKY (header and ruling 10), and open question 1 asks for the CN. r2 should name CN-026 (`49e1a91b`) and record the condition.
- **Size and helpers:** 157 lines, within the 150–400 band. The Working-style block (§ Helpers & self-review, missing = REJECT) and the Gates line are present. A kit proto has no HANDBACK.

## Doc
This file. Nothing pushed.
