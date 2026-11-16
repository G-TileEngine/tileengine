# ED-E3 r2: **NOT OK**, with 2 small must-fixes (QA 2026-11-16 17:35 London)

Head `b19c1329` (tree `0081cbea`), 3 commits on `3aa3551f` (r1 `39e6abc0` → QA `f7f778f5` → r2), all noreply. Its parent is exactly my `refs/cmp/ede3-qa-fix-b` `f7f778f5`. The bundle `/workspace/share/ede3-qa-fix-b.bundle` is `d4fe9884` and holds that head. Inputs were copied to `qa-runs/effect-designer/e3/r2/in/`; logs are in `…/r2/out/`. New refs (only these): `refs/cmp/ede3-qa-proto-r2` = `b19c1329`, `ede3-qa-r2-fix-a` = `e0e99a79`, `ede3-qa-r2-merge-fix-a` = `ed87fa2d`.

The product and the three r2 changes are sound: the matchPatch guard, the per-file fence and the required `foes`. Gates are green, EA's 53 plants and my 18 plants are all caught, and EA's pin edit is clean. Two things block OK TO SEND. Once both are in r3, the kit is **OK TO SEND**.

```
refs/cmp/ede3-qa-r2-fix-a     e0e99a7956e9839e554baf0f75caf02dd4871ef0  (parent b19c1329; G-TileEngine noreply author+committer), tree ab70e7e4
file                          tests/runtime/scene/scene-fence-qa.test.ts  15 lines (cap 37)  sha256 2f88a0429de004d3a0de22dbe6cbe62eb884be8b525da11b00b4fcb8b2aa263a
green                         803/0 (802 + 1); typecheck, lint, deps 112/357, state, law exit 0; smoke 0 failed; sim/stress SAME (out/gates-ede3-qa-r2-fix-a.log)
merge-tree onto 525faa91      794b2cac (clean); probe commit refs/cmp/ede3-qa-r2-merge-fix-a ed87fa2d: same gates, 803/0, all PASS
size                          286 + 15 = 301 changed lines (150–400 band)
```

## r3 — OK TO SEND (2026-11-16 17:10 London)

- Head `fee4f953` (tree `c49225d0`), parent QA `e0e99a79` exactly, bundle `c436416c…` verifies, noreply. Only change over QA's ref: test 11's untyped `nearestFoe` call wrapped in `assert.doesNotThrow` (match-patch.test `0709a640`, 1 line).
- Gates (floor 803): 803/0, tsc/lint/deps 112/357/state/law PASS, smoke 0 failed, sim/stress SAME. 301 lines. Merge-tree onto `525faa91` clean (tree `46814bb1`).
- Kit tree `/workspace/share/step-ed-e3/` list `037a9d01` 7/7 OK; doc `d10d2bcd` (275 lines), paste `2b7ab01a`, paste body from `## Goal` equals the doc; the 5 kit tests are byte-identical to the proto's. QA pins ship as `0fe9d665` (accepted edit) and `2f88a042` (unchanged).
- M1 closed (ruling 16, floor 803). M2 closed: open question 1 cites only the CEO's own answer in QA's chat at 16:36 London; no 16:12 or 👍 left in the doc or paste.
- Plants: EA reports 56/56 and QA 18/18 + R1–R8 8/8; QA did not re-run them for r3 (the delta is one test line that only tightens test 11).

## r2 must-fix
- **M1 (G1): two fence plants are missed. The fix is my pin `scene-fence-qa` (15 lines, test only, no src change).** Ruling 13 says every `match-link.ts` import must be `import type`, but the shipped fence checks only `import …` statements and `from "…"` paths:
  - **R7, value re-export:** `export { createSceneLink } from "./world-scene.ts";` added to `match-link.ts` passes all shipped tests. The path is allowed, and the line isn't an `import` statement. That gives match-link a runtime link to world-scene.
  - **R8, dynamic import:** `export const qaLazy = () => import("../render/index.ts");` passes too. The fence's path regex needs `import "…"`/`from "…"`, so `import(` is never seen. The gap has been in the Base fence since step 31, for world-scene as well. A dynamic `import("../../sim/index.ts")` would pass the fence; only depcruise's `nothing-imports-sim` stands behind it.
  - **The pin:** no `import(` in either scene file, and no non-type `export … from` in match-link. It has must-fail and must-pass self-checks: multi-line re-exports and `export *` must fail; `export type … from`, comments and strings must pass. With it, R7 and R8 fail by assertion.
  - **r3:** adopt it as G6, raise the floor 802 → 803, add the file to § Files (15, cap 37) and § Tests, and add R5–R8 to the plants table. Alternatively, EA can fold the two checks into `scene-fence.test.ts` (that file's cap would move), but then the shipped fence changes again.
- **M2 (doc): open question 1 cites the wrong thing as the CEO's call.** Doc line 244 reads "the CEO's call: his 👍 on EA's recommendation at 16:12 London, then his own answer in QA's chat at 16:36 London". In QA's chat, the 16:12 👍 was his reaction to QA's message, not a ship call. The call is his own answer at 16:36 London: ship both, `foes` required. The wording does credit the CEO, not an agent; only the 16:12 cite is wrong. Suggested text: "**Resolved: yes, both ship, with `foes` required** (the CEO's own answer in QA's chat, 16:36 London)." Drop the 16:12 👍. This is doc-only, and the paste needs the same edit so its body still equals the doc.

## Pin edit (ruling 15): **accept**
- **Diff `b3401a67` → `0fe9d665`:** only `, ["wolves"]` added, at the 4 `nearestFoe` calls on 3 lines (test 4). Every expected value is unchanged, and nothing else differs. Still 33 lines (cap 37).
- **Nothing is masked:**
  - In the cap case, the foe at row 1029 is `side: "wolves"`, and the 1028 filler rows are `side: "p"` (the caster's own side). So with `["wolves"]`, the proto still returns `null` and an uncapped plant returns `w`.
  - Q12–Q16 are all caught by assertion with EA's needles (`out/classify-qa-r2needles.log`, 18/18).
  - The neutral pick isn't the pin's job. Test 11 now covers it: `["neutral","wolves"]` → `crate`, `["wolves"]` → `w1`, own side `["p","nobody"]` → null.
- **EA's re-needled file `66976329`** vs mine (`e1692dbc`): the header, Q11's search text (`!(world.cols >= 1) || !(world.rows >= 1)`), and Q8/Q20 commented out as retired. Nothing else. Run as-is, my old file gives 17 ASSERT, Q11 NEEDLE and Q8/Q20 PASS (both retired), as expected.

## r2 changes, probed (`out/r2-probe.log`)
- **(a) matchPatch.** The map is 1 wide and the caster sits at (1,0), wanting 5×4.

  | Map size | Result |
  |---|---|
  | NaN×8, 10×NaN, 0×8, 10×0, 0.5×8, −3×8 | null |
  | 2.5×1.9 | `{c 0, r 0, cols 2, rows 1, w 32, h 16}` (whole tiles for both the limit and the clamp) |
  | 2.5×8 | `cols 2, rows 4` |
  | 2.5×1.9, NaN want | 2×1 |
  | 1×1 | 1×1 |
  | Infinity in either size | a normal window (5×4) |

  My R1 (r1 guard put back) and R2 (clamp on the fractional map) are both caught by assertion.
- **(b) fence.** All three cases are caught:
  - a value import from world-scene into match-link (R5);
  - a render `import type` into match-link (R6);
  - a third file in `src/runtime/scene/` (the fence test fails).

  Its own must-fail lists cover `./match-link.ts` into world-scene, and render, world-scene values, sim and `hp` into match-link. The gaps are M1.
- **nearestFoe:**
  - Omitting `foes` is a type error: `tsc` gives `TS2554: Expected 3 arguments, but got 2` (`out/tsc-omit-foes.log`).
  - An untyped call with no list, `undefined`, `null`, the string `"wolves"` or an array-like object returns `null`, with no throw and no note (nearestFoe has no notes).
  - The caster's own side never counts: `["p"]` → null, `["p","wolves"]` → `w`.
  - **Stage-fixed seed 1:**

    | Unit | `foes: ["wolves"]` | `foes: ["player"]` |
    |---|---|---|
    | knight#1 | wolf#3 | null |
    | archer#2 | wolf#3 | null |
    | wolf#3 | null | knight#1 |
    | wolf#4 | null | knight#1 |
    | crate#5 | wolf#4 | knight#1 |
    | merchant#6 | wolf#4 | null |

    `[]` → null for all six. No neutral pick is possible unless `"neutral"` is listed.
  - R4 (own side counts) is caught by assertion. R3 (no `Array.isArray` guard, so an untyped call throws) and EA's plant 53 are caught by a TypeError in test 11, not an assertion. It's a real failure, so it counts as a catch.

## r2 should-fix
- None blocking. Optional: wrap test 11's untyped call in `assert.doesNotThrow`, so plant 53/R3 fails by assertion instead of a TypeError.

## r2 report-only
- **Infinity map size:** `matchPatch` returns a normal finite window, because Infinity is "a number ≥ 1", as ruling 9 says. With a caster at c 1e6 it gives `c 999998, x 15999968`. That's not a real map; leave it.
- **Q3 answered, and the perf carry is recorded** in § Not in this step (test 8's probe → visible promise, `perf-34a` with it). The r1 report-only items are carried to E6.
- **Caps:**

  | File | Lines | Cap |
  |---|---|---|
  | match-link | 93 | 97 |
  | world-scene | 6 | 10 |
  | match-picture | 29 | 33 |
  | host-guide | 2 | 6 |
  | match-link.test | 61 | 65 |
  | match-patch.test | 49 | 53 |
  | match-link-qa | 33 | 37 |
  | scene-fence | 13 | 13 |

  Total 286 = 245 + 33 + 8, in the 150–400 band ✓.

## r2: EA's claims, checked
| Claim | Result |
|---|---|
| Head `b19c1329`, tree `0081cbea`, parent `f7f778f5` (bundle `d4fe9884`), 3 commits on `3aa3551f`, noreply | ✓ all. `d4fe9884` = `/workspace/share/ede3-qa-fix-b.bundle`, head `f7f778f5` |
| Bundle `ebaf6e26` → `refs/cmp/ede3-qa-proto-r2` | ✓ verifies; head `refs/heads/proto/ede3-r2` |
| 802/0, all gates, pins 5/5, smoke 0, deps 112/357 | ✓ qa-gates `--floor 802`: 802/0; tsc, lint, deps 112/357, state, law exit 0; smoke 0 failed; sims `afc89d56`/`b8007292` and stress SAME; pins `1e5dd82c d7f64a09 45a3dbaa 4d7bbf48 d6d08696` unchanged (`out/gates-proto-r2.log`) |
| EA plants 53/53 (`a0b0cd27`) | ✓ hash; plant-classify 52 ASSERT + 1 ERROR (plant 53, a TypeError in test 11; a real failure), 0 LOAD, 0 PASS |
| My 18 plants, only Q11's needle changed (`66976329`) | ✓ diff above; 18/18 ASSERT |
| 286 lines, merge onto `525faa91` = `a1dfe81f` | ✓ +256/−30 = 286; merge-tree clean, tree `a1dfe81f` |
| Pin `0fe9d665` = `b3401a67` + foes only | ✓ see § Pin edit |
| Kit hashes: doc `58d98be4` (254), paste `c1908106`, tests `e3d06bed`/`266fa099`/`0fe9d665`/`c2d1403f`, list `936c0bfd` (6 new) | ✓ all. The paste body from `## Goal` on is identical to the doc. The 4 kit tests are byte-identical to the head. The 16 test titles and the fence title match the doc. All 6 paths are new on `525faa91` |
| Open Q1 / Q3 / perf carry | Q1: **M2**. Q3 and the perf carry ✓ |

# Step ED-E3 kit review (Effect Designer E3: G2 match → picture link, r1)

QA & Build Guard · 2026-11-16 17:15 Europe/London (GMT). Proto `39e6abc0` on Base `3aa3551f`; main is now `525faa91` (= `3aa3551f` + `docs/qa/step-ed-e2-{review,builds}.md` only). Inputs (bundle, plants, result, push list, kit tree) were copied to `qa-runs/effect-designer/e3/in/` first; probes are in `…/e3/probes/` and logs in `…/e3/out/`. New refs (only these): `refs/cmp/ede3-qa-proto`, `ede3-qa-fix-a` (superseded: tsc fail, see below), `ede3-qa-fix-b`, `ede3-qa-merge-fix-a`, `ede3-qa-merge-fix-b`. No messaging, no GitHub/Drive writes, no EA file edited.

## Verdict: **NOT OK**, with one must-fix (G1). The fix is test-only: adopt QA pin `match-link-qa` (33 lines), then **OK TO SEND**

The product is sound. Gates are green, EA's 47 plants are all caught by real assertions, the kit is new files only, and nothing changes a DSK format. But **15 of my 18 live plants pass the shipped tests**. Each one breaks a written ruling (3, 6, 7, 8, 9, 10 or law 13). One 33-line QA test catches all 15 on the proto with **no src change**. r2 = the kit + this file (G6) + the floor 798 → 802 + the step-doc rows below.

```
refs/cmp/ede3-qa-fix-b        f7f778f50dafd045b3e73cc84dd0ee7277c9341b  (parent proto 39e6abc0; G-TileEngine noreply author+committer), tree 89073a1d
file                          tests/runtime/scene/match-link-qa.test.ts  33 lines (cap 37)  sha256 b3401a670a5e37b154a182c23f39a07ccf0d1c2fa0eb27ce8b716e301fc1a2ef
green                         802/0 (798 + 4); typecheck, lint, deps 112/357, state, law exit 0; smoke 0 failed; sim/stress SAME (out/gates-ede3-qa-fix-b.log)
merge-tree onto 525faa91      14d42fa2 (clean); probe commit refs/cmp/ede3-qa-merge-fix-b 47c55237: same gates, 802/0, all PASS
plants on fix-b               EA 47/47, QA 18/18 (+2 retired as equivalent), all by assertion
size                          245 + 33 = 278 changed lines (150–400 band)
```
`ede3-qa-fix-a` (`3ad0d04a`, sha256 `263b25c0…`) is the same test before a typing fix. It is 802/0 but **tsc exit 2**: `rev: undefined` under `exactOptionalPropertyTypes`. Don't use it.

## Must-fix
**M1 (G1): 15 QA plants are missed by the shipped tests.** `out/classify-qa.log` (shipped tests) gives 3 ASSERT and 17 PASS. Two of the PASSes are equivalent mutants and retired (below). With the pin, `out/classify-qa-with-pin.log` gives 18/18 ASSERT.

| Plant | Breaks | Repro (proto vs plant) |
|---|---|---|
| Q1 an off-map or sprite-less row doesn't claim its id | ruling 3 ("claims it, even if that row is then skipped") | rows `a` off-map, then `a` on-map: proto keeps 0 and notes `invalidValue units[1].id`; the plant keeps `a` |
| Q2 sprite checked before off-map | ruling 3 order | an off-map row with an already-missing unitId: proto `outOfRange units[4].at`; the plant gives no note |
| Q3 repeated id checked after off-map | ruling 3 order | a repeated id that is also off-map: proto `invalidValue units[5].id`; the plant `outOfRange` |
| Q4 `at` keeps the snapshot's extra keys | rulings 2, 6 | `at {c:4, r:0, z:1}` → proto `{c:4, r:0}` |
| Q6 the first rev after frames without one doesn't re-read effects | ruling 8 ("the first one included") | effects list pushed in place, then rev 5: proto 2× overlays, plant 1× |
| Q7 unit memo reused across a changed rev (same units array) | ruling 8 | units array edited in place + rev 1→2: proto draws the new cell c 5, plant keeps c 1 |
| Q9 patch: a pair exactly n apart counts as fitting | ruling 9 (`|Δc| < cols`) | (2,4)/(5,4) at 3×2: proto caster window c 1, plant c 3 (holds neither centred) |
| Q10 patch: the 3×2 default not clamped to a smaller map | ruling 9 | NaN size on a 2×1 map: proto 2×1, plant 3×2 (wider than the map) |
| Q11 patch: rows 0 is not null | ruling 9 (empty map → null) | 5×0 map: proto null |
| Q12 nearestFoe reads past 1024 rows | ruling 10, law 13 | only foe at row 1029: proto null, plant `w` |
| Q13 nearestFoe: alive missing/non-true counts as living | ruling 10 ("living") | proto null |
| Q14 nearestFoe: a foe with a bad cell counts at (0,0) | ruling 10 | `at {c:1.5}`: proto null |
| Q15 nearestFoe: a caster with a bad cell reads (0,0) | ruling 10 | `at: null`: proto null |
| Q16 nearestFoe: a non-string id can be returned | ruling 10 (returns an id string) | `id: 7`: proto null, plant `7` |
| Q19 a rebuild keeps the last build's units array | ruling 7 (anything else rebuilds) | test 7 checks w2's notes but not its units: plant draws the old snapshot |

Retired (equivalent, PASS is not a miss):
- **Q8** (unit memo ignores `assets`): the scene cache already checks `cached.assets === world.assets`. I swapped assets A/B/A/C/C/A/B/B with proto vs plant and the standing output was identical (`out/q8-proto.log`, `q8-plant.log`). The memo's assets check is redundant but harmless; report-only.
- **Q20** (`target === null` vs `== null`): `find(id === undefined)` never matches, so it's equivalent.

Caught already: Q5 (units sorted, by test 6), Q17 (ties by first row, test 11), Q18 (memo ignores art, test 7).

Step-doc rows for r2 (EA's text): add the file to § Files (33, cap 37) and § Tests (4 tests, G6, sha above). Floor 798 → **802**. Add Q1–Q19 to § How a planted bug is caught, or cite this doc.

## Should-fix
- **matchPatch with a non-finite map size returns a NaN box, not null.** `world.cols = NaN` gives `{c: NaN, cols: NaN, x: NaN, w: NaN, …}`, because `NaN < 1` is false. A fractional `cols 2.5` gives `cols 2.5, w 40` (not whole tiles). One token: `!(world.cols >= 1) || !(world.rows >= 1)`, plus `Math.floor` on `max`. The link never builds such a world, but `matchPatch` takes any `SceneWorld`. `tileW NaN` gives NaN x/w too (host bug; report-only).
- **The fence is per folder, not per file.** The `ok` import regex is shared, so `match-link.ts` may import `../render/index.ts` or value-import `./world-scene.ts`, though ruling 1 says "only types from ./world-scene.ts and the Notice type". It's not loosened beyond that: the folder list is exact (`["match-link.ts", "world-scene.ts"]`, so a third file fails), and the banned list is unchanged and checked on both files. `world-scene.ts` may now import itself (a no-op). Optional: a per-file allowlist. Low risk; not a gate.

## Report-only
- **matchPatch with an off-map caster** (hand-built world, c 50 on a 10×8 map) returns `{c: 7, …}`, a window that doesn't hold the caster. `sceneFromMatch` never emits off-map units.
- A dead caster still gets a patch and a nearestFoe. A repeated caster id uses the first row. Both are consistent with the rulings, which don't say otherwise.
- The host-guide edit drops the old "(G2, CN-019)" cite. CN-019 is the effect-ramps format, so that cite was wrong, and the edit is a correction.
- `readdirSync` order in the fence test is stable: libuv sorts scandir. I checked with 5 files.

## Risky helpers: facts (the ship call is the CEO's)
`out/risky-probe.log`:
- **matchPatch is read-only and leaks nothing.**
  - It ran on a deep-frozen world with no throw, and the world JSON is unchanged after every call.
  - It returns a fresh object of 8 plain numbers, so it holds no reference into the world. It keeps no state between calls.
  - Bounds: size floor 1–16 and ≤ map; NaN/∞ → 3×2 clamped; `1e9 × −0` → 10×1; clamped inside the map at all four edges; 0×0 and rows-0 → null. Exceptions: the NaN-map should-fix above, and an off-map caster.
  - It can't mutate the map, and it doesn't crop (ruling 9).
- **nearestFoe's neutral pick shows up with defaults on the stock replay.**
  - On stage-fixed seed 1 (test 12's run), with `foes` absent, **3 of the 6 units pick the neutral `crate#5`**: knight#1, wolf#3 and wolf#4. archer#2 → wolf#3, merchant#6 → wolf#4, crate#5 → knight#1.
  - With `foes: ["wolves"]`: knight → wolf#3, archer → wolf#3, merchant → wolf#4, crate → wolf#4.
  - It reads the snapshot without changing it. Bounded at 1024 rows (pinned now by Q12).
- **QA recommendation:**
  - Ship `matchPatch`.
  - Ship `nearestFoe`, but prefer `foes` **required** in the signature: an optional default that picks a crate in the stock example is a footgun. That costs 1 token in the interface and changes 2 asserts in test 11 (`nearestFoe(s, "me")` and `nearestFoe(s, "w1")`).
  - If EA keeps it optional, the E6 step must pin that the designer passes `foes`.
  - Either way it's not a QA gate.

## Q3 (test 8's `JSON.stringify` probe): **OK for builders as written**; swap it in the later perf step
- **What it checks.** The probe counts only calls where `v` is an array whose `[0]` is `"k1"`, i.e. the Base `unitKey`'s inner per-unit `JSON.stringify([u.id, …])`. Key order, extra fields and the outer key array (`[cols, …]`, `v[0]` = 8) don't affect it. So it's **not brittle to key order or extra keys**.
- **When a correct build fails it:**
  - (a) The build rewrites `unitKey`'s shape. That's out of scope: line 109 of the step doc says it "must stay a JSON.stringify of per-unit arrays starting with the unit id, as on the Base".
  - (b) The build adds its own per-frame `JSON.stringify` of an array starting with a unit id (e.g. its own memo key). That's unlikely, and it's real per-unit work anyway.
  - A build that computes the key and then throws it away fails, and should.
- **A better pin, for when a perf step drops the JSON key.** Test the observable promise, not the call: with the same `rev` and the same units array, an in-place unit edit is **not** seen (the key was skipped); without `rev` it **is** seen; with a moved rev it is seen. That's 3 lines, of the same form as `match-link-qa` test 2:
  ```ts
  const units = [k], w = { ...base, units, rev: 1 }, s = createSceneLink(); s.scene(w, at); units[0] = { ...k, at: { c: 5, r: 2 } };
  assert.equal(s.scene({ ...w }, at).standing[0]?.c, 1);            // same rev + units: key skipped (host promise)
  assert.equal(createSceneLink().scene(base2, at).standing[0]?.c, 5); // no rev: today
  ```
  `perf-34a` uses the same probe style, so both would move together.

## EA's claims, checked
| Claim | Result |
|---|---|
| Proto head `39e6abc0`, tree `7013ba45`, 1 commit on `3aa3551f`, noreply | ✓ (`git bundle verify` OK; author and committer `G-TileEngine@users.noreply.github.com`) |
| Bundle sha256 `51faf55f…5a18` | ✓ `51faf55f15fd…71cb5a18`; head `refs/heads/proto/ede3`; imported as `refs/cmp/ede3-qa-proto` |
| 798/0, all gates, pins 5/5, smoke 0, sim/stress same, deps 111/355 → 112/357 | ✓ qa-gates `--floor 798`: 798/0; tsc, lint, deps 112/357 (main 111/355), state, law exit 0; smoke 0 failed; sims `afc89d56`/`b8007292` SAME; stress SAME. Pins `1e5dd82c d7f64a09 45a3dbaa 4d7bbf48 d6d08696`, empty diff (`out/gates-ede3-qa-proto.log`) |
| EA plants 47/47 (`d98ae26c`, map `1c752db2`, result) | ✓ hashes match; plant-classify **47/47 ASSERT**, no LOAD (`out/classify-ea.log`); with the QA pin, still 47/47 |
| 245 lines; match-link 92 (cap 96); caps | ✓ +217/−28. match-link 92/96, world-scene 6/10, match-picture 29/33, host-guide 2/6, match-link.test 61/65, match-patch.test 47/51, scene-fence 8/8. src 98, tests 116, tools 29, docs 2. Band 150–400 ✓ |
| Step doc `d047eb54` (215 lines); paste `01c16ecc`; tests `e3d06bed`/`581695ff`/`6653ba4f`; list `8ee2ff66` (5 files) | ✓ all hashes and line counts. The paste body from `## Goal` on is identical to the doc (201 lines). The 3 shipped tests are byte-identical to the proto's. The 12 test titles match § Tests in order, and the fence title matches |
| Kit is new files only, applies onto `525faa91` | ✓ none of the 5 paths exist on `525faa91`. The proto's merge-tree onto `525faa91` is clean (`bfcdc9bb`) |
| Host example | ✓ `match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands`, both on main and on the proto |
| Ruling 13 fence | ✓ exactly the one named file is added, not any file; see the should-fix for the shared import list |
| Build law | ✓ the src diff law grep is empty (no Math.random/Date/timers/rAF/performance/Card/Deck/hp/mana/cost/editor/sim). The link reads no time. Law 13: the link keeps 1 entry, the scene keeps 1 memo, rows ≤ 1024, notes ≤ 2050. No new entry/pack/deps rule. The only inputs are the unit rows and the art's tiles. No do-not-touch path touched; E1/E2 shipped tests untouched |
| No CN / L-entry needed | ✓ `SceneWorld.rev`, `MatchArt` and `MATCH` are runtime API. Snapshots are read as they are (`id, unitId, side, at, offset, facing, alive`). No saved field and no core-types change. Open Q2 (sprite map in the project file) is correctly deferred |
| § Helpers & self-review; done means | ✓ the Working-style block (line 13) and the Acceptance line (181) require it (REJECT if missing). Every Acceptance line is a command or a hash (green ≥ 798, smoke, example line, sim, stress, pins, sha256s, caps, law grep). Suggest (optional) naming ruling-3 order and the rev memo as helper focus, since those are where my plants landed |

## Repro
```
cd /workspace/tileengine-repo; E=/workspace/tileengine/docs/qa/qa-runs/effect-designer/e3
TMPDIR=/tmp/g3p /workspace/cos-tools/qa-gates.sh refs/cmp/ede3-qa-proto --floor 798
TMPDIR=/tmp/g3f /workspace/cos-tools/qa-gates.sh refs/cmp/ede3-qa-fix-b --floor 802            # and ede3-qa-merge-fix-b
T="tests/runtime/scene/match-link.test.ts tests/runtime/scene/match-patch.test.ts tests/runtime/scene/scene-fence.test.ts"
(cd $E/wtP && python3 ../probes/plant-classify.py . ../in/ede3-plants.py $T)                    # 47 ASSERT
(cd $E/wtP && python3 ../probes/plant-classify.py . ../probes/qa-ede3-plants.py $T)             # 3 ASSERT, 17 PASS
(cd $E/wtP && python3 ../probes/plant-classify.py . ../probes/qa-ede3-plants.py $T tests/runtime/scene/match-link-qa.test.ts)   # 18 ASSERT + Q8, Q20 equivalent
mkdir -p $E/wtP/tests/qa && cp $E/probes/risky-probe.ts $E/wtP/tests/qa/ && (cd $E/wtP && node tests/qa/risky-probe.ts)
```
