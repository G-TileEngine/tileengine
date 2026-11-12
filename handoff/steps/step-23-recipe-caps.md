# step-23-recipe-caps: the recipe caps and the H2b carries (H2c). Whole-recipe totals (runs, points, frame tweaks), a 2 MiB recipe document, 256 notices per recipe read and `stored` cut exactly like `doc`, as optional `SpriteRecipeLimits` fields with ceilings on every recipe limit key; SE-01 C1–C3; then the carries from QA's step-22 review and the step-21 / step-22 verifies: a count cap on the entries inside one weighted pool or one wave, a cap on the manifest's stages, a live stage seed of -0 read as 0, `BTF_STAGE_LIMITS` frozen, an explicit `null` limit refused everywhere, the drivers stopping at the tick cap, `createLog` refusing non-string header text, and two tests the base lacks (a wide object under a small budget; the budget clamp shown by a liar that has items)

Step id: step-23-recipe-caps          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `56e998c3a9631c08084aa4afbe8cc5680d0a2be2` (the step 22 merge: PR #28, build A). The diff is always `<base>..<head>`.
Branch: `step/step-23-recipe-caps-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-23-recipe-caps-r<N>.bundle <base>..step/step-23-recipe-caps-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-23-recipe-caps/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: SE-01 (`readSpriteRecipe`, `SpriteRecipeLimits`, `BTF_SPRITE_RECIPE_LIMITS`, `readDoc`), step-22-document-caps (`DocLimits`, `docLimits`, `overCap`, `tooMany`, `BTF_STAGE_LIMITS`, `readManifest`, `readStage`), step-21-hard-limits (`MatchLimits.ticks`, `world.limits`, `createLog`), step-20-every-door (`plainCopy`, `PLAIN_NODES`), step-09b / 14 (`runTicks`, `runMatch`)
Read first: BUILD_GUIDE.md §2 laws 4, 5, 7, 9, 12, M4, M7 and §3 (layers: `src/paint` and `src/project` import only their own files, `types` and `core/notice.ts`); `handoff/steps/step-22-document-caps.md` ("Not in this step"); `docs/qa/step-22-review.md` (residuals, the H2c draft notes); `docs/sprite-recipe-architecture.md` §1.1; `h2-caps-ACCEPTED-2026-11-12` (the recipe rows); `src/paint/recipe/{read,limits,fields}.ts`, `src/project/read/{limits,stage,manifest}.ts`, `src/sim/driver-{tick,phase}.ts`, `src/core/log/log.ts` (as at the base)
Kit: kit-2, 2026-11-12. Engine Architect. Hardening step H2, second half, part two (H2c). The recipe totals, size, notices and their ceilings are CEO-accepted 2026-11-12 (`h2-caps-ACCEPTED-2026-11-12`). Two numbers are **CEO-approved 2026-11-12 19:35** (144 entries per pool or wave, 1,024 manifest stages); one is still **proposed** and flagged in "Decisions" (the ceilings on the original recipe keys). QA's review `docs/qa/step-23-review.md` gave the prototype OK TO SEND with one drift (a bare `null` as the whole limits argument), folded in here. The interfaces below were prototyped and run green (`npm run green`, 504/0) on Node 24.22.1 on the base (prototype branch `h2c`, head `11726b7`, one code commit, built on QA's H2c draft `recipe.patch`); a fresh clone of the prototype runs green. `npm run sim` 48/2 and 22/28 and all 20 smoke lines are byte-identical to the base (no smoke line moves).
Carries: **no Change Notice.** No pinned file changes: `core-types.ts` (`f00c722c…`), `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`), lock (`d7f64a09…`), BUILD_GUIDE, STATES and every state table are unchanged. `src/project` and `src/paint` do **not** import `core/limits.ts` or `core/plain.ts`. No new folder and no new source file, no new dependency rule. Carries in: the spine's step-23 row (QA's step-22 residuals and draft notes, SE-01 verify C1–C3, step-21 verify C3) and step-22 verify C1–C2 (below). Carried on: H3 (a direct project-reader call on a live hostile document), H4 (`restore` uses the default `stepMs`). The prototype is not attached: write your own code against this file.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Close H2. At the base: a recipe's runs, points and frame tweaks are capped per list but not in total (the per-list caps multiply to 4.2 M runs); a recipe document of any size is copied; one read can return any number of notices; `stored` keeps 300 parts when `doc` keeps 256; the recipe copy calls a document's `toJSON`; the original recipe limit keys have no ceiling; a weighted pool or a wave can hold any number of entries; a manifest can list any number of stages; a live stage seed of `-0` is kept as `-0`; `BTF_STAGE_LIMITS` can be edited by anyone who imports it; `runTicks` and `runMatch` keep stepping the clock past `limits.ticks` until `maxSimMs`; `createLog` takes a number as `engineVersion`. After this step each is refused (or cut) by name at the numbers below.

Rulings in this step (Engine Architect and owner, 2026-11-12):
- **Recipe totals are optional `SpriteRecipeLimits` fields** (QA's draft shape): `totalRuns` (parts' runs, `promotedFrom` runs and frame run overrides), `totalPoints`, `totalTweaks` (pose, part and run keys over all frames), each 32,768 (ceiling 1,048,576); `bytes` 2,097,152 (ceiling 16,777,216); `notices` 256 (ceiling 2³¹ − 1). Absent = the default. The totals are counted on the copy after the per-list caps cut each list and before any part is read; over a total → `over cap totalRuns` / `totalPoints` / `totalTweaks` (in that order). `BTF_SPRITE_RECIPE_LIMITS` writes the five values out.
- **`bytes` is counted as the document is copied**: one per value plus the length of every key and string (a JSON-size measure, not exact UTF-8 bytes; for ASCII it is within the punctuation). Past it the copy stops and the read is `over cap bytes`. (A cyclic document now reaches the size cap before the depth guard: `over cap bytes`, as QA's draft.)
- **Notices per read**: at most `notices`, then one `{ code: "noticesCapped", message: "and N more" }` (the step-21 / 22 shape).
- **`stored` is cut exactly like `doc`**: every list the doc caps is cut to the same length in `stored`. Unknown keys stay in `stored` (inside the size cap).
- **No `toJSON` call (QA's draft note).** The recipe copy reads own enumerable keys only; a `toJSON` function is a function value and is dropped like any other.
- **Ceilings on every recipe limit key (QA's draft note; PROPOSED numbers, see Decisions):** `side` ≤ 4,096 (the atlas page side, ARCH §12.6); `parts`, `points`, `runs`, `joints`, `anims`, `frames`, `variants`, `historyBatches` ≤ 1,048,576 (the totals' ceiling); `historyBytes` ≤ 16,777,216 (the document ceiling). The original ten keys stay required, whole and ≥ 0. A missing, bad, `null`, over-ceiling or unreadable limits object is the existing `RangeError("readSpriteRecipe: limits must be integers >= 0")`; each key is read once.
- **SE-01 C1–C3.** C1: a bad `size.w` / `size.h` (non-number or < 1) is one `badField` and the value `min(32, side)`, never also `overCap`. C2: a test that one bad field leaves every field outside the object or list holding it in the doc. C3: `fv < SPRITE_RECIPE_FORMAT`, not the literal 1.
- **Entries per weighted pool and per wave (CEO-approved 2026-11-12 19:35):** each is a stage list like the others and is capped by `spots` (144; ceiling 4,096): `over cap enemyPool` on the raw `length`, before any entry is read. A wave list over `waves` is refused first, so the per-wave check never walks a long wave list.
- **Manifest stages (CEO-approved 2026-11-12 19:35):** a new `DocLimits.stages`, default 1,024, ceiling 65,536: `over cap stages` on the raw `length`, before the list is read. `BTF_STAGE_LIMITS.stages` is 1,024.
- **A live stage seed of `-0` is read as `0`** (JSON already gives 0; the log header is normalised since step 22).
- **`BTF_STAGE_LIMITS` is frozen** (`Object.freeze`), like the other BTF presets.
- **An explicit `null` limit is a refusal, everywhere.** Absent (`undefined`) takes the default; `null` is not "absent". This is how `docLimits`, `StageLimits`, `LevelLimits` already behave at the base (QA's note was about the prototype's `??`); the recipe totals follow it. Pinned by one test across the four. **The same holds for the whole limits argument** (QA's step-23 drift): a bare `null` passed as the whole limits to `readMap`, `readManifest` or `createWorld` is refused like a field-level `null`, with each door's existing `RangeError`; only `undefined` takes the default (`limits === undefined ? default : limits`, never `limits ?? default`). Each door gets its own pin.
- **The drivers stop at the tick cap.** `runTicks` and `runMatch` never step the clock past `world.limits.ticks`: their loops also stop when `clock.tick()` reaches it, `runTicks` advances at most up to it, and a move landing in `runMatch` replays at most up to it. The result is `"timeout"`, as at `maxSimMs`. This is a driver bound, not a game rule (ending a match at the time limit stays a game rule). BTF matches end long before 131,072 ticks, so no draw and no smoke line moves.
- **`createLog` refuses non-string header text** (step-22 verify): `engineVersion` or `projectHash` that is not a string is the existing `RangeError("createLog: seed must be a uint32 and header text short")` (at the base a number passed and made a log its own `parseLog` refuses).
- **Two tests the base lacks** (step-22 verify): a wide plain object copied under a small node budget (step-20 plant D4 was equivalent on build A); and the budget clamp shown with a lying array that *has* items (`has` / `getOwnPropertyDescriptor` traps), so removing the clamp fails a test (at the base the clamp test's liar has no own items, the hole check refuses it first, and step-22 plant R4 is equivalent).
- **Every other number is the CEO's.** If a fixture or test needs another number, stop and ask.

## Files to create or change
- change `src/paint/recipe/limits.ts`: the optional fields, `RECIPE_CAPS` (default, ceiling per key), `checkLimits` returns the frozen copy (≤ 27); `src/paint/recipe/read.ts`: the size count in the copy, no `toJSON`, the totals, the cut of `stored`, the notices cap, C3 (≤ 41); `src/paint/recipe/fields.ts`: C1 (≤ 6)
- change `src/btf-adapters/src/sprite-recipe-limits.ts`: the five values (≤ 7); `src/btf-adapters/src/stage-limits.ts`: frozen, `stages` (≤ 8)
- change `src/project/read/limits.ts`: `stages` in `DocLimits`, ceilings, defaults (≤ 13); `manifest.ts`: the stages cap, bare `null` refused (≤ 10); `map.ts`: bare `null` refused (≤ 6); `stage.ts`: entries per pool / wave, `-0` (≤ 8)
- change `src/sim/driver-tick.ts` (≤ 8), `src/sim/driver-phase.ts` (≤ 18): the tick cap; `src/sim/world.ts`: bare `null` limits refused (≤ 6)
- change `src/core/log/log.ts`: header text must be strings (≤ 6)
- create `tests/sim/recipe-caps.test.ts` (≤ 73); change three existing tests by ruling (see "Existing tests"): `tests/paint/recipe-read.test.ts` (≤ 14), `tests/project/door-guard.test.ts` (≤ 6), `tests/sim/doc-limits.test.ts` (≤ 6)

Size: ≤ 400 changed lines in total, counting insertions + deletions. The per-file caps above add up to 263 (prototype `11726b7` on `56e998c`: 195 changed lines in 17 files, each file 4 under its cap). No new fixtures. If it does not fit, stop and ask.

## Interfaces to match (quoted exactly)
From earlier steps: `readSpriteRecipe`, `SpriteRecipeLimits`, `BTF_SPRITE_RECIPE_LIMITS`, `SPRITE_RECIPE_FORMAT`, `DocLimits`, `DEFAULT_DOC_LIMITS`, `DOC_CEILINGS`, `docLimits`, `overCap`, `tooMany`, `BTF_STAGE_LIMITS`, `readManifest`, `readStage`, `createLog`, `runTicks`, `runMatch`, `plainCopy`, `NOT_PLAIN`, `PLAIN_NODES`. Import these; do not redefine.
```ts
// src/paint/recipe/limits.ts
export type SpriteRecipeLimits = { /* the ten SE-01 keys, unchanged */; readonly totalRuns?: number; readonly totalPoints?: number; readonly totalTweaks?: number; readonly bytes?: number; readonly notices?: number };
export const RECIPE_CAPS = { side: [null, 4096], parts: [null, 1048576], /* … every SE-01 key … */ historyBytes: [null, 16777216],
  totalRuns: [32768, 1048576], totalPoints: [32768, 1048576], totalTweaks: [32768, 1048576], bytes: [2097152, 16777216], notices: [256, 2147483647] } as const; // [default or null = required, ceiling]
// src/paint/recipe/read.ts: errors "over cap totalRuns" | "over cap totalPoints" | "over cap totalTweaks" | "over cap bytes"; notices then { code: "noticesCapped", message: "and N more" }
// src/project/read/limits.ts: DocLimits gains `readonly stages: number`; DEFAULT_DOC_LIMITS.stages = 1024; DOC_CEILINGS.stages = 65536
// src/project/read/manifest.ts: "over cap stages"; src/project/read/stage.ts: "over cap enemyPool" (entries), a -0 seed → 0
export const BTF_STAGE_LIMITS: StageLimits = Object.freeze({ picks: 144, waveUnits: 144, side: 64, objects: 1024, edges: 16384, footprint: 8, spots: 144, waves: 256, turn0: 144, text: 128, notices: 256, stages: 1024 });
```

## Smoke lines
None move. `npm run sim` and all 20 smoke lines are byte-identical to the base (the drivers' cap is never reached by a BTF match; the recipe and document caps are above every fixture).

## Existing tests changed by ruling (and only these)
- `tests/paint/recipe-read.test.ts` (QA's draft, kept): the limits deepEqual gains the five values; a cyclic sample is `over cap bytes`; the per-key cap rows expect `stored` cut like `doc`; the R1 round-trip's second read no longer reports `overCap parts` (stored already holds the cut list); and the `toJSON`-that-throws document now reads (`toJSON` is never called).
- `tests/project/door-guard.test.ts` B3: the `BTF_STAGE_LIMITS` deepEqual gains `stages: 1024`.
- `tests/sim/doc-limits.test.ts` "stage caps (step 22)": the counted `BTF_STAGE_LIMITS` is read 12 times (one more key).

## Tests that prove it is done
New `tests/sim/recipe-caps.test.ts` (six tests; titles start exactly so):
- "recipe caps (step 23)": the sample's totals (7 runs, 9 points, 3 tweaks, size 1,593) read at the total and are refused by name one under; the BTF values; `notices: 1` → `["floatParam light", "and 1 more"]`; a document with a counting `toJSON` reads and `toJSON` is called 0 times; each ceiling (side 4,096, parts 1,048,576, historyBytes, totalRuns, bytes, notices) reads at it and throws one over; a counted limits object is read 15 times.
- "SE-01 carries (step 23)": `side: 16` with `size.w` `"x"`, `0`, `-3` → `w` 16 and only `badField size.w`; for every field path of the sample set to `"?"`, every field outside the object or list holding it is still in the doc.
- "stage and manifest caps (step 23)": 145 weighted entries / 145 entries in one wave → `over cap enemyPool`, 144 read; a 1e9-length entries liar is refused with no item read; 1,025 manifest stages → `over cap stages`, 1,024 read, `{ stages: 1025 }` reads; the stages default and BTF value; `BTF_STAGE_LIMITS` frozen; a `-0` stage seed is `0`.
- "explicit null limits are refused (step 23)": `null` in `readMap`'s, `readStage`'s, the recipe's and `createLevels`'s limits throws each reader's limits error; `undefined` for a recipe total reads; a bare `null` as the whole limits of `readMap({}, null)`, `readManifest(manifest, null)` and `createWorld({ …, limits: null })` throws each door's limits error (one pin per door).
- "drivers stop at the tick cap (step 23)": with `ticks: 50`, `runTicks` (every 30 ms, `maxSimMs` 100,000) and `runMatch` (a 3,000 ms move each turn; and no actions) end `"timeout"` with `clock.tick()` 50; the move match ends after 1 round.
- "the door copy (step 23)": a 100-key object at `nodes` 50 is `NOT_PLAIN`, at 101 it copies; a liar of length 2²⁰ + 1 whose items exist is refused at `nodes: Infinity` with no item read; `createLog` with `engineVersion: 5` or `projectHash: true` throws the header RangeError.

## How a planted bug is caught (for QA; prototype `11726b7` on `56e998c`; reverted after each; `/tmp/h2c-plants.sh` on the Architect's box)
| Plant (intent) | Named test |
|---|---|
| RC1–RC3 a total unchecked; RC4 the size cap gone; RC5 notices uncapped; RC8 no ceiling on the original keys; RC9 the limits read twice; RC10 BTF's totals drift | recipe caps |
| RC6 `stored` keeps what `doc` cut | recipe caps (SE-01) warns one under (existing, changed by ruling) |
| RC7 the copy calls `toJSON` | recipe caps + recipe guard (SE-01) |
| SE1 a bad size falls back to 32 and is also over the side (C1); SE2 a part field not read (C2, as SE-01 T19) | SE-01 carries |
| SM1 pool entries / SM2 wave entries uncapped; SM3 manifest stages uncapped; SM4 `-0` kept; SM5 BTF not frozen | stage and manifest caps |
| SM6 the stages default drifts | stage and manifest caps + stage caps (step 22) |
| NU1 a `null` doc limit / NU2 a `null` recipe total takes the default | explicit null limits are refused |
| NB1 `readMap` / NB2 `readManifest` / NB3 `createWorld` takes a bare `null` limits as the default (`??`) | explicit null limits are refused |
| DR1 `runTicks` ignores the cap; DR2 `runTicks` advances past it; DR3 `runMatch` ignores it; DR4 a move lands past it | drivers stop at the tick cap |
| DC1 no node budget (step-20 D4); DC2 the budget not clamped (step-22 R4); DC3 non-string header text | the door copy |

All 30 test plants fail their named tests. **Grep plants** (`/tmp/h2c-grep-plants.sh` on a throwaway clone): 22 plants, one per grep family, each turns its grep in `/tmp/h2c-greps.sh` (27 greps: files, size and caps, pins, untouched paths, no `core/limits` / `core/plain` in project, project's and paint's only core import `core/notice.ts`, values, the six test titles, six behaviour probes (one is the bare-`null` doors), the format constant, no step comments and no `toJSON` call in paint, laws, no new source file, sim, the two smoke pins) to FAIL: 22/22. **Earlier plants that touch a file this step changes** (on the earlier prototype `f949007`, build-A forms; not rerun for the bare-`null` lines in `map.ts` / `world.ts`): step 22 (`/tmp/h2c-s22plants.sh`, the log, document-limits, manifest, stage and BTF-stage plants) 14/14; step 21 (`/tmp/h2c-s21plants.sh`, the log plants) 7/7; step 20 (`/tmp/h2c-s20plants.sh`, the log plants; F2 follows build A) 5/5; SE-01 (`/tmp/h2c-se01plants.sh`; T22, T23, T27, T34, T34b, T35 re-anchored to this `read.ts` / `limits.ts`) test plants 36/36, depcruise 13/13 and law 9/9 as expected. SE-01's grep plants are not comparable here: its structure greps (file list, size, the ten limit keys, the old `read.ts` text, BTF values, `toJSON` refused) change by this step's rulings, so they fail on the prototype before any plant.

## Example
```ts
readSpriteRecipe(hugeRecipe, BTF_SPRITE_RECIPE_LIMITS);    // { ok: false, needsMigration: false, error: "over cap totalRuns" }, no part read
readSpriteRecipe(recipe, { ...BTF_SPRITE_RECIPE_LIMITS, side: 5000 }); // RangeError("readSpriteRecipe: limits must be integers >= 0")
readManifest(manifestWith2000Stages);                       // error "over cap stages", no stage name read
readStage({ ...stage, seed: -0 }, BTF_STAGE_LIMITS);        // ok, doc.seed === 0
runTicks(worldWithTicks50, { …, maxSimMs: 1e6 });           // "timeout" with clock.tick() === 50
```

## Decisions note: what to name
- The numbers as you used them: entries per pool / wave = `spots` (144) and manifest `stages` 1,024 / 65,536 (CEO-approved 19:35), the recipe key ceilings (proposed), and that you added no other number.
- How the totals are counted before any part is read, and how you showed `stored` is cut like `doc`.
- What `bytes` counts, and why a cyclic document is `over cap bytes`.
- How the drivers stop at the cap, and that no smoke line moved.
- Anything you chose that the file doesn't state (law 12).

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/**`, `scripts/**`, `eslint.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.dependency-cruiser.cjs` (change only by Change Notice).
- `src/state/**`, `src/fx/**`, `src/runtime/**`, `src/rules/**`, `src/index.ts`; in `src/core` everything but `log/log.ts` (`plain.ts` and `limits.ts` stay as they are); `src/paint/recipe/{types,index}.ts`; `src/project/read/{placements,guard,index}.ts`; in `src/sim` everything but the two drivers and `world.ts`.
- `tests/**` except the new `tests/sim/recipe-caps.test.ts` and the three named edits above.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit. `npm test`: fail 0, skipped 0, todo 0; pass ≥ 504; `rg -n '\.(only|skip|todo)\(' tests` prints nothing.
- [ ] `npm run sim` prints exactly the base's two lines (`… win 48 lose 2 … afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, `… win 22 lose 28 … b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`); all 20 smoke lines are byte-identical to the base (the exploit-docs pins stay 516 / 1,484 and 547 / 1,453).
- [ ] Pins: `core-types.ts` `f00c722c…`, `package.json` `1e5dd82c…`, `.dependency-cruiser.cjs` `45a3dbaa…`, `scripts/check-law.sh` `4d7bbf48…`, lock `d7f64a09…`; `npm run deps` reports no violations.
- [ ] Behaviour probes (QA runs them on the working tree): every refusal above by its exact text; `RECIPE_CAPS`, `BTF_SPRITE_RECIPE_LIMITS`, the `stages` numbers and `Object.isFrozen(BTF_STAGE_LIMITS)`; the counted reads (15 recipe, 12 stage); the lying lengths under a kill timer (a hang is a FAIL); the drivers at `ticks: 50`.
- [ ] Boundaries: `rg -n 'core/(limits|plain)\.ts' src/project src/paint` prints nothing; the only core file `src/project` and `src/paint` import is `core/notice.ts`; `rg -n 'step 2[0-9]' src/paint` and `rg -n 'toJSON\(' src/paint` print nothing; no new file or folder under `src`.
- [ ] Laws hold: no wall time, timers, `crypto`, `process.` or `node:` imports in `src`; no rules words in `src/core`; no `Math.random` in `src`.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the 17 files of the file list (`A` for the test created, `M` for the rest); `git diff --stat` ≤ 400 changed lines, each file within its cap.
- [ ] Hand-back `handback/step-23-recipe-caps/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Not in this step (deferred; flagged, do not invent). Carries, with their target steps
- **H3 (saves you can trust, a CN):** a direct project-reader call on a live hostile document (a throwing getter, a boom or revoked proxy) can still throw; limits are already refused by name.
- **H4 (speed and memory):** `restore` checks the snapshot clock with the default `stepMs`, not the world's; the clock pile-up row.
- **H3, QA carry (1):** `BTF_SPRITE_RECIPE_LIMITS` and `BTF_STAGE_LIMITS.stages` hand-copy their defaults; derive them from one source.
- **H3, QA carry (2):** `historyBytes` and `bytes` share the 16 MiB ceiling; give each its own named ceiling or document the sharing.
- **H4, QA carry (3):** the 2 MiB size count lets many short keys reach about 17× that in heap; count per key overhead or cap keys.
- **Residual, by design:** `bytes` measures values, keys and string lengths, not exact UTF-8 bytes.
- Editing `docs/qa/**` (QA) or `docs/chaos-player-outline.md` (Architect).

## Out of scope
- Any HP, attack, damage or stat rule; networking, lobbies, saves; any change to the command log format, the snapshot shape, the state tables or the gesture intents; any cap number other than the accepted table, the two approved and the one proposed here.
