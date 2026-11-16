# Step ED-E2 builds A/B (travel paths, ride, flatten): QA pick

QA & Build Guard · 2026-11-16 15:45 Europe/London (GMT). Kit r4: step doc `handoff/steps/step-ed-e2-travel-paths.md` `71fd3d15…`, proto `cf4c1fda`, CN-026 ACCEPTED (`60e08878`), base `77552a38`. Main is now `b1db36cb`: one commit, "kit: step ED-E2 travel paths (step doc + tests + paste)", touching only handoff/ and docs/pastes, with no src/tests/tools delta vs `77552a38`. The four kit tests on main are byte-identical to both builds' (`429cb2ce`, `fa049e53`, `c55dd3ec`, `dff0ae27`). Bundles and handbacks were copied into `qa-runs/effect-designer/e2b/in/` before use; that folder holds the evidence too. No messaging, no GitHub/Drive writes, no EA file edited, no existing ref moved. The handbacks' "PR opened by CoS" line was ignored.

Report-only: the drive folder `mislabelled-as-chatA/` holds **ChatB's** bundle (`0b579d70`).

## Pick: **ChatB** (`29e77c0b`). **NOT OK TO OPEN PR on the tip as shipped**; **OK TO OPEN PR on `refs/cmp/ede2b-qa-B-fix-a` (`96eac3df`)** once EA confirms ruling 4 (see Drift) and adopts the QA pin (G6)

Why ChatB: both builds pass every hard gate, before and after merge-tree onto `b1db36cb`. A differential fuzz (2000 seeded docs) shows both match the proto's converter output. The one behavioural difference is the named-anchor offset:
- **CoS's claim is verified: ChatA has the bug, and so does EA's proto `cf4c1fda`.**
- ChatB's helper found the bug and fixed it within caps (fx-live 11/11).
- Plain air pieces and the no-path byte-identity are unaffected in B.

### The anchor bug (A and proto; B correct)
Ruling 4 adds `pathAt − foot(anchored cell)`, "so the step's anchor_point offset rides along". placeStep samples a named anchor (centre/foot/hand/tip/head, anchor ≠ screen) at `atUnit` (spawn = step start; follow+detach = hit). A and the proto subtract the **live** cell's foot instead. Once the caster has moved, the piece is off the path by the move delta. B subtracts the cell placeStep actually used (`held ?? cell`, `held = named && anchor≠screen ? atUnit(drawT) : null`).

Repro (`probes/anchor-probe.ts`; one scene link; caster steps c2→c6 between frames; "fresh" = a new link with the caster at c6 from the start):

| Case | Proto `cf4c1fda` | A `716f87a6` | B `29e77c0b` |
|---|---|---|---|
| centre spawn, t=300 / 530 | 0,48 vs 64,48 / −22,65 vs 42,65 **DIFF** | same as proto **DIFF** | SAME |
| foot spawn, t=300 / 530 | 0,56 vs 64,56 / −22,73 vs 42,73 **DIFF** | **DIFF** | SAME |
| centre follow+detach at hit, move after hit (1.0 s, hit 920, frame 990) | −31,72 vs 33,72 **DIFF** | **DIFF** | SAME |
| plain air (no anchor_point) | SAME | SAME | SAME (still tracks) |
| centre follow; centre + anchor screen | SAME | SAME | SAME |

**The proto also has the bug.** EA's word on ruling 4 is needed before B's behaviour becomes the reference (see Drift). If EA rules that the live cell is intended, the pick flips to "either": A = proto.

### Must-fix (B tip as shipped)
1. **G1: four plants are not caught by the shipped tests on B** (plant-classify, kit tests only: 65 ASSERT, 4 PASS):
   - **Q27:** the offset uses the live cell (A's and the proto's behaviour).
   - **Q28:** a plain anchor uses the sampled unit, so an air piece stops tracking.
   - **Q29:** screen is treated as named.
   - **Q16:** the heading chord isn't clamped at the end. B's `atU` doesn't clamp, so on hold a curved path extrapolates. The kit only pins hold heading on a straight path, so this was a real gap, not an equivalent mutant.

   The QA pin `fx-travel-qa3` catches all four. B passes it unchanged, so no src change is needed. **Needs EA G6 adoption.**

### Should-fix (B)
- **An explicit `ride: undefined` key gives `invalidValue`.** B tests `"ride" in s`, while the proto and A treat that key as absent. It's reachable only in memory (JSON can't carry undefined). Repro: `probes/undef-ride.ts`. The fix is one token: `s["ride"] !== undefined`. readPath's `"bounce_points" in s` has the same edge (report-only).

### Report-only
- **Notes order:** B and A interleave path notes per step; the proto pushes all path notes first. 314/2000 fuzz docs differ in order only. After sorting, 0 diffs for A and for B. Not ruled.
- **flatten edge** (1/2000 fuzz, identical for A and B): a moved step with `ride: ""` when the other side has a step whose id is `""`. The proto re-points it; the builds delete it, as CN rule 3 ("an empty ride is never a name") suggests. EA note.
- **B's pathDots uses `Math.round(n)`** (proto: floor). Not ruled.
- **A's bounce hop uses `* tileH`** (doc: tiles × tileW). Same today because tiles are square.

## QA pin ref
```
refs/cmp/ede2b-qa-B-fix-a       96eac3df81221a0c54ecbcda1f081b4c95f79b45  (parent ChatB tip 29e77c0b; G-TileEngine noreply author+committer)
tree                            b286a68985ffc1b2f0b0df0be16fc9bfc5daaca8
file                            tests/runtime/render/fx-travel-qa3.test.ts  24 lines (cap 37)  sha256 072b45012fb0b41a5cdfe6e01e3138ae28ab5cb0328dd8d303112b4185577441
merge-tree onto b1db36cb        9bcb1a5be898efb4a5e1f9ca42eb0bbbfc2a8d1d (clean); probe commit refs/cmp/ede2b-qa-merge-B-fix-a 680082ac
```
The two tests:
1. After the caster moves, centre and foot spawn, plain air, centre+screen, centre follow, and centre follow+detach-at-hit (move after the hit) each equal a fresh scene at the new cell. Foot at t=300 is exactly [64, 56].
2. Holding keeps the last heading on a bend-1 arc: deg at 9000 = deg at 600 (and > 45).

| Tree | QA3 | Full suite |
|---|---|---|
| Proto `cf4c1fda` | 1/2 (test 1 fails: centre spawn 0,48 vs 64,48) | – |
| A `716f87a6` | 1/2 (same failure) | – |
| B `29e77c0b` = fix ref | **2/2** | **786/0** |

Plants on the fix ref (kit tests + qa3): **69/69 ASSERT** (EA 41 + QA 25 + Q27–Q29). A with qa3 is 66/66 (qa3 test 1 fails on A by design).

Size: 219 + 24 = **243** changed lines (150–400 band).

## Both builds: checks

| Check | ChatA `716f87a6` | ChatB `29e77c0b` |
|---|---|---|
| Tip / parent / commits | `716f87a6`, code `b12b582d`, 2 commits, all noreply | `29e77c0b`, code `9f24c360`, 3 commits, all noreply |
| Bundle / headcheck | `477e92e0` verifies; matches CoS | `0b579d70` verifies; matches CoS |
| Lines (excl. handback) | 205 = src 71 + tests 134 (matches CoS) | 219 = src 85 + tests 134 (matches CoS) |
| Per-file caps (path/doc/live/player/fit) | 54/4/6/3/4 within 54/12/11/7/8 | 54/12/11/3/5 (doc and live at cap) |
| Files | 9 product files + handback/; no scope creep | same |
| Merge-tree onto `b1db36cb` | clean, `5741cd1a` (matches CoS) | clean, `7fa3fd08` (matches CoS) |
| Kit tests / pins | 4 kit tests byte-identical; 5 pins empty diff | same |
| Gates on tip (floor 784) | 784/0; typecheck, lint, deps 111/355, state, law exit 0; smoke 0 failed; sim `afc89d56`/`b8007292` SAME; stress SAME | same |
| Gates on merge result | `8c9a72a5`: identical to the tip row | `ea9791ff`: identical to the tip row |
| Law grep (src diff) | no Math.random/Date/timers/rAF/ts-ignore/any; pathAt stateless (Law 13 ok) | same |
| No-path byte-identity vs main | hitOffsetMs 442/868, fx:hit 450 with and without path | same |
| Fuzz vs proto (2000 docs) | 0 diffs after notes order; scene 0 diffs | same |
| EA plants (re-needled per build) | 41/41 ASSERT | 41/41 ASSERT |
| QA plants (kit tests only) | 25/25 ASSERT | 24/25 + Q27–Q29: misses Q16, Q27, Q28, Q29 |
| Anchor bug | **present** (= proto) | fixed |
| HANDBACK §0.6 | present, **thin**: 1 of 3 helpers (ride/playback/flatten) stopped after about 20 min without reporting, and the builder's own probe stands in for it. Flagged, not a reject | present, full: 6 helpers, one found the anchor bug (FAIL → fixed → re-probed) |

Before re-needling, EA's proto needles caught 9/41 on A and 8/41 on B. They're the proto's source text, and the builds' code differs. Per-build needle files: `probes/plants-A.py` (66) and `probes/plants-B.py` (69). Every catch is an assertion failure, not a load failure.

## Drift (docs vs code) for EA
- **Ruling 4:** the proto subtracts the live cell's foot, which contradicts "the step's anchor_point offset rides along" once the caster moves. Suggest: "H is the cell placeStep anchored the piece to: for a named anchor point (not screen), the unit atUnit sampled; otherwise the live cell." Then fix proto `fx-live.ts` like B (≤ 5 tokens on the existing line) and adopt qa3.
- Ruling 8 pins hold heading on straight paths only. qa3 test 2 covers the arc.
- Notes order across steps and pathDots rounding aren't ruled (report-only above).

## Repro
```
cd /workspace/tileengine-repo; E=/workspace/tileengine/docs/qa/qa-runs/effect-designer/e2b
/workspace/cos-tools/qa-headcheck.sh refs/cmp/ede2b-qa-B 9f24c360 --name ede2b-hc-B
TMPDIR=/tmp/g /workspace/cos-tools/qa-gates.sh refs/cmp/ede2b-qa-merge-B --floor 784     # same for -A, -merge-A
TMPDIR=/tmp/g /workspace/cos-tools/qa-gates.sh refs/cmp/ede2b-qa-B-fix-a --floor 786
(cd $E/wtB && node ../probes/anchor-probe.ts)                                              # same in wtA, wtP: DIFF rows
cp $E/probes/qa-test3/tests/runtime/render/fx-travel-qa3.test.ts $E/wtA/tests/runtime/render/ && (cd $E/wtA && node --test tests/runtime/render/fx-travel-qa3.test.ts)   # 1/2
(cd $E/wtB && python3 ../probes/plant-classify.py . ../probes/plants-B.py tests/runtime/render/fx-{path,travel,travel-qa,travel-qa2,travel-qa3}.test.ts)   # 69 ASSERT
```
Logs: `out/gates-*.log`, `out/anchor-probe*.log`, `out/classify-*.log`, `out/diff-fuzz*.log`, `out/undef-ride.log`, `out/e2-behaviour-AB.log`.
