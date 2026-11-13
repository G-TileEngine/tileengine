# Step 33h (host hookup) review, QA & Build Guard

## r1 (2026-11-13, kit-1 on guide-3; checklist `2a489a84`)

**Verdict: NOT OK TO SEND as kitted.** Two things must change first:
- **F-1 (G1):** the shipped test misses 17 of QA's 39 rule plants. A test-only qfix is ready (below).
- **F-2 (law 13):** ruling 6's lap window still hangs and runs out of memory on extreme finite values. The fix is one line, plus a change to the ruling text.

With the qfix test and the F-2 line folded in (new proto sha and test sha in the step file), it is **OK TO SEND**, after the re-base onto the 33a merge.

Workspace: `/workspace/tileengine-repo/qa-runs/step-33h-review/`. All EA inputs were copied to `ea/` first, and every sha matched: bundle `144db89e`, plants `ff594b87`, result `b3082d87`, and kit `r1-kit-sha256.txt` (4 files, which also equal the live kit). /tmp, scratch-ea and share were not modified. The one new ref is `refs/cmp/s33h-proto-r1` = `e89e332e`.

### 1. Gates (proto `e89e332e`, tree `41772d0f`, on `e3439c1f`)
| Check | Result |
|---|---|
| `tsc --noEmit` | 0 |
| serial ×2 | 609/0 both times |
| `npm run green` | 0 |
| sims and smoke lines vs `e3439c1f` | identical |
| pins: core-types `61fad786`, package.json `1e5dd82c`, depcruise `45a3dbaa`, check-law `4d7bbf48`, lock `d7f64a09` | unchanged |
| fence tests (render-core, canvas2d, raf-driver, scene-fence) | pass, unchanged; no CN-017 needed |
| size / G7 band | 230 (+217/−13), inside 150–400 |
| caps | fx-live 73/77, world-scene 101/105 (extended in place, 37-line diff), types 32/36, index 15/19, test 117/121 |
| merge-tree onto `e3439c1f` | `41772d0f`, clean |
| scope | the 5 listed files only. fx-player.ts is untouched, and nothing from 33i (motion or shore) is present. |
| imports | fx-live: `./frames.ts`, `./fx-player.ts`, `./types.ts` only. world-scene: the render index and the notice type only. |
| law 1 | the host drives everything through `scene(world, {tMs})`. fx-live has no rAF, timer, Date, performance or random. |
| G4 interfaces | all 13 quoted declarations are byte-equal to the code after whitespace normalisation |

**Law 13 memory and time** (probe `tools/probe33h.ts`, `cd82532b`):
- **One looping effect, 100k frames:** +66 KiB, 4.3 µs per frame.
- **A new effect id every frame:** +98 KiB, 6.7 µs per frame. `held()` drops ended effects.
- **10k looping effects resumed after 1e9 ms:** 50k events, 285 ms, +12 MiB (linear in effects, nothing kept).
- **Stores:** the WeakMap and WeakSet are keyed by clip, and there is one previous scene.

### 2. N-1 to N-4 in fx-live
fx-player.ts is untouched (`git diff e3439c1f..e89e332e -- src/runtime/render/fx-player.ts` is empty). Results:

**Resume windows (one call each):**
| Case | Result |
|---|---|
| resume 1e7 ms, lap 1 | 1 fx:loop, 2.0 ms, +179 KiB |
| resume 1e15 ms, lap 1 | 1 loop, 0.4 ms |
| lap 1e-6 | 1 loop |
| lap Infinity, NaN or −5 | no loop and no hang |

**Clock values:**
- tMs NaN, ±Infinity: nothing drawn, fired or viewed, and the last time is kept.
- A clock running backwards fires nothing.
- An empty clip, or no clip, starts at cast.

**F-2 (must-fix, law 13): the lap window loops forever when `(t − start)/loopMs` passes 2^53.** `crossed()` steps `k += 1` from `floor((t1 − from)/lap) + 1`. Past 2^53, `k + 1 === k`, so the loop never ends.
- Repro: `node --max-old-space-size=512 tools/probe33h.ts hang` (resume to tMs 1e17 with lapMs 1) runs out of memory (exit 134).
- Other cases that also run out of memory:
  - lapMs 1e-300 resumed to 1e7;
  - castMs −1e17 with lapMs 1;
  - tMs `Number.MAX_VALUE`.
- These are absurd values, but finite ones, and ruling 6 sends every build into the same loop.
- Fix: compute the one lap directly in `fx-live.ts:51`. fx-player stays untouched. Proposed diff `n2-lap-fix-proposed.diff` (`76fa058f`):
  `const k = lap === 0 ? 0 : Math.floor((t2 - start) / lap), lapAt = start + k * lap, laps: FxEvent[] = k >= 1 && lapAt > t1 && lapAt <= t2 ? [{ type: "fx:loop", at: lapAt }] : [];`
- With the fix: 609/0, tsc 0, and every case above finishes in under 1 ms with 1 loop.
- Ruling 6 text: "the one `fx:loop` per call is the last lap `start + k·loopMs`, `k = floor((tMs − start)/loopMs) ≥ 1`, if it lies in `(t1, tMs]` (computed directly, never by stepping laps)".
- EA plant L1's anchor then needs updating.

**N-5 (should-fix): a non-finite effect field draws forever.** These effects draw one sprite at every time from 0 to 1e6 (repro: `node tools/p2.ts` in a clone):
- castMs NaN;
- piece ms NaN;
- piece at NaN.

This is the 33a placeStep NaN case, coming back through effect data instead of the clock. Suggest, in fx-live: skip an effect with non-finite `castMs`, and a piece with non-finite `at`/`ms`.

**N-6 (should-fix): `views[id]` is NaN** when castMs, hitOffsetMs, a piece ms or commitMs is NaN, because `Math.max(0, NaN)` is NaN. N-3's clamp does not cover NaN. Suggest omitting the view unless it is finite.

**N-7 (note): strip warnings can repeat.** They are kept once per clip object (a WeakSet). A game that rebuilds clip objects every frame would push a strip warning every frame into the link's unbounded `notices`. Suggest keying by `sheet.id + clip.name`, or stating that the game must keep clip identity stable.

### 3. Canopy (C3)
A reused scene drops the cut when the flag goes off. The probe on one link runs on → off → absent → on and gives 2, 0, 0, 2 cut cells, and the source tiles are left intact. EA's C3 is caught, and so are my Q1/Q2.

### 4. Plants
**EA's 46:** 46/46 caught, all failing on the base (log `a3dca421`). On the qfix test: 46/46 again (log `b8c8cbf7`).

**QA's 43** (`tools/qa33h-plants.py`, `6d49a3eb`). Four are excluded:
- Q3, Q4: equivalent (`clipEvents` / `clipPoints` of undefined give no notes).
- Q6: caught by the step-30 world-scene tests.
- Q15: the loop-vs-timeline tie order is unruled. Suggest naming it in ruling 5.

On the shipped test: **22/39** (log `5bdef896`). Missed (F-1):
- Q5: `clipEventsOverCap` is dropped (r2)
- Q7: fx standing sits before the units (r3)
- Q8: fx overlays sit before the world's (r3)
- Q10: the asset box is ignored (r3/r11)
- Q18: views accumulate across calls (r5)
- Q23: laps count from cast, not from start (r6)
- Q24: steps don't replay per lap (r6)
- Q25: the lap base uses the exact time, not the pose (r6)
- Q27: views appear without commitMs (r7)
- Q31: spawn is captured once, not per lap (r9)
- Q33: the hit capture skips a pose equal to the hit (r9)
- Q34: spawn is captured before the step starts (r9)
- Q36: the tile x uses floor, not round, on an odd tileW (r10)
- Q37: `screen` anchors like `target` (r10)
- Q38: `at` beats the target unit (r10)
- Q40: the unit dx is dropped (r11)
- Q43: one strip warning per frame, not per clip (r12)

**Catch rate:**
- proto: **68/85** (EA 46 + QA 22/39);
- with the qfix: **85/85** (log `bea2243b`).

**qfix (shipped test only).** Clone `qfix/`, branch `s33h-qfix-r1`:
- commit `900b9ae6a40319f202835aeffd57ed019ade2c26`, tree `e85ba197`, parent `e89e332e`;
- patch `s33h-qfix-r1.patch` sha256 `dd854715`;
- merge-tree onto `e3439c1f` = `e85ba197`, clean;
- new `tests/runtime/scene/host-hookup.test.ts`: 121/121 lines, sha256 `b5c97db75052cf8a2ed1a3e8d61b8c3a8cdfbbdd990f8b733a7f94c45c3b211c`;
- step total 234 (+221/−13);
- tsc 0, green 0, 609/0, smokes identical;
- no titles changed: the assertions were added inside the existing 12 tests.

The kit edits needed are the Tests sha row, the Acceptance sha, the Size table (117 → 121), the shipped copy and `r1-kit-sha256.txt`. The qfix test also passes with the F-2 line in place.

### 5. Kit
- The shipped test is byte-equal to the proto test.
- There are 12 rulings with exact values, and each pin title equals a test title.
- The interfaces match the exports (§1).
- README row 67, the spine row 123 and the history line 136 cite `e89e332`, `41772d0f`, `e3439c1f` and `c2c2026f…` correctly.
- CN-013 `b4f812f6` and CN-014 `312323e4` match.
- **K-1 (nit):** the step file's Read-first line cites `docs/qa/step-33-review.md` `9fbef069…`. That was the r1 version; the file is now `ba4c0e29` after the r2 section was added at 21:21. Cite it as "r1 section" or use the current sha.
- 33h and 33i are split cleanly.
- Every s32 host carry is named for 33i (a, b, c, d, e, f) or done here (g, the live canopy cut through `createSeeThrough`). Nothing was dropped. "foamPx" goes through `shoreSettings` in (a), and "same foamPx" is (c).

### 6. EA's built-in open answers
1. **Box per sheet:** fine for 33h. A per-frame box can be added later as an optional list without breaking anything. The `centre`/`head` drift on uneven frames is small.
2. **anchor target with no target skips:** agree. Drawing on the caster would show the effect on the wrong unit. The skip is pinned (my Q35 is caught). Name it in Decisions; no notice per frame.
3. **Effects start on the 30 ms pose grid, up to 29 ms late (59 in lite):** fine. Events, hits and views use exact times through the crossing rule; only the picture snaps, which is under 2 frames at 60 Hz. This is consistent with 33a ruling 10.

## r3 addendum (QA, 2026-11-13 22:15 GMT): NOT OK TO SEND, 1 must-fix (one line)

Inputs copied to `qa-runs/step-33h-review/r3/`: bundle `657910c8`, verify report `29b4298d`, plants `f78b252c`, EA copy of QA plants `97700e5d`, kit backup with sha list `315e7098`.

- **Bundle:** proto `ba645792`, tree `2cc3ca87`, needs `49af2cb2`. It is a 4-commit series on `49af2cb2` (r1 `abb1f10`, QA qfix `c2dcdb6`, r2 `58d6247`, r3 `ba64579`). The head's parent is r2, not `49af2cb2` (the step file says this). merge-tree onto `49af2cb2` gives `2cc3ca87` cleanly.
- **Diff:** only the 5 allowed files changed. `fx-player.ts` matches the merge. Pins are unchanged.
- **Gates:** tsc 0; green 614 pass / 0 fail; sims and smokes match base. In-repo test is `70b0e0e1`.
- **Size:** 250 lines. fx-live 75/77, world-scene 101/105, types 31/35, index 15/19, test 135/139. The types re-base reason holds: the merged `types.ts` is 31 lines.
- **QA plants** (re-anchored, `tools-qa33h-plants-r3.py`, shipped test only): 44/49 caught.
  - The 5 misses are Q3 and Q4 (equivalent), Q6 (caught by other suites), D1 and D2.
  - D1 is equivalent: `placeStep` returns null for NaN start, t, at and ms, and for −Infinity start.
  - D2 is near-equivalent. Its one difference is that a non-finite piece whose strip has more than 64 frames still warns. That case is unruled, so it is a nit.
  - H1 (r1 clamp), H2 (tie order), N6a and N6b are all caught. Rule plants: 44/44.
- **Hang probe:**
  - Core `crossed` past 2^53 returns 0 in 0.1 ms.
  - Live 1e17, `MAX_VALUE`, 2^60 (lap 3) and lap 1e-300 each give one lap in under 2 ms, at about 9 MiB.
- **"Exactly one" is sound, not over-tight.** With lap 100, window (50, 260] emits only the last lap @200, and (260, 290] emits none.
  - Nit: at extreme scales the result follows float rounding of `start + k·lap`. Lap 1e-10 at t 1e300 gives `k = Infinity`, so no lap. That is consistent with the ruled formula.
  - Nit: the `Date.now() < 1000` budget can flake on a slow host.
- **r1 findings:**
  - F-1, F-2, N-5, N-6 and the tie order are closed and pinned.
  - N-7 is explained and carried to 33i as (h).
  - K-1 is closed: the citation now reads `ba4c0e29`, which is live.
- **Kit:** all 6 files match the sha list and the live files. The step file's base `49af2cb2` and test sha `70b0e0e1` are right. Rulings 5 (foot not mirrored), 6 (F-3 note) and 12 (S-1) are present and correct.

**Must-fix M-1 (ruling 6, "a loopMs that is not finite and > 0 never loops"):** with `loopMs: Infinity`, the effect draws nothing and never fires `fx:end`.
- Cause: the code uses `lap = Infinity`, so `base = start + 0·Infinity = NaN`. `placeStep` then returns null, and the `fx:end` path is skipped because `lap ≠ 0`.
- Repro: `node qa-runs/step-33h-review/r3/probe-inf.ts`. `loopMs Infinity` gives `-` at every t and fires nothing. `undefined`, `NaN` and `-1` play frames 0–3 and fire `fx:end`.
- Fix (fx-live, 0 lines added): `const lap = e.loopMs !== undefined && Number.isFinite(e.loopMs) && e.loopMs > 0 ? e.loopMs : 0`.
- Pin: one line in the F-2/N-5/N-6 test checks that an Infinity loop draws at 1020 and 1250, fires `fx:end@1400`, and never fires `fx:loop`. The proto fails it (12/1); the fix passes (13/0).
- QA commit `582c7193` (tree `41050cda`, on `ba645792`; merge-tree onto `49af2cb2` gives `41050cda`), patch `r3/s33h-r3-qfix.patch` `4b15a9cf`. tsc 0; green 614/0.
- Size 251: fx-live 75/77, test 136/139.
- Shipped test becomes `e1dc7ffd…`. The step file's test sha, the sha list and the backup must be updated to match.

**Sha list note:** this addendum changes `docs/qa/step-33h-review.md` from `eee0e23d`, so the r3 sha list and push list need its new sha.
