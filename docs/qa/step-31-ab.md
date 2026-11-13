# Step 31 A/B: light and glow (lean)

**Pick: B (chatB, tip da773e3).** Must-fix patch: `qa-runs/step-31-ab/s31qa-fix-b.patch` (sha256 e39df046…), commit 463d400 (tree 7e56f9bc), saved as `refs/cmp/s31qa-fix` in `tileengine-repo`. Merge-tree onto origin/main 90f8243 is **143fd64c**, clean.

Inputs were copied to `qa-runs/step-31-ab/share/` first. Refs: `refs/cmp/s31qa-a` = 2baf2c7 (second) and `refs/cmp/s31qa-b` = da773e3 (chatB). Both are built on d0a21b1. origin/main 90f8243 is d0a21b1 plus the step 31 kit (docs only).

## Numbers

| | A (second) | B (chatB) |
|---|---|---|
| bundle sha256 (matches CoS verify-report) | 4bdd6bd1 ✓ | 8b95b94d ✓ |
| tip / code tree | 2baf2c7 / 972a87ba | da773e3 / 153d8fd8 |
| merge-tree onto 90f8243 | 52432fe1, clean | 33add8dd, clean |
| src+tests diff vs d0a21b1 | 8 files +206/−3 | 8 files +225/−3 |
| light.ts / visibility.ts (caps 80 / 58) | 67 · 55 | 80 (at cap) · 51 |
| light.test / scene-fence / raf-driver / index.ts | 64 · 14 · 153 · 9 | 72 · 16 · 153 · 9 |
| tsc, serial tests ×2, green | 0 · 573/0 ×2 · pass | 0 · 573/0 ×2 · pass |
| sims, 20 smokes, pins | unchanged | unchanged |
| EA plants (s31-plants-r3, re-anchored), own tests | **41/41** | 38/41 (misses L2, L4, L7) |
| shadowcast fuzz vs proto r3, 298 open-origin cases | 0 diff | 0 diff |
| darkness() vs r3 formula, 201×201 grid | 0 diff, max 23/32 = 0.71875 | 0 diff, max 23/32 |
| coverage/padding fuzz (1,008,810 samples) | 0 bad | 0 bad |
| F-1 diagonal bleed / F-2 mask count | 4 cells / 32768 (same as r3) | same as r3 |
| R2-N1, Moonlit walk, brightest-wins, NaN wash | same as r3 | same as r3 |
| perf: 40 lights moving, res 4 / res 8 (ms per frame); r3 is 0.98 / 0.42 | 2.25 / 0.64 | 5.89 / 1.48 |
| ops at 844×390 s1, res 4 / res 8 | 4734 / 2324 (same as r3) | same |
| **memo memory: 3600 frames (1 minute) of one moving light plus moonlit** | **+129.4 MB retained** | +0.1 MB |
| darkness fill colour | rgba(0,0,0,n/32) ✗ | rgba(0,0,0,n/32) ✗ |

Tools: `tools/ab31-plants.py` (EA plants with per-build anchors), `tools/ab31-plants-fix.py` (the same plus plant C1, run on the fix), `tools/qa/ab31.ts` (fuzz, memo, darkness, colour), `tools/qa/heap31.ts` and the r2 review probes `probes31.ts` / `cover31.ts`. I changed the cover31 dark-op filter so it also accepts black fills; without that change it counts every black op as bad.

## Why B
- **A leaks without limit.** `createLighting` and `createMoonlit` keep every plan or scene they have ever seen in a `hits` array with a linear `find`. A torch moving for one minute retains 129 MB (a 41 KB plan per frame), and moonlit gets slower as the array grows (5000 scenes: 60 ms against B's 4.5 ms). On a phone that will crash a long session. The kit says the plan memo returns "the same plan object while world, lights, wash, dim and res are unchanged" (single slot), and A's own tests can't see the leak. Fixing it needs a src change to A, so A can't take a tests-only must-fix.
- B's memo is single-slot, which matches the kit and r3, and its other behaviour is the same as r3. Its gaps are test gaps (L2, L4 and L7), and the patch closes them.
- Against B: its plan is about 2.6× slower than A's. It takes `sqrt` and does the mask lookup before the radius test on every sub-cell, for every light. That is 5.9 ms per frame with 40 moving lights at res 4, and nothing if the host passes stable lights. The kit has no ms budget and already defers the plan's full-map cost to step 34, so this is a carry, not a blocker.

## Must-fix (B) — commit 463d400, 2 files +5/−5, no growth (light.ts 80/80, light.test.ts 72/74)
1. **CEO ruling (17:20), relayed by CoS:** the darkness fills use the proto's blue-black. In `lightOps`, `rgba(0,0,0,${k / STEPS})` → `rgba(3,8,26,${k / STEPS})`, a single colour value. The alpha is still n/32. `darkness()` and the 0.72 cap are untouched (max is still 23/32 = 0.71875).
   Test (the darkness test, edited in place): every non-glow op must equal `rgba(3,8,26,${k/32})`, and at least one op must be `rgba(3,8,26,0.59375)`. **On unpatched B src this test fails** (`actual 'rgba(0,0,0,0.71875)'`, expected `'rgba(3,8,26,0.71875)'`; 8/1). With the patch it passes 9/0. Plant C1 (reverting to black) is caught.
2. **L2/L4 (memo ignores dim or world):** the old asserts compared each changed input against a stale `plan`, but the single slot had already moved on, so they could never fail. Now each changed input (dim, wash, res, new lights array, new world) gets a fresh memo whose last plan is the base, and the test asserts a new plan and `stats.plans === 2`. A repeated call must hit.
3. **L7 (sight mask ignored):** the walled-torch radius goes from 48 to 80, so the light now reaches past the wall and the existing "zero beyond the wall" asserts actually test the mask.

Result on the fix: tsc 0, 573/0, green exit 0, sims identical, smokes and pins untouched (no test titles changed), EA plants **42/42** (41 plus C1, with L11 re-anchored to the new colour).

## Carries (not must-fix)
- B plan speed (above) → step 34, next to the kit's full-map-cost note.
- In both builds, `visibleCells` with a wall origin is not moved to an open cell (102/400 fuzz cases differ from r3). The plan calls `openCell` first, so torches are right. Fog of war reusing `visibleCells` directly would see from inside the wall. Carry to the symmetric-LOS item.
- F-1 diagonal bleed and the asymmetric pairs (N-1) are the same as r3; the kit carries them.
- N-3 draw budget (4734 ops at 844×390 res 4) is the same as r3; it goes to steps 32/33 offscreen blit.
- origin/main's kit commit subject says "CN-010 light format", but the kit body says "no CN in this step". This is docs only; flag to CoS.
