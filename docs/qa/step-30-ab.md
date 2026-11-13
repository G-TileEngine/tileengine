# Step 30 A/B: world-to-picture link (lean)

**Pick: B (chatB2, tip 1bce7c2).** The must-fix is tests only: `qa-runs/step-30-ab/b-mustfix-tests.patch`.

Inputs were copied to `qa-runs/step-30-ab/share/`. Refs: `refs/cmp/s30qa-a` = 7047e9e and `refs/cmp/s30qa-b` = 1bce7c2. Both are built on 09f3028. origin/main is c6e4f39, which is 09f3028 plus kit 589d931c (kit only).

## Numbers

| | A (chatB) | B (chatB2) |
|---|---|---|
| bundle sha256 | ac38d70b ✓ | 705cfc1e ✓ |
| tip / code / code tree | 7047e9e / 81af1c0 / 533be4e ✓ | 1bce7c2 / 7871813 / 55c819d ✓ |
| merge-tree onto c6e4f39 | 052cf3ec ✓ clean | 9160f497 ✓ clean |
| code diff vs 09f3028 | 10 files +255/−23 | 10 files +256/−24 |
| world-scene.ts / test | 87/88 · 138/140 | 88/88 (at cap) · 138/140 |
| tsc, serial tests ×2, green | 0 · 563/0 ×2 · pass | 0 · 563/0 ×2 · pass |
| sims, 20 smokes, pins | unchanged | unchanged |
| r2 overlay (e04de4a tests) | 32/2 | 33/1 |
| overlay with the notice line checking codes only | 33/1 (anims) | 34/34 |
| EA plants (s30-plants-r2, re-anchored), own tests | 66/74 | 62/74 (N1 with a B-format anchor) |
| QA plants (Q1–Q34 + G1–G8), own tests | 26 test + 2 gate / 42 | 25 + 2 / 42 |
| culling fuzz 500 / chunk fuzz 100 | 0 / 0 bad | 0 / 0 bad |
| other probes (layer size switching, stability, leaks, notices, collision, r29, offscreen overlay, driver) | same output as proto r2 | same output as proto r2 |

Tool: `qa-runs/step-30-ab/tools/ab30-plants.py`. It runs EA's and my r2 plant lists with per-build anchor overrides; plants with no anchor show as N/A, and none did.

What each build's own tests miss:
- **A:** S20 (the cell is not in the unit key, so a moving unit freezes), Q8–Q11 (the facing, action, offset and sprite key fields), N1 (key collision), N6a/N6b (empty ms[]), Q18, Q25.
- **B:** S5/S6 (the r27 draw order can be reversed), Q9–Q14 (key fields, seed, objects and overlays identity), Q16, N6a/N6b/N6e.

Both miss Q26, Q28 and Q33, and the G4/G6/G7 scene fence.

## A's anims[gid] gap: real, but only seen off-contract
A records `anims[gid]` only for gids that are on the layer when it is baked. B maps every `tileProps.anim`.

Probe `tools/qa2/anims.ts`:
- **Tile placed from the start, or painted into a new `layers` identity (the host contract):** A matches B. The tile animates (sx 0 → 16 at t 200), `dueMs` is 200 then 400, and it is drawn live when chunked.
- **Tile painted in place (same `layers` array) and the next scene comes from a unit moving:** A draws gid 8 **frozen**, bakes it into a chunk, and sets `dueMs` to null (no wake). B animates it.

The scene passes the same `tiles` array through, so in-place edits do show on the next draw in both builds. Only A shows them half-working. The kit says "the host keeps those identities stable", so this is a host contract breach. Still, A deviates from the kit text ("`tileProps[tile].anim` … becomes the layer's `anims[tile]`"), fails the official test, and scans every cell with a `clips.find` on each bake.

Verdict: not visible for a host that follows the contract. It is a real spec deviation and a trap for any editor that paints in place.

## Notice message format: doesn't matter
The kit and r29 name only the codes and the once-per rules. `Notice.message` is "for people", and the kit's only use is `debug.warn(n.code, n.message)`. The failing official assertion pulls `clip "name"` out of proto's sentence. With codes only, both builds pass r29: 5× `clipMsInvalid`, each once per clip, checked before length, with no clipMsLength or clipFpsIgnored.

B's messages name the clip, or the sheet id for asset-level codes, so they are useful. A's are fixed phrases ("clip ms ignored") that don't say which asset or clip; that's a nit.

Both builds aggregate clipFpsInvalid, clipMsLength and clipFpsIgnored to one notice per code per asset, where proto gives one per clip. The kit's "once per asset object" allows this. Because of it, the proto fixture (all the clips in one asset) can't see the N6 plants; the patch splits the fixture.

## R2-N1, Q28 and anything new
- **R2-N1 (non-array `ms`):** both throw. `link.scene` raises a TypeError on `ms.some`, and `clipMs` throws on null. Not fixed in either build.
- **Q28:** both are correct (dy × tileH). Neither pins it; the patch does.
- **New in A:**
  - `warn()` runs on every `scene()` call, cache hits included: assets × clips `badMs` work every frame. Small cost, but needless.
  - The bake does `clips.find` per cell.
  - Generic messages.
- **New in B:**
  - world-scene.ts is at its cap (88/88).
  - The units key stores a missing offset as `null`, so a change from null to `{0,0}` gives a new scene with the same picture. Harmless.
  - start() after dispose returns before setting live. That is better than A and proto.
- **Both:** the committed HANDBACK doesn't quote kit sha 589d931c (the share copy does).

## Why B
- On code, the builds are equivalent apart from anims: probes and fuzz give identical output, and with the proto tests B passes everything.
- B matches the kit text and the official tests on anims, gives useful messages, and does no per-frame work on cache hits.
- A's tests are slightly stronger (66 vs 62), but each build has one serious hole: A misses S20, B misses S5/S6. The must-fix closes B's holes without touching code. For A, the same test swap would also need a code change (the anims loop).

## Must-fix for B (tests only, caps kept)
`qa-runs/step-30-ab/b-mustfix-tests.patch` (sha256 935d2d05). It applies cleanly on 1bce7c2.

It replaces B's `world-scene.test.ts` with the QA-reviewed proto r2 test file (e04de4a), plus 4 in-line edits. The file stays at 136/140 and no src changes. The edits:
1. The r29 notice check is format-agnostic: it finds the clip name as a word in `message`.
2. The empty ms[] and fps 0.5 clips move to their own asset `calm`, which pins N6a/N6b/N6e.
3. The link-maps world uses `tileH: 8` (expects dy −2), which pins Q28.
4. A `{ layers: [...layers] }` case in the stable-scene bump list pins Q16.

Results with the patch:
- tsc 0, green 563/0, merge-tree onto c6e4f39 = `a8b539303f504ecf9cbaa7604452855f6a5871c8` (clean).
- EA plants 74/74 (N1 with the B-format anchor). QA plants 35 test + 2 gate / 42; still missed: Q26, Q33, G4/G6/G7.

## Carries
- R2-N1 non-array `ms`: zero-line fix (`Array.isArray` in `badMs` and the `clipMs` gate), or a DSK ruling.
- Q26 and Q33 unpinned. Scene fence G4/G6/G7 (kit N-7, next pin CN).
- From r1: N-3 (P3b, 3584 px), N-8 (60 rev/s while walking).
- HANDBACK should quote kit 589d931c. The builder reruns the handback outputs after the patch.
- For the record: A's anims gap is visible only when the host breaks the identity rule.
