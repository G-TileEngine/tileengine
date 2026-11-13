# Step 33a A/B pick (chatB vs chatB2), QA & Build Guard

2026-11-13, checklist `2a489a84` (the new G1: every QA plant must be caught by the build's own tests). Workspace: `/workspace/tileengine-repo/qa-runs/step-33-ab/`. `chatB`, `chatB2` and `ab-summary.txt` were copied in first. Share, /tmp and scratch-ea were not modified. New refs: `refs/cmp/s33qa-b` = `f005115`, `refs/cmp/s33qa-b2` = `6bcee4c`, `refs/cmp/s33qa-fix` = `021422c3`.

## Pick: **B (chatB2)**, with the must-fix patch `s33qa-fix` (below)
Reasons, in order:
1. **Product quality.**
   - B guards the render core itself: a NaN `tMs`/start or a non-finite `stepMs` draws nothing. A draws at NaN, like the proto.
   - B's `toTick` and crossing sort are explicit: time, then list before loop, then index. A relies on a stable sort plus a second `at > t1` guard.
   - B's point reader matches the ruling text more strictly: an entry must be a 2-element `[x, y]`, and any unknown key warns.
   - On the 2^53-lap case both builds hang (so does the proto). A spins the CPU silently forever; B crashes out of memory. Both are fixed by the same one-condition guard.
   - The two builds share the same open issues (S-1, S-2, F-1 below).
2. **Test strength:** about even. Over 47 plants each, A's own tests catch 45/47 and B's 44/47. B's extra miss is the band for a unit layer with no unit, which the patch now pins.
3. **Patchability:** both are easy. B's fx-player is 107/111 and goes to 106 after the patch; A has more headroom (99/111). Neither changes the shipped test.

## 1. Gates (independently verified)
| | A chatB | B chatB2 |
|---|---|---|
| bundle sha256 / verify | `6867954a` ok | `f246bdf4` ok |
| code / tip / tip tree | `83c5aea` / `f005115` / `af64f88b` (code tree `0ba887d3`) | `5f3f83a` / `6bcee4c` / `0643da29` (code tree `7c269897`) |
| base | `6f62eb17` | `6f62eb17` |
| tsc | 0 | 0 |
| serial ×2 | 597/0, 597/0 | 597/0, 597/0 |
| green | 0 | 0 |
| sims / smoke lines | identical to base | identical to base |
| pins (core-types `61fad786`, package.json `1e5dd82c`, depcruise `45a3dbaa`, check-law `4d7bbf48`, lock `d7f64a09`) | unchanged | unchanged |
| shipped test sha256 | `33ce473a…` | `33ce473a…` |
| size (G7 band 150–400) | 249 (+234/−15) | 262 (+244/−18) |
| caps fx-player / types / draw-list / index / read / test | 99/111, 31/36, 68/69, 14/18, 114/118, 113/115 | 107/111, 31/36, 67/69, 14/18, 114/118, 113/115 |
| scope | the 6 kit files plus `handback/` | same |
| merge-tree onto origin/main `b2d6f2fe` (tip / code) | `2476f8bc` / `31c1b356`, clean | `d03ca903` / `7a566104`, clean |
| law 1 / imports | no clock, timer or random; imports camera, draw-list, frames, types | same |
| law 13 churn (100k placeStep + crossed) | +61 KiB, 0.40 µs | +77 KiB, 0.44 µs (proto +67 KiB) |

## 2. Plants (`tools/ab33-plants.py` `04b14dcf`)
Each build gets the 34 graded qa33 plants ported to its own code, plus Q29 (glow add), two common rule plants and 10 rewrite plants of its own. That is 47 per build.

- **Detection:** a plant counts as caught if the shipped test catches it, or else if the build's own render and fx suites do.
- **EA's official plants:** these are CoS's runs (A 20/21, B 23/23). A's C3 is a no-op (equivalent mutant) because A has a second `at > t1` guard. My XA1 drops both guards, and A's test catches it.

| | shipped test | build's own tests | misses (must-fix under G1) |
|---|---|---|---|
| A (log `21cf4267`) | 44/47 | **45/47** | XA4 (a flipped foot), XA9 (fx standing drops the anchor's `dy`) |
| B (log `264d918b`) | 43/47 | **44/47** | XB4 (a flipped foot), XB9 (`dy` dropped), Q23 (a unit layer with no unit plays as ground) |
| B + fix (log `869d25ed`) | 43/46 + XF1 | **47/47** | none (XB4 is replaced by XF1, "foot mirrored again", which the QA test catches) |

## 3. Findings (repro: `node tools/abprobe.ts <clone>`, `7295c9e7`)
- **F-1 (both; must-fix under G1): foot on a flipped unit.**
  - Both builds mirror `foot` (`x' = fw − 1 − x`). A front-unit foot step on a flipped 16-px unit gets `ox: −1` and an air step lands at x 35 instead of 36. The proto gives `ox 0` and x 36.
  - Ruling 4 says foot = `anchorPx`, "the same one the draw list uses", and the draw list does not mirror the anchor.
  - No test pins either reading, so it is a G1 miss either way. Both builders read ruling 5's mirror as covering foot, so the kit text is ambiguous.
  - The patch follows ruling 4 literally (as the proto does). **EA should confirm.** If EA rules the other way, drop the src hunk and flip one assertion.
- **F-2 (both; must-fix): fx standing `dy` and the no-unit band were unpinned.**
  - Dropping `dy` from an fx standing breaks ruling 14's sort key, and nothing caught it.
  - In B, a unit layer whose anchor unit is missing playing as ground (Q23) was also uncaught.
  - Both are now pinned in `tests/runtime/render/fx-player-qa.test.ts`.
- **F-3 (both, and the proto; must-fix because it hangs): `crossed()` past 2^53 laps.**
  - Repro: `crossed([], 1e17-10, 1e17, {from: 0, lapMs: 1})`.
    - The proto and B run out of memory (exit 134).
    - A spins until killed (exit 124 after 15 s).
  - Cause: `k += 1` stops changing `k` once it passes 2^53.
  - Fix in B: add `&& k < 2 ** 53` to the loop condition.
  - Large but finite windows are still linear (1e6 laps: about 120–205 ms, 62–150 MiB in all three). That is the caller's bound; 33h ruling 6 covers it.
- **N-1 to N-4 vs the proto (carries, not rulings):**
  - **NaN `tMs`/start in placeStep:** proto draws, A draws, B returns null (better).
  - **`viewHitMs(1000, 1200, −50)`:** 950 in all three.
  - **`clipEvents(x, NaN)`:** frame null with a warning in all three.
  - **`toTick(15, 0 or NaN)`:** proto NaN, A/B 15 (better).
  - Neither build is worse than the proto.
- **S-1 (both; should-fix, no ruling): strips never animate.**
  - placeStep returns `frame: 0` and no `clip`/`startMs`. A 4-frame strip at 250 ms shows frame 0 in A and B; the proto shows frame 2 (`frameAt(clip, t − start)`).
  - Both builders say so in their Decisions notes.
  - EA should rule it (for example "the step's strip frame = `frameAt(p.clip, tMs − start, stepMs)`") before 33h. Otherwise animated effects freeze on screen.
- **S-2 (both; 33h re-base): one 33h assertion depends on object shape.**
  - With the 33h proto `e89e332e` cherry-picked onto either build, the 33h shipped test is 11/12. "effects on screen" fails only on object shape: it expects `dx: 0, dy: 0, faceSwap: false`, and the builds omit fields that are undefined or false.
  - EA must re-base that 33h expectation onto the merged pick. It is a shape issue, not behaviour.

## 4. Must-fix patch `s33qa-fix` (on B's tip `6bcee4c`)
- **Commit:** `021422c3402a51d88b2ee10acb4aaab5afe13daa`, tree `cedb9704`. Ref `refs/cmp/s33qa-fix`.
- **Patch:** `s33qa-fix.patch`, sha256 `357269f5`.
- **merge-tree onto origin/main `b2d6f2fe`:** `416b0899`, clean.
- **Changes:**
  - `fx-player.ts`: foot is not mirrored (one line removed, one renamed); `crossed` loop condition gains `&& k < 2 ** 53`. Now 106/111.
  - New `tests/runtime/render/fx-player-qa.test.ts` (27 lines, sha256 `d8fc21f6`, 3 tests): foot unmoved on a flipped unit; fx `dy` and sort at the anchor key; front/behind-unit with no unit → fxAir; crossed ends past 2^53 and still fires normal laps.
  - The shipped test is untouched (`33ce473a`).
- **Size:** 288 (+270/−18, handback excluded). Inside 150–400.
- **Checks:** tsc 0, green 0, 600/0 (597 + 3).
- **The new tests fail on unpatched B:** the foot test fails, and the file crashes on the crossed hang.
- The new test file is an addition outside the step's file list; name it in Decisions or the merge note (G6).

## 5. Notes for EA / 33h
- Clarify ruling 5: either "points mirror; foot is the unmirrored anchor" or the opposite. Pin it in the shipped test.
- Rule strip animation (S-1).
- Re-base the 33h "effects on screen" expected object (S-2).
- Keep 33h's lap computation direct (33h review F-2).

## Addendum: s33qa-fix2 (2026-11-13 22:0x GMT, EA rulings on F-1, F-3 and S-1)
EA ruled:
- **F-1:** foot is **not** mirrored. Kept as in `s33qa-fix`.
- **F-3:** keep `&& k < 2 ** 53` in the core.
- **S-1:** must-fix now.
- **G6 line for `fx-player-qa.test.ts`:** approved.

**Commit.** A new commit on top of `021422c3`: `88c3750116c29daeda8ec01f3fef3e6f4a1fb4b4`, tree `50198b0a`. Ref `refs/cmp/s33qa-fix2`; `refs/cmp/s33qa-fix` is unchanged at `021422c3`.
- **Patches:**
  - `s33qa-fix2.patch`, sha256 `da5d36c5`: both QA commits on B's tip `6bcee4c`.
  - `s33qa-fix2-only.patch`, sha256 `638f299e`: the new commit alone, on top of `021422c3`.
- **merge-tree onto origin/main** (still `b2d6f2fe`): `03abf07d`, clean.

**S-1 change.** `placeStep` computes `frame = frameAt(p.clip, tMs - start, stepMs).frame` once and uses it in all four returns:
- the screen/tile overlay;
- the no-unit overlay;
- the unit overlay;
- the fx standing.

`frameAt` is the existing import from `./frames.ts` (render folder only). Behaviour:
- no clip → frame 0;
- a 1-frame strip shows its single stored frame (0 for `[0]`, the same as the proto and the draw list);
- the strip is timed from the step start (effect start + `at`).

**Size and caps.**
- fx-player.ts 106/111: no re-base, so no cap reason is needed.
- types 31/36, draw-list 67/69, index 14/18, read 114/118, shipped test 113/115 (still `33ce473a`).
- `fx-player-qa.test.ts` 35 lines, sha256 `e95bd1eb`, 4 tests.
- Total 296 (+278/−18, handback excluded), inside 150–400.

**G6 note for the merge** (EA approved): "`tests/runtime/render/fx-player-qa.test.ts` is a QA-added test file outside the step's file list (A/B must-fix: foot anchor, fx dy and sort, no-unit band, crossed bound, strip frames); the shipped test is unchanged."

**Checks.**
- tsc 0, green 0: `tests 601 pass 601 fail 0 skipped 0 todo 0` (597 + 4).
- Sims and smoke lines unchanged.

**Plants on the build's own tests: 51/51.**
- The ported set is 46/46 (log `fix2-plants.log`).
- `tools/fix2-extra.py` adds 5/5 (log `fix2-extra.log`):
  - XF1: foot mirrored again;
  - XS1: strip frame stuck at 0;
  - XS2: strip timed from the effect start, not the step start;
  - XS3: strip timed from the absolute clock;
  - XH1: the 2^53 guard removed.
- XS2 was missed on the first draft of the test (`at` was 0). I added an `at: 100` → frame 1 assertion and amended the commit before reporting; `s33qa-fix2` points at the amended commit.

**33h r2 on the fixed pick** (scratch branch only; bundle copied to `qa-runs/step-33-ab/r33h-r2.bundle`, sha256 `05e3cd18`):
- The 33h series `e89e332`, `900b9ae` and `21d028f` cherry-picks cleanly. tsc 0.
- 33h shipped test: 12/13 pass. Full suite: 613/1.
- The only failure is S-2 "effects on screen", on object shape only: it expects `dx: 0, dy: 0, faceSwap: false`, and the pick omits undefined or false fields. No behaviour changed.

**Do the guards agree?** Probe `tools/guard-agree.ts`. Since r2, fx-live computes the last lap directly and no longer asks `crossed` for laps, so the core guard is only a backstop.
- Every extreme case finishes in under 2 ms in both layers, with nothing hanging: tMs 1e17 and `MAX_VALUE`, lapMs 1e-300, castMs −1e17.
- They differ only where the lap counter passes 2^53: fx-live still reports one rounded lap, while the core `crossed` returns none. Nothing calls both on the same window, so this is not a conflict.
- With castMs −1e17, fx-live's lap time rounds (to 96 in one case). It stays finite and harmless.
