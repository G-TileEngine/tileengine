# Hand-back step-25-speed-memory r1
Step file: handoff/steps/step-25-speed-memory.md
Base commit: 18f7899211c4d9cd4bbff05976f9934081988e0a     Head commit: 3c925b87a36978fcbe0941e5ea7452b50ae882f4     Branch: step/step-25-speed-memory-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/core/limits.ts
M	src/core/log/log.ts
M	src/core/unit/units.ts
M	src/fx/order/read.ts
M	src/fx/order/types.ts
M	src/paint/recipe/read.ts
M	src/project/read/guard.ts
M	src/project/read/manifest.ts
M	src/project/read/map.ts
M	src/project/read/stage.ts
M	src/sim/intents.ts
M	src/sim/run.ts
M	tests/fx/read.test.ts
A	tests/sim/speed-memory.test.ts

## Green
npm test: 521/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- The one new number is `FX_FORMAT.maxFrames` 64: six frames play, up to 58 stay inactive, and 65 or more is `fxTooManyFrames` before any frame is read. No other number was added.
- Text size reuses the H2 pair `TEXT_BYTES` 2,097,152 and `TEXT_BYTES_MAX` 16,777,216, the same as `RECIPE_CAPS.bytes`. Depth reuses `PLAIN_DEPTH` (32). The count is `text.length`. `bytes` is optional on `MatchLimits` and `FxReadLimits`, so every existing limits object stays valid and `DEFAULT_MATCH_LIMITS` is unchanged. `loadSave` uses `TEXT_BYTES` when the input's limits are absent or fail `withinCeilings`; `createWorld` still refuses bad limits later.
- At the default, a save over 2 MiB is `saveTooLarge` until the host passes a larger `limits.bytes` (up to 16 MiB). The engine never deletes or rewrites it. A whole tick that is merely huge still reaches `replay` and throws the limits error.
- The new save codes are `saveTooLarge`, `saveTooDeep` and `saveSnapshotTickInvalid`, each with `needsMigration: false`. The new fx codes are `fxTooLarge`, `fxTooDeep` and `fxTooManyFrames`. Each fx notice's message is the same string as its code, because the step names the code and not a sentence.
- `textOver` counts nesting, not every opener: `[` and `{` outside strings increase, `]` and `}` decrease, and a `\` inside a string skips the next character. A flat count of openers would refuse an ordinary log. A played save nests about 5.
- The recipe `measure` walks with `copy`'s count and builds nothing. Over the cap is `over cap bytes` before the copy; a `bigint` is `not plain JSON`. `copy` then runs with its own count, so a value that changes between the two reads is still capped. The measure rule is unchanged.
- The cycle look runs only after a generic failure (`unreadable document`, `bad field …`, or `wrong kind object`). Each object is walked once, a shared object is not a cycle, and a throw while looking keeps the original reason. A success, an `over cap` and a `needsMigration` never walk. `units.all()` is copied as well as `get`. `setOffset` stores a frozen `{ dx, dy }`. `feedIntent` copies the intent once at depth 3 and the aim through `cellOf`; a non-plain intent returns `null`.
- `restore` builds no clock. Tick 0 requires `clockMs` 0; any later tick requires `clockMs` to be a whole number, at least the tick, and a multiple of the tick, which holds for any whole `stepMs`. The compare after replay still checks `clockMs` on the world's own step. A bad resumed snapshot tick is `saveSnapshotTickInvalid` before any replay. This branch is cut from `18f7899`, not `origin/main` `9bda8ca` (kit and docs only), so the diff is these 14 files: 160 insertions and 26 deletions.

## Next step (optional proposal)
- Step 26 is the gh-pages cleanup (no `new Function`, escape unit ids in `innerHTML`). The two step-25 nits (one named refusal for an over-ceiling limits object, and a named pre-replay refusal for a tick and `clockMs` forged together at 1e9) stay for a later hardening pass.

## Kit files used
- `handoff/steps/step-25-speed-memory.md` on `origin/main` (`9bda8ca`, blob `3fc1f43cd9e7c4011fbfdb7019475f364126d1bb`). It is not in this diff because the branch starts at the kit Base.
