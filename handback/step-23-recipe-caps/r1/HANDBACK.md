# Hand-back step-23-recipe-caps r1
Step file: handoff/steps/step-23-recipe-caps.md
Base commit: 5d3af1b6bba67d8f5b4d3cd40aced7ab506276eb     Head commit: 59d053d6b357a237f0b1c8571ea1126a544cabd3     Branch: step/step-23-recipe-caps-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/btf-adapters/src/sprite-recipe-limits.ts
M	src/btf-adapters/src/stage-limits.ts
M	src/core/log/log.ts
M	src/paint/recipe/fields.ts
M	src/paint/recipe/limits.ts
M	src/paint/recipe/read.ts
M	src/project/read/limits.ts
M	src/project/read/manifest.ts
M	src/project/read/map.ts
M	src/project/read/stage.ts
M	src/sim/driver-phase.ts
M	src/sim/driver-tick.ts
M	src/sim/world.ts
M	tests/paint/recipe-read.test.ts
M	tests/project/door-guard.test.ts
M	tests/sim/doc-limits.test.ts
A	tests/sim/recipe-caps.test.ts

## Green
npm test: 504/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Totals are counted on the copy after each list is cut by its own cap (`min(length, cap)` on parts, anims and frames, then runs, `promotedFrom.runs`, frame run lists and `geom.pts`) and before `readDoc`. Runs are part runs plus promoted-from runs plus frame run lists (the sample is 7). Points are part `geom.pts` only (9; frame geom is not counted). Tweaks are pose, part and run keys over frames (3). Over a total returns `over cap totalRuns`, then `totalPoints`, then `totalTweaks`, and no part is read.
- `bytes` is one per value plus the length of every key and every string, not UTF-8. The sample measures 1,593. Past the cap the copy stops and the read is `over cap bytes`. A cycle keeps being copied until that cap, so it fails `over cap bytes` before the depth-10000 guard. The copy does not call `toJSON`; a function value is dropped like any other function.
- `stored` is cut after `readDoc`, on the same lists the doc caps, so the first read still reports `overCap` and a second read of the cut stored does not. Unknown keys stay inside the size cap. Notices keep at most `notices`, then one `{ code: "noticesCapped", message: "and N more" }`.
- Ceilings, the numbers proposed in the step and no other number added: `side` 4,096; `parts`, `points`, `runs`, `joints`, `anims`, `frames`, `variants`, `historyBatches` and the three totals 1,048,576; `historyBytes` and `bytes` 16,777,216; `notices` 2,147,483,647. The original ten keys stay required. An absent optional key takes its default; a present `null` does not. `checkLimits` reads each of the 15 keys once and returns a frozen copy. `BTF_SPRITE_RECIPE_LIMITS` writes the five defaults (32,768 / 32,768 / 32,768 / 2,097,152 / 256).
- Manifest `stages` is 1,024 by default and 65,536 at the ceiling, refused on raw `length` before any name is read. Weighted-pool `entries` and one wave's `entries` use `spots` (144). A wave list over `waves` is refused first, so the per-wave check never walks it. A live stage seed of `-0` is stored as `0` (`-0 === 0`). `BTF_STAGE_LIMITS` is `Object.freeze`d and carries `stages: 1024`. A counted stage limits object is read 12 times.
- A bare `null` limits argument is refused, not defaulted: `readMap`, `readManifest` and `createWorld` use `limits === undefined ? default : limits`. A `null` field was already a bad limit in `docLimits`, `readStage` and `createLevels`. `runTicks` and `runMatch` also stop when `clock.tick()` reaches `world.limits.ticks`. `runTicks` advances at most the remaining multiple of `stepMs`. A move replays at most the ticks still left. The result is `"timeout"`. No smoke line moved: stage-fixed 48/2 `afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, stage-weighted 22/28 `b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`.
- `plain.ts` was not edited. Its node clamp is already `const` from step 22 (eslint `prefer-const`). `createLog` refuses a non-string `engineVersion` or `projectHash` with the existing header `RangeError`. The wide-object and lying-array proofs are tests only.
- The diff base is `5d3af1b` (this branch's step-22 tip). The step paste started at "## Goal", so the header's base SHA was not in the attachment, and `56e998c` is not in this clone. 17 files, 147 insertions and 48 deletions (195 changed lines), each file within its cap. No Change Notice. `main` was not committed to. This chat uploads `step-23-recipe-caps-r1-chatB.bundle` and `HAND-BACK-step-23-recipe-caps-r1-chatB.md`. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- H3 still allows a throwing getter on a direct project-reader call. The two BTF presets still hand-copy their defaults, and `historyBytes` and `bytes` still share the 16 MiB ceiling.

## Kit files used
- The step paste was supplied as an attachment. It has no `handoff/steps/step-23-recipe-caps.md` in this clone, and the header line that names the base SHA was not in it.
