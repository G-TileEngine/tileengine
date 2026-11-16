# step-ed-e4-blend-core: Effect Designer E4. Editor core 1 (scope §4.1–4.2, §8 E4, gap X6): the part/beat model gets its real beats (Travel, and `at-hit` = Hit; carry (d)), `blend` merges two effects with all 5 combine rules (base hit, A/B/Both per layer and beat, Mix, budgets with max-per-knob Punch, provenance), the budget meter maths, and RISKY impact marks (M-B2). Carries (e), (f), the flatten `""` pin, the Fit-dropped ride and the H foot are closed. No UI, no runtime change.

Step id: step-ed-e4-blend-core          Revision: r<N> (start at r1; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`5d4c00fb`** (`5d4c00fbcebbe1c8aac220f12fdf19feb7ddcbd2`, main: docs only on top of `3a7a1bb6` — CN-020 ACCEPTED `7b1970d2`, CN-026 step ride `433cb84`, the ED-E3 QA review `5d4c00fb`; test floor 805/0). Branch: `step/step-ed-e4-blend-core-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`. The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-ed-e4-blend-core-r<N>.bundle 5d4c00fb..step/step-ed-e4-blend-core-r<N>`, then `git bundle verify`. Upload the bundle and a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`.
Hand-back location: `handback/step-ed-e4-blend-core/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 in full in it.
Depends on: ED-E1 (merged): `src/editor/effect/fit.ts` (`FIT`, `beatOf`, `fit`, `flatten`), `src/editor/effect/parts.ts` (`PARTS`, `partsOf`, `checkParts`, `snapMix`, `blendSeed`), `src/runtime/render/fx-doc.ts` (`DOC`, `stepsOf`, `stepTimes`, `docToLiveFx`). ED-E2 (merged): `PATH.kinds` (`fx-path.ts`), `ride` (CN-026). E1/E2/E3 step docs on main: `step-ed-e1-converter-seed.md` (`2961f015…`), `step-ed-e2-travel-paths.md` (`1c15efea…`), `step-ed-e3-match-link.md` (`8a151970…`).
Read first: BUILD_GUIDE.md §0, §2 (engine law), §6 (green), §7; the scope `/workspace/share/effect-designer/scope.md` r5 (sha256 `5047f4c0…`) §4.1 (beats), §4.2 (the 5 combine rules), §6(a), §7 CN-020, §8 E4, §9 M1, §13 M-B2; DSK's review (`review-dsk.md` `bc1c4a8f…`); `bold-inputs-librarian-modes.md` (`08f08ea2…`, Modes idea 3); CN-020 `handoff/change-notices/CN-020-effect-parts-format.md` (**ACCEPTED** on main, `a60aec99…`, see § Prerequisites); QA's r1 review `docs/qa/step-ed-e4-review.md` (`798ea888…`, M1, S1–S4); UX `ux/effect-designer-v3-ux.md` (`2622814f…`) and the UX review items 1–3 (Swap, A/B badges, "Trimmed … · Undo").
Kit: kit-1 **r4**, 2026-11-16 (r1 → r2 after QA's r1 NOT OK TO SEND: M1 G6, S1–S4, ruling 15, rebased onto `5d4c00fb`; r2 → r3 after QA's r2 NOT OK TO SEND: M1 G6 of QA's S1 line + `effect-e4-qa2`, S5, S6, catalogue wording; r3 → r4 after QA's r3 NOT OK TO SEND on a test pin only: G6 of `effect-e4-qa3`, no code change). Engine Architect. Proto `/tmp/ede4` branch `proto/ede4-r4`, head **`ea207da1`** (`ea207da1b4855003c0e4848029839caccca7966f`, tree `813d788d`), parent `9b3fc8d4` (the r3 fixes); 6 commits on the Base `5d4c00fb` (r1 `04a02e1c`, QA's pin `00f0bf75`, the r2 fixes `67a44a99`, QA's r2 fix `84a5f159`, the r3 fixes `9b3fc8d4`, QA's r3 pin `ea207da1`; G-TileEngine noreply author and committer on all). 9 files, +338/−10 = **348 changed lines** (src 110, tests 238). Green 832/0 (805 + 14 EA r1 + 4 QA G6 + 4 EA r2 + 2 QA G6 r2 + 2 EA r3 + 1 QA G6 r3). EA plants 77/77 (`ede4-plants-r3.py`), QA r1 plants 19/19 (`ede4-qa-plants-r2.py`), QA r2 plants 12/12 (`ede4-qa2-plants-r3.py`), QA r3 plants 8/8 (`ede4-qa3-plants-r4.py`). Bundle backup `/workspace/share/step-ed-e4-proto-r4.bundle`.
Carries: see § Not in this step. `package.json` (`1e5dd82c…`), the lock (`d7f64a09…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and `src/types/core-types.ts` (`d6d08696…`) are unchanged. **No core-types change, no runtime change and no format change** (E4 reads only CN-020's `parts`/`part`, already read since E1). The editor now imports two runtime functions (`stopMs` from `feel.ts`, `hitWhiteMs` from `fx-light.ts`; ruling 10), so deps go 361 → **363** (two files, one edge each); the depcruise config is unchanged and passes.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete).

## Prerequisites (status at kit r4 time; EA checked, not assumed)
- **CN-020 (parts) is ACCEPTED on main — met.** `handoff/change-notices/CN-020-effect-parts-format.md` landed in `7b1970d2` ("CN-020 effect parts format + RESERVED (CEO SEND)"), sha256 `a60aec99eec5f78b2631ffa540479b8a86a5de4d67fd6f1ec254d8b8386e6670`, status "**ACCEPTED** (DSK 2026-11-16 19:1x London; EA asked, for the ED-E4 merge)". It is on the Base `5d4c00fb` unchanged. E1 shipped on the PROPOSED text and E4 follows the ACCEPTED one; rules 1–7 did not change in what E4 reads.
- **Librarian catalogue rev 25 — met.** `behaviour-library/behaviours.json` sha256 `87836060edf009c3a88be7dd9f6e26b27d2f686b988b43f844efdf5cab710544`, `catalogue_rev` 25, validator 0/0: **L50** (`parts`/`part` ACCEPTED, `variant_seed`), **L51** (N5 presets and the default reaction table, all IDEA) and **L52** (`ride`). The catalogue lives in the Librarian's behaviour library on the box (`/workspace/tileengine/behaviour-library`), not in the repo and not in this kit or its push list; E4's code reads no catalogue.
- **No merge blockers remain.**

## Goal
E1 gave the editor a half merge: `flatten` is "Both on every beat", Mix only seeds, Punch is the base's, and beats are list positions. After this step (pure editor maths in `src/editor/effect/`, testable in Node, no DOM):
1. **Beats are real.** A travel step before the hit is **Travel**; an `at-hit` step after the hit is **Hit** unless it holds or fades (then **Linger**), as scope §4.1 maps them (carry (d), E2 ruling 14). Fit trims by these beats.
2. **`blend(a, b, …)` is the full merge** (scope §4.2): one hit moment (the base wins, Swap = the other base), A/B/Both per layer and beat, Mix (RISKY: a "mix" pick blends paired pieces), budgets enforced at merge time with Punch as the max per knob (carry (f)), and provenance on every moved part. It returns the doc, the trim lines, the A/B badges and the meter.
3. **The meter** gives particles, draws, lights and steps against 48 (32 preset) / 60 / 2 / 12 and the one-line "… · Undo" (UX review 3).
4. **Impact marks (RISKY, M-B2):** the hit moment, the hit-stop and hit-white windows and the four beat spans, from the same timing the converter uses, so a host can time numbers, shake and hit-white to the hit without the sim waiting.
5. **Carries closed:** (e) Fit pins an unknown `connect_step`; Fit keeps one hit moment after a drop; the flatten `""` pin; a Fit-dropped ridden step; the H foot (ruled unchanged, pinned).

## Rulings
1. **Place and layering.** New `src/editor/effect/merge.ts` exports `MERGE`, `layerOf`, `keyOf`, `meter`, `impactMarks`, `blend` and the types below. `fit.ts` changes as ruled here (2, 4, 7, 11) and exports `countOf`, `lit`, `shiftOther` and `join`; `flatten` keeps its signature and is now `join` + `fit` (same output as E1 apart from rulings 2, 7 and 11). The editor imports render values and types only (`fx-doc.ts`, `fx-path.ts`, `fx-particles.ts`, `frames.ts`) and `core/notice.ts` as a type, as in E1; depcruise already allows `src/editor`. Nothing in `src/runtime`, `src/sim` or `src/core` changes; play never reads `parts`, `part`, `from` or `nudge_ms` (CN-020 rule 1). The A/B side type is `AB`, never a `Card*` name (check:law `no-card-types`). Since r2 the editor also imports `stopMs` (`feel.ts`) and `hitWhiteMs` (`fx-light.ts`) as functions (ruling 10). Deps 112 modules / 357 deps → 113 / **363** (r1 361; the two r2 edges).
2. **Beats (carry (d), E2 ruling 14).** `beatOf(doc, i)`: (a) a step whose part (the first part with that id) names **exactly one** beat gets that beat (E1). (b) Otherwise the list-position beat `pos` is `cast` before the hit step, `hit` at it, `linger` after it (E1). (c) It is refined: before the hit, a `PATH.kinds` step (`straight`, `swerve`, `bounce`, `orbit`) is **`travel`**; after the hit, a `start_mode: "at-hit"` step is **`hit`** unless `hold_ms` > 0 or `fade_out_ms` > 0 (then `linger`; scope §4.1 "Hit = at-hit, Linger = at-hit + hold/fade"). The hit step itself stays `hit`. (d) When the step's part names two or more beats and the refined beat is not one of them, `pos` is used, so a part's beats bound the answer (QA's E1 pin "a multi-beat part uses timing" stays green: its `straight` steps sit in a cast + hit part). Fit uses `beatOf`, so an `at-hit` pop after the hit is no longer trimmed as Linger, and Travel is its own beat for "a side's last step in a beat". Pinned by tests 1, 2, 3, 5, 9.
3. **Layers and keys.** `layerOf(doc, i)` is the step's part kind when that kind is one of `PARTS.kinds`; otherwise (no part, a dangling part, or an unknown kind kept per CN-020 rule 4) `sparks` for a `particles` step and `shape` for the rest. `keyOf` = `"<layer>:<beat>"` (for example `sparks:hit`); it is the unit of picks and badges. Pinned by test 2.
4. **Rule 1: one hit moment, the base wins.** `blend(a, b, {base, mix, mint, preset?, picks?})`: `base` is the card dropped onto; Swap = `base: "b"` (UX review 1). `join` (E1 flatten's first half, unchanged: base steps and knobs first, the other side's first 12 steps as `at-time` steps re-timed onto the base hit, fresh ids `mint("p-")` then `mint("s-")`, `from: {effect, rev}`, the blend seed, `ride` per E2 ruling 11). **The base hit step is never dropped by a pick (r2, QA S1): it is kept by its index (`stepTimes(base.doc).hitIndex`), never by its id**, so the step itself is never lost. **(r3, QA r2 M1, adopted as G6)** When the base hit's id can't name it, because it is not a string, is `""` (which `stepTimes` ignores, so the hit would fall to the last step), or repeats an earlier step's id (`connect_step` would resolve to that earlier step), the hit step gets a minted id (`mint("s-")`, after `join`'s ids) and `connect_step` names it. So the blended doc's one hit moment is always the base hit. When picks or Mix move the base hit, every other-side `at-time` step moves by the same amount (`shiftOther`, clamped 0…20000), so the other side still lands on the hit. Pinned by tests 3, 4, 19, 23.
5. **Rule 2: A, B or Both per layer and beat.** `picks` maps a key to `"a"`, `"b"`, `"both"` or `"mix"` (ruling 6); a missing key and any other value is `"both"` (E1's behaviour). `"a"` keeps card A's steps with that key and drops B's; `"b"` the reverse; `"both"` keeps both. Each step keeps its own `tint_ramp` (fire core + frost rim stay two-coloured). A **moved** part left with no step is dropped from `parts` (so a dropped layer leaves no chip); the base's own parts are all kept. `badges` has one entry per key present on either side: the pick, or for `"mix"` the side that won its discrete values (UX review 2). Pinned by tests 3, 5.
6. **Rule 3: Mix (RISKY: the `"mix"` pick).** `t = snapMix(m) / 100` (0/25/50/75/100), where **(r2, QA S2) `m` = `mix` clamped to 0…100 when finite, and 50 when `mix` is `NaN` or ±Infinity** (so the base wins the tie); the guard is in `blend`, and `join` and the seed get the same `m` (`parts.ts` is untouched). In a `"mix"` key the k-th base-side step pairs with the k-th other-side step (list order within the key). The pair becomes **one** step: the base-side step keeps its id, part and start fields; each `MERGE.scale` value both sides have as a finite number becomes `A + (B − A) × t` (`particle_count` and `*_ms` rounded to whole numbers, the rest to 0.01); the `MERGE.pick` values (`kind`, `picture`, `tint_ramp`, `light_ramp`, `light_mode`, `particle_motion`, `ease`) come from A when t < 0.5, B when t > 0.5 and the base at 0.5 (an absent value is removed). The other's paired step is dropped; unpaired steps stay. Ramps are keys, so Mix never invents a colour. Mix also feeds the blend seed (E1 ruling 8). Unlocks: Artbreeder-style crossbreeds of one layer. Could go wrong: a mix of a `straight` and an `orbit` may look like neither; Breed (E5) and one-tap undo are the guard, and it's off unless the maker picks it. Pinned by tests 5, 20.
7. **Rule 4: budgets while you merge, never silent.** `blend` ends with `fit(doc, sides, {preset})`, so particles go pro rata (floored) to ≤48 (≤32 preset; **r2, QA S4: a `particle_count` that is a number but non-finite or negative counts 0, with a `Bad count <v> on step <n> → 0` line**; the value is left in the doc for the converter's own note. **r3, S5: before the sum, each count is clamped to the runtime's per-effect ceiling `PARTICLES.perEffect` (48, `src/runtime/render/fx-particles.ts`, the same ceiling `particleRead` clamps to), with a `Capped count <v> on step <n> → 48` line, and Fit writes 48 into that step**; so Fit's total and counts are never `NaN` or `Infinity`. **r3, S6: Fit's `Bad count` and `Capped count` lines name only steps that play (enabled, among the first 12) after Fit's trims, numbered after the trims, in step order, and come first among Fit's lines**), the 2 largest lights stay, steps go to 12 (E1 ruling 10, with ruling 2's beats). **Fit keeps one hit moment (new, EA):** E1 assumed only a Linger step could move the base hit, but a trail or spread step before the hit can be dropped too, which moved the base hit and left the other side behind. After its drops, Fit moves every other-side `at-time` step by the base hit's shift (`shiftOther`). No new line: the trim line already says a step went. **Punch (carry (f)):** for `hit_stop_ms`, `hit_white_ms` and `shake`, the `"punch:hit"` pick decides: `"both"` (default) = the max of the finite values (one side's value if only it has one; else the base's); `"a"`/`"b"` = that card's value exactly (absent stays absent); `"mix"` = `round(A + (B − A) × t)` when both are finite, else the winner's. A finite value over its cap (`MERGE.punch`: hit-stop 150, hit-white 200, shake 3) is capped with one line `Capped <knob> <v> → <cap>`, after Fit's lines. `squash`: `"both"` = `true` if either is `true`, else the base's; otherwise the picked or winning card's. Every other knob stays the base's (E1 ruling 9). Pinned by tests 6, 8, 11, 15, 16, 22, 24, 25, 26.
8. **Rule 5: provenance.** Unchanged from E1: each moved part has `from: {effect, rev}` and `fromInfo` reads it (info only; "source removed", "changed", tap to update). `blend` adds no `from` to base parts and writes no `nudge_ms`. Pinned by test 3 (the dropped part) and E1's tests.
9. **Meter.** `meter(doc, messages = [], {preset?})` reads the first 12 steps whose `enabled` is not `false` (what plays): `particles` = Σ `particle_count` of `particles` steps (12 when absent; **0 when non-finite or negative, with a `Bad count <v> on step <n> → 0` line** (r2, QA S4); **at most 48 (`PARTICLES.perEffect`), with a `Capped count <v> on step <n> → 48` line** (r3, S5); `countOf`. Ruled as is (report-only): a count of 2.5 counts 2.5, and a string or `null` count counts the default 12, as an absent one; the meter counts a `NaN` or ±Infinity count as 0 while the runtime plays the default 12 (as ruled; the `Bad count` line flags it); Fit writes 48 into a disabled or past-12 step over the ceiling (pre-existing, no line)), `draws` = particles + the other steps (one draw each), `lights` = steps whose `light_mode` (or the `light` alias) is `steady` or `pop`; `steps` = every step record (13+ show the overflow). Caps 48 (32 preset), `MERGE.draws` 60 (`FX_BUDGET.effect`), 2, 12. The numbers are demand, not what the runtime draws after its own caps. `line` is `""` with no messages and no bad counts, else the messages then any `Bad count` / `Capped count` lines (same what-plays filter and numbering as Fit's, ruling 7) not already among them, so a blend's line names each step once, joined with ` · ` plus ` · Undo`. `blend` returns `meter(result, messages, {preset})`. Pinned by tests 7, 8, 17, 22, 24, 25, 26.
10. **Impact marks (RISKY, M-B2).** `impactMarks(doc, grid?)`: `hitMs` = `stepTimes(doc).hitMs`, the same number the converter passes as `LiveFx.hitOffsetMs`; `hitStep` = the hit step's id (`null` when it has none); **(r2, QA S3) the windows use the runtime's own functions, imported, not re-derived:** `stop` = `[hit, hit + stopMs(hit_stop_ms, grid.stepMs ?? 1, grid.reduce, grid.flashes)]` (`feel.ts`: snapped up to the step grid, capped 150, **50 with flashes**, none under reduce) and `white` = `[hit, hit + hitWhiteMs(hit_white_ms).ms]` (`fx-light.ts`: clamped **40…200**); each is `null` when the runtime plays none (0, negative, non-finite, absent). `grid` is the host's live grid (`stepMs`, `reduce`, `flashes`); without it the step is 1 ms; `endMs` = `stepTimes(doc).endMs`; `beats` = for each beat the `[min start, max end]` of its enabled steps among the first 12 (ruling 2), or `null`. The host plays numbers, shake and hit-white at `castMs + hitMs` from the sim's event; **the sim never waits** and nothing here reads time. Unlocks: hits that land on the frame for every effect, including merged ones (the beat row's marks in E7/E8). Could go wrong: drift on slow phones (34b budgets guard it; the marks are data, not a clock). Pinned by tests 9, 18, 21.
11. **Carry (e): Fit pins the hit.** Fit writes `connect_step` = the hit step's id when `connect_step` is absent, `""`, not a string, or names no step among the first 12 (an unknown id or one past 12 is `unknownRef` in the converter and plays the last of the first 12, so a drop could move the hit). A good id is kept. Pinned by test 10.
12. **Flatten `""` pin (E2 ruling 11, carry).** No code change: an empty or non-string `ride` on a moved step is removed, even when the other side has a step whose id is `""`. Test 12 pins it (it fails on the E2 r4 bug: registering `""` ids and looking up `""`). Pinned by test 12.
13. **Fit drops a ridden step (CN-026 rule 5, E2 carry).** No code change: the rider keeps its `ride`, and the converter gives `unknownRef` `steps[i].ride` and plays it at its anchor. Pinned by test 13.
14. **H foot (E2 carry, ruled: unchanged).** In `fx-live`, H = the cell foot without the unit's sub-tile `dx`/`dy`. Measured: a named-anchor (`centre`) travel piece whose caster stands at offset (0.5, 0.25) is drawn +8, +4 px all along the path ((40, 28) → (72, 28) vs (32, 24) → (64, 24)); a plain piece is unchanged. That is the drawn sprite's offset riding along, so the piece leaves the drawn hand. It matters only for a caster caught mid-step, which turn-based casting never does (cast and move are separate phases). **E4 changes no render code**; test 14 pins today's numbers so any change is deliberate (a render or perf step may revisit it). Pinned by test 14.
15. **One clock, no rules.** No `Math.random`, `Date`, timers or wall time; the same inputs give the same doc (test 8). No HP, mana, cost or `Card`/`Deck` identifiers. Inputs are never mutated (steps are copied before edits). Law 13: every list is bounded by its inputs (≤ base steps + 12 moved steps; ≤ 5 beat spans: the 4 named beats plus an unknown one).
16. **G6: QA's pin adopted (r2, M1).** QA's `tests/editor/effect-e4-qa.test.ts` (fix ref `refs/cmp/ede4-qa-fix-a` `8e5c8341`, parent `2013db05`, noreply; 35 lines; 4 tests; sha256 `03323745…`) is adopted verbatim and shipped. Adopted by `g6-adopt.sh … --keep-ref` as a fast-forward onto the r1 proto `2013db05`: `8e5c8341` (tree `84aa16f5`), green 823/0, pins unchanged; then rebased with the r1 commit onto `{B8}` (`00f0bf75`, the file byte-identical). Floor 819 → 823. QA's plants Q1–Q19 are all caught on r2 (Q16–Q18 needles re-pointed to the r2 marks code; Q20 retired by QA). Pinned by tests 15–18. **G6 again (r3, QA r2 M1):** QA's `refs/cmp/ede4-qa-r2-fix-a` `84a5f159` (parent `67a44a99`, tree `7fd9979b`, noreply; bundle `e38de80a…`) is adopted verbatim by `g6-adopt.sh … --keep-ref` as a fast-forward: its one `merge.ts` line (ruling 4's mint condition) and `tests/editor/effect-e4-qa2.test.ts` (22 lines, 2 tests, sha256 `e2385ec7…`), green 829/0, pins unchanged. Floor 827 → 829. QA's r2 plants Q21–Q33 are all caught (Q25 retired by QA; Q30/Q31 needles re-pointed to the r3 code). Pinned by tests 23, 24. **G6 a third time (r4, QA r3 M1):** QA's `refs/cmp/ede4-qa-r3-fix-a` `ea207da1` (parent `9b3fc8d4`, tree `813d788d`, noreply; bundle `3074aa7d…`) is adopted verbatim by `g6-adopt.sh … --keep-ref` as a fast-forward: `tests/editor/effect-e4-qa3.test.ts` only (11 lines, 1 test, sha256 `9d8a3058…`; 48 and −0 are good counts, 48.4 and 49 cap with the value as given, the meter names a capped step), no code change; green 832/0, deps 363, pins unchanged. Floor 831 → 832. QA's r3 plants Q34–Q41 are all caught. Pinned by test 27.

## CN / format questions (for DSK and the Librarian; report-only, nothing filed)
- **No new CN.** E4 reads CN-020's `parts`/`part` exactly as E1 does and writes only existing step fields, knobs and CN-020 keys (`parts`, `part`, `from`). `picks`, `badges`, the meter and the marks are editor API, never saved.
- **CN-020 is ACCEPTED on main** (`a60aec99…`, `7b1970d2`; § Prerequisites). The two notes EA asked DSK to fold in or confirm stand as read against the ACCEPTED text: (1) a blended doc may hold more than 6 parts (both sides' parts of one kind); CN-020 rule 6 already says `overCap` warns and keeps all, and E7's chip strip shows ≤6; (2) rule 2 (ids never reused) holds, because moved parts and steps get minted ids.
- **Librarian rev 25 has shipped** (`behaviours.json` `87836060…`, rev 25, validator 0/0: L50 `parts` + `variant_seed`, L51 reactions all IDEA, L52 `ride`; in the Librarian's behaviour library, not in the repo or the kit). E4 needs no new L-entry.

## Files to create or change (and nothing else)
| File | Change | Proto (lines changed) | Cap (lines changed) |
|---|---|---|---|
| `src/editor/effect/merge.ts` | new: `AB`, `Pick`, `Gauge`, `Meter`, `Span`, `Marks`, `Blend`, `MERGE`, `layerOf`, `keyOf`, `meter`, `impactMarks`, `blend` (r2: S1 hitIndex, S2 mix guard, S3 runtime marks, S4 meter Bad count; r3: QA's mint line (G6), meter lines via `badCounts`) | 77 | 81 |
| `src/editor/effect/fit.ts` | `beatOf` (ruling 2), carry (e) pin (ruling 11), Fit's re-anchor (ruling 7), `join` split out of `flatten`; export `countOf`, `lit`, `shiftOther`, `join`; r2: `countOf` counts a bad count 0, new `badCounts`, Fit's Bad count line (S4); r3: the 48 ceiling and `Capped count` line (S5), what-plays and post-trim count lines (S6) | 33 | 37 |
| `tests/editor/effect-e4.test.ts` | new, shipped (9 tests) | 71 | 71 |
| `tests/editor/effect-e4-carries.test.ts` | new, shipped (5 tests) | 45 | 45 |
| `tests/editor/effect-e4-qa.test.ts` | new, shipped, QA's G6 pin (4 tests; ruling 16) | 35 | 35 |
| `tests/editor/effect-e4-r2.test.ts` | new, shipped (4 tests: S1–S4) | 35 | 35 |
| `tests/editor/effect-e4-qa2.test.ts` | new, shipped, QA's r2 G6 pin (2 tests; ruling 16) | 22 | 37 |
| `tests/editor/effect-e4-r3.test.ts` | new, shipped (2 tests: S5, S6) | 19 | 19 |
| `tests/editor/effect-e4-qa3.test.ts` | new, shipped, QA's r3 G6 pin (1 test; ruling 16) | 11 | 37 |
Total ≤ 400 changed lines (proto 348: src 110, tests 238). Caps follow STEP-TEMPLATE (proto + 4); shipped tests are byte-identical, so their cap is their proto. Under the scope's ~380 because Fit, the seed and provenance already landed in E1.

## Interfaces to match (quoted exactly; bodies elided)
```ts
// src/editor/effect/merge.ts
export type AB = "a" | "b";
export type Pick = AB | "both" | "mix";
export type Gauge = { readonly n: number; readonly cap: number };
export type Meter = { readonly particles: Gauge; readonly draws: Gauge; readonly lights: Gauge; readonly steps: Gauge; readonly line: string };
export type Span = readonly [number, number];
export type Marks = { readonly hitMs: number; readonly hitStep: string | null; readonly stop: Span | null; readonly white: Span | null; readonly endMs: number; readonly beats: Readonly<Record<string, Span | null>> };
export type Blend = { readonly doc: FxDocValues; readonly messages: readonly string[]; readonly badges: Readonly<Record<string, AB | "both">>; readonly meter: Meter };
export const MERGE = {
  punch: { hit_stop_ms: 150, hit_white_ms: 200, shake: 3 }, draws: 60,
  scale: ["seconds", "bend", "hold_ms", "fade_out_ms", "particle_count", "particle_life_ms", "particle_pull", "light_radius"],
  pick: ["kind", "picture", "tint_ramp", "light_ramp", "light_mode", "particle_motion", "ease"],
} as const;
export const layerOf: (doc: FxDocValues, i: number) => string;
export const keyOf: (doc: FxDocValues, i: number) => string;
export function meter(doc: FxDocValues, messages?: readonly string[], o?: { preset?: boolean }): Meter;
export function impactMarks(doc: FxDocValues, grid?: { stepMs?: number; reduce?: boolean; flashes?: boolean }): Marks;
export function blend(a: Source, b: Source, o: { base: AB; mix: number; mint: (prefix: string) => string; preset?: boolean; picks?: Readonly<Record<string, Pick>> }): Blend;
// src/editor/effect/fit.ts (E1 file; beatOf, fit and flatten keep their signatures)
export const countOf: (s: Record<string, unknown>) => number;   // was private; r2: 0 for a non-finite or negative count; r3: at most PARTICLES.perEffect (48)
export const badCounts: (steps: readonly Record<string, unknown>[]) => string[];   // what plays (enabled, first 12): one `Bad count <v> on step <n> → 0` per bad count, one `Capped count <v> on step <n> → 48` per count over 48
export const lit: (s: Record<string, unknown>) => boolean;       // was private, unchanged body
export const shiftOther: (steps: Record<string, unknown>[], sides: readonly Side[], by: number) => void;
export function join(a: Source, b: Source, o: { base: "a" | "b"; mix: number; mint: (prefix: string) => string }): { doc: Record<string, unknown>; sides: Side[]; messages: string[] };
```
Line formats: `Capped <knob> <v> → <cap>` (knob = `hit_stop_ms`, `hit_white_ms` or `shake`); `Bad count <v> on step <n> → 0` and `Capped count <v> on step <n> → 48` (`<v>` as `String(v)`, `<n>` 1-based); the meter line `<message> · <message> · Undo`. E1's lines are unchanged.

## Smoke lines
Unchanged: `smoke: 0 failed`; sim stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`; stress counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0. The host example still prints `match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands`.

## Existing tests changed by ruling (and only these)
Every E1, E2 and E3 test (QA pins included) passes unchanged on the proto; ruling 2 (d) is what keeps QA's E1 "multi-beat part" pin green. One E4 r2 assertion changed by S6 (ruling 7): test 22's Fit now names 2 bad steps, not 3, because the third is disabled (so `effect-e4-r2`'s sha moved from `da5ab599…`).

## Tests that prove it is done (27 new; ship all seven files byte-identical)
| Shipped file (under `handoff/steps/tests/step-ed-e4-blend-core/`) | Copy to | sha256 |
|---|---|---|
| `tests/editor/effect-e4.test.ts` | same path | `a4b8052892d489169ae25745dbd6d60a50acf4fd051558359e262606878bc3dc` |
| `tests/editor/effect-e4-carries.test.ts` | same path | `9d350f3cdc67aa1fe29f2f14ada7ed73535e40b3a158fe544feb6cb1f62fc9dd` |
| `tests/editor/effect-e4-qa.test.ts` (QA, G6) | same path | `03323745d9eca7669f1df3128b04abda3f0d9f8ec410d8729db6c7aefebbfad3` |
| `tests/editor/effect-e4-r2.test.ts` | same path | `367d2519996b029a98a850a91d690b44ddaecc7af48c5e3318339f8be12dedbe` |
| `tests/editor/effect-e4-qa2.test.ts` (QA r2, G6) | same path | `e2385ec763b8e18e31fc7238c0333f8a31572ffae3ac9ba3c0e18db6040fc29c` |
| `tests/editor/effect-e4-r3.test.ts` | same path | `077aafe5272caafb30901aec6d53ff51f1ed06916c807a8920dc30476acc445e` |
| `tests/editor/effect-e4-qa3.test.ts` (QA r3, G6) | same path | `9d8a3058564c3add1f0dc97cbf3a5c15347961ef0618f406683cfc546202eb15` |

`tests/editor/effect-e4.test.ts`:
1. "E4 beats (carry d): one named beat wins; else a travel kind before the hit is travel, an at-hit step after it is hit unless it holds or fades (linger), the rest by list position; a multi-beat part keeps the position beat when the refined one is not its own"
2. "E4 layers and keys: a step's layer is its part's kind, else sparks for particles and shape for the rest (an unknown part kind falls back); the key is layer:beat"
3. "E4 blend picks (rule 2): a keeps A's steps, b keeps B's, both (the default, and any unknown value) keeps both; the base hit step always stays (rule 1); a moved part left with no step is dropped; badges name the pick"
4. "E4 blend re-anchors (rule 1): when a pick drops base steps before the hit, the other side's steps move with the base hit, clamped at 0"
5. "E4 Mix (rule 3, RISKY pick mix): pairs the k-th steps of a layer and beat; values both sides have are scaled (ms and counts whole, the rest 0.01), discrete ones come from A below 50, B above 50, the base at 50; the base keeps its id and timing; the badge shows the winner"
6. "E4 punch (rule 4, carry f): both = the max per knob, squash if either, capped at hit-stop 150, hit-white 200, shake 3 with a Capped line; a or b takes that side's knobs exactly; mix scales them"
7. "E4 meter: particles, draws, lights and steps against 48 (32 preset), 60, 2 and 12 over the first 12 enabled steps (steps counts all); the line joins the trims with · and ends · Undo, empty when nothing was trimmed"
8. "E4 blend runs Fit (rule 4): its lines and the meter of the result come back; the same inputs give the same doc"
9. "E4 impact marks (M-B2, RISKY): hitMs is the converter's hitOffsetMs; hit-stop and hit-white windows start at the hit (capped); beat spans cover enabled steps; no knob gives null"

`tests/editor/effect-e4-carries.test.ts`:
10. "E4 carry (e): Fit pins connect_step to the hit step when it is absent, empty, not a string or names no step in the first 12, so a drop never moves the hit"
11. "E4 Fit keeps one hit moment: when Fit drops a base step before the hit, the other side's at-time steps move with the base hit (clamped at 0)"
12. "E4 flatten pin (E2 ruling 11): an empty or non-string ride is removed even when the other side has a step whose id is the empty string"
13. "E4 Fit drops a ridden step: the rider keeps its ride and plays at its anchor with unknownRef (CN-026 rule 5)"
14. "E4 H foot (E2 carry, ruled: unchanged): a named-anchor travel piece carries its caster's sub-tile offset (dx, dy) along the whole path; a plain piece does not"

`tests/editor/effect-e4-qa.test.ts` (QA's pin, adopted verbatim; ruling 16):
15. "E4 QA punch: the cap is > cap on every pick (150 stays, 151 caps); NaN never wins the max; a/b mean the card, not the base (Swap); squash both keeps the base's false"
16. "E4 QA mix: hold/fade ms round whole; a one-sided scale value is kept; a Mix that moves the base hit moves the other side (clamped at 20000)"
17. "E4 QA meter and parts: disabled steps draw no draw and no light; blend's meter uses the preset cap; the base's unused part stays"
18. "E4 QA impact marks: 0 and Infinity give no window (the runtime plays none); fractions round; steps 13+ are not spanned"

`tests/editor/effect-e4-r2.test.ts`:
19. "E4 r2 S1: the base hit is kept by its index, never its id: an id-less base hit survives a pick of the other side, gets a minted id and connect_step names it"
20. "E4 r2 S2: a non-finite mix is 50 (the base wins ties); a finite mix is clamped to 0..100"
21. "E4 r2 S3: impact marks use the runtime's own hitWhiteMs and stopMs: a 40 ms white floor, 200 max; hit-stop on the step grid, capped 150, 50 with flashes, none reduced"
22. "E4 r2 S4: a non-finite or negative particle_count counts 0 with a Bad count line, in the meter and in Fit (no NaN total)"

`tests/editor/effect-e4-qa2.test.ts` (QA's r2 pin, adopted verbatim; ruling 16):
23. "E4 QA2 S1: a base hit whose id can't name it (\"\", not a string, or a repeat) is still the one hit moment: it gets a minted id and connect_step"
24. "E4 QA2 S4: 0 is a good count; only the first 12 are named; Fit names bad steps in step order; blend's meter line names each bad step once"

`tests/editor/effect-e4-r3.test.ts`:
25. "E4 r3 S5: a count over the runtime's per-effect ceiling (PARTICLES.perEffect 48) counts 48 with a Capped count line; two Number.MAX_VALUE counts never give NaN or Infinity"
26. "E4 r3 S6: Fit names only bad steps that play (enabled, first 12), numbered after its trims, in step order; the meter does not repeat them"

`tests/editor/effect-e4-qa3.test.ts` (QA's r3 pin, adopted verbatim; ruling 16):
27. "E4 QA3 S5/S4 edges: 48 and -0 are good counts (no line); 48.4 and 49 cap with the value as given; the meter names a capped step too"

Test 14 imports `src/runtime/scene` and `src/runtime/render` (tests may); it builds a two-unit `SceneWorld` as QA's `fx-travel-qa3` does. Tests 3–6 and 8 share two fixtures, `fire` (A) and `frost` (B); their numbers are in § Example. Each of tests 19–22 fails on the r1 code, and tests 25–26 fail on the r2 code + QA's fix (checked).

You may add tests. The hand-back lists each shipped file's sha256, unchanged.

## How a planted bug is caught (EA plants 77/77, `ede4-plants-r3.py`; QA r1 plants 19/19, `ede4-qa-plants-r2.py`; QA r2 plants 12/12, `ede4-qa2-plants-r3.py`; QA r3 plants 8/8, `ede4-qa3-plants-r4.py`; run by `proto-check.sh` / `qa-plants.sh --plants-file` against the seven shipped files)
| # | Plant | Caught by |
|---|---|---|
| 1 | beat: travel kind before the hit stays cast | test 1 |
| 2 | beat: travel also after the hit | test 13 |
| 3 | beat: at-hit after the hit stays linger (carry d) | tests 1, 2, 3, 5, 9, 26 |
| 4 | beat: hold/fade ignored (at-hit always hit) | tests 1, 2, 3, 5, 9, 16 |
| 5 | beat: fade_out_ms not a lasting key | test 1 |
| 6 | beat: hold_ms 0 counts as lasting | test 1 |
| 7 | beat: multi-beat part not bounded | test 1 |
| 8 | beat: single named beat ignored | tests 1, 2, 3, 5, 9, 11 |
| 9 | carry e: unknown connect_step not pinned | test 10 |
| 10 | carry e: id past 12 counts as named | test 10 |
| 11 | Fit: no re-anchor after a drop | test 11 |
| 12 | shiftOther moves base steps too | test 11 |
| 13 | shiftOther no clamp at 0 | tests 4, 11 |
| 14 | shiftOther wrong sign | tests 4, 11, 16 |
| 15 | layer: part kind ignored | test 2 |
| 16 | layer: unknown part kind kept | test 2 |
| 17 | layer: particles not sparks | tests 2, 5 |
| 18 | meter: disabled steps counted | tests 7, 17 |
| 19 | meter: steps past 12 played | test 7 |
| 20 | meter: draws miss particles | test 7 |
| 21 | meter: preset cap ignored | tests 7, 17 |
| 22 | meter: steps counts only the first 12 | test 7 |
| 23 | meter: line without Undo | tests 7, 8, 22, 26 |
| 24 | meter: line not empty when clean | tests 7, 24, 25 |
| 25 | marks: disabled steps spanned | test 9 |
| 26 | marks: span keeps first only | test 9 |
| 27 | marks: white not the runtime's (no 40 floor, no 200 cap) | test 21 |
| 28 | marks: white from hit-stop | tests 9, 21 |
| 29 | marks: hit 0 instead of converter hit | tests 9, 18, 21 |
| 30 | marks: hitStep never null | test 9 |
| 31 | blend: Mix not snapped | test 5 |
| 32 | blend: tie at 50 goes to B | tests 5, 20 |
| 33 | blend: unknown pick read as a | tests 3, 4, 5, 6, 8, 15, 24 |
| 34 | blend: base hit step dropped by a pick | tests 3, 19, 23 |
| 36 | blend: mix keeps both paired steps | test 5 |
| 37 | blend: mix drops unpaired steps | test 5 |
| 38 | blend: pairs ignore rank | test 5 |
| 39 | blend: lerp toward A (inverted) | tests 5, 16 |
| 40 | blend: counts and ms not whole | tests 5, 16 |
| 41 | blend: discrete never switch | test 5 |
| 42 | blend: missing discrete kept | test 5 |
| 43 | blend: picture not discrete | test 5 |
| 44 | blend: moved parts never dropped | test 3 |
| 45 | blend: no re-anchor after picks | tests 4, 16 |
| 46 | blend: Fit not run | tests 8, 24 |
| 47 | blend: preset not passed to Fit | test 8 |
| 48 | punch: both = base knobs (no max) | test 6 |
| 49 | punch: no cap | tests 6, 15 |
| 50 | punch: silent cap | tests 6, 15 |
| 51 | punch: shake cap 4 | tests 6, 15 |
| 52 | punch: pick a/b ignored (max) | tests 6, 15 |
| 53 | punch: mix not scaled | test 6 |
| 54 | punch: one-sided both drops the value | tests 6, 15 |
| 55 | punch: squash not OR'd | test 6 |
| 56 | blend: meter without messages | test 8 |
| 57 | blend: badge for mix is the base | test 5 |
| 58 | flatten re-points an empty ride to the "" step (E2 ruling 11; the r4 bug) | test 12 |
| 59 | a rider on a dropped step is not noted | test 13 |
| 60 | H includes a sub-tile offset (8, 4) | test 14 |
| 61 | S1: id-less base hit not minted (QA fix-a needle) | tests 19, 23 |
| 62 | S1: base hit kept by id, not index | tests 19, 23 |
| 63 | S2: a non-finite mix not read as 50 | test 20 |
| 64 | S2: join seeded with the raw mix | test 20 |
| 65 | S3: hit-stop off the grid | test 21 |
| 66 | S3: flashes cap ignored | test 21 |
| 67 | S3: reduce ignored | test 21 |
| 68 | S4: a bad count counted raw | test 22 |
| 69 | S4: negative count not bad | tests 22, 24 |
| 70 | S4: meter has no Bad count line | test 22 |
| 71 | S4: disabled bad steps named | test 22 |
| 72 | S4: Fit has no Bad count line | tests 22, 24, 25, 26 |
| 73 | S5: no ceiling before the sum | test 25 |
| 74 | S5: no Capped count line | test 25 |
| 75 | S5: Fit keeps the over-ceiling count in the doc | test 25 |
| 76 | S6: Fit numbers steps before its trims | test 26 |
| 77 | S6: count lines name steps 13+ | test 24 |
| 78 | S6: Fit's count lines after its other lines | tests 22, 25, 26 |
| Q1 | punch: cap fires at exactly the cap (>=) | test 15 |
| Q2 | punch: cap off by one (151 passes) | test 15 |
| Q3 | punch: a/b/mix picks skip the cap | test 15 |
| Q4 | punch: both takes max with NaN (typeof only) | test 15 |
| Q5 | punch: Swap reads a/b as base/other | test 15 |
| Q6 | punch: Swap squash a/b as base/other | test 15 |
| Q7 | punch: both squash with no true drops the base's | test 15 |
| Q8 | mix: hold/fade ms not rounded | test 16 |
| Q9 | mix: one-sided scale value lerped (NaN) | test 16 |
| Q10 | mix: hit moved by Mix not re-anchored | test 16 |
| Q11 | shiftOther no clamp at msMax | test 16 |
| Q12 | blend: unused base part dropped | test 17 |
| Q13 | blend: meter ignores preset | test 17 |
| Q14 | meter: disabled non-particle steps drawn | test 17 |
| Q15 | meter: disabled steps' lights counted | test 17 |
| Q16 | marks: 0 ms gives a window | tests 9, 18, 21 |
| Q17 | marks: Infinity gives a capped window (runtime plays none) | test 18 |
| Q18 | marks: fractional ms truncated | tests 18, 21 |
| Q19 | marks: steps past 12 spanned | test 18 |
| Q21 | S1: only an undefined id is minted (a numeric id is not) | test 23 |
| Q22 | S1: minted id not named by connect_step | tests 19, 23 |
| Q23 | S2: Infinity read as 100 (r1) | test 20 |
| Q24 | S2: non-finite mix read as 0 | test 20 |
| Q26 | S3: default grid 30 ms, not 1 | tests 9, 18 |
| Q27 | S4: a zero count is bad | test 24 |
| Q28 | S4: a non-number count is bad (absent counts 0) | tests 7, 25 |
| Q29 | S4: meter repeats Fit's Bad count lines | tests 24, 26 |
| Q30 | S4: Fit's Bad count lines out of step order | tests 24, 25 |
| Q31 | S4: meter names steps 13+ | test 24 |
| Q32 | S1: an empty-string hit id not minted (the r2 bug) | test 23 |
| Q33 | S1: a repeated hit id not minted (the r2 bug) | test 23 |
| Q34 | S5: exactly 48 gets a Capped line (>=) | test 27 |
| Q35 | S5: ceiling off by one (49 counts 49) | tests 25, 27 |
| Q36 | S5: Capped value printed rounded | test 27 |
| Q37 | S5: meter shows no Capped line | test 27 |
| Q38 | S4: -0 is bad | test 27 |
| Q39 | S6: Fit lines read post-Fit counts (Capped lost) | tests 25, 27 |
| Q40 | S6: count lines name disabled steps in Fit only | test 22 |
| Q41 | S5: capped rewrite only when Fit scales | test 25 |
All 77 EA plants and QA's 19 + 12 + 8 (116 rows) fail the shipped tests on the r4 proto's needles. EA plants 1–60 are r1's 59 (plant 35 still **retired as equivalent**: moved steps always get minted ids); 61–72 are r2's (S1–S4; 61 re-needled to QA's mint condition, 71 and 72 re-pointed to the r3 count-line code); 73–78 are new for S5 and S6. Plants 58–60 pin code E4 does not change (E2's flatten guard, the converter's ride note, `fx-live`'s H); 58 is the E2 r4 bug (two needles). Q1–Q19 are QA's r1 plants (`qa-ede4-plants.py` `d61370b1…`, Q20 retired by QA; Q16–Q18 re-pointed at r2). Q21–Q33 are QA's r2 plants (`qa-ede4-r2-plants-fixa.py`; Q25 retired by QA as equivalent; Q30 and Q31 re-pointed to the r3 code with the same bug each). Q34–Q41 are QA's r3 plants (`qa-ede4-r3-plants.py`, unchanged needles). The tests column was measured per plant on the r4 head with `ede4-plants-map-r4.py` (results `ede4-*-result-r4.txt`). A build with different code needs its own needles (QA rewrites them per build, as at E1–E3).

## Example
`fire` (A): `a1` stamp 0–300 (cast), `a2` straight 300–900 in a Travel part with `connect_step: "a2"`, so the hit is ⌈300 + 600 × 0.92⌉ = **852**; `a3` 24 sparks `at-hit` (hit), `a4` stamp `at-hit` + `hold_ms` 300 (linger). Punch: shake 1, hit-stop 50, squash. `frost` (B): `b0` stamp (cast), `b1` swerve, the hit at 714; `b2` 36 `ice` sparks `at-hit`. Punch: shake 2, hit-stop 100, hit-white 40.
- `blend(fire, frost, {base: "a", mix: 50})`: steps `a1 a2 a3 a4 s-2 s-3 s-4`, frost landing at 138 / 438 / **852** (its sparks on fire's hit); sparks 24 + 36 = 60 → 19 + 28 with "Scaled sparks 60 → 47 to fit 48"; Punch shake 2, hit-stop 100, hit-white 40, squash; meter 47/48 sparks, 52/60 draws, 0/2 lights, 7/12 steps, line "Scaled sparks 60 → 47 to fit 48 · Undo"; every badge `both`.
- With `picks: {"shape:cast": "b"}` fire's `a1` goes, fire's hit moves 300 earlier to 552, and frost moves with it (138 → 0, 438 → 138, 852 → 552).
- With `picks: {"sparks:hit": "mix"}` at Mix 75: `a3` and `b2` become one step `a3` with 33 sparks, life 900, 0.52 s, picture `ice` and no `particle_motion` (B's discrete values won: badge `b`); `s-4` and its part go; 33/48, no trim line. At Mix 25: 27 sparks, life 700, 0.38 s, `rise`, badge `a`.
- `impactMarks(fire)`: hit 852 at `a2` (= the converter's `hitOffsetMs`), hit-stop window 852–902 (`stopMs(50, 1, …)`; with a 30 ms grid 852–912, with flashes 852–902), no hit-white; beats cast 0–300, travel 300–900, hit 852–1152, linger 852–1452.
- `blend` on two 12-step effects with a mix pick costs p50 0.14 ms, p95 0.32 ms (EA desktop probe on r1, not shipped; r2 and r3 add O(steps) guards only).

## Decisions note: what to name
`MERGE` values (Punch caps 150 / 200 / 3; draws 60; the scale and pick key lists); the beat refinement of ruling 2 and its bound by a multi-beat part; the layer fallback (sparks / shape); the key `layer:beat`; picks `a`/`b`/`both`/`mix` with `both` as the default and the fallback; the base hit step never dropped; k-th pairing in a mix key; the rounding (`particle_count` and `*_ms` whole, the rest 0.01); the winner at exactly 50 = the base; max-per-knob Punch and `squash` OR; the `Capped` line and its place after Fit's lines; dropping only moved parts left with no step; the meter's "what plays" reading; the impact windows from the runtime's `stopMs`/`hitWhiteMs` (r2); the base hit by index and the minted id for an id-less hit (r2); a non-finite Mix = 50 (r2); a bad count = 0 with its `Bad count` line (r2); the per-step ceiling `PARTICLES.perEffect` with its `Capped count` line, and the count lines' what-plays filter, post-trim numbers and place first among Fit's lines (r3); an id that can't name the base hit (non-string, `""`, a repeat) is minted (r3, G6). Bounds (law 13): `blend` holds at most base steps + 12 moved steps and one badge per key; the meter and marks hold fixed-size records. Nothing grows with edits; nothing is cached.

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 832 passing** (805 + 14 EA r1 + 4 QA + 4 EA r2 + 2 QA r2 + 2 EA r3 + 1 QA r3) and none failing, cancelled, skipped or todo. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto r4 on `5d4c00fb`: 832/0; deps 113 modules / 363 deps; `check:law OK (src)`.)
- [ ] `node tools/pixel-suite/smoke.ts` prints `smoke: 0 failed`.
- [ ] `node tools/host-example/match-picture.ts` prints `match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands` and exits 0.
- [ ] `npm run -s sim` prints stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`.
- [ ] `node tests/perf/stress-budget.ts` counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0.
- [ ] `git diff 5d4c00fb --stat -- package.json package-lock.json .dependency-cruiser.cjs scripts/check-law.sh src/types/core-types.ts` is empty. Pins: `1e5dd82c`, `d7f64a09`, `45a3dbaa`, `4d7bbf48`, `d6d08696`. If a core-types or dependency-rule change seems needed, **stop and report** (core-types waits for E5's CN-022).
- [ ] `git diff 5d4c00fb --stat -- src/runtime src/sim src/core src/fx` is empty.
- [ ] All seven shipped test files are byte-identical to the sha256s above (QA's `effect-e4-qa`, `effect-e4-qa2` and `effect-e4-qa3` above all).
- [ ] Each file within its cap; ≤ 400 changed lines in total.
- [ ] No `Math.random`, `Date`, timers or `Card`/`Deck` identifiers; no hp/mana/cost in `src/`. No UI files.
- [ ] Hand-back complete per `handoff/HAND-BACK.md`, with § Helpers & self-review.

## Floor
805 → **832**: 805 + 14 EA r1 (9 in `effect-e4`, 5 in `effect-e4-carries`) = 819; + 4 QA (G6, `effect-e4-qa`) = 823; + 4 EA r2 (`effect-e4-r2`, S1–S4) = 827; + 2 QA r2 (G6, `effect-e4-qa2`) = 829; + 2 EA r3 (`effect-e4-r3`, S5, S6) = 831; + 1 QA r3 (G6, `effect-e4-qa3`) = 832. One E4 r2 assertion changed by S6 (§ Existing tests changed). Kit tests under `handoff/` are not run on main until merge. The Delivery footer needs at least **832** passing.

## Perf (phone floor)
No runtime code changes (the editor only calls two pure runtime functions), so the draw, particle and light caps, `fx-live` and the 34b numbers are untouched. `blend` runs once per edit in the editor (p50 0.14 ms on two 12-step effects, EA desktop probe), never per frame. The marks are read once per effect. Far under the 18.3 ms p95 phone line.

## Not in this step (carries, with their target step)
- Dice, Breed (6 children, 3 at a time), house-style defaults, "Export clean" in the writer, the narrow effect writer, `history` ops and `group`s (one merge = one undo) → **E5** (CN-022).
- The layer strip, meter line, A/B badges, Swap, Take a layer, Blend card with Mix snaps, beat row → **E7**, on `blend`, `meter`, `keyOf` and `impactMarks`. E7 must show that the base hit step stays even when its key is picked for the other side (ruling 4) and that more than 6 parts show 6 chips.
- Per-layer Mix values (one `t` per key) → **E7** if the CEO wants it; E4 has one Mix for the blend.
- Timing the picture to the marks (numbers, shake, hit-white from sim events, M-B2's full form) and a `die` clip timed to the hit (E3 carry) → host / **E6** preview, on `impactMarks`.
- H foot with `dx`/`dy` (ruling 14) → a render or perf step, only if a mid-step cast ever exists.
- From E2 (report-only): `pathDots` rounding and path-note order → unchanged; an in-memory `ride: undefined` key → no change (JSON can't carry it).
- (a), (c), (g) and the deps rule stay open as in the E1 doc. The ruling 7 `changed`-vs-`cycle` order stays an E7 badge carry.

## Out of scope
Game rules (HP, mana, cost, damage) and any sim, core, runtime or render change. Any editor UI. Any format change. CN acceptance is DSK's; the catalogue rev is the Librarian's.

## Do not touch
`src/types/core-types.ts`, `src/core/**`, `src/sim/**`, `src/fx/**`, `src/runtime/**`, `src/editor/effect/parts.ts`, `package.json`, the lock, `.dependency-cruiser.cjs`, `scripts/**`, `tools/**` (`tools/painter-proto/**` and `tools/ui-shell/**` above all), every E1, E2 and E3 shipped test.

## Open questions
1. (EA → CEO) Mix ("blend" a layer) in this step? **Resolved: yes, keep blend in E4 (the CEO's own answer in Chief Of Staff's chat, 19:09 London).**
2. (EA → DSK) CN-020 to ACCEPTED before the E4 merge. **Resolved:** ACCEPTED on main (`a60aec99…`, `7b1970d2`).
3. (EA → Librarian) Catalogue rev 25 with L50, L51 and L52 before the E4 merge. **Resolved:** shipped (`behaviours.json` `87836060…`, rev 25, validator 0/0; in the Librarian's behaviour library, not in the repo or the kit).

No open questions remain and nothing blocks the merge.

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 832 passing and 0 failing**. Paste the summary line, the smoke line, the host example line, and the sim and stress lines into HANDBACK.md.
- All seven shipped test files are **byte-identical** to the sha256s above.
- The bundle is `5d4c00fb..step/step-ed-e4-blend-core-r<N>` and passes `git bundle verify`. Total ≤ 400 changed lines. Every pin unchanged. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
On branch `step/step-ed-e4-blend-core-r<N>` (base `5d4c00fb`), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer). Run `git bundle create step-ed-e4-blend-core-r<N>.bundle 5d4c00fb..step/step-ed-e4-blend-core-r<N>`, then `git bundle verify`. Upload the bundle and HANDBACK.md to the CEO's Drive. Push nothing to GitHub.
