# step-22-document-caps: the document caps (H2b, first part). QA's four step-21 residuals first (the log doors copy the caller's limits and header once, a -0 seed is 0, the door budget is clamped to the engine ceiling; a failed gesture-options copy is no options, never the live object); then the CEO-accepted map, stage and levelling caps as maker-changeable numbers on `StageLimits` and `LevelSetup` with engine ceilings and BTF presets, every document string ≤ 128 and every document number within int32, the stage seed as a uint32, 256 notices per placement read then one `noticesCapped`, and `readStage` reading its limits once

Step id: step-22-document-caps          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `2f7ec00f63a2a131259fcc1b5f21ba4ac37f5fe1` (the step 21 merge: PR #27, build A). The diff is always `<base>..<head>`.
Branch: `step/step-22-document-caps-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-22-document-caps-r<N>.bundle <base>..step/step-22-document-caps-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-22-document-caps/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-21-hard-limits (`MatchLimits`, `withinCeilings`, `PLAIN_NODES`, `noticesCapped`, `BTF_MATCH_LIMITS`, the linear draw), step-20-every-door (`plainCopy`, `readAction`), step-08 / step-16 / SE-01 (`readMap`, `readManifest`, `readStage`, `StageLimits`, `resolvePlacements`, `BTF_STAGE_LIMITS`), step-18 / 19 (`createLevels`, `LevelSetup`)
Read first: BUILD_GUIDE.md §2 laws 4, 5, 7, 9, 12, M4, M7 and §3 (layers: `src/project` may import only `project`, `types` and `core/notice.ts`); `handoff/steps/step-21-hard-limits.md` (rulings, "Not in this step"); `docs/qa/step-21-review.md` (the residuals); `h2-caps-ACCEPTED-2026-11-12` (the table); `src/project/read/{map,stage,manifest,placements,guard}.ts`, `src/rules/levels/{types,levels}.ts`, `src/core/{plain,limits}.ts`, `src/core/log/log.ts`, `src/runtime/input/gestures.ts` (as at the base)
Kit: kit-2, 2026-11-12. Engine Architect. Hardening step H2, second half, part one (H2b). Cap numbers CEO-accepted 2026-11-12 (`h2-caps-ACCEPTED-2026-11-12`, Architect's copy sha `ac826d36…`). The interfaces below were prototyped and run green (`npm run green`, 498/0) on Node 24.22.1 on top of the step 21 merge `2f7ec00` (prototype branch `h2b-r2`, head `6695f7c`, one code commit); a fresh clone of the prototype runs green. `npm run sim` 48/2 and 22/28 and 18 of the 20 smoke lines are byte-identical to `2f7ec00`; the two exploit-docs lines move by ruling (see "Smoke lines").
Carries: **no Change Notice.** No pinned file changes: `core-types.ts` (`f00c722c…`), `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`), BUILD_GUIDE, STATES and every state table are unchanged. The document caps are one new file in the existing `src/project/read` folder (`limits.ts`; imports only `core/notice.ts` types and `./guard.ts`); `src/project` does **not** import `core/limits.ts` or `core/plain.ts`. The levelling caps live in `src/rules/levels`; the BTF values in `src/btf-adapters/src`. No new folder, no new dependency rule. Carries in, from QA's step-21 review (residuals 1–5) and step 21 "Not in this step" (map, stage, levels, int32, stage seed, per-read notices, `readStage` live limits). Carried on to **step 23**: the recipe caps and SE-01 C1–C3 (see "Not in this step"). The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Finish putting a named ceiling on what one document can make the engine do. At the base: `readAction` / `createLog` / `parseLog` read the caller's `MatchLimits` live (a throwing proxy throws out of the door); `createLog` reads `header.seed` twice and keeps a `-0` seed; `plainCopy(v, d, Infinity)` still walks a lying length item by item; a 2000 × 2000 map, 1e9 × 1e9 footprints, 100,000 neutrals, 20,000 turn-0 waves, `rev: 1e300`, a 10 MB id, 1e6 levels and `offerSize 1e9` are all accepted; a stage seed of 2³² + 1 is accepted; one placement read can return 100,000 notices; `readStage` reads its `StageLimits` live. After this step every one of those is refused (or cut) by name, before the big list is read, at the numbers the CEO accepted.

Rulings in this step (Engine Architect and owner, 2026-11-12):
- **QA's residuals first.** (1) `readAction`, `createLog` and `parseLog` copy the caller's `MatchLimits` once (`plainCopy(v, 1)`, the defaults object itself is used as is) and check it with `withinCeilings`: a throwing or bad limits object is a refusal (`readAction` → `null`, `parseLog` → `{ ok: false, error: "bad limits" }`, `createLog` → `RangeError`), never a throw from inside. (2) `createLog` copies the header once; the seed is read once. (3) A `-0` seed is kept as `0` (the copy normalises it). (4) `plainCopy`'s `nodes` is clamped to `PLAIN_NODES` (2²⁰): `Infinity`, `1e9` or `NaN` can no longer walk a lying length. (5) No code: see "Mobile note".
- **Gesture options are never live (QA's step-21 merge note).** At the base, when `createGestureMapper`'s copy of its options fails (`plainCopy` → `NOT_PLAIN`, e.g. a proxy whose `ownKeys` throws), the mapper keeps the caller's live object. Now a failed copy reads as no options (`{}`), so it is refused by name (`RangeError("createGestureMapper: cellPx must be > 0")`); the live object is never used. One line in `gestures.ts`; no new error text.
- **Caps are numbers on the objects makers already pass.** The document caps are optional fields on `StageLimits` (`DocLimits`); absent = `DEFAULT_DOC_LIMITS` (the accepted BTF values). The levelling caps are an optional `LevelSetup.limits` (`LevelLimits`); absent = `DEFAULT_LEVEL_LIMITS`. Every field is a whole number from 1 to its ceiling (`DOC_CEILINGS`, `LEVEL_CEILINGS`), else the reader throws a named `RangeError` (a maker's bug, as `StageLimits` at the base). BTF's values: `BTF_STAGE_LIMITS` (now with every document field) and the separate `BTF_LEVEL_LIMITS`, equal to the defaults today.
- **No core import into project (no CN).** `DocLimits` is defined in `src/project/read/limits.ts`, the same shape as `MatchLimits`; the int32 and uint32 bounds are restated there (2,147,483,647 and 4,294,967,295). The project readers do not use `plainCopy`: each reads its limits object once, key by key, inside `try`.
- **Refused by name, before the list is read.** A map side over `side` → `over cap cols` / `over cap rows`; edges over `edges` → `over cap logic edges`; objects over `objects` → `over cap objects`; a stage list over `spots` → `over cap playerSpawns` / `over cap neutrals` / `over cap enemyPool` (pool spawns, fixed entries) and waves over `waves` → `over cap enemyPool`, all on the raw `length` before any item is read. A footprint side over `footprint` and turn-0 units (all turn-0 waves summed) over `turn0` → `bad field objects` / `bad field enemyPool` (as a bad wave count at the base).
- **Every document string ≤ `text` (128), every document number within int32.** After a map, stage or manifest is read, one walk over the read document refuses the first string longer than `text` (`over cap text <top-level key>`) or number with `|n| > 2,147,483,647` (`over cap number <top-level key>`). The sign and integer rules stay with each field's own reader (a weighted `weight` may still be negative or 2.5, step 16 B4); int32 bounds the magnitude only. The error always names the top-level key (the exploit-docs hunter's `(e)7` invariant).
- **The stage seed is a uint32** (0 … 4,294,967,295, whole); anything else is `bad field seed`. It is not int32-checked.
- **Notices per read.** `resolvePlacements` returns at most `notices` (256) notices, then exactly one `{ code: "noticesCapped", message: "and N more" }`; `createWorld` passes `stageLimits.notices`. (The world's per-match cap, 2,048, is step 21's and unchanged.) The notices ceiling is 2³¹ − 1, as step 21's ruling.
- **Levelling caps.** `createLevels` refuses `thresholds` or `offerLevels` longer than `levels` (64), `offerSize` over `offer` (8), more than `pools` (256) pools, or one pool longer than `pool` (128): `RangeError("createLevels: over the level caps")`, checked after the existing rules / pools check (a hostile setup keeps its step-20 error). XP numbers (`thresholds`, `xp.move`) are int32 (`bad rules or pools`).
- **Footprint ceiling = the map side ceiling** (256): the table's "map side" engine maximum.
- **Every other number is the CEO's.** Only the accepted numbers and the engine constants appear. If a fixture or test needs another number, stop and ask.

### Mobile note (QA residual 5; no code)
`PLAIN_NODES` (2²⁰ values) and `PLAIN_DEPTH` (32) are engine safety constants for the door copy, not the size a real document may have. The real document caps are far below them: a whole BTF map at the caps is ~22,000 values (4,096 terrain cells, 16,384 edges, 1,024 objects), a stage a few thousand, a level setup ~33,000 (256 pools × 128), and the table's worst cases at the caps take ~10 ms (a map) and ~41 ms (1,024 level-up draws) on a phone (4× the box). A file that only fits the 2²⁰ door budget is refused by the document caps long before it is slow on a phone.

### The L1 plant stays honest (step 20's length check)
With the clamp, `nodes: Infinity` no longer reaches the length check alone (it becomes 2²⁰ and `1e9 > left` refuses it first). The check is now shown at the default budget with lengths that pass "above the values left": `-1`, `1.5` and `NaN` are each refused at the length with no item read (`seen === 0`). Removing the integer / `< 0` check fails "the door limits are read once (step 22)" and "the door budget (step 21)". Keep both checks.

## Files to create or change
- change `src/core/plain.ts`: clamp `nodes` (≤ 7); `src/core/log/log.ts`: `ownLimits`, limits and header copied once (≤ 25)
- create `src/project/read/limits.ts`: `DocLimits`, `DOC_CEILINGS`, `DEFAULT_DOC_LIMITS`, `INT32_MAX`, `UINT32_MAX`, `docLimits`, `unfit`, `overCap`, `fitted`, `tooMany`, `capNotes` (≤ 38); change `src/project/read/index.ts`: export the three public names (≤ 5)
- change `src/project/read/map.ts` (≤ 21), `stage.ts` (≤ 37), `manifest.ts` (≤ 10), `placements.ts` (≤ 10)
- change `src/rules/levels/types.ts`: `LevelLimits`, `LevelSetup.limits?` (≤ 8); `levels.ts`: ceilings, defaults, `over`, int32 XP (≤ 23); `index.ts`: exports (≤ 8)
- change `src/btf-adapters/src/stage-limits.ts`: the document fields (≤ 9); `levels.ts`: `BTF_LEVEL_LIMITS` (≤ 8); `index.ts`: export (≤ 6)
- change `src/sim/world.ts`: `readManifest` / `readMap` under `stageLimits`, the notices cap to `resolvePlacements` (≤ 10)
- change `src/runtime/input/gestures.ts`: a failed options copy is `{}`, never the live object (≤ 6)
- create `tests/sim/doc-limits.test.ts` (≤ 82); change three existing tests by ruling (see "Existing tests"): `tests/project/door-guard.test.ts` (≤ 6), `tests/sim/exploit-docs.test.ts` (≤ 8), `tests/sim/hard-limits.test.ts` (≤ 10)

Size: ≤ 400 changed lines in total, counting insertions + deletions. The per-file caps above add up to 337 (prototype `6695f7c` on `2f7ec00`: 257 changed lines in 20 files, each file 4 under its cap). No new fixtures. If you pass ~290, say so in Decisions. If it does not fit, stop and ask.

## Interfaces to match (quoted exactly)
From earlier steps: `plainCopy`, `NOT_PLAIN`, `PLAIN_NODES`, `MatchLimits`, `DEFAULT_MATCH_LIMITS`, `withinCeilings`, `readAction`, `createLog`, `parseLog`, `LogHeader`, `readMap`, `readManifest`, `readStage`, `StageLimits`, `resolvePlacements`, `ReadResult`, `ReadFail`, `Notice`, `createLevels`, `LevelSetup`, `BTF_STAGE_LIMITS`. Import these; do not redefine.
```ts
// src/core/plain.ts: the budget, clamped (Infinity, NaN or 1e9 cannot walk a lying length)
let left = nodes >= 0 ? Math.min(nodes, PLAIN_NODES) : 0;
// src/core/log/log.ts: the caller's limits read once at each door (the defaults object as is); null = refused
const ownLimits = (v: unknown): MatchLimits | null => { const own = v === DEFAULT_MATCH_LIMITS ? v : plainCopy(v, 1); return withinCeilings(own) ? own : null; };
readAction(v, limits?)        // null when ownLimits(limits) is null
createLog(header, onAppend?, limits?) // RangeError("createLog: limits must be whole numbers from 1 to their ceilings"); the header copied once (plainCopy(header, 1)); head built from the copy
parseLog(json, limits?)       // { ok: false, error: "bad limits" }

// src/project/read/limits.ts (new; imports: type Notice from ../../core/notice.ts, types from ./guard.ts)
export type DocLimits = { readonly side: number; readonly objects: number; readonly edges: number; readonly footprint: number; readonly spots: number; readonly waves: number; readonly turn0: number; readonly text: number; readonly notices: number };
export const DOC_CEILINGS: DocLimits;      // frozen { side: 256, objects: 65536, edges: 262144, footprint: 256, spots: 4096, waves: 65536, turn0: 4096, text: 1024, notices: 2147483647 }
export const DEFAULT_DOC_LIMITS: DocLimits; // frozen { side: 64, objects: 1024, edges: 16384, footprint: 8, spots: 144, waves: 256, turn0: 144, text: 128, notices: 256 }
export const INT32_MAX = 2147483647, UINT32_MAX = 4294967295;
export function docLimits(v: unknown): DocLimits | null;  // each key read once in try; absent → default; frozen; null if any is not a whole number 1…ceiling or a read throws
export function unfit(v: unknown, lim: DocLimits, at?: string): string | null; // "text <key>" | "number <key>" (first found, top-level key) | null
export const overCap: (key: string) => ReadFail;          // { ok: false, needsMigration: false, error: `over cap ${key}` }
export function fitted<T>(doc: T, lim: DocLimits, notices: readonly Notice[]): ReadResult<T>; // ok, or overCap(unfit(doc))
export const tooMany: (v: unknown, n: number) => boolean;  // Array.isArray(v) && v.length > n
export const capNotes: (list: readonly Notice[], cap: number) => Notice[]; // ≤ cap, then { code: "noticesCapped", message: `and ${rest} more` }

// src/project/read/stage.ts
export type StageLimits = { readonly picks: number; readonly waveUnits: number } & Partial<DocLimits>;
readStage(json, limits)  // limits read once (picks, waveUnits, then docLimits): a throw or a bad value → RangeError("readStage: limits must be integers >= 0") (text unchanged)
// src/project/read/map.ts, manifest.ts
export function readMap(json: unknown, limits?: Partial<DocLimits>): ReadResult<CoreMap>;          // RangeError("readMap: limits must be whole numbers from 1 to their ceilings")
export function readManifest(json: unknown, limits?: Partial<DocLimits>): ReadResult<CoreProjectManifest>; // RangeError("readManifest: limits must be whole numbers from 1 to their ceilings")
// src/project/read/placements.ts
export function resolvePlacements(stage: CoreStage, map: MapSize, chosen: readonly UnitId[], pick: Picker, cap = DEFAULT_DOC_LIMITS.notices): Placements;
// src/project/read/index.ts adds: export { DEFAULT_DOC_LIMITS, DOC_CEILINGS, type DocLimits } from "./limits.ts";

// src/rules/levels/types.ts
export type LevelLimits = { readonly levels: number; readonly pool: number; readonly offer: number; readonly pools: number };
export type LevelSetup = { readonly rules: LevelRules; readonly pools: AbilityPools; readonly limits?: LevelLimits };
// src/rules/levels/levels.ts (exported from index.ts)
export const LEVEL_CEILINGS: LevelLimits;       // frozen { levels: 1024, pool: 4096, offer: 64, pools: 4096 }
export const DEFAULT_LEVEL_LIMITS: LevelLimits; // frozen { levels: 64, pool: 128, offer: 8, pools: 256 }
// createLevels: RangeError("createLevels: bad rules or pools") first (as at the base; XP int32 joins it), then
//   RangeError("createLevels: limits must be whole numbers from 1 to their ceilings"), then RangeError("createLevels: over the level caps")

// src/btf-adapters/src
export const BTF_STAGE_LIMITS: StageLimits = { picks: 144, waveUnits: 144, side: 64, objects: 1024, edges: 16384, footprint: 8, spots: 144, waves: 256, turn0: 144, text: 128, notices: 256 };
export const BTF_LEVEL_LIMITS: LevelLimits = Object.freeze({ levels: 64, pool: 128, offer: 8, pools: 256 });
// src/sim/world.ts: readManifest(input.manifest, input.stageLimits); readMap(input.map, input.stageLimits); resolvePlacements(..., input.stageLimits.notices)
```

## Order of checks (exact)
- `readMap`: limits → shape and kind (as at the base) → side (`cols` before `rows`) → edges / objects counts (objects named first when both) → the lists read (footprint per object) → `fitted`.
- `readStage`: limits → shape, kind, `mapRef` (as at the base) → the list counts (`neutrals` named before `playerSpawns`, then `enemyPool`) → fields (seed uint32; a wave over `waveUnits` or turn-0 over `turn0`: `bad field enemyPool`) → `fitted` (the seed is left out of the int32 walk).
- `readManifest`: limits → the base checks → `fitted`.

## Smoke lines (ruling needed from the owner; see "Decisions")
The int32 rule makes two pinned exploit-docs smoke lines move: `stage-fixed` 581 / 1,419 → **516 / 1,484** and `stage-weighted` 607 / 1,393 → **547 / 1,453** (2,000 tries each; findings 0, buckets empty both before and after). Every moved try is a mutation to 9,007,199,254,740,993 (2⁵³ + 1) that the base accepted and this step refuses (`over cap number <key>`); no other try changes. The pins in `tests/sim/exploit-docs.test.ts` change to the new numbers. The other 18 smoke lines and `npm run sim` are byte-identical.

## Existing tests changed by ruling (and only these)
- `tests/project/door-guard.test.ts` B3: the `BTF_STAGE_LIMITS` deepEqual gains the nine document fields.
- `tests/sim/exploit-docs.test.ts`: the two smoke pins above (and its `DOC_PINS` copy).
- `tests/sim/hard-limits.test.ts` "the linear draw (step 21)": its 40,000-id pool is over the new pool ceiling (4,096). It now draws for 256 units from a 4,096-id pool with `limits: { levels: 64, pool: 4096, offer: 8, pools: 256 }`, still under 500 ms (the quadratic draw takes ~4 s on the box, so plant D1 still bites).

## Tests that prove it is done
New `tests/sim/doc-limits.test.ts` (six tests; titles start exactly so):
- "the door limits are read once (step 22)": `boom` limits refused at the three log doors; a counted limits object read 5 times by `readAction`; a counted header read 4 times; `-0` → `0`; a lying length 1e9 / `Infinity` at `nodes: Infinity` refused with no item read; `-1`, `1.5`, `NaN` refused at the default budget (`seen === 0`); `nodes: NaN` → `NOT_PLAIN`; 2²⁰ − 1 values at `Infinity` still copy.
- "map caps (step 22)": 64 × 64 ok; 65 → `over cap cols` / `rows`; `{ side: 256 }` lets 65 through; `{ side: 257 }` throws; 16,385 edges / 1,025 objects refused by name, 16,384 / 1,024 ok; footprint 9 → `bad field objects`, 8 ok; a 129-char id → `over cap text id`, `{ text: 129 }` ok; `rev: 2³¹` → `over cap number rev`, 2³¹ − 1 ok; `createWorld` with `side: 5` throws `map: over cap cols`; a manifest number 2⁵³ → `over cap number project`.
- "stage caps (step 22)": each list at 145 refused by name, 144 ok; 257 waves refused, 256 ok; turn-0 units 146 → `bad field enemyPool`, 144 ok; seed 2³² → `bad field seed`, 2³² − 1 ok; a 129-char id refused; a counted `BTF_STAGE_LIMITS` read 11 times; `boom` → the `readStage` RangeError; `spots: 4097` throws; BTF equals the defaults.
- "notices per read (step 22)": 300 neutrals off the board → 257 notices, the last `and 44 more`; cap 3 → `and 297 more`.
- "gesture options are never live (step 22)": options behind a proxy whose `ownKeys` throws (holding valid values) → `createGestureMapper` throws exactly `RangeError: createGestureMapper: cellPx must be > 0`.
- "level caps (step 22)": 65 levels, offer 9, a 129-id pool, 257 pools → over the caps; 128 ok; the ceiling (pool 4,096, offer 64) reachable; pool 4,097 → the limits RangeError; a threshold 2³¹ → `bad rules or pools`; BTF equals the defaults.

## How a planted bug is caught (for QA; prototype `6695f7c` on `2f7ec00`; reverted after each; `/tmp/h2b-r2-plants.sh` on the Architect's box)
| Plant (intent) | Named test |
|---|---|
| R1a `readAction` / R1b the log doors read the limits live; R2 the header read live; R3 `-0` kept; R4 the budget not clamped | the door limits are read once |
| R4b the length check gone (step 20 L1) | the door limits are read once + the door budget (step 21) |
| M1 side / M2 edges / M3 objects / M4 footprint uncapped; M5 the maker's limits ignored; M6 `createWorld` reads the map without `stageLimits`; M7 the manifest not fitted; T2 int32 gone | map caps |
| T1 the text cap gone | map caps + stage caps |
| S1 the lists / S2 waves / S3 turn-0 uncapped; S4 the seed not uint32; S5 `readStage` reads its limits twice; S6 a throwing limits object escapes | stage caps |
| S7 BTF's stage preset drifts | stage caps + B3 (door-guard) |
| N1 notices uncapped / N2 the caller's cap ignored | notices per read |
| V1 level caps unchecked / V2 one pool uncapped / V3 the maker's level limits ignored / V4 XP past int32 | level caps |
| G1 the gesture mapper keeps the live options when the copy fails | gesture options are never live |

All 29 test plants fail their named tests. **Grep plants** (`/tmp/h2b-r2-grep-plants.sh` on a throwaway clone): 32 plants, one per grep family, each turns its grep in `/tmp/h2b-r2-greps.sh` (27 greps: files, size and caps, pins, untouched paths, no `core/limits` / `core/plain` in project, project's only core import `core/notice.ts`, values, the six test titles, six behaviour probes (one the gesture options), one type, importers, laws, no new folder, sim, the two smoke pins) to FAIL: 32/32. **Step 21's plants** that touch a file this step changes (`/tmp/h2b-r2-s21plants.sh`, from the build-A set `/tmp/s21-plants-A.sh`; B1, L1, L2, L7, O2 follow this code; B1 also removes the clamp, O2 removes the gesture options line): 15/15 still caught. **Step 20's plants** that touch a changed file (`/tmp/h2b-r2-s20plants.sh`; F2 adapted): 20/21 caught, D4 equivalent on build A (a test gap carried to step 23, not counted).

## Example
```ts
readMap(bigMap);                                     // { ok: false, needsMigration: false, error: "over cap cols" }, no terrain read
readMap(bigMap, { side: 256 });                      // read (a maker may raise a cap up to its ceiling)
readStage({ ...stage, seed: 2 ** 32 }, BTF_STAGE_LIMITS); // error "bad field seed"
readStage({ ...stage, id: "s".repeat(129) }, BTF_STAGE_LIMITS); // error "over cap text id"
createLevels({ rules: { ...rules, offerSize: 9 }, pools }, rng, emit); // RangeError("createLevels: over the level caps")
parseLog(text, throwingProxy);                        // { ok: false, error: "bad limits" }; nothing thrown
```

## How later steps use this (context only; do not build)
- **Step 23** adds the recipe caps in the same shape (`SpriteRecipeLimits` totals) and SE-01 C1–C3.
- **H3** (saves, a CN) checks a direct project-reader call on a live hostile object; **H4** budgets the clock.

## Decisions note: what to name
- Where each cap is checked and in what order (the "Order of checks" above), and how you showed no list is read past its cap (a lying length or a counted proxy).
- How the limits are read once at each door, and what a throwing limits object gives at each.
- How the int32 walk names the top-level key, and why the stage seed is left out of it.
- The two moved smoke lines: show that every moved try is a 2⁵³ + 1 mutation now refused.
- Anything you chose that the file doesn't state (law 12).

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/**`, `scripts/**`, `eslint.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.dependency-cruiser.cjs` (change only by Change Notice).
- `src/paint/**` (the recipe is step 23's), `src/state/**`, `src/fx/**`, `src/runtime/**` except `src/runtime/input/gestures.ts`, `src/rules/turns/**`, `src/index.ts`, `src/project/read/guard.ts`; in `src/core` everything but `plain.ts` and `log/log.ts`; `src/btf-adapters/src/{match-limits,sprite-recipe-limits}.ts`; in `src/sim` everything but `world.ts`.
- `tests/**` except the new `tests/sim/doc-limits.test.ts` and the three named edits above.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit. `npm test`: fail 0, skipped 0, todo 0; pass ≥ 498; `rg -n '\.(only|skip|todo)\(' tests` prints nothing.
- [ ] `npm run sim` prints exactly the base's two lines (`… win 48 lose 2 … afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, `… win 22 lose 28 … b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`); the four chaos, four exploit, six levels and four exploit-levels smoke lines are as at the base; the two exploit-docs lines are the new pins (516 / 1,484 and 547 / 1,453, findings 0).
- [ ] Pins: `core-types.ts` `f00c722c…`, `package.json` `1e5dd82c…`, `.dependency-cruiser.cjs` `45a3dbaa…`, `scripts/check-law.sh` `4d7bbf48…`; `npm run deps` reports no violations.
- [ ] Behaviour probes (QA runs them on the working tree): every refusal above by its exact text; the exact values of the six limits objects; the counted reads (5, 4, 11); the lying lengths under a kill timer (a hang is a FAIL).
- [ ] Boundaries: one `DocLimits` type (in `src/project/read/limits.ts`), one `LevelLimits` (in `src/rules/levels/types.ts`); `rg -n 'core/(limits|plain)\.ts' src/project` prints nothing; the only core file `src/project` imports is `core/notice.ts`; no new folder under `src`.
- [ ] Laws hold: no wall time, timers, `crypto`, `process.` or `node:` imports in `src`; no rules words in `src/core`; no `Math.random` in `src`.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the 20 files of the file list (`A` for the two created, `M` for the rest); `git diff --stat` ≤ 400 changed lines, each file within its cap.
- [ ] Hand-back `handback/step-22-document-caps/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Not in this step (deferred; flagged, do not invent). Carries, with their target steps
- **Step 23 (H2b, recipe):** recipe totals (runs, points, frame overrides 32,768 each, ceilings 1,048,576), the 2 MiB recipe document (ceiling 16 MiB), `stored` cut exactly like `doc`, 256 notices per recipe read; SE-01 verify C1 (a notice nit: `side < 32` with a non-number `size.w`), C2 (the assert doc keeps every field), C3 (`read.ts`'s literal `fv < 1` should use `SPRITE_RECIPE_FORMAT`). Split from this step to keep it under 400 lines; the Architect has a draft.
- **Residual, by design:** the entries inside one weighted pool and inside one wave have no count of their own in the accepted table; they are bounded by the door budget (2²⁰ values) and by `picks` / `waveUnits`.
- **H3 / H4** as named in steps 20–21. Ending a match at the time limit stays a game rule, not core.
- Editing `docs/qa/**` (QA) or `docs/chaos-player-outline.md` (Architect).

## Out of scope
- Any HP, attack, damage or stat rule; networking, lobbies, saves; any change to the command log format, the snapshot shape, the state tables or the gesture intents; any cap number not in the accepted table.
