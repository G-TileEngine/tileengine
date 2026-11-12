# Step 23 early review (H2c, recipe caps)

**Date:** 2026-11-12 19:47 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** `handoff/steps/step-23-recipe-caps.md` sha256 `f9f30fb22866edee44556fdf8fabedb1ace5a5a68c8735a3de6b9dae72a76227` (133 lines).
**README / spine:** `101a7970fd5fc4cc1fc27549a0258d6e39c798a4f920afd16b03070bcdef7675` / `db8dc8d4ff48950ec22023f37ca7ed97b6427e9a3b8654cc0f6e505cf82ba32d`.
**Prototype:** one commit `f94900701904ec45f2aff9302a28e097332feba1` on `56e998c3a9631c08084aa4afbe8cc5680d0a2be2` (PR #28, step 22 A code `2727c23`). Copied to `/workspace/tileengine-repo/qa-runs/s23-review/proto` (and `h2c-fresh`). `/tmp` was not edited. `refs/cmp/*`, GitHub and Drive were not touched; `main` stayed at `56e998c`.
**Scripts (copied, retargeted off `/tmp`):** greps `bf331b09…`, grep-plants `186e3cac…`, plants `88a82ffd…`, s22 `83acd435…`, s21 `64528e05…`, s20 `bd5f76f8…`, se01 `12b32658…`. EA report `af107cce…`.
**Pins** identical to `56e998c`: core-types `f00c722c`, package.json `1e5dd82c`, depcruise `45a3dbaa`, check-law `4d7bbf48`, lock `d7f64a09`. Node 24.22.1 / npm 11.21.1.

## Result

**OK TO SEND** on proto `f949007` / kit `f9f30fb2…` (133 lines). No must-fix. Three carries, none of them a cap miss.

Independent green **504/0** (base `56e998c` is 498/0; the six new tests in `tests/sim/recipe-caps.test.ts` account for the +6). tsc / lint / depcruise / check:state / check:law clean. G7 **186** of 246 in **15** files, each file exactly 4 under its cap (139 insertions + 47 deletions). Greps **26/26**, grep-plants **21/21**, plants **27/27**. Earlier plants on this tree: s22 **14/14**, s21 **7/7**, s20 **5/5**, SE-01 tests **36/36**, depcruise **13/13**, law **9/9** (SE-01 grep plants are not comparable, as claimed; 7/7 miss on the old structure greps). The six re-anchored SE-01 plants (T22, T23, T27, T34, T34b, T35) are honest: same intents, typography updated to the new `SPRITE_RECIPE_FORMAT` / `v > top` / `checkLimits`+`copy` prologue, and each was CAUGHT with no ADAPT.

`npm run sim` is byte-identical to an independent `56e998c` green: `48/2` `afc89d56…`, `22/28` `b8007292…`. All **20** pinned smoke lines (chaos gen, chaos, exploit-docs, exploit-levels, exploit, levels) are byte-identical to that baseline. No smoke line moves.

## Carries closed

| Carry | Closed? | Evidence |
|---|---|---|
| D4 (wide object under a small node budget) | yes | 100-key object at `nodes` 50 is `NOT_PLAIN`, at 101 it copies. Plant DC1 caught. |
| C1 (R4-era: bad `size.w` is one `badField`, `min(32, side)`, never also `overCap`) | yes | `"x"` / `0` / `-3` → `w` 16, only `badField size.w`. |
| C2 (one bad field leaves the rest of the doc) | yes | every sample field path, `?`; fields outside the holding object/list stay. |
| C3 (`fv < SPRITE_RECIPE_FORMAT`, not literal 1) | yes | `read.ts:48`; T22 re-anchor caught. |
| Frozen `BTF_STAGE_LIMITS` | yes | `Object.isFrozen` true; `stages: 1024`. |
| Per-wave / per-pool entry cap | yes | 145 → `over cap enemyPool`, 144 reads; 1e9 and `2^53+1` length liars refused with no item read; ceiling 4,096 / 4,097 same. A long wave *list* is refused first (`!tooMany(waves)` before `.some`). |
| Manifest stages cap | yes | 1,025 → `over cap stages`, 1,024 reads; `{ stages: 1025 }` reads; ceiling 65,536 / 65,537 / `2^53+1` liar all hold. |
| Live stage seed `-0` is `0` | yes | `rawSeed + 0`; `Object.is(doc.seed, 0)`. |
| `toJSON` never called in the recipe copy | yes | counting `toJSON` is called 0 times; a throwing `toJSON` now reads; G6b grep. |
| Ceilings on every recipe limit key | yes | all 15 `RECIPE_CAPS` keys accept the ceiling and throw the limits `RangeError` at ceiling+1 and at `2^53+1` (`=== 2^53` in IEEE). |
| No stale "step 22" comments in this diff | yes | G6; existing `doc-limits.test.ts` titles are pre-existing. |
| Drivers stop at `limits.ticks` with `"timeout"` | yes | see Drivers below. |
| `createLog` refuses non-string header text | yes | `engineVersion: 5` / `projectHash: true` throw the header `RangeError`. Plant DC3. |
| R4 clamp on a liar that *has* items | yes | length `2^20+1` with `has` / descriptor traps, `nodes: Infinity`, `seen === 0`. Plant DC2. |

**Null limits — mostly closed, one residual (carry).** `null` as a *field* is refused at `docLimits` / `checkLimits` / `levelLimits`. Whole-`null` is refused at `readStage`, `readSpriteRecipe` / `checkLimits`, `createLevels`, and `createLog`. `readAction(..., null)` returns `null` (does not take the default). But a bare `null` as the whole limits *argument* is still treated as omitted at three optional doors via `??`: `readMap(doc, null)` and `readManifest(doc, null)` use `docLimits(limits ?? {})` and read with the defaults; `createWorld({ limits: null })` uses `input.limits ?? DEFAULT_MATCH_LIMITS` and builds a world. The pinned test only feeds `{ side: null }` to `readMap` (and a whole `null` to `createLevels`), so it does not catch this. One-line close: `limits === undefined ? {} : limits` (and the same for `createWorld`).

## Rulings probed

**2 MiB measure** is documented in the step (line 23: "one per value plus the length of every key and string (a JSON-size measure, not exact UTF-8 bytes; for ASCII it is within the punctuation)") and in the `limits.ts` comment. The copy implements exactly that (`size.left -= 1 + (string ? length : 0)`, then `-= k.length`). It is a count, not RSS and not UTF-8.

| Shape near the 2 MiB cap | Measure | Real bytes / heap | Ratio |
|---|---:|---:|---:|
| Many short (base36) keys, 420,000 props | 2,052,013 (1.957 MiB) | heap 33.50 MiB | **17.1×** JS property overhead |
| Supplementary chars (`😀` × 1,048,575) | 2,097,151 | UTF-8 4,194,300; UTF-16 payload 4,194,300; heap ~4.0 MiB | **2.00×** UTF-8 vs the count |
| Short-key object JSON (50,000 props) | 202,013 | JSON UTF-8 402,013 | **1.99×** (quotes / colons / commas uncounted) |
| One ASCII string at the default cap | 2,097,152 exact | heap ~0 (the string body is the measure) | ~1×; cap+1 is `over cap bytes` in 0.1 ms |
| Same at the 16 MiB bytes ceiling | 16,777,216 exact | cap+1 refused; read 0.0 ms | ~1× for a single string |

A cheap many-short-keys input does blow past 2 MiB of *live heap* under this measure, but not by a hostile order of magnitude: about **17×** at the default cap (~34 MiB) and, extrapolated, ~270 MiB at the 16 MiB ceiling. Surrogates cost 2 in the measure and 4 in UTF-8, so they reach ~4 MiB of real bytes at the default cap, not tens of MiB. This matches the step's "not exact UTF-8" wording. Not a must-fix; worth keeping the wording if the CEO ever tightens the measure.

**Ceilings, ceiling+1, `2^53+1`, timing and memory**

| Door | At ceiling | Ceiling+1 | `2^53+1` (IEEE `2^53`) | At-ceiling cost |
|---|---|---|---|---|
| All 15 recipe limit keys | accepted | `RangeError` | `RangeError` | n/a (limits only) |
| All 10 `DOC_CEILINGS` keys | accepted | refused (`docLimits` → `null`) | refused | n/a |
| Manifest stages 65,536 | reads, 9.5 ms, heap 7.29 MiB | `over cap stages` | liar: `over cap stages` | 9.5 ms / 7.3 MiB |
| Pool/wave entries 4,096 | reads, 1.1 ms, heap 0.78 MiB | `over cap enemyPool` | liar: `over cap enemyPool` | 1.1 ms |
| Parts list 2²⁰ | reads OK, 666 ms, live array 8.0 MiB, after read 104 MiB | list is *cut* (SE-01), not a hard refusal; the *limits* value 2²⁰+1 throws | limits throw | 0.67 s / 104 MiB after read |
| `bytes` 16 MiB | reads (then later field errors on a dummy doc), 0.0 ms | `over cap bytes` | limits throw | 0.0 ms |
| Default stages 1,024 / entries 144 | read | 1,025 / 145 refused by name | — | 1.4 ms / 0.5 ms |

`historyBytes` is UTF-8 of `JSON.stringify(history)`, checked after the copy. Its ceiling is the same 16,777,216 as `bytes`. A history whose JSON is already ~16 MiB overflows the document `bytes` cap first (`over cap bytes`); the `historyBytes` ceiling is not independently exercisable when `bytes` is also at its ceiling. Carry / H3 note, not a cap hole at BTF (BTF `historyBytes` is 1,000,000 vs `bytes` 2,097,152).

**Defaults in one place.** Recipe defaults and ceilings live in `RECIPE_CAPS` (15 keys); `checkLimits` is the only reader. A CEO number-only change of a *default* is one edit there — except `BTF_SPRITE_RECIPE_LIMITS` repeats the five optional defaults as handwritten literals (they match today: 32,768 / 2,097,152 / 256). `DEFAULT_DOC_LIMITS.stages` (1,024) is similarly copied into `BTF_STAGE_LIMITS.stages`. Entries use `spots` (default 144, ceiling 4,096) — that part is already one field. Carry: derive the BTF optional totals from `RECIPE_CAPS[k][0]` so a default change cannot drift.

## Drivers

`runTicks` and `runMatch` stop when `clock.tick()` reaches `world.limits.ticks` and return `"timeout"`, the same as at `maxSimMs`. `advance` / `replayTicks` are clamped so the clock never steps past the cap.

| Case | Result |
|---|---|
| `ticks: 50`, `maxSimMs` 100,000 | `"timeout"`, `clock.tick() === 50` (not 51), `runMatch` with a 3,000 ms move ends after 1 round |
| `ticks: 1` | `"timeout"`, clock 1 |
| `ticks: 51` | `"timeout"`, clock 51 |
| Second `runTicks` once already at the cap | clock stays 50, rounds 0, `"timeout"` |
| `createWorld` `ticks` = ceiling 2,147,483,647 | accepted; with `maxSimMs` 90 ends `"timeout"` at clock 9 in 0.4 ms (no hang) |
| ceiling+1, `2^53+1`, `0`, `NaN`, `Infinity` | `createWorld: limits must be whole numbers from 1 to their ceilings` |
| In-place forge `world.limits.ticks = 2^53+1` | throws: `plainCopy` froze the limits snapshot (`ticks` is non-writable). The `world` object itself is not frozen, so a host could still *replace* `world.limits`; that is outside the door. |

## Findings

**Must-fix:** none.

**Carry (close in H3, or a one-line follow-up on this branch):**

1. Bare `null` as the whole limits argument is still the default at `readMap`, `readManifest`, and `createWorld` (`??`). Field-level `null` is already refused. The pinned test does not pass a bare `null` to the optional doors.
2. `BTF_SPRITE_RECIPE_LIMITS` (and `BTF_STAGE_LIMITS.stages`) hand-copy defaults that already live in `RECIPE_CAPS` / `DEFAULT_DOC_LIMITS`. A CEO number-only default change is not literally one edit.
3. `historyBytes` and `bytes` share the 16 MiB ceiling, so `over cap historyBytes` cannot fire at that ceiling; the copy fails `over cap bytes` first.

**For H3 / H4:** the proposed numbers (entries = `spots` 144 / 4,096; stages 1,024 / 65,536; recipe key ceilings 4,096 / 2²⁰ / 16 MiB) behave correctly at the ceiling, one over, and `2^53+1`, with comfortable timing. The 2 MiB measure is honest as documented; do not treat it as RSS or UTF-8. No new smoke-line risk from the driver cap (BTF matches end long before 131,072 ticks). H2's hardening doors are otherwise closed.

## G7 (vs `56e998c`, excl. handback / lock)

15 files, 186 changed lines, each 4 under cap, cap sum 246.

| File | Δ | Cap |
|---|---:|---:|
| `src/btf-adapters/src/sprite-recipe-limits.ts` | 3 | 7 |
| `src/btf-adapters/src/stage-limits.ts` | 4 | 8 |
| `src/core/log/log.ts` | 2 | 6 |
| `src/paint/recipe/fields.ts` | 2 | 6 |
| `src/paint/recipe/limits.ts` | 23 | 27 |
| `src/paint/recipe/read.ts` | 37 | 41 |
| `src/project/read/limits.ts` | 9 | 13 |
| `src/project/read/manifest.ts` | 4 | 8 |
| `src/project/read/stage.ts` | 4 | 8 |
| `src/sim/driver-phase.ts` | 14 | 18 |
| `src/sim/driver-tick.ts` | 4 | 8 |
| `tests/paint/recipe-read.test.ts` | 10 | 14 |
| `tests/project/door-guard.test.ts` | 2 | 6 |
| `tests/sim/doc-limits.test.ts` | 2 | 6 |
| `tests/sim/recipe-caps.test.ts` (A) | 66 | 70 |

## Rebase / r2 recheck `11726b7` (bare-null fix)

**Date:** 2026-11-12 19:58 Europe/London (GMT)
**Kit:** step-23 `800bee4d…` (137 lines), README `ca94052f…`, spine `457d7e70…`. This review file was `3ca36750…` before this section was appended and was otherwise untouched.
**Prototype:** one commit `11726b7ef7ebd32f782fefbfb83c816497eff686` on `56e998c`, replacing `f949007`. Copied to `/workspace/tileengine-repo/qa-runs/s23-review/r2/`. `/tmp` was not edited. `refs/cmp/*`, GitHub and Drive were not touched; `main` stayed at `56e998c`.
**Scripts (copied, retargeted off `/tmp`):** greps `5a21bd31…`, grep-plants `ff480f74…`, plants `ca5a0d7c…`.

### Result

**OK TO SEND.** The r1 bare-null carry is closed. No must-fix. The two remaining r1 carries plus the 17× measure note are named in the step as H3 QA carry (1), H3 QA carry (2) and H4 QA carry (3).

Independent green **504/0**, checks clean. G7 **195** of 263 in **17** files, each file exactly 4 under its cap (145 insertions + 50 deletions). Greps **27/27** (new `G5f-bare-null`), grep-plants **22/22** (new J22), plants **30/30** (NB1–NB3 all caught). Sims and all **20** pinned smokes are byte-identical to `56e998c` and to r1. Pins unchanged.

### Delta vs `f949007`

Four files, +6 / −3, and only the bare-null fix:

- `src/project/read/map.ts`, `manifest.ts`: `docLimits(limits ?? {})` → `docLimits(limits === undefined ? {} : limits)`
- `src/sim/world.ts`: `input.limits ?? DEFAULT_MATCH_LIMITS` → `input.limits === undefined ? DEFAULT_MATCH_LIMITS : input.limits`
- `tests/sim/recipe-caps.test.ts`: three pins, one per door, in the existing "explicit null limits are refused" test

No other source change. Kit edits (137 lines, the three named carries, CEO-approved entries/stages, the folded-in drift) sit outside the proto commit, as expected. No leftover `limits ??` at a limits door.

Per-file caps that moved vs r1: `manifest.ts` 6/10, `map.ts` 2/6 (new), `world.ts` 2/6 (new), `recipe-caps.test.ts` 69/73. The other 13 files are unchanged from r1.

### Bare null, undefined, omitted

Independent probe on the official fixtures, by each door's existing `RangeError` name:

| Door | omitted | `undefined` | bare `null` | explicit default |
|---|---|---|---|---|
| `readMap` | ok | ok | `readMap: limits must be whole numbers…` | ok |
| `readManifest` | ok | ok | `readManifest: limits must be whole numbers…` | ok |
| `createWorld` | world at DEFAULT (ticks 131,072, entries 2,048) | same | `createWorld: limits must be whole numbers…` | same |

### Earlier plants that touch `map.ts` or `world.ts`

SE-01: none (recipe files only); not rerun.

| Suite | Plants | Result |
|---|---|---|
| s20 | F5 | 1/1 CAUGHT |
| s21 | B2, N1, C1 | 3/3 CAUGHT |
| s22 | M1–M6 | **5/6** CAUGHT; **M5 ADAPT** |

M5 ("the map ignores the maker's limits") still searches for `docLimits(limits ?? {})`, which this fix removed. Re-anchored typography `docLimits(limits === undefined ? {} : limits)` → `docLimits({})` fails the named test `map caps (step 22)` (1/1). Typography only; the s22 earlier-plant script should be re-anchored. Not a proto defect.

### Kit typography (noted, not a hold)

- The proto commit message still says "manifest stages cap (1,024 proposed)", though the CEO approved that number at 19:35 and the step body now calls it CEO-approved.
- The ceilings on the original recipe keys remain marked **proposed** in the step (Decisions / line 27). Intentional until the CEO signs them; just typography relative to the other two numbers.

### Carries in the step file

Named as requested: **H3, QA carry (1)** BTF / `DEFAULT_DOC_LIMITS.stages` hand-copy; **H3, QA carry (2)** `historyBytes` and `bytes` share the 16 MiB ceiling; **H4, QA carry (3)** the 2 MiB count lets many short keys reach ~17× in heap. The r1 bare-null drift is folded in and closed.
