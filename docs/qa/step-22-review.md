# Step 22 lean review (H2b document caps: DocLimits / LevelLimits, QA step-21 residuals, int32)

**Date:** 2026-11-12 16:12 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** `handoff/steps/step-22-document-caps.md` sha256 `b4ae5a8ba6e955d4d83e8ab33ea05a2609faf0b9fb6f8c1add8040129a31a3c7` (177 lines). Copy at `/workspace/tileengine-repo/qa-runs/s22-review/step-22.md` is byte-identical.
**README / spine:** `320b6b97eb79ae7e0ab9b225ac6d65f39bdb57c89758c635f707958f7ee58e2f` / `16586babac572049a6db04ef8e5877f05f883ee34bbe236979c9016e56b34fc9`. Step 21 is unchanged at `5153054d…`.
**Prototype:** one commit `93b4880bcafc9413336ef6143e691f48239bc266` on `411bf98`, copied to `/workspace/tileengine-repo/qa-runs/s22-review/proto`. `/tmp` was not edited. `refs/cmp/*`, GitHub and Drive were not touched.
**Scripts (copied):** greps `9f701100…`, grep-plants `f3307930…` (retargeted at `work/h2b-grep-plants.local.sh`, not `/tmp`), plants `bd4db37d…`, h2-plants-adapted `aa21858e…`, h1-plants-adapted `9d0de29e…`. H2c draft copied from `/tmp/h2c-recipe-draft` (skim only).
**CN:** none, as claimed. Pins identical to `411bf98`: core-types `f00c722c…`, package.json `1e5dd82c…`, depcruise `45a3dbaa…`, check-law `4d7bbf48…`, lock `d7f64a09…`. `rg -n 'core/(limits|plain)\.ts' src/project` is empty; the only core import under `src/project` is `core/notice.ts`.

## Result

**OK TO SEND (pending rebase)** on proto `93b4880` / step `b4ae5a8b…` (177 lines). No holds. The step-21 merge is the release base; this early review is on `411bf98`. After the merge: rebase, retarget G1–G3 / plants, delta recheck.

Green **497/0**, tsc / lint / deps / check:law clean. G7 **250** of 326 in **19** files, each file exactly 4 under its cap. Greps **25/25**, grep-plants **31/31**, plants **28/28**, s21-adapted **22/22** (B1 also removes the clamp), s20-adapted **33/33**. `npm run sim` prints the base lines (`48/2` `afc89d56…`, `22/28` `b8007292…`). The 18 non-docs smoke lines are byte-identical to `411bf98`. The two exploit-docs lines are the new pins (findings 0).

## Smoke-move proof

Independent per-try replay of the official hunter (seeds 1–5 × 400 tries, both boards) against `411bf98` and `93b4880`, same RNG and `checkDoc`, plus the actual reader error on each tampered doc:

| board | base (411bf98) | head (93b4880) | moved | other diffs |
|---|---|---|---:|---:|
| stage-fixed | 581 / 1,419 findings 0 | 516 / 1,484 findings 0 | 65 | 0 |
| stage-weighted | 607 / 1,393 findings 0 | 547 / 1,453 findings 0 | 60 | 0 |

All **125** moved tries are a mutation to `9007199254740993` (2⁵³ + 1) that the base accepted and this step refuses as `over cap number <key>` (`logic` 76, `enemyPool` 15, `project` 13, `playerSpawns` 6, `neutrals` 5, `rev` 5, `loadout` 3, `objects` 2). No other try changes. The pins in `exploit-docs.test.ts` (and the `DOC_PINS` copy, and the 500-try pin 157/343 → 138/362) match these totals.

## Design checks

1. **Step-21 residuals.** `readAction` / `createLog` / `parseLog` copy the caller's limits once (`plainCopy(v, 1)`, defaults used as is) and check `withinCeilings`: a throwing proxy is `null` / `RangeError` / `{ ok: false, error: "bad limits" }`, never a throw from inside. Counted limits are read 5 times; a counted header 4 times; `-0` on `createLog` is stored as `+0`. `plainCopy`'s `nodes` is clamped to `PLAIN_NODES`: `Infinity` or `1e9` plus a 1e9 liar is `NOT_PLAIN` with `seen = 0` in 0.05 ms. L1 bites at the default budget on lengths `-1`, `1.5` and `NaN` (`seen = 0`). `nodes: NaN` is `NOT_PLAIN`. The mobile note is in the step (no code).

2. **DocLimits / LevelLimits.** Ceilings and defaults match the step. `DEFAULT_DOC_LIMITS`, `DOC_CEILINGS`, `DEFAULT_LEVEL_LIMITS`, `LEVEL_CEILINGS` and `BTF_LEVEL_LIMITS` are frozen; `BTF_LEVEL_LIMITS` is a separate copy, deep-equal to the defaults. `BTF_STAGE_LIMITS` now carries every document field (B3 updated) and equals the doc defaults, but is **not** frozen (same as at the base). Boundaries: at the cap yes; cap+1, `NaN`, negatives, floats, `2^31−1` (as a *limit*), `2^31`, `−2^31` and `2^53+1` throw the named limits `RangeError`. A map of 256 × 256 is reachable with `{ side: 256 }`; footprint 256 is reachable with `{ footprint: 256 }`; footprint 9 at the default is `bad field objects`. Lists are refused on the raw `length` before any item is read (a 1e9 liar on `objects` / `waves` is `over cap` in 0.03 / 0.13 ms). `readStage` reads its limits once (11 reads on a counted `BTF_STAGE_LIMITS`; a later flip of `spots` is ignored; a throwing limits object is the existing RangeError). `createWorld` passes `stageLimits` into `readManifest` / `readMap` and `stageLimits.notices` into `resolvePlacements`. 300 off-board neutrals: 257 notices, last `and 44 more`.

3. **Int32 bounds magnitude, not sign.** `rev: 2^31` is `over cap number rev`; `2^31−1` is ok. Field sign / whole-number rules still run first: negative or non-integer `rev` is `bad field rev`, not an int32 miss. On the official weighted fixture, weights `-3`, `2.5`, `0`, `1.5` and `±(2^31−1)` still read; `±2^31` is `over cap number enemyPool`; `NaN` stays `bad field enemyPool`. The stage seed is uint32 (`2^32` is `bad field seed`; `2^32−1` is ok) and is left out of the int32 walk.

4. **Hostile fuzz at the project readers.** Limits objects are guarded. The *document* is not (named H3 carry): a throwing getter, a boom proxy or a revoked proxy throws out of `readMap` / `readStage` / `readManifest` (all < 1 ms, no hang). Cycles and deep nests are `bad field logic`. `toJSON` is not called. Holes in `objects` are `bad field objects`. Just-under / just-over list caps as above. Honest 100,000 count-0 wave entries at a direct `readStage` walk in 55 ms (accepted: no entries cap); a 1e9 *list* liar is refused at `tooMany` before the walk. Through `createWorld` the door budget still binds a huge document.

5. **Changed tests are real, not weakened.** B3 only adds the nine document fields to the expected preset; B4 (weights) is untouched and still passes. The two exploit-docs pins are the int32 rule, proven above. The step-21 draw test now draws for 256 units from a 4,096-id pool at the pool ceiling (40,000 was over the cap). Isolated timings of the same work: idle max **74 ms**, 1-core load max **158 ms**, limit 500 ms / 2× flag 250 ms, load margin ~3.2×. Official test 1/0. Plant D1 still caught (1 named fail). Draw order and the byte pins (sim + 18 smokes) are unchanged.

6. **Build law, scope, H2c.** No new folder, no CN, no pin edits, no `core/limits` or `core/plain` import from project. Recipe / SE-01 C1–C3 are not in this diff (step 23). `rg '\.(only|skip|todo)\(' tests` is empty.

7. **Doc vs code.** README matches the step. The spine *table* matches; the spine intro still says "step 22 … is outlined" (stale, typography, not a hold). Order-of-checks in the code matches the step.

## Residuals (not holds)

- Direct project-reader calls on a live hostile document can still throw (getter, boom proxy, revoked proxy). Limits are already refused by name. This is the named H3 carry.
- Entries inside one wave or weighted pool have no count of their own (as named in the step); they are bounded by the door budget on the `createWorld` path and by `picks` / `waveUnits` (sum of counts, not entry count). A direct `readStage` of a huge count-0 entries list is linear (~55 ms / 100k). The manifest `stages` list is similarly uncapped (1e5 names accepted in 33 ms).
- A live stage seed of `-0` is kept as `-0` (the log header is normalised; JSON already is).
- `BTF_STAGE_LIMITS` is not frozen (pre-existing). `docLimits` uses `??`, so an explicit `null` field silently takes the default.

## H2c draft (skim only, not a review)

The draft in `qa-runs/s22-review/h2c-recipe-draft/recipe.patch` has the outlined caps (totals 32,768 / ceiling 1,048,576; 2 MiB / ceiling 16 MiB; 256 notices), cuts `stored` like `doc`, lands C3 (`fv < SPRITE_RECIPE_FORMAT`) and a plausible C1 (`dim`: `n < 1` now returns `Math.min(32, side)` so a `side < 32` no longer also emits `overCap` from the old `n = 32` fallback). Early notes for the step-23 kit: comments still say "step 22"; the recipe copy still invokes `toJSON` (unlike `plainCopy`); the original recipe limit keys still have no ceilings, only the new totals do. Full review when the kit lands.

## Key numbers

- Green 497/0; tsc, lint, deps, check:law clean; tests ~14.6 s.
- G7 250 / 326, 19 files, each 4 under cap.
- Greps 25/25, grep-plants 31/31, plants 28/28, s21-adapted 22/22, s20-adapted 33/33.
- 18 smokes byte-identical to `411bf98`; sim `afc89d56…` / `b8007292…`; exploit-docs 516/1,484 and 547/1,453, findings 0. Smoke-move proof: 125/125 are 2⁵³+1 → `over cap number <key>`, 0 other diffs.
- Door liar at `nodes: Infinity`: `seen = 0`, 0.05 ms. 1e9 objects/waves: 0.03 / 0.13 ms. Draw load-worst 158 ms / 500 ms (~3.2×).

## Copied shas (`qa-runs/s22-review/`)

- proto `93b4880bcafc9413336ef6143e691f48239bc266` (on `411bf98`)
- step-22 `b4ae5a8b…` (177 lines), README `320b6b97…`, spine `16586bab…`, step-21 still `5153054d…`
- greps `9f701100…`, grep-plants `f3307930…`, plants `bd4db37d…`, h2-plants-adapted `aa21858e…`, h1-plants-adapted `9d0de29e…`
- work logs / probes: `work/proto-green.log`, `work/greps.log`, `work/grep-plants.log`, `work/plants-all.log`, `work/sim.log`, `work/smoke-cmp.mjs` / `.log`, `work/probes.mjs` / `.log`, `work/draw-idle.log`, `work/draw-load.log`

## Recheck r2 `6695f7c` (on the step 21 merge `2f7ec00`)

**Date:** 2026-11-12 17:53 Europe/London (GMT)
**Kit:** step-22 `1c32b969e62baf6f7eddd32f26d9ed6772b2fd59a2f1f6af4fe8e4afe5cc7738` (181 lines), README `65f10cfb…`, spine `eddd15ec…`. Step 21 is unchanged at `41d3aed8…` (the released file; the early-review copy was `5153054d…`).
**Prototype:** one commit `6695f7c6dab654918511a02e13cf96f1c3026292` on `2f7ec00f63a2a131259fcc1b5f21ba4ac37f5fe1` (PR #27, A code `a5301db`), branch `h2b-r2`, copied to `/workspace/tileengine-repo/qa-runs/s22-review/r2/`. `/tmp` was not edited. `refs/cmp/*`, GitHub and Drive were not touched.
**Scripts (copied):** greps `1786a146…`, plants `422d46b4…`, s21-plants `a14c36d6…`, s20-plants `d7effcac…`.

### Result

**OK TO SEND** on proto `6695f7c` / step `1c32b969…`. No holds.

Green **498/0**, tsc / lint / deps / check:law / check:state clean. G7 **257** of 337 in **20** files, each file exactly 4 under its cap. Greps **27/27**, plants **29/29** (G1 caught), s21-adapted **15/15** (D1 still bites), s20-adapted **20/21** (D4 EQUIVALENT, carried to step 23 as named). Pins unchanged. Sim `afc89d56…` / `b8007292…`. The 18 non-int32 smoke lines are byte-identical to step-21 A (`2f7ec00` / A-green). The two exploit-docs pins remain 516 / 1,484 and 547 / 1,453, findings 0.

Parent is `2f7ec00`. Against the previous h2b-r `72c3b63` (on `6e76f05`) / original `93b4880`, the step-22 patch is the same document-caps work rebased onto A's code, plus the one-line gesture fallback and its test. The four rebase conflicts landed on A's side: `note()` is still the WeakMap form in `world.ts`, and there is no `NaN` at.

**Gesture fallback.** `createGestureMapper` now does `opts = (isRecord(shot) ? shot : {})`. A failed or throwing options copy is `{}` and is refused by name (`RangeError: createGestureMapper: cellPx must be > 0`); a probe with a throwing `ownKeys` recorded 0 subsequent gets on the live object. Honest options still construct. Official test `"gesture options are never live (step 22)"` matches. Plant G1 is caught by that test. Grep J32 (same edit) turns K5f-gesture to FAIL (`got [none]`).

**Draw.** Still 256 units from a 4,096-id pool at the ceiling (A's test title kept; the 40,000-id pool is gone). Plant D1 still caught (1 named fail).

**Kit vs proto.** Base SHA, proto `6695f7c`, 257 / 337, the gesture ruling, and the six test titles match the code. The spine step-23 row now carries the H2c leftovers and drivers (`runTicks` / `runMatch`) advancing past `limits.ticks` (step-21 verify C3). The stale spine intro ("step 22 is outlined") is fixed.

Doc drift, not a hold: (1) **Do not touch** still lists `src/runtime/**`, but the file list and the gesture ruling require changing `src/runtime/input/gestures.ts` — builders should follow the file list. (2) README's Lines cell still says "177 (code diff ~257)"; the step file is 181 lines.

### Key numbers (r2)

- Green 498/0; all checks clean.
- G7 257 / 337, 20 files, each 4 under cap.
- Greps 27/27, plants 29/29, s21-adapted 15/15, s20-adapted 20/21 (D4 carried).
- Sim unchanged; 18 smokes identical to `2f7ec00`; exploit-docs pins 516/1,484 and 547/1,453.
- Copied shas under `qa-runs/s22-review/r2/`: proto `6695f7c…`, step `1c32b969…`, README `65f10cfb…`, spine `eddd15ec…`, greps `1786a146…`, plants `422d46b4…`, s21 `a14c36d6…`, s20 `d7effcac…`. Logs: `work/proto-green.log`, `work/greps.log`, `work/sim.log`, `work/plants-all.log`, `work/gesture-probe.log`.
