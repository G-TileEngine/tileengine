# Step 25 review (r1) — H4, speed and memory

**Date:** 2026-11-12 23:08 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** `handoff/steps/step-25-speed-memory.md` `696dbc11` (177 lines, new).
**Step 24 / README / spine:** `4d1aea2e` / `16aacd87` / `eaa5b2f4`.
**Prototype:** one code commit `78de054` on `18f7899` (branch `h4`). Copied first to `/workspace/tileengine/qa-runs/s25-review/r1/` (proto, fresh, kit, scripts, EA logs). Imported as `refs/cmp/s25-proto-r1`. `/tmp` was not edited (mtimes unchanged). Existing `refs/cmp/*` and earlier qa-runs trees were not overwritten. No GitHub actions. No code changes.
**Pins** identical to `18f7899` (no CN): core-types `61fad786`, package.json `1e5dd82c`, depcruise `45a3dbaa`, check-law `4d7bbf48`, lock `d7f64a09`. Node 24.22.1 / npm 11.21.1.
**Probes:** `qa-runs/s25-review/r1/probes/` (reused patterns from `qa-runs/security-2026-11-12/` and `h3-delta/`). Replay spies ran on a throwaway instrumented clone; the proto tree was not patched.

## Result

**OK TO SEND** on proto `78de054` / kit `696dbc11`. No must-fix. The deferred list in the step file is named and matches the spine row. Security finding 1 and the H3-delta `loadSave` pre-parse gap are closed in this proto.

## Numbers

Independent `npm run green` **521/0** (base `18f7899` is 513/0; the eight new tests in `tests/sim/speed-memory.test.ts` account for the +8). typecheck / lint / depcruise / check:state / check:law clean. G7 **189** (165 insertions + 24 deletions) in **14** files, cap sum **245**, each file exactly 4 under. Greps **30/30**, plants **26/26**, grep-plants **26/26**. Earlier plants on this tree: s24 **32/32**, s23 **30/30**. SE2 (`a part field is not read`) is now caught — 11 failing, all 1 named, against `every part field is read (step 25)`. It was a test gap, not a typography miss.

`npm run sim` is byte-identical to an independent `18f7899` run: `48/2` `afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, `22/28` `b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`. All **20** pinned smoke ℹ lines (chaos gen, chaos, exploit-docs 516 / 1,484 and 547 / 1,453, exploit-levels hashes, exploit, levels histories) are byte-identical to that baseline.

## Probes

**1. Pre-parse caps** (`src/core/limits.ts:7-20`, `src/core/log/log.ts:76-82`, `src/sim/run.ts:82-83`, `src/fx/order/read.ts`). Just over 2 MiB (`TEXT_BYTES + 1` spaces) is `over cap bytes` / `saveTooLarge` / `fxTooLarge`. A string at the 16 MiB ceiling with `bytes: TEXT_BYTES_MAX` reaches `JSON.parse` (spaces → `not JSON`); one character over the ceiling is a size refusal. A `JSON.parse` spy shows **0** calls on every refused text (size or depth). Depth 33 is `over cap depth` / `saveTooDeep` / `fxTooDeep` with 0 parses; depth 32 reaches parse.

A `bytes` limit above the ceiling is **rejected, not clamped**: `parseLog` → `bad limits`; `readFxOrder` → `RangeError: readFxOrder: limits out of range`; `withinCeilings` is false. `loadSave` with a bad limit falls back to `TEXT_BYTES` for the pre-parse check (`src/sim/run.ts:82`), so a mid-size text (just over 2 MiB) is `saveTooLarge` rather than accepted up to 16 MiB. This matches the kit (`step-25-speed-memory.md:32, 94`); it does not match a “clamped to the ceiling” reading.

`textOver` is one `charCodeAt` pass, no regex. Brackets inside a string, an escaped quote, and a 50k-element flat array do not count as depth. 200k vs 2e6 flat-array items: 0.8 ms vs 6.6 ms (ratio 8.1). 2e6 backslashes: 6.0 ms, no blowup.

**Length unit is UTF-16, and the step file matches the code.** `TEXT_BYTES` is named “bytes” but counted as `text.length` (UTF-16 units), as commented at `src/core/limits.ts:7` and in the kit (`step-25-speed-memory.md:31`). A string of 2,097,152 `é` (or 1,048,576 `😀`) is allowed; each is ~4 MiB of UTF-8 and would fail a real byte budget. A multibyte string therefore can slip past a *bytes* claim. The recipe measure is already the same unit. Not a proto defect.

**2. `readFxOrder` frames and `raw`.** 64 frames are kept (6 play, 58 inactive, `fxOverCap` for the extra steps). 65 frames are refused as `fxTooManyFrames` with `order === null` (not cut). 5,000 frames is the same named refusal (text still under the size cap). `raw` is absent unless `opts.raw === true`; `false`, `1`, and `"true"` do not attach it (`src/fx/order/read.ts:114`).

**3. Snapshot tick on the opted-in mismatch path.** `null`, `-1`, `1.5`, a string, missing, and `NaN` (which JSON materialises as `null`) are `saveSnapshotTickInvalid` with **zero** `replay` entries and **zero** `replayTicks` (instrumented clone). A live getter cannot appear on the text door (`loadSave` only parses a string; `JSON.stringify` materialises the value). A huge whole tick `1e9` is **not** that typed refusal: it reaches `replay` and throws `replay: tick or log over the limits`, with one `replay` entry and still zero ticks (the limits check is before `createWorld`). That is exactly what the kit says (`step-25-speed-memory.md:40`). An honest tick-40 save loads on the mismatch path (40 replay ticks).

**4. `restore` and the recipe measure.** `restore` no longer builds a default clock (`src/sim/run.ts:57-67`). The pre-check is step-free (`clockMs` is 0 at tick 0, else a whole multiple of the tick and at least the tick); the full compare uses `snapshot(world)` and therefore the world’s own `stepMs` (default 10 here; `createWorld` always calls `createClock()`). An edited `clockMs` is `restore: snapshot does not match the log`. A forged restore tick of `1e9` with the honest `clockMs` is refused at the pre-check (0 replay, 0 ticks). If `clockMs` is also set to `1e9`, it reaches `replay` and throws the limits error, still with zero ticks.

`readSpriteRecipe` runs `measure` before `copy` (`src/paint/recipe/read.ts:28-35, 57-59`). The same 300,000 short-key over-cap document (`bytes: 1,000,000`) was refused as `over cap bytes` on both trees. Heap delta with `--expose-gc`: **8.73 MiB** on this proto vs **29.14 MiB** on `18f7899`. The official test bound is 12 MiB; EA’s “about 4 vs 19–28” is the same class of improvement. The in-cap 17× short-key case is still deferred (see Carries).

**5. Frozen copies / `setOffset` / `feedIntent`.** `units.get` / `all` return frozen copies (record and cell); a write to the copy throws and does not reach state. `setOffset` stores a frozen copy of the caller’s object. `feedIntent` reads the intent once through `plainCopy` (getter spy count = 1) (`src/core/unit/units.ts:79-85`, `src/sim/intents.ts:31-38`).

**6. Cyclic document; s22 M5.** A document whose `kind` is itself is `cyclic document` from `readMap` / `readManifest` / `readStage`. A shared (not cyclic) object is still `wrong kind object`. A throwing proxy stays `unreadable document`. The walk runs only after a generic failure (`src/project/read/guard.ts`). The old s22 M5 (“the map ignores the maker’s limits”) was typography on the earlier-plant script (`docLimits(limits ?? {})` already gone); it is not re-opened by this step and is not a proto defect. SE2, the actual prior test gap, is closed (see Numbers).

**7. Build law and deferred list.** One clock / rAF: `createWorld` still uses the single `createClock()`; no new `requestAnimationFrame`, timer, `Math.random`, `process.` or `node:` import in `src`. `src/fx/order/read.ts` imports only `core/limits.ts` and `core/notice.ts` from core; project/paint stay off `core/limits` and `core/plain`. No new file under `src`. check:law clean. No scope creep: 14 files, the one new number is `FX_FORMAT.maxFrames` 64.

The kit’s deferred list is named in `step-25-speed-memory.md:167-174` and in the spine step-25 row (`docs/core-spine-slices.md:114-115, 117, 119`): gh-pages cleanup becomes step 26 (`new Function`, unescaped session unit ids); the clock pile-up goes with the renderer; the in-cap 17× recipe heap needs a measure-rule change (DSK/CEO); a consistent-but-live direct reader stays with the host; save signing / unchecked `projectId`+`savedAt` stay on the online step; step-21 residuals are carried on.

## Must-fixes

None.

## Carries (deferred, already named — not holds)

1. **Step 26, gh-pages cleanup** — `ConvertEngine.init` / `new Function` (`js/convert-engine.js:49`) and unescaped session unit ids in `app.js` `innerHTML`. Not engine code. (`step-25-speed-memory.md:168`; spine `:115`.)
2. **Renderer** — clock pile-up on a long `durationMs` (today bounded by the 16,384 ms cap). (`step-25-speed-memory.md:169`.)
3. **In-cap 17× recipe heap** — many short keys still cost about 17× the measure (~34 MiB at the 2 MiB default). Tightening the measure is a rule change, not an engineering fix in this step. (`step-25-speed-memory.md:170`.)
4. **Consistent-but-live direct reader** — a direct `readMap` / `readManifest` / `readStage` on a *consistent* live document can return values a second read would change. `createWorld` copies first. (`step-25-speed-memory.md:171`.)
5. **Host, not engine** — signing a save; `header.projectId` / `savedAt` unchecked. (`step-25-speed-memory.md:172`.)
6. **QA step-21 residuals** — honest 2^20 copy cost; `withinCeilings` on a throwing proxy throws; `createLog` reads its header three times; seed `-0` stored as `-0`; explicit `nodes = Infinity` walks a finite liar. (`step-25-speed-memory.md:173`.)
7. **Huge whole snapshot tick on the opted-in mismatch path** — `1e9` still reaches `replay` and throws its limits error rather than returning `saveSnapshotTickInvalid`. Kit-documented residual (`step-25-speed-memory.md:40`). Zero ticks anyway.

## Nits (kit typography / wording; not proto rejects)

1. `handoff/README.md:3` — the opening Status paragraph still says “H3 … and H4 … follow”. The step table later in the same file already has the step-25 row (Base `18f7899`, no CN). Stale intro only.
2. `docs/core-spine-slices.md:9` — the intro still says “Step 24 is written … Next: H4”, while the table (`:113-115`) and “Next” (`:119`) already record step 24 merged at `18f7899` and step 25 written.
3. README and spine never mention that `TEXT_BYTES` is UTF-16 units. The step file (`:31`) and `src/core/limits.ts:7` do. No contradiction, just a missing unit note in the short rows.
4. `step-25-speed-memory.md:41` — “a forged tick of 1e9 is still refused by name before any replay” is true for the official test (tick only). If `clockMs` is also set to `1e9`, `restore` enters `replay` and throws the limits error (still zero ticks). Same shape as the mismatch-path residual above.

## Verdict

**OK TO SEND.**
