# Hand-back step-24-trusted-saves r1
Step file: handoff/steps/step-24-trusted-saves.md
Base commit: 219959a1e3d041dfd59586c93a5b6993ad3545c6     Head commit: 8827da0916b1f75c9716d023ced8ca4dbbb164dd     Branch: step/step-24-trusted-saves-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/btf-adapters/src/sprite-recipe-limits.ts
M	src/btf-adapters/src/stage-limits.ts
M	src/core/log/log.ts
M	src/paint/recipe/index.ts
M	src/paint/recipe/limits.ts
M	src/project/read/guard.ts
M	src/project/read/manifest.ts
M	src/project/read/map.ts
M	src/project/read/stage.ts
M	src/sim/index.ts
A	src/sim/migrations/save/index.ts
M	src/sim/run.ts
M	src/types/core-types.ts
M	tests/sim/recipe-caps.test.ts
A	tests/sim/trusted-saves.test.ts
M	tests/smoke.test.ts

## Green
npm test: 513/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- CN-009 r2 is five added lines in `src/types/core-types.ts` and nothing removed, after the command-log header comment. The file hashes to `61fad786bfb838e37d2d37768fb3b62be24eaf392f2038eb4bcd4de5b9b5fe43`. The smoke pin is that sha. No other pin moved.
- `loadSave` copies `{ input, opts: opts ?? {} }` once with `plainCopy` at `PLAIN_DEPTH`, then requires `kind: "match-save"` and an integer `formatVersion`. `formatVersion > 1` is `saveFormatNewer` (`needsMigration: false`) before the header or the log is read. `formatVersion < 1` calls `migrateSave("match-save", …)` inside try/catch. A missing step returns `null` (`saveFormatOlder`, `needsMigration: true`). A step that returns a non-object throws `TypeError` `migrateSave: a step must return an object`; that throw, or a result that is not a plain `match-save` at `SAVE_FORMAT` after `plainCopy(result, PLAIN_DEPTH)`, is `saveMigrationFailed` with `needsMigration: true`. The fourth argument defaults to `SAVE_MIGRATIONS`.
- After a current document: the four header strings and a string log, then `parseLog` (`load: ${error}`), then the save header must equal the log header on `engineVersion` and `projectHash` (`load: the log header is not the save header`). No opt-in passes that. Engine mismatch is checked before project mismatch. Both are typed and `needsMigration: false`. A match restores and `notices` is empty. An opted-in mismatch replays to the snapshot tick when that tick is an integer ≥ 0, otherwise to tick 0, and the snapshot is not compared. Each notice's `code` and `message` are the code string, engine then project. A non-string `projectId` or `savedAt` throws `RangeError` `saveMatch: projectId and savedAt must be strings`.
- `replay` checks `untilTick` and `log.lastSeq()` against the copied input's limits (`limits === undefined` uses `DEFAULT_MATCH_LIMITS`) before `createWorld`. The check runs only when `withinCeilings` is true, so a bad limit such as `entries: 0` still throws `createWorld`'s RangeError.
- `guarded` wraps only the document read. Limits are checked first, so a bad limits argument is still that reader's RangeError. No copy is made: `src/project` and `src/paint` still import no `core/limits.ts` or `core/plain.ts`, and the only core import is `core/notice.ts`. The step-22 cap refusals and the `__proto__` palette notice stay.
- The one new number is the `historyBytes` ceiling 1,048,576. `BTF_SPRITE_RECIPE_LIMITS` reads `totalRuns`, `totalPoints`, `totalTweaks`, `bytes` and `notices` from `RECIPE_CAPS[k][0]`. `BTF_STAGE_LIMITS.stages` is `DEFAULT_DOC_LIMITS.stages`. The stage comment is `CEO-approved 2026-11-12: 144 entries per pool or wave, 1,024 stages`.
- Each appended entry is `plainCopy(…, 4)`, so the entry, its action, the target, `effects` and `via` are frozen. `log.header` is `Object.freeze`d. `entries()` still returns a new array. `plain.ts` was not edited.
- 16 files, 194 insertions and 18 deletions (212 changed lines), each file within its cap. No Change Notice beyond CN-009's five lines. `npm run sim` is unchanged: stage-fixed 48/2 `afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, stage-weighted 22/28 `b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`. `main` was not committed to. This chat uploads `step-24-trusted-saves-r1-chatB.bundle` and `HAND-BACK-step-24-trusted-saves-r1-chatB.md`. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- H4: the snapshot clock check uses the default `stepMs`, a save-text cap, and a frozen or copied view from `setOffset`, `feedIntent` and `units.get`. A direct reader still gives a generic reason on a cycle.

## Kit files used
- The step paste was supplied as an attachment. `handoff/steps/step-24-trusted-saves.md` is not in the base tree, so it was not copied onto this branch.
