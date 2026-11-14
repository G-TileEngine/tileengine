# Step 33i r1 kit review: motion, sway and shore foam live (QA, 2026-11-13 23:36 GMT)

**Verdict: NOT OK TO SEND.**
- 3 code must-fixes for EA: M-1, M-2, M-3.
- 1 kit must-fix: G1, closed by the QA test-only qfix `refs/cmp/s33i-qfix-r1`.
- 4 should-fixes to the step text.

Reviewed under guide-3 and checklist 2a489a84.

Inputs were copied to `qa-runs/step-33i-review/`:

| Input | sha |
|---|---|
| bundle | `327c427c` |
| `s33i-plants-r1.py` | `e61129ff` |
| s33h verify report | `9638a31d` |
| `kit-backup-r33i` (sha list) | `1dc56e06` |

Proto ref: `refs/cmp/s33i-proto-r1` = `a32764a4` (tree `2b30a0c7`) on `6eacd03c`. `origin/main` is `6eacd03c`.

## Gates and kit
- **Gates:**
  - tsc 0; green 624/0/0/0. The base is 618.
  - Pins `61fad786` / `1e5dd82c` / `45a3dbaa` / `4d7bbf48` / `d7f64a09` are unchanged.
  - Sims match base, and the 33h shipped test `e1dc7ffd` is unchanged.
  - The smoke lines match except the heap smoke delta: +0.69 vs +0.70 MiB, which is measurement noise. Note it as "byte-identical except the heap delta".
- **Size:** 295 changed lines (+247/−48) in 13 files. All caps hold, and every cap is proto + 4. The counts include the test (87/91).
- **Import lines:** as stated. No clock reads or new rAF in `src`. Scope stays within motion, sway and shore.
- **Kit files:** all 5 match the sha list and the live files. The step file has base `6eacd03c` and test `241bc879`. The README and spine agree with it (base, proto, 624/0, 295 lines, test sha).
- **EA plants:** 42/42 on the proto, and 42/42 again on the qfix. Base: 6/6 shipped tests fail, 7/7 with the qfix.

## EA rulings vs kit text and proto
1. **Leafy = asset `motion.sway`, overridable per placement.** The proto does this. The kit says so in ruling 3, but Open question 1 is still open and mentions CN-017. **S-1:** close OQ1 as "no CN-017".
2. **Tiles share one motion clock; objects keep the hash offset.** The proto passes 0 for tiles and `hash32(seed, sheet, c, r)` for objects. Ruling 1 says "tile offset 0" but never says it narrows s32 ruling 9 for tiles, and OQ2 is still open. **S-2:** say "narrows s32 ruling 9 (tiles only)" and close OQ2. The object offset was unpinned; the qfix now pins it.
3. **Carry (h), keyed by clip plus asset id.** The 33h test still passes. The cap is not sound. → **M-2.**
4. **The `after` hook draws the lights in the open frame.** The proto does this, and the driver passes `View.lights`. The kit never says it replaces s32 "Host shell (s33)": "`Canvas2D.lights` after `present`". **S-3.** The driver wiring was unpinned; the qfix now pins it.
5. **Shore noise in map coordinates.** Probe P3 compared every chunk against one whole-map bake: 4 tile sizes × 3 seeds, 67.8 M channel values, **0 differ**. The shipped test only covers a horizontal split. The qfix pins vertical splits and non-square tiles.

## Must-fixes
**M-1, a motion recipe is shared across frame sizes (rulings 1–3).**
- Cause: `plan` stores the recipe under the bare key as well. `pixels()` looks it up by that key, so a JSON-equal `motion` on assets with different frame sizes bakes every atlas at the last-planned size.
- Repro: `node qa-runs/step-33i-review/p/qa-probes/probe-33i.ts p1` prints `bush -> 128x48 | tree -> 128x48`. It should be 64x16 for the bush.
- Effect: a bush and a tree with the same `{sway:{trunkFrom:8}}` both draw the tree's crop.
- Fix: put the frame size in `TileMotion.key`, or key `pixels` by `${key}:${fw}x${fh}`, and pin two sizes.

**M-2, the strip-warning cap re-warns every frame (EA ruling 3, law 13).**
- Cause: `if (ids.size >= 64) ids.clear()`. With 65 or more sheet ids on one clip, every frame warns again.
- Repro: `probe-33i.ts p2` (P2b) prints warnings per frame `65,65,65,65`; it should be `65,0,0,0`. The link's `notices` grows by 65 per frame, without limit.
- Bounds as they stand: per clip ≤ 64 ids. The `WeakMap` frees dropped clips: 20k throwaway clips retain only the notices (P2a: 20k notices, about 5.3 MiB, which is the s34 carry). The total number of clips is not stated anywhere.
- Fix: at 64, stop adding ids instead of clearing. State the cap in Decisions as "≤ 64 ids per live clip (`WeakMap`)", and pin it. That pin also closes the QA plant Q41.

**M-3, the `shoreInvalid` notice code is `shoreInvalid:<field>` (s32: codes are exact).**
- Cause: `warn("shore", \`${code}:${field}\`, msg)` uses the dedupe key as the notice code.
- Repro: `probe-33i.ts p5` prints `["shoreInvalid:foamPx"]`.
- Fix: dedupe on code plus field, but push `code: "shoreInvalid"`. The qfix pin uses `startsWith`, so it passes before and after the fix.

## G1 (mandatory)
The QA plant set is `qa-runs/step-33i-review/plants/qa33i-plants.py`: 34 plants over rulings 1–13, EA rulings 1–5 and the done-means lines.

| | Caught |
|---|---|
| shipped test `241bc879` | **10/34** |
| with the qfix | **31/34** |

21 rule plants were missed by the shipped test, which makes this a kit must-fix:
- Q12, Q13: object offset.
- Q15, Q16: placement override, pickMotion order.
- Q19, Q20, Q22: shore rows, `shore.ms`, waterTiles per tileset.
- Q25, Q26, Q27: driver lights, lights redraw, pixels option.
- Q28, Q29: ramps in the key, `styled`.
- Q30, Q31, Q32: non-square margin, vertical noise origin, margin −1.
- Q33: dig bumps rev.
- Q35: shoreInvalid once.
- Q36, Q37, Q38, Q39: image idle drop, plans LRU, LRU touch, one image per id.

The 3 left after the qfix:
- Q5 (atlas anchor) is equivalent: the draw list reads the anchor from the source sheet.
- Q34 (owner per tile) is equivalent: `plan` caches per recipe.
- Q41 is closed by the M-2 pin.

**QA qfix (test only):** `refs/cmp/s33i-qfix-r1` = `1ab3a872c4555aaf2d6b2a4c4a8aaf9eeaf950a6` (tree `47af80f2`), on `a32764a4`. Patch `qa-runs/step-33i-review/s33i-qfix-r1.patch` `343430dd`.
- It adds one test (45 lines).
- New shipped test sha: **`84db20c6ee09236d015fd32c96cc281347bef1dee450c3f7cab27560b903d182`**, 132 lines.
- **Cap re-based 91 → 136.** Reason: one QA G1 test pins 21 rule plants the shipped test missed.
- Results: tsc 0; green 625/0; lint clean. Size 340 (+292/−48), in band. merge-tree onto main gives `47af80f2`.
- EA must fold the M-1/M-2 pins on top and update the step's test sha, cap table and plant list.

## Performance (mobile)
- **P4:** 128×128 map, 8192 scroll-water tiles, 1500 swaying trees, a 390×844 view (1486 ops). Per frame 1.11 ms: scene 0.57, draw list 0.33, `pixels` lookups 0.20. First scene 6 ms. **No retained growth over 600 frames** (−0.45 MiB after gc).
- **P9:** a fresh `style` object every frame rebuilds the layers (0.45 ms/frame on 128×128; the shore rev stays the same). **S-4:** say "pass a stable style object" next to the host side. Separately, `standings` re-plans each object every frame (a Map touch per object), which is fine at 1500 objects.

## Doc drift
- `ARCHITECTURE-v0` `liquidEdge` is `foam | ice | ember | murk`, with no `"none"`. Ruling 4 and the test use `"none"`. s32 ruling 11 says "another edge". Suggest "any edge other than foam (e.g. `ice`)".
- s32 ruling 9 is narrowed (S-2), s32 "Host shell" lights wording is replaced (S-3), and 33h N-7/carry (h) is resolved by M-2.

## Notes, not blocking
- The DSK/UX points are noted only: `waterTiles` and `styled` as loader host hints (OQ4), and night water cycling night ramps (OQ5).
- The world-motion `warned` set clears at 1024 keys and would re-warn after that. Pathological; the same pattern as M-2. Consider not clearing.
- `pixels()` returns a cached stale-rev shore bake until LRU eviction. It is harmless, since stale ids are no longer drawn.

## r2 addendum (recheck, 2026-11-14)
**Verdict: NOT OK TO SEND.** One code must-fix (M-4, law 13). M-1 to M-3 are fixed and pinned. G1 passes, so no QA qfix is needed for r2.

Files are in `qa-runs/step-33i-review/r2/`: bundle `61307856`, EA plants `7fb557c7`, EA re-anchors `61bc95e8`, kit sha list `4641a314`. The proto is fetched to `refs/cmp/s33i-proto-r2`.

### What checks out
- **Proto and chain:** `8a7d6478` (tree `ce864d21`) → `1ab3a872` → `a32764a4` → `6eacd03c`. The QA qfix is the same commit object (tree `47af80f2`). r2 changes only `world-motion.ts` (5 lines), `fx-live.ts` (1 line) and adds one test (+15).
- **Gates:** tsc 0, green exits 0. Sims are identical. The smoke lines match the Base except the heap delta (+0.69 vs +0.70 MiB). The 33h test is still `e1dc7ffd`. The shipped test matches the proto byte for byte (`48f3bd54`).
- **Probes:** P1 gives bush 64×16 and tree 128×48. P2b gives 65,0,0,0 and P2c gives 64,0,0. P5 gives `["shoreInvalid"]`. P6 (an object whose asset has clips plus sway) has no plan and gives the ANIM hint once. The animated `…a` plan id never reaches an atlas, so dropping the bare-key alias is safe.
- **Plants (G1):** my set (`qa33i-plants-r2.py` `ceb7f631`: the r1 set plus EA's Q35/Q41 re-anchors plus RM1, a key without the size; RM2a, clearing at 64 instead of stopping; RM2b, the warned set clearing at 1024; RM3, the suffixed code). Result: **36/38**. Every rule plant is caught. Q5 and Q34 are equivalent, as ruled in r1. EA's set: **49/49 caught**, and all 49 catching tests fail on the Base (8/8 shipped tests fail there).
- **Size and caps:** 355 changed lines (150–400). Every file matches its cap-table row exactly. The test is 147 lines against a cap of 151, re-based from 91, and the step file gives the reason (QA's G1 test plus the M pins).
- **P4 perf/gc (128×128, 8192 water tiles, 1500 sway objects, phone view):** 0.96 ms per frame (scene 0.43, draw list 0.29, `pixels` 0.24), 6 ms first scene, −449 KiB retained after 600 frames.
- **Kit:** all 6 push-list shas match the sha list and the live files (spine `71c89c25`, step-33h-ab `35c6403c`, step-33i-review `d6cc7d3d`, README `341bf2a6`, step `37f94bd2`, test `48f3bd54`). The step file's base `6eacd03c`, test sha, cap table and plant list (49 + 2 equivalent; QA 32/32 + Q5/Q34) are correct. S-1 (OQ1 closed, no CN-017) is in Ruling 3. S-2 (narrows s32 ruling 9, tiles only) is in Ruling 1. S-3 (replaces "Host shell (s33)" lights) is in Ruling 6. S-4 (stable style object) is under the game side. The smoke wording, liquidEdge ("any other than foam, e.g. ice") and carry (h) are folded into Ruling 13.
- **r1 note closed:** the warned set now stops at 1024 instead of clearing.

### M-4 (must-fix, law 13): the scene link's `notices` can still grow every frame
The caps only bound warnings per live clip object and per world-motion key. Neither bounds the link's `notices` array, which is retained for the whole session and never trimmed. Strip warnings are keyed by **clip identity** (Ruling 13), so a host that rebuilds its effect or clip objects each frame from the same data adds a fresh, identical notice every frame. The s30 loader's asset warnings work the same way when the asset objects are rebuilt. This is growth with frames, not with distinct bad inputs, so it is not an s34 note.
- **Repro** (`qa-runs/step-33i-review/r2/probes/probe-r2.ts` `5f91d5e7`, run from the proto worktree): build the same 65-frame step-strip clip as a new object for each of 5 frames → notices per frame **1,1,1,1,1** (want 1,0,0,0,0 or a hard cap). The same pattern with a rebuilt asset that has bad `ms` gives 1,1,1,1,1. P2a (20k throwaway clips) gives 20000 notices and +5.4 MiB retained.
- **Fix (EA's choice):** cap `createSceneLink`'s `notices` (for example, stop adding at `PLANS_MAX` = 1024, the same "stop, never clear" rule as the warned set), or dedupe pushes by code+message per link with a capped set. Pin it with a test that rebuilds the bad clip every frame for more than the cap and asserts the length stays bounded. Ruling 11's law-13 list and the s34 carry line ("the scene link's `notices` array (unbounded across a session)") need updating.

### Kit note
EA's push list and the step's Read-first line cite this review at `d6cc7d3d`. This addendum changes that sha, so r3 must cite the new one.

## r3 addendum (recheck, 2026-11-14)
**Verdict: NOT OK TO SEND as kitted.** The M-4 code is sound, and there are no code must-fixes. There is one G1 test gap: rule plant RM4g is missed by the shipped test `7fff4169`. A QA test-only qfix closes it, and EA folds it in.

Files are in `qa-runs/step-33i-review/r3/`: bundle `350242d6`, EA plants `58e7bc44`, kit sha list `532ea477`. The proto is fetched to `refs/cmp/s33i-proto-r3`.

### What checks out
- **Proto:** `b1308dfa` (tree `6fa454f3`) on r2 `8a7d6478`. Only `world-scene.ts` (+12/−8) and the test (+11) change. The shipped test matches the proto byte for byte.
- **Gates:** tsc 0, green 627/0. Sims and smokes are identical except the heap delta (+0.65 MiB). The 33h test is still `e1dc7ffd`.
- **M-4 under law 13 (code read plus probes `probe-r3.ts` `3785358c`, `probe-r3b.ts` `0e846c10`):**
  - All 8 pushes go through `tell`. A key enters `said` only on a real push, and only while `notices.length < 1024`, so `said.size ≤ notices.length ≤ 1024`.
  - Within-call repeats are real pushes, so they count toward the cap. P2g: 1100 equal copies in one call give 1024,0,0,0.
  - Once the cap is hit, `tell` returns before touching anything. P2h: a new distinct notice adds 0.
  - P2f: 2000 distinct bad clips rebuilt every frame give 1024 in frame 1, then 0. Heap is flat over 2400 frames (within ±1 MiB, no trend).
  - `calls` increments at the top of `scene()`, before any push, so the asset, fx and world-motion pushes in one call share one tag.
  - The deviation (repeats within one call stay, to keep the 33h pin) is sound.
- **P2a gives 100, not 1024:** the probe's message pattern causes it, not a hidden limit. The `fxTooManyFrames` message is `{subject: strip, count: 65, limit: 64, assetId: <sheet id>}`. It carries the sheet id, not the clip name, and P2a uses sheet ids `s0..s99` (`i % 100`). So it has exactly 100 distinct code+message keys.
- **Probes:** P1 gives bush 64×16 and tree 128×48. P2a gives 100 notices (+333 KiB). P2b gives 65,0,0,0 and P2c gives 64,0,0. P2d and P2e give 1,0,0,0,0. P5 gives `["shoreInvalid"]`. P6 is unchanged.
- **probe-r2 sha:** the file is `5f91d5e7`, which this doc's r2 addendum already cites correctly. `480c0902` was the pre-edit draft (`trunkFrom: 24`), which the chat report quoted by mistake. No file carries the wrong sha.
- **EA's plants:** 54/54 caught, and all 54 catching tests fail on the Base (9/9 shipped tests fail there).
- **Size and caps:** 382 changed lines (in band). `world-scene.ts` is 116 against a cap of 120. The test is 158 against 162, re-based from 91, and the step file gives the reason (G1 plus the M-1 to M-4 pins).
- **P4 (128×128):** 1.01 ms per frame, 5 ms first scene, −462 KiB retained after 600 frames.
- **Kit:** all 6 push-list shas match the sha list and the live files (spine `f648e3a4`, 33h-ab `35c6403c`, review `f2ad3ddd`, README `25ea9fa5`, step `9ddf66cc`, test `7fff4169`). Read-first cites `f2ad3ddd`. Ruling 11 states the bound, including that the seen map is bounded by the list. The s34 notices carry is struck through and closed.

### Plants (G1): `qa33i-plants-r3.py` `c999480a`
This is the r2 set, which needed no re-anchoring because the r3 diff touches no anchor, plus seven M-4 plants. Result against `7fff4169`: **40/45**.
- Q5 and Q34 are equivalent, as ruled in r1.
- RM4a (dedupe key of code only), RM4b (clearing at the cap), RM4c (a cap of 1025) and RM4e (no cross-call dedupe) are caught.
- **RM4f** (within-call repeats dropped): caught by 33h's `host-hookup.test.ts`, which is in green. That counts.
- **RM4d** (the seen map also records refused notices): equivalent through the API. Notices are identical and only memory differs. The bound is checked by code read above.
- **RM4g** (after the cap, repeats of a key pushed earlier in the same call still push, so the list goes past 1024): **MISSED, rule plant.** P2g under the plant gives 1100.

### QA qfix r3 (test only): `refs/cmp/s33i-qfix-r3` = `e6c70c1f` (tree `d47c89c8`) on `b1308dfa`
- One test is appended: "QA r3 qfix: repeats inside one scene() call count toward the 1024 cap …". Two equal strip copies give 2,0,0. 1100 copies give 1024,0,0.
- The new test sha is `b8a05b0a`, at 162/162 lines (exactly at the cap). Patch `qa-runs/step-33i-review/r3/s33i-qfix-r3.patch` `e0524d31`.
- Results: tsc 0, green 628/0, lint clean. RM4g and RM4f are now caught by the shipped test alone. Size is 386 (in band). merge-tree onto main gives `d47c89c8`.
- **EA folds it in:** update the test sha to `b8a05b0a` and the cap table (162/162; re-base to about 166 if EA wants headroom). Add RM4g to the plant list, and record RM4d as equivalent through the API.

### Kit note
This addendum changes this doc's sha from `f2ad3ddd`. The kit has to roll again anyway for the test sha, so r4 must cite the new review sha in both the push list and Read-first. Shipping `f2ad3ddd` and pushing this addendum later would break the sha check, because the live doc would no longer match the cited one.
