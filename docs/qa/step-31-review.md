# Step 31 review: light and glow (EA proto)

## r1 (c687868): superseded by r2
I reviewed r1 until EA sent r2, which changes only the R2-N1 null case. My r1 results:
- 573/0 twice, green passes, 41/41 EA plants.
- Merge onto d0a21b1 is clean: b3e0fb31.
- Every light and visibility probe gives the same output on r1 and r2 (r2 does not touch light or visibility code). All findings below apply to both.

Work for r1 is in `qa-runs/step-31-review/`; work for r2 is in `qa-runs/step-31-review/r2/`.

## r2 (223ffbf, tree b36fdb3e): NOT OK

**Inputs.**
- The bundle `r31-r2.bundle` (8466b547) verifies with head 223ffbf, one commit on c687868. Fetched as `refs/cmp/s31-proto-r2`.
- Kit: step-31 d7aef474, README bb13bc0e, spine e7a014b5. The r1 kit is copied too (step d6f119a7, README a1bb0884, spine a6152da7, plus the kit-backup-r31 files). Project-format r30 is 788fecfa.
- Merge onto origin/main d0a21b1 is clean: **b36fdb3eaf81148ec4ad4a34515e9b0365211459**, equal to the r2 tree.

**Checks.**
- tsc 0. Tests run serially twice: 573/0 both times. `npm run green` passes, including deps and check:law.
- Sims and the 20 smokes match step 30. The pins (45a3dbaa d7f64a09 1e5dd82c 4d7bbf48 61fad786) are unchanged.
- 8 files, +219/−3 (222 lines). Each file is within its cap and the counts match the kit table:
  - visibility 54/58, light 76/80, frames 46/50, render index 9/13;
  - world-scene 88/88 (one line rewritten in place), raf-driver.test 153/157, light.test 70/74, scene-fence 13/17.
- EA plants: 41/41.
- **Build law holds.**
  - `light.ts` and `visibility.ts` are pure: they import only `./visibility.ts` and `./types.ts`, use no Date, performance or DOM, and add no clock or rAF.
  - Nothing outside the kit's file list changed.
  - The light code changes no world input, so it can't make the step 30 scene change.

**R2-N1 against r30 (my null / string / number / object repro).**
- `ms: null` counts as absent: no notice, and nothing throws in the world-scene length check.
- `"100"`, `100` and `{length: 2}` each give exactly one `clipMsInvalid`. That holds across two assets records.
- Every case plays by fps (`[250,250]` at 4 fps) or 8 (`[130,130]`). The stored `ms` is never rewritten.

**Pins.**
- Q26 (the seed key loses the sheet id) is caught by the new Q26 test.
- Q28 (offset y scaled by tileW) is caught by "the link maps…" (b9f9cba).
- Q33 (start() after dispose) is caught by the new raf-driver line.

**Kit.** The lightSource / dim_lights / nightVariant CN is recorded as "not in this step", and the Out of scope section lists format changes.

**What holds up.**
- **Shadowcasting:**
  - An open grid gives the exact Euclidean counts (radius 0 to 8: 1/5/13/29/81/197).
  - All 32 walls of a room are lit, corners included.
  - Map edges are safe. Radius 1000 and Infinity return at once. A light outside the map, or walled in, gives an empty mask.
  - A 256×256 map with radius 200 takes 0.6 ms.
- **Darkness:** the most it reaches over a 101×101 grid of wash and dim values is 23/32 (0.71875 ≤ 0.72), and it never goes down as wash or dim go up.
- **Coverage:** in 1,008,810 sampled device pixels (300 random maps, views, scales and cameras, inside the canvas clip), the darkness fill always matches the plan.
- **Moonlit with a walking unit:** 6 new scenes give 1 chunk build in total, so there is no rebuild storm.
- **Cost:** a moving 40-light plan on a 48×27 map takes 0.66 ms at res 8 and 1.0 ms at res 4. `lightOps` takes 0.2–0.3 ms.

### F-1: light leaks through diagonal walls
Repro (`extra/qa/probes31.ts` V2/V3):
- Torch at cell (2,2) on a 12×12 map, with a closed staircase wall along c+r=8 (cells that touch only at their corners). Without the fix, **36 floor cells beyond the wall are lit**, whole rows on the far side.
- Two walls meeting at a corner, (3,2) and (2,3): light passes through to (4,4) and (5,5).

Cause: the window between two corner-touching walls closes to zero width, and `if (start < end) return;` lets that empty window keep casting.

Fix (one character): `start <= end`. The leak drops to a one-cell bleed (4 cells at c+r=9), and nothing past the wall lights up. Open-grid counts, room walls and all 9 light tests are unchanged.

A floors-by-centre rule would remove the bleed and cut asymmetric pairs from about 24% to 2.4%. It is not in the qfix because it breaks the kit's pillar assertion that (6,3) stays visible. That belongs with the symmetric variant (carry).

### F-2: the mask cache grows without limit
Repro (C3): one torch walked over every cell of a 128×128 map at its night and dim radii leaves **32,768 masks (about 512 MB)** in the cache, because every mask is a full-map `Uint8Array`. On a 256×256 map (the editor's warn line), each mask is 64 KB.

Fix: cap the cache per blockers array: `if (memo.size >= 256) memo.clear();` on the existing line. Worst case is then 256 masks (16 MB at 256², 330 KB on a 48×27 map).

### F-3: three rulings with no test
These plants are missed by every test (`tools/qa31-plants.py` on r2):
- **X2:** `lightOps` drops `fit.padX/padY`, so fills shift on any device whose width isn't a multiple of s (1,122 bad pixels in the coverage probe).
- **X10:** moonlit misses overlays (Ruling 8).
- **X11:** last light wins instead of the max (Ruling 2).

The qfix adds pins for all three. X1 (removing the `+1` slack) is an equivalent mutant: coverage is 0 bad either way.

### qfix
`qa-runs/step-31-review/qfix-r2.patch` (sha256 da9aa262), on 223ffbf. Two files, +9/−7; caps kept: visibility 54/58, light.test 72/74.
- **visibility.ts:**
  - F-1: `start <= end`.
  - F-2: the cache is capped at 256.
  - N-2: the mask key includes `g.cols`.
- **light.test.ts:**
  - one new line in "line of sight" for a diagonal wall;
  - one new line in "masks and plans are cached" checking 300 masks force a recompute and that a different shape gives a different mask;
  - a max-over-lights check added to the end of an existing line in "six-step falloff";
  - a padding check added to the end of an existing line in "stepped glow";
  - an overlay sheet added to the existing moonlit fixture and assertion.

With the qfix:
- tsc 0, green 573/0, merge-tree onto d0a21b1 **593f1b0a3d273b20803425ef74c1d83736da4d8b** (clean).
- EA plants 41/41 (V7 anchor adjusted for the new key).
- QA plants 17/18: X2, X10, X11 and the qfix-only X16 (F-1), X17 (F-2) and X18 (N-2) are all caught. The one miss is X1, the equivalent mutant.
- With the qfix tests run against the unfixed r2 code, "line of sight" and "masks and plans are cached" fail as they should.

### Nits
- **N-1 symmetry:** 24% of visible pairs are one-way on random 25%-wall grids (the kit already says "not symmetric"). Fine for torchlight; fog of war needs the symmetric carry.
- **N-2 mask key ignores the map shape:** a blocks array reused with other `cols`/`rows` returns a mask of the wrong size. Fixed in the qfix.
- **N-3 draw budget on phones:**
  - At wash 1, `lightOps` alone goes past the ≤300 draws at real view sizes: 4 torches at res 8 give 496 ops (844×390 at s1), and 2 torches at res 4 give 546. With 40 torches it reaches 914–4,926.
  - The kit's budget test only uses a 160×96 view.
  - Step 32/33 should draw the plan into one w×h offscreen canvas and blit it once (1–2 draws), or at least merge runs across rows. The kit's "fits the budget" line needs that qualifier.
- **N-4 NaN:** `darkness(NaN, ·)` returns NaN. A plan with a NaN wash then has no darkness but still glows. Treat NaN as 0, or document it.
- **N-5 memo by identity:** a new `lights` array or a new LightWorld object each frame forces a full replan (masks stay cached, about 1 ms). This is a host carry: keep identities stable.
- **N-6 in-place blocker edits** leave the old mask in place. That is by Ruling 3 (host carry), confirmed (C2).
- **N-7 scene fence:** the test-only fence misses dynamic `import("…")` and `require`. That's fine until the pin CN.
- **N-8 kit wording:** line 167 still calls the light CN "PROPOSED r30". The live `data/project-format.md` (82345d47) is already r31 ("r30 light fields ACCEPTED", `staging/CN-light-format.md`). Refresh the kit text and decide whether the kit should depend on r31.

### Carries
- A symmetric variant (Ford) for fog of war, with floors lit by centre. It must also close the one-cell diagonal bleed.
- N-3 draw budget (offscreen light canvas, step 32/33).
- N-4 and N-5.
- Step 30 carries remain open: N-3 chunk signature (P3b), N-8 (60 rev/s while walking).
- EA open question 7: Q26, Q28 and Q33 pins confirmed sufficient.

## r3: 4bb8bb3 (2026-11-13 16:40 GMT): OK TO SEND

- The bundle `r31-r3.bundle` sha256 is 559d30bf…, verified. Fetched as `refs/cmp/s31-proto-r3`, parent r2 `223ffbf`.
- The tree is `593f1b0a`, identical to the QA qfix tree. The diff from r2 has the same patch-id as `qfix-r2.patch` (da9aa262), so nothing else changed. The qfix tree was already run: green 573/0 and EA plants 41/41.
- Merge-tree onto d0a21b1 is clean at `593f1b0a`.
- EA plants `s31-plants-r3.py` sha256 is c3e12815.
- Kit-2: step-31 15fefa9d, README 3c555d7a, spine 5264506a. It folds in F-1 (`start <= end`), F-2 (256-entry cap) and N-2 (map width in the cache key). It cites CN-010 as accepted, which closes N-8, and lists the carries N-1, N-3, N-4, N-5, N-6 and N-7 (moved to the CN-011 draft).
