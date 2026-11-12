# Hand-back step-22-document-caps r1
Step file: handoff/steps/step-22-document-caps.md
Base commit: 2f7ec00f63a2a131259fcc1b5f21ba4ac37f5fe1     Head commit: 2727c2398399b159d3deefd6ec7ab28631dd60de     Branch: step/step-22-document-caps-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/btf-adapters/src/index.ts
M	src/btf-adapters/src/levels.ts
M	src/btf-adapters/src/stage-limits.ts
M	src/core/log/log.ts
M	src/core/plain.ts
M	src/project/read/index.ts
A	src/project/read/limits.ts
M	src/project/read/manifest.ts
M	src/project/read/map.ts
M	src/project/read/placements.ts
M	src/project/read/stage.ts
M	src/rules/levels/index.ts
M	src/rules/levels/levels.ts
M	src/rules/levels/types.ts
M	src/runtime/input/gestures.ts
M	src/sim/world.ts
M	tests/project/door-guard.test.ts
A	tests/sim/doc-limits.test.ts
M	tests/sim/exploit-docs.test.ts
M	tests/sim/hard-limits.test.ts

## Green
npm test: 498/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Caps are checked in this order. `readMap`: limits, then kind and shape, then `cols` before `rows`, then the object count before the edge count, then the lists (a footprint side over `footprint` is `bad field objects`), then one walk. `readStage`: limits, then kind, shape and `mapRef`, then list lengths (`neutrals` before `playerSpawns`, then pool spots, then waves), then the fields (a uint32 seed; a wave over `waveUnits` or turn-0 units over `turn0` is `bad field enemyPool`), then the walk. `readManifest`: limits, the base checks, the walk. `tooMany` reads only `.length`, so a 1e9 liar is refused with no item read.
- The three log doors copy the caller's `MatchLimits` once (`plainCopy` at depth 1; `DEFAULT_MATCH_LIMITS` is used as is) and run `withinCeilings` on that copy. A throwing limits object is `null` from `readAction`, `{ ok: false, error: "bad limits" }` from `parseLog`, and `RangeError("createLog: limits must be whole numbers from 1 to their ceilings")` from `createLog`. `createLog` copies the header once, so the live seed is read once; `-0` is stored as `0`. A counted limits object is read 5 times, a counted header 4 times, a counted `BTF_STAGE_LIMITS` 11 times. `plainCopy` clamps `nodes` with `const` (eslint `prefer-const`; the step text says `let`) to `PLAIN_NODES`. A gesture-options copy that fails becomes `{}`, so the live object is never read.
- After a map, stage or manifest is built, `unfit` walks the read document and names the first over-long string or over-size number by its top-level key (`over cap text <key>`, `over cap number <key>`). The stage `seed` is left out of that walk, so a uint32 above 2³¹−1 still reads; anything else is `bad field seed` before the walk. A missing document-limit field means the default. A present `null` is not a whole number, so the reader throws instead of filling the default.
- The two exploit-docs smoke lines move only for the int32 rule: stage-fixed 516 accepted / 1,484 refused and stage-weighted 547 / 1,453, findings 0. The 500-try pin in the same file moves with them, 157/343 to 138/362. `npm run sim` is unchanged: 48/2 `afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75` and 22/28 `b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`.
- `resolvePlacements` keeps at most `notices` notices and then one `{ code: "noticesCapped", message: "and N more" }`. `createWorld` passes `stageLimits` into `readManifest` and `readMap`, and `stageLimits.notices` into `resolvePlacements`. Level caps run only after the existing rules check, so a bad XP number still says `bad rules or pools`. `BTF_LEVEL_LIMITS` is its own frozen copy of `DEFAULT_LEVEL_LIMITS`. `BTF_STAGE_LIMITS` is not frozen, as at the base.
- The diff is 211 insertions and 44 deletions (255 changed lines) on the 20 named files, each within its cap. No Change Notice. `main` was not committed to. The branch starts at `2f7ec00`, not at the kit commit. This chat uploads `step-22-document-caps-r1-chatB.bundle` and `HAND-BACK-step-22-document-caps-r1-chatB.md`. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- Step 23 should add the recipe caps in this same shape (runs, points, frame overrides, the recipe document byte cap, 256 notices per recipe read) and SE-01 verify C1–C3.

## Kit files used
- handoff/steps/step-22-document-caps.md (kit commit bc96fdc on origin/main; not in this branch) eca20cedcc4d850969cc29df3dd4e7623c3fd53f89675518424b3e59a7cdbc78
