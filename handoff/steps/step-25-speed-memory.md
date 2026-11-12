# step-25-speed-memory: speed and memory (H4). Every engine door that takes text checks its size and depth before `JSON.parse`, in one pass that builds nothing, and refuses by name (`parseLog`, `readFxOrder`, `loadSave`; QA security check finding 1, CEO order 2026-11-12 21:54, and QA's H3 delta); an effect block is held to 64 frames and keeps its parsed JSON only on request; a resumed save with a bad snapshot tick is a typed refusal, not an empty replay (QA step-24 A-vs-B carry); `restore` checks the clock on the world's own step; the recipe size count copies nothing over the cap (QA step-23 carry 3); a direct reader names a cycle; callers get a frozen copy of a unit, never the live record, and `feedIntent` reads its intent once; and the SE-01 C2 test gap (SE2) is closed.

Step id: step-25-speed-memory          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `18f7899211c4d9cd4bbff05976f9934081988e0a` (the step 24 merge: PR #30, build A). The diff is always `<base>..<head>`.
Branch: `step/step-25-speed-memory-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-25-speed-memory-r<N>.bundle <base>..step/step-25-speed-memory-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: in the repo, on that branch: `handback/step-25-speed-memory/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-07 (`parseLog`), step-09 (`restore`, `snapshot`), step-10 (`readFxOrder`, `FX_FORMAT`), step-20-every-door (`plainCopy`, `cellOf`, `NOT_PLAIN`), step-21-hard-limits (`MatchLimits`, `withinCeilings`, `PLAIN_DEPTH`), step-23-recipe-caps (`RECIPE_CAPS.bytes`), step-24-trusted-saves (`loadSave`, `SaveRefusal`, `guarded`)
Read first: BUILD_GUIDE.md §2 laws 4, 5, 7, 9, 12, M4, M7 and §3 (layers: `src/fx` imports only its own files, `types` and `core`; `src/project` and `src/paint` import only their own files, `types` and `core/notice.ts`); `docs/qa/security-check-2026-11-12.md` (finding 1 and the H3 delta); `docs/qa/step-24-ab.md` ("Opt-in snapshot tick"); `docs/qa/step-23-review.md` (carry 3, the 17x measure); `handoff/steps/step-24-trusted-saves.md` ("Not in this step"); `src/core/limits.ts`; `src/core/log/log.ts`; `src/fx/order/read.ts`; `src/sim/run.ts`; `src/project/read/guard.ts`; `src/core/unit/units.ts`; `src/sim/intents.ts`; `src/paint/recipe/read.ts`.
Kit: kit-2, 2026-11-12. Engine Architect. Hardening step H4 (CEO order after H2: H3, then H4, then the renderer). One new number, named in "Decisions": `FX_FORMAT.maxFrames` 64. The text size reuses the H2 document size pair (2,097,152 default, 16,777,216 ceiling, the same as `RECIPE_CAPS.bytes`) and the depth reuses `PLAIN_DEPTH` (32). The interfaces below were prototyped and run green on Node 24.22.1 on the base (prototype branch `h4`, head `78de054`, one code commit). A fresh clone runs `npm ci && npm run green` with exit 0: `tests 521 pass 521 fail 0 skipped 0 todo 0`.
Carries: no CN. `src/types/core-types.ts` (`61fad786…`), `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`), lock (`d7f64a09…`), BUILD_GUIDE, STATES and every state table are unchanged. No document format changes: the save, the command log, the snapshot and the effect block are read exactly as before up to the new refusals. `src/project` and `src/paint` still import no `core/limits.ts` or `core/plain.ts`. No new source file.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Make the engine cheap to feed hostile or huge input, and stop handing out live state. At the base:
- `parseLog`, `readFxOrder` and `loadSave` call `JSON.parse` on text of any length or nesting. Limits are checked only after the parse. A 2 MiB padded save is parsed and only then refused (QA security check finding 1 and the H3 delta).
- `readFxOrder` maps every element of `frames` twice, keeps all past the sixth as `inactive`, and returns the whole parsed object as `raw`. QA's probe: 5,000 frames were accepted with `inactive` 4,994.
- On the opted-in mismatch path, `loadSave` turns a bad snapshot tick (null, -1, 1.5, a string, missing) into 0 and loads an empty replay (QA step-24 A-vs-B: build A's fallback; the proto and build B refused).
- `restore` checks the snapshot clock against a fresh default clock's `stepMs`, not the world's.
- `readSpriteRecipe` counts the 2 MiB `bytes` measure while it builds its copy, so an over-cap document is part-copied before it is refused. Many short keys reach about 17x the measure in heap (QA step-23 carry 3).
- A direct `readMap` / `readManifest` / `readStage` on a cyclic document gives a generic reason (`bad field …`, `wrong kind object` or `unreadable document`), never one naming the cycle (step-24 carry).
- `units.get` and `units.all` return the live unit records; `setOffset` keeps the caller's offset object; `feedIntent` reads the caller's live intent more than once (step-20 and step-23 carries).
- The step-23 "SE-01 carries" test does not notice a part field that is never read (plant SE2, PARTIAL on builds A and the step-24 merge).

Rulings in this step (Engine Architect, 2026-11-12):
- **The text doors check size, then depth, before the parse. Nothing is built first.**
  - `core/limits.ts` gains `TEXT_BYTES` (2,097,152) and `TEXT_BYTES_MAX` (16,777,216). These are the H2 document size and its ceiling, the same pair as `RECIPE_CAPS.bytes` (a test pins them equal; `src/core` cannot import `src/paint`). The count is `text.length` (UTF-16 units), as the recipe count is not exact UTF-8 either.
  - `MatchLimits` gains an optional `bytes`. Absent means `TEXT_BYTES`; present, it must be a whole number from 1 to `TEXT_BYTES_MAX`, or `withinCeilings` is false (so `createLog` / `createWorld` throw their existing RangeError and `parseLog` returns `bad limits`). `textBytes(limits)` reads it. Every existing limits object stays valid, and `DEFAULT_MATCH_LIMITS` does not change.
  - `textOver(text, bytes, depth = PLAIN_DEPTH)` returns `"bytes"` if `text.length > bytes`, else walks the text once, counting `[` and `{` outside strings (a `\` skips the next character inside a string), and returns `"depth"` as soon as the count passes `depth`; otherwise `null`. It builds nothing.
  - `parseLog(text, limits)`: after the limits check and the string check, `textOver(text, textBytes(limits))`; a hit is `{ ok: false, error: "over cap bytes" }` or `"over cap depth"`, and `JSON.parse` is never called.
  - `loadSave(input, text, …)`: after the input copy and before the parse, `textOver(text, …)` with the input's `limits.bytes` (or `TEXT_BYTES` when the input's limits are absent or bad; `createWorld` still refuses bad limits later). A hit is `{ ok: false, code: "saveTooLarge" | "saveTooDeep", needsMigration: false }`, returned, never thrown. The inner log then goes through `parseLog` with the same limits.
  - `readFxOrder(text, limits, opts?)`: `FxReadLimits` gains an optional `bytes` (same default and ceiling; out of range is the existing `readFxOrder: limits out of range` RangeError). Text longer than `bytes` is `fxTooLarge` before anything is searched; the block between the first `{` and the last `}` is depth-scanned (`fxTooDeep`) before the parse. Each is `{ order: null, notices: [that one notice] }`.
  - Depth is `PLAIN_DEPTH` (32), the door copy's own depth. Measured on the prototype: a played save nests 5 and its log 6 (a `via` entry included); levels state adds one or two; an effect block nests 4.
- **An effect block holds at most `FX_FORMAT.maxFrames` (64) frames.** More is `{ order: null, notices: [fxTooManyFrames] }`, decided on the parsed array's length before any frame is read. Up to 64, nothing changes: six play, the rest stay `inactive` with their styles (project-format §6.7 K-4).
- **`raw` is opt-in.** `FxOrder.raw` becomes optional. It is present only when the caller passes `{ raw: true }` as the third argument; by default the parsed object is dropped after the read.
- **A resumed save with a bad snapshot tick is refused by name.** On the opted-in mismatch path, a snapshot tick that is not a whole number ≥ 0 (null, -1, 1.5, a string, missing, or a snapshot that is not a record) is `{ ok: false, code: "saveSnapshotTickInvalid", needsMigration: false }`, before any replay. A huge whole tick still reaches `replay` and throws its limits error, as before. The non-mismatch path is unchanged (`restore` refuses a bad tick by name).
- **`restore` uses the world's own step.** The pre-check before any work no longer builds a default clock. It keeps the tick and `logSeq` checks and adds a step-free clock check: `clockMs` must be 0 at tick 0, else a whole multiple of the tick and at least the tick (true for any whole `stepMs`). The full compare after replay (`snapshot(world)` against the snapshot) checks `clockMs` with the world's own `stepMs`. A forged tick of 1e9 on its own is still refused by name before any replay; a tick and `clockMs` forged together at 1e9 pass this pre-check and are stopped at replay by the existing limits error with 0 ticks run (carried, see "Not in this step").
- **The recipe size count copies nothing over the cap.** `readSpriteRecipe` first runs `measure`, which walks the document with exactly `copy`'s count (each value 1, each string and key its length, dropped keys counted and skipped, depth over 10,000 and `bigint` not plain) and builds nothing. Over `bytes` is `over cap bytes` before any copy; not plain is `not plain JSON`. Then `copy` runs as before (its own count stays, so a value that changes between the two reads is still capped). The measure rule does not change, so every accepted or refused recipe stays so. Measured on the prototype: an over-cap document of 300,000 short keys grows the heap by well under the tested 12 MiB bound during the read (QA measured 8.73 MiB, against 29.14 MiB at the base).
- **A direct reader names a cycle.** `guarded(read, json?)` takes the document as a second argument, and the three readers pass it. Only when the read fails with a generic reason (`unreadable document`, `bad field …` or `wrong kind object`) does the guard look for a cycle in the caller's document: each object is walked once, a shared object is not a cycle, and a throw while looking keeps the original reason. A cycle is `{ ok: false, needsMigration: false, error: "cyclic document" }`. A successful read and every named refusal (`over cap …`, `needsMigration`) never walk the document, so the step-22 "read 0 times" lying-length tests stay.
- **Callers get a copy of a unit, never the live record.** `units.get(id)` and `units.all()` return frozen copies (the record and its cell; `offset` is already a frozen copy). `setOffset` stores a frozen copy of the offset it is given. `feedIntent(world, intent, aim?)` reads the intent once through `plainCopy(intent, 3)` and the aim through `cellOf`; a non-plain intent returns `null` (no event), never a throw. No value changes, so the sim and every smoke stay.
- **SE2 is closed by a test.** A new test reads `SAMPLE` and checks that every field path of `SAMPLE` is present in `doc`. The step-23 SE2 plant (`mirror` never read) now fails it.
- **Every other number is unchanged.** If a fixture or test needs another number, stop and ask.

## Files to create or change
- change `src/core/limits.ts`: `bytes?` on `MatchLimits`, `TEXT_BYTES`, `TEXT_BYTES_MAX`, `textBytes`, `textOver`, the `withinCeilings` row (≤ 23); `src/core/log/log.ts`: the pre-parse check in `parseLog` (≤ 7)
- change `src/fx/order/read.ts`: `bytes`, the size and depth checks, `maxFrames`, `raw` opt-in (≤ 22); `src/fx/order/types.ts`: `raw?` and `bytes?` (≤ 7)
- change `src/sim/run.ts`: the save pre-parse check, `saveSnapshotTickInvalid`, the three codes, the step-free clock pre-check (≤ 19); `src/sim/intents.ts`: `feedIntent` reads once (≤ 9)
- change `src/core/unit/units.ts`: frozen copies from `get` / `all`, `setOffset` copies (≤ 10)
- change `src/project/read/guard.ts`: `cyclic` and `guarded(read, json?)` (≤ 18); `manifest.ts`, `map.ts`, `stage.ts`: pass the document (≤ 6 each)
- change `src/paint/recipe/read.ts`: `measure` before `copy` (≤ 15)
- create `tests/sim/speed-memory.test.ts` (≤ 91); change one existing test by ruling: `tests/fx/read.test.ts` (≤ 6)

Size: ≤ 400 changed lines in total, counting insertions + deletions. The per-file caps above add up to 245. The prototype (`78de054` on `18f7899`) has 189 changed lines in 14 files (165+/24-), each file 4 under its cap. No new fixtures. If it does not fit, stop and ask.

## Interfaces to match (quoted exactly)
From earlier steps: `parseLog`, `ParseResult`, `MatchLimits`, `MATCH_CEILINGS`, `DEFAULT_MATCH_LIMITS`, `withinCeilings`, `PLAIN_DEPTH`, `plainCopy`, `cellOf`, `isRecord`, `NOT_PLAIN`, `readFxOrder`, `FX_FORMAT`, `FxOrder`, `FxRead`, `FxReadLimits`, `loadSave`, `SaveRefusal`, `restore`, `snapshot`, `guarded`, `ReadResult`, `units`, `feedIntent`, `readSpriteRecipe`, `RECIPE_CAPS`. Import these; do not redefine.
```ts
// src/core/limits.ts
export type MatchLimits = { readonly entries: number; readonly ticks: number; readonly durationMs: number; readonly text: number; readonly notices: number; readonly bytes?: number };
export const TEXT_BYTES = 2097152, TEXT_BYTES_MAX = 16777216;   // the H2 document size pair (= RECIPE_CAPS.bytes)
export const textBytes = (limits: { readonly bytes?: number }): number;   // limits.bytes ?? TEXT_BYTES
export function textOver(text: string, bytes: number, depth?: number): "bytes" | "depth" | null;   // depth defaults to PLAIN_DEPTH; builds nothing
// src/core/log/log.ts: parseLog → { ok: false, error: "over cap bytes" } | { ok: false, error: "over cap depth" } before JSON.parse
// src/fx/order/types.ts
export type FxOrder = { …unchanged…; readonly raw?: Readonly<Record<string, unknown>> };
export type FxReadLimits = { …unchanged…; readonly bytes?: number };
// src/fx/order/read.ts
FX_FORMAT.maxFrames === 64
export function readFxOrder(text: string, limits: FxReadLimits, opts?: { readonly raw?: boolean }): FxRead;   // fxTooLarge, fxTooDeep, fxTooManyFrames: order null
// src/sim/run.ts (exported from src/sim/index.ts)
export type SaveRefusal = { readonly ok: false; readonly code: "saveEngineMismatch" | "saveProjectMismatch" | "saveFormatNewer" | "saveFormatOlder" | "saveMigrationFailed" | "saveTooLarge" | "saveTooDeep" | "saveSnapshotTickInvalid"; readonly needsMigration: boolean };
// src/project/read/guard.ts
export function guarded<T>(read: () => ReadResult<T>, json?: unknown): ReadResult<T>;   // a generic failure on a cyclic json → { ok: false, needsMigration: false, error: "cyclic document" }
// src/core/unit/types.ts: unchanged (get / all already return UnitState, now frozen copies)
```

## Smoke lines
None move. `npm run sim` and all 20 smoke lines are byte-identical to the base. No smoke text reaches either cap, unit copies change no value, and the readers' cycle look runs only after a generic failure.

## Existing tests changed by ruling (and only these)
- `tests/fx/read.test.ts` "§A…" `raw` row: the read passes `{ raw: true }` and reads `order?.raw?.look` (`raw` is opt-in).

## Tests that prove it is done
New `tests/sim/speed-memory.test.ts`, eight tests whose titles start exactly so:
- **"text doors check size before the parse (step 25)":** with `JSON.parse` spied (`t.mock.method(JSON, "parse")`):
  - `parseLog` of `TEXT_BYTES + 1` spaces is `over cap bytes`, of 33 nested `[` is `over cap depth`, and of a real log under `{ bytes: 16 }` is `over cap bytes`;
  - `loadSave` of the same two texts is `saveTooLarge` and `saveTooDeep`, and a real save under `limits.bytes` 16 is `saveTooLarge`;
  - `readFxOrder` of the big text is `fxTooLarge`, of a block nesting 33 is `fxTooDeep`, and of a real block under `bytes` 16 is `fxTooLarge`;
  - after all of these the spy has 0 calls; 32 nested `[` reaches the parse (1 call);
  - a real log and save read, also at `bytes` `TEXT_BYTES_MAX`; `textOver` ignores brackets and an escaped quote inside a string; `bytes` one over the ceiling is `bad limits` from `parseLog` and a RangeError from `readFxOrder`; `TEXT_BYTES` and `TEXT_BYTES_MAX` equal `RECIPE_CAPS.bytes`.
- **"an effect block keeps its frames bounded and raw is opt-in (step 25)":** 64 frames read (6 steps, 58 inactive, 58 inactive styles); 65 frames and QA's 5,000 are `fxTooManyFrames` with `order` null; 100,000 frames is `fxTooLarge`; no `raw` by default; `{ raw: true }` keeps it.
- **"a resumed save refuses a bad snapshot tick (step 25)":** null, -1, 1.5, `"7"` and a missing tick are each `saveSnapshotTickInvalid` under `allowProjectMismatch` and under `allowEngineMismatch`; an honest resume still equals the saved world.
- **"restore checks the clock on the world's own step (step 25)":** a played snapshot restores; `clockMs` + 1, twice the honest `clockMs`, 0 and `-stepMs` are each "restore: snapshot does not match the log"; tick 1e9 is too.
- **"a direct reader names a cycle (step 25)":** a document whose `kind` is itself is `cyclic document` from all three readers; a shared (not cyclic) object is still `wrong kind object`; a throwing proxy is still `unreadable document`; bad limits still throw a RangeError.
- **"callers get a copy of a unit, never the live record (step 25)":** `get` and every `all()` item are frozen with a frozen cell; writing the cell throws a `TypeError`; after a push the cell is still frozen; an offset changed by the caller after `setOffset` does not change the unit, and the stored offset is frozen; an intent whose `type` getter answers differently each read is read once and gives `SELECT_UNIT`; a throwing proxy intent gives `null`.
- **"every part field is read (step 25)":** every field path of `SAMPLE` is present in the read `doc`.
- **"the recipe size count copies nothing over the cap (step 25)":** a sample with 300,000 extra short keys under `bytes` 1,000,000 is `over cap bytes` and the heap grows by less than 12 MiB during the read (the base grows 19–28 MiB); a `bigint` value is still refused.

## How a planted bug is caught (for QA; prototype `78de054` on `18f7899`; reverted after each; `/tmp/h4-plants.sh` on the Architect's box)
| Plant (intent) | Named test |
|---|---|
| PL1 `parseLog` parses before the size check; PL2 `loadSave` parses before it; PL3 `readFxOrder` parses oversize text; PL4 the depth scan never refuses; PL5 the scan counts brackets inside strings; PL6 a `bytes` over the ceiling is accepted; PL7 the text default drifts from the H2 size; PL8 the fx `bytes` is not checked; PL9 the fx depth scan is skipped | text doors check size before the parse |
| FR1 an effect block walks every frame; FR2 `raw` always kept; FR3 `raw` never kept | an effect block keeps its frames bounded and raw is opt-in |
| TK1 a bad resumed tick becomes 0 (build A's fallback); TK2 a bad resumed tick throws | a resumed save refuses a bad snapshot tick |
| CK1 `restore` drops the clock pre-check (work before the refusal); CK2 `restore` skips the full compare on the world's clock | restore checks the clock on the world's own step |
| CY1 the guard never looks for a cycle; CY2 a shared object reads as a cycle; CY3 `readMap` does not pass its document | a direct reader names a cycle |
| UN1 `get` hands out the live record; UN2 `all` hands out live records; UN3 `setOffset` keeps the caller's object; UN4 `feedIntent` reads the live intent; UN5 the copy shares the live cell | callers get a copy of a unit, never the live record |
| PF1 a part field is not read (the step-23 SE2 plant) | every part field is read |
| RC1 the recipe is copied before it is counted | the recipe size count copies nothing over the cap |

All 26 test plants fail their named tests (26/26). **Grep plants** (`/tmp/h4-grep-plants.sh` on a throwaway clone): 26 plants, one per grep family plus each text door, the bytes ceiling, the frames cap, `raw`, the tick, the default clock, the clock pre-check, the cycle look, live records, `setOffset`, the part fields and the recipe pre-count. Each turns its grep in `/tmp/h4-greps.sh` to FAIL: 26/26. The 30 greps cover: files, size and caps, pins, untouched paths, no `core/limits` / `core/plain` in project or paint, fx's only core imports, values, the eight test titles, ten behaviour probes (the pre-parse refusals with a `JSON.parse` spy, the bytes limit, fx frames and `raw`, the tick, no default clock, restore, cycles, live records, part fields, the recipe pre-count), the stage comment, laws, no new source file, sim, and the two smoke pins. **Earlier plants that touch a file this step changes** (on `78de054`):
- step 24 (`/tmp/h4-s24plants.sh`, build-A forms): 32/32. HD1–HD4 follow the guard's new second argument.
- step 23 (`/tmp/h4-s23plants.sh`): 30/30. RC4 removes both size counts (the measure and the copy; the copy's alone is now masked by the measure, which is the point). SE2 is now CAUGHT by its step-25 home "every part field is read", closing the step-23 verify carry C1.
- step 22 (`/tmp/s23-s22plants-A.sh`): 28/29, unchanged. R4 fails its step-23 home "the door copy (step 23)", as on the base.

## Example
```ts
parseLog(" ".repeat(TEXT_BYTES + 1));                   // { ok: false, error: "over cap bytes" }: JSON.parse never called
loadSave(input, "[".repeat(40) + "]".repeat(40));         // { ok: false, code: "saveTooDeep", needsMigration: false }
loadSave({ ...input, limits: { ...DEFAULT_MATCH_LIMITS, bytes: 16777216 } }, bigSave); // reads a save up to 16 MiB
readFxOrder(blockWith5000Frames, BTF_FX_READ_LIMITS);    // { order: null, notices: [fxTooManyFrames] }
readFxOrder(block, BTF_FX_READ_LIMITS, { raw: true });    // order.raw is the parsed JSON; without the option there is no raw
loadSave({ ...input, projectHash: "other" }, saveWithTickNull, { allowProjectMismatch: true }); // { ok: false, code: "saveSnapshotTickInvalid", needsMigration: false }
const o: Record<string, unknown> = {}; o.kind = o; readMap(o); // { ok: false, needsMigration: false, error: "cyclic document" }
world.units.get("knight#1").at.c = 9;                     // TypeError: a frozen copy
```

## Decisions note: what to name
- The one new number, `FX_FORMAT.maxFrames` 64 (an Architect ruling: six play, up to 58 kept inactive; more is refused, not cut, so no frame is dropped silently), and that you added no other.
- That the text size reuses the H2 document pair (2,097,152 / 16,777,216, the same as `RECIPE_CAPS.bytes`) and the depth reuses `PLAIN_DEPTH`, and that the count is `text.length`.
- That `bytes` is optional on `MatchLimits` and `FxReadLimits`, so every existing limits object, preset and save stays valid, and `DEFAULT_MATCH_LIMITS` is unchanged.
- That at the default a save over 2 MiB is `saveTooLarge` until the host passes a larger `limits.bytes` (up to 16 MiB). Only a near-full 2,048-entry log with every text field at 128 characters gets there (about 2.1 MB as a save, step 24 F4); such a save is already over the 1 MiB sync envelope and kept local. The engine never deletes or rewrites it.
- The three new save codes (`saveTooLarge`, `saveTooDeep`, `saveSnapshotTickInvalid`) and the three new fx codes (`fxTooLarge`, `fxTooDeep`, `fxTooManyFrames`). If DSK names them otherwise, use DSK's names.
- Why the recipe count runs twice (once building nothing, then the copy with its own count), and why the measure rule is unchanged.
- Why the cycle look runs only after a generic failure (the step-22 read-0-times tests and the cost of a good read).
- That `units.all()` is copied too (the same live-record hole as `get`).
- Anything you chose that the file doesn't state (law 12).

## Do not touch
- `BUILD_GUIDE.md`, `docs/**`, `handoff/**`, `scripts/**`, `eslint.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.dependency-cruiser.cjs`, `src/types/**`.
- `src/state/**`, `src/runtime/**`, `src/rules/**`, `src/btf-adapters/**`, `src/index.ts`; in `src/core` everything but `limits.ts`, `log/log.ts` and `unit/units.ts` (`plain.ts`, `log/types.ts`, `unit/types.ts` stay as they are); in `src/fx` everything but `order/read.ts` and `order/types.ts`; `src/paint/recipe/{fields,limits,types,index}.ts`; `src/project/read/{limits,placements,index}.ts`; in `src/sim` everything but `run.ts` and `intents.ts` (`migrations/**` stays).
- `tests/**` except the new `tests/sim/speed-memory.test.ts` and the one named edit above.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit. `npm test`: fail 0, skipped 0, todo 0; pass ≥ 521; `rg -n '\.(only|skip|todo)\(' tests` prints nothing.
- [ ] `npm run sim` prints exactly the base's two lines (`… win 48 lose 2 … afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, `… win 22 lose 28 … b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`). All 20 smoke lines are byte-identical to the base (the exploit-docs pins stay 516 / 1,484 and 547 / 1,453).
- [ ] Pins unchanged: `core-types.ts` `61fad786…`, `package.json` `1e5dd82c…`, `.dependency-cruiser.cjs` `45a3dbaa…`, `scripts/check-law.sh` `4d7bbf48…`, lock `d7f64a09…`. `npm run deps` reports no violations.
- [ ] Behaviour probes (QA runs them on the working tree):
  - each text door refuses oversize and too-deep text by its exact code or text, with `JSON.parse` never called;
  - `bytes` can be raised to 16 MiB and lowered; one over the ceiling is refused;
  - 64 frames read, 65 and 5,000 are `fxTooManyFrames`; `raw` only on request;
  - each bad resumed tick is `saveSnapshotTickInvalid` on both opt-ins;
  - `src/sim/run.ts` builds no clock; an edited `clockMs` and tick 1e9 are refused by name;
  - a cyclic document is `cyclic document` from each reader, a shared object is not;
  - `get` / `all` copies are frozen, `setOffset` copies, `feedIntent` reads once;
  - every `SAMPLE` field is read; an over-cap recipe grows the heap by under 12 MiB.
- [ ] Boundaries: `rg -n 'core/(limits|plain)\.ts' src/project src/paint` prints nothing; `src/fx/order/read.ts` imports only `core/limits.ts` and `core/notice.ts` from core; `src/btf-adapters/src/stage-limits.ts` has no "PROPOSED". No new file under `src`.
- [ ] Laws hold: no wall time, timers, `crypto`, `process.` or `node:` imports in `src`; no rules words in `src/core`; no `Math.random` in `src`.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the 14 files of the file list (`A` for the test file created, `M` for the rest). `git diff --stat` is ≤ 400 changed lines, with each file within its cap.
- [ ] Hand-back `handback/step-25-speed-memory/r<N>/` is complete per HAND-BACK.md, with the PR line as in Delivery. The bundle verifies and its branch tip is the hand-back commit. Nothing is committed to `main`.

## Not in this step (deferred; flagged, do not invent). Carries, with their target steps
- **Step 26 (gh-pages cleanup, CEO order 21:54, item c):** remove `ConvertEngine.init(source)` / `new Function` (`js/convert-engine.js:49`); escape the session unit ids put into `innerHTML` in `app.js`; a grep gate for `new Function` and `eval`, and a test that a unit id holding `<img onerror>` renders as text. Not engine code.
- **The renderer (CEO order 20:03):** the clock pile-up row (a long `durationMs` steps the clock tick by tick; the 16,384 ms cap bounds it today, step 21). Shrinking it needs a bulk clock step and belongs with the frame player, where the clock is driven per frame.
- **Residual, by design:** an in-cap recipe of many short keys still costs about 17x its measure in heap (about 34 MiB at the 2 MiB default; QA: "not a must-fix"). Tightening the measure is a rule change for DSK and the CEO, not an engineering fix. The text doors bound the same thing for parsed text.
- **Next hardening pass (QA step-25 nit 1):** an over-ceiling limits object behaves three ways: `parseLog` returns `bad limits`, `readFxOrder` throws its RangeError, and `loadSave` silently uses the 2 MiB default. Unify on one named refusal.
- **Next hardening pass (QA step-25 nit 3):** a save whose snapshot tick and `clockMs` are both forged consistently at 1e9 passes the `restore` pre-check and is stopped at replay by the limits error (0 ticks run, nothing built past the cap); give it a named pre-replay refusal.
- **Note:** `TEXT_BYTES` counts UTF-16 units (`text.length`), not UTF-8 bytes; a string of `é` or emoji at the cap is about 4 MiB as UTF-8. By design.
- **Residual, by design:** a direct reader on a *consistent* live document can return values a second read would change (step 24). `createWorld` copies first; direct callers own their documents.
- **Host, not engine:** signing a save; `header.projectId` / `savedAt` unchecked (the online step).
- **QA step-21 residuals, still not holds:** the honest 2^20 copy cost; `withinCeilings` on a throwing proxy throws; `createLog` reads its header three times; seed `-0` stored as `-0`; an explicit `nodes = Infinity` walks a finite liar. Carried on to a later hardening pass.
- Editing `docs/qa/**` (QA), `data/core-types.ts` (DSK) or `docs/chaos-player-outline.md` (Architect).

## Out of scope
- Any HP, attack, damage or stat rule; networking, lobbies, cloud saves, save slots or UI; any change to the command log format, the save format, the snapshot shape, the effect block format, the state tables or the gesture intents; any cap number other than the one named here; the gh-pages site.
