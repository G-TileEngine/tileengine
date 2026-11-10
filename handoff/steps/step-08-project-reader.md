# step-08-project-reader: read-only project reader (VersionGuard) and match-start placements

Step id: step-08-project-reader          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `12ae906` on `main` (step-07-events-log r1 build B merged, PR #8); the diff is always `12ae906..<head>`
Branch: `step/step-08-project-reader-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-08-project-reader-r<N>.bundle 12ae906..step/step-08-project-reader-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-08-project-reader/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-03-grid-edges (`Notice`, `createGrid` in tests), step-05-rng (the picker in tests)
Read first: BUILD_GUIDE.md §2 laws 4, 10, M8; §3 (layers); §4; `handoff/change-notices/CN-005-project-reads-notice.md` (attached; binding)
Kit: kit-2, 2026-11-10. Engine Architect. The interfaces below were prototyped and run green (`npm run green`, 108/0) on Node 24.22.1 on top of `main` `12ae906`, against `src/types/core-types.ts` sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (CN-004): every type quoted here is unchanged. `main` `12ae906` is green with it (Architect check, 96/0).
Carries: CN-005 (attached; `change-notices/CN-005-project-reads-notice.md`): one line in `.dependency-cruiser.cjs`. The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Build `src/project/read`: the engine's read-only reader for three DSK documents, `CoreProjectManifest` (`project.json`), `CoreMap` and `CoreStage`, plus `resolvePlacements`, which turns a stage into the match-start `ResolvedPlacement[]`. The reader takes an already-parsed JSON value (`unknown`), checks the `VersionGuard` (current version only; anything else is `needsMigration`, never patched), checks structure with type guards, and returns a fresh document that holds only the core-types fields. It reads structure only: no game rules, no stats, no files, no network, no randomness of its own (weighted picks go through an injected picker, the same shape as step 05's `Rng.weighted`).

Rulings in this step (2026-11-10):
- **Layer edge (CN-005):** `src/project/**` may import `src/types/**` and exactly one core file, `src/core/notice.ts` (type-only `Notice`). Nothing else under `src/core`, `src/state`, `src/rules` or `src/index.ts`. This step changes the one `project-imports-only-types` line in `.dependency-cruiser.cjs` to allow that file; that line is the only Do-not-touch exception.
- **VersionGuard:** `kind` must equal the expected kind; `formatVersion` must be an integer. An integer other than the current one (older **or** newer) returns `{ ok: false, needsMigration: true, kind, found }` and the input is never changed. Migration is `@te/project-write`'s job (core-types VERSION RULE).
- **Hard vs soft (law 10):** a missing or malformed required field is a hard error, `{ ok: false, needsMigration: false, error: "bad field <key>" }`, where `<key>` is the **top-level** key that failed (`cols`, `logic`, `enemyPool`, `project`, …). Soft issues are `Notice`s and only `resolvePlacements` raises them in v1: `notPlaced`, `spawnOffMap`, `poolExhausted`. `readManifest` / `readMap` / `readStage` return `notices: []` in v1.
- **Notices stay with their owner:** `wrapEdgesIgnored` and `footprintIgnored` belong to the grid (step 03). The reader passes `settings.wrapEdges` and object `footprint` through unchanged and does not repeat those notices.
- **Seed:** `stage.seed` is returned as stored (an integer: the match seed, the same integer `createRng` takes). `stageSeed(stage)` returns it, or `null` when absent or `null` (the host then picks a fresh seed). The reader never builds an rng.
- **Sides:** loadout units get `stage.sides.loadout ?? "player"`, enemy-pool units `stage.sides.enemyPool ?? "rival"`, neutrals `neutrals[i].side ?? stage.sides.neutrals ?? "neutral"`. Facing comes only from the placement (`facing ?? null`), never from the side.

## Files to create or change
- change `.dependency-cruiser.cjs` — the one CN-005 line, exactly as in the CN (2 changed lines in `--stat`)
- create `src/project/read/guard.ts` — the quoted guard types, `CURRENT_FORMAT_VERSIONS`, `checkVersion`, private type guards (≤ 36 lines)
- create `src/project/read/map.ts` — `readMap` (≤ 50 lines)
- create `src/project/read/stage.ts` — `readStage`, `stageSeed` (≤ 86 lines)
- create `src/project/read/manifest.ts` — `readManifest` (≤ 26 lines)
- create `src/project/read/placements.ts` — the quoted placement types, `resolvePlacements` (≤ 46 lines)
- create `src/project/read/index.ts` — re-exports; the value exports are exactly the seven quoted values (≤ 8 lines)
- create `tests/project/guard.test.ts` (≤ 40 lines), `tests/project/map.test.ts` (≤ 32 lines), `tests/project/stage.test.ts` (≤ 28 lines), `tests/project/placements.test.ts` (≤ 46 lines)
- create the four fixtures below under `tests/fixtures/project/` (data only)

Size: ≤ 400 changed lines in total excluding the four JSON fixtures; the per-file caps above add up to exactly 400 (prototype: 365). Keep tests table-driven; if you pass ~370, say so in Decisions.

## Interfaces to match (quoted exactly)
From `src/types/core-types.ts` (**confirmed**, DSK): `CoreDocKind`, `CurrentFormatVersions`, `VersionGuard`, `CoreMap`, `CoreStage`, `CoreProjectManifest`, `SpawnSq`, `Facing`, `SideId`, `UnitId`, `Sq`, `ResolvedPlacement`. From step 03: `Notice` (`src/core/notice.ts`, type-only, CN-005). Import these; never retype them.
```ts
// src/project/read/guard.ts — exported declarations
import type { CoreDocKind, CurrentFormatVersions } from "../../types/core-types.ts";
import type { Notice } from "../../core/notice.ts";

/** Hard failures. needsMigration: an integer formatVersion that is not the current one (never patched here). */
export type ReadFail =
  | { readonly ok: false; readonly needsMigration: true; readonly kind: CoreDocKind; readonly found: unknown }
  | { readonly ok: false; readonly needsMigration: false; readonly error: string };
export type ReadResult<T> = { readonly ok: true; readonly doc: T; readonly notices: readonly Notice[] } | ReadFail;

/** Runtime copy of DSK's CurrentFormatVersions; `satisfies` keeps the two equal. */
export const CURRENT_FORMAT_VERSIONS = {
  "tile-project": 6, map: 5, stage: 2, unit: 2, "behaviour-setup": 3, deck: 1, audio: 1,
} as const satisfies CurrentFormatVersions;

/** null = the version guard passes. */
export function checkVersion(json: unknown, kind: CoreDocKind): ReadFail | null;
```
```ts
// src/project/read/placements.ts — exported declarations
import type { CoreStage, ResolvedPlacement, UnitId } from "../../types/core-types.ts";
import type { Notice } from "../../core/notice.ts";

/** Same shape as step 05's `Rng.weighted`: an index with a positive weight, or -1 when none is left. */
export type Picker = (weights: readonly number[]) => number;
export type MapSize = { readonly cols: number; readonly rows: number };
export type Placements = { readonly placements: readonly ResolvedPlacement[]; readonly notices: readonly Notice[] };

export function resolvePlacements(stage: CoreStage, map: MapSize, chosen: readonly UnitId[], pick: Picker): Placements;
```
```ts
// src/project/read/map.ts, stage.ts, manifest.ts
export function readMap(json: unknown): ReadResult<CoreMap>;
export function readStage(json: unknown): ReadResult<CoreStage>;
export function stageSeed(stage: CoreStage): number | null;
export function readManifest(json: unknown): ReadResult<CoreProjectManifest>;
```
`index.ts` re-exports the types `ReadFail`, `ReadResult`, `Picker`, `MapSize`, `Placements` and exactly these values: `CURRENT_FORMAT_VERSIONS`, `checkVersion`, `readMap`, `readStage`, `stageSeed`, `readManifest`, `resolvePlacements`. With `exactOptionalPropertyTypes`, an absent optional field is omitted from the returned doc, never set to `undefined`. No `as` casts to core-types: narrow with type guards (`x is …`).

Behaviour (exact; each line has a test):
1. **checkVersion:** not a plain object → `error: "not an object"`; `kind` ≠ expected → `error: "wrong kind <found kind>"`; `formatVersion` not an integer → `error: "bad field formatVersion"`; an integer ≠ `CURRENT_FORMAT_VERSIONS[kind]` → `{ ok: false, needsMigration: true, kind, found }`; else `null`.
2. **readMap:** guard, then `id` string, `rev` int ≥ 0, `cols`/`rows` int ≥ 1, `logic` (terrain: ints ≥ 0 with length `cols*rows`; palette: string values; edges: `{c, r}` integers with `side` in n/e/s/w), optional `objects` (`id` string, integer `at`, optional boolean `blocks`, optional `footprint` with ints ≥ 1). The first failing top-level key is the error. `logic.lanes` and `paths` (MAY-MOVE) are not read in v1; unknown keys (art, rules values) are dropped. Off-map edges and palette gaps are not errors (the grid handles them).
3. **readStage:** guard, then `id`, `rev`, `mapRef`, `playerSpawns` (integer cells, optional `facing` in N/E/S/W or `null`), `neutrals`, optional integer-or-null `seed`, optional `sides` (string values), `enemyPool` (`fixed` / `weighted` / `waves` per core-types), `loadout` (`null` or `{roster, size, required}`), `rules` (strings). Same error rule; unknown keys dropped.
4. **readManifest:** guard (`tile-project`), then `project` (`id`, `rev`, `catalogueRev`, `settings.wrapEdges` boolean, optional `settings.occupancy` in strict1/softStack/laneSlots, `stages`, `rules`, `loadout`); any failure is `bad field project`. `wrapEdges` and `occupancy` pass through with no notice (grid and units own those warnings).
5. **resolvePlacements** order: loadout, then enemy pool, then neutrals.
   - Loadout: `chosen[i]` goes to `playerSpawns[i]`; more chosen than spawns → the extras are not placed and **one** `notPlaced` notice. `chosen` is taken as given (loadout rules are the host's).
   - `fixed`: every entry at its own cell. `waves`: only `turn === 0` entries, each repeated `count` times in order, into `spawns` in order (extras → one `notPlaced`). Later waves are rules (step 09+).
   - `weighted`: up to `picks` calls of `pick(weights)`, with weights in entry order (non-finite or ≤ 0 → 0). A result that is -1, out of range or a zero-weight index stops the picks with **one** `poolExhausted`. With `allowRepeats: false` a picked entry's weight becomes 0 for later calls. Picked units go into `spawns` in order (extras → one `notPlaced`).
   - A cell outside `0 ≤ c < cols`, `0 ≤ r < rows` is skipped with `spawnOffMap` (`at` = that cell). Closed cells and occupancy are step 04's (`units.place`).
   - Each placement is `{ unitId, side, at: { c, r }, facing: facing ?? null }`; sides per the ruling above.
6. Pure: the input JSON is never changed, nothing is cached, no file, clock, network or random source is read.

## Fixtures (create exactly; data only, not counted in Size)
- `tests/fixtures/project/map-6x9.json`: `kind "map"`, `formatVersion 5`, `id "map-6x9"`, `rev 1`, `cols 6`, `rows 9`, `logic` = terrain 54 × `0`, palette `{"0":"floor"}`, edges `[]`; plus `"layers": []` (an art key the reader must drop).
- `tests/fixtures/project/map-12x12.json`: `id "map-12x12"`, `cols 12`, `rows 12`, terrain 144 × `0` except cells `(5,5)` and `(6,5)` = `1`; palette `{"0":"floor","1":"wall-block"}`; edges `[{"c":0,"r":0,"side":"e"}]`; objects `[{"id":"rock-1","at":{"c":3,"r":3},"blocks":true,"footprint":{"w":2,"h":1}}]`.
- `tests/fixtures/project/stage-fixed.json`: `kind "stage"`, `formatVersion 2`, `id "stage-fixed"`, `rev 1`, `mapRef "map-6x9"`, playerSpawns `[{"c":0,"r":8,"facing":"N"},{"c":1,"r":8}]`, neutrals `[{"unitId":"crate","at":{"c":3,"r":4}},{"unitId":"merchant","at":{"c":4,"r":4},"facing":"W","side":"player"}]`, `seed 24301` (`0x5eed`), sides `{"enemyPool":"wolves"}`, enemyPool `fixed` with `wolf` at `(2,0)` facing `S` and `wolf` at `(3,0)`, loadout `{"roster":["knight","archer","cleric"],"size":3,"required":["knight"]}`, rules `[]`.
- `tests/fixtures/project/stage-weighted.json`: `id "stage-weighted"`, `mapRef "map-12x12"`, playerSpawns `[{"c":0,"r":11},{"c":1,"r":11}]`, neutrals `[]`, no `seed`, no `sides`, enemyPool `{"mode":"weighted","picks":3,"allowRepeats":false,"spawns":[{"c":0,"r":0},{"c":1,"r":0},{"c":2,"r":0,"facing":"S"}],"entries":[{"unitId":"wolf","weight":3},{"unitId":"bat","weight":1},{"unitId":"ogre","weight":0}]}`, `loadout null`, rules `["setup-a"]`.
Do not reuse or change `tests/fixtures/maps/grid-6x9.json` (step 03) or any other existing fixture.

## Tests that prove it is done
Run: `npm test`, or `node --test tests/project/*.test.ts`. Load fixtures with `readFileSync` + `JSON.parse` in the tests only.
- `tests/project/guard.test.ts`
  - "current versions are accepted: map 5, stage 2, tile-project 6": the three fixtures / a minimal manifest read `ok: true`; `CURRENT_FORMAT_VERSIONS` has those values.
  - "any other formatVersion needs migration and is never patched": map at 4 and at 6 → `{ ok: false, needsMigration: true, kind: "map", found: <v> }`; the input object still holds `<v>`; a stage at 1 likewise.
  - "not an object, wrong kind or a non-integer formatVersion is a hard error": the three exact errors of Behaviour 1; `checkVersion(<map fixture>, "map") === null`.
  - "manifest: settings pass through; wrapEdges is read, the grid owns its notice": `{ wrapEdges: true, occupancy: "softStack" }` is returned as-is with `notices: []`; `wrapEdges: "yes"` → `bad field project`.
- `tests/project/map.test.ts`
  - "the 6x9 and 12x12 fixtures load and build a grid (M8); unknown keys are dropped": both read `ok`, terrain length `cols*rows`, no `layers` key in `doc` (still in the input); `createGrid(doc, tiles)` works; on 12×12, `(5,5)` and the rock cell `(3,3)` are not open and the grid's notices are exactly `["footprintIgnored"]`.
  - "a missing or malformed required field is a hard error naming the top-level key": `cols` absent → `bad field cols`; a short terrain → `bad field logic`; a fractional object cell → `bad field objects`.
- `tests/project/stage.test.ts`
  - "stage fixtures load; seed is returned as-is": `stageSeed` gives `0x5eed` for stage-fixed and `null` for stage-weighted and for `seed: null`; stage-weighted's `loadout` is `null`.
  - "a stage hard error names the top-level key": table of `mapRef` absent, `seed: 1.5`, a spawn with `facing: "up"`, `enemyPool: { mode: "random" }`, `sides: { loadout: 3 }`, `loadout: {}` → each `bad field <key>`.
- `tests/project/placements.test.ts`
  - "loadout fills playerSpawns in order; sides and facing; extras are not placed": stage-fixed, map 6×9, chosen `knight, archer, cleric` → `knight` player (0,8) N, `archer` player (1,8) null, `wolf` wolves (2,0) S, `wolf` wolves (3,0) null, `crate` neutral (3,4) null, `merchant` player (4,4) W; notices exactly `["notPlaced"]`; the picker is never called.
  - "weighted picks go through the picker, without repeats": a scripted picker returning 0, 1, -1 sees weights `[3,1,0]`, `[0,1,0]`, `[0,0,0]`; placements `wolf` (0,0) and `bat` (1,0), side `rival`, facing `null`; notices exactly `["poolExhausted"]`.
  - "the same seed gives the same placements": two runs with `createRng(streamSeed(0x5eed, "pool"))` and `(w) => rng.weighted(w)` deep-equal.
  - "waves place turn 0 only; an off-map spawn is a notice, not an error": waves `[turn 0: bat × 3, turn 3: ogre × 1]` into spawns `(0,0)`, `(12,0)`, `(2,0)` on 12×12 → `bat` at c 0 and c 2 only; notices exactly one `spawnOffMap` at `(12,0)`.

## Example
```ts
const stage = readStage(JSON.parse(text));           // text from the host; the reader never opens files
if (!stage.ok) return stage.needsMigration ? openReadOnly() : showError(stage.error);
const seed = stageSeed(stage.doc) ?? hostFreshSeed;  // the host owns the fresh seed; step 07 logs it
const pool = createRng(streamSeed(seed, "pool"));    // step 05: one stream for the whole resolve
const start = resolvePlacements(stage.doc, map, chosenIds, (w) => pool.weighted(w));
// → { placements: ResolvedPlacement[], notices: Notice[] }; feed each to units.place (step 04)
```

## How later steps use this (context only; do not build)
- Step 09: the harness reads manifest, map and stage; builds the grid (`createGrid(map, tiles, { wrapEdges })`); creates the match rng from `stageSeed(stage) ?? <host seed>` and logs that seed in the command-log header (step 07); calls `resolvePlacements` with `(w) => pool.weighted(w)` on `streamSeed(seed, "pool")`; places each with `units.place`.
- Tile types (`terrain.tile_types`) are resolved per stage above the reader (setups); this step does not read setups.
- Later waves (turn > 0) are spawned by rules on the clock.

## Decisions note: what to name
- The order in which you check fields (the first failing top-level key is the error).
- How you narrow `unknown` without `as` (your type-guard helpers; they stay private to `src/project/read`).
- Anything you chose that the file doesn't state (for example, the exact notice messages).

## BTF intent (read-only)
None. BTF has no authored map format (project-format §6.4 "No authored tile map exists in BTF"); legacy `ui-shell/js/setup-store.js:682` shapes are never read (ARCH §8 rule 9).

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/STATES.md`, `scripts/check-state.sh`, `scripts/check-law.sh`, `eslint.config.mjs`, `tsconfig.json` (change only by Change Notice).
- `.dependency-cruiser.cjs`, **except** the one CN-005 line (`project-imports-only-types`); every other line stays byte-identical.
- `package.json` and `package-lock.json`: no new dependency, no script change.
- `tests/smoke.test.ts`, `tests/gates.test.ts`, `tests/fixtures/**`, except the four new files this step creates: `tests/fixtures/project/map-6x9.json`, `map-12x12.json`, `stage-fixed.json`, `stage-weighted.json`.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.
- Every earlier step's files: `src/core/notice.ts` (import its type only), `src/core/**` (clock, grid, unit, rng, targeting, events, log), `src/state/**`, `src/rules/**`, `src/index.ts`.
- No game rules in the reader: no HP, mana, card or cost fields or logic, no stats, no setup answers (it reads structure only).

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit (green = BUILD_GUIDE §6).
- [ ] `npm test` summary: fail 0, skipped 0, todo 0; pass ≥ 107. No `.only`, `.skip` or `.todo` (`rg -n '\.(only|skip|todo)\(' tests` prints nothing).
- [ ] `npm run check:state` prints `check:state OK (src)` and exits 0.
- [ ] `npm run check:law` prints `check:law OK (src)` and exits 0.
- [ ] CN-005: `sha256sum .dependency-cruiser.cjs` prints `9037bacef0aa7ff33abff96d308fe137ef1c7d4baa6795af070c3b68d7bd3e81`, and `git diff --stat <base>..<head> -- .dependency-cruiser.cjs` shows 1 insertion, 1 deletion.
- [ ] `rg -n "from ['\"].*core/(?!notice)" --pcre2 src/project` prints nothing (the reader imports only `core/notice.ts` from core; `npm run deps` enforces the same).
- [ ] `rg -n --pcre2 "from ['\"]node:|\bfetch\b|readFile|writeFile" src/project` prints nothing (never reads files, never fetches).
- [ ] `rg -n -i --pcre2 '\b(hp|maxhp|mana|cost|damage|cards?|stats?)\b' src/project` prints nothing (structure only, no game rules).
- [ ] `rg -n --pcre2 '\bas (unknown|any|Core\w+|ReadResult|SpawnSq|Facing|SideId|Sq)\b' src/project/read` prints nothing (type guards, no casts).
- [ ] `git diff --name-only <base>..<head> -- src/core src/types src/state src/rules src/index.ts` prints nothing.
- [ ] `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback' ':!tests/fixtures/project'` shows ≤ 400 changed lines (src + tests + the CN-005 line); each file within its size limit above. The four JSON fixtures are excluded from the cap (Size, STEP-TEMPLATE).
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the files in "Files to create or change" (the four fixtures as `A`, `.dependency-cruiser.cjs` as `M`; anything extra is named and justified in the Decisions note).
- [ ] Hand-back `handback/step-08-project-reader/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Out of scope
- Migrations (`@te/project-write`), setups / answers / value layering, tile-type resolution, assets and art fields, decks and units documents.
- `map.logic.lanes`, `map.paths` (MAY-MOVE; lanes / TD steps), waves after turn 0 (rules), occupancy policies (step 04 warns).
- `computeIndex` / `exportClosure`, reading files or URLs (the host passes parsed JSON), choosing a fresh seed (the host).
