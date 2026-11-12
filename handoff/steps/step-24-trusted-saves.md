# step-24-trusted-saves: saves you can trust (H3). A match save (`MatchSave`, CN-009 r2: the project-format §6.9 `header`, its own kind `match-save` v1, the log is the truth) written by `saveMatch` and read by `loadSave`, which never throws on a version, engine or project mismatch: it returns a typed refusal, and the host can resume a mismatch by explicit opt-in; an older save goes through the `migrations/save/` hook, which is contained (a throw, a hostile or non-plain result, or anything but a match-save at `SAVE_FORMAT` is the typed `saveMigrationFailed`); `replay` checks its limits before it builds the world; what an edited save can and cannot change, pinned; the in-memory log cannot be edited through an entry or its header; a direct project-reader call on a live hostile document is a refusal, never a throw; and the QA carries: the BTF recipe totals and `stages` derived from one source, `historyBytes` given a ceiling below the document size so it can fire, and the BTF stage comment marked CEO-approved.

Step id: step-24-trusted-saves          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `219959a1e3d041dfd59586c93a5b6993ad3545c6` (the step 23 merge: PR #29, build A). The diff is always `<base>..<head>`.
Branch: `step/step-24-trusted-saves-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-24-trusted-saves-r<N>.bundle <base>..step/step-24-trusted-saves-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: in the repo, on that branch: `handback/step-24-trusted-saves/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-07 (`createLog`, `parseLog`, `LogHeader`), step-09 (`replay`, `restore`, `snapshot`), step-20-every-door (`plainCopy`), step-21-hard-limits (`MatchLimits`, `withinCeilings`), step-22-document-caps (`readManifest`, `readMap`, `readStage`, `DEFAULT_DOC_LIMITS`), step-23-recipe-caps (`RECIPE_CAPS`, `BTF_SPRITE_RECIPE_LIMITS`, `BTF_STAGE_LIMITS`)
Read first: BUILD_GUIDE.md §2 laws 4, 5, 7, 9, 12, M4, M7 and §3 (layers: `src/project` and `src/paint` import only their own files, `types` and `core/notice.ts`); `change-notices/CN-009-match-save-type.md`; `handoff/steps/step-23-recipe-caps.md` ("Not in this step"); `docs/qa/step-23-review.md` (carries 1 and 2); `src/sim/run.ts`; `src/core/log/log.ts`; `src/project/read/guard.ts`.
Kit: kit-2, 2026-11-12. Engine Architect. Hardening step H3 (CEO order after H2: H3, then H4, then the renderer). One number is **proposed** and flagged in "Decisions": the `historyBytes` ceiling of 1,048,576. The 144 entries and 1,024 stages are CEO-approved (2026-11-12 19:35). The interfaces below were prototyped and run green on Node 24.22.1 on the base (prototype branch `h3r3`, head `7aa021d`, one code commit: r2 carried DSK's CN-009 findings F1–F4, and r3 carries QA r2's must-fix, containing the hook). A fresh clone runs `npm ci && npm run green` with exit 0: `tests 513 pass 513 fail 0 skipped 0 todo 0`.
Carries: **CN-009 r2** (core-types adds the shared `SaveHeader` and `MatchSave`, five lines, add-only; `core-types.ts` `f00c722c…` → `61fad786…`, and `tests/smoke.test.ts` pins the new sha). Data & Save Keeper signs CN-009 off before this step is sent. No other pinned file changes: `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`), lock (`d7f64a09…`), BUILD_GUIDE, STATES and every state table are unchanged. `src/project` and `src/paint` still import no `core/limits.ts` or `core/plain.ts`. One new folder and source file: `src/sim/migrations/save/index.ts`, the save-side migrations hook (project-format §6.9). No other new file.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Make a saved match trustworthy. At the base:
- No save document exists.
- There is no typed result for a save for another engine, project or format version, and no save-side migrations hook.
- `replay` checks its tick and log length only after `createWorld` has read every document.
- A caller can edit the in-memory log through `log.entries()[i].action` or `log.header`. Entries are live objects, so a desync is possible.
- A direct `readManifest` / `readMap` / `readStage` call throws on a live hostile document: a throwing getter, a revoked proxy, or a cycle deep enough to overflow the stack (QA step-22 residual, carried as H3).
- `BTF_SPRITE_RECIPE_LIMITS` and `BTF_STAGE_LIMITS.stages` hand-copy their engine defaults (QA step-23 carry 1).
- `historyBytes` shares the 16 MiB ceiling with `bytes`. A history lives inside the document, so the history cap can never fire at its ceiling (QA step-23 carry 2).
- The BTF stage comment still says "PROPOSED, pending CEO" (CoS nit).

Rulings in this step (Engine Architect, 2026-11-12; r2 carries DSK's findings F1–F4 as ruled by the CEO):
- **F1. A save is `MatchSave` (CN-009 r2):** `{ kind: "match-save", formatVersion: 1, header: SaveHeader, log, snapshot }`.
  - `header` is the project-format §6.9 save header `{ projectHash, engineVersion, projectId, savedAt }`, unchanged. The type is `SaveHeader`, declared once in core-types and shared with every save kind; `MatchSave` refers to it and does not redeclare it.
  - `match-save` is its own kind, v1 (project-format r22 §6.9.1). The log is the truth; the snapshot is a check value.
  - `log` is `CommandLog.toJSON()` text, and `snapshot` is `snapshot(world)` at the save point.
  - `saveMatch(world, { projectId, savedAt })` returns `JSON.stringify` of it. `projectId` and `savedAt` come from the host, since the sim reads no wall time. A non-string throws a `RangeError`.
- **F2. A mismatch is a typed result, never a throw.** `loadSave(input, text, opts?)` returns `{ ok: true, world, notices }` or `{ ok: false, code, needsMigration }`. It works in this order, and nothing is read from a document before step 6:
  1. The input and options are copied once (throws `"load: input is not plain data"`).
  2. The text must parse to a record with `kind: "match-save"` and an integer `formatVersion` (throws `"load: not a match save"`).
  3. `formatVersion > 1` returns `{ ok: false, code: "saveFormatNewer", needsMigration: false }`.
  4. `formatVersion < 1` goes through the hook (F3).
  5. `header` must hold the four strings and `log` must be a string (throws `"load: not a match save"`).
  6. `parseLog(log, input.limits)` runs (throws `` `load: ${error}` ``).
  7. **The save header and the log's own header must agree** on `engineVersion` and `projectHash`. If they don't, the file was edited, and it is refused by name: `"load: the log header is not the save header"`. That is not a resumable mismatch, and no opt-in passes it.
  8. A save for another engine returns `saveEngineMismatch`; another project returns `saveProjectMismatch`. Both have `needsMigration: false`.
  9. With no mismatch: `restore(input, log, snapshot)`, and `notices` is empty.
  - **Opt-in resume:** `{ allowProjectMismatch: true }` resumes a project mismatch, and `{ allowEngineMismatch: true }` an engine mismatch. Each opt-in covers only its own mismatch. The log replays through the normal rules to the snapshot's tick: an illegal entry is refused by the same doors as live, and the snapshot is not trusted. `notices` names each mismatch that was crossed.
  - **Malformed or tampered data is still refused by name** (steps 1, 2, 5, 6, 7 and the restore check).
  - **The host keeps the file. Nothing is deleted.** A refusal is a warning to the host (sync-format r12), never a reason to drop the save. "Start fresh" keeps a backup, `<saveId>.backup-<savedAt>`. The engine never deletes or rewrites a save.
  - `replay` no longer looks at the engine or project (F2: replay never throws on a mismatch). It checks `untilTick` and `log.lastSeq()` against the input's limits right after it copies the input, before `createWorld`, with `"replay: tick or log over the limits"`. Bad limits are still refused by `createWorld` with its own RangeError.
- **F3. Older formats go through `src/sim/migrations/save/`.**
  - `SAVE_MIGRATIONS` holds two separate chains, `save` and `match-save`, and both are empty at v1. A match-save step never sits in, or runs from, save's chain.
  - `SAVE_FORMAT` is 1. `migrateSave(kind, doc, from, to = SAVE_FORMAT, chains = SAVE_MIGRATIONS)` runs the kind's steps from `from` up to `to`. It returns `null` if a step is missing, and throws a `TypeError` if a step returns something that is not an object, so a step that returns nothing is never read as a missing one.
  - A save with `formatVersion < 1` is passed through `migrateSave("match-save", …)`. If that gives `null`, the result is `{ ok: false, code: "saveFormatOlder", needsMigration: true }` (see Decisions: `saveFormatOlder` is not in DSK's table of three).
  - `needsMigration` is true only when the file is older and the hook can't bring it up, so it is always false at v1.
  - A newer format is `saveFormatNewer`, never a crash.
  - **The hook is contained (QA r2 must-fix).** `loadSave` calls `migrateSave` inside `try`/`catch`. A throw from a step, or from reading what it returned, is `{ ok: false, code: "saveMigrationFailed", needsMigration: true }`, never a raw error.
    - The result is copied with the core door copy, `plainCopy(result, PLAIN_DEPTH)` from `core/plain.ts`. `src/sim` already imports it, so depcruise allows it with no change.
    - After the copy, `loadSave` checks again that the result is a record with `kind === "match-save"` and `formatVersion === SAVE_FORMAT`. Anything else is `saveMigrationFailed`: a non-plain result (a proxy, a getter that throws, a `Map`, a number, a function), a still-old result, or another kind.
    - Only then do the header, log and restore checks run, on the copy.
    - `loadSave`'s fourth argument, `chains` (default `SAVE_MIGRATIONS`), is the registry it uses. Tests pass a hostile one; a host never needs to.
- **F4. A long log and the 1 MiB save envelope** (sync-format r12 §5.5). Sync measures the whole envelope. At 75% the host shows `saveNearSyncLimit`. Over 1 MiB the save gets `saveTooLargeToSync` and stays local: it is never truncated, and the log is never trimmed. Measured on the prototype with a 2,048-entry log (the `entries` default):
  - typical move entries: the log is 343,622 B, or 417,376 B as escaped text inside the save. That is about 40% of the cap, plus about 0.9 KB of snapshot for a small stage. About 5,000 such entries fit.
  - every text field at the 128 cap: the log is 2,002,931 B, or 2,105,357 B inside the save. That is about 2x the cap, so such a save stays local with `saveTooLargeToSync`. About 1,000 such entries fit.
  - An entry's `effects` count is bounded only by the door budget, so a cap on save text belongs to H4 (see "Not in this step").
- **Tamper reach (what an edited save can and cannot change).** The log is the truth.
  - Cannot change: an edited snapshot (a unit's cell, the rng state) does not match the log, so it is refused (`restore: snapshot does not match the log`).
  - Cannot change: an edited log header is refused. Against the save header it is "the log header is not the save header", with or without an opt-in. A seed that is not the stage's is `replay: world seed …`.
  - Cannot change: a save header relabelled to another engine or project is refused the same way. It never becomes a resumable mismatch.
  - Cannot change: a reordered or renumbered entry is refused (`load: bad entry`).
  - Can change: an edit can only swap in another whole game, with the log and the snapshot made together. That game is replayed through the same doors as a live one, so it can hold only what a player could have sent (an off-board move is refused there too).
  - There is no signature. Detecting a rewritten save is a host concern and is out of scope (see "Not in this step").
- **The log cannot be edited through an entry.** Each appended entry is a deep-frozen copy (`plainCopy(…, 4)`): the entry, its action, the action's target, `effects` and `via`. `log.header` is frozen. `entries()` still returns a new array each call.
- **A direct reader on a live hostile document is a refusal, never a throw.** `readManifest`, `readMap` and `readStage` check their limits first; a bad limits argument still throws its RangeError. Then they read the document inside `guarded(…)` (`src/project/read/guard.ts`). Any throw becomes `{ ok: false, needsMigration: false, error: "unreadable document" }`.
  - No copy is made, and `src/project` does not import `core/plain.ts`. A copy first would refuse a lying `length` as "not plain data" instead of `over cap …` read 0 times (step 22). It would also drop `__proto__` keys (losing the palette notice), and it moves the exploit-docs smoke.
  - `createWorld` still copies its whole input first (step 20).
- **One source for the BTF defaults (QA carry 1).** `BTF_SPRITE_RECIPE_LIMITS.totalRuns`, `totalPoints`, `totalTweaks`, `bytes` and `notices` are `RECIPE_CAPS.<key>[0]`. `BTF_STAGE_LIMITS.stages` is `DEFAULT_DOC_LIMITS.stages`. `RECIPE_CAPS` is exported from `src/paint/recipe/index.ts`. The values do not change.
- **`historyBytes` gets its own ceiling (QA carry 2; engine ceiling, Architect ruling, DSK agreed):** 1,048,576 (1 MiB). That is under the default 2 MiB document, so the history cap can fire. BTF's 1,000,000 is under it. `{ historyBytes: 1048577 }` is the existing limits RangeError.
- **CoS nit:** the BTF stage comment reads "CEO-approved 2026-11-12: 144 entries per pool or wave, 1,024 stages".
- **Every other number is unchanged.** If a fixture or test needs another number, stop and ask.

## Files to create or change
- change `src/types/core-types.ts`: `SaveHeader` and `MatchSave`, CN-009 r2's five lines only (≤ 9); `tests/smoke.test.ts`: the core-types pin (≤ 6)
- change `src/sim/run.ts`: `saveMatch`, `loadSave` with the contained hook, its types and the `replay` limits check (≤ 57); `src/sim/index.ts`: the exports (≤ 7)
- create `src/sim/migrations/save/index.ts`: `SAVE_FORMAT`, `SAVE_MIGRATIONS` and `migrateSave` (≤ 15)
- change `src/core/log/log.ts`: frozen entries and header (≤ 8)
- change `src/project/read/guard.ts`: `guarded` (≤ 8); `manifest.ts`, `map.ts`, `stage.ts`: the read inside `guarded`, limits first (≤ 9 each)
- change `src/btf-adapters/src/sprite-recipe-limits.ts` (≤ 8), `src/btf-adapters/src/stage-limits.ts` (≤ 10): one source, the comment; `src/paint/recipe/limits.ts`: the `historyBytes` ceiling (≤ 6); `src/paint/recipe/index.ts`: export `RECIPE_CAPS` (≤ 6)
- create `tests/sim/trusted-saves.test.ts` (≤ 99); change one existing test by ruling: `tests/sim/recipe-caps.test.ts` (≤ 6)

Size: ≤ 400 changed lines in total, counting insertions + deletions. The per-file caps above add up to 272. The prototype (`7aa021d` on `219959a`) has 208 changed lines in 16 files, each file 4 under its cap. No new fixtures. If it does not fit, stop and ask.

## Interfaces to match (quoted exactly)
From earlier steps: `createLog`, `parseLog`, `CommandLog`, `LogEntry`, `replay`, `restore`, `snapshot`, `SimInput`, `SimSnapshot`, `SimWorld`, `plainCopy`, `NOT_PLAIN`, `withinCeilings`, `DEFAULT_MATCH_LIMITS`, `RECIPE_CAPS`, `DEFAULT_DOC_LIMITS`, `ReadResult`. Import these; do not redefine.
```ts
// src/types/core-types.ts (CN-009 r2)
export type SaveHeader = { readonly projectHash: string; readonly engineVersion: string; readonly projectId: string; readonly savedAt: string };
export type MatchSave = { readonly kind: "match-save"; readonly formatVersion: 1; readonly header: SaveHeader; readonly log: string; readonly snapshot: unknown };
// src/sim/run.ts (exported from src/sim/index.ts)
export type SaveRefusal = { readonly ok: false; readonly code: "saveEngineMismatch" | "saveProjectMismatch" | "saveFormatNewer" | "saveFormatOlder" | "saveMigrationFailed"; readonly needsMigration: boolean };
export type SaveLoad = { readonly ok: true; readonly world: SimWorld; readonly notices: readonly Notice[] } | SaveRefusal;
export type LoadOptions = { readonly allowProjectMismatch?: boolean; readonly allowEngineMismatch?: boolean };
export function saveMatch(world: SimWorld, meta: { readonly projectId: string; readonly savedAt: string }): string;
export function loadSave(input: SimInput, text: unknown, opts?: LoadOptions, chains?: SaveChains): SaveLoad;
// src/sim/migrations/save/index.ts (exported from src/sim/index.ts)
export type SaveStep = (doc: Readonly<Record<string, unknown>>) => Readonly<Record<string, unknown>>;
export type SaveChains = Readonly<Record<"save" | "match-save", Readonly<Record<number, SaveStep>>>>;
export const SAVE_FORMAT = 1;
export const SAVE_MIGRATIONS: SaveChains;   // both empty at v1
export function migrateSave(kind: "save" | "match-save", doc: Readonly<Record<string, unknown>>, from: number, to?: number, chains?: SaveChains): Readonly<Record<string, unknown>> | null;   // a step returning a non-object throws
// src/project/read/guard.ts
export function guarded<T>(read: () => ReadResult<T>): ReadResult<T>;   // a throw → { ok: false, needsMigration: false, error: "unreadable document" }
// src/paint/recipe/limits.ts: RECIPE_CAPS.historyBytes = [null, 1048576]
```

## Smoke lines
None move. `npm run sim` and all 20 smoke lines are byte-identical to the base. The readers' guard never fires on the hunters' JSON documents, the log freeze changes no value, and no smoke reads a save.

## Existing tests changed by ruling (and only these)
- `tests/sim/recipe-caps.test.ts` "recipe caps (step 23)": the ceiling row for `historyBytes` is 1,048,576 (was 16,777,216).
- `tests/smoke.test.ts`: the core-types sha is CN-009's.

## Tests that prove it is done
New `tests/sim/trusted-saves.test.ts`, nine tests whose titles start exactly so:
- **"trusted saves (step 24)":**
  - the save's keys are, in order, `kind`, `formatVersion`, `header`, `log`, `snapshot`, and `header` is `{ projectHash, engineVersion, projectId, savedAt }`;
  - a save of a played match loads to the same snapshot; a non-string `projectId` is a `RangeError`;
  - another `projectHash` is `{ ok: false, code: "saveProjectMismatch", needsMigration: false }`, and another `engineVersion` is `saveEngineMismatch`, both returned rather than thrown;
  - `formatVersion: 2` is `saveFormatNewer`, with `needsMigration: false`;
  - `5`, `"{"`, `"[]"`, a wrong `kind`, a non-string `log`, a `formatVersion` of 1.5 and a header missing its two hashes are each "not a match save";
  - `replay` of another project's log does not throw.
- **"save opt-ins (step 24)":**
  - `allowProjectMismatch` resumes another project's save, and `allowEngineMismatch` another engine's. Each is `ok` with the one notice it crossed;
  - the off-board move in the log is refused by the normal doors, and the resumed world equals the live one;
  - the project opt-in does not resume an engine mismatch, and the engine opt-in does not resume a project mismatch.
- **"save migrations path (step 24)":**
  - `SAVE_MIGRATIONS` has the two chains `save` and `match-save`, both empty;
  - `formatVersion` 0 and -3 are `{ ok: false, code: "saveFormatOlder", needsMigration: true }` through the hook;
  - `migrateSave("match-save", s, 0)` is `null`, from 1 it is `s` unchanged, and save's chain is not match-save's;
  - `needsMigration` is false for a current save, a newer one and a mismatch.
- **"the migrations hook is contained (step 24)":** `loadSave` of a `formatVersion: 0` save with a test registry is `{ ok: false, code: "saveMigrationFailed", needsMigration: true }` for each of these hooks:
  - a throwing hook;
  - a hostile result: a proxy that throws on every read, or an enumerable getter that throws;
  - a still-old result (`formatVersion: 0`), or another kind at format 1;
  - a non-plain result: `5`, `null`, a string, an array, a function, or a `Map` inside;
  - an honest upgrade (`formatVersion: 1`) loads to the saved world;
  - a step registered only in save's chain is not used (`saveFormatOlder`).
- **"tamper reach (step 24)":**
  - a unit's cell moved in the snapshot is refused;
  - an rng state edited in the snapshot is refused;
  - the log's `projectHash` edited is "the log header is not the save header";
  - the save header relabelled to engine `"9.9.9"` is refused the same way, both without and with `allowEngineMismatch`;
  - an entry's `seq` edited is `load: bad entry`;
  - the log seed edited is refused (`replay: world seed …`);
  - a whole other game (the log and snapshot of a match whose move is off the board) loads and equals that game.
- **"the log is read-only through an entry (step 24)":**
  - writing an entry's `action.kind` or `tick`, the header's `seed`, or pushing to `effects` throws a `TypeError`;
  - the log text is unchanged;
  - the entry and its action are frozen.
- **"a direct reader refuses a live hostile document (step 24)":**
  - a throwing proxy and a revoked proxy are "unreadable document" from all three readers;
  - a stage with a throwing `id` getter is too;
  - a cyclic map does not throw;
  - bad limits still throw a `RangeError`.
- **"restore checks before any work (step 24)":**
  - `replay` with a broken stage and `untilTick` 1e9 is "tick or log over the limits", not the stage error;
  - `loadSave` with a broken stage is `saveProjectMismatch` for another project and `saveFormatNewer` for `formatVersion: 7`, so no document is read.
- **"one source for the BTF defaults (step 24)":**
  - the five BTF recipe totals equal `RECIPE_CAPS[k][0]`;
  - `BTF_STAGE_LIMITS.stages` equals `DEFAULT_DOC_LIMITS.stages`;
  - the `historyBytes` ceiling is under the `bytes` default;
  - the sample reads at `historyBytes` 1,048,576 and throws at 1,048,577.

## How a planted bug is caught (for QA; prototype `7aa021d` on `219959a`; reverted after each; `/tmp/h3-plants.sh` on the Architect's box)
| Plant (intent) | Named test |
|---|---|
| SV1 a save for another engine loads; SV1b a save for another project loads | trusted saves + save opt-ins |
| SV2 a newer save loads; SV3 a non-save is read as one; SV4 a mismatch throws instead of a typed refusal | trusted saves |
| OP1 the project opt-in is ignored; OP2 the engine opt-in is ignored; OP3 one opt-in resumes both mismatches; OP4 a resumed mismatch carries no notice | save opt-ins |
| HE1 a save header that disagrees with the log header is not refused | tamper reach |
| MG1 an older save skips the hook; MG2 an older save the hook can't bring up is not `needsMigration`; MG3 match-save steps share save's chain | save migrations path |
| HK1 a throwing hook escapes `loadSave`; HK2 the hook result is not plain-copied; HK3 a still-old result loads; HK4 a result of another kind loads; HK5 a step that returns nothing reads as a missing step; HK6 a failed hook is not `needsMigration`; HK7 `loadSave` ignores the registry it is given | the migrations hook is contained |
| RP1 `replay` throws on another project's log | trusted saves + save opt-ins |
| RP2 `replay` checks its limits only after building the world | restore checks before any work |
| TR1 `restore` keeps a snapshot the log does not reproduce | tamper reach |
| LG1 an entry can be edited; LG2 the header can be edited | the log is read-only through an entry |
| HD1 `readMap` / HD2 `readManifest` / HD3 `readStage` not guarded; HD4 the guard passes the throw on | a direct reader refuses a live hostile document |
| BT1 BTF's recipe totals hand-copied and drifted; BT2 BTF's `stages` hand-copied and drifted; HB1 `historyBytes` back on the 16 MiB ceiling | one source for the BTF defaults |

All 32 test plants fail their named tests (32/32). **Grep plants** (`/tmp/h3-grep-plants.sh` on a throwaway clone): 26 plants, one per grep family plus the typed refusal, the opt-ins, the hook, the header check, an uncontained hook and an unchecked hook result. Each turns its grep in `/tmp/h3-greps.sh` to FAIL: 26/26. The 32 greps cover: files, size and caps, pins, CN-009 add-only, the smoke pin, untouched paths, no `core/limits` / `core/plain` in project, project's only core import, values, the nine test titles, nine behaviour probes (saves, tamper with the header disagreement, opt-ins, migrations, the contained hook, log, hostile readers, before-any-work, history ceiling), the stage comment, laws, the one new source file, sim, and the two smoke pins. **Earlier plants that touch a file this step changes** (on `7aa021d`, build-A forms; the same counts as r1 and r2):
- step 23 (`/tmp/h3-s23plants.sh`): 29/30.
  - RC10 follows the derived BTF totals.
  - SM6 names only the step-23 test, since BTF `stages` now follow the default by this ruling.
  - SE2 is PARTIAL as on the merged build: it fails 10 SE-01 tests but not build A's "SE-01 carries" test. That is a test gap, not a hole; carried to step 25.
- step 22 (`/tmp/s23-s22plants-A.sh`): 28/29. R4 now fails "the door copy (step 23)", its step-23 home (the step-22 verify carry C1, closed), not its step-22 test.

## Example
```ts
const text = saveMatch(world, { projectId: "p1", savedAt: "2026-11-12T21:00:00Z" }); // '{"kind":"match-save","formatVersion":1,"header":{"projectHash":…,"engineVersion":…,"projectId":"p1","savedAt":…},"log":"…","snapshot":{…}}'
loadSave(input, text);                                       // { ok: true, world, notices: [] }: snapshot(world) equals the saved one
loadSave({ ...input, projectHash: "other" }, text);          // { ok: false, code: "saveProjectMismatch", needsMigration: false }, no document read
loadSave({ ...input, projectHash: "other" }, text, { allowProjectMismatch: true }); // { ok: true, world, notices: [saveProjectMismatch] }: the log replayed through the doors
world.log.entries()[0].action.kind = "x";                    // TypeError: the entry is frozen
readMap(new Proxy({}, { get() { throw new Error("boom"); } })); // { ok: false, needsMigration: false, error: "unreadable document" }
```

## Decisions note: what to name
- The one new number, the `historyBytes` ceiling 1,048,576 (proposed), and that you added no other.
- The order of `loadSave`'s checks, and that none of them reads a document before the log is parsed.
- That `saveFormatOlder` is a fourth code beside DSK's three (`saveEngineMismatch`, `saveProjectMismatch`, `saveFormatNewer`). It is how an older file reports `needsMigration: true`. If DSK names it otherwise, use DSK's name.
- That `saveMigrationFailed` is a fifth code (QA r2 must-fix, ruled 2026-11-12), with `needsMigration: true`, and that `loadSave` takes the registry as a fourth argument only so tests can pass a hostile one.
- That an opt-in resume replays the log and does not compare the snapshot, and why (the snapshot is not trusted across a mismatch).
- How the entry freeze reaches the target, `effects` and `via`.
- Why the readers are guarded and not copied (the step-22 named refusals and the smoke).
- Anything you chose that the file doesn't state (law 12).

## Do not touch
- `BUILD_GUIDE.md`, `docs/**`, `scripts/**`, `eslint.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.dependency-cruiser.cjs`; in `src/types/core-types.ts` everything but CN-009 r2's five lines.
- `src/state/**`, `src/fx/**`, `src/runtime/**`, `src/rules/**`, `src/index.ts`; in `src/core` everything but `log/log.ts` (`plain.ts`, `limits.ts` and `log/types.ts` stay as they are); `src/paint/recipe/{read,types,fields}.ts`; `src/project/read/{limits,placements,index}.ts`; in `src/sim` everything but `run.ts`, `index.ts` and the new `migrations/save/index.ts`.
- `tests/**` except the new `tests/sim/trusted-saves.test.ts` and the two named edits above.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit. `npm test`: fail 0, skipped 0, todo 0; pass ≥ 513; `rg -n '\.(only|skip|todo)\(' tests` prints nothing.
- [ ] `npm run sim` prints exactly the base's two lines (`… win 48 lose 2 … afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, `… win 22 lose 28 … b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`). All 20 smoke lines are byte-identical to the base (the exploit-docs pins stay 516 / 1,484 and 547 / 1,453).
- [ ] Pins: `core-types.ts` `61fad786…` (CN-009 r2; `git diff <base>..<head> -- src/types/core-types.ts` removes no line), `package.json` `1e5dd82c…`, `.dependency-cruiser.cjs` `45a3dbaa…`, `scripts/check-law.sh` `4d7bbf48…`, lock `d7f64a09…`. `npm run deps` reports no violations.
- [ ] Behaviour probes (QA runs them on the working tree):
  - every thrown refusal above, by its exact text, and every typed result (`saveEngineMismatch`, `saveProjectMismatch`, `saveFormatNewer`, `saveFormatOlder`, `saveMigrationFailed`) by its `code` and `needsMigration`;
  - each opt-in resumes only its own mismatch, and a header disagreement is refused with or without one;
  - `SAVE_MIGRATIONS` has two empty chains, and an older save goes through the hook;
  - a throwing, hostile, still-old, other-kind or non-plain hook result is `saveMigrationFailed`, never a throw; an honest upgrade loads;
  - the frozen entry, action and header;
  - the three readers on a throwing proxy and a revoked proxy;
  - `RECIPE_CAPS.historyBytes` and the BTF values equal their single source.
- [ ] Boundaries: `rg -n 'core/(limits|plain)\.ts' src/project src/paint` prints nothing, and the only core file `src/project` and `src/paint` import is `core/notice.ts`. `src/btf-adapters/src/stage-limits.ts` has no "PROPOSED". The only new file under `src` is `src/sim/migrations/save/index.ts`.
- [ ] Laws hold: no wall time, timers, `crypto`, `process.` or `node:` imports in `src`; no rules words in `src/core`; no `Math.random` in `src`.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the 16 files of the file list (`A` for the two files created, `M` for the rest). `git diff --stat` is ≤ 400 changed lines, with each file within its cap.
- [ ] Hand-back `handback/step-24-trusted-saves/r<N>/` is complete per HAND-BACK.md, with the PR line as in Delivery. The bundle verifies and its branch tip is the hand-back commit. Nothing is committed to `main`.

## Not in this step (deferred; flagged, do not invent). Carries, with their target steps
- **H4 (step 25, speed and memory):**
  - `restore` checks the snapshot clock with the default `stepMs`, not the world's, and the clock pile-up row;
  - `loadSave` parses save text of any length (a text cap is a memory cap). An entry's `effects` count is bounded only by the door budget, so a 2,048-entry log with capped text is about 2x the 1 MiB sync envelope (F4). A save-text cap belongs here;
  - **live intent (carried from the step-23 verify):** `setOffset`, `feedIntent` and `units.get` return the live record, not a copy, so a caller that holds it can change state outside the doors. H4 decides between a frozen view and a copy;
  - the 2 MiB recipe size count lets many short keys reach about 17x that in heap (QA step-23 carry 3);
  - a direct reader on a *consistent* live document can return values that a second read would change. `createWorld` copies first; direct callers own their documents.
- **Host, not engine:** signing or encrypting a save, so a rewritten whole game is detected (the engine only proves a save is a legal game).
- **The online step (QA r2 carry):** a save with `header.projectId` or `header.savedAt` flipped still loads. `loadSave` checks only `engineVersion` and `projectHash` (against the input and against the log header). `projectId` and `savedAt` are host metadata, and signing belongs to the host. This goes to the online step.
- **Step 25 (QA r2 carry):** a direct reader on a cyclic document gives a generic reason (`bad field`, `wrong kind` or `unreadable document`), not one naming the cycle. It never throws. A cycle-specific reason goes to step 25.
- **Residual, by design:** `bytes` measures values, keys and string lengths, not exact UTF-8 bytes.
- Editing `docs/qa/**` (QA), `data/core-types.ts` (DSK, at CN-009 sign-off) or `docs/chaos-player-outline.md` (Architect).

## Out of scope
- Any HP, attack, damage or stat rule; networking, lobbies, cloud saves, save slots or UI; any change to the command log format, the snapshot shape, the state tables or the gesture intents; any cap number other than the one proposed here.
